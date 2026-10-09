import React, { useMemo } from 'react';
import { TopicLandscape } from '../TopicLandscape';
import { ArticleGrid } from '../ArticleGrid';
import { AIInsightsPanel } from '../AIInsightsPanel';
import { useApp } from '../../context/AppContext';
import { TOPIC_NODES } from '../../data/mockData';

export const AIResearchView: React.FC = () => {
  const {
    articles,
    selectedTopicId,
    setSelectedTopicId,
    searchQuery,
    openArticleModal,
    bookmarkedIds,
    toggleBookmark,
    navigateToQuestionSearch
  } = useApp();

  const selectedTopic = useMemo(() => {
    return TOPIC_NODES.find(n => n.id === selectedTopicId);
  }, [selectedTopicId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start animate-in fade-in duration-200">
      {/* MAIN WORKSPACE REGION (65% width on desktop) */}
      <div className="lg:col-span-8 xl:col-span-8 space-y-6">
        <TopicLandscape
          selectedTopicId={selectedTopicId}
          onSelectTopic={setSelectedTopicId}
        />
        <ArticleGrid
          articles={articles}
          selectedTopicId={selectedTopicId}
          searchQuery={searchQuery}
          onSelectArticle={openArticleModal}
          bookmarkedIds={bookmarkedIds}
          onBookmarkToggle={toggleBookmark}
        />
      </div>

      {/* RIGHT INSIGHTS PANEL REGION (35% width on desktop) */}
      <div className="lg:col-span-4 xl:col-span-4 space-y-4 lg:sticky lg:top-24">
        <AIInsightsPanel
          onQuestionClick={navigateToQuestionSearch}
          selectedTopicLabel={selectedTopic?.label}
        />
      </div>
    </div>
  );
};
