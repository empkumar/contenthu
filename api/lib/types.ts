export interface ApiArticle {
  id: string;
  title: string;
  description: string;
  category: 'RESEARCH' | 'VENTURE' | 'STARTUP' | 'CASE STUDY' | 'POLICY' | 'TECH REPORT';
  type: 'Articles' | 'Research Papers' | 'Case Studies' | 'News';
  topicId: string;
  publisher: {
    name: string;
    domain: string;
    verified: boolean;
    avatarBg: string;
  };
  author?: string;
  originalUrl?: string;
  publishedAt: string;
  readTime: string;
  relevanceScore: number;
  savesCount: number;
  sharesCount: number;
  isSaved?: boolean;
  thumbnail: string;
  badgeBg: string;
  badgeText: string;
  tags: string[];
  keyTakeaway: string;
  metrics?: { label: string; value: string }[];
  contentSections?: { title: string; body: string }[];
  isLiveFeed?: boolean;
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  topicId: string;
  category: ApiArticle['category'];
  type: ApiArticle['type'];
  badgeText: string;
  avatarBg: string;
  domain: string;
}

export interface AIResearchRequest {
  query: string;
  topicId?: string;
  depth?: 'standard' | 'deep' | 'comprehensive';
  focusAreas?: string[];
  articleContext?: { title: string; description: string; source: string }[];
}

export interface AIResearchResponse {
  query: string;
  timestamp: string;
  model: string;
  executiveSummary: string;
  keyFindings: {
    number: string;
    title: string;
    summary: string;
    impactTag: string;
    impactColor: string;
    sourceCount: number;
  }[];
  marketDynamics: {
    drivers: string[];
    headwinds: string[];
    marketMaturity: 'Nascent' | 'Accelerating' | 'Mainstream' | 'Consolidating';
    momentumScore: number;
  };
  keyPlayers: {
    name: string;
    category: string;
    role: string;
    status: string;
  }[];
  strategicTakeaways: string[];
  relatedQuestions: string[];
  sourcesReferenced: { title: string; source: string; url?: string }[];
}

export interface AIBriefingRequest {
  topic: string;
  type?: 'daily' | 'weekly' | 'topic';
  focusSectors?: string[];
  targetAudience?: string;
}

export interface AIBriefingResponse {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  type: 'daily' | 'weekly' | 'topic';
  readTime: string;
  sourcesCount: number;
  summary: string;
  audioDuration: string;
  status: 'Ready';
  chapters: {
    title: string;
    content: string;
    keyPoints: string[];
    citations: { title: string; publisher: string; articleId?: string }[];
  }[];
}

export interface ArticleAnalysisRequest {
  title: string;
  content: string;
  source?: string;
  topic?: string;
}

export interface ArticleAnalysisResponse {
  summary: string;
  keyTakeaways: string[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketImpactScore: number;
  sentiment: 'Bullish' | 'Neutral' | 'Bearish';
  keyQuotes: string[];
  strategicImplications: string;
}
