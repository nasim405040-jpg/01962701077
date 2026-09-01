import React, { useEffect, useState } from 'react';
import { Article, Category } from '../types.ts';
import { api } from '../lib/api.ts';
import { useNews } from '../context/NewsContext.tsx';
import { getRelativeTimeBangla, toBanglaNumeral } from '../utils/banglaUtils.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { TrendingSidebar } from '../components/news/TrendingSidebar.tsx';
import { AdSlot } from '../components/layout/AdSlot.tsx';
import { Clock, ChevronRight, ChevronLeft } from 'lucide-react';

interface CategoryPageProps {
  slug: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug }) => {
  const { categories, navigate } = useNews();
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const category = categories.find((c) => c.slug === slug);

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      try {
        setLoading(true);
        const res = await api.getArticles({
          categorySlug: slug,
          limit: 12,
          page,
        });
        setArticles(res.data || []);
        setTotalPages(res.totalPages || 1);

        const popularRes = await api.getArticles({ limit: 10 });
        setAllArticles(popularRes.data || []);
      } catch (err) {
        console.error('Error loading category articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryArticles();
  }, [slug, page]);

  if (!category && !loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-2">
          ক্যাটাগরি পাওয়া যায়নি
        </h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-rose-900 text-white rounded-lg font-bold text-sm"
        >
          প্রচ্ছদে যান
        </button>
      </div>
    );
  }

  const filteredArticles =
    selectedSubcategory === 'all'
      ? articles
      : articles.filter((a) => a.subcategory === selectedSubcategory);

  const leadStory = filteredArticles[0];
  const remainingStories = filteredArticles.slice(1);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
      <SEOHead
        title={category?.name || 'বিভাগ'}
        description={category?.description || `${category?.name || 'খবর'} সম্পর্কিত সর্বশেষ সংবাদ ও বিশ্লেষণ`}
      />

      {/* Category Header */}
      <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-2 h-8 rounded-full"
            style={{ backgroundColor: category?.color || '#991b1b' }}
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-950 dark:text-white">
            {category?.name}
          </h1>
        </div>
        {category?.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
            {category.description}
          </p>
        )}

        {/* Subcategories Filter Pills */}
        {category?.subcategories && category.subcategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4 text-xs font-semibold">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3 py-1.5 rounded-full transition ${selectedSubcategory === 'all' ? 'bg-rose-900 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
            >
              সব {category.name}
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-3 py-1.5 rounded-full transition ${selectedSubcategory === sub ? 'bg-rose-900 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      <AdSlot placement="header_top" />

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
        {/* Main 8 Cols: Articles */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="text-center py-20 text-slate-500">সংবাদ লোড হচ্ছে...</div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 text-base">এই বিভাগে কোনো সংবাদ পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category Lead Story */}
              {leadStory && (
                <div
                  onClick={() => navigate(`/article/${leadStory.slug}`)}
                  className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition"
                >
                  <div className="aspect-16/9 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={leadStory.featuredImage}
                      alt={leadStory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <span className="font-semibold text-rose-800 dark:text-rose-400">
                        {leadStory.reporter || leadStory.authorName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {getRelativeTimeBangla(leadStory.publishedAt)}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-950 dark:text-white group-hover:text-rose-800 dark:group-hover:text-rose-400 transition-colors leading-tight mb-2">
                      {leadStory.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
                      {leadStory.excerpt}
                    </p>
                  </div>
                </div>
              )}

              {/* Grid of Remaining Articles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {remainingStories.map((item) => (
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
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                          {getRelativeTimeBangla(item.publishedAt)}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-3">
                    পৃষ্ঠা {toBanglaNumeral(page)} / {toBanglaNumeral(totalPages)}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 4 Cols: Sidebar */}
        <div className="lg:col-span-4">
          <TrendingSidebar articles={allArticles} />
        </div>
      </div>
    </main>
  );
};
