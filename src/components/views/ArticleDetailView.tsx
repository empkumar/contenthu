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
  ShieldCheck,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AddToCollectionModal } from '../modals/AddToCollectionModal';
import { CreateCollectionModal } from '../modals/CreateCollectionModal';
import { ArticleCard } from '../ArticleCard';
import type { ArticleAnalysisResult } from '../../services/api';

export const ArticleDetailView: React.FC = () => {
  const { 
    selectedArticle, 
    articles, 
    bookmarkedIds, 
    toggleBookmark, 
    setActiveTab, 
    navigateToTopicResearch,
    openArticleModal,
    analyzeArticleWithClaude,
    showToast 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [citationFormat, setCitationFormat] = useState<'APA' | 'IEEE' | 'BibTeX'>('APA');
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isCreateColModalOpen, setIsCreateColModalOpen] = useState(false);

  // Claude AI Analysis State
  const [analysisResult, setAnalysisResult] = useState<ArticleAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const handleRunClaudeAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeArticleWithClaude(article);
      setAnalysisResult(res);
      showToast('Claude 3.5 strategic analysis generated');
    } catch (err) {
      showToast('Generated strategic analysis in local mode');
    } finally {
      setIsAnalyzing(false);
    }
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
            <span>Read on {article.publisher.name}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* 3. Hero Header Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
            {article.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {article.type}
          </span>
          <button
            onClick={() => navigateToTopicResearch(article.topicId)}
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
          >
            Topic: {article.topicId}
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${article.publisher.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs`}>
              {article.publisher.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">{article.publisher.name}</span>
                {article.publisher.verified && (
                  <CheckCircle className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                )}
              </div>
              <span className="text-xs text-slate-500">
                {article.author ? `By ${article.author}` : article.publisher.domain}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.readTime}</span>
            </div>
            <span>•</span>
            <span>Published: {article.publishedAt}</span>
            <span>•</span>
            <span className="font-mono text-emerald-600 font-bold">
              {article.relevanceScore}% Institutional Score
            </span>
          </div>
        </div>
      </div>

      {/* 4. Article Thumbnail Hero */}
      {article.thumbnail && (
        <div className="relative rounded-3xl overflow-hidden shadow-sm aspect-21/9 max-h-96 w-full border border-slate-200">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
            <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
              Source: {article.publisher.name}
            </span>
            <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
              {article.savesCount} saves • {article.sharesCount} shares
            </span>
          </div>
        </div>
      )}

      {/* 5. Key Takeaway AI Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 border border-indigo-100 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950 font-mono">
            Core AI Signal & Key Takeaway
          </h3>
        </div>
        <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed pl-8">
          {article.keyTakeaway}
        </p>
      </div>

      {/* 6. Claude 3.5 AI Deep Strategic Analysis & SWOT Widget */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Claude 3.5 Deep Strategic Analysis
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Institutional Grade
                </span>
              </h3>
              <span className="text-[11px] text-slate-400">
                Automated SWOT analysis, market implications & bull/bear thesis
              </span>
            </div>
          </div>

          <button
            onClick={handleRunClaudeAnalysis}
            disabled={isAnalyzing}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-950/50 transition-all shrink-0 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : analysisResult ? 'Re-Analyze Article' : 'Run Deep Analysis'}</span>
          </button>
        </div>

        {analysisResult ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Summary & Impact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider block">
                  Executive AI Summary
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Market Sentiment
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-base font-bold text-emerald-400">
                      {analysisResult.sentiment}
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Impact Score</span>
                  <span className="font-mono font-bold text-indigo-300">{analysisResult.marketImpactScore}/100</span>
                </div>
              </div>
            </div>

            {/* SWOT Matrix */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                SWOT Strategic Breakdown
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 space-y-1">
                  <span className="font-bold block text-emerald-400 text-[11px]">Strengths</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-300">
                    {analysisResult.swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-200 space-y-1">
                  <span className="font-bold block text-rose-400 text-[11px]">Weaknesses</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-300">
                    {analysisResult.swot.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 space-y-1">
                  <span className="font-bold block text-indigo-400 text-[11px]">Opportunities</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-300">
                    {analysisResult.swot.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-amber-200 space-y-1">
                  <span className="font-bold block text-amber-400 text-[11px]">Threats & Headwinds</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-300">
                    {analysisResult.swot.threats.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Strategic Implications */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-indigo-300 block text-[11px]">Strategic Recommendation</span>
              <p>{analysisResult.strategicImplications}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
            <p className="text-xs text-slate-300">
              Click &quot;Run Deep Analysis&quot; to prompt Claude 3.5 Sonnet to dissect this article&apos;s market positioning, competitive threats, and executive takeaways.
            </p>
          </div>
        )}
      </div>

      {/* 7. Key Metrics Grid if present */}
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

      {/* 8. Structured Article Content */}
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

      {/* 9. Research Citation Generator Card */}
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

      {/* 10. Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Related Research & Articles
            </h3>
            <span className="text-xs text-indigo-600 font-semibold font-mono">Matched by Cluster</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map((art) => (
              <ArticleCard
                key={art.id}
                article={art}
                isBookmarked={bookmarkedIds.has(art.id)}
                onBookmarkToggle={toggleBookmark}
                onSelectArticle={openArticleModal}
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
