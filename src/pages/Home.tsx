import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Users, BarChart3, Clock, CheckCircle, TrendingUp, Workflow, Brain, Shield, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * The hero's background clip, engineered so a play button can NEVER appear:
 *
 * 1. The <video> is injected as raw HTML so `muted`/`autoplay`/`playsinline`
 *    exist as ATTRIBUTES at parse time — Safari's autoplay policy checks the
 *    attribute, and React only sets the property, which is why it blocked.
 * 2. The element stays invisible until the browser fires `playing`. A blocked
 *    video therefore shows nothing at all — the identical poster frame on
 *    `.m-hero-art` sits behind it — instead of Safari's overlay play button.
 * 3. play() is retried on canplay and on the first touch/click/scroll
 *    (covers iOS Low Power Mode and "Never Auto-Play" site settings).
 */
const HERO_VIDEO_HTML = `
  <video class="m-hero-video" autoplay muted loop playsinline webkit-playsinline
         preload="auto" poster="/hero-poster.jpg" disablepictureinpicture
         style="opacity:0;transition:opacity .6s ease">
    <source src="/hero.mp4" type="video/mp4" />
  </video>`;

const HeroVideo = () => {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current?.querySelector('video');
    if (!el) return;
    el.defaultMuted = true;
    el.muted = true;

    const onPlaying = () => {
      el.style.opacity = '1';
    };
    const onPauseLike = () => {
      if (el.paused) el.style.opacity = '0';
    };
    el.addEventListener('playing', onPlaying);
    el.addEventListener('pause', onPauseLike);

    const tryPlay = () => {
      el.play().catch(() => {
        /* blocked — stays invisible; gesture listeners retry */
      });
    };
    tryPlay();
    el.addEventListener('canplay', tryPlay);

    const unlock = () => {
      if (el.paused) tryPlay();
    };
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('scroll', unlock, { passive: true });
    window.addEventListener('keydown', unlock);

    return () => {
      el.removeEventListener('playing', onPlaying);
      el.removeEventListener('pause', onPauseLike);
      el.removeEventListener('canplay', tryPlay);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('scroll', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // eslint-disable-next-line react/no-danger
  return <div ref={wrapRef} className="contents" dangerouslySetInnerHTML={{ __html: HERO_VIDEO_HTML }} />;
};

// Animated counter hook
const useCounter = (end: number, duration: number = 2000, start: boolean = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);
  return count;
};

const Home = () => {
  const { t } = useTranslation();
  const [statsVisible, setStatsVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const productivity = useCounter(40, 2000, statsVisible);
  const timeSaved = useCounter(60, 2000, statsVisible);
  const companies = useCounter(500, 2500, statsVisible);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: Brain, title: t('home.feature1Title'), description: t('home.feature1Desc') },
    { icon: Workflow, title: t('home.feature2Title'), description: t('home.feature2Desc') },
    { icon: BarChart3, title: t('home.feature3Title'), description: t('home.feature3Desc') },
    { icon: Shield, title: t('home.feature4Title'), description: t('home.feature4Desc') },
  ];

  const testimonials = [
    { quote: t('home.testimonial1Quote'), author: t('home.testimonial1Author'), role: t('home.testimonial1Role') },
    { quote: t('home.testimonial2Quote'), author: t('home.testimonial2Author'), role: t('home.testimonial2Role') },
    { quote: t('home.testimonial3Quote'), author: t('home.testimonial3Author'), role: t('home.testimonial3Role') },
  ];

  const steps = [
    { step: t('home.step1Number'), title: t('home.step1Title'), desc: t('home.step1Desc') },
    { step: t('home.step2Number'), title: t('home.step2Title'), desc: t('home.step2Desc') },
    { step: t('home.step3Number'), title: t('home.step3Title'), desc: t('home.step3Desc') },
  ];

  const tools = ['Slack', 'Notion', 'Jira', 'GitHub', 'Gmail', 'Salesforce', 'HubSpot', 'Linear'];

  return (
    <div className="min-h-screen bg-[color:var(--bg)] dark:bg-[color:var(--bg)] text-[color:var(--ink)] dark:text-[color:var(--ink)] overflow-x-hidden">
      {/* Hero */}
      <section className="m-hero m-on-art relative pt-40 pb-28 px-6 lg:px-8">
        <div className="m-hero-art" aria-hidden>
          <HeroVideo />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Badge */}
          <div
            className={`m-hero-badge mb-10 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Zap className="w-3 h-3" />
            {t('home.badge')}
          </div>

          {/* Headline — editorial display face, weight/style contrast for hierarchy */}
          <h1
            className={`font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.02em] mb-8 leading-[0.95] max-w-4xl transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {t('home.headline1')}
            <br />
            <span className="text-[color:var(--blue-200)]">{t('home.headline2')}</span>
          </h1>

          {/* Subheadline + CTAs layout */}
          <div className={`flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16 transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-lg text-white/90 max-w-md leading-relaxed">
              {t('home.subheadline')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link to="/signup" className="m-btn m-btn-primary group">
                {t('common.startForFree')}
                <span className="m-arrow">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
              <Link to="/watch-demo" className="m-btn m-btn-ghost">
                {t('common.bookDemo')}
              </Link>
            </div>
          </div>

          <p className={`text-white/60 text-xs mt-6 tracking-wide transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
            {t('home.noCreditCard')}
          </p>

          {/* UI preview */}
          <div className={`relative mt-20 transition-all duration-1000 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {/* Grid-breaking floating stat chip, overlapping the preview corner */}
            <div className={`glass-strong absolute -top-7 right-6 z-20 hidden lg:block px-5 py-3 transition-all duration-700 delay-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`} style={{ borderRadius: '16px' }}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-4)] dark:text-white/45">{t('home.statTimeSaved')}</p>
              <p className="font-display text-2xl font-semibold text-[color:var(--ink)] dark:text-[color:var(--ink)] leading-tight">37 hrs<span className="text-sm font-normal text-[color:var(--text-4)] dark:text-white/40"> / wk</span></p>
            </div>
            <div className="border-crafted shadow-layered relative overflow-hidden bg-[color:var(--sand)] dark:bg-[color:var(--paper)]" style={{ borderRadius: '16px' }}>
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-5 py-4 border-b border-[color:var(--line)] dark:border-white/8 bg-[color:var(--sand)] dark:bg-[#1f1d1a]">
                <div className="w-2.5 h-2.5 rounded-full bg-[color:var(--sand)] dark:bg-[color:var(--paper)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[color:var(--sand)] dark:bg-[color:var(--paper)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[color:var(--sand)] dark:bg-[color:var(--paper)]" />
                <span className="ml-4 text-[color:var(--text-4)] dark:text-white/30 text-xs font-mono">{t('home.uiPreview')}</span>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: t('home.statsCompleted'), value: '47', change: t('home.statsToday') },
                    { label: t('home.statsHoursSaved'), value: '18.4h', change: t('home.statsWeek') },
                    { label: t('home.statsAutomation'), value: '73%', change: t('home.statsOfWork') },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 text-left bg-[color:var(--bg)] dark:bg-[color:var(--sand)] border border-[color:var(--line)] dark:border-white/8" style={{ borderRadius: '16px' }}>
                      <div className="text-xl md:text-2xl font-bold text-[color:var(--ink)] dark:text-[color:var(--ink)] tracking-tight">{stat.value}</div>
                      <div className="text-[color:var(--text-2)] dark:text-white/50 text-xs mt-0.5">{stat.label}</div>
                      <div className="text-[color:var(--text-4)] dark:text-white/30 text-xs">{stat.change}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { task: t('home.task1'), time: t('home.time1'), done: true },
                    { task: t('home.task2'), time: t('home.time2'), done: true },
                    { task: t('home.task3'), time: t('home.timeRunning'), done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[color:var(--sand)] dark:bg-[#1f1d1a] border border-[color:var(--line)] dark:border-white/6 px-4 py-3" style={{ borderRadius: '16px' }}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-[color:var(--sand)] dark:bg-[color:var(--paper)] border border-[color:var(--line)] dark:border-white/15' : 'bg-[color:var(--blue-100)] border border-[color:var(--line)]'}`}>
                        {item.done
                          ? <CheckCircle className="w-3 h-3 text-[color:var(--text-2)] dark:text-white/55" />
                          : <div className="w-2 h-2 rounded-full bg-[color:var(--blue)] animate-pulse" />
                        }
                      </div>
                      <span className="text-[color:var(--text-2)] dark:text-white/60 text-sm flex-1 text-left">{item.task}</span>
                      <span className="text-[color:var(--text-4)] dark:text-white/30 text-xs">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-20 border-t border-[color:var(--line)] dark:border-white/10 bg-[color:var(--sand)] dark:bg-[color:var(--paper)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:divide-x divide-[color:var(--line)] dark:divide-white/10">
            {[
              { value: `${productivity}%`, label: t('home.statProductivity'), icon: TrendingUp },
              { value: `${timeSaved}%`, label: t('home.statTimeSaved'), icon: Clock },
              { value: `${companies}+`, label: t('home.statCompanies'), icon: Users },
            ].map((stat, i) => (
              <div key={i} className={`${i > 0 ? 'md:pl-12' : ''}`}>
                <div className="font-display text-5xl md:text-6xl font-semibold text-[color:var(--ink)] dark:text-[color:var(--ink)] tracking-[-0.01em] mb-3">{stat.value}</div>
                <div className="text-[color:var(--text-2)] dark:text-white/50 text-sm leading-relaxed">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 bg-[color:var(--bg)] dark:bg-[color:var(--bg)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-[color:var(--blue)] text-xs uppercase tracking-widest font-semibold mb-5">{t('home.featuresLabel')}</p>
            <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-16">
              <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-[-0.01em] text-[color:var(--ink)] dark:text-[color:var(--ink)] leading-[1.05] max-w-sm">
                {t('home.featuresHeadline')}
              </h2>
              <p className="text-[color:var(--text-2)] dark:text-white/55 text-base max-w-md leading-relaxed pb-1">
                {t('home.featuresSubheadline')}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-8 border border-[color:var(--line)] dark:border-white/10 bg-[color:var(--sand)] dark:bg-[color:var(--paper)] hover:bg-[color:var(--paper)] dark:hover:bg-[color:var(--sand)] hover:shadow-lg hover:shadow-[#141413]/5 dark:hover:shadow-black/20 transition-all duration-300"
                style={{ borderRadius: '16px' }}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 bg-[color:var(--sand)] dark:bg-[color:var(--paper)] mb-6" style={{ borderRadius: '16px' }}>
                  <feature.icon className="w-5 h-5 text-[color:var(--text-2)] dark:text-white/55" />
                </div>
                <h3 className="text-lg font-semibold text-[color:var(--ink)] dark:text-[color:var(--ink)] mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-[color:var(--text-2)] dark:text-white/50 text-sm leading-relaxed">{feature.description}</p>
                <div className="flex items-center gap-1 mt-6 text-[color:var(--blue)] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('common.learnMore')} <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-28 border-t border-[color:var(--line)] dark:border-white/10 bg-[color:var(--sand)] dark:bg-[color:var(--paper)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-[color:var(--blue)] text-xs uppercase tracking-widest font-semibold mb-5">{t('home.howItWorksLabel')}</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-[-0.01em] text-[color:var(--ink)] dark:text-[color:var(--ink)] leading-[1.05]">
              {t('home.howItWorksHeadline')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="border-t-2 border-[color:var(--line)] dark:border-white/12 pt-8">
                <div className="text-[color:var(--blue)] font-bold text-sm tracking-widest mb-5">{step.step}</div>
                <h3 className="text-[color:var(--ink)] dark:text-[color:var(--ink)] font-semibold text-lg mb-3 tracking-tight">{step.title}</h3>
                <p className="text-[color:var(--text-2)] dark:text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 bg-[color:var(--bg)] dark:bg-[color:var(--bg)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-[color:var(--blue)] text-xs uppercase tracking-widest font-semibold mb-5">{t('home.testimonialsLabel')}</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-[color:var(--ink)] dark:text-[color:var(--ink)] tracking-[-0.01em] leading-[1.05]">{t('home.testimonialsHeadline')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-[color:var(--sand)] dark:bg-[color:var(--paper)] border border-[color:var(--line)] dark:border-white/10 p-8 hover:bg-[color:var(--paper)] dark:hover:bg-[color:var(--sand)] hover:shadow-lg hover:shadow-[#141413]/5 dark:hover:shadow-black/20 transition-all duration-300" style={{ borderRadius: '16px' }}>
                <div className="w-8 h-0.5 bg-[color:var(--blue)] mb-7" />
                <p className="text-[color:var(--text-2)] dark:text-white/70 text-sm leading-relaxed mb-8">"{testimonial.quote}"</p>
                <div>
                  <div className="text-[color:var(--ink)] dark:text-[color:var(--ink)] font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-[color:var(--text-4)] dark:text-white/40 text-xs mt-1">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations strip */}
      <section className="py-16 border-t border-[color:var(--line)] dark:border-white/10 bg-[color:var(--sand)] dark:bg-[color:var(--paper)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <p className="text-[color:var(--text-4)] dark:text-white/38 text-xs uppercase tracking-widest font-semibold mb-8">{t('home.integrationsLabel')}</p>
              <div className="flex flex-wrap items-center gap-2">
                {tools.map((tool) => (
                  <div
                    key={tool}
                    className="px-5 py-2 border border-[color:var(--line)] dark:border-white/15 bg-[color:var(--bg)] dark:bg-[color:var(--bg)] text-[color:var(--text-2)] dark:text-white/55 text-sm font-medium hover:text-[color:var(--ink)] dark:hover:text-white hover:border-[color:var(--line)] dark:hover:border-white/30 hover:bg-[color:var(--paper)] dark:hover:bg-[color:var(--sand)] transition-all duration-200"
                    style={{ borderRadius: '9999px' }}
                  >
                    {tool}
                  </div>
                ))}
                <div className="text-[color:var(--text-4)] dark:text-white/38 text-sm px-3">{t('home.integrationsMore')}</div>
              </div>
            </div>
            <Link to="/schedule-demo" className="flex-shrink-0">
              <button className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[color:var(--ink)] dark:bg-[color:var(--ink)] hover:bg-[#2a2a28] dark:hover:bg-[color:var(--paper)] text-white dark:text-[color:var(--ink)] text-sm font-medium transition-all duration-200" style={{ borderRadius: '9999px' }}>
                {t('common.bookDemo')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
