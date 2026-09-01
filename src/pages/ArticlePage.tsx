import React, { useEffect, useState } from 'react';
import { Article } from '../types.ts';
import { api } from '../lib/api.ts';
import { useNews } from '../context/NewsContext.tsx';
import {
  formatBanglaDate,
  formatBanglaTime,
  getReadingTimeBangla,
  toBanglaNumeral,
} from '../utils/banglaUtils.ts';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { ShareButtons } from '../components/common/ShareButtons.tsx';
import { CommentSection } from '../components/news/CommentSection.tsx';
import { TrendingSidebar } from '../components/news/TrendingSidebar.tsx';
import { AdSlot } from '../components/layout/AdSlot.tsx';
import {
  Clock,
  MapPin,
  Eye,
  Bookmark,
  Printer,
  ChevronRight,
  User,
  Share2,
  Sparkles,
  Flame,
  Volume2,
} from 'lucide-react';

interface ArticlePageProps {
  slug: string;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ slug }) => {
  const { navigate, showToast } = useNews();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        setLoading(true);
        const res = await api.getArticle(slug);
        if (res.article) {
          setArticle(res.article);
          setRelatedArticles(res.related || []);
        }

        const popular = await api.getArticles({ limit: 8 });
        setAllArticles(popular.data || []);
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticleData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-rose-800 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-slate-500">সংবাদ লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-2">
          সংবাদটি পাওয়া যায়নি
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          সম্ভবত সংবাদটি স্থানান্তরিত হয়েছে অথবা লিংকটি সঠিক নয়।
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-rose-900 text-white rounded-lg font-bold text-sm"
        >
          প্রচ্ছদে ফিরে যান
        </button>
      </div>
    );
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const fontSizeClass =
    fontSize === 'xlarge'
      ? 'text-xl sm:text-2xl leading-relaxed'
      : fontSize === 'large'
      ? 'text-lg sm:text-xl leading-relaxed'
      : 'text-base sm:text-lg leading-relaxed';

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
      <SEOHead
        title={article.title}
        description={article.excerpt || article.title}
        image={article.featuredImage}
        type="article"
        author={article.reporter || article.authorName}
        publishedTime={article.publishedAt}
        modifiedTime={article.updatedAt}
        category={article.categoryName}
        tags={article.tags}
      />

      {/* Top Banner Ad */}
      <AdSlot placement="article_top" />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 overflow-x-auto no-scrollbar">
        <button onClick={() => navigate('/')} className="hover:text-rose-800">
          প্রচ্ছদ
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button
          onClick={() => navigate(`/category/${article.categorySlug}`)}
          className="font-bold text-rose-800 dark:text-rose-400 hover:underline"
        >
          {article.categoryName}
        </button>
        {article.subcategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{article.subcategory}</span>
          </>
        )}
      </nav>

      {/* Main Grid Layout: Article 8 cols + Sidebar 4 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Article Content */}
        <article className="lg:col-span-8 space-y-6">
          {/* Subtitle / Sholder */}
          {article.subtitle && (
            <h2 className="text-sm sm:text-base font-semibold text-rose-800 dark:text-rose-400 tracking-wide">
              {article.subtitle}
            </h2>
          )}

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-slate-950 dark:text-white leading-[1.3] tracking-tight">
            {article.title}
          </h1>

          {/* Author & Publish Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center font-bold text-rose-800 dark:text-rose-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {article.reporter || article.authorName}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  {article.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-800" />
                      {article.location}
                    </span>
                  )}
                  <span>•</span>
                  <span>{formatBanglaDate(article.publishedAt)}</span>
                  <span>{formatBanglaTime(article.publishedAt)}</span>
                </div>
              </div>
            </div>

            {/* Utility buttons */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 text-xs">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-0.5 rounded ${fontSize === 'normal' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : ''}`}
                >
                  অ
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-0.5 rounded text-sm ${fontSize === 'large' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : ''}`}
                >
                  অ+
                </button>
                <button
                  onClick={() => setFontSize('xlarge')}
                  className={`px-2 py-0.5 rounded text-base ${fontSize === 'xlarge' ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : ''}`}
                >
                  অ++
                </button>
              </div>

              <button
                onClick={() => {
                  setIsSaved(!isSaved);
                  showToast(isSaved ? 'বুকমার্ক থেকে সরানো হয়েছে' : 'সংবাদটি সংরক্ষিত হয়েছে', 'info');
                }}
                className={`p-2 rounded-lg border ${isSaved ? 'bg-rose-900 text-white border-rose-900' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
                title="সংরক্ষণ করুন"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                title="প্রিন্ট করুন"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Featured Image & Caption */}
          <div className="space-y-2">
            <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-800">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            {(article.imageCaption || article.imageCredit) && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 italic">
                <span>{article.imageCaption}</span>
                {article.imageCredit && (
                  <span className="font-semibold not-italic text-slate-600 dark:text-slate-300">
                    ছবি: {article.imageCredit}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Social Share Strip */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <ShareButtons url={currentUrl} title={article.title} />
          </div>

          {/* Article Full Body */}
          <div className={`prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 ${fontSizeClass}`}>
            {article.content.split('\n\n').map((paragraph, index) => {
              // Inject an Ad in the middle of paragraphs
              if (index === 2) {
                return (
                  <React.Fragment key={index}>
                    <p>{paragraph}</p>
                    <div className="my-6">
                      <AdSlot placement="article_middle" />
                    </div>
                  </React.Fragment>
                );
              }
              return <p key={index}>{paragraph}</p>;
            })}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500">ট্যাগ:</span>
                {article.tags.map((t) => (
                  <button
                    key={t}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(t)}`)}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-900 hover:text-white text-xs font-medium text-slate-700 dark:text-slate-300 transition"
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Ad */}
          <AdSlot placement="article_bottom" />

          {/* Related News Carousel / Grid */}
          {relatedArticles.length > 0 && (
            <div className="pt-8 border-t-2 border-rose-900/30">
              <h3 className="text-xl font-bold font-serif text-slate-950 dark:text-white mb-4">
                সম্পর্কিত অন্যান্য সংবাদ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => navigate(`/article/${rel.slug}`)}
                    className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="aspect-16/9 overflow-hidden bg-slate-100">
                      <img
                        src={rel.featuredImage}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold font-serif text-slate-900 dark:text-white group-hover:text-rose-800 dark:group-hover:text-rose-400 line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="pt-6">
            <CommentSection articleId={article.id} />
          </div>
        </article>

        {/* Right Column (4 cols): Trending Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <TrendingSidebar articles={allArticles} />
        </div>
      </div>
    </main>
  );
};
