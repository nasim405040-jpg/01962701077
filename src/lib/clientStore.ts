import {
  Article,
  Category,
  BreakingNews,
  Advertisement,
  Author,
  User,
  Comment,
  HomepageSectionConfig,
  SiteSettings,
  MediaItem,
  AnalyticsSummary,
  SystemLog,
} from '../types.ts';
import {
  INITIAL_CATEGORIES,
  INITIAL_AUTHORS,
  INITIAL_USERS,
  INITIAL_BREAKING_NEWS,
  INITIAL_ARTICLES,
  INITIAL_ADS,
  INITIAL_COMMENTS,
  INITIAL_HOMEPAGE_CONFIG,
  INITIAL_SITE_SETTINGS,
  INITIAL_MEDIA,
} from '../server/mockData.ts';

const STORAGE_KEY = 'satyabani_cms_store_v1';

export interface LocalCMSData {
  articles: Article[];
  categories: Category[];
  breakingNews: BreakingNews[];
  ads: Advertisement[];
  authors: Author[];
  users: (User & { password?: string })[];
  comments: Comment[];
  homepageSections: HomepageSectionConfig[];
  siteSettings: SiteSettings;
  media: MediaItem[];
  logs: SystemLog[];
}

function getDefaultData(): LocalCMSData {
  return {
    articles: [...INITIAL_ARTICLES],
    categories: [...INITIAL_CATEGORIES],
    breakingNews: [...INITIAL_BREAKING_NEWS],
    ads: [...INITIAL_ADS],
    authors: [...INITIAL_AUTHORS],
    users: [...INITIAL_USERS],
    comments: [...INITIAL_COMMENTS],
    homepageSections: [...INITIAL_HOMEPAGE_CONFIG],
    siteSettings: { ...INITIAL_SITE_SETTINGS },
    media: [...INITIAL_MEDIA],
    logs: [
      {
        id: 'log-1',
        action: 'সিস্টেম স্টোরেজ রেডি',
        user: 'সিস্টেম',
        details: 'স্ট্যাটিক ও অফলাইন ব্রাউজার মোড সক্রিয় রয়েছে।',
        ip: '127.0.0.1',
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

export function getLocalCMSData(): LocalCMSData {
  if (typeof window === 'undefined') return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return {
      articles: Array.isArray(parsed.articles) ? parsed.articles : INITIAL_ARTICLES,
      categories: Array.isArray(parsed.categories) ? parsed.categories : INITIAL_CATEGORIES,
      breakingNews: Array.isArray(parsed.breakingNews) ? parsed.breakingNews : INITIAL_BREAKING_NEWS,
      ads: Array.isArray(parsed.ads) ? parsed.ads : INITIAL_ADS,
      authors: Array.isArray(parsed.authors) ? parsed.authors : INITIAL_AUTHORS,
      users: Array.isArray(parsed.users) ? parsed.users : INITIAL_USERS,
      comments: Array.isArray(parsed.comments) ? parsed.comments : INITIAL_COMMENTS,
      homepageSections: Array.isArray(parsed.homepageSections) ? parsed.homepageSections : INITIAL_HOMEPAGE_CONFIG,
      siteSettings: parsed.siteSettings || INITIAL_SITE_SETTINGS,
      media: Array.isArray(parsed.media) ? parsed.media : INITIAL_MEDIA,
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
    };
  } catch (err) {
    console.warn('Failed to load local CMS store:', err);
    return getDefaultData();
  }
}

export function saveLocalCMSData(data: Partial<LocalCMSData>): LocalCMSData {
  if (typeof window === 'undefined') return getDefaultData();
  try {
    const current = getLocalCMSData();
    const updated: LocalCMSData = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save to local CMS store:', err);
    return getLocalCMSData();
  }
}
