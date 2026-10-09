import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  ARTICLES_DATA,
  TRACKED_COMPANIES_DATA,
  WATCHLISTS_DATA,
  DEFAULT_COLLECTIONS,
  DEFAULT_SAVED_SEARCHES,
  DEFAULT_SEARCH_HISTORY,
  DEFAULT_RESEARCH_NOTES,
  BRIEFINGS_DATA,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_USER_PROFILE,
  DEFAULT_USER_PREFERENCES,
  type Article,
  type TrackedCompany,
  type Watchlist,
  type Collection,
  type SavedSearch,
  type SearchHistoryItem,
  type ResearchNote,
  type BriefingItem,
  type NotificationItem,
  type UserProfile,
  type UserPreferences
} from '../data/mockData';
import {
  api,
  type AIResearchResult,
  type ArticleAnalysisResult,
  type BackendHealthResult
} from '../services/api';

export type ActiveTab =
  | 'discover'
  | 'explore'
  | 'ai-research'
  | 'monitor'
  | 'library'
  | 'briefings'
  | 'settings'
  | 'article-detail'
  | 'saved-searches'
  | 'watchlist'
  | 'collections';

export type LibrarySubTab = 'saved' | 'collections' | 'searches' | 'history' | 'notes';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  librarySubTab: LibrarySubTab;
  setLibrarySubTab: (subTab: LibrarySubTab) => void;
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilterChip: string;
  setActiveFilterChip: (chip: string) => void;
  selectedTopicId: string | null;
  setSelectedTopicId: (topicId: string | null) => void;
  
  // Articles & Bookmarks
  articles: Article[];
  bookmarkedIds: Set<string>;
  toggleBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
  openArticleDetail: (article: Article) => void;
  
  // Backend & Live Feed Status
  isSyncingFeeds: boolean;
  lastFeedSyncTime: string | null;
  refreshLiveFeeds: (force?: boolean) => Promise<void>;
  isBackendOnline: boolean;
  backendHealth: BackendHealthResult | null;
  
  // AI Research & Synthesis
  activeResearchResult: AIResearchResult | null;
  isResearching: boolean;
  runDeepAIResearch: (query: string, options?: { topicId?: string; depth?: 'standard' | 'deep' | 'comprehensive'; focusAreas?: string[] }) => Promise<AIResearchResult>;
  generateCustomBriefing: (topic: string, type?: 'daily' | 'weekly' | 'topic', focusSectors?: string[]) => Promise<BriefingItem>;
  analyzeArticleWithClaude: (article: Article) => Promise<ArticleAnalysisResult>;

  // Followed Topics
  followedTopicIds: string[];
  toggleFollowTopic: (topicId: string) => void;
  isTopicFollowed: (topicId: string) => boolean;
  
  // Tracked Companies & Watchlists
  trackedCompanies: TrackedCompany[];
  addTrackedCompany: (company: Omit<TrackedCompany, 'id'>) => void;
  removeTrackedCompany: (id: string) => void;
  toggleCompanyAlert: (id: string) => void;
  watchlists: Watchlist[];
  addWatchlist: (watchlist: Omit<Watchlist, 'id' | 'updatedAt' | 'itemCount'>) => void;
  removeWatchlist: (id: string) => void;
  
  // Collections
  collections: Collection[];
  addCollection: (col: { name: string; description: string; color: string }) => void;
  removeCollection: (id: string) => void;
  addArticleToCollection: (collectionId: string, articleId: string) => void;
  removeArticleFromCollection: (collectionId: string, articleId: string) => void;
  
  // Saved Searches & History
  savedSearches: SavedSearch[];
  saveSearch: (query: string, filter?: string) => void;
  removeSavedSearch: (id: string) => void;
  searchHistory: SearchHistoryItem[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  
  // Notes
  researchNotes: ResearchNote[];
  addResearchNote: (note: Omit<ResearchNote, 'id' | 'updatedAt'>) => void;
  updateResearchNote: (id: string, content: string, title?: string) => void;
  removeResearchNote: (id: string) => void;
  
  // Briefings
  briefings: BriefingItem[];
  addBriefing: (briefing: BriefingItem) => void;
  
  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // User Profile & Settings
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  userPreferences: UserPreferences;
  updateUserPreferences: (prefs: Partial<UserPreferences>) => void;
  
  // Recently Viewed
  recentlyViewedIds: string[];
  recordArticleView: (articleId: string) => void;
  
  // Modals & Drawers
  activeArticleForModal: Article | null;
  openArticleModal: (article: Article) => void;
  closeArticleModal: () => void;
  isBriefingModalOpen: boolean;
  setIsBriefingModalOpen: (open: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  
  // Toast
  toastMessage: string | null;
  showToast: (message: string) => void;
  clearToast: () => void;
  
  // Navigation Shortcuts
  navigateToTopicResearch: (topicId: string, topicLabel?: string) => void;
  navigateToQuestionSearch: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`contenthu_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`contenthu_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTabState] = useState<ActiveTab>(() => 
    loadFromStorage('activeTab', 'discover')
  );
  const [librarySubTab, setLibrarySubTab] = useState<LibrarySubTab>('saved');

  // Search & Filters
  const [searchQuery, setSearchQueryState] = useState<string>('AI agents in Indian startups');
  const [activeFilterChip, setActiveFilterChip] = useState<string>('All Sources');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Articles & Live Feed Ingestion State
  const [articles, setArticles] = useState<Article[]>(() => {
    const cachedLive = loadFromStorage<Article[]>('cached_articles', []);
    return cachedLive.length > 0 ? cachedLive : ARTICLES_DATA;
  });
  const [isSyncingFeeds, setIsSyncingFeeds] = useState<boolean>(false);
  const [lastFeedSyncTime, setLastFeedSyncTime] = useState<string | null>(() =>
    loadFromStorage('last_feed_sync', null)
  );
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [backendHealth, setBackendHealth] = useState<BackendHealthResult | null>(null);

  // AI Research State
  const [activeResearchResult, setActiveResearchResult] = useState<AIResearchResult | null>(null);
  const [isResearching, setIsResearching] = useState<boolean>(false);

  // Bookmarked Articles
  const [bookmarkedIdsList, setBookmarkedIdsList] = useState<string[]>(() =>
    loadFromStorage('bookmarkedIds', ['art-1', 'art-3', 'art-5'])
  );
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(() => ARTICLES_DATA[0]);

  // Followed Topics
  const [followedTopicIds, setFollowedTopicIds] = useState<string[]>(() =>
    loadFromStorage('followedTopicIds', ['startups', 'funding', 'use-cases', 'tools-platforms'])
  );

  // Tracked Companies & Watchlists
  const [trackedCompanies, setTrackedCompanies] = useState<TrackedCompany[]>(() =>
    loadFromStorage('trackedCompanies', TRACKED_COMPANIES_DATA)
  );
  const [watchlists, setWatchlists] = useState<Watchlist[]>(() =>
    loadFromStorage('watchlists', WATCHLISTS_DATA)
  );

  // Collections
  const [collections, setCollections] = useState<Collection[]>(() =>
    loadFromStorage('collections', DEFAULT_COLLECTIONS)
  );

  // Saved Searches & History
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() =>
    loadFromStorage('savedSearches', DEFAULT_SAVED_SEARCHES)
  );
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() =>
    loadFromStorage('searchHistory', DEFAULT_SEARCH_HISTORY)
  );

  // Research Notes
  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>(() =>
    loadFromStorage('researchNotes', DEFAULT_RESEARCH_NOTES)
  );

  // Briefings
  const [briefings, setBriefings] = useState<BriefingItem[]>(() =>
    loadFromStorage('briefings', BRIEFINGS_DATA)
  );

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage('notifications', DEFAULT_NOTIFICATIONS)
  );

  // Profile & Preferences
  const [userProfile, setUserProfileState] = useState<UserProfile>(() =>
    loadFromStorage('userProfile', DEFAULT_USER_PROFILE)
  );
  const [userPreferences, setUserPreferencesState] = useState<UserPreferences>(() =>
    loadFromStorage('userPreferences', DEFAULT_USER_PREFERENCES)
  );

  // Recently Viewed Articles
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() =>
    loadFromStorage('recentlyViewedIds', ['art-1', 'art-2'])
  );

  // Modal States
  const [activeArticleForModal, setActiveArticleForModal] = useState<Article | null>(null);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence Effects
  useEffect(() => saveToStorage('activeTab', activeTab), [activeTab]);
  useEffect(() => saveToStorage('bookmarkedIds', bookmarkedIdsList), [bookmarkedIdsList]);
  useEffect(() => saveToStorage('followedTopicIds', followedTopicIds), [followedTopicIds]);
  useEffect(() => saveToStorage('trackedCompanies', trackedCompanies), [trackedCompanies]);
  useEffect(() => saveToStorage('watchlists', watchlists), [watchlists]);
  useEffect(() => saveToStorage('collections', collections), [collections]);
  useEffect(() => saveToStorage('savedSearches', savedSearches), [savedSearches]);
  useEffect(() => saveToStorage('searchHistory', searchHistory), [searchHistory]);
  useEffect(() => saveToStorage('researchNotes', researchNotes), [researchNotes]);
  useEffect(() => saveToStorage('briefings', briefings), [briefings]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('userProfile', userProfile), [userProfile]);
  useEffect(() => saveToStorage('userPreferences', userPreferences), [userPreferences]);
  useEffect(() => saveToStorage('recentlyViewedIds', recentlyViewedIds), [recentlyViewedIds]);
  useEffect(() => saveToStorage('cached_articles', articles), [articles]);
  useEffect(() => saveToStorage('last_feed_sync', lastFeedSyncTime), [lastFeedSyncTime]);

  const bookmarkedIds = useMemo(() => new Set(bookmarkedIdsList), [bookmarkedIdsList]);

  // Toast helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Fetch Live RSS Feeds from Backend
  const refreshLiveFeeds = useCallback(async (force = false) => {
    setIsSyncingFeeds(true);
    try {
      const feedRes = await api.fetchLiveFeeds(force);
      if (feedRes.success && feedRes.articles.length > 0) {
        // Merge with curated articles
        const combined = [...feedRes.articles, ...ARTICLES_DATA];
        const seen = new Set<string>();
        const unique = combined.filter((art) => {
          const normTitle = art.title.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (seen.has(normTitle)) return false;
          seen.add(normTitle);
          return true;
        });

        setArticles(unique);
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastFeedSyncTime(timeStr);
        setIsBackendOnline(true);
        if (force) {
          showToast(`Synced ${feedRes.articles.length} live articles from TechCrunch, Verge, Hacker News & Ars Technica`);
        }
      }
    } catch (err) {
      console.warn('[AppContext] RSS sync error:', err);
    } finally {
      setIsSyncingFeeds(false);
    }
  }, [showToast]);

  // Check Backend Health & Fetch initial Feeds on Mount
  useEffect(() => {
    let isMounted = true;
    
    async function initBackend() {
      try {
        const health = await api.checkHealth();
        if (isMounted && health) {
          setIsBackendOnline(true);
          setBackendHealth(health);
        }
        await refreshLiveFeeds(false);
      } catch {
        // Offline mode works with mock data
      }
    }

    initBackend();

    // Check health & poll live feeds every 5 minutes
    const interval = setInterval(() => {
      refreshLiveFeeds(false);
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [refreshLiveFeeds]);

  // Deep AI Research Runner using Claude API
  const runDeepAIResearch = useCallback(async (query: string, options?: { topicId?: string; depth?: 'standard' | 'deep' | 'comprehensive'; focusAreas?: string[] }): Promise<AIResearchResult> => {
    setIsResearching(true);
    try {
      const report = await api.runAIResearch(query, options);
      setActiveResearchResult(report);
      showToast(`AI Research report generated via ${report.model}`);
      return report;
    } finally {
      setIsResearching(false);
    }
  }, [showToast]);

  // AI Briefing Generator using Claude
  const generateCustomBriefing = useCallback(async (topic: string, type: 'daily' | 'weekly' | 'topic' = 'daily', focusSectors: string[] = []): Promise<BriefingItem> => {
    try {
      const generated = await api.generateBriefing(topic, type, focusSectors);
      const newBriefing: BriefingItem = {
        id: generated.id,
        title: generated.title,
        subtitle: generated.subtitle,
        date: generated.date,
        type: generated.type,
        readTime: generated.readTime,
        sourcesCount: generated.sourcesCount,
        summary: generated.summary,
        audioDuration: generated.audioDuration,
        status: 'Ready',
        chapters: generated.chapters
      };

      setBriefings(prev => [newBriefing, ...prev]);
      showToast(`Generated executive briefing for "${topic}"`);
      return newBriefing;
    } catch (err: any) {
      showToast(`Generated local intelligence briefing for "${topic}"`);
      const fallbackBriefing: BriefingItem = {
        id: `briefing-${Date.now()}`,
        title: `${topic}: Market Intelligence Digest`,
        subtitle: `Strategic synthesis of critical venture flows and technical breakthroughs`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type,
        readTime: '4 min read',
        sourcesCount: 14,
        summary: `Executive intelligence briefing synthesizing live developments in ${topic}.`,
        audioDuration: '3:30',
        status: 'Ready',
        chapters: [
          {
            title: '1. Autonomous Agent Architectures & Breakthroughs',
            content: 'Production adoption is accelerating across enterprise workflows.',
            keyPoints: ['Tool-use standardization', 'Speculative inference cost reductions'],
            citations: [{ title: 'Autonomous Systems Q1 Index', publisher: 'ContentHu Research' }]
          }
        ]
      };
      setBriefings(prev => [fallbackBriefing, ...prev]);
      return fallbackBriefing;
    }
  }, [showToast]);

  // AI Article Deep Analyzer
  const analyzeArticleWithClaude = useCallback(async (article: Article): Promise<ArticleAnalysisResult> => {
    const rawContent = article.contentSections?.map(s => `${s.title}:\n${s.body}`).join('\n\n') || article.description;
    return await api.analyzeArticle(article.title, rawContent, article.publisher.name, article.topicId);
  }, []);

  // Navigation Setters
  const setActiveTab = useCallback((tab: ActiveTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  // Bookmarks
  const toggleBookmark = useCallback((articleId: string) => {
    setBookmarkedIdsList((prev) => {
      const isAlreadyBookmarked = prev.includes(articleId);
      const next = isAlreadyBookmarked
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId];
      
      const art = articles.find(a => a.id === articleId);
      const titleSnippet = art ? `"${art.title.slice(0, 30)}..."` : 'Article';
      showToast(isAlreadyBookmarked ? `Removed ${titleSnippet} from Saved Library` : `Saved ${titleSnippet} to Library`);
      
      return next;
    });
  }, [articles, showToast]);

  const isBookmarked = useCallback((articleId: string) => {
    return bookmarkedIds.has(articleId);
  }, [bookmarkedIds]);

  // Followed Topics
  const toggleFollowTopic = useCallback((topicId: string) => {
    setFollowedTopicIds((prev) => {
      const isFollowed = prev.includes(topicId);
      const next = isFollowed ? prev.filter((id) => id !== topicId) : [...prev, topicId];
      showToast(isFollowed ? `Unfollowed topic` : `Following topic updates`);
      return next;
    });
  }, [showToast]);

  const isTopicFollowed = useCallback((topicId: string) => {
    return followedTopicIds.includes(topicId);
  }, [followedTopicIds]);

  // Tracked Companies
  const addTrackedCompany = useCallback((company: Omit<TrackedCompany, 'id'>) => {
    const newCompany: TrackedCompany = {
      ...company,
      id: `co-${Date.now()}`
    };
    setTrackedCompanies(prev => [newCompany, ...prev]);
    showToast(`Added ${company.name} to Tracked Companies`);
  }, [showToast]);

  const removeTrackedCompany = useCallback((id: string) => {
    setTrackedCompanies(prev => {
      const co = prev.find(c => c.id === id);
      const next = prev.filter(c => c.id !== id);
      showToast(`Removed ${co?.name || 'Company'} from monitoring`);
      return next;
    });
  }, [showToast]);

  const toggleCompanyAlert = useCallback((id: string) => {
    setTrackedCompanies(prev => prev.map(c => {
      if (c.id === id) {
        const nextAlert = !c.alertsActive;
        showToast(`${nextAlert ? 'Enabled' : 'Paused'} real-time alerts for ${c.name}`);
        return { ...c, alertsActive: nextAlert };
      }
      return c;
    }));
  }, [showToast]);

  // Watchlists
  const addWatchlist = useCallback((watchlist: Omit<Watchlist, 'id' | 'updatedAt' | 'itemCount'>) => {
    const newWatchlist: Watchlist = {
      ...watchlist,
      id: `wl-${Date.now()}`,
      updatedAt: 'Just now',
      itemCount: watchlist.companyIds.length + watchlist.topicIds.length
    };
    setWatchlists(prev => [newWatchlist, ...prev]);
    showToast(`Created watchlist "${watchlist.name}"`);
  }, [showToast]);

  const removeWatchlist = useCallback((id: string) => {
    setWatchlists(prev => prev.filter(w => w.id !== id));
    showToast('Watchlist deleted');
  }, [showToast]);

  // Collections
  const addCollection = useCallback((col: { name: string; description: string; color: string }) => {
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name: col.name,
      description: col.description,
      color: col.color,
      articleIds: [],
      createdAt: 'Just now',
      updatedAt: 'Just now'
    };
    setCollections(prev => [newCol, ...prev]);
    showToast(`Created collection "${col.name}"`);
  }, [showToast]);

  const removeCollection = useCallback((id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    showToast('Collection removed');
  }, [showToast]);

  const addArticleToCollection = useCallback((collectionId: string, articleId: string) => {
    setCollections(prev => prev.map(col => {
      if (col.id === collectionId) {
        if (col.articleIds.includes(articleId)) {
          showToast(`Article is already in "${col.name}"`);
          return col;
        }
        showToast(`Saved to "${col.name}"`);
        return {
          ...col,
          articleIds: [...col.articleIds, articleId],
          updatedAt: 'Just now'
        };
      }
      return col;
    }));
  }, [showToast]);

  const removeArticleFromCollection = useCallback((collectionId: string, articleId: string) => {
    setCollections(prev => prev.map(col => {
      if (col.id === collectionId) {
        showToast(`Removed article from "${col.name}"`);
        return {
          ...col,
          articleIds: col.articleIds.filter(id => id !== articleId),
          updatedAt: 'Just now'
        };
      }
      return col;
    }));
  }, [showToast]);

  // Saved Searches
  const saveSearch = useCallback((query: string, filter = 'All Sources') => {
    if (!query.trim()) return;
    setSavedSearches(prev => {
      const exists = prev.some(s => s.query.toLowerCase() === query.toLowerCase());
      if (exists) {
        showToast(`Search "${query}" is already saved`);
        return prev;
      }
      const newSearch: SavedSearch = {
        id: `ss-${Date.now()}`,
        query: query.trim(),
        filter,
        resultCount: Math.floor(Math.random() * 20) + 5,
        savedAt: 'Just now'
      };
      showToast(`Saved search: "${query}"`);
      return [newSearch, ...prev];
    });
  }, [showToast]);

  const removeSavedSearch = useCallback((id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
    showToast('Saved search deleted');
  }, [showToast]);

  // Search History
  const addSearchHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      const newItem: SearchHistoryItem = {
        id: `sh-${Date.now()}`,
        query: query.trim(),
        timestamp: 'Just now',
        resultCount: Math.floor(Math.random() * 15) + 4
      };
      return [newItem, ...filtered].slice(0, 20);
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    showToast('Search history cleared');
  }, [showToast]);

  // Research Notes
  const addResearchNote = useCallback((note: Omit<ResearchNote, 'id' | 'updatedAt'>) => {
    const newNote: ResearchNote = {
      ...note,
      id: `note-${Date.now()}`,
      updatedAt: 'Just now'
    };
    setResearchNotes(prev => [newNote, ...prev]);
    showToast('Research note created');
  }, [showToast]);

  const updateResearchNote = useCallback((id: string, content: string, title?: string) => {
    setResearchNotes(prev => prev.map(note => {
      if (note.id === id) {
        return {
          ...note,
          content,
          title: title !== undefined ? title : note.title,
          updatedAt: 'Just now'
        };
      }
      return note;
    }));
    showToast('Note saved');
  }, [showToast]);

  const removeResearchNote = useCallback((id: string) => {
    setResearchNotes(prev => prev.filter(n => n.id !== id));
    showToast('Research note deleted');
  }, [showToast]);

  // Briefings
  const addBriefing = useCallback((briefing: BriefingItem) => {
    setBriefings(prev => [briefing, ...prev]);
    showToast(`Added briefing "${briefing.title}"`);
  }, [showToast]);

  // Notifications
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read');
  }, [showToast]);

  // User Profile & Preferences
  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfileState(prev => ({ ...prev, ...profile }));
    showToast('Profile updated');
  }, [showToast]);

  const updateUserPreferences = useCallback((prefs: Partial<UserPreferences>) => {
    setUserPreferencesState(prev => ({ ...prev, ...prefs }));
    showToast('Preferences updated');
  }, [showToast]);

  // Recently Viewed
  const recordArticleView = useCallback((articleId: string) => {
    setRecentlyViewedIds(prev => [
      articleId,
      ...prev.filter(id => id !== articleId).slice(0, 9)
    ]);
  }, []);

  const openArticleModal = useCallback((article: Article) => {
    setActiveArticleForModal(article);
    recordArticleView(article.id);
  }, [recordArticleView]);

  const closeArticleModal = useCallback(() => {
    setActiveArticleForModal(null);
  }, []);

  const openArticleDetail = useCallback((article: Article) => {
    setSelectedArticle(article);
    setActiveArticleForModal(null);
    recordArticleView(article.id);
    setActiveTabState('article-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [recordArticleView]);

  const navigateToTopicResearch = useCallback((topicId: string, topicLabel?: string) => {
    setSelectedTopicId(topicId);
    setActiveTabState('ai-research');
    if (topicLabel) {
      showToast(`Filtered research landscape by "${topicLabel}"`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showToast]);

  const navigateToQuestionSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setSelectedTopicId(null);
    setActiveTabState('ai-research');
    showToast(`Investigating query: "${query}"`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setSearchQuery, showToast]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        librarySubTab,
        setLibrarySubTab,
        searchQuery,
        setSearchQuery,
        activeFilterChip,
        setActiveFilterChip,
        selectedTopicId,
        setSelectedTopicId,
        articles,
        bookmarkedIds,
        toggleBookmark,
        isBookmarked,
        selectedArticle,
        setSelectedArticle,
        openArticleDetail,
        isSyncingFeeds,
        lastFeedSyncTime,
        refreshLiveFeeds,
        isBackendOnline,
        backendHealth,
        activeResearchResult,
        isResearching,
        runDeepAIResearch,
        generateCustomBriefing,
        analyzeArticleWithClaude,
        followedTopicIds,
        toggleFollowTopic,
        isTopicFollowed,
        trackedCompanies,
        addTrackedCompany,
        removeTrackedCompany,
        toggleCompanyAlert,
        watchlists,
        addWatchlist,
        removeWatchlist,
        collections,
        addCollection,
        removeCollection,
        addArticleToCollection,
        removeArticleFromCollection,
        savedSearches,
        saveSearch,
        removeSavedSearch,
        searchHistory,
        addSearchHistory,
        clearSearchHistory,
        researchNotes,
        addResearchNote,
        updateResearchNote,
        removeResearchNote,
        briefings,
        addBriefing,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        userProfile,
        updateUserProfile,
        userPreferences,
        updateUserPreferences,
        recentlyViewedIds,
        recordArticleView,
        activeArticleForModal,
        openArticleModal,
        closeArticleModal,
        isBriefingModalOpen,
        setIsBriefingModalOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toastMessage,
        showToast,
        clearToast,
        navigateToTopicResearch,
        navigateToQuestionSearch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
