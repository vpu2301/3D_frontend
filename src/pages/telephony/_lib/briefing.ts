/**
 * The briefing rules, mirrored from the backend so the form can answer before
 * the request goes out (`pincer.voice.briefing`).
 *
 * The server is the authority: these numbers and sentences exist so the user
 * is not told "no" by a round trip, and the English strings are byte-identical
 * to the ones the API returns as a 422 `detail`. A 422 is still rendered
 * verbatim — if the two ever drift, what the server said wins.
 */

export const MIN_TASK_CHARS = 10;
/** The appointment flow composes its task, so only the topic is checked. */
export const MIN_TOPIC_CHARS = 3;
export const MAX_TASK_CHARS = 2000;
/** Where the counter appears — early enough to steer, late enough to ignore. */
export const COUNTER_FROM_CHARS = 1500;
/** A paste this size is a document, and the user must see it landed whole. */
export const PASTE_FLASH_CHARS = 300;

const TASK_TOO_SHORT = {
  en: 'Purpose too short — tell the agent concretely what to do on this call.',
  de: 'Auftrag zu kurz — sagen Sie dem Agenten konkret, was er in diesem Anruf tun soll.',
};

const TOPIC_TOO_SHORT = {
  en: 'Purpose too short — say what the appointment is about, so the agent can open the call with it.',
  de: 'Auftrag zu kurz — sagen Sie, worum es beim Termin geht, damit der Agent das Gespräch damit eröffnen kann.',
};

/** Tolerates an i18n stub that has not resolved a language yet. */
const de = (lang: string | undefined) => !!lang && lang.startsWith('de');

export type BriefingField = 'task' | 'topic';

export const minCharsFor = (field: BriefingField) =>
  field === 'topic' ? MIN_TOPIC_CHARS : MIN_TASK_CHARS;

/**
 * The message for what is wrong with this text, or null when it is fine.
 * Whitespace is never a briefing, so length is measured after trimming —
 * exactly as `validate_task` does.
 */
export function briefingError(text: string, field: BriefingField, lang?: string): string | null {
  const value = text.trim();
  if (value.length >= minCharsFor(field)) return null;
  const entry = field === 'topic' ? TOPIC_TOO_SHORT : TASK_TOO_SHORT;
  return de(lang) ? entry.de : entry.en;
}

/** Over-length paste: keep the head, and say so — never drop the tail silently. */
export function clampBriefing(text: string): { value: string; truncated: boolean } {
  if (text.length <= MAX_TASK_CHARS) return { value: text, truncated: false };
  return { value: text.slice(0, MAX_TASK_CHARS), truncated: true };
}

export const truncatedToast = (lang?: string) =>
  de(lang)
    ? `Auftrag auf ${MAX_TASK_CHARS.toLocaleString('de-DE')} Zeichen gekürzt`
    : `Purpose truncated to ${MAX_TASK_CHARS.toLocaleString('en-US')} characters`;

/** "1 743 / 2 000" — grouped, because four digits are hard to read at a glance. */
export const charCount = (n: number, lang?: string) =>
  `${n.toLocaleString(de(lang) ? 'de-DE' : 'en-US')} / ${MAX_TASK_CHARS.toLocaleString(de(lang) ? 'de-DE' : 'en-US')}`;

/** The confirmation that answers "did my text actually go?" (§1.4). */
export const briefingSentNote = (chars: number, lang?: string) =>
  de(lang) ? `Auftrag gesendet (${chars} Zeichen)` : `briefing sent (${chars} chars)`;

export interface BriefingExample {
  good: boolean;
  text: string;
  why?: string;
}

/**
 * Three examples, not a rulebook: two that give the agent a goal and one that
 * does not. They are illustrations only — nothing beyond length is validated,
 * and a long or unusual briefing must never be blocked.
 */
export function briefingExamples(lang?: string): BriefingExample[] {
  return de(lang)
    ? [
        { good: true, text: 'Den Termin am Donnerstag um 14:00 bestätigen; falls er nicht mehr passt, Freitag 10:00 oder 11:30 anbieten.' },
        { good: true, text: 'Nach den Öffnungszeiten am Samstag fragen und ob ein Termin nötig ist.' },
        { good: false, text: 'Mit ihnen reden.', why: 'zu vage — der Agent braucht ein konkretes Ziel' },
      ]
    : [
        { good: true, text: "Confirm Thursday's 14:00 appointment; if it no longer works, offer Friday 10:00 or 11:30." },
        { good: true, text: 'Ask their opening hours for Saturday and whether an appointment is needed.' },
        { good: false, text: 'Talk to them.', why: 'too vague — the agent needs a concrete goal' },
      ];
}

/** Follow-up stub (§4): the thread's subject plus what is still owed. */
export function followUpPurpose(subject: string, openCommitment?: string | null, lang?: string): string {
  const head = de(lang) ? `Nachfassen zu: ${subject}.` : `Follow-up on: ${subject}.`;
  const tail = openCommitment?.trim();
  return tail ? `${head} ${tail}` : head;
}

/** Call-back stub (§4) for a message the receptionist took. */
export function callBackPurpose(caller: string, matter: string, lang?: string): string {
  const who = caller.trim() || (de(lang) ? 'den Anrufer' : 'the caller');
  const what = matter.trim().slice(0, 200);
  return de(lang) ? `Rückruf für ${who}: ${what}` : `Return call for ${who}: ${what}`;
}
