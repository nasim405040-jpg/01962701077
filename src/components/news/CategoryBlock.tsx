import React from 'react';
import { Article, Category } from '../../types.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { getRelativeTimeBangla } from '../../utils/banglaUtils.ts';
import { ChevronRight, Clock } from 'lucide-react';

interface CategoryBlockProps {
  category?: Category;
  title?: string;
  slug?: string;
  color?: string;
  articles?: Article[];
  layout?: 'grid' | 'sports' | 'entertainment' | 'tech' | 'opinion' | 'grid_4' | 'split_1_3';
}

export const CategoryBlock: React.FC<CategoryBlockProps> = ({
  category,
  title,
  slug,
  color,
  articles = [],
  layout = 'grid',
}) => {
  const { navigate } = useNews();

  const safeArticles = Array.isArray(articles) ? articles : [];
  if (safeArticles.length === 0) return null;

  const categoryName = title || category?.name || 'বিভাগ';
  const categorySlug = slug || category?.slug || 'news';
  const categoryColor = color || category?.color || '#991b1b';
  const subcategories = category?.subcategories || [];

  const lead = safeArticles[0];
  const sideArticles = safeArticles.slice(1, 4);

  return (
    <section className="my-8">
      {/* Category Section Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-2 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-1.5 h-6 rounded-full"
            style={{ backgroundColor: categoryColor }}
          />
          <h3 className="text-2xl font-bold font-serif text-slate-950 dark:text-white">
            {categoryName}
          </h3>
          {subcategories.length > 0 && (
            <div className="hidden md:flex items-center gap-2 ml-4">
              {subcategories.slice(0, 3).map((sub) => (
                <button
                  key={sub}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(sub)}`)}
                  className="text-xs text-slate-500 hover:text-rose-800 dark:hover:text-rose-400 font-medium"
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(`/category/${categorySlug}`)}
          className="flex items-center gap-1 text-xs font-bold text-rose-800 dark:text-rose-400 hover:underline"
        >
          <span>আরও</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Layout Variations */}
      {layout === 'opinion' ? (
        /* Opinion / Editorial Column Layout */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {safeArticles.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/article/${item.slug}`)}
              className="group cursor-pointer bg-amber-50/50 dark:bg-slate-800/40 p-5 rounded-xl border border-amber-200/60 dark:border-slate-700/60 hover:border-amber-400 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={
                      item.authorPhoto ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                    }
                    alt={item.authorName || 'লেখক'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-300 dark:border-slate-600 shadow-xs shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.authorName || 'কলামিস্ট'}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.reporter || 'কলামিস্ট ও বিশ্লেষক'}
                    </p>
                  </div>
                </div>
                <h4 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white group-hover:text-rose-800 dark:group-hover:text-rose-400 leading-snug line-clamp-2 mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 italic">
                  "{item.excerpt}"
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-amber-200/40 dark:border-slate-700 text-[11px] text-slate-500">
                {getRelativeTimeBangla(item.publishedAt)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Standard Editorial Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Lead for Category (7 cols) */}
          {lead && (
            <div
              className="lg:col-span-7 group cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
              onClick={() => navigate(`/article/${lead.slug}`)}
            >
              <div className="aspect-16/9 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                <img
                  src={lead.featuredImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80'}
                  alt={lead.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {lead.subcategory && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-xs font-semibold">
                    {lead.subcategory}
                  </span>
                )}
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    <span>{lead.reporter || lead.authorName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getRelativeTimeBangla(lead.publishedAt)}
                    </span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold font-serif text-slate-950 dark:text-white group-hover:text-rose-800 dark:group-hover:text-rose-400 transition-colors leading-tight mb-2">
                    {lead.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {lead.excerpt}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Side Articles (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {sideArticles.map((story) => (
              <div
                key={story.id}
                onClick={() => navigate(`/article/${story.slug}`)}
                className="group cursor-pointer bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900/50 transition flex gap-3 items-center"
              >
                <div className="w-24 sm:w-28 aspect-4/3 rounded-md overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={story.featuredImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&auto=format&fit=crop&q=80'}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-slate-400 mb-1">
                    {getRelativeTimeBangla(story.publishedAt)}
                  </div>
                  <h5 className="text-sm sm:text-base font-bold font-serif text-slate-900 dark:text-white group-hover:text-rose-800 dark:group-hover:text-rose-400 transition-colors leading-snug line-clamp-2">
                    {story.title}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

