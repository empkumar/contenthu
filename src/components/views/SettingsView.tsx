import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Sliders, 
  Bell, 
  Palette, 
  CreditCard, 
  Zap, 
  Plus, 
  Layers, 
  Save,
  Server,
  RefreshCw,
  Radio,
  KeyRound
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TOPIC_NODES } from '../../data/mockData';

export const SettingsView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    userPreferences,
    updateUserPreferences,
    followedTopicIds,
    toggleFollowTopic,
    refreshLiveFeeds,
    isSyncingFeeds,
    lastFeedSyncTime,
    isBackendOnline,
    backendHealth,
    showToast
  } = useApp();

  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'interests' | 'reading' | 'notifications' | 'display' | 'subscription' | 'backend'>('profile');

  // Local Profile Form State
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [role, setRole] = useState(userProfile.role);
  const [org, setOrg] = useState(userProfile.organization);
  const [bio, setBio] = useState(userProfile.bio);
  const [newTag, setNewTag] = useState('');

  // Local Preferences State
  const [summaryLength, setSummaryLength] = useState(userPreferences.summaryLength);
  const [defaultCitation, setDefaultCitation] = useState(userPreferences.defaultCitation);
  const [defaultLandingPage, setDefaultLandingPage] = useState(userPreferences.defaultLandingPage);
  const [density, setDensity] = useState(userPreferences.density);
  const [accentTheme, setAccentTheme] = useState(userPreferences.accentTheme);
  const [emailDailyDigest, setEmailDailyDigest] = useState(userPreferences.emailDailyDigest);
  const [highImpactAlerts, setHighImpactAlerts] = useState(userPreferences.highImpactAlerts);
  const [weeklyRoundup, setWeeklyRoundup] = useState(userPreferences.weeklyRoundup);
  const [webhookUrl, setWebhookUrl] = useState(userPreferences.webhookUrl || '');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      role,
      organization: org,
      bio,
      avatarInitials: name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'AM'
    });
  };

  const handleAddFocusTag = () => {
    if (newTag.trim() && !userProfile.researchFocus.includes(newTag.trim())) {
      updateUserProfile({
        researchFocus: [...userProfile.researchFocus, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveFocusTag = (tagToRemove: string) => {
    updateUserProfile({
      researchFocus: userProfile.researchFocus.filter(t => t !== tagToRemove)
    });
  };

  const handleSavePreferences = () => {
    updateUserPreferences({
      summaryLength,
      defaultCitation,
      defaultLandingPage,
      density,
      accentTheme,
      emailDailyDigest,
      highImpactAlerts,
      weeklyRoundup,
      webhookUrl
    });
  };

  const settingsTabs = [
    { id: 'profile' as const, label: 'User Profile', icon: User },
    { id: 'backend' as const, label: 'Backend & Claude AI', icon: Server },
    { id: 'interests' as const, label: 'Followed Interests', icon: Layers },
    { id: 'reading' as const, label: 'Reading Preferences', icon: Sliders },
    { id: 'notifications' as const, label: 'Notifications & Webhooks', icon: Bell },
    { id: 'display' as const, label: 'Display & Density', icon: Palette },
    { id: 'subscription' as const, label: 'Plan & Compute Quotas', icon: CreditCard }
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-indigo-600" />
            <span>Workspace & Account Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your personal profile, Anthropic Claude AI integration, RSS feeds, synthesis parameters, and quotas.
          </p>
        </div>
      </div>

      {/* 2. Settings Grid (Nav Tabs + Form Container) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Settings Navigation (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-2 space-y-1 shadow-xs">
          {settingsTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeSettingsTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveSettingsTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t.label}</span>
                {t.id === 'backend' && (
                  <span className={`ml-auto w-2 h-2 rounded-full ${isBackendOnline ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Tab Content (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          {/* TAB 1: USER PROFILE */}
          {activeSettingsTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {userProfile.avatarInitials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{userProfile.name}</h3>
                  <p className="text-xs text-slate-500">{userProfile.role} at {userProfile.organization}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Pro Plan • Enterprise Tier
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role / Title</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Firm</label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Research Focus Summary</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Research Focus Tags */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700">Custom Research Focus Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {userProfile.researchFocus.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFocusTag(t)}
                        className="text-indigo-400 hover:text-indigo-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add focus tag (e.g. Indic Voice Models)..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={handleAddFocusTag}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: BACKEND & CLAUDE AI INTEGRATIONS */}
          {activeSettingsTab === 'backend' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Backend & Anthropic Claude AI Engine</h3>
                <p className="text-xs text-slate-500">Live health diagnostic, Serverless API endpoints, and RSS ingestion status.</p>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Health Card */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Serverless Gateway</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {isBackendOnline ? 'Online (Vercel Serverless)' : 'Active (Local Dev)'}
                    </span>
                  </div>
                  <div className="text-base font-bold font-mono">
                    ContentHu API {backendHealth?.version || 'v2.0'}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Serverless TypeScript functions deployed directly on domain <strong className="text-white">contenthu.com/api</strong>.
                  </p>
                </div>

                {/* Claude Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white border border-indigo-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300">AI Intelligence Engine</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-900/80 text-indigo-200 border border-indigo-700">
                      Claude 3.5 Sonnet
                    </span>
                  </div>
                  <div className="text-base font-bold font-mono text-indigo-100 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-indigo-400" />
                    {backendHealth?.services?.aiEngine?.mode === 'live-api' ? 'Live API Key Connected' : 'Anthropic SDK Ready'}
                  </div>
                  <p className="text-[11px] text-indigo-200/80">
                    Powers deep research synthesis, executive briefings, and SWOT analysis.
                  </p>
                </div>
              </div>

              {/* RSS Ingestion Feeds */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-slate-900">Live Ingested Feed Sources (6 Active)</h4>
                  </div>
                  <button
                    onClick={() => refreshLiveFeeds(true)}
                    disabled={isSyncingFeeds}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncingFeeds ? 'animate-spin text-indigo-600' : ''}`} />
                    <span>{isSyncingFeeds ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { name: 'TechCrunch AI & Tech', url: 'techcrunch.com/feed', cat: 'Venture & AI' },
                    { name: 'The Verge Tech', url: 'theverge.com/rss', cat: 'Tech & Policy' },
                    { name: 'Hacker News Frontpage', url: 'ycombinator.com/rss', cat: 'Startups & Infra' },
                    { name: 'VentureBeat AI', url: 'venturebeat.com/ai', cat: 'Research' },
                    { name: 'Ars Technica', url: 'arstechnica.com/rss', cat: 'Cybersecurity' },
                    { name: 'Wired Business', url: 'wired.com/rss', cat: 'Macro Tech' }
                  ].map((f) => (
                    <div key={f.name} className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 block text-[11px]">{f.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{f.url}</span>
                      </div>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {f.cat}
                      </span>
                    </div>
                  ))}
                </div>

                {lastFeedSyncTime && (
                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1">
                    <span>Last Ingestion Sync: {lastFeedSyncTime}</span>
                    <span className="text-emerald-600 font-bold">Auto-polling every 5 mins</span>
                  </div>
                )}
              </div>

              {/* API Endpoints Catalog */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Serverless REST Endpoints Catalog</h4>
                <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden text-xs">
                  {[
                    { method: 'GET / POST', path: '/api/feeds', desc: 'Live RSS feeds ingestion & topic classification' },
                    { method: 'GET', path: '/api/articles', desc: 'Search, category filter, topic sort & pagination' },
                    { method: 'POST', path: '/api/research', desc: 'Claude 3.5 Sonnet deep research synthesis engine' },
                    { method: 'POST', path: '/api/briefing', desc: 'Executive morning & weekly briefing generator' },
                    { method: 'POST', path: '/api/summarize', desc: 'Article SWOT analysis & market impact breakdown' },
                    { method: 'GET', path: '/api/companies', desc: 'Tracked companies correlated with live news mentions' },
                    { method: 'GET', path: '/api/health', desc: 'Gateway diagnostic & service health status' }
                  ].map((ep) => (
                    <div key={ep.path} className="p-3 flex items-center justify-between gap-2 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px] shrink-0">
                          {ep.method}
                        </span>
                        <span className="font-bold text-slate-900 text-xs">{ep.path}</span>
                      </div>
                      <span className="text-slate-500 font-sans text-[11px] truncate">{ep.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Environment Variable Setup Guide */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-indigo-900 font-bold">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  <span>Anthropic API Key Configuration</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11.5px]">
                  To connect your private Anthropic API key, add <code className="px-1.5 py-0.5 rounded bg-white font-mono text-indigo-700 border border-indigo-200">ANTHROPIC_API_KEY=sk-ant-...</code> in your Vercel Project Settings under <strong className="font-semibold text-slate-800">Environment Variables</strong> or in a local <code className="px-1.5 py-0.5 rounded bg-white font-mono text-indigo-700 border border-indigo-200">.env</code> file.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: FOLLOWED INTERESTS */}
          {activeSettingsTab === 'interests' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Followed Intelligence Topics</h3>
                <p className="text-xs text-slate-500">Toggle topics to prioritize in your discover feed and automated briefings.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TOPIC_NODES.map((t) => {
                  const isFollowed = followedTopicIds.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleFollowTopic(t.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isFollowed
                          ? 'bg-indigo-50/70 border-indigo-300 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl ${t.bgColor} ${t.borderColor} border flex items-center justify-center font-bold text-xs ${t.color}`}>
                          {t.label.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{t.label}</span>
                          <span className="text-[10px] text-slate-500">{t.statLabel}</span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isFollowed ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isFollowed ? 'Following' : '+ Follow'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: READING PREFERENCES */}
          {activeSettingsTab === 'reading' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reading & Synthesis Preferences</h3>
                <p className="text-xs text-slate-500">Customize how intelligence dossiers and summaries are formatted.</p>
              </div>

              <div className="space-y-4">
                {/* Summary Length */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Summary Density</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Concise', 'Balanced', 'Comprehensive'] as const).map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setSummaryLength(len)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                          summaryLength === len
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default Citation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Citation Format</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['APA 7th', 'IEEE', 'Chicago', 'BibTeX'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setDefaultCitation(c)}
                        className={`py-2 px-2 text-center rounded-xl border text-xs font-semibold transition-all ${
                          defaultCitation === c
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default Landing Page */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Workspace Landing View</label>
                  <select
                    value={defaultLandingPage}
                    onChange={(e) => setDefaultLandingPage(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="discover">Discover Feed</option>
                    <option value="explore">Explore Clusters</option>
                    <option value="ai-research">AI Research Landscape</option>
                    <option value="monitor">Company Radar Monitor</option>
                    <option value="briefings">Executive Briefings Center</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Reading Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS & WEBHOOKS */}
          {activeSettingsTab === 'notifications' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Notifications & Webhook Integrations</h3>
                <p className="text-xs text-slate-500">Configure email delivery schedules and realtime webhook endpoints.</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Daily Morning Briefing Email</span>
                    <span className="text-[11px] text-slate-500">Delivers executive intelligence digest to your inbox at 08:30 AM</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDailyDigest}
                    onChange={(e) => setEmailDailyDigest(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">High Impact Venture & Policy Alerts</span>
                    <span className="text-[11px] text-slate-500">Immediate notifications for $10M+ rounds, breakthrough preprints, and GPU quotas</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={highImpactAlerts}
                    onChange={(e) => setHighImpactAlerts(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Weekly Macro Ecosystem Roundup</span>
                    <span className="text-[11px] text-slate-500">Weekly PDF executive synthesis report sent every Monday morning</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyRoundup}
                    onChange={(e) => setWeeklyRoundup(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </label>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700">Slack / Discord Webhook URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    onClick={() => showToast('Dispatched test webhook payload')}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                  >
                    Test Webhook
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notification Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: DISPLAY */}
          {activeSettingsTab === 'display' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Display & Interface Theme</h3>
                <p className="text-xs text-slate-500">Control information density and visual accents.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Information Density</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'comfortable' as const, label: 'Comfortable' },
                      { id: 'compact' as const, label: 'Compact' }
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDensity(d.id)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          density === d.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Accent Color Palette</label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                    {[
                      { id: 'Indigo (Default)', label: 'Indigo / Violet', color: 'from-indigo-600 to-violet-600' },
                      { id: 'Emerald Teal', label: 'Emerald / Teal', color: 'from-emerald-600 to-teal-600' },
                      { id: 'Cyan Sky', label: 'Cyan / Sky', color: 'from-cyan-600 to-blue-600' }
                    ].map((thm) => (
                      <button
                        key={thm.id}
                        type="button"
                        onClick={() => setAccentTheme(thm.id as any)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                          accentTheme === thm.id
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-500'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${thm.color}`} />
                        <span className="truncate">{thm.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Apply Display Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: SUBSCRIPTION & PLAN */}
          {activeSettingsTab === 'subscription' && (
            <div className="space-y-6">
              {/* Pro Plan Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B1120] via-indigo-950 to-[#1E1B4B] text-white space-y-4 border border-indigo-500/30 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400">
                      <Zap className="w-5 h-5 fill-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">ContentHu Pro Enterprise Plan</h3>
                      <span className="text-xs text-indigo-300">Active • Renews Nov 01, 2026</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Active Subscription
                  </span>
                </div>

                {/* Quota Progress */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-indigo-200 font-mono">
                    <span>Claude 3.5 Sonnet Synthesis Quota</span>
                    <strong>168 / 200 Queries Used (84%)</strong>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full rounded-full w-[84%]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-indigo-100">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-slate-400 block font-mono text-[10px]">RSS INGESTION</span>
                    <span className="font-bold text-white">6 Live Feeds</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-slate-400 block font-mono text-[10px]">AI MODEL</span>
                    <span className="font-bold text-emerald-300">Claude 3.5 Sonnet</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-slate-400 block font-mono text-[10px]">API EXPORTS</span>
                    <span className="font-bold text-white">Unlimited</span>
                  </div>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recent Billing Invoices
                </h4>
                <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden text-xs">
                  <div className="p-3.5 flex items-center justify-between font-mono">
                    <div>
                      <span className="font-bold text-slate-900 block">Invoice #INV-2026-10</span>
                      <span className="text-slate-400 text-[11px]">Oct 01, 2026 • Pro Annual</span>
                    </div>
                    <span className="text-emerald-600 font-bold">$49.00 Paid</span>
                  </div>
                  <div className="p-3.5 flex items-center justify-between font-mono">
                    <div>
                      <span className="font-bold text-slate-900 block">Invoice #INV-2026-09</span>
                      <span className="text-slate-400 text-[11px]">Sep 01, 2026 • Pro Annual</span>
                    </div>
                    <span className="text-emerald-600 font-bold">$49.00 Paid</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
