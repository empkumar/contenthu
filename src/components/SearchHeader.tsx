import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  BookmarkPlus, 
  Bell, 
  SlidersHorizontal, 
  ArrowRight, 
  ChevronDown, 
  Menu
} from 'lucide-react';
import { FILTER_CHIPS, SUGGESTED_QUERIES } from '../data/mockData';
import { useApp } from '../context/AppContext';

export const SearchHeader: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeFilterChip,
    setActiveFilterChip,
    saveSearch,
    setIsBriefingModalOpen,
    setIsMobileSidebarOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateToQuestionSearch,
    showToast
  } = useApp();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchQuery(localQuery.trim());
      setIsSearchFocused(false);
      showToast(`Filtering intelligence for: "${localQuery.trim()}"`);
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  const handleSaveSearchClick = () => {
    saveSearch(localQuery || searchQuery, activeFilterChip);
  };

  const handleSelectSuggested = (q: string) => {
    const cleanQuery = q.replace('⚡ ', '');
    setLocalQuery(cleanQuery);
    setSearchQuery(cleanQuery);
    setIsSearchFocused(false);
    navigateToQuestionSearch(cleanQuery);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F4F6FB]/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 py-3.5 space-y-3 shadow-xs">
      {/* Top Search & Actions Row */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 shadow-xs"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form 
          ref={searchRef}
          onSubmit={handleSearchSubmit}
          className="flex-1 relative flex items-center group"
        >
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Discover articles, topics, sovereign models, startups..."
              className="w-full pl-10 pr-24 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-800 text-[13.5px] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-xs transition-all duration-200 font-medium"
            />
            
            <div className="absolute right-2.5 flex items-center gap-1.5">
              {localQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              
              <button
                type="submit"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all duration-150"
              >
                <span>Search</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Autocomplete & Suggestions Dropdown */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center justify-between">
                <span>Trending Search Suggestions</span>
                <span className="text-indigo-600 font-semibold font-mono">Realtime Stream</span>
              </div>
              <div className="space-y-1">
                {SUGGESTED_QUERIES.map((q) => (
                  <div
                    key={q}
                    onClick={() => handleSelectSuggested(q)}
                    className="px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Save Search Button */}
          <button
            type="button"
            onClick={handleSaveSearchClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 bg-white border-slate-200/90 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-xs"
            title="Save this search query to your Library"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Save Search</span>
          </button>

          {/* Create Briefing Button */}
          <button
            type="button"
            onClick={() => setIsBriefingModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-900/20 hover:shadow-indigo-900/30 transition-all duration-200 active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create Briefing</span>
          </button>

          {/* Notifications Trigger & Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-white border border-slate-200/90 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-xs transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">Intelligence Notifications</span>
                    {unreadNotifCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        {unreadNotifCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer space-y-1 ${
                        !n.read ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          n.type === 'alert' ? 'text-rose-600' :
                          n.type === 'briefing' ? 'text-indigo-600' : 'text-slate-500'
                        }`}>
                          {n.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{n.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{n.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Chips Horizontal Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 shrink-0 text-slate-400 text-xs font-semibold mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="text-[11px] uppercase tracking-wider">Filters:</span>
        </div>

        {FILTER_CHIPS.map((chip) => {
          const isActive = activeFilterChip === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setActiveFilterChip(chip);
                showToast(`Filter applied: ${chip}`);
              }}
              className={`
                shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1
                ${isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200/90 text-slate-600 hover:border-indigo-300 hover:text-slate-900'
                }
              `}
            >
              <span>{chip}</span>
              {chip === 'More Filters' && <ChevronDown className="w-3 h-3 text-slate-400" />}
            </button>
          );
        })}
      </div>
    </header>
  );
};
