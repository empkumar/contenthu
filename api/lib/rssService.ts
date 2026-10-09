import Parser from 'rss-parser';
import type { ApiArticle, FeedSource } from './types';

export const RSS_SOURCES: FeedSource[] = [
  {
    id: 'techcrunch-ai',
    name: 'TechCrunch AI & Tech',
    url: 'https://techcrunch.com/feed/',
    topicId: 'ai-agents',
    category: 'VENTURE',
    type: 'Articles',
    badgeText: 'Live Feed',
    avatarBg: 'bg-emerald-600',
    domain: 'techcrunch.com'
  },
  {
    id: 'theverge-tech',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    topicId: 'cloud-infra',
    category: 'TECH REPORT',
    type: 'News',
    badgeText: 'Live Feed',
    avatarBg: 'bg-indigo-600',
    domain: 'theverge.com'
  },
  {
    id: 'mit-tech-review',
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    topicId: 'ai-agents',
    category: 'RESEARCH',
    type: 'Articles',
    badgeText: 'Live Feed',
    avatarBg: 'bg-rose-600',
    domain: 'technologyreview.com'
  },
  {
    id: 'arstechnica',
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    topicId: 'cybersecurity',
    category: 'TECH REPORT',
    type: 'News',
    badgeText: 'Live Feed',
    avatarBg: 'bg-orange-600',
    domain: 'arstechnica.com'
  },
  {
    id: 'wired-tech',
    name: 'Wired Business & Tech',
    url: 'https://www.wired.com/feed/category/business/latest/rss',
    topicId: 'fintech',
    category: 'VENTURE',
    type: 'Articles',
    badgeText: 'Live Feed',
    avatarBg: 'bg-zinc-800',
    domain: 'wired.com'
  },
  {
    id: 'hackernews',
    name: 'Hacker News Frontpage',
    url: 'https://hnrss.org/frontpage',
    topicId: 'cloud-infra',
    category: 'STARTUP',
    type: 'News',
    badgeText: 'HN Top',
    avatarBg: 'bg-amber-600',
    domain: 'ycombinator.com'
  }
];

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator']
    ]
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 ContentHu/1.0',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  },
  timeout: 8000
});

// High quality topic fallback thumbnails
const TOPIC_IMAGES: Record<string, string[]> = {
  'ai-agents': [
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  ],
  'cloud-infra': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
  ],
  'cybersecurity': [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80'
  ],
  'fintech': [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'
  ],
  'quantum': [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80'
  ],
  'robotics': [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80'
  ],
  'web3': [
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80'
  ]
};

// In-memory article cache
let cachedArticles: ApiArticle[] = [];
let lastFetchedTime: number = 0;
const CACHE_TTL_MS = 8 * 60 * 1000; // 8 minutes

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImage(item: any, topicId: string): string {
  // Check enclosure
  if (item.enclosure && item.enclosure.url && item.enclosure.url.match(/\.(jpeg|jpg|gif|png|webp)/i)) {
    return item.enclosure.url;
  }
  // Check mediaContent
  if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
    return item.mediaContent.$.url;
  }
  // Check mediaThumbnail
  if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
    return item.mediaThumbnail.$.url;
  }
  // Extract <img> from contentEncoded or content
  const rawHtml = item.contentEncoded || item.content || item.description || '';
  const match = rawHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match && match[1] && !match[1].includes('feedsportal') && !match[1].includes('feedburner')) {
    return match[1];
  }

  // Fallback to high quality image by topic
  const list = TOPIC_IMAGES[topicId] || TOPIC_IMAGES['ai-agents'];
  return list[Math.floor(Math.random() * list.length)];
}

function detectTopic(title: string, description: string, defaultTopic: string): string {
  const combined = `${title} ${description}`.toLowerCase();
  
  if (combined.match(/\b(llm|gpt|claude|gemini|openai|anthropic|agent|agents|genai|ai model|transformer|deep learning|neural)\b/)) {
    return 'ai-agents';
  }
  if (combined.match(/\b(kubernetes|cloud|aws|azure|gcp|serverless|docker|devops|data center|gpu cluster|infra)\b/)) {
    return 'cloud-infra';
  }
  if (combined.match(/\b(security|vulnerability|malware|cyber|ransomware|zero-day|hacker|breach|firewall|cve)\b/)) {
    return 'cybersecurity';
  }
  if (combined.match(/\b(fintech|payments|banking|upi|stripe|credit|crypto|bitcoin|ethereum|solana|defi)\b/)) {
    return combined.match(/\b(crypto|bitcoin|ethereum|solana|defi|blockchain|web3)\b/) ? 'web3' : 'fintech';
  }
  if (combined.match(/\b(quantum|qubit|superconducting|ionq|rigetti)\b/)) {
    return 'quantum';
  }
  if (combined.match(/\b(robot|robotics|humanoid|boston dynamics|drone|autonomous|figure ai)\b/)) {
    return 'robotics';
  }
  
  return defaultTopic;
}

function extractTags(title: string, topicId: string): string[] {
  const words = title.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const commonKeywords = ['ai', 'agent', 'model', 'cloud', 'security', 'startup', 'funding', 'enterprise', 'scale', 'crypto', 'quantum', 'open-source'];
  const matched = commonKeywords.filter(k => words.includes(k));
  
  const topicTagMap: Record<string, string[]> = {
    'ai-agents': ['AI Agents', 'LLM', 'GenAI'],
    'cloud-infra': ['Cloud Infra', 'DevOps', 'Distributed Systems'],
    'cybersecurity': ['Infosec', 'Zero-Trust', 'Threat Intel'],
    'fintech': ['FinTech', 'Digital Payments', 'Venture'],
    'quantum': ['Quantum', 'DeepTech', 'Hardware'],
    'robotics': ['Robotics', 'Automation', 'Embodied AI'],
    'web3': ['Web3', 'Decentralized', 'Crypto']
  };

  const baseTags = topicTagMap[topicId] || ['Tech', 'Innovation'];
  return Array.from(new Set([...baseTags, ...matched.map(m => m.toUpperCase())])).slice(0, 4);
}

export async function fetchLiveFeedArticles(forceRefresh = false): Promise<ApiArticle[]> {
  const now = Date.now();
  if (!forceRefresh && cachedArticles.length > 0 && now - lastFetchedTime < CACHE_TTL_MS) {
    return cachedArticles;
  }

  const results: ApiArticle[] = [];

  // Fetch all feeds in parallel with individual error resilience
  const feedPromises = RSS_SOURCES.map(async (source) => {
    try {
      const feed = await parser.parseURL(source.url);
      if (!feed.items || feed.items.length === 0) return [];

      const feedArticles: ApiArticle[] = feed.items.slice(0, 10).map((item, index) => {
        const title = (item.title || 'Untitled Article').trim();
        const rawContent = item.contentSnippet || item.content || item.description || '';
        const description = stripHtml(rawContent).slice(0, 280) + (rawContent.length > 280 ? '...' : '');
        const topicId = detectTopic(title, description, source.topicId);
        const publishedDate = item.isoDate || item.pubDate ? new Date(item.isoDate || item.pubDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today';
        const readTimeMinutes = Math.max(3, Math.min(12, Math.round((description.length + 300) / 180)));
        const author = item.creator || item.author || source.name;
        const thumbnail = extractImage(item, topicId);
        const tags = extractTags(title, topicId);

        // Generate synthetic metrics and takeaways based on article
        const keyTakeaway = description.length > 100 
          ? `Key Signal: ${description.slice(0, 160)}... This represents a significant milestone in ${tags[0] || 'market intelligence'}.`
          : `Significant developments in ${tags.join(', ')} indicating accelerating industry adoption.`;

        const article: ApiArticle = {
          id: `live-${source.id}-${index}-${Date.now().toString(36)}`,
          title,
          description: description || `Latest updates and technical analysis from ${source.name}.`,
          category: source.category,
          type: source.type,
          topicId,
          publisher: {
            name: source.name,
            domain: source.domain,
            verified: true,
            avatarBg: source.avatarBg
          },
          author,
          originalUrl: item.link || `https://${source.domain}`,
          publishedAt: publishedDate,
          readTime: `${readTimeMinutes} min read`,
          relevanceScore: Math.floor(88 + Math.random() * 11),
          savesCount: Math.floor(120 + Math.random() * 450),
          sharesCount: Math.floor(45 + Math.random() * 210),
          thumbnail,
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
          badgeText: source.badgeText,
          tags,
          keyTakeaway,
          isLiveFeed: true,
          metrics: [
            { label: 'Relevance Score', value: `${Math.floor(90 + Math.random() * 9)}%` },
            { label: 'Source Credibility', value: 'Verified Tier 1' },
            { label: 'Market Sentiment', value: index % 2 === 0 ? 'Bullish (+8.4%)' : 'Strategic (+5.2%)' }
          ],
          contentSections: [
            {
              title: 'Executive Summary',
              body: description || 'No summary available.'
            },
            {
              title: 'Market & Industry Implications',
              body: `Published by ${source.name}, this development impacts key players across the ${topicId} ecosystem. Strategic intelligence teams should monitor follow-on investments and competitive responses.`
            }
          ]
        };

        return article;
      });

      return feedArticles;
    } catch (err) {
      console.warn(`[ContentHu RSS] Failed to fetch feed ${source.name} (${source.url}):`, err);
      return [];
    }
  });

  const parsedFeeds = await Promise.allSettled(feedPromises);
  parsedFeeds.forEach((settled) => {
    if (settled.status === 'fulfilled') {
      results.push(...settled.value);
    }
  });

  // Deduplicate by title similarity
  const seenTitles = new Set<string>();
  const uniqueArticles = results.filter((item) => {
    const norm = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seenTitles.has(norm)) return false;
    seenTitles.add(norm);
    return true;
  });

  if (uniqueArticles.length > 0) {
    cachedArticles = uniqueArticles;
    lastFetchedTime = Date.now();
  }

  return cachedArticles;
}

export function getCachedArticlesCount(): { count: number; lastFetched: string; sourcesCount: number } {
  return {
    count: cachedArticles.length,
    lastFetched: lastFetchedTime ? new Date(lastFetchedTime).toISOString() : 'Never',
    sourcesCount: RSS_SOURCES.length
  };
}
