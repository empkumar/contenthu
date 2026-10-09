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

  // Articles & Bookmarks
  const [articles] = useState<Article[]>(ARTICLES_DATA);
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

  // Recently Viewed
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() =>
    loadFromStorage('recentlyViewedIds', ['art-1', 'art-2', 'art-4'])
  );

  // Modals
  const [activeArticleForModal, setActiveArticleForModal] = useState<Article | null>(null);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Set bookmarkedIds as a Set for fast lookup
  const bookmarkedIds = useMemo(() => new Set(bookmarkedIdsList), [bookmarkedIdsList]);

  // Sync to localStorage
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

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const setActiveTab = useCallback((tab: ActiveTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
    if (query.trim()) {
      setSearchHistory(prev => {
        const filtered = prev.filter(h => h.query.toLowerCase() !== query.toLowerCase());
        return [
          { id: `sh-${Date.now()}`, query: query.trim(), timestamp: 'Just now', resultCount: Math.floor(Math.random() * 80) + 20 },
          ...filtered.slice(0, 19)
        ];
      });
    }
  }, []);

  const toggleBookmark = useCallback((articleId: string) => {
    setBookmarkedIdsList(prev => {
      const exists = prev.includes(articleId);
      if (exists) {
        showToast('Removed article from Research Library');
        return prev.filter(id => id !== articleId);
      } else {
        showToast('Saved article to Research Library');
        return [...prev, articleId];
      }
    });
  }, [showToast]);

  const isBookmarked = useCallback((articleId: string) => {
    return bookmarkedIds.has(articleId);
  }, [bookmarkedIds]);

  const toggleFollowTopic = useCallback((topicId: string) => {
    setFollowedTopicIds(prev => {
      const exists = prev.includes(topicId);
      if (exists) {
        showToast(`Unfollowed topic cluster`);
        return prev.filter(id => id !== topicId);
      } else {
        showToast(`Followed topic cluster to intelligence radar`);
        return [...prev, topicId];
      }
    });
  }, [showToast]);

  const isTopicFollowed = useCallback((topicId: string) => {
    return followedTopicIds.includes(topicId);
  }, [followedTopicIds]);

  const addTrackedCompany = useCallback((company: Omit<TrackedCompany, 'id'>) => {
    const newCompany: TrackedCompany = {
      ...company,
      id: `comp-${Date.now()}`
    };
    setTrackedCompanies(prev => [newCompany, ...prev]);
    showToast(`Added ${company.name} to Intelligence Monitor`);
  }, [showToast]);

  const removeTrackedCompany = useCallback((id: string) => {
    setTrackedCompanies(prev => prev.filter(c => c.id !== id));
    showToast('Company removed from active monitoring');
  }, [showToast]);

  const toggleCompanyAlert = useCallback((id: string) => {
    setTrackedCompanies(prev => prev.map(c => {
      if (c.id === id) {
        const nextState = !c.alertsActive;
        showToast(nextState ? `Alerts enabled for ${c.name}` : `Alerts muted for ${c.name}`);
        return { ...c, alertsActive: nextState };
      }
      return c;
    }));
  }, [showToast]);

  const addWatchlist = useCallback((watchlist: Omit<Watchlist, 'id' | 'updatedAt' | 'itemCount'>) => {
    const newWl: Watchlist = {
      ...watchlist,
      id: `wl-${Date.now()}`,
      updatedAt: 'Just now',
      itemCount: watchlist.companyIds.length + watchlist.topicIds.length
    };
    setWatchlists(prev => [newWl, ...prev]);
    showToast(`Created watchlist "${watchlist.name}"`);
  }, [showToast]);

  const removeWatchlist = useCallback((id: string) => {
    setWatchlists(prev => prev.filter(w => w.id !== id));
    showToast('Watchlist deleted');
  }, [showToast]);

  const addCollection = useCallback((col: { name: string; description: string; color: string }) => {
    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name: col.name,
      description: col.description,
      color: col.color || 'from-indigo-500 to-violet-600',
      articleIds: [],
      createdAt: 'Just now',
      updatedAt: 'Just now'
    };
    setCollections(prev => [newCol, ...prev]);
    showToast(`Created collection "${col.name}"`);
  }, [showToast]);

  const removeCollection = useCallback((id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    showToast('Collection deleted');
  }, [showToast]);

  const addArticleToCollection = useCallback((collectionId: string, articleId: string) => {
    setCollections(prev => prev.map(col => {
      if (col.id === collectionId) {
        if (!col.articleIds.includes(articleId)) {
          showToast(`Added article to "${col.name}"`);
          return { ...col, articleIds: [...col.articleIds, articleId], updatedAt: 'Just now' };
        } else {
          showToast(`Article already in "${col.name}"`);
        }
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

  const saveSearch = useCallback((query: string, filter: string = 'All Sources') => {
    if (!query.trim()) return;
    setSavedSearches(prev => {
      const exists = prev.some(s => s.query.toLowerCase() === query.toLowerCase());
      if (exists) {
        showToast(`Search "${query}" is already saved in your Library`);
        return prev;
      }
      const newSearch: SavedSearch = {
        id: `ss-${Date.now()}`,
        query: query.trim(),
        filter,
        resultCount: 248,
        savedAt: 'Just now'
      };
      showToast(`Saved search "${query}" to Library`);
      return [newSearch, ...prev];
    });
  }, [showToast]);

  const removeSavedSearch = useCallback((id: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
    showToast('Removed saved search');
  }, [showToast]);

  const addSearchHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    setSearchHistory(prev => [
      { id: `sh-${Date.now()}`, query: query.trim(), timestamp: 'Just now', resultCount: Math.floor(Math.random() * 80) + 20 },
      ...prev.filter(h => h.query.toLowerCase() !== query.toLowerCase()).slice(0, 19)
    ]);
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    showToast('Cleared research search history');
  }, [showToast]);

  const addResearchNote = useCallback((note: Omit<ResearchNote, 'id' | 'updatedAt'>) => {
    const newNote: ResearchNote = {
      ...note,
      id: `note-${Date.now()}`,
      updatedAt: 'Just now'
    };
    setResearchNotes(prev => [newNote, ...prev]);
    showToast(`Saved note: "${note.title}"`);
  }, [showToast]);

  const updateResearchNote = useCallback((id: string, content: string, title?: string) => {
    setResearchNotes(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          content,
          title: title || n.title,
          updatedAt: 'Just now'
        };
      }
      return n;
    }));
    showToast('Updated research note');
  }, [showToast]);

  const removeResearchNote = useCallback((id: string) => {
    setResearchNotes(prev => prev.filter(n => n.id !== id));
    showToast('Deleted research note');
  }, [showToast]);

  const addBriefing = useCallback((briefing: BriefingItem) => {
    setBriefings(prev => [briefing, ...prev]);
    showToast(`Generated new executive briefing: "${briefing.title}"`);
  }, [showToast]);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Marked all notifications as read');
  }, [showToast]);

  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfileState(prev => ({ ...prev, ...profile }));
    showToast('Updated profile settings');
  }, [showToast]);

  const updateUserPreferences = useCallback((prefs: Partial<UserPreferences>) => {
    setUserPreferencesState(prev => ({ ...prev, ...prefs }));
    showToast('Updated workspace preferences');
  }, [showToast]);

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
