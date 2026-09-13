/**
 * FE0 §6 — formatters: de-DE by default, DST-correct in Europe/Berlin
 * (vitest pins TZ), masked numbers that never leak the middle.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { useSession } from "@/stores/session";
import {
  formatClock,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDuration,
  formatNumber,
  formatPercent,
  formatPhone,
  formatRelative,
  formatTime,
  maskPhone,
} from "@/lib/format";

// jsdom reports an English browser; the owner app's locale is what matters.
beforeAll(() => useSession.getState().setLocale("de"));
afterAll(() => localStorage.removeItem("voice.locale"));

describe("dates (de-DE, Europe/Berlin)", () => {
  it("formats a date and a time the German way", () => {
    expect(formatDate("2026-09-06T12:05:00Z")).toBe("06.09.2026");
    expect(formatTime("2026-09-06T12:05:00Z")).toBe("14:05");
    expect(formatDateTime("2026-09-06T12:05:00Z")).toBe("06.09.2026, 14:05");
  });

  it("crosses the spring DST change at 02:00 → 03:00", () => {
    // 2026-03-29 is the last Sunday of March: 00:30Z is 01:30 CET, 01:30Z is 03:30 CEST.
    expect(formatDateTime("2026-03-29T00:30:00Z")).toBe("29.03.2026, 01:30");
    expect(formatDateTime("2026-03-29T01:30:00Z")).toBe("29.03.2026, 03:30");
  });

  it("crosses the autumn DST change back", () => {
    // 2026-10-25: 00:30Z is 02:30 CEST, 01:30Z is 02:30 CET again.
    expect(formatTime("2026-10-25T00:30:00Z")).toBe("02:30");
    expect(formatTime("2026-10-25T01:30:00Z")).toBe("02:30");
  });

  it("honours an explicit business time zone", () => {
    expect(formatTime("2026-09-06T12:05:00Z", { timeZone: "Europe/Lisbon" })).toBe("13:05");
  });

  it("switches to en-GB on request", () => {
    expect(formatDate("2026-09-06T12:05:00Z", { locale: "en" })).toBe("6 Sept 2026");
  });

  it("returns an empty string for garbage rather than 'Invalid Date'", () => {
    expect(formatDate("not a date")).toBe("");
    expect(formatDateTime(NaN)).toBe("");
  });

  it("phrases relative times in German", () => {
    const now = "2026-09-06T12:00:00Z";
    expect(formatRelative("2026-09-06T11:55:00Z", now)).toBe("vor 5 Minuten");
    expect(formatRelative("2026-09-06T14:00:00Z", now)).toBe("in 2 Stunden");
    expect(formatRelative("2026-09-05T12:00:00Z", now)).toBe("gestern");
    // Beyond a month it becomes a date.
    expect(formatRelative("2026-06-01T12:00:00Z", now)).toBe("01.06.2026");
  });
});

describe("durations", () => {
  it("uses Intl unit names", () => {
    expect(formatDuration(252)).toBe("4 Min. 12 Sek.");
    expect(formatDuration(3840)).toBe("1 Std. 4 Min.");
    expect(formatDuration(0)).toBe("0 Sek.");
    expect(formatDuration(null)).toBe("0 Sek.");
    expect(formatDuration(252, { locale: "en" })).toBe("4 mins 12 secs");
  });
  it("has a compact clock form", () => {
    expect(formatClock(252)).toBe("4:12");
    expect(formatClock(3852)).toBe("1:04:12");
    expect(formatClock(undefined)).toBe("0:00");
  });
});

describe("numbers and money", () => {
  it("formats EUR with the German separators", () => {
    // Intl separates the amount from € with a non-breaking space.
    expect(formatCurrency(1234.56)).toBe("1.234,56\u00a0€");
    expect(formatCurrency(0.5)).toBe("0,50\u00a0€");
    expect(formatCurrency(null)).toBe("");
  });
  it("formats counts and ratios", () => {
    expect(formatNumber(1234)).toBe("1.234");
    expect(formatNumber(12.55)).toBe("12,6");
    expect(formatPercent(0.335)).toBe("34\u00a0%");
    expect(formatPercent(0.335, { locale: "en" })).toBe("34%");
  });
});

describe("phone numbers", () => {
  it("masks the middle of an international number", () => {
    expect(maskPhone("+4917112344521")).toBe("+49 171 ••• 4521");
    expect(maskPhone("+49 171 1234 4521")).toBe("+49 171 ••• 4521");
    expect(maskPhone("+12125550123")).toBe("+1 212 ••• 0123");
  });
  it("masks national numbers", () => {
    expect(maskPhone("017112344521")).toBe("0171 ••• 4521");
  });
  it("never shows a short number in full", () => {
    expect(maskPhone("112")).toBe("••• 12");
    expect(maskPhone("")).toBe("");
    expect(maskPhone(null)).toBe("");
  });
  it("groups an unmasked number for detail views", () => {
    expect(formatPhone("+4917112344521")).toBe("+49 171 1234 4521");
    expect(formatPhone("017112344521")).toBe("0171 1234 4521");
    expect(formatPhone("")).toBe("");
  });
});
