
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
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight dark:text-white">
                {t('agents.nova.heroTitle1')}
                <span className="block font-medium text-[#111111] dark:text-white">
                  {t('agents.nova.heroTitle2')}
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto lg:mx-0 font-light leading-relaxed dark:text-gray-300">
                {t('agents.nova.heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-full" asChild>
                  <Link to="/start-free-trial">{t('agents.nova.heroCta')}</Link>
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                  <Link to="/schedule-demo">{t('common.requestDemo')}</Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/lovable-uploads/6a3a5b85-b2d2-471a-b368-bec35acad2ef.png"
                  alt="Nova - AI HR Specialist"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg dark:bg-[#222018]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('agents.nova.roiTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('agents.nova.roiSubtitle')}</p>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('agents.nova.featuresTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('agents.nova.featuresSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-[#222018]">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-[#222222] mr-4">
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
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('agents.nova.processTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('agents.nova.processSubtitle')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {hrProcesses.map((process, index) => (
              <div key={index} className="bg-rose-50 p-6 rounded-2xl text-center hover:bg-rose-100 transition-colors dark:bg-rose-900/20 dark:hover:bg-rose-900/30">
                <CheckCircle className="h-8 w-8 text-rose-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 dark:text-white">{process}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-[#181512]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('agents.nova.recruitmentTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white">{t('agents.nova.step1Title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('agents.nova.step1Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white">{t('agents.nova.step2Title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('agents.nova.step2Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white">{t('agents.nova.step3Title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('agents.nova.step3Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-lg font-medium mb-2 dark:text-white">{t('agents.nova.step4Title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('agents.nova.step4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-[#1c1916]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('agents.nova.employeeExpTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-medium text-gray-900 mb-6 dark:text-white">{t('agents.nova.hrSupportTitle')}</h3>
              <div className="space-y-4">
                {[t('agents.nova.supportItem1'), t('agents.nova.supportItem2'), t('agents.nova.supportItem3'), t('agents.nova.supportItem4')].map((item, i) => {
                  const icons = [Clock, Shield, Heart, TrendingUp];
                  const Icon = icons[i];
                  return (
                    <div key={i} className="flex items-center">
                      <Icon className="h-5 w-5 text-rose-500 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl dark:bg-[#1f1d1a]">
              <h4 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">{t('agents.nova.askNovaTitle')}</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                {[t('agents.nova.askNova1'), t('agents.nova.askNova2'), t('agents.nova.askNova3'), t('agents.nova.askNova4'), t('agents.nova.askNova5')].map((q, i) => (
                  <li key={i}>• {q}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-[#181512]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('agents.nova.testimonialsTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg dark:bg-[#222018]">
                <CardContent className="p-8">
                  <p className="text-lg text-gray-700 mb-6 italic dark:text-gray-300">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-[#1c1916]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('agents.nova.integrationsTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('agents.nova.integrationsSubtitle')}</p>
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
          <h2 className="text-5xl font-light mb-8 tracking-tight">{t('agents.nova.ctaTitle')}</h2>
          <p className="text-xl mb-12 opacity-90 font-light">{t('agents.nova.ctaSubtitle')}</p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
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
