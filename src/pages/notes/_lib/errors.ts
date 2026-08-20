/**
 * Turning a failed request into something a person can act on.
 *
 * Three rules, all of them from P8 — the pain where the tool is quietly
 * untrustworthy:
 *
 *  1. **Never show raw JSON.** A `{"error":"budget_exhausted"}` toast tells the
 *     user nothing and tells support nothing either.
 *  2. **Always carry the `requestId`.** It is the only thing that connects what
 *     the user saw to what the server logged, so every error toast offers it as
 *     one copyable string.
 *  3. **401/403 is never a silent retry.** A retry loop against a dead session
 *     looks like the app is broken. The session dialog says what happened and
 *     offers the one action that fixes it.
 */

import { toast } from 'sonner';
import { NotesApiError, VersionConflictError } from '@/pages/notes/_lib/apiClient';
import { NotAuthenticatedError } from '@/auth/apiFetch';

interface Explanation {
  title: string;
  description: string;
}

/**
 * `NotesApiError.code` → what actually went wrong, in the user's terms.
 * Codes are the backend's `error` field; anything unmapped falls through to the
 * server's own message, which is still better than the code.
 */
const BY_CODE: Record<string, Explanation> = {
  version_conflict: {
    title: 'This note changed elsewhere',
    description: 'Your view was refreshed with the newer version.',
  },
  not_found: {
    title: 'That note no longer exists',
    description: 'It was deleted, or the link points at another workspace.',
  },
  validation_error: {
    title: 'The server rejected that change',
    description: 'Nothing was saved. This is a bug worth reporting.',
  },
  budget_exhausted: {
    title: "Today's AI budget is spent",
    description: 'AI features resume tomorrow. Writing and saving are unaffected.',
  },
  rate_limited: {
    title: 'Too many requests',
    description: 'The service is throttling this workspace for a moment.',
  },
  pin_limit: {
    title: 'Five notes are already pinned',
    description: 'Unpin one to pin another.',
  },
  graph_too_large: {
    title: 'The graph is too large to draw',
    description: 'Filter by a tag to narrow it down.',
  },
  local_only_blocked: {
    title: 'Blocked by local-only mode',
    description: 'This deployment forbids sending note text to an external provider.',
  },
  export_failed: {
    title: 'Export failed',
    description: 'The server could not render this note as Markdown.',
  },
};

export interface FriendlyError {
  title: string;
  description: string;
  /** Present when the server sent one — the string support asks for. */
  requestId?: string;
  /** Seconds to wait, from `Retry-After` on a 429. */
  retryAfter?: number;
  /** True for 401/403: the session dialog handles these, not a toast. */
  isAuth: boolean;
}

export function explainError(error: unknown): FriendlyError {
  if (error instanceof VersionConflictError) {
    return { ...BY_CODE.version_conflict, requestId: error.requestId, isAuth: false };
  }

  if (error instanceof NotAuthenticatedError) {
    return {
      title: 'Not signed in to the Notes service',
      description: error.message,
      isAuth: true,
    };
  }

  if (error instanceof NotesApiError) {
    const isAuth = error.status === 401 || error.status === 403;
    const mapped = BY_CODE[error.code];

    if (error.status === 429) {
      const seconds = error.retryAfter;
      return {
        title: BY_CODE.rate_limited.title,
        description: seconds
          ? `Try again in ${seconds} second${seconds === 1 ? '' : 's'}.`
          : BY_CODE.rate_limited.description,
        requestId: error.requestId,
        retryAfter: seconds,
        isAuth: false,
      };
    }

    if (mapped) return { ...mapped, requestId: error.requestId, isAuth };

    if (error.status >= 500) {
      return {
        title: 'The Notes service had a problem',
        // The server's own sentence, when it sent one: this is the message the
        // list panel shows instead of an empty workspace, and "something went
        // wrong" there costs an hour of guessing.
        description: error.message || 'Nothing was lost locally. Try again in a moment.',
        requestId: error.requestId,
        isAuth: false,
      };
    }

    return {
      title: isAuth ? 'Your session is no longer valid' : 'The request failed',
      // The server's own message, not its JSON body.
      description: error.message,
      requestId: error.requestId,
      isAuth,
    };
  }

  if (error instanceof TypeError) {
    // `fetch` rejects with a TypeError for DNS, CORS and offline alike.
    return {
      title: 'Could not reach the Notes service',
      description: 'Check the connection, then try again. Nothing was lost.',
      isAuth: false,
    };
  }

  return {
    title: 'Something went wrong',
    description: error instanceof Error ? error.message : String(error),
    isAuth: false,
  };
}

/** The one-line support string: what failed, and the id that finds it in the logs. */
export function supportDetails(error: unknown): string {
  const friendly = explainError(error);
  const parts = [friendly.title];
  if (error instanceof NotesApiError) parts.push(`${error.status} ${error.code}`);
  if (friendly.requestId) parts.push(`requestId ${friendly.requestId}`);
  return parts.join(' · ');
}

interface ReportOptions {
  /** Overrides the derived title when the caller knows the operation's name. */
  title?: string;
  /** Wired to the toast's action button, e.g. re-running the failed save. */
  retry?: () => void;
}

/**
 * The single place a failed request becomes a toast.
 *
 * 401/403 does not toast: `apiClient` raises the session dialog for those, and
 * a toast underneath it is noise on top of a modal.
 */
export function reportError(error: unknown, options: ReportOptions = {}): FriendlyError {
  const friendly = explainError(error);
  if (friendly.isAuth) return friendly;

  toast.error(options.title ?? friendly.title, {
    description: friendly.description,
    duration: 8000,
    action: options.retry
      ? { label: 'Retry', onClick: options.retry }
      : friendly.requestId
        ? {
            label: 'Copy details',
            onClick: () => {
              void navigator.clipboard?.writeText(supportDetails(error));
            },
          }
        : undefined,
  });

  return friendly;
}
