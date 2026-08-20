
import { Users, Heart, TrendingUp, ArrowRight, UserCheck, Calendar, FileText, BarChart3, Clock, Shield, CheckCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Nova = () => {
  const { t } = useTranslation();

  const features = [
    { icon: UserCheck, title: t('agents.nova.f1Title'), description: t('agents.nova.f1Desc') },
    { icon: Calendar, title: t('agents.nova.f2Title'), description: t('agents.nova.f2Desc') },
    { icon: Heart, title: t('agents.nova.f3Title'), description: t('agents.nova.f3Desc') },
    { icon: BarChart3, title: t('agents.nova.f4Title'), description: t('agents.nova.f4Desc') },
  ];

  const hrProcesses = [
    'Candidate Screening', 'Interview Coordination', 'Onboarding Workflows',
    'Performance Reviews', 'Benefits Administration', 'Compliance Tracking'
  ];

  const roiStats = [
    { value: t('agents.nova.roi1Value'), label: t('agents.nova.roi1Label') },
    { value: t('agents.nova.roi2Value'), label: t('agents.nova.roi2Label') },
    { value: t('agents.nova.roi3Value'), label: t('agents.nova.roi3Label') },
    { value: t('agents.nova.roi4Value'), label: t('agents.nova.roi4Label') },
  ];

  const testimonials = [
    { quote: t('agents.nova.testimonial1Quote'), author: t('agents.nova.testimonial1Author'), role: t('agents.nova.testimonial1Role') },
    { quote: t('agents.nova.testimonial2Quote'), author: t('agents.nova.testimonial2Author'), role: t('agents.nova.testimonial2Role') },
  ];

  const integrations = ['Workday', 'BambooHR', 'ADP', 'Slack', 'Microsoft Teams', 'Greenhouse'];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[color:var(--sand)] to-[color:var(--paper)] dark:from-[color:var(--bg)] dark:to-[color:var(--paper)]">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl font-light text-[color:var(--ink)] mb-6 tracking-tight dark:text-white">
                {t('agents.nova.heroTitle1')}
                <span className="block font-medium text-[color:var(--ink)] dark:text-white">
                  {t('agents.nova.heroTitle2')}
                </span>
              </h1>
              <p className="text-xl text-[color:var(--text-2)] max-w-4xl mx-auto lg:mx-0 font-light leading-relaxed dark:text-[color:var(--text-4)]">
                {t('agents.nova.heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Button className="bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white px-8 py-3 rounded-full" asChild>
                  <Link to="/start-free-trial">{t('agents.nova.heroCta')}</Link>
                </Button>
                <Button variant="outline" className="border-[color:var(--line)] text-[color:var(--ink)] hover:bg-[color:var(--sand)] px-8 py-3 rounded-full" asChild>
                  <Link to="/schedule-demo">{t('common.requestDemo')}</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="relative rounded-[28px] overflow-hidden">
                <img
                  src="/lovable-uploads/6a3a5b85-b2d2-471a-b368-bec35acad2ef.png"
                  alt="Nova - AI HR Specialist"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--blue)] to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[color:var(--paper)] rounded-[28px] p-4 shadow-lg dark:bg-[color:var(--sand)]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[color:var(--blue)] rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-[color:var(--ink)] dark:text-white">{t('agents.shared.ctaActive')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--paper)] dark:bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('agents.nova.roiTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('agents.nova.roiSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roiStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-light text-[color:var(--ink)] mb-3 dark:text-white">{stat.value}</div>
                <div className="text-[color:var(--text-2)] text-lg dark:text-[color:var(--text-4)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--sand)] dark:bg-[color:var(--bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('agents.nova.featuresTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('agents.nova.featuresSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-[color:var(--sand)]">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-[28px] bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--text-2)] mr-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-[color:var(--ink)] dark:text-white">{feature.title}</h3>
                  </div>
                  <p className="text-[color:var(--text-2)] leading-relaxed dark:text-[color:var(--text-4)]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--paper)] dark:bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('agents.nova.processTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('agents.nova.processSubtitle')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {hrProcesses.map((process, index) => (
              <div key={index} className="bg-[color:var(--blue-100)] p-6 rounded-[28px] text-center hover:bg-[color:var(--blue-100)] transition-colors dark:bg-[color:var(--blue-100)] dark:hover:bg-[color:var(--blue-100)]">
                <CheckCircle className="h-8 w-8 text-[color:var(--blue)] mx-auto mb-3" />
                <h3 className="font-medium text-[color:var(--ink)] dark:text-white">{process}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--sand)] dark:bg-[color:var(--bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('agents.nova.recruitmentTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[color:var(--blue-100)] rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white">{t('agents.nova.step1Title')}</h3>
              <p className="text-[color:var(--text-2)] dark:text-[color:var(--text-4)]">{t('agents.nova.step1Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[color:var(--blue-100)] rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white">{t('agents.nova.step2Title')}</h3>
              <p className="text-[color:var(--text-2)] dark:text-[color:var(--text-4)]">{t('agents.nova.step2Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[color:var(--blue-100)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white">{t('agents.nova.step3Title')}</h3>
              <p className="text-[color:var(--text-2)] dark:text-[color:var(--text-4)]">{t('agents.nova.step3Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[color:var(--blue-100)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white">{t('agents.nova.step4Title')}</h3>
              <p className="text-[color:var(--text-2)] dark:text-[color:var(--text-4)]">{t('agents.nova.step4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--paper)] dark:bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('agents.nova.employeeExpTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-medium text-[color:var(--ink)] mb-6 dark:text-white">{t('agents.nova.hrSupportTitle')}</h3>
              <div className="space-y-4">
                {[t('agents.nova.supportItem1'), t('agents.nova.supportItem2'), t('agents.nova.supportItem3'), t('agents.nova.supportItem4')].map((item, i) => {
                  const icons = [Clock, Shield, Heart, TrendingUp];
                  const Icon = icons[i];
                  return (
                    <div key={i} className="flex items-center">
                      <Icon className="h-5 w-5 text-[color:var(--blue)] mr-3" />
                      <span className="text-[color:var(--ink)] dark:text-[color:var(--text-4)]">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-[color:var(--sand)] p-8 rounded-[28px] dark:bg-[#1f1d1a]">
              <h4 className="text-lg font-medium text-[color:var(--ink)] mb-4 dark:text-white">{t('agents.nova.askNovaTitle')}</h4>
              <ul className="space-y-2 text-[color:var(--text-2)] dark:text-[color:var(--text-4)]">
                {[t('agents.nova.askNova1'), t('agents.nova.askNova2'), t('agents.nova.askNova3'), t('agents.nova.askNova4'), t('agents.nova.askNova5')].map((q, i) => (
                  <li key={i}>• {q}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--sand)] dark:bg-[color:var(--bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('agents.nova.testimonialsTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg dark:bg-[color:var(--sand)]">
                <CardContent className="p-8">
                  <p className="text-lg text-[color:var(--ink)] mb-6 italic dark:text-[color:var(--text-4)]">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium text-[color:var(--ink)] dark:text-white">{testimonial.author}</p>
                    <p className="text-[color:var(--text-2)] dark:text-[color:var(--text-4)]">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--paper)] dark:bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('agents.nova.integrationsTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('agents.nova.integrationsSubtitle')}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-[color:var(--sand)] px-6 py-3 rounded-full text-[color:var(--ink)] font-medium dark:bg-[color:var(--sand)] dark:text-[color:var(--text-4)]">
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[color:var(--sand)] text-[color:var(--ink)] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">{t('agents.nova.ctaTitle')}</h2>
          <p className="text-xl mb-12 opacity-90 font-light">{t('agents.nova.ctaSubtitle')}</p>
          <Button size="lg" className="bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              {t('agents.nova.heroCta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Nova;
