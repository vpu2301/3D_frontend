/**
 * Tag list from `GET /v1/tags` — replaces the mock era's `deriveTags()` scan
 * over the in-memory notes map (Sprint 2 §4.5).
 *
 * The server returns name, count and a colour picked by the same hash the mock
 * used, so the sidebar looks identical. Counts are authoritative for the whole
 * corpus rather than for whatever happens to be loaded.
 *
 * Refetches whenever the notes map changes identity, which is what makes a
 * count move the moment a tag is added.
 */

import { useEffect, useMemo, useState } from 'react';
import type { TagInfo } from '@/pages/notes/_lib/types';
import { notesApi } from '@/pages/notes/_lib/apiClient';
import { useNotesStore, selectNotesMap } from '@/pages/notes/_hooks/use-notes-store';

export function useNotesTags(): { tags: TagInfo[]; loading: boolean } {
  const notesMap = useNotesStore(selectNotesMap);
  const loaded = useNotesStore((s) => s.loaded);
  const [tags, setTags] = useState<TagInfo[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Keying the refetch on the notes map itself would fire a request on every
   * autosave, because each save replaces the map. Only a change in the tag
   * assignments can change what `/v1/tags` returns, so that is what is watched.
   */
  const tagSignature = useMemo(
    () =>
      Object.values(notesMap)
        .map((n) => `${n.id}:${n.trashed ? 't' : ''}:${n.tags.join(',')}`)
        .sort()
        .join('|'),
    [notesMap],
  );

  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;
    setLoading(true);
    notesApi
      .tags()
      .then((rows) => {
        if (!cancelled) setTags(rows);
      })
      .catch(() => {
        // A failed tag fetch means an empty tag section, not a broken sidebar.
        if (!cancelled) setTags([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loaded, tagSignature]);

  return { tags, loading };
}
