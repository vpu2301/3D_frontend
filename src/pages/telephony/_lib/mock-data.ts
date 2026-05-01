// ---------------------------------------------------------------------------
// Telephony module – mock data (German market: Praxis / Steuerberatung / Immobilien)
// ---------------------------------------------------------------------------

// ─── Types ───────────────────────────────────────────────────────────────────

export type CallStatus =
  | 'live'
  | 'completed'
  | 'failed'
  | 'pending_approval'
  | 'awaiting_user'
  | 'aborted'
  | 'scheduled'
  | 'queued';

export type CallDirection = 'inbound' | 'outbound';

export type CallOutcome =
  | 'booked'
  | 'info_collected'
  | 'voicemail'
  | 'no_answer'
  | 'user_aborted'
  | 'callback_requested'
  | 'failed'
  | null;

export interface TranscriptTurn {
  id: string;
  role: 'agent' | 'counterparty';
  text: string;
  timestampSec: number;
}

export interface GeneratedDoc {
  id: string;
  type: 'calendar_event' | 'crm_note' | 'document' | 'note';
  label: string;
  href: string;
  action: 'created' | 'updated' | 'scheduled';
}

export interface CallRecord {
  callSid: string;
  direction: CallDirection;
  status: CallStatus;
  counterpartyName?: string;
  /** E.164 German-market phone number, e.g. +4989… */
  counterpartyPhone: string;
  counterpartyCountry: string;
  agentPersona: string;
  objective: string;
  summary: string;
  numberUsed: string;
  /** Unix epoch milliseconds; 0 when not yet started (pending_approval) */
  startedAt: number;
  /** Future timestamp for status=scheduled */
  scheduledAt?: number;
  /** Queue position (1-based) for status=queued */
  queuePosition?: number;
  /** 0 while live or not yet started */
  durationSec: number;
  costEur: number;
  outcome: CallOutcome;
  transcript: TranscriptTurn[];
  hasUserIntervention: boolean;
  tags: string[];
  generatedDocs?: GeneratedDoc[];
}

export interface PhoneNumber {
  id: string;
  e164: string;
  national: string;
  country: string;
  status: 'active' | 'provisioning' | 'disabled';
  agentPersona: string;
  callsLast7Days: number;
  costLast7Days: number;
  monthlyFee: number;
}

export interface PendingApproval {
  id: string;
  callSid: string;
  direction: CallDirection;
  counterpartyPhone: string;
  counterpartyName?: string;
  objective: string;
  estimatedCostEur: number;
  triggeredBy: string;
  triggeredAt: number;
  expiresAt: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Fixed "now" so mock data is stable: 2026-05-01 10:00:00 UTC */
const NOW = 1746090000000;

function minsAgo(n: number): number {
  return NOW - n * 60_000;
}

function daysAgo(n: number, offsetHours = 0): number {
  return NOW - n * 86_400_000 - offsetHours * 3_600_000;
}

function dateStr(daysBack: number): string {
  return new Date(NOW - daysBack * 86_400_000).toISOString().split('T')[0];
}

// ─── MOCK_CALLS ──────────────────────────────────────────────────────────────

export const MOCK_CALLS: CallRecord[] = [
  // ── 1. LIVE outbound ─────────────────────────────────────────────────────
  {
    callSid: 'CA_live_001',
    direction: 'outbound',
    status: 'live',
    counterpartyName: 'Petra Hoffmann',
    counterpartyPhone: '+4915123456789',
    counterpartyCountry: 'DE',
    agentPersona: 'Rezeptionistin Maria',
    objective: 'Terminbestätigung für Vorsorgeuntersuchung am 03.05.2026 um 09:30 Uhr',
    summary: 'Laufendes Gespräch – Terminbestätigung läuft.',
    numberUsed: '+498940990100',
    startedAt: minsAgo(3),
    durationSec: 0,
    costEur: 0.34,
    outcome: null,
    hasUserIntervention: false,
    tags: ['praxis', 'termin', 'live'],
    transcript: [
      {
        id: 'tt-live-001-1',
        role: 'agent',
        text: 'Praxis Dr. Seiler, guten Morgen, mein Name ist Maria. Was kann ich für Sie tun?',
        timestampSec: 2,
      },
      {
        id: 'tt-live-001-2',
        role: 'counterparty',
        text: 'Guten Morgen.',
        timestampSec: 5,
      },
      {
        id: 'tt-live-001-3',
        role: 'agent',
        text: 'Ich rufe an, um Ihren Termin am Samstag, den 3. Mai um 9:30 Uhr zur Vorsorgeuntersuchung zu bestätigen. Ist dieser Termin für Sie noch in Ordnung, Frau Hoffmann?',
        timestampSec: 7,
      },
      {
        id: 'tt-live-001-4',
        role: 'counterparty',
        text: 'Ja, das passt mir gut. Muss ich etwas mitbringen?',
        timestampSec: 19,
      },
      {
        id: 'tt-live-001-5',
        role: 'agent',
        text: 'Bitte bringen Sie Ihre Krankenversicherungskarte sowie – falls vorhanden – Ihren letzten Arztbrief mit. Sind Sie nüchtern, also mindestens sechs Stunden ohne Essen und trinken außer Wasser?',
        timestampSec: 24,
      },
      {
        id: 'tt-live-001-6',
        role: 'counterparty',
        text: 'Ah ja, ich weiß. Das mache ich immer so.',
        timestampSec: 38,
      },
      {
        id: 'tt-live-001-7',
        role: 'agent',
        text: 'Sehr gut. Dann sind Sie bestens vorbereitet. Falls Sie den Termin absagen müssen, bitten wir Sie, uns mindestens 24 Stunden vorher zu informieren – Sie erreichen uns unter der bekannten Nummer.',
        timestampSec: 42,
      },
      {
        id: 'tt-live-001-8',
        role: 'counterparty',
        text: 'Alles klar, vielen Dank. Bis Samstag dann.',
        timestampSec: 56,
      },
    ],
  },

  // ── 2–4. PENDING APPROVAL ────────────────────────────────────────────────
  {
    callSid: 'CA_pending_002',
    direction: 'outbound',
    status: 'pending_approval',
    counterpartyName: 'Thomas Weber',
    counterpartyPhone: '+4969123456780',
    counterpartyCountry: 'DE',
    agentPersona: 'Assistentin Klara (Steuerberatung Müller & Partner)',
    objective:
      'Nachfrage wegen fehlender Belege (Fahrtkosten 2025) für die Steuererklärung – Fristablauf in 7 Tagen',
    summary: 'Warte auf Freigabe durch Steuerberater vor dem Anruf.',
    numberUsed: '+496940990200',
    startedAt: 0,
    durationSec: 0,
    costEur: 0,
    outcome: null,
    hasUserIntervention: false,
    tags: ['steuerberatung', 'belege', 'frist'],
    transcript: [],
  },
  {
    callSid: 'CA_pending_003',
    direction: 'outbound',
    status: 'pending_approval',
    counterpartyName: 'Immobilien Becker GmbH',
    counterpartyPhone: '+4930987654321',
    counterpartyCountry: 'DE',
    agentPersona: 'Maklerassistent Lars',
    objective:
      'Besichtigungstermin für Wohnobjekt Musterstraße 12 in Berlin-Mitte vereinbaren – Interessent Herr Krause',
    summary: 'Freigabe durch Immobilienmakler Becker ausstehend.',
    numberUsed: '+493040990300',
    startedAt: 0,
    durationSec: 0,
    costEur: 0,
    outcome: null,
    hasUserIntervention: false,
    tags: ['immobilien', 'besichtigung', 'berlin'],
    transcript: [],
  },
  {
    callSid: 'CA_pending_004',
    direction: 'outbound',
    status: 'pending_approval',
    counterpartyName: 'Sabine Richter',
    counterpartyPhone: '+4989555012345',
    counterpartyCountry: 'DE',
    agentPersona: 'Rezeptionistin Maria',
    objective:
      'Recall-Anruf – Patientin hat seit über 18 Monaten keinen Zahnarzttermin wahrgenommen, Erinnerungsanruf gemäß Recall-Programm',
    summary: 'Freigabe durch Dr. Seiler erforderlich.',
    numberUsed: '+498940990100',
    startedAt: 0,
    durationSec: 0,
    costEur: 0,
    outcome: null,
    hasUserIntervention: false,
    tags: ['praxis', 'recall', 'zahnmedizin'],
    transcript: [],
  },

  // ── 5. AWAITING USER ────────────────────────────────────────────────────
  {
    callSid: 'CA_await_005',
    direction: 'inbound',
    status: 'awaiting_user',
    counterpartyName: 'Klaus Bauer',
    counterpartyPhone: '+4921198765432',
    counterpartyCountry: 'DE',
    agentPersona: 'Assistentin Klara (Steuerberatung Müller & Partner)',
    objective:
      'Herr Bauer möchte Rückruf vom Steuerberater bezüglich Einspruchsfrist – Agent benötigt Bestätigung ob Rückruf heute noch möglich ist',
    summary:
      'Eingehender Anruf – Herr Bauer wartet auf Bestätigung des Rückruftermins. Agent pausiert und wartet auf Antwort des Nutzers.',
    numberUsed: '+496940990200',
    startedAt: minsAgo(8),
    durationSec: 0,
    costEur: 0.12,
    outcome: null,
    hasUserIntervention: false,
    tags: ['steuerberatung', 'rückruf', 'awaiting'],
    transcript: [
      {
        id: 'tt-await-005-1',
        role: 'counterparty',
        text: 'Ja, hallo, mein Name ist Bauer, Klaus Bauer. Ich habe eine dringende Frage zu einem Einspruch gegen meinen Steuerbescheid.',
        timestampSec: 3,
      },
      {
        id: 'tt-await-005-2',
        role: 'agent',
        text: 'Guten Tag, Herr Bauer. Sie sind bei Steuerberatung Müller & Partner. Ich bin Klara, die digitale Assistentin. Ich kann Ihnen gerne helfen oder einen Rückruf mit einem unserer Berater organisieren. Was bevorzugen Sie?',
        timestampSec: 7,
      },
      {
        id: 'tt-await-005-3',
        role: 'counterparty',
        text: 'Bitte einen Rückruf noch heute, am besten vor 17 Uhr. Die Einspruchsfrist läuft in drei Tagen ab.',
        timestampSec: 22,
      },
      {
        id: 'tt-await-005-4',
        role: 'agent',
        text: 'Ich verstehe die Dringlichkeit, Herr Bauer. Ich prüfe gerade die Verfügbarkeit unserer Berater für heute Nachmittag – bitte bleiben Sie kurz in der Leitung.',
        timestampSec: 31,
      },
    ],
  },

  // ── 6–15. COMPLETED ─────────────────────────────────────────────────────
  {
    callSid: 'CA_done_006',
    direction: 'outbound',
    status: 'completed',
    counterpartyName: 'Anna Schneider',
    counterpartyPhone: '+4989443218765',
    counterpartyCountry: 'DE',
    agentPersona: 'Rezeptionistin Maria',
    objective: 'Termin für Blutabnahme am 02.05.2026 um 08:00 Uhr bestätigen',
    summary:
      'Frau Schneider hat den Termin bestätigt und wurde über die Nüchternheitspflicht informiert.',
    numberUsed: '+498940990100',
    startedAt: daysAgo(0, 2),
    durationSec: 127,
    costEur: 0.19,
    outcome: 'booked',
    hasUserIntervention: false,
    tags: ['praxis', 'termin', 'blutabnahme'],
    generatedDocs: [
      { id: 'doc_cal_001', type: 'calendar_event', label: 'Blutabnahme — Mo. 5. Mai 09:30', href: '/calendar', action: 'created' },
      { id: 'doc_note_001', type: 'crm_note', label: 'Terminbestätigung an Patient gesendet', href: '/notes', action: 'created' },
    ],
    transcript: [
      {
        id: 'tt-done-006-1',
        role: 'agent',
        text: 'Praxis Dr. Seiler, guten Morgen. Ich rufe für Frau Schneider an – ist Anna Schneider erreichbar?',
        timestampSec: 2,
      },
      {
        id: 'tt-done-006-2',
        role: 'counterparty',
        text: 'Ja, ich bin es selbst.',
        timestampSec: 6,
      },
      {
        id: 'tt-done-006-3',
        role: 'agent',
        text: 'Schön, guten Morgen Frau Schneider. Ich rufe an, um Ihren Termin für die Blutabnahme morgen früh um 8 Uhr zu bestätigen. Passt das noch?',
        timestampSec: 8,
      },
      {
        id: 'tt-done-006-4',
        role: 'counterparty',
        text: 'Ja, ich komme.',
        timestampSec: 22,
      },
      {
        id: 'tt-done-006-5',
        role: 'agent',
        text: 'Wunderbar. Wichtig: Bitte kommen Sie nüchtern – mindestens 8 Stunden nichts essen, nur Wasser trinken. Und bringen Sie bitte Ihre Versicherungskarte mit.',
        timestampSec: 25,
      },
      {
        id: 'tt-done-006-6',
        role: 'counterparty',
        text: 'Gut, das weiß ich. Danke.',
        timestampSec: 40,
      },
      {
        id: 'tt-done-006-7',
        role: 'agent',
        text: 'Wir freuen uns auf Ihren Besuch morgen früh. Auf Wiederhören.',
        timestampSec: 44,
      },
      {
        id: 'tt-done-006-8',
        role: 'counterparty',
        text: 'Auf Wiederhören.',
        timestampSec: 50,
      },
    ],
  },
  {
    callSid: 'CA_done_007',
    direction: 'inbound',
    status: 'completed',
    counterpartyName: 'Michael Braun',
    counterpartyPhone: '+4930765432109',
    counterpartyCountry: 'DE',
    agentPersona: 'Maklerassistent Lars',
    objective:
      'Eingehende Anfrage wegen Neubauwohnung Pankow – Exposé-Versand und Besichtigungstermin',
    summary:
      'Herr Braun interessiert sich für 3-Zimmer-Wohnung in Berlin-Pankow. Exposé per E-Mail versendet, Besichtigungstermin für 05.05. um 15:00 Uhr vereinbart.',
    numberUsed: '+493040990300',
    startedAt: daysAgo(1, 1),
    durationSec: 312,
    costEur: 0.47,
    outcome: 'booked',
    hasUserIntervention: false,
    tags: ['immobilien', 'neubau', 'pankow', 'besichtigung'],
    generatedDocs: [
      { id: 'doc_cal_002', type: 'calendar_event', label: 'Besichtigung Pankow — Di. 6. Mai 15:00', href: '/calendar', action: 'scheduled' },
      { id: 'doc_doc_001', type: 'document', label: 'Exposé Objekt #2024-0187 vorbereitet', href: '/docs', action: 'created' },
    ],
    transcript: [
      {
        id: 'tt-done-007-1',
        role: 'counterparty',
        text: 'Guten Tag, ich habe Ihre Anzeige bei ImmobilienScout24 gesehen – die Wohnung in Pankow. Können Sie mir mehr Informationen geben?',
        timestampSec: 4,
      },
      {
        id: 'tt-done-007-2',
        role: 'agent',
        text: 'Guten Tag! Herzlich willkommen bei Immobilien Becker. Natürlich, ich helfe Ihnen gerne. Um welches Objekt handelt es sich – haben Sie die Anzeigennummer zur Hand?',
        timestampSec: 9,
      },
      {
        id: 'tt-done-007-3',
        role: 'counterparty',
        text: 'Ja, die Nummer ist IB-2026-0412, glaube ich. Die 3-Zimmer-Wohnung, 78 Quadratmeter.',
        timestampSec: 18,
      },
      {
        id: 'tt-done-007-4',
        role: 'agent',
        text: 'Genau, das ist unser Neubau-Objekt in der Florastraße, 3. Obergeschoss, Aufzug vorhanden, Einbauküche optional. Kaltmiete 1.450 Euro. Soll ich Ihnen das Exposé per E-Mail zusenden?',
        timestampSec: 26,
      },
      {
        id: 'tt-done-007-5',
        role: 'counterparty',
        text: 'Ja, bitte. Und wäre eine Besichtigung diese Woche möglich?',
        timestampSec: 45,
      },
      {
        id: 'tt-done-007-6',
        role: 'agent',
        text: 'Absolut. Wie wäre Ihnen Montag der 5. Mai um 15 Uhr? Das Objekt ist dann frei.',
        timestampSec: 50,
      },
      {
        id: 'tt-done-007-7',
        role: 'counterparty',
        text: 'Das passt perfekt. Ich bin dabei.',
        timestampSec: 62,
      },
      {
        id: 'tt-done-007-8',
        role: 'agent',
        text: 'Wunderbar. Ich notiere Sie für Montag, 5. Mai, 15:00 Uhr, Florastraße 12, Berlin-Pankow. Das Exposé geht noch heute an Sie raus. Auf welche E-Mail-Adresse?',
        timestampSec: 66,
      },
      {
        id: 'tt-done-007-9',
        role: 'counterparty',
        text: 'm.braun1985 at gmail punkt com.',
        timestampSec: 82,
      },
      {
        id: 'tt-done-007-10',
        role: 'agent',
        text: 'Eingetragen. Vielen Dank, Herr Braun. Wir freuen uns auf die Besichtigung. Auf Wiederhören!',
        timestampSec: 88,
      },
    ],
  },
  {
    callSid: 'CA_done_008',
    direction: 'outbound',
    status: 'completed',
    counterpartyName: 'Lena Fischer',
    counterpartyPhone: '+4921156781234',
    counterpartyCountry: 'DE',
    agentPersona: 'Assistentin Klara (Steuerberatung Müller & Partner)',
    objective:
      'Steuerberatungstermin für Jahresabschluss 2025 vereinbaren – Mandantin Lena Fischer, Freiberuflerin',
    summary:
      'Termin am 08.05.2026 um 14:30 Uhr vereinbart. Frau Fischer soll EÜR und alle relevanten Belege mitbringen.',
    numberUsed: '+496940990200',
    startedAt: daysAgo(2, 3),
    durationSec: 198,
    costEur: 0.29,
    outcome: 'booked',
    hasUserIntervention: false,
    tags: ['steuerberatung', 'jahresabschluss', 'termin'],
    transcript: [
      {
        id: 'tt-done-008-1',
        role: 'agent',
        text: 'Guten Tag Frau Fischer, hier ist Klara von Steuerberatung Müller & Partner. Ich rufe an wegen Ihres Jahresabschlusses 2025. Haben Sie kurz Zeit?',
        timestampSec: 2,
      },
      {
        id: 'tt-done-008-2',
        role: 'counterparty',
        text: 'Ja, hallo. Ich habe tatsächlich schon auf den Anruf gewartet.',
        timestampSec: 10,
      },
      {
        id: 'tt-done-008-3',
        role: 'agent',
        text: 'Sehr schön. Herr Müller möchte mit Ihnen einen Besprechungstermin für den Jahresabschluss vereinbaren. Wäre der 8. Mai um 14:30 Uhr in unserem Büro für Sie möglich?',
        timestampSec: 14,
      },
      {
        id: 'tt-done-008-4',
        role: 'counterparty',
        text: 'Den 8. Mai... ja, das würde passen.',
        timestampSec: 28,
      },
      {
        id: 'tt-done-008-5',
        role: 'agent',
        text: 'Perfekt. Bitte bringen Sie Ihre Einnahmenüberschussrechnung sowie alle Belege für Betriebsausgaben mit – am besten auch Ihre Kontoauszüge von Januar bis Dezember 2025.',
        timestampSec: 33,
      },
      {
        id: 'tt-done-008-6',
        role: 'counterparty',
        text: 'Gut, ich mache das. Und gibt es eine Möglichkeit, vorab Unterlagen digital zu übermitteln?',
        timestampSec: 50,
      },
      {
        id: 'tt-done-008-7',
        role: 'agent',
        text: 'Ja, natürlich. Sie können alles über unser Mandantenportal hochladen. Die Zugangsdaten haben Sie bereits per E-Mail erhalten. Sollten Sie Hilfe brauchen, rufen Sie uns einfach an.',
        timestampSec: 58,
      },
      {
        id: 'tt-done-008-8',
        role: 'counterparty',
        text: 'Alles klar. Danke Klara, bis zum 8. Mai dann.',
        timestampSec: 75,
      },
      {
        id: 'tt-done-008-9',
        role: 'agent',
        text: 'Sehr gern, Frau Fischer. Einen schönen Tag noch. Auf Wiederhören!',
        timestampSec: 80,
      },
    ],
  },
  {
    callSid: 'CA_done_009',
    direction: 'outbound',
    status: 'completed',
    counterpartyName: 'Jürgen Hartmann',
    counterpartyPhone: '+4989778899001',
    counterpartyCountry: 'DE',
    agentPersona: 'Rezeptionistin Maria',
    objective: 'Erinnerungsanruf Grippeschutzimpfung – Patient seit 2 Jahren nicht geimpft',
    summary:
      'Herr Hartmann ist derzeit nicht interessiert, bittet jedoch darum, beim nächsten Impftermin im Herbst informiert zu werden.',
    numberUsed: '+498940990100',
    startedAt: daysAgo(3, 1),
    durationSec: 89,
    costEur: 0.13,
    outcome: 'callback_requested',
    hasUserIntervention: false,
    tags: ['praxis', 'impfung', 'recall'],
    transcript: [
      {
        id: 'tt-done-009-1',
        role: 'agent',
        text: 'Praxis Dr. Seiler, guten Tag. Ich rufe an, um Herrn Hartmann bezüglich seiner Grippeschutzimpfung zu informieren. Spreche ich mit Jürgen Hartmann?',
        timestampSec: 2,
      },
      {
        id: 'tt-done-009-2',
        role: 'counterparty',
        text: 'Ja, hier ist Hartmann.',
        timestampSec: 8,
      },
      {
        id: 'tt-done-009-3',
        role: 'agent',
        text: 'Guten Tag, Herr Hartmann. Wir erinnern Sie freundlich daran, dass Ihre letzte Grippeschutzimpfung bereits zwei Jahre zurückliegt. Wir würden Ihnen gerne einen Termin anbieten.',
        timestampSec: 11,
      },
      {
        id: 'tt-done-009-4',
        role: 'counterparty',
        text: 'Hmm, im Moment nicht. Können Sie mich einfach im Herbst wieder anrufen, wenn die Impfsaison beginnt?',
        timestampSec: 24,
      },
      {
        id: 'tt-done-009-5',
        role: 'agent',
        text: 'Natürlich, das notiere ich für Sie. Wir melden uns dann ab Oktober wieder. Haben Sie sonst noch Fragen oder Anliegen?',
        timestampSec: 33,
      },
      {
        id: 'tt-done-009-6',
        role: 'counterparty',
        text: 'Nein, danke. Auf Wiederhören.',
        timestampSec: 43,
      },
      {
        id: 'tt-done-009-7',
        role: 'agent',
        text: 'Auf Wiederhören, Herr Hartmann.',
        timestampSec: 46,
      },
    ],
  },
  {
    callSid: 'CA_done_010',
    direction: 'outbound',
    status: 'completed',
    counterpartyName: 'Monika Vogel',
    counterpartyPhone: '+4969443201987',
    counterpartyCountry: 'DE',
    agentPersona: 'Assistentin Klara (Steuerberatung Müller & Partner)',
    objective: 'Nachfassen bezüglich offener Steuervorauszahlung Q1 2026 – Mahnstufe 1',
    summary:
      'Frau Vogel hatte die Überweisung vergessen. Bestätigt sofortige Zahlung von 1.240 EUR. Zahlungsdaten per E-Mail versendet.',
    numberUsed: '+496940990200',
    startedAt: daysAgo(4, 2),
    durationSec: 156,
    costEur: 0.23,
    outcome: 'info_collected',
    hasUserIntervention: false,
    tags: ['steuerberatung', 'mahnung', 'vorauszahlung'],
    generatedDocs: [
      { id: 'doc_note_002', type: 'crm_note', label: 'Mahnung Vorauszahlung Q1 — Details protokolliert', href: '/notes', action: 'created' },
      { id: 'doc_doc_002', type: 'document', label: 'Zusammenfassung Mandantengespräch', href: '/docs', action: 'updated' },
    ],
    transcript: [
      {
        id: 'tt-done-010-1',
        role: 'agent',
        text: 'Guten Tag Frau Vogel, hier spricht Klara von Steuerberatung Müller & Partner. Ich rufe bezüglich der offenen Steuervorauszahlung für das erste Quartal 2026 an. Haben Sie einen Moment?',
        timestampSec: 2,
      },
      {
        id: 'tt-done-010-2',
        role: 'counterparty',
        text: 'Oh Gott, da hätte ich letzte Woche dran denken sollen. Tut mir leid.',
        timestampSec: 12,
      },
      {
        id: 'tt-done-010-3',
        role: 'agent',
        text: 'Kein Problem, Frau Vogel. Der offene Betrag liegt bei 1.240 Euro. Können Sie die Zahlung noch heute oder morgen veranlassen?',
        timestampSec: 16,
      },
      {
        id: 'tt-done-010-4',
        role: 'counterparty',
        text: 'Ja, ich überweise das gleich online. Die IBAN des Finanzamts habe ich noch von letztem Mal.',
        timestampSec: 28,
      },
      {
        id: 'tt-done-010-5',
        role: 'agent',
        text: 'Sehr schön. Bitte geben Sie als Verwendungszweck unbedingt Ihre Steuernummer und den Zeitraum Q1 2026 an. Soll ich Ihnen die vollständigen Zahlungsdaten noch einmal per E-Mail senden?',
        timestampSec: 34,
      },
      {
        id: 'tt-done-010-6',
        role: 'counterparty',
        text: 'Ja, das wäre nett.',
        timestampSec: 50,
      },
      {
        id: 'tt-done-010-7',
        role: 'agent',
        text: 'Kommt sofort. Danke, Frau Vogel. Einen schönen Tag noch.',
        timestampSec: 54,
      },
    ],
  },
  {
    callSid: 'CA_done_011',
    direction: 'outbound',
    status: 'completed',
    counterpartyName: 'Hans Zimmer',
    counterpartyPhone: '+4989654321000',
    counterpartyCountry: 'DE',
    agentPersona: 'Rezeptionistin Maria',
    objective: 'Recall Kontrolluntersuchung Diabetes – 6-Monats-Check überfällig',
    summary: 'Anrufbeantworter erreicht. Sprachnachricht mit Rückrufbitte hinterlassen.',
    numberUsed: '+498940990100',
    startedAt: daysAgo(5, 3),
    durationSec: 38,
    costEur: 0.06,
    outcome: 'voicemail',
    hasUserIntervention: false,
    tags: ['praxis', 'diabetes', 'recall', 'voicemail'],
    transcript: [
      {
        id: 'tt-done-011-1',
        role: 'counterparty',
        text: '[Anrufbeantworter] Hallo, Sie haben die Mailbox von Hans Zimmer erreicht. Bitte hinterlassen Sie eine Nachricht.',
        timestampSec: 5,
      },
      {
        id: 'tt-done-011-2',
        role: 'agent',
        text: 'Guten Tag Herr Zimmer, hier ist Maria von der Praxis Dr. Seiler. Ich rufe an, um Sie an Ihren Kontroll-Termin zu erinnern – Ihr 6-Monats-Check ist bereits seit einigen Wochen überfällig. Bitte rufen Sie uns zurück unter 089 40990100 oder vereinbaren Sie direkt online einen Termin. Auf Wiederhören.',
        timestampSec: 8,
      },
    ],
  },
  {
    callSid: 'CA_done_012',
    direction: 'inbound',
    status: 'completed',
    counterpartyName: 'Ralf Bergmann',
    counterpartyPhone: '+4930111222333',
    counterpartyCountry: 'DE',
    agentPersona: 'Maklerassistent Lars',
    objective: 'Eingehende Anfrage: Verkaufsinteresse Eigentumswohnung Kreuzberg',
    summary:
      'Herr Bergmann möchte seine 2-Zimmer-Wohnung in Kreuzberg verkaufen. Kostenlosen Bewertungstermin am 07.05. um 11 Uhr vereinbart.',
    numberUsed: '+493040990300',
    startedAt: daysAgo(6, 1),
    durationSec: 267,
    costEur: 0.4,
    outcome: 'booked',
    hasUserIntervention: false,
    tags: ['immobilien', 'verkauf', 'kreuzberg', 'bewertung'],
    transcript: [
      {
        id: 'tt-done-012-1',
        role: 'counterparty',
        text: 'Ja, hallo, ich würde gerne meine Wohnung verkaufen. Bin ich hier richtig?',
        timestampSec: 4,
      },
      {
        id: 'tt-done-012-2',
        role: 'agent',
        text: 'Ja, absolut. Herzlich willkommen bei Immobilien Becker. Gerne unterstützen wir Sie beim Verkauf. In welchem Stadtteil befindet sich die Wohnung?',
        timestampSec: 9,
      },
      {
        id: 'tt-done-012-3',
        role: 'counterparty',
        text: 'Kreuzberg, Bergmannstraße. 2 Zimmer, knapp 58 Quadratmeter, Altbau.',
        timestampSec: 16,
      },
      {
        id: 'tt-done-012-4',
        role: 'agent',
        text: 'Ein attraktiver Standort. Um Ihnen eine realistische Marktbewertung zu geben, würden wir gerne einen kostenlosen Vor-Ort-Termin vereinbaren. Unser Bewerter Herr Becker ist am Mittwoch, 7. Mai, um 11 Uhr in Ihrer Nähe. Wäre das machbar?',
        timestampSec: 22,
      },
      {
        id: 'tt-done-012-5',
        role: 'counterparty',
        text: 'Mittwoch um 11, das geht. Was brauchen Sie von mir?',
        timestampSec: 42,
      },
      {
        id: 'tt-done-012-6',
        role: 'agent',
        text: 'Falls verfügbar: den Grundriss und den Energieausweis. Ansonsten reicht auch nur Ihre Anwesenheit. Darf ich Ihre E-Mail-Adresse für die Terminbestätigung notieren?',
        timestampSec: 47,
      },
      {
        id: 'tt-done-012-7',
        role: 'counterparty',
        text: 'ralf punkt bergmann at web punkt de.',
        timestampSec: 62,
      },
      {
        id: 'tt-done-012-8',
        role: 'agent',
        text: 'Perfekt, danke. Sie erhalten in Kürze eine Bestätigungs-E-Mail. Auf Wiederhören, Herr Bergmann.',
        timestampSec: 67,
      },
    ],
  },
  {
    callSid: 'CA_done_013',
    direction: 'outbound',
    status: 'completed',
    counterpartyName: 'Ingrid Nowak',
    counterpartyPhone: '+4930998877665',
    counterpartyCountry: 'DE',
    agentPersona: 'Maklerassistent Lars',
    objective:
      'Nachfassen bei Mietinteressentin – Besichtigung lag 5 Tage zurück, keine Rückmeldung',
    summary:
      'Frau Nowak hat sich für ein anderes Objekt entschieden. Kontaktdaten für künftige Angebote gespeichert.',
    numberUsed: '+493040990300',
    startedAt: daysAgo(7, 2),
    durationSec: 104,
    costEur: 0.16,
    outcome: 'info_collected',
    hasUserIntervention: false,
    tags: ['immobilien', 'nachfassen', 'mietwohnung'],
    transcript: [
      {
        id: 'tt-done-013-1',
        role: 'agent',
        text: 'Guten Tag Frau Nowak, hier ist Lars von Immobilien Becker. Sie hatten vor einigen Tagen unsere Wohnung in Prenzlauer Berg besichtigt. Ich wollte kurz nachfragen, ob Sie noch Interesse haben.',
        timestampSec: 2,
      },
      {
        id: 'tt-done-013-2',
        role: 'counterparty',
        text: 'Hallo Lars. Ich habe mich inzwischen leider für eine andere Wohnung entschieden.',
        timestampSec: 14,
      },
      {
        id: 'tt-done-013-3',
        role: 'agent',
        text: 'Kein Problem, das verstehe ich. Darf ich fragen, was Sie an der anderen Wohnung überzeugt hat – war es der Preis, die Lage oder etwas anderes?',
        timestampSec: 18,
      },
      {
        id: 'tt-done-013-4',
        role: 'counterparty',
        text: 'Hauptsächlich die Lage, die andere war näher an meiner Arbeit.',
        timestampSec: 32,
      },
      {
        id: 'tt-done-013-5',
        role: 'agent',
        text: 'Verstanden. Wenn Sie in Zukunft wieder auf der Suche sind, würde ich Sie gerne auf unsere Interessentenliste setzen. Darf ich Ihre Kontaktdaten behalten?',
        timestampSec: 38,
      },
      {
        id: 'tt-done-013-6',
        role: 'counterparty',
        text: 'Ja, das ist okay. Auf Wiederhören.',
        timestampSec: 52,
      },
      {
        id: 'tt-done-013-7',
        role: 'agent',
        text: 'Vielen Dank, Frau Nowak. Alles Gute in der neuen Wohnung. Auf Wiederhören.',
        timestampSec: 55,
      },
    ],
  },
  {
    callSid: 'CA_done_014',
    direction: 'outbound',
    status: 'completed',
    counterpartyName: 'Stefan Krause',
    counterpartyPhone: '+4969876543210',
    counterpartyCountry: 'DE',
    agentPersona: 'Assistentin Klara (Steuerberatung Müller & Partner)',
    objective:
      'Mandant informieren: Steuerbescheid 2024 liegt vor – Nachzahlung 876 EUR fällig bis 15.05.',
    summary:
      'Herr Krause wurde informiert. Er bittet um schriftliche Zusammenfassung per E-Mail und Rückruf wegen Ratenzahlungsoptionen.',
    numberUsed: '+496940990200',
    startedAt: daysAgo(8, 4),
    durationSec: 183,
    costEur: 0.27,
    outcome: 'info_collected',
    hasUserIntervention: false,
    tags: ['steuerberatung', 'steuerbescheid', 'nachzahlung'],
    transcript: [
      {
        id: 'tt-done-014-1',
        role: 'agent',
        text: 'Guten Tag Herr Krause, hier ist Klara von Steuerberatung Müller & Partner. Ihr Steuerbescheid für das Jahr 2024 ist eingegangen. Haben Sie kurz Zeit?',
        timestampSec: 2,
      },
      {
        id: 'tt-done-014-2',
        role: 'counterparty',
        text: 'Ja, was steht drin?',
        timestampSec: 11,
      },
      {
        id: 'tt-done-014-3',
        role: 'agent',
        text: 'Es ergibt sich eine Nachzahlung von 876 Euro, fällig bis zum 15. Mai. Der Bescheid wurde auf Basis Ihrer eingereichten Unterlagen berechnet.',
        timestampSec: 14,
      },
      {
        id: 'tt-done-014-4',
        role: 'counterparty',
        text: 'Das ist unerwartet. Gibt es eine Möglichkeit, das in Raten zu zahlen?',
        timestampSec: 28,
      },
      {
        id: 'tt-done-014-5',
        role: 'agent',
        text: 'Das ist grundsätzlich möglich – dafür müssten Sie einen Stundungsantrag beim Finanzamt stellen. Herr Müller kann das für Sie vorbereiten. Soll ich einen Rückruf für Sie vereinbaren?',
        timestampSec: 35,
      },
      {
        id: 'tt-done-014-6',
        role: 'counterparty',
        text: 'Ja bitte. Und können Sie mir alles auch per E-Mail schicken?',
        timestampSec: 50,
      },
      {
        id: 'tt-done-014-7',
        role: 'agent',
        text: 'Selbstverständlich. Ich sende Ihnen gleich eine Zusammenfassung und veranlasse den Rückruf-Termin. Vielen Dank, Herr Krause.',
        timestampSec: 56,
      },
    ],
  },
  {
    callSid: 'CA_done_015',
    direction: 'outbound',
    status: 'completed',
    counterpartyName: 'Helga Brandt',
    counterpartyPhone: '+4989112233445',
    counterpartyCountry: 'DE',
    agentPersona: 'Rezeptionistin Maria',
    objective: 'Erinnerung an Röntgen-Folgeuntersuchung nach Fraktur – 6 Wochen post-OP',
    summary: 'Kein Anschluss unter der angegebenen Nummer. Automatischer Wiederanruf für morgen geplant.',
    numberUsed: '+498940990100',
    startedAt: daysAgo(9, 2),
    durationSec: 12,
    costEur: 0.02,
    outcome: 'no_answer',
    hasUserIntervention: false,
    tags: ['praxis', 'folgeuntersuchung', 'no_answer'],
    transcript: [
      {
        id: 'tt-done-015-1',
        role: 'agent',
        text: '[System] Wählton – kein Anschluss unter der angegebenen Nummer. Automatischer Wiederanruf für morgen geplant.',
        timestampSec: 0,
      },
    ],
  },

  // ── 16–18. FAILED / ABORTED ──────────────────────────────────────────────
  {
    callSid: 'CA_failed_016',
    direction: 'outbound',
    status: 'failed',
    counterpartyName: 'Werner Schulz',
    counterpartyPhone: '+4989000111222',
    counterpartyCountry: 'DE',
    agentPersona: 'Rezeptionistin Maria',
    objective: 'Termin für Blutdruckkontrolle vereinbaren – Recall Patient seit 4 Monaten',
    summary: 'Technischer Fehler beim Verbindungsaufbau. Carrier-Fehlercode SIP 503.',
    numberUsed: '+498940990100',
    startedAt: daysAgo(3, 5),
    durationSec: 0,
    costEur: 0.0,
    outcome: 'failed',
    hasUserIntervention: false,
    tags: ['praxis', 'error', 'sip-503'],
    transcript: [
      {
        id: 'tt-failed-016-1',
        role: 'agent',
        text: '[System] Verbindungsaufbau fehlgeschlagen. Carrier returned SIP 503 Service Unavailable. Kein Gesprächsfortschritt.',
        timestampSec: 0,
      },
    ],
  },
  {
    callSid: 'CA_aborted_017',
    direction: 'outbound',
    status: 'aborted',
    counterpartyName: 'Dieter Hoffmeister',
    counterpartyPhone: '+4969334455667',
    counterpartyCountry: 'DE',
    agentPersona: 'Assistentin Klara (Steuerberatung Müller & Partner)',
    objective:
      'Mandant über Änderung des Beratungstermins informieren – Verschiebung von 14:00 auf 16:00 Uhr',
    summary:
      'Anruf durch Nutzer abgebrochen bevor Verbindung aufgebaut wurde. Terminänderung wurde stattdessen per E-Mail übermittelt.',
    numberUsed: '+496940990200',
    startedAt: daysAgo(5, 6),
    durationSec: 0,
    costEur: 0.0,
    outcome: 'user_aborted',
    hasUserIntervention: true,
    tags: ['steuerberatung', 'aborted', 'termin'],
    transcript: [],
  },
  {
    callSid: 'CA_failed_018',
    direction: 'inbound',
    status: 'failed',
    counterpartyPhone: '+436641234567',
    counterpartyCountry: 'AT',
    agentPersona: 'Maklerassistent Lars',
    objective: 'Eingehender Anruf – Objekt-Anfrage (Wien Nummer)',
    summary:
      'Eingehender Anruf konnte nicht entgegengenommen werden – Agent-Konfigurationsfehler für AT-Nummern. Incident geloggt.',
    numberUsed: '+43125900400',
    startedAt: daysAgo(10, 2),
    durationSec: 0,
    costEur: 0.0,
    outcome: 'failed',
    hasUserIntervention: false,
    tags: ['immobilien', 'at', 'error', 'config'],
    transcript: [
      {
        id: 'tt-failed-018-1',
        role: 'agent',
        text: '[System] Eingehender Anruf konnte nicht an Agenten weitergeleitet werden. Konfigurationsfehler: Sprachprofil "AT-Deutsch" nicht geladen. Anrufer aufgelegt nach 18 Sekunden.',
        timestampSec: 0,
      },
    ],
  },
];

// ─── MOCK_NUMBERS ────────────────────────────────────────────────────────────

export const MOCK_NUMBERS: PhoneNumber[] = [
  {
    id: 'num_001',
    e164: '+498940990100',
    national: '089 40990100',
    country: 'DE',
    status: 'active',
    agentPersona: 'Rezeptionistin Maria',
    callsLast7Days: 34,
    costLast7Days: 4.87,
    monthlyFee: 2.5,
  },
  {
    id: 'num_002',
    e164: '+496940990200',
    national: '069 40990200',
    country: 'DE',
    status: 'active',
    agentPersona: 'Assistentin Klara (Steuerberatung Müller & Partner)',
    callsLast7Days: 21,
    costLast7Days: 3.14,
    monthlyFee: 2.5,
  },
  {
    id: 'num_003',
    e164: '+43125900400',
    national: '01 25900400',
    country: 'AT',
    status: 'provisioning',
    agentPersona: 'Maklerassistent Lars',
    callsLast7Days: 0,
    costLast7Days: 0,
    monthlyFee: 3.0,
  },
];

// ─── MOCK_PENDING_APPROVALS ──────────────────────────────────────────────────

export const MOCK_PENDING_APPROVALS: PendingApproval[] = [
  {
    id: 'apr_001',
    callSid: 'CA_pending_002',
    direction: 'outbound',
    counterpartyPhone: '+4969123456780',
    counterpartyName: 'Thomas Weber',
    objective:
      'Nachfrage wegen fehlender Belege (Fahrtkosten 2025) für die Steuererklärung – Fristablauf in 7 Tagen',
    estimatedCostEur: 0.28,
    triggeredBy: 'Workflow: Belegmahnung vor Fristablauf',
    triggeredAt: minsAgo(45),
    expiresAt: minsAgo(45) + 24 * 3_600_000,
  },
  {
    id: 'apr_002',
    callSid: 'CA_pending_003',
    direction: 'outbound',
    counterpartyPhone: '+4930987654321',
    counterpartyName: 'Immobilien Becker GmbH',
    objective:
      'Besichtigungstermin für Wohnobjekt Musterstraße 12 in Berlin-Mitte vereinbaren – Interessent Herr Krause',
    estimatedCostEur: 0.35,
    triggeredBy: 'Manuelle Anfrage via CRM',
    triggeredAt: minsAgo(120),
    expiresAt: minsAgo(120) + 12 * 3_600_000,
  },
  {
    id: 'apr_003',
    callSid: 'CA_pending_004',
    direction: 'outbound',
    counterpartyPhone: '+4989555012345',
    counterpartyName: 'Sabine Richter',
    objective:
      'Recall-Anruf – Patientin hat seit über 18 Monaten keinen Zahnarzttermin wahrgenommen',
    estimatedCostEur: 0.18,
    triggeredBy: 'Workflow: Recall Zahnarzt 18M+',
    triggeredAt: minsAgo(200),
    expiresAt: minsAgo(200) + 48 * 3_600_000,
  },
];

// ─── MOCK_USAGE ───────────────────────────────────────────────────────────────

export const MOCK_USAGE = {
  thisMonthSpend: 38.42,
  callsPlaced: 127,
  callsReceived: 43,
  avgDurationSec: 142,
  avgCostEur: 0.22,
  budgetEur: 150.0,
  budgetUsedEur: 38.42,

  dailySpend: [
    { date: dateStr(13), spend: 1.8 },
    { date: dateStr(12), spend: 2.4 },
    { date: dateStr(11), spend: 1.6 },
    { date: dateStr(10), spend: 3.1 },
    { date: dateStr(9), spend: 2.9 },
    { date: dateStr(8), spend: 2.2 },
    { date: dateStr(7), spend: 3.4 },
    { date: dateStr(6), spend: 2.7 },
    { date: dateStr(5), spend: 1.9 },
    { date: dateStr(4), spend: 3.8 },
    { date: dateStr(3), spend: 2.5 },
    { date: dateStr(2), spend: 3.6 },
    { date: dateStr(1), spend: 4.1 },
    { date: dateStr(0), spend: 2.42 },
  ],

  spendByAgent: [
    { name: 'Rezeptionistin Maria', spend: 17.8 },
    { name: 'Assistentin Klara', spend: 14.2 },
    { name: 'Maklerassistent Lars', spend: 6.42 },
  ],

  callsByDay: [
    { date: dateStr(13), inbound: 3, outbound: 8 },
    { date: dateStr(12), inbound: 4, outbound: 10 },
    { date: dateStr(11), inbound: 2, outbound: 7 },
    { date: dateStr(10), inbound: 5, outbound: 12 },
    { date: dateStr(9), inbound: 4, outbound: 11 },
    { date: dateStr(8), inbound: 3, outbound: 9 },
    { date: dateStr(7), inbound: 6, outbound: 13 },
    { date: dateStr(6), inbound: 4, outbound: 10 },
    { date: dateStr(5), inbound: 2, outbound: 8 },
    { date: dateStr(4), inbound: 5, outbound: 14 },
    { date: dateStr(3), inbound: 3, outbound: 9 },
    { date: dateStr(2), inbound: 4, outbound: 12 },
    { date: dateStr(1), inbound: 6, outbound: 15 },
    { date: dateStr(0), inbound: 2, outbound: 9 },
  ],
};

// ─── Scheduled & queued calls ──────────────────────────────────────────────

const tomorrow = NOW + 86_400_000;
const inTwoDays = NOW + 2 * 86_400_000;

export const MOCK_SCHEDULED_CALLS: CallRecord[] = [
  {
    callSid: 'CA_sched_001',
    direction: 'outbound',
    status: 'scheduled',
    counterpartyName: 'Prof. Dr. Andreas Neumann',
    counterpartyPhone: '+4989987654321',
    counterpartyCountry: 'DE',
    agentPersona: 'Sekretärin Sophie',
    objective: 'Termin für Jahresgespräch am kommenden Montag vereinbaren',
    summary: 'Jährliches Beratungsgespräch bestätigen',
    numberUsed: '+4989123456',
    startedAt: 0,
    scheduledAt: tomorrow + 9 * 3_600_000, // tomorrow 9:00
    durationSec: 0,
    costEur: 0,
    outcome: null,
    transcript: [],
    hasUserIntervention: false,
    tags: ['steuerberatung', 'termin'],
  },
  {
    callSid: 'CA_sched_002',
    direction: 'outbound',
    status: 'scheduled',
    counterpartyName: 'Sabine Hoffmann',
    counterpartyPhone: '+4915234567890',
    counterpartyCountry: 'DE',
    agentPersona: 'Rezeptionistin Maria',
    objective: 'Erinnerung an Vorsorgeuntersuchung nächste Woche',
    summary: 'Recall für Vorsorge-Termin',
    numberUsed: '+4989123456',
    startedAt: 0,
    scheduledAt: tomorrow + 10 * 3_600_000 + 30 * 60_000, // tomorrow 10:30
    durationSec: 0,
    costEur: 0,
    outcome: null,
    transcript: [],
    hasUserIntervention: false,
    tags: ['praxis', 'recall'],
  },
  {
    callSid: 'CA_sched_003',
    direction: 'outbound',
    status: 'scheduled',
    counterpartyName: 'Marcus Bauer',
    counterpartyPhone: '+4930234567890',
    counterpartyCountry: 'DE',
    agentPersona: 'SDR Anton',
    objective: 'Follow-up nach Demo vom Dienstag — Angebot nachfassen',
    summary: 'Sales follow-up Angebot Nr. 2024-0892',
    numberUsed: '+4930456789',
    startedAt: 0,
    scheduledAt: inTwoDays + 14 * 3_600_000, // in two days at 14:00
    durationSec: 0,
    costEur: 0,
    outcome: null,
    transcript: [],
    hasUserIntervention: false,
    tags: ['sales', 'follow-up'],
  },
  {
    callSid: 'CA_sched_004',
    direction: 'outbound',
    status: 'scheduled',
    counterpartyName: 'Krankenversicherung AOK',
    counterpartyPhone: '+498001234567',
    counterpartyCountry: 'DE',
    agentPersona: 'Rezeptionistin Maria',
    objective: 'Kostenübernahmeanfrage für Patient Weber, DOB 15.03.1972',
    summary: 'KV-Anfrage für Kostenübernahme',
    numberUsed: '+4989123456',
    startedAt: 0,
    scheduledAt: inTwoDays + 9 * 3_600_000 + 15 * 60_000, // 09:15 in two days
    durationSec: 0,
    costEur: 0,
    outcome: null,
    transcript: [],
    hasUserIntervention: false,
    tags: ['kv', 'kostenübernahme'],
  },
];

export const MOCK_QUEUED_CALLS: CallRecord[] = [
  {
    callSid: 'CA_queue_001',
    direction: 'outbound',
    status: 'queued',
    counterpartyName: 'Petra Schulz',
    counterpartyPhone: '+4915112345678',
    counterpartyCountry: 'DE',
    agentPersona: 'Rezeptionistin Maria',
    objective: 'Terminerinnerung für morgen 9:00 Uhr',
    summary: 'Erinnerungsanruf — morgen früh',
    numberUsed: '+4989123456',
    startedAt: 0,
    queuePosition: 1,
    durationSec: 0,
    costEur: 0,
    outcome: null,
    transcript: [],
    hasUserIntervention: false,
    tags: ['praxis'],
  },
  {
    callSid: 'CA_queue_002',
    direction: 'outbound',
    status: 'queued',
    counterpartyName: 'Dieter Lange',
    counterpartyPhone: '+4969876543210',
    counterpartyCountry: 'DE',
    agentPersona: 'Sekretärin Sophie',
    objective: 'Mandantenanfrage — Steuerbescheid 2023 klären',
    summary: 'Rückruf Steuerbescheid',
    numberUsed: '+4930456789',
    startedAt: 0,
    queuePosition: 2,
    durationSec: 0,
    costEur: 0,
    outcome: null,
    transcript: [],
    hasUserIntervention: false,
    tags: ['steuerberatung'],
  },
  {
    callSid: 'CA_queue_003',
    direction: 'outbound',
    status: 'queued',
    counterpartyPhone: '+4321098765432',
    counterpartyCountry: 'AT',
    agentPersona: 'SDR Anton',
    objective: 'Kaltakquise — Immobilien Newsletter Abo nachfassen',
    summary: 'Outbound prospecting',
    numberUsed: '+431234567',
    startedAt: 0,
    queuePosition: 3,
    durationSec: 0,
    costEur: 0,
    outcome: null,
    transcript: [],
    hasUserIntervention: false,
    tags: ['sales'],
  },
];

// Combined list for the calls inbox (all statuses)
export const ALL_MOCK_CALLS: CallRecord[] = [
  ...MOCK_CALLS,
  ...MOCK_SCHEDULED_CALLS,
  ...MOCK_QUEUED_CALLS,
];

// Alias used by call view components
export type MockCall = CallRecord;

// Country flag emoji map
export const COUNTRY_FLAGS: Record<string, string> = {
  DE: '🇩🇪',
  AT: '🇦🇹',
  CH: '🇨🇭',
  US: '🇺🇸',
  GB: '🇬🇧',
};
