import React, { useState, useMemo } from 'react';
import { 
  Globe, 
  Search, 
  Flame, 
  ArrowUpRight, 
  Check, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  Shield, 
  Workflow, 
  DollarSign, 
  Users, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TOPIC_NODES } from '../../data/mockData';

export const ExploreView: React.FC = () => {
  const { 
    navigateToTopicResearch, 
    toggleFollowTopic, 
    isTopicFollowed 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Applications', 'Ecosystem', 'Capital', 'Dynamics', 'Infrastructure', 'Regulation', 'Workforce', 'Barriers'];

  const trendingEcosystems = [
    {
      id: 'indic-voice',
      topicId: 'startups',
      title: 'Indic Voice Intelligence & Conversational AI',
      category: 'Foundation Models',
      growth: '+142% this month',
      startups: 'Sarvam AI, Bhashini, Gnani.ai, Karya',
      articles: 64,
      velocityRank: '#1 Trending',
      gradient: 'from-blue-600 to-indigo-600',
      description: 'Zero-shot streaming acoustic tokenizers enabling real-time voice commerce across 22 scheduled Indian languages.'
    },
    {
      id: 'fintech-agents',
      topicId: 'use-cases',
      title: 'Autonomous Compliance & BFSI Underwriting Agents',
      category: 'Fintech Automation',
      growth: '+88% this month',
      startups: 'Setu, Perfios AI, Decentro, FinBox',
      articles: 52,
      velocityRank: '#2 Trending',
      gradient: 'from-emerald-600 to-teal-600',
      description: 'Multi-agent frameworks resolving 74% of loan underwriting and statutory compliance checks without human escalation.'
    },
    {
      id: 'developer-infra',
      topicId: 'tools-platforms',
      title: 'Agent Evaluation Harnesses & Vector Memory Layers',
      category: 'Developer Infra',
      growth: '+120% this month',
      startups: 'DevRev, NimbleBox, Composio, TrueFoundry',
      articles: 48,
      velocityRank: '#3 Trending',
      gradient: 'from-purple-600 to-fuchsia-600',
      description: 'Evaluation benchmarks (DSPy, Ragas) preventing prompt drift and hallucination loops in complex production swarms.'
    },
    {
      id: 'legal-tax',
      topicId: 'government-policy',
      title: 'DPDP Data Privacy & Sovereign Compute Mandates',
      category: 'Sovereign Policy',
      growth: '+65% this month',
      startups: 'IndiaAI Mission, MeitY, Yotta, Nxtra',
      articles: 36,
      velocityRank: '#4 Trending',
      gradient: 'from-rose-600 to-pink-600',
      description: 'Subsidized 10,000 GPU compute allocations and statutory on-shore data privacy enforcement for Indian founders.'
    }
  ];

  const emergingThemes = [
    { title: 'Sub-50MB SLMs on Edge POS Terminals', growth: '+210%', category: 'Edge Computing', relatedTopic: 'tools-platforms' },
    { title: 'Outcome-Based SaaS Pricing Swarms', growth: '+175%', category: 'Business Models', relatedTopic: 'market-trends' },
    { title: 'Hierarchical Tax Audit State Machines', growth: '+130%', category: 'Statutory AI', relatedTopic: 'use-cases' },
    { title: 'Vernacular Dialect Acoustic Datasets', growth: '+115%', category: 'Data Sovereignty', relatedTopic: 'startups' }
  ];

  const filteredNodes = useMemo(() => {
    return TOPIC_NODES.filter((node) => {
      if (selectedCategory !== 'All' && node.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchLabel = node.label.toLowerCase().includes(q);
        const matchDesc = node.description.toLowerCase().includes(q);
        const matchSat = node.satellites.some(s => s.toLowerCase().includes(q));
        if (!matchLabel && !matchDesc && !matchSat) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Workflow': return Workflow;
      case 'DollarSign': return DollarSign;
      case 'TrendingUp': return TrendingUp;
      case 'Cpu': return Cpu;
      case 'ShieldCheck': return Shield;
      case 'Users': return Users;
      case 'AlertTriangle': return AlertTriangle;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-200">
      {/* 1. Header & Search Directory Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-600" />
            <span>Topic Exploration & Research Clusters</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Searchable directory of macro themes, emerging technologies, and venture ecosystems across Indian AI.
          </p>
        </div>
      </div>

      {/* 2. Search & Category Filter Toolbar */}
      <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic clusters, startups, technology keywords (e.g. Voice, DPDP, GPU, LangGraph)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Trending Clusters */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Fastest-Growing Intelligence Clusters
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Ranked by 30-Day Velocity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingEcosystems.map((eco) => {
            const isFollowed = isTopicFollowed(eco.topicId);
            return (
              <div
                key={eco.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Flame className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{eco.growth}</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      {eco.velocityRank}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {eco.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {eco.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                    Key Entities: <strong className="text-slate-800">{eco.startups}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleFollowTopic(eco.topicId)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isFollowed
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isFollowed ? <Check className="w-3.5 h-3.5 text-indigo-600" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isFollowed ? 'Following' : 'Follow Cluster'}</span>
                  </button>

                  <button
                    onClick={() => navigateToTopicResearch(eco.topicId, eco.title)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Open Topic Landscape</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Emerging Themes Ticker */}
      <section className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50 border border-indigo-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
              Emerging Thematic Trends
            </h3>
          </div>
          <span className="text-[10px] font-mono text-indigo-600 font-bold">Q3 Breakthroughs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {emergingThemes.map((theme) => (
            <div
              key={theme.title}
              onClick={() => navigateToTopicResearch(theme.relatedTopic, theme.title)}
              className="p-3 bg-white rounded-xl border border-indigo-100 hover:border-indigo-300 hover:shadow-xs cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{theme.category}</span>
                <span className="text-[10px] font-bold text-emerald-600 font-mono">{theme.growth}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">{theme.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Complete Searchable Topic Directory Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              All Research Clusters ({filteredNodes.length})
            </h2>
            <p className="text-xs text-slate-500">
              Click any cluster to open its dedicated research workspace with dynamic AI synthesis.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredNodes.map((node) => {
            const Icon = getTopicIcon(node.iconName);
            const isFollowed = isTopicFollowed(node.id);

            return (
              <div
                key={node.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {node.statLabel}
                    </span>
                  </div>

                  <h3 
                    onClick={() => navigateToTopicResearch(node.id, node.label)}
                    className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 cursor-pointer transition-colors"
                  >
                    {node.label}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {node.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {node.satellites.slice(0, 2).map((sat) => (
                      <span key={sat} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {sat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleFollowTopic(node.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      isFollowed
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                        : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200'
                    }`}
                  >
                    {isFollowed ? <Check className="w-3 h-3 text-indigo-600" /> : <Plus className="w-3 h-3" />}
                    <span>{isFollowed ? 'Followed' : 'Follow'}</span>
                  </button>

                  <button
                    onClick={() => navigateToTopicResearch(node.id, node.label)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                  >
                    <span>Research</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
