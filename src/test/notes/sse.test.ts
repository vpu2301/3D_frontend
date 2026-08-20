/**
 * A2 — the SSE parser, against the wire shapes that actually break parsers.
 *
 * Every case here is a bug someone has shipped: a frame cut across a read, a
 * multi-line `data:` glued into one paragraph, a heartbeat parsed as an empty
 * answer, a truncated tail applied as though it were complete.
 */

import { describe, expect, it } from 'vitest';
import { sseFrames, sseJsonFrames } from '@/pages/notes/_lib/sse';

/** A body that delivers exactly the given chunks, boundaries and all. */
function bodyOf(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

async function collect<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const item of iterable) out.push(item);
  return out;
}

describe('frame boundaries', () => {
  it('reassembles a frame split across two reads', async () => {
    const frames = await collect(
      sseFrames(bodyOf(['event: chunk\ndata: {"chunk":"split', ' me"}\n\n'])),
    );
    expect(frames).toEqual([{ event: 'chunk', data: '{"chunk":"split me"}' }]);
  });

  it('handles a boundary that itself straddles a read', async () => {
    // The `\n\n` arrives as two separate reads — the case a naive
    // `chunk.includes('\n\n')` misses entirely.
    const frames = await collect(
      sseFrames(bodyOf(['event: a\ndata: 1\n', '\nevent: b\ndata: 2\n\n'])),
    );
    expect(frames.map((f) => f.event)).toEqual(['a', 'b']);
  });

  it('reads several frames delivered in one chunk', async () => {
    const frames = await collect(
      sseFrames(bodyOf(['event: a\ndata: 1\n\nevent: b\ndata: 2\n\nevent: c\ndata: 3\n\n'])),
    );
    expect(frames.map((f) => f.data)).toEqual(['1', '2', '3']);
  });

  it('accepts CRLF frame separators', async () => {
    const frames = await collect(sseFrames(bodyOf(['event: a\r\ndata: 1\r\n\r\n'])));
    expect(frames).toEqual([{ event: 'a', data: '1' }]);
  });

  it('splits a multi-byte character across a read without corrupting it', async () => {
    // “ü” is two bytes in UTF-8; a decoder without `{stream: true}` yields two
    // replacement characters here, which is how a German answer gets mangled.
    const encoder = new TextEncoder();
    const bytes = encoder.encode('event: chunk\ndata: {"chunk":"Fristverlängerung"}\n\n');
    const cut = bytes.indexOf(0xc3); // the first byte of “ä”
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(bytes.slice(0, cut + 1));
        controller.enqueue(bytes.slice(cut + 1));
        controller.close();
      },
    });

    const frames = await collect(sseFrames(body));
    expect(JSON.parse(frames[0].data).chunk).toBe('Fristverlängerung');
  });
});

describe('frame grammar', () => {
  it('joins repeated data lines with a newline, not by concatenation', async () => {
    // Gluing these together deletes the paragraph break from every long answer.
    const frames = await collect(
      sseFrames(bodyOf(['event: chunk\ndata: first\ndata: second\n\n'])),
    );
    expect(frames[0].data).toBe('first\nsecond');
  });

  it('skips heartbeat comments without emitting an empty frame', async () => {
    const frames = await collect(
      sseFrames(bodyOf([': keep-alive\n\n', 'event: chunk\ndata: 1\n\n', ': ping\n\n'])),
    );
    expect(frames).toEqual([{ event: 'chunk', data: '1' }]);
  });

  it('defaults the event name to message when the server omits it', async () => {
    const frames = await collect(sseFrames(bodyOf(['data: 1\n\n'])));
    expect(frames[0].event).toBe('message');
  });

  it('strips exactly one leading space from a value', async () => {
    // `data:  x` means the value is " x" — the second space is content.
    const frames = await collect(sseFrames(bodyOf(['data:  x\n\n'])));
    expect(frames[0].data).toBe(' x');
  });

  it('drops a trailing partial frame when the body closes mid-frame', async () => {
    // Acting on half a payload is worse than losing it: the caller already
    // treats a stream that ends without `done` as incomplete.
    const frames = await collect(
      sseFrames(bodyOf(['event: chunk\ndata: 1\n\n', 'event: chunk\ndata: {"chunk":"trunc'])),
    );
    expect(frames).toEqual([{ event: 'chunk', data: '1' }]);
  });
});

describe('sseJsonFrames', () => {
  it('skips a malformed frame rather than discarding the stream', async () => {
    const frames = await collect(
      sseJsonFrames(
        bodyOf(['event: chunk\ndata: {"chunk":"a"}\n\n', 'event: chunk\ndata: not json\n\n', 'event: chunk\ndata: {"chunk":"b"}\n\n']),
      ),
    );
    expect(frames.map((f) => f.data.chunk)).toEqual(['a', 'b']);
  });
});

describe('cancellation', () => {
  it('cancels the underlying reader when the consumer breaks out early', async () => {
    // This is what tells the server to stop the provider stream; without it an
    // abandoned answer keeps billing the tenant.
    let cancelled = false;
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('event: a\ndata: 1\n\n'));
        controller.enqueue(encoder.encode('event: b\ndata: 2\n\n'));
      },
      cancel() {
        cancelled = true;
      },
    });

    for await (const _frame of sseFrames(body)) {
      void _frame;
      break;
    }

    expect(cancelled).toBe(true);
  });
});
