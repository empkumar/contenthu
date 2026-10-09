import React, { useState } from 'react';
import { 
  Activity, 
  ArrowUpRight, 
  Zap, 
  Clock, 
  Building2, 
  Plus, 
  Trash2, 
  Bell, 
  BellOff, 
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AddCompanyModal } from '../modals/AddCompanyModal';

export const MonitorView: React.FC = () => {
  const {
    trackedCompanies,
    removeTrackedCompany,
    toggleCompanyAlert,
    navigateToTopicResearch,
    openArticleModal,
    articles,
    showToast
  } = useApp();

  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState<'Live' | '24h' | '7d' | '30d'>('Live');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [isWebhookConfigured, setIsWebhookConfigured] = useState(false);

  const liveEvents = [
    {
      id: 'e-1',
      time: '4 mins ago',
      type: 'BREAKTHROUGH',
      company: 'Sarvam AI',
      title: 'Sarvam AI releases "Bulbul-v2" acoustic model tokenizer',
      description: 'Zero-shot streaming audio latency reduced to 280ms across Hindi, Tamil, and Bengali dialects.',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      source: 'GitHub / HuggingFace',
      articleId: 'art-1'
    },
    {
      id: 'e-2',
      time: '18 mins ago',
      type: 'VENTURE ROUND',
      company: 'Peak XV Partners',
      title: 'Peak XV leads $18M Series A in autonomous QA evaluation mesh',
      description: 'Bengaluru-based devtool startup secures fresh capital to expand multi-agent evaluation suites.',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      source: 'Entrackr Live',
      articleId: 'art-2'
    },
    {
      id: 'e-3',
      time: '1 hour ago',
      type: 'POLICY DIRECTIVE',
      company: 'MeitY / IndiaAI',
      title: 'MeitY opens Phase 2 allocations for 10,000 GPU National Cluster',
      description: 'Startups building autonomous agent workflows receive priority compute tier access.',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      source: 'IndiaAI Mission',
      articleId: 'art-5'
    },
    {
      id: 'e-4',
      time: '2 hours ago',
      type: 'RESEARCH PREPRINT',
      company: 'IIT Madras AI Lab',
      title: 'IIT Madras AI Lab submits paper on Hierarchical Multi-Agent Swarms',
      description: 'New benchmark proves 99.4% precision in statutory tax compliance under DPDP framework.',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      source: 'arXiv CS.AI',
      articleId: 'art-3'
    },
    {
      id: 'e-5',
      time: '4 hours ago',
      type: 'ENTERPRISE PILOT',
      company: 'DevRev',
      title: 'DevRev announces AgentOS v3 for automated customer ticket triage',
      description: 'Zero-touch resolution rate climbs to 68% in tier-1 banking support deployments.',
      badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      source: 'Enterprise SaaS Radar',
      articleId: 'art-10'
    }
  ];

  const filteredCompanies = activeCategoryFilter === 'All'
    ? trackedCompanies
    : trackedCompanies.filter(c => c.category.toLowerCase().includes(activeCategoryFilter.toLowerCase()));

  const handleEventClick = (articleId?: string) => {
    if (articleId) {
      const art = articles.find(a => a.id === articleId);
      if (art) openArticleModal(art);
    } else {
      showToast('Opening raw telemetry log');
    }
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-200">
      {/* 1. Header & Live Stream Telemetry Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Real-time Intelligence Monitor
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Ingestion Active</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Automated crawler telemetry tracking mentions, preprints, funding rounds, and regulatory filings across India.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            {(['Live', '24h', '7d', '30d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  setActiveTimeframe(tf);
                  showToast(`Timeframe set to: ${tf}`);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTimeframe === tf
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddCompanyOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-900/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track Subject</span>
          </button>
        </div>
      </div>

      {/* 2. Tracked Companies & Subjects Manager */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Tracked Companies & Entities ({trackedCompanies.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Actively monitored for news mentions, preprints, executive departures, and deal flow.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['All', 'Voice', 'Infra', 'Sovereign', 'Enterprise'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategoryFilter === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl ${company.logoBg} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                      {company.initials}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {company.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 block">{company.location}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    company.sentiment === 'Rapid Growth' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    company.sentiment === 'Bullish' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {company.sentiment}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {company.description}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Key Product:</span>
                    <strong className="text-slate-800">{company.keyProduct}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Capital:</span>
                    <span className="font-mono font-semibold text-emerald-700">{company.funding}</span>
                  </div>
                </div>

                <div className="text-[11px] text-indigo-900/80 bg-indigo-50/60 p-2 rounded-lg border border-indigo-100/80">
                  <span className="font-semibold text-indigo-950">Latest: </span>
                  {company.latestEvent}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCompanyAlert(company.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      company.alertsActive
                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                        : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                    }`}
                    title={company.alertsActive ? 'Alerts active (Click to mute)' : 'Muted (Click to enable alerts)'}
                  >
                    {company.alertsActive ? <Bell className="w-3.5 h-3.5 fill-amber-500" /> : <BellOff className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">
                    {company.recentMentions} mentions
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      navigateToTopicResearch('startups', company.name);
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                  >
                    <span>Research</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeTrackedCompany(company.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                    title="Remove from monitor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Realtime Stream & Telemetry Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Realtime Stream List (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Ingestion Feed ({liveEvents.length} updates today)
            </h3>
            <span className="text-xs text-indigo-600 font-semibold font-mono">Stream synced 14s ago</span>
          </div>

          <div className="space-y-3">
            {liveEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event.articleId)}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all space-y-2 cursor-pointer group text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${event.badgeBg}`}>
                      {event.type}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{event.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{event.time}</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {event.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {event.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Source: <strong className="text-slate-700">{event.source}</strong></span>
                  <span className="text-indigo-600 font-semibold flex items-center gap-1 group-hover:underline">
                    <span>Inspect Raw Stream & Synthesis</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Metrics & Webhook Alerting (1 Column) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Crawler & Model Telemetry
          </h3>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs text-slate-600">Active Crawl Nodes</span>
              <span className="text-xs font-bold text-slate-900 font-mono">64 workers</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs text-slate-600">Daily Articles Ingested</span>
              <span className="text-xs font-bold text-slate-900 font-mono">1,482 sources</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs text-slate-600">Synthesis Latency</span>
              <span className="text-xs font-bold text-emerald-600 font-mono">280ms / brief</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Accuracy Benchmark</span>
              <span className="text-xs font-bold text-indigo-600 font-mono">99.4% verified</span>
            </div>
          </div>

          {/* Webhook Alert Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 via-[#0F172A] to-[#1E1B4B] text-white space-y-3 border border-indigo-500/30 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400">
                <Zap className="w-4 h-4 fill-amber-400" />
              </div>
              <h4 className="text-xs font-bold">Webhook & Slack Alerting</h4>
            </div>

            <p className="text-[11px] text-indigo-200/90 leading-relaxed">
              Connect Slack, Discord, or generic Webhook endpoints to stream intelligence matching your monitored entities.
            </p>

            <button 
              onClick={() => {
                setIsWebhookConfigured(true);
                showToast('Webhook alert test event sent successfully');
              }}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isWebhookConfigured ? 'Webhook Active (Test Again)' : 'Test Webhook Dispatch'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddCompanyOpen}
        onClose={() => setIsAddCompanyOpen(false)}
      />
    </div>
  );
};
