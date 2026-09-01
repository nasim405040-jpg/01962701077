import React, { useState } from 'react';
import { Category } from '../../types.ts';
import { api } from '../../lib/api.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { toBanglaNumeral } from '../../utils/banglaUtils.ts';
import { FolderTree, Plus, Edit, Trash2, Check, X } from 'lucide-react';

export const AdminCategoryManager: React.FC = () => {
  const { categories, refreshData, showToast } = useNews();
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [subcatInput, setSubcatInput] = useState('');

  const handleStartNew = () => {
    setEditingCat({
      name: '',
      slug: '',
      description: '',
      order: categories.length + 1,
      showInNav: true,
      color: '#991b1b',
      subcategories: [],
    });
    setIsNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat?.name || !editingCat.slug) {
      showToast('ক্যাটাগরির নাম ও স্লাগ আবশ্যক', 'error');
      return;
    }

    try {
      if (isNew) {
        await api.createCategory(editingCat);
        showToast('নতুন ক্যাটাগরি তৈরি হয়েছে', 'success');
      } else if (editingCat.id) {
        await api.updateCategory(editingCat.id, editingCat);
        showToast('ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে', 'success');
      }
      setEditingCat(null);
      setIsNew(false);
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই ক্যাটাগরি মুছে ফেলতে চান?')) return;
    try {
      await api.deleteCategory(id);
      showToast('ক্যাটাগরি মুছে ফেলা হয়েছে', 'success');
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'মুছে ফেলতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleAddSubcat = () => {
    if (subcatInput.trim() && editingCat) {
      setEditingCat({
        ...editingCat,
        subcategories: [...(editingCat.subcategories || []), subcatInput.trim()],
      });
      setSubcatInput('');
    }
  };

  const handleRemoveSubcat = (sub: string) => {
    if (editingCat) {
      setEditingCat({
        ...editingCat,
        subcategories: editingCat.subcategories?.filter((s) => s !== sub) || [],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-serif text-slate-950 dark:text-white">
            ক্যাটাগরি ও সংবাদ বিভাগ ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-slate-500">
            মোট বিভাগ: {toBanglaNumeral(categories.length)} টি
          </p>
        </div>
        <button
          onClick={handleStartNew}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ক্যাটাগরি তৈরি করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category List (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">ক্রম</th>
                <th className="p-3">বিভাগের নাম</th>
                <th className="p-3">স্লাগ (Slug)</th>
                <th className="p-3">উপ-বিভাগসমূহ</th>
                <th className="p-3 text-center">মেনুতে প্রদর্শন</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-mono font-bold text-slate-400">
                    {toBanglaNumeral(idx + 1)}
                  </td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color || '#991b1b' }}
                    />
                    <span>{cat.name}</span>
                  </td>
                  <td className="p-3 font-mono text-slate-500">{cat.slug}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {cat.subcategories && cat.subcategories.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {cat.subcategories.slice(0, 3).map((sub) => (
                          <span
                            key={sub}
                            className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {cat.showInNav ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        হ্যাঁ
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]">
                        না
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingCat(cat);
                          setIsNew(false);
                        }}
                        className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-900 hover:text-white transition"
                        title="সম্পাদনা"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 hover:bg-rose-900 hover:text-white transition"
                        title="মুছে ফেলুন"
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

        {/* Create / Edit Form Drawer (4 cols) */}
        <div className="lg:col-span-4">
          {editingCat ? (
            <form
              onSubmit={handleSave}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {isNew ? 'নতুন ক্যাটাগরি তৈরি' : 'ক্যাটাগরি সম্পাদনা'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বিভাগের নাম (বাংলায়) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: জাতীয়, অর্থনীতি"
                  value={editingCat.name || ''}
                  onChange={(e) =>
                    setEditingCat({
                      ...editingCat,
                      name: e.target.value,
                      slug: isNew
                        ? e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                        : editingCat.slug,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  স্লাগ (URL Slug) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: national, economy"
                  value={editingCat.slug || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বিবরণ
                </label>
                <textarea
                  rows={2}
                  value={editingCat.description || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অ্যাকসেন্ট কালার কোড
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingCat.color || '#991b1b'}
                    onChange={(e) => setEditingCat({ ...editingCat, color: e.target.value })}
                    className="w-9 h-9 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingCat.color || '#991b1b'}
                    onChange={(e) => setEditingCat({ ...editingCat, color: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono dark:text-white"
                  />
                </div>
              </div>

              {/* Subcategories Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  উপ-বিভাগ যোগ করুন
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="উপ-বিভাগের নাম..."
                    value={subcatInput}
                    onChange={(e) => setSubcatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubcat())}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcat}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold"
                  >
                    যোগ
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {editingCat.subcategories?.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] flex items-center gap-1"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubcat(sub)}
                        className="hover:text-rose-600 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCat.showInNav}
                    onChange={(e) => setEditingCat({ ...editingCat, showInNav: e.target.checked })}
                    className="rounded text-rose-800"
                  />
                  <span>মূল ন্যাভিগেশন মেনুতে প্রদর্শন করুন</span>
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs shadow-sm transition"
                >
                  {isNew ? 'ক্যাটাগরি তৈরি করুন' : 'আপডেট করুন'}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              ক্যাটাগরি সম্পাদনা করতে তালিকার এডিট বাটনে ক্লিক করুন অথবা নতুন তৈরি করুন।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
