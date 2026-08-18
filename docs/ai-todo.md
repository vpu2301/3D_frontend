# AI-Native Todo (frontend, mocked)

Todo is a sibling module to **Docs**, **Notes**, **Drive**, and **Calendar** inside the 3days.ai shell. Capture-first task management with natural-language input, AI triage, daily plans, and Pomodoro focus. Fully client-side, AI mocked.

## Run it

```bash
npm install
npm run dev
# → http://localhost:8080/todo
```

First visit seeds 25 tasks across 3 projects, 4 lists, with cross-links into seeded Docs/Notes/Drive/Calendar — including a few extracted-from-Notes tasks that surface the integration story on first run.

## Demo path (≈3 min)

1. **Open Todo** from the right-rail Apps bar (next to Drive/Calendar/Docs/Notes). Land on **Inbox** with a few unprocessed tasks waiting for triage.
2. **Quick capture with NL parsing.** In the always-focused quick-add bar at the top, type:
   `draft launch comms tomorrow 2pm !1 #comms +q2-launch ~30m`
   As you type, a **Parsed** strip below the input shows the extracted due-date, P1 priority, `#comms` tag, `Q2 launch` project, and 30-min estimate. Press Enter — the task lands in the project list with all metadata applied.
3. **AI triage.** Click **AI triage** (or `Cmd/Ctrl+J` from Inbox). A diff-accept sheet shows mock proposals per Inbox task: priority bumps, due-date suggestions, and project routing — each with a one-line reason. Toggle accept/reject per task, then **Apply accepted**.
4. **Open Today.** Sidebar → **Today**. Three sections: **Overdue** (red chips), **Today** (blue chips), and **Completed today**. Above them, the **AI plan** card. Click **Generate** — mock AI streams an ordered plan with proposed time blocks. Click **Accept plan** — Today reorders and each task gets a `scheduledAt` stamp.
5. **Open a task → break down with AI.** Click any task title to open the right-rail detail pane. Hit **Break down with AI** — mock AI proposes 3-7 subtasks (e.g., "Outline → Draft intro → Draft body → Self-edit"). Subtasks appear inline.
6. **Focus mode.** Sidebar → **Focus**. Pomodoro timer auto-starts on entry. The **Next-best task** card surfaces the top P1 that fits remaining free time. Hit **Done** to mark complete and re-pick.
7. **Smart Lists.** Sidebar → **Smart lists**. 5 pre-populated: *Quick wins*, *Stale*, *At risk*, *Deep work*, plus a custom *Anything writing*. Each shows a recompute button. Click **+ Smart list** to define a new one in plain English; mock AI populates it.
8. **Cross-module.** Many seeded tasks have a `from: notes` chip — click the chip in the detail pane to jump to the source note. Tasks have attachments to Docs, Notes, Drive files, and a Calendar event — clicking a chip routes to the source module.
9. **Recurrence.** The seeded weekly review and weekday standup are recurring. Complete one — the next instance auto-spawns at the next valid date.

## Architecture

Todo mirrors the existing module convention:

```
src/pages/todo/
  TodoHome.tsx                 ← all list views (Inbox/Today/Upcoming/All/Completed/list/project/tag/smart)
  TodoFocus.tsx                ← Pomodoro + next-best task picker
  TodoTrash.tsx
  _components/
    shared/TodoLayout.tsx      ← AppSidebar + SidebarProvider + SidebarInset
    sidebar/TodoSidebar.tsx    ← Inbox/Today/Upcoming/All/Completed/Focus/Trash + Smart Lists + Projects/Lists tree + Tags
    list/TaskRow.tsx           ← the most-rendered component — checkbox, title, priority dot, chips, source/attachment indicators
    quick-add/QuickAddBar.tsx  ← always-focused capture bar with live Parsed preview
    detail/TaskDetailPane.tsx  ← right rail: title, priority/due/project/list/tags/estimate/recurrence/subtasks/attachments/activity
    today/DailyPlanCard.tsx    ← dismissible AI-generated daily plan with diff-accept apply
    ai/TriagePanel.tsx         ← Cmd+J on Inbox → diff-accept proposal sheet
    ai/TodoAskSidebar.tsx      ← Cmd+J on other views → Ask across tasks with citation chips
  _hooks/
    use-todo-store.ts          ← Zustand: tasks, projects, lists, smart lists, recurrence-on-complete, helpers (todayTasks, upcomingTasks, deriveTodoTags)
    use-todo-ui-store.ts       ← detail pane open, selection, query, triage/ask sheets, daily-plan dismiss
  _lib/
    types.ts
    storage.ts                 ← idb-keyval (5 separate dbs); re-exports newId
    nlParse.ts                 ← chrono-node + tag/priority/project/list/estimate/assignee extraction
    recurrence.ts              ← nextOccurrence + expandRecurrence + describeRecurrence
    seed.ts                    ← 25 tasks + 3 projects + 4 lists + 5 smart lists + cross-links
```

### Reuse from earlier modules

| Existing primitive | Reused as-is |
| --- | --- |
| `pages/docs/_lib/mockAi.ts` | Same module — *extended* with `triageInbox`, `generateDailyPlan`, `suggestPriorityBump`, `breakDownTask`, `estimateTask`, `askAcrossTasks`, `populateSmartList`, `suggestSnoozeTime`, `nextBestTask`. (Spec-mandated `parseQuickAdd` lives in `pages/todo/_lib/nlParse.ts` because it must be sub-100ms synchronous.) |
| `pages/docs/_lib/storage.ts` | Re-exports `newId`. Todo adds 5 IDB stores of its own. |
| `components/dashboard/{AppSidebar, PlatformAppsBar}` + `SidebarProvider` + `SidebarInset` | Identical platform shell. The Todo tile in `PlatformAppsBar` flipped from `comingSoon` to `href: '/todo'`. |

### Routes (added to existing `App.tsx`)

| Path | Component |
| --- | --- |
| `/todo` | TodoHome — Inbox |
| `/todo/today` `/upcoming` `/all` `/completed` | TodoHome (filtered + grouped) |
| `/todo/list/:id` `/todo/project/:id` `/todo/tag/:tag` `/todo/smart/:id` | TodoHome (scoped) |
| `/todo/focus` | TodoFocus — Pomodoro + AI next-best |
| `/todo/trash` | TodoTrash |

All wrapped in `ProtectedRoute`.

### Cross-module integration (seeded + wired)

- **From Notes / Docs / Calendar (extraction destination):** seeded tasks with `sourceModule: 'notes'` and `sourceId` are visible in Inbox today, with a `from: notes` chip in the row. Clicking the chip in the detail pane navigates to `/notes/:id`. The hook for tasks created via Notes' "Extract tasks" preset is `useTodoStore.createTask({ sourceModule: 'notes', sourceId, … })`.
- **Attachments to Docs / Notes / Drive / Calendar events:** the detail pane has an **Attach** picker for all four types. Each attachment renders as a clickable chip that routes to the source module. Seeded tasks include attachments to `doc_prd`, `doc_essay`, `doc_blog`, `note_reading`, `drive_pdf_contract`, `drive_pdf_prd`, and `evt_design_review`.
- **Linked from (other modules → tasks):** `Task.attachments` is the canonical link record. Modules that want to render "Linked tasks" can read `useTodoStore.tasks` and filter by `attachments.targetId`. Drive's preview already does this for notes via `note.links` — same pattern works for tasks.

### Deferred / would-need other-module touches

- **Calendar event creation when accepting a Daily Plan.** The plan generator already produces `blocks: { taskId, startAt, endAt }[]`. Wiring those into Calendar's event store would require a small write into the calendar module — same precedent as the deferred Notes "reminder mirror" panel and Drive "Attach" picker.
- **Notes "Tasks from this note" panel / Docs bubble menu "Track in Todo" / Drive "Linked tasks" panel.** Each is a small (~30-line) reverse panel in the source module. Data layer is symmetric and ready.
- **Per-project board (Kanban) and timeline (Gantt) views.** Substantial extra work; deferred behind list view.
- **Calendar peek strip in Today / Calendar overlay in Upcoming.** Would read from the Calendar store; data path is straightforward but UI deferred.
- **End-of-day rollover prompt.** Requires a daily timer or visit-after-midnight check; the `dailyPlanDismissed` UI state and `scheduledAt` field can drive this.
- **Global `Cmd+K` palette additions** (New task / Open Today / Start Focus / Search tasks). Touching the existing palette out of scope.
- **Settings page Todo section.** Settings page UI was deleted in an earlier round.

### Mock AI extensions (in `pages/docs/_lib/mockAi.ts`)

```ts
triageInbox(tasks, context)               // -> TriageProposal[] (priority/due/project + reason)
generateDailyPlan(tasks, events, hours)   // -> { orderedTaskIds, blocks, rationale }
suggestPriorityBump(task, ctx)            // -> PrioritySuggestion | null
breakDownTask(task)                       // -> Subtask[] (title-aware)
estimateTask(task, history)               // -> { minutes, confidence }
askAcrossTasks(question, tasks)           // streams; citedTaskIds chips route to detail
populateSmartList(definition, tasks)      // -> task ids ranked by token overlap
suggestSnoozeTime(task, history)          // -> { snoozeUntil, reason }
nextBestTask(tasks, { now, freeUntilMs }) // best task that fits remaining free time
```

`parseQuickAdd(input, { projects, lists })` lives in `_lib/nlParse.ts` and is **synchronous** + sub-100ms — it runs on every keystroke. It uses `chrono-node` for date parsing and regex extraction for `!N` priority, `#tag`, `+project`, `>list`, `@assignee`, `~30m`/`~2h` estimates.

## State + persistence

- **`useTodoStore`**: tasks/projects/lists/smartLists dicts, full CRUD, completion (with **recurrence-aware spawn** of next instance), trash/restore/permanent-delete, tag add/remove (lowercased + deduped), priority/due/project/list/recurrence setters, attachment add/remove, reminders, activity log, suggested-estimate accept/dismiss, manual reorder.
- **Subtasks** are tasks with `parentId` — same row component, same store, no separate model. Detail pane renders nested subtask rows.
- **Recurring tasks** are stored as a single template (the original task with `recurrence` set). On completion, the next concrete instance is materialized from `nextOccurrence`. For Today/Upcoming views, `expandRecurrence(rule, anchor, from, to)` produces virtual instances within a window.
- **Persistence**: `idb-keyval` with **5** separate databases — `ai-todo-tasks`, `ai-todo-projects`, `ai-todo-lists`, `ai-todo-smart`, `ai-todo-meta`.

## Acceptance status

- [x] Todo tile active in the global apps bar; `/todo` lands with seed data.
- [x] Todo UI uses the platform shell, design tokens, and shadcn primitives — visually consistent with Docs/Notes/Drive/Calendar.
- [x] Quick-add NL parsing extracts dates (chrono-node), priorities (`!N` / `pN`), tags (`#`), projects (`+`), lists (`>`), assignees (`@`), and estimates (`~30m` / `~2h`); each renders as a chip in the live preview before submit.
- [x] Task / subtask / list / project CRUD persists across reload.
- [x] Today / Upcoming / Inbox / All / Completed / Focus views all render correctly with seed data; Today has overdue/today/completed sections; Upcoming is day-grouped over 14 days with recurrence expansion.
- [x] Recurring tasks expand correctly in Today/Upcoming views; completion spawns the next instance.
- [x] Task detail pane edits all fields (priority, due, project, list, tags, estimate, recurrence) with live updates.
- [x] AI triage produces a diff-accept sheet; per-task accept/reject + Accept all / Reject all.
- [x] Daily plan generates an ordered task list and proposed time blocks; Accept reorders Today and stamps `scheduledAt`. (Calendar event creation deferred — flagged in the card.)
- [x] **Break down with AI**, **Estimate** (auto-suggested chip on quick-add when no estimate provided), and **Snooze smartly** (mockAi method available; UI deferred).
- [x] **Ask across tasks** (`Cmd/Ctrl+J` on non-Inbox views) streams answers with citation chips that open the detail pane.
- [x] **Smart Lists**: 5 pre-populated, custom NL definitions, recompute.
- [x] Tasks attached to Docs / Notes / Drive / Events render as routing chips; the source-module chip routes back; seeded tasks demonstrate cross-module wiring on first run.
- [x] Focus mode runs Pomodoro 25/5, surfaces an AI next-best task that fits remaining free time, marks complete and re-picks, summarizes the session.
- [x] Vitest covers `useTodoStore` (CRUD, recurrence-on-complete, smart lists, helpers), `nlParse` (every extraction), `recurrence` (next + expand), and the new mock AI methods. **43 new tests, 146 total platform-wide.**

## Stretch (not implemented)

- Timeline/Gantt for projects with deadlines
- Habit tracking with streaks
- Time tracking (start/stop, log actual)
- Dependencies between tasks
- "Eat the frog" lock at the top of Today
- Email-to-task UI demo
- Public read-only project URLs

## Keyboard shortcuts

- `Cmd/Ctrl + J` — AI triage on Inbox / Ask across tasks elsewhere
- `Enter` (focused row) — Open detail
- `Space` (focused row) — Toggle complete
- `Esc` (detail open) — Close detail
- Always-focused quick-add bar on every view; `Esc` clears it
