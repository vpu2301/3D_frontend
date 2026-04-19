
import { MessageCircle, Users, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Atlas = () => {
  const { t } = useTranslation();

  const features = [
    { icon: MessageCircle, title: t('agents.atlas.f1Title'), description: t('agents.atlas.f1Desc') },
    { icon: Users, title: t('agents.atlas.f2Title'), description: t('agents.atlas.f2Desc') },
    { icon: Clock, title: t('agents.atlas.f3Title'), description: t('agents.atlas.f3Desc') },
    { icon: TrendingUp, title: t('agents.atlas.f4Title'), description: t('agents.atlas.f4Desc') },
  ];

  const integrations = ['Zendesk', 'Freshdesk', 'Salesforce Service Cloud', 'Intercom', 'Help Scout', 'Slack'];

  const roiStats = [
    { value: t('agents.atlas.roi1Value'), label: t('agents.atlas.roi1Label') },
    { value: t('agents.atlas.roi2Value'), label: t('agents.atlas.roi2Label') },
    { value: t('agents.atlas.roi3Value'), label: t('agents.atlas.roi3Label') },
    { value: t('agents.atlas.roi4Value'), label: t('agents.atlas.roi4Label') },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight dark:text-white">
                {t('agents.atlas.heroTitle1')}
                <span className="block font-medium text-[#111111] dark:text-white">
                  {t('agents.atlas.heroTitle2')}
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto lg:mx-0 font-light leading-relaxed dark:text-gray-300">
                {t('agents.atlas.heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-full" asChild>
                  <Link to="/schedule-demo">{t('agents.atlas.heroCta')}</Link>
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                  <Link to="/start-free-trial">{t('agents.atlas.heroCta2')}</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/lovable-uploads/f82237ef-566f-4602-b25a-b6cd95c1de6f.png"
                  alt="Atlas - AI Support Specialist"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg dark:bg-[#222018]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{t('agents.shared.ctaActive')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-[#1c1916]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('agents.atlas.roiTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('agents.atlas.roiSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roiStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-light text-gray-900 mb-3 dark:text-white">{stat.value}</div>
                <div className="text-gray-600 text-lg dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-[#181512]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('agents.atlas.featuresTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('agents.atlas.featuresSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-[#222018]">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 mr-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-[#1c1916]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('agents.atlas.integrationsTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('agents.atlas.integrationsSubtitle')}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-gray-100 px-6 py-3 rounded-full text-gray-700 font-medium dark:bg-[#222018] dark:text-gray-300">
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">{t('agents.atlas.ctaTitle')}</h2>
          <p className="text-xl mb-12 opacity-90 font-light">{t('agents.atlas.ctaSubtitle')}</p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/schedule-demo">
              {t('agents.atlas.heroCta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Atlas;
