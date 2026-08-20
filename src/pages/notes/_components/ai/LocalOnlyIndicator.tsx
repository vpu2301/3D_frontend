/**
 * "Nothing leaves this machine", on screen, permanently (FE-5 §6).
 *
 * A local-only deployment is the sentence that closes a Kanzlei sale, and it
 * currently lives in a PDF. On screen it is worth more: the person deciding
 * whether to paste a client's file into a note is not the person who read the
 * procurement document.
 *
 * Quiet by design — a green pill, not a banner. It has to survive being looked
 * at every day without becoming noise, and a compliance claim that nags is one
 * users learn to stop reading.
 *
 * It renders **nothing** unless the server confirms local-only. An absent or
 * unreachable config is not evidence of anything, and a reassurance shown on a
 * guess is worse than no reassurance at all.
 */

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { type AiConfig } from '@/pages/notes/_lib/aiClient';
import { loadAiConfig } from '@/pages/notes/_lib/aiConfigCache';
import { canReachNotesApi } from '@/auth/apiFetch';

export default function LocalOnlyIndicator({ className }: { className?: string }) {
  const [config, setConfig] = useState<AiConfig | null>(null);

  useEffect(() => {
    if (!canReachNotesApi()) return;
    let live = true;
    void loadAiConfig().then((value) => {
      if (live) setConfig(value);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!config?.localOnly) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`plat-pill plat-pill-ok shrink-0 !px-2 !py-0.5 !text-[10px] ${className ?? ''}`}
        >
          <ShieldCheck aria-hidden className="h-3 w-3" />
          Local only
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-56 rounded-[10px] text-xs">
        AI runs on {config.model ? `${config.provider} (${config.model})` : config.provider} inside
        this deployment. No note content is sent to an external provider.
      </TooltipContent>
    </Tooltip>
  );
}
