import React from 'react';
import { Article } from '../../types.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { getRelativeTimeBangla, getReadingTimeBangla } from '../../utils/banglaUtils.ts';
import { Clock, BookOpen, Flame, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  articles?: Article[];
  mainArticle?: Article;
  secondaryArticles?: Article[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  articles = [],
  mainArticle,
  secondaryArticles,
}) => {
  const { navigate } = useNews();

  const safeArticles = Array.isArray(articles) ? articles : [];

  // Find lead hero story or fallback to mainArticle or first in list
  const mainLead =
    mainArticle ||
    safeArticles.find((a) => a?.homepagePlacement === 'hero_main') ||
    safeArticles.find((a) => a?.isFeatured) ||
    safeArticles[0];

  if (!mainLead) return null;

  // Secondary stories
  const secondaryList =
    secondaryArticles && secondaryArticles.length > 0
      ? secondaryArticles
      : safeArticles.filter((a) => a && a.id !== mainLead.id).slice(0, 4);

  return (
    <section id="hero-editorial-section" className="my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT / MAIN LEAD STORY (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
          <div
            className="group cursor-pointer"
            onClick={() => navigate(`/article/${mainLead.slug}`)}
          >
            {/* Featured Image */}
            <div className="relative aspect-16/9 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={
                  mainLead.featuredImage ||
                  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'
                }
                alt={mainLead.title || 'প্রধান সংবাদ'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-rose-900 text-white text-xs font-bold uppercase tracking-wider shadow">
                  {mainLead.categoryName || 'জাতীয়'}
                </span>
                {mainLead.isBreaking && (
                  <span className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold flex items-center gap-1 shadow animate-pulse">
                    <Flame className="w-3.5 h-3.5" />
                    <span>ব্রেকিং</span>
                  </span>
                )}
              </div>
            </div>

            {/* Content Info */}
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-semibold text-rose-800 dark:text-rose-400">
                  {mainLead.reporter || mainLead.authorName || 'বিশেষ প্রতিনিধি'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {getRelativeTimeBangla(mainLead.publishedAt)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {getReadingTimeBangla(mainLead.content || '')}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-slate-950 dark:text-white group-hover:text-rose-900 dark:group-hover:text-rose-400 transition-colors leading-tight mb-3">
                {mainLead.title}
              </h2>

              {mainLead.subtitle && (
                <h3 className="text-base sm:text-lg font-medium text-rose-900 dark:text-rose-300/90 mb-3 leading-snug">
                  {mainLead.subtitle}
                </h3>
              )}

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {mainLead.excerpt}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT / SECONDARY GRID (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 h-full">
            {secondaryList.map((story) => (
              <div
                key={story.id}
                onClick={() => navigate(`/article/${story.slug}`)}
                className="group cursor-pointer bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900/50 hover:shadow-sm transition flex gap-3 sm:gap-4 items-start"
              >
                <div className="relative w-28 sm:w-32 aspect-4/3 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={
                      story.featuredImage ||
                      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&auto=format&fit=crop&q=80'
                    }
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold">
                    {story.categoryName || 'সংবাদ'}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>{getRelativeTimeBangla(story.publishedAt)}</span>
                    {story.isEditorPick && (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3" />
                        <span>স্পেশাল</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white group-hover:text-rose-800 dark:group-hover:text-rose-400 transition-colors leading-snug line-clamp-2">
                    {story.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {story.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

