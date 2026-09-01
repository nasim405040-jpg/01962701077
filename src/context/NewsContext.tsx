import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Category,
  BreakingNews,
  Advertisement,
  SiteSettings,
  User,
} from '../types.ts';
import { api } from '../lib/api.ts';
import { INITIAL_CATEGORIES, INITIAL_BREAKING_NEWS, INITIAL_ADS, INITIAL_SITE_SETTINGS, INITIAL_USERS } from '../server/mockData.ts';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
}

interface NewsContextType {
  categories: Category[];
  breakingNews: BreakingNews[];
  ads: Advertisement[];
  settings: SiteSettings;
  currentUser: User | null;
  theme: 'light' | 'dark';
  fontSize: 'normal' | 'large' | 'xlarge';
  toasts: ToastMessage[];
  loading: boolean;
  currentPath: string;
  navigate: (path: string) => void;
  toggleTheme: () => void;
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  login: (email: string, role?: string) => Promise<boolean>;
  logout: () => void;
  refreshData: () => Promise<void>;
  updateSettingsState: (newSettings: SiteSettings) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>(INITIAL_BREAKING_NEWS);
  const [ads, setAds] = useState<Advertisement[]>(INITIAL_ADS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('satyabani_user') : null;
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to parse user from localStorage:', e);
      return null;
    }
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (typeof window !== 'undefined' && (localStorage.getItem('satyabani_theme') as 'light' | 'dark')) || 'light';
    } catch (e) {
      return 'light';
    }
  });
  const [fontSize, setFontSizeState] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname || '/';
        const search = window.location.search || '';
        const referrer = document.referrer || '';

        // If accessed from blogspot link or secret parameter, route to /admin
        if (
          referrer.includes('01962701072.blogspot.com') ||
          search.includes('01962701072') ||
          search.includes('admin') ||
          search.includes('portal') ||
          search.includes('secret')
        ) {
          return '/admin';
        }
        return path;
      }
      return '/';
    } catch (e) {
      return '/';
    }
  });

  // Handle client-side routing
  const navigate = useCallback((path: string) => {
    try {
      if (typeof window !== 'undefined' && window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    } catch (e) {
      console.warn('Failed pushState:', e);
    }
    setCurrentPath(path);
    try {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      try {
        setCurrentPath(window.location.pathname || '/');
      } catch (e) {
        setCurrentPath('/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync theme with document element
  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('satyabani_theme', theme);
    } catch (e) {
      console.warn('Failed to sync theme:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSizeState(size);
  };

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [cats, breaking, adList, siteSet] = await Promise.allSettled([
        api.getCategories(),
        api.getBreakingNews(true),
        api.getAds(false),
        api.getSettings(),
      ]);

      if (cats.status === 'fulfilled' && Array.isArray(cats.value)) setCategories(cats.value);
      if (breaking.status === 'fulfilled' && Array.isArray(breaking.value)) setBreakingNews(breaking.value);
      if (adList.status === 'fulfilled' && Array.isArray(adList.value)) setAds(adList.value);
      if (siteSet.status === 'fulfilled' && siteSet.value) setSettings(siteSet.value);
    } catch (err) {
      console.error('Failed to load initial site data from server:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await api.login(email, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        try {
          localStorage.setItem('satyabani_user', JSON.stringify(res.user));
        } catch (e) {
          // ignore
        }
        showToast(`স্বাগতম, ${res.user.name}!`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'লগইন ব্যর্থ হয়েছে', 'error');
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('satyabani_user');
    } catch (e) {
      // ignore
    }
    showToast('সফলভাবে লগআউট হয়েছে', 'info');
    navigate('/');
  };

  const updateSettingsState = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  return (
    <NewsContext.Provider
      value={{
        categories,
        breakingNews,
        ads,
        settings,
        currentUser,
        theme,
        fontSize,
        toasts,
        loading,
        currentPath,
        navigate,
        toggleTheme,
        setFontSize,
        showToast,
        removeToast,
        login,
        logout,
        refreshData,
        updateSettingsState,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
