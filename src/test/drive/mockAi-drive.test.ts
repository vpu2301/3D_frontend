import { describe, it, expect } from 'vitest';
import {
  semanticFileSearch,
  askAcrossDrive,
  summarizeFile,
  suggestFileTags,
  detectDuplicates,
  proposeOrganization,
  populateSpace,
  configureMockAi,
  type MockFileMeta,
} from '@/pages/docs/_lib/mockAi';

configureMockAi({ failureRate: 0, minLatencyMs: 0, maxLatencyMs: 1 });

const mk = (over: Partial<MockFileMeta>): MockFileMeta => ({
  id: 'f1',
  name: 'file',
  kind: 'pdf',
  size: 1000,
  tags: [],
  parentId: null,
  updatedAt: Date.now(),
  ownerId: 'me',
  ...over,
});

describe('semanticFileSearch', () => {
  it('ranks files by token overlap with reasons', async () => {
    const files: MockFileMeta[] = [
      mk({ id: 'a', name: 'Acme contract.pdf', tags: ['contract'], extractedText: 'Acme service agreement.' }),
      mk({ id: 'b', name: 'cookie recipe', tags: ['cooking'], extractedText: 'Pour the dough.' }),
    ];
    const r = await semanticFileSearch('acme contract', files);
    expect(r[0].fileId).toBe('a');
    expect(r[0].reason).toMatch(/matches/);
  });

  it('returns empty for empty query', async () => {
    const r = await semanticFileSearch('', [mk({})]);
    expect(r).toEqual([]);
  });
});

describe('askAcrossDrive', () => {
  it('streams an answer with citedFileIds', async () => {
    const files: MockFileMeta[] = [
      mk({ id: 'a', name: 'Acme contract', extractedText: 'Service agreement.' }),
    ];
    const stream = askAcrossDrive('acme', files);
    let acc = '';
    const cited = new Set<string>();
    for await (const c of stream) {
      acc += c.chunk;
      c.citedFileIds?.forEach((id) => cited.add(id));
    }
    expect(acc.length).toBeGreaterThan(0);
    expect(cited.has('a')).toBe(true);
  });
});

describe('summarizeFile', () => {
  it('returns oneLine + extended for files with extracted text', async () => {
    const f = mk({ extractedText: 'First sentence. Second sentence. Third.' });
    const sum = await summarizeFile(f);
    expect(sum.oneLine.length).toBeGreaterThan(0);
    expect(sum.extended.length).toBeGreaterThan(0);
  });
  it('falls back to a metadata-only summary when no text', async () => {
    const sum = await summarizeFile(mk({ extractedText: '' }));
    expect(sum.oneLine).toMatch(/file/);
  });
});

describe('suggestFileTags', () => {
  it('suggests by keyword presence', async () => {
    const tags = await suggestFileTags(mk({ extractedText: 'Acme contract' }), []);
    expect(tags).toContain('contract');
  });
  it('falls back to kind-based tags', async () => {
    const tags = await suggestFileTags(mk({ kind: 'image', name: 'IMG_001.jpg' }), []);
    expect(tags).toContain('screenshot');
  });
});

describe('detectDuplicates', () => {
  it('groups by normalized name + size', async () => {
    const files: MockFileMeta[] = [
      mk({ id: 'a', name: 'report.pdf', size: 1000 }),
      mk({ id: 'b', name: 'report (copy).pdf', size: 1000 }),
    ];
    const groups = await detectDuplicates(files);
    expect(groups[0].fileIds.length).toBe(2);
    expect(groups[0].reason).toBe('name+size');
  });
});

describe('proposeOrganization', () => {
  it('creates folders for tag clusters of 2+', async () => {
    const files: MockFileMeta[] = [
      mk({ id: 'a', tags: ['design-review'] }),
      mk({ id: 'b', tags: ['design-review'] }),
      mk({ id: 'c', tags: ['invoice'] }),
    ];
    const proposal = await proposeOrganization('drive_root', files);
    expect(proposal.newFolders.length).toBeGreaterThanOrEqual(1);
    const moveCount = proposal.moves.filter((m) => files.find((f) => f.id === m.fileId && f.tags[0] === 'design-review')).length;
    expect(moveCount).toBe(2);
  });
});

describe('populateSpace', () => {
  it('returns ids of best matches for the definition', async () => {
    const files: MockFileMeta[] = [
      mk({ id: 'a', name: 'design review materials', tags: ['design-review'] }),
      mk({ id: 'b', name: 'unrelated' }),
    ];
    const ids = await populateSpace('design review materials', files);
    expect(ids[0]).toBe('a');
  });
});
