import type { DriveItem, Space } from './types';
import { newId } from './storage';

const ME = 'user_me';
const SAM = 'user_sam';
const PRIYA = 'user_priya';
const JULES = 'user_jules';

let counter = 0;
function id(prefix: string): string {
  counter += 1;
  return `${prefix}_${counter}_${Math.random().toString(36).slice(2, 8)}`;
}

const now = Date.now();
const day = 86_400_000;

export function buildDriveSeed(): { items: DriveItem[]; spaces: Space[] } {
  const items: DriveItem[] = [];

  // Folders
  const fRoot: DriveItem = mkFolder({
    id: 'drive_root',
    name: 'My Drive',
    parentId: null,
    emoji: '🗂️',
  });
  const fWork = mkFolder({
    id: 'drive_work',
    name: 'Work',
    parentId: 'drive_root',
    color: '#3b82f6',
  });
  const fProjects = mkFolder({
    id: 'drive_projects',
    name: 'Projects',
    parentId: 'drive_work',
    color: '#6366f1',
  });
  const fDesignReview = mkFolder({
    id: 'drive_design_review',
    name: 'Design review — Apr',
    parentId: 'drive_projects',
    color: '#10b981',
    emoji: '🎨',
  });
  const fPersonal = mkFolder({
    id: 'drive_personal',
    name: 'Personal',
    parentId: 'drive_root',
    color: '#10b981',
  });
  const fInvoices = mkFolder({
    id: 'drive_invoices',
    name: 'Invoices',
    parentId: 'drive_personal',
    color: '#ef4444',
    emoji: '🧾',
  });
  items.push(fRoot, fWork, fProjects, fDesignReview, fPersonal, fInvoices);

  // Files in Work / Projects / Design review
  items.push(
    mkFile({
      id: 'drive_pdf_prd',
      name: 'PRD — Inline AI commands.pdf',
      parentId: 'drive_design_review',
      mimeType: 'application/pdf',
      size: 1.2 * 1024 * 1024,
      tags: ['design-review', 'q2-planning'],
      summary: {
        oneLine: 'PRD covering inline AI commands, presets, and the diff-accept flow.',
        extended:
          'Problem: writers context-switch out of the document to ask an LLM, paste the answer back, and clean it up.\n\nSolution: bring the model into the writing surface. Cmd+J on a cursor; preset actions on selection; ghost-text completion as you type. Every output renders as a diff the writer accepts or rejects.\n\nNon-goals: real-time collaboration sync, mobile editing parity. Risks: latency budget on streaming, diff conflicts when the document changes mid-stream.',
      },
      extractedText:
        'PRD — Inline AI commands. Problem: writers context-switch out of the document to ask an LLM. Solution: bring the model into the writing surface. Cmd+J on a cursor; preset actions on selection. Every output renders as a diff. Non-goals: real-time collaboration sync. Risks: latency budget on streaming.',
      activity: [
        { id: id('act'), at: now - 2 * day, by: ME, kind: 'uploaded' },
        { id: id('act'), at: now - 1 * day, by: SAM, kind: 'viewed' },
      ],
    }),
    mkFile({
      id: 'drive_image_mock1',
      name: 'editor-mock-v3.png',
      parentId: 'drive_design_review',
      mimeType: 'image/png',
      size: 580 * 1024,
      tags: ['design-review', 'screenshot'],
      summary: { oneLine: 'Mockup of the editor toolbar with the AI bubble menu open.', extended: '' },
    }),
    mkFile({
      id: 'drive_image_mock2',
      name: 'slash-menu-final.png',
      parentId: 'drive_design_review',
      mimeType: 'image/png',
      size: 410 * 1024,
      tags: ['design-review', 'screenshot'],
    }),
    mkFile({
      id: 'drive_video_walkthrough',
      name: 'editor-walkthrough.mp4',
      parentId: 'drive_design_review',
      mimeType: 'video/mp4',
      size: 4.2 * 1024 * 1024,
      durationSeconds: 132,
      tags: ['recording'],
      summary: {
        oneLine: 'Two-minute walkthrough of the editor — slash menu, bubble menu, AI sidebar.',
        extended: '',
      },
    }),
    mkFile({
      id: 'drive_audio_standup',
      name: 'standup-apr-28.m4a',
      parentId: 'drive_work',
      mimeType: 'audio/mp4',
      size: 1.8 * 1024 * 1024,
      durationSeconds: 360,
      tags: ['recording', 'meeting'],
    }),
    mkFile({
      id: 'drive_md_changelog',
      name: 'CHANGELOG.md',
      parentId: 'drive_projects',
      mimeType: 'text/markdown',
      size: 2400,
      tags: ['engineering'],
      extractedText:
        '# Changelog\n\n## Apr 28\n- Slash menu now respects keyboard nav.\n\n## Apr 25\n- Bubble menu condensed; "Ask AI" promoted.\n\n## Apr 22\n- Autosave debounce dropped to 500ms.',
      summary: {
        oneLine: 'Running internal changelog with three recent entries.',
        extended: '',
      },
    }),
    mkFile({
      id: 'drive_code_app',
      name: 'App.tsx',
      parentId: 'drive_projects',
      mimeType: 'text/typescript',
      size: 14_000,
      tags: ['code'],
      extractedText:
        'import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";\nimport { Suspense, lazy } from "react";\n// Routes for the platform — Docs, Notes, Drive, Calendar, etc.',
    }),
    mkFile({
      id: 'drive_code_seed',
      name: 'seed.ts',
      parentId: 'drive_projects',
      mimeType: 'text/typescript',
      size: 6800,
      tags: ['code'],
      extractedText: 'export function buildSeed() { /* … */ }',
    }),
    mkFile({
      id: 'drive_pdf_contract',
      name: 'Acme — service agreement.pdf',
      parentId: 'drive_work',
      mimeType: 'application/pdf',
      size: 880 * 1024,
      tags: ['contract'],
      extractedText:
        'Service agreement between Acme Corp and the provider. Term: 12 months. Payment terms: net 30. Termination: 60-day notice. Confidentiality clause covers all materials shared during the engagement.',
      summary: {
        oneLine: 'Acme service agreement — 12-month term, net 30, 60-day termination.',
        extended:
          'This service agreement establishes a 12-month engagement between Acme Corp and the provider, with net-30 payment terms and a 60-day termination notice.\n\nThe confidentiality clause covers all materials shared during the engagement, including pre-existing intellectual property.\n\nNotable risk: the auto-renewal language in section 7 should be flagged for review before signature.',
      },
    }),
    mkFile({
      id: 'drive_zip_export',
      name: 'site-export-april.zip',
      parentId: 'drive_work',
      mimeType: 'application/zip',
      size: 3.2 * 1024 * 1024,
      tags: ['archive'],
      archiveManifest: [
        { name: 'index.html', size: 12_400 },
        { name: 'styles.css', size: 8800 },
        { name: 'assets/logo.png', size: 41_200 },
        { name: 'assets/hero.jpg', size: 220_000 },
        { name: 'README.md', size: 1100 },
      ],
    }),
    // Personal
    mkFile({
      id: 'drive_image_berlin1',
      name: 'berlin-trip-001.jpg',
      parentId: 'drive_personal',
      mimeType: 'image/jpeg',
      size: 1.4 * 1024 * 1024,
      tags: ['photo', 'trip'],
    }),
    mkFile({
      id: 'drive_image_berlin2',
      name: 'berlin-trip-002.jpg',
      parentId: 'drive_personal',
      mimeType: 'image/jpeg',
      size: 1.5 * 1024 * 1024,
      tags: ['photo', 'trip'],
    }),
    mkFile({
      id: 'drive_image_berlin3',
      name: 'berlin-trip-003.jpg',
      parentId: 'drive_personal',
      mimeType: 'image/jpeg',
      size: 1.3 * 1024 * 1024,
      tags: ['photo', 'trip'],
    }),
    mkFile({
      id: 'drive_pdf_invoice1',
      name: 'invoice-2026-04-01.pdf',
      parentId: 'drive_invoices',
      mimeType: 'application/pdf',
      size: 220 * 1024,
      tags: ['invoice'],
      extractedText:
        'Invoice #2026-04-01. Amount due: $4,200. Due date: 2026-04-30. Vendor: Acme Corp.',
      summary: {
        oneLine: 'Invoice #2026-04-01 from Acme Corp — $4,200 due Apr 30.',
        extended: '',
      },
    }),
    mkFile({
      id: 'drive_pdf_invoice2',
      name: 'invoice-2026-04-15.pdf',
      parentId: 'drive_invoices',
      mimeType: 'application/pdf',
      size: 240 * 1024,
      tags: ['invoice'],
    }),
    mkFile({
      id: 'drive_md_notes_export',
      name: 'reading-list-export.md',
      parentId: 'drive_personal',
      mimeType: 'text/markdown',
      size: 1900,
      tags: ['reading', 'export'],
      extractedText: '# Reading list\n\n- "Working in Public" — Eghbal\n- "How Buildings Learn" — Brand',
    }),
    // Loose files in root
    mkFile({
      id: 'drive_pdf_research',
      name: 'streaming-ux-paper.pdf',
      parentId: 'drive_root',
      mimeType: 'application/pdf',
      size: 720 * 1024,
      tags: ['research'],
      extractedText:
        'A study of streaming UX in AI-mediated writing tools. The authors find that token-by-token streaming below 50ms per token is rated "responsive" by 78% of participants. Above 200ms per token, perceived responsiveness drops sharply.',
      summary: {
        oneLine: 'Streaming UX in AI writing tools — sub-50ms tokens are rated responsive.',
        extended: '',
      },
    }),
    mkFile({
      id: 'drive_screenshot_landing',
      name: 'landing-mock.png',
      parentId: 'drive_root',
      mimeType: 'image/png',
      size: 290 * 1024,
      tags: ['screenshot', 'landing'],
    }),
    mkFile({
      id: 'drive_video_intro',
      name: 'intro.mp4',
      parentId: 'drive_root',
      mimeType: 'video/mp4',
      size: 5.0 * 1024 * 1024,
      durationSeconds: 84,
      tags: ['recording'],
    }),
    // Cross-module virtual entries — these reference Docs/Notes by sourceModule.
    mkVirtual('docs', 'doc_welcome', 'Welcome to your AI workspace', 'drive_root', ['platform']),
    mkVirtual('docs', 'doc_meeting', 'Q2 kickoff — meeting notes', 'drive_design_review', ['meeting', 'q2-planning']),
    mkVirtual('docs', 'doc_prd', 'PRD — Inline AI commands', 'drive_design_review', ['design-review']),
    mkVirtual('docs', 'doc_essay', 'On writing surfaces', 'drive_root', ['writing']),
    mkVirtual('notes', 'note_q2_kickoff', 'Q2 kickoff — quick capture', 'drive_design_review', ['meeting']),
    mkVirtual('notes', 'note_meeting_followups', 'Follow-ups from Q2 kickoff', 'drive_work', ['action-items']),
    mkVirtual('notes', 'note_decisions', 'Decisions log — week of Apr 21', 'drive_work', ['decision']),
    mkVirtual('notes', 'note_ideas', 'Half-formed ideas', 'drive_work', ['idea']),
  );

  // Mark a couple of files starred and one shared
  for (const f of items) {
    if (f.id === 'drive_pdf_prd' || f.id === 'drive_pdf_research') f.starred = true;
    if (f.id === 'drive_pdf_prd') {
      f.sharedWith = [
        { userId: SAM, role: 'editor' },
        { userId: PRIYA, role: 'commenter' },
      ];
    }
    if (f.id === 'drive_video_walkthrough') {
      f.sharedWith = [{ userId: JULES, role: 'viewer' }];
    }
  }

  // Spaces — system-curated.
  const spaces: Space[] = [
    {
      id: 'space_recent_meetings',
      name: 'Recent meetings',
      definition: 'Files attached to recent meetings — notes, recordings, decks',
      isAiCurated: true,
      emoji: '👥',
      fileIds: [
        'drive_audio_standup',
        'drive_video_walkthrough',
        'doc_meeting',
        'note_q2_kickoff',
        'note_meeting_followups',
      ].map(toVirtualId),
      lastComputedAt: now,
    },
    {
      id: 'space_active_projects',
      name: 'Active projects',
      definition: 'Files modified by you and collaborators in the last 14 days',
      isAiCurated: true,
      emoji: '🚀',
      fileIds: [
        'drive_pdf_prd',
        'drive_image_mock1',
        'drive_image_mock2',
        'drive_md_changelog',
        'doc_prd',
      ].map(toVirtualId),
      lastComputedAt: now,
    },
    {
      id: 'space_to_review',
      name: 'To review',
      definition: 'Files shared with you that you haven\'t opened yet',
      isAiCurated: true,
      emoji: '🔎',
      fileIds: ['drive_video_walkthrough'],
      lastComputedAt: now,
    },
    {
      id: 'space_lookalike_images',
      name: 'Lookalike images',
      definition: 'Image clusters by mock similarity',
      isAiCurated: true,
      emoji: '🖼️',
      fileIds: ['drive_image_berlin1', 'drive_image_berlin2', 'drive_image_berlin3'],
      lastComputedAt: now,
    },
  ];

  return { items, spaces };
}

function toVirtualId(idOrSourceId: string): string {
  // Cross-module virtual ids in the seeded space lists are stored as the
  // doc/note id directly; the resolver maps them at render time. Pure-Drive
  // ids pass through unchanged.
  return idOrSourceId;
}

function mkFolder(p: Partial<DriveItem> & { id: string; name: string; parentId: string | null }): DriveItem {
  return {
    id: p.id,
    name: p.name,
    type: 'folder',
    parentId: p.parentId,
    ownerId: ME,
    sharedWith: [],
    starred: false,
    trashed: false,
    tags: [],
    color: p.color,
    emoji: p.emoji,
    createdAt: now - 30 * day,
    updatedAt: now - 1 * day,
  };
}

function mkFile(
  p: Partial<DriveItem> & {
    id: string;
    name: string;
    parentId: string | null;
    mimeType: string;
    size: number;
    tags: string[];
  },
): DriveItem {
  return {
    id: p.id,
    name: p.name,
    type: 'file',
    parentId: p.parentId,
    ownerId: ME,
    sharedWith: [],
    starred: false,
    trashed: false,
    tags: p.tags,
    createdAt: now - 14 * day,
    updatedAt: now - Math.floor(Math.random() * 6) * day,
    mimeType: p.mimeType,
    size: p.size,
    summary: p.summary,
    extractedText: p.extractedText,
    archiveManifest: p.archiveManifest,
    blobKey: p.blobKey,
    versions: p.versions,
    activity: p.activity ?? [{ id: id('act'), at: now - 14 * day, by: ME, kind: 'uploaded' }],
    durationSeconds: p.durationSeconds,
  };
}

function mkVirtual(
  sourceModule: 'docs' | 'notes',
  sourceId: string,
  name: string,
  parentId: string | null,
  tags: string[],
): DriveItem {
  return {
    id: sourceId,
    name,
    type: 'file',
    parentId,
    ownerId: ME,
    sharedWith: [],
    starred: false,
    trashed: false,
    tags,
    createdAt: now - 14 * day,
    updatedAt: now - 2 * day,
    sourceModule,
    sourceId,
    activity: [{ id: id('act'), at: now - 14 * day, by: ME, kind: 'uploaded' }],
  };
}
