import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext.tsx';
import {
  Facebook,
  Youtube,
  Twitter,
  Instagram,
  Send,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, categories, navigate, showToast } = useNews();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      showToast('ধন্যবাদ! আপনি সফলভাবে সত্যবাণী নিউজলেটারে যুক্ত হয়েছেন।', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t-4 border-rose-900 mt-12 transition-colors">
      {/* Upper Footer: 4 Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Editorial Contact */}
          <div className="space-y-4">
            <div className="cursor-pointer inline-block" onClick={() => navigate('/')}>
              <div className="flex items-center gap-1.5">
                <h2 className="text-3xl font-extrabold font-serif text-white tracking-tight">
                  {settings.siteName}
                </h2>
                <span className="h-2 w-2 rounded-full bg-rose-700 inline-block mb-1"></span>
              </div>
              <p className="text-xs text-rose-400 font-semibold tracking-wide mt-0.5">
                {settings.siteTagline}
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.footerDescription}
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400 border-t border-slate-800">
              <p>
                <strong className="text-slate-300">ভারপ্রাপ্ত সম্পাদক:</strong> {settings.editorName}
              </p>
              <p>
                <strong className="text-slate-300">প্রকাশক:</strong> {settings.publisherName}
              </p>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Important Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>বিভাগসমূহ</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categories.slice(0, 12).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  className="text-left text-slate-400 hover:text-white hover:translate-x-1 transition-all py-1"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Useful Links & Policies */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>প্রয়োজনীয় লিংক</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white hover:underline transition"
                >
                  আমাদের সম্পর্কে
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white hover:underline transition"
                >
                  যোগাযোগ ও সম্পাদকীয় নীতিমালা
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="hover:text-white hover:underline transition"
                >
                  গোপনীয়তা নীতি (Privacy Policy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-white hover:underline transition"
                >
                  ব্যবহারের শর্তাবলি (Terms of Use)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/disclaimer')}
                  className="hover:text-white hover:underline transition"
                >
                  দায়মুক্তি ও স্বত্বাধিকার (Disclaimer)
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800/80 mt-2">
                <button
                  id="footer-nav-admin-panel-btn"
                  onClick={() => navigate('/admin')}
                  className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 hover:underline transition font-medium"
                >
                  <Lock className="w-3 h-3" />
                  <span>অ্যাডমিন প্যানেল (Admin Panel)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>নিউজলেটার ও সোশ্যাল মিডিয়া</span>
            </h3>
            <p className="text-xs text-slate-400">
              দিনের প্রধান প্রধান সংবাদ ও বিশেষ বিশ্লেষণের সারসংক্ষেপ পেতে সাবস্ক্রাইব করুন।
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="আপনার ইমেইল অ্যাড্রেস লিখুন..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-600"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded text-xs transition shadow-sm"
              >
                সাবস্ক্রাইব করুন
              </button>
              {subscribed && (
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>নিউজলেটারে যুক্ত হয়েছেন!</span>
                </p>
              )}
            </form>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-300 block mb-2">আমাদের সাথে থাকুন:</span>
              <div className="flex items-center gap-2">
                {settings.socialLinks.facebook && (
                  <a
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-slate-900 hover:bg-blue-600 hover:text-white text-slate-400 transition"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks.youtube && (
                  <a
                    href={settings.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-slate-900 hover:bg-red-600 hover:text-white text-slate-400 transition"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks.twitter && (
                  <a
                    href={settings.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-slate-900 hover:bg-sky-500 hover:text-white text-slate-400 transition"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks.instagram && (
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-slate-900 hover:bg-pink-600 hover:text-white text-slate-400 transition"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.socialLinks.telegram && (
                  <a
                    href={settings.socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-slate-900 hover:bg-sky-400 hover:text-white text-slate-400 transition"
                    aria-label="Telegram"
                  >
                    <Send className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-900/80 border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>{settings.copyrightText}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
            <span>Powered by Satyabani News Engine</span>
            <span>•</span>
            <span>Netlify & Cloud Production Ready</span>
            <span className="text-slate-700 select-none">•</span>
            <button
              id="footer-admin-access-btn"
              onClick={() => navigate('/admin')}
              title="অ্যাডমিন ও সম্পাদকীয় প্রবেশদ্বার (Admin Panel)"
              aria-label="Admin Access Portal"
              className="group inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors py-0.5 px-2 rounded hover:bg-slate-800/80 focus:outline-none focus:ring-1 focus:ring-slate-700 cursor-pointer text-[11px]"
            >
              <Lock className="w-3 h-3 text-slate-400 group-hover:text-slate-200 transition-colors" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
