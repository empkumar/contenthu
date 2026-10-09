import React, { useState, useMemo } from 'react';
import { 
  Bookmark, 
  Layers, 
  Search, 
  History, 
  FileText, 
  Plus, 
  Trash2, 
  ArrowUpRight, 
  FolderPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ArticleCard } from '../ArticleCard';
import { CreateCollectionModal } from '../modals/CreateCollectionModal';

export const LibraryView: React.FC = () => {
  const {
    articles,
    bookmarkedIds,
    toggleBookmark,
    openArticleModal,
    collections,
    removeCollection,
    removeArticleFromCollection,
    savedSearches,
    removeSavedSearch,
    searchHistory,
    clearSearchHistory,
    researchNotes,
    addResearchNote,
    removeResearchNote,
    navigateToQuestionSearch,
    librarySubTab,
    setLibrarySubTab
  } = useApp();

  const [isCreateColModalOpen, setIsCreateColModalOpen] = useState(false);
  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  // New note inline editor state
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('Research, Benchmark');

  // Filtered Saved Articles
  const savedArticles = useMemo(() => {
    return articles.filter(art => {
      if (!bookmarkedIds.has(art.id)) return false;
      if (librarySearchQuery.trim()) {
        const q = librarySearchQuery.toLowerCase();
        return (
          art.title.toLowerCase().includes(q) ||
          art.description.toLowerCase().includes(q) ||
          art.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [articles, bookmarkedIds, librarySearchQuery]);

  // Selected Collection object
  const activeCollection = collections.find(c => c.id === selectedCollectionId);
  const collectionArticles = activeCollection 
    ? articles.filter(a => activeCollection.articleIds.includes(a.id))
    : [];

  const handleSaveNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    addResearchNote({
      title: noteTitle.trim(),
      content: noteContent.trim() || 'No additional note content provided.',
      tags: noteTags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setIsCreatingNote(false);
    setNoteTitle('');
    setNoteContent('');
  };

  const tabs: Array<{ id: 'saved' | 'collections' | 'searches' | 'history' | 'notes'; label: string; icon: React.ElementType; count?: number }> = [
    { id: 'saved', label: 'Saved Articles', icon: Bookmark, count: savedArticles.length },
    { id: 'collections', label: 'Collections', icon: Layers, count: collections.length },
    { id: 'searches', label: 'Saved Searches', icon: Search, count: savedSearches.length },
    { id: 'history', label: 'Research History', icon: History, count: searchHistory.length },
    { id: 'notes', label: 'Research Notes', icon: FileText, count: researchNotes.length }
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* 1. Header & Tabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-600 fill-indigo-600" />
            <span>My Research Library & Archive</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your curated articles, custom collections, persistent search queries, and research memos.
          </p>
        </div>

        {/* Action Button depending on sub-tab */}
        {librarySubTab === 'collections' && (
          <button
            onClick={() => setIsCreateColModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-900/20 flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Collection</span>
          </button>
        )}

        {librarySubTab === 'notes' && (
          <button
            onClick={() => setIsCreatingNote(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-900/20 flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Note</span>
          </button>
        )}

        {librarySubTab === 'history' && searchHistory.length > 0 && (
          <button
            onClick={clearSearchHistory}
            className="px-3 py-1.5 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* 2. Sub-Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = librarySubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setLibrarySubTab(t.id);
                setSelectedCollectionId(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: SAVED ARTICLES */}
      {librarySubTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={librarySearchQuery}
                onChange={(e) => setLibrarySearchQuery(e.target.value)}
                placeholder="Search saved articles by title, tag, or topic..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>
            <span className="text-xs font-mono text-slate-400">
              Showing {savedArticles.length} saved papers
            </span>
          </div>

          {savedArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {savedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onSelectArticle={openArticleModal}
                  onBookmarkToggle={toggleBookmark}
                  isBookmarked={true}
                />
              ))}
            </div>
          ) : (
            <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No saved articles found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Save articles and research papers from the AI Research workspace to access them anytime.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB B: COLLECTIONS */}
      {librarySubTab === 'collections' && (
        <div className="space-y-6">
          {selectedCollectionId && activeCollection ? (
            /* Inside Specific Collection View */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedCollectionId(null)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    ← Back to all collections
                  </button>
                  <span className="text-slate-300">/</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${activeCollection.color}`} />
                    <h3 className="text-sm font-bold text-slate-900">{activeCollection.name}</h3>
                  </div>
                </div>

                <button
                  onClick={() => {
                    removeCollection(activeCollection.id);
                    setSelectedCollectionId(null);
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Collection</span>
                </button>
              </div>

              <p className="text-xs text-slate-500">{activeCollection.description}</p>

              {collectionArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {collectionArticles.map((article) => (
                    <div key={article.id} className="relative group">
                      <ArticleCard
                        article={article}
                        onSelectArticle={openArticleModal}
                        onBookmarkToggle={toggleBookmark}
                        isBookmarked={bookmarkedIds.has(article.id)}
                      />
                      <button
                        onClick={() => removeArticleFromCollection(activeCollection.id, article.id)}
                        className="absolute bottom-3 right-3 px-2 py-1 rounded bg-rose-50 text-rose-600 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-rose-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                  <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-600">This collection has no articles yet.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Use the &quot;Add to Collection&quot; action on any article.</p>
                </div>
              )}
            </div>
          ) : (
            /* Collection Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((col) => (
                <div
                  key={col.id}
                  onClick={() => setSelectedCollectionId(col.id)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${col.color} text-white flex items-center justify-center shadow-xs`}>
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-400">
                        {col.articleIds.length} articles
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {col.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {col.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Updated {col.updatedAt}</span>
                    <span className="font-bold text-indigo-600 flex items-center gap-0.5">
                      <span>Open Folder</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB C: SAVED SEARCHES */}
      {librarySubTab === 'searches' && (
        <div className="space-y-3">
          {savedSearches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedSearches.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 truncate">
                    <div className="flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{s.query}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>Filter: <strong className="text-slate-600">{s.filter}</strong></span>
                      <span>•</span>
                      <span>{s.savedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigateToQuestionSearch(s.query)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>Run</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeSavedSearch(s.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete saved search"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-600">No saved searches yet.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;Save Search&quot; on the search header to bookmark complex queries.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB D: RESEARCH HISTORY */}
      {librarySubTab === 'history' && (
        <div className="space-y-3">
          {searchHistory.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
              {searchHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 truncate">
                    <History className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{item.query}</span>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0 hidden sm:inline">({item.resultCount} results)</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400">{item.timestamp}</span>
                    <button
                      onClick={() => navigateToQuestionSearch(item.query)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>Re-run</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-600">Research history is empty.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB E: RESEARCH NOTES */}
      {librarySubTab === 'notes' && (
        <div className="space-y-4">
          {isCreatingNote && (
            <form onSubmit={handleSaveNoteSubmit} className="p-5 bg-white rounded-2xl border border-indigo-200 shadow-sm space-y-3 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-slate-900">New Research Note</h3>
              <input
                type="text"
                required
                placeholder="Note Title..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <textarea
                rows={3}
                placeholder="Write your research memo, benchmark takeaways, or key takeaways..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
              <input
                type="text"
                placeholder="Comma separated tags (e.g., Latency, BFSI, Sarvam)..."
                value={noteTags}
                onChange={(e) => setNoteTags(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreatingNote(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save Note
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {researchNotes.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">{note.updatedAt}</span>
                    <button
                      onClick={() => removeResearchNote(note.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {note.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {note.content}
                  </p>

                  {note.articleTitle && (
                    <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900">
                      <span className="font-semibold">Linked Article: </span>
                      {note.articleTitle}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 pt-1">
                    {note.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Collection Modal */}
      <CreateCollectionModal
        isOpen={isCreateColModalOpen}
        onClose={() => setIsCreateColModalOpen(false)}
      />
    </div>
  );
};
