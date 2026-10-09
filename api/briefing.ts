import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateClaudeBriefing } from './lib/claudeService';
import type { AIBriefingRequest } from './lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body: AIBriefingRequest = {};
    if (req.method === 'POST') {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    } else {
      body = {
        topic: (req.query.topic as string) || 'Global AI & Autonomous Agents',
        type: (req.query.type as any) || 'daily'
      };
    }

    const briefing = await generateClaudeBriefing(body);

    return res.status(200).json({
      success: true,
      briefing
    });
  } catch (error: any) {
    console.error('[API /api/briefing] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate briefing'
    });
  }
}
