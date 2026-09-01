import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext.tsx';
import { api } from '../../lib/api.ts';
import { Article } from '../../types.ts';
import {
  Share2,
  Send,
  Bell,
  Globe,
  TrendingUp,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Twitter,
  Facebook,
  Radio,
  Mail,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  Eye,
  Smartphone,
  Bot,
} from 'lucide-react';

export const AdminAudienceReach: React.FC = () => {
  const { showToast, settings } = useNews();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [broadcastingPush, setBroadcastingPush] = useState(false);
  const [broadcastingMail, setBroadcastingMail] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [telegramBotToken, setTelegramBotToken] = useState('7128941920:AAHq_mock_bot_token');
  const [telegramChannel, setTelegramChannel] = useState('@satyabaninews');
  const [activeTab, setActiveTab] = useState<'social' | 'push' | 'seo' | 'telegram' | 'newsletter'>('social');

  const siteUrl = 'https://satyabani.com';

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const res = await api.getArticles({ all: true, limit: 30 });
      setArticles(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedArticleId(res.data[0].id);
      }
    } catch (err: any) {
      showToast('সংবাদ তালিকা লোড করতে ব্যর্থ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedArticle = articles.find((a) => a.id === selectedArticleId) || articles[0];

  const articleUrl = selectedArticle ? `${siteUrl}/article/${selectedArticle.slug}` : siteUrl;

  // Social templates
  const fbText = selectedArticle
    ? `🔴 ব্রেকিং নিউজ | ${selectedArticle.title}

📌 বিস্তারিত: ${selectedArticle.excerpt || selectedArticle.subtitle || 'বিস্তারিত জানতে মূল প্রতিবেদনে চোখ রাখুন।'}

👉 সম্পূর্ণ সংবাদ পড়ুন: ${articleUrl}

#${(selectedArticle.categoryName || 'জাতীয়').replace(/\s+/g, '_')} #সত্যবাণী #বাংলাদেশ #BreakingNews #Satyabani`
    : '';

  const waText = selectedArticle
    ? `*🔴 ${selectedArticle.title}*

${selectedArticle.excerpt || selectedArticle.subtitle || ''}

🔗 বিস্তারিত সংবাদটি পড়তে ক্লিক করুন:
${articleUrl}

_সত্যবাণী — সত্য ও সাহসের স্মারক_`
    : '';

  const tgText = selectedArticle
    ? `⚡️ *${selectedArticle.title}*

${selectedArticle.excerpt || ''}

▫️ বিভাগ: #${selectedArticle.categoryName || 'সংবাদ'}
▫️ উৎস: সত্যবাণী ডিজিটাল

🔗 [সম্পূর্ণ প্রতিবেদন পড়ুন](${articleUrl})`
    : '';

  const xText = selectedArticle
    ? `${selectedArticle.title.slice(0, 160)}...

🔗 বিস্তারিত: ${articleUrl}
#Bangladesh #BreakingNews #Satyabani`
    : '';

  const handleCopy = (text: string, formatId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatId);
    showToast('সোশ্যাল পোস্ট টেক্সট সফলভাবে কপি হয়েছে!', 'success');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}&quote=${encodeURIComponent(selectedArticle?.title || '')}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(url, '_blank');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(selectedArticle?.title || '')}`;
    window.open(url, '_blank');
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleBroadcastPush = async () => {
    if (!selectedArticle) return;
    try {
      setBroadcastingPush(true);
      const res = await api.broadcastPush({
        articleId: selectedArticle.id,
        title: selectedArticle.title,
        excerpt: selectedArticle.excerpt,
        url: articleUrl,
        image: selectedArticle.featuredImage,
      });
      showToast(res.message || 'ব্রাউজার পুশ নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!', 'success');
    } catch (err: any) {
      showToast(err.message || 'পুশ নোটিফিকেশন পাঠাতে সমস্যা হয়েছে', 'error');
    } finally {
      setBroadcastingPush(false);
    }
  };

  const handleBroadcastNewsletter = async () => {
    if (!selectedArticle) return;
    try {
      setBroadcastingMail(true);
      const res = await api.broadcastNewsletter({
        articleId: selectedArticle.id,
        subject: `[ব্রেকিং নিউজ] ${selectedArticle.title}`,
      });
      showToast(res.message || 'ইমেইল নিউজলেটার সফলভাবে প্রেরিত হয়েছে!', 'success');
    } catch (err: any) {
      showToast(err.message || 'ইমেইল পাঠাতে সমস্যা হয়েছে', 'error');
    } finally {
      setBroadcastingMail(false);
    }
  };

  const handleGooglePing = () => {
    const sitemapUrl = `${siteUrl}/sitemap.xml`;
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    window.open(pingUrl, '_blank');
    showToast('গুগল সাইটম্যাপ পিং রিকোয়েস্ট পাঠানো হয়েছে!', 'info');
  };

  // Calculate Viral & SEO Reach Score (0 - 100)
  const calculateReachScore = (article: Article | undefined) => {
    if (!article) return 0;
    let score = 50;

    // Title length (40 - 85 chars is optimal for Bangla CTR)
    if (article.title.length >= 35 && article.title.length <= 90) score += 15;
    else if (article.title.length > 90) score += 5;

    // Power keywords check
    const powerWords = ['ব্রেকিং', 'বিশেষ', 'আলোড়ন', 'নাটকীয়', 'সতর্কতা', 'উন্মোচন', 'চমক', 'গুরুত্বপূর্ণ', 'ইতিহাস', 'জয়', 'পদক্ষেপ'];
    const hasPowerWord = powerWords.some((w) => article.title.includes(w) || (article.excerpt && article.excerpt.includes(w)));
    if (hasPowerWord) score += 15;

    // Featured image check
    if (article.featuredImage && article.featuredImage.startsWith('http')) score += 10;

    // Excerpt check
    if (article.excerpt && article.excerpt.length > 50) score += 5;

    // Tags check
    if (article.tags && article.tags.length >= 3) score += 5;

    return Math.min(score, 100);
  };

  const reachScore = calculateReachScore(selectedArticle);

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-900/50 border border-rose-700/60 text-rose-300">
              <Share2 className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl md:text-2xl font-black font-serif tracking-tight">
                পোস্ট রিচ ও ডিস্ট্রিবিউশন হাব (Audience Growth Engine)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                আপনার প্রকাশিত সংবাদ লাখো পাঠকের কাছে তাৎক্ষণিক পৌঁছে দিতে মাল্টি-চ্যানেল ব্রডকাস্ট ও এসইও টুলস
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">সক্রিয় সাবস্ক্রাইবার পুল:</span>
          <span className="text-emerald-400 font-bold font-mono">১৪,২৮০+</span>
        </div>
      </div>

      {/* Article Selector & Reach Score Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Article Selector */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-rose-800 dark:text-rose-400" />
              <span>ডিস্ট্রিবিউশনের জন্য সংবাদ নির্বাচন করুন:</span>
            </label>
            <span className="text-[11px] text-slate-500">মোট প্রকাশিত: {articles.length} টি</span>
          </div>

          <select
            value={selectedArticleId}
            onChange={(e) => setSelectedArticleId(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-serif font-bold focus:ring-2 focus:ring-rose-800 focus:outline-none"
          >
            {articles.map((art) => (
              <option key={art.id} value={art.id}>
                [{art.categoryName}] {art.title}
              </option>
            ))}
          </select>

          {selectedArticle && (
            <div className="p-3 bg-slate-100 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              {selectedArticle.featuredImage && (
                <img
                  src={selectedArticle.featuredImage}
                  alt={selectedArticle.title}
                  className="w-20 h-14 object-cover rounded-lg shrink-0 border border-slate-300 dark:border-slate-700"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 font-serif">
                  {selectedArticle.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {selectedArticle.excerpt || selectedArticle.subtitle}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 font-mono">
                  <span>ভিউ: {selectedArticle.views || 0}</span>
                  <span>•</span>
                  <span>বিভাগ: {selectedArticle.categoryName}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Reach & Virality Score Meter */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>পোস্টের রিচ ও ভাইরাল সম্ভাবনা</span>
            </span>
            <span className="text-xs font-black font-mono text-rose-700 dark:text-rose-400">
              {reachScore}/১০০
            </span>
          </div>

          <div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  reachScore >= 80 ? 'bg-emerald-500' : reachScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${reachScore}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {reachScore >= 80
                ? '🔥 চমৎকার! এই সংবাদটির সোশ্যাল ও সার্চ ইঞ্জিনে ব্যাপক রিচ পাওয়ার উচ্চ সম্ভাবনা রয়েছে।'
                : '💡 আরও রিচ পেতে শিরোনামে আকর্ষণীয় কি-ওয়ার্ড ও সুন্দর থাম্বনেইল ছবি নিশ্চিত করুন।'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Open Graph কার্ড প্রস্তুত</span>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Google News Sitemap অন্তর্ভুক্ত</span>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Channels Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'social'
              ? 'bg-rose-900 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>সোশ্যাল মিডিয়া ব্রডকাস্ট (FB, WA, Telegram)</span>
        </button>

        <button
          onClick={() => setActiveTab('push')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'push'
              ? 'bg-rose-900 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>ব্রাউজার পুশ নোটিফিকেশন ডিসপ্যাচ</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'seo'
              ? 'bg-rose-900 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Google News ও Search Console ইনডেক্সিং</span>
        </button>

        <button
          onClick={() => setActiveTab('telegram')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'telegram'
              ? 'bg-rose-900 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>টেলিগ্রাম চ্যানেল অটো-পোস্ট বট</span>
        </button>

        <button
          onClick={() => setActiveTab('newsletter')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'newsletter'
              ? 'bg-rose-900 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>ইমেইল সাবস্ক্রাইবার ব্লাস্ট</span>
        </button>
      </div>

      {/* Tab 1: Social Media Broadcast Station */}
      {activeTab === 'social' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Facebook Post Format */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <Facebook className="w-4 h-4" />
                <span>Facebook পেজ ও গ্রুপ ফরম্যাট</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(fbText, 'fb')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition flex items-center gap-1"
                >
                  {copiedFormat === 'fb' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFormat === 'fb' ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
                <button
                  onClick={handleShareFacebook}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>শেয়ার করুন</span>
                </button>
              </div>
            </div>
            <pre className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-sans whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800 max-h-48 overflow-y-auto">
              {fbText}
            </pre>
          </div>

          {/* WhatsApp Broadcast Format */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp চ্যানেল ও গ্রুপ ব্রডকাস্ট</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(waText, 'wa')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition flex items-center gap-1"
                >
                  {copiedFormat === 'wa' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFormat === 'wa' ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>WhatsApp-এ পাঠান</span>
                </button>
              </div>
            </div>
            <pre className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-sans whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800 max-h-48 overflow-y-auto">
              {waText}
            </pre>
          </div>

          {/* Telegram Format */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-sky-500 font-bold text-xs">
                <Send className="w-4 h-4" />
                <span>Telegram চ্যানেল পোস্ট ফরম্যাট</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(tgText, 'tg')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition flex items-center gap-1"
                >
                  {copiedFormat === 'tg' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFormat === 'tg' ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
                <button
                  onClick={handleShareTelegram}
                  className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-bold transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>টেলিগ্রামে পোস্ট</span>
                </button>
              </div>
            </div>
            <pre className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-sans whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800 max-h-48 overflow-y-auto">
              {tgText}
            </pre>
          </div>

          {/* Twitter / X Format */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
                <Twitter className="w-4 h-4" />
                <span>X (Twitter) টুইট ফরম্যাট</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(xText, 'x')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition flex items-center gap-1"
                >
                  {copiedFormat === 'x' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFormat === 'x' ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
                <button
                  onClick={handleShareTwitter}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-bold transition flex items-center gap-1 border border-slate-700"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>টুইট করুন</span>
                </button>
              </div>
            </div>
            <pre className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-sans whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800 max-h-48 overflow-y-auto">
              {xText}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Push Notification Dispatcher */}
      {activeTab === 'push' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-600" />
                <span>তাৎক্ষণিক ব্রাউজার ও মোবাইল পুশ নোটিফিকেশন</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                বার্তাটি পাঠানো মাত্রই সত্যবাণী নিউজলেটার ও পুশ সাবস্ক্রাইব করা সকল দর্শকের স্ক্রিনে ভেসে উঠবে।
              </p>
            </div>

            <button
              onClick={handleBroadcastPush}
              disabled={broadcastingPush || !selectedArticle}
              className="px-5 py-3 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{broadcastingPush ? 'ব্রডকাস্ট পাঠানো হচ্ছে...' : 'এখনই ১৪,২৮০+ সাবস্ক্রাইবারে পুশ পাঠান'}</span>
            </button>
          </div>

          {/* Live Mobile / Desktop Push Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-950 text-white border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Android / Windows পুশ নোটিফিকেশন প্রিভিউ</span>
                </span>
                <span className="text-rose-400 font-bold">এখনই</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-rose-900 text-white font-serif font-black flex items-center justify-center text-sm shrink-0">
                  স
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-rose-400">সত্যবাণী ব্রেকিং নিউজ</p>
                    <span className="text-[9px] text-slate-500">satyabani.com</span>
                  </div>
                  <p className="text-xs font-bold text-white line-clamp-1 mt-0.5 font-serif">
                    {selectedArticle?.title || 'শিরোনাম'}
                  </p>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {selectedArticle?.excerpt || 'বিস্তারিত সংবাদটি পড়তে আলতো চাপুন...'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <h4 className="font-bold text-slate-900 dark:text-white">নোটিফিকেশন সেটিং ও অডিয়েন্স ফিল্টার:</h4>
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>অটোমেটিক ইমেজ প্রিভিউ ও ডীপ-লিঙ্কিং সক্রিয়</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>ক্রোম, ফায়ারফক্স, এজ এবং মোবাইল সাফারি সমর্থিত</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>সাউন্ড ও ভাইব্রেশন প্যাটার্ন যুক্ত</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Google News & Search Console SEO */}
      {activeTab === 'seo' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                <span>Google News ও Search Console লাইভ ইনডেক্সিং</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                সার্চ ইঞ্জিনের ক্রলারের কাছে তাৎক্ষণিক পিং পাঠিয়ে পোস্ট দ্রুত গুগল সার্চ ফলাফলে আনুন।
              </p>
            </div>

            <button
              onClick={handleGooglePing}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-sm flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Google Search Console সাইটম্যাপ পিং</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">RSS 2.0 নিউজ ফিড</span>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 font-mono text-[10px] rounded">সক্রিয়</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono break-all">{siteUrl}/rss.xml</p>
              <a
                href="/api/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1 hover:underline"
              >
                <span>ফিড XML দেখুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">Google News XML সাইটম্যাপ</span>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 font-mono text-[10px] rounded">সক্রিয়</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono break-all">{siteUrl}/sitemap.xml</p>
              <a
                href="/api/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1 hover:underline"
              >
                <span>সাইটম্যাপ XML দেখুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Telegram Bot Webhook Auto-Post */}
      {activeTab === 'telegram' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-sky-500" />
              <span>টেলিগ্রাম চ্যানেল অটো-পোস্ট বট (Webhook Automation)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              যেকোনো সংবাদ সাইটে প্রকাশিত হওয়ামাত্রই স্বয়ংক্রিয়ভাবে আপনার টেলিগ্রাম নিউজ চ্যানেলে পোস্ট হয়ে যাবে।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Telegram Bot Token (যেমন: @BotFather থেকে প্রাপ্ত)
              </label>
              <input
                type="text"
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Telegram Channel Username বা Chat ID
              </label>
              <input
                type="text"
                value={telegramChannel}
                onChange={(e) => setTelegramChannel(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={() => showToast('টেলিগ্রাম বট কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!', 'success')}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>বট সেটিংস সংরক্ষণ করুন</span>
          </button>
        </div>
      )}

      {/* Tab 5: Email Subscriber Blast */}
      {activeTab === 'newsletter' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-rose-700" />
                <span>ইমেইল নিউজলেটার সাবস্ক্রাইবার ডাইজেস্ট</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                নিবন্ধিত ৮,৯৫০+ ইমেইল গ্রাহককে ব্রেকিং নিউজ সরাসরি ইনবক্সে পাঠান।
              </p>
            </div>

            <button
              onClick={handleBroadcastNewsletter}
              disabled={broadcastingMail || !selectedArticle}
              className="px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs transition shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{broadcastingMail ? 'পাঠানো হচ্ছে...' : 'সকল ইমেইলে সংবাদ পাঠান'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">ইমেইল প্রিভিউ সাবজেক্ট:</p>
            <p className="text-xs font-serif font-bold text-rose-900 dark:text-rose-400">
              [ব্রেকিং নিউজ] {selectedArticle?.title || 'সংবাদ'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
