/**
 * Library — the document inventory, organized like Dropbox: groups (folders),
 * external links to where files really live, and per-file access for AI
 * agents and employees.
 *
 * DEMO, badged: memento indexes one flat folder and has no folders/links/ACL
 * (role-based access control is on its roadmap). The organizational layer is
 * persisted locally so the whole workflow is clickable today; ingestion
 * itself is real — files dropped into the documents folder index in ~30s.
 */
import { useMemo, useState } from 'react';
import {
  Bot,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderPlus,
  Image,
  Link2,
  Plus,
  ScanText,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { MockedRouteBanner } from '@/components/voice/MockedBadge';
import {
  AGENT_ROSTER,
  EMPLOYEE_ROSTER,
  loadLibrary,
  saveLibrary,
  type LibraryFile,
} from '@/pages/company/_lib/libraryStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function fileIcon(f: LibraryFile) {
  if (f.isLinkOnly) return Link2;
  if (f.type.includes('spreadsheet')) return FileSpreadsheet;
  if (f.type.includes('photo') || f.type.includes('image')) return Image;
  if (f.type.includes('ocr') || f.type.includes('pdf')) return ScanText;
  return FileText;
}

function initials(name: string) {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Compact access summary for a table row: agent chips + employee avatars. */
function AccessCell({ file }: { file: LibraryFile }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1">
        <Bot className="h-3 w-3 text-[var(--text-5)]" />
        {file.agents.length === 0 ? (
          <span className="text-[10px] text-[var(--text-5)]">none</span>
        ) : (
          <span className="flex gap-0.5">
            {file.agents.slice(0, 3).map((a) => (
              <span key={a} className="rounded-full bg-[var(--sand-deep)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-2)]">
                {a}
              </span>
            ))}
            {file.agents.length > 3 && (
              <span className="px-0.5 text-[10px] text-[var(--text-4)]">+{file.agents.length - 3}</span>
            )}
          </span>
        )}
      </span>
      <span className="flex items-center gap-1">
        <Users className="h-3 w-3 text-[var(--text-5)]" />
        <span className="flex -space-x-1.5">
          {file.employees.slice(0, 4).map((e) => (
            <span
              key={e}
              title={e}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-[var(--sand-deep)] text-[8px] font-semibold text-[var(--text-2)]"
            >
              {initials(e)}
            </span>
          ))}
        </span>
        {file.employees.length > 4 && (
          <span className="text-[10px] text-[var(--text-4)]">+{file.employees.length - 4}</span>
        )}
        {file.employees.length === 0 && <span className="text-[10px] text-[var(--text-5)]">none</span>}
      </span>
    </div>
  );
}

export default function BrainLibraryView() {
  const { toast } = useToast();
  const [state, setState] = useState(loadLibrary);
  const [group, setGroup] = useState<string>('all');
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState<LibraryFile | null>(null);
  const [addLinkOpen, setAddLinkOpen] = useState(false);

  const persist = (next: typeof state) => {
    setState(next);
    saveLibrary(next);
  };

  const rows = useMemo(
    () =>
      state.files.filter(
        (f) =>
          (group === 'all' || f.group === group) &&
          (!q.trim() || f.name.toLowerCase().includes(q.trim().toLowerCase())),
      ),
    [state, group, q],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const f of state.files) map[f.group] = (map[f.group] ?? 0) + 1;
    return map;
  }, [state]);

  const addGroup = () => {
    const name = window.prompt('Group name (e.g. Marketing):')?.trim();
    if (!name || state.groups.includes(name)) return;
    persist({ ...state, groups: [...state.groups, name] });
  };

  const updateFile = (id: string, patch: Partial<LibraryFile>) => {
    const next = {
      ...state,
      files: state.files.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    };
    persist(next);
    if (detail?.id === id) setDetail({ ...detail, ...patch });
  };

  const removeFile = (id: string) => {
    persist({ ...state, files: state.files.filter((f) => f.id !== id) });
    setDetail(null);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <MockedRouteBanner reason="Groups, links and access are demo, stored locally — memento indexes one flat folder today, and role-based access control is on its roadmap. Real ingestion: files dropped into the documents folder index within ~30s." />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Groups (folders) */}
        <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--line-soft)]">
          <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-4 py-3">
            <p className="plat-eyebrow">Groups</p>
            <button
              type="button"
              onClick={addGroup}
              style={{ height: 28, padding: '0 12px', fontSize: 11, gap: 4 }}
              className="plat-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
            >
              <FolderPlus className="h-3 w-3" />
              New
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            <button
              type="button"
              onClick={() => setGroup('all')}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-[13.5px] transition-colors',
                group === 'all'
                  ? 'bg-[rgba(20,22,26,0.07)] font-semibold text-[var(--ink)]'
                  : 'font-medium text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.04)] hover:text-[var(--ink)]',
              )}
            >
              <Folder className={cn('h-4 w-4', group === 'all' ? 'text-[var(--ink)]' : 'text-[var(--text-4)]')} />
              <span className="flex-1">All files</span>
              <span className="text-[10px] text-[var(--text-4)]">{state.files.length}</span>
            </button>
            {state.groups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-[13.5px] transition-colors',
                  group === g
                    ? 'bg-[rgba(20,22,26,0.07)] font-semibold text-[var(--ink)]'
                    : 'font-medium text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.04)] hover:text-[var(--ink)]',
                )}
              >
                <Folder className={cn('h-4 w-4', group === g ? 'text-[var(--ink)]' : 'text-[var(--text-4)]')} />
                <span className="flex-1 truncate">{g}</span>
                <span className="text-[10px] text-[var(--text-4)]">{counts[g] ?? 0}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Files */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="border-b border-[var(--line-soft)] px-6 pb-5 pt-5">
            <p className="plat-crumb mb-1.5 text-[12px] text-[var(--text-4)]">3days.company</p>
            <h1 className="text-[26px] leading-tight text-[var(--ink)]">
              Library{group !== 'all' && <span className="text-[var(--text-4)]"> / {group}</span>}
            </h1>
            <p className="mt-1 text-[13px] text-[var(--text-4)]">
              What the brain knows, where it lives, and who may use it
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line-soft)] px-6 py-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-4)]" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter files…"
                className="rounded-[10px] border-[var(--line)] bg-white pl-10 text-[var(--text-1)] placeholder:text-[var(--text-5)] focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25 focus-visible:ring-offset-0"
              />
            </div>
            <button
              type="button"
              onClick={() => setAddLinkOpen(true)}
              className="plat-btn h-9 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
            >
              <Link2 className="h-3.5 w-3.5" />
              Add link
            </button>
            <span className="text-xs text-[var(--text-4)]">{rows.length} of {state.files.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <Card className="overflow-hidden rounded-[14px] border-[var(--line-soft)] bg-white shadow-none">
              {/* Wide rows scroll inside the card rather than pushing the page sideways. */}
              <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-[var(--line-soft)] bg-[var(--sand)] text-left">
                    <th className="plat-eyebrow px-4 py-3">Name</th>
                    <th className="plat-eyebrow hidden px-4 py-3 md:table-cell">Group</th>
                    <th className="plat-eyebrow hidden px-4 py-3 lg:table-cell">Access</th>
                    <th className="plat-eyebrow hidden px-4 py-3 text-right xl:table-cell">Chunks</th>
                    <th className="plat-eyebrow hidden px-4 py-3 text-right xl:table-cell">Indexed</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-xs text-[var(--text-4)]">
                        Nothing in this group{q ? ' matches the filter' : ''}.
                      </td>
                    </tr>
                  ) : (
                    rows.map((f) => {
                      const Icon = fileIcon(f);
                      return (
                        <tr
                          key={f.id}
                          onClick={() => setDetail(f)}
                          className="cursor-pointer border-b border-[var(--line-soft)] transition-colors last:border-b-0 hover:bg-[rgba(20,22,26,0.02)]"
                        >
                          <td className="w-[40%] min-w-[220px] px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 rounded-[10px] bg-[var(--sand)] p-2">
                                <Icon className="h-4 w-4 text-[var(--ink)]" />
                              </div>
                              <div className="min-w-0">
                                <p
                                  title={f.name}
                                  className="flex items-center gap-1.5 truncate text-xs text-[var(--ink)]"
                                  style={{ fontFamily: 'var(--mono)' }}
                                >
                                  {f.name}
                                  {f.link && (
                                    <a
                                      href={f.link}
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-[var(--text-5)] transition-colors hover:text-[var(--ink)]"
                                      title={f.link}
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </p>
                                <p className="truncate text-[11px] text-[var(--text-4)]">{f.type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="hidden whitespace-nowrap px-4 py-3 md:table-cell">
                            <span className="plat-pill plat-pill-mute">{f.group}</span>
                          </td>
                          <td className="hidden whitespace-nowrap px-4 py-3 lg:table-cell">
                            <AccessCell file={f} />
                          </td>
                          <td
                            className="hidden whitespace-nowrap px-4 py-3 text-right text-xs text-[var(--text-3)] xl:table-cell"
                            style={{ fontFamily: 'var(--mono)' }}
                          >
                            {f.isLinkOnly ? '—' : f.chunks}
                          </td>
                          <td className="hidden whitespace-nowrap px-4 py-3 text-right text-xs text-[var(--text-4)] xl:table-cell">
                            {f.indexed}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {detail && (
        <FileDetailModal
          file={detail}
          groups={state.groups}
          onPatch={(patch) => updateFile(detail.id, patch)}
          onRemove={() => {
            removeFile(detail.id);
            toast({ title: 'Removed from library (demo)', description: detail.name });
          }}
          onClose={() => setDetail(null)}
        />
      )}

      {addLinkOpen && (
        <AddLinkModal
          groups={state.groups}
          onAdd={(entry) => {
            persist({ ...state, files: [entry, ...state.files] });
            setAddLinkOpen(false);
            toast({ title: 'Link added (demo)', description: entry.name });
          }}
          onClose={() => setAddLinkOpen(false)}
        />
      )}
    </div>
  );
}

// ── File detail: link, group, and who has access ─────────────────────

function FileDetailModal({
  file,
  groups,
  onPatch,
  onRemove,
  onClose,
}: {
  file: LibraryFile;
  groups: string[];
  onPatch: (patch: Partial<LibraryFile>) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const Icon = fileIcon(file);
  const toggle = (list: string[], item: string) =>
    list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg gap-0 rounded-[14px] p-0">
        <div className="border-b border-[var(--line-soft)] px-6 py-4">
          <DialogTitle className="flex items-center gap-2.5 text-base font-semibold text-[#14161a]">
            <div className="rounded-[10px] bg-[#f4f5f7] p-2">
              <Icon className="h-4 w-4 text-[#14161a]" />
            </div>
            <span className="truncate text-sm" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{file.name}</span>
          </DialogTitle>
          <p className="mt-1 text-xs text-[#7a8087]">
            {file.type} · {file.isLinkOnly ? 'link only, not indexed' : `${file.chunks} chunks · indexed ${file.indexed}`}
          </p>
        </div>

        <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[#5a6067]">External location (Dropbox / Drive / URL)</Label>
            <Input
              value={file.link ?? ''}
              onChange={(e) => onPatch({ link: e.target.value || undefined })}
              placeholder="https://…"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              className="rounded-[10px] border-[var(--line)] bg-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[#5a6067]">Group</Label>
            <div className="flex flex-wrap gap-1.5">
              {groups.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onPatch({ group: g })}
                  className={cn(
                    'rounded-full px-3 py-1 text-[11px] font-semibold transition-colors',
                    file.group === g
                      ? 'bg-[#14161a] text-white'
                      : 'border border-[var(--line)] text-[#6b7178] hover:border-[var(--ink)] hover:text-[#14161a]',
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-medium text-[#5a6067]">
              <Bot className="h-3.5 w-3.5 text-[#7a8087]" />
              Agents with access — which AI workers may use this knowledge
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {AGENT_ROSTER.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => onPatch({ agents: toggle(file.agents, a) })}
                  className={cn(
                    'rounded-full px-3 py-1 text-[11px] font-semibold transition-colors',
                    file.agents.includes(a)
                      ? 'bg-[#14161a] text-white'
                      : 'border border-[var(--line)] text-[#7a8087] hover:border-[var(--ink)] hover:text-[#14161a]',
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-medium text-[#5a6067]">
              <Users className="h-3.5 w-3.5 text-[#7a8087]" />
              Employees with access
            </Label>
            <div className="space-y-1">
              {EMPLOYEE_ROSTER.map((e) => (
                <label key={e} className="flex cursor-pointer items-center gap-2.5 rounded-[10px] px-2 py-1.5 text-sm text-[#4a5057] hover:bg-[rgba(20,22,26,0.04)]">
                  <input
                    type="checkbox"
                    checked={file.employees.includes(e)}
                    onChange={() => onPatch({ employees: toggle(file.employees, e) })}
                    className="h-3.5 w-3.5 rounded border-[var(--line)] accent-[#14161a]"
                  />
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e9ebef] text-[9px] font-semibold text-[#5a6067]">
                    {initials(e)}
                  </span>
                  {e}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--line-soft)] px-6 py-3">
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[rgba(179,56,46,0.25)] px-4 text-xs font-semibold text-[#b3382e] transition-colors hover:bg-[rgba(179,56,46,0.06)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove from library
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-full bg-[#14161a] px-5 text-xs font-semibold text-white transition-opacity hover:opacity-85"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Add an external link entry ───────────────────────────────────────

function AddLinkModal({
  groups,
  onAdd,
  onClose,
}: {
  groups: string[];
  onAdd: (entry: LibraryFile) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [group, setGroup] = useState(groups[0] ?? 'Products');

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md gap-0 rounded-[14px] p-0">
        <div className="border-b border-[var(--line-soft)] px-6 py-4">
          <DialogTitle className="flex items-center gap-2.5 text-base font-semibold text-[#14161a]">
            <div className="rounded-[10px] bg-[#f4f5f7] p-2">
              <Link2 className="h-4 w-4 text-[#14161a]" />
            </div>
            Add a link
          </DialogTitle>
          <p className="mt-1 text-xs text-[#7a8087]">
            Point the library at a file that lives elsewhere — Dropbox, Drive, SharePoint, any URL.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAdd({
              id: crypto.randomUUID(),
              name: name.trim(),
              type: 'external link',
              group,
              chunks: 0,
              size: '—',
              indexed: 'not indexed',
              isLinkOnly: true,
              link: url.trim(),
              agents: [],
              employees: [],
            });
          }}
          className="space-y-4 px-6 py-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="link-name" className="text-xs font-medium text-[#5a6067]">Name</Label>
            <Input
              id="link-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Salary bands 2026 (HR SharePoint)"
              required
              className="rounded-[10px] border-[var(--line)] bg-white text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="link-url" className="text-xs font-medium text-[#5a6067]">URL</Label>
            <Input
              id="link-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              required
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              className="rounded-[10px] border-[var(--line)] bg-white text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[#5a6067]">Group</Label>
            <div className="flex flex-wrap gap-1.5">
              {groups.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroup(g)}
                  className={cn(
                    'rounded-full px-3 py-1 text-[11px] font-semibold transition-colors',
                    group === g
                      ? 'bg-[#14161a] text-white'
                      : 'border border-[var(--line)] text-[#6b7178] hover:border-[var(--ink)] hover:text-[#14161a]',
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-[var(--line-soft)] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center rounded-full border border-[var(--line)] px-4 text-xs font-semibold text-[#5a6067] transition-colors hover:border-[var(--ink)] hover:text-[#14161a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !url.trim()}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#14161a] px-5 text-xs font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Plus className="h-3.5 w-3.5" />
              Add link
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
