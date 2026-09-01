import React, { useEffect, useState } from 'react';
import { Article } from '../types.ts';
import { api } from '../lib/api.ts';
import { useNews } from '../context/NewsContext.tsx';
import { getRelativeTimeBangla, formatBanglaDate } from '../utils/banglaUtils.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { TrendingSidebar } from '../components/news/TrendingSidebar.tsx';
import { Clock, Flame, ChevronRight } from 'lucide-react';

export const LatestPage: React.FC = () => {
  const { navigate } = useNews();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const res = await api.getArticles({ limit: 30 });
        // Sort descending by publish date
        const sorted = (res.data || []).sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setArticles(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
      <SEOHead
        title="সর্বশেষ সংবাদ"
        description="মুহূর্তের ব্রেকিং নিউজ ও তাজা খবরের সরাসরি আপডেট"
      />

      <div className="border-b-2 border-rose-900 pb-3 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-600 animate-ping"></span>
          <h1 className="text-3xl font-extrabold font-serif text-slate-950 dark:text-white">
            সর্বশেষ প্রকাশিত সংবাদ
          </h1>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          প্রতি মিনিটে স্বয়ংক্রিয় আপডেট
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {loading ? (
            <div className="text-center py-20 text-slate-500">লোড হচ্ছে...</div>
          ) : (
            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-6">
              {articles.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/article/${item.slug}`)}
                  className="group cursor-pointer relative pl-6 transition"
                >
                  {/* Timeline dot */}
                  <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 bg-rose-800 group-hover:scale-125 transition-transform" />

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900/50 hover:shadow-sm transition flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-36 aspect-16/9 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                      <img
                        src={item.featuredImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <span className="font-bold text-rose-800 dark:text-rose-400">
                            {item.categoryName}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getRelativeTimeBangla(item.publishedAt)}
                          </span>
                          {item.isBreaking && (
                            <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold">
                              ব্রেকিং
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white group-hover:text-rose-800 dark:group-hover:text-rose-400 transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <TrendingSidebar articles={articles} />
        </div>
      </div>
    </main>
  );
};
