import React, { useState, useEffect } from 'react';
import { Article } from '../types.ts';
import { api } from '../lib/api.ts';
import { useNews } from '../context/NewsContext.tsx';
import { getRelativeTimeBangla, toBanglaNumeral } from '../utils/banglaUtils.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { Search, Filter, Clock, ChevronRight } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { categories, navigate } = useNews();
  const [query, setQuery] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const doSearch = async () => {
      if (!query.trim()) return;
      try {
        setLoading(true);
        const res = await api.getArticles({
          search: query.trim(),
          categorySlug: selectedCategory !== 'all' ? selectedCategory : undefined,
          limit: 30,
        });
        setArticles(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    doSearch();
  }, [query, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
      <SEOHead
        title={query ? `‘${query}’ অনুসন্ধানের ফলাফল` : 'সংবাদ অনুসন্ধান'}
        description="সত্যবাণী ডিজিটাল আর্কাইভে আপনার কাঙ্ক্ষিত সংবাদ অনুসন্ধান করুন"
      />

      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold font-serif text-slate-950 dark:text-white text-center mb-6">
          সংবাদ অনুসন্ধান
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative mb-4">
          <input
            type="text"
            placeholder="কী-ওয়ার্ড, সংবাদ শিরোনাম বা প্রতিবেদকের নাম লিখুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-3.5 rounded-xl border-2 border-rose-900 dark:border-rose-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none shadow-md text-base"
          />
          <Search className="w-5 h-5 text-rose-800 absolute left-4 top-4" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-5 py-2 rounded-lg bg-rose-900 hover:bg-rose-950 text-white font-bold text-sm transition"
          >
            অনুসন্ধান
          </button>
        </form>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 text-xs font-semibold">
          <span className="text-slate-500 shrink-0">ফিল্টার:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full transition ${selectedCategory === 'all' ? 'bg-rose-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
          >
            সকল বিভাগ
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3 py-1 rounded-full transition ${selectedCategory === c.slug ? 'bg-rose-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      {query && (
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 flex items-center justify-between text-sm">
          <p className="text-slate-600 dark:text-slate-400">
            ‘<strong className="text-slate-900 dark:text-white">{query}</strong>’ কী-ওয়ার্ডে{' '}
            <strong className="text-rose-800 dark:text-rose-400">{toBanglaNumeral(articles.length)}</strong> টি ফলাফল পাওয়া গেছে
          </p>
        </div>
      )}

      {/* Results List */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">অনুসন্ধান চলছে...</div>
      ) : articles.length === 0 && query ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto">
          <p className="text-slate-600 dark:text-slate-400 text-base mb-2">
            কোনো সংবাদ খুঁজে পাওয়া যায়নি।
          </p>
          <p className="text-xs text-slate-400">
            অনুগ্রহ করে বানান যাচাই করুন অথবা ভিন্ন কী-ওয়ার্ড ব্যবহার করে আবার চেষ্টা করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {articles.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/article/${item.slug}`)}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="aspect-16/9 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={item.featuredImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-rose-800 dark:text-rose-400">
                      {item.categoryName}
                    </span>
                    <span>•</span>
                    <span>{getRelativeTimeBangla(item.publishedAt)}</span>
                  </div>
                  <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white group-hover:text-rose-800 dark:group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {item.excerpt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};
