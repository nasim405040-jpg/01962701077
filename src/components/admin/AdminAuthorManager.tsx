import React, { useState, useEffect } from 'react';
import { Author } from '../../types.ts';
import { api } from '../../lib/api.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { Users, Plus, Edit, Trash2, Mail, Shield, UserCheck } from 'lucide-react';

export const AdminAuthorManager: React.FC = () => {
  const { showToast } = useNews();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [editingAuthor, setEditingAuthor] = useState<Partial<Author> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const data = await api.getAuthors();
      setAuthors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleStartNew = () => {
    setEditingAuthor({
      name: '',
      nameEn: '',
      designation: 'প্রতিবেদক',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: '',
      email: '',
      isColumnist: false,
    });
    setIsNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor?.name || !editingAuthor.designation) {
      showToast('নাম ও পদবি আবশ্যক', 'error');
      return;
    }

    try {
      if (isNew) {
        await api.createAuthor(editingAuthor);
        showToast('নতুন প্রতিবেদক যোগ করা হয়েছে', 'success');
      } else if (editingAuthor.id) {
        await api.updateAuthor(editingAuthor.id, editingAuthor);
        showToast('প্রোফাইল আপডেট হয়েছে', 'success');
      }
      setEditingAuthor(null);
      setIsNew(false);
      loadAuthors();
    } catch (err: any) {
      showToast(err.message || 'ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('মুছে ফেলতে চান?')) return;
    try {
      await api.deleteAuthor(id);
      showToast('মুছে ফেলা হয়েছে', 'success');
      loadAuthors();
    } catch (err: any) {
      showToast(err.message || 'ব্যর্থ হয়েছে', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-serif text-slate-950 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-800" />
            <span>প্রতিবেদক, সাংবাদিক ও কলামিস্ট তালিকা</span>
          </h2>
          <p className="text-xs text-slate-500">
            নিউজ টিমের লেখক ও সংবাদদাতাদের প্রোফাইল ম্যানেজমেন্ট
          </p>
        </div>
        <button
          onClick={handleStartNew}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সদস্য যোগ করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grid List (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {authors.map((auth) => (
            <div
              key={auth.id}
              className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3"
            >
              <img
                src={auth.avatar}
                alt={auth.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {auth.name}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingAuthor(auth);
                        setIsNew(false);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-800"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(auth.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-rose-800 dark:text-rose-400 font-medium mb-1">
                  {auth.designation}
                </p>
                {auth.bio && (
                  <p className="text-[11px] text-slate-500 line-clamp-2">{auth.bio}</p>
                )}
                {auth.email && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-2">
                    <Mail className="w-3 h-3" />
                    {auth.email}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Editor Form (4 cols) */}
        <div className="lg:col-span-4">
          {editingAuthor ? (
            <form
              onSubmit={handleSave}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <h3 className="font-bold text-slate-900 dark:text-white text-sm border-b pb-2">
                {isNew ? 'নতুন প্রতিবেদক যুক্ত করুন' : 'প্রোফাইল সম্পাদনা'}
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  নাম (বাংলায়) *
                </label>
                <input
                  type="text"
                  required
                  value={editingAuthor.name || ''}
                  onChange={(e) => setEditingAuthor({ ...editingAuthor, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পদবি / ডেজিগনেশন *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: জ্যেষ্ঠ প্রতিবেদক, কলামিস্ট"
                  value={editingAuthor.designation || ''}
                  onChange={(e) =>
                    setEditingAuthor({ ...editingAuthor, designation: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রোফাইল ছবির URL
                </label>
                <input
                  type="text"
                  value={editingAuthor.avatar || ''}
                  onChange={(e) => setEditingAuthor({ ...editingAuthor, avatar: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ইমেইল
                </label>
                <input
                  type="email"
                  value={editingAuthor.email || ''}
                  onChange={(e) => setEditingAuthor({ ...editingAuthor, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সংক্ষিপ্ত বায়ো
                </label>
                <textarea
                  rows={3}
                  value={editingAuthor.bio || ''}
                  onChange={(e) => setEditingAuthor({ ...editingAuthor, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs shadow-sm transition"
                >
                  প্রোফাইল সংরক্ষণ করুন
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              সদস্য নির্বাচন করুন বা নতুন যোগ করুন।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
