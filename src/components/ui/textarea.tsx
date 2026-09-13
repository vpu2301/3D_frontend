import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "plat-field flex min-h-[80px] w-full px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export interface AutoTextareaProps extends TextareaProps {
  /** Height it never shrinks below. */
  minRows?: number
  /** Height it stops growing at — after that the field scrolls. */
  maxRows?: number
  /** A hard ceiling in pixels, whichever comes first (e.g. half the viewport). */
  maxHeightPx?: number
}

/**
 * A textarea that sizes itself to what has been typed, and can still be
 * dragged to any height by its corner.
 *
 * The two have to cooperate: once someone sets a height by hand, auto-sizing
 * stops fighting them for the rest of the session. A resize observer is what
 * tells the two apart — a height we did not set is a height a person set.
 */
const AutoTextarea = React.forwardRef<HTMLTextAreaElement, AutoTextareaProps>(
  ({ className, minRows = 3, maxRows = 16, maxHeightPx, onChange, ...props }, forwardedRef) => {
    const inner = React.useRef<HTMLTextAreaElement | null>(null)
    const manual = React.useRef(false)
    /** The last height we applied, so the observer can recognise its own work. */
    const applied = React.useRef<number | null>(null)

    const setRefs = React.useCallback(
      (el: HTMLTextAreaElement | null) => {
        inner.current = el
        if (typeof forwardedRef === "function") forwardedRef(el)
        else if (forwardedRef) forwardedRef.current = el
      },
      [forwardedRef]
    )

    const fit = React.useCallback(() => {
      const el = inner.current
      if (!el || manual.current) return

      const cs = getComputedStyle(el)
      // Computed styles are not always a number of pixels — an unset border
      // reads as "medium" — and one NaN would poison the whole height.
      const px = (v: string) => {
        const n = parseFloat(v)
        return Number.isFinite(n) ? n : 0
      }
      const line = px(cs.lineHeight) || 20
      const borders = px(cs.borderTopWidth) + px(cs.borderBottomWidth)
      const chrome = px(cs.paddingTop) + px(cs.paddingBottom) + borders
      const min = line * minRows + chrome
      const max = Math.min(line * maxRows + chrome, maxHeightPx ?? Infinity)

      el.style.height = "auto"
      const wanted = el.scrollHeight + borders
      const next = Math.round(Math.min(max, Math.max(min, wanted)))
      el.style.height = `${next}px`
      // Only scroll once it has stopped growing.
      el.style.overflowY = wanted > max ? "auto" : "hidden"
      applied.current = next
    }, [minRows, maxRows, maxHeightPx])

    // Re-fit on mount and whenever the value changes from outside.
    React.useLayoutEffect(fit, [fit, props.value])

    React.useEffect(() => {
      const el = inner.current
      const RO = el?.ownerDocument.defaultView?.ResizeObserver
      if (!el || !RO) return
      const ro = new RO(() => {
        if (manual.current || applied.current == null) return
        // A height we did not apply is a drag: hand the field over.
        if (Math.abs(el.offsetHeight - applied.current) > 2) {
          manual.current = true
          el.style.overflowY = "auto"
        }
      })
      ro.observe(el)
      return () => ro.disconnect()
    }, [])

    return (
      <div className="relative">
        <textarea
          {...props}
          ref={setRefs}
          onChange={(e) => {
            onChange?.(e)
            fit()
          }}
          className={cn(
            "plat-field block w-full resize-y px-3 py-2 pb-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        />
        {/* The native grip is nearly invisible against the field; this says
            "you can drag me" without taking the pointer away from it. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[7px] right-[7px] opacity-40"
          style={{ color: "var(--text-5)" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M9 1 1 9M9 5l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    )
  }
)
AutoTextarea.displayName = "AutoTextarea"

export { Textarea, AutoTextarea }
