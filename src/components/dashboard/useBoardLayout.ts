/**
 * Where the board's arrangement lives: an array of widget ids in
 * localStorage, so the dashboard someone builds is still there next time.
 */
import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_LAYOUT, WIDGET_BY_ID } from './widgets/registry';

const STORAGE_KEY = 'pincer.dash.board';
/** Own MIME type: a widget id dropped from the gallery is not plain text. */
export const BOARD_MIME = 'application/x-3days-dashboard';

function readLayout(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LAYOUT;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_LAYOUT;
    // A layout saved before a widget was renamed must not render a hole.
    const ids = parsed.filter((id): id is string => typeof id === 'string' && WIDGET_BY_ID.has(id));
    return [...new Set(ids)];
  } catch {
    return DEFAULT_LAYOUT;
  }
}

/** The ids on the board, and the four things that can happen to them. */
export function useBoardLayout() {
  const [ids, setIds] = useState<string[]>(readLayout);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* a full or blocked store is not worth breaking the page over */
    }
  }, [ids]);

  const add = useCallback((id: string) => {
    if (!WIDGET_BY_ID.has(id)) return;
    setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const remove = useCallback((id: string) => setIds((prev) => prev.filter((x) => x !== id)), []);

  /** Put `id` at slot `at`, counted against the list as it looks right now. */
  const place = useCallback((id: string, at: number) => {
    if (!WIDGET_BY_ID.has(id)) return;
    setIds((prev) => {
      const from = prev.indexOf(id);
      const without = prev.filter((x) => x !== id);
      const index = from > -1 && from < at ? at - 1 : at;
      const clamped = Math.max(0, Math.min(without.length, index));
      return [...without.slice(0, clamped), id, ...without.slice(clamped)];
    });
  }, []);

  const nudge = useCallback((id: string, delta: number) => {
    setIds((prev) => {
      const from = prev.indexOf(id);
      const to = from + delta;
      if (from < 0 || to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      next.splice(to, 0, ...next.splice(from, 1));
      return next;
    });
  }, []);

  return { ids, add, remove, place, nudge };
}
