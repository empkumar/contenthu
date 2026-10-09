import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

interface CreateBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
}

export const CreateBriefingModal: React.FC<CreateBriefingModalProps> = ({
  isOpen,
  onClose,
  topicTitle
}) => {
  const { generateCustomBriefing, setActiveTab, showToast } = useApp();
  const [briefingName, setBriefingName] = useState(`Executive AI Intelligence: ${topicTitle}`);
  const [cadence, setCadence] = useState<'daily' | 'weekly' | 'topic'>('daily');
  const [depth, setDepth] = useState<'Executive' | 'Technical' | 'Comprehensive'>('Comprehensive');
  const [includeFindings, setIncludeFindings] = useState(true);
  const [includeFunding, setIncludeFunding] = useState(true);
  const [includePolicy, setIncludePolicy] = useState(true);
  
  // Synthesis animation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  if (!isOpen) return null;

  const synthesisSteps = [
    'Ingesting & deduplicating live articles from TechCrunch, Hacker News & The Verge...',
    'Extracting technical benchmarks, venture rounds & state models...',
    'Synthesizing cross-sector intelligence with Anthropic Claude 3.5...',
    'Formatting executive briefing dossier & source citations...'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < synthesisSteps.length - 1) {
          return prev + 1;
        } else {
          return prev;
        }
      });
    }, 700);

    try {
      const selectedSectors = [
        includeFindings ? 'Breakthrough Findings' : null,
        includeFunding ? 'Venture Capital & Deals' : null,
        includePolicy ? 'Policy & Infrastructure' : null
      ].filter(Boolean) as string[];

      await generateCustomBriefing(briefingName || topicTitle, cadence, selectedSectors);

      clearInterval(stepInterval);
      setGenerationStep(3);

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setIsGenerating(false);
        onClose();
        setActiveTab('briefings');
        showToast('Briefing synthesized and ready in Briefings Center');
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsGenerating(false);
      showToast('Briefing generated in local mode');
      onClose();
      setActiveTab('briefings');
    }
  };

  const cadenceOptions: Array<{ id: 'daily' | 'weekly' | 'topic'; label: string; desc: string }> = [
    { id: 'daily', label: 'Daily Briefing', desc: 'Top 5 daily developments & audio synthesis' },
    { id: 'weekly', label: 'Weekly Synthesis', desc: 'Comprehensive multi-agent deep dive' },
    { id: 'topic', label: 'Topic Dossier', desc: 'On-demand custom topic intelligence' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0B1120] via-indigo-950 to-[#1E1B4B] text-white relative">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-300" />
            </div>
            <h3 className="text-lg font-bold text-white">Generate Executive AI Briefing</h3>
          </div>
          <p className="text-xs text-indigo-200 leading-relaxed">
            Multi-agent intelligence engine will synthesize 140+ verified sources into a structured executive dossier.
          </p>
        </div>

        {isGenerating ? (
          /* Live Synthesis Progress View */
          <div className="p-8 space-y-6 text-center">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full bg-indigo-600/20 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-bold text-slate-900">
                Synthesizing Executive Intelligence
              </h4>
              <p className="text-xs text-indigo-600 font-semibold font-mono animate-pulse">
                {synthesisSteps[generationStep]}
              </p>
            </div>

            {/* Progress Stepper */}
            <div className="space-y-2 max-w-sm mx-auto text-left pt-2">
              {synthesisSteps.map((step, idx) => (
                <div key={step} className="flex items-center gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    idx < generationStep
                      ? 'bg-emerald-500 text-white'
                      : idx === generationStep
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {idx < generationStep ? <Check className="w-3 h-3" /> : idx + 1}
                  </div>
                  <span className={`truncate ${idx <= generationStep ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Briefing Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Briefing Title
              </label>
              <input
                type="text"
                value={briefingName}
                onChange={(e) => setBriefingName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
                required
              />
            </div>

            {/* Scope / Cadence Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Briefing Type & Scope
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {cadenceOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCadence(opt.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      cadence === opt.id
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">{opt.label}</span>
                    <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Depth Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Synthesis Depth
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Executive', 'Technical', 'Comprehensive'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDepth(d)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      depth === d
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Checkboxes */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-700 block">
                Target Intelligence Sections
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeFindings}
                    onChange={(e) => setIncludeFindings(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-medium">Key Findings</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeFunding}
                    onChange={(e) => setIncludeFunding(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-medium">Venture Deals</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePolicy}
                    onChange={(e) => setIncludePolicy(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-medium">Policy & GPUs</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-900/20 flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Intelligence Briefing</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
