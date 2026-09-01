import React, { useState, useEffect } from 'react';
import { MediaItem } from '../../types.ts';
import { api } from '../../lib/api.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { Image as ImageIcon, Plus, Copy, Trash2, Check, ExternalLink } from 'lucide-react';

export const AdminMediaLibrary: React.FC = () => {
  const { showToast } = useNews();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [newCredit, setNewCredit] = useState('সত্যবাণী আলোকচিত্র');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await api.getMedia();
      setMedia(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    try {
      await api.createMedia({
        url: newUrl.trim(),
        altText: newAlt.trim() || 'সংবাদ ছবি',
        credit: newCredit.trim() || 'সত্যবাণী',
      });
      showToast('ছবি লাইব্রেরিতে যুক্ত হয়েছে', 'success');
      setNewUrl('');
      setNewAlt('');
      loadMedia();
    } catch (err: any) {
      showToast(err.message || 'ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('ছবির লিংক কপি করা হয়েছে', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-serif text-slate-950 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-rose-800" />
            <span>মিডিয়া ও ফটো লাইব্রেরি</span>
          </h2>
          <p className="text-xs text-slate-500">
            সংবাদে ব্যবহারের জন্য ছবি সংরক্ষণ ও কপি করার ডিজিটাল আর্কাইভ
          </p>
        </div>
      </div>

      {/* Upload/Add Form */}
      <form
        onSubmit={handleAddMedia}
        className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-end"
      >
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            ছবির অনলাইন লিংক (Image URL) *
          </label>
          <input
            type="text"
            required
            placeholder="https://images.unsplash.com/..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
          />
        </div>
        <div className="w-full sm:w-48">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            ক্যাপশন / Alt Text
          </label>
          <input
            type="text"
            placeholder="সংক্ষিপ্ত বর্ণনা..."
            value={newAlt}
            onChange={(e) => setNewAlt(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
          />
        </div>
        <div className="w-full sm:w-48">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            ক্রেডিট
          </label>
          <input
            type="text"
            value={newCredit}
            onChange={(e) => setNewCredit(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2 rounded-lg bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>যোগ করুন</span>
        </button>
      </form>

      {/* Grid of Media */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={item.url}
                alt={item.altText || ''}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-2 text-[10px] space-y-1">
              <p className="text-slate-800 dark:text-slate-200 font-bold truncate">
                {item.altText || 'ছবি'}
              </p>
              <p className="text-slate-400 truncate">{item.credit}</p>
            </div>
            <div className="p-2 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleCopy(item.url, item.id)}
                className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-900 hover:text-white text-[10px] flex items-center gap-1 font-semibold"
                title="URL কপি করুন"
              >
                {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === item.id ? 'কপি হয়েছে' : 'লিংক'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
