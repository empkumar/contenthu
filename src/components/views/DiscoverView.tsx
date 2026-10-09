import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  Lightbulb, 
  Compass, 
  History, 
  Check, 
  Plus,
  RefreshCw,
  TrendingUp,
  Clock,
  Layers,
  ChevronRight,
  Eye
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
    refreshLiveFeeds,
    isSyncingFeeds,
    lastFeedSyncTime,
    isBackendOnline,
    setActiveTab,
    setIsBriefingModalOpen,
    showToast
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<'trending' | 'latest' | 'score'>('trending');
  const [showFullUniverse, setShowFullUniverse] = useState<boolean>(false);

  const trendingTopicPills = [
    { id: 'startups', label: 'Indic Voice SLMs', velocity: '+142%', icon: '🔥', category: 'Foundation Models' },
    { id: 'use-cases', label: 'BFSI Autonomous Underwriting', velocity: '+94%', icon: '⚡', category: 'Enterprise' },
    { id: 'funding', label: 'Agent Infra State Stores', velocity: '+120%', icon: '💰', category: 'Venture Deals' },
    { id: 'government-policy', label: '10,000 GPU National Compute', velocity: '+65%', icon: '🏛️', category: 'Infrastructure' },
    { id: 'tools-platforms', label: 'Deterministic Eval Harnesses', velocity: '+88%', icon: '🛠️', category: 'Dev Tools' }
  ];

  // Primary featured/spotlight article
  const spotlightArticle = articles[0];

  // Filtered & sorted articles list
  const filteredArticles = useMemo(() => {
    let list = articles.filter(a => a.id !== spotlightArticle?.id);
    if (selectedCategory !== 'All') {
      list = list.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedSort === 'latest') {
      list = [...list].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (selectedSort === 'score') {
      list = [...list].sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    } else {
      // Trending
      list = [...list].sort((a, b) => ((b.savesCount || 0) + (b.sharesCount || 0)) - ((a.savesCount || 0) + (a.sharesCount || 0)));
    }
    return list;
  }, [articles, spotlightArticle, selectedCategory, selectedSort]);

  // Recently viewed articles resolved from IDs
  const recentlyViewedArticles = recentlyViewedIds
    .map(id => articles.find(a => a.id === id))
    .filter((a): a is Article => a !== undefined);

  // Articles for followed topics
  const followedTopicArticles = articles.filter(a => followedTopicIds.includes(a.topicId)).slice(0, 4);

  const categories = ['All', 'VENTURE', 'RESEARCH', 'STARTUP', 'TECH REPORT', 'CASE STUDY'];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* 1. Sleek & Compact Intelligence Command Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBackendOnline ? 'bg-emerald-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isBackendOnline ? 'bg-emerald-500' : 'bg-emerald-500'}`}></span>
            </span>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Live Content Discovery & Emerging Frontiers
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {articles.length} Stories Live
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Realtime feeds ingested from TechCrunch, Hacker News, The Verge, MIT Tech Review, Wired & Ars Technica.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => refreshLiveFeeds(true)}
            disabled={isSyncingFeeds}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1.5 transition-all shadow-xs"
            title="Force refresh live RSS feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isSyncingFeeds ? 'animate-spin' : ''}`} />
            <span>{isSyncingFeeds ? 'Syncing...' : 'Sync Feeds'}</span>
            {lastFeedSyncTime && <span className="text-[10px] font-mono text-slate-400 pl-1">{lastFeedSyncTime}</span>}
          </button>

          <button
            onClick={() => setActiveTab('ai-research')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Claude AI Research</span>
          </button>

          <button
            onClick={() => setIsBriefingModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>Create Briefing</span>
          </button>
        </div>
      </div>

      {/* 2. Horizontal Trending Velocity Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono shrink-0 mr-1 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          Signals:
        </span>
        {trendingTopicPills.map((pill) => (
          <button
            key={pill.id}
            onClick={() => navigateToTopicResearch(pill.id, pill.label)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs group"
          >
            <span>{pill.icon}</span>
            <span className="font-semibold text-slate-800 group-hover:text-indigo-600">{pill.label}</span>
            <span className="text-emerald-600 font-mono text-[10px] font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              {pill.velocity}
            </span>
          </button>
        ))}
      </div>

      {/* 3. Balanced Split Hero: Spotlight Story (Left 65%) + Topic Cluster Radar (Right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Spotlight Hero Article (Left Column) */}
        {spotlightArticle && (
          <div 
            onClick={() => openArticleModal(spotlightArticle)}
            className="lg:col-span-7 xl:col-span-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    Spotlight Story
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                    {spotlightArticle.category}
                  </span>
                </div>

                <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {spotlightArticle.relevanceScore}% Match
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                {spotlightArticle.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                {spotlightArticle.description}
              </p>

              {/* Core AI Signal Callout */}
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-slate-700 flex items-start gap-2">
                <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Sparkles className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-indigo-950 block text-[11px]">Core AI Signal:</span>
                  <p className="text-slate-700 text-[11.5px] leading-relaxed line-clamp-2">
                    {spotlightArticle.keyTakeaway}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg ${spotlightArticle.publisher.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-2xs`}>
                  {spotlightArticle.publisher.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="font-bold text-slate-800 block text-xs">{spotlightArticle.publisher.name}</span>
                  <span className="text-[10px] text-slate-400">{spotlightArticle.publishedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 font-medium">
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {spotlightArticle.readTime}
                </span>
                <span className="text-indigo-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Read Analysis <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Compact Topic Cluster Radar (Right Column) */}
        <div className="lg:col-span-5 xl:col-span-4 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Topic Momentum Radar
                </h3>
              </div>
              <button
                onClick={() => setShowFullUniverse(!showFullUniverse)}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
              >
                <Eye className="w-3 h-3" />
                <span>{showFullUniverse ? 'Hide Canvas' : 'Expand Orbit'}</span>
              </button>
            </div>

            {/* Compact Cluster Nodes */}
            <div className="space-y-2">
              {TOPIC_NODES.slice(0, 4).map((node) => (
                <div
                  key={node.id}
                  onClick={() => navigateToTopicResearch(node.id, node.label)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-md ${node.bgColor} ${node.borderColor} border flex items-center justify-center font-bold text-[10px] ${node.color} shrink-0`}>
                      {node.label.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 truncate transition-colors">
                        {node.label}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {node.articleCount} articles • {node.category}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 shrink-0">
                    {node.statLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('explore')}
            className="w-full py-2 px-3 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
          >
            <span>Explore All 8 Clusters in Deep Mode</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Conditional Full Topic Universe Canvas (Only shown when expanded) */}
      {showFullUniverse && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">Expanded Interactive Topic Universe Orbit</span>
            <button
              onClick={() => setShowFullUniverse(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Close Canvas ✕
            </button>
          </div>
          <TopicUniverse />
        </div>
      )}

      {/* 4. Primary Live Content Discovery Grid */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Compass className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Discovered Intelligence Stream</span>
                <span className="text-xs font-mono font-bold text-slate-400">({filteredArticles.length})</span>
              </h2>
              <p className="text-xs text-slate-500">
                Fresh real-time articles, venture deals, research preprints, and case studies.
              </p>
            </div>
          </div>

          {/* Sort & Category Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs text-xs font-semibold">
              {[
                { id: 'trending' as const, label: 'Trending' },
                { id: 'latest' as const, label: 'Latest' },
                { id: 'score' as const, label: 'Top Score' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSort(s.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedSort === s.id
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredArticles.map((article) => (
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

      {/* 5. Serendipitous / Unexpected Discoveries */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
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

      {/* 6. Curated for Your Followed Topics */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
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

      {/* 7. Recently Viewed Articles */}
      {recentlyViewedArticles.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200 pb-8">
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
