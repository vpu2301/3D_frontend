/**
 * Where the decoded audio actually goes.
 *
 * Twilio sends 20 ms μ-law frames per track. Playing each one as it lands
 * would click on every network hiccup, so frames go into a jitter buffer
 * inside an AudioWorklet: the worklet runs on the audio thread and pulls
 * whatever is queued, which is the only place in a browser that a late frame
 * costs a skip rather than a stall of the whole graph.
 *
 * Two tracks, two worklets, one gain node each — muting the agent while the
 * caller keeps playing is then a gain change, not a re-plumb.
 */
import { MULAW_SAMPLE_RATE, decodeMulawBase64, peakLevel } from './mulaw';
import type { ListenTrack } from './listenClient';

/** How much audio to hold before starting playback, and at most. */
export const JITTER_MS = 300;
const MAX_BUFFER_MS = 1_000;

/**
 * The worklet, as source. Shipped as a Blob rather than a separate asset so
 * the feature stays one importable unit — worklets must be loaded from a URL,
 * and a build-time asset path is one more thing to get wrong per environment.
 */
const WORKLET_SOURCE = `
class JitterPlayer extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const opts = options.processorOptions || {};
    this.queue = [];
    this.queued = 0;
    this.playing = false;
    // Samples, not frames: the buffer is a duration, whatever the frame size.
    this.startAt = opts.startAt || 0;
    this.maxQueued = opts.maxQueued || 0;
    this.port.onmessage = (e) => {
      const data = e.data;
      if (data === 'flush') {
        this.queue = [];
        this.queued = 0;
        this.playing = false;
        return;
      }
      this.queue.push(data);
      this.queued += data.length;
      // Overflow drops the OLDEST audio: a listener who fell behind wants the
      // live call, not a growing backlog of what was said a second ago.
      while (this.queued > this.maxQueued && this.queue.length > 1) {
        this.queued -= this.queue.shift().length;
      }
      if (this.queued >= this.startAt) this.playing = true;
    };
  }

  process(_inputs, outputs) {
    const out = outputs[0][0];
    if (!out) return true;
    if (!this.playing) {
      out.fill(0);
      return true;
    }
    let written = 0;
    while (written < out.length && this.queue.length) {
      const head = this.queue[0];
      const take = Math.min(head.length, out.length - written);
      out.set(take === head.length ? head : head.subarray(0, take), written);
      written += take;
      this.queued -= take;
      if (take === head.length) this.queue.shift();
      else this.queue[0] = head.subarray(take);
    }
    if (written < out.length) {
      // Ran dry: play silence and re-buffer rather than stutter frame by frame.
      out.fill(0, written);
      this.playing = false;
    }
    return true;
  }
}
registerProcessor('jitter-player', JitterPlayer);
`;

export interface TrackLevels {
  inbound: number;
  outbound: number;
}

/**
 * One live listening session's audio graph. Every method is safe to call on a
 * browser without AudioWorklet support — the session then carries no audio and
 * the caller shows the error rather than half-playing.
 */
export class ListenAudio {
  private ctx: AudioContext | null = null;
  private nodes = new Map<ListenTrack, { node: AudioWorkletNode; gain: GainNode }>();
  private levels: TrackLevels = { inbound: 0, outbound: 0 };
  private muted: Record<ListenTrack, boolean> = { inbound: false, outbound: false };
  private masterMuted = false;

  get supported(): boolean {
    const Ctor = typeof window === 'undefined' ? undefined : window.AudioContext;
    return !!Ctor && 'audioWorklet' in Ctor.prototype;
  }

  /**
   * Must be called from the click that started listening: browsers only let an
   * AudioContext start from a user gesture, and this feature never auto-plays.
   */
  async start(): Promise<void> {
    if (this.ctx) return;
    const ctx = new AudioContext({ sampleRate: MULAW_SAMPLE_RATE });
    await ctx.audioWorklet.addModule(
      URL.createObjectURL(new Blob([WORKLET_SOURCE], { type: 'application/javascript' })),
    );
    // Safari hands back a suspended context even from a gesture.
    if (ctx.state === 'suspended') await ctx.resume();
    this.ctx = ctx;
  }

  private nodeFor(track: ListenTrack) {
    const ctx = this.ctx;
    if (!ctx) return null;
    const existing = this.nodes.get(track);
    if (existing) return existing;

    const node = new AudioWorkletNode(ctx, 'jitter-player', {
      numberOfInputs: 0,
      outputChannelCount: [1],
      processorOptions: {
        startAt: Math.round((JITTER_MS / 1000) * ctx.sampleRate),
        maxQueued: Math.round((MAX_BUFFER_MS / 1000) * ctx.sampleRate),
      },
    });
    const gain = ctx.createGain();
    node.connect(gain).connect(ctx.destination);
    const made = { node, gain };
    this.nodes.set(track, made);
    this.applyGain(track);
    return made;
  }

  /** One wire frame: decoded, metered, queued. */
  push(track: ListenTrack, payload: string): void {
    const samples = decodeMulawBase64(payload);
    this.levels[track] = peakLevel(samples);
    const made = this.nodeFor(track);
    made?.node.port.postMessage(samples);
  }

  /** Peak of the last frame per track, for the meters. */
  getLevels(): TrackLevels {
    return { ...this.levels };
  }

  private applyGain(track: ListenTrack) {
    const made = this.nodes.get(track);
    if (!made || !this.ctx) return;
    const on = !this.masterMuted && !this.muted[track];
    made.gain.gain.setValueAtTime(on ? 1 : 0, this.ctx.currentTime);
  }

  setTrackMuted(track: ListenTrack, muted: boolean): void {
    this.muted[track] = muted;
    this.applyGain(track);
  }

  isTrackMuted(track: ListenTrack): boolean {
    return this.muted[track];
  }

  setMasterMuted(muted: boolean): void {
    this.masterMuted = muted;
    for (const track of this.nodes.keys()) this.applyGain(track);
  }

  /** Tear the graph down. Nothing here is ever written to disk. */
  async stop(): Promise<void> {
    for (const { node, gain } of this.nodes.values()) {
      node.port.postMessage('flush');
      node.disconnect();
      gain.disconnect();
    }
    this.nodes.clear();
    this.levels = { inbound: 0, outbound: 0 };
    const ctx = this.ctx;
    this.ctx = null;
    if (ctx) await ctx.close().catch(() => undefined);
  }
}
