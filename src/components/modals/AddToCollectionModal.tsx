import React from 'react';
import { X, Layers, Plus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Article } from '../../data/mockData';

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  onCreateNewCollection: () => void;
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({
  isOpen,
  onClose,
  article,
  onCreateNewCollection
}) => {
  const { collections, addArticleToCollection, removeArticleFromCollection } = useApp();

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add to Collection</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{article.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
          {collections.map((col) => {
            const isIncluded = col.articleIds.includes(article.id);
            return (
              <div
                key={col.id}
                onClick={() => {
                  if (isIncluded) {
                    removeArticleFromCollection(col.id, article.id);
                  } else {
                    addArticleToCollection(col.id, article.id);
                  }
                }}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isIncluded
                    ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-semibold'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${col.color} shrink-0`} />
                  <div className="truncate">
                    <span className="text-xs font-bold block truncate">{col.name}</span>
                    <span className="text-[10px] text-slate-500">{col.articleIds.length} items</span>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                  isIncluded ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isIncluded && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onCreateNewCollection();
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Collection</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
