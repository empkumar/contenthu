import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  CheckCircle, 
  Play, 
  Pause, 
  Volume2, 
  ExternalLink, 
  Sparkles, 
  Share2, 
  BookOpen,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BriefingsView: React.FC = () => {
  const { 
    briefings, 
    setIsBriefingModalOpen, 
    openArticleModal, 
    articles,
    showToast 
  } = useApp();

  const [selectedBriefingId, setSelectedBriefingId] = useState<string>(briefings[0]?.id || 'br-1');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activeBriefing = briefings.find(b => b.id === selectedBriefingId) || briefings[0];

  const handleDownload = (type: 'pdf' | 'md') => {
    showToast(`Exported briefing as ${type.toUpperCase()}`);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    showToast('Copied briefing share link to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCitationClick = (articleId?: string) => {
    if (articleId) {
      const art = articles.find(a => a.id === articleId);
      if (art) openArticleModal(art);
    } else {
      showToast('Opening cited publisher source');
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      {/* 1. Header & Generate Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Executive AI Briefings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
              Multi-Agent Synthesis
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Automated daily, weekly, and topic-specific intelligence dossiers with verified source citations.
          </p>
        </div>

        <button
          onClick={() => setIsBriefingModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-900/20 flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Briefing</span>
        </button>
      </div>

      {/* 2. Briefings Layout: Left List + Right Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Briefings List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Generated Briefings ({briefings.length})
            </span>
            <span className="text-[11px] font-mono text-indigo-600 font-semibold">Auto-Updated</span>
          </div>

          <div className="space-y-2.5">
            {briefings.map((b) => {
              const isSelected = selectedBriefingId === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBriefingId(b.id);
                    setIsPlayingAudio(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.type === 'daily' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      b.type === 'weekly' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}>
                      {b.type} briefing
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{b.date}</span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {b.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    <span className="font-mono">{b.sourcesCount} sources</span>
                    <span>{b.readTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Briefing Reader View (8 Cols) */}
        {activeBriefing && (
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Header with Title & Audio Player */}
            <div className="space-y-4 pb-6 border-b border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activeBriefing.type.toUpperCase()} INTELLIGENCE DOSSIER
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                    title="Share briefing"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                  {activeBriefing.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {activeBriefing.subtitle}
                </p>
              </div>

              {/* Audio Synthesis Bar */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-[#1E1B4B] text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md transition-all shrink-0"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{isPlayingAudio ? 'Playing AI Voice Briefing...' : 'Listen to Audio Synthesis'}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Generated via ContentHu TTS • Duration: {activeBriefing.audioDuration}
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1">
                  <span className={`w-1 h-3 rounded-full bg-indigo-400 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  <span className={`w-1 h-5 rounded-full bg-violet-400 ${isPlayingAudio ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.1s' }} />
                  <span className={`w-1 h-4 rounded-full bg-indigo-400 ${isPlayingAudio ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.2s' }} />
                  <span className={`w-1 h-6 rounded-full bg-emerald-400 ${isPlayingAudio ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.3s' }} />
                  <span className={`w-1 h-3 rounded-full bg-indigo-400 ${isPlayingAudio ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>

            {/* Executive Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50 border border-indigo-100">
              <div className="flex items-center gap-2 mb-1.5 text-indigo-950 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Executive Summary</span>
              </div>
              <p className="text-xs text-indigo-950/90 leading-relaxed font-medium">
                {activeBriefing.summary}
              </p>
            </div>

            {/* Structured Chapters */}
            <div className="space-y-6">
              {activeBriefing.chapters.map((chapter, idx) => (
                <div key={idx} className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {chapter.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {chapter.content}
                  </p>

                  {/* Bullet Key Points */}
                  <div className="space-y-1.5 pt-1">
                    {chapter.keyPoints.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  {/* Source Citations */}
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">
                      Verified Citations:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {chapter.citations.map((cite, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleCitationClick(cite.articleId)}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-[11px] text-slate-700 hover:text-indigo-700 transition-colors flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3 h-3 text-indigo-500" />
                          <span className="font-semibold truncate max-w-[220px]">{cite.title}</span>
                          <span className="text-slate-400 font-mono">({cite.publisher})</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
