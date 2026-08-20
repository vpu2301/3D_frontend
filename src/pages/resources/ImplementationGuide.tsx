
import { CheckCircle, ArrowRight, Clock, Users, Cog, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const ImplementationGuide = () => {
  const { t } = useTranslation();

  const phases = [
    {
      phase: t('resources.implementationGuide.phase1'),
      title: t('resources.implementationGuide.phase1Title'),
      duration: t('resources.implementationGuide.phase1Duration'),
      icon: Target,
      steps: [
        t('resources.implementationGuide.phase1s1'),
        t('resources.implementationGuide.phase1s2'),
        t('resources.implementationGuide.phase1s3'),
        t('resources.implementationGuide.phase1s4'),
      ],
    },
    {
      phase: t('resources.implementationGuide.phase2'),
      title: t('resources.implementationGuide.phase2Title'),
      duration: t('resources.implementationGuide.phase2Duration'),
      icon: Cog,
      steps: [
        t('resources.implementationGuide.phase2s1'),
        t('resources.implementationGuide.phase2s2'),
        t('resources.implementationGuide.phase2s3'),
        t('resources.implementationGuide.phase2s4'),
      ],
    },
    {
      phase: t('resources.implementationGuide.phase3'),
      title: t('resources.implementationGuide.phase3Title'),
      duration: t('resources.implementationGuide.phase3Duration'),
      icon: Users,
      steps: [
        t('resources.implementationGuide.phase3s1'),
        t('resources.implementationGuide.phase3s2'),
        t('resources.implementationGuide.phase3s3'),
        t('resources.implementationGuide.phase3s4'),
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[color:var(--sand)] to-[color:var(--paper)] dark:from-[color:var(--bg)] dark:to-[color:var(--paper)]">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-[color:var(--ink)] mb-6 tracking-tight dark:text-white">
              {t('resources.implementationGuide.heroTitle')}
            </h1>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto font-light leading-relaxed dark:text-[color:var(--text-4)]">
              {t('resources.implementationGuide.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/get-started">{t('resources.implementationGuide.heroCta1')}</Link>
              </Button>
              <Button variant="outline" className="border-[color:var(--line)] text-[color:var(--ink)] hover:bg-[color:var(--sand)] px-8 py-3 rounded-full" asChild>
                <Link to="/contact">{t('resources.implementationGuide.heroCta2')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--paper)] dark:bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('resources.implementationGuide.phasesTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('resources.implementationGuide.phasesSubtitle')}</p>
          </div>
          <div className="space-y-8">
            {phases.map((phase, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-[color:var(--sand)]">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="p-4 rounded-[28px] bg-[color:var(--ink)]">
                        <phase.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-sm font-medium text-[color:var(--blue)] bg-[color:var(--blue-100)] px-3 py-1 rounded-full">
                          {phase.phase}
                        </span>
                        <span className="text-sm text-[color:var(--text-2)] dark:text-[color:var(--text-4)] flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {phase.duration}
                        </span>
                      </div>
                      <h3 className="text-2xl font-medium text-[color:var(--ink)] mb-4 dark:text-white">{phase.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {phase.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-[color:var(--blue)] flex-shrink-0" />
                            <span className="text-[color:var(--text-2)] dark:text-[color:var(--text-4)]">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[color:var(--sand)] text-[color:var(--ink)] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">{t('resources.implementationGuide.ctaTitle')}</h2>
          <p className="text-xl mb-12 opacity-90 font-light">{t('resources.implementationGuide.ctaSubtitle')}</p>
          <Button size="lg" className="bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full py-3" asChild>
            <Link to="/schedule-demo">
              {t('resources.implementationGuide.ctaBtn')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ImplementationGuide;
