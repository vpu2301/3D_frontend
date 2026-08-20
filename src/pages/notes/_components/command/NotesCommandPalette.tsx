/**
 * The command palette — one entry point to everything in /notes.
 *
 * It renders the registry in `_lib/commands.ts` and adds nothing of its own.
 * That constraint is the point: if the palette were allowed its own actions it
 * would become a second, competing definition of what the module can do, and
 * the shortcut sheet built from the registry would start lying.
 *
 * It opens on notes, not on commands. `Cmd+K`, three letters, Enter is the quick
 * switcher, which means there is no second shortcut to learn for the thing
 * people do fifty times a day. Commands sit underneath and fuzzy-match on the
 * same query.
 *
 * Sub-modes (`move`, `tag`, `notebooks`, `tags`, `search`) are how a command
 * that needs an argument asks for it without a dialog — Backspace on an empty
 * query returns to the root list, so nothing is a dead end.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  CircleCheck,
  CornerDownLeft,
  FileText,
  Folder,
  Hash,
  StickyNote,
} from 'lucide-react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { useNotesTags } from '@/pages/notes/_hooks/use-notes-tags';
import { useOutcomesStore } from '@/pages/notes/_hooks/use-outcomes-store';
import { useSavedViewsStore } from '@/pages/notes/_hooks/use-saved-views-store';
import { useCommandContext } from '@/pages/notes/_hooks/use-notes-commands';
import {
  GROUP_LABELS,
  NOTE_COMMANDS,
  UNPIN_ICON,
  formatShortcut,
  fuzzyScore,
  type CommandGroup as GroupId,
  type NoteCommand,
  type PaletteMode,
} from '@/pages/notes/_lib/commands';
import { deriveTitle } from '@/pages/notes/_lib/backlinks';
import { formatDue, ownerLabel } from '@/pages/notes/_lib/outcomes';
import type { Note } from '@/pages/notes/_lib/types';
import { notesApi, type Matter, type Outcome } from '@/pages/notes/_lib/apiClient';

/** How many notes the root list offers before the user has typed anything. */
const RECENT_LIMIT = 7;
/** Cap on matched notes, so a one-letter query cannot render 5 000 rows. */
const MATCH_LIMIT = 25;
const SEARCH_DEBOUNCE_MS = 220;

const PLACEHOLDER: Record<PaletteMode, string> = {
  root: 'Search notes, or type a command…',
  notes: 'Jump to a note…',
  notebooks: 'Go to a notebook…',
  tags: 'Go to a tag…',
  matters: 'Open a matter…',
  views: 'Open a saved view…',
  move: 'Move this note to…',
  tag: 'Add a tag, then press Enter…',
};

const BREADCRUMB: Partial<Record<PaletteMode, string>> = {
  notes: 'Notes',
  notebooks: 'Notebooks',
  tags: 'Tags',
  matters: 'Matters',
  views: 'Saved views',
  move: 'Move to notebook',
  tag: 'Add tag',
};

export default function NotesCommandPalette() {
  const open = useNotesUiStore((s) => s.paletteOpen);
  const mode = useNotesUiStore((s) => s.paletteMode);
  const openPalette = useNotesUiStore((s) => s.openPalette);
  const closePalette = useNotesUiStore((s) => s.closePalette);
  const setMode = useNotesUiStore((s) => s.setPaletteMode);

  const notesMap = useNotesStore((s) => s.notes);
  const { tags } = useNotesTags();
  const outcomesById = useOutcomesStore((s) => s.byId);
  const savedViews = useSavedViewsStore((s) => s.views);
  const loadViews = useSavedViewsStore((s) => s.load);
  const [matters, setMatters] = useState<Matter[]>([]);
  const setPendingSource = useNotesUiStore((s) => s.setPendingSourceQuote);
  const ctx = useCommandContext();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Past this many characters the palette stops being a switcher.
   *
   * Nobody types eighteen characters to jump to a note they can see in the
   * list — at that length they are describing something they half-remember, and
   * the full search is what answers that. So the "search everything" row is
   * promoted to the top and preselected, and the next Enter goes there. The
   * page is not yanked out from under a half-typed word; the user's next
   * keystroke takes them, which is what "switches to full search" means from
   * the chair.
   */
  const FULL_SEARCH_AT = 15;

  /** Hand the typed fragment to the one search page, caret and all. */
  const goToFullSearch = useCallback(() => {
    const q = query.trim();
    closePalette();
    ctx.navigate(q ? `/notes/search?q=${encodeURIComponent(q)}` : '/notes/search');
  }, [query, closePalette, ctx]);

  /**
   * The second press of Cmd+K.
   *
   * With something typed it means "I am not switching, I am searching" and hands
   * the query to the full search page (FE-3 §1). With nothing typed it means
   * "I opened this by accident" and closes. Opening is the registry's
   * `view.palette`, bound by the global handler — which stands down while the
   * palette is open, so this is the only listener that can answer.
   */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (query.trim()) goToFullSearch();
        else closePalette();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, closePalette, query, goToFullSearch]);

  // Matters and views are small lists the palette can hold; both are fetched
  // once the palette is first opened rather than on every keystroke.
  useEffect(() => {
    if (!open) return;
    void loadViews();
    notesApi
      .matters()
      .then(setMatters)
      .catch(() => setMatters([]));
  }, [open, loadViews]);

  // A new mode is a new question; carrying the old query into it would filter
  // the notebook list by whatever the user typed to find a command.
  useEffect(() => {
    setQuery('');
  }, [mode, open]);

  /**
   * The client-side index: id, lower-cased title and tags, built once per notes
   * map. Fuzzy-matching runs over this rather than over the note objects, so a
   * keystroke touches a flat array of strings instead of re-deriving titles.
   */
  const index = useMemo(
    () =>
      Object.values(notesMap)
        .filter((note) => !note.trashed)
        .map((note) => ({
          note,
          haystack: `${deriveTitle(note)} ${note.tags.join(' ')}`,
        }))
        .sort((a, b) => b.note.updatedAt - a.note.updatedAt),
    [notesMap],
  );

  const noteMatches = useMemo(() => {
    if (!query) return index.slice(0, RECENT_LIMIT).map((entry) => entry.note);
    return index
      .map((entry) => ({ note: entry.note, score: fuzzyScore(entry.haystack, query) }))
      .filter((row): row is { note: Note; score: number } => row.score !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, MATCH_LIMIT)
      .map((row) => row.note);
  }, [index, query]);

  /**
   * Obligations are searchable in the same box as notes, because "open müller"
   * is a question about a task, not about a document. Matching runs over the
   * open outcomes already held for the list badges — one query, two kinds of
   * answer, no second shortcut.
   */
  const outcomeMatches = useMemo(() => {
    if (!query) return [];
    return Object.values(outcomesById)
      .filter((outcome) => outcome.status === 'open')
      .map((outcome) => ({
        outcome,
        score: fuzzyScore(`${outcome.text} ${outcome.owedBy ?? ''} ${outcome.owedTo ?? ''}`, query),
      }))
      .filter((row): row is { outcome: Outcome; score: number } => row.score !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((row) => row.outcome);
  }, [outcomesById, query]);

  const commandMatches = useMemo(() => {
    const available = NOTE_COMMANDS.filter((c) => !c.enabled || c.enabled(ctx));
    if (!query) return available;
    return available
      .map((command) => ({
        command,
        score: fuzzyScore(`${command.label} ${(command.keywords ?? []).join(' ')}`, query),
      }))
      .filter((row): row is { command: NoteCommand; score: number } => row.score !== null)
      .sort((a, b) => b.score - a.score)
      .map((row) => row.command);
  }, [ctx, query]);

  const openOutcome = (outcome: Outcome) => {
    closePalette();
    // Jump to the sentence, not just the note — the point of an obligation
    // search is to land on the thing that produced it.
    if (outcome.anchor?.quote && outcome.anchor.state !== 'orphaned') {
      setPendingSource(outcome.anchor.quote);
    }
    ctx.ui.setSelectedNoteId(outcome.noteId);
    ctx.navigate(`/notes/${outcome.noteId}`);
  };

  const openNote = (note: Note) => {
    closePalette();
    ctx.ui.setSelectedNoteId(note.id);
    ctx.navigate(`/notes/${note.id}`);
  };

  const runCommand = (command: NoteCommand) => {
    // The command decides whether it closes the palette: `note.tag` and
    // `note.move` stay open because they are about to ask a second question.
    void command.run(ctx);
  };

  /** Backspace on an empty query steps back out of a sub-mode. */
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && query === '' && mode !== 'root') {
      event.preventDefault();
      setMode('root');
    }
  };

  const grouped = useMemo(() => {
    const groups = new Map<GroupId, NoteCommand[]>();
    for (const command of commandMatches) {
      const list = groups.get(command.group) ?? [];
      list.push(command);
      groups.set(command.group, list);
    }
    return [...groups.entries()];
  }, [commandMatches]);

  const showNotes = mode === 'root' || mode === 'notes';
  const listedNotes = noteMatches;

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? openPalette(mode) : closePalette())}>
      <DialogContent
        className="plat overflow-hidden rounded-[14px] border-[var(--line)] p-0 shadow-lg sm:max-w-xl"
        style={{ background: 'var(--paper)' }}
        aria-describedby={undefined}
      >
        {/* Radix requires a title on every dialog; the palette shows its own
            chrome instead, so this one is for screen readers only. */}
        <DialogTitle className="sr-only">Command palette</DialogTitle>

        <Command
          shouldFilter={false}
          loop
          label="Notes commands"
          onKeyDown={onKeyDown}
          className="bg-transparent [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.22em] [&_[cmdk-group-heading]]:text-[var(--text-5)] [&_[cmdk-group]]:px-0 [&_[cmdk-item]]:rounded-none [&_[cmdk-item]]:border-b [&_[cmdk-item]]:border-[var(--line-soft)] [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]]:text-[13.5px] [&_[cmdk-item]]:text-[var(--text-2)] [&_[cmdk-item][data-selected=true]]:bg-[rgba(20,22,26,0.06)] [&_[cmdk-item][data-selected=true]]:text-[var(--ink)]"
        >
          {BREADCRUMB[mode] && (
            <button
              type="button"
              data-command-exempt="palette chrome — steps back to the root list, not an action"
              onClick={() => setMode('root')}
              className="flex w-full items-center gap-1.5 border-b border-[var(--line-soft)] px-3 py-1.5 text-left text-[11px] font-medium text-[var(--text-4)] transition-colors hover:text-[var(--ink)]"
            >
              <ArrowLeft className="h-3 w-3" /> {BREADCRUMB[mode]}
              <span className="ml-auto text-[var(--text-5)]">Backspace to go back</span>
            </button>
          )}

          <CommandInput
            ref={inputRef}
            value={query}
            onValueChange={setQuery}
            placeholder={PLACEHOLDER[mode]}
          />

          <CommandList className="max-h-[60vh]">
            {mode === 'tag' ? (
              <TagEntry
                query={query}
                onSubmit={(tag) => {
                  if (!ctx.note) return;
                  void ctx.actions.addTag(ctx.note.id, tag);
                  closePalette();
                }}
              />
            ) : (
              <>
                <CommandEmpty>Nothing matches that.</CommandEmpty>

                {mode === 'move' && (
                  <CommandGroup heading="Notebooks">
                    <CommandItem
                      value="no-notebook"
                      onSelect={() => {
                        if (ctx.note) void ctx.actions.moveToNotebook(ctx.note.id, null);
                        closePalette();
                      }}
                    >
                      <Folder className="mr-2 h-4 w-4" style={{ color: 'var(--text-4)' }} /> No notebook
                    </CommandItem>
                    {ctx.notebooks
                      .filter((nb) => fuzzyScore(nb.name, query) !== null)
                      .map((nb) => (
                        <CommandItem
                          key={nb.id}
                          value={`move-${nb.id}`}
                          onSelect={() => {
                            if (ctx.note) void ctx.actions.moveToNotebook(ctx.note.id, nb.id);
                            closePalette();
                          }}
                        >
                          <Folder className="mr-2 h-4 w-4" style={{ color: nb.color }} />
                          {nb.name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {mode === 'notebooks' && (
                  <CommandGroup heading="Notebooks">
                    {ctx.notebooks
                      .filter((nb) => fuzzyScore(nb.name, query) !== null)
                      .map((nb) => (
                        <CommandItem
                          key={nb.id}
                          value={`go-nb-${nb.id}`}
                          onSelect={() => {
                            closePalette();
                            ctx.navigate(`/notes/notebook/${nb.id}`);
                          }}
                        >
                          <Folder className="mr-2 h-4 w-4" style={{ color: nb.color }} />
                          {nb.name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {mode === 'matters' && (
                  <CommandGroup heading="Matters">
                    {matters
                      .filter((matter) => fuzzyScore(matter.label, query) !== null)
                      .map((matter) => (
                        <CommandItem
                          key={matter.key}
                          value={`matter-${matter.key}`}
                          onSelect={() => {
                            closePalette();
                            ctx.navigate(`/notes/matter/${encodeURIComponent(matter.key)}`);
                          }}
                        >
                          <Briefcase className="mr-2 h-4 w-4" style={{ color: 'var(--text-4)' }} />
                          {matter.label}
                          <CommandShortcut>{matter.openTasks} open</CommandShortcut>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {mode === 'views' && (
                  <CommandGroup heading="Saved views">
                    {savedViews
                      .filter((view) => fuzzyScore(view.name, query) !== null)
                      .map((view) => (
                        <CommandItem
                          key={view.id}
                          value={`view-${view.id}`}
                          onSelect={() => {
                            closePalette();
                            ctx.navigate(`/notes/view/${view.id}`);
                          }}
                        >
                          <Bookmark className="mr-2 h-4 w-4" style={{ color: 'var(--text-4)' }} />
                          {view.name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {mode === 'tags' && (
                  <CommandGroup heading="Tags">
                    {tags
                      .filter((t) => fuzzyScore(t.name, query) !== null)
                      .map((t) => (
                        <CommandItem
                          key={t.name}
                          value={`go-tag-${t.name}`}
                          onSelect={() => {
                            closePalette();
                            ctx.navigate(`/notes/tag/${encodeURIComponent(t.name)}`);
                          }}
                        >
                          <Hash className="mr-2 h-4 w-4" style={{ color: 'var(--text-4)' }} />
                          {t.name}
                          <CommandShortcut>{t.count}</CommandShortcut>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {mode === 'root' && query.trim().length > 0 && (
                  <CommandGroup heading={query.length >= FULL_SEARCH_AT ? 'Search' : undefined}>
                    <CommandItem value="full-search" onSelect={goToFullSearch}>
                      <FileText className="mr-2 h-4 w-4" style={{ color: 'var(--text-4)' }} />
                      Search every note for “{query.trim()}”
                      <CommandShortcut>{formatShortcut('mod+k')}</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                )}

                {showNotes && listedNotes.length > 0 && (
                  <CommandGroup heading={query ? 'Notes' : 'Recent notes'}>
                    {listedNotes.map((note) => (
                      <CommandItem
                        key={note.id}
                        value={`note-${note.id}`}
                        onSelect={() => openNote(note)}
                      >
                        <StickyNote className="mr-2 h-4 w-4" style={{ color: 'var(--text-4)' }} />
                        <span className="truncate">{deriveTitle(note)}</span>
                        {note.snippet && (
                          <span className="ml-2 truncate text-xs text-[var(--text-5)]">
                            {note.snippet}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {mode === 'root' && outcomeMatches.length > 0 && (
                  <CommandGroup heading="Open items">
                    {outcomeMatches.map((outcome) => (
                      <CommandItem
                        key={outcome.id}
                        value={`outcome-${outcome.id}`}
                        onSelect={() => openOutcome(outcome)}
                      >
                        <CircleCheck className="mr-2 h-4 w-4" style={{ color: 'var(--text-4)' }} />
                        <span className="truncate">{outcome.text}</span>
                        <span className="ml-2 shrink-0 text-xs text-[var(--text-5)]">
                          {[outcome.owedBy && ownerLabel(outcome.owedBy), formatDue(outcome)]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {mode === 'root' &&
                  grouped.map(([group, commands]) => (
                    <CommandGroup key={group} heading={GROUP_LABELS[group]}>
                      {commands.map((command) => {
                        const Icon =
                          command.id === 'note.pin' && ctx.note?.pinned ? UNPIN_ICON : command.icon;
                        return (
                          <CommandItem
                            key={command.id}
                            value={command.id}
                            onSelect={() => runCommand(command)}
                          >
                            <Icon className="mr-2 h-4 w-4" style={{ color: 'var(--text-4)' }} />
                            {command.label}
                            {command.shortcut && (
                              <CommandShortcut>{formatShortcut(command.shortcut)}</CommandShortcut>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  ))}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

/**
 * The `tag` sub-mode. A free-text entry rather than a list, because the useful
 * case is a tag that does not exist yet — offering only existing tags would turn
 * "add a tag" into "pick from what you already used".
 */
function TagEntry({ query, onSubmit }: { query: string; onSubmit: (tag: string) => void }) {
  const normalised = query.trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9-]/g, '-');
  return (
    <div className="px-3 py-4">
      {normalised ? (
        <CommandItem value="add-tag" onSelect={() => onSubmit(normalised)}>
          <Hash className="mr-2 h-4 w-4" style={{ color: 'var(--text-4)' }} />
          Add <span className="font-medium">#{normalised}</span>
          <CommandShortcut>
            <CornerDownLeft className="h-3 w-3" />
          </CommandShortcut>
        </CommandItem>
      ) : (
        <p className="text-xs text-[var(--text-4)]">Type the tag name.</p>
      )}
    </div>
  );
}
