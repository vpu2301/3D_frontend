/**
 * The address someone types has to become an address `fetch()` can parse.
 * A missing scheme used to fail inside the engine — "The string did not match
 * the expected pattern." — with nothing on screen saying which URL was wrong.
 */
import { describe, it, expect } from 'vitest';
import { normalizeApiUrl } from '@/lib/pincerClient';

describe('api url normalisation', () => {
  it('leaves a real URL alone, minus trailing slashes', () => {
    expect(normalizeApiUrl('https://api.pincer.sh/')).toBe('https://api.pincer.sh');
    expect(normalizeApiUrl('http://localhost:8080//')).toBe('http://localhost:8080');
  });

  it('assumes http for loopback and bare IPs — that is what dev servers are', () => {
    expect(normalizeApiUrl('127.0.0.1:8080')).toBe('http://127.0.0.1:8080');
    expect(normalizeApiUrl('localhost:3000')).toBe('http://localhost:3000');
    expect(normalizeApiUrl(' 192.168.1.24:8080 ')).toBe('http://192.168.1.24:8080');
  });

  it('assumes https for a hostname — tunnels and deployments are', () => {
    expect(normalizeApiUrl('cytoclastic-antonietta.ngrok-free.dev')).toBe(
      'https://cytoclastic-antonietta.ngrok-free.dev',
    );
  });

  it('does not rewrite a scheme it was given', () => {
    expect(normalizeApiUrl('ftp://example.com')).toBe('ftp://example.com');
  });

  it('every normalised address parses', () => {
    for (const input of ['127.0.0.1:8080', 'localhost:3000', 'example.com/api', 'https://x.dev']) {
      expect(() => new URL(normalizeApiUrl(input))).not.toThrow();
    }
  });
});
