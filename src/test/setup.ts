import '@testing-library/jest-dom/vitest';

// idb-keyval uses indexedDB; mock with an in-memory shim for tests
import 'fake-indexeddb/auto';

// jsdom implements neither of these, and both are used by the primitives the
// notes UI is built from — cmdk observes its list, Radix its popovers. Without
// the shims every test that opens the command palette dies in an effect.
if (!('ResizeObserver' in globalThis)) {
  class ResizeObserverShim {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as unknown as Record<string, unknown>).ResizeObserver = ResizeObserverShim;
}

if (!('IntersectionObserver' in globalThis)) {
  class IntersectionObserverShim {
    root = null;
    rootMargin = '';
    thresholds: number[] = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  (globalThis as unknown as Record<string, unknown>).IntersectionObserver = IntersectionObserverShim;
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

/**
 * jsdom in this configuration exposes a `localStorage` object with no methods
 * on it, so every `getItem`/`setItem` throws a TypeError rather than returning
 * null. The app survives that — every access is wrapped — but it means a test
 * cannot assert anything that persists. This is a real, working in-memory
 * Storage, which is what the tests are actually about.
 */
class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  getItem(key: string) {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  key(index: number) {
    return [...this.map.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  setItem(key: string, value: string) {
    this.map.set(key, String(value));
  }
}

if (typeof globalThis.localStorage?.setItem !== 'function') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoryStorage(),
    configurable: true,
  });
}

/**
 * The platform sidebar the notes pages render inside asks for a media query on
 * mount. jsdom has no `matchMedia`, so without this every full-page test fails
 * in a layout component rather than in the thing it is testing.
 */
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

/**
 * Mark the mock era's IndexedDB cleanup as already done.
 *
 * The notes store awaits it once before its first request. It talks to
 * `fake-indexeddb`, which schedules on real timers — so a test that installs
 * `vi.useFakeTimers()` before the first load leaves that promise pending
 * forever, and every later test in the file times out on a bootstrap step none
 * of them is about. No test covers the one-time cleanup; it has its own reason
 * to exist and its own place, outside the notes module.
 */
localStorage.setItem('notes:legacy-idb-cleared:v1', new Date(0).toISOString());
