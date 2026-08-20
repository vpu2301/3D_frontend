/**
 * Keep a streaming transcript pinned to its newest content.
 *
 * Extracted rather than inlined because `Element.scrollTo` is not universally
 * present — jsdom has no implementation at all, and a smooth-scroll option is
 * ignored where `scroll-behavior` is unsupported. An unguarded call throws
 * during render in tests and, more importantly, would take the whole panel down
 * in any environment missing it. Autoscroll is a convenience; it must never be
 * the reason an answer fails to appear.
 */
export function scrollToBottom(element: HTMLElement | null): void {
  if (!element) return;
  if (typeof element.scrollTo === 'function') {
    element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    return;
  }
  element.scrollTop = element.scrollHeight;
}
