/**
 * The `?` sheet.
 *
 * Generated from the same registry the palette renders and the key handler
 * binds, so it cannot document a shortcut that does not exist or miss one that
 * does. A hand-written help sheet is wrong within two sprints; this one is wrong
 * only if the registry is.
 *
 * The editor's own bindings (`[[`, `#`, `/`) are typed rather than pressed, so
 * they are not registry commands and are listed separately.
 */

import { Keyboard } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import {
  GROUP_LABELS,
  NOTE_COMMANDS,
  formatShortcut,
  type CommandGroup,
} from '@/pages/notes/_lib/commands';

/** Triggers that are part of writing, not of the command system. */
const EDITOR_TRIGGERS: Array<{ keys: string; label: string }> = [
  { keys: '[[', label: 'Link to another note' },
  { keys: '#', label: 'Tag inline' },
  { keys: '/', label: 'Insert a block' },
];

function Row({ keys, label }: { keys: string; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-sm text-[var(--text-2)]">{label}</span>
      <kbd className="shrink-0 rounded-[6px] border border-[var(--line)] bg-[var(--sand)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-3)]">
        {keys}
      </kbd>
    </div>
  );
}

export default function NotesShortcutSheet() {
  const open = useNotesUiStore((s) => s.shortcutsOpen);
  const setOpen = useNotesUiStore((s) => s.setShortcutsOpen);

  const bound = NOTE_COMMANDS.filter((command) => command.shortcut);
  const groups = new Map<CommandGroup, typeof bound>();
  for (const command of bound) {
    const list = groups.get(command.group) ?? [];
    list.push(command);
    groups.set(command.group, list);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="plat flex w-full flex-col gap-0 border-[var(--line)] sm:max-w-sm"
        style={{ background: 'var(--paper)' }}
      >
        <SheetHeader className="pb-3 text-left">
          <SheetTitle className="plat-display flex items-center gap-2 text-[19px] text-[var(--ink)]">
            <Keyboard aria-hidden className="h-4 w-4" style={{ color: 'var(--text-4)' }} /> Keyboard
            shortcuts
          </SheetTitle>
          <SheetDescription className="text-xs text-[var(--text-4)]">
            Every action is also in the command palette — press{' '}
            <kbd className="rounded-[6px] border border-[var(--line)] bg-[var(--sand)] px-1 font-mono">
              {formatShortcut('mod+k')}
            </kbd>
            .
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="-mx-2 flex-1 px-2">
          <div className="pb-6">
            {[...groups.entries()].map(([group, commands]) => (
              <section key={group} className="mb-4">
                <h3 className="plat-eyebrow mb-1" style={{ fontFamily: 'var(--mono)', letterSpacing: '0.22em' }}>
                  {GROUP_LABELS[group]}
                </h3>
                <div className="divide-y divide-[var(--line-soft)]">
                  {commands.map((command) => (
                    <Row
                      key={command.id}
                      label={command.label}
                      keys={formatShortcut(command.shortcut!)}
                    />
                  ))}
                </div>
              </section>
            ))}

            <section>
              <h3 className="plat-eyebrow mb-1" style={{ fontFamily: 'var(--mono)', letterSpacing: '0.22em' }}>
                While writing
              </h3>
              <div className="divide-y divide-[var(--line-soft)]">
                {EDITOR_TRIGGERS.map((trigger) => (
                  <Row key={trigger.keys} label={trigger.label} keys={trigger.keys} />
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
