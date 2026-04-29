import { useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Plus,
  StickyNote,
  Sun,
  Sparkles,
  Folder,
  Hash,
  Network,
  Trash2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  useNotesStore,
  selectNotesMap,
  SMART_VIEWS,
  deriveTags,
} from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { cn } from '@/lib/utils';

interface NavRowProps {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconStyle?: React.CSSProperties;
  label: string;
  count?: number;
  active?: boolean;
  onClick: () => void;
}

function NavRow({ icon: Icon, iconStyle, label, count, active, onClick }: NavRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-r-full py-2 pl-5 pr-4 text-left text-sm transition-colors',
        active ? 'bg-[#dde9f4] text-gray-900' : 'text-gray-700 hover:bg-gray-100',
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-gray-500" style={iconStyle} />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="shrink-0 text-[10px] font-medium leading-tight text-gray-500">
          {count}
        </span>
      )}
    </button>
  );
}

export default function NotesMiniRail() {
  const notesMap = useNotesStore(selectNotesMap);
  const notebooks = useNotesStore((s) => s.notebooks);
  const createNote = useNotesStore((s) => s.createNote);
  const ensureDailyNote = useNotesStore((s) => s.ensureDailyNote);
  const { smartViewId, setSmartViewId, setFilter, setSelectedNoteId } = useNotesUiStore();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id?: string; tag?: string }>();

  const [smartOpen, setSmartOpen] = useState(true);
  const [notebooksOpen, setNotebooksOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(false);

  const notes = useMemo(() => Object.values(notesMap), [notesMap]);
  const tags = useMemo(() => deriveTags(notes), [notes]);

  const totalCount = notes.filter((n) => !n.trashed).length;
  const trashedCount = notes.filter((n) => n.trashed).length;

  const path = location.pathname;
  const isNotebookRoute = path.startsWith('/notes/notebook/');
  const isTagRoute = path.startsWith('/notes/tag/');
  const isAllRoute =
    path === '/notes' ||
    (path.startsWith('/notes/') && !isNotebookRoute && !isTagRoute &&
      path !== '/notes/daily' && path !== '/notes/graph' && path !== '/notes/trash');

  const onNew = async () => {
    const n = await createNote({});
    setSelectedNoteId(n.id);
    navigate(`/notes/${n.id}`);
  };

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

  const goDaily = async () => {
    const n = await ensureDailyNote();
    setSelectedNoteId(n.id);
    navigate(`/notes/${n.id}`);
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-white">
      <div className="px-4 pt-3 pb-4">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#bdd8ec] px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-[#a5c8e0]"
        >
          <Plus className="h-4 w-4" /> Create note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-3">
        <div className="space-y-0.5">
          <NavRow
            icon={StickyNote}
            label="All notes"
            count={totalCount}
            active={isAllRoute && !smartViewId}
            onClick={goAll}
          />
          <NavRow
            icon={Sun}
            label="Today"
            active={path === '/notes/daily'}
            onClick={goDaily}
          />
          <NavRow
            icon={Network}
            label="Graph"
            active={path === '/notes/graph'}
            onClick={() => navigate('/notes/graph')}
          />
        </div>

        <div className="mb-1.5 mt-6 flex items-center justify-between px-5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          <button
            type="button"
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

        <div className="mb-1.5 mt-6 flex items-center justify-between px-5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          <button
            type="button"
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
            <div className="mb-1.5 mt-6 flex items-center justify-between px-5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              <button
                type="button"
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

        <div className="mb-1.5 mt-6 px-5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Fix &amp; manage
        </div>
        <div className="space-y-0.5">
          <NavRow
            icon={Trash2}
            label="Trash"
            count={trashedCount}
            active={path === '/notes/trash'}
            onClick={() => navigate('/notes/trash')}
          />
        </div>
      </div>
    </aside>
  );
}
