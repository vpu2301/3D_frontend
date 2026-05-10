import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.2 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: '#F2EEE6', color: '#1A1715', fontFamily: '"Inter Tight", "Inter", system-ui, sans-serif' }}
    >

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1480, margin: '0 auto', padding: '96px 56px 24px' }}>
        <div
          className="inline-flex items-center gap-3.5"
          style={{
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#5A5550',
            padding: '8px 16px',
            border: '1px solid rgba(26,23,21,0.14)',
            borderRadius: 999,
          }}
        >
          <span
            className="animate-pulse"
            style={{ width: 7, height: 7, borderRadius: '50%', background: 'oklch(0.62 0.16 35)', flexShrink: 0, display: 'inline-block' }}
          />
          Built in Germany · EU-sovereign AI
        </div>

        <h1
          className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{
            fontSize: 'clamp(56px, 8.4vw, 132px)',
            fontWeight: 500,
            lineHeight: 0.94,
            letterSpacing: '-0.045em',
            margin: '28px 0 0',
            maxWidth: 1320,
          }}
        >
          Five days of work,<br />
          <span style={{ color: 'oklch(0.62 0.16 35)', fontWeight: 600 }}>done in under three.</span>
        </h1>

        <p
          className={`transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ fontSize: 22, lineHeight: 1.45, color: '#5A5550', maxWidth: 640, marginTop: 32, fontWeight: 400 }}
        >
          Give every employee their own team of digital coworkers. The repetitive work runs in the background — your people stay focused on what only they can do.
        </p>

        <div
          className={`flex flex-wrap gap-3.5 items-center transition-all duration-700 delay-150 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ marginTop: 40 }}
        >
          <Link
            to="/schedule-demo"
            className="inline-flex items-center gap-2.5 transition-all duration-150 hover:-translate-y-px"
            style={{
              padding: '12px 22px',
              fontSize: 15,
              fontWeight: 500,
              borderRadius: 999,
              border: '1px solid #1A1715',
              background: '#1A1715',
              color: '#F2EEE6',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'oklch(0.62 0.16 35)'; (e.currentTarget as HTMLElement).style.borderColor = 'oklch(0.62 0.16 35)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1A1715'; (e.currentTarget as HTMLElement).style.borderColor = '#1A1715'; }}
          >
            Book a demo <span>→</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2.5 transition-all duration-150"
            style={{
              padding: '12px 22px',
              fontSize: 15,
              fontWeight: 500,
              borderRadius: 999,
              border: '1px solid #1A1715',
              background: 'transparent',
              color: '#1A1715',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1A1715'; (e.currentTarget as HTMLElement).style.color = '#F2EEE6'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#1A1715'; }}
          >
            Talk to sales
          </Link>
        </div>

        <div
          className={`flex flex-wrap items-center gap-6 transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            marginTop: 28,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 12,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#5A5550',
          }}
        >
          <span>14h saved / user / week</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(26,23,21,0.14)', display: 'inline-block' }} />
          <span>626+ tools connected</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(26,23,21,0.14)', display: 'inline-block' }} />
          <span>6-week payback</span>
        </div>
      </section>

      {/* ── HERO VIDEO ── */}
      <div style={{ maxWidth: 1480, margin: '56px auto 0', padding: '0 56px' }}>
        <div
          style={{
            position: 'relative',
            aspectRatio: '16/9',
            width: '100%',
            borderRadius: 18,
            overflow: 'hidden',
            background: '#FBF8F2',
            boxShadow: '0 1px 0 rgba(26,23,21,0.04), 0 30px 60px -30px rgba(26,23,21,0.25), 0 8px 20px -10px rgba(26,23,21,0.12)',
            border: '1px solid rgba(26,23,21,0.08)',
          }}
        >
          <span
            className="inline-flex items-center gap-2"
            style={{
              position: 'absolute',
              left: 20,
              top: 20,
              zIndex: 4,
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#1A1715',
              background: 'rgba(251,248,242,0.86)',
              backdropFilter: 'blur(8px)',
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid rgba(26,23,21,0.08)',
            }}
          >
            <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.62 0.16 35)', display: 'inline-block' }} />
            Live demo
          </span>
          <iframe
            src="/promo.html"
            title="3Days.ai promo"
            loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, background: '#F2EEE6' }}
          />
        </div>
      </div>

      {/* ── LOGO STRIP ── */}
      <section style={{ maxWidth: 1480, margin: '0 auto', padding: '80px 56px 0' }}>
        <div
          style={{
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 11.5,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#5A5550',
            marginBottom: 24,
          }}
        >
          Trusted by Mittelstand teams across DACH
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 1,
            background: 'rgba(26,23,21,0.08)',
            borderTop: '1px solid rgba(26,23,21,0.08)',
            borderBottom: '1px solid rgba(26,23,21,0.08)',
          }}
        >
          {['Schneider AG', 'Müller GmbH', 'Hofmann & Co', 'Voigt Industrie', 'Becker Werke', 'Krämer Logistik'].map(name => (
            <div
              key={name}
              style={{
                background: '#F2EEE6',
                padding: '30px 16px',
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: '#5A5550',
                transition: 'color 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1A1715'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#5A5550'; }}
            >
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        ref={statsRef}
        style={{
          maxWidth: 1480,
          margin: '0 auto',
          padding: '120px 56px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 80,
          alignItems: 'end',
        }}
        className="max-md:!grid-cols-1 max-md:!gap-10"
      >
        <h2 style={{ fontSize: 56, fontWeight: 500, lineHeight: 1.0, letterSpacing: '-0.03em', margin: 0 }}>
          The numbers from <span style={{ color: 'oklch(0.62 0.16 35)', fontWeight: 600 }}>real teams.</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }} className="max-sm:!grid-cols-1">
          {[
            { num: '14', unit: 'h', label: 'recovered per user, every week — automatically.' },
            { num: '~3', unit: '×', label: 'FTE-equivalent capacity unlocked across a 40-person company.' },
            { num: '6', unit: 'wk', label: 'typical payback period — the agents pay for themselves before quarter-end.' },
          ].map(({ num, unit, label }) => (
            <div
              key={num}
              className={`transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ borderTop: '1px solid #1A1715', paddingTop: 24 }}
            >
              <div style={{ fontSize: 92, fontWeight: 600, lineHeight: 0.9, letterSpacing: '-0.045em', color: 'oklch(0.62 0.16 35)', fontVariantNumeric: 'tabular-nums' }}>
                {num}<span style={{ fontSize: '0.5em', color: '#1A1715', marginLeft: 4 }}>{unit}</span>
              </div>
              <div style={{ marginTop: 18, fontSize: 16, color: '#5A5550', lineHeight: 1.45 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ maxWidth: 1480, margin: '0 auto', padding: '160px 56px 0' }}>
        <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5A5550', borderTop: '1px solid #1A1715', paddingTop: 18 }}>
          01 / How it works
        </div>
        <h2 style={{ fontSize: 'clamp(48px, 5.5vw, 80px)', fontWeight: 500, lineHeight: 1.0, letterSpacing: '-0.035em', margin: '32px 0 0', maxWidth: 1100 }}>
          Hire a team of agents in <span style={{ color: 'oklch(0.62 0.16 35)', fontWeight: 600 }}>three days.</span>
        </h2>
        <div style={{ marginTop: 80, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 56 }} className="max-md:!grid-cols-1">
          {[
            {
              day: 'Day 01',
              title: 'Connect your stack.',
              desc: 'One click into 626+ tools — CRM, email, ERP, calendars, document stores. We map what your team already does.',
              glyph: (
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="20" cy="32" r="10" fill="#1A1715" />
                  <circle cx="44" cy="32" r="10" fill="none" stroke="#1A1715" strokeWidth="1.5" strokeDasharray="2 3" />
                </svg>
              ),
            },
            {
              day: 'Day 02',
              title: 'Train your coworkers.',
              desc: "Each agent learns from your real workflows — invoices, follow-ups, reports — under your team's supervision. No prompts to write.",
              glyph: (
                <svg width="84" height="64" viewBox="0 0 84 64">
                  <rect x="2" y="20" width="24" height="24" fill="#1A1715" />
                  <rect x="30" y="20" width="24" height="24" fill="none" stroke="#1A1715" strokeWidth="1.5" />
                  <rect x="58" y="20" width="24" height="24" fill="none" stroke="#1A1715" strokeWidth="1.5" />
                </svg>
              ),
            },
            {
              day: 'Day 03',
              title: 'Ship. Save 14h / week.',
              desc: 'Agents go live in production. Your people delegate the busywork and get their day back — by Friday lunch, the week is done.',
              glyph: (
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <path d="M8 32 L32 8 L56 32 L32 56 Z" fill="none" stroke="#1A1715" strokeWidth="1.5" />
                  <circle cx="32" cy="32" r="8" fill="oklch(0.62 0.16 35)" />
                </svg>
              ),
            },
          ].map(({ day, title, desc, glyph }) => (
            <div key={day}>
              <div style={{ height: 96, marginBottom: 24, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(26,23,21,0.14)' }}>
                {glyph}
              </div>
              <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 12, letterSpacing: '0.22em', color: '#5A5550', marginBottom: 18 }}>{day}</div>
              <h3 style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 14px' }}>{title}</h3>
              <p style={{ fontSize: 16.5, color: '#5A5550', lineHeight: 1.55, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROLES ── */}
      <section id="roles" style={{ maxWidth: 1480, margin: '0 auto', padding: '160px 56px 0' }}>
        <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5A5550', borderTop: '1px solid #1A1715', paddingTop: 18 }}>
          02 / For every role
        </div>
        <h2 style={{ fontSize: 'clamp(48px, 5.5vw, 80px)', fontWeight: 500, lineHeight: 1.0, letterSpacing: '-0.035em', margin: '32px 0 0', maxWidth: 1100 }}>
          Every employee, <span style={{ color: 'oklch(0.62 0.16 35)', fontWeight: 600 }}>irreplaceable.</span>
        </h2>
        <div
          style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(26,23,21,0.08)', borderTop: '1px solid rgba(26,23,21,0.14)', borderBottom: '1px solid rgba(26,23,21,0.14)' }}
          className="max-md:!grid-cols-1"
        >
          {[
            {
              tag: 'The Sales Rep — empowered to',
              mult: '3×',
              headline: 'close',
              verbObj: 'more deals',
              desc: 'Research, follow-ups and CRM updates run in the background. Your reps spend the day on calls, not data entry.',
            },
            {
              tag: 'The Bookkeeper — empowered to',
              mult: '2×',
              headline: 'run',
              verbObj: 'the books faster',
              desc: 'Invoices processed, categorized and reconciled — automatically. Month-end close in days, not weeks.',
            },
            {
              tag: 'The Service Agent — empowered to',
              mult: '4×',
              headline: 'handle',
              verbObj: 'tickets faster',
              desc: 'Replies drafted before the customer even hits send. Your team handles the hard ones — the agent handles the rest.',
            },
          ].map(({ tag, mult, headline, verbObj, desc }) => (
            <div
              key={tag}
              style={{ background: '#F2EEE6', padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 280 }}
            >
              <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5A5550' }}>{tag}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <div style={{ fontSize: 80, fontWeight: 600, lineHeight: 0.9, letterSpacing: '-0.05em', color: 'oklch(0.62 0.16 35)', fontVariantNumeric: 'tabular-nums' }}>{mult}</div>
                <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.2, marginTop: -4 }}>
                  {headline} <span style={{ color: '#5A5550', fontWeight: 400 }}>{verbObj}</span>
                </div>
              </div>
              <p style={{ fontSize: 15, color: '#5A5550', lineHeight: 1.55, margin: '6px 0 0' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EU SOVEREIGN ── */}
      <section id="sovereign" style={{ maxWidth: 1480, margin: '160px auto 0', padding: '0 56px' }}>
        <div
          style={{
            background: '#1A1715',
            color: '#F2EEE6',
            borderRadius: 18,
            padding: '64px 56px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
          className="max-md:!grid-cols-1 max-md:!p-10 max-md:!gap-8"
        >
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(242,238,230,0.6)', borderTop: '1px solid rgba(242,238,230,0.2)', paddingTop: 18 }}>
              03 / Built for Europe
            </div>
            <h2 style={{ fontSize: 56, fontWeight: 500, lineHeight: 1.0, letterSpacing: '-0.03em', margin: '28px 0 0' }}>
              EU-sovereign by design. <span style={{ color: 'oklch(0.62 0.16 35)', fontWeight: 600 }}>No exceptions.</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(242,238,230,0.7)', lineHeight: 1.55, margin: '24px 0 0' }}>
              Your data stays in the EU. Your agents run on EU infrastructure. GDPR, AI Act, and your compliance team's questions — all answered before you ask.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 24px' }}>
            {[
              { tag: 'Data residency', title: 'Frankfurt & Paris.', desc: 'Every byte processed inside the EU. Audit-ready logs, region-locked.' },
              { tag: 'Compliance', title: 'GDPR · ISO 27001.', desc: 'Drafted with the EU AI Act in hand. SOC 2 Type II in flight.' },
              { tag: 'Models', title: 'European-hosted.', desc: 'Mistral, Aleph Alpha, and your own. Switch providers without rewiring.' },
              { tag: 'Support', title: 'German-speaking.', desc: 'A real human in your timezone. Response SLA under four hours.' },
            ].map(({ tag, title, desc }) => (
              <div key={tag} style={{ borderTop: '1px solid rgba(242,238,230,0.2)', paddingTop: 18 }}>
                <div style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(242,238,230,0.5)' }}>{tag}</div>
                <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em', margin: '8px 0 0' }}>{title}</div>
                <p style={{ fontSize: 14.5, color: 'rgba(242,238,230,0.65)', lineHeight: 1.5, margin: '8px 0 0' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section id="demo" style={{ maxWidth: 1480, margin: '0 auto', padding: '200px 56px 120px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(56px, 9vw, 144px)', fontWeight: 500, lineHeight: 0.94, letterSpacing: '-0.045em', margin: 0 }}>
          Get your team<br /><span style={{ color: 'oklch(0.62 0.16 35)', fontWeight: 600 }}>their three days back.</span>
        </h2>
        <div className="inline-flex flex-wrap gap-3.5 justify-center" style={{ marginTop: 56 }}>
          <Link
            to="/schedule-demo"
            className="inline-flex items-center gap-2.5 transition-all duration-150 hover:-translate-y-px"
            style={{ padding: '12px 22px', fontSize: 15, fontWeight: 500, borderRadius: 999, border: '1px solid #1A1715', background: '#1A1715', color: '#F2EEE6', letterSpacing: '-0.01em' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'oklch(0.62 0.16 35)'; (e.currentTarget as HTMLElement).style.borderColor = 'oklch(0.62 0.16 35)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1A1715'; (e.currentTarget as HTMLElement).style.borderColor = '#1A1715'; }}
          >
            Book a demo <span>→</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2.5 transition-all duration-150"
            style={{ padding: '12px 22px', fontSize: 15, fontWeight: 500, borderRadius: 999, border: '1px solid #1A1715', background: 'transparent', color: '#1A1715', letterSpacing: '-0.01em' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1A1715'; (e.currentTarget as HTMLElement).style.color = '#F2EEE6'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#1A1715'; }}
          >
            Talk to sales
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
