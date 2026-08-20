/**
 * Approvals surface three (§5): pending agent writes, on the note they target.
 *
 * The transcript only helps someone who still has the conversation open, and
 * the bell only helps someone who thinks to look. This is the surface that
 * catches the realistic case — the user opens a note, and the note itself says
 * that something is waiting to change it. Anywhere else, a pending write to a
 * client matter can sit unseen until it expires.
 *
 * It renders nothing when nothing is pending, which is almost always.
 */

import { useEffect, useMemo } from 'react';
import { useApprovalsStore } from '@/pages/notes/_hooks/use-approvals-store';
import ApprovalCard from '@/pages/notes/_components/ai/ApprovalCard';

export default function NoteApprovalBanner({ noteId }: { noteId: string }) {
  const subscribe = useApprovalsStore((s) => s.subscribe);
  // Filtered from the shared list rather than fetched per note: the store is
  // already polling, and a second request per open note would multiply the
  // poll rate by however many notes are on screen.
  //
  // The filter runs here and not in the selector on purpose. zustand 5 reads
  // through `useSyncExternalStore`, which compares snapshots by reference and
  // treats a fresh one on every read as a store that will not settle. A
  // selector ending in `.filter(...)` allocates a new array each call, so React
  // re-renders until it gives up and unmounts the tree — a blank page, not a
  // slow one. Select the stable array; derive from it.
  const allPending = useApprovalsStore((s) => s.pending);
  const pending = useMemo(
    () => allPending.filter((p) => p.noteId === noteId),
    [allPending, noteId],
  );

  useEffect(() => subscribe(), [subscribe]);

  if (pending.length === 0) return null;

  return (
    <section aria-label="Pending agent approvals for this note" className="mx-10 mt-4 space-y-2">
      {pending.map((approval) => (
        <ApprovalCard key={approval.actionId} approval={approval} />
      ))}
    </section>
  );
}
