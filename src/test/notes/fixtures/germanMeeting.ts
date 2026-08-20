/**
 * A real-shaped German meeting note: nine paragraphs of Kanzlei prose, the kind
 * of thing that actually produces obligations, and the four items BE-1 would
 * propose from it — each anchored to a verbatim sentence that appears in the
 * text above, because an item whose quote is not in the source is one BE-1's
 * hallucination gate would have discarded before the UI ever saw it.
 *
 * Used by the 30-second measurement (O6), so that the number is taken against
 * something of realistic length rather than a three-line fixture.
 */

import type { JSONContent } from '@tiptap/react';

const PARAGRAPHS: string[] = [
  "Besprechung im Mandat Müller ./. Weber Bau GmbH, Landgericht München I, Az. 12 O 4471/26. Anwesend waren Herr Müller, Frau Dr. Sandbergerin als Sachbearbeiterin sowie der Unterzeichner. Termin: Dienstag, 4. August 2026, 14:00 Uhr bis 15:40 Uhr, Kanzleiräume.",
  "Zunächst wurde der Sachstand rekapituliert. Die Klage der Weber Bau GmbH ist am 12. Juni 2026 zugestellt worden. Die Klageerwiderungsfrist läuft am 12. August 2026 ab. Der Streitwert beträgt nach vorläufiger Einschätzung 384.000 Euro und setzt sich aus dem Restwerklohn in Höhe von 312.000 Euro sowie einem geltend gemachten Verzugsschaden von 72.000 Euro zusammen. Herr Müller hat die vollständige Bauakte noch nicht übergeben; es fehlen insbesondere die Bautagebücher der Kalenderwochen 18 bis 24 sowie der gesamte Schriftverkehr mit dem Architekturbüro Lehnert.",
  "Herr Müller schilderte den Ablauf aus seiner Sicht. Die Weber Bau GmbH habe die Rohbauarbeiten mit erheblicher Verzögerung begonnen, nach seiner Erinnerung etwa dreieinhalb Wochen nach dem vereinbarten Termin. Eine schriftliche Mahnung sei seinerzeit nicht ausgesprochen worden, wohl aber mehrere Telefonate geführt worden. Zwei dieser Telefonate seien in einem privaten Kalender vermerkt. Der Unterzeichner hat darauf hingewiesen, dass diese Vermerke prozessual von erheblicher Bedeutung sein können und in Kopie zur Akte genommen werden sollten.",
  "Sodann wurde die Mängelrüge vom 3. März 2026 erörtert. Die Rüge betrifft die Abdichtung der Kelleraußenwand sowie die Ausführung der Betondecke über dem Erdgeschoss. Das Privatgutachten des Sachverständigen Dr. Ing. Aschenbrenner liegt bislang nur als Entwurf vor. Herr Müller sagte zu, den Sachverständigen zu einer kurzfristigen Fertigstellung zu bewegen. Der Unterzeichner wies darauf hin, dass das Gutachten für die Klageerwiderung benötigt wird und eine Vorlage nach dem 15. August 2026 prozessual wenig hilfreich wäre.",
  "Ein erheblicher Teil der Besprechung entfiel auf die Frage eines Vergleichs. Die Gegenseite hatte über ihren Prozessbevollmächtigten mit Schreiben vom 22. Juli 2026 eine Zahlung von 240.000 Euro gegen Erledigungserklärung angeboten. Herr Müller hat dieses Angebot nach eingehender Erörterung der Prozessrisiken ausdrücklich abgelehnt. Er begründete dies damit, dass die Mängel unstreitig seien und der Verzugsschaden in der geltend gemachten Höhe nicht nachvollziehbar sei. Der Unterzeichner hat die Chancen und Risiken beider Wege dargestellt, insbesondere das Kostenrisiko einer Beweisaufnahme mit gerichtlichem Sachverständigen, und die Entscheidung des Mandanten zur Kenntnis genommen.",
  "Weiter wurde besprochen, dass die Frist zur Klageerwiderung nach derzeitigem Stand nicht gehalten werden kann, weil die Bauakte unvollständig ist und das Privatgutachten fehlt. Der Unterzeichner wird daher beim Landgericht eine Fristverlängerung um drei Wochen beantragen. Der Antrag soll bis Ende der Woche gestellt werden, damit noch vor Fristablauf eine Entscheidung des Gerichts vorliegt. Herr Müller ist damit einverstanden.",
  "Ferner ist der Schriftverkehr mit dem Architekturbüro Lehnert für die Frage der Bauüberwachung von Bedeutung. Frau Dr. Sandbergerin wird die entsprechenden Unterlagen zusammenstellen und an Herrn Weber, den Sachbearbeiter der gegnerischen Versicherung, übersenden, soweit dies zur Vorbereitung der Vergleichsgespräche erforderlich ist. Der Umfang der Übersendung ist zuvor mit dem Mandanten abzustimmen.",
  "Abschließend wurde der weitere Fahrplan festgehalten. Nach Eingang des Gutachtens und der vollständigen Bauakte wird der Entwurf der Klageerwiderung erstellt und dem Mandanten zur Durchsicht übersandt. Ein weiterer Besprechungstermin wurde für die 34. Kalenderwoche in Aussicht genommen, ohne dass bereits ein konkreter Termin vereinbart worden wäre. Herr Müller bat darum, ihn bei kurzfristigen Entwicklungen unmittelbar telefonisch zu erreichen und nicht ausschließlich per E-Mail zu informieren.",
  "Der Unterzeichner hat den Mandanten darauf hingewiesen, dass sämtliche Angaben zum Sachverhalt bis zur Klageerwiderung überprüft werden müssen und spätere Korrekturen prozessual nachteilig sein können. Herr Müller hat dies zur Kenntnis genommen und zugesagt, die noch fehlenden Unterlagen zeitnah zu übergeben. Die Besprechung endete um 15:40 Uhr.",
  "Zur Frage der Beweislast wurde ausführlich erörtert, dass die Darlegungs- und Beweislast für die Mangelfreiheit nach Abnahme grundsätzlich beim Besteller liegt, hier also beim Mandanten, soweit eine Abnahme überhaupt erfolgt ist. Der Unterzeichner hat darauf hingewiesen, dass die Frage der Abnahme im vorliegenden Fall streitig ist und dass die Weber Bau GmbH sich auf eine konkludente Abnahme durch Ingebrauchnahme des Objekts berufen wird. Ob die Ingebrauchnahme einzelner Räume für die Annahme einer konkludenten Abnahme des gesamten Werkes genügt, ist in der Rechtsprechung nicht einheitlich beantwortet. Herr Müller wurde gebeten, sämtliche Unterlagen zusammenzustellen, aus denen sich ergibt, ab welchem Zeitpunkt welche Bereiche des Objekts tatsächlich genutzt wurden, einschließlich der Zählerstände und der Versicherungsunterlagen.",
  "Im Anschluss wurde die Höhe des geltend gemachten Verzugsschadens durchgesprochen. Die Gegenseite stützt sich auf entgangene Deckungsbeiträge aus zwei Folgeaufträgen, die angeblich wegen der Bindung der Kolonnen nicht angenommen werden konnten. Belege hierfür sind bislang nicht vorgelegt worden, sondern lediglich eine tabellarische Aufstellung ohne Anlagen. Der Unterzeichner hält die Aufstellung für nicht einlassungsfähig und wird dies in der Klageerwiderung entsprechend rügen. Herr Müller wies darauf hin, dass ihm aus dem Markt bekannt sei, dass die Weber Bau GmbH im fraglichen Zeitraum an mindestens einer weiteren Baustelle in Grünwald tätig gewesen sei; er werde versuchen, hierzu Näheres in Erfahrung zu bringen, ohne dass hieraus eine förmliche Zusage abgeleitet werden soll.",
  "Schließlich wurde die Kostenfrage angesprochen. Der Mandant verfügt über eine Rechtsschutzversicherung, deren Eintrittspflicht für die erste Instanz bereits dem Grunde nach bestätigt worden ist. Für ein selbständiges Beweisverfahren wäre eine gesonderte Deckungszusage einzuholen. Der Unterzeichner hat erläutert, dass ein selbständiges Beweisverfahren derzeit nicht empfohlen wird, weil die Beweisfragen im laufenden Verfahren ohnehin zu klären sein werden und ein Parallelverfahren zusätzliche Kosten verursacht, ohne die Verfahrensdauer zu verkürzen.",
];

export const GERMAN_MEETING_NOTE: { content: JSONContent; wordCount: number; text: string } = {
  content: {
    type: 'doc',
    content: PARAGRAPHS.map((text) => ({ type: 'paragraph', content: [{ type: 'text', text }] })),
  },
  wordCount: PARAGRAPHS.reduce((total, p) => total + p.split(/\s+/).length, 0),
  text: PARAGRAPHS.join('\n\n'),
};

/** What the extractor proposes. Every `quote` is a substring of the note above. */
export const GERMAN_MEETING_PROPOSALS = [
  {
    kind: 'task' as const,
    text: "Fristverlängerung beim Landgericht beantragen",
    owedBy: "me",
    dueText: "bis Ende der Woche",
    dueAt: null,
    confidence: 0.93,
    anchor: {
      quote: "Der Unterzeichner wird daher beim Landgericht eine Fristverlängerung um drei Wochen beantragen.",
      state: 'anchored' as const,
    },
  },
  {
    kind: 'task' as const,
    text: "Unterlagen des Architekturbüros an Weber senden",
    owedBy: "Dr. Sandbergerin",
    dueAt: null,
    confidence: 0.87,
    anchor: {
      quote: "Frau Dr. Sandbergerin wird die entsprechenden Unterlagen zusammenstellen und an Herrn Weber, den Sachbearbeiter der gegnerischen Versicherung, übersenden",
      state: 'anchored' as const,
    },
  },
  {
    kind: 'decision' as const,
    text: "Vergleichsangebot über 240.000 Euro wird abgelehnt",
    dueAt: null,
    confidence: 0.96,
    anchor: {
      quote: "Herr Müller hat dieses Angebot nach eingehender Erörterung der Prozessrisiken ausdrücklich abgelehnt.",
      state: 'anchored' as const,
    },
  },
  {
    kind: 'task' as const,
    text: "Gutachten zur Schadenshöhe liefern",
    owedBy: "Müller",
    dueText: "15. August 2026",
    dueAt: null,
    confidence: 0.9,
    anchor: {
      quote: "Herr Müller sagte zu, den Sachverständigen zu einer kurzfristigen Fertigstellung zu bewegen.",
      state: 'anchored' as const,
    },
  },
];
