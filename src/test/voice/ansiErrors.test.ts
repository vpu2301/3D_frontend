/**
 * Terminal escape codes never reach the DOM.
 *
 * A failed outbound call used to render as
 * `Error placing call: [31m[49mHTTP Error[0m [37m[49mYour request was:[0m …`
 * in the call composer. `twilio-python` colours `TwilioRestException.__str__`
 * with ANSI SGR sequences whenever the server process has a tty on stderr, the
 * backend put that string in the HTTP `detail`, and rule 11 ("show the
 * server's detail verbatim") faithfully painted the control codes.
 *
 * The backend now sends a clean sentence (`voice/outbound.twilio_error_text`).
 * This pins the client-side guard, so the next library that colours an error
 * message cannot reproduce the bug.
 */
import { describe, expect, it } from "vitest";
import { normalizeErrorBody, stripAnsi } from "@/lib/api/client";

// U+001B built at runtime rather than typed as a literal: a raw escape byte
// in the source makes the file binary to grep, to diffs and to secret
// scanners, which is how a credential once hid in here from every local scan.
const ESC = String.fromCharCode(27);
/** The exact body the browser received, escape codes and all. */
const TWILIO_ANSI_DETAIL =
  `Error placing call: ${ESC}[31m${ESC}[49mHTTP Error${ESC}[0m ${ESC}[37m${ESC}[49mYour request was:${ESC}[0m\n\n` +
  `${ESC}[36m${ESC}[49mPOST /Accounts/ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/Calls.json${ESC}[0m\n\n` +
  `${ESC}[37m${ESC}[49mTwilio returned the following information:${ESC}[0m\n\n` +
  `${ESC}[34m${ESC}[49mUnable to create record: The source phone number provided, +19804584570, ` +
  `is not yet verified for your account.${ESC}[0m\n\n` +
  `${ESC}[37m${ESC}[49mMore information may be available here:${ESC}[0m\n\n` +
  `${ESC}[34m${ESC}[49mhttps://www.twilio.com/docs/errors/21210${ESC}[0m\n\n`;

describe("stripAnsi", () => {
  it("removes SGR sequences and keeps every readable character", () => {
    const out = stripAnsi(TWILIO_ANSI_DETAIL);
    expect(out).not.toContain(ESC);
    expect(out).not.toMatch(/\[\d{1,2}m/);
    // …and the words the owner needs are all still there.
    expect(out).toContain("Error placing call:");
    expect(out).toContain("+19804584570");
    expect(out).toContain("is not yet verified for your account");
    expect(out).toContain("https://www.twilio.com/docs/errors/21210");
  });

  it("leaves an ordinary message untouched", () => {
    const plain = "Invalid phone number: +49 is not a complete number.";
    expect(stripAnsi(plain)).toBe(plain);
  });

  it("keeps intentional line breaks but collapses the padding", () => {
    expect(stripAnsi("one\n\n\n\n\ntwo")).toBe("one\n\ntwo");
    expect(stripAnsi("  spaced  \n")).toBe("spaced");
  });

  it("drops stray control characters that would render as boxes", () => {
    const BELL = String.fromCharCode(7);
    const NUL = String.fromCharCode(0);
    expect(stripAnsi(`bell${BELL} and null${NUL}`)).toBe("bell and null");
  });
});

describe("normalizeErrorBody sanitises what the UI renders", () => {
  it("strips a coloured detail before it becomes an ApiError message", () => {
    const { detail } = normalizeErrorBody({ detail: TWILIO_ANSI_DETAIL }, 502);
    expect(detail).not.toContain(ESC);
    expect(detail).toContain("is not yet verified for your account");
  });

  it("strips per-field messages too, so inline field errors stay clean", () => {
    const body = { detail: [{ loc: ["body", "purpose"], msg: `${ESC}[31mtoo vague${ESC}[0m` }] };
    const { detail, fields } = normalizeErrorBody(body, 422);
    expect(detail).toBe("too vague");
    expect(fields?.purpose).toBe("too vague");
  });

  it("falls back to the status when a detail is nothing but escape codes", () => {
    const { detail } = normalizeErrorBody({ detail: `${ESC}[31m${ESC}[0m` }, 502);
    expect(detail).toBe("HTTP 502");
  });
});
