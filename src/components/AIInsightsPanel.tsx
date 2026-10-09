import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Building2, 
  Scale, 
  Bell, 
  Check, 
  ChevronRight, 
  HelpCircle, 
  FileCheck2
} from 'lucide-react';
import { KEY_FINDINGS, RELATED_QUESTIONS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface AIInsightsPanelProps {
  onQuestionClick: (query: string) => void;
  selectedTopicLabel?: string;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  onQuestionClick,
  selectedTopicLabel
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeFrequency, setActiveFrequency] = useState<'daily' | 'weekly'>('daily');
  const [expandedFinding, setExpandedFinding] = useState<string | null>('01');

  const handleFollowToggle = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    if (nextState) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8, x: 0.85 }
      });
    }
  };

  return (
    <aside className="w-full space-y-4 text-left">
      {/* 1. AI Overview Card */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-4 md:p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Card Header with Model Label */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                AI Synthesis Overview
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ContentHu Core v4.2
              </span>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Model
          </span>
        </div>

        {/* Synthesis Body */}
        <div>
          <h3 className="text-[13.5px] font-bold text-slate-900 mb-2 leading-snug">
            {selectedTopicLabel 
              ? `Strategic Intelligence: ${selectedTopicLabel}` 
              : 'AI Agent Ecosystem in Indian Startups: 2026 Intelligence Brief'}
          </h3>
          <p className="text-[12px] text-slate-600 leading-relaxed">
            India&apos;s generative AI and autonomous agent landscape is experiencing exponential acceleration, pivoting from conversational chatbots to autonomous workflow agents across enterprise SaaS, vernacular voice interfaces, and developer infrastructure.
          </p>
        </div>

        {/* 4 Research Statistics Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
              <FileCheck2 className="w-3 h-3 text-indigo-500" />
              <span>Sources</span>
            </div>
            <div className="text-sm font-bold text-slate-900 font-mono">
              142 <span className="text-[10px] text-emerald-600 font-sans font-medium">+18% wk</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
              <Layers className="w-3 h-3 text-violet-500" />
              <span>Key Themes</span>
            </div>
            <div className="text-sm font-bold text-slate-900 font-mono">
              18 <span className="text-[10px] text-slate-400 font-sans font-normal">clusters</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
              <Building2 className="w-3 h-3 text-blue-500" />
              <span>Companies</span>
            </div>
            <div className="text-sm font-bold text-slate-900 font-mono">
              54 <span className="text-[10px] text-slate-400 font-sans font-normal">tracked</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
              <Scale className="w-3 h-3 text-amber-500" />
              <span>Viewpoints</span>
            </div>
            <div className="text-sm font-bold text-slate-900 font-mono">
              12 <span className="text-[10px] text-slate-400 font-sans font-normal">contrasting</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Findings Card */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-4 md:p-5">
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Key Strategic Findings (5)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Synthesized</span>
        </div>

        {/* 5 Numbered Findings */}
        <div className="space-y-2.5">
          {KEY_FINDINGS.map((finding) => {
            const isExpanded = expandedFinding === finding.number;
            return (
              <div
                key={finding.number}
                onClick={() => setExpandedFinding(isExpanded ? null : finding.number)}
                className={`
                  p-2.5 rounded-xl border transition-all duration-200 cursor-pointer
                  ${isExpanded
                    ? 'bg-indigo-50/60 border-indigo-200 ring-1 ring-indigo-200'
                    : 'bg-slate-50/70 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {finding.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-[12px] font-bold text-slate-800 leading-tight">
                        {finding.title}
                      </h4>
                    </div>
                    
                    <p className={`text-[11.5px] text-slate-600 leading-relaxed ${isExpanded ? 'block' : 'line-clamp-2'}`}>
                      {finding.summary}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className={`px-1.5 py-0.2 rounded font-semibold border ${finding.impactColor}`}>
                        {finding.impactTag}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {finding.sourceCount} sources cited
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Related Research Questions */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-4 md:p-5">
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Related Research Questions
            </h3>
          </div>
          <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer">5 questions</span>
        </div>

        <div className="space-y-1.5">
          {RELATED_QUESTIONS.map((q) => (
            <button
              key={q.id}
              onClick={() => onQuestionClick(q.query)}
              className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-100 hover:border-indigo-200 transition-all group flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-3 h-3 text-indigo-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-[11.5px] font-medium text-slate-700 group-hover:text-indigo-900 line-clamp-1">
                  {q.query}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. Follow Topic Card */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-[#1E1B4B] to-slate-900 text-white p-4.5 border border-indigo-500/30 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
            <Bell className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white leading-tight">
              Follow Topic Intelligence
            </h4>
            <span className="text-[10px] text-indigo-200">
              Automated briefings & alerts
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
          Get real-time updates when new breakthrough models, venture funding rounds, or policy changes occur.
        </p>

        {/* Frequency selector */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/30 rounded-xl mb-3 border border-white/10">
          <button
            onClick={() => setActiveFrequency('daily')}
            className={`py-1 rounded-lg text-[10px] font-semibold transition-all ${
              activeFrequency === 'daily'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily Briefing
          </button>
          <button
            onClick={() => setActiveFrequency('weekly')}
            className={`py-1 rounded-lg text-[10px] font-semibold transition-all ${
              activeFrequency === 'weekly'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly Digest
          </button>
        </div>

        {/* Follow Button */}
        <button
          onClick={handleFollowToggle}
          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${
            isFollowing
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
              : 'bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white shadow-indigo-900/40'
          }`}
        >
          {isFollowing ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Following Topic Alerts</span>
            </>
          ) : (
            <>
              <Bell className="w-3.5 h-3.5" />
              <span>Follow This Topic</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
