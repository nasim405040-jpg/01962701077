import React, { useState } from 'react';
import { HomepageSectionConfig } from '../../types.ts';
import { api } from '../../lib/api.ts';
import { useNews } from '../../context/NewsContext.tsx';
import { LayoutTemplate, ArrowUp, ArrowDown, Save, Eye, EyeOff } from 'lucide-react';

export const AdminHomepageBuilder: React.FC = () => {
  const { settings, updateSettingsState, showToast } = useNews();
  const [sections, setSections] = useState<HomepageSectionConfig[]>(
    settings.homepageSections || [
      { id: 'sec-hero', sectionKey: 'hero', title: 'প্রধান লিড ও হিরো গ্রিড', isEnabled: true, order: 1, layoutStyle: 'hero_classic' },
      { id: 'sec-latest', sectionKey: 'latest_feed', title: 'সর্বশেষ সংবাদ স্ট্রিম', isEnabled: true, order: 2, layoutStyle: 'stream' },
      { id: 'sec-national', sectionKey: 'category_national', title: 'জাতীয় সংবাদ ব্লক', isEnabled: true, order: 3, categorySlug: 'national', layoutStyle: 'grid_4' },
      { id: 'sec-politics', sectionKey: 'category_politics', title: 'রাজনীতি সংবাদ ব্লক', isEnabled: true, order: 4, categorySlug: 'politics', layoutStyle: 'split_1_3' },
      { id: 'sec-economy', sectionKey: 'category_economy', title: 'অর্থনীতি ও বাণিজ্য', isEnabled: true, order: 5, categorySlug: 'economy', layoutStyle: 'grid_4' },
      { id: 'sec-international', sectionKey: 'category_international', title: 'আন্তর্জাতিক খবর', isEnabled: true, order: 6, categorySlug: 'international', layoutStyle: 'grid_4' },
      { id: 'sec-sports', sectionKey: 'category_sports', title: 'খেলাধুলা বিভাগ', isEnabled: true, order: 7, categorySlug: 'sports', layoutStyle: 'split_1_3' },
      { id: 'sec-videos', sectionKey: 'video_gallery', title: 'ভিডিও ও মাল্টিমিডিয়া কর্নার', isEnabled: true, order: 8, layoutStyle: 'media_dark' },
      { id: 'sec-photos', sectionKey: 'photo_gallery', title: 'ছবিতে বাংলাদেশ (ফটো গ্যালারি)', isEnabled: true, order: 9, layoutStyle: 'masonry' },
    ]
  );
  const [saving, setSaving] = useState(false);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    // re-assign order numbers
    const reordered = updated.map((sec, i) => ({ ...sec, order: i + 1 }));
    setSections(reordered);
  };

  const handleToggle = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  const handleSaveLayout = async () => {
    try {
      setSaving(true);
      await api.updateHomepageSections(sections as any);
      const updated = await api.updateSettings({
        homepageSections: sections as any,
      });
      updateSettingsState(updated);
      showToast('হোমপেজ লেআউট ও সেকশন ক্রম সফলভাবে সংরক্ষিত হয়েছে', 'success');
    } catch (err: any) {
      showToast(err.message || 'লেআউট সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-serif text-slate-950 dark:text-white flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-rose-800" />
            <span>হোমপেজ লেআউট ও সেকশন বিল্ডার</span>
          </h2>
          <p className="text-xs text-slate-500">
            প্রচ্ছদের সেকশনগুলোর অবস্থান, ক্রম ও ভিজিবিলিটি ড্র্যাগ/মুভ করে কাস্টমাইজ করুন
          </p>
        </div>

        <button
          onClick={handleSaveLayout}
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs transition shadow-sm self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'লেআউট পরিবর্তন সংরক্ষণ করুন'}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs max-w-4xl space-y-3">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
              sec.isEnabled
                ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                : 'bg-slate-100/60 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold font-mono text-slate-600 dark:text-slate-300">
                {idx + 1}
              </span>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {sec.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  {sec.sectionKey} • স্টাইল: {sec.layoutStyle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle(sec.id)}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 font-semibold ${
                  sec.isEnabled
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 border-emerald-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300'
                }`}
                title={sec.isEnabled ? 'লুকান' : 'প্রদর্শন করুন'}
              >
                {sec.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{sec.isEnabled ? 'দৃশ্যমান' : 'লুকানো'}</span>
              </button>

              <div className="flex items-center bg-slate-200 dark:bg-slate-700 rounded-lg p-0.5">
                <button
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1 text-slate-600 dark:text-slate-300 hover:text-rose-800 disabled:opacity-30"
                  title="উপরে নিন"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  disabled={idx === sections.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1 text-slate-600 dark:text-slate-300 hover:text-rose-800 disabled:opacity-30"
                  title="নিচে নিন"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
