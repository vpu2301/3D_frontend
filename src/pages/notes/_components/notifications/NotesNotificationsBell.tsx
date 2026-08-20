/**
 * Due-reminder notifications (Sprint 2 §4.6).
 *
 * `GET /v1/notifications`, polled every 60 s. The spec put this in the dashboard
 * shell's header; it lives in the notes rail instead, because the notifications
 * this endpoint returns are note reminders and the platform header is outside
 * this app's boundary. Moving it up a level is a one-import change if the shell
 * should own it later.
 */

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, StickyNote, ShieldAlert } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notesApi, type Notification } from '@/pages/notes/_lib/apiClient';
import { useApprovalsStore } from '@/pages/notes/_hooks/use-approvals-store';
import ApprovalCard from '@/pages/notes/_components/ai/ApprovalCard';
import { canReachNotesApi } from '@/auth/apiFetch';
import { cn } from '@/lib/utils';

const POLL_MS = 60_000;

function formatWhen(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

export default function NotesNotificationsBell() {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    if (!canReachNotesApi()) return;
    try {
      setItems(await notesApi.notifications());
    } catch {
      /* A failed poll leaves the previous list; the next one retries. */
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const unread = items.filter((n) => !n.read).length;

  // Approvals surface two (§5). The store owns the polling and the decisions;
  // the bell only mounts a subscriber and renders what is pending, so a
  // decision taken here and one taken in the transcript are the same decision.
  const approvals = useApprovalsStore((s) => s.pending);
  const subscribeApprovals = useApprovalsStore((s) => s.subscribe);
  useEffect(() => subscribeApprovals(), [subscribeApprovals]);

  // One badge for both. Splitting them would mean two counters competing for
  // the same 16 pixels, and the user's question is "does anything need me?".
  const badge = unread + approvals.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
            data-command-exempt="opens and dismisses the notification list; nothing is written by it"
          type="button"
          className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left text-[13.5px] font-medium text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title={
            approvals.length > 0
              ? `${approvals.length} approval${approvals.length === 1 ? '' : 's'} waiting`
              : 'Reminder notifications'
          }
        >
          <Bell className="h-4 w-4 shrink-0" style={{ color: 'var(--text-4)' }} />
          <span className="flex-1 truncate">Notifications</span>
          {badge > 0 && (
            // An approval is a request for a decision, not an FYI. It gets
            // the stronger colour so a pending write is never mistaken for
            // a reminder that a note is due.
            <span
              className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white"
              style={{
                background: approvals.length > 0 ? 'var(--bad-fg)' : 'var(--warn-fg)',
              }}
            >
              {badge}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="right"
        className="plat w-80 rounded-[14px] border-[var(--line)] p-0"
        style={{ background: 'var(--paper)' }}
      >
        {approvals.length > 0 && (
          <div className="border-b border-[var(--line-soft)]">
            <div className="plat-eyebrow flex items-center gap-1.5 px-3 py-2.5">
              <ShieldAlert aria-hidden className="h-3.5 w-3.5" style={{ color: 'var(--warn-fg)' }} />
              Approvals
              <span className="plat-pill plat-pill-warn ml-auto !px-1.5 !py-0 !text-[10px]">
                {approvals.length}
              </span>
            </div>
            <ScrollArea className="max-h-72">
              <ul className="space-y-2 px-2 pb-2">
                {approvals.map((approval) => (
                  <li key={approval.actionId}>
                    {/*
                      Deciding from the bell does not resume an agent turn: the
                      transcript that started it may not be open, and the server
                      resumes on its own when the session is next continued.
                    */}
                    <ApprovalCard approval={approval} compact />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}

        <div className="plat-eyebrow border-b border-[var(--line-soft)] px-3 py-2.5">
          Due reminders
        </div>
        {items.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-[var(--text-4)]">Nothing due.</p>
        ) : (
          <ScrollArea className="max-h-80">
            <ul className="py-1">
              {items.map((n) => (
                <li key={n.id}>
                  <button
            data-command-exempt="opens and dismisses the notification list; nothing is written by it"
                    type="button"
                    disabled={!n.noteId}
                    onClick={() => {
                      if (n.noteId) navigate(`/notes/${n.noteId}`);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-start gap-2 border-b border-[var(--line-soft)] px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-[rgba(20,22,26,0.04)] disabled:cursor-default',
                      !n.read && 'bg-[rgba(20,22,26,0.03)]',
                    )}
                  >
                    <StickyNote
                      className="mt-0.5 h-3.5 w-3.5 shrink-0"
                      style={{ color: 'var(--text-4)' }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium text-[var(--ink)]">{n.title}</div>
                      {n.body && (
                        <div className="line-clamp-2 text-[11px] text-[var(--text-4)]">{n.body}</div>
                      )}
                      <div className="mt-0.5 text-[10px] text-[var(--text-5)]">
                        {formatWhen(n.createdAt)}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
