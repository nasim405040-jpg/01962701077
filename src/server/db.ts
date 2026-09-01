import fs from 'fs';
import path from 'path';
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
  SystemLog,
  AnalyticsSummary,
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
} from './mockData.ts';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'satyabani_db.json');

export interface DatabaseState {
  categories: Category[];
  authors: Author[];
  users: User[];
  breakingNews: BreakingNews[];
  articles: Article[];
  ads: Advertisement[];
  comments: Comment[];
  homepageSections: HomepageSectionConfig[];
  siteSettings: SiteSettings;
  media: MediaItem[];
  logs: SystemLog[];
}

class DatabaseManager {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Merge initial users so newly configured accounts are always available
        const existingUsers: User[] = parsed.users || [];
        const mergedUsers = [...INITIAL_USERS];
        existingUsers.forEach((u) => {
          if (!mergedUsers.some((mu) => mu.email.toLowerCase() === u.email.toLowerCase())) {
            mergedUsers.push(u);
          }
        });

        return {
          categories: parsed.categories || INITIAL_CATEGORIES,
          authors: parsed.authors || INITIAL_AUTHORS,
          users: mergedUsers,
          breakingNews: parsed.breakingNews || INITIAL_BREAKING_NEWS,
          articles: parsed.articles || INITIAL_ARTICLES,
          ads: parsed.ads || INITIAL_ADS,
          comments: parsed.comments || INITIAL_COMMENTS,
          homepageSections: parsed.homepageSections || INITIAL_HOMEPAGE_CONFIG,
          siteSettings: parsed.siteSettings || INITIAL_SITE_SETTINGS,
          media: parsed.media || INITIAL_MEDIA,
          logs: parsed.logs || [
            {
              id: 'log-init',
              action: 'সিস্টেম ইনিশিয়ালাইজেশন',
              user: 'সিস্টেম',
              details: 'সত্যবাণী ডেটাবেস সফলভাবে প্রস্তুত হয়েছে।',
              ip: '127.0.0.1',
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
    } catch (err) {
      console.warn('Failed to load database file, initializing defaults:', err);
    }

    return {
      categories: [...INITIAL_CATEGORIES],
      authors: [...INITIAL_AUTHORS],
      users: [...INITIAL_USERS],
      breakingNews: [...INITIAL_BREAKING_NEWS],
      articles: [...INITIAL_ARTICLES],
      ads: [...INITIAL_ADS],
      comments: [...INITIAL_COMMENTS],
      homepageSections: [...INITIAL_HOMEPAGE_CONFIG],
      siteSettings: { ...INITIAL_SITE_SETTINGS },
      media: [...INITIAL_MEDIA],
      logs: [
        {
          id: 'log-init',
          action: 'সিস্টেম ইনিশিয়ালাইজেশন',
          user: 'সিস্টেম',
          details: 'সত্যবাণী ডেটাবেস ডিফল্ট ডেটা দিয়ে লোড হয়েছে।',
          ip: '127.0.0.1',
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  private persistState() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database state to file:', err);
    }
  }

  public addLog(action: string, user: string, details: string, ip = '127.0.0.1') {
    const newLog: SystemLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      action,
      user,
      details,
      ip,
      timestamp: new Date().toISOString(),
    };
    this.state.logs.unshift(newLog);
    if (this.state.logs.length > 200) {
      this.state.logs = this.state.logs.slice(0, 200);
    }
    this.persistState();
  }

  // Articles
  public getArticles(filters?: {
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
  }) {
    let list = [...this.state.articles];

    if (filters?.status) {
      list = list.filter((a) => a.status === filters.status);
    } else {
      // Default to published in public API
      list = list.filter((a) => a.status === 'published');
    }

    if (filters?.categorySlug) {
      list = list.filter((a) => a.categorySlug === filters.categorySlug);
    }
    if (filters?.categoryId) {
      list = list.filter((a) => a.categoryId === filters.categoryId);
    }
    if (filters?.authorId) {
      list = list.filter((a) => a.authorId === filters.authorId);
    }
    if (filters?.featured !== undefined) {
      list = list.filter((a) => a.isFeatured === filters.featured);
    }
    if (filters?.breaking !== undefined) {
      list = list.filter((a) => a.isBreaking === filters.breaking);
    }
    if (filters?.tag) {
      list = list.filter((a) => a.tags && a.tags.some((t) => t.toLowerCase() === filters.tag?.toLowerCase()));
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          (a.tags && a.tags.some((t) => t.toLowerCase().includes(q))) ||
          a.categoryName.toLowerCase().includes(q)
      );
    }

    // Sort by publish date descending
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const total = list.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public getAllAdminArticles(query?: { search?: string; status?: string; categoryId?: string; authorId?: string }) {
    let list = [...this.state.articles];
    if (query?.status) {
      list = list.filter((a) => a.status === query.status);
    }
    if (query?.categoryId) {
      list = list.filter((a) => a.categoryId === query.categoryId);
    }
    if (query?.authorId) {
      list = list.filter((a) => a.authorId === query.authorId);
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.updatedAt || b.publishedAt).getTime() - new Date(a.updatedAt || a.publishedAt).getTime());
  }

  public getArticleBySlugOrId(slugOrId: string, incrementView = true): Article | undefined {
    const article = this.state.articles.find((a) => a.slug === slugOrId || a.id === slugOrId);
    if (article && incrementView) {
      article.views = (article.views || 0) + 1;
      this.persistState();
    }
    return article;
  }

  public createArticle(articleData: Omit<Article, 'id' | 'views' | 'publishedAt' | 'updatedAt'> & { publishedAt?: string }): Article {
    const category = this.state.categories.find((c) => c.id === articleData.categoryId);
    const author = this.state.authors.find((a) => a.id === articleData.authorId);

    const newArticle: Article = {
      ...articleData,
      id: 'art-' + Date.now(),
      categoryName: category ? category.name : articleData.categoryName || 'জাতীয়',
      categorySlug: category ? category.slug : articleData.categorySlug || 'national',
      authorName: author ? author.name : articleData.authorName || 'সত্যবাণী প্রতিনিধি',
      authorPhoto: author ? author.photo : articleData.authorPhoto,
      views: 1,
      publishedAt: articleData.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.articles.unshift(newArticle);
    this.updateCategoryPostCounts();
    this.addLog('নতুন সংবাদ প্রকাশ', newArticle.authorName, `সংবাদ: "${newArticle.title}" তৈরি করা হয়েছে।`);
    this.persistState();
    return newArticle;
  }

  public updateArticle(id: string, updates: Partial<Article>): Article | null {
    const index = this.state.articles.findIndex((a) => a.id === id);
    if (index === -1) return null;

    if (updates.categoryId && updates.categoryId !== this.state.articles[index].categoryId) {
      const category = this.state.categories.find((c) => c.id === updates.categoryId);
      if (category) {
        updates.categoryName = category.name;
        updates.categorySlug = category.slug;
      }
    }

    if (updates.authorId && updates.authorId !== this.state.articles[index].authorId) {
      const author = this.state.authors.find((a) => a.id === updates.authorId);
      if (author) {
        updates.authorName = author.name;
        updates.authorPhoto = author.photo;
      }
    }

    this.state.articles[index] = {
      ...this.state.articles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.updateCategoryPostCounts();
    this.addLog('সংবাদ সম্পাদনা', 'অ্যাডমিন/সম্পাদক', `সংবাদ ID ${id}: "${this.state.articles[index].title}" আপডেট করা হয়েছে।`);
    this.persistState();
    return this.state.articles[index];
  }

  public deleteArticle(id: string): boolean {
    const index = this.state.articles.findIndex((a) => a.id === id);
    if (index === -1) return false;
    const title = this.state.articles[index].title;
    this.state.articles.splice(index, 1);
    this.updateCategoryPostCounts();
    this.addLog('সংবাদ মুছে ফেলা', 'অ্যাডমিন', `সংবাদ "${title}" মুছে ফেলা হয়েছে।`);
    this.persistState();
    return true;
  }

  public bulkActionArticles(ids: string[], action: 'delete' | 'publish' | 'draft' | 'feature' | 'unfeature' | 'set_category', extraParam?: string) {
    let affected = 0;
    if (action === 'delete') {
      this.state.articles = this.state.articles.filter((a) => !ids.includes(a.id));
      affected = ids.length;
    } else {
      this.state.articles = this.state.articles.map((a) => {
        if (ids.includes(a.id)) {
          affected++;
          if (action === 'publish') return { ...a, status: 'published' as const, updatedAt: new Date().toISOString() };
          if (action === 'draft') return { ...a, status: 'draft' as const, updatedAt: new Date().toISOString() };
          if (action === 'feature') return { ...a, isFeatured: true, updatedAt: new Date().toISOString() };
          if (action === 'unfeature') return { ...a, isFeatured: false, updatedAt: new Date().toISOString() };
          if (action === 'set_category' && extraParam) {
            const cat = this.state.categories.find((c) => c.id === extraParam);
            if (cat) return { ...a, categoryId: cat.id, categoryName: cat.name, categorySlug: cat.slug };
          }
        }
        return a;
      });
    }

    this.updateCategoryPostCounts();
    this.addLog('বাল্ক অ্যাকশন', 'অ্যাডমিন', `${affected}টি সংবাদের ওপর '${action}' প্রক্রিয়া সম্পন্ন হয়েছে।`);
    this.persistState();
    return affected;
  }

  private updateCategoryPostCounts() {
    this.state.categories.forEach((cat) => {
      cat.postCount = this.state.articles.filter((a) => a.categoryId === cat.id && a.status === 'published').length;
    });
  }

  // Categories
  public getCategories() {
    this.updateCategoryPostCounts();
    return [...this.state.categories].sort((a, b) => a.order - b.order);
  }

  public createCategory(data: Omit<Category, 'id' | 'postCount'>): Category {
    const newCat: Category = {
      ...data,
      id: 'cat-' + Date.now(),
      postCount: 0,
    };
    this.state.categories.push(newCat);
    this.addLog('ক্যাটাগরি তৈরি', 'অ্যাডমিন', `নতুন ক্যাটাগরি: "${newCat.name}" যোগ করা হয়েছে।`);
    this.persistState();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.state.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.state.categories[index] = { ...this.state.categories[index], ...updates };
    this.addLog('ক্যাটাগরি সম্পাদনা', 'অ্যাডমিন', `ক্যাটাগরি: "${this.state.categories[index].name}" আপডেট হয়েছে।`);
    this.persistState();
    return this.state.categories[index];
  }

  public deleteCategory(id: string): boolean {
    const index = this.state.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    const name = this.state.categories[index].name;
    this.state.categories.splice(index, 1);
    this.addLog('ক্যাটাগরি মুছে ফেলা', 'অ্যাডমিন', `ক্যাটাগরি "${name}" মুছে ফেলা হয়েছে।`);
    this.persistState();
    return true;
  }

  // Breaking News
  public getBreakingNews(activeOnly = true): BreakingNews[] {
    let list = [...this.state.breakingNews];
    if (activeOnly) {
      list = list.filter((b) => b.isActive);
    }
    return list.sort((a, b) => a.priority - b.priority);
  }

  public createBreakingNews(data: Omit<BreakingNews, 'id' | 'createdAt'>): BreakingNews {
    const newItem: BreakingNews = {
      ...data,
      id: 'brk-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.state.breakingNews.unshift(newItem);
    this.addLog('ব্রেকিং নিউজ যোগ', 'অ্যাডমিন/বার্তা সম্পাদক', `ব্রেকিং নিউজ: "${newItem.title}"`);
    this.persistState();
    return newItem;
  }

  public updateBreakingNews(id: string, updates: Partial<BreakingNews>): BreakingNews | null {
    const index = this.state.breakingNews.findIndex((b) => b.id === id);
    if (index === -1) return null;
    this.state.breakingNews[index] = { ...this.state.breakingNews[index], ...updates };
    this.persistState();
    return this.state.breakingNews[index];
  }

  public deleteBreakingNews(id: string): boolean {
    const index = this.state.breakingNews.findIndex((b) => b.id === id);
    if (index === -1) return false;
    this.state.breakingNews.splice(index, 1);
    this.persistState();
    return true;
  }

  // Ads
  public getAds(activeOnly = false): Advertisement[] {
    if (activeOnly) {
      return this.state.ads.filter((ad) => ad.isActive);
    }
    return this.state.ads;
  }

  public createAd(data: Omit<Advertisement, 'id'>): Advertisement {
    const newAd: Advertisement = {
      ...data,
      id: 'ad-' + Date.now(),
      views: 0,
      clicks: 0,
    };
    this.state.ads.push(newAd);
    this.addLog('বিজ্ঞাপন স্লট তৈরি', 'অ্যাডমিন', `বিজ্ঞাপন: "${newAd.name}" (${newAd.placement})`);
    this.persistState();
    return newAd;
  }

  public updateAd(id: string, updates: Partial<Advertisement>): Advertisement | null {
    const index = this.state.ads.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.state.ads[index] = { ...this.state.ads[index], ...updates };
    this.persistState();
    return this.state.ads[index];
  }

  public deleteAd(id: string): boolean {
    const index = this.state.ads.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.state.ads.splice(index, 1);
    this.persistState();
    return true;
  }

  // Authors
  public getAuthors(): Author[] {
    return this.state.authors.map((auth) => ({
      ...auth,
      articleCount: this.state.articles.filter((a) => a.authorId === auth.id).length,
    }));
  }

  public getAuthorBySlug(slug: string): Author | undefined {
    const auth = this.state.authors.find((a) => a.slug === slug || a.id === slug);
    if (auth) {
      return {
        ...auth,
        articleCount: this.state.articles.filter((a) => a.authorId === auth.id).length,
      };
    }
    return undefined;
  }

  public createAuthor(data: Omit<Author, 'id' | 'articleCount'>): Author {
    const newAuth: Author = {
      ...data,
      id: 'auth-' + Date.now(),
      articleCount: 0,
    };
    this.state.authors.push(newAuth);
    this.addLog('লেখক/প্রতিবেদক তৈরি', 'অ্যাডমিন', `প্রতিবেদক: "${newAuth.name}" (${newAuth.designation})`);
    this.persistState();
    return newAuth;
  }

  public updateAuthor(id: string, updates: Partial<Author>): Author | null {
    const index = this.state.authors.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.state.authors[index] = { ...this.state.authors[index], ...updates };
    this.persistState();
    return this.state.authors[index];
  }

  public deleteAuthor(id: string): boolean {
    const index = this.state.authors.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.state.authors.splice(index, 1);
    this.persistState();
    return true;
  }

  // Users
  public getUsers(): User[] {
    return this.state.users;
  }

  public createUser(data: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...data,
      id: 'usr-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.state.users.push(newUser);
    this.persistState();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.state.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.state.users[index] = { ...this.state.users[index], ...updates };
    this.persistState();
    return this.state.users[index];
  }

  public deleteUser(id: string): boolean {
    const index = this.state.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.state.users.splice(index, 1);
    this.persistState();
    return true;
  }

  // Comments
  public getComments(articleId?: string): Comment[] {
    if (articleId) {
      return this.state.comments.filter((c) => c.articleId === articleId && c.status === 'approved');
    }
    return this.state.comments;
  }

  public createComment(data: Omit<Comment, 'id' | 'likes' | 'createdAt' | 'status'> & { status?: 'approved' | 'pending' }): Comment {
    const article = this.state.articles.find((a) => a.id === data.articleId);
    const newComment: Comment = {
      ...data,
      id: 'com-' + Date.now(),
      articleTitle: article ? article.title : 'সংবাদ',
      status: data.status || 'approved',
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    this.state.comments.unshift(newComment);
    this.persistState();
    return newComment;
  }

  public updateCommentStatus(id: string, status: 'approved' | 'pending' | 'spam'): Comment | null {
    const index = this.state.comments.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.state.comments[index].status = status;
    this.persistState();
    return this.state.comments[index];
  }

  public deleteComment(id: string): boolean {
    const index = this.state.comments.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.state.comments.splice(index, 1);
    this.persistState();
    return true;
  }

  public likeComment(id: string): Comment | null {
    const index = this.state.comments.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.state.comments[index].likes = (this.state.comments[index].likes || 0) + 1;
    this.persistState();
    return this.state.comments[index];
  }

  // Media
  public getMedia(): MediaItem[] {
    return this.state.media;
  }

  public addMedia(item: Omit<MediaItem, 'id' | 'uploadedAt'>): MediaItem {
    const newItem: MediaItem = {
      ...item,
      id: 'med-' + Date.now(),
      uploadedAt: new Date().toISOString(),
    };
    this.state.media.unshift(newItem);
    this.addLog('মিডিয়া ফাইল আপলোড', 'অ্যাডমিন', `ফাইল: "${newItem.name}"`);
    this.persistState();
    return newItem;
  }

  public deleteMedia(id: string): boolean {
    const index = this.state.media.findIndex((m) => m.id === id);
    if (index === -1) return false;
    this.state.media.splice(index, 1);
    this.persistState();
    return true;
  }

  // Homepage Sections Config
  public getHomepageSections(): HomepageSectionConfig[] {
    return [...this.state.homepageSections].sort((a, b) => a.order - b.order);
  }

  public updateHomepageSections(sections: HomepageSectionConfig[]): HomepageSectionConfig[] {
    this.state.homepageSections = sections;
    this.addLog('হোমপেজ লেআউট পরিবর্তন', 'অ্যাডমিন', 'হোমপেজের সেকশন অর্ডার ও ভিউ কনফিগারেশন আপডেট করা হয়েছে।');
    this.persistState();
    return this.state.homepageSections;
  }

  // Site Settings
  public getSiteSettings(): SiteSettings {
    return this.state.siteSettings;
  }

  public updateSiteSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.state.siteSettings = {
      ...this.state.siteSettings,
      ...updates,
      socialLinks: { ...this.state.siteSettings.socialLinks, ...(updates.socialLinks || {}) },
      seoDefaults: { ...this.state.siteSettings.seoDefaults, ...(updates.seoDefaults || {}) },
      adsConfig: { ...this.state.siteSettings.adsConfig, ...(updates.adsConfig || {}) },
      themeSettings: { ...this.state.siteSettings.themeSettings, ...(updates.themeSettings || {}) },
    };
    this.addLog('সাইট সেটিংস পরিবর্তন', 'অ্যাডমিন', 'ওয়েবসাইট সেটিংস ও কনফিগারেশন আপডেট করা হয়েছে।');
    this.persistState();
    return this.state.siteSettings;
  }

  // Analytics & Summary
  public getAnalyticsSummary(): AnalyticsSummary {
    const totalArticles = this.state.articles.length;
    const publishedArticles = this.state.articles.filter((a) => a.status === 'published').length;
    const draftArticles = this.state.articles.filter((a) => a.status === 'draft').length;
    const scheduledArticles = this.state.articles.filter((a) => a.status === 'scheduled').length;
    const breakingNewsCount = this.state.breakingNews.filter((b) => b.isActive).length;

    const totalViews = this.state.articles.reduce((acc, a) => acc + (a.views || 0), 0);
    const todayViews = Math.round(totalViews * 0.18);

    // Mock 7-day views trend
    const viewsTrend = [
      { date: '২৬ আগস্ট', views: Math.round(totalViews * 0.12), visitors: Math.round(totalViews * 0.08) },
      { date: '২৭ আগস্ট', views: Math.round(totalViews * 0.14), visitors: Math.round(totalViews * 0.09) },
      { date: '২৮ আগস্ট', views: Math.round(totalViews * 0.11), visitors: Math.round(totalViews * 0.07) },
      { date: '২৯ আগস্ট', views: Math.round(totalViews * 0.15), visitors: Math.round(totalViews * 0.10) },
      { date: '৩০ আগস্ট', views: Math.round(totalViews * 0.18), visitors: Math.round(totalViews * 0.12) },
      { date: '৩১ আগস্ট', views: Math.round(totalViews * 0.16), visitors: Math.round(totalViews * 0.11) },
      { date: '০১ সেপ্টেম্বর', views: todayViews, visitors: Math.round(todayViews * 0.7) },
    ];

    // Category distribution
    const categoryViews = this.state.categories.map((cat) => {
      const arts = this.state.articles.filter((a) => a.categoryId === cat.id);
      const views = arts.reduce((sum, a) => sum + (a.views || 0), 0);
      return {
        category: cat.name,
        count: arts.length,
        views,
      };
    });

    const topArticles = [...this.state.articles]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 7)
      .map((a) => ({
        id: a.id,
        title: a.title,
        views: a.views || 0,
        category: a.categoryName,
      }));

    const deviceBreakdown = [
      { name: 'মোবাইল (Android / iOS)', value: 68 },
      { name: 'ডেস্কটপ / ল্যাপটপ', value: 26 },
      { name: 'ট্যাবলেট', value: 6 },
    ];

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      scheduledArticles,
      breakingNewsCount,
      totalViews,
      todayViews,
      viewsTrend,
      categoryViews,
      topArticles,
      deviceBreakdown,
    };
  }

  public getSystemLogs(): SystemLog[] {
    return this.state.logs;
  }

  public getFullExport(): DatabaseState {
    return this.state;
  }

  public importData(newState: Partial<DatabaseState>): boolean {
    if (newState.articles && Array.isArray(newState.articles)) {
      this.state.articles = newState.articles;
    }
    if (newState.categories && Array.isArray(newState.categories)) {
      this.state.categories = newState.categories;
    }
    if (newState.breakingNews && Array.isArray(newState.breakingNews)) {
      this.state.breakingNews = newState.breakingNews;
    }
    if (newState.ads && Array.isArray(newState.ads)) {
      this.state.ads = newState.ads;
    }
    if (newState.authors && Array.isArray(newState.authors)) {
      this.state.authors = newState.authors;
    }
    if (newState.siteSettings) {
      this.state.siteSettings = newState.siteSettings;
    }
    this.addLog('সম্পূর্ণ ডেটাবেস ইম্পোর্ট', 'অ্যাডমিন', 'ব্যাকআপ থেকে সফলভাবে ডেটা রিস্টোর করা হয়েছে।');
    this.persistState();
    return true;
  }

  public resetToDefaults() {
    this.state = {
      categories: [...INITIAL_CATEGORIES],
      authors: [...INITIAL_AUTHORS],
      users: [...INITIAL_USERS],
      breakingNews: [...INITIAL_BREAKING_NEWS],
      articles: [...INITIAL_ARTICLES],
      ads: [...INITIAL_ADS],
      comments: [...INITIAL_COMMENTS],
      homepageSections: [...INITIAL_HOMEPAGE_CONFIG],
      siteSettings: { ...INITIAL_SITE_SETTINGS },
      media: [...INITIAL_MEDIA],
      logs: [
        {
          id: 'log-reset-' + Date.now(),
          action: 'ফ্যাক্টরি রিসেট',
          user: 'সিস্টেম অ্যাডমিন',
          details: 'ডেটাবেস মূল ডিফল্ট অবস্থায় ফিরিয়ে নেওয়া হয়েছে।',
          ip: '127.0.0.1',
          timestamp: new Date().toISOString(),
        },
      ],
    };
    this.persistState();
  }
}

export const db = new DatabaseManager();
