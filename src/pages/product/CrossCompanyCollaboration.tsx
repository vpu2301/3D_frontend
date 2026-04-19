
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Network, Globe, Building2, Shield, Zap, Users, Lock, CheckCircle, Database, Cog, BarChart3, FileText, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CrossCompanyCollaboration = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Network, title: t('product.crossCompany.f1Title'), description: t('product.crossCompany.f1Desc') },
    { icon: Globe, title: t('product.crossCompany.f2Title'), description: t('product.crossCompany.f2Desc') },
    { icon: Building2, title: t('product.crossCompany.f3Title'), description: t('product.crossCompany.f3Desc') },
    { icon: Shield, title: t('product.crossCompany.f4Title'), description: t('product.crossCompany.f4Desc') },
    { icon: Zap, title: t('product.crossCompany.f5Title'), description: t('product.crossCompany.f5Desc') },
    { icon: Users, title: t('product.crossCompany.f6Title'), description: t('product.crossCompany.f6Desc') },
  ];

  const useCases = [
    { title: t('product.crossCompany.uc1Title'), description: t('product.crossCompany.uc1Desc'), icon: Database, companies: ['Supplier AI', 'Manufacturer AI', 'Distributor AI'] },
    { title: t('product.crossCompany.uc2Title'), description: t('product.crossCompany.uc2Desc'), icon: Cog, companies: ['Project Lead AI', 'Vendor A AI', 'Vendor B AI'] },
    { title: t('product.crossCompany.uc3Title'), description: t('product.crossCompany.uc3Desc'), icon: BarChart3, companies: ['ERP System AI', 'CRM System AI', 'Analytics AI'] },
    { title: t('product.crossCompany.uc4Title'), description: t('product.crossCompany.uc4Desc'), icon: FileText, companies: ['Legal AI', 'Compliance AI', 'Operations AI'] },
  ];

  const benefits = [
    { metric: t('product.crossCompany.b1Metric'), description: t('product.crossCompany.b1Desc') },
    { metric: t('product.crossCompany.b2Metric'), description: t('product.crossCompany.b2Desc') },
    { metric: t('product.crossCompany.b3Metric'), description: t('product.crossCompany.b3Desc') },
    { metric: t('product.crossCompany.b4Metric'), description: t('product.crossCompany.b4Desc') },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight dark:text-white">
              {t('product.crossCompany.heroTitle1')}
              <span className="block font-medium text-[#111111] dark:text-white">{t('product.crossCompany.heroTitle2')}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed dark:text-gray-300">
              {t('product.crossCompany.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/get-started">{t('product.crossCompany.heroCta')}</Link>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('product.crossCompany.featuresTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('product.crossCompany.featuresSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 dark:bg-[#222018]">
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
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('product.crossCompany.useCasesTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('product.crossCompany.useCasesSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg dark:bg-[#222018]">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-2xl bg-[#111111] mr-4">
                    <useCase.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">{useCase.title}</h3>
                </div>
                <p className="text-gray-600 mb-6 dark:text-gray-300">{useCase.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-3 dark:text-gray-200">{t('product.crossCompany.collaboratingAI')}</p>
                  {useCase.companies.map((company, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{company}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-[#1c1916]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('product.crossCompany.benefitsTitle')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-gray-900 mb-2 dark:text-white">{benefit.metric}</div>
                <div className="text-gray-600 dark:text-gray-300">{benefit.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-[#181512]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('product.crossCompany.howTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: t('product.crossCompany.how1Title'), desc: t('product.crossCompany.how1Desc') },
              { title: t('product.crossCompany.how2Title'), desc: t('product.crossCompany.how2Desc') },
              { title: t('product.crossCompany.how3Title'), desc: t('product.crossCompany.how3Desc') },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-[#222018]">
                  <span className="text-2xl font-light text-gray-900 dark:text-white">{i + 1}</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-[#1c1916]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-12 text-[#111111] border border-black/8 dark:bg-[#222018] dark:border-white/10">
            <h3 className="text-3xl font-light mb-8 text-center dark:text-white">{t('product.crossCompany.securityTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Lock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2 dark:text-white">{t('product.crossCompany.s1Title')}</h4>
                <p className="text-black/60 dark:text-white/60">{t('product.crossCompany.s1Desc')}</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2 dark:text-white">{t('product.crossCompany.s2Title')}</h4>
                <p className="text-black/60 dark:text-white/60">{t('product.crossCompany.s2Desc')}</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2 dark:text-white">{t('product.crossCompany.s3Title')}</h4>
                <p className="text-black/60 dark:text-white/60">{t('product.crossCompany.s3Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">{t('product.crossCompany.ctaTitle')}</h2>
          <p className="text-xl mb-12 opacity-90 font-light">{t('product.crossCompany.ctaSubtitle')}</p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/get-started">
              {t('common.getStarted')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CrossCompanyCollaboration;
