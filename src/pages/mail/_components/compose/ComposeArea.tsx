import { useEffect, useState } from 'react';
import { Undo2 } from 'lucide-react';
import { useMailStore } from '@/pages/mail/_hooks/use-mail-store';
import { useMailUiStore } from '@/pages/mail/_hooks/use-mail-ui-store';
import ComposeWindow from './ComposeWindow';

export default function ComposeArea() {
  const openIds = useMailUiStore((s) => s.openComposeDraftIds);
  const undoSendable = useMailUiStore((s) => s.undoSendable);
  const clearUndoSend = useMailUiStore((s) => s.clearUndoSend);
  const cancelScheduled = useMailStore((s) => s.cancelScheduled);
  const drafts = useMailStore((s) => s.drafts);

  // Tick to refresh undo toast countdown
  const [, force] = useState(0);
  useEffect(() => {
    const ids = Object.keys(undoSendable);
    if (ids.length === 0) return;
    const interval = window.setInterval(() => {
      force((n) => n + 1);
      const now = Date.now();
      for (const id of ids) {
        if ((undoSendable[id]?.deadline ?? 0) <= now) clearUndoSend(id);
      }
    }, 250);
    return () => window.clearInterval(interval);
  }, [undoSendable, clearUndoSend]);

  return (
    <>
      {openIds.map(
        (id, i) =>
          drafts[id] && <ComposeWindow key={id} draftId={id} position={i} />,
      )}

      {/* Undo-send toasts */}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {Object.entries(undoSendable).map(([emailId, info]) => {
          const remaining = Math.max(0, Math.ceil((info.deadline - Date.now()) / 1000));
          if (remaining === 0) return null;
          return (
            <div
              key={emailId}
              className="pointer-events-auto flex items-center gap-3 rounded-full bg-gray-900 px-4 py-2 text-xs text-white shadow-lg"
            >
              <span>Sent</span>
              <button
                type="button"
                onClick={async () => {
                  await cancelScheduled(emailId);
                  clearUndoSend(emailId);
                }}
                className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 hover:bg-white/20"
              >
                <Undo2 className="h-3 w-3" /> Undo ({remaining}s)
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
