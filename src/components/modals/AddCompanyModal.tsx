import React, { useState } from 'react';
import { X, Building2, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose }) => {
  const { addTrackedCompany } = useApp();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [keyProduct, setKeyProduct] = useState('');
  const [funding, setFunding] = useState('');
  const [location, setLocation] = useState('Bengaluru, India');
  const [sentiment, setSentiment] = useState<'Bullish' | 'Neutral' | 'Rapid Growth'>('Rapid Growth');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const initials = name
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AI';

    const colorGradients = [
      'bg-indigo-600',
      'bg-violet-600',
      'bg-emerald-600',
      'bg-blue-600',
      'bg-amber-600',
      'bg-rose-600'
    ];
    const logoBg = colorGradients[Math.floor(Math.random() * colorGradients.length)];

    addTrackedCompany({
      name: name.trim(),
      category: category.trim() || 'AI Agent Infrastructure',
      stage: 'Seed / Early Stage',
      funding: funding.trim() || 'Undisclosed Seed',
      location,
      founded: '2025',
      keyProduct: keyProduct.trim() || 'Autonomous Agent Swarm Platform',
      status: 'Active',
      recentMentions: Math.floor(Math.random() * 30) + 12,
      sentiment,
      alertsActive: true,
      logoBg,
      initials,
      description: `Target subject added for real-time monitoring across Indian tech news, GitHub preprints, and venture filings.`,
      latestEvent: `Added to Intelligence Monitor on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`
    });

    onClose();
    setName('');
    setCategory('');
    setKeyProduct('');
    setFunding('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Track New Company or Subject</h3>
              <p className="text-xs text-slate-500">Add an entity to receive real-time intelligence feeds & alerts</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Company / Entity Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., BharatGen AI, DevRev, Composio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category / Sector
              </label>
              <input
                type="text"
                placeholder="e.g., Indic Voice SLMs"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Headquarters
              </label>
              <input
                type="text"
                placeholder="e.g., Bengaluru, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Key Product / Architecture
              </label>
              <input
                type="text"
                placeholder="e.g., Streaming Acoustic Tokenizer"
                value={keyProduct}
                onChange={(e) => setKeyProduct(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Funding / Round
              </label>
              <input
                type="text"
                placeholder="e.g., $15M Series A"
                value={funding}
                onChange={(e) => setFunding(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Market Sentiment Tag
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Rapid Growth', 'Bullish', 'Neutral'] as const).map((sent) => (
                <button
                  type="button"
                  key={sent}
                  onClick={() => setSentiment(sent)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    sentiment === sent
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sent}
                </button>
              ))}
            </div>
          </div>

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
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-900/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Start Tracking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
