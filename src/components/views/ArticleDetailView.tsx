import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  Layers, 
  FileText, 
  Copy,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AddToCollectionModal } from '../modals/AddToCollectionModal';
import { CreateCollectionModal } from '../modals/CreateCollectionModal';
import { ArticleCard } from '../ArticleCard';

export const ArticleDetailView: React.FC = () => {
  const { 
    selectedArticle, 
    articles, 
    bookmarkedIds, 
    toggleBookmark, 
    setActiveTab, 
    navigateToTopicResearch,
    openArticleModal,
    showToast 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [citationFormat, setCitationFormat] = useState<'APA' | 'IEEE' | 'BibTeX'>('APA');
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isCreateColModalOpen, setIsCreateColModalOpen] = useState(false);

  const article = selectedArticle || articles[0];
  const isBookmarked = bookmarkedIds.has(article.id);

  // Related articles in the same topic or category
  const relatedArticles = articles
    .filter(a => a.id !== article.id && (a.topicId === article.topicId || a.category === article.category))
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    showToast('Copied article share link');
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCitation = () => {
    const year = '2026';
    if (citationFormat === 'APA') {
      return `${article.author || article.publisher.name}. (${year}). ${article.title}. ${article.publisher.name}. Retrieved from ${article.originalUrl || `https://${article.publisher.domain}`}`;
    }
    if (citationFormat === 'IEEE') {
      return `[1] ${article.author || article.publisher.name}, "${article.title}," ${article.publisher.name}, ${article.publishedAt}, ${year}. [Online]. Available: ${article.originalUrl || article.publisher.domain}.`;
    }
    return `@article{${article.id}_${year},\n  title={${article.title}},\n  author={${article.author || article.publisher.name}},\n  journal={${article.publisher.name}},\n  year={${year}},\n  url={${article.originalUrl || article.publisher.domain}}\n}`;
  };

  const handleCopyCitation = () => {
    navigator.clipboard?.writeText(generateCitation());
    showToast(`Copied ${citationFormat} citation to clipboard`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left animate-in fade-in duration-200 pb-16">
      {/* 1. Back Navigation & Action Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ai-research')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AI Research Workspace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleBookmark(article.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isBookmarked
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'Saved to Library' : 'Save Article'}</span>
          </button>

          <button
            onClick={() => setIsCollectionModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Add to Collection</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Share"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Mandatory Attribution & Source Verification Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <span className="text-xs font-bold block">Verified Original Publisher Attribution</span>
            <p className="text-[11px] text-amber-900/90">
              Curated & Synthesized via ContentHu Core from <strong className="font-semibold">{article.publisher.name}</strong> ({article.publisher.domain}). Original content rights belong exclusively to the publisher.
            </p>
          </div>
        </div>

        {article.originalUrl && (
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-amber-900 text-white rounded-xl text-xs font-bold hover:bg-amber-800 transition-colors flex items-center gap-1 shrink-0 self-start sm:self-auto"
          >
            <span>Visit Publisher Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* 3. Hero Article Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold uppercase tracking-wider border ${article.badgeBg}`}>
            {article.badgeText}
          </span>
          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            {article.relevanceScore}% Relevance Score
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Author, Publisher, Date Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-4 border-b border-slate-200 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${article.publisher.avatarBg}`} />
            <span className="font-bold text-slate-800">{article.publisher.name}</span>
            {article.publisher.verified && <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />}
            <span>•</span>
            <span>{article.author || 'Editorial Staff'}</span>
            <span>•</span>
            <span className="font-mono">{article.publishedAt}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>

      {/* 4. Article Thumbnail Hero */}
      <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden shadow-md">
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-6 right-6 flex flex-wrap gap-1.5">
          {article.tags.map((t) => (
            <button
              key={t}
              onClick={() => navigateToTopicResearch('use-cases', t)}
              className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition-colors"
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Key Takeaway Synthesized Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-violet-50 border border-indigo-100 space-y-2">
        <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Synthesized Key Takeaway</span>
        </div>
        <p className="text-xs sm:text-sm text-indigo-950/90 leading-relaxed font-medium">
          {article.keyTakeaway}
        </p>
      </div>

      {/* 6. Key Metrics Grid if present */}
      {article.metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {article.metrics.map((m) => (
            <div key={m.label} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                {m.label}
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-900 font-mono mt-1 block">
                {m.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 7. Structured Article Content */}
      <article className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
            Overview & Context
          </h2>
          <p className="leading-relaxed text-slate-600 text-xs sm:text-sm">
            {article.description}
          </p>
        </div>

        {article.contentSections && article.contentSections.map((section, idx) => (
          <div key={idx} className="space-y-2 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              {section.title}
            </h3>
            <p className="leading-relaxed text-slate-600 text-xs sm:text-sm">
              {section.body}
            </p>
          </div>
        ))}
      </article>

      {/* 8. Research Citation Generator Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Citation Export (BibTeX / APA / IEEE)
            </h3>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
            {(['APA', 'IEEE', 'BibTeX'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setCitationFormat(fmt)}
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition-all ${
                  citationFormat === fmt ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <pre className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap overflow-x-auto">
          {generateCitation()}
        </pre>

        <div className="flex justify-end">
          <button
            onClick={handleCopyCitation}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Citation</span>
          </button>
        </div>
      </div>

      {/* 9. Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Related Research & Articles
            </h3>
            <span className="text-xs text-indigo-600 font-semibold font-mono">Matched by Cluster</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <ArticleCard
                key={rel.id}
                article={rel}
                onSelectArticle={openArticleModal}
                onBookmarkToggle={toggleBookmark}
                isBookmarked={bookmarkedIds.has(rel.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <AddToCollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        article={article}
        onCreateNewCollection={() => {
          setIsCollectionModalOpen(false);
          setIsCreateColModalOpen(true);
        }}
      />

      <CreateCollectionModal
        isOpen={isCreateColModalOpen}
        onClose={() => setIsCreateColModalOpen(false)}
      />
    </div>
  );
};
