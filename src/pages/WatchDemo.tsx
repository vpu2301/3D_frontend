/**
 * Watch demo — a split screen that echoes the auth pages without copying them:
 * a full-height panel on the left, the words on the right.
 *
 * The panel runs a reel of twenty scenarios, one statement per slide,
 * Typeform-style: it advances on its own, and the reader can pause, step, or
 * jump straight to any scenario from the list below. Nothing has to buffer, so
 * the page has something to say the moment it loads.
 *
 * The page stops after the benefits on purpose: the marketing Footer already
 * closes every page with "Ready to reclaim your workweek?", so a second call to
 * action here read as a duplicate. Its two links live in the hero instead.
 */
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarCheck, Clock, Pause, Play, Users, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

/** How long each statement holds before the reel advances. */
const SLIDE_MS = 4200;

type Track = 'Getting started' | 'Customer service' | 'Sales' | 'Operations & data';

interface Scenario {
  track: Track;
  statement: string;
}

/** Twenty scenarios, five per track, each a moment rather than a feature. */
const SCENARIOS: Scenario[] = [
  { track: 'Getting started', statement: 'Monday, 08:00. The overnight queue is already cleared.' },
  { track: 'Getting started', statement: 'You hire an AI employee the way you brief a new colleague — in plain language.' },
  { track: 'Getting started', statement: 'Every action it takes is logged, costed, and reversible.' },
  { track: 'Getting started', statement: 'Approval rules decide what it may do alone, and what waits for you.' },
  { track: 'Getting started', statement: 'By Friday, the repetitive half of the week runs itself.' },

  { track: 'Customer service', statement: 'A customer writes at 02:14.' },
  { track: 'Customer service', statement: 'The reply lands in forty seconds — in their language.' },
  { track: 'Customer service', statement: 'Order status, refund policy, delivery window: answered from your own documents.' },
  { track: 'Customer service', statement: 'Anything it cannot settle alone is escalated with the full context attached.' },
  { track: 'Customer service', statement: 'Your team starts the day on exceptions, not on a backlog.' },

  { track: 'Sales', statement: 'A lead fills in the form. It is scored before the tab closes.' },
  { track: 'Sales', statement: 'The follow-up is written around what they actually asked for.' },
  { track: 'Sales', statement: 'A missed call is returned within the hour, with notes.' },
  { track: 'Sales', statement: 'The CRM is up to date without anyone opening it.' },
  { track: 'Sales', statement: 'Your calls begin with the research already done.' },

  { track: 'Operations & data', statement: 'A four-hundred-row export lands in the folder.' },
  { track: 'Operations & data', statement: 'Invoices are read, matched, and filed — including the scanned ones.' },
  { track: 'Operations & data', statement: 'The numbers are reconciled and the report writes itself.' },
  { track: 'Operations & data', statement: 'Trends are flagged before anyone thinks to look for them.' },
  { track: 'Operations & data', statement: "Monday's analysis is waiting on Sunday night." },
];

const TRACKS: Track[] = ['Getting started', 'Customer service', 'Sales', 'Operations & data'];

const BENEFITS = [
  { icon: Clock, title: 'Save 80% of Time', description: 'Automate repetitive tasks instantly' },
  { icon: Users, title: 'Scale Your Team', description: 'Add AI employees without overhead' },
  { icon: Zap, title: 'Instant Results', description: 'See improvements from day one' },
];

/** Times offered for a live demo, matching the /schedule-demo page. */
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

const WatchDemo = () => {
  const { toast } = useToast();
  const [slide, setSlide] = useState(0);

  // The right-hand column swaps between the pitch, the booking form and the
  // confirmation. The reel on the left keeps running through all three.
  const [view, setView] = useState<'intro' | 'form' | 'sent'>('intro');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', company: '', timeSlot: '', goals: '',
  });
  const setField = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Someone who asked the system to reduce motion should not be handed an
  // auto-advancing reel; they get the same statements, stepped by hand.
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [playing, setPlaying] = useState(!reducedMotion);

  const total = SCENARIOS.length;
  const current = SCENARIOS[slide];

  const go = useCallback((next: number) => setSlide((next + total) % total), [total]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setSlide((s) => (s + 1) % total), SLIDE_MS);
    return () => window.clearInterval(id);
  }, [playing, total]);

  return (
    <div className="bg-[color:var(--bg)]">
      {/* ── Split hero: the reel owns the whole left panel ── */}
      <section className="lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-4 lg:py-6 lg:pl-6">
          <div className="flex min-h-[440px] flex-col overflow-hidden rounded-[20px] bg-[color:var(--ink)] lg:min-h-[660px]">
            {/* Progress: one hairline segment per scenario */}
            <div className="flex gap-[3px] px-7 pt-6">
              {SCENARIOS.map((s, i) => (
                <span key={`${s.track}-${i}`} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/12">
                  <span
                    className="block h-full rounded-full bg-white/80 transition-[width] duration-500"
                    style={{ width: i <= slide ? '100%' : '0%' }}
                  />
                </span>
              ))}
            </div>

            {/* One statement at a time, filling the frame */}
            <div className="flex flex-1 flex-col justify-center px-7 py-10 lg:px-14">
              <p className="font-mono text-[11px] tracking-[0.18em] text-white/45">
                {String(slide + 1).padStart(2, '0')} / {total} · {current.track}
              </p>
              <p
                key={slide}
                className="mt-5 animate-fade-in text-[clamp(1.5rem,2.9vw,2.6rem)] font-semibold leading-[1.2] text-white"
              >
                {current.statement}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 border-t border-white/10 px-7 py-4">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? 'Pause the reel' : 'Play the reel'}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[color:var(--ink)] transition-transform hover:scale-105"
              >
                {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="ml-0.5 h-4 w-4" fill="currentColor" />}
              </button>
              <button
                type="button"
                onClick={() => go(slide - 1)}
                aria-label="Previous scenario"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white/70"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(slide + 1)}
                aria-label="Next scenario"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white/70"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
              <span className="ml-auto font-mono text-[12px] text-white/45">
                {total} scenarios
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center px-8 py-12 lg:px-14 lg:py-16">
          {view === 'intro' && (
            <>
              <p className="m-eyebrow">Watch the demo</p>
              <h1 className="mt-5 text-[clamp(2.2rem,3.6vw,3.2rem)] text-[color:var(--ink)]">
                3days.ai in action
              </h1>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-[color:var(--text-3)]">
                Twenty moments from an ordinary week, handled by AI employees while your team was
                doing something else.
              </p>

              {/* Group 1 — what you're watching. Blue chips: a filter, not an action. */}
              <div className="mt-8">
                <p className="m-eyebrow mb-3">Jump to a track</p>
                <div className="flex flex-wrap gap-2">
                  {TRACKS.map((track) => {
                    const first = SCENARIOS.findIndex((sc) => sc.track === track);
                    const active = current.track === track;
                    return (
                      <button
                        key={track}
                        type="button"
                        onClick={() => setSlide(first)}
                        aria-pressed={active}
                        className={`h-8 rounded-full border px-3.5 text-[13px] font-medium transition-colors ${
                          active
                            ? 'border-[color:var(--blue-200)] bg-[color:var(--blue-100)] text-[color:var(--blue-deep)]'
                            : 'border-[color:var(--line)] bg-transparent text-[color:var(--text-3)] hover:border-[color:var(--blue-200)] hover:text-[color:var(--blue-deep)]'
                        }`}
                      >
                        {track}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 2 — what you can do next. Solid ink: an action, not a filter. */}
              <div className="mt-9 border-t border-[color:var(--line-soft)] pt-7">
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/start-free-trial"
                    className="inline-flex h-12 items-center rounded-full bg-[color:var(--ink)] px-7 text-[15px] font-semibold text-white transition-opacity hover:opacity-85"
                  >
                    Start free trial
                  </Link>
                  <button
                    type="button"
                    onClick={() => setView('form')}
                    className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-[color:var(--ink)] px-7 text-[15px] font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--ink)] hover:text-white"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    Book a live demo
                  </button>
                </div>
              </div>
            </>
          )}

          {view === 'form' && (
            <>
              <button
                type="button"
                onClick={() => setView('intro')}
                className="mb-6 inline-flex items-center gap-1.5 self-start text-[13px] font-semibold text-[color:var(--text-3)] transition-colors hover:text-[color:var(--ink)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to the demo
              </button>

              <p className="m-eyebrow">Book a live demo</p>
              <h2 className="mt-4 text-[clamp(1.7rem,2.6vw,2.2rem)] text-[color:var(--ink)]">
                Thirty minutes, your use case
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--text-3)]">
                Video call, nothing to prepare, and a written proposal within 24 hours.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setView('sent');
                  toast({
                    title: 'Demo requested',
                    description: "We'll send a calendar invite and preparation materials.",
                  });
                }}
                className="mt-7 space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="wd-first" className="text-[13px] font-medium text-[color:var(--text-2)]">First name</Label>
                    <Input id="wd-first" required value={form.firstName} onChange={(e) => setField('firstName', e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="wd-last" className="text-[13px] font-medium text-[color:var(--text-2)]">Last name</Label>
                    <Input id="wd-last" required value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} className="h-11" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="wd-email" className="text-[13px] font-medium text-[color:var(--text-2)]">Work email</Label>
                  <Input id="wd-email" type="email" required placeholder="name@company.com" value={form.email} onChange={(e) => setField('email', e.target.value)} className="h-11" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="wd-company" className="text-[13px] font-medium text-[color:var(--text-2)]">Company</Label>
                    <Input id="wd-company" required value={form.company} onChange={(e) => setField('company', e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="wd-slot" className="text-[13px] font-medium text-[color:var(--text-2)]">Preferred time</Label>
                    <select
                      id="wd-slot"
                      required
                      value={form.timeSlot}
                      onChange={(e) => setField('timeSlot', e.target.value)}
                      className="plat-field h-11 w-full px-3 text-[14px]"
                    >
                      <option value="" disabled>Pick a slot</option>
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="wd-goals" className="text-[13px] font-medium text-[color:var(--text-2)]">What would you like to see?</Label>
                  <Textarea
                    id="wd-goals"
                    rows={3}
                    placeholder="The work you would hand over first."
                    value={form.goals}
                    onChange={(e) => setField('goals', e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-full bg-[color:var(--ink)] text-[15px] font-semibold text-white transition-opacity hover:opacity-85"
                >
                  Request my demo
                </button>
              </form>
            </>
          )}

          {view === 'sent' && (
            <div className="max-w-md">
              <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[color:var(--blue-100)]">
                <CalendarCheck className="h-5 w-5 text-[color:var(--blue)]" strokeWidth={1.75} />
              </span>
              <h2 className="mt-5 text-[clamp(1.7rem,2.6vw,2.2rem)] text-[color:var(--ink)]">
                Request received
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--text-3)]">
                Thanks{form.firstName ? `, ${form.firstName}` : ''} — we'll confirm{' '}
                {form.timeSlot ? `your ${form.timeSlot} slot` : 'a slot'} by email at{' '}
                <span className="font-semibold text-[color:var(--ink)]">{form.email}</span> and send
                the preparation notes with it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setView('intro')}
                  className="inline-flex h-12 items-center rounded-full bg-[color:var(--ink)] px-7 text-[15px] font-semibold text-white transition-opacity hover:opacity-85"
                >
                  Keep watching
                </button>
                <Link
                  to="/start-free-trial"
                  className="inline-flex h-12 items-center rounded-full border border-[color:var(--line)] px-7 text-[15px] font-semibold text-[color:var(--text-1)] transition-colors hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
                >
                  Start free trial
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Every scenario, grouped by track; click one to jump the reel ── */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="mb-6 flex items-baseline gap-3">
          <h2 className="text-[24px] text-[color:var(--ink)]">All scenarios</h2>
          <span className="text-[14px] text-[color:var(--text-4)]">{total} in four tracks</span>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
          {TRACKS.map((track) => (
            <div key={track}>
              <p className="m-eyebrow mb-3">{track}</p>
              <div className="overflow-hidden rounded-[14px] border border-[color:var(--line)] bg-[color:var(--paper)]">
                {SCENARIOS.map((scenario, i) =>
                  scenario.track !== track ? null : (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSlide(i)}
                      aria-pressed={i === slide}
                      className={`flex w-full items-start gap-3.5 border-b border-[color:var(--line-soft)] px-4 py-3 text-left transition-colors last:border-b-0 ${
                        i === slide ? 'bg-[color:var(--blue-100)]' : 'hover:bg-[color:var(--sand)]'
                      }`}
                    >
                      <span
                        className={`mt-[3px] font-mono text-[11px] ${
                          i === slide ? 'text-[color:var(--blue)]' : 'text-[color:var(--text-5)]'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[14.5px] leading-snug text-[color:var(--text-1)]">
                        {scenario.statement}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits: three hairline-separated columns, no boxes ── */}
      <section className="mx-auto max-w-6xl px-6 pb-20 lg:pb-28">
        <h2 className="mb-8 text-[24px] text-[color:var(--ink)]">Why choose 3days.ai?</h2>
        <div className="grid grid-cols-1 gap-y-8 border-t border-[color:var(--line)] pt-8 md:grid-cols-3 md:gap-x-10">
          {BENEFITS.map(({ icon: Icon, title, description }, i) => (
            <div key={title} className={i > 0 ? 'md:border-l md:border-[color:var(--line)] md:pl-10' : undefined}>
              <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[color:var(--sand-deep)]">
                <Icon className="h-5 w-5 text-[color:var(--ink)]" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 text-[18px] text-[color:var(--ink)]">{title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[color:var(--text-3)]">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WatchDemo;
