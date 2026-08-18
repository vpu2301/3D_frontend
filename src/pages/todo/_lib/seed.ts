import type { Task, Project, List, SmartList, Priority } from './types';

const now = Date.now();
const day = 86_400_000;
let counter = 0;
const id = (prefix: string) => `${prefix}_${++counter}_${Math.random().toString(36).slice(2, 8)}`;

export function buildTodoSeed(): {
  tasks: Task[];
  projects: Project[];
  lists: List[];
  smartLists: SmartList[];
} {
  const projects: Project[] = [
    {
      id: 'proj_q2_launch',
      name: 'Q2 launch',
      emoji: '🚀',
      color: '#3b82f6',
      archived: false,
      deadline: now + 30 * day,
      linkedDocIds: ['doc_prd', 'doc_meeting'],
      linkedNoteIds: ['note_q2_kickoff'],
      linkedFileIds: ['drive_pdf_prd'],
      createdAt: now - 14 * day,
    },
    {
      id: 'proj_writing',
      name: 'Writing',
      emoji: '✍️',
      color: '#8b5cf6',
      archived: false,
      linkedDocIds: ['doc_essay'],
      linkedNoteIds: ['note_essay'],
      linkedFileIds: [],
      createdAt: now - 21 * day,
    },
    {
      id: 'proj_personal',
      name: 'Personal',
      emoji: '🏡',
      color: '#10b981',
      archived: false,
      linkedDocIds: [],
      linkedNoteIds: ['note_reading'],
      linkedFileIds: [],
      createdAt: now - 30 * day,
    },
  ];

  const lists: List[] = [
    {
      id: 'list_kickoff',
      name: 'Kickoff prep',
      projectId: 'proj_q2_launch',
      emoji: '📋',
      archived: false,
      createdAt: now - 10 * day,
    },
    {
      id: 'list_launch',
      name: 'Launch checklist',
      projectId: 'proj_q2_launch',
      emoji: '✅',
      archived: false,
      createdAt: now - 5 * day,
    },
    {
      id: 'list_essay',
      name: 'Writing surfaces essay',
      projectId: 'proj_writing',
      emoji: '📝',
      archived: false,
      createdAt: now - 7 * day,
    },
    {
      id: 'list_errands',
      name: 'Errands',
      projectId: 'proj_personal',
      emoji: '🛒',
      archived: false,
      createdAt: now - 14 * day,
    },
  ];

  const mk = (over: Partial<Task>): Task => ({
    id: id('task'),
    title: 'Untitled',
    completed: false,
    reminders: [],
    priority: 3,
    tags: [],
    attachments: [],
    activity: [{ id: id('act'), type: 'created', at: now - 2 * day }],
    order: 0,
    trashed: false,
    createdAt: now - 2 * day,
    updatedAt: now - 2 * day,
    ...over,
  });

  // 25 mock tasks
  const tasks: Task[] = [
    // ----- Today / overdue (no project — Inbox-like) -----
    mk({
      id: 'task_overdue_1',
      title: 'Send Friday update — urgent',
      priority: 1,
      dueAt: now - 1 * day,
      tags: ['work'],
      order: 1,
    }),
    mk({
      id: 'task_overdue_2',
      title: 'Respond to Acme legal email',
      priority: 2,
      dueAt: now - 2 * day,
      tags: ['contract'],
      attachments: [{ type: 'drive', targetId: 'drive_pdf_contract', label: 'Acme — service agreement.pdf' }],
      order: 2,
    }),
    mk({
      id: 'task_overdue_3',
      title: 'Pick up dry cleaning',
      priority: 4,
      dueAt: now - 4 * day,
      tags: ['personal'],
      listId: 'list_errands',
      projectId: 'proj_personal',
      order: 3,
    }),
    mk({
      id: 'task_today_1',
      title: 'Review PRD and add comments',
      priority: 2,
      dueAt: now + 2 * 3600_000,
      tags: ['design-review'],
      attachments: [
        { type: 'doc', targetId: 'doc_prd', label: 'PRD — Inline AI commands' },
        { type: 'drive', targetId: 'drive_pdf_prd', label: 'PRD — Inline AI commands.pdf' },
      ],
      projectId: 'proj_q2_launch',
      listId: 'list_kickoff',
      estimate: 30,
      order: 1,
    }),
    mk({
      id: 'task_today_2',
      title: 'Pair with Priya on Notes integration',
      priority: 2,
      dueAt: now + 4 * 3600_000,
      tags: ['engineering'],
      projectId: 'proj_q2_launch',
      estimate: 90,
      order: 2,
    }),
    mk({
      id: 'task_today_3',
      title: 'Buy milk',
      priority: 4,
      dueAt: now + 8 * 3600_000,
      tags: ['errand'],
      listId: 'list_errands',
      projectId: 'proj_personal',
      estimate: 10,
      order: 3,
    }),

    // ----- Inbox (no project, no due date) -----
    mk({
      id: 'task_inbox_1',
      title: 'Idea — diff-native git client',
      tags: [],
      order: 1,
    }),
    mk({
      id: 'task_inbox_2',
      title: 'Read "Working in Public" by Eghbal',
      tags: ['reading'],
      attachments: [{ type: 'note', targetId: 'note_reading', label: 'Reading queue' }],
      order: 2,
    }),
    mk({
      id: 'task_inbox_3',
      title: 'Decide whether to ship comments work this quarter',
      priority: 3,
      tags: ['decision'],
      sourceModule: 'notes',
      sourceId: 'note_decisions',
      order: 3,
    }),
    mk({
      id: 'task_inbox_4',
      title: 'Block 90 min for deep work in the morning',
      priority: 2,
      sourceModule: 'notes',
      sourceId: 'note_retrospective',
      tags: ['habit'],
      order: 4,
    }),
    mk({
      id: 'task_inbox_5',
      title: 'Maybe try a voice journal — explore later',
      priority: 4,
      tags: ['idea'],
      order: 5,
    }),

    // ----- Upcoming (this week) -----
    mk({
      id: 'task_up_1',
      title: 'Draft launch comms',
      priority: 1,
      dueAt: now + 2 * day,
      projectId: 'proj_q2_launch',
      listId: 'list_launch',
      estimate: 60,
      tags: ['comms'],
      sourceModule: 'notes',
      sourceId: 'note_meeting_followups',
      order: 1,
    }),
    mk({
      id: 'task_up_2',
      title: 'Schedule usability round with five users',
      priority: 2,
      dueAt: now + 3 * day,
      projectId: 'proj_q2_launch',
      listId: 'list_launch',
      estimate: 30,
      tags: ['research'],
      sourceModule: 'notes',
      sourceId: 'note_meeting_followups',
      order: 2,
    }),
    mk({
      id: 'task_up_3',
      title: 'Polish slash menu interactions',
      priority: 2,
      dueAt: now + 4 * day,
      projectId: 'proj_q2_launch',
      tags: ['engineering'],
      estimate: 120,
      order: 3,
    }),
    mk({
      id: 'task_up_4',
      title: 'Outline writing-surfaces essay',
      priority: 3,
      dueAt: now + 5 * day,
      projectId: 'proj_writing',
      listId: 'list_essay',
      attachments: [{ type: 'doc', targetId: 'doc_essay', label: 'On writing surfaces' }],
      tags: ['writing'],
      estimate: 30,
      order: 1,
    }),

    // ----- With subtasks (parent + 3 subtasks) -----
    mk({
      id: 'task_subparent',
      title: 'Prepare for design review',
      priority: 2,
      dueAt: now + 2 * day,
      projectId: 'proj_q2_launch',
      listId: 'list_kickoff',
      tags: ['design-review'],
      estimate: 60,
      attachments: [
        { type: 'event', targetId: 'evt_design_review', label: 'Design review (Thu 3pm)' },
      ],
      order: 4,
    }),
    mk({
      id: 'task_sub_1',
      parentId: 'task_subparent',
      title: 'Walk through slash-menu redesign',
      priority: 2,
      estimate: 15,
      order: 1,
    }),
    mk({
      id: 'task_sub_2',
      parentId: 'task_subparent',
      title: 'Show diff-accept demo recording',
      priority: 2,
      estimate: 10,
      order: 2,
    }),
    mk({
      id: 'task_sub_3',
      parentId: 'task_subparent',
      title: 'Ask for input on AI-block defaults',
      priority: 2,
      estimate: 10,
      order: 3,
    }),

    // ----- Recurring -----
    mk({
      id: 'task_recurring_1',
      title: 'Weekly review',
      priority: 2,
      dueAt: nextSunday(),
      tags: ['habit', 'review'],
      recurrence: { freq: 'weekly', interval: 1, byday: ['su'] },
      estimate: 30,
      order: 5,
    }),
    mk({
      id: 'task_recurring_2',
      title: 'Standup notes',
      priority: 3,
      dueAt: nextWeekday(),
      tags: ['standup'],
      recurrence: { freq: 'weekly', interval: 1, byday: ['mo', 'tu', 'we', 'th', 'fr'] },
      estimate: 15,
      order: 6,
    }),

    // ----- Errands -----
    mk({
      id: 'task_errand_1',
      title: 'Refill kitchen coffee',
      completed: true,
      completedAt: now - 1 * day,
      priority: 4,
      tags: ['errand'],
      listId: 'list_errands',
      projectId: 'proj_personal',
      order: 4,
      activity: [
        { id: id('act'), type: 'created', at: now - 3 * day },
        { id: id('act'), type: 'completed', at: now - 1 * day },
      ],
    }),
    mk({
      id: 'task_errand_2',
      title: 'Olive oil',
      priority: 4,
      tags: ['errand'],
      listId: 'list_errands',
      projectId: 'proj_personal',
      order: 5,
    }),
    mk({
      id: 'task_errand_3',
      title: 'Pecorino',
      priority: 4,
      tags: ['errand'],
      listId: 'list_errands',
      projectId: 'proj_personal',
      order: 6,
    }),

    // ----- A few "stale" inbox items (created > 14 days ago, never touched) -----
    mk({
      id: 'task_stale_1',
      title: 'Investigate ProseMirror schema bug',
      priority: 3,
      tags: ['engineering'],
      createdAt: now - 28 * day,
      updatedAt: now - 28 * day,
      activity: [{ id: id('act'), type: 'created', at: now - 28 * day }],
      order: 6,
    }),
    mk({
      id: 'task_stale_2',
      title: 'Drop Felix a thank-you note',
      priority: 4,
      tags: ['personal'],
      createdAt: now - 22 * day,
      updatedAt: now - 22 * day,
      activity: [{ id: id('act'), type: 'created', at: now - 22 * day }],
      order: 7,
    }),

    // ----- A "deep work" task -----
    mk({
      id: 'task_deepwork_1',
      title: 'Write the diffs-beat-overwrites blog draft',
      priority: 1,
      dueAt: now + 6 * day,
      projectId: 'proj_writing',
      attachments: [{ type: 'doc', targetId: 'doc_blog', label: 'Draft — why diffs beat overwrites' }],
      tags: ['writing'],
      estimate: 120,
      order: 2,
    }),
  ];

  const allActiveTaskIds = tasks.filter((t) => !t.completed && !t.trashed).map((t) => t.id);

  const smartLists: SmartList[] = [
    {
      id: 'smart_quick_wins',
      name: 'Quick wins',
      definition: 'estimate ≤ 15 minutes, no dependencies',
      isAiCurated: true,
      emoji: '⚡',
      taskIds: tasks
        .filter((t) => !t.completed && !t.trashed && (t.estimate ?? 0) > 0 && (t.estimate ?? 0) <= 15)
        .map((t) => t.id),
      lastComputedAt: now,
    },
    {
      id: 'smart_stale',
      name: 'Stale',
      definition: 'created > 14 days ago and not touched',
      isAiCurated: true,
      emoji: '🥶',
      taskIds: tasks
        .filter((t) => !t.completed && !t.trashed && now - t.updatedAt > 14 * day)
        .map((t) => t.id),
      lastComputedAt: now,
    },
    {
      id: 'smart_at_risk',
      name: 'At risk',
      definition: 'deadline within 3 days and below 50% subtasks complete',
      isAiCurated: true,
      emoji: '⚠️',
      taskIds: tasks
        .filter((t) => !t.completed && t.dueAt && t.dueAt - now < 3 * day)
        .map((t) => t.id),
      lastComputedAt: now,
    },
    {
      id: 'smart_deep_work',
      name: 'Deep work',
      definition: 'estimate ≥ 60 minutes, P1 or P2',
      isAiCurated: true,
      emoji: '🧠',
      taskIds: tasks
        .filter((t) => !t.completed && (t.estimate ?? 0) >= 60 && t.priority <= 2)
        .map((t) => t.id),
      lastComputedAt: now,
    },
    {
      id: 'smart_custom_writing',
      name: 'Anything writing',
      definition: 'tasks involving writing, drafting, or essays',
      isAiCurated: true,
      emoji: '✍️',
      taskIds: tasks
        .filter((t) => !t.completed && /\b(writ|draft|essay|outline|comms|blog)\b/i.test(t.title))
        .map((t) => t.id),
      lastComputedAt: now,
    },
  ];

  return { tasks, projects, lists, smartLists };
}

function nextSunday(): number {
  const d = new Date();
  const offset = (7 - d.getDay()) % 7 || 7;
  d.setDate(d.getDate() + offset);
  d.setHours(9, 0, 0, 0);
  return d.getTime();
}

function nextWeekday(): number {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d.getTime();
}
