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
  Zap, 
  ChevronRight, 
  MoreVertical, 
  X,
  Settings as SettingsIcon
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
    userProfile
  } = useApp();

  const mainNav = [
    { id: 'discover' as ActiveTab, label: 'Discover', icon: Compass },
    { id: 'explore' as ActiveTab, label: 'Explore', icon: Globe },
    { id: 'ai-research' as ActiveTab, label: 'AI Research', icon: Sparkles, badge: 'PRO', isHighlight: true },
    { id: 'monitor' as ActiveTab, label: 'Monitor', icon: Activity },
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
        <div className="flex flex-col">
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/60">
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

          {/* Nav list */}
          <div className="px-3 py-4 space-y-5 overflow-y-auto max-h-[calc(100vh-270px)]">
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
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
                          {item.badge}
                        </span>
                      )}
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

                {/* Settings Link in Workspace */}
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

        {/* Bottom Section: Pro Upgrade & User Profile */}
        <div className="p-3 space-y-3 border-t border-slate-800/80 bg-[#0A0F1D]">
          {/* Upgrade Card */}
          <div className="relative overflow-hidden rounded-xl p-3 bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-inner">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-[11px] font-bold text-white tracking-wide">PRO PLAN</span>
              </div>
              <span className="text-[10px] font-mono text-indigo-300">84% used</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mb-2.5">
              Unlimited multi-agent synthesis & deep web research.
            </p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2.5 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full w-[84%]" />
            </div>
            <button 
              onClick={() => handleNavClick('settings')}
              className="w-full py-1.5 px-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-[11px] font-semibold shadow-md shadow-indigo-900/40 transition-all flex items-center justify-center gap-1"
            >
              <span>Manage Quotas</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* User Profile item */}
          <div 
            onClick={() => handleNavClick('settings')}
            className={`flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer group ${
              activeTab === 'settings' ? 'bg-slate-800/80' : ''
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow">
                  {userProfile.avatarInitials}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0B1120] rounded-full" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-semibold text-white leading-tight group-hover:text-indigo-300 transition-colors truncate max-w-[100px]">
                  {userProfile.name}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[100px]">
                  {userProfile.role}
                </span>
              </div>
            </div>
            <MoreVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </div>
        </div>
      </aside>
    </>
  );
};
