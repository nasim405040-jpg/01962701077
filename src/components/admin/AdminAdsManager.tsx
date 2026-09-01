import React, { useState } from 'react';
import { Advertisement, AdPlacement } from '../../types.ts';
import { api } from '../../lib/api.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { BadgePercent, Plus, Edit, Trash2, Check, X, ShieldAlert, Code2, Smartphone, Monitor } from 'lucide-react';

export const AdminAdsManager: React.FC = () => {
  const { ads, settings, refreshData, updateSettingsState, showToast } = useNews();
  const [editingAd, setEditingAd] = useState<Partial<Advertisement> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const placements: { id: AdPlacement; label: string; desc: string }[] = [
    { id: 'header_top', label: 'হেডার টপ (Header Top)', desc: 'লোগোর উপরে বা ক্যাটাগরি বারের ঠিক উপরে' },
    { id: 'home_top', label: 'হোমপেজ টপ লিডারবোর্ড (728x90 / 970x250)', desc: 'হিরো সেকশনের ঠিক উপরে' },
    { id: 'home_middle', label: 'হোমপেজ মিডল ব্যানার', desc: 'ক্যাটাগরি সেকশনের মধ্যভাগে' },
    { id: 'home_bottom', label: 'হোমপেজ বটম ব্যানার', desc: 'ফুটারের ঠিক উপরে' },
    { id: 'sidebar', label: 'সাইডবার ব্যানার (300x250 / 300x600)', desc: 'সর্বাধিক পঠিত ও ভোট জরিপের নিচে' },
    { id: 'article_top', label: 'আর্টিকেল টপ', desc: 'সংবাদের শিরোনামের উপরে' },
    { id: 'article_middle', label: 'আর্টিকেল ইন-কন্টেন্ট (In-Article)', desc: 'সংবাদের প্যারাগ্রাফের মাঝে' },
    { id: 'article_bottom', label: 'আর্টিকেল বটম', desc: 'মন্তব্য সেকশনের ঠিক পূর্বে' },
    { id: 'before_footer', label: 'ফুটার পূর্ব ব্যানার', desc: 'ফুটারের ঠিক উপরে' },
  ];

  const handleGlobalToggle = async (enabled: boolean) => {
    try {
      const updated = await api.updateSettings({
        adsConfig: {
          ...settings.adsConfig,
          enableAdsterra: enabled,
        },
      });
      updateSettingsState(updated);
      showToast(`Adsterra গ্লোবাল বিজ্ঞাপন ${enabled ? 'চালু' : 'বন্ধ'} করা হয়েছে`, 'success');
    } catch (err: any) {
      showToast(err.message || 'ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleStartNew = (placement?: AdPlacement) => {
    setEditingAd({
      title: 'নতুন ব্যানার বিজ্ঞাপন',
      placement: placement || 'home_top',
      type: 'banner',
      adCode: `<!-- Adsterra 728x90 Banner -->\n<div style="width:100%;max-width:728px;height:90px;background:#1e293b;color:#94a3b8;display:flex;align-items:center;justify-content:center;border:1px dashed #475569;font-size:12px;font-weight:bold;">Adsterra 728x90 Responsive Banner Slot</div>`,
      isActive: true,
      device: 'all',
    });
    setIsNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd?.title || !editingAd.adCode) {
      showToast('বিজ্ঞাপনের নাম ও কোড আবশ্যক', 'error');
      return;
    }

    try {
      if (isNew) {
        await api.createAd(editingAd);
        showToast('নতুন বিজ্ঞাপন স্লট তৈরি হয়েছে', 'success');
      } else if (editingAd.id) {
        await api.updateAd(editingAd.id, editingAd);
        showToast('বিজ্ঞাপন সফলভাবে আপডেট করা হয়েছে', 'success');
      }
      setEditingAd(null);
      setIsNew(false);
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('বিজ্ঞাপন স্লটটি মুছে ফেলতে চান?')) return;
    try {
      await api.deleteAd(id);
      showToast('মুছে ফেলা হয়েছে', 'success');
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleToggleActive = async (ad: Advertisement) => {
    try {
      await api.updateAd(ad.id, { isActive: !ad.isActive });
      showToast('স্ট্যাটাস আপডেট করা হয়েছে', 'success');
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'ব্যর্থ হয়েছে', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Global Switch */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-serif text-slate-950 dark:text-white flex items-center gap-2">
            <BadgePercent className="w-6 h-6 text-amber-500" />
            <span>Adsterra ও ব্যানার বিজ্ঞাপন কনফিগারেশন</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ডাটাবেস ও কনফিগারেশন চালিত বিজ্ঞাপন নিয়ন্ত্রণ ব্যবস্থা
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              গ্লোবাল Adsterra অ্যাড:
            </span>
            <button
              onClick={() => handleGlobalToggle(!settings.adsConfig?.enableAdsterra)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                settings.adsConfig?.enableAdsterra
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-rose-900 text-white'
              }`}
            >
              {settings.adsConfig?.enableAdsterra ? 'সক্রিয় (Enabled)' : 'বন্ধ (Disabled)'}
            </button>
          </div>

          <button
            onClick={() => handleStartNew()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন অ্যাড স্লট</span>
          </button>
        </div>
      </div>

      {/* Grid of Placement Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Placements Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            সকল নির্ধারিত বিজ্ঞাপন অবস্থান (Placements)
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {placements.map((p) => {
              const matchedAd = ads.find((a) => a.placement === p.id);
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border transition ${
                    matchedAd && matchedAd.isActive
                      ? 'bg-white dark:bg-slate-900 border-emerald-500/50 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {p.label}
                      </span>
                      {matchedAd ? (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            matchedAd.isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-200 text-slate-600 dark:bg-slate-800'
                          }`}
                        >
                          {matchedAd.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-500 dark:bg-slate-800 text-[10px]">
                          খালি
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{p.desc}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {matchedAd ? (
                      <>
                        <button
                          onClick={() => handleToggleActive(matchedAd)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold ${
                            matchedAd.isActive
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {matchedAd.isActive ? 'বন্ধ করুন' : 'চালু করুন'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingAd(matchedAd);
                            setIsNew(false);
                          }}
                          className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-900 hover:text-white transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(matchedAd.id)}
                          className="p-1.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 hover:bg-rose-900 hover:text-white transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStartNew(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-rose-900 hover:text-white text-xs font-bold transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>কোড বসান</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ad Code Editor Drawer (4 cols) */}
        <div className="lg:col-span-4">
          {editingAd ? (
            <form
              onSubmit={handleSave}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {isNew ? 'নতুন বিজ্ঞাপন কোড' : 'বিজ্ঞাপন সম্পাদনা'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingAd(null)}
                  className="p-1 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বিজ্ঞাপনের নাম / পরিচিতি *
                </label>
                <input
                  type="text"
                  required
                  value={editingAd.title || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্লেসমেন্ট পজিশন *
                </label>
                <select
                  value={editingAd.placement}
                  onChange={(e) =>
                    setEditingAd({ ...editingAd, placement: e.target.value as AdPlacement })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                >
                  {placements.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  টার্গেট ডিভাইস
                </label>
                <select
                  value={editingAd.device || 'all'}
                  onChange={(e) => setEditingAd({ ...editingAd, device: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-white"
                >
                  <option value="all">সকল ডিভাইস (Desktop + Mobile)</option>
                  <option value="desktop">শুধুমাত্র কম্পিউটার (Desktop Only)</option>
                  <option value="mobile">শুধুমাত্র মোবাইল (Mobile Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Adsterra / ব্যানার HTML / Script কোড *</span>
                  <Code2 className="w-3.5 h-3.5 text-rose-800" />
                </label>
                <textarea
                  rows={7}
                  required
                  placeholder="<script ...> বা <div>...</div> কোড পেস্ট করুন"
                  value={editingAd.adCode || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, adCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAd.isActive}
                    onChange={(e) =>
                      setEditingAd({ ...editingAd, isActive: e.target.checked })
                    }
                    className="rounded text-rose-800"
                  />
                  <span>বিজ্ঞাপনটি ওয়েবসাইটে দৃশ্যমান রাখুন (Active)</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs shadow-sm transition"
                >
                  বিজ্ঞাপন কোড সংরক্ষণ করুন
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              বিজ্ঞাপন স্লট কনফিগার করতে বামের তালিকায় 'কোড বসান' বা এডিট চাপুন।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
