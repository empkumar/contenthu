import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchLiveFeedArticles } from './lib/rssService';

const BASE_COMPANIES = [
  {
    id: 'co-1',
    name: 'Sarvam AI',
    category: 'Indic GenAI & Voice Agents',
    stage: 'Series A',
    funding: '$41M',
    location: 'Bengaluru, India',
    founded: '2023',
    keyProduct: 'Sarvam-1 & Shuka Foundation Audio',
    status: 'High Activity',
    recentMentions: 18,
    sentiment: 'Bullish',
    alertsActive: true,
    logoBg: 'bg-emerald-600',
    initials: 'SA',
    description: 'Developing sovereign full-stack foundational AI models tailored for Indian languages and enterprise voice workflows.',
    latestEvent: 'Launched Sarvam-2 multi-lingual voice pipeline with 10 Indic languages supported.'
  },
  {
    id: 'co-2',
    name: 'Krutrim SI Designs',
    category: 'Full-Stack AI Cloud & Silicon',
    stage: 'Unicorn ($50M)',
    funding: '$50M',
    location: 'Bengaluru / San Jose',
    founded: '2023',
    keyProduct: 'Krutrim Cloud & AI Silicon Roadmap',
    status: 'High Activity',
    recentMentions: 14,
    sentiment: 'Rapid Growth',
    alertsActive: true,
    logoBg: 'bg-orange-600',
    initials: 'KR',
    description: 'Building indigenous AI compute infrastructure, custom AI silicon processors, and sovereign cloud platforms for enterprise scale.',
    latestEvent: 'Announced 100MW AI-first green data center project in Tamil Nadu.'
  },
  {
    id: 'co-3',
    name: 'Ema (Enterprise Multi-Agent)',
    category: 'Universal AI Employees',
    stage: 'Series A',
    funding: '$36M',
    location: 'Bengaluru / San Francisco',
    founded: '2023',
    keyProduct: 'Universal AI Employee Platform',
    status: 'Active',
    recentMentions: 9,
    sentiment: 'Bullish',
    alertsActive: false,
    logoBg: 'bg-indigo-600',
    initials: 'EM',
    description: 'Deploying autonomous generative AI personas that integrate across hundreds of enterprise apps to execute complex business workflows.',
    latestEvent: 'Integrated 25+ pre-built integrations for Fortune 500 HR and IT workflows.'
  },
  {
    id: 'co-4',
    name: 'Anthropic',
    category: 'Frontier AI & Safety',
    stage: 'Series D / Growth',
    funding: '$7.3B',
    location: 'San Francisco, CA',
    founded: '2021',
    keyProduct: 'Claude 3.5 Sonnet & Computer Use',
    status: 'High Activity',
    recentMentions: 32,
    sentiment: 'Bullish',
    alertsActive: true,
    logoBg: 'bg-amber-600',
    initials: 'AN',
    description: 'AI safety and research company behind Claude 3.5 Sonnet, Claude 3.5 Haiku, and pioneering Model Context Protocol (MCP).',
    latestEvent: 'Released expanded Computer Use API and state-of-the-art SWE-bench benchmark updates.'
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const liveArticles = await fetchLiveFeedArticles();

    // Calculate live mention signals from fresh RSS articles
    const enhancedCompanies = BASE_COMPANIES.map((company) => {
      const nameNorm = company.name.toLowerCase();
      const matchingArticles = liveArticles.filter(a =>
        a.title.toLowerCase().includes(nameNorm) ||
        a.description.toLowerCase().includes(nameNorm)
      );

      return {
        ...company,
        recentMentions: company.recentMentions + matchingArticles.length,
        liveRelatedArticles: matchingArticles.slice(0, 3).map(a => ({
          id: a.id,
          title: a.title,
          url: a.originalUrl,
          publishedAt: a.publishedAt,
          source: a.publisher.name
        }))
      };
    });

    return res.status(200).json({
      success: true,
      companies: enhancedCompanies
    });
  } catch (error: any) {
    console.error('[API /api/companies] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch tracked companies',
      companies: BASE_COMPANIES
    });
  }
}
