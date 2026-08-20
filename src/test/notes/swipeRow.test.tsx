/**
 * Swipe-to-pin / swipe-to-trash on a note row.
 *
 * The gesture shares its start with two things that must keep working — a tap
 * that opens the note, and a vertical flick that scrolls the list — so most of
 * what is asserted here is what the swipe does *not* do.
 */

import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import NoteSwipeRow from '@/pages/notes/_components/list/NoteSwipeRow';

function renderRow(overrides: { pinned?: boolean } = {}) {
  const onPin = vi.fn();
  const onTrash = vi.fn();
  const onOpen = vi.fn();
  render(
    <NoteSwipeRow pinned={overrides.pinned ?? false} onPin={onPin} onTrash={onTrash}>
      <button type="button" onClick={onOpen}>
        Quarterly review
      </button>
    </NoteSwipeRow>,
  );
  const row = screen.getByText('Quarterly review').parentElement!.parentElement!;
  return { row, onPin, onTrash, onOpen };
}

/** One gesture, start to finish, in a straight line. */
function swipe(row: Element, dx: number, dy = 0) {
  fireEvent.pointerDown(row, { pointerId: 1, pointerType: 'touch', clientX: 200, clientY: 100 });
  // Two moves: the first is what the axis lock decides on, the second carries
  // the row far enough to commit.
  fireEvent.pointerMove(row, {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 200 + Math.sign(dx) * Math.min(Math.abs(dx), 20),
    clientY: 100 + Math.sign(dy) * Math.min(Math.abs(dy), 20),
  });
  fireEvent.pointerMove(row, {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 200 + dx,
    clientY: 100 + dy,
  });
  fireEvent.pointerUp(row, {
    pointerId: 1,
    pointerType: 'touch',
    clientX: 200 + dx,
    clientY: 100 + dy,
  });
}

describe('note row swipe actions', () => {
  it('pins on a full swipe right', () => {
    const { row, onPin, onTrash } = renderRow();
    swipe(row, 160);
    expect(onPin).toHaveBeenCalledTimes(1);
    expect(onTrash).not.toHaveBeenCalled();
  });

  it('trashes on a full swipe left', () => {
    const { row, onPin, onTrash } = renderRow();
    swipe(row, -160);
    expect(onTrash).toHaveBeenCalledTimes(1);
    expect(onPin).not.toHaveBeenCalled();
  });

  it('does nothing when the swipe is released short of the threshold', () => {
    const { row, onPin, onTrash } = renderRow();
    swipe(row, -60);
    expect(onTrash).not.toHaveBeenCalled();
    expect(onPin).not.toHaveBeenCalled();
  });

  it('leaves a vertical drag to the scroller', () => {
    const { row, onPin, onTrash } = renderRow();
    // Horizontal travel past the commit distance, but the drag started as a
    // scroll, so the row never takes it.
    swipe(row, 200, 240);
    expect(onPin).not.toHaveBeenCalled();
    expect(onTrash).not.toHaveBeenCalled();
  });

  it('still opens the note on a tap that wanders a few pixels', () => {
    const { row, onOpen, onPin, onTrash } = renderRow();
    swipe(row, 4);
    fireEvent.click(screen.getByText('Quarterly review'));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onPin).not.toHaveBeenCalled();
    expect(onTrash).not.toHaveBeenCalled();
  });

  it('swallows the click that ends a committed swipe', () => {
    const { row, onOpen, onTrash } = renderRow();
    swipe(row, -160);
    fireEvent.click(screen.getByText('Quarterly review'));
    expect(onTrash).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('offers unpin on a note that is already pinned', () => {
    renderRow({ pinned: true });
    expect(screen.getByText('Unpin')).toBeTruthy();
  });
});
