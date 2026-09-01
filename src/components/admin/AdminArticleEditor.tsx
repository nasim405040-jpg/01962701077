import React, { useState, useEffect } from 'react';
import { Article, Category, Author } from '../../types.ts';
import { api } from '../../lib/api.ts';
import { useNews } from '../../context/NewsContext.tsx';
import {
  Save,
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  Flame,
  Star,
  CheckCircle2,
  Tag,
  FolderTree,
  User,
  MapPin,
  Eye,
  Camera,
  Bell,
  Share2,
} from 'lucide-react';

interface AdminArticleEditorProps {
  articleId?: string | null;
  onBack: () => void;
}

export const AdminArticleEditor: React.FC<AdminArticleEditorProps> = ({
  articleId,
  onBack,
}) => {
  const { categories, currentUser, showToast } = useNews();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [autoPushNotification, setAutoPushNotification] = useState(true);

  // Form State
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    slug: '',
    subtitle: '',
    excerpt: '',
    content: '',
    featuredImage:
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
    imageCaption: '',
    imageCredit: 'সত্যবাণী আলোকচিত্র',
    categoryId: categories[0]?.id || '',
    categoryName: categories[0]?.name || '',
    categorySlug: categories[0]?.slug || '',
    subcategory: '',
    tags: ['জাতীয়', 'উন্নয়ন', 'বাংলাদেশ'],
    authorName: currentUser?.name || 'সম্পাদকীয় বিভাগ',
    reporter: 'বিশেষ প্রতিনিধি',
    location: 'ঢাকা',
    status: 'published',
    isBreaking: false,
    isFeatured: false,
    isEditorPick: false,
    homepagePlacement: 'standard',
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const authorList = await api.getAuthors();
        setAuthors(authorList);

        if (articleId) {
          setLoading(true);
          const res = await api.getArticle(articleId);
          if (res.article) {
            setFormData(res.article);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [articleId]);

  // Handle auto slug from title if empty
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const generatedSlug = prev.slug && prev.slug.length > 3
        ? prev.slug
        : val
            .toLowerCase()
            .trim()
            .replace(/[^\w\s\u0980-\u09FF-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .slice(0, 80);
      return { ...prev, title: val, slug: generatedSlug };
    });
  };

  const handleCategoryChange = (catId: string) => {
    const selected = categories.find((c) => c.id === catId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        categoryId: selected.id,
        categoryName: selected.name,
        categorySlug: selected.slug,
        subcategory: selected.subcategories?.[0] || '',
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tagToRemove) || [],
    }));
  };

  // AI Headline Generator
  const handleAIGenerateHeadlines = async () => {
    if (!formData.title && !formData.content) {
      showToast('অনুগ্রহ করে আগে শিরোনাম বা ড্রাফট টেক্সট লিখুন', 'warning');
      return;
    }
    try {
      setAiLoading(true);
      const res = await api.suggestHeadline(formData.content || '', formData.title || '');
      setAiSuggestions(res.suggestions || []);
      showToast('এআই সহকারী বিকল্প শিরোনাম তৈরি করেছে', 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // AI Summary Generator
  const handleAIGenerateSummary = async () => {
    if (!formData.content) {
      showToast('সংবাদের মূল অংশ লিখুন', 'warning');
      return;
    }
    try {
      setAiLoading(true);
      const res = await api.generateSummary(formData.title || '', formData.content);
      if (res.summary) {
        setFormData((prev) => ({ ...prev, excerpt: res.summary }));
        showToast('এআই দ্বারা সংক্ষিপ্ত সারসংক্ষেপ তৈরি হয়েছে', 'success');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.content?.trim()) {
      showToast('শিরোনাম ও মূল সংবাদ আবশ্যক', 'error');
      return;
    }

    try {
      setSaving(true);
      let savedArticle: any;
      if (articleId) {
        savedArticle = await api.updateArticle(articleId, formData);
        showToast('সংবাদটি সফলভাবে আপডেট করা হয়েছে', 'success');
      } else {
        savedArticle = await api.createArticle(formData);
        showToast('নতুন সংবাদ সফলভাবে প্রকাশিত হয়েছে', 'success');
      }

      // If user selected auto push notification and status is published
      if (autoPushNotification && formData.status === 'published') {
        try {
          await api.broadcastPush({
            articleId: savedArticle?.id || articleId,
            title: formData.title,
            excerpt: formData.excerpt,
            url: `https://satyabani.com/article/${savedArticle?.slug || formData.slug || ''}`,
            image: formData.featuredImage,
          });
          showToast('📢 সকল গ্রাহকের কাছে পুশ নোটিফিকেশন ব্রডকাস্ট পাঠানো হয়েছে!', 'info');
        } catch (pushErr) {
          console.warn('Auto push failed:', pushErr);
        }
      }

      onBack();
    } catch (err: any) {
      showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">সংবাদ প্রস্তুত হচ্ছে...</div>;
  }

  const selectedCategoryObj = categories.find((c) => c.id === formData.categoryId);

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-950 dark:text-white">
              {articleId ? 'সংবাদ সম্পাদনা' : 'নতুন সংবাদ রচনা ও প্রকাশ'}
            </h2>
            <p className="text-xs text-slate-500">
              {formData.categoryName} বিভাগ • {formData.status === 'published' ? 'সরাসরি প্রকাশ' : 'খসড়া'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold dark:text-white"
          >
            <option value="published">সরাসরি প্রকাশ (Publish)</option>
            <option value="draft">খসড়া রাখুন (Draft)</option>
            <option value="archived">আর্কাইভ (Archive)</option>
          </select>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-rose-900 hover:bg-rose-950 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : articleId ? 'আপডেট করুন' : 'প্রকাশ করুন'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Editor (8 cols) + Right Sidebar Config (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Content Form */}
        <div className="lg:col-span-8 space-y-5">
          {/* Title */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  সংবাদের মূল শিরোনাম *
                </label>
                <button
                  type="button"
                  onClick={handleAIGenerateHeadlines}
                  disabled={aiLoading}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-800 dark:text-rose-400 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI বিকল্প শিরোনাম তৈরি করুন</span>
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="আকর্ষণীয় ও তথ্যনির্ভর বাংলা শিরোনাম লিখুন..."
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-serif text-lg font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>

            {/* AI Suggestions Dropdown if generated */}
            {aiSuggestions.length > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-900/60 rounded-lg text-xs space-y-1.5">
                <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">
                  এআই প্রস্তাবিত বিকল্প শিরোনাম:
                </span>
                {aiSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, title: s.replace(/^\d+\.\s*/, '') })}
                    className="block w-full text-left p-1.5 rounded hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Subtitle / Sholder */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                উপ-শিরোনাম / শোল্ডার (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="সংবাদের প্রেক্ষাপট বা সম্পূরক বার্তা..."
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>

            {/* Excerpt */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  সংক্ষিপ্ত সারসংক্ষেপ (Excerpt)
                </label>
                <button
                  type="button"
                  onClick={handleAIGenerateSummary}
                  disabled={aiLoading}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-800 dark:text-rose-400 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI সারসংক্ষেপ তৈরি</span>
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="সংবাদের মূল ২-৩ বাক্যের সারসংক্ষেপ..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>

            {/* Full Body Content */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                সম্পূর্ণ সংবাদ বিবরণী (বাংলায়) *
              </label>
              <textarea
                rows={14}
                required
                placeholder="এখানে সংবাদের বিস্তারিত বিবরণ লিখুন..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-base leading-relaxed dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800 font-sans"
              />
            </div>
          </div>

          {/* Featured Image & Media Details */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <ImageIcon className="w-4 h-4 text-rose-800" />
              <span>প্রধান ফিচার্ড ছবি ও আলোকচিত্র বিবরণ</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ছবির URL (বা আনস্প্ল্যাশ / সরাসরি লিংক)
              </label>
              <input
                type="text"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white focus:outline-none"
              />
            </div>

            {/* Live Preview of Featured Image */}
            {formData.featuredImage && (
              <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ছবির ক্যাপশন (Caption)
                </label>
                <input
                  type="text"
                  placeholder="ছবির বর্ণনা লিখুন..."
                  value={formData.imageCaption}
                  onChange={(e) => setFormData({ ...formData, imageCaption: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ছবির ক্রেডিট (Photo Credit)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: সত্যবাণী আলোকচিত্র / রয়টার্স"
                  value={formData.imageCredit}
                  onChange={(e) => setFormData({ ...formData, imageCredit: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Metadata & Placement Flags */}
        <div className="lg:col-span-4 space-y-5">
          {/* Category & Subcategory */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5" />
              <span>বিভাগ ও ক্যাটাগরি</span>
            </h4>

            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">
                প্রধান বিভাগ *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategoryObj?.subcategories && selectedCategoryObj.subcategories.length > 0 && (
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">
                  উপ-বিভাগ (Subcategory)
                </label>
                <select
                  value={formData.subcategory || ''}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                >
                  <option value="">কোনো উপ-বিভাগ নয়</option>
                  {selectedCategoryObj.subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Placement & Editorial Badges */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              লেআউট ও হোমপেজ পজিশন
            </h4>

            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                হোমপেজ প্লেসমেন্ট
              </label>
              <select
                value={formData.homepagePlacement}
                onChange={(e) =>
                  setFormData({ ...formData, homepagePlacement: e.target.value as any })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
              >
                <option value="hero_main">প্রচ্ছদের প্রধান লিড স্টোরি (Hero Main)</option>
                <option value="hero_sub">প্রচ্ছদের পার্শ্ব খবর (Hero Secondary)</option>
                <option value="category_lead">ক্যাটাগরি লিড স্টোরি</option>
                <option value="standard">সাধারণ সংবাদ স্ট্রিম (Standard)</option>
              </select>
            </div>

            <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBreaking}
                  onChange={(e) => setFormData({ ...formData, isBreaking: e.target.checked })}
                  className="rounded text-rose-800 focus:ring-rose-800"
                />
                <span className="text-red-600 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  ব্রেকিং নিউজ হিসেবে প্রদর্শন
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-purple-800"
                />
                <span>প্রধান ফিচার্ড সংবাদ</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isEditorPick}
                  onChange={(e) => setFormData({ ...formData, isEditorPick: e.target.checked })}
                  className="rounded text-amber-600"
                />
                <span className="text-amber-700 dark:text-amber-400 font-semibold">
                  সম্পাদকের পছন্দ (Editor's Pick)
                </span>
              </label>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPushNotification}
                    onChange={(e) => setAutoPushNotification(e.target.checked)}
                    className="rounded text-rose-900 focus:ring-rose-800"
                  />
                  <span className="text-rose-900 dark:text-rose-400 font-bold flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5" />
                    <span>পাঠকদের ডিভাইসে পুশ নোটিফিকেশন পাঠান</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Reporter & Location */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>প্রতিবেদক ও স্থান</span>
            </h4>

            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                প্রতিবেদকের নাম / বাইলাইন
              </label>
              <input
                type="text"
                value={formData.reporter}
                onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                সংবাদের স্থান (যেমন: ঢাকা / চট্টগ্রাম / নিউইয়র্ক)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>ট্যাগসমূহ</span>
            </h4>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="নতুন ট্যাগ লিখুন..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
              >
                যোগ
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {formData.tags?.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-600 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
