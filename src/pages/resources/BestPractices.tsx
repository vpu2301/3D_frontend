
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
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[color:var(--sand)] to-[color:var(--paper)] dark:from-[color:var(--bg)] dark:to-[color:var(--paper)]">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-[color:var(--ink)] mb-6 tracking-tight dark:text-white">
              {t('resources.bestPractices.heroTitle')}
            </h1>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto font-light leading-relaxed dark:text-[color:var(--text-4)]">
              {t('resources.bestPractices.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/resources/training">{t('resources.bestPractices.heroCta1')}</Link>
              </Button>
              <Button variant="outline" className="border-[color:var(--line)] text-[color:var(--ink)] hover:bg-[color:var(--sand)] px-8 py-3 rounded-full" asChild>
                <Link to="/contact">{t('resources.bestPractices.heroCta2')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--paper)] dark:bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('resources.bestPractices.practicesTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('resources.bestPractices.practicesSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {practices.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 dark:bg-[color:var(--sand)]">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-[28px] bg-[color:var(--ink)] w-fit mx-auto mb-6">
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-[color:var(--ink)] mb-6 dark:text-white">{category.category}</h3>
                  <div className="space-y-4 text-left">
                    {category.practices.map((practice, practiceIndex) => (
                      <div key={practiceIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-[color:var(--blue)] flex-shrink-0 mt-0.5" />
                        <span className="text-[color:var(--text-2)] dark:text-[color:var(--text-4)]">{practice}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--sand)] dark:bg-[color:var(--bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('resources.bestPractices.dosDontsTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('resources.bestPractices.dosDontsSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dosDonts.map((item, index) => (
              <div key={index} className={`bg-[color:var(--paper)] p-6 rounded-[16px] shadow-lg border-l-4 dark:bg-[color:var(--sand)] ${
                item.type === 'do' ? 'border-[color:var(--line)]' : 'border-[color:var(--line)]'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-[16px] ${item.type === 'do' ? 'bg-[color:var(--blue-100)]' : 'bg-[color:var(--blue-100)]'}`}>
                    {item.type === 'do' ? (
                      <CheckCircle className="h-6 w-6 text-[color:var(--blue)]" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-[color:var(--blue)]" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium mb-2 ${item.type === 'do' ? 'text-[color:var(--blue)]' : 'text-[color:var(--blue)]'}`}>
                      {item.type === 'do' ? t('resources.bestPractices.do') : t('resources.bestPractices.dont')}{item.title}
                    </h3>
                    <p className="text-[color:var(--text-2)] dark:text-[color:var(--text-4)]">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[color:var(--sand)] text-[color:var(--ink)] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">{t('resources.bestPractices.ctaTitle')}</h2>
          <p className="text-xl mb-12 opacity-90 font-light">{t('resources.bestPractices.ctaSubtitle')}</p>
          <Button size="lg" className="bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full py-3" asChild>
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
