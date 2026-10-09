import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  Check, 
  ChevronDown,
  SearchX
} from 'lucide-react';
import type { Article } from '../data/mockData';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  selectedTopicId: string | null;
  searchQuery: string;
  onSelectArticle: (article: Article) => void;
  bookmarkedIds: Set<string>;
  onBookmarkToggle: (id: string) => void;
}

const TYPE_FILTERS = ['All Results', 'Articles', 'Research Papers', 'Case Studies', 'News'] as const;

export const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  selectedTopicId,
  searchQuery,
  onSelectArticle,
  bookmarkedIds,
  onBookmarkToggle
}) => {
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('All Results');
  const [sortBy, setSortBy] = useState<'relevance' | 'latest' | 'saves'>('relevance');
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);

  // Filtered & Sorted Articles
  const filteredArticles = useMemo(() => {
    return articles
      .filter((art) => {
        // Topic filter
        if (selectedTopicId && art.topicId !== selectedTopicId) {
          return false;
        }
        // Type tab filter
        if (activeTypeFilter !== 'All Results' && art.type !== activeTypeFilter) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = art.title.toLowerCase().includes(q);
          const matchDesc = art.description.toLowerCase().includes(q);
          const matchTag = art.tags.some(t => t.toLowerCase().includes(q));
          const matchPub = art.publisher.name.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchTag && !matchPub) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'relevance') return b.relevanceScore - a.relevanceScore;
        if (sortBy === 'saves') return b.savesCount - a.savesCount;
        return 0; // default order
      });
  }, [articles, selectedTopicId, activeTypeFilter, searchQuery, sortBy]);

  return (
    <section className="mt-8 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
              Articles & Insights
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {filteredArticles.length} results
            </span>
          </div>
        </div>

        {/* Filters and Sorting controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Format / Type Tabs */}
          <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/80 overflow-x-auto">
            {TYPE_FILTERS.map((type) => (
              <button
                key={type}
                onClick={() => setActiveTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  activeTypeFilter === type
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {sortBy === 'relevance' && 'Most Relevant'}
                {sortBy === 'latest' && 'Latest Published'}
                {sortBy === 'saves' && 'Most Saved'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl border border-slate-200 shadow-lg p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => { setSortBy('relevance'); setShowSortDropdown(false); }}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Most Relevant</span>
                  {sortBy === 'relevance' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
                <button
                  onClick={() => { setSortBy('latest'); setShowSortDropdown(false); }}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Latest Published</span>
                  {sortBy === 'latest' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
                <button
                  onClick={() => { setSortBy('saves'); setShowSortDropdown(false); }}
                  className="w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Most Saved</span>
                  {sortBy === 'saves' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4-column article grid on wide desktop */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onSelectArticle={onSelectArticle}
              onBookmarkToggle={onBookmarkToggle}
              isBookmarked={bookmarkedIds.has(article.id)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1">No matching articles found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, clearing the selected topic cluster, or choosing &quot;All Results&quot;.
          </p>
        </div>
      )}

      {/* Load More Button */}
      {filteredArticles.length > 0 && (
        <div className="pt-4 text-center">
          <button className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-700 font-semibold text-xs shadow-xs transition-all duration-200">
            Load More Verified Sources ({articles.length * 3}+ total indexed)
          </button>
        </div>
      )}
    </section>
  );
};
