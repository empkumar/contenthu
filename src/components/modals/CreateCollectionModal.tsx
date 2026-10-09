import React, { useState } from 'react';
import { X, Layers, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({ isOpen, onClose }) => {
  const { addCollection } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('from-indigo-500 to-violet-600');

  if (!isOpen) return null;

  const colorOptions = [
    { label: 'Indigo / Violet', value: 'from-indigo-500 to-violet-600' },
    { label: 'Emerald / Teal', value: 'from-emerald-500 to-teal-600' },
    { label: 'Purple / Pink', value: 'from-purple-500 to-pink-600' },
    { label: 'Cyan / Blue', value: 'from-cyan-500 to-blue-600' },
    { label: 'Amber / Orange', value: 'from-amber-500 to-orange-600' },
    { label: 'Rose / Red', value: 'from-rose-500 to-red-600' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCollection({
      name: name.trim(),
      description: description.trim() || 'Custom curated research collection in workspace.',
      color: selectedColor
    });

    onClose();
    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create New Collection</h3>
              <p className="text-xs text-slate-500">Group articles and research findings into folders</p>
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
              Collection Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Indic Voice Models 2026, Q3 Seed Rounds"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of what this research collection contains..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Color Accent
            </label>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setSelectedColor(c.value)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs font-semibold transition-all ${
                    selectedColor === c.value
                      ? 'bg-slate-50 border-indigo-500 ring-2 ring-indigo-500/20 text-slate-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${c.value} shrink-0`} />
                  <span className="truncate text-[11px]">{c.label.split('/')[0]}</span>
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
              <span>Create Collection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
