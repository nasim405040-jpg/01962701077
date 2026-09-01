import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as fsLimit,
  getDocFromServer,
  writeBatch,
} from 'firebase/firestore';
import { firestoreDb } from './firebase.ts';
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

// Collections
const COL_ARTICLES = 'articles';
const COL_ADS = 'ads';
const COL_BREAKING = 'breaking_news';
const COL_CATEGORIES = 'categories';
const COL_AUTHORS = 'authors';
const COL_COMMENTS = 'comments';
const COL_MEDIA = 'media';
const COL_SETTINGS = 'settings';
const COL_USERS = 'users';

let isInitialized = false;

// Seed initial content if Firestore is empty
export async function ensureFirestoreSeeded(): Promise<void> {
  if (isInitialized) return;
  try {
    const testDoc = await getDocFromServer(doc(firestoreDb, COL_SETTINGS, 'site_config')).catch(() => null);
    if (!testDoc || !testDoc.exists()) {
      // Seed initial base data in batches
      const batch = writeBatch(firestoreDb);

      // Seed Site Settings
      batch.set(doc(firestoreDb, COL_SETTINGS, 'site_config'), INITIAL_SITE_SETTINGS);

      // Seed Categories
      for (const cat of INITIAL_CATEGORIES) {
        batch.set(doc(firestoreDb, COL_CATEGORIES, cat.id), cat);
      }

      // Seed Authors
      for (const auth of INITIAL_AUTHORS) {
        batch.set(doc(firestoreDb, COL_AUTHORS, auth.id), auth);
      }

      // Seed Ads
      for (const ad of INITIAL_ADS) {
        batch.set(doc(firestoreDb, COL_ADS, ad.id), ad);
      }

      // Seed Breaking News
      for (const bn of INITIAL_BREAKING_NEWS) {
        batch.set(doc(firestoreDb, COL_BREAKING, bn.id), bn);
      }

      // Seed sample Articles (first 8)
      for (const art of INITIAL_ARTICLES.slice(0, 10)) {
        batch.set(doc(firestoreDb, COL_ARTICLES, art.id), art);
      }

      await batch.commit();
      console.log('Firebase Firestore successfully initialized and seeded with initial news data.');
    }
    isInitialized = true;
  } catch (err) {
    console.warn('Firestore seeding check skipped or failed:', err);
    isInitialized = true;
  }
}

// Ensure seeding triggers on load
if (typeof window !== 'undefined') {
  ensureFirestoreSeeded().catch(() => {});
}

export const firestoreService = {
  // Articles
  async getArticles(params?: {
    categorySlug?: string;
    categoryId?: string;
    status?: string;
    tag?: string;
    authorId?: string;
    search?: string;
    featured?: boolean;
    breaking?: boolean;
    limit?: number;
    page?: number;
    all?: boolean;
  }): Promise<{ data: Article[]; total: number; page?: number; limit?: number; totalPages?: number }> {
    await ensureFirestoreSeeded();
    const articlesCol = collection(firestoreDb, COL_ARTICLES);
    const snap = await getDocs(articlesCol);
    let list: Article[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as Article), id: d.id }));

    // If Firestore has no articles yet, fallback to INITIAL_ARTICLES
    if (list.length === 0) {
      list = [...INITIAL_ARTICLES];
    }

    // Apply filtering
    if (params?.status && params.status !== 'all') {
      list = list.filter((a) => a.status === params.status);
    }
    if (params?.categorySlug) {
      list = list.filter((a) => a.categorySlug === params.categorySlug);
    }
    if (params?.categoryId) {
      list = list.filter((a) => a.categoryId === params.categoryId);
    }
    if (params?.authorId) {
      list = list.filter((a) => a.authorId === params.authorId);
    }
    if (params?.breaking) {
      list = list.filter((a) => a.isBreaking);
    }
    if (params?.featured) {
      list = list.filter((a) => a.isFeatured);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          a.categoryName?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());

    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const total = list.length;
    const startIndex = (page - 1) * limit;
    const data = list.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  },

  async getArticle(slugOrId: string): Promise<{ article: Article; related: Article[] }> {
    await ensureFirestoreSeeded();
    const articlesCol = collection(firestoreDb, COL_ARTICLES);
    const snap = await getDocs(articlesCol);
    let list: Article[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as Article), id: d.id }));

    if (list.length === 0) list = [...INITIAL_ARTICLES];

    const article = list.find((a) => a.slug === slugOrId || a.id === slugOrId);
    if (!article) throw new Error('সংবাদ পাওয়া যায়নি');

    const related = list.filter((a) => a.id !== article.id && a.categoryId === article.categoryId).slice(0, 4);
    return { article, related };
  },

  async createArticle(data: Partial<Article>): Promise<Article> {
    await ensureFirestoreSeeded();
    const id = data.id || 'art-' + Date.now();
    const newArt: Article = {
      ...data,
      id,
      slug: data.slug || `news-${Date.now()}`,
      title: data.title || '',
      excerpt: data.excerpt || '',
      content: data.content || '',
      categoryName: data.categoryName || 'জাতীয়',
      categorySlug: data.categorySlug || 'national',
      views: 0,
      status: (data.status as any) || 'published',
      publishedAt: data.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Article;

    await setDoc(doc(firestoreDb, COL_ARTICLES, id), newArt);
    return newArt;
  },

  async updateArticle(id: string, data: Partial<Article>): Promise<Article> {
    await ensureFirestoreSeeded();
    const docRef = doc(firestoreDb, COL_ARTICLES, id);
    const updated = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, updated, { merge: true });
    const snap = await getDoc(docRef);
    return { ...(snap.data() as Article), id: snap.id };
  },

  async deleteArticle(id: string): Promise<{ success: boolean }> {
    await ensureFirestoreSeeded();
    await deleteDoc(doc(firestoreDb, COL_ARTICLES, id));
    return { success: true };
  },

  async bulkActionArticles(ids: string[], action: string, extraParam?: string): Promise<{ success: boolean; affected: number }> {
    await ensureFirestoreSeeded();
    const batch = writeBatch(firestoreDb);
    for (const id of ids) {
      const ref = doc(firestoreDb, COL_ARTICLES, id);
      if (action === 'delete') {
        batch.delete(ref);
      } else if (action === 'publish') {
        batch.update(ref, { status: 'published' });
      } else if (action === 'draft') {
        batch.update(ref, { status: 'draft' });
      } else if (action === 'change_category' && extraParam) {
        batch.update(ref, { categoryId: extraParam });
      }
    }
    await batch.commit();
    return { success: true, affected: ids.length };
  },

  // Advertisements
  async getAds(activeOnly = false): Promise<Advertisement[]> {
    await ensureFirestoreSeeded();
    const adsCol = collection(firestoreDb, COL_ADS);
    const snap = await getDocs(adsCol);
    let list: Advertisement[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as Advertisement), id: d.id }));
    if (list.length === 0) list = [...INITIAL_ADS];
    return activeOnly ? list.filter((a) => a.isActive) : list;
  },

  async createAd(data: Partial<Advertisement>): Promise<Advertisement> {
    await ensureFirestoreSeeded();
    const id = data.id || 'ad-' + Date.now();
    const newAd: Advertisement = {
      id,
      name: data.name || data.title || 'বিজ্ঞাপন',
      title: data.title || data.name || 'বিজ্ঞাপন',
      type: data.type || 'banner',
      placement: data.placement || 'sidebar',
      device: data.device || 'all',
      imageUrl: data.imageUrl || '',
      targetUrl: data.targetUrl || '',
      adCode: data.adCode || '',
      isActive: data.isActive ?? true,
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate,
    };
    await setDoc(doc(firestoreDb, COL_ADS, id), newAd);
    return newAd;
  },

  async updateAd(id: string, data: Partial<Advertisement>): Promise<Advertisement> {
    await ensureFirestoreSeeded();
    const ref = doc(firestoreDb, COL_ADS, id);
    await setDoc(ref, data, { merge: true });
    const snap = await getDoc(ref);
    return { ...(snap.data() as Advertisement), id: snap.id };
  },

  async deleteAd(id: string): Promise<{ success: boolean }> {
    await ensureFirestoreSeeded();
    await deleteDoc(doc(firestoreDb, COL_ADS, id));
    return { success: true };
  },

  // Breaking News
  async getBreakingNews(all = false): Promise<BreakingNews[]> {
    await ensureFirestoreSeeded();
    const col = collection(firestoreDb, COL_BREAKING);
    const snap = await getDocs(col);
    let list: BreakingNews[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as BreakingNews), id: d.id }));
    if (list.length === 0) list = [...INITIAL_BREAKING_NEWS];
    return all ? list : list.filter((b) => b.isActive);
  },

  async createBreakingNews(data: Partial<BreakingNews>): Promise<BreakingNews> {
    await ensureFirestoreSeeded();
    const id = data.id || 'bn-' + Date.now();
    const item: BreakingNews = {
      id,
      title: data.title || '',
      link: data.link,
      isActive: data.isActive ?? true,
      priority: data.priority || 1,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(firestoreDb, COL_BREAKING, id), item);
    return item;
  },

  async updateBreakingNews(id: string, data: Partial<BreakingNews>): Promise<BreakingNews> {
    await ensureFirestoreSeeded();
    const ref = doc(firestoreDb, COL_BREAKING, id);
    await setDoc(ref, data, { merge: true });
    const snap = await getDoc(ref);
    return { ...(snap.data() as BreakingNews), id: snap.id };
  },

  async deleteBreakingNews(id: string): Promise<{ success: boolean }> {
    await ensureFirestoreSeeded();
    await deleteDoc(doc(firestoreDb, COL_BREAKING, id));
    return { success: true };
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    await ensureFirestoreSeeded();
    const col = collection(firestoreDb, COL_CATEGORIES);
    const snap = await getDocs(col);
    let list: Category[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as Category), id: d.id }));
    if (list.length === 0) list = [...INITIAL_CATEGORIES];
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    return list;
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    await ensureFirestoreSeeded();
    const id = data.id || 'cat-' + Date.now();
    const item: Category = {
      id,
      name: data.name || '',
      slug: data.slug || '',
      order: data.order || 99,
      showInNav: data.showInNav ?? true,
      showOnHome: data.showOnHome ?? true,
      postCount: 0,
    };
    await setDoc(doc(firestoreDb, COL_CATEGORIES, id), item);
    return item;
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    await ensureFirestoreSeeded();
    const ref = doc(firestoreDb, COL_CATEGORIES, id);
    await setDoc(ref, data, { merge: true });
    const snap = await getDoc(ref);
    return { ...(snap.data() as Category), id: snap.id };
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    await ensureFirestoreSeeded();
    await deleteDoc(doc(firestoreDb, COL_CATEGORIES, id));
    return { success: true };
  },

  // Authors
  async getAuthors(): Promise<Author[]> {
    await ensureFirestoreSeeded();
    const col = collection(firestoreDb, COL_AUTHORS);
    const snap = await getDocs(col);
    let list: Author[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as Author), id: d.id }));
    if (list.length === 0) list = [...INITIAL_AUTHORS];
    return list;
  },

  async createAuthor(data: Partial<Author>): Promise<Author> {
    await ensureFirestoreSeeded();
    const id = data.id || 'auth-' + Date.now();
    const item: Author = {
      id,
      name: data.name || '',
      slug: data.slug || `author-${Date.now()}`,
      designation: data.designation || 'রিপোর্টার',
      photo: data.photo || data.avatar || '',
      avatar: data.avatar || data.photo || '',
      bio: data.bio || '',
      articleCount: 0,
    };
    await setDoc(doc(firestoreDb, COL_AUTHORS, id), item);
    return item;
  },

  async updateAuthor(id: string, data: Partial<Author>): Promise<Author> {
    await ensureFirestoreSeeded();
    const ref = doc(firestoreDb, COL_AUTHORS, id);
    await setDoc(ref, data, { merge: true });
    const snap = await getDoc(ref);
    return { ...(snap.data() as Author), id: snap.id };
  },

  async deleteAuthor(id: string): Promise<{ success: boolean }> {
    await ensureFirestoreSeeded();
    await deleteDoc(doc(firestoreDb, COL_AUTHORS, id));
    return { success: true };
  },

  // Site Settings
  async getSettings(): Promise<SiteSettings> {
    await ensureFirestoreSeeded();
    const snap = await getDoc(doc(firestoreDb, COL_SETTINGS, 'site_config'));
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
    return INITIAL_SITE_SETTINGS;
  },

  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    await ensureFirestoreSeeded();
    const ref = doc(firestoreDb, COL_SETTINGS, 'site_config');
    await setDoc(ref, data, { merge: true });
    const snap = await getDoc(ref);
    return snap.data() as SiteSettings;
  },

  // Homepage Config
  async getHomepageSections(): Promise<HomepageSectionConfig[]> {
    await ensureFirestoreSeeded();
    const snap = await getDoc(doc(firestoreDb, COL_SETTINGS, 'homepage_config'));
    if (snap.exists() && Array.isArray((snap.data() as any).sections)) {
      return (snap.data() as any).sections;
    }
    return INITIAL_HOMEPAGE_CONFIG;
  },

  async updateHomepageSections(sections: HomepageSectionConfig[]): Promise<HomepageSectionConfig[]> {
    await ensureFirestoreSeeded();
    const ref = doc(firestoreDb, COL_SETTINGS, 'homepage_config');
    await setDoc(ref, { sections });
    return sections;
  },

  // Media
  async getMedia(): Promise<MediaItem[]> {
    await ensureFirestoreSeeded();
    const col = collection(firestoreDb, COL_MEDIA);
    const snap = await getDocs(col);
    let list: MediaItem[] = [];
    snap.forEach((d) => list.push({ ...(d.data() as MediaItem), id: d.id }));
    if (list.length === 0) list = [...INITIAL_MEDIA];
    return list;
  },

  async addMedia(data: Partial<MediaItem>): Promise<MediaItem> {
    await ensureFirestoreSeeded();
    const id = data.id || 'med-' + Date.now();
    const item: MediaItem = {
      id,
      name: data.name || 'uploaded-photo.jpg',
      url: data.url || '',
      size: data.size || 200000,
      mimeType: data.mimeType || 'image/jpeg',
      dimensions: data.dimensions || '1200x800',
      altText: data.altText || '',
      caption: data.caption || '',
      uploadedAt: new Date().toISOString(),
    };
    await setDoc(doc(firestoreDb, COL_MEDIA, id), item);
    return item;
  },

  async deleteMedia(id: string): Promise<{ success: boolean }> {
    await ensureFirestoreSeeded();
    await deleteDoc(doc(firestoreDb, COL_MEDIA, id));
    return { success: true };
  },
};
