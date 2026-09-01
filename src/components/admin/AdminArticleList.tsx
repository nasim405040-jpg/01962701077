import React, { useState, useEffect } from 'react';
import { Article, Category } from '../../types.ts';
import { api } from '../../lib/api.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { toBanglaNumeral, getRelativeTimeBangla } from '../../utils/banglaUtils.ts';
import {
  Search,
  Filter,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  CheckSquare,
  Square,
  Flame,
  Star,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Share2,
} from 'lucide-react';

interface AdminArticleListProps {
  onNavigateTab: (tab: string, articleId?: string) => void;
}

export const AdminArticleList: React.FC<AdminArticleListProps> = ({ onNavigateTab }) => {
  const { categories, showToast } = useNews();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  const loadArticles = async () => {
    try {
      setLoading(true);
      const res = await api.getArticles({
        all: true,
        search: search || undefined,
        categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setArticles(res.data || []);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [search, categoryFilter, statusFilter]);

  const handleSelectAll = () => {
    if (selectedIds.length === articles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(articles.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkExecute = async () => {
    if (!bulkAction || selectedIds.length === 0) return;
    try {
      const res = await api.bulkActionArticles(selectedIds, bulkAction);
      showToast(`${toBanglaNumeral(res.affected)} টি সংবাদে অ্যাকশন সম্পন্ন হয়েছে`, 'success');
      setBulkAction('');
      loadArticles();
    } catch (err: any) {
      showToast(err.message || 'অ্যাকশন ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDeleteSingle = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই সংবাদটি মুছে ফেলতে চান?')) return;
    try {
      await api.deleteArticle(id);
      showToast('সংবাদটি সফলভাবে মুছে ফেলা হয়েছে', 'success');
      loadArticles();
    } catch (err: any) {
      showToast(err.message || 'মুছে ফেলতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleToggleFlag = async (article: Article, flag: 'isBreaking' | 'isFeatured' | 'isEditorPick') => {
    try {
      const updated = await api.updateArticle(article.id, {
        [flag]: !article[flag],
      });
      setArticles((prev) => prev.map((a) => (a.id === article.id ? updated : a)));
      showToast('স্ট্যাটাস আপডেট করা হয়েছে', 'success');
    } catch (err: any) {
      showToast(err.message || 'আপডেট ব্যর্থ হয়েছে', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-serif text-slate-950 dark:text-white">
            সংবাদ তালিকা ও প্রকাশনা ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            মোট সংবাদ: {toBanglaNumeral(articles.length)} টি
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('new_article')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন সংবাদ যোগ করুন</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="শিরোনাম বা কী-ওয়ার্ড দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs dark:text-white focus:outline-none"
          >
            <option value="all">সকল বিভাগ</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs dark:text-white focus:outline-none"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="published">প্রকাশিত (Published)</option>
            <option value="draft">খসড়া (Draft)</option>
            <option value="archived">আর্কাইভ (Archived)</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar (Active when items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center justify-between gap-4 text-xs">
          <span className="font-bold text-rose-900 dark:text-rose-300">
            {toBanglaNumeral(selectedIds.length)} টি সংবাদ নির্বাচিত হয়েছে
          </span>
          <div className="flex items-center gap-2">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-800 text-xs dark:text-white font-medium"
            >
              <option value="">বাল্ক অ্যাকশন বেছে নিন</option>
              <option value="publish">সরাসরি প্রকাশ করুন (Publish)</option>
              <option value="draft">খসড়া করুন (Draft)</option>
              <option value="delete">মুছে ফেলুন (Trash)</option>
            </select>
            <button
              onClick={handleBulkExecute}
              className="px-4 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-950 text-white font-bold transition"
            >
              প্রয়োগ করুন
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3 w-10 text-center">
                  <button onClick={handleSelectAll} className="p-1">
                    {selectedIds.length > 0 && selectedIds.length === articles.length ? (
                      <CheckSquare className="w-4 h-4 text-rose-800" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="p-3">সংবাদ ও শিরোনাম</th>
                <th className="p-3">বিভাগ</th>
                <th className="p-3">প্রতিবেদক</th>
                <th className="p-3">ভিউ সংখ্যা</th>
                <th className="p-3">স্ট্যাটাস</th>
                <th className="p-3">ট্যাগ / ফিচার</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    কোনো সংবাদ খুঁজে পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                articles.map((art) => {
                  const isSelected = selectedIds.includes(art.id);
                  return (
                    <tr
                      key={art.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                        isSelected ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleToggleSelect(art.id)}
                          className="p-1"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-rose-800" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* Image & Title */}
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={art.featuredImage}
                            alt=""
                            className="w-12 h-9 rounded object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                          />
                          <div className="max-w-md">
                            <span className="font-bold text-slate-900 dark:text-white line-clamp-1 block text-sm">
                              {art.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {getRelativeTimeBangla(art.publishedAt)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                        {art.categoryName}
                      </td>

                      {/* Author */}
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        {art.reporter || art.authorName}
                      </td>

                      {/* Views */}
                      <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                        {toBanglaNumeral(art.viewsCount || 0)}
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            art.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {art.status === 'published' ? 'প্রকাশিত' : 'খসড়া'}
                        </span>
                      </td>

                      {/* Quick Flag Toggles */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleFlag(art, 'isBreaking')}
                            className={`p-1 rounded transition ${art.isBreaking ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-600'}`}
                            title="ব্রেকিং নিউজ টগল"
                          >
                            <Flame className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleFlag(art, 'isFeatured')}
                            className={`p-1 rounded transition ${art.isFeatured ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-purple-600'}`}
                            title="ফিচার্ড টগল"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleFlag(art, 'isEditorPick')}
                            className={`p-1 rounded transition ${art.isEditorPick ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500'}`}
                            title="স্পেশাল চয়েস টগল"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onNavigateTab('audience_reach')}
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-700 hover:text-white transition"
                            title="অডিয়েন্স রিচ ও সোশ্যাল ব্রডকাস্ট"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onNavigateTab('edit_article', art.id)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-900 hover:text-white transition"
                            title="সম্পাদনা"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSingle(art.id)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 hover:bg-rose-900 hover:text-white transition"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
