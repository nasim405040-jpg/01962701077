import React, { useEffect, useState } from 'react';
import { useNews } from '../context/NewsContext.tsx';
import { Article } from '../types.ts';
import { api } from '../lib/api.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { HeroSection } from '../components/news/HeroSection.tsx';
import { LatestNewsFeed } from '../components/news/LatestNewsFeed.tsx';
import { CategoryBlock } from '../components/news/CategoryBlock.tsx';
import { TrendingSidebar } from '../components/news/TrendingSidebar.tsx';
import { VideoSection } from '../components/news/VideoSection.tsx';
import { PhotoGallerySection } from '../components/news/PhotoGallerySection.tsx';
import { AdSlot } from '../components/layout/AdSlot.tsx';

export const HomePage: React.FC = () => {
  const { settings, categories } = useNews();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await api.getArticles({ limit: 40 });
        setArticles(res.data || []);
      } catch (err) {
        console.error('Error loading articles for homepage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Filter sections
  const heroMain =
    articles.find((a) => a.homepagePlacement === 'hero_main') || articles[0];
  const heroSub =
    articles
      .filter((a) => a.id !== heroMain?.id && a.homepagePlacement === 'hero_sub')
      .slice(0, 4);
  const heroSecondaryArticles =
    heroSub.length >= 3
      ? heroSub
      : articles.filter((a) => a.id !== heroMain?.id).slice(0, 3);

  // Group by Categories
  const nationalArticles = articles.filter(
    (a) => a.categorySlug === 'national' || a.categoryName === 'জাতীয়'
  );
  const politicsArticles = articles.filter(
    (a) => a.categorySlug === 'politics' || a.categoryName === 'রাজনীতি'
  );
  const economyArticles = articles.filter(
    (a) => a.categorySlug === 'economy' || a.categoryName === 'অর্থনীতি'
  );
  const internationalArticles = articles.filter(
    (a) => a.categorySlug === 'international' || a.categoryName === 'আন্তর্জাতিক'
  );
  const sportsArticles = articles.filter(
    (a) => a.categorySlug === 'sports' || a.categoryName === 'খেলা'
  );

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
      <SEOHead
        title={settings.siteName + ' — ' + settings.siteTagline}
        description={settings.siteDescription}
      />

      {/* Top Billboard Ad */}
      <AdSlot placement="home_top" />

      {/* Hero Section Grid */}
      {heroMain && (
        <div className="my-6">
          <HeroSection
            mainArticle={heroMain}
            secondaryArticles={heroSecondaryArticles}
          />
        </div>
      )}

      {/* Primary Layout: Main Content (8 cols) + Sticky Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Latest News Feed Stream */}
          <LatestNewsFeed articles={articles} />

          {/* Home Middle Ad Banner */}
          <AdSlot placement="home_middle" />

          {/* National News Category Block */}
          {nationalArticles.length > 0 && (
            <CategoryBlock
              title="জাতীয় সংবাদ"
              slug="national"
              color="#991b1b"
              articles={nationalArticles}
              layout="grid_4"
            />
          )}

          {/* Politics News Category Block */}
          {politicsArticles.length > 0 && (
            <CategoryBlock
              title="রাজনীতি ও নির্বাচন"
              slug="politics"
              color="#1e3a8a"
              articles={politicsArticles}
              layout="split_1_3"
            />
          )}

          {/* Economy & Business Block */}
          {economyArticles.length > 0 && (
            <CategoryBlock
              title="অর্থনীতি ও ব্যবসা-বাণিজ্য"
              slug="economy"
              color="#065f46"
              articles={economyArticles}
              layout="grid_4"
            />
          )}
        </div>

        {/* Right Column (4 cols) - Sticky Sidebar */}
        <div className="lg:col-span-4">
          <TrendingSidebar articles={articles} />
        </div>
      </div>

      {/* Video / Multimedia Dark Block */}
      <div className="my-10">
        <VideoSection />
      </div>

      {/* International & Sports Section 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
        {internationalArticles.length > 0 && (
          <CategoryBlock
            title="আন্তর্জাতিক"
            slug="international"
            color="#4338ca"
            articles={internationalArticles}
            layout="grid_4"
          />
        )}
        {sportsArticles.length > 0 && (
          <CategoryBlock
            title="খেলাধুলা"
            slug="sports"
            color="#b45309"
            articles={sportsArticles}
            layout="split_1_3"
          />
        )}
      </div>

      {/* Photo Gallery Masonry / Slider */}
      <div className="my-10">
        <PhotoGallerySection />
      </div>

      {/* Bottom Ad */}
      <AdSlot placement="home_bottom" />
    </main>
  );
};
