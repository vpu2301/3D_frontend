import { useEffect, useMemo, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
import {
  sanitizeEmailHtml,
  buildEmailDocument,
  hasExternalImages,
} from '@/pages/mail/_lib/htmlSanitize';

interface Props {
  html?: string;
  plainText?: string;
  /** Show external images in this email (one-time toggle). */
  showImages: boolean;
  onShowImages: () => void;
}

export default function HtmlMessage({ html, plainText, showImages, onShowImages }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(120);

  const sanitized = useMemo(() => {
    if (!html) return '';
    return sanitizeEmailHtml(html, { allowImages: showImages });
  }, [html, showImages]);

  const hasBlockedImages = useMemo(() => (html ? !showImages && hasExternalImages(html) : false), [html, showImages]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = buildEmailDocument(sanitized || `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(plainText ?? '')}</pre>`);
    iframe.srcdoc = doc;

    const onLoad = () => {
      try {
        const docHeight = iframe.contentDocument?.body?.scrollHeight ?? 120;
        setHeight(Math.min(2000, docHeight + 16));
      } catch {
        /* cross-origin or sandbox-restricted; fall back */
      }
    };
    iframe.addEventListener('load', onLoad);
    return () => iframe.removeEventListener('load', onLoad);
  }, [sanitized, plainText]);

  if (!html && !plainText) {
    return <p className="px-1 py-2 text-sm text-gray-400 italic">No content.</p>;
  }

  return (
    <div className="overflow-hidden">
      {hasBlockedImages && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-[#f8fbff] px-3 py-1.5 text-xs text-gray-700">
          <span className="flex items-center gap-1.5">
            <ImageOff className="h-3.5 w-3.5 text-gray-500" />
            External images blocked for your privacy.
          </span>
          <button
            type="button"
            onClick={onShowImages}
            className="rounded-full border border-[#8fc4e4] bg-[#dde9f4] px-2 py-0.5 text-[11px] font-medium text-[#1a73e8] hover:bg-[#bdd8ec]"
          >
            Show images
          </button>
        </div>
      )}
      <iframe
        ref={iframeRef}
        sandbox="allow-popups allow-popups-to-escape-sandbox"
        title="Email content"
        style={{ width: '100%', height, border: 0 }}
      />
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
