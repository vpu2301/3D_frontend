/**
 * The v3 rules that are decisions rather than rendering: which sentence a deny
 * code maps to in each UI language, and whether the business is open, computed
 * in its own timezone.
 */
import { describe, it, expect } from 'vitest';
import {
  businessNow,
  DENY_REASON_CODES,
  denyReasonText,
  failureLabel,
  intentMeta,
  isOpenNow,
  modeMeta,
  tierMeta,
  todayHoursLabel,
} from '@/pages/telephony/_lib/voiceMeta';
import { E164_RE } from '@/lib/api/voice';

describe('deny reasons (S11 §5.2 codes → sentences)', () => {
  it('answers in both UI languages for every code it claims to know', () => {
    for (const code of DENY_REASON_CODES) {
      const en = denyReasonText(code, 'en');
      const de = denyReasonText(code, 'de');
      expect(en, code).toBeTruthy();
      expect(de, code).toBeTruthy();
      // A missing German entry would fall back to English and read as
      // translated when it is not.
      expect(de, code).not.toBe(en);
    }
  });

  it('follows the i18next region tag', () => {
    expect(denyReasonText('user_denied', 'de-DE')).toBe(denyReasonText('user_denied', 'de'));
    expect(denyReasonText('user_denied', 'en-GB')).toBe(denyReasonText('user_denied', 'en'));
  });

  it('renders an unknown code as the raw code, never a guessed sentence', () => {
    expect(denyReasonText('brand_new_code', 'en')).toBe('brand_new_code');
    expect(denyReasonText(null)).toBeNull();
    expect(denyReasonText('')).toBeNull();
  });
});

describe('v3 chips', () => {
  it('labels the new failure codes readably and leaves the rest to the taxonomy', () => {
    expect(failureLabel('blocked')).toBe('blocked caller');
    expect(failureLabel('busy_capacity')).toBe('line at capacity');
    expect(failureLabel('stt_timeout')).toBe('stt timeout');
  });

  it('knows the inbound intents and passes unknown ones through', () => {
    expect(intentMeta('message')?.label).toBe('message');
    expect(intentMeta('human')?.label).toBe('wants a human');
    expect(intentMeta('brand_new')?.label).toBe('brand new');
    expect(intentMeta(null)).toBeNull();
  });

  it('marks the off mode as autonomous, in amber', () => {
    expect(modeMeta('off')?.label).toBe('autonomous');
    expect(modeMeta('off')?.tone).toBe('amber');
    expect(modeMeta('verbal')?.tone).toBe('green');
    expect(tierMeta('x')?.label).toBe('X');
  });
});

describe('business hours in the business timezone', () => {
  const hours = {
    mon: [{ open: '09:00', close: '17:00' }],
    tue: [{ open: '09:00', close: '12:00' }, { open: '13:00', close: '17:00' }],
    sat: [],
  };

  it('reads the clock in the profile zone, not the browser zone', () => {
    // 07:30 UTC on a Monday: 09:30 in Berlin (open), 00:30 in New York (closed).
    const at = new Date('2026-08-17T07:30:00Z');
    expect(isOpenNow(hours, 'Europe/Berlin', at)).toBe(true);
    expect(isOpenNow(hours, 'America/New_York', at)).toBe(false);
  });

  it('flips exactly on the hours boundary', () => {
    // Berlin is UTC+2 in August.
    expect(isOpenNow(hours, 'Europe/Berlin', new Date('2026-08-17T06:59:00Z'))).toBe(false); // 08:59
    expect(isOpenNow(hours, 'Europe/Berlin', new Date('2026-08-17T07:00:00Z'))).toBe(true); // 09:00
    expect(isOpenNow(hours, 'Europe/Berlin', new Date('2026-08-17T14:59:00Z'))).toBe(true); // 16:59
    expect(isOpenNow(hours, 'Europe/Berlin', new Date('2026-08-17T15:00:00Z'))).toBe(false); // 17:00
  });

  it('honours a lunch break and a closed day', () => {
    // Tuesday 12:30 Berlin — between the two ranges.
    expect(isOpenNow(hours, 'Europe/Berlin', new Date('2026-08-18T10:30:00Z'))).toBe(false);
    expect(isOpenNow(hours, 'Europe/Berlin', new Date('2026-08-18T11:30:00Z'))).toBe(true);
    // Saturday, listed and empty.
    expect(isOpenNow(hours, 'Europe/Berlin', new Date('2026-08-22T10:00:00Z'))).toBe(false);
    // Sunday, not listed at all.
    expect(isOpenNow(hours, 'Europe/Berlin', new Date('2026-08-23T10:00:00Z'))).toBe(false);
  });

  it('handles a range that runs past midnight', () => {
    const late = { fri: [{ open: '22:00', close: '02:00' }] };
    expect(isOpenNow(late, 'Europe/Berlin', new Date('2026-08-21T21:00:00Z'))).toBe(true); // 23:00 Fri
    expect(isOpenNow(late, 'Europe/Berlin', new Date('2026-08-21T18:00:00Z'))).toBe(false); // 20:00 Fri
  });

  it('labels today from the business day, and says so when closed', () => {
    expect(todayHoursLabel(hours, 'Europe/Berlin', new Date('2026-08-18T07:00:00Z'))).toBe(
      '09:00 – 12:00, 13:00 – 17:00',
    );
    expect(todayHoursLabel(hours, 'Europe/Berlin', new Date('2026-08-22T07:00:00Z'))).toBe('closed today');
  });

  it('does not throw on an invalid zone — the panel still renders', () => {
    expect(() => businessNow('Not/AZone', new Date('2026-08-17T07:30:00Z'))).not.toThrow();
  });
});

describe('E.164 validation shared with the server', () => {
  it('accepts international numbers and rejects the usual local forms', () => {
    expect(E164_RE.test('+4930123456')).toBe(true);
    expect(E164_RE.test('+12025550123')).toBe(true);
    expect(E164_RE.test('030123456')).toBe(false);
    expect(E164_RE.test('+0301234567')).toBe(false);
    expect(E164_RE.test('+49 30 123456')).toBe(false);
    expect(E164_RE.test('+491')).toBe(false);
  });
});
