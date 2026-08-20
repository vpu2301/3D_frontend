/**
 * The app's "…" menu. Rendered in place rather than through a portal, so it
 * survives a detail view popped out into a second browser tab.
 *
 * `direction="up"` is for menus anchored at the foot of a scrolling rail,
 * which have nowhere to open downwards.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PlatMenuItem {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** Right-hand note: "real", "demo", a shortcut. */
  hint?: ReactNode;
  /** Shows a check and marks the row as the current choice. */
  selected?: boolean;
  disabled?: boolean;
  danger?: boolean;
  onSelect: () => void;
}

export interface PlatMenuSection {
  /** Section heading; omit for an unlabelled group. */
  label?: string;
  items: PlatMenuItem[];
}

export default function PlatMenu({
  sections,
  ariaLabel,
  direction = 'down',
  align = 'end',
  footer,
  trigger,
}: {
  sections: PlatMenuSection[];
  ariaLabel: string;
  direction?: 'up' | 'down';
  align?: 'start' | 'end';
  /** Small print under the items, e.g. what is still demo-only. */
  footer?: ReactNode;
  /** Custom trigger content; defaults to the three dots. */
  trigger?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!open || !el) return;
    const doc = el.ownerDocument;
    const onDown = (e: Event) => {
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      // Stopped so a menu inside a dialog closes itself, not the dialog.
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    };
    doc.addEventListener('pointerdown', onDown, true);
    doc.addEventListener('keydown', onKey, true);
    return () => {
      doc.removeEventListener('pointerdown', onDown, true);
      doc.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  return (
    <div className="plat-menu" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center justify-center rounded-[8px] text-[var(--text-4)] transition-colors hover:bg-[var(--sand)] hover:text-[var(--ink)]',
          trigger ? 'gap-1.5 px-2 py-1 text-[11px] font-medium' : 'h-6 w-6',
          open && 'bg-[var(--sand)] text-[var(--ink)]',
        )}
      >
        {trigger ?? <MoreVertical className="h-3.5 w-3.5" />}
      </button>

      {open && (
        <div
          role="menu"
          data-direction={direction}
          className={cn(
            'plat-menu-panel',
            direction === 'up' && 'plat-menu-up',
            align === 'start' && 'plat-menu-start',
          )}
        >
          {sections.map((section, si) => (
            <div key={section.label ?? si} className={si ? 'mt-1 border-t border-[var(--line-soft)] pt-1' : undefined}>
              {section.label && <p className="plat-menu-label">{section.label}</p>}
              {section.items.map(({ key, label, icon: Icon, hint, selected, disabled, danger, onSelect }) => (
                <button
                  key={key}
                  type="button"
                  role="menuitem"
                  disabled={disabled}
                  onClick={() => {
                    onSelect();
                    setOpen(false);
                  }}
                  className={cn('plat-menu-item', danger && 'text-[var(--bad-fg)]')}
                >
                  {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                  <span className="flex-1 text-left">{label}</span>
                  {selected && <span className="text-[11px] text-[var(--ink)]">✓</span>}
                  {hint && <span className="plat-menu-hint">{hint}</span>}
                </button>
              ))}
            </div>
          ))}
          {footer && (
            <p className="mt-1 border-t border-[var(--line-soft)] px-2.5 pb-1 pt-2 text-[10px] leading-relaxed text-[var(--text-5)]">
              {footer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
