# Calendar keyboard shortcuts

Global — work from any view unless you're typing in an input.

| Key             | Action                                   |
| --------------- | ---------------------------------------- |
| `Cmd/Ctrl + K`  | Open the command palette / NL parser     |
| `T`             | Jump to today                            |
| `C`             | Create event (opens palette)             |
| `1`             | Day view                                 |
| `2`             | 3-day view                               |
| `3`             | Week view                                |
| `4`             | Month view                               |
| `5`             | Agenda view                              |
| `←` / `→`       | Previous / next page (day/week/month)    |
| `E`             | Edit the selected event (opens detail)   |
| `Delete`        | Delete the selected event                |
| `↑` / `↓`       | Nudge selected event ±15 minutes         |
| `Shift + drag`  | Create a focus block on the grid         |

## Drag gestures

| Gesture                     | Result                                        |
| --------------------------- | --------------------------------------------- |
| Click-drag on empty slot    | Create a new event (5-minute snap)            |
| `Shift` + click-drag        | Create a focus block (diagonal hatch)         |
| Drag an event chip          | Move it (conflict chip appears if it overruns a focus block) |

## AI actions

Every AI-initiated calendar mutation is:
- Announced in the sidebar with an inline tool-call card (`createEvent`, `moveEvent`, etc.)
- Logged in the Activity panel of the AI sidebar
- Undoable via the per-entry `Undo` button
