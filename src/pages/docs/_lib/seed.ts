import type { JSONContent } from '@tiptap/react';
import type { Doc, Folder, DocTemplate } from '@/pages/docs/_lib/types';
import { newId } from './storage';

const para = (text: string): JSONContent => ({
  type: 'paragraph',
  content: [{ type: 'text', text }],
});

const heading = (level: number, text: string): JSONContent => ({
  type: 'heading',
  attrs: { level },
  content: [{ type: 'text', text }],
});

const bullet = (...items: string[]): JSONContent => ({
  type: 'bulletList',
  content: items.map((i) => ({
    type: 'listItem',
    content: [para(i)],
  })),
});

const tasks = (...items: { text: string; done?: boolean }[]): JSONContent => ({
  type: 'taskList',
  content: items.map((i) => ({
    type: 'taskItem',
    attrs: { checked: !!i.done },
    content: [para(i.text)],
  })),
});

function doc(...children: JSONContent[]): JSONContent {
  return { type: 'doc', content: children };
}

export const TEMPLATES: DocTemplate[] = [
  {
    id: 'blank',
    name: 'Blank',
    description: 'Start from an empty page.',
    icon: 'FileText',
    content: doc(para('')),
    suggestedPrompts: ['Outline a document about…', 'Draft an introduction for…'],
  },
  {
    id: 'meeting',
    name: 'Meeting notes',
    description: 'Structured notes with attendees, agenda, and action items.',
    icon: 'CalendarClock',
    content: doc(
      heading(1, 'Meeting notes'),
      heading(3, 'Attendees'),
      bullet('You', 'Teammate'),
      heading(3, 'Agenda'),
      bullet('Status update', 'Risks', 'Next steps'),
      heading(3, 'Notes'),
      para(''),
      heading(3, 'Action items'),
      tasks({ text: 'First action item', done: false }),
    ),
    suggestedPrompts: ['Summarize the notes above', 'Extract action items'],
  },
  {
    id: 'prd',
    name: 'PRD',
    description: 'Product requirements document.',
    icon: 'ClipboardList',
    content: doc(
      heading(1, 'PRD: <product name>'),
      heading(2, 'Problem'),
      para('What user pain are we solving, and for whom?'),
      heading(2, 'Goals'),
      bullet('Primary goal', 'Secondary goals'),
      heading(2, 'Non-goals'),
      bullet('Out of scope for v1'),
      heading(2, 'Solution'),
      para('High-level approach.'),
      heading(2, 'Open questions'),
      bullet('Question one'),
    ),
    suggestedPrompts: ['Critique this PRD', 'Suggest success metrics'],
  },
  {
    id: 'blog',
    name: 'Blog post',
    description: 'Long-form article with hook, body, and takeaway.',
    icon: 'PenLine',
    content: doc(
      heading(1, 'Working title'),
      para('A one-sentence hook that promises the reader something specific.'),
      heading(2, 'Why this matters'),
      para('Context. The reader should feel the stakes by the end of this paragraph.'),
      heading(2, 'The argument'),
      para('Build the case here.'),
      heading(2, 'Takeaway'),
      para('What should the reader do next?'),
    ),
    suggestedPrompts: ['Improve the hook', 'Make this more conversational'],
  },
  {
    id: 'review',
    name: 'Weekly review',
    description: 'Reflect on the week and plan the next.',
    icon: 'CalendarRange',
    content: doc(
      heading(1, 'Weekly review'),
      heading(2, 'What went well'),
      bullet('…'),
      heading(2, 'What did not'),
      bullet('…'),
      heading(2, 'Next week'),
      tasks({ text: 'Top priority' }),
    ),
    suggestedPrompts: ['Summarize the week', 'Surface patterns across recent reviews'],
  },
];

export function buildSeed(): { docs: Doc[]; folders: Folder[] } {
  const now = Date.now();
  const fWork: Folder = { id: 'folder_work', name: 'Work', createdAt: now };
  const fPersonal: Folder = { id: 'folder_personal', name: 'Personal', createdAt: now };
  const fIdeas: Folder = { id: 'folder_ideas', name: 'Ideas', parentId: 'folder_work', createdAt: now };

  const folders = [fWork, fPersonal, fIdeas];

  const mk = (overrides: Partial<Doc>): Doc => ({
    id: newId('doc'),
    title: 'Untitled',
    content: doc(para('')),
    starred: false,
    trashed: false,
    shared: false,
    folderId: null,
    createdAt: now,
    updatedAt: now,
    snapshots: [],
    comments: [],
    ...overrides,
  });

  const docs: Doc[] = [
    mk({
      id: 'doc_welcome',
      title: 'Welcome to your AI workspace',
      icon: '👋',
      folderId: null,
      starred: true,
      summary: 'A short orientation to the editor, AI co-pilot, and dashboard.',
      content: doc(
        heading(1, 'Welcome to your AI workspace'),
        para(
          'This is an AI-native writing surface. Highlight any text to open the bubble menu and ask AI to improve, shorten, translate, or rewrite it. Press the / key to open the slash menu.',
        ),
        heading(2, 'Try this'),
        bullet(
          'Select a sentence and click "Ask AI" in the bubble menu.',
          'Press Cmd/Ctrl+J to open the inline AI prompt.',
          'Open the AI sidebar (top right) and ask it to "rewrite section 2 in bullets".',
          'Type / on a new line to insert a heading, list, or AI block.',
        ),
        heading(2, 'AI blocks'),
        para(
          'Insert /ai-summary to generate a TL;DR of the doc above. Insert /ai-outline for a live table of contents. Insert /ai-prompt to save a reusable prompt that re-runs on demand.',
        ),
        para('Everything is mocked locally — no API keys, no network. Try it.'),
      ),
    }),
    mk({
      id: 'doc_meeting',
      title: 'Q2 kickoff — meeting notes',
      icon: '🗓️',
      folderId: 'folder_work',
      summary: 'Notes from the Q2 kickoff: priorities, risks, and the first three action items.',
      content: doc(
        heading(1, 'Q2 kickoff'),
        heading(3, 'Attendees'),
        bullet('Sam', 'Priya', 'Jules', 'You'),
        heading(3, 'Priorities'),
        bullet(
          'Ship the new editor surface to early-access by week 4.',
          'Land the diff-accept flow before broad rollout.',
          'Cut latency on the slash menu.',
        ),
        heading(3, 'Action items'),
        tasks(
          { text: 'Draft the launch comms by Friday', done: false },
          { text: 'Finalize the persona spec', done: true },
          { text: 'Schedule a usability round with five users', done: false },
        ),
      ),
    }),
    mk({
      id: 'doc_prd',
      title: 'PRD — Inline AI commands',
      icon: '📐',
      folderId: 'folder_work',
      summary: 'Why inline AI commands matter, what the v1 looks like, and what we explicitly punt.',
      content: doc(
        heading(1, 'PRD — Inline AI commands'),
        heading(2, 'Problem'),
        para(
          'Writers context-switch out of the document to ask an LLM, paste the answer back, and clean it up. The cost is broken flow.',
        ),
        heading(2, 'Solution'),
        para(
          'Bring the model into the writing surface. Cmd+J on a cursor; preset actions on selection; ghost-text completion as you type. Every output renders as a diff the writer accepts or rejects.',
        ),
        heading(2, 'Non-goals'),
        bullet('Real-time collaboration sync (separate workstream).', 'Mobile editing parity.'),
        heading(2, 'Risks'),
        bullet('Latency budget on streaming.', 'Diff conflicts when the document changes mid-stream.'),
      ),
    }),
    mk({
      id: 'doc_essay',
      title: 'On writing surfaces',
      icon: '✍️',
      folderId: 'folder_ideas',
      summary: 'A short essay on why the editor — not the model — is the product.',
      content: doc(
        heading(1, 'On writing surfaces'),
        para(
          'The model is not the product. The writing surface is the product. The model is the engine, but the surface is the thing the writer touches every minute, and the texture of that touch is what determines whether the tool is loved or merely used.',
        ),
        para(
          'A good surface vanishes. It does not draw attention to itself. AI affordances should obey the same rule: discoverable when summoned, invisible when not.',
        ),
      ),
    }),
    mk({
      id: 'doc_review',
      title: 'Weekly review — Apr 21',
      icon: '🪞',
      folderId: 'folder_personal',
      summary: 'Wins, misses, and the three things going on the next-week list.',
      content: doc(
        heading(1, 'Weekly review — Apr 21'),
        heading(2, 'What went well'),
        bullet('Shipped the diff-accept prototype.', 'Two productive 1:1s.'),
        heading(2, 'What did not'),
        bullet('Lost a half-day to a TipTap schema bug.', 'Skipped the gym twice.'),
        heading(2, 'Next week'),
        tasks(
          { text: 'Cut a v0.2 with the slash menu polished' },
          { text: 'Get back to two gym sessions' },
        ),
      ),
    }),
    mk({
      id: 'doc_blog',
      title: 'Draft — why diffs beat overwrites',
      icon: '🟢',
      folderId: 'folder_work',
      starred: true,
      summary: 'Argues that diff-accept is the right default for AI editing surfaces.',
      content: doc(
        heading(1, 'Why diffs beat overwrites'),
        para(
          'Most AI writing tools overwrite the user\'s text and trust the user to undo. That trust is misplaced. Undo loses fidelity, the writer loses faith, and the tool loses the writer.',
        ),
        para(
          'The fix is not better models. The fix is a UI default: every AI edit renders as a diff the writer reviews before it lands.',
        ),
      ),
    }),
    mk({
      id: 'doc_reading',
      title: 'Reading list',
      icon: '📚',
      folderId: 'folder_personal',
      summary: 'Books and essays queued up for the next month.',
      content: doc(
        heading(1, 'Reading list'),
        bullet(
          '"The Design of Everyday Things" — Norman',
          '"Working in Public" — Eghbal',
          '"How Buildings Learn" — Brand',
        ),
      ),
    }),
    mk({
      id: 'doc_idea_dump',
      title: 'Idea dump',
      icon: '💡',
      folderId: 'folder_ideas',
      summary: 'Half-formed ideas, kept here so they don\'t leak into other docs.',
      content: doc(
        heading(1, 'Idea dump'),
        bullet(
          'A keyboard-only outliner where headings collapse like a tree.',
          'Diff-native git client where every commit is a reviewable proposal before it lands.',
          'Voice-first journaling that auto-summarizes your week each Sunday.',
        ),
      ),
    }),
    mk({
      id: 'doc_recipes',
      title: 'Pasta — quick reference',
      icon: '🍝',
      folderId: 'folder_personal',
      summary: 'Three pasta recipes I keep coming back to.',
      content: doc(
        heading(1, 'Pasta — quick reference'),
        heading(2, 'Cacio e pepe'),
        bullet('Salt the water heavily.', 'Reserve pasta water before draining.', 'Toss off heat with pecorino and pepper.'),
        heading(2, 'Aglio e olio'),
        bullet('Slice garlic thin.', 'Bloom in olive oil with chili.', 'Finish with parsley.'),
      ),
    }),
    mk({
      id: 'doc_changelog',
      title: 'Changelog — internal',
      icon: '📝',
      folderId: 'folder_work',
      summary: 'Running list of recent changes, smallest at the bottom.',
      content: doc(
        heading(1, 'Changelog'),
        heading(3, 'Apr 28'),
        bullet('Slash menu now respects keyboard nav.'),
        heading(3, 'Apr 25'),
        bullet('Bubble menu condensed; "Ask AI" promoted.'),
        heading(3, 'Apr 22'),
        bullet('Autosave debounce dropped to 500ms.'),
      ),
    }),
  ];

  return { docs, folders };
}
