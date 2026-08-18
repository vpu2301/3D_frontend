import type { JSONContent } from '@tiptap/react';
import type { OutlineNode, PresetAction, AiTone } from '@/pages/docs/_lib/types';

export interface MockAiOptions {
  tone?: AiTone;
  signal?: AbortSignal;
  failureRate?: number;
  minLatencyMs?: number;
  maxLatencyMs?: number;
}

const DEFAULT_OPTS: Required<Pick<MockAiOptions, 'failureRate' | 'minLatencyMs' | 'maxLatencyMs'>> = {
  failureRate: 0.05,
  minLatencyMs: 200,
  maxLatencyMs: 800,
};

let _settings = { ...DEFAULT_OPTS };
export function configureMockAi(s: Partial<typeof _settings>) {
  _settings = { ..._settings, ...s };
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    if (signal) {
      const abort = () => {
        clearTimeout(t);
        reject(new DOMException('Aborted', 'AbortError'));
      };
      if (signal.aborted) abort();
      else signal.addEventListener('abort', abort, { once: true });
    }
  });
}

function maybeFail(rate: number) {
  if (Math.random() < rate) {
    throw new Error('Mock AI: synthetic failure');
  }
}

function tokenize(s: string): string[] {
  return s.match(/\S+\s*|\s+/g) ?? [];
}

async function* streamString(text: string, signal?: AbortSignal): AsyncIterable<string> {
  const tokens = tokenize(text);
  for (const t of tokens) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    await delay(rand(15, 40), signal);
    yield t;
  }
}

// ---- Canned content templates ---------------------------------------------

const FILLERS = [
  'In particular, the underlying assumption deserves scrutiny — not because it is wrong, but because the framing shapes every downstream conclusion.',
  'It is worth noting that, while the surface presentation reads cleanly, a careful reader will linger on the second-order implications.',
  'Concretely, this means that the team can iterate without committing to a single architectural path, which preserves optionality.',
  'A useful way to think about this is as a contract between the writing surface and the reader: every choice either reinforces or undermines that contract.',
  'There is a temptation to over-engineer here; resist it. Ship the smallest version that proves the thesis, then layer on nuance.',
  'Taken together, the picture is that the system favors composition over inheritance, and the data model reflects that bias throughout.',
];

function fillerSentence(): string {
  return FILLERS[rand(0, FILLERS.length - 1)];
}

function withTone(s: string, tone: AiTone | undefined): string {
  if (!tone) return s;
  switch (tone) {
    case 'professional':
      return s;
    case 'casual':
      return s.replace(/\bIt is\b/g, "It's").replace(/\bdo not\b/g, "don't");
    case 'confident':
      return s.replace(/might/gi, 'will').replace(/perhaps/gi, 'clearly');
    case 'friendly':
      return s.replace(/^/, 'Hey — ');
  }
}

function presetTransform(action: PresetAction, text: string, tone?: AiTone): string {
  const trimmed = text.trim();
  switch (action) {
    case 'improve':
      return withTone(
        `${trimmed.replace(/\.\s*$/, '')}. ${fillerSentence()}`,
        tone,
      );
    case 'shorter': {
      const words = trimmed.split(/\s+/);
      const target = Math.max(8, Math.floor(words.length * 0.55));
      return words.slice(0, target).join(' ').replace(/[,;:]\s*$/, '') + '.';
    }
    case 'longer':
      return `${trimmed} ${fillerSentence()} ${fillerSentence()}`;
    case 'grammar':
      return trimmed
        .replace(/\s+,/g, ',')
        .replace(/\s+\./g, '.')
        .replace(/\bi\b/g, 'I')
        .replace(/\s{2,}/g, ' ')
        .replace(/\bteh\b/gi, 'the');
    case 'tone-professional':
      return withTone(trimmed, 'professional');
    case 'tone-casual':
      return withTone(trimmed, 'casual');
    case 'tone-confident':
      return withTone(trimmed, 'confident');
    case 'tone-friendly':
      return withTone(trimmed, 'friendly');
    case 'translate-spanish':
      return `[ES] ${trimmed
        .replace(/\bthe\b/gi, 'el')
        .replace(/\band\b/gi, 'y')
        .replace(/\bis\b/gi, 'es')}`;
    case 'translate-french':
      return `[FR] ${trimmed
        .replace(/\bthe\b/gi, 'le')
        .replace(/\band\b/gi, 'et')
        .replace(/\bis\b/gi, 'est')}`;
    case 'translate-german':
      return `[DE] ${trimmed
        .replace(/\bthe\b/gi, 'der')
        .replace(/\band\b/gi, 'und')
        .replace(/\bis\b/gi, 'ist')}`;
    case 'translate-japanese':
      return `[JA] 「${trimmed}」`;
    case 'summarize': {
      const sentences = trimmed.split(/(?<=[.!?])\s+/);
      const head = sentences.slice(0, 2).join(' ');
      return `TL;DR — ${head}`;
    }
    case 'explain':
      return `Here's a plain-English read of that passage: ${trimmed} In other words, ${fillerSentence().toLowerCase()}`;
    default:
      return trimmed;
  }
}

// ---- Public API -----------------------------------------------------------

export async function* streamCompletion(
  prompt: string,
  context: string,
  opts: MockAiOptions = {},
): AsyncIterable<string> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  const lower = prompt.toLowerCase();
  let body: string;

  if (lower.startsWith('rewrite') || lower.includes('rewrite')) {
    body = `Here is a rewritten version with the same meaning but tightened structure:\n\n${
      presetTransform('improve', context.slice(-600) || prompt, opts.tone)
    }`;
  } else if (lower.startsWith('summari')) {
    body = presetTransform('summarize', context || prompt);
  } else if (lower.includes('outline') || lower.includes('table of contents')) {
    body = `Outline\n\n1. Context and motivation\n2. Approach\n3. Trade-offs\n4. Next steps`;
  } else if (lower.startsWith('list') || lower.includes('action items')) {
    body = `Action items\n\n- Confirm scope with stakeholders by end of week.\n- Draft technical spec and circulate for review.\n- Schedule a 30-minute sync to align on milestones.\n- Prototype the riskiest path first.`;
  } else if (lower.startsWith('write') || lower.startsWith('draft')) {
    body = `${prompt.replace(/^(write|draft)\s+/i, '').replace(/^./, (c) => c.toUpperCase())}\n\n${fillerSentence()} ${fillerSentence()}\n\n${fillerSentence()}`;
  } else {
    body = `${fillerSentence()} ${fillerSentence()}`;
  }

  yield* streamString(body, opts.signal);
}

export async function* runPreset(
  preset: PresetAction,
  text: string,
  opts: MockAiOptions = {},
): AsyncIterable<string> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const transformed = presetTransform(preset, text, opts.tone);
  yield* streamString(transformed, opts.signal);
}

export async function generateSummary(docContent: string, opts: MockAiOptions = {}): Promise<string> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const trimmed = docContent.trim();
  if (!trimmed) return 'Empty document — write something to generate a summary.';
  const firstSentence = trimmed.split(/(?<=[.!?])\s+/)[0] ?? trimmed.slice(0, 140);
  const wc = trimmed.split(/\s+/).length;
  return `${firstSentence} (${wc} words)`;
}

export async function generateOutline(content: JSONContent, opts: MockAiOptions = {}): Promise<OutlineNode[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const out: OutlineNode[] = [];
  const walk = (node: JSONContent | undefined) => {
    if (!node) return;
    if (node.type === 'heading') {
      const level = Number(node.attrs?.level ?? 1);
      const text = (node.content ?? [])
        .map((c) => c.text ?? '')
        .join('')
        .trim();
      if (text) out.push({ level, text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
    }
    if (node.content) for (const c of node.content) walk(c);
  };
  walk(content);
  if (out.length === 0) {
    out.push({ level: 1, text: 'No headings yet', id: 'no-headings' });
  }
  return out;
}

export async function ghostComplete(
  precedingText: string,
  opts: MockAiOptions = {},
): Promise<string | null> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(Math.min(120, minLatencyMs), Math.min(300, maxLatencyMs)), opts.signal);
  if (Math.random() < failureRate) return null;
  const tail = precedingText.slice(-160).trim();
  if (!tail) return null;
  if (tail.length < 12) return null;
  // simple continuations keyed off trailing punctuation
  if (tail.endsWith(',')) return ' which gives the team a clearer baseline to plan against';
  if (tail.endsWith('—') || tail.endsWith('-')) return ' especially when the surface area grows';
  if (/\bbecause$/i.test(tail)) return ' the trade-off becomes legible only at scale';
  if (/\b(is|are)\b\s*$/i.test(tail)) return ' worth considering before committing to an implementation';
  if (tail.endsWith('.')) return ' That said, the more interesting question is what changes when scale increases.';
  return ' — and that is where the design earns its keep.';
}

export async function generateTitle(content: string, opts: MockAiOptions = {}): Promise<string> {
  await delay(rand(_settings.minLatencyMs, _settings.maxLatencyMs), opts.signal);
  const first = content.trim().split(/[\n.!?]/)[0] ?? '';
  const trimmed = first.slice(0, 60).trim();
  return trimmed || 'Untitled';
}

// ---------------------------------------------------------------------------
// Notes-flavored extensions — kept here per platform convention "extend, don't
// duplicate". Same latency/failure model as everything above.
// ---------------------------------------------------------------------------

export interface MockTask {
  text: string;
  done?: boolean;
}

export interface MockDecision {
  text: string;
  context?: string;
}

export interface MockLinkCandidate {
  type: 'note' | 'doc' | 'event';
  targetId: string;
  label: string;
  snippet?: string;
}

export interface MockLinkSuggestion extends MockLinkCandidate {
  reason: string;
  score: number;
}

export interface MockAnswerChunk {
  chunk: string;
  citations?: string[];
}

export async function extractTasks(text: string, opts: MockAiOptions = {}): Promise<MockTask[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const out: MockTask[] = [];
  const taskRe = /^\s*(?:[-*]\s*\[\s\]|TODO[:\s]|\[\s\])\s*(.+)$/gim;
  let m: RegExpExecArray | null;
  while ((m = taskRe.exec(text))) {
    const t = m[1].trim();
    if (t) out.push({ text: t, done: /\[x\]/i.test(m[0]) });
  }
  const verbs = /\b(?:draft|send|review|schedule|book|email|call|prepare|finalize|update|fix|ship|post|sync|follow up|share)\b/i;
  for (const line of text.split(/\n+/)) {
    const s = line.trim();
    if (!s || /^[#>-]/.test(s)) continue;
    if (verbs.test(s) && s.length < 160 && !out.some((o) => o.text === s)) {
      out.push({ text: s.replace(/[.,;:]+$/, '') });
    }
  }
  return out.slice(0, 10);
}

export async function extractDecisions(
  text: string,
  opts: MockAiOptions = {},
): Promise<MockDecision[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const out: MockDecision[] = [];
  const seen = new Set<string>();
  const re = /(?:^|\.\s)([^.!?\n]*\b(?:decided|decision|will|going to|chose|picked)\b[^.!?\n]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const t = m[1].trim().replace(/^[A-Za-z]+\s+/, '').slice(0, 200);
    if (t && !seen.has(t)) {
      out.push({ text: t });
      seen.add(t);
    }
  }
  return out.slice(0, 8);
}

export async function suggestTags(
  noteContent: string,
  existingTags: string[],
  opts: MockAiOptions = {},
): Promise<string[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const text = noteContent.toLowerCase();
  const KEYWORDS: Record<string, RegExp> = {
    meeting: /\b(meeting|standup|sync|kickoff|1:1|attendees|agenda)\b/,
    decision: /\b(decision|decided|will\s+(?:not|adopt|use|drop)|chose|picked)\b/,
    review: /\b(review|retro|weekly|what went well|what didn'?t)\b/,
    'action-items': /\b(action item|todo|to-do|follow[\s-]?up|next step)\b/,
    research: /\b(reading|study|paper|hypothesis|investigation|exploring)\b/,
    idea: /\b(idea|brainstorm|what if|maybe|prototype)\b/,
    product: /\b(prd|product|launch|roadmap|feature flag)\b/,
    engineering: /\b(api|database|code|deploy|build|infrastructure|latency)\b/,
    personal: /\b(gym|family|cooking|recipe|trip|reading list)\b/,
    'q2-planning': /\bq2\b/,
  };
  const candidates: string[] = [];
  for (const [tag, re] of Object.entries(KEYWORDS)) {
    if (re.test(text) && !existingTags.includes(tag)) candidates.push(tag);
  }
  return candidates.slice(0, 3);
}

export async function suggestLinks(
  noteContent: string,
  candidates: MockLinkCandidate[],
  opts: MockAiOptions = {},
): Promise<MockLinkSuggestion[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const text = noteContent.toLowerCase();
  const tokens = new Set(
    text
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4),
  );
  const scored: MockLinkSuggestion[] = [];
  for (const c of candidates) {
    const cTokens = (c.label + ' ' + (c.snippet ?? ''))
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4);
    if (cTokens.length === 0) continue;
    let overlap = 0;
    for (const t of cTokens) if (tokens.has(t)) overlap++;
    if (overlap === 0) continue;
    scored.push({
      ...c,
      score: overlap / cTokens.length,
      reason: `Mentions overlap with "${c.label}"`,
    });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 4);
}

export async function* answerOverNotes(
  question: string,
  notes: { id: string; title: string; text: string }[],
  opts: MockAiOptions = {},
): AsyncIterable<MockAnswerChunk> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const qTokens = new Set(
    question
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3),
  );
  const scored = notes
    .map((n) => {
      const text = (n.title + ' ' + n.text).toLowerCase();
      let overlap = 0;
      for (const t of qTokens) if (text.includes(t)) overlap++;
      return { note: n, score: overlap };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const intro = scored.length
    ? `Based on ${scored.length} relevant note${scored.length > 1 ? 's' : ''} I found across your workspace:`
    : `I couldn't find a strong match across your notes. Best-effort answer:`;

  for (const t of intro.match(/\S+\s*|\s+/g) ?? []) {
    if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    await delay(rand(15, 30), opts.signal);
    yield { chunk: t };
  }

  if (scored.length) {
    yield { chunk: '\n\n' };
    for (const s of scored) {
      const summary = s.note.text.split(/(?<=[.!?])\s+/)[0]?.slice(0, 220) ?? '';
      const line = `• ${s.note.title} — ${summary}`;
      for (const t of line.match(/\S+\s*|\s+/g) ?? []) {
        if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        await delay(rand(10, 25), opts.signal);
        yield { chunk: t, citations: [s.note.id] };
      }
      yield { chunk: '\n' };
    }
  } else {
    const tail = ` ${FILLERS[rand(0, FILLERS.length - 1)]}`;
    for (const t of tail.match(/\S+\s*|\s+/g) ?? []) {
      if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      await delay(rand(15, 35), opts.signal);
      yield { chunk: t };
    }
  }
}

// ---------------------------------------------------------------------------
// Drive-flavored extensions — same convention as Notes' additions: extend the
// shared module rather than fork. All functions respect the global latency +
// failure model and AbortSignal.
// ---------------------------------------------------------------------------

export interface MockFileMeta {
  id: string;
  name: string;
  kind: string;
  size: number;
  tags: string[];
  parentId: string | null;
  updatedAt: number;
  ownerId: string;
  /** Optional mock-extracted text used for ranking + Q&A. */
  extractedText?: string;
  /** Optional 1-line summary if already generated. */
  summary?: string;
}

export interface MockRankedFile {
  fileId: string;
  score: number;
  reason: string;
}

export interface MockCitation {
  snippet: string;
  locator?: string;
}

export interface MockDuplicateGroup {
  reason: 'name' | 'size' | 'name+size';
  fileIds: string[];
}

export interface MockOrganizationProposal {
  newFolders: { name: string; tempId: string }[];
  moves: { fileId: string; toTempId: string; reason: string }[];
}

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3);
}

function fileSearchableText(f: MockFileMeta): string {
  return [
    f.name,
    f.tags.join(' '),
    f.summary ?? '',
    f.extractedText ?? '',
  ].join(' ');
}

export async function semanticFileSearch(
  query: string,
  files: MockFileMeta[],
  opts: MockAiOptions = {},
): Promise<MockRankedFile[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  const qTokens = tokens(query);
  if (qTokens.length === 0) return [];
  const out: MockRankedFile[] = [];
  for (const f of files) {
    const haystack = fileSearchableText(f).toLowerCase();
    let overlap = 0;
    const matched: string[] = [];
    for (const t of qTokens) {
      if (haystack.includes(t)) {
        overlap++;
        matched.push(t);
      }
    }
    if (overlap === 0) continue;
    // Recency bias — newer files score slightly higher
    const ageDays = Math.max(0, (Date.now() - f.updatedAt) / 86_400_000);
    const recency = Math.max(0, 1 - ageDays / 60);
    const score = overlap / qTokens.length + 0.15 * recency;
    out.push({
      fileId: f.id,
      score,
      reason: matched.length
        ? `matches: ${matched.slice(0, 3).join(', ')}`
        : 'related',
    });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, 12);
}

export async function* askAboutFile(
  question: string,
  file: MockFileMeta & { extractedText?: string },
  opts: MockAiOptions = {},
): AsyncIterable<{ chunk: string; citations?: MockCitation[] }> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  const text = file.extractedText ?? '';
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);

  const qTokens = tokens(question);
  let bestSentence = '';
  let bestScore = 0;
  let bestIdx = -1;
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i];
    const overlap = qTokens.filter((t) => s.toLowerCase().includes(t)).length;
    if (overlap > bestScore) {
      bestScore = overlap;
      bestSentence = s;
      bestIdx = i;
    }
  }

  let body: string;
  if (file.kind === 'image') {
    body = `Looking at "${file.name}": I can see what appears to be an image. ${FILLERS[rand(0, FILLERS.length - 1)]}`;
  } else if (file.kind === 'video' || file.kind === 'audio') {
    body = `For "${file.name}": the transcript is mocked, but here's a plausible answer based on the filename and tags. ${FILLERS[rand(0, FILLERS.length - 1)]}`;
  } else if (bestSentence) {
    body = `Based on the file:\n\n"${bestSentence.trim()}"\n\nThis suggests the answer to "${question}" is anchored in that passage.`;
  } else {
    body = `I scanned "${file.name}" but couldn't find a strong match for "${question}". ${FILLERS[rand(0, FILLERS.length - 1)]}`;
  }

  const tokens_ = body.match(/\S+\s*|\s+/g) ?? [];
  for (let i = 0; i < tokens_.length; i++) {
    if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    await delay(rand(15, 35), opts.signal);
    if (i === tokens_.length - 1 && bestSentence) {
      yield {
        chunk: tokens_[i],
        citations: [
          {
            snippet: bestSentence.slice(0, 160).trim(),
            locator: bestIdx >= 0 ? `Sentence ${bestIdx + 1}` : undefined,
          },
        ],
      };
    } else {
      yield { chunk: tokens_[i] };
    }
  }
}

export async function* askAcrossDrive(
  question: string,
  files: MockFileMeta[],
  opts: MockAiOptions = {},
): AsyncIterable<{ chunk: string; citedFileIds?: string[] }> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  const ranked = await semanticFileSearch(question, files);
  const top = ranked.slice(0, 4);

  const intro = top.length
    ? `Based on ${top.length} matching file${top.length > 1 ? 's' : ''} in your Drive:`
    : `I couldn't find a strong match in your Drive. Best-effort answer:`;
  for (const t of intro.match(/\S+\s*|\s+/g) ?? []) {
    if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    await delay(rand(15, 30), opts.signal);
    yield { chunk: t };
  }

  if (top.length) {
    yield { chunk: '\n\n' };
    for (const r of top) {
      const f = files.find((x) => x.id === r.fileId);
      if (!f) continue;
      const line = `• ${f.name} — ${r.reason}`;
      for (const t of line.match(/\S+\s*|\s+/g) ?? []) {
        if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        await delay(rand(10, 25), opts.signal);
        yield { chunk: t, citedFileIds: [f.id] };
      }
      yield { chunk: '\n' };
    }
  } else {
    const tail = ` ${FILLERS[rand(0, FILLERS.length - 1)]}`;
    for (const t of tail.match(/\S+\s*|\s+/g) ?? []) {
      if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      await delay(rand(15, 35), opts.signal);
      yield { chunk: t };
    }
  }
}

export async function summarizeFile(
  file: MockFileMeta & { extractedText?: string },
  opts: MockAiOptions = {},
): Promise<{ oneLine: string; extended: string }> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  const text = (file.extractedText ?? '').trim();
  if (!text) {
    return {
      oneLine: `${file.name} — ${humanKind(file.kind)}.`,
      extended:
        `${file.name} is a ${humanKind(file.kind)} file, ${(file.size / 1024).toFixed(1)} KB. ` +
        `Mock AI couldn't extract content from this type, so the summary is based on metadata only.`,
    };
  }
  const firstSentence = text.split(/(?<=[.!?])\s+/)[0] ?? text.slice(0, 160);
  const oneLine = firstSentence.slice(0, 140).trim();
  const paras = text.split(/\n{2,}/).slice(0, 3);
  const extended = paras.length >= 2
    ? paras.join('\n\n')
    : `${oneLine}\n\n${FILLERS[rand(0, FILLERS.length - 1)]}\n\n${FILLERS[rand(0, FILLERS.length - 1)]}`;
  return { oneLine, extended };
}

function humanKind(kind: string): string {
  switch (kind) {
    case 'pdf':
      return 'PDF document';
    case 'image':
      return 'image';
    case 'video':
      return 'video';
    case 'audio':
      return 'audio recording';
    case 'markdown':
      return 'Markdown file';
    case 'code':
      return 'source code file';
    case 'archive':
      return 'archive';
    case 'office':
      return 'Office document';
    case 'text':
      return 'text file';
    case 'doc':
      return 'document';
    case 'note':
      return 'note';
    default:
      return 'file';
  }
}

export async function suggestFileTags(
  file: MockFileMeta & { extractedText?: string },
  existingTags: string[],
  opts: MockAiOptions = {},
): Promise<string[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const text = `${file.name} ${file.extractedText ?? ''}`.toLowerCase();
  const KEYWORDS: Record<string, RegExp> = {
    'design-review': /\b(design review|figma|wireframe|mockup)\b/,
    contract: /\b(contract|agreement|nda|terms)\b/,
    'q2-planning': /\bq2\b/,
    invoice: /\b(invoice|receipt|billing)\b/,
    research: /\b(research|paper|study|hypothesis)\b/,
    screenshot: /\bscreenshot|screen recording\b/,
    photo: /\bphoto\b/,
    meeting: /\b(meeting|standup|sync|kickoff|attendees)\b/,
    receipt: /\breceipt\b/,
    code: /\b(code|api|database)\b/,
  };
  const kindFallbacks: Record<string, string[]> = {
    image: ['screenshot'],
    video: ['recording'],
    audio: ['recording'],
    pdf: ['document'],
    code: ['code'],
    markdown: ['notes'],
    archive: ['archive'],
    office: ['document'],
  };
  const found: string[] = [];
  for (const [tag, re] of Object.entries(KEYWORDS)) {
    if (re.test(text) && !existingTags.includes(tag)) found.push(tag);
  }
  if (found.length === 0) {
    const fb = kindFallbacks[file.kind] ?? [];
    for (const t of fb) if (!existingTags.includes(t)) found.push(t);
  }
  return found.slice(0, 3);
}

export async function detectDuplicates(
  files: MockFileMeta[],
  opts: MockAiOptions = {},
): Promise<MockDuplicateGroup[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const groups: MockDuplicateGroup[] = [];

  const byName = new Map<string, MockFileMeta[]>();
  for (const f of files) {
    const k = normalizeName(f.name);
    if (!byName.has(k)) byName.set(k, []);
    byName.get(k)!.push(f);
  }
  for (const [, list] of byName) {
    if (list.length < 2) continue;
    // If sizes also match → name+size; else name only
    const sizeKey = list[0].size;
    const allSize = list.every((f) => Math.abs(f.size - sizeKey) < 1024);
    groups.push({
      reason: allSize ? 'name+size' : 'name',
      fileIds: list.map((f) => f.id),
    });
  }
  return groups;
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\((?:copy|\d+)\)\s*/g, '')
    .replace(/\s+v\d+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function proposeOrganization(
  folderId: string,
  files: MockFileMeta[],
  opts: MockAiOptions = {},
): Promise<MockOrganizationProposal> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  // Group files by primary inferred subject (first tag → first keyword).
  const buckets = new Map<string, MockFileMeta[]>();
  for (const f of files) {
    const subject =
      f.tags[0] ??
      (/(?:^|\W)(meeting|design|invoice|screenshot|contract|q2)/i.exec(f.name)?.[1]?.toLowerCase() ?? f.kind);
    if (!buckets.has(subject)) buckets.set(subject, []);
    buckets.get(subject)!.push(f);
  }
  // Drop singletons — not worth a folder.
  const newFolders: { name: string; tempId: string }[] = [];
  const moves: { fileId: string; toTempId: string; reason: string }[] = [];
  let i = 0;
  for (const [subject, list] of buckets) {
    if (list.length < 2) continue;
    const tempId = `proposed-${i++}`;
    newFolders.push({ name: prettyFolderName(subject), tempId });
    for (const f of list) {
      moves.push({
        fileId: f.id,
        toTempId: tempId,
        reason: `Subject: ${subject}`,
      });
    }
  }
  return { newFolders, moves };
}

function prettyFolderName(s: string): string {
  return s
    .replace(/-/g, ' ')
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .trim();
}

export async function populateSpace(
  definition: string,
  files: MockFileMeta[],
  opts: MockAiOptions = {},
): Promise<string[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const ranked = await semanticFileSearch(definition, files);
  return ranked.slice(0, 12).map((r) => r.fileId);
}

// ---------------------------------------------------------------------------
// Todo-flavored extensions — extend the shared mockAi rather than fork it.
// `parseQuickAdd` lives in pages/todo/_lib/nlParse.ts because it must be
// synchronous + sub-100ms; the AI-only interpretive bits live here.
// ---------------------------------------------------------------------------

export interface MockTaskMeta {
  id: string;
  title: string;
  completed: boolean;
  dueAt?: number;
  scheduledAt?: number;
  priority: 1 | 2 | 3 | 4;
  estimate?: number;
  projectId?: string | null;
  listId?: string | null;
  tags: string[];
  parentId?: string | null;
  createdAt: number;
  updatedAt: number;
  description?: string;
}

export interface MockTriageProposal {
  taskId: string;
  priority?: 1 | 2 | 3 | 4;
  dueAt?: number;
  projectId?: string;
  listId?: string;
  tags?: string[];
  reason: string;
}

export interface MockDailyPlanBlock {
  taskId: string;
  startAt: number;
  endAt: number;
}

export interface MockDailyPlan {
  orderedTaskIds: string[];
  blocks: MockDailyPlanBlock[];
  rationale: string;
}

export interface MockSubtask {
  title: string;
  estimate?: number;
}

export interface MockPrioritySuggestion {
  taskId: string;
  newPriority: 1 | 2 | 3 | 4;
  reason: string;
}

export async function triageInbox(
  tasks: MockTaskMeta[],
  context: { projects: { id: string; name: string }[]; lists: { id: string; name: string }[] },
  opts: MockAiOptions = {},
): Promise<MockTriageProposal[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  const out: MockTriageProposal[] = [];
  const lower = (s: string) => s.toLowerCase();
  const today = new Date();
  today.setHours(17, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  for (const t of tasks) {
    if (t.completed) continue;
    const text = lower(t.title) + ' ' + (t.description ?? '');
    let proposal: MockTriageProposal = { taskId: t.id, reason: 'Looks routine — Inbox triage' };

    if (/\b(urgent|asap|critical|today|now|important)\b/.test(text)) {
      proposal.priority = 1;
      proposal.dueAt = today.getTime();
      proposal.reason = 'Urgency keywords; pulling forward to Today';
    } else if (/\bweek\b|\bsoon\b|\bthis sprint\b/.test(text)) {
      proposal.priority = 2;
      proposal.dueAt = tomorrow.getTime() + 3 * 86_400_000;
      proposal.reason = 'Mid-priority; placed later this week';
    } else if (/\b(maybe|someday|later|eventually)\b/.test(text)) {
      proposal.priority = 4;
      proposal.reason = 'Low-priority — keep visible but defer';
    } else if (!t.dueAt) {
      proposal.dueAt = tomorrow.getTime();
      proposal.priority = t.priority === 4 ? 3 : t.priority;
      proposal.reason = 'No due date set; suggesting tomorrow';
    }

    // Project routing — pick the project whose name token best overlaps.
    let bestProj: { id: string; score: number } | null = null;
    for (const p of context.projects) {
      const tokens = lower(p.name).split(/\s+/).filter((w) => w.length >= 3);
      const score = tokens.filter((tk) => text.includes(tk)).length;
      if (score > 0 && (!bestProj || score > bestProj.score)) bestProj = { id: p.id, score };
    }
    if (bestProj && !t.projectId) {
      proposal.projectId = bestProj.id;
      proposal.reason += ` · routed to project by topic match`;
    }

    out.push(proposal);
  }

  return out;
}

export async function generateDailyPlan(
  tasks: MockTaskMeta[],
  events: { startAt: number; endAt: number; title: string }[],
  workingHours: { startHour: number; endHour: number },
  opts: MockAiOptions = {},
): Promise<MockDailyPlan> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  // Score: priority weight + deadline urgency + (estimate fits free time).
  const score = (t: MockTaskMeta) => {
    const pw = (5 - t.priority) * 10;
    const due = t.dueAt ? Math.max(0, 30 - (t.dueAt - Date.now()) / 86_400_000) : 0;
    return pw + due;
  };
  const ordered = [...tasks]
    .filter((t) => !t.completed)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 8);

  // Lay out blocks in free space between calendar events, within working hours.
  const today = new Date();
  today.setHours(workingHours.startHour, 0, 0, 0);
  const dayEnd = new Date(today);
  dayEnd.setHours(workingHours.endHour, 0, 0, 0);

  const sortedEvents = [...events]
    .filter((e) => e.endAt > today.getTime() && e.startAt < dayEnd.getTime())
    .sort((a, b) => a.startAt - b.startAt);

  const free: { from: number; to: number }[] = [];
  let cursor = today.getTime();
  for (const ev of sortedEvents) {
    if (ev.startAt > cursor) free.push({ from: cursor, to: ev.startAt });
    cursor = Math.max(cursor, ev.endAt);
  }
  if (cursor < dayEnd.getTime()) free.push({ from: cursor, to: dayEnd.getTime() });

  const blocks: MockDailyPlanBlock[] = [];
  let block = free.shift();
  for (const t of ordered) {
    const minutes = t.estimate ?? 30;
    while (block && block.to - block.from < 10 * 60_000) block = free.shift();
    if (!block) break;
    const startAt = block.from;
    const endAt = Math.min(block.to, startAt + minutes * 60_000);
    blocks.push({ taskId: t.id, startAt, endAt });
    block.from = endAt;
    if (block.to - block.from < 10 * 60_000) block = free.shift();
  }

  return {
    orderedTaskIds: ordered.map((t) => t.id),
    blocks,
    rationale:
      'Ordered by priority and deadline urgency, slotted into free time between calendar events. Higher-priority and harder-deadline tasks come first.',
  };
}

export async function suggestPriorityBump(
  task: MockTaskMeta,
  _ctx: unknown,
  opts: MockAiOptions = {},
): Promise<MockPrioritySuggestion | null> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  if (!task.dueAt) return null;
  const daysUntilDue = (task.dueAt - Date.now()) / 86_400_000;
  if (daysUntilDue < 1.5 && task.priority > 2) {
    return {
      taskId: task.id,
      newPriority: 2,
      reason: `Due in less than 36 hours — bumping to P2.`,
    };
  }
  if (daysUntilDue < 0 && task.priority > 1) {
    return {
      taskId: task.id,
      newPriority: 1,
      reason: 'Overdue — should be P1 today.',
    };
  }
  return null;
}

export async function breakDownTask(
  task: MockTaskMeta,
  opts: MockAiOptions = {},
): Promise<MockSubtask[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const t = task.title.toLowerCase();
  if (/\b(write|draft|essay|post|article|paper)\b/.test(t)) {
    return [
      { title: 'Outline the argument', estimate: 15 },
      { title: 'Draft introduction', estimate: 20 },
      { title: 'Draft body', estimate: 45 },
      { title: 'Draft conclusion', estimate: 15 },
      { title: 'Self-edit pass', estimate: 20 },
    ];
  }
  if (/\b(plan|launch|ship|release)\b/.test(t)) {
    return [
      { title: 'Confirm scope with stakeholders', estimate: 30 },
      { title: 'Draft technical spec', estimate: 60 },
      { title: 'Pre-launch QA pass', estimate: 45 },
      { title: 'Comms + announcement', estimate: 30 },
      { title: 'Post-launch review', estimate: 30 },
    ];
  }
  if (/\b(research|investigate|study|explore)\b/.test(t)) {
    return [
      { title: 'Gather sources', estimate: 30 },
      { title: 'Skim and triage', estimate: 30 },
      { title: 'Take structured notes', estimate: 45 },
      { title: 'Synthesize findings', estimate: 30 },
    ];
  }
  if (/\b(prepare|prep)\b/.test(t)) {
    return [
      { title: 'Identify required materials', estimate: 15 },
      { title: 'Draft talking points', estimate: 20 },
      { title: 'Rehearse', estimate: 30 },
    ];
  }
  return [
    { title: 'Define done', estimate: 10 },
    { title: 'First pass', estimate: 30 },
    { title: 'Review and polish', estimate: 20 },
  ];
}

export async function estimateTask(
  task: MockTaskMeta,
  history: MockTaskMeta[],
  opts: MockAiOptions = {},
): Promise<{ minutes: number; confidence: number }> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  // Median of historical estimates, biased by title length.
  const ests = history
    .filter((h) => h.estimate !== undefined && h.completed)
    .map((h) => h.estimate as number)
    .sort((a, b) => a - b);
  const median = ests.length ? ests[Math.floor(ests.length / 2)] : 30;
  const lenBias = Math.min(60, task.title.length * 0.4);
  const minutes = Math.max(10, Math.round((median + lenBias) / 5) * 5);
  return { minutes, confidence: ests.length ? 0.75 : 0.4 };
}

export async function* askAcrossTasks(
  question: string,
  tasks: MockTaskMeta[],
  opts: MockAiOptions = {},
): AsyncIterable<{ chunk: string; citedTaskIds?: string[] }> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const qTokens = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3);
  const matched = tasks
    .map((t) => {
      const text = (t.title + ' ' + t.tags.join(' ') + ' ' + (t.description ?? '')).toLowerCase();
      const score = qTokens.filter((q) => text.includes(q)).length;
      return { task: t, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const intro = matched.length
    ? `Found ${matched.length} matching task${matched.length > 1 ? 's' : ''}:`
    : `Couldn't find a strong match. Best-effort answer:`;
  for (const t of intro.match(/\S+\s*|\s+/g) ?? []) {
    if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    await delay(rand(15, 30), opts.signal);
    yield { chunk: t };
  }
  if (matched.length) {
    yield { chunk: '\n\n' };
    for (const m of matched) {
      const status = m.task.completed
        ? 'completed'
        : m.task.dueAt && m.task.dueAt < Date.now()
          ? 'overdue'
          : 'open';
      const line = `• ${m.task.title} — ${status}, P${m.task.priority}`;
      for (const t of line.match(/\S+\s*|\s+/g) ?? []) {
        if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        await delay(rand(10, 25), opts.signal);
        yield { chunk: t, citedTaskIds: [m.task.id] };
      }
      yield { chunk: '\n' };
    }
  } else {
    const tail = ` ${FILLERS[rand(0, FILLERS.length - 1)]}`;
    for (const t of tail.match(/\S+\s*|\s+/g) ?? []) {
      if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      await delay(rand(15, 35), opts.signal);
      yield { chunk: t };
    }
  }
}

export async function populateSmartList(
  definition: string,
  tasks: MockTaskMeta[],
  opts: MockAiOptions = {},
): Promise<string[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const qTokens = definition
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3);
  const scored = tasks
    .filter((t) => !t.completed)
    .map((t) => {
      const text = (t.title + ' ' + t.tags.join(' ')).toLowerCase();
      const overlap = qTokens.filter((q) => text.includes(q)).length;
      return { task: t, score: overlap };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
  return scored.map((s) => s.task.id);
}

export async function suggestSnoozeTime(
  task: MockTaskMeta,
  _history: MockTaskMeta[],
  opts: MockAiOptions = {},
): Promise<{ snoozeUntil: number; reason: string }> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const next = new Date();
  // Default: tomorrow morning at 9am.
  next.setDate(next.getDate() + 1);
  next.setHours(9, 0, 0, 0);
  let reason = 'Tomorrow morning is your typical pickup time.';
  if (task.priority === 1) {
    next.setHours(9, 0, 0, 0);
    next.setDate(next.getDate() - (next.getDate() - new Date().getDate())); // same day if not too late
    if (next.getTime() < Date.now()) {
      next.setDate(next.getDate() + 1);
    }
    reason = 'P1 task — surface again tomorrow morning at 9.';
  } else if (task.priority === 4) {
    next.setDate(next.getDate() + 6);
    reason = 'Low priority — surface again next week.';
  }
  return { snoozeUntil: next.getTime(), reason };
}

export async function nextBestTask(
  tasks: MockTaskMeta[],
  context: { now: number; freeUntilMs?: number },
  opts: MockAiOptions = {},
): Promise<MockTaskMeta | null> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const free = context.freeUntilMs ? (context.freeUntilMs - context.now) / 60_000 : Infinity;
  const eligible = tasks.filter(
    (t) =>
      !t.completed &&
      (!t.estimate || t.estimate <= free + 5),
  );
  if (eligible.length === 0) return null;
  // Prefer P1 then P2 then quick wins.
  eligible.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return (a.estimate ?? 30) - (b.estimate ?? 30);
  });
  return eligible[0];
}

// ---------------------------------------------------------------------------
// Contacts-flavored extensions — same convention. The strength heuristic and
// duplicate detection run synchronously elsewhere; the streaming pieces here
// only wrap them in plausible explanations + Q&A.
// ---------------------------------------------------------------------------

export interface MockContactSummary {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  organization?: string;
  title?: string;
  tags: string[];
  isExternal: boolean;
}

export interface MockContactInteraction {
  id: string;
  type: 'email' | 'meeting' | 'doc-share' | 'note-mention' | 'drive-share' | 'task-assign';
  occurredAt: number;
  summary: string;
}

export interface MockEnrichmentSignal {
  module: 'mail' | 'calendar' | 'docs' | 'notes' | 'drive' | 'todo';
  sourceId: string;
  snippet: string;
}

export interface MockEnrichmentSuggestion {
  field: string;
  value: string;
  source: MockEnrichmentSignal;
  confidence: number;
}

export interface MockGroupSuggestion {
  name: string;
  contactIds: string[];
  reason: string;
}

export interface MockColumnMapping {
  /** header → field name on Contact, or 'ignore'. */
  mapping: Record<string, string>;
  reasoning: string;
}

export interface MockContactSearchFilters {
  organization?: string;
  tag?: string;
  minStrength?: number;
  external?: boolean;
  text?: string;
}

export async function summarizeContact(
  contact: MockContactSummary,
  interactions: MockContactInteraction[],
  opts: MockAiOptions = {},
): Promise<string> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const role = contact.title && contact.organization
    ? `${contact.title} at ${contact.organization}`
    : contact.title ?? contact.organization ?? 'a contact';
  const recent = interactions.slice(0, 5);
  const buckets: Record<string, number> = {};
  for (const i of interactions) buckets[i.type] = (buckets[i.type] ?? 0) + 1;
  const breakdown = Object.entries(buckets)
    .map(([k, n]) => `${n} ${k.replace('-', ' ')}${n === 1 ? '' : 's'}`)
    .join(', ');
  const lastTopic = recent[0]?.summary ?? 'recent collaboration';
  const name = contact.displayName ?? `${contact.firstName} ${contact.lastName}`.trim();
  if (interactions.length === 0) {
    return `${name} is ${role}. No interactions recorded yet — add a note or wait for the platform to learn the relationship.`;
  }
  return `${name} is ${role}. You have ${breakdown} together. The most recent thread was "${lastTopic}".`;
}

export async function suggestContactEnrichment(
  contact: MockContactSummary,
  signals: MockEnrichmentSignal[],
  opts: MockAiOptions = {},
): Promise<MockEnrichmentSuggestion[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const out: MockEnrichmentSuggestion[] = [];
  for (const sig of signals) {
    const text = sig.snippet;
    if (!contact.title) {
      const m = text.match(/\b(Head of|Director of|VP of|Senior|Lead|Principal|Manager)\s+([A-Za-z][A-Za-z\s]{1,40})/);
      if (m) {
        out.push({
          field: 'title',
          value: `${m[1]} ${m[2]}`.trim(),
          source: sig,
          confidence: 0.7,
        });
      }
    }
    if (!contact.organization) {
      const m = text.match(/\bat\s+([A-Z][A-Za-z0-9&.\s-]{2,30})/);
      if (m) {
        out.push({
          field: 'organization',
          value: m[1].trim().replace(/[.,]+$/, ''),
          source: sig,
          confidence: 0.6,
        });
      }
    }
  }
  // Dedupe per field+value.
  const seen = new Set<string>();
  return out.filter((s) => {
    const k = `${s.field}|${s.value}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export async function suggestContactGroups(
  contacts: MockContactSummary[],
  interactions: MockContactInteraction[],
  opts: MockAiOptions = {},
): Promise<MockGroupSuggestion[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  // Cluster by organization where 3+ contacts share an org.
  const byOrg = new Map<string, string[]>();
  for (const c of contacts) {
    if (!c.organization) continue;
    const k = c.organization.trim().toLowerCase();
    if (!byOrg.has(k)) byOrg.set(k, []);
    byOrg.get(k)!.push(c.id);
  }
  const out: MockGroupSuggestion[] = [];
  for (const [org, ids] of byOrg) {
    if (ids.length < 3) continue;
    const name = contacts.find((c) => c.organization?.toLowerCase() === org)?.organization ?? org;
    out.push({
      name: `${name} team`,
      contactIds: ids,
      reason: `${ids.length} contacts at "${name}" — they often appear together in your interactions.`,
    });
  }
  return out;
}

export async function* askAboutContact(
  question: string,
  contact: MockContactSummary,
  interactions: MockContactInteraction[],
  opts: MockAiOptions = {},
): AsyncIterable<{ chunk: string; citations?: string[] }> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const qTokens = question.toLowerCase().split(/\s+/).filter((w) => w.length >= 3);
  const matches = interactions
    .map((i) => ({
      i,
      score: qTokens.filter((q) => i.summary.toLowerCase().includes(q)).length,
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const name = contact.displayName ?? `${contact.firstName} ${contact.lastName}`.trim();
  const intro = matches.length
    ? `About ${name}: I found ${matches.length} relevant interaction${matches.length === 1 ? '' : 's'}.`
    : `I don't see direct matches for "${question}" with ${name}; here's a best-effort answer.`;
  for (const tk of intro.match(/\S+\s*|\s+/g) ?? []) {
    if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    await delay(rand(15, 30), opts.signal);
    yield { chunk: tk };
  }
  if (matches.length) {
    yield { chunk: '\n\n' };
    for (const m of matches) {
      const line = `• ${m.i.summary} (${new Date(m.i.occurredAt).toLocaleDateString()})`;
      for (const tk of line.match(/\S+\s*|\s+/g) ?? []) {
        if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        await delay(rand(10, 25), opts.signal);
        yield { chunk: tk, citations: [m.i.id] };
      }
      yield { chunk: '\n' };
    }
  } else {
    const tail = ` ${FILLERS[rand(0, FILLERS.length - 1)]}`;
    for (const tk of tail.match(/\S+\s*|\s+/g) ?? []) {
      if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      await delay(rand(15, 30), opts.signal);
      yield { chunk: tk };
    }
  }
}

export async function* askAcrossContacts(
  question: string,
  contacts: MockContactSummary[],
  _interactions: MockContactInteraction[],
  opts: MockAiOptions = {},
): AsyncIterable<{ chunk: string; citedContactIds?: string[] }> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const qTokens = question.toLowerCase().split(/\s+/).filter((w) => w.length >= 3);
  const scored = contacts
    .map((c) => {
      const text = `${c.firstName} ${c.lastName} ${c.organization ?? ''} ${c.title ?? ''} ${c.tags.join(' ')}`.toLowerCase();
      let score = 0;
      for (const q of qTokens) if (text.includes(q)) score++;
      return { c, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const intro = scored.length
    ? `Found ${scored.length} matching contact${scored.length === 1 ? '' : 's'}:`
    : `Couldn't find a strong match across your contacts.`;
  for (const tk of intro.match(/\S+\s*|\s+/g) ?? []) {
    if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    await delay(rand(15, 30), opts.signal);
    yield { chunk: tk };
  }
  if (scored.length) {
    yield { chunk: '\n\n' };
    for (const s of scored) {
      const name = s.c.displayName ?? `${s.c.firstName} ${s.c.lastName}`.trim();
      const role = s.c.title && s.c.organization ? ` — ${s.c.title} at ${s.c.organization}` : '';
      const line = `• ${name}${role}`;
      for (const tk of line.match(/\S+\s*|\s+/g) ?? []) {
        if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        await delay(rand(10, 25), opts.signal);
        yield { chunk: tk, citedContactIds: [s.c.id] };
      }
      yield { chunk: '\n' };
    }
  }
}

export async function suggestContactNextActions(
  contact: MockContactSummary,
  interactions: MockContactInteraction[],
  opts: MockAiOptions = {},
): Promise<{ kind: string; reason: string }[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const out: { kind: string; reason: string }[] = [];
  const lastAt = interactions.reduce((m, i) => Math.max(m, i.occurredAt), 0);
  const days = lastAt > 0 ? (Date.now() - lastAt) / 86_400_000 : Infinity;
  if (days > 42) {
    out.push({ kind: 'check-in', reason: `It's been ${Math.round(days)} days since you last connected — quick check-in?` });
  }
  const lastEmail = interactions.find((i) => i.type === 'email');
  if (lastEmail && Date.now() - lastEmail.occurredAt > 4 * 86_400_000) {
    out.push({ kind: 'unreplied-email', reason: 'You may owe a reply on the last email thread.' });
  }
  const lastMeeting = interactions.find((i) => i.type === 'meeting');
  if (lastMeeting && Date.now() - lastMeeting.occurredAt < 7 * 86_400_000) {
    out.push({ kind: 'meeting-followup', reason: `Recent meeting — send a quick follow-up?` });
  }
  return out.slice(0, 3);
}

export async function detectContactStaleness(
  contact: MockContactSummary,
  interactions: MockContactInteraction[],
  expectedDays: number = 30,
  opts: MockAiOptions = {},
): Promise<{ daysSinceLast: number; expectedCadenceDays: number; reason: string } | null> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const lastAt = interactions.reduce((m, i) => Math.max(m, i.occurredAt), 0);
  if (lastAt === 0) return null;
  const days = (Date.now() - lastAt) / 86_400_000;
  if (days <= expectedDays) return null;
  const name = contact.displayName ?? `${contact.firstName} ${contact.lastName}`.trim();
  return {
    daysSinceLast: Math.round(days),
    expectedCadenceDays: expectedDays,
    reason: `You used to interact with ${name} every ${expectedDays} days — last contact was ${Math.round(days)} days ago.`,
  };
}

export async function mapImportColumns(
  headers: string[],
  _sampleRows: any[],
  opts: MockAiOptions = {},
): Promise<MockColumnMapping> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const mapping: Record<string, string> = {};
  for (const h of headers) {
    const k = h.toLowerCase().replace(/[\s_-]/g, '');
    if (/^(firstname|givenname|first)$/.test(k)) mapping[h] = 'firstName';
    else if (/^(lastname|familyname|surname|last)$/.test(k)) mapping[h] = 'lastName';
    else if (/(displayname|fullname|name)$/.test(k)) mapping[h] = 'displayName';
    else if (/^(email|emailaddress|mail)$/.test(k)) mapping[h] = 'email';
    else if (/^(phone|telephone|mobile|cell)$/.test(k)) mapping[h] = 'phone';
    else if (/^(organization|organisation|company|employer|org)$/.test(k))
      mapping[h] = 'organization';
    else if (/^(title|jobtitle|role|position)$/.test(k)) mapping[h] = 'title';
    else if (/^(url|website|link)$/.test(k)) mapping[h] = 'url';
    else if (/^(birthday|dob)$/.test(k)) mapping[h] = 'birthday';
    else if (/^(notes?)$/.test(k)) mapping[h] = 'notes';
    else if (/^(tags?)$/.test(k)) mapping[h] = 'tags';
    else mapping[h] = 'ignore';
  }
  return {
    mapping,
    reasoning: 'Mapped columns by header name patterns. Review and adjust before importing.',
  };
}

export async function parseContactNlSearch(
  query: string,
  opts: MockAiOptions = {},
): Promise<MockContactSearchFilters> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const out: MockContactSearchFilters = {};
  const orgMatch = query.match(/\bat\s+([A-Z][A-Za-z0-9&.\s-]+?)(?=\s|,|$)/);
  if (orgMatch) out.organization = orgMatch[1].trim();
  const tagMatch = query.match(/#([a-zA-Z][\w-]+)/);
  if (tagMatch) out.tag = tagMatch[1].toLowerCase();
  if (/external|outside/i.test(query)) out.external = true;
  if (/strong|vip|close/i.test(query)) out.minStrength = 70;
  out.text = query;
  return out;
}

export async function populateContactSmartView(
  definition: string,
  contacts: MockContactSummary[],
  interactions: MockContactInteraction[],
  opts: MockAiOptions = {},
): Promise<string[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);
  const qTokens = definition.toLowerCase().split(/\s+/).filter((w) => w.length >= 3);
  const interactionCounts = new Map<string, number>();
  for (const i of interactions) {
    interactionCounts.set('any', 0); // placeholder
  }
  const scored = contacts.map((c) => {
    const text = `${c.firstName} ${c.lastName} ${c.organization ?? ''} ${c.title ?? ''} ${c.tags.join(' ')}`.toLowerCase();
    let score = 0;
    for (const q of qTokens) if (text.includes(q)) score++;
    return { id: c.id, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((s) => s.id);
}

// ============================================================================
// Mail
// ============================================================================

export interface MockMailEmail {
  id: string;
  threadId: string;
  fromName: string;
  fromEmail: string;
  toEmails: string[];
  subject: string;
  snippet: string;
  bodyText?: string;
  receivedAt: number;
  direction: 'incoming' | 'outgoing';
  hasAttachment: boolean;
  category?: 'important' | 'updates' | 'promos' | 'calendar';
  labels: string[];
}

export interface MockMailThread {
  id: string;
  subject: string;
  participantEmails: string[];
  emailIds: string[];
}

export interface MockCategoryOverride {
  fromPattern: string;
  targetCategory: 'important' | 'updates' | 'promos' | 'calendar';
}

const PROMO_DOMAINS = ['nytimes.com', 'figma.com', 'aa.com', 'discounttire.com', 'substack.com'];
const PROMO_KEYWORDS = ['off ', 'sale', 'limited', 'discount', 'deal', 'unsubscribe', 'rebate', 'bonus mile'];
const UPDATES_DOMAINS = ['github.com', 'stripe.com', 'linear.app', 'aws.amazon.com', 'notion.so', 'jira.com', 'pagerduty.com'];
const CALENDAR_KEYWORDS = ['invitation:', 'reschedul', 'calendar', 'meeting', 'rsvp', '1:1', 'standup'];
const NEWSLETTER_KEYWORDS = ['weekly digest', 'morning', 'newsletter', 'briefing', 'roundup'];

function fromDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() ?? '';
}

export async function categorizeEmail(
  email: MockMailEmail,
  overrides: MockCategoryOverride[],
  opts: MockAiOptions = {},
): Promise<{ category: 'important' | 'updates' | 'promos' | 'calendar'; confidence: number }> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  // Slightly faster: this runs on every new email.
  await delay(rand(Math.min(80, minLatencyMs), Math.min(220, maxLatencyMs)), opts.signal);
  maybeFail(failureRate * 0.4);

  // 1) Apply user overrides first (highest priority, deterministic).
  for (const o of overrides) {
    if (email.fromEmail.toLowerCase().includes(o.fromPattern.toLowerCase())) {
      return { category: o.targetCategory, confidence: 1 };
    }
  }

  const domain = fromDomain(email.fromEmail);
  const subjectLow = email.subject.toLowerCase();
  const snippetLow = (email.snippet ?? '').toLowerCase();

  // 2) Calendar
  if (CALENDAR_KEYWORDS.some((k) => subjectLow.includes(k))) {
    return { category: 'calendar', confidence: 0.9 };
  }

  // 3) Promos
  if (PROMO_DOMAINS.includes(domain)) return { category: 'promos', confidence: 0.85 };
  if (PROMO_KEYWORDS.some((k) => subjectLow.includes(k))) {
    return { category: 'promos', confidence: 0.78 };
  }

  // 4) Updates: machine-y senders or newsletters
  if (UPDATES_DOMAINS.includes(domain)) return { category: 'updates', confidence: 0.88 };
  if (NEWSLETTER_KEYWORDS.some((k) => subjectLow.includes(k) || snippetLow.includes(k))) {
    return { category: 'updates', confidence: 0.7 };
  }
  if (/no[-_.]?reply|notifications?|newsletter|updates?@/i.test(email.fromEmail)) {
    return { category: 'updates', confidence: 0.82 };
  }

  // 5) Default: important (real human correspondence)
  return { category: 'important', confidence: 0.65 };
}

export interface MockTriageSuggestion {
  action: 'reply' | 'archive' | 'snooze' | 'make-task' | 'forward';
  reason: string;
  snoozeHours?: number;
}

export async function suggestTriageAction(
  thread: MockMailThread,
  emails: MockMailEmail[],
  opts: MockAiOptions = {},
): Promise<MockTriageSuggestion> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  const last = emails[emails.length - 1];
  if (!last) return { action: 'archive', reason: 'No messages in thread' };

  const subjectLow = (last.subject ?? '').toLowerCase();
  const snippetLow = (last.snippet ?? '').toLowerCase();

  if (last.direction === 'outgoing') {
    return { action: 'archive', reason: 'You sent the latest message — nothing to do here yet.' };
  }
  if (subjectLow.includes('?') || snippetLow.includes('?') || /can you|could you|would you|please/i.test(snippetLow)) {
    return { action: 'reply', reason: 'A direct question from someone in your inbox.' };
  }
  if (last.category === 'updates' || last.category === 'promos') {
    return { action: 'archive', reason: 'Looks like a notification — safe to archive.' };
  }
  if (subjectLow.includes('invitation') || subjectLow.includes('reschedul')) {
    return { action: 'reply', reason: 'Calendar request — quick RSVP needed.' };
  }
  if (Date.now() - last.receivedAt > 7 * 86_400_000) {
    return { action: 'snooze', reason: 'Older thread — snooze and revisit next week.', snoozeHours: 7 * 24 };
  }
  return { action: 'make-task', reason: 'Has substance — capture as a task so it doesn\'t get lost.' };
}

export interface MockMailDigest {
  generatedAt: number;
  totalImportant: number;
  needReplyToday: number;
  meetings: number;
  fyi: number;
  highlights: { threadId: string; reason: string }[];
}

export async function generateDailyDigest(
  emails: MockMailEmail[],
  threads: MockMailThread[],
  since: number,
  opts: MockAiOptions = {},
): Promise<MockMailDigest> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  const recent = emails.filter((e) => e.receivedAt >= since && e.direction === 'incoming');
  const important = recent.filter((e) => e.category === 'important');
  const meetings = recent.filter((e) => e.category === 'calendar').length;
  const fyi = recent.filter((e) => e.category === 'updates').length;

  // Pick highlight threads: prioritize threads with question marks
  const importantThreadIds = new Set(important.map((e) => e.threadId));
  const highlights: { threadId: string; reason: string }[] = [];
  for (const tid of importantThreadIds) {
    const last = important.filter((e) => e.threadId === tid).slice(-1)[0];
    if (!last) continue;
    if (/\?/.test(last.snippet) || /\?/.test(last.subject)) {
      highlights.push({ threadId: tid, reason: `${last.fromName} asked you a question` });
    } else {
      highlights.push({ threadId: tid, reason: `New from ${last.fromName}` });
    }
    if (highlights.length >= 5) break;
  }
  return {
    generatedAt: Date.now(),
    totalImportant: important.length,
    needReplyToday: highlights.filter((h) => h.reason.includes('question')).length,
    meetings,
    fyi,
    highlights,
  };
}

export interface MockThreadSummary {
  paragraph: string;
  keyPoints: string[];
  decisions: string[];
  openQuestions: string[];
}

export async function summarizeThread(
  thread: MockMailThread,
  emails: MockMailEmail[],
  opts: MockAiOptions = {},
): Promise<MockThreadSummary> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs * 1.5), opts.signal);
  maybeFail(failureRate);

  const participants = Array.from(new Set(emails.map((e) => e.fromName))).slice(0, 4);
  const lastIncoming = [...emails].reverse().find((e) => e.direction === 'incoming');
  const lastOutgoing = [...emails].reverse().find((e) => e.direction === 'outgoing');
  const subj = thread.subject;

  const paragraph =
    `${participants.join(', ')} have been corresponding about ${subj.toLowerCase()}. ` +
    (lastOutgoing ? `You last sent a reply touching on the latest update; ` : '') +
    (lastIncoming ? `the most recent inbound message raises ${
      /\?/.test(lastIncoming.snippet) ? 'a direct question that\'s still open' : 'fresh context worth reviewing'
    }.` : '');

  const keyPoints: string[] = [];
  for (const e of emails) {
    const first = e.snippet.split(/[.!?]/)[0]?.trim();
    if (first && first.length > 10) keyPoints.push(`${e.fromName}: ${first}`);
    if (keyPoints.length >= 4) break;
  }

  const decisions: string[] = [];
  const openQuestions: string[] = [];
  for (const e of emails) {
    if (/\bwe (decided|agreed|confirmed|will)\b/i.test(e.snippet)) {
      decisions.push(e.snippet.split(/[.!?]/)[0].trim());
    }
    if (/\?/.test(e.snippet) && e.direction === 'incoming') {
      openQuestions.push(e.snippet.split('?')[0].trim() + '?');
    }
  }

  return {
    paragraph,
    keyPoints,
    decisions: decisions.slice(0, 3),
    openQuestions: openQuestions.slice(0, 3),
  };
}

export async function* askAboutThread(
  question: string,
  thread: MockMailThread,
  emails: MockMailEmail[],
  opts: MockAiOptions = {},
): AsyncIterable<string> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate * 0.5);

  const participants = Array.from(new Set(emails.map((e) => e.fromName)));
  const text =
    `Looking at the ${emails.length} message${emails.length === 1 ? '' : 's'} in "${thread.subject}" with ${participants.slice(0, 3).join(', ')}, ` +
    `the most relevant signal for "${question}" is in the latest exchange. ` +
    `${emails[emails.length - 1]?.fromName} mentioned: "${emails[emails.length - 1]?.snippet.slice(0, 120)}". ` +
    `Based on that and the prior context, the short answer is: this thread is still open and the next move is on you.`;
  yield* streamString(text, opts.signal);
}

export interface MockMailSearchAnswer {
  chunk: string;
  citedEmailIds?: string[];
}

export async function* askAcrossMail(
  question: string,
  emails: MockMailEmail[],
  opts: MockAiOptions = {},
): AsyncIterable<MockMailSearchAnswer> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate * 0.5);

  const tokens = question.toLowerCase().split(/\s+/).filter((t) => t.length >= 3);
  const scored = emails
    .map((e) => {
      const hay = `${e.subject} ${e.snippet} ${e.fromName} ${e.fromEmail}`.toLowerCase();
      const score = tokens.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const cited = scored.map((s) => s.e.id);
  const intro = scored.length === 0
    ? `I couldn't find an exact match in your mail for "${question}". Showing semantically nearby emails.`
    : `Here's what I found across ${scored.length} email${scored.length === 1 ? '' : 's'}: `;
  for (const t of tokenize(intro)) {
    await delay(rand(15, 35), opts.signal);
    yield { chunk: t };
  }
  for (let i = 0; i < scored.length; i++) {
    const e = scored[i].e;
    const piece = `${i === 0 ? '' : ' '}${e.fromName} on ${new Date(e.receivedAt).toLocaleDateString()}: "${e.snippet.slice(0, 100)}"${i === scored.length - 1 ? '.' : ';'}`;
    for (const t of tokenize(piece)) {
      await delay(rand(15, 30), opts.signal);
      yield { chunk: t };
    }
  }
  yield { chunk: '', citedEmailIds: cited };
}

export interface MockReplyContext {
  contactName?: string;
  threadSubject?: string;
  lastIncomingSnippet?: string;
}

export async function* draftReply(
  intent: 'acknowledge' | 'decline' | 'ask-more-info' | 'confirm-and-propose-time' | 'push-back' | 'free-form',
  context: MockReplyContext,
  freeFormPrompt?: string,
  opts: MockAiOptions = {},
): AsyncIterable<string> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  const greeting = context.contactName ? `Hi ${context.contactName.split(' ')[0]},` : 'Hi,';
  let body = '';
  switch (intent) {
    case 'acknowledge':
      body = `Thanks for the note — got it and will follow up shortly. Appreciate the context.`;
      break;
    case 'decline':
      body = `Thank you for thinking of me. Unfortunately I have to pass on this one — happy to revisit later in the year if it makes sense.`;
      break;
    case 'ask-more-info':
      body = `Thanks for sending this over. To make sure I respond usefully, could you share a bit more on the timing and what success looks like from your side?`;
      break;
    case 'confirm-and-propose-time':
      body = `Confirmed — happy to find time. How about Tuesday at 10am or Wednesday at 2pm? I'll send a calendar invite once you pick.`;
      break;
    case 'push-back':
      body = `Appreciate the proposal. I'd push back gently on the scope — based on what we discussed earlier, I think a tighter cut would land better. Want to chat through it briefly?`;
      break;
    case 'free-form':
      body = freeFormPrompt
        ? `Per your note: ${freeFormPrompt}. Let me know if you'd like me to adjust the framing.`
        : `Wanted to follow up on this. ${fillerSentence()}`;
      break;
  }
  const closing = `\n\nBest,\nYou`;
  yield* streamString(`${greeting}\n\n${body}${closing}`, opts.signal);
}

export async function* draftFromPrompt(
  prompt: string,
  context: MockReplyContext = {},
  opts: MockAiOptions = {},
): AsyncIterable<string> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  const greeting = context.contactName ? `Hi ${context.contactName.split(' ')[0]},` : 'Hi,';
  const body = `${prompt.charAt(0).toUpperCase() + prompt.slice(1).replace(/\.$/, '')}. ${fillerSentence()}`;
  yield* streamString(`${greeting}\n\n${body}\n\nBest,\nYou`, opts.signal);
}

export async function ghostCompleteEmail(
  precedingText: string,
  recipientName?: string,
  opts: MockAiOptions = {},
): Promise<string | null> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(Math.floor(minLatencyMs / 2), Math.floor(maxLatencyMs / 2)), opts.signal);
  if (Math.random() < failureRate * 0.3) return null;

  const trim = precedingText.trim();
  if (trim.length < 8) return null;

  const last = trim.slice(-80).toLowerCase();
  if (last.endsWith('thanks') || last.endsWith('thank you')) return ' for your patience on this.';
  if (last.endsWith('hi') && recipientName) return ` ${recipientName.split(' ')[0]} —`;
  if (last.endsWith('let me know')) return ' if there is anything else you need.';
  if (last.endsWith('please')) return ' let me know your availability.';
  if (last.endsWith('available')) return ' Tuesday at 10am or Wednesday afternoon.';
  if (/\bregarding\b/.test(last)) return ' the proposal we discussed last week.';
  if (last.endsWith('.')) return ' Quick follow-up below.';
  return null;
}

export interface MockPreSendIssue {
  kind: 'missing-attachment' | 'name-mismatch' | 'tone' | 'promised-action';
  message: string;
  suggestion?: string;
}

export async function preSendCheck(
  draft: {
    subject: string;
    bodyHtml: string;
    bodyText?: string;
    to: { name: string; email: string }[];
    hasAttachments: boolean;
  },
  opts: MockAiOptions = {},
): Promise<MockPreSendIssue[]> {
  const { failureRate, minLatencyMs } = { ..._settings, ...opts };
  await delay(rand(Math.min(80, minLatencyMs), 200), opts.signal);
  maybeFail(failureRate * 0.2);

  const issues: MockPreSendIssue[] = [];
  const text = `${draft.subject} ${draft.bodyText ?? draft.bodyHtml.replace(/<[^>]+>/g, ' ')}`.toLowerCase();
  if (/\battach(ed|ment)?\b/.test(text) && !draft.hasAttachments) {
    issues.push({
      kind: 'missing-attachment',
      message: "You mentioned 'attached' but no file is attached.",
    });
  }
  // Name mismatch heuristic: greeting "Hi X" but recipient first names don't include X
  const greetingMatch = text.match(/\b(?:hi|hello|dear|hey)\s+([a-z]+)/i);
  if (greetingMatch) {
    const named = greetingMatch[1].toLowerCase();
    const firstNames = draft.to.map((r) => r.name.split(' ')[0].toLowerCase());
    if (firstNames.length > 0 && !firstNames.includes(named) && named !== 'all' && named !== 'team') {
      issues.push({
        kind: 'name-mismatch',
        message: `You wrote "Hi ${named}" but the recipient is ${draft.to[0].name}.`,
      });
    }
  }
  // Promised action
  const promiseMatch = text.match(/\bi(?:'ll| will)\s+(send|share|follow up|update|deliver|finish)\b[^.]{0,80}\b(by|before|on)\s+([^.]+)/i);
  if (promiseMatch) {
    issues.push({
      kind: 'promised-action',
      message: `You promised to ${promiseMatch[1]} ${promiseMatch[2]} ${promiseMatch[3].slice(0, 30)} — create a follow-up task?`,
      suggestion: 'create-task',
    });
  }
  return issues;
}

export async function* suggestFollowUp(
  thread: MockMailThread,
  lastOutgoingSnippet: string,
  opts: MockAiOptions = {},
): AsyncIterable<string> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  const text = `Hi —\n\nCircling back on the note below. No rush, just wanted to bring it back to the top of your inbox in case it slipped through.\n\nQuick recap: ${lastOutgoingSnippet.slice(0, 120)}.\n\nHappy to take this off your plate if it's no longer relevant — just let me know either way.\n\nBest,\nYou`;
  yield* streamString(text, opts.signal);
}

export interface MockSearchFilters {
  text?: string;
  from?: string;
  to?: string;
  hasAttachment?: boolean;
  before?: number;
  after?: number;
  label?: string;
  category?: 'important' | 'updates' | 'promos' | 'calendar';
}

export async function parseSearchQuery(
  query: string,
  opts: MockAiOptions = {},
): Promise<MockSearchFilters> {
  const { failureRate, minLatencyMs } = { ..._settings, ...opts };
  await delay(rand(Math.min(80, minLatencyMs), 200), opts.signal);
  maybeFail(failureRate * 0.3);

  const out: MockSearchFilters = {};
  let remaining = query.trim();

  // Operators first
  const ops: [RegExp, (m: RegExpMatchArray) => void][] = [
    [/from:([^\s]+)/i, (m) => { out.from = m[1]; }],
    [/to:([^\s]+)/i, (m) => { out.to = m[1]; }],
    [/has:attachment/i, () => { out.hasAttachment = true; }],
    [/label:([^\s]+)/i, (m) => { out.label = m[1]; }],
  ];
  for (const [re, set] of ops) {
    const m = remaining.match(re);
    if (m) { set(m); remaining = remaining.replace(m[0], '').trim(); }
  }

  // NL phrases
  const fromMatch = remaining.match(/\bfrom\s+([A-Z][a-zA-Z]+)/);
  if (fromMatch && !out.from) { out.from = fromMatch[1]; remaining = remaining.replace(fromMatch[0], '').trim(); }

  if (/with attachments?/i.test(remaining)) { out.hasAttachment = true; remaining = remaining.replace(/with attachments?/i, '').trim(); }

  if (/last (week|month|year)/i.test(remaining)) {
    const m = remaining.match(/last (week|month|year)/i)!;
    const now = Date.now();
    const dur = m[1] === 'week' ? 7 * 86_400_000 : m[1] === 'month' ? 30 * 86_400_000 : 365 * 86_400_000;
    out.after = now - dur;
    remaining = remaining.replace(m[0], '').trim();
  }
  if (/this (week|month|year)/i.test(remaining)) {
    const m = remaining.match(/this (week|month|year)/i)!;
    const now = Date.now();
    const dur = m[1] === 'week' ? 7 * 86_400_000 : m[1] === 'month' ? 30 * 86_400_000 : 365 * 86_400_000;
    out.after = now - dur;
    remaining = remaining.replace(m[0], '').trim();
  }

  if (/newsletter|promo|promotion/i.test(remaining)) { out.category = remaining.match(/newsletter/i) ? 'updates' : 'promos'; }
  if (/important/i.test(remaining)) out.category = 'important';

  if (remaining) out.text = remaining;
  return out;
}

export async function populateMailSmartView(
  definition: string,
  emails: MockMailEmail[],
  opts: MockAiOptions = {},
): Promise<string[]> {
  const { failureRate, minLatencyMs, maxLatencyMs } = { ..._settings, ...opts };
  await delay(rand(minLatencyMs, maxLatencyMs), opts.signal);
  maybeFail(failureRate);

  const tokens = definition.toLowerCase().split(/\s+/).filter((w) => w.length >= 3);
  const scored = emails.map((e) => {
    const hay = `${e.subject} ${e.snippet} ${e.fromName} ${e.fromEmail} ${e.labels.join(' ')}`.toLowerCase();
    const score = tokens.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
    return { id: e.id, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 25)
    .map((s) => s.id);
}

export async function suggestMailFilter(
  pattern: { from?: string; subject?: string; behavior: 'label' | 'archive' | 'star' | 'category'; targetLabel?: string; targetCategory?: 'important' | 'updates' | 'promos' | 'calendar' },
  opts: MockAiOptions = {},
): Promise<{ message: string; rule: { from?: string; subject?: string; action: string } }> {
  const { failureRate, minLatencyMs } = { ..._settings, ...opts };
  await delay(rand(Math.min(80, minLatencyMs), 200), opts.signal);
  maybeFail(failureRate);

  const target = pattern.targetLabel ?? pattern.targetCategory ?? 'archive';
  const message = `Always ${pattern.behavior === 'label' ? `label as "${target}"` : pattern.behavior === 'category' ? `categorize as "${target}"` : pattern.behavior} emails ${
    pattern.from ? `from ${pattern.from}` : pattern.subject ? `with subject containing "${pattern.subject}"` : ''
  }?`;
  return {
    message,
    rule: {
      from: pattern.from,
      subject: pattern.subject,
      action: pattern.behavior + (target ? `:${target}` : ''),
    },
  };
}

export async function analyzeMailTone(
  email: MockMailEmail,
  opts: MockAiOptions = {},
): Promise<{ tone: 'urgent' | 'frustrated' | 'casual' | 'formal' | 'friendly' | 'neutral'; confidence: number } | null> {
  const { failureRate, minLatencyMs } = { ..._settings, ...opts };
  await delay(rand(Math.min(80, minLatencyMs), 180), opts.signal);
  if (Math.random() < failureRate * 0.2) return null;

  const text = `${email.subject} ${email.snippet}`.toLowerCase();
  if (/\basap|urgent|right away|immediately\b/.test(text)) return { tone: 'urgent', confidence: 0.86 };
  if (/!{2,}|why isn|still waiting|disappointed|frustrat/.test(text)) return { tone: 'frustrated', confidence: 0.78 };
  if (/\bhey\b|cheers|thx|lol/.test(text)) return { tone: 'casual', confidence: 0.7 };
  if (/\bregards|sincerely|kindly\b/.test(text)) return { tone: 'formal', confidence: 0.68 };
  if (/\bthanks|appreciate|happy to\b/.test(text)) return { tone: 'friendly', confidence: 0.6 };
  return { tone: 'neutral', confidence: 0.55 };
}

