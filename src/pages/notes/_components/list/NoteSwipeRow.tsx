import { useCallback, useRef, useState, type ReactNode } from 'react';
import { Pin, PinOff, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Swipe actions for a list row.
 *
 * Swipe right → pin/unpin, swipe left → trash. Both are already one command
 * away (`note.pin`, `note.trash`), so this is a shortcut and never the only way
 * to reach either — which is what lets it stay a gesture with no visible
 * affordance at rest.
 *
 * The gesture is axis-locked before it takes over: `touch-action: pan-y` leaves
 * vertical scrolling to the browser, and a drag only becomes a swipe once it is
 * clearly horizontal. Below that threshold nothing moves and the row still
 * behaves as a button, so a tap that wanders a few pixels still opens the note.
 */

/** How far the row slides to fully expose an action panel. */
const REVEAL = 88;
/** Past this, releasing commits the action. Slightly beyond the reveal so a
 *  half-hearted drag reads as "peek", not "do it". */
const COMMIT = 104;
/** Horizontal travel before the gesture is treated as a swipe at all. */
const LOCK = 10;

function rubberBand(dx: number): number {
  const abs = Math.abs(dx);
  if (abs <= REVEAL) return dx;
  return Math.sign(dx) * (REVEAL + (abs - REVEAL) * 0.3);
}

export default function NoteSwipeRow({
  pinned,
  onPin,
  onTrash,
  children,
}: {
  pinned: boolean;
  onPin: () => void;
  onTrash: () => void;
  children: ReactNode;
}) {
  const [offset, setOffset] = useState(0);
  const [animating, setAnimating] = useState(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const axis = useRef<'none' | 'horizontal' | 'vertical'>('none');
  // Set the moment a swipe commits, and read by the capture-phase click
  // handler below so the release does not also open the note.
  const swallowClick = useRef(false);

  const settle = useCallback((to: number) => {
    setAnimating(true);
    setOffset(to);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Mouse: only the primary button. Pen/touch: any contact.
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    axis.current = 'none';
    setAnimating(false);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 0 && e.pointerType === 'mouse') return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    if (axis.current === 'none') {
      if (Math.abs(dx) < LOCK && Math.abs(dy) < LOCK) return;
      // A drag that starts vertical stays the scroller's for its whole life —
      // otherwise a flick down the list snags on every row it passes.
      axis.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      if (axis.current === 'horizontal') {
        // Optional chaining because jsdom has no pointer capture; the gesture
        // still works without it, it just stops tracking outside the row.
        e.currentTarget.setPointerCapture?.(e.pointerId);
      }
      return;
    }
    if (axis.current !== 'horizontal') return;

    setOffset(rubberBand(dx - Math.sign(dx) * LOCK));
  };

  const endGesture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    }
    if (axis.current !== 'horizontal') {
      axis.current = 'none';
      return;
    }
    axis.current = 'none';

    const committed = Math.abs(offset) >= COMMIT;
    if (committed) swallowClick.current = true;

    if (committed && offset <= -COMMIT) {
      // Slide the row out under the trash panel. The store filters trashed
      // notes out of the list, so the unmount lands on top of this.
      settle(-window.innerWidth);
      onTrash();
      return;
    }
    if (committed && offset >= COMMIT) {
      settle(0);
      onPin();
      return;
    }
    settle(0);
  };

  const runFromPanel = (action: () => void) => {
    swallowClick.current = true;
    settle(0);
    action();
  };

  const pinning = offset > 0;
  const armed = Math.abs(offset) >= COMMIT;
  const progress = Math.min(Math.abs(offset) / COMMIT, 1);

  return (
    <div
      className="relative isolate overflow-hidden"
      style={{ touchAction: 'pan-y' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endGesture}
      onPointerCancel={endGesture}
      onClickCapture={(e) => {
        if (!swallowClick.current) return;
        swallowClick.current = false;
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Action panels sit behind the row and are only ever seen through the
          gap the drag opens. They are real buttons so the revealed state is
          also tappable — a peek does not have to become a full swipe. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden={!pinning || offset === 0}
        data-command-exempt="swipe shortcut for note.pin; the command form is in the palette"
        onClick={() => runFromPanel(onPin)}
        className={cn(
          'absolute inset-y-0 left-0 flex w-[88px] items-center justify-center transition-colors',
          armed && pinning ? 'bg-amber-500 text-white' : 'bg-[var(--warn-bg)] text-[var(--warn-fg)]',
        )}
        style={{ opacity: pinning ? 1 : 0 }}
      >
        <span
          className="flex flex-col items-center gap-0.5"
          style={{ transform: `scale(${0.8 + progress * 0.2})` }}
        >
          {pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          <span className="text-[10px] font-medium">{pinned ? 'Unpin' : 'Pin'}</span>
        </span>
      </button>

      <button
        type="button"
        tabIndex={-1}
        aria-hidden={pinning || offset === 0}
        data-command-exempt="swipe shortcut for note.trash; the command form is in the palette"
        onClick={() => runFromPanel(onTrash)}
        className={cn(
          'absolute inset-y-0 right-0 flex w-[88px] items-center justify-center transition-colors',
          armed && !pinning ? 'bg-[var(--bad-fg)] text-white' : 'bg-[#f7e6e4] text-[var(--bad-fg)]',
        )}
        style={{ opacity: offset < 0 ? 1 : 0 }}
      >
        <span
          className="flex flex-col items-center gap-0.5"
          style={{ transform: `scale(${0.8 + progress * 0.2})` }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-[10px] font-medium">Delete</span>
        </span>
      </button>

      <div
        className="relative z-10"
        style={{
          /* Opaque only while the gesture is open, so the action panels stay
             hidden under the row; at rest the row lets the ambient wash through. */
          background: offset !== 0 ? 'var(--paper)' : undefined,
          transform: `translate3d(${offset}px, 0, 0)`,
          transition: animating ? 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)' : undefined,
        }}
        onTransitionEnd={() => setAnimating(false)}
      >
        {children}
      </div>
    </div>
  );
}
