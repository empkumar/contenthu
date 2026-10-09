import React from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  Lightbulb, 
  Compass, 
  History, 
  Check, 
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopicUniverse } from '../discover/TopicUniverse';
import { ArticleCard } from '../ArticleCard';
import { UNEXPECTED_DISCOVERIES, TOPIC_NODES, type Article } from '../../data/mockData';

export const DiscoverView: React.FC = () => {
  const {
    articles,
    bookmarkedIds,
    toggleBookmark,
    openArticleModal,
    followedTopicIds,
    toggleFollowTopic,
    isTopicFollowed,
    recentlyViewedIds,
    navigateToTopicResearch,
    showToast
  } = useApp();

  const trendingTopicPills = [
    { id: 'startups', label: 'Vernacular Voice SLMs', velocity: '+142%', icon: '🔥' },
    { id: 'use-cases', label: 'BFSI Autonomous Underwriting', velocity: '+94%', icon: '⚡' },
    { id: 'government-policy', label: '10,000 GPU National Compute', velocity: '+65%', icon: '🏛️' },
    { id: 'funding', label: 'Series A State Stores ($420M)', velocity: '+120%', icon: '💰' },
    { id: 'tools-platforms', label: 'Deterministic Eval Harnesses', velocity: '+88%', icon: '🛠️' }
  ];

  // Recently viewed articles resolved from IDs
  const recentlyViewedArticles = recentlyViewedIds
    .map(id => articles.find(a => a.id === id))
    .filter((a): a is Article => a !== undefined);

  // Articles for followed topics
  const followedTopicArticles = articles.filter(a => followedTopicIds.includes(a.topicId)).slice(0, 4);

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-200">
      {/* 1. Discover Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-[#1E1B4B] p-6 sm:p-8 text-white overflow-hidden shadow-lg border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/15 to-violet-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Personalized Intelligence Feed • High Relevancy Match</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Visual Content Discovery & Emerging Frontiers
          </h1>

          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            Synthesized across Indian AI startups, sovereign language models, subsidized GPU clusters, and autonomous agent architectures.
          </p>

          {/* Quick Trending Topic Chips */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 font-mono">
              Trending Velocity:
            </span>
            {trendingTopicPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => navigateToTopicResearch(pill.id, pill.label)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium backdrop-blur-sm transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>{pill.icon}</span>
                <span className="font-semibold">{pill.label}</span>
                <span className="text-emerald-300 font-mono text-[11px] font-bold">{pill.velocity}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interactive Topic Universe Canvas */}
      <TopicUniverse />

      {/* 3. Serendipitous / Unexpected Discoveries */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-200 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Unexpected Discoveries & Outlier Breakthroughs</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Cross-Disciplinary
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Outlier findings, edge neuromorphic models, and bio-inspired agent swarms.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {UNEXPECTED_DISCOVERIES.map((disc) => (
            <div
              key={disc.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                    {disc.tag}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {disc.impactScore}% impact
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                  {disc.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {disc.excerpt}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-900 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Key Insight:</span>
                  </div>
                  <p className="text-slate-600 leading-tight">{disc.insight}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{disc.startupOrLab}</span>
                <button
                  onClick={() => {
                    navigateToTopicResearch('tools-platforms', disc.title);
                    showToast(`Exploring "${disc.title}"`);
                  }}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Investigate</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Followed Topics Recommendations */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Compass className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Curated for Your Followed Topics
              </h2>
              <p className="text-xs text-slate-500">
                Articles matching your {followedTopicIds.length} actively tracked research clusters.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {TOPIC_NODES.slice(0, 4).map((node) => {
              const isFollowed = isTopicFollowed(node.id);
              return (
                <button
                  key={node.id}
                  onClick={() => toggleFollowTopic(node.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    isFollowed
                      ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isFollowed ? <Check className="w-3 h-3 text-indigo-600" /> : <Plus className="w-3 h-3" />}
                  <span>{node.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {followedTopicArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onSelectArticle={openArticleModal}
              onBookmarkToggle={toggleBookmark}
              isBookmarked={bookmarkedIds.has(article.id)}
            />
          ))}
        </div>
      </section>

      {/* 5. Recently Viewed Articles */}
      {recentlyViewedArticles.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                <History className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Recently Viewed Research
                </h2>
                <p className="text-xs text-slate-500">
                  Quick access to dossiers and benchmark papers you reviewed recently.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyViewedArticles.slice(0, 3).map((article) => (
              <div
                key={article.id}
                onClick={() => openArticleModal(article)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-indigo-600 font-mono block mb-0.5">
                    {article.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {article.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    {article.publisher.name} • {article.publishedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
