import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Sliders, 
  Bell, 
  Palette, 
  CreditCard, 
  Zap, 
  Check, 
  Plus, 
  Layers, 
  Save
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
    showToast
  } = useApp();

  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'interests' | 'reading' | 'notifications' | 'display' | 'subscription'>('profile');

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
  const [webhookUrl, setWebhookUrl] = useState(userPreferences.webhookUrl);

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
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'interests', label: 'Followed Interests', icon: Layers },
    { id: 'reading', label: 'Reading Preferences', icon: Sliders },
    { id: 'notifications', label: 'Notifications & Webhooks', icon: Bell },
    { id: 'display', label: 'Display & Density', icon: Palette },
    { id: 'subscription', label: 'Plan & Compute Quotas', icon: CreditCard }
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
            Manage your personal profile, synthesis parameters, followed topics, notifications, and subscription quotas.
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
                onClick={() => setActiveSettingsTab(t.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Column: Settings Panel (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* TAB 1: PROFILE */}
          {activeSettingsTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {userProfile.avatarInitials}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{userProfile.name}</h3>
                  <span className="text-xs text-slate-500">{userProfile.role} • {userProfile.organization}</span>
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
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Job Title / Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organization</label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bio & Research Statement</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
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

          {/* TAB 2: FOLLOWED INTERESTS */}
          {activeSettingsTab === 'interests' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Custom Research Focus Tags</h3>
                <p className="text-xs text-slate-500">Keywords used by ContentHu Core to tailor Discover recommendations.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add custom keyword (e.g. Indic SLMs, GPU Kernel)..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFocusTag(); } }}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  onClick={handleAddFocusTag}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tag</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {userProfile.researchFocus.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center gap-2"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveFocusTag(tag)}
                      className="text-indigo-400 hover:text-indigo-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Followed Macro Clusters</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TOPIC_NODES.map((node) => {
                    const isFollowed = followedTopicIds.includes(node.id);
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => toggleFollowTopic(node.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                          isFollowed
                            ? 'bg-indigo-50/80 border-indigo-300 text-indigo-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{node.label}</span>
                        {isFollowed ? <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> : <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: READING PREFERENCES */}
          {activeSettingsTab === 'reading' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Synthesis & Reader Customization</h3>
                <p className="text-xs text-slate-500">Configure default AI model synthesis density and citation outputs.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">AI Summary Output Length</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Concise', 'Balanced', 'Comprehensive'] as const).map((len) => (
                      <button
                        key={len}
                        onClick={() => setSummaryLength(len)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          summaryLength === len
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Citation Style</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['APA 7th', 'IEEE', 'Chicago', 'BibTeX'] as const).map((cit) => (
                      <button
                        key={cit}
                        onClick={() => setDefaultCitation(cit)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          defaultCitation === cit
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {cit}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Landing Screen</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['discover', 'ai-research', 'explore', 'monitor'] as const).map((page) => (
                      <button
                        key={page}
                        onClick={() => setDefaultLandingPage(page)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border capitalize transition-all ${
                          defaultLandingPage === page
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {page.replace('-', ' ')}
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
                  <span>Save Reading Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS & WEBHOOKS */}
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
                    <span className="text-[11px] text-slate-500">Delivers executive intelligence digest to your inbox at 08:30 AM IST</span>
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

          {/* TAB 5: DISPLAY */}
          {activeSettingsTab === 'display' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Display & Interface Theme</h3>
                <p className="text-xs text-slate-500">Customize card density, layout spacing, and visual accent palette.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Information Density</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDensity('comfortable')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        density === 'comfortable'
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-bold block">Comfortable View</span>
                      <span className="text-[11px] text-slate-500">Spacious cards with rich takeaways and thumbnails.</span>
                    </button>

                    <button
                      onClick={() => setDensity('compact')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        density === 'compact'
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-bold block">Compact Grid</span>
                      <span className="text-[11px] text-slate-500">High-density research list for rapid power-skimming.</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Visual Accent Theme</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'indigo-violet', label: 'Indigo / Violet', color: 'from-indigo-600 to-violet-600' },
                      { id: 'emerald', label: 'Emerald Glow', color: 'from-emerald-500 to-teal-600' },
                      { id: 'cyan', label: 'Cyber Cyan', color: 'from-cyan-500 to-blue-600' },
                      { id: 'amber', label: 'Amber Horizon', color: 'from-amber-500 to-orange-600' }
                    ].map((thm) => (
                      <button
                        key={thm.id}
                        onClick={() => setAccentTheme(thm.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                          accentTheme === thm.id
                            ? 'bg-slate-50 border-indigo-500 text-slate-900 font-bold ring-2 ring-indigo-500/10'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
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

          {/* TAB 6: SUBSCRIPTION & PLAN */}
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
                    <span>Deep Multi-Agent Synthesis Quota</span>
                    <strong>168 / 200 Queries Used (84%)</strong>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 h-full rounded-full w-[84%]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-indigo-100">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-slate-400 block font-mono text-[10px]">CRAWLER NODES</span>
                    <span className="font-bold text-white">64 Dedicated</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-slate-400 block font-mono text-[10px]">INDIAAI GPU ACCESS</span>
                    <span className="font-bold text-emerald-300">Connected</span>
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
