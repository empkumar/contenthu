import type { VercelRequest, VercelResponse } from '@vercel/node';
import { analyzeClaudeArticle } from './lib/claudeService';
import type { ArticleAnalysisRequest } from './lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body: ArticleAnalysisRequest = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    if (!body.title || !body.content) {
      return res.status(400).json({ success: false, error: 'Title and content are required' });
    }

    const analysis = await analyzeClaudeArticle(body);

    return res.status(200).json({
      success: true,
      analysis
    });
  } catch (error: any) {
    console.error('[API /api/summarize] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze article'
    });
  }
}
