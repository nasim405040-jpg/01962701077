import React, { useEffect, useState } from 'react';
import { AnalyticsSummary, Article, SystemLog } from '../../types.ts';
import { api } from '../../lib/api.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { toBanglaNumeral, getRelativeTimeBangla } from '../../utils/banglaUtils.ts';
import {
  FileText,
  Eye,
  CheckCircle,
  Clock,
  FolderTree,
  BadgePercent,
  PlusCircle,
  Flame,
  Activity,
  ArrowUpRight,
  Sparkles,
  Share2,
  Cloud,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string, articleId?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { showToast, currentUser } = useNews();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  const isEditor = currentUser?.role === 'editor';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsData, articlesData, logsData] = await Promise.all([
        api.getAnalytics(),
        api.getArticles({ all: true, limit: 8 }),
        api.getLogs(),
      ]);
      setAnalytics(analyticsData);
      setRecentArticles(articlesData.data || []);
      setLogs(logsData.slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">ড্যাশবোর্ড ডেটা লোড হচ্ছে...</div>;
  }

  const statCards = [
    {
      title: 'মোট সংবাদ',
      value: toBanglaNumeral(analytics?.totalArticles || 0),
      subtitle: `প্রকাশিত: ${toBanglaNumeral(analytics?.publishedArticles || 0)} টি`,
      icon: FileText,
      color: 'from-blue-600 to-blue-700',
      tab: 'articles',
    },
    {
      title: 'মোট পাঠ সংখ্যা (ভিউ)',
      value: toBanglaNumeral(analytics?.totalViews || 0),
      subtitle: 'আজকে সক্রিয় পাঠক বৃদ্ধি +১৮%',
      icon: Eye,
      color: 'from-emerald-600 to-emerald-700',
      tab: 'articles',
    },
    {
      title: 'ক্যাটাগরি ও বিভাগ',
      value: toBanglaNumeral(analytics?.totalCategories || 0),
      subtitle: 'জাতীয় ও আন্তর্জাতিক বিভাগ',
      icon: FolderTree,
      color: 'from-purple-600 to-purple-700',
      tab: 'categories',
    },
    {
      title: isEditor ? 'মন্তব্য ও রিঅ্যাকশন' : 'বিজ্ঞাপন স্লট',
      value: toBanglaNumeral(isEditor ? 48 : analytics?.activeAds || 0),
      subtitle: isEditor ? 'পাঠকদের সক্রিয় মতামত' : 'সক্রিয় অ্যাড ব্যানার ও Adsterra',
      icon: BadgePercent,
      color: 'from-amber-600 to-amber-700',
      tab: isEditor ? 'comments' : 'ads',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-2xl font-extrabold font-serif text-slate-950 dark:text-white flex items-center gap-2">
            <span>{isEditor ? '✍️ সম্পাদকীয় নিয়ন্ত্রণ কক্ষ' : '👑 সুপার অ্যাডমিন কমান্ড সেন্টার'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isEditor
              ? 'বার্তা ও সংবাদ প্রকাশনা পোর্টাল ওভারভিউ'
              : 'সত্যবাণী ডিজিটাল নিউজ প্ল্যাটফর্ম ওভারভিউ ও প্রশাসন'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('new_article')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold transition shadow-sm ${
              isEditor ? 'bg-blue-900 hover:bg-blue-950' : 'bg-rose-900 hover:bg-rose-950'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন সংবাদ তৈরি</span>
          </button>
          <button
            onClick={() => onNavigateTab('audience_reach')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>অডিয়েন্স রিচ হাব</span>
          </button>
          {!isEditor && (
            <button
              onClick={() => onNavigateTab('netlify_hub')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition shadow-sm border border-slate-700"
            >
              <Cloud className="w-4 h-4" />
              <span>Netlify ফাইল</span>
            </button>
          )}
          <button
            onClick={() => onNavigateTab('breaking')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm"
          >
            <Flame className="w-4 h-4" />
            <span>ব্রেকিং এলার্ট</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigateTab(stat.tab)}
              className="group cursor-pointer bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-rose-800/40 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white font-mono">
                {stat.value}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <span>{stat.subtitle}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-800 transition" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Articles & System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Articles (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <h3 className="text-lg font-bold font-serif text-slate-950 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-800" />
              <span>সাম্প্রতিক প্রকাশিত ও খসড়া সংবাদ</span>
            </h3>
            <button
              onClick={() => onNavigateTab('articles')}
              className="text-xs font-bold text-rose-800 dark:text-rose-400 hover:underline"
            >
              সবগুলো দেখুন ({toBanglaNumeral(recentArticles.length)})
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentArticles.slice(0, 6).map((art) => (
              <div
                key={art.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-lg transition"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-14 h-11 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    <img
                      src={art.featuredImage}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-0.5">
                      <span className="font-bold text-rose-800 dark:text-rose-400">
                        {art.categoryName}
                      </span>
                      <span>•</span>
                      <span>{getRelativeTimeBangla(art.publishedAt)}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {art.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      art.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {art.status === 'published' ? 'প্রকাশিত' : 'খসড়া'}
                  </span>
                  <button
                    onClick={() => onNavigateTab('edit_article', art.id)}
                    className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-rose-900 hover:text-white transition"
                  >
                    সম্পাদনা
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity Logs (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <h3 className="text-base font-bold font-serif text-slate-950 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>কার্যক্রমের রেকর্ড (Logs)</span>
            </h3>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{log.action}</span>
                  <span>{getRelativeTimeBangla(log.timestamp)}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-snug">{log.details}</p>
                <span className="text-[10px] text-rose-800 dark:text-rose-400 font-semibold block mt-1">
                  দ্বারা: {log.userName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
