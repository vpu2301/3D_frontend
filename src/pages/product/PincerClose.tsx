import { Children, isValidElement, cloneElement, ReactNode, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  CircleAlert,
  FileSearch,
  ListChecks,
  Radar,
  ScrollText,
  Send,
  ShieldCheck,
} from 'lucide-react';

// Local stagger helper (design-polish pattern): one orchestrated page-load reveal.
function Stagger({
  children,
  step = 80,
  start = 0,
  className,
}: {
  children: ReactNode;
  step?: number;
  start?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        const el = child as ReactElement<{ className?: string; style?: React.CSSProperties }>;
        return cloneElement(el, {
          className: ['animate-slide-up', el.props.className].filter(Boolean).join(' '),
          style: {
            ...el.props.style,
            animationDelay: `${start + i * step}ms`,
            animationFillMode: 'both',
          },
        } as Partial<typeof el.props>);
      })}
    </div>
  );
}

const SURFACES = [
  {
    icon: Radar,
    title: 'Close Radar',
    body: 'One portfolio view of month-end readiness: every mandate, what is missing, the deadline and the risk — sorted so the fire is always on top.',
  },
  {
    icon: ListChecks,
    title: 'Review Queue',
    body: 'Every exception the agent prepares arrives as a case: problem, evidence, rule check and a proposed action with a confidence score. You decide.',
  },
  {
    icon: Send,
    title: 'Requests',
    body: 'Missing documents are bundled into one polite client request — e-mail, Teams, WhatsApp, Viber or portal. Nothing leaves without your approval.',
  },
  {
    icon: ScrollText,
    title: 'Audit Log',
    body: 'Append-only, immutable, exportable. Every decision carries the source, the rule, the model version and the approver — enough to reconstruct any case.',
  },
];

const STEPS = [
  {
    n: '01',
    icon: FileSearch,
    title: 'The agent detects & prepares',
    body: 'It watches bank feeds, invoices and the DMS, finds exceptions, gathers evidence and drafts the fix — rebooking, matching, accrual or client request.',
  },
  {
    n: '02',
    icon: ShieldCheck,
    title: 'You review on evidence',
    body: 'Each case shows its confidence score against an explicit threshold. High confidence is one click; below threshold demands your eyes first.',
  },
  {
    n: '03',
    icon: BadgeCheck,
    title: 'Everything lands in the log',
    body: 'Approve, edit or reject — the outcome is posted, counts update everywhere, and the audit trail records who decided what, and why.',
  },
];

export default function PincerClose() {
  return (
    <div className="bg-background">
      {/* ── Hero — asymmetric 7/5, mesh + grain, single staggered reveal ── */}
      <section className="mesh-warm grain relative overflow-hidden">
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-12 lg:py-36">
          <Stagger className="space-y-7 lg:col-span-7" step={80} start={120}>
            <span className="inline-block text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Pincer Close · for accounting teams
            </span>

            <h1 className="font-display text-5xl font-bold lowercase leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              the month-end close,
              <br />
              <span className="text-muted-foreground">without the chase</span>
            </h1>

            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
              An autonomous agent finds the exceptions, gathers the evidence and drafts
              every fix. Your accountants review, approve and stay in control — never
              a black box.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/login" className="standard-button">
                Open the workspace
              </Link>
              <a href="#how-it-works" className="standard-button variant-ghost">
                See how it works →
              </a>
            </div>
          </Stagger>

          {/* Right: overlapping case card, breaks the grid */}
          <div className="relative lg:col-span-5">
            <div className="shadow-layered border-crafted relative z-10 rounded-2xl bg-card p-6 lg:translate-x-8 lg:-rotate-1">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Review Queue · Müller Maschinenbau
                  </p>
                  <p className="pt-1 text-sm font-semibold text-foreground">
                    VAT mismatch · ER-2026-07-0117
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-semibold text-foreground">
                  <BadgeCheck aria-hidden className="h-3.5 w-3.5" /> 94%
                </span>
              </div>
              <div className="space-y-2.5 pt-4 text-sm text-muted-foreground">
                <p>Austrian supplier — §13b reverse charge applies</p>
                <p>Rule R-221 passed · VIES check confirmed</p>
                <p className="font-medium text-foreground">
                  → Rebook to 3123 (SKR04), 0% input VAT
                </p>
              </div>
              <div className="flex gap-2 pt-5">
                <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">
                  Approve
                </span>
                <span className="rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
                  Edit
                </span>
                <span className="rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
                  Reject
                </span>
              </div>
            </div>

            <div className="glass-strong absolute -left-6 -top-6 z-20 hidden rounded-xl px-4 py-3 lg:block">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">close time</p>
              <p className="font-display text-2xl font-bold text-foreground">−4 days</p>
            </div>

            <div className="glass-strong absolute -bottom-5 right-2 z-20 hidden rounded-xl px-4 py-3 lg:block">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CircleAlert aria-hidden className="h-3.5 w-3.5" />
                below 85% → human review
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
            How it works
          </span>
          <h2 className="pt-3 font-display text-3xl font-bold lowercase tracking-tight text-foreground sm:text-4xl">
            the agent prepares. the human decides.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="border-crafted rounded-2xl bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <s.icon aria-hidden className="h-5 w-5 text-foreground" />
                </span>
                <span className="font-display text-3xl font-bold text-border">{s.n}</span>
              </div>
              <h3 className="pt-5 text-base font-semibold text-foreground">{s.title}</h3>
              <p className="pt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Four surfaces — asymmetric 5/7 split ── */}
      <section className="mesh-warm relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-5">
            <span className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
              The operator surface
            </span>
            <h2 className="pt-3 font-display text-3xl font-bold lowercase tracking-tight text-foreground sm:text-4xl">
              four views.
              <br />
              zero black boxes.
            </h2>
            <p className="max-w-sm pt-4 text-base leading-relaxed text-muted-foreground">
              Built for reviewability: every agent action is inspectable, reversible
              and logged. Roles separate preparing from approving from sending —
              segregation of duties, rendered in the UI.
            </p>
            <p className="pt-6 text-sm text-muted-foreground">
              German · Ukrainian · English — fully localized, down to date and
              currency formats.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {SURFACES.map((f, i) => (
              <div
                key={f.title}
                className={`shadow-layered border-crafted rounded-2xl bg-card p-6 ${i % 2 === 1 ? 'lg:translate-y-6' : ''}`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <f.icon aria-hidden className="h-5 w-5 text-foreground" />
                </span>
                <h3 className="pt-4 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="pt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grain shadow-layered relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center lg:px-16">
          <h2 className="font-display text-3xl font-bold lowercase tracking-tight text-primary-foreground sm:text-4xl">
            close the books. keep the evidence.
          </h2>
          <p className="mx-auto max-w-md pt-4 text-base leading-relaxed text-primary-foreground/70">
            See Pincer Close on your own mandates — the agent starts finding
            exceptions on day one.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
            <Link
              to="/login"
              className="rounded-full bg-primary-foreground px-6 py-2.5 text-sm font-medium text-primary transition-opacity hover:opacity-90"
            >
              Open the workspace
            </Link>
            <Link
              to="/pricing"
              className="rounded-full border border-primary-foreground/30 px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
