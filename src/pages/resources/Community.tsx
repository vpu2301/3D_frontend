
import { Users, ArrowRight, MessageCircle, Heart, Star, Trophy, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const Community = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, number: t('resources.community.s1Number'), label: t('resources.community.s1Label') },
    { icon: MessageCircle, number: t('resources.community.s2Number'), label: t('resources.community.s2Label') },
    { icon: Heart, number: t('resources.community.s3Number'), label: t('resources.community.s3Label') },
    { icon: TrendingUp, number: t('resources.community.s4Number'), label: t('resources.community.s4Label') },
  ];

  const categories = [
    { name: t('resources.community.cat1Name'), icon: Star, posts: 1200, description: t('resources.community.cat1Desc') },
    { name: t('resources.community.cat2Name'), icon: MessageCircle, posts: 3400, description: t('resources.community.cat2Desc') },
    { name: t('resources.community.cat3Name'), icon: Users, posts: 2100, description: t('resources.community.cat3Desc') },
    { name: t('resources.community.cat4Name'), icon: Trophy, posts: 800, description: t('resources.community.cat4Desc') },
  ];

  const recentTopics = [
    { title: t('resources.community.topic1Title'), author: 'Alex Chen', replies: 24, time: '2 hours ago', category: t('resources.community.cat2Name') },
    { title: t('resources.community.topic2Title'), author: 'Sarah Johnson', replies: 15, time: '4 hours ago', category: t('resources.community.cat1Name') },
    { title: t('resources.community.topic3Title'), author: 'Mike Rodriguez', replies: 8, time: '6 hours ago', category: t('resources.community.cat3Name') },
    { title: t('resources.community.topic4Title'), author: 'Emma Wilson', replies: 32, time: '1 day ago', category: t('resources.community.cat4Name') },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[color:var(--sand)] to-[color:var(--paper)] dark:from-[color:var(--bg)] dark:to-[color:var(--paper)]">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-[color:var(--ink)] mb-6 tracking-tight dark:text-white">
              {t('resources.community.heroTitle')}
            </h1>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto font-light leading-relaxed dark:text-[color:var(--text-4)]">
              {t('resources.community.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/get-started">{t('resources.community.heroCta1')}</Link>
              </Button>
              <Button variant="outline" className="border-[color:var(--line)] text-[color:var(--ink)] hover:bg-[color:var(--sand)] px-8 py-3 rounded-full" asChild>
                <Link to="/contact">{t('resources.community.heroCta2')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--paper)] dark:bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('resources.community.communityTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('resources.community.communitySubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="p-4 rounded-[28px] bg-[color:var(--ink)] w-fit mx-auto mb-6">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-light text-[color:var(--ink)] mb-2 dark:text-white">{stat.number}</div>
                <div className="text-[color:var(--text-2)] dark:text-[color:var(--text-4)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--sand)] dark:bg-[color:var(--bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('resources.community.categoriesTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('resources.community.categoriesSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 dark:bg-[color:var(--sand)]">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-[28px] bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--blue)] mr-4">
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-[color:var(--ink)] mb-2 dark:text-white">{category.name}</h3>
                      <p className="text-sm text-[color:var(--text-2)] dark:text-[color:var(--text-4)]">{category.posts} {t('resources.community.posts', { count: category.posts }).replace(/\d+\s*/, '')}</p>
                    </div>
                  </div>
                  <p className="text-[color:var(--text-2)] mb-6 dark:text-[color:var(--text-4)]">{category.description}</p>
                  <Button variant="outline" className="w-full dark:border-[color:var(--line)] dark:text-[color:var(--text-4)]">
                    {t('common.viewCategory')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[color:var(--paper)] dark:bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6 dark:text-white">{t('resources.community.recentTitle')}</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto dark:text-[color:var(--text-4)]">{t('resources.community.recentSubtitle')}</p>
          </div>
          <div className="space-y-6">
            {recentTopics.map((topic, index) => (
              <div key={index} className="bg-[color:var(--paper)] border border-[color:var(--line)] rounded-[16px] p-6 hover:shadow-md transition-shadow dark:bg-[color:var(--sand)] dark:border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xs font-medium text-[color:var(--blue)] bg-[color:var(--blue-100)] px-2 py-1 rounded-full">
                        {topic.category}
                      </span>
                      <span className="text-xs text-[color:var(--text-2)] dark:text-[color:var(--text-4)] flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {topic.time}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-[color:var(--ink)] mb-2 hover:text-[color:var(--blue)] cursor-pointer dark:text-white">
                      {topic.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-[color:var(--text-2)] dark:text-[color:var(--text-4)]">
                      <span>{t('resources.community.by')} {topic.author}</span>
                      <span className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {topic.replies} replies
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" className="px-8 py-3 dark:border-[color:var(--line)] dark:text-[color:var(--text-4)]">
              {t('common.viewAllDiscussions')}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[color:var(--sand)] text-[color:var(--ink)] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">{t('resources.community.ctaTitle')}</h2>
          <p className="text-xl mb-12 opacity-90 font-light">{t('resources.community.ctaSubtitle')}</p>
          <Button size="lg" className="bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full py-3" asChild>
            <Link to="/get-started">
              {t('resources.community.ctaBtn')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Community;
