/**
 * Notes modal primitives.
 *
 * Every modal in the Notes app goes through these so they share one look with
 * the rest of the platform (the accounting approval modal is the reference):
 * a Sora display title, a small muted description, 14px surfaces and
 * `.plat-btn` pill actions.
 *
 * They also exist to replace the browser's `prompt`/`confirm`/`alert`, which
 * were the only unstyleable surfaces left in the app — and which blocked the
 * main thread, so an editor autosave could not run while one was open.
 */

import { useEffect, useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { dialogButton, dialogField, dialogLabel } from './dialog-styles';
import { cn } from '@/lib/utils';

interface NotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** The shell every notes modal is built from. */
export function NotesDialog({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  children,
  footer,
  className,
}: NotesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        /* Radix portals to <body>, outside `.platform` — `plat` re-declares the
           design tokens so the vars below resolve inside the portal. */
        className={cn('plat gap-5 rounded-[14px] border-[var(--line)] sm:max-w-md', className)}
        style={{ background: 'var(--paper)' }}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="plat-display flex items-center gap-2 text-[19px] text-[var(--ink)]">
            {Icon && <Icon aria-hidden className="h-4 w-4" style={{ color: 'var(--text-4)' }} />}
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-xs text-[var(--text-4)]">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        {footer && <DialogFooter className="gap-2 sm:space-x-0">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
  icon?: NotesDialogProps['icon'];
  onConfirm: () => void;
}

/** Replaces `window.confirm`. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  icon,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <NotesDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      icon={icon}
      footer={
        <>
          <button
            data-command-exempt="dialog confirm and cancel; the command that raised the dialog is the action" type="button" className={dialogButton.ghost} onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </button>
          <button
            data-command-exempt="dialog confirm and cancel; the command that raised the dialog is the action"
            type="button"
            className={tone === 'danger' ? dialogButton.danger : dialogButton.primary}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    />
  );
}

interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  label: string;
  placeholder?: string;
  initialValue?: string;
  submitLabel?: string;
  /** Rendered under the field when the value is set but invalid. */
  validate?: (value: string) => string | null;
  icon?: NotesDialogProps['icon'];
  onSubmit: (value: string) => void;
}

/** Replaces `window.prompt`. Submits on Enter, cancels on Escape (via the dialog). */
export function PromptDialog({
  open,
  onOpenChange,
  title,
  description,
  label,
  placeholder,
  initialValue = '',
  submitLabel = 'Save',
  validate,
  icon,
  onSubmit,
}: PromptDialogProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  const error = value.trim() && validate ? validate(value.trim()) : null;

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || error) return;
    onSubmit(trimmed);
    onOpenChange(false);
  };

  return (
    <NotesDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      icon={icon}
      footer={
        <>
          <button
            data-command-exempt="dialog confirm and cancel; the command that raised the dialog is the action" type="button" className={dialogButton.ghost} onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button
            data-command-exempt="dialog confirm and cancel; the command that raised the dialog is the action"
            type="button"
            className={dialogButton.primary}
            disabled={!value.trim() || !!error}
            onClick={submit}
          >
            {submitLabel}
          </button>
        </>
      }
    >
      <div className="space-y-1.5">
        <label
          htmlFor="notes-prompt-field"
          className={dialogLabel}
        >
          {label}
        </label>
        <input
          id="notes-prompt-field"
          autoFocus
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          className={dialogField}
        />
        {error && <p className="text-xs" style={{ color: 'var(--bad-fg)' }}>{error}</p>}
      </div>
    </NotesDialog>
  );
}

/** Local-time value for `<input type="datetime-local">`. */
function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function presetDates(): { label: string; at: Date }[] {
  const today = new Date();
  today.setHours(17, 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(9, 0, 0, 0);
  return [
    { label: 'Later today', at: today },
    { label: 'Tomorrow morning', at: tomorrow },
    { label: 'Next week', at: nextWeek },
  ];
}

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dueAt: number, location?: string) => void;
}

/**
 * Replaces the free-text reminder prompt, which accepted an ISO string,
 * "today" or "tomorrow" and rejected everything else with an `alert`. A picker
 * cannot be typed wrong, so the parse-failure path is gone with it.
 */
export function ReminderDialog({ open, onOpenChange, onSubmit }: ReminderDialogProps) {
  const presets = presetDates();
  const [when, setWhen] = useState(() => toLocalInput(presets[1].at));
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (open) {
      setWhen(toLocalInput(presetDates()[1].at));
      setLocation('');
    }
  }, [open]);

  const dueAt = when ? new Date(when).getTime() : NaN;
  const valid = !Number.isNaN(dueAt);

  const submit = () => {
    if (!valid) return;
    onSubmit(dueAt, location.trim() || undefined);
    onOpenChange(false);
  };

  return (
    <NotesDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add a reminder"
      description="Reminders mirror to Calendar once they are saved."
      footer={
        <>
          <button
            data-command-exempt="dialog confirm and cancel; the command that raised the dialog is the action" type="button" className={dialogButton.ghost} onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button
            data-command-exempt="dialog confirm and cancel; the command that raised the dialog is the action"
            type="button"
            className={dialogButton.primary}
            disabled={!valid}
            onClick={submit}
          >
            Add reminder
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => {
            const value = toLocalInput(p.at);
            return (
              <button
            data-command-exempt="dialog confirm and cancel; the command that raised the dialog is the action"
                key={p.label}
                type="button"
                onClick={() => setWhen(value)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors',
                  when === value
                    ? 'border-[var(--ink)] bg-[rgba(20,22,26,0.06)] font-semibold text-[var(--ink)]'
                    : 'border-[var(--line)] text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.04)]',
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="notes-reminder-when"
            className={dialogLabel}
          >
            Date and time
          </label>
          <input
            id="notes-reminder-when"
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submit();
              }
            }}
            className={dialogField}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="notes-reminder-location"
            className={dialogLabel}
          >
            Location <span className="font-normal normal-case tracking-normal">· optional</span>
          </label>
          <input
            id="notes-reminder-location"
            value={location}
            placeholder="Where?"
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submit();
              }
            }}
            className={dialogField}
          />
        </div>
      </div>
    </NotesDialog>
  );
}
