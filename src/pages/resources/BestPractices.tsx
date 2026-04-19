
import { Lightbulb, ArrowRight, Shield, Zap, Users, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const BestPractices = () => {
  const { t } = useTranslation();

  const practices = [
    {
      category: t('resources.bestPractices.cat1Name'),
      icon: Shield,
      practices: [
        t('resources.bestPractices.cat1p1'), t('resources.bestPractices.cat1p2'),
        t('resources.bestPractices.cat1p3'), t('resources.bestPractices.cat1p4'),
      ],
    },
    {
      category: t('resources.bestPractices.cat2Name'),
      icon: Zap,
      practices: [
        t('resources.bestPractices.cat2p1'), t('resources.bestPractices.cat2p2'),
        t('resources.bestPractices.cat2p3'), t('resources.bestPractices.cat2p4'),
      ],
    },
    {
      category: t('resources.bestPractices.cat3Name'),
      icon: Users,
      practices: [
        t('resources.bestPractices.cat3p1'), t('resources.bestPractices.cat3p2'),
        t('resources.bestPractices.cat3p3'), t('resources.bestPractices.cat3p4'),
      ],
    },
  ];

  const dosDonts = [
    { type: 'do', title: t('resources.bestPractices.d1Title'), description: t('resources.bestPractices.d1Desc') },
    { type: 'do', title: t('resources.bestPractices.d2Title'), description: t('resources.bestPractices.d2Desc') },
    { type: "don't", title: t('resources.bestPractices.dn1Title'), description: t('resources.bestPractices.dn1Desc') },
    { type: "don't", title: t('resources.bestPractices.dn2Title'), description: t('resources.bestPractices.dn2Desc') },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight dark:text-white">
              {t('resources.bestPractices.heroTitle')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed dark:text-gray-300">
              {t('resources.bestPractices.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/resources/training">{t('resources.bestPractices.heroCta1')}</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/contact">{t('resources.bestPractices.heroCta2')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-[#1c1916]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('resources.bestPractices.practicesTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('resources.bestPractices.practicesSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {practices.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 dark:bg-[#222018]">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-[#111111] w-fit mx-auto mb-6">
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-6 dark:text-white">{category.category}</h3>
                  <div className="space-y-4 text-left">
                    {category.practices.map((practice, practiceIndex) => (
                      <div key={practiceIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">{practice}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-[#181512]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('resources.bestPractices.dosDontsTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('resources.bestPractices.dosDontsSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dosDonts.map((item, index) => (
              <div key={index} className={`bg-white p-6 rounded-lg shadow-lg border-l-4 dark:bg-[#222018] ${
                item.type === 'do' ? 'border-green-500' : 'border-red-500'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${item.type === 'do' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {item.type === 'do' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium mb-2 ${item.type === 'do' ? 'text-green-800' : 'text-red-800'}`}>
                      {item.type === 'do' ? t('resources.bestPractices.do') : t('resources.bestPractices.dont')}{item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">{t('resources.bestPractices.ctaTitle')}</h2>
          <p className="text-xl mb-12 opacity-90 font-light">{t('resources.bestPractices.ctaSubtitle')}</p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/get-started">
              {t('resources.bestPractices.ctaBtn')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default BestPractices;
