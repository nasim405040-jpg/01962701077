import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext.tsx';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Flame,
  BadgePercent,
  Users,
  Image as ImageIcon,
  MessageSquare,
  LayoutTemplate,
  Settings,
  DownloadCloud,
  LogOut,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  Share2,
  Cloud,
  Shield,
  Feather,
  Lock,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  children,
}) => {
  const { currentUser, logout, navigate, theme, toggleTheme, settings } = useNews();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isEditor = currentUser?.role === 'editor';
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Full catalog of features
  const allMenuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard, role: 'all' },
    { id: 'articles', label: 'সকল সংবাদ', icon: FileText, role: 'all' },
    { id: 'new_article', label: 'নতুন সংবাদ প্রকাশ', icon: PlusCircle, highlight: true, role: 'all' },
    { id: 'audience_reach', label: 'পোস্ট রিচ ও ডিস্ট্রিবিউশন', icon: Share2, highlight: true, role: 'all' },
    { id: 'categories', label: 'ক্যাটাগরি ও বিভাগ', icon: FolderTree, role: 'all' },
    { id: 'breaking', label: 'ব্রেকিং নিউজ পরিচালনা', icon: Flame, role: 'all' },
    { id: 'authors', label: 'লেখক ও প্রতিবেদক', icon: Users, role: 'all' },
    { id: 'media', label: 'মিডিয়া লাইব্রেরি', icon: ImageIcon, role: 'all' },
    { id: 'comments', label: 'মন্তব্য মডারেশন', icon: MessageSquare, role: 'all' },
    // Super admin exclusive tools
    { id: 'homepage_builder', label: 'হোমপেজ লেআউট বিল্ডার', icon: LayoutTemplate, role: 'admin_only' },
    { id: 'ads', label: 'বিজ্ঞাপন ও Adsterra', icon: BadgePercent, role: 'admin_only' },
    { id: 'netlify_hub', label: 'Netlify ডিপ্লয়মেন্ট ফাইল', icon: Cloud, role: 'admin_only' },
    { id: 'settings', label: 'ওয়েবসাইট সেটিংস', icon: Settings, role: 'admin_only' },
    { id: 'export_deploy', label: 'ব্যাকআপ ও এক্সপোর্ট', icon: DownloadCloud, role: 'admin_only' },
  ];

  const visibleMenuItems = isEditor
    ? allMenuItems.filter((item) => item.role === 'all')
    : allMenuItems;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
            aria-label="Toggle admin sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-center gap-2"
          >
            <h1 className="text-xl font-extrabold font-serif tracking-tight text-white">
              {settings.siteName}
            </h1>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                isEditor
                  ? 'bg-blue-800 text-blue-100'
                  : 'bg-rose-900 text-rose-100'
              }`}
            >
              {isEditor ? '✍️ Editor Interface' : '👑 Admin Panel'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick View Site */}
          <button
            onClick={() => navigate('/')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
          >
            <span>ওয়েবসাইট দেখুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Theme Toggle */}
          {/* Cloud Database Sync Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-950/70 border border-emerald-800/60 text-[11px] font-medium text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ক্লাউড লাইভ (সার্বজনীন)</span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
            title="থিম পরিবর্তন"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Badge */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-tight text-white flex items-center justify-end gap-1">
                  {isEditor ? <Feather className="w-3 h-3 text-blue-400" /> : <Shield className="w-3 h-3 text-rose-400" />}
                  <span>{currentUser.name}</span>
                </p>
                <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[140px]">
                  {currentUser.designation || (isEditor ? 'বার্তা সম্পাদক' : 'সুপার অ্যাডমিন')}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs transition flex items-center gap-1 border border-rose-800/50"
                title="লগআউট করুন"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">লগআউট</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-auto w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-slate-800 pt-16 lg:pt-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Close button for mobile */}
          <div className="lg:hidden p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="font-bold text-sm text-white">মেনু তালিকা</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 overflow-y-auto flex-1 space-y-1">
            <div className="px-3 py-1 mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {isEditor ? 'সম্পাদকীয় মেনু (Editorial)' : 'প্রধান প্রশাসনিক মেনু (Admin)'}
            </div>

            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? isEditor
                        ? 'bg-blue-900 text-white font-bold shadow-sm'
                        : 'bg-rose-900 text-white font-bold shadow-sm'
                      : item.highlight
                      ? 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/50'
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}

            {isEditor && (
              <div className="mt-4 pt-3 border-t border-slate-800 px-3 py-2 bg-slate-950/40 rounded-lg text-[11px] text-slate-500 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>সিস্টেম ও ওয়েবসাইট সেটিংস শুধুমাত্র সুপার অ্যাডমিনের জন্য সংরক্ষিত</span>
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">{settings.siteName} CMS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {isEditor ? 'Editor' : 'Admin'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">নিরাপদ ও আধুনিক ডিজিটাল নিউজরুম</p>
          </div>
        </aside>

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
