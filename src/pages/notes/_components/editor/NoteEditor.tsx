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
import { useDocsSettingsStore } from '@/pages/docs/_hooks/use-docs-settings-store';
import { suggestTags, configureMockAi } from '@/pages/docs/_lib/mockAi';
import { GhostText } from '@/pages/docs/_lib/extensions/ghostText';
import { WikiLink } from '@/pages/notes/_lib/extensions/wikiLink';
import { InlineTag } from '@/pages/notes/_lib/extensions/inlineTag';
import { ReminderNode } from '@/pages/notes/_lib/extensions/reminder';
import type { Note } from '@/pages/notes/_lib/types';
import { deriveTitle, deriveFullText } from '@/pages/notes/_lib/backlinks';

import NoteEditorTopBar from './NoteEditorTopBar';
import NoteSuggestedTags from './NoteSuggestedTags';
import NoteTagsRow from './NoteTagsRow';
import NoteRemindersRow from './NoteRemindersRow';
import NoteBacklinksPanel from './NoteBacklinksPanel';
import WikiLinkAutocomplete, { type WikiTriggerState } from './WikiLinkAutocomplete';
import NoteBubbleMenu from './NoteBubbleMenu';
import NoteSlashMenu, { type SlashState } from './NoteSlashMenu';
import { cn } from '@/lib/utils';

const lowlight = createLowlight(common);

interface Props {
  noteId: string;
}

const SAVE_DEBOUNCE_MS = 300;
const TAG_SUGGEST_DEBOUNCE_MS = 1500;

export default function NoteEditor({ noteId }: Props) {
  const note = useNotesStore((s) => s.notes[noteId]);
  const saveContent = useNotesStore((s) => s.saveContent);
  const setSuggestedTags = useNotesStore((s) => s.setSuggestedTags);
  const settings = useDocsSettingsStore();

  const [wikiTrigger, setWikiTrigger] = useState<WikiTriggerState | null>(null);
  const [slashState, setSlashState] = useState<SlashState | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const saveTimer = useRef<number | null>(null);
  const tagTimer = useRef<number | null>(null);

  useEffect(() => {
    configureMockAi({ failureRate: settings.mockFailureRate });
  }, [settings.mockFailureRate]);

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
        scheduleSave(ed.getJSON());
        scheduleTagSuggestions(ed);
      },
    },
    [note?.id],
  );

  const scheduleSave = useCallback(
    (json: any) => {
      if (!note) return;
      setSaveStatus('saving');
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(async () => {
        try {
          await saveContent(note.id, json);
          setSaveStatus('saved');
        } catch {
          setSaveStatus('error');
        }
      }, SAVE_DEBOUNCE_MS);
    },
    [note, saveContent],
  );

  const scheduleTagSuggestions = useCallback(
    (ed: any) => {
      if (!note) return;
      if (tagTimer.current) window.clearTimeout(tagTimer.current);
      tagTimer.current = window.setTimeout(async () => {
        try {
          const text = deriveFullText({ ...note, content: ed.getJSON() } as Note);
          if (text.length < 40) return;
          const suggested = await suggestTags(text, note.tags);
          setSuggestedTags(note.id, suggested);
        } catch {
          /* mock failure — silently skip */
        }
      }, TAG_SUGGEST_DEBOUNCE_MS);
    },
    [note, setSuggestedTags],
  );

  // ----- Wiki-link trigger ([[) ---------------------------------------------
  useEffect(() => {
    if (!editor) return;
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
  useEffect(() => {
    if (!editor) return;
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

  if (!note) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
        Select a note to start writing.
      </div>
    );
  }

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

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      <NoteEditorTopBar note={note} editor={editor} saveStatus={saveStatus} />
      <div className="flex-1 overflow-y-auto">
        <div className={cn('mx-auto w-full', containerWidth)}>
          <NoteSuggestedTags note={note} />
          <NoteTagsRow note={note} />
          <NoteRemindersRow note={note} />
          {editor && (
            <>
              <NoteBubbleMenu editor={editor} />
              <EditorContent editor={editor} />
            </>
          )}
          <NoteBacklinksPanel note={note} />
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
          onClose={() => setSlashState(null)}
        />
      )}
    </div>
  );
}
