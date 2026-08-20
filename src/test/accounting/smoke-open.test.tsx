import { describe, it, expect, beforeAll } from 'vitest';

beforeAll(() => {
  const store = new Map<string, string>();
  const shim = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() { return store.size; },
  };
  Object.defineProperty(window, 'localStorage', { value: shim, configurable: true });
  Object.defineProperty(window, 'sessionStorage', { value: shim, configurable: true });
  window.matchMedia = window.matchMedia ?? ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList);
});
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AccountingHome from '@/pages/accounting/AccountingHome';
import PincerClose from '@/pages/product/PincerClose';

describe('accounting smoke', () => {
  for (const path of ['/accounting', '/accounting/radar', '/accounting/queue', '/accounting/requests', '/accounting/audit', '/accounting/workflows', '/accounting/workflows/wf-receipt-chase']) {
    it(`renders ${path} without crashing`, () => {
      const { container } = render(
        <MemoryRouter initialEntries={[path]}>
          <AccountingHome />
        </MemoryRouter>,
      );
      expect(container.textContent!.length).toBeGreaterThan(0);
    });
  }

  it('renders marketing page /product/pincer-close', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/product/pincer-close']}>
        <PincerClose />
      </MemoryRouter>,
    );
    expect(container.textContent!.length).toBeGreaterThan(0);
  });
});
