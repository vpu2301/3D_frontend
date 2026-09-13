/**
 * The call modal's briefing field: it grows with what you type, and once
 * someone drags it to a height of their own, it stays where they put it.
 */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AutoTextarea } from '@/components/ui/textarea';

const LINE = 20;
const observers: { el: Element; fire: () => void }[] = [];

beforeAll(() => {
  // jsdom does no layout: scrollHeight is always 0, so stand in for it with
  // one line of height per line of text.
  Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', {
    configurable: true,
    get(this: HTMLTextAreaElement) {
      return Math.max(1, this.value.split('\n').length) * LINE;
    },
  });
  // A resize observer that the test can trigger, standing in for a drag.
  class TestRO {
    constructor(private cb: () => void) {}
    observe(el: Element) {
      observers.push({ el, fire: () => this.cb() });
    }
    disconnect() {}
    unobserve() {}
  }
  (globalThis as unknown as Record<string, unknown>).ResizeObserver = TestRO;
});

afterEach(() => {
  observers.length = 0;
});

const field = () => screen.getByRole('textbox') as HTMLTextAreaElement;
const height = () => parseFloat(field().style.height);

describe('sizeable call briefing field', () => {
  it('starts at its minimum and grows with the text', async () => {
    const user = userEvent.setup();
    render(<AutoTextarea minRows={3} maxRows={6} aria-label="Purpose" />);

    expect(height()).toBe(3 * LINE);

    await user.type(field(), 'one{Enter}two{Enter}three{Enter}four');
    expect(height()).toBe(4 * LINE);
  });

  it('stops growing at its maximum and scrolls instead', async () => {
    const user = userEvent.setup();
    render(<AutoTextarea minRows={3} maxRows={5} aria-label="Purpose" />);

    await user.type(field(), 'a{Enter}b{Enter}c{Enter}d{Enter}e{Enter}f{Enter}g');
    expect(height()).toBe(5 * LINE);
    expect(field().style.overflowY).toBe('auto');
  });

  it('hands the height over once it has been dragged', async () => {
    const user = userEvent.setup();
    render(<AutoTextarea minRows={3} maxRows={12} aria-label="Purpose" />);

    // A drag: a height that the component did not apply.
    const el = field();
    Object.defineProperty(el, 'offsetHeight', { configurable: true, value: 400 });
    observers.forEach((o) => o.fire());

    await user.type(el, 'one{Enter}two{Enter}three{Enter}four{Enter}five');
    // Auto-sizing no longer touches it; the dragged height stands.
    expect(height()).toBe(3 * LINE);
    expect(el.style.overflowY).toBe('auto');
  });

  it('re-fits when the value is changed from outside', () => {
    const { rerender } = render(<AutoTextarea minRows={2} maxRows={12} value="" onChange={() => {}} aria-label="Purpose" />);
    expect(height()).toBe(2 * LINE);

    rerender(<AutoTextarea minRows={2} maxRows={12} value={'a\nb\nc\nd\ne'} onChange={() => {}} aria-label="Purpose" />);
    expect(height()).toBe(5 * LINE);
  });
});
