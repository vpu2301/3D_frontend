import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, RefreshCw } from 'lucide-react';
import NotesLayout from '@/pages/notes/_components/shared/NotesLayout';
import NotesMiniRail from '@/pages/notes/_components/sidebar/NotesMiniRail';
import { useNotesStore, selectNotesMap, deriveTags } from '@/pages/notes/_hooks/use-notes-store';
import { deriveTitle } from '@/pages/notes/_lib/backlinks';

interface Node {
  id: string;
  title: string;
  tags: string[];
  notebookId?: string | null;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Edge {
  source: string;
  target: string;
}

const W = 1200;
const H = 700;
const REPULSION = 1500;
const SPRING = 0.02;
const SPRING_LEN = 110;
const DAMPING = 0.85;
const ITERATIONS = 200;

function layout(nodes: Node[], edges: Edge[]) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  for (let i = 0; i < ITERATIONS; i++) {
    // Repel
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const A = nodes[a];
        const B = nodes[b];
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        const d2 = dx * dx + dy * dy + 0.01;
        const f = REPULSION / d2;
        const d = Math.sqrt(d2);
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        A.vx -= fx;
        A.vy -= fy;
        B.vx += fx;
        B.vy += fy;
      }
    }
    // Spring along edges
    for (const e of edges) {
      const A = byId.get(e.source);
      const B = byId.get(e.target);
      if (!A || !B) continue;
      const dx = B.x - A.x;
      const dy = B.y - A.y;
      const d = Math.sqrt(dx * dx + dy * dy) + 0.01;
      const f = (d - SPRING_LEN) * SPRING;
      const fx = (dx / d) * f;
      const fy = (dy / d) * f;
      A.vx += fx;
      A.vy += fy;
      B.vx -= fx;
      B.vy -= fy;
    }
    // Damp + apply
    for (const n of nodes) {
      n.vx *= DAMPING;
      n.vy *= DAMPING;
      n.x += n.vx;
      n.y += n.vy;
      n.x = Math.max(40, Math.min(W - 40, n.x));
      n.y = Math.max(40, Math.min(H - 40, n.y));
    }
  }
}

export default function NotesGraph() {
  const load = useNotesStore((s) => s.load);
  const notesMap = useNotesStore(selectNotesMap);
  const navigate = useNavigate();
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    load();
  }, [load]);

  const tags = useMemo(
    () =>
      deriveTags(Object.values(notesMap)).slice(0, 10).map((t) => t.name),
    [notesMap],
  );

  const { nodes, edges } = useMemo(() => {
    const all = Object.values(notesMap).filter((n) => !n.trashed);
    const filtered = tagFilter ? all.filter((n) => n.tags.includes(tagFilter)) : all;
    const present = new Set(filtered.map((n) => n.id));
    const nodes: Node[] = filtered.map((n, i) => ({
      id: n.id,
      title: deriveTitle(n),
      tags: n.tags,
      notebookId: n.notebookId,
      x: W / 2 + Math.cos(i * 1.7) * 200,
      y: H / 2 + Math.sin(i * 1.7) * 200,
      vx: 0,
      vy: 0,
    }));
    const edges: Edge[] = [];
    for (const n of filtered) {
      for (const link of n.links ?? []) {
        if (link.type === 'note' && present.has(link.targetId)) {
          edges.push({ source: n.id, target: link.targetId });
        }
      }
    }
    layout(nodes, edges);
    return { nodes, edges };
  }, [notesMap, tagFilter, tick]);

  return (
    <NotesLayout>
      <div className="flex flex-1 overflow-hidden">
        <NotesMiniRail />
        <main className="flex flex-1 flex-col overflow-auto">
        <div className="flex items-center justify-between border-b border-gray-100 px-8 pt-6 pb-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-light text-gray-900">
              <Network className="h-5 w-5 text-[#1a73e8]" /> Note graph
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              {nodes.length} nodes · {edges.length} edges
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={tagFilter ?? ''}
              onChange={(e) => setTagFilter(e.target.value || null)}
              className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs"
            >
              <option value="">All tags</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  #{t}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setTick((t) => t + 1)}
              className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
              title="Re-run layout"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Relayout
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="mx-auto overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-[70vh] w-full">
              {edges.map((e, i) => {
                const a = nodes.find((n) => n.id === e.source);
                const b = nodes.find((n) => n.id === e.target);
                if (!a || !b) return null;
                const isHover = hover && (hover === e.source || hover === e.target);
                return (
                  <line
                    key={i}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={isHover ? '#3b82f6' : '#cbd5e1'}
                    strokeWidth={isHover ? 1.5 : 0.8}
                  />
                );
              })}
              {nodes.map((n) => {
                const r = Math.min(18, 6 + (n.tags.length || 1) * 2);
                const isHover = hover === n.id;
                return (
                  <g
                    key={n.id}
                    onMouseEnter={() => setHover(n.id)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => navigate(`/notes/${n.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={r}
                      fill={isHover ? '#fbbf24' : '#fde68a'}
                      stroke="#f59e0b"
                      strokeWidth={1.2}
                    />
                    <text
                      x={n.x}
                      y={n.y + r + 12}
                      textAnchor="middle"
                      className="fill-gray-700"
                      style={{ fontSize: 10 }}
                    >
                      {n.title.slice(0, 24)}
                      {n.title.length > 24 ? '…' : ''}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="mt-3 text-center text-xs text-gray-500">
            Click a node to open the note. Hover to highlight its links.
          </p>
        </div>
        </main>
      </div>
    </NotesLayout>
  );
}
