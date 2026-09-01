import React, { useState } from 'react';
import { useNews } from '../context/NewsContext.tsx';
import { AdminLayout } from '../components/admin/AdminLayout.tsx';
import { AdminDashboard } from '../components/admin/AdminDashboard.tsx';
import { AdminArticleList } from '../components/admin/AdminArticleList.tsx';
import { AdminArticleEditor } from '../components/admin/AdminArticleEditor.tsx';
import { AdminCategoryManager } from '../components/admin/AdminCategoryManager.tsx';
import { AdminBreakingNews } from '../components/admin/AdminBreakingNews.tsx';
import { AdminAdsManager } from '../components/admin/AdminAdsManager.tsx';
import { AdminAuthorManager } from '../components/admin/AdminAuthorManager.tsx';
import { AdminMediaLibrary } from '../components/admin/AdminMediaLibrary.tsx';
import { AdminComments } from '../components/admin/AdminComments.tsx';
import { AdminHomepageBuilder } from '../components/admin/AdminHomepageBuilder.tsx';
import { AdminSiteSettings } from '../components/admin/AdminSiteSettings.tsx';
import { AdminExportDeployment } from '../components/admin/AdminExportDeployment.tsx';
import { AdminAudienceReach } from '../components/admin/AdminAudienceReach.tsx';
import { AdminNetlifyHub } from '../components/admin/AdminNetlifyHub.tsx';
import { AdminLoginModal } from '../components/admin/AdminLoginModal.tsx';
import { SEOHead } from '../components/common/SEOHead.tsx';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { currentUser, navigate, settings } = useNews();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // If not logged in, show AdminLoginModal
  if (!currentUser) {
    return (
      <>
        <SEOHead title="CMS পোর্টাল লগইন" description="সত্যবাণী কন্ট্রোল প্যানেল" />
        <AdminLoginModal onCancel={() => navigate('/')} />
      </>
    );
  }

  const isEditor = currentUser.role === 'editor';
  const adminOnlyTabs = ['ads', 'homepage_builder', 'netlify_hub', 'settings', 'export_deploy'];

  const handleNavigateTab = (tab: string, articleId?: string) => {
    if (tab === 'edit_article' && articleId) {
      setEditingArticleId(articleId);
      setCurrentTab('edit_article');
    } else if (tab === 'new_article') {
      setEditingArticleId(null);
      setCurrentTab('new_article');
    } else {
      setEditingArticleId(null);
      setCurrentTab(tab);
    }
  };

  return (
    <>
      <SEOHead
        title={isEditor ? 'সম্পাদক ড্যাশবোর্ড' : 'এডমিন ড্যাশবোর্ড'}
        description={`${settings.siteName} CMS কন্ট্রোল প্যানেল`}
      />
      <AdminLayout currentTab={currentTab} onTabChange={handleNavigateTab}>
        {isEditor && adminOnlyTabs.includes(currentTab) ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center max-w-lg mx-auto my-12 shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              প্রশাসনিক সীমাবদ্ধতা (Admin Only Access)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              এই বিভাগটি শুধুমাত্র প্রধান সিস্টেম প্রশাসকের (Super Admin) জন্য সংরক্ষিত। বার্তা সম্পাদক হিসেবে আপনি সংবাদ লেখা, সম্পাদনা, ব্রেকিং নিউজ এবং পোস্ট রিচ টুলস পরিচালনা করতে পারেন।
            </p>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-sm transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>সম্পাদক ড্যাশবোর্ডে ফিরে যান</span>
            </button>
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <AdminDashboard onNavigateTab={handleNavigateTab} />
            )}
            {currentTab === 'articles' && (
              <AdminArticleList onNavigateTab={handleNavigateTab} />
            )}
            {(currentTab === 'new_article' || currentTab === 'edit_article') && (
              <AdminArticleEditor
                articleId={editingArticleId}
                onBack={() => setCurrentTab('articles')}
              />
            )}
            {currentTab === 'audience_reach' && <AdminAudienceReach />}
            {currentTab === 'categories' && <AdminCategoryManager />}
            {currentTab === 'breaking' && <AdminBreakingNews />}
            {currentTab === 'ads' && <AdminAdsManager />}
            {currentTab === 'homepage_builder' && <AdminHomepageBuilder />}
            {currentTab === 'authors' && <AdminAuthorManager />}
            {currentTab === 'media' && <AdminMediaLibrary />}
            {currentTab === 'comments' && <AdminComments />}
            {currentTab === 'netlify_hub' && <AdminNetlifyHub />}
            {currentTab === 'settings' && <AdminSiteSettings />}
            {currentTab === 'export_deploy' && <AdminExportDeployment />}
          </>
        )}
      </AdminLayout>
    </>
  );
};
