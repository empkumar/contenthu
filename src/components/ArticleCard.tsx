import React, { useState } from 'react';
import { 
  Bookmark, 
  Share2, 
  Clock, 
  CheckCircle, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import type { Article } from '../data/mockData';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  onBookmarkToggle: (id: string) => void;
  isBookmarked: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  onBookmarkToggle,
  isBookmarked
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmarkToggle(article.id);
  };

  return (
    <div 
      onClick={() => onSelectArticle(article)}
      className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer text-left"
    >
      {/* Thumbnail Area */}
      <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-slate-100">
        <img 
          src={article.thumbnail} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider shadow-xs border ${article.badgeBg}`}>
            {article.badgeText}
          </span>
        </div>

        {/* Action icons (Bookmark & Share) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          <button
            type="button"
            onClick={handleShare}
            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all shadow-xs"
            title={copied ? 'Link copied!' : 'Share article'}
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            onClick={handleBookmark}
            className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-xs ${
              isBookmarked 
                ? 'bg-indigo-600 text-white' 
                : 'bg-black/40 hover:bg-black/70 text-white'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Relevance Score Pill */}
        <div className="absolute bottom-2 left-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-mono">
          <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
          <span>{article.relevanceScore}% match</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Publisher and Date */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <div className="flex items-center gap-1.5 truncate">
              <span className={`w-2 h-2 rounded-full ${article.publisher.avatarBg}`} />
              <span className="font-semibold text-slate-700 truncate">
                {article.publisher.name}
              </span>
              {article.publisher.verified && (
                <CheckCircle className="w-3 h-3 text-indigo-600 shrink-0" />
              )}
            </div>
            <span className="shrink-0 text-slate-400 font-mono text-[10px]">
              {article.publishedAt}
            </span>
          </div>

          {/* Headline */}
          <h3 className="font-bold text-[13.5px] leading-snug text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Short Description */}
          <p className="mt-1.5 text-slate-500 text-[12px] leading-relaxed line-clamp-2">
            {article.description}
          </p>
        </div>

        {/* Card Footer: Read time & Tags */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[10.5px]">
            <Clock className="w-3 h-3" />
            <span>{article.readTime}</span>
          </div>

          <div className="flex items-center gap-1 text-indigo-600 font-semibold text-[11px] group-hover:translate-x-0.5 transition-transform">
            <span>Read synthesis</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
