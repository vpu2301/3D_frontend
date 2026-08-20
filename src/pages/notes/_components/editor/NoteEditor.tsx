import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import { common, createLowlight } from 'lowlight';

import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { clearActiveEditor, setActiveEditor } from '@/pages/notes/_lib/editorBridge';
import { useNoteAutosave } from '@/pages/notes/_hooks/use-note-autosave';
import { useOutcomesStore } from '@/pages/notes/_hooks/use-outcomes-store';
import { useDocsSettingsStore } from '@/pages/docs/_hooks/use-docs-settings-store';
import { suggestTags } from '@/pages/notes/_lib/aiClient';
import { GhostText } from '@/pages/docs/_lib/extensions/ghostText';
import { WikiLink } from '@/pages/notes/_lib/extensions/wikiLink';
import { InlineTag } from '@/pages/notes/_lib/extensions/inlineTag';
import { ReminderNode } from '@/pages/notes/_lib/extensions/reminder';
import {
  SourceHighlight,
  scrollToQuote,
  setSourceHighlight,
} from '@/pages/notes/_lib/extensions/sourceHighlight';
import type { Note } from '@/pages/notes/_lib/types';
import { deriveTitle, deriveFullText } from '@/pages/notes/_lib/backlinks';

import NoteEditorTopBar from './NoteEditorTopBar';
import NoteTitleRow from './NoteTitleRow';
import NoteSuggestedTags from './NoteSuggestedTags';
import NoteTagsRow from './NoteTagsRow';
import NoteRemindersRow from './NoteRemindersRow';
import NoteBacklinksPanel from './NoteBacklinksPanel';
import NoteRelatedStrip from './NoteRelatedStrip';
import NoteCarriedForward from './NoteCarriedForward';
import NoteProposalCard from './NoteProposalCard';
import NoteApprovalBanner from '@/pages/notes/_components/ai/NoteApprovalBanner';
import NoteOutcomesSection from './NoteOutcomesSection';
import WikiLinkAutocomplete, { type WikiTriggerState } from './WikiLinkAutocomplete';
import NoteBubbleMenu from './NoteBubbleMenu';
import NoteSlashMenu, { type SlashState } from './NoteSlashMenu';
import { PromptDialog, ReminderDialog } from '@/pages/notes/_components/shared/NotesDialog';
import { cn } from '@/lib/utils';

const lowlight = createLowlight(common);

interface Props {
  noteId: string;
}

const TAG_SUGGEST_DEBOUNCE_MS = 2500;
/** Mirrors the server's `autotag_min_delta_chars` so both gates agree. */
const SUGGEST_DELTA_CHARS = 200;
const MIN_SUGGEST_CHARS = 200;

export default function NoteEditor({ noteId }: Props) {
  const note = useNotesStore((s) => s.notes[noteId]);
  const setSuggestedTags = useNotesStore((s) => s.setSuggestedTags);
  const addReminder = useNotesStore((s) => s.addReminder);
  const setAiSidebarOpen = useNotesUiStore((s) => s.setAiSidebarOpen);
  const reminderOpen = useNotesUiStore((s) => s.reminderOpen);
  const setReminderOpen = useNotesUiStore((s) => s.setReminderOpen);
  const pendingSourceQuote = useNotesUiStore((s) => s.pendingSourceQuote);
  const setPendingSourceQuote = useNotesUiStore((s) => s.setPendingSourceQuote);
  const refreshOutcomes = useOutcomesStore((s) => s.refreshNote);
  const settings = useDocsSettingsStore();

  const [wikiTrigger, setWikiTrigger] = useState<WikiTriggerState | null>(null);
  const [slashState, setSlashState] = useState<SlashState | null>(null);
  const autosave = useNoteAutosave(note?.id ?? null);
  /**
   * Pulled apart on purpose: `autosave`'s *object* identity changes on every
   * confirmed write, because `savedAt` moves. Putting that object in an effect's
   * dependency array is therefore a feedback loop — the flush-on-unmount cleanup
   * below runs *because* a save finished, issues another save, and the next
   * `savedAt` runs it again. Two PATCHes per turn, until the service answers 429
   * (which is exactly what one click used to produce). Each callback is
   * individually stable, so effects depend on those and never on the wrapper.
   */
  const { schedule, flush, retry, status: saveStatus, savedAt } = autosave;
  const noteLoaded = Boolean(note);
  /**
   * Dialogs that used to be `window.prompt`. They live here rather than in the
   * bubble/slash menus that raise them: both of those unmount the moment focus
   * leaves the editor, which is exactly what opening a dialog does.
   */
  const [dialog, setDialog] = useState<'link' | 'image' | null>(null);
  const [linkInitial, setLinkInitial] = useState('');

  const tagTimer = useRef<number | null>(null);
  const lastSuggestLength = useRef(0);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          codeBlock: false,
          heading: { levels: [1, 2, 3] },
        }),
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === 'heading') return `Heading ${node.attrs.level}`;
            return "Start typing — use [[ to link, # to tag, / for blocks";
          },
        }),
        Underline,
        Highlight,
        Typography,
        Link.configure({ openOnClick: false, autolink: true }),
        Image.configure({ inline: false, allowBase64: true }),
        TaskList,
        TaskItem.configure({ nested: true }),
        CodeBlockLowlight.configure({ lowlight }),
        CharacterCount,
        GhostText,
        WikiLink,
        InlineTag,
        ReminderNode,
        SourceHighlight,
      ],
      content: note?.content ?? { type: 'doc', content: [{ type: 'paragraph' }] },
      editorProps: {
        attributes: {
          class:
            'prose prose-sm prose-zinc max-w-none focus:outline-none prose-headings:font-semibold prose-p:my-2 min-h-[40vh] px-10 pb-32 pt-4',
        },
      },
      onUpdate: ({ editor: ed }) => {
        if (!note) return;
        schedule(ed.getJSON());
        scheduleTagSuggestions(ed);
      },
    },
    [note?.id],
  );

  /**
   * Foreground tag suggestions.
   *
   * The server also auto-tags, but that runs as a worker cron every five
   * minutes behind a ten-minute debounce — right for a background sweep, too
   * slow to feel like a response to typing. So the editor still asks directly,
   * and the server's later sweep simply agrees.
   *
   * Every call spends real AI budget now, which the mock did not, so it is
   * gated the way the server gates its own sweep: only once the note has grown
   * by a meaningful amount since the last ask (`autotag_min_delta_chars`).
   */
  const scheduleTagSuggestions = useCallback(
    (ed: any) => {
      if (!note) return;
      if (tagTimer.current) window.clearTimeout(tagTimer.current);
      tagTimer.current = window.setTimeout(async () => {
        const text = deriveFullText({ ...note, content: ed.getJSON() } as Note);
        if (text.length < MIN_SUGGEST_CHARS) return;
        if (text.length - lastSuggestLength.current < SUGGEST_DELTA_CHARS) return;
        lastSuggestLength.current = text.length;
        try {
          const suggested = await suggestTags(text, note.tags);
          setSuggestedTags(note.id, suggested);
        } catch {
          /* Budget, provider or network failure — suggestions are advisory. */
        }
      }, TAG_SUGGEST_DEBOUNCE_MS);
    },
    [note, setSuggestedTags],
  );

  /**
   * A reminder is a real server row, so the node is only inserted once the
   * store confirms it — a node without a `reminderId` would draw a badge for
   * something that never fires.
   */
  const insertReminder = useCallback(
    async (dueAt: number, location?: string) => {
      if (!note || !editor) return;
      try {
        const reminder = await addReminder(note.id, dueAt, location);
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'reminder',
            attrs: { dueAt: reminder.dueAt, reminderId: reminder.id },
          })
          .run();
      } catch {
        /* the store already toasted; no node for a reminder that failed */
      }
    },
    [note, editor, addReminder],
  );

  // Switching notes starts a fresh editing session: the previous note's
  // suggestion baseline must not carry over. (The autosave hook resets its own.)
  useEffect(() => {
    lastSuggestLength.current = 0;
  }, [noteId]);

  /**
   * Publish this editor to everything outside the editor pane — the palette's
   * Cmd+S, Escape and "new note from selection", and the layout's unload
   * handler. Exactly one editor is ever registered.
   */
  useEffect(() => {
    if (!editor || !noteLoaded) return;
    setActiveEditor({
      noteId,
      getJSON: () => editor.getJSON(),
      getSelectedText: () => {
        const { from, to } = editor.state.selection;
        return from === to ? '' : editor.state.doc.textBetween(from, to, '\n', ' ');
      },
      focus: () => editor.commands.focus(),
      blur: () => editor.commands.blur(),
      flush: () => flush(editor.getJSON()),
      // Called from the AI sidebar, i.e. possibly after this editor has been
      // replaced. Reaching for `view` on a destroyed instance throws.
      highlightSource: (quote) => {
        if (!editor.isDestroyed) setSourceHighlight(editor.view, quote);
      },
      scrollToSource: (quote) => (editor.isDestroyed ? false : scrollToQuote(editor.view, quote)),
    });
    return () => clearActiveEditor(noteId);
  }, [editor, noteId, noteLoaded, flush]);

  /**
   * Open Items asked for this note *at* a sentence. The quote was left in the UI
   * store because the editor did not exist when the row was clicked; consume it
   * once and clear it, so a later visit to the same note does not re-scroll.
   */
  useEffect(() => {
    if (!editor || editor.isDestroyed || !pendingSourceQuote) return;
    const found = scrollToQuote(editor.view, pendingSourceQuote);
    setPendingSourceQuote(null);
    if (!found && import.meta.env.DEV) {
      console.warn('[notes] source sentence no longer in the note');
    }
  }, [editor, pendingSourceQuote, setPendingSourceQuote]);

  /**
   * Re-read the note's outcomes shortly after a checkpoint.
   *
   * The server auto-extracts once per version-checkpoint, on the note's first
   * idle period — so the moment a checkpoint lands is the moment proposals may
   * be on their way. Polling twice, widely spaced, is the cheap way to have them
   * waiting when the user looks up; nothing here triggers an extraction itself.
   */
  const noteVersion = note?.version;
  useEffect(() => {
    if (!noteId || noteVersion === undefined) return;
    const timers = [
      window.setTimeout(() => void refreshOutcomes(noteId), 3_000),
      window.setTimeout(() => void refreshOutcomes(noteId), 30_000),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [noteId, noteVersion, refreshOutcomes]);

  useEffect(() => {
    if (!editor) return;
    const onBlur = () => {
      // The rejection is already reflected in the save indicator; this path has
      // no user waiting on it, so it must not become an unhandled rejection.
      void flush(editor.getJSON()).catch(() => undefined);
    };
    editor.on('blur', onBlur);
    return () => {
      editor.off('blur', onBlur);
    };
  }, [editor, flush]);

  // Route change or unmount: the editor is about to go away, so read its
  // content now rather than from the (possibly stale) store copy. The request
  // outlives the component — a client-side route change does not cancel it.
  //
  // `flush`, not `autosave`: this cleanup writes, so anything in its deps that
  // moves when a write lands makes the effect its own trigger. See the note on
  // the destructuring above.
  useEffect(() => {
    return () => {
      if (!editor || editor.isDestroyed) return;
      void flush(editor.getJSON()).catch(() => undefined);
    };
  }, [editor, flush]);

  // ----- Wiki-link trigger ([[) ---------------------------------------------
  //
  // `editor.isDestroyed`, not just `!editor`: `useEditor` tears the instance
  // down and builds a new one whenever `note?.id` changes, and for the render
  // in between it still hands back the dead one. `editor.view` is a proxy that
  // *throws* on the corpse — and with no error boundary above `/notes`, that
  // throw unmounts the whole app and the tab goes white. The replacement
  // instance is a new identity, so this effect re-runs and binds to it.
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const view = editor.view;

    const handler = () => {
      if (!editor) return;
      const sel = editor.state.selection;
      if (!sel.empty) {
        if (wikiTrigger) setWikiTrigger(null);
        return;
      }
      const $from = sel.$from;
      const before = $from.parent.textBetween(0, $from.parentOffset, '\n', ' ');
      const m = before.match(/\[\[([^\[\]]*)$/);
      if (!m) {
        if (wikiTrigger) setWikiTrigger(null);
        return;
      }
      const triggerFrom = sel.from - m[0].length;
      const coords = view.coordsAtPos(sel.from);
      setWikiTrigger({
        triggerFrom,
        query: m[1],
        position: { x: coords.left, y: coords.bottom + 4 },
      });
    };

    const dom = view.dom as HTMLElement;
    dom.addEventListener('input', handler);
    dom.addEventListener('keyup', handler);
    return () => {
      dom.removeEventListener('input', handler);
      dom.removeEventListener('keyup', handler);
    };
  }, [editor, wikiTrigger]);

  // ----- Slash menu trigger (/) ---------------------------------------------
  // Same guard, same reason as the wiki-link trigger above.
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const view = editor.view;

    const onKeyDown = (e: KeyboardEvent) => {
      if (slashState) {
        if (e.key === 'Escape') {
          setSlashState(null);
          return;
        }
        if (e.key === 'Backspace') {
          setTimeout(() => {
            if (!editor) return;
            const pos = editor.state.selection.from;
            if (pos < slashState.triggerFrom) setSlashState(null);
            else {
              const t = editor.state.doc.textBetween(slashState.triggerFrom, pos, '\n', ' ');
              if (!t.startsWith('/')) setSlashState(null);
              else setSlashState((s) => (s ? { ...s, query: t.slice(1) } : s));
            }
          }, 0);
        }
        return;
      }
      if (e.key === '/') {
        setTimeout(() => {
          if (!editor) return;
          const sel = editor.state.selection;
          if (!sel.empty) return;
          const $from = sel.$from;
          const before = $from.parent.textBetween(0, $from.parentOffset, '\n', ' ');
          if (before !== '/' && !/\s\/$/.test(before) && !before.endsWith('\n/')) return;
          const triggerFrom = sel.from - 1;
          const coords = view.coordsAtPos(sel.from);
          setSlashState({
            triggerFrom,
            query: '',
            position: { x: coords.left, y: coords.bottom + 4 },
          });
        }, 0);
      }
    };

    const onInput = () => {
      if (!editor || !slashState) return;
      const pos = editor.state.selection.from;
      if (pos < slashState.triggerFrom) {
        setSlashState(null);
        return;
      }
      const text = editor.state.doc.textBetween(slashState.triggerFrom, pos, '\n', ' ');
      if (!text.startsWith('/')) setSlashState(null);
      else setSlashState((s) => (s ? { ...s, query: text.slice(1) } : s));
    };

    const dom = view.dom as HTMLElement;
    dom.addEventListener('keydown', onKeyDown);
    dom.addEventListener('input', onInput);
    return () => {
      dom.removeEventListener('keydown', onKeyDown);
      dom.removeEventListener('input', onInput);
    };
  }, [editor, slashState]);

  // Declared before the `!note` early return: with notes arriving over HTTP,
  // `note` flips from undefined to defined on a normal render, and a hook after
  // a conditional return would change hook order between those two renders.
  const containerWidth = useMemo(() => {
    switch (settings.pageWidth) {
      case 'narrow':
        return 'max-w-2xl';
      case 'wide':
        return 'max-w-3xl';
      case 'full':
        return 'max-w-4xl';
    }
  }, [settings.pageWidth]);

  if (!note) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm" style={{ color: 'var(--text-4)' }}>
        Select a note to start writing.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <NoteEditorTopBar
        note={note}
        saveStatus={saveStatus}
        savedAt={savedAt}
        onRetrySave={() => void retry()}
        onAskAi={() => setAiSidebarOpen(true)}
      />
      <div className="flex-1 overflow-y-auto bg-[var(--paper)]">
        <div className={cn('mx-auto w-full', containerWidth)}>
          <NoteTitleRow note={note} />
          {/*
            Above everything else on the note: it is the only thing here that is
            about to change the document without the user having typed it.
          */}
          <NoteApprovalBanner noteId={note.id} />
          {/* Only on the daily note, and only when something is actually overdue. */}
          <NoteCarriedForward note={note} />
          <NoteSuggestedTags note={note} />
          <NoteTagsRow note={note} />
          <NoteRemindersRow note={note} />
          {editor && (
            <>
              <NoteBubbleMenu
                editor={editor}
                onEditLink={() => {
                  setLinkInitial((editor.getAttributes('link').href as string) ?? '');
                  setDialog('link');
                }}
              />
              <EditorContent editor={editor} />
            </>
          )}
          {/*
            Proposals sit directly under the body, where the eye lands when the
            writing stops — not in a modal that interrupts and not in a panel
            that is never opened. Confirmed outcomes sit below them, so the
            reading order is "what I found" then "what you kept".
          */}
          <NoteProposalCard note={note} />
          <NoteOutcomesSection note={note} />
          <NoteBacklinksPanel note={note} />
          {/* Last, and collapsed: a suggestion, not part of the record. */}
          <NoteRelatedStrip note={note} />
        </div>
      </div>

      {wikiTrigger && editor && (
        <WikiLinkAutocomplete
          editor={editor}
          state={wikiTrigger}
          onClose={() => setWikiTrigger(null)}
        />
      )}
      {slashState && editor && (
        <NoteSlashMenu
          editor={editor}
          state={slashState}
          onRequestDialog={(kind) => {
            if (kind === 'reminder') {
              setReminderOpen(true);
              return;
            }
            if (kind === 'link') setLinkInitial('');
            setDialog(kind);
          }}
          onClose={() => setSlashState(null)}
        />
      )}

      <PromptDialog
        open={dialog === 'link'}
        onOpenChange={(o) => setDialog(o ? 'link' : null)}
        title={linkInitial ? 'Edit link' : 'Add a link'}
        description="The selected text becomes the link."
        label="URL"
        placeholder="https://example.com"
        initialValue={linkInitial}
        submitLabel={linkInitial ? 'Update link' : 'Add link'}
        validate={(v) => (/^(https?:\/\/|mailto:|\/)/i.test(v) ? null : 'Start with https://, mailto: or /')}
        onSubmit={(url) => {
          if (!editor) return;
          // `/link` runs with nothing selected, where `setLink` has no text to
          // mark — insert the URL as its own linked text instead of silently
          // doing nothing.
          if (editor.state.selection.empty) {
            editor
              .chain()
              .focus()
              .insertContent({
                type: 'text',
                text: url,
                marks: [{ type: 'link', attrs: { href: url } }],
              })
              .run();
            return;
          }
          editor.chain().focus().setLink({ href: url }).run();
        }}
      />
      <PromptDialog
        open={dialog === 'image'}
        onOpenChange={(o) => setDialog(o ? 'image' : null)}
        title="Embed an image"
        description="Paste a link to an image; it is embedded, not uploaded."
        label="Image URL"
        placeholder="https://example.com/photo.png"
        submitLabel="Insert image"
        validate={(v) => (/^(https?:\/\/|data:image\/)/i.test(v) ? null : 'Start with https:// or data:image/')}
        onSubmit={(src) => editor?.chain().focus().setImage({ src }).run()}
      />
      {/* Opened by the `note.reminder` command, from the palette or the top bar. */}
      <ReminderDialog
        open={reminderOpen}
        onOpenChange={setReminderOpen}
        onSubmit={(dueAt, location) => void insertReminder(dueAt, location)}
      />
    </div>
  );
}
