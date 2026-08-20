/**
 * Photos — product-photo similarity search (memento's CLIP index).
 * DEMO, badged: `search_products_by_image` takes an image payload the browser
 * can't deliver without a REST proxy. The flow is clickable end to end so the
 * console is designed and testable.
 */
import { useRef, useState } from 'react';
import { Image, Upload, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MockedRouteBanner } from '@/components/voice/MockedBadge';

const DEMO_RESULTS = [
  { file: 'product_photos/chair-01.jpg', distance: 0.12 },
  { file: 'product_photos/chair-04.jpg', distance: 0.19 },
  { file: 'product_photos/stool-02.jpg', distance: 0.31 },
  { file: 'product_photos/armchair-07.jpg', distance: 0.38 },
];

export default function BrainPhotosView() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    setSearched(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <MockedRouteBanner reason="search_products_by_image needs an image payload the browser can't send without a REST proxy for the MCP tool — results below are demo. The CLIP index itself is real: photos dropped into product_photos/ are embedded automatically." />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="border-b border-[var(--line-soft)] px-6 pb-5 pt-5">
          <p className="plat-crumb mb-1.5 text-[12px] text-[var(--text-4)]">3days.company</p>
          <h1 className="text-[26px] leading-tight text-[var(--ink)]">Photos</h1>
          <p className="mt-1 text-[13px] text-[var(--text-4)]">
            Find products by image similarity — CLIP index over product_photos/
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-wrap items-start gap-6">
            {/* Query image */}
            <div className="w-64">
              <p className="plat-eyebrow mb-2">Query image</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="query" className="w-64 rounded-[12px] border border-[var(--line)] object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPreview(null); setSearched(false); }}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-[var(--text-3)] shadow hover:text-[var(--ink)]"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-40 w-64 flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-[var(--line)] text-[var(--text-4)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">Drop or pick an image</span>
                </button>
              )}
              <button
                type="button"
                disabled={!preview}
                onClick={() => setSearched(true)}
                className="plat-btn mt-3 h-9 w-full justify-center disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
              >
                <Image className="h-3.5 w-3.5" />
                Find similar products
              </button>
            </div>

            {/* Results */}
            <div className="min-w-[280px] flex-1">
              <p className="plat-eyebrow mb-2">
                Matches {searched ? `(${DEMO_RESULTS.length})` : ''}
              </p>
              {!searched ? (
                <p className="mt-8 text-xs text-[var(--text-4)]">Pick a query image and run the search.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {DEMO_RESULTS.map((r) => (
                    <Card key={r.file} className="overflow-hidden rounded-[12px] border-[var(--line-soft)] bg-white shadow-none">
                      <div className="flex h-28 items-center justify-center bg-[var(--sand)]">
                        <Image className="h-8 w-8 text-[var(--text-5)]" />
                      </div>
                      <div className="px-2.5 py-2" style={{ fontFamily: 'var(--mono)' }}>
                        <p className="truncate text-[10px] text-[var(--text-2)]">{r.file.replace('product_photos/', '')}</p>
                        <p className="text-[10px] text-[var(--text-4)]">d = {r.distance.toFixed(2)}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
