import { describe, it, expect } from 'vitest';
import { classifyFile, formatBytes } from '@/pages/drive/_lib/fileTypes';

describe('classifyFile', () => {
  it('classifies images', () => {
    expect(classifyFile({ mimeType: 'image/png', name: 'a.png' })).toBe('image');
    expect(classifyFile({ mimeType: 'image/jpeg', name: 'a.jpg' })).toBe('image');
  });
  it('classifies pdf', () => {
    expect(classifyFile({ mimeType: 'application/pdf', name: 'a.pdf' })).toBe('pdf');
    expect(classifyFile({ name: 'a.pdf' })).toBe('pdf');
  });
  it('classifies markdown', () => {
    expect(classifyFile({ name: 'README.md' })).toBe('markdown');
    expect(classifyFile({ mimeType: 'text/markdown', name: 'a.md' })).toBe('markdown');
  });
  it('classifies code by extension', () => {
    expect(classifyFile({ name: 'App.tsx' })).toBe('code');
    expect(classifyFile({ name: 'main.py' })).toBe('code');
  });
  it('classifies office', () => {
    expect(classifyFile({ name: 'plan.docx' })).toBe('office');
    expect(classifyFile({ name: 'plan.xlsx' })).toBe('office');
  });
  it('classifies archive', () => {
    expect(classifyFile({ name: 'export.zip' })).toBe('archive');
  });
  it('respects sourceModule', () => {
    expect(classifyFile({ name: 'x', sourceModule: 'docs' })).toBe('doc');
    expect(classifyFile({ name: 'x', sourceModule: 'notes' })).toBe('note');
  });
  it('falls back to other', () => {
    expect(classifyFile({ name: 'x.weirdthing' })).toBe('other');
  });
});

describe('formatBytes', () => {
  it('formats by unit', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(2048)).toMatch(/^2\.0 KB$/);
    expect(formatBytes(2 * 1024 * 1024)).toMatch(/MB$/);
    expect(formatBytes(2 * 1024 * 1024 * 1024)).toMatch(/GB$/);
  });
  it('handles undefined', () => {
    expect(formatBytes(undefined)).toBe('—');
  });
});
