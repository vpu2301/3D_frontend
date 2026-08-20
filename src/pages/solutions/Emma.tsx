
import { TrendingUp, Users, BarChart3, ArrowRight, PhoneCall, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Emma = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Users, title: t('agents.emma.f1Title'), description: t('agents.emma.f1Desc') },
    { icon: PhoneCall, title: t('agents.emma.f2Title'), description: t('agents.emma.f2Desc') },
    { icon: BarChart3, title: t('agents.emma.f3Title'), description: t('agents.emma.f3Desc') },
    { icon: Calendar, title: t('agents.emma.f4Title'), description: t('agents.emma.f4Desc') },
  ];

  const integrations = ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoom', 'Calendly', 'LinkedIn Sales Navigator'];

  const roiStats = [
    { value: t('agents.emma.roi1Value'), label: t('agents.emma.roi1Label') },
    { value: t('agents.emma.roi2Value'), label: t('agents.emma.roi2Label') },
    { value: t('agents.emma.roi3Value'), label: t('agents.emma.roi3Label') },
    { value: t('agents.emma.roi4Value'), label: t('agents.emma.roi4Label') },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[color:var(--sand)] to-[color:var(--paper)] dark:from-[color:var(--bg)] dark:to-[color:var(--paper)]">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl font-light text-[color:var(--ink)] mb-6 tracking-tight dark:text-white">
                {t('agents.emma.heroTitle1')}
                <span className="block font-medium text-[color:var(--ink)] dark:text-white">
                  {t('agents.emma.heroTitle2')}
                </span>
              </h1>
              <p className="text-xl text-[color:var(--text-2)] max-w-4xl mx-auto lg:mx-0 font-light leading-relaxed dark:text-[color:var(--text-4)]">
                {t('agents.emma.heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Button className="bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white px-8 py-3 rounded-full" asChild>
                  <Link to="/start-free-trial">{t('agents.emma.heroCta')}</Link>
                </Button>
                <Button variant="outline" className="border-[color:var(--line)] text-[color:var(--ink)] hover:bg-[color:var(--sand)] px-8 py-3 rounded-full" asChild>
                  <Link to="/schedule-demo">{t('common.requestDemo')}</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="relative rounded-[28px] overflow-hidden">
                <img
                  src="/lovable-uploads/5888447c-4ba4-4923-bd8b-116a4908a301.png"
                  alt="Emma - AI Sales Specialist"
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
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('agents.emma.roiTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('agents.emma.roiSubtitle')}</p>
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
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('agents.emma.featuresTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('agents.emma.featuresSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-[color:var(--sand)]">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-[28px] bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--blue)] mr-4">
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
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('agents.emma.integrationsTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('agents.emma.integrationsSubtitle')}</p>
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
          <h2 className="text-5xl font-light mb-8 tracking-tight">{t('agents.emma.ctaTitle')}</h2>
          <p className="text-xl mb-12 opacity-90 font-light">{t('agents.emma.ctaSubtitle')}</p>
          <Button size="lg" className="bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              {t('agents.emma.heroCta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Emma;
