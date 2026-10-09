import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Bookmark, 
  ExternalLink, 
  Check,
  Layers,
  BookOpen,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AddToCollectionModal } from './modals/AddToCollectionModal';
import { CreateCollectionModal } from './modals/CreateCollectionModal';
import type { Article } from '../data/mockData';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onBookmarkToggle
}) => {
  const { openArticleDetail, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isCreateColModalOpen, setIsCreateColModalOpen] = useState(false);

  if (!article) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    showToast('Copied article link to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFullDetailClick = () => {
    openArticleDetail(article);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with image */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900 shrink-0">
            <img 
              src={article.thumbnail} 
              alt={article.title}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/50 to-transparent" />

            {/* Top Close & Full Reader Action */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <button
                onClick={handleFullDetailClick}
                className="px-2.5 py-1 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white backdrop-blur-md transition-all text-xs font-bold flex items-center gap-1 shadow-md"
                title="Open Dedicated Full Page Reader"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Full Reader</span>
              </button>
              
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Badge & Publisher */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border shadow-xs ${article.badgeBg}`}>
                {article.badgeText}
              </span>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                <span className={`w-2.5 h-2.5 rounded-full ${article.publisher.avatarBg}`} />
                <span className="font-semibold">{article.publisher.name}</span>
                <span>•</span>
                <span className="text-slate-300 font-mono">{article.publishedAt}</span>
              </div>
            </div>
          </div>

          {/* Scrollable Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-left">
            {/* Attribution note */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate">
                Source: <strong className="text-slate-700">{article.publisher.name}</strong> ({article.publisher.domain})
              </span>
              {article.originalUrl && (
                <a
                  href={article.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Publisher Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                {article.title}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                {article.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Takeaway Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-violet-50 border border-indigo-100">
              <div className="flex items-center gap-2 mb-1 text-indigo-950 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Synthesized Key Takeaway</span>
              </div>
              <p className="text-xs text-indigo-900/90 leading-relaxed font-medium">
                {article.keyTakeaway}
              </p>
            </div>

            {/* Metrics Grid if available */}
            {article.metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {article.metrics.map((m) => (
                  <div key={m.label} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                      {m.label}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-mono mt-0.5 block">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Summary & Content breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Executive Synthesis
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {article.description}
              </p>

              {article.contentSections && article.contentSections.map((sec, idx) => (
                <div key={idx} className="space-y-1 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800">{sec.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{sec.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onBookmarkToggle(article.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isBookmarked
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Saved to Library' : 'Save Article'}</span>
              </button>

              <button
                onClick={() => setIsCollectionModalOpen(true)}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>Add to Collection</span>
              </button>

              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Share link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFullDetailClick}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-900/20 flex items-center gap-1.5 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Full Page View</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add To Collection Modal */}
      <AddToCollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        article={article}
        onCreateNewCollection={() => {
          setIsCollectionModalOpen(false);
          setIsCreateColModalOpen(true);
        }}
      />

      {/* Create Collection Modal */}
      <CreateCollectionModal
        isOpen={isCreateColModalOpen}
        onClose={() => setIsCreateColModalOpen(false)}
      />
    </>
  );
};
