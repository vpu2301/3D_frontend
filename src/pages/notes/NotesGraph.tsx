/**
 * Knowledge graph (Sprint 2 §4.3).
 *
 * Nodes and edges come from `GET /v1/graph`; the force layout stays client-side
 * because it is presentation. Two things the server sends that the local build
 * could not: `external: true` nodes for links pointing at docs and calendar
 * events (rendered dimmed, not navigable inside /notes), and a 413 above the
 * node cap instead of a browser that locks up on an O(n²) layout.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import NotesLayout from '@/pages/notes/_components/shared/NotesLayout';
import NotesMiniRail from '@/pages/notes/_components/sidebar/NotesMiniRail';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesTags } from '@/pages/notes/_hooks/use-notes-tags';
import { GraphTooLargeError, notesApi, type GraphData } from '@/pages/notes/_lib/apiClient';

interface LayoutNode {
  id: string;
  title: string;
  tags: string[];
  external: boolean;
  pinned: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface LayoutEdge {
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

function layout(nodes: LayoutNode[], edges: LayoutEdge[]) {
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
  const { tags } = useNotesTags();
  const navigate = useNavigate();

  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooLarge, setTooLarge] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTooLarge(null);
    try {
      setGraph(await notesApi.graph(tagFilter ?? undefined));
    } catch (err) {
      if (err instanceof GraphTooLargeError) {
        setTooLarge(err.message);
        setGraph(null);
      } else {
        setError(err instanceof Error ? err.message : 'Could not load the graph.');
      }
    } finally {
      setLoading(false);
    }
  }, [tagFilter]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const { nodes, edges } = useMemo(() => {
    if (!graph) return { nodes: [] as LayoutNode[], edges: [] as LayoutEdge[] };

    const nodes: LayoutNode[] = graph.nodes.map((n, i) => ({
      id: n.id,
      title: n.title,
      tags: n.tags ?? [],
      external: Boolean(n.external),
      pinned: Boolean(n.pinned),
      x: W / 2 + Math.cos(i * 1.7) * 200,
      y: H / 2 + Math.sin(i * 1.7) * 200,
      vx: 0,
      vy: 0,
    }));
    const present = new Set(nodes.map((n) => n.id));
    const edges: LayoutEdge[] = graph.edges
      .filter((e) => present.has(e.from) && present.has(e.to))
      .map((e) => ({ source: e.from, target: e.to }));

    layout(nodes, edges);
    return { nodes, edges };
    // `tick` is the manual "Relayout" button — same data, fresh seed positions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, tick]);

  return (
    <NotesLayout>
      <div className="flex flex-1 overflow-hidden">
        <NotesMiniRail />
        <main className="flex flex-1 flex-col overflow-auto">
          <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-8 pt-6 pb-4">
            <div>
              <p className="plat-crumb">3days.notes</p>
              <h1 className="mt-1.5 flex items-center gap-2 text-[22px]">
                <Network className="h-5 w-5" style={{ color: 'var(--text-4)' }} /> Note graph
              </h1>
              <p
                className="mt-1 flex items-center gap-1.5 text-xs"
                style={{ color: 'var(--text-4)' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                  </>
                ) : (
                  `${nodes.length} nodes · ${edges.length} edges`
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={tagFilter ?? ''}
                onChange={(e) => setTagFilter(e.target.value || null)}
                className="h-8 rounded-[10px] border border-[var(--line)] bg-white px-2 text-xs text-[var(--ink)]"
              >
                <option value="">All tags</option>
                {tags.slice(0, 20).map((t) => (
                  <option key={t.name} value={t.name}>
                    #{t.name} ({t.count})
                  </option>
                ))}
              </select>
              <button
            data-command-exempt="graph view control; scoped to the rendering, reachable as nav.graph"
                type="button"
                onClick={() => {
                  setTick((t) => t + 1);
                  fetchGraph();
                }}
                className="plat-btn-ghost !h-8 !gap-1 !px-3 !text-[11px]"
                title="Refetch and re-run layout"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Relayout
              </button>
            </div>
          </div>

          <div className="p-6">
            {tooLarge ? (
              <div
                className="mx-auto max-w-xl rounded-[14px] border p-5 text-center"
                style={{ borderColor: 'rgba(154,83,18,0.22)', background: 'var(--warn-bg)' }}
              >
                <AlertTriangle className="mx-auto mb-2 h-6 w-6" style={{ color: 'var(--warn-fg)' }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--warn-fg)' }}>
                  Graph too large to render
                </p>
                <p className="mt-1 text-xs" style={{ color: 'var(--warn-fg)' }}>
                  {tooLarge}
                </p>
                {tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {tags.slice(0, 8).map((t) => (
                      <button
            data-command-exempt="graph view control; scoped to the rendering, reachable as nav.graph"
                        key={t.name}
                        type="button"
                        onClick={() => setTagFilter(t.name)}
                        className="rounded-full border border-[var(--line)] bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--ink)] transition-colors hover:bg-[rgba(20,22,26,0.04)]"
                      >
                        #{t.name} ({t.count})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : error ? (
              <div
                className="mx-auto max-w-xl rounded-[14px] border bg-white p-5 text-center text-sm"
                style={{ borderColor: 'rgba(179,56,46,0.25)', color: 'var(--bad-fg)' }}
              >
                {error}
              </div>
            ) : (
              <>
                <div className="plat-list mx-auto" style={{ background: 'var(--sand)' }}>
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
                          stroke={isHover ? 'var(--ink)' : 'var(--line)'}
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
                          onClick={() => {
                            // External nodes are docs and calendar events; they
                            // are context, not destinations inside /notes.
                            if (!n.external) navigate(`/notes/${n.id}`);
                          }}
                          style={{ cursor: n.external ? 'default' : 'pointer' }}
                          opacity={n.external ? 0.45 : 1}
                        >
                          <circle
                            cx={n.x}
                            cy={n.y}
                            r={r}
                            fill={n.external ? 'var(--sand-deep)' : isHover ? 'var(--ink)' : 'var(--paper)'}
                            stroke={n.external ? 'var(--text-5)' : 'var(--ink)'}
                            strokeWidth={1.2}
                            strokeDasharray={n.external ? '3 2' : undefined}
                          />
                          <text
                            x={n.x}
                            y={n.y + r + 12}
                            textAnchor="middle"
                            style={{ fontSize: 10, fill: 'var(--text-4)' }}
                          >
                            {n.title.slice(0, 24)}
                            {n.title.length > 24 ? '…' : ''}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <p className="mt-3 text-center text-xs" style={{ color: 'var(--text-4)' }}>
                  Click a node to open the note. Hover to highlight its links. Dimmed nodes are
                  linked docs and calendar events.
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    </NotesLayout>
  );
}
