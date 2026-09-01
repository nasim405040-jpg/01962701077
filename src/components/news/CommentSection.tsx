import React, { useState, useEffect } from 'react';
import { Comment } from '../../types.ts';
import { api } from '../../lib/api.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { getRelativeTimeBangla, toBanglaNumeral } from '../../utils/banglaUtils.ts';
import { MessageSquare, ThumbsUp, Send, User, CheckCircle2 } from 'lucide-react';

interface CommentSectionProps {
  articleId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ articleId }) => {
  const { showToast } = useNews();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await api.getComments(articleId);
      setComments(data.filter((c) => c.status === 'approved'));
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    try {
      await api.createComment({
        articleId,
        userName: name.trim(),
        userEmail: email.trim() || 'reader@example.com',
        authorName: name.trim(),
        authorEmail: email.trim() || 'reader@example.com',
        content: content.trim(),
      });
      setSubmitted(true);
      setContent('');
      showToast('আপনার মন্তব্যটি পর্যালোচনার জন্য জমা দেওয়া হয়েছে।', 'success');
      loadComments();
    } catch (err: any) {
      showToast(err.message || 'মন্তব্য পাঠাতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const updated = await api.likeComment(commentId);
      setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
      showToast('ধন্যবাদ!', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="comments" className="my-8 pt-6 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-rose-800 dark:text-rose-400" />
        <h3 className="text-xl font-bold font-serif text-slate-950 dark:text-white">
          মন্তব্য ({toBanglaNumeral(comments.length)})
        </h3>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mb-8">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          আপনার মূল্যবান মতামত প্রকাশ করুন:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            required
            placeholder="আপনার নাম *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
          />
          <input
            type="email"
            placeholder="ইমেইল (ঐচ্ছিক / অপ্রকাশিত থাকবে)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
          />
        </div>
        <textarea
          required
          rows={3}
          placeholder="আপনার সুচিন্তিত মন্তব্য লিখুন... (শালীন ও যুক্তিসঙ্গত ভাষা ব্যবহার কাম্য)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800 mb-3"
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            * নীতিমালা বিরোধী বা আক্রমণাত্মক মন্তব্য মুছে ফেলা হতে পারে।
          </span>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold transition shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>মন্তব্য প্রকাশ করুন</span>
          </button>
        </div>
        {submitted && (
          <div className="mt-3 p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>আপনার মন্তব্যটি সফলভাবে জমা হয়েছে! সম্পাদকের পর্যালোচনার পর এটি দৃশ্যমান হবে।</span>
          </div>
        )}
      </form>

      {/* List of Comments */}
      {loading ? (
        <div className="text-center py-6 text-sm text-slate-400">মন্তব্য লোড হচ্ছে...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          এখনও কোনো মন্তব্য করা হয়নি। আপনিই প্রথম মন্তব্যকারী হোন!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 flex items-center justify-center font-bold text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {c.authorName}
                    </h5>
                    <span className="text-[10px] text-slate-400">
                      {getRelativeTimeBangla(c.createdAt)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleLike(c.id)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-800 dark:hover:text-rose-400 transition"
                  title="পছন্দ করুন"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{toBanglaNumeral(c.likesCount || 0)}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
