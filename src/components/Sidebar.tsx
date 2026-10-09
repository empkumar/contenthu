import React from 'react';
import { 
  Compass, 
  Globe, 
  Sparkles, 
  Activity, 
  Bookmark, 
  FileText, 
  Search, 
  Eye, 
  Layers, 
  X,
  Settings as SettingsIcon,
  Radio
} from 'lucide-react';
import { useApp, type ActiveTab } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isMobileSidebarOpen, 
    setIsMobileSidebarOpen,
    bookmarkedIds,
    briefings,
    collections,
    savedSearches,
    watchlists,
    isBackendOnline
  } = useApp();

  const mainNav = [
    { id: 'discover' as ActiveTab, label: 'Discover', icon: Compass },
    { id: 'explore' as ActiveTab, label: 'Explore Clusters', icon: Globe },
    { id: 'ai-research' as ActiveTab, label: 'AI Research', icon: Sparkles },
    { id: 'monitor' as ActiveTab, label: 'Market Monitor', icon: Activity },
    { id: 'library' as ActiveTab, label: 'My Library', icon: Bookmark, count: `${bookmarkedIds.size}` },
    { id: 'briefings' as ActiveTab, label: 'Briefings', icon: FileText, count: `${briefings.length}` },
  ];

  const secondaryNav = [
    { id: 'saved-searches' as ActiveTab, label: 'Saved Searches', icon: Search, count: `${savedSearches.length}` },
    { id: 'watchlist' as ActiveTab, label: 'Watchlist', icon: Eye, count: `${watchlists.length}` },
    { id: 'collections' as ActiveTab, label: 'Collections', icon: Layers, count: `${collections.length}` },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (setIsMobileSidebarOpen) setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50
        w-[220px] min-w-[220px] max-w-[220px]
        bg-[#0B1120] text-slate-300 border-r border-slate-800/80
        flex flex-col justify-between select-none
        transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header & Logo */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/60 shrink-0">
            <div 
              onClick={() => handleNavClick('discover')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-[17px] tracking-tight text-white font-sans">
                  Content<span className="text-indigo-400 font-extrabold">Hu</span>
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                  AI
                </span>
              </div>
            </div>

            {isMobileSidebarOpen && (
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Nav list with smooth scroll */}
          <div className="px-3 py-4 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
            {/* Primary Nav */}
            <div>
              <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Platform
              </div>
              <nav className="space-y-1">
                {mainNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`
                        w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 group
                        ${isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-900/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.count && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Secondary Nav */}
            <div>
              <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Workspace
              </div>
              <nav className="space-y-1">
                {secondaryNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`
                        w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 group
                        ${isActive
                          ? 'bg-slate-800 text-white font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-transform group-hover:scale-110" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.count}
                      </span>
                    </button>
                  );
                })}

                {/* Settings Link */}
                <button
                  onClick={() => handleNavClick('settings')}
                  className={`
                    w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 group
                    ${activeTab === 'settings'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <SettingsIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-transform group-hover:scale-110" />
                    <span>Settings</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Clean, Minimal Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0A0F1D] shrink-0">
          <div className="px-2 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBackendOnline ? 'bg-emerald-400' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isBackendOnline ? 'bg-emerald-500' : 'bg-emerald-500'}`}></span>
              </span>
              <span className="text-[11px] font-medium text-slate-300">Live Ingestion</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-300 font-semibold flex items-center gap-1">
              <Radio className="w-3 h-3 text-indigo-400" />
              v2.0
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
