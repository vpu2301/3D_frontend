/**
 * μ-law → PCM, the one piece of audio maths this feature owns.
 *
 * Twilio's media frames are base64 G.711 μ-law at 8 kHz, one byte per sample.
 * μ-law is a logarithmic 8-bit encoding: sign bit, 3-bit exponent, 4-bit
 * mantissa, all stored inverted. Decoding it is exact and cheap, so the table
 * is built once from the definition rather than pasted in as 256 magic numbers
 * nobody can check.
 */

/** Signed 16-bit PCM for each of the 256 μ-law bytes. */
export const MULAW_TABLE: Int16Array = (() => {
  const table = new Int16Array(256);
  for (let byte = 0; byte < 256; byte++) {
    // Stored inverted on the wire.
    const value = ~byte & 0xff;
    const sign = value & 0x80;
    const exponent = (value >> 4) & 0x07;
    const mantissa = value & 0x0f;
    // The +33 bias is part of the G.711 definition; it is removed after the
    // shift, which is why it is added before it.
    let sample = ((mantissa << 3) + 0x84) << exponent;
    sample -= 0x84;
    table[byte] = sign ? -sample : sample;
  }
  return table;
})();

/** Full-scale for signed 16-bit, used to normalise into Float32 [-1, 1]. */
const FULL_SCALE = 32768;

/** One μ-law byte as a float sample. */
export const mulawToFloat = (byte: number): number => MULAW_TABLE[byte & 0xff] / FULL_SCALE;

/** A frame of μ-law bytes as Float32 PCM, ready for an audio graph. */
export function decodeMulaw(bytes: Uint8Array): Float32Array {
  const out = new Float32Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = MULAW_TABLE[bytes[i]] / FULL_SCALE;
  return out;
}

/**
 * base64 → bytes without a Buffer. `atob` is present in every browser this
 * app supports and in jsdom; a data-URL round trip would be slower per frame.
 */
export function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

/** Decode straight from the wire payload. */
export const decodeMulawBase64 = (payload: string): Float32Array =>
  decodeMulaw(base64ToBytes(payload));

/** Peak level of a frame, 0..1 — what a meter needs, without an analyser. */
export function peakLevel(samples: Float32Array): number {
  let peak = 0;
  for (const s of samples) {
    const abs = s < 0 ? -s : s;
    if (abs > peak) peak = abs;
  }
  return peak;
}

/** Twilio media is 8 kHz mono, both tracks. */
export const MULAW_SAMPLE_RATE = 8_000;
