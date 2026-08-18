import { z } from 'zod';
import {
  addDays,
  setHours,
  setMinutes,
  startOfDay,
  addMinutes,
  startOfWeek,
} from 'date-fns';

export const NLParseSchema = z.object({
  title: z.string().min(1),
  start: z.string(),
  end: z.string(),
  location: z.string().optional(),
  attendees: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(1),
});

export type NLParse = z.infer<typeof NLParseSchema>;

// Client-side mock NL parser — mirrors the contract we'd expect from the
// server parser (§4 of the spec). Real implementation lives in the platform
// LLM gateway; this lets the UI feel real until that's wired.
export function mockParse(input: string, now: Date = new Date()): NLParse {
  const text = input.trim();
  if (!text) {
    return {
      title: '',
      start: now.toISOString(),
      end: addMinutes(now, 30).toISOString(),
      confidence: 0,
    };
  }

  let confidence = 0.55;

  // Day anchor
  let day = startOfDay(now);
  const lower = text.toLowerCase();
  const dow = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const nextWeek = /next\s+week/.test(lower);
  let matchedDay = false;
  for (let i = 0; i < 7; i++) {
    if (lower.includes(dow[i])) {
      const offset = (i - weekStart.getDay() + 7) % 7;
      day = addDays(weekStart, offset + (nextWeek ? 7 : 0));
      matchedDay = true;
      confidence += 0.15;
      break;
    }
  }
  if (!matchedDay) {
    if (/\btomorrow\b/.test(lower)) { day = addDays(day, 1); confidence += 0.15; }
    else if (/\btoday\b/.test(lower)) { confidence += 0.15; }
  }

  // Time
  const timeMatch = lower.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/);
  let hour = 9;
  let minute = 0;
  if (timeMatch) {
    hour = parseInt(timeMatch[1], 10);
    minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const period = timeMatch[3];
    if (period === 'pm' && hour < 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    if (!period && hour < 8) hour += 12; // "at 1" → 1pm
    confidence += 0.15;
  }
  const start = setMinutes(setHours(day, hour), minute);

  // Duration
  let durationMin = 60;
  const forHours = lower.match(/for\s+(\d+(?:\.\d+)?)\s*(h|hour|hours|hr|hrs)/);
  const forMins = lower.match(/for\s+(\d+)\s*(m|min|mins|minutes)/);
  if (forHours) durationMin = Math.round(parseFloat(forHours[1]) * 60);
  else if (forMins) durationMin = parseInt(forMins[1], 10);
  else if (/\blunch\b|\bcoffee\b/.test(lower)) durationMin = 45;
  else if (/\bstandup\b|\bsync\b/.test(lower)) durationMin = 30;

  // Title — strip time/day words
  let title = text
    .replace(/\b(next\s+week|tomorrow|today)\b/gi, '')
    .replace(/\b(sun|mon|tues?|wed(nes)?|thur?s?|fri|sat)(day)?\b/gi, '')
    .replace(/\bat\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?\b/gi, '')
    .replace(/\bfor\s+\d+(?:\.\d+)?\s*(h|hr|hrs|hour|hours|m|min|mins|minutes)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (!title) title = 'New event';

  // Attendees (simple "with X" heuristic)
  const attendees: string[] = [];
  const withMatch = title.match(/\bwith\s+([A-Z][a-z]+(?:\s+and\s+[A-Z][a-z]+)?)/);
  if (withMatch) {
    withMatch[1].split(/\s+and\s+/).forEach(n => attendees.push(n));
    confidence += 0.1;
  }

  // Location ("at the X place", "at Y office")
  let location: string | undefined;
  const atPlace = title.match(/\bat\s+(the\s+)?([A-Za-z][\w\s']+?(?:office|place|spot|cafe|restaurant|bar))\b/i);
  if (atPlace) {
    location = atPlace[2];
    title = title.replace(atPlace[0], '').trim();
    confidence += 0.05;
  }

  return {
    title,
    start: start.toISOString(),
    end: addMinutes(start, durationMin).toISOString(),
    location,
    attendees: attendees.length ? attendees : undefined,
    confidence: Math.min(1, confidence),
  };
}
