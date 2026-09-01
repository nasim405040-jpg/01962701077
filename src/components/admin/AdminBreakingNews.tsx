import React, { useState } from 'react';
import { BreakingNews } from '../../types.ts';
import { api } from '../../lib/api.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { toBanglaNumeral } from '../../utils/banglaUtils.ts';
import { Flame, Plus, Trash2, Edit, Check, X, AlertCircle } from 'lucide-react';

export const AdminBreakingNews: React.FC = () => {
  const { breakingNews, refreshData, showToast } = useNews();
  const [editingItem, setEditingItem] = useState<Partial<BreakingNews> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const handleStartNew = () => {
    setEditingItem({
      title: '',
      link: '/',
      category: 'ব্রেকিং',
      priority: 1,
      isActive: true,
    });
    setIsNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title?.trim()) {
      showToast('ব্রেকিং নিউজের শিরোনাম আবশ্যক', 'error');
      return;
    }

    try {
      if (isNew) {
        await api.createBreakingNews(editingItem);
        showToast('ব্রেকিং নিউজ যুক্ত হয়েছে', 'success');
      } else if (editingItem.id) {
        await api.updateBreakingNews(editingItem.id, editingItem);
        showToast('ব্রেকিং নিউজ আপডেট করা হয়েছে', 'success');
      }
      setEditingItem(null);
      setIsNew(false);
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('মুছে ফেলতে চান?')) return;
    try {
      await api.deleteBreakingNews(id);
      showToast('মুছে ফেলা হয়েছে', 'success');
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleToggleActive = async (item: BreakingNews) => {
    try {
      await api.updateBreakingNews(item.id, { isActive: !item.isActive });
      showToast('স্ট্যাটাস পরিবর্তিত হয়েছে', 'success');
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'ব্যর্থ হয়েছে', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-serif text-slate-950 dark:text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-red-600" />
            <span>ব্রেকিং নিউজ ও স্ক্রল টিকিং পরিচালনা</span>
          </h2>
          <p className="text-xs text-slate-500">
            ওয়েবসাইটের শীর্ষে লাল ব্রেকিং নিউজ বারে প্রদর্শিত তাজা খবরের তালিকা
          </p>
        </div>
        <button
          onClick={handleStartNew}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ব্রেকিং নিউজ যোগ করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">শিরোনাম</th>
                <th className="p-3">ট্যাগ / বিভাগ</th>
                <th className="p-3">লিংক</th>
                <th className="p-3 text-center">সক্রিয় অবস্থা</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {breakingNews.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold text-slate-900 dark:text-white max-w-sm">
                    {item.title}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-semibold text-[10px]">
                      {item.category || 'ব্রেকিং'}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-500 truncate max-w-[150px]">
                    {item.link || '/'}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                        item.isActive
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      {item.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsNew(false);
                        }}
                        className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-900 hover:text-white transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 hover:bg-rose-900 hover:text-white transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Editor Form (4 cols) */}
        <div className="lg:col-span-4">
          {editingItem ? (
            <form
              onSubmit={handleSave}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {isNew ? 'নতুন ব্রেকিং নিউজ' : 'ব্রেকিং নিউজ সম্পাদনা'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="p-1 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ব্রেকিং নিউজ শিরোনাম *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="মুহূর্তের জরুরি সংবাদ শিরোনাম..."
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সংবাদের লিংক (URL বা পাথ)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: /article/sample-slug"
                  value={editingItem.link || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ট্যাগ / ক্যাটাগরি লেবেল
                </label>
                <input
                  type="text"
                  placeholder="যেমন: জাতীয় / জরুরি / ব্রেকিং"
                  value={editingItem.category || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isActive}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isActive: e.target.checked })
                    }
                    className="rounded text-rose-800"
                  />
                  <span>সরাসরি টিকারে প্রদর্শন করুন (Active)</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              ব্রেকিং নিউজ সম্পাদনা বা সংযোজনের জন্য বাটন ব্যবহার করুন।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
