/**
 * The composable half of the dashboard: a board of dashboards.
 *
 * Every panel in `widgets/registry` can be put on the page, taken off it, and
 * dragged into whatever order the person wants — from the gallery behind the
 * ＋ button onto the board, or from one slot to another. The order lives in
 * localStorage, so it is that browser's board and survives a reload.
 *
 * Drag and drop is the fast path, not the only one: every card can be moved
 * with the arrow keys from its handle, and every gallery entry adds on click.
 */
import { Fragment, useMemo, useRef, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Check, GripVertical, Plus, X } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { BOARD_MIME as MIME, useBoardLayout } from './useBoardLayout';
import { WIDGETS, WIDGET_BY_ID, type WidgetDef } from './widgets/registry';

// ── One card on the board ────────────────────────────────────────────

function WidgetFrame({
  widget,
  index,
  count,
  onRemove,
  onNudge,
  onDragStart,
  onDragEnd,
  onHover,
  dragging,
}: {
  widget: WidgetDef;
  index: number;
  count: number;
  onRemove: () => void;
  onNudge: (delta: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onHover: (at: number) => void;
  dragging: boolean;
}) {
  const Icon = widget.icon;
  const Body = widget.Body;

  return (
    <div
      className={`plat-panel plat-widget !p-0${widget.span === 2 ? ' lg:col-span-2' : ''}${
        dragging ? ' plat-widget-dragging' : ''
      }`}
      data-widget={widget.id}
      onDragOver={(e) => {
        e.preventDefault();
        const box = e.currentTarget.getBoundingClientRect();
        onHover(e.clientX > box.left + box.width / 2 ? index + 1 : index);
      }}
    >
      <div className="plat-widget-head">
        <button
          type="button"
          className="plat-widget-btn plat-widget-grab"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData(MIME, widget.id);
            e.dataTransfer.effectAllowed = 'move';
            onDragStart();
          }}
          onDragEnd={onDragEnd}
          onKeyDown={(e) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            e.preventDefault();
            onNudge(e.key === 'ArrowLeft' ? -1 : 1);
          }}
          aria-label={`Move ${widget.title} — position ${index + 1} of ${count}. Drag, or use the arrow keys.`}
        >
          <GripVertical className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <Icon className="h-4 w-4 shrink-0" style={{ color: 'var(--text-4)' }} />
        <p className="min-w-0 flex-1 truncate text-[13px] font-semibold">{widget.title}</p>
        <button
          type="button"
          className="plat-widget-btn"
          onClick={onRemove}
          aria-label={`Remove ${widget.title} from the dashboard`}
          title="Remove"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
      <div className="px-[18px] pb-5 pt-4">
        <Body />
      </div>
    </div>
  );
}

/** The gap that opens where the dragged card would land. */
function DropSlot() {
  return (
    <div className="plat-dropslot" aria-hidden="true" />
  );
}

// ── The picker behind ＋ ─────────────────────────────────────────────

/**
 * Every dashboard there is, in a modal. Nothing lands on the page until it is
 * picked here, and picking is live: a click puts the card on the board (or
 * takes it off again) behind the dialog.
 */
function WidgetPicker({
  open,
  onOpenChange,
  ids,
  onAdd,
  onRemove,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  ids: string[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="plat-detail-overlay" />
        <DialogPrimitive.Content className="plat plat-detail plat-picker" aria-describedby={undefined}>
          <header className="plat-detail-head">
            <div className="min-w-0">
              <DialogPrimitive.Title className="plat-crumb block truncate">
                3days.dashboards
              </DialogPrimitive.Title>
              <p className="mt-1 truncate text-sm" style={{ color: 'var(--text-4)' }}>
                Pick what belongs on your dashboard — arrange the cards by dragging them afterwards
              </p>
            </div>
            <div className="plat-detail-actions">
              <DialogPrimitive.Close className="plat-detail-close" aria-label="Close" title="Close">
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>
          </header>

          <div className="plat-detail-body">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {WIDGETS.map((w) => {
                const on = ids.includes(w.id);
                const Icon = w.icon;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => (on ? onRemove(w.id) : onAdd(w.id))}
                    className={`plat-pick${on ? ' plat-pick-on' : ''}`}
                    aria-pressed={on}
                    aria-label={on ? `Remove ${w.title} from the dashboard` : `Add ${w.title} to the dashboard`}
                  >
                    <span className="plat-pick-icon">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold">{w.title}</span>
                      <span className="block text-[11.5px]" style={{ color: 'var(--text-4)' }}>
                        {w.subtitle}
                      </span>
                    </span>
                    <span className="plat-pick-state" aria-hidden="true">
                      {on ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <footer className="plat-picker-foot">
            <span className="text-[11.5px]" style={{ color: 'var(--text-5)' }}>
              {ids.length ? `${ids.length} on the dashboard` : 'Nothing on the dashboard yet'}
            </span>
            <DialogPrimitive.Close className="plat-btn !h-9 !px-5 !text-xs">Done</DialogPrimitive.Close>
          </footer>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ── The board ────────────────────────────────────────────────────────

export function DashboardBoard() {
  const { ids, add, remove, place, nudge } = useBoardLayout();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);
  const zone = useRef<HTMLDivElement | null>(null);

  const widgets = useMemo(
    () => ids.map((id) => WIDGET_BY_ID.get(id)).filter((w): w is WidgetDef => !!w),
    [ids],
  );

  const finishDrag = () => {
    setDragId(null);
    setDropAt(null);
  };

  const handleDrop = (e: React.DragEvent, at?: number) => {
    const id = e.dataTransfer.getData(MIME) || dragId;
    if (!id) return finishDrag();
    e.preventDefault();
    place(id, at ?? dropAt ?? ids.length);
    finishDrag();
  };

  return (
    <section className="mb-10">
      <SectionHeader
        label="Dashboards"
        hint={ids.length ? 'drag to arrange' : undefined}
        action={
          <button
            type="button"
            className="plat-btn-ghost !h-8 !px-3 !text-xs"
            onClick={() => setPickerOpen(true)}
            aria-haspopup="dialog"
            aria-label="Add a dashboard"
          >
            <Plus className="h-3.5 w-3.5" />
            Add dashboard
          </button>
        }
      />

      <div
        ref={zone}
        className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2"
        onDragOver={(e) => {
          if (dragId || e.dataTransfer.types.includes(MIME)) e.preventDefault();
        }}
        onDragLeave={(e) => {
          if (!zone.current?.contains(e.relatedTarget as Node | null)) setDropAt(null);
        }}
        onDrop={(e) => handleDrop(e)}
      >
        {widgets.map((w, i) => (
          <Fragment key={w.id}>
            {dropAt === i && <DropSlot />}
            <WidgetFrame
              widget={w}
              index={i}
              count={widgets.length}
              dragging={dragId === w.id}
              onRemove={() => remove(w.id)}
              onNudge={(delta) => nudge(w.id, delta)}
              onDragStart={() => setDragId(w.id)}
              onDragEnd={finishDrag}
              onHover={setDropAt}
            />
          </Fragment>
        ))}
        {dropAt === widgets.length && <DropSlot />}

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          onDragOver={(e) => {
            e.preventDefault();
            setDropAt(widgets.length);
          }}
          onDrop={(e) => handleDrop(e, widgets.length)}
          className="plat-addtile"
          aria-haspopup="dialog"
          aria-label="Add or drop a dashboard at the end"
        >
          <Plus className="h-5 w-5" />
          <span className="text-[12px]">
            {widgets.length ? 'Add a dashboard' : 'Add your first dashboard — voice, calls, text, images…'}
          </span>
        </button>
      </div>

      <WidgetPicker open={pickerOpen} onOpenChange={setPickerOpen} ids={ids} onAdd={add} onRemove={remove} />
    </section>
  );
}

export default DashboardBoard;
