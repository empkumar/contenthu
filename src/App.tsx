import { useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { SearchHeader } from './components/SearchHeader';
import { ArticleModal } from './components/ArticleModal';
import { CreateBriefingModal } from './components/CreateBriefingModal';
import { Toast } from './components/Toast';

import { DiscoverView } from './components/views/DiscoverView';
import { ExploreView } from './components/views/ExploreView';
import { AIResearchView } from './components/views/AIResearchView';
import { MonitorView } from './components/views/MonitorView';
import { LibraryView } from './components/views/LibraryView';
import { BriefingsView } from './components/views/BriefingsView';
import { ArticleDetailView } from './components/views/ArticleDetailView';
import { SettingsView } from './components/views/SettingsView';

import { useApp } from './context/AppContext';
import { TOPIC_NODES, CENTRAL_TOPIC } from './data/mockData';

export function AppContent() {
  const {
    activeTab,
    selectedTopicId,
    activeArticleForModal,
    closeArticleModal,
    bookmarkedIds,
    toggleBookmark,
    isBriefingModalOpen,
    setIsBriefingModalOpen,
    toastMessage,
    clearToast
  } = useApp();

  const selectedTopic = useMemo(() => {
    return TOPIC_NODES.find(n => n.id === selectedTopicId);
  }, [selectedTopicId]);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'discover': return 'Discover';
      case 'explore': return 'Explore';
      case 'ai-research': return 'AI Research';
      case 'monitor': return 'Monitor';
      case 'library': return 'My Library';
      case 'briefings': return 'Briefings';
      case 'article-detail': return 'Article Reader';
      case 'settings': return 'Settings';
      case 'saved-searches': return 'Saved Searches';
      case 'watchlist': return 'Watchlist';
      case 'collections': return 'Collections';
      default: return tab.replace('-', ' ');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex text-slate-800 font-sans antialiased overflow-x-hidden">
      {/* 1. Left Fixed / Responsive Sidebar */}
      <Sidebar />

      {/* 2. Main Center Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Global Search Header */}
        <SearchHeader />

        {/* Workspace Canvas */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 max-w-[1680px] w-full mx-auto">
          {/* Breadcrumb row */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-slate-400">ContentHu Platform</span>
              <span>/</span>
              <span className="text-slate-900 font-bold capitalize">
                {getPageTitle(activeTab)}
              </span>
              {selectedTopic && activeTab === 'ai-research' && (
                <>
                  <span>/</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 font-bold border border-indigo-200">
                    {selectedTopic.label}
                  </span>
                </>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span>Verified Sources: <strong className="text-slate-700">248</strong></span>
              <span>•</span>
              <span>Model: <strong className="text-slate-700">ContentHu Core v4.2</strong></span>
            </div>
          </div>

          {/* Conditional Multi-Page Views */}
          {activeTab === 'discover' && <DiscoverView />}
          {activeTab === 'explore' && <ExploreView />}
          {activeTab === 'ai-research' && <AIResearchView />}
          {activeTab === 'monitor' && <MonitorView />}
          {activeTab === 'watchlist' && <MonitorView />}
          {activeTab === 'library' && <LibraryView />}
          {activeTab === 'saved-searches' && <LibraryView />}
          {activeTab === 'collections' && <LibraryView />}
          {activeTab === 'briefings' && <BriefingsView />}
          {activeTab === 'article-detail' && <ArticleDetailView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Deep Article Synthesis Reader Modal */}
      <ArticleModal
        article={activeArticleForModal}
        onClose={closeArticleModal}
        isBookmarked={activeArticleForModal ? bookmarkedIds.has(activeArticleForModal.id) : false}
        onBookmarkToggle={toggleBookmark}
      />

      {/* Create Briefing Modal */}
      <CreateBriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        topicTitle={selectedTopic ? selectedTopic.label : CENTRAL_TOPIC.title}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={clearToast}
        />
      )}
    </div>
  );
}

export function App() {
  return <AppContent />;
}

export default App;
