
import { Brain, Database, Target, Zap, ArrowRight, CheckCircle, Upload, Settings, BarChart3, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const FineTuning = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Database, title: t('product.fineTuning.f1Title'), description: t('product.fineTuning.f1Desc') },
    { icon: Brain, title: t('product.fineTuning.f2Title'), description: t('product.fineTuning.f2Desc') },
    { icon: Target, title: t('product.fineTuning.f3Title'), description: t('product.fineTuning.f3Desc') },
    { icon: Settings, title: t('product.fineTuning.f4Title'), description: t('product.fineTuning.f4Desc') },
  ];

  const tuningProcess = [
    { step: '1', title: t('product.fineTuning.p1Title'), description: t('product.fineTuning.p1Desc'), icon: Upload },
    { step: '2', title: t('product.fineTuning.p2Title'), description: t('product.fineTuning.p2Desc'), icon: Database },
    { step: '3', title: t('product.fineTuning.p3Title'), description: t('product.fineTuning.p3Desc'), icon: Settings },
    { step: '4', title: t('product.fineTuning.p4Title'), description: t('product.fineTuning.p4Desc'), icon: CheckCircle },
  ];

  const dataSources = [
    t('product.fineTuning.d1'), t('product.fineTuning.d2'), t('product.fineTuning.d3'),
    t('product.fineTuning.d4'), t('product.fineTuning.d5'), t('product.fineTuning.d6'),
    t('product.fineTuning.d7'), t('product.fineTuning.d8'),
  ];

  const benefits = [
    { value: t('product.fineTuning.b1Value'), label: t('product.fineTuning.b1Label') },
    { value: t('product.fineTuning.b2Value'), label: t('product.fineTuning.b2Label') },
    { value: t('product.fineTuning.b3Value'), label: t('product.fineTuning.b3Label') },
    { value: t('product.fineTuning.b4Value'), label: t('product.fineTuning.b4Label') },
  ];

  const securityItems = [
    t('product.fineTuning.sec1'), t('product.fineTuning.sec2'),
    t('product.fineTuning.sec3'), t('product.fineTuning.sec4'),
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[color:var(--sand)] to-[color:var(--paper)] dark:from-[color:var(--bg)] dark:to-[color:var(--paper)]">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-[color:var(--ink)] mb-6 tracking-tight dark:text-white">
              {t('product.fineTuning.heroTitle1')}
              <span className="block font-medium text-[color:var(--ink)] dark:text-white">
                {t('product.fineTuning.heroTitle2')}
              </span>
            </h1>
            <p className="text-xl text-[color:var(--text-2)] max-w-4xl mx-auto font-light leading-relaxed dark:text-[color:var(--text-4)]">
              {t('product.fineTuning.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">{t('product.fineTuning.heroCta')}</Link>
              </Button>
              <Button variant="outline" className="border-[color:var(--line)] text-[color:var(--ink)] hover:bg-[color:var(--sand)] px-8 py-3 rounded-full" asChild>
                <Link to="/schedule-demo">{t('product.fineTuning.heroCta2')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--paper)] dark:bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('product.fineTuning.provenResultsTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('product.fineTuning.provenResultsSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-light text-[color:var(--ink)] mb-3 dark:text-white">{benefit.value}</div>
                <div className="text-[color:var(--text-2)] text-lg dark:text-[color:var(--text-4)]">{benefit.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--sand)] dark:bg-[color:var(--bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('product.fineTuning.processTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('product.fineTuning.processSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tuningProcess.map((process, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center dark:bg-[color:var(--sand)]">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--text-2)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <process.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-light text-[color:var(--blue)] mb-4">{t('product.fineTuning.step')} {process.step}</div>
                  <h3 className="text-xl font-medium text-[color:var(--ink)] mb-4 dark:text-white">{process.title}</h3>
                  <p className="text-[color:var(--text-2)] leading-relaxed dark:text-[color:var(--text-4)]">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--paper)] dark:bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('product.fineTuning.featuresTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('product.fineTuning.featuresSubtitle')}</p>
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

      <section className="py-20 px-4 bg-[color:var(--sand)] dark:bg-[color:var(--bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('product.fineTuning.dataTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('product.fineTuning.dataSubtitle')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {dataSources.map((source, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 text-center dark:bg-[color:var(--sand)]">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--text-2)] rounded-[16px] flex items-center justify-center mx-auto mb-4">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-[color:var(--ink)] dark:text-white">{source}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--paper)] dark:bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('product.fineTuning.securityTitle')}</h2>
              <p className="text-xl text-[color:var(--text-2)] mb-8 leading-relaxed dark:text-[color:var(--text-4)]">{t('product.fineTuning.securitySubtitle')}</p>
              <div className="space-y-4">
                {securityItems.map((item, i) => (
                  <div key={i} className="flex items-center">
                    <Shield className="h-6 w-6 text-[color:var(--blue)] mr-3 flex-shrink-0" />
                    <span className="text-[color:var(--ink)] dark:text-[color:var(--text-4)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--text-2)] rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[color:var(--sand)] text-[color:var(--ink)] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">{t('product.fineTuning.ctaTitle')}</h2>
          <p className="text-xl mb-12 opacity-90 font-light">{t('product.fineTuning.ctaSubtitle')}</p>
          <Button size="lg" className="bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              {t('product.fineTuning.ctaBtn')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default FineTuning;
