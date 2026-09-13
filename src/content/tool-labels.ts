/**
 * Owner-safe names for tools (FE7 §1). The backend policy list carries raw
 * names like `google__check_freebusy` and no labels (API ask); this curated
 * map covers the built-in tier table and the calendar suffixes every
 * connector shares. Anything unknown falls back to a humanised raw name.
 */
export interface ToolLabel {
  de: string;
  en: string;
  summaryDe: string;
  summaryEn: string;
  group: "calendar" | "contacts" | "knowledge" | "messaging" | "memory" | "admin" | "other";
}

const CAL = "calendar" as const;

export const TOOL_LABELS: Record<string, ToolLabel> = {
  __check_freebusy: { de: "Freie Termine prüfen", en: "Check free slots", summaryDe: "Sieht nach, wann im Kalender noch Platz ist.", summaryEn: "Looks up when the calendar still has room.", group: CAL },
  __list_events: { de: "Termine ansehen", en: "View appointments", summaryDe: "Liest den eigenen Termin des Anrufers.", summaryEn: "Reads the caller's own appointment.", group: CAL },
  __create_event: { de: "Termin eintragen", en: "Book an appointment", summaryDe: "Trägt einen neuen Termin in den Kalender ein.", summaryEn: "Adds a new appointment to the calendar.", group: CAL },
  __update_event: { de: "Termin verschieben", en: "Move an appointment", summaryDe: "Ändert einen bestehenden Termin.", summaryEn: "Changes an existing appointment.", group: CAL },
  __delete_event: { de: "Termin löschen", en: "Delete an appointment", summaryDe: "Entfernt einen Termin endgültig.", summaryEn: "Removes an appointment for good.", group: CAL },
  contact_lookup: { de: "Kontakt nachschlagen", en: "Look up a contact", summaryDe: "Erkennt bekannte Anrufer an ihrer Nummer.", summaryEn: "Recognises known callers by their number.", group: "contacts" },
  mandant_lookup: { de: "Mandanten nachschlagen", en: "Look up a client", summaryDe: "Prüft, ob der Anrufer bereits Mandant ist.", summaryEn: "Checks whether the caller is already a client.", group: "contacts" },
  business_profile_lookup: { de: "Unternehmensprofil lesen", en: "Read the business profile", summaryDe: "Öffnungszeiten, Adresse und Leistungen aus Ihrem Profil.", summaryEn: "Opening hours, address and services from your profile.", group: "knowledge" },
  memory_search: { de: "Gedächtnis durchsuchen", en: "Search memory", summaryDe: "Erinnert sich an frühere Gespräche mit diesem Anrufer.", summaryEn: "Recalls earlier conversations with this caller.", group: "memory" },
  memory_note: { de: "Notiz merken", en: "Remember a note", summaryDe: "Hält etwas aus dem Gespräch für später fest.", summaryEn: "Keeps something from the call for later.", group: "memory" },
  memory_dump: { de: "Gedächtnis exportieren", en: "Export memory", summaryDe: "Gibt alle gespeicherten Notizen aus.", summaryEn: "Outputs every stored note.", group: "memory" },
  send_owner_message: { de: "Nachricht an Sie senden", en: "Send you a message", summaryDe: "Hinterlässt Ihnen eine Nachricht des Anrufers.", summaryEn: "Leaves you a message from the caller.", group: "messaging" },
  email_send: { de: "E-Mail senden", en: "Send an e-mail", summaryDe: "Verschickt eine E-Mail nach außen.", summaryEn: "Sends an e-mail externally.", group: "messaging" },
  make_phone_call: { de: "Anruf starten", en: "Place a call", summaryDe: "Ruft selbstständig jemanden an.", summaryEn: "Calls someone on its own.", group: "messaging" },
  schedule_appointment_call: { de: "Rückruf planen", en: "Schedule a call-back", summaryDe: "Plant einen späteren Anruf.", summaryEn: "Plans a later call.", group: "messaging" },
  do_not_call_add: { de: "Sperrliste erweitern", en: "Add to the do-not-call list", summaryDe: "Sperrt eine Nummer für Anrufe.", summaryEn: "Blocks a number from calls.", group: "admin" },
  do_not_call_remove: { de: "Sperrliste kürzen", en: "Remove from the do-not-call list", summaryDe: "Hebt eine Sperre auf.", summaryEn: "Lifts a block.", group: "admin" },
  thread_lookup: { de: "Vorgänge nachschlagen", en: "Look up matters", summaryDe: "Liest andere Vorgänge und Anrufe.", summaryEn: "Reads other matters and calls.", group: "admin" },
  file_read: { de: "Dateien lesen", en: "Read files", summaryDe: "Liest Dateien auf dem Server.", summaryEn: "Reads files on the server.", group: "admin" },
  file_write: { de: "Dateien schreiben", en: "Write files", summaryDe: "Schreibt Dateien auf dem Server.", summaryEn: "Writes files on the server.", group: "admin" },
  config_get: { de: "Einstellungen lesen", en: "Read settings", summaryDe: "Liest die Systemeinstellungen.", summaryEn: "Reads system settings.", group: "admin" },
  config_set: { de: "Einstellungen ändern", en: "Change settings", summaryDe: "Ändert die Systemeinstellungen.", summaryEn: "Changes system settings.", group: "admin" },
};

export function humanizeTool(raw: string): string {
  const name = raw.includes("__") ? raw.slice(raw.indexOf("__") + 2) : raw;
  return name.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export function toolLabel(raw: string, lang: "de" | "en"): { name: string; summary: string; group: ToolLabel["group"]; curated: boolean } {
  const suffix = raw.includes("__") ? raw.slice(raw.indexOf("__")) : "";
  const entry = TOOL_LABELS[raw] ?? (suffix ? TOOL_LABELS[suffix] : undefined);
  if (!entry) return { name: humanizeTool(raw), summary: "", group: "other", curated: false };
  return { name: lang === "de" ? entry.de : entry.en, summary: lang === "de" ? entry.summaryDe : entry.summaryEn, group: entry.group, curated: true };
}
