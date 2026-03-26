import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Users, BarChart3, Clock, CheckCircle, TrendingUp, Bot, Workflow, Brain, Shield, ChevronRight } from 'lucide-react';

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
    {
      icon: Brain,
      title: 'AI Employee Copilot',
      description: 'Each team member gets a dedicated AI assistant that learns their workflow, preferences, and priorities — working autonomously in the background.',
    },
    {
      icon: Workflow,
      title: 'Automated Task Flows',
      description: 'Tasks that used to take hours are handled in minutes. Emails, reports, data analysis, scheduling — all automated with zero friction.',
    },
    {
      icon: BarChart3,
      title: 'Productivity Intelligence',
      description: 'Real-time analytics on team performance, bottlenecks, and time allocation. Know exactly where hours go and reclaim them instantly.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 certified, end-to-end encrypted, and fully compliant. Your data stays private — always.',
    },
  ];

  const testimonials = [
    {
      quote: 'We closed our Q3 sprint in 3 days. What normally takes the full week.',
      author: 'Sarah K.',
      role: 'VP of Operations, Nexus Corp',
    },
    {
      quote: 'My team went from firefighting to actually building product. Night and day.',
      author: 'Marcus T.',
      role: 'CTO, BuildFast',
    },
    {
      quote: "The ROI was visible in week one. We've never looked back.",
      author: 'Priya L.',
      role: 'CEO, Streamline AI',
    },
  ];

  const steps = [
    { step: '01', title: 'Connect Your Tools', desc: 'Integrates with Slack, Notion, Jira, Gmail, and 200+ tools in minutes.' },
    { step: '02', title: 'AI Learns Your Team', desc: "Understands each employee's role, workload, and priorities automatically." },
    { step: '03', title: 'Work Gets Done', desc: 'Routine tasks execute autonomously. Your team focuses on what matters.' },
  ];

  const tools = ['Slack', 'Notion', 'Jira', 'GitHub', 'Gmail', 'Salesforce', 'HubSpot', 'Linear'];

  return (
    <div className="min-h-screen bg-[#e8e6dc] dark:bg-[#181512] text-[#141413] dark:text-[#ede8e3] overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-40 pb-28 px-6 lg:px-8">
        <div className="relative max-w-6xl mx-auto">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#d97757]/12 text-[#d97757] text-xs font-semibold mb-10 tracking-widest uppercase transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ borderRadius: '2px' }}
          >
            <Zap className="w-3 h-3" />
            AI-Powered Employee Copilot
          </div>

          {/* Headline */}
          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.0] max-w-4xl transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            Where your team's work
            <br />
            actually gets done
          </h1>

          {/* Subheadline + CTAs layout */}
          <div className={`flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16 transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-lg text-[#30302e]/60 dark:text-white/60 max-w-md leading-relaxed">
              Give every employee an AI copilot that automates repetitive work, accelerates decisions, and compresses your team's weekly output — effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link to="/signup">
                <button className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#141413] dark:bg-[#ede8e3] hover:bg-[#2a2a28] dark:hover:bg-white text-white dark:text-[#141413] text-sm font-medium transition-all duration-200" style={{ borderRadius: '4px' }}>
                  Start for free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link to="/watch-demo">
                <button className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#141413]/20 dark:border-white/20 hover:border-[#141413]/40 dark:hover:border-white/40 text-[#141413] dark:text-[#ede8e3] text-sm font-medium transition-all duration-200 hover:bg-[#141413]/5 dark:hover:bg-white/5" style={{ borderRadius: '4px' }}>
                  Book a demo
                </button>
              </Link>
            </div>
          </div>

          <p className={`text-[#30302e]/35 dark:text-white/35 text-xs mt-6 tracking-wide transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
            No credit card required · Setup in under 10 minutes
          </p>

          {/* UI preview */}
          <div className={`mt-20 transition-all duration-1000 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="relative overflow-hidden border border-[#141413]/10 dark:border-white/10 bg-[#f5f3ee] dark:bg-[#1c1916] shadow-2xl shadow-[#141413]/8 dark:shadow-black/40" style={{ borderRadius: '12px' }}>
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-5 py-4 border-b border-[#141413]/8 dark:border-white/8 bg-[#eeece6] dark:bg-[#1f1d1a]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#141413]/20 dark:bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#141413]/15 dark:bg-white/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#141413]/10 dark:bg-white/10" />
                <span className="ml-4 text-[#141413]/30 dark:text-white/30 text-xs font-mono">copilot.dashboard</span>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Tasks Completed', value: '47', change: '+12 today' },
                    { label: 'Hours Saved', value: '18.4h', change: 'this week' },
                    { label: 'Automation Rate', value: '73%', change: 'of routine work' },
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
                    { task: 'Weekly report drafted and sent', time: '2 min ago', done: true },
                    { task: 'Meeting notes summarized → Notion', time: '14 min ago', done: true },
                    { task: 'Q4 budget analysis in progress...', time: 'Running', done: false },
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
              { value: `${productivity}%`, label: 'Increase in team productivity', icon: TrendingUp },
              { value: `${timeSaved}%`, label: 'Reduction in manual task time', icon: Clock },
              { value: `${companies}+`, label: 'Companies already using it', icon: Users },
            ].map((stat, i) => (
              <div key={i} className={`${i > 0 ? 'md:pl-12' : ''}`}>
                <div className="text-5xl md:text-6xl font-bold text-[#141413] dark:text-[#ede8e3] tracking-tight mb-3">{stat.value}</div>
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
            <p className="text-[#d97757] text-xs uppercase tracking-widest font-semibold mb-5">Capabilities</p>
            <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#141413] dark:text-[#ede8e3] leading-tight max-w-sm">
                Your team, supercharged
              </h2>
              <p className="text-[#30302e]/55 dark:text-white/55 text-base max-w-md leading-relaxed pb-1">
                One AI copilot per employee. Every tool connected. Every task tracked. Every hour optimized.
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
                  Learn more <ChevronRight className="w-3 h-3" />
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
            <p className="text-[#d97757] text-xs uppercase tracking-widest font-semibold mb-5">How it works</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#141413] dark:text-[#ede8e3] leading-tight">
              Up and running in minutes
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
            <p className="text-[#d97757] text-xs uppercase tracking-widest font-semibold mb-5">From our customers</p>
            <h2 className="text-4xl font-bold text-[#141413] dark:text-[#ede8e3] tracking-tight">Teams love the difference</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#f5f3ee] dark:bg-[#1c1916] border border-[#141413]/10 dark:border-white/10 p-8 hover:bg-white dark:hover:bg-[#222018] hover:shadow-lg hover:shadow-[#141413]/5 dark:hover:shadow-black/20 transition-all duration-300" style={{ borderRadius: '10px' }}>
                <div className="w-8 h-0.5 bg-[#d97757] mb-7" />
                <p className="text-[#141413]/70 dark:text-white/70 text-sm leading-relaxed mb-8">"{t.quote}"</p>
                <div>
                  <div className="text-[#141413] dark:text-[#ede8e3] font-semibold text-sm">{t.author}</div>
                  <div className="text-[#30302e]/40 dark:text-white/40 text-xs mt-1">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations strip */}
      <section className="py-16 border-t border-[#141413]/10 dark:border-white/10 bg-[#f5f3ee] dark:bg-[#1c1916]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <p className="text-[#30302e]/38 dark:text-white/38 text-xs uppercase tracking-widest font-semibold mb-8">Connects with the tools your team already uses</p>
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
            <div className="text-[#30302e]/38 dark:text-white/38 text-sm px-3">+200 more</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-36 relative overflow-hidden bg-[#141413] dark:bg-[#0f0d0b]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#d97757]/6 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Ready to reclaim
              <br />
              2 days every week?
            </h2>
            <p className="text-white/45 text-lg mb-12 leading-relaxed max-w-md">
              Join hundreds of teams who turned their workweek into focused, high-output time — without burning out.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/signup">
                <button className="group inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-[#f5f3ee] text-[#141413] text-sm font-medium transition-all duration-200" style={{ borderRadius: '4px' }}>
                  Start for free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link to="/schedule-demo">
                <button className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 hover:border-white/30 text-white text-sm font-medium transition-all duration-200 hover:bg-white/6" style={{ borderRadius: '4px' }}>
                  Book a demo
                </button>
              </Link>
            </div>
            <p className="text-white/22 text-xs mt-8 tracking-wide">14-day free trial · No credit card · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#141413]/15 dark:border-white/15 py-14 bg-[#e8e6dc] dark:bg-[#181512]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#141413] dark:bg-[#ede8e3] flex items-center justify-center" style={{ borderRadius: '4px' }}>
                <Bot className="w-4 h-4 text-white dark:text-[#141413]" />
              </div>
              <span className="text-[#141413] dark:text-[#ede8e3] font-semibold text-base tracking-tight">3Days.ai</span>
            </div>
            <div className="flex gap-8 text-[#30302e]/45 dark:text-white/45 text-sm">
              <Link to="/pricing" className="hover:text-[#141413] dark:hover:text-white transition-colors">Pricing</Link>
              <Link to="/about" className="hover:text-[#141413] dark:hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="hover:text-[#141413] dark:hover:text-white transition-colors">Contact</Link>
              <Link to="/careers" className="hover:text-[#141413] dark:hover:text-white transition-colors">Careers</Link>
            </div>
            <p className="text-[#30302e]/30 dark:text-white/30 text-sm">© 2026 3Days.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
