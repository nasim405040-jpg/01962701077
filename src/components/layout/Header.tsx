import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext.tsx';
import {
  formatBanglaDate,
  getTraditionalBanglaCalendarDate,
} from '../../utils/banglaUtils.ts';
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Radio,
  FileText,
  ShieldCheck,
  ChevronDown,
  CloudSun,
  Facebook,
  Youtube,
  Twitter,
  Send,
  SlidersHorizontal,
  Lock,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    categories,
    settings,
    theme,
    toggleTheme,
    fontSize,
    setFontSize,
    currentPath,
    navigate,
    currentUser,
  } = useNews();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const gregorianBanglaDate = formatBanglaDate();
  const banglaCalendarDate = getTraditionalBanglaCalendarDate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchKeyword.trim())}`);
      setSearchModalOpen(false);
      setSearchKeyword('');
    }
  };

  const navCategories = categories.filter((c) => c.showInNav);
  const primaryNav = navCategories.slice(0, 10);
  const overflowNav = navCategories.slice(10);

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 py-1.5 px-3 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Date & Weather */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span className="font-medium">{gregorianBanglaDate}</span>
            <span className="text-slate-400 dark:text-slate-600 hidden md:inline">|</span>
            <span className="text-rose-800 dark:text-rose-400 font-semibold hidden md:inline">
              {banglaCalendarDate}
            </span>
            <span className="text-slate-400 dark:text-slate-600 hidden lg:inline">|</span>
            <div className="hidden lg:flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>ঢাকা ৩১° সে. (আংশিক মেঘলা)</span>
            </div>
          </div>

          {/* Controls: Socials, Font Size, Theme, E-Paper, Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Social Icons */}
            <div className="hidden sm:flex items-center gap-2 border-r border-slate-300 dark:border-slate-700 pr-3">
              {settings.socialLinks.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition"
                  aria-label="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.socialLinks.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 transition"
                  aria-label="YouTube"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.socialLinks.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-500 transition"
                  aria-label="Twitter"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
              {settings.socialLinks.telegram && (
                <a
                  href={settings.socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition"
                  aria-label="Telegram"
                >
                  <Send className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Font Size Adjuster */}
            <div className="hidden md:flex items-center gap-1 border-r border-slate-300 dark:border-slate-700 pr-3">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-0.5">ফন্ট:</span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-xs font-semibold ${fontSize === 'normal' ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                title="সাধারণ ফন্ট"
              >
                অ
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-xs font-semibold ${fontSize === 'large' ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                title="বড় ফন্ট"
              >
                অ+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-1.5 py-0.5 rounded text-xs font-semibold ${fontSize === 'xlarge' ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                title="অতিরিক্ত বড় ফন্ট"
              >
                অ++
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300 flex items-center gap-1 text-xs"
              title={theme === 'dark' ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px] font-medium">{theme === 'dark' ? 'লাইট' : 'ডার্ক'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND MASTHEAD */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle or Edition badge */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:flex flex-col">
            <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-400 tracking-wider uppercase">
              জাতীয় সংস্করণ
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              বস্তুনিষ্ঠ ও স্বাধীন সাংবাদিকতা
            </span>
          </div>
        </div>

        {/* Center: Brand Logo & Tagline */}
        <div className="text-center cursor-pointer group" onClick={() => navigate('/')}>
          <div className="inline-flex items-center justify-center gap-1.5">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif text-slate-950 dark:text-white group-hover:text-rose-900 dark:group-hover:text-rose-400 transition-colors">
              {settings.siteName || 'সত্যবাণী'}
            </h1>
            <span className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 rounded-full bg-rose-800 inline-block mb-1 sm:mb-2"></span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 tracking-wide mt-0.5">
            {settings.siteTagline || 'সত্যের সন্ধানে নির্ভীক'}
          </p>
        </div>

        {/* Right: Live E-Paper / Search button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="header-search-btn"
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium transition"
            aria-label="অনুসন্ধান করুন"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">অনুসন্ধান</span>
          </button>
        </div>
      </div>

      {/* 3. STICKY CATEGORY NAVIGATION */}
      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-y border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between">
          <ul className="flex items-center overflow-x-auto no-scrollbar gap-1 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
            {/* Home Link */}
            <li>
              <button
                onClick={() => navigate('/')}
                className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${currentPath === '/' ? 'bg-rose-900 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-800 dark:hover:text-rose-400'}`}
              >
                হোম
              </button>
            </li>

            {/* Latest Live Pill */}
            <li>
              <button
                onClick={() => navigate('/latest')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded whitespace-nowrap transition-colors ${currentPath === '/latest' ? 'bg-rose-900 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-800 dark:text-rose-400'}`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                <span>সর্বশেষ</span>
              </button>
            </li>

            {/* Main Categories */}
            {primaryNav.map((cat) => {
              const active = currentPath === `/category/${cat.slug}`;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`/category/${cat.slug}`)}
                    className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${active ? 'bg-rose-900 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-800 dark:hover:text-rose-400'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}

            {/* Overflow / More Dropdown */}
            {overflowNav.length > 0 && (
              <li className="relative">
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap transition text-slate-700 dark:text-slate-300"
                >
                  <span>অন্যান্য</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {moreDropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setMoreDropdownOpen(false)}
                  >
                    {overflowNav.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          navigate(`/category/${cat.slug}`);
                          setMoreDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-rose-800 dark:hover:text-rose-400"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            )}
          </ul>

          {/* Quick search button for desktop nav */}
          <div className="hidden xl:flex items-center pl-2">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-1.5 rounded-full text-slate-500 hover:text-rose-800 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-serif text-slate-950 dark:text-white">
                  {settings.siteName}
                </h2>
                <p className="text-xs text-rose-800 dark:text-rose-400 font-medium">
                  {settings.siteTagline}
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="সংবাদ অনুসন্ধান করুন..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800 dark:text-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </form>
            </div>

            {/* Category List */}
            <div className="p-4 flex-1">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                বিভাগসমূহ
              </p>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => {
                      navigate('/');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded font-medium text-slate-800 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-800 hover:text-rose-800 dark:hover:text-rose-400"
                  >
                    হোম
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate('/latest');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded font-bold text-rose-800 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>সর্বশেষ সংবাদ</span>
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        navigate(`/category/${cat.slug}`);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded font-medium text-slate-800 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-800 hover:text-rose-800 dark:hover:text-rose-400 flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      {cat.postCount ? (
                        <span className="text-xs text-slate-400">({cat.postCount})</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Static Pages */}
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  অন্যান্য
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <button
                    onClick={() => {
                      navigate('/about');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-1 hover:text-rose-800"
                  >
                    আমাদের সম্পর্কে
                  </button>
                  <button
                    onClick={() => {
                      navigate('/contact');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-1 hover:text-rose-800"
                  >
                    যোগাযোগ
                  </button>
                  <button
                    onClick={() => {
                      navigate('/privacy-policy');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-1 hover:text-rose-800"
                  >
                    গোপনীয়তা নীতি
                  </button>
                  <button
                    onClick={() => {
                      navigate('/terms');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-1 hover:text-rose-800"
                  >
                    ব্যবহারের শর্তাবলি
                  </button>
                  <button
                    id="mobile-drawer-admin-panel-link"
                    onClick={() => {
                      navigate('/admin');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-1 text-slate-500 dark:text-slate-400 hover:text-rose-800 dark:hover:text-rose-400 font-medium flex items-center gap-1 col-span-2 mt-1 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-xs transition"
                  >
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>অ্যাডমিন প্যানেল (Admin Panel)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {settings.siteTagline || 'সত্যের সন্ধানে নির্ভীক'}
              </span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{theme === 'dark' ? 'লাইট' : 'ডার্ক'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-rose-800" />
                <span>সংবাদ অনুসন্ধান</span>
              </h3>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="p-6">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="কী-ওয়ার্ড বা শিরোনাম লিখে এন্টার চাপুন..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-base rounded-lg border-2 border-rose-800 dark:border-rose-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none shadow-sm"
                />
                <Search className="w-6 h-6 text-rose-800 absolute left-3.5 top-3.5" />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">জনপ্রিয় সার্চ:</span>
                {['বাজেট', 'ক্রিকেট', 'মুদ্রাস্ফীতি', 'কৃত্রিম বুদ্ধিমত্তা', 'নির্বাচন', 'সুন্দরবন'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchKeyword(term);
                      navigate(`/search?q=${encodeURIComponent(term)}`);
                      setSearchModalOpen(false);
                    }}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-900 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                  >
                    #{term}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-900 hover:bg-rose-950 text-white text-sm font-bold shadow transition"
                >
                  খুঁজুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
