/**
 * FE0 §6 — owner-app i18n: every namespace complete in de and en, and the
 * locale rule (German unless the browser says English).
 */
import { describe, expect, it } from "vitest";
import { VOICE_NAMESPACES, VOICE_RESOURCES, intlLocale, voiceT } from "@/i18n/voice";
import { resolveVoiceLocale, safeReturnTo, useSession } from "@/stores/session";

function flatten(obj: Record<string, unknown>, prefix = "", out: Record<string, unknown> = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v as Record<string, unknown>, key, out);
    else out[key] = v;
  }
  return out;
}

describe("voice namespaces", () => {
  it.each(VOICE_NAMESPACES)("%s has identical keys in de and en, none empty", (ns) => {
    const de = flatten(VOICE_RESOURCES.de[ns]);
    const en = flatten(VOICE_RESOURCES.en[ns]);
    expect(Object.keys(de).sort()).toEqual(Object.keys(en).sort());
    for (const [k, v] of Object.entries(de)) expect(String(v).trim(), `de ${ns}:${k}`).not.toBe("");
    for (const [k, v] of Object.entries(en)) expect(String(v).trim(), `en ${ns}:${k}`).not.toBe("");
  });

  it("uses the Sie form in German copy", () => {
    const de = Object.values(flatten(VOICE_RESOURCES.de["voice-common"])).join(" ");
    expect(de).not.toMatch(/\b(du|dein|deine|dich|dir)\b/i);
  });
});

describe("locale resolution", () => {
  it("is German unless the browser language is English", () => {
    localStorage.removeItem("voice.locale");
    expect(resolveVoiceLocale("de-DE")).toBe("de");
    expect(resolveVoiceLocale("fr")).toBe("de");
    expect(resolveVoiceLocale("uk")).toBe("de");
    expect(resolveVoiceLocale("")).toBe("de");
    expect(resolveVoiceLocale("en-US")).toBe("en");
  });

  it("lets an explicit choice win and feeds Intl", () => {
    useSession.getState().setLocale("en");
    expect(resolveVoiceLocale("de")).toBe("en");
    expect(intlLocale()).toBe("en-GB");
    expect(voiceT("voice-common", "status.connected")).toBe("Connected");
    useSession.getState().setLocale("de");
    expect(intlLocale()).toBe("de-DE");
    expect(voiceT("voice-common", "status.connected")).toBe("Verbunden");
    // Interpolation goes through the owner locale too, not the platform's.
    expect(voiceT("voice-common", "table.sortBy", { column: "Dauer" })).toBe("Nach Dauer sortieren");
  });
});

describe("returnTo safety", () => {
  it("accepts only same-origin paths without credentials", () => {
    expect(safeReturnTo("/telephony/calls?view=table")).toBe("/telephony/calls?view=table");
    expect(safeReturnTo("//evil.example/x")).toBeNull();
    expect(safeReturnTo("https://evil.example")).toBeNull();
    expect(safeReturnTo("/telephony?token=abc")).toBeNull();
    expect(safeReturnTo(null)).toBeNull();
  });
});
