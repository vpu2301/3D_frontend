import type { JSONContent } from '@tiptap/react';
import type { Note, Notebook } from './types';
import { newId } from './storage';

const para = (...children: any[]): JSONContent => ({
  type: 'paragraph',
  content: children,
});

const text = (s: string, marks?: any[]): JSONContent => ({ type: 'text', text: s, ...(marks ? { marks } : {}) });

const heading = (level: number, s: string): JSONContent => ({
  type: 'heading',
  attrs: { level },
  content: [{ type: 'text', text: s }],
});

const bullet = (...items: string[]): JSONContent => ({
  type: 'bulletList',
  content: items.map((i) => ({
    type: 'listItem',
    content: [para(text(i))],
  })),
});

const tasks = (...items: { text: string; done?: boolean }[]): JSONContent => ({
  type: 'taskList',
  content: items.map((i) => ({
    type: 'taskItem',
    attrs: { checked: !!i.done },
    content: [para(text(i.text))],
  })),
});

function doc(...children: JSONContent[]): JSONContent {
  return { type: 'doc', content: children };
}

/** Inline wiki-link node — referenced by the WikiLink TipTap extension. */
function wikiLink(label: string, type: 'note' | 'doc' | 'event', targetId: string): JSONContent {
  return {
    type: 'wikiLink',
    attrs: { label, linkType: type, targetId },
  };
}

function tagNode(name: string): JSONContent {
  return {
    type: 'inlineTag',
    attrs: { name },
  };
}

export function buildNotesSeed(): { notes: Note[]; notebooks: Notebook[] } {
  const now = Date.now();
  const day = 86_400_000;

  const nbWork: Notebook = {
    id: 'nb_work',
    name: 'Work',
    color: '#3b82f6',
    createdAt: now,
  };
  const nbPersonal: Notebook = {
    id: 'nb_personal',
    name: 'Personal',
    color: '#10b981',
    createdAt: now,
  };
  const notebooks = [nbWork, nbPersonal];

  const mk = (overrides: Partial<Note>): Note => ({
    id: newId('note'),
    content: doc(para(text(''))),
    notebookId: null,
    tags: [],
    pinned: false,
    trashed: false,
    reminders: [],
    links: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });

  const notes: Note[] = [
    mk({
      id: 'note_welcome',
      title: 'Welcome to Notes',
      pinned: true,
      tags: ['welcome'],
      updatedAt: now,
      content: doc(
        heading(1, 'Welcome to Notes'),
        para(
          text(
            'Notes is a sibling module to Docs and Calendar — same shell, same AI conventions, lighter weight. Capture first, organize later.',
          ),
        ),
        heading(2, 'Try this'),
        bullet(
          'Press Cmd/Ctrl+Shift+N to quick-capture from anywhere.',
          'Type [[ to wiki-link to another note, doc, or event.',
          'Type # to add a tag inline.',
          'Highlight text and try Extract tasks or Extract decisions in the bubble menu.',
          'Open the AI sidebar (top right) and ask it questions across your notes.',
        ),
        heading(2, 'Cross-module'),
        para(
          text('This note links to a doc — '),
          wikiLink('PRD — Inline AI commands', 'doc', 'doc_prd'),
          text(' — and that doc can link back to this note.'),
        ),
      ),
    }),
    mk({
      id: 'note_q2_kickoff',
      title: 'Q2 kickoff — quick capture',
      tags: ['meeting', 'q2-planning'],
      notebookId: 'nb_work',
      updatedAt: now - 2 * 60_000,
      links: [{ type: 'doc', targetId: 'doc_meeting', label: 'Q2 kickoff — meeting notes' }],
      content: doc(
        heading(1, 'Q2 kickoff — quick capture'),
        para(text('Pre-meeting brain dump. Full notes will live in the doc — see ')),
        para(wikiLink('Q2 kickoff — meeting notes', 'doc', 'doc_meeting'), text('.')),
        heading(3, 'Things to raise'),
        bullet(
          'Latency budget for slash menu',
          'Diff-accept rollout plan',
          'Headcount ask for Q3',
        ),
        heading(3, 'Open questions'),
        bullet('How do we measure adoption?', 'Are we still shipping the comments work in Q2?'),
      ),
    }),
    mk({
      id: 'note_meeting_followups',
      title: 'Follow-ups from Q2 kickoff',
      tags: ['action-items', 'meeting'],
      notebookId: 'nb_work',
      updatedAt: now - 30 * 60_000,
      links: [
        { type: 'note', targetId: 'note_q2_kickoff', label: 'Q2 kickoff — quick capture' },
        { type: 'doc', targetId: 'doc_meeting', label: 'Q2 kickoff — meeting notes' },
      ],
      content: doc(
        heading(1, 'Follow-ups from Q2 kickoff'),
        para(text('Threads opened in '), wikiLink('Q2 kickoff — quick capture', 'note', 'note_q2_kickoff'), text('.')),
        tasks(
          { text: 'Draft the launch comms by Friday' },
          { text: 'Schedule a usability round with five users' },
          { text: 'Sync with Sam about the persona spec', done: true },
        ),
      ),
    }),
    mk({
      id: 'note_decisions',
      title: 'Decisions log — week of Apr 21',
      tags: ['decision', 'review'],
      notebookId: 'nb_work',
      updatedAt: now - 8 * 3600_000,
      content: doc(
        heading(1, 'Decisions log — week of Apr 21'),
        bullet(
          'Decided to ship diff-accept before broad rollout. Reason: undo loses fidelity.',
          'Decided not to add real-time collab to v0.2 — separate workstream.',
          'Will keep ghost-text default-on in Notes; user can disable in settings.',
        ),
      ),
    }),
    mk({
      id: 'note_ideas',
      title: 'Half-formed ideas',
      tags: ['idea'],
      notebookId: 'nb_work',
      updatedAt: now - day,
      content: doc(
        heading(1, 'Half-formed ideas'),
        bullet(
          'A keyboard-only outliner where headings collapse like a tree.',
          'Diff-native git client where every commit is a reviewable proposal.',
          'Voice-first journaling that auto-summarizes your week each Sunday.',
        ),
      ),
    }),
    mk({
      id: 'note_reading',
      title: 'Reading queue',
      tags: ['research', 'personal'],
      notebookId: 'nb_personal',
      updatedAt: now - 2 * day,
      content: doc(
        heading(1, 'Reading queue'),
        bullet(
          '"Working in Public" — Eghbal',
          '"How Buildings Learn" — Brand',
          '"The Design of Everyday Things" — Norman',
        ),
        para(text('Maps to '), tagNode('research'), text(' tag.')),
      ),
    }),
    mk({
      id: 'note_groceries',
      title: 'Groceries',
      tags: ['personal'],
      notebookId: 'nb_personal',
      updatedAt: now - 3 * 3600_000,
      content: doc(
        heading(1, 'Groceries'),
        tasks(
          { text: 'Olive oil', done: false },
          { text: 'Pecorino', done: false },
          { text: 'Black peppercorns', done: false },
          { text: 'Spaghetti', done: true },
        ),
      ),
    }),
    mk({
      id: 'note_essay',
      title: 'On writing surfaces — scratch',
      tags: ['idea', 'writing'],
      notebookId: 'nb_work',
      updatedAt: now - 4 * day,
      links: [{ type: 'doc', targetId: 'doc_essay', label: 'On writing surfaces' }],
      content: doc(
        heading(1, 'On writing surfaces — scratch'),
        para(
          text('First-pass scratch for the essay — the polished version lives in '),
          wikiLink('On writing surfaces', 'doc', 'doc_essay'),
          text('.'),
        ),
        para(text('Premise: the model is not the product. The writing surface is the product.')),
      ),
    }),
    mk({
      id: 'note_reminder',
      title: 'Prep for design review',
      tags: ['meeting'],
      notebookId: 'nb_work',
      updatedAt: now - 60_000,
      reminders: [
        {
          id: newId('rem'),
          noteId: 'note_reminder',
          dueAt: now + 2 * 3600_000,
          calendarEventId: 'cal_mock_reminder_1',
          dismissed: false,
        },
      ],
      content: doc(
        heading(1, 'Prep for design review'),
        bullet(
          'Walk through the slash menu redesign',
          'Show the diff-accept demo recording',
          'Ask for input on AI-block defaults',
        ),
      ),
    }),
    mk({
      id: 'note_quick',
      title: 'Random thought',
      updatedAt: now - 15 * 60_000,
      content: doc(
        para(
          text(
            'What if the dashboard surfaced "decisions made this week" as a smart view by default? Cheap to compute and high-value.',
          ),
        ),
      ),
    }),
    mk({
      id: 'note_mtg_template',
      title: 'Standup notes — Apr 28',
      tags: ['meeting', 'standup'],
      notebookId: 'nb_work',
      updatedAt: now - 18 * 3600_000,
      content: doc(
        heading(1, 'Standup — Apr 28'),
        heading(3, 'Yesterday'),
        bullet('Shipped diff-accept prototype', 'Reviewed two PRs'),
        heading(3, 'Today'),
        bullet('Polish slash menu', 'Pair with Priya on Notes integration'),
        heading(3, 'Blockers'),
        bullet('None'),
      ),
    }),
    mk({
      id: 'note_recipes',
      title: 'Cacio e pepe — fix attempts',
      tags: ['personal', 'cooking'],
      notebookId: 'nb_personal',
      updatedAt: now - 5 * day,
      content: doc(
        heading(1, 'Cacio e pepe — fix attempts'),
        bullet(
          'Drier pasta water this time — cheese clumped less.',
          'Took pan off heat before adding pecorino — clear improvement.',
          'Next try: bloom pepper longer in oil.',
        ),
      ),
    }),
    mk({
      id: 'note_open_tasks',
      title: 'This week',
      tags: ['action-items', 'review'],
      notebookId: 'nb_work',
      updatedAt: now - 5 * 3600_000,
      content: doc(
        heading(1, 'This week'),
        tasks(
          { text: 'Finish the Notes module' },
          { text: 'Pair with Sam on AI sidebar polish' },
          { text: 'Send Friday update', done: false },
          { text: 'Refill kitchen coffee', done: true },
        ),
      ),
    }),
    mk({
      id: 'note_retrospective',
      title: 'Retro — last sprint',
      tags: ['review', 'retrospective'],
      notebookId: 'nb_work',
      updatedAt: now - 6 * day,
      content: doc(
        heading(1, 'Retro — last sprint'),
        heading(3, 'What went well'),
        bullet('Diff-accept landed cleanly', 'Two productive 1:1s'),
        heading(3, "What didn't"),
        bullet('Lost half a day to a TipTap schema bug', 'Skipped the gym twice'),
        heading(3, 'Try next sprint'),
        bullet('Block 90 minutes for deep work in the morning'),
      ),
    }),
    mk({
      id: 'note_quick_capture_demo',
      title: 'Random — talked to Jules',
      updatedAt: now - 25 * 60_000,
      content: doc(
        para(
          text(
            'Jules pushed back on the AI auto-tagging UX — too noisy when working on personal notes. Suggestion: surface only when 3+ keyword matches. Worth a try.',
          ),
        ),
      ),
    }),
  ];

  return { notes, notebooks };
}
