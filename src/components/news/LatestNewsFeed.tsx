import React, { useState } from 'react';
import { Article } from '../../types.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { getRelativeTimeBangla } from '../../utils/banglaUtils.ts';
import { Clock, ChevronRight } from 'lucide-react';

interface LatestNewsFeedProps {
  articles?: Article[];
  limit?: number;
}

export const LatestNewsFeed: React.FC<LatestNewsFeedProps> = ({ articles = [], limit = 8 }) => {
  const { navigate } = useNews();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const safeArticles = Array.isArray(articles) ? articles : [];

  const filtered = selectedFilter === 'all'
    ? safeArticles
    : safeArticles.filter((a) => a?.categorySlug === selectedFilter);

  const displayed = filtered.slice(0, limit);


  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
      {/* Header & Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-800 animate-pulse"></span>
          <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
            সর্বশেষ সংবাদ
          </h3>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded transition ${selectedFilter === 'all' ? 'bg-rose-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            সব
          </button>
          <button
            onClick={() => setSelectedFilter('national')}
            className={`px-2.5 py-1 rounded transition ${selectedFilter === 'national' ? 'bg-rose-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            জাতীয়
          </button>
          <button
            onClick={() => setSelectedFilter('politics')}
            className={`px-2.5 py-1 rounded transition ${selectedFilter === 'politics' ? 'bg-rose-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            রাজনীতি
          </button>
          <button
            onClick={() => setSelectedFilter('economy')}
            className={`px-2.5 py-1 rounded transition ${selectedFilter === 'economy' ? 'bg-rose-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            অর্থনীতি
          </button>
          <button
            onClick={() => setSelectedFilter('sports')}
            className={`px-2.5 py-1 rounded transition ${selectedFilter === 'sports' ? 'bg-rose-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            খেলাধুলা
          </button>
        </div>
      </div>

      {/* Grid of articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayed.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/article/${item.slug}`)}
            className="group cursor-pointer flex gap-3 p-3 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
          >
            <div className="w-24 h-20 rounded-md overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
              <img
                src={item.featuredImage}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-semibold text-rose-800 dark:text-rose-400">
                    {item.categoryName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getRelativeTimeBangla(item.publishedAt)}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold font-serif text-slate-900 dark:text-white group-hover:text-rose-800 dark:group-hover:text-rose-400 transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
        <button
          onClick={() => navigate('/latest')}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-900 hover:text-white dark:hover:bg-rose-900 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
        >
          <span>সকল সর্বশেষ সংবাদ দেখুন</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
