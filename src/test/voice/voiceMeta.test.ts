/**
 * The language-switch divider and the outcome/failure chip are the two places
 * where the Voice page reads backend data whose exact shape is not pinned by a
 * schema: the switch entry is free-ish text on a SYSTEM transcript line, and
 * the failure-code vocabulary grows sprint by sprint. Both are parsed
 * defensively, and these tests pin what "defensively" means — including the
 * negative cases, because a false positive turns an ordinary system line into
 * a divider and loses its text.
 */
import { describe, it, expect } from 'vitest';
import type { CallSummary, TranscriptLine } from '@/lib/api/voice';
import {
  languageNative,
  languageSwitchText,
  parseLanguageSwitch,
  rowChip,
} from '@/pages/telephony/_lib/voiceMeta';

function line(text: string, speaker = 'system'): TranscriptLine {
  return { speaker, text, confidence: 1, state: 'final', timestamp: '2026-08-19T10:00:00Z' };
}

const CALL: CallSummary = {
  call_sid: 'CA1',
  direction: 'outbound',
  status: 'completed',
  from_number: '+4915112345678',
  to_number: '+4930987654',
  started_at: '2026-08-19T10:00:00Z',
  ended_at: '2026-08-19T10:03:20Z',
  duration_seconds: 200,
};

describe('parseLanguageSwitch', () => {
  it('reads the JSON event form', () => {
    const sw = parseLanguageSwitch(
      line('{"event":"language_switch","from":"en","to":"de","reason":"caller request"}'),
    )!;
    expect(sw).toEqual({ from: 'en', to: 'de', reason: 'caller request' });
    expect(languageSwitchText(sw)).toBe('switched to Deutsch at caller request');
  });

  it('reads the arrow form, with or without a reason', () => {
    expect(parseLanguageSwitch(line('language_switch: en -> de (caller request)'))).toEqual({
      from: 'en',
      to: 'de',
      reason: 'caller request',
    });
    expect(parseLanguageSwitch(line('language_switch en→de'))).toEqual({
      from: 'en',
      to: 'de',
      reason: null,
    });
  });

  it('reads the prose form by endonym or English name', () => {
    expect(parseLanguageSwitch(line('switched to Deutsch at caller request'))).toEqual({
      from: null,
      to: 'de',
      reason: 'caller request',
    });
    expect(parseLanguageSwitch(line('Switched to German.'))?.to).toBe('de');
  });

  it('normalises regional subtags to the base language', () => {
    expect(parseLanguageSwitch(line('language_switch: en-GB -> de_DE'))?.to).toBe('de');
  });

  it('ignores lines that are not switches, and switches not spoken by SYSTEM', () => {
    expect(parseLanguageSwitch(line('Guten Tag, hier ist Pincer.', 'agent'))).toBeNull();
    // A caller *saying* they switched is not a switch event.
    expect(parseLanguageSwitch(line('switched to Deutsch', 'caller'))).toBeNull();
    expect(parseLanguageSwitch(line('call answered by voicemail'))).toBeNull();
    expect(parseLanguageSwitch(line('switched to accounting'))).toBeNull();
    expect(parseLanguageSwitch(line('{"event":"barge_in"}'))).toBeNull();
    expect(parseLanguageSwitch(line('{not json'))).toBeNull();
  });
});

describe('languageNative', () => {
  it('falls back to the raw code rather than inventing a name', () => {
    expect(languageNative('de')).toBe('Deutsch');
    expect(languageNative('xx')).toBe('XX');
    expect(languageNative(null)).toBe('');
  });
});

describe('rowChip', () => {
  it('prefers the failure code, always in red', () => {
    const chip = rowChip({ ...CALL, failure_code: 'no_answer', outcome: { outcome: 'completed' } })!;
    expect(chip).toMatchObject({ label: 'no answer', tone: 'red' });
  });

  it('colours known outcomes by meaning and unknown ones cautiously', () => {
    expect(rowChip({ ...CALL, outcome: { outcome: 'confirmed' } })!.tone).toBe('green');
    expect(rowChip({ ...CALL, outcome: { outcome: 'no_answer' } })!.tone).toBe('grey');
    expect(rowChip({ ...CALL, outcome: { outcome: 'declined' } })!.tone).toBe('amber');
    expect(rowChip({ ...CALL, outcome: { outcome: 'wildly_new_thing' } })!.tone).toBe('amber');
  });

  it('renders nothing when the backend reported neither', () => {
    expect(rowChip(CALL)).toBeNull();
  });
});
