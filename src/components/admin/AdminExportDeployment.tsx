import React, { useState } from 'react';
import { api } from '../../lib/api.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { DownloadCloud, UploadCloud, RefreshCw, Server, CheckCircle2, ShieldCheck, Terminal, Copy } from 'lucide-react';

export const AdminExportDeployment: React.FC = () => {
  const { showToast, refreshData } = useNews();
  const [downloading, setDownloading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [copiedCmd, setCopiedCmd] = useState(false);

  const handleDownloadBackup = async () => {
    try {
      setDownloading(true);
      const res = await api.exportBackup();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.database, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `sotyobani-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('সম্পূর্ণ ডাটাবেস ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে', 'success');
    } catch (err: any) {
      showToast(err.message || 'ডাউনলোড ব্যর্থ হয়েছে', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleImportBackup = async () => {
    if (!importJson.trim()) {
      showToast('অনুগ্রহ করে JSON কোড পেস্ট করুন', 'warning');
      return;
    }
    try {
      const parsed = JSON.parse(importJson);
      await api.importBackup(parsed);
      showToast('ডাটাবেস সফলভাবে রিস্টোর করা হয়েছে', 'success');
      setImportJson('');
      refreshData();
    } catch (err: any) {
      showToast('ভুল JSON ফরম্যাট! ' + (err.message || ''), 'error');
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('সতর্কতা! ডাটাবেস ফ্যাক্টরি ডিফল্টে রিসেট হবে। আপনি কি নিশ্চিত?')) return;
    try {
      setResetting(true);
      await api.resetDefaults();
      showToast('ডাটাবেস সফলভাবে ফ্যাক্টরি ডিফল্টে রিসেট হয়েছে', 'success');
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'রিসেট ব্যর্থ হয়েছে', 'error');
    } finally {
      setResetting(false);
    }
  };

  const netlifyBuildCommand = `npm run build`;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-2xl font-extrabold font-serif text-slate-950 dark:text-white flex items-center gap-2">
          <DownloadCloud className="w-6 h-6 text-rose-800" />
          <span>ডাটাবেস ব্যাকআপ, এক্সপোর্ট ও ডিপ্লয়মেন্ট</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          সম্পূর্ণ পোর্টালের ডাটা এক্সপোর্ট, ব্যাকআপ এবং Netlify / Vercel প্রোডাকশন ডিপ্লয়মেন্ট গাইড
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup & Download */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b pb-2">
            <DownloadCloud className="w-4 h-4 text-emerald-600" />
            <span>সম্পূর্ণ ডাটাবেস এক্সপোর্ট (Full JSON Backup)</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            সকল সংবাদ, বিভাগ, বিজ্ঞাপন কনফিগারেশন, ব্যবহারকারী, এবং সেটিংস একটি সিঙ্গেল JSON ফাইলে ব্যাকআপ নিন।
          </p>
          <button
            onClick={handleDownloadBackup}
            disabled={downloading}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>{downloading ? 'ডাউনলোড হচ্ছে...' : 'JSON ব্যাকআপ ডাউনলোড করুন'}</span>
          </button>
        </div>

        {/* Reset Defaults */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b pb-2">
            <RefreshCw className="w-4 h-4 text-amber-600" />
            <span>ফ্যাক্টরি ডিফল্ট রিস্টোর (Factory Reset)</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            প্রয়োজনে প্রাথমিক স্যাম্পল বাংলা সংবাদ ও ক্যাটাগরি পুনরায় লোড করতে পারেন।
          </p>
          <button
            onClick={handleResetDefaults}
            disabled={resetting}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{resetting ? 'রিসেট হচ্ছে...' : 'ডিফল্ট ডাটা রিস্টোর করুন'}</span>
          </button>
        </div>

        {/* Netlify / Production Deployment Guide */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b pb-2">
            <Server className="w-4 h-4 text-rose-800" />
            <span>Netlify / Production Deployment গাইডলাইন</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <p>
              সত্যবাণী পোর্টালটি একটি ফুলস্ট্যাক মডার্ন অ্যাপলেট। Netlify বা যেকোনো Node.js ক্লাউড প্ল্যাটফর্মে সরাসরি ডিপ্লয় করা যাবে।
            </p>

            <div className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1">
                <span>Build Command</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(netlifyBuildCommand);
                    setCopiedCmd(true);
                    setTimeout(() => setCopiedCmd(false), 2000);
                  }}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCmd ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
              </div>
              <p className="text-emerald-400">{netlifyBuildCommand}</p>
              <p className="text-slate-400 text-[11px]">Publish directory: <span className="text-white">dist</span></p>
            </div>
          </div>
        </div>

        {/* JSON Import Tool */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b pb-2">
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>JSON ব্যাকআপ ইমপোর্ট করুন (Restore from JSON)</span>
          </h3>
          <textarea
            rows={5}
            placeholder="এখানে ব্যাকআপ JSON কোড পেস্ট করুন..."
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs dark:text-white focus:outline-none"
          />
          <button
            onClick={handleImportBackup}
            className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition shadow-sm"
          >
            ইমপোর্ট ও রিস্টোর করুন
          </button>
        </div>
      </div>
    </div>
  );
};
