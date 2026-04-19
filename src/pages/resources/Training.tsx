
import { BookOpen, ArrowRight, Play, Users, Target, CheckCircle, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Training = () => {
  const { t } = useTranslation();

  const courses = [
    { title: t('resources.training.c1Title'), duration: t('resources.training.c1Duration'), level: t('resources.training.c1Level'), icon: Play, description: t('resources.training.c1Desc') },
    { title: t('resources.training.c2Title'), duration: t('resources.training.c2Duration'), level: t('resources.training.c2Level'), icon: Target, description: t('resources.training.c2Desc') },
    { title: t('resources.training.c3Title'), duration: t('resources.training.c3Duration'), level: t('resources.training.c3Level'), icon: Users, description: t('resources.training.c3Desc') },
    { title: t('resources.training.c4Title'), duration: t('resources.training.c4Duration'), level: t('resources.training.c4Level'), icon: CheckCircle, description: t('resources.training.c4Desc') },
  ];

  const resources = [
    { type: t('resources.training.r1Type'), count: t('resources.training.r1Count'), description: t('resources.training.r1Desc') },
    { type: t('resources.training.r2Type'), count: t('resources.training.r2Count'), description: t('resources.training.r2Desc') },
    { type: t('resources.training.r3Type'), count: t('resources.training.r3Count'), description: t('resources.training.r3Desc') },
    { type: t('resources.training.r4Type'), count: t('resources.training.r4Count'), description: t('resources.training.r4Desc') },
  ];

  const levelColors: Record<string, string> = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Advanced: 'bg-red-100 text-red-700',
    Anfänger: 'bg-green-100 text-green-700',
    Mittel: 'bg-yellow-100 text-yellow-700',
    Fortgeschritten: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight dark:text-white">
              {t('resources.training.heroTitle')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed dark:text-gray-300">
              {t('resources.training.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/get-started">{t('resources.training.heroCta1')}</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/contact">{t('resources.training.heroCta2')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-[#1c1916]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('resources.training.coursesTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('resources.training.coursesSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-[#222018]">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-[#111111] mr-4">
                      <course.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2 dark:text-white">{course.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors[course.level] || 'bg-gray-100 text-gray-700'}`}>
                          {course.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 dark:text-gray-300">{course.description}</p>
                  <Button className="w-full bg-[#111111] hover:bg-[#222222] text-white">
                    {t('common.startCourse')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-[#181512]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 dark:text-white">{t('resources.training.resourcesTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">{t('resources.training.resourcesSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center dark:bg-[#222018]">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 w-fit mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">{resource.type}</h3>
                <p className="text-sm text-blue-600 font-medium mb-2">{resource.count}</p>
                <p className="text-gray-600 text-sm dark:text-gray-300">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">{t('resources.training.ctaTitle')}</h2>
          <p className="text-xl mb-12 opacity-90 font-light">{t('resources.training.ctaSubtitle')}</p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/get-started">
              {t('resources.training.ctaBtn')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Training;
