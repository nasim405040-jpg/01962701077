import React, { useState } from 'react';
import { useNews } from '../context/NewsContext.tsx';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

interface StaticPageProps {
  type: 'about' | 'contact' | 'privacy-policy' | 'terms' | 'disclaimer';
}

export const StaticPage: React.FC<StaticPageProps> = ({ type }) => {
  const { settings, showToast } = useNews();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। ধন্যবাদ!', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  if (type === 'about') {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <SEOHead title="আমাদের সম্পর্কে" description={`${settings.siteName} — সম্পাদকীয় মিশন ও দৃষ্টিভঙ্গি`} />
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-950 dark:text-white mb-2">
              আমাদের সম্পর্কে (About Us)
            </h1>
            <p className="text-base text-rose-800 dark:text-rose-400 font-semibold">
              {settings.siteName} — {settings.siteTagline}
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6 text-base sm:text-lg leading-relaxed">
            <p>
              <strong>‘{settings.siteName}’</strong> একটি আধুনিক, দায়িত্বশীল ও বস্তুনিষ্ঠ বাংলা ডিজিটাল সংবাদ মাধ্যম। সত্য, সততা ও সাহসিকতার সাথে দেশ ও বিশ্বের নির্ভরযোগ্য সংবাদ পাঠকের সামনে উপস্থাপন করাই আমাদের মূল লক্ষ্য।
            </p>
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              আমাদের সম্পাদকীয় নীতিমালা ও দৃষ্টিভঙ্গি
            </h3>
            <p>
              আমরা কোনো রাজনৈতিক দল, গোষ্ঠী বা স্বার্থান্বেষী মহলের সাথে আপস করি না। প্রতিটি সংবাদের নিরপেক্ষতা, তথ্যের সত্যতা ও বস্তুনিষ্ঠ যাচাই আমাদের প্রথম অগ্রাধিকার। হলুদ সাংবাদিকতা, বিভ্রান্তিকর ক্লিকবেইট ও অসত্য তথ্যের বিরুদ্ধে আমরা সদাজাগ্রত।
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <ShieldCheck className="w-8 h-8 text-rose-800 dark:text-rose-400 mb-2" />
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">নির্ভুল তথ্য ও ফ্যাক্ট-চেক</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  সংবাদ প্রকাশের পূর্বে তথ্য একাধিক স্বাধীন সূত্রে যাচাই করা হয়।
                </p>
              </div>
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Award className="w-8 h-8 text-rose-800 dark:text-rose-400 mb-2" />
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">নৈতিক সাংবাদিকতা</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  ব্যক্তি স্বাধীনতা, মানবাধিকার ও জাতীয় স্বার্থ সুরক্ষায় আমরা অঙ্গীকারবদ্ধ।
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (type === 'contact') {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <SEOHead title="যোগাযোগ ও সম্পাদকীয় দপ্তর" description={`${settings.siteName} এর সাথে যোগাযোগ করুন`} />
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs">
          <h1 className="text-3xl font-extrabold font-serif text-slate-950 dark:text-white mb-2">
            যোগাযোগ ও সম্পাদকীয় দপ্তর
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
            সংবাদ বিজ্ঞপ্তি, মতামত, বিজ্ঞাপন বা যে কোনো অনুসন্ধানের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <MapPin className="w-5 h-5 text-rose-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">কেন্দ্রীয় কার্যালয়:</h4>
                  <p>{settings.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Phone className="w-5 h-5 text-rose-800 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">টেলিফোন ও হটলাইন:</h4>
                  <p>{settings.contactPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Mail className="w-5 h-5 text-rose-800 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">ইমেইল:</h4>
                  <p>{settings.contactEmail}</p>
                </div>
              </div>
            </div>

            {/* Message Form */}
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="আপনার নাম *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
              <input
                type="email"
                required
                placeholder="আপনার ইমেইল *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
              <input
                type="text"
                required
                placeholder="বিষয় *"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
              <textarea
                required
                rows={4}
                placeholder="আপনার বার্তা লিখুন... *"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-800"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-rose-900 hover:bg-rose-950 text-white font-bold text-sm transition shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>বার্তা পাঠান</span>
              </button>
              {submitted && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs rounded flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! শীঘ্রই যোগাযোগ করা হবে।</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (type === 'privacy-policy') {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <SEOHead title="গোপনীয়তা নীতি" description="Privacy Policy — সত্যবাণী ডিজিটাল প্রকাশনা" />
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs">
          <h1 className="text-3xl font-extrabold font-serif text-slate-950 dark:text-white mb-6">
            গোপনীয়তা নীতি (Privacy Policy)
          </h1>
          <div className="space-y-4 text-slate-700 dark:text-slate-300 text-base leading-relaxed">
            <p>
              ‘{settings.siteName}’ পাঠকদের ব্যক্তিগত তথ্যের সর্বোচ্চ গোপনীয়তা ও সুরক্ষা নিশ্চিত করতে বদ্ধপরিকর। আমাদের ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি এই গোপনীয়তা নীতিতে সম্মত হচ্ছেন।
            </p>
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white mt-6">
              ১. তথ্য সংগ্রহ ও ব্যবহার
            </h3>
            <p>
              আমরা নিউজলেটার সাবস্ক্রিপশন, মতামত প্রদান বা যোগাযোগের সময় আপনার নাম ও ইমেইল ঠিকানা সংগ্রহ করতে পারি। এই তথ্য তৃতীয় কোনো পক্ষের কাছে বিক্রি বা শেয়ার করা হয় না।
            </p>
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white mt-6">
              ২. কুকিজ ও অ্যানালিটিক্স
            </h3>
            <p>
              পাঠকদের ব্রাউজিং অভিজ্ঞতা উন্নত করার জন্য আমরা স্ট্যান্ডার্ড অ্যানালিটিক্স ও কুকি প্রযুক্তি ব্যবহার করি, যার মাধ্যমে শুধুমাত্র ওয়েবসাইটের ভিজিটর ট্রাফিক ও পারফরম্যান্স পর্যবেক্ষণ করা হয়।
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Terms / Disclaimer
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <SEOHead title="ব্যবহারের শর্তাবলি ও দায়মুক্তি" description="Terms of Use & Disclaimer" />
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs">
        <h1 className="text-3xl font-extrabold font-serif text-slate-950 dark:text-white mb-6">
          ব্যবহারের শর্তাবলি ও দায়মুক্তি (Terms & Disclaimer)
        </h1>
        <div className="space-y-4 text-slate-700 dark:text-slate-300 text-base leading-relaxed">
          <p>
            ‘{settings.siteName}’-এ প্রকাশিত সকল টেক্সট, ছবি, ভিডিও এবং অডিও সামগ্রী কপিরাইট আইনের আওতাভুক্ত। অনুমতি ছাড়া কোনো বিষয়বস্তু বাণিজ্যিক উদ্দেশ্যে পুনরুৎপাদন করা দণ্ডনীয় অপরাধ।
          </p>
          <p>
            কলাম ও মতামত পাতায় প্রকাশিত লেখার দায়িত্ব সংশ্লিষ্ট লেখকের। প্রকাশিত মতামতের সাথে সম্পাদকীয় নীতির ভিন্নতা থাকতে পারে।
          </p>
        </div>
      </div>
    </main>
  );
};
