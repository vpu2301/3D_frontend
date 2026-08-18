import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Users, BarChart3, Clock, CheckCircle, TrendingUp, Workflow, Brain, Shield, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    <div className="min-h-screen bg-[#e8e6dc] dark:bg-[#181512] text-[#141413] dark:text-[#ede8e3] overflow-x-hidden">
      {/* Hero */}
      <section className="mesh-warm grain relative pt-40 pb-28 px-6 lg:px-8 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#d97757]/12 text-[#d97757] text-xs font-semibold mb-10 tracking-widest uppercase transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ borderRadius: '2px' }}
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
            <span className="font-display italic font-normal text-[#d97757]">{t('home.headline2')}</span>
          </h1>

          {/* Subheadline + CTAs layout */}
          <div className={`flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16 transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-lg text-[#30302e]/60 dark:text-white/60 max-w-md leading-relaxed">
              {t('home.subheadline')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link to="/signup">
                <button className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#141413] dark:bg-[#ede8e3] hover:bg-[#2a2a28] dark:hover:bg-white text-white dark:text-[#141413] text-sm font-medium transition-all duration-200" style={{ borderRadius: '4px' }}>
                  {t('common.startForFree')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link to="/watch-demo">
                <button className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#141413]/20 dark:border-white/20 hover:border-[#141413]/40 dark:hover:border-white/40 text-[#141413] dark:text-[#ede8e3] text-sm font-medium transition-all duration-200 hover:bg-[#141413]/5 dark:hover:bg-white/5" style={{ borderRadius: '4px' }}>
                  {t('common.bookDemo')}
                </button>
              </Link>
            </div>
          </div>

          <p className={`text-[#30302e]/35 dark:text-white/35 text-xs mt-6 tracking-wide transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
            {t('home.noCreditCard')}
          </p>

          {/* UI preview */}
          <div className={`relative mt-20 transition-all duration-1000 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {/* Grid-breaking floating stat chip, overlapping the preview corner */}
            <div className={`glass-strong absolute -top-7 right-6 z-20 hidden lg:block px-5 py-3 transition-all duration-700 delay-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`} style={{ borderRadius: '10px' }}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#30302e]/45 dark:text-white/45">{t('home.statTimeSaved')}</p>
              <p className="font-display text-2xl font-semibold text-[#141413] dark:text-[#ede8e3] leading-tight">37 hrs<span className="text-sm font-normal text-[#30302e]/40 dark:text-white/40"> / wk</span></p>
            </div>
            <div className="border-crafted shadow-layered relative overflow-hidden bg-[#f5f3ee] dark:bg-[#1c1916]" style={{ borderRadius: '12px' }}>
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-5 py-4 border-b border-[#141413]/8 dark:border-white/8 bg-[#eeece6] dark:bg-[#1f1d1a]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#141413]/20 dark:bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#141413]/15 dark:bg-white/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#141413]/10 dark:bg-white/10" />
                <span className="ml-4 text-[#141413]/30 dark:text-white/30 text-xs font-mono">{t('home.uiPreview')}</span>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: t('home.statsCompleted'), value: '47', change: t('home.statsToday') },
                    { label: t('home.statsHoursSaved'), value: '18.4h', change: t('home.statsWeek') },
                    { label: t('home.statsAutomation'), value: '73%', change: t('home.statsOfWork') },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 text-left bg-[#e8e6dc] dark:bg-[#262220] border border-[#141413]/8 dark:border-white/8" style={{ borderRadius: '8px' }}>
                      <div className="text-xl md:text-2xl font-bold text-[#141413] dark:text-[#ede8e3] tracking-tight">{stat.value}</div>
                      <div className="text-[#141413]/50 dark:text-white/50 text-xs mt-0.5">{stat.label}</div>
                      <div className="text-[#141413]/30 dark:text-white/30 text-xs">{stat.change}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { task: t('home.task1'), time: t('home.time1'), done: true },
                    { task: t('home.task2'), time: t('home.time2'), done: true },
                    { task: t('home.task3'), time: t('home.timeRunning'), done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#eeece6] dark:bg-[#1f1d1a] border border-[#141413]/6 dark:border-white/6 px-4 py-3" style={{ borderRadius: '8px' }}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-[#141413]/8 dark:bg-white/8 border border-[#141413]/15 dark:border-white/15' : 'bg-[#d97757]/15 border border-[#d97757]/25'}`}>
                        {item.done
                          ? <CheckCircle className="w-3 h-3 text-[#141413]/55 dark:text-white/55" />
                          : <div className="w-2 h-2 rounded-full bg-[#d97757]/70 animate-pulse" />
                        }
                      </div>
                      <span className="text-[#141413]/60 dark:text-white/60 text-sm flex-1 text-left">{item.task}</span>
                      <span className="text-[#141413]/30 dark:text-white/30 text-xs">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-20 border-t border-[#141413]/10 dark:border-white/10 bg-[#f5f3ee] dark:bg-[#1c1916]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:divide-x divide-[#141413]/10 dark:divide-white/10">
            {[
              { value: `${productivity}%`, label: t('home.statProductivity'), icon: TrendingUp },
              { value: `${timeSaved}%`, label: t('home.statTimeSaved'), icon: Clock },
              { value: `${companies}+`, label: t('home.statCompanies'), icon: Users },
            ].map((stat, i) => (
              <div key={i} className={`${i > 0 ? 'md:pl-12' : ''}`}>
                <div className="font-display text-5xl md:text-6xl font-semibold text-[#141413] dark:text-[#ede8e3] tracking-[-0.01em] mb-3">{stat.value}</div>
                <div className="text-[#30302e]/50 dark:text-white/50 text-sm leading-relaxed">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 bg-[#e8e6dc] dark:bg-[#181512]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-[#d97757] text-xs uppercase tracking-widest font-semibold mb-5">{t('home.featuresLabel')}</p>
            <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-16">
              <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-[-0.01em] text-[#141413] dark:text-[#ede8e3] leading-[1.05] max-w-sm">
                {t('home.featuresHeadline')}
              </h2>
              <p className="text-[#30302e]/55 dark:text-white/55 text-base max-w-md leading-relaxed pb-1">
                {t('home.featuresSubheadline')}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-8 border border-[#141413]/10 dark:border-white/10 bg-[#f5f3ee] dark:bg-[#1c1916] hover:bg-white dark:hover:bg-[#222018] hover:shadow-lg hover:shadow-[#141413]/5 dark:hover:shadow-black/20 transition-all duration-300"
                style={{ borderRadius: '10px' }}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 bg-[#141413]/8 dark:bg-white/8 mb-6" style={{ borderRadius: '8px' }}>
                  <feature.icon className="w-5 h-5 text-[#141413]/55 dark:text-white/55" />
                </div>
                <h3 className="text-lg font-semibold text-[#141413] dark:text-[#ede8e3] mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-[#30302e]/50 dark:text-white/50 text-sm leading-relaxed">{feature.description}</p>
                <div className="flex items-center gap-1 mt-6 text-[#d97757] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('common.learnMore')} <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-28 border-t border-[#141413]/10 dark:border-white/10 bg-[#f5f3ee] dark:bg-[#1c1916]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-[#d97757] text-xs uppercase tracking-widest font-semibold mb-5">{t('home.howItWorksLabel')}</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-[-0.01em] text-[#141413] dark:text-[#ede8e3] leading-[1.05]">
              {t('home.howItWorksHeadline')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="border-t-2 border-[#141413]/12 dark:border-white/12 pt-8">
                <div className="text-[#d97757] font-bold text-sm tracking-widest mb-5">{step.step}</div>
                <h3 className="text-[#141413] dark:text-[#ede8e3] font-semibold text-lg mb-3 tracking-tight">{step.title}</h3>
                <p className="text-[#30302e]/50 dark:text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 bg-[#e8e6dc] dark:bg-[#181512]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-[#d97757] text-xs uppercase tracking-widest font-semibold mb-5">{t('home.testimonialsLabel')}</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-[#141413] dark:text-[#ede8e3] tracking-[-0.01em] leading-[1.05]">{t('home.testimonialsHeadline')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-[#f5f3ee] dark:bg-[#1c1916] border border-[#141413]/10 dark:border-white/10 p-8 hover:bg-white dark:hover:bg-[#222018] hover:shadow-lg hover:shadow-[#141413]/5 dark:hover:shadow-black/20 transition-all duration-300" style={{ borderRadius: '10px' }}>
                <div className="w-8 h-0.5 bg-[#d97757] mb-7" />
                <p className="text-[#141413]/70 dark:text-white/70 text-sm leading-relaxed mb-8">"{testimonial.quote}"</p>
                <div>
                  <div className="text-[#141413] dark:text-[#ede8e3] font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-[#30302e]/40 dark:text-white/40 text-xs mt-1">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations strip */}
      <section className="py-16 border-t border-[#141413]/10 dark:border-white/10 bg-[#f5f3ee] dark:bg-[#1c1916]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <p className="text-[#30302e]/38 dark:text-white/38 text-xs uppercase tracking-widest font-semibold mb-8">{t('home.integrationsLabel')}</p>
              <div className="flex flex-wrap items-center gap-2">
                {tools.map((tool) => (
                  <div
                    key={tool}
                    className="px-5 py-2 border border-[#141413]/15 dark:border-white/15 bg-[#e8e6dc] dark:bg-[#181512] text-[#141413]/55 dark:text-white/55 text-sm font-medium hover:text-[#141413] dark:hover:text-white hover:border-[#141413]/30 dark:hover:border-white/30 hover:bg-white dark:hover:bg-[#252220] transition-all duration-200"
                    style={{ borderRadius: '4px' }}
                  >
                    {tool}
                  </div>
                ))}
                <div className="text-[#30302e]/38 dark:text-white/38 text-sm px-3">{t('home.integrationsMore')}</div>
              </div>
            </div>
            <Link to="/schedule-demo" className="flex-shrink-0">
              <button className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#141413] dark:bg-[#ede8e3] hover:bg-[#2a2a28] dark:hover:bg-white text-white dark:text-[#141413] text-sm font-medium transition-all duration-200" style={{ borderRadius: '4px' }}>
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
