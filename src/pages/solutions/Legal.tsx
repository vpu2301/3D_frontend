
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Scale, FileText, Search, Shield, Users, Zap, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Legal = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Scale, title: t('solutions.legal.f1Title'), description: t('solutions.legal.f1Desc') },
    { icon: FileText, title: t('solutions.legal.f2Title'), description: t('solutions.legal.f2Desc') },
    { icon: Search, title: t('solutions.legal.f3Title'), description: t('solutions.legal.f3Desc') },
    { icon: Shield, title: t('solutions.legal.f4Title'), description: t('solutions.legal.f4Desc') },
    { icon: BarChart3, title: t('solutions.legal.f5Title'), description: t('solutions.legal.f5Desc') },
    { icon: Users, title: t('solutions.legal.f6Title'), description: t('solutions.legal.f6Desc') },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight dark:text-white">
              {t('solutions.legal.heroTitle')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed dark:text-gray-300">
              {t('solutions.legal.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">{t('solutions.legal.heroCta')}</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">{t('solutions.watchDemo')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-[#1c1916]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('solutions.legal.featuresTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('solutions.legal.featuresSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 dark:bg-[#222018] dark:border-white/10">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-[#111111] w-fit mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-[#181512]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('solutions.legal.statsTitle')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: t('solutions.legal.s1Value'), label: t('solutions.legal.s1Label'), color: 'text-blue-600' },
              { value: t('solutions.legal.s2Value'), label: t('solutions.legal.s2Label'), color: 'text-green-600' },
              { value: t('solutions.legal.s3Value'), label: t('solutions.legal.s3Label'), color: 'text-purple-600' },
              { value: t('solutions.legal.s4Value'), label: t('solutions.legal.s4Label'), color: 'text-[#111111] dark:text-white' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-4xl font-light mb-2 ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-[#1c1916]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-12 text-[#111111] border border-black/8 dark:bg-[#222018] dark:border-white/10">
            <h3 className="text-3xl font-light mb-8 text-center dark:text-white">{t('solutions.legal.enterpriseTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2 dark:text-white">{t('solutions.legal.e1Title')}</h4>
                <p className="text-black/60 dark:text-white/60">{t('solutions.legal.e1Desc')}</p>
              </div>
              <div className="text-center">
                <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2 dark:text-white">{t('solutions.legal.e2Title')}</h4>
                <p className="text-black/60 dark:text-white/60">{t('solutions.legal.e2Desc')}</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2 dark:text-white">{t('solutions.legal.e3Title')}</h4>
                <p className="text-black/60 dark:text-white/60">{t('solutions.legal.e3Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">{t('solutions.legal.ctaTitle')}</h2>
          <p className="text-xl mb-12 opacity-90 font-light">{t('solutions.legal.ctaSubtitle')}</p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              {t('common.getStarted')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Legal;
