/**
 * The one SSE reader in /notes (FE-5 §2).
 *
 * `EventSource` is not an option and this is not a preference: it cannot POST,
 * so the question would have to go in a query string; it cannot set an
 * `Authorization` header, so it cannot reach an authenticated endpoint; and it
 * reconnects on its own, which for a generated answer means a second, different
 * answer resumed from context the user never saw. `fetch` + a manual reader
 * gives up nothing and keeps abort honest.
 *
 * Every streaming call in the module — answers, agent turns, extraction progress
 * — comes through `sseFrames`. A CI gate (`aiGates.test.ts`) asserts that no
 * other file under `src/pages/notes` calls `.getReader()`, because the failure
 * mode of a second parser is not a crash: it is one surface that mishandles a
 * frame split across a read boundary and shows half a citation id.
 */

export interface SseFrame {
  /** The `event:` field, or `message` when the server omits it (SSE default). */
  event: string;
  /** The `data:` field, with multi-line payloads rejoined on `\n`. */
  data: string;
}

/**
 * Decodes one frame at a time from a `text/event-stream` body.
 *
 * The buffer is carried across `read()` calls because a frame is delimited by a
 * blank line and the network has no obligation to align its chunks to that. The
 * classic symptom of getting this wrong is a citation chip rendering half an id.
 */
export async function* sseFrames(body: ReadableStream<Uint8Array>): AsyncIterable<SseFrame> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary = indexOfBoundary(buffer);
      while (boundary) {
        const raw = buffer.slice(0, boundary.at);
        buffer = buffer.slice(boundary.at + boundary.length);
        boundary = indexOfBoundary(buffer);

        const frame = parseFrame(raw);
        if (frame) yield frame;
      }
    }
    // Anything still buffered when the body closes is a frame the server never
    // terminated — a truncated write, or a connection cut mid-frame. Parsing it
    // would mean acting on half a payload, so it is dropped. The caller already
    // treats a stream that ends without `done` as incomplete.
  } finally {
    // Abort, `break`, or a throw downstream: cancel so the server sees the
    // disconnect and stops the provider stream instead of billing a full answer
    // nobody is reading.
    await reader.cancel().catch(() => {});
  }
}

/**
 * Frames are separated by a blank line. Servers differ on line endings, and a
 * proxy can rewrite them, so `\r\n\r\n` counts too — treating it as no boundary
 * would stall the stream until close and then drop everything as truncated.
 */
function indexOfBoundary(buffer: string): { at: number; length: number } | null {
  let best: { at: number; length: number } | null = null;
  for (const [separator, length] of [
    ['\n\n', 2],
    ['\r\n\r\n', 4],
    ['\r\r', 2],
  ] as const) {
    const at = buffer.indexOf(separator);
    if (at !== -1 && (!best || at < best.at)) best = { at, length };
  }
  return best;
}

/**
 * Per the SSE grammar: `field: value`, a single optional leading space in the
 * value, `:` alone starts a comment, and repeated `data:` lines are joined with
 * a newline rather than concatenated. That last one is not pedantry — a model
 * answer containing a blank line arrives as several `data:` lines, and gluing
 * them together silently deletes the paragraph breaks from every long answer.
 */
function parseFrame(raw: string): SseFrame | null {
  let event = 'message';
  const dataLines: string[] = [];

  for (const line of raw.split(/\r\n|\r|\n/)) {
    // Comment line. Heartbeats (`: keep-alive`) arrive as these and exist to
    // hold the connection open through a proxy idle timeout; they are not data.
    if (line.startsWith(':')) continue;

    const colon = line.indexOf(':');
    const field = colon === -1 ? line : line.slice(0, colon);
    // A field with no colon is legal and carries an empty value.
    let value = colon === -1 ? '' : line.slice(colon + 1);
    if (value.startsWith(' ')) value = value.slice(1);

    if (field === 'event') event = value;
    else if (field === 'data') dataLines.push(value);
  }

  // A frame of only comments (a heartbeat) has nothing to deliver.
  if (dataLines.length === 0) return null;
  return { event, data: dataLines.join('\n') };
}

/**
 * The JSON-payload form every /notes endpoint uses. A frame whose data is not
 * valid JSON is skipped rather than thrown: one malformed frame should not
 * discard an answer that is otherwise arriving correctly.
 */
export async function* sseJsonFrames(
  body: ReadableStream<Uint8Array>,
): AsyncIterable<{ event: string; data: Record<string, unknown> }> {
  for await (const frame of sseFrames(body)) {
    let data: unknown;
    try {
      data = JSON.parse(frame.data);
    } catch {
      continue;
    }
    if (data && typeof data === 'object') {
      yield { event: frame.event, data: data as Record<string, unknown> };
    }
  }
}
