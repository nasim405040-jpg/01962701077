import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext.tsx';
import {
  Cloud,
  FileCode,
  Copy,
  Check,
  Download,
  ExternalLink,
  Layers,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  FolderArchive,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface DeployFile {
  id: string;
  name: string;
  path: string;
  description: string;
  category: 'config' | 'routing' | 'seo' | 'env';
  content: string;
}

export const AdminNetlifyHub: React.FC = () => {
  const { showToast, settings } = useNews();
  const [selectedFileId, setSelectedFileId] = useState<string>('netlify_toml');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const siteUrl = 'https://satyabani.com';

  const files: DeployFile[] = [
    {
      id: 'netlify_toml',
      name: 'netlify.toml',
      path: '/netlify.toml (Root directory)',
      category: 'config',
      description: 'Netlify-এর প্রধান কনফিগারেশন ফাইল। বিল্ড কমান্ড, আউটপুট ডিরেক্টরি এবং SPA রিডাইরেক্ট রুলস ধারণ করে।',
      content: `# ==========================================
# Satyabani News Portal — Netlify Config
# ==========================================

[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--production=false"

# SPA Fallback: Routes all browser navigation to index.html
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Cache-Control and Security Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
`,
    },
    {
      id: 'redirects',
      name: '_redirects',
      path: '/public/_redirects (বিল্ডের সময় dist/ ফোল্ডারে যায়)',
      category: 'routing',
      description: 'Netlify-এর জন্য সিঙ্গেল পেজ অ্যাপ্লিকেশন (SPA) 200 রিরাইট রুল যাতে পেজ রিফ্রেশ করলে 404 এরর না আসে।',
      content: `/*    /index.html   200
`,
    },
    {
      id: 'headers',
      name: '_headers',
      path: '/public/_headers',
      category: 'config',
      description: 'স্ট্যাটিক অ্যাসেট ও স্ক্রিপ্ট দ্রুত লোড হওয়ার জন্য ব্রাউজার ক্যাশিং ও সিকিউরিটি হেডার।',
      content: `/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: public, max-age=0, must-revalidate
`,
    },
    {
      id: 'robots_txt',
      name: 'robots.txt',
      path: '/public/robots.txt',
      category: 'seo',
      description: 'Google, Bing এবং অন্যান্য সার্চ ইঞ্জিনের ক্রলারের জন্য ইনডেক্সিং নির্দেশনা।',
      content: `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`,
    },
    {
      id: 'sitemap_xml',
      name: 'sitemap.xml',
      path: '/public/sitemap.xml',
      category: 'seo',
      description: 'সার্চ ইঞ্জিনের জন্য সাইটম্যাপ XML ফাইল যা গুগল সার্চে দ্রুত সব পেজ ইনডেক্স করতে সাহায্য করে।',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/latest</loc>
    <changefreq>always</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/category/bangladesh</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/category/politics</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/category/economy</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/category/international</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/category/sports</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/category/tech</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`,
    },
    {
      id: 'env_production',
      name: '.env.production',
      path: '/.env.production (বা Netlify Site Settings > Environment Variables)',
      category: 'env',
      description: 'Netlify-এর পরিবেশ ভেরিয়েবল সেটিংস।',
      content: `# Satyabani Netlify Production Environment Variables
NODE_ENV=production
VITE_SITE_NAME=${settings?.siteName || 'সত্যবাণী'}
VITE_SITE_URL=${siteUrl}
`,
    },
  ];

  const currentFile = files.find((f) => f.id === selectedFileId) || files[0];

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    showToast('ফাইল কোড সফলভাবে ক্লিপবোর্ডে কপি হয়েছে!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadFile = (file: DeployFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`"${file.name}" সফলভাবে ডাউনলোড হয়েছে`, 'success');
  };

  const handleDownloadAllBundle = () => {
    // Generate text bundle with all files clearly delimited
    const bundleText = files
      .map(
        (f) => `/* ==========================================
 * FILE: ${f.name}
 * PATH: ${f.path}
 * ========================================== */
${f.content}`
      )
      .join('\n\n\n');

    const blob = new Blob([bundleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `satyabani-netlify-deployment-bundle.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('সকল Netlify ডিপ্লয়মেন্ট ফাইলের প্যাকেজ ডাউনলোড সম্পন্ন হয়েছে!', 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-900/50 border border-rose-700/60 text-rose-300">
              <Cloud className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl md:text-2xl font-black font-serif tracking-tight">
                Netlify ডিপ্লয়মেন্ট ও কনফিগারেশন ফাইল হাব
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                সরাসরি কপি-পেস্ট করে অথবা ফাইল ডাউনলোড করে আপনার সাইট ১ মিনিটে Netlify-তে লাইভ করুন
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleDownloadAllBundle}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2 border border-rose-700"
          >
            <FolderArchive className="w-4 h-4" />
            <span>সব ফাইল একসাথে ডাউনলোড</span>
          </button>
          <a
            href="https://app.netlify.com/drop"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition border border-slate-700 flex items-center gap-1.5"
          >
            <span>Netlify Drop</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 3-Step Instant Deployment Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="absolute top-2 right-3 text-3xl font-black text-slate-200 dark:text-slate-800 select-none">
            ০১
          </div>
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-xs mb-2">
            <Terminal className="w-4 h-4" />
            <span>ধাপ ১: বিল্ড তৈরি করুন</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
            প্রজেক্ট টার্মিনালে নিচের কমান্ডটি রান করুন, এটি <code className="text-rose-600 dark:text-rose-400 font-mono font-bold">dist</code> ফোল্ডারে বিল্ড তৈরি করবে:
          </p>
          <div className="p-2 bg-slate-950 text-emerald-400 rounded-lg font-mono text-[11px] flex items-center justify-between">
            <code>npm run build</code>
            <button
              onClick={() => handleCopy('npm run build', 'cmd-build')}
              className="text-slate-400 hover:text-white"
            >
              {copiedId === 'cmd-build' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="absolute top-2 right-3 text-3xl font-black text-slate-200 dark:text-slate-800 select-none">
            ০২
          </div>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs mb-2">
            <Layers className="w-4 h-4" />
            <span>ধাপ ২: Netlify Drop ড্র্যাগ করুন</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
            <a
              href="https://app.netlify.com/drop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-700 dark:text-rose-400 font-bold underline inline-flex items-center gap-0.5"
            >
              app.netlify.com/drop <ExternalLink className="w-2.5 h-2.5 inline" />
            </a> পেজে যান এবং আপনার প্রজেক্টের <code className="font-mono font-bold">dist</code> ফোল্ডারটি সরাসরি টেনে ছেড়ে দিন।
          </p>
          <div className="p-1.5 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 text-[10px] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>তাৎক্ষণিকভাবে বিশ্বব্যাপী CDN-এ লাইভ হয়ে যাবে!</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="absolute top-2 right-3 text-3xl font-black text-slate-200 dark:text-slate-800 select-none">
            ০৩
          </div>
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>ধাপ ৩: Git রিপোসিটরি অটো-বিল্ড</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
            GitHub-এ কোড পুশ করলে Netlify সাইট সেটিংসে নিচের ফিল্ডগুলো দিন:
          </p>
          <div className="text-[11px] font-mono space-y-1 bg-slate-950 p-2 rounded-lg text-slate-300">
            <div><span className="text-slate-500">Build command:</span> <span className="text-emerald-400">npm run build</span></div>
            <div><span className="text-slate-500">Publish dir:</span> <span className="text-emerald-400">dist</span></div>
          </div>
        </div>
      </div>

      {/* Interactive File Browser & Code Copy Area */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Top File Selector Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {files.map((file) => {
              const active = file.id === selectedFileId;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 whitespace-nowrap transition ${
                    active
                      ? 'bg-rose-900 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{file.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy(currentFile.content, currentFile.id)}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              {copiedId === currentFile.id ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>১-ক্লিকে কোড কপি</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleDownloadFile(currentFile)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ডাউনলোড</span>
            </button>
          </div>
        </div>

        {/* Selected File Details & Code Display */}
        <div className="p-4 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-rose-900 dark:text-rose-400">
                  {currentFile.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {currentFile.path}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {currentFile.description}
              </p>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative group">
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner max-h-[420px]">
              <code>{currentFile.content}</code>
            </pre>
            <button
              onClick={() => handleCopy(currentFile.content, currentFile.id)}
              className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs opacity-0 group-hover:opacity-100 transition backdrop-blur-xs flex items-center gap-1"
            >
              {copiedId === currentFile.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>কপি করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
