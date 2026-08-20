import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Plus,
  Search as SearchIcon,
  StickyNote,
  Sun,
  Sparkles,
  Folder,
  Hash,
  Bookmark,
  Briefcase,
  ListChecks,
  Network,
  Trash2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useNotesStore, selectNotesMap, SMART_VIEWS } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesTags } from '@/pages/notes/_hooks/use-notes-tags';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { useOutcomesStore } from '@/pages/notes/_hooks/use-outcomes-store';
import { useSavedViewsStore } from '@/pages/notes/_hooks/use-saved-views-store';
import { notesApi, type Matter } from '@/pages/notes/_lib/apiClient';
import { useCommandRunner } from '@/pages/notes/_hooks/use-notes-commands';
import NotesNotificationsBell from '@/pages/notes/_components/notifications/NotesNotificationsBell';
import NotesAiSettingsPanel from '@/pages/notes/_components/settings/NotesAiSettingsPanel';
import LocalOnlyIndicator from '@/pages/notes/_components/ai/LocalOnlyIndicator';
import { cn } from '@/lib/utils';

interface NavRowProps {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconStyle?: React.CSSProperties;
  label: string;
  count?: number;
  /**
   * The one alarming number in the module: overdue obligations owed by the user.
   * Rendered separately from `count` because it means "act now", not "there are
   * this many things".
   */
  badge?: number;
  active?: boolean;
  onClick: () => void;
  /** Registry id when this row *is* a command; otherwise why it is not. */
  command?: string;
  exempt?: string;
}

function NavRow({ icon: Icon, iconStyle, label, count, badge, active, onClick, command, exempt }: NavRowProps) {
  return (
    <button
      type="button"
      data-command={command}
      data-command-exempt={command ? undefined : (exempt ?? 'navigation row for one notebook, tag or smart view — the command form is nav.notebooks / nav.tags')}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-[10px] py-2 px-3 text-left text-[13.5px] transition-colors',
        active
          ? 'bg-[rgba(20,22,26,0.07)] font-semibold text-[var(--ink)]'
          : 'font-medium text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
      )}
    >
      <Icon
        className="h-4 w-4 shrink-0"
        style={{ color: active ? 'var(--ink)' : 'var(--text-4)', ...iconStyle }}
      />
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white"
          style={{ background: 'var(--bad-fg)' }}
          aria-label={`${badge} overdue`}
        >
          {badge}
        </span>
      )}
      {count !== undefined && count > 0 && (
        <span
          className="shrink-0 text-[10px] font-medium leading-tight"
          style={{ color: 'var(--text-5)' }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default function NotesMiniRail() {
  const notesMap = useNotesStore(selectNotesMap);
  const notebooks = useNotesStore((s) => s.notebooks);
  const { smartViewId, setSmartViewId, setFilter, settingsOpen, setSettingsOpen } =
    useNotesUiStore();
  const run = useCommandRunner();
  // The badge is the server's number. It is the single most valuable pixel in
  // the module — the reason someone opens the app when they were not planning
  // to — so it is never a tally over whatever rows happen to be loaded.
  const summary = useOutcomesStore((s) => s.summary);
  const refreshSummary = useOutcomesStore((s) => s.refreshSummary);

  useEffect(() => {
    void refreshSummary();
  }, [refreshSummary]);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id?: string; tag?: string }>();

  /**
   * Matters, from the server. There is nothing to configure: BE-2 promotes any
   * tag or notebook with three notes and one obligation, so a firm that only
   * ever used tags gets client pages on the day they upgrade (S13).
   */
  const [matters, setMatters] = useState<Matter[]>([]);
  const views = useSavedViewsStore((s) => s.views);
  const loadViews = useSavedViewsStore((s) => s.load);

  useEffect(() => {
    let cancelled = false;
    notesApi
      .matters()
      .then((rows) => {
        if (!cancelled) setMatters(rows);
      })
      .catch(() => {
        // No matters section rather than a broken sidebar.
        if (!cancelled) setMatters([]);
      });
    void loadViews();
    return () => {
      cancelled = true;
    };
  }, [loadViews]);

  const [mattersOpen, setMattersOpen] = useState(true);
  const [viewsOpen, setViewsOpen] = useState(true);
  const [smartOpen, setSmartOpen] = useState(true);
  const [notebooksOpen, setNotebooksOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(false);

  const notes = useMemo(() => Object.values(notesMap), [notesMap]);
  // Counts come from `GET /v1/tags`, which counts the whole corpus rather than
  // whatever this session happens to have loaded.
  const { tags } = useNotesTags();

  const totalCount = notes.filter((n) => !n.trashed).length;
  const trashedCount = notes.filter((n) => n.trashed).length;

  const path = location.pathname;
  const isNotebookRoute = path.startsWith('/notes/notebook/');
  const isTagRoute = path.startsWith('/notes/tag/');
  const isAllRoute =
    path === '/notes' ||
    (path.startsWith('/notes/') && !isNotebookRoute && !isTagRoute &&
      path !== '/notes/daily' && path !== '/notes/graph' && path !== '/notes/trash' &&
      path !== '/notes/open' && path !== '/notes/search' &&
      !path.startsWith('/notes/matter/') && !path.startsWith('/notes/view/'));

  const goAll = () => {
    setSmartViewId(null);
    setFilter({});
    navigate('/notes');
  };

  const goSmart = (id: string) => {
    setSmartViewId(id);
    setFilter({});
    navigate('/notes');
  };

  const goNotebook = (id: string) => {
    setSmartViewId(null);
    setFilter({});
    navigate(`/notes/notebook/${id}`);
  };

  const goTag = (tag: string) => {
    setSmartViewId(null);
    setFilter({});
    navigate(`/notes/tag/${encodeURIComponent(tag)}`);
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-[var(--line-soft)]">
      <div className="px-3 pt-3 pb-4">
        <button
          type="button"
          data-command="note.new"
          onClick={() => run('note.new')}
          className="plat-btn !h-9 w-full justify-center"
        >
          <Plus className="h-4 w-4" /> Create note
        </button>

        {/*
          The local-only posture, permanently on screen (§6). It renders nothing
          unless the server confirms it, so on a hosted tenant this row costs
          nothing — and on an on-premise one it is the first thing a partner
          sees every morning, which is exactly where that claim belongs.
        */}
        <div className="mt-2 flex justify-center">
          <LocalOnlyIndicator />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-0.5">
          <NavRow
            icon={StickyNote}
            label="All notes"
            count={totalCount}
            active={isAllRoute && !smartViewId}
            command="nav.all"
            onClick={goAll}
          />
          <NavRow
            icon={Sun}
            label="Today"
            active={path === '/notes/daily'}
            command="note.daily"
            onClick={() => run('note.daily')}
          />
          <NavRow
            icon={SearchIcon}
            label="Search"
            active={path === '/notes/search'}
            command="nav.search"
            onClick={() => run('nav.search')}
          />
          <NavRow
            icon={ListChecks}
            label="Open items"
            badge={summary?.mine.overdue}
            count={summary?.mine.open}
            active={path === '/notes/open'}
            command="nav.open-items"
            onClick={() => run('nav.open-items')}
          />
          <NavRow
            icon={Network}
            label="Graph"
            active={path === '/notes/graph'}
            command="nav.graph"
            onClick={() => run('nav.graph')}
          />
        </div>

        {matters.length > 0 && (
          <>
            <div className="plat-eyebrow mb-1.5 mt-6 flex items-center justify-between px-3">
              <button
                type="button"
                data-command-exempt="section disclosure; shows and hides rows, changes nothing"
                onClick={() => setMattersOpen((o) => !o)}
                className="flex items-center gap-1"
              >
                {mattersOpen ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                Matters
              </button>
            </div>
            {mattersOpen && (
              <div className="space-y-0.5">
                {matters.slice(0, 10).map((matter) => (
                  <NavRow
                    key={matter.key}
                    icon={Briefcase}
                    label={matter.label}
                    count={matter.openTasks}
                    active={path === `/notes/matter/${encodeURIComponent(matter.key)}`}
                    exempt="one matter's page; the command form is nav.matters"
                    onClick={() => navigate(`/notes/matter/${encodeURIComponent(matter.key)}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {views.length > 0 && (
          <>
            <div className="plat-eyebrow mb-1.5 mt-6 flex items-center justify-between px-3">
              <button
                type="button"
                data-command-exempt="section disclosure; shows and hides rows, changes nothing"
                onClick={() => setViewsOpen((o) => !o)}
                className="flex items-center gap-1"
              >
                {viewsOpen ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                Views
              </button>
            </div>
            {viewsOpen && (
              <div className="space-y-0.5">
                {views.map((view) => (
                  <NavRow
                    key={view.id}
                    icon={Bookmark}
                    label={view.name}
                    active={path === `/notes/view/${view.id}`}
                    exempt="one saved view's results; the command form is nav.views"
                    onClick={() => navigate(`/notes/view/${view.id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="plat-eyebrow mb-1.5 mt-6 flex items-center justify-between px-3">
          <button
            type="button"
            data-command-exempt="section disclosure; shows and hides rows, changes nothing"
            onClick={() => setSmartOpen((o) => !o)}
            className="flex items-center gap-1"
          >
            {smartOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            Smart views
          </button>
        </div>
        {smartOpen && (
          <div className="space-y-0.5">
            {SMART_VIEWS.map((v) => {
              const count = notes.filter((n) => !n.trashed && v.predicate(n)).length;
              return (
                <NavRow
                  key={v.id}
                  icon={Sparkles}
                  label={v.name}
                  count={count}
                  active={smartViewId === v.id}
                  onClick={() => goSmart(v.id)}
                />
              );
            })}
          </div>
        )}

        <div className="plat-eyebrow mb-1.5 mt-6 flex items-center justify-between px-3">
          <button
            type="button"
            data-command-exempt="section disclosure; shows and hides rows, changes nothing"
            onClick={() => setNotebooksOpen((o) => !o)}
            className="flex items-center gap-1"
          >
            {notebooksOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            Notebooks
          </button>
        </div>
        {notebooksOpen && (
          <div className="space-y-0.5">
            {Object.values(notebooks)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((nb) => {
                const count = notes.filter((n) => !n.trashed && n.notebookId === nb.id).length;
                return (
                  <NavRow
                    key={nb.id}
                    icon={Folder}
                    iconStyle={{ color: nb.color }}
                    label={nb.name}
                    count={count}
                    active={isNotebookRoute && params.id === nb.id}
                    onClick={() => goNotebook(nb.id)}
                  />
                );
              })}
          </div>
        )}

        {tags.length > 0 && (
          <>
            <div className="plat-eyebrow mb-1.5 mt-6 flex items-center justify-between px-3">
              <button
                type="button"
                data-command-exempt="section disclosure; shows and hides rows, changes nothing"
                onClick={() => setTagsOpen((o) => !o)}
                className="flex items-center gap-1"
              >
                {tagsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                Tags
              </button>
            </div>
            {tagsOpen && (
              <div className="space-y-0.5">
                {tags.slice(0, 12).map((t) => (
                  <NavRow
                    key={t.name}
                    icon={Hash}
                    label={t.name}
                    count={t.count}
                    active={isTagRoute && params.tag === encodeURIComponent(t.name)}
                    onClick={() => goTag(t.name)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="plat-eyebrow mb-1.5 mt-6 px-3">
          Fix &amp; manage
        </div>
        <div className="space-y-0.5">
          <NotesNotificationsBell />
          <NavRow
            icon={Sparkles}
            label="AI usage"
            command="nav.settings"
            onClick={() => run('nav.settings')}
          />
          <NavRow
            icon={Trash2}
            label="Trash"
            count={trashedCount}
            active={path === '/notes/trash'}
            command="nav.trash"
            onClick={() => run('nav.trash')}
          />
        </div>
      </div>

      <NotesAiSettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
    </aside>
  );
}
