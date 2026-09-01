import React, { useState, useEffect } from 'react';
import { Comment } from '../../types.ts';
import { api } from '../../lib/api.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { getRelativeTimeBangla } from '../../utils/banglaUtils.ts';
import { MessageSquare, Check, X, Trash2, ShieldAlert } from 'lucide-react';

export const AdminComments: React.FC = () => {
  const { showToast } = useNews();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await api.getComments();
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleStatusChange = async (id: string, status: 'approved' | 'pending' | 'spam') => {
    try {
      await api.updateCommentStatus(id, status);
      showToast(`মন্তব্যের স্ট্যাটাস পরিবর্তন করা হয়েছে`, 'success');
      loadComments();
    } catch (err: any) {
      showToast(err.message || 'ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('মন্তব্যটি সম্পূর্ণ মুছে ফেলতে চান?')) return;
    try {
      await api.deleteComment(id);
      showToast('মন্তব্য মুছে ফেলা হয়েছে', 'success');
      loadComments();
    } catch (err: any) {
      showToast(err.message || 'ব্যর্থ হয়েছে', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold font-serif text-slate-950 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-rose-800" />
          <span>পাঠকের মন্তব্য মডারেশন (Comment Moderation)</span>
        </h2>
        <p className="text-xs text-slate-500">
          সংবাদে পাঠকদের পাঠানো মতামত অনুমোদন বা বাতিল করার নিয়ন্ত্রণ প্যানেল
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3">মন্তব্যকারী ও ইমেইল</th>
              <th className="p-3">মন্তব্য বিষয়বস্তু</th>
              <th className="p-3">সংবাদ আইডি</th>
              <th className="p-3">সময়</th>
              <th className="p-3">স্ট্যাটাস</th>
              <th className="p-3 text-right">মডারেশন অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {comments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  বর্তমানে কোনো মন্তব্য জমা নেই।
                </td>
              </tr>
            ) : (
              comments.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">{c.authorName}</p>
                    <p className="text-[10px] text-slate-400">{c.authorEmail}</p>
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 max-w-sm">
                    {c.content}
                  </td>
                  <td className="p-3 font-mono text-slate-400">{c.articleId}</td>
                  <td className="p-3 text-slate-400">{getRelativeTimeBangla(c.createdAt)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : c.status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {c.status === 'approved'
                        ? 'অনুমোদিত'
                        : c.status === 'rejected'
                        ? 'বাতিল'
                        : 'অপেক্ষমান'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {c.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(c.id, 'approved')}
                          className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 hover:bg-emerald-600 hover:text-white transition"
                          title="অনুমোদন করুন"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {c.status !== 'spam' && (
                        <button
                          onClick={() => handleStatusChange(c.id, 'spam')}
                          className="p-1.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 hover:bg-amber-600 hover:text-white transition"
                          title="স্প্যাম / বাতিল করুন"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 hover:bg-rose-900 hover:text-white transition"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
