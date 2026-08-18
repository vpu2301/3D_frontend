import DOMPurify from 'dompurify';

export interface SanitizeOptions {
  /** When false, image src attributes are stripped (replaced with a placeholder data URI). */
  allowImages: boolean;
}

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="100%" height="100%" fill="#f1f3f4"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="11" fill="#5f6368">Image blocked</text></svg>',
  );

/**
 * Sanitize an HTML email body and (optionally) strip remote image URLs.
 * Returns sanitized HTML safe to inject into a sandboxed iframe.
 */
export function sanitizeEmailHtml(html: string, opts: SanitizeOptions): string {
  const cleaned = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'a', 'p', 'div', 'span', 'br', 'hr',
      'b', 'i', 'em', 'strong', 'u', 's', 'small', 'sub', 'sup', 'mark', 'code', 'pre',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'cite', 'q',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'col', 'colgroup',
      'img', 'figure', 'figcaption',
      'style',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'target', 'rel',
      'colspan', 'rowspan', 'align', 'valign', 'width', 'height',
      'style', 'class',
    ],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'link', 'meta'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover'],
    ALLOW_DATA_ATTR: false,
  });

  if (opts.allowImages) return cleaned;
  return blockExternalImages(cleaned);
}

function blockExternalImages(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    if (/src\s*=\s*["']data:/i.test(tag)) return tag;
    return tag.replace(/src\s*=\s*["'][^"']*["']/i, `src="${PLACEHOLDER}"`);
  });
}

/** Build the full HTML document for the iframe, with safe base styles. */
export function buildEmailDocument(sanitized: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<base target="_blank">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
         font-size: 14px; line-height: 1.55; color: #1f2937; padding: 16px; margin: 0; }
  a { color: #1a73e8; text-decoration: underline; }
  blockquote { border-left: 3px solid #dde9f4; padding-left: 12px; margin-left: 0;
               color: #5f6368; }
  pre, code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; }
  img { max-width: 100%; height: auto; }
  table { border-collapse: collapse; }
  table td, table th { padding: 4px 8px; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }
</style>
</head>
<body>${sanitized}</body>
</html>`;
}

/** Returns true if HTML contains any external (non-data:) image references. */
export function hasExternalImages(html: string): boolean {
  return /<img\b[^>]*\bsrc\s*=\s*["'](?!data:)/i.test(html);
}

/** Strip all HTML to plain text, preserving newlines. */
export function htmlToPlainText(html: string): string {
  const cleaned = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
  return cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
