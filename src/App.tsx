import React from 'react';
import { NewsProvider, useNews } from './context/NewsContext.tsx';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { BreakingNewsTicker } from './components/layout/BreakingNewsTicker.tsx';
import { ToastContainer } from './components/common/Toast.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { ArticlePage } from './pages/ArticlePage.tsx';
import { CategoryPage } from './pages/CategoryPage.tsx';
import { LatestPage } from './pages/LatestPage.tsx';
import { SearchPage } from './pages/SearchPage.tsx';
import { StaticPage } from './pages/StaticPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';

const AppContent: React.FC = () => {
  const { currentPath = '/' } = useNews();

  // Dedicated Admin & Editor Secure Portal routing
  if (
    currentPath.startsWith('/admin') ||
    currentPath === '/login' ||
    currentPath === '/portal' ||
    currentPath === '/editor' ||
    currentPath === '/editorial'
  ) {
    return (
      <ErrorBoundary>
        <ToastContainer />
        <AdminPage />
      </ErrorBoundary>
    );
  }

  // Article routing: /article/:slug
  if (currentPath.startsWith('/article/')) {
    const slug = currentPath.replace('/article/', '').split('?')[0];
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        <ToastContainer />
        <Header />
        <BreakingNewsTicker />
        <div className="flex-1">
          <ErrorBoundary>
            <ArticlePage slug={slug} />
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    );
  }

  // Category routing: /category/:slug
  if (currentPath.startsWith('/category/')) {
    const slug = currentPath.replace('/category/', '').split('?')[0];
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        <ToastContainer />
        <Header />
        <BreakingNewsTicker />
        <div className="flex-1">
          <ErrorBoundary>
            <CategoryPage slug={slug} />
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    );
  }

  // Latest news stream: /latest
  if (currentPath === '/latest') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        <ToastContainer />
        <Header />
        <BreakingNewsTicker />
        <div className="flex-1">
          <ErrorBoundary>
            <LatestPage />
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    );
  }

  // Search page: /search
  if (currentPath.startsWith('/search')) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        <ToastContainer />
        <Header />
        <BreakingNewsTicker />
        <div className="flex-1">
          <ErrorBoundary>
            <SearchPage />
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    );
  }

  // Static info pages
  if (currentPath === '/about') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        <ToastContainer />
        <Header />
        <BreakingNewsTicker />
        <div className="flex-1">
          <ErrorBoundary>
            <StaticPage type="about" />
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    );
  }

  if (currentPath === '/contact') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        <ToastContainer />
        <Header />
        <BreakingNewsTicker />
        <div className="flex-1">
          <ErrorBoundary>
            <StaticPage type="contact" />
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    );
  }

  if (currentPath === '/privacy-policy') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        <ToastContainer />
        <Header />
        <BreakingNewsTicker />
        <div className="flex-1">
          <ErrorBoundary>
            <StaticPage type="privacy-policy" />
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    );
  }

  if (currentPath === '/terms') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        <ToastContainer />
        <Header />
        <BreakingNewsTicker />
        <div className="flex-1">
          <ErrorBoundary>
            <StaticPage type="terms" />
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    );
  }

  if (currentPath === '/disclaimer') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        <ToastContainer />
        <Header />
        <BreakingNewsTicker />
        <div className="flex-1">
          <ErrorBoundary>
            <StaticPage type="disclaimer" />
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    );
  }

  // Default: Homepage
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <ToastContainer />
      <Header />
      <BreakingNewsTicker />
      <div className="flex-1">
        <ErrorBoundary>
          <HomePage />
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <NewsProvider>
        <AppContent />
      </NewsProvider>
    </ErrorBoundary>
  );
}

