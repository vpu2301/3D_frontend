/**
 * Local store for the Library's organizational layer: groups (folders),
 * external links, and per-file access (agents + employees).
 *
 * DEMO by design: memento indexes one flat documents folder and has no
 * folders/links/ACL — role-based access control is explicitly on its roadmap.
 * This store makes the intended workflow fully clickable; when the backend
 * grows those endpoints, this module is the seam to swap.
 */

export interface LibraryFile {
  id: string;
  name: string;
  type: string;
  group: string;
  chunks: number;
  size: string;
  indexed: string;
  /** External location (Dropbox / Drive / SharePoint / URL), if attached. */
  link?: string;
  /** Which AI agents may use this file's knowledge. */
  agents: string[];
  /** Which employees may see it. */
  employees: string[];
  /** Pure link entries (no indexed file behind them). */
  isLinkOnly?: boolean;
}

export const AGENT_ROSTER = ['Emma', 'Aria', 'Felix', 'Sage', 'Maya'];
export const EMPLOYEE_ROSTER = ['V. Pugachov', 'L. Werner', 'K. Brandt', 'S. Okafor', 'M. Fischer'];

const KEY = 'company.library.demo';

interface LibraryState {
  groups: string[];
  files: LibraryFile[];
}

const SEED: LibraryState = {
  groups: ['Products', 'Legal', 'Finance', 'HR'],
  files: [
    {
      id: 'f1', name: 'pricelist-2026.xlsx', type: 'spreadsheet', group: 'Products',
      chunks: 312, size: '84 KB', indexed: '5h ago',
      link: 'https://www.dropbox.com/s/acme/pricelist-2026.xlsx',
      agents: ['Emma', 'Felix'], employees: ['V. Pugachov', 'L. Werner', 'K. Brandt'],
    },
    {
      id: 'f2', name: 'product_photos/', type: '48 images · clip index', group: 'Products',
      chunks: 48, size: '52 MB', indexed: '3h ago',
      agents: ['Emma'], employees: ['V. Pugachov', 'L. Werner'],
    },
    {
      id: 'f3', name: 'supplier-contract-mueller.pdf', type: 'pdf · ocr', group: 'Legal',
      chunks: 18, size: '1.2 MB', indexed: '1d ago',
      link: 'https://drive.google.com/file/d/acme-mueller-contract',
      agents: ['Felix'], employees: ['V. Pugachov', 'M. Fischer'],
    },
    {
      id: 'f4', name: 'agb-2026.docx', type: 'docx', group: 'Legal',
      chunks: 22, size: '48 KB', indexed: '6d ago',
      agents: ['Emma', 'Aria', 'Felix', 'Sage', 'Maya'],
      employees: ['V. Pugachov', 'L. Werner', 'K. Brandt', 'S. Okafor', 'M. Fischer'],
    },
    {
      id: 'f5', name: 'orders-q3.csv', type: 'spreadsheet', group: 'Finance',
      chunks: 148, size: '61 KB', indexed: '3h ago',
      agents: ['Felix'], employees: ['V. Pugachov', 'M. Fischer'],
    },
    {
      id: 'f6', name: 'scan-lieferschein-0812.jpg', type: 'image · ocr', group: 'Finance',
      chunks: 3, size: '2.4 MB', indexed: '1d ago',
      agents: ['Felix'], employees: ['V. Pugachov'],
    },
    {
      id: 'f7', name: 'travel-policy.md', type: 'markdown', group: 'HR',
      chunks: 4, size: '2 KB', indexed: '2d ago',
      link: 'https://www.dropbox.com/s/acme/travel-policy.md',
      agents: ['Emma', 'Aria', 'Sage'],
      employees: ['V. Pugachov', 'L. Werner', 'K. Brandt', 'S. Okafor', 'M. Fischer'],
    },
    {
      id: 'f8', name: 'Salary bands 2026 (HR SharePoint)', type: 'external link', group: 'HR',
      chunks: 0, size: '—', indexed: 'not indexed', isLinkOnly: true,
      link: 'https://acme.sharepoint.com/hr/salary-bands-2026',
      agents: [], employees: ['V. Pugachov', 'M. Fischer'],
    },
  ],
};

export function loadLibrary(): LibraryState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to seed */
  }
  return SEED;
}

export function saveLibrary(state: LibraryState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}
