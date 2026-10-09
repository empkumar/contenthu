export interface TopicNode {
  id: string;
  label: string;
  category: string;
  articleCount: number;
  statLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowClass: string;
  iconName: string;
  xPercent: number;
  yPercent: number;
  satellites: string[];
  description: string;
}

export interface ArticleContentSection {
  title: string;
  body: string;
}

export interface Article {
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
  contentSections?: ArticleContentSection[];
}

export interface KeyFinding {
  number: string;
  title: string;
  summary: string;
  impactTag: string;
  impactColor: string;
  sourceCount: number;
}

export interface ResearchQuestion {
  id: string;
  query: string;
  category: string;
  sourceCount: number;
}

export interface TrackedCompany {
  id: string;
  name: string;
  category: string;
  stage: string;
  funding: string;
  location: string;
  founded: string;
  keyProduct: string;
  status: 'High Activity' | 'Active' | 'Monitoring';
  recentMentions: number;
  sentiment: 'Bullish' | 'Neutral' | 'Rapid Growth';
  alertsActive: boolean;
  logoBg: string;
  initials: string;
  description: string;
  latestEvent: string;
}

export interface Watchlist {
  id: string;
  name: string;
  description: string;
  companyIds: string[];
  topicIds: string[];
  updatedAt: string;
  itemCount: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  articleIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SavedSearch {
  id: string;
  query: string;
  filter: string;
  resultCount: number;
  savedAt: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  resultCount: number;
}

export interface ResearchNote {
  id: string;
  title: string;
  content: string;
  articleId?: string;
  articleTitle?: string;
  tags: string[];
  updatedAt: string;
}

export interface BriefingCitation {
  title: string;
  publisher: string;
  articleId?: string;
}

export interface BriefingChapter {
  title: string;
  content: string;
  keyPoints: string[];
  citations: BriefingCitation[];
}

export interface BriefingItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  type: 'daily' | 'weekly' | 'topic';
  readTime: string;
  sourcesCount: number;
  summary: string;
  audioDuration: string;
  status: 'Ready' | 'Scheduled';
  chapters: BriefingChapter[];
}

export interface UnexpectedDiscovery {
  id: string;
  title: string;
  tag: string;
  domain: string;
  excerpt: string;
  insight: string;
  relevanceReason: string;
  startupOrLab: string;
  thumbnail: string;
  impactScore: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'alert' | 'briefing' | 'mention' | 'system';
  read: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarInitials: string;
  bio: string;
  researchFocus: string[];
}

export interface UserPreferences {
  summaryLength: 'Concise' | 'Balanced' | 'Comprehensive';
  defaultCitation: 'APA 7th' | 'IEEE' | 'Chicago' | 'BibTeX';
  defaultLandingPage: 'discover' | 'ai-research' | 'explore' | 'monitor';
  density: 'comfortable' | 'compact';
  accentTheme: 'indigo-violet' | 'emerald' | 'cyan' | 'amber';
  emailDailyDigest: boolean;
  highImpactAlerts: boolean;
  weeklyRoundup: boolean;
  webhookUrl: string;
  autoSaveHistory: boolean;
}

export const CENTRAL_TOPIC = {
  id: 'central-root',
  title: 'AI Agents in Indian Startups',
  subtitle: 'Autonomous Systems, Enterprise LLM Orchestration & Ecosystem Growth',
  totalArticles: 248,
  totalStartups: 89,
  totalFunding: '$420M',
  lastUpdated: 'Updated 14 mins ago',
  modelSynthesis: 'ContentHu Intelligence v4.2'
};

export const TOPIC_NODES: TopicNode[] = [
  {
    id: 'use-cases',
    label: 'Use Cases',
    category: 'Applications',
    articleCount: 142,
    statLabel: '142 articles',
    color: 'from-indigo-600 via-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    borderColor: 'border-indigo-400',
    glowClass: 'node-shadow-indigo',
    iconName: 'Workflow',
    xPercent: 18,
    yPercent: 24,
    satellites: ['Customer Support', 'Legal AI Doc Analysis', 'Autonomous Code Gen', 'B2B Sales Outreach'],
    description: 'Enterprise workflow automation, customer ops, vernacular voice calling, and coding agents.'
  },
  {
    id: 'startups',
    label: 'Startups',
    category: 'Ecosystem',
    articleCount: 89,
    statLabel: '89 startups',
    color: 'from-violet-600 via-purple-500 to-fuchsia-500',
    bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
    borderColor: 'border-purple-400',
    glowClass: 'node-shadow-violet',
    iconName: 'Sparkles',
    xPercent: 50,
    yPercent: 12,
    satellites: ['Sarvam AI', 'Krutrim', 'Karya', 'DevRev', 'NimbleBox', 'Ema AI'],
    description: 'Leading seed to growth stage startups building proprietary agent architectures and sovereign models.'
  },
  {
    id: 'funding',
    label: 'Funding',
    category: 'Capital',
    articleCount: 58,
    statLabel: '$420M raised',
    color: 'from-emerald-500 via-teal-500 to-cyan-600',
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderColor: 'border-emerald-400',
    glowClass: 'node-shadow-emerald',
    iconName: 'DollarSign',
    xPercent: 82,
    yPercent: 22,
    satellites: ['Peak XV Partners', 'Lightspeed India', 'Accel Surge', 'Blume Ventures'],
    description: 'Venture funding trajectory, seed valuation multiples, and tier-1 global investor participation.'
  },
  {
    id: 'market-trends',
    label: 'Market Trends',
    category: 'Dynamics',
    articleCount: 64,
    statLabel: '64 reports',
    color: 'from-cyan-500 via-blue-500 to-indigo-600',
    bgColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    borderColor: 'border-cyan-400',
    glowClass: 'node-shadow-cyan',
    iconName: 'TrendingUp',
    xPercent: 88,
    yPercent: 56,
    satellites: ['SaaS 2.0 Agentic Shift', 'Vertical Micro-Agents', 'Voice-First AI Stack'],
    description: 'Transition from horizontal prompt wrappers to vertically integrated multi-agent swarms.'
  },
  {
    id: 'tools-platforms',
    label: 'Tools & Platforms',
    category: 'Infrastructure',
    articleCount: 53,
    statLabel: '53 tools',
    color: 'from-amber-500 via-orange-500 to-red-500',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    borderColor: 'border-amber-400',
    glowClass: 'node-shadow-amber',
    iconName: 'Cpu',
    xPercent: 78,
    yPercent: 84,
    satellites: ['LangGraph Hub', 'Llama 3.3 Fine-tunes', 'CrewAI Orchestration', 'DSPy Frameworks'],
    description: 'Agent evaluation frameworks, vector stores, long-term memory harnesses, and guardrail layers.'
  },
  {
    id: 'government-policy',
    label: 'Government & Policy',
    category: 'Regulation',
    articleCount: 28,
    statLabel: '28 policies',
    color: 'from-rose-500 via-pink-500 to-red-600',
    bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
    borderColor: 'border-rose-400',
    glowClass: 'node-shadow-rose',
    iconName: 'ShieldCheck',
    xPercent: 48,
    yPercent: 88,
    satellites: ['IndiaAI Compute Mission', 'DPDP Compliance', '10,000 GPU Cluster', 'MeitY AI Guidelines'],
    description: 'National computing subsidy, data sovereignty mandates, and ethical autonomous agent guidelines.'
  },
  {
    id: 'talent-hiring',
    label: 'Talent & Hiring',
    category: 'Workforce',
    articleCount: 31,
    statLabel: '31 insights',
    color: 'from-blue-600 via-indigo-600 to-violet-700',
    bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    borderColor: 'border-blue-400',
    glowClass: 'node-shadow-blue',
    iconName: 'Users',
    xPercent: 18,
    yPercent: 76,
    satellites: ['IIT AI Research Labs', 'Bengaluru Talent Density', 'AI Systems Engineer Demand'],
    description: 'Demand surge for Agentic Systems Engineers, evaluation benchmark specialists, and ML compilers.'
  },
  {
    id: 'challenges',
    label: 'Challenges',
    category: 'Barriers',
    articleCount: 45,
    statLabel: '45 reports',
    color: 'from-slate-600 via-slate-700 to-zinc-800',
    bgColor: 'bg-slate-100 text-slate-700 border-slate-300',
    borderColor: 'border-slate-500',
    glowClass: 'node-shadow-slate',
    iconName: 'AlertTriangle',
    xPercent: 10,
    yPercent: 48,
    satellites: ['GPU Inference Costs', 'Agent Hallucination Loops', 'Latency in Hindi Audio', 'Data Silos'],
    description: 'High inference unit economics, prompt drift, reliability bounds, and legacy system integration.'
  }
];

export const ARTICLES_DATA: Article[] = [
  {
    id: 'art-1',
    title: 'How Sarvam AI and BharatGen are Engineering Vernacular Autonomous Agent Swarms',
    description: 'Deep dive into low-latency tokenizers and acoustic models enabling real-time agentic voice workflows across 22 scheduled Indian languages.',
    category: 'TECH REPORT',
    type: 'Articles',
    topicId: 'startups',
    publisher: {
      name: 'TechCrunch India',
      domain: 'techcrunch.com',
      verified: true,
      avatarBg: 'bg-emerald-600'
    },
    author: 'Aditi Sharma, Principal Tech Correspondent',
    originalUrl: 'https://techcrunch.com/2026/09/sarvam-ai-indic-voice-swarms',
    publishedAt: '2 hours ago',
    readTime: '6 min read',
    relevanceScore: 98,
    savesCount: 342,
    sharesCount: 128,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    badgeText: 'HOT SPOTLIGHT',
    tags: ['Sarvam AI', 'Voice Agents', 'Indic LLMs', 'Bengaluru'],
    keyTakeaway: 'Voice agents in Tier 2/3 cities are reaching sub-400ms round-trip latency, enabling real-time banking conversational automation without human handoff.',
    metrics: [
      { label: 'Latency Benchmark', value: '280ms' },
      { label: 'Languages Supported', value: '22 Indic Dialects' },
      { label: 'Enterprise Pilot CSAT', value: '4.85 / 5.0' },
      { label: 'Cost Reduction', value: '54%' }
    ],
    contentSections: [
      {
        title: 'The Vernacular Imperative in Indian Enterprise',
        body: 'While Western agentic architectures have focused almost exclusively on English-centric text orchestration, Indian customer dynamics demand real-time vernacular audio interaction. Over 70% of digital transactions in tier-2 and tier-3 Indian cities begin with voice prompts rather than typed text. Sarvam AI and BharatGen have tackled this by co-designing specialized acoustic tokenizers directly tied to lightweight 7B parameter reasoning heads.'
      },
      {
        title: 'Architectural Breakdown: Streaming Acoustic Tokenizers',
        body: 'Traditional speech-to-speech agent pipelines chained ASR -> LLM Inference -> TTS, accumulating over 1200ms of end-to-end latency. The new unified acoustic model processes raw phonetic streams in chunks of 40ms, predicting intermediate tool-call triggers before full utterance termination. This enables the agent to fetch bank balance APIs or order statuses while the customer is still concluding their sentence in Marathi or Tamil.'
      },
      {
        title: 'Enterprise Deployment & Scalability',
        body: 'In production pilots with top public and private sector banks, the swarm handled over 180,000 multi-turn calls per day, achieving a 91% self-contained resolution rate. The total compute footprint was reduced by 3.2x by caching pre-compiled agent state graphs on local edge nodes.'
      }
    ]
  },
  {
    id: 'art-2',
    title: 'Venture Capital Surge: $420M Deployed in Indian Agentic Infrastructure During Q1-Q3 2026',
    description: 'Peak XV, Lightspeed India, and Accel lead Series A rounds targeting memory layers, autonomous evaluation harnesses, and multi-agent coordination.',
    category: 'VENTURE',
    type: 'News',
    topicId: 'funding',
    publisher: {
      name: 'Entrackr Intelligence',
      domain: 'entrackr.com',
      verified: true,
      avatarBg: 'bg-blue-600'
    },
    author: 'Rohan Mehra, Venture Analyst',
    originalUrl: 'https://entrackr.com/2026/09/indian-ai-agent-infra-funding-q3',
    publishedAt: 'Yesterday',
    readTime: '4 min read',
    relevanceScore: 96,
    savesCount: 512,
    sharesCount: 204,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    badgeText: 'VENTURE CAPITAL',
    tags: ['Funding', 'Peak XV', 'Series A', 'Agent Infra'],
    keyTakeaway: 'Investors are shifting away from generic wrapper apps toward proprietary evaluation benchmarks, hierarchical state stores, and vertical micro-agent orchestrators.',
    metrics: [
      { label: 'Total Capital Q1-Q3', value: '$420M' },
      { label: 'Avg Series A Size', value: '$14.5M' },
      { label: 'Top Hub', value: 'Bengaluru (64%)' },
      { label: 'Infra vs App Split', value: '62% Infra' }
    ],
    contentSections: [
      {
        title: 'Capital Rotation: From Prompts to State Machines',
        body: 'Venture capitalists across South Asia are executing a pronounced pivot. The initial 2023-2024 wave of horizontal LLM interfaces and prompt wrappers has been completely supplanted by infrastructure investments in memory persistence, deterministic state graphs, and self-correcting evaluation benchmarks.'
      },
      {
        title: 'Lead Investors and Key Rounds',
        body: 'Peak XV Partners led the largest single infrastructure round of $32M into an autonomous evaluation platform, while Lightspeed India and Accel participated in early-stage rounds for specialized telemetry layers designed to audit agent reasoning traces under strict banking regulatory constraints.'
      }
    ]
  },
  {
    id: 'art-3',
    title: 'Benchmarking Multi-Agent Swarms for Automated Tax & Regulatory Compliance under DPDP Act',
    description: 'Empirical analysis comparing LangGraph vs custom deterministic state machines for Indian corporate tax filing and data privacy audits.',
    category: 'RESEARCH',
    type: 'Research Papers',
    topicId: 'use-cases',
    publisher: {
      name: 'IIT Madras AI Lab',
      domain: 'iitm.ac.in/research',
      verified: true,
      avatarBg: 'bg-violet-600'
    },
    author: 'Prof. K. Ramaswamy & Team',
    originalUrl: 'https://iitm.ac.in/ai-lab/benchmarks/dpdp-agent-swarms-2026',
    publishedAt: 'Oct 04, 2026',
    readTime: '9 min read',
    relevanceScore: 95,
    savesCount: 689,
    sharesCount: 310,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    badgeText: 'PEER REVIEWED',
    tags: ['Research Paper', 'Tax AI', 'DPDP Compliance', 'IIT Madras'],
    keyTakeaway: 'Hierarchical agent architectures achieved 99.4% precision in statutory adherence while reducing manual audit cycle time from 14 days to 40 minutes.',
    metrics: [
      { label: 'Audit Accuracy', value: '99.4%' },
      { label: 'Time Reduction', value: '14 days → 40 min' },
      { label: 'Test Case Corpus', value: '45,000 Filings' },
      { label: 'False Positive Rate', value: '0.06%' }
    ],
    contentSections: [
      {
        title: 'Abstract & Methodology',
        body: 'The Digital Personal Data Protection (DPDP) Act of India imposes stringent liability on corporations for consent logs, data provenance, and cross-border transfers. In this paper, we construct a 3-tier hierarchical multi-agent framework featuring Auditor, Verifier, and Synthesizer nodes operating over strict deterministic finite state automata.'
      },
      {
        title: 'Empirical Results & Comparison',
        body: 'Comparing unconstrained LLM agents against our hierarchical state machine, unconstrained agents exhibited an unacceptable 8.4% hallucination rate on statutory clause numbers. In contrast, our constrained dual-verification agent swarm achieved 99.4% precision across 45,000 corporate test filings.'
      }
    ]
  },
  {
    id: 'art-4',
    title: 'Enterprise Case Study: How HDFC & Flipkart Scale Customer Operations with 24/7 Agent Swarms',
    description: 'An architectural walkthrough of how autonomous customer service agents resolve complex refunds and loan eligibility queries without human escalation.',
    category: 'CASE STUDY',
    type: 'Case Studies',
    topicId: 'use-cases',
    publisher: {
      name: 'The Ken',
      domain: 'the-ken.com',
      verified: true,
      avatarBg: 'bg-rose-600'
    },
    author: 'Vikram Joshi, Senior BFSI Editor',
    originalUrl: 'https://the-ken.com/stories/hdfc-flipkart-agent-swarms-scale',
    publishedAt: '3 days ago',
    readTime: '7 min read',
    relevanceScore: 94,
    savesCount: 420,
    sharesCount: 165,
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    badgeText: 'CASE STUDY',
    tags: ['Fintech', 'Ecommerce', 'HDFC', 'Scale'],
    keyTakeaway: 'Autonomous agent resolution handled 74% of tier-1 support tickets with a 4.8/5 CSAT rating, cutting operational overhead by 46%.',
    metrics: [
      { label: 'Ticket Containment', value: '74%' },
      { label: 'Escalation Time', value: '< 15 sec' },
      { label: 'CSAT Score', value: '4.8 / 5.0' },
      { label: 'Annual Savings', value: '$8.2M' }
    ],
    contentSections: [
      {
        title: 'The Challenge of Peak Season Volume',
        body: 'During major festive shopping events, query volumes spike by 600%. Traditional human customer care centers struggled with call wait times exceeding 12 minutes. Deploying autonomous agent swarms with direct read/write API access to core banking and logistics ledgers allowed instant resolution.'
      },
      {
        title: 'Safety Guardrails and Human-in-the-Loop Thresholds',
        body: 'For transactions exceeding ₹25,000 or accounts flagged with suspicious velocity patterns, the agent generates an automated risk briefing and smoothly hands off the session to a human supervisor with the proposed solution already pre-populated.'
      }
    ]
  },
  {
    id: 'art-5',
    title: 'IndiaAI Compute Mission: Accessing Subsidized 10,000 GPU Cluster for Early-Stage Agent Builders',
    description: 'Step-by-step roadmap on MeitY application criteria, GPU quota allocations, sovereign cloud hosting, and compliance checkpoints.',
    category: 'POLICY',
    type: 'Articles',
    topicId: 'government-policy',
    publisher: {
      name: 'Inc42 Media',
      domain: 'inc42.com',
      verified: true,
      avatarBg: 'bg-amber-600'
    },
    author: 'Neha Deshmukh, Policy Analyst',
    originalUrl: 'https://inc42.com/features/indiaai-compute-mission-gpu-allocation-guide',
    publishedAt: 'Oct 02, 2026',
    readTime: '5 min read',
    relevanceScore: 92,
    savesCount: 780,
    sharesCount: 412,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    badgeText: 'GOVT DIRECTIVE',
    tags: ['IndiaAI', 'GPUs', 'MeitY', 'Sovereign AI'],
    keyTakeaway: 'The government subsidized compute pool cuts inference and training costs by up to 60% for DPIIT-recognized AI startups building foundational agents.',
    metrics: [
      { label: 'Subsidized GPU Pool', value: '10,000 Units' },
      { label: 'Cost Subsidy', value: 'Up to 60%' },
      { label: 'Startups Onboarded', value: '230+' },
      { label: 'Host Clusters', value: 'Nxtra & Yotta' }
    ],
    contentSections: [
      {
        title: 'Unlocking Sovereign AI Compute',
        body: 'High GPU rental costs have historically penalized Indian startups competing against well-capitalized Silicon Valley peers. The IndiaAI Compute Mission subsidizes H100 and B200 clusters across domestic Tier-IV data centers, allowing verified Indian founders to access world-class compute at fractions of commercial rates.'
      },
      {
        title: 'Eligibility & Application Protocol',
        body: 'Founders must demonstrate DPIIT registration, open-weights contribution or sovereign data localization compliance, and an active prototype addressing core national sectors like agriculture, logistics, or vernacular education.'
      }
    ]
  },
  {
    id: 'art-6',
    title: 'From SaaS 1.0 to Autonomous Agent Swarms: The Architectural Playbook for Bengaluru Founders',
    description: 'Why Indian B2B SaaS companies are rebuilding their interfaces around proactive autonomous agents rather than static CRUD dashboards.',
    category: 'STARTUP',
    type: 'Articles',
    topicId: 'market-trends',
    publisher: {
      name: 'YourStory AI Radar',
      domain: 'yourstory.com',
      verified: true,
      avatarBg: 'bg-indigo-600'
    },
    author: 'Tarun Varma, Tech Journalist',
    originalUrl: 'https://yourstory.com/2026/09/saas-20-autonomous-agent-playbook',
    publishedAt: '4 days ago',
    readTime: '6 min read',
    relevanceScore: 91,
    savesCount: 298,
    sharesCount: 95,
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    badgeText: 'FOUNDER PLAYBOOK',
    tags: ['SaaS 2.0', 'Product Strategy', 'Bengaluru', 'Architecture'],
    keyTakeaway: 'Software pricing is moving from per-seat licenses to outcome-based pricing as agents execute real work autonomously.',
    metrics: [
      { label: 'Outcome-Based Pricing', value: '78% Adoption' },
      { label: 'Customer Retention', value: '+34%' },
      { label: 'Integration Speed', value: '3x Faster' }
    ],
    contentSections: [
      {
        title: 'The Death of the Static Dashboard',
        body: 'Users no longer want to click through 15 nested menus to generate a sales report. In SaaS 2.0, autonomous agents continuously observe data pipelines, detect anomalies, synthesize recommendations, and draft executive actions proactively.'
      },
      {
        title: 'Pricing Transformation',
        body: 'Per-seat pricing models break down when one autonomous agent does the work of five analysts. Startups are successfully shifting to value metrics: cost per resolved case, cost per booked meeting, or share of revenue generated.'
      }
    ]
  },
  {
    id: 'art-7',
    title: 'Agent Evaluation Frameworks: Overcoming Prompt Drift and Hallucination in Hindi & Tamil Workflows',
    description: 'Comparative benchmark of DSPy, Ragas, and custom telemetry agents designed to detect drift in multi-turn vernacular voice interactions.',
    category: 'RESEARCH',
    type: 'Research Papers',
    topicId: 'tools-platforms',
    publisher: {
      name: 'AI4Bharat / IIT Madras',
      domain: 'ai4bharat.org',
      verified: true,
      avatarBg: 'bg-cyan-600'
    },
    author: 'Dr. Mitesh Khapra & AI4Bharat Team',
    originalUrl: 'https://ai4bharat.org/research/eval-frameworks-indic-drift',
    publishedAt: 'Sep 29, 2026',
    readTime: '11 min read',
    relevanceScore: 89,
    savesCount: 445,
    sharesCount: 180,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    badgeText: 'RESEARCH PAPER',
    tags: ['Evaluation', 'Benchmarking', 'Indic NLP', 'DSPy'],
    keyTakeaway: 'Synthetic evaluation suites specifically tuned for conversational code-switching (Hinglish/Tanglish) reduce agent error rates by 38%.',
    metrics: [
      { label: 'Drift Reduction', value: '38%' },
      { label: 'Dialect Test Sets', value: '14 Languages' },
      { label: 'Eval Speed', value: '12ms / turn' }
    ],
    contentSections: [
      {
        title: 'The Code-Switching Conundrum',
        body: 'Standard English benchmark suites fail completely when encountering rapid sentence-level code-switching (e.g. Hindi mixed with English business terminology). We propose IndicEval-Agent, an automated synthetic benchmark that stresses multi-turn memory under noisy acoustic and dialectal conditions.'
      }
    ]
  },
  {
    id: 'art-8',
    title: 'The AI Systems Engineer Talent Crunch: Why Bengaluru Startups are Paying 80L+ for Agent Architects',
    description: 'An investigative report on the skyrocketing compensation trends, skill requisites, and hiring pipelines for autonomous agent architects in India.',
    category: 'TECH REPORT',
    type: 'News',
    topicId: 'talent-hiring',
    publisher: {
      name: 'Mint Tech Digest',
      domain: 'livemint.com',
      verified: true,
      avatarBg: 'bg-purple-600'
    },
    author: 'Priya Nambiar, Senior Editor',
    originalUrl: 'https://livemint.com/technology/ai-systems-engineer-salary-trends-bengaluru',
    publishedAt: 'Sep 27, 2026',
    readTime: '5 min read',
    relevanceScore: 88,
    savesCount: 620,
    sharesCount: 380,
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    badgeText: 'CAREERS & TALENT',
    tags: ['Hiring', 'Compensation', 'Bengaluru Hub', 'Agent Engineers'],
    keyTakeaway: 'Engineers who understand stateful execution graphs, tool-calling latencies, and distributed GPU serving are the most sought-after talent in Indian tech.',
    metrics: [
      { label: 'Median Base Pay', value: '₹75L - ₹95L' },
      { label: 'Job Opening Growth', value: '+210% YoY' },
      { label: 'Key Skill', value: 'Distributed Serving & DSPy' }
    ],
    contentSections: [
      {
        title: 'The Evolution of AI Roles',
        body: 'Simple prompt engineering is dead. Startups are paying top-tier compensation for engineers with deep systems expertise: low-level CUDA kernels, vLLM optimizations, asynchronous event loop orchestration, and fault-tolerant agent state machine architecture.'
      }
    ]
  },
  {
    id: 'art-9',
    title: 'Krutrim & BharatGen: Scaling Sovereign LLM Architectures for 1.4 Billion Citizens',
    description: 'How Indian sovereign model builders are training multimodal foundation models on authentic regional datasets to power public sector agents.',
    category: 'STARTUP',
    type: 'Articles',
    topicId: 'startups',
    publisher: {
      name: 'Economic Times AI',
      domain: 'economictimes.indiatimes.com',
      verified: true,
      avatarBg: 'bg-orange-600'
    },
    author: 'Siddharth Roy, AI Editor',
    originalUrl: 'https://economictimes.indiatimes.com/tech/ai/krutrim-bharatgen-sovereign-llm',
    publishedAt: '5 days ago',
    readTime: '6 min read',
    relevanceScore: 87,
    savesCount: 389,
    sharesCount: 142,
    thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
    badgeText: 'SOVEREIGN TECH',
    tags: ['Krutrim', 'Sovereign AI', 'Indic LLMs', 'Public Sector'],
    keyTakeaway: 'Sovereign foundation models built on curated Indic datasets are outperforming global models on civic welfare navigation and land record queries by 42%.',
    metrics: [
      { label: 'Dataset Size', value: '2.4 Trillion Tokens' },
      { label: 'Public Depts Deployed', value: '14 State Governments' }
    ],
    contentSections: [
      {
        title: 'Bridging the Civic Access Gap',
        body: 'Deploying AI agents across Indian government services requires deep contextual awareness of state laws, local land revenue terminology, and vernacular dialects that Silicon Valley models have never seen.'
      }
    ]
  },
  {
    id: 'art-10',
    title: 'DevRev & NimbleBox: The Next-Generation Agentic DevTools Emerging from India',
    description: 'Indian developer tool startups are exporting autonomous code review, documentation agents, and self-healing cloud pipelines to global Fortune 500 enterprises.',
    category: 'TECH REPORT',
    type: 'Articles',
    topicId: 'tools-platforms',
    publisher: {
      name: 'VentureBeat India',
      domain: 'venturebeat.com',
      verified: true,
      avatarBg: 'bg-violet-600'
    },
    author: 'Arun Kulkarni, Silicon Valley Correspondent',
    originalUrl: 'https://venturebeat.com/ai/devrev-nimblebox-agentic-devtools',
    publishedAt: 'Last week',
    readTime: '7 min read',
    relevanceScore: 86,
    savesCount: 512,
    sharesCount: 220,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-violet-100 text-violet-800 border-violet-200',
    badgeText: 'GLOBAL EXPORT',
    tags: ['DevTools', 'DevRev', 'NimbleBox', 'SaaS'],
    keyTakeaway: 'Over 40% of US enterprises utilizing autonomous code review agents now run software engineered in Bengaluru and Chennai.',
    metrics: [
      { label: 'US Enterprise Adoption', value: '42%' },
      { label: 'PR Review Speed', value: '4.2x Faster' }
    ],
    contentSections: [
      {
        title: 'Building from India for the World',
        body: 'India is no longer just a service outsourcing hub; it is the breeding ground for next-generation developer tooling that autonomously inspects pull requests, writes regression tests, and remediates security vulnerabilities.'
      }
    ]
  },
  {
    id: 'art-11',
    title: 'Fintech Agent Swarms: How Perfios & Decentro Automate Credit Underwriting in Rural India',
    description: 'Using alternative data, bank statement parsing agents, and satellite imagery analysis to underwrite loans for unbanked agrarian borrowers in minutes.',
    category: 'CASE STUDY',
    type: 'Case Studies',
    topicId: 'use-cases',
    publisher: {
      name: 'FinTech Futures India',
      domain: 'fintechfutures.com',
      verified: true,
      avatarBg: 'bg-emerald-600'
    },
    author: 'Meera Chawla, Financial Technology Lead',
    originalUrl: 'https://fintechfutures.com/stories/rural-underwriting-agent-swarms',
    publishedAt: 'Oct 01, 2026',
    readTime: '8 min read',
    relevanceScore: 85,
    savesCount: 290,
    sharesCount: 110,
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    badgeText: 'FINTECH BREAKTHROUGH',
    tags: ['Fintech', 'Credit Scoring', 'Agritech', 'Perfios'],
    keyTakeaway: 'Autonomous multi-modal agents reduced loan processing time from 4 days to 3.5 minutes while lowering default rates by 1.8%.',
    metrics: [
      { label: 'Loan Decision Time', value: '3.5 min' },
      { label: 'Default Rate Reduction', value: '-1.8%' }
    ],
    contentSections: [
      {
        title: 'Underwriting Without Formal Credit Scores',
        body: 'By combining GST invoicing patterns, utility payment records, and agricultural crop yield satellite telemetry, agent swarms create dynamic synthetic credit profiles for first-time borrowers.'
      }
    ]
  },
  {
    id: 'art-12',
    title: 'Ethical Guardrails & Hallucination Mitigation in High-Stakes Healthcare Agents',
    description: 'Collaborative study between Apollo Hospitals and IISc on safety mechanisms preventing lethal drug interaction advice in autonomous clinic triaging.',
    category: 'RESEARCH',
    type: 'Research Papers',
    topicId: 'challenges',
    publisher: {
      name: 'IISc Computational Biology Lab',
      domain: 'iisc.ac.in/research',
      verified: true,
      avatarBg: 'bg-rose-600'
    },
    author: 'Dr. S. Nair, IISc & Apollo Research Consortium',
    originalUrl: 'https://iisc.ac.in/research/health-agent-guardrails-2026',
    publishedAt: 'Sep 25, 2026',
    readTime: '10 min read',
    relevanceScore: 84,
    savesCount: 470,
    sharesCount: 215,
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    badgeText: 'HEALTHCARE AI',
    tags: ['Healthcare', 'IISc', 'Safety', 'Guardrails'],
    keyTakeaway: 'Dual-circuit verification harnesses with deterministic pharmacopeia lookups eliminated hallucinated medication advice in 100,000 simulated triage trials.',
    metrics: [
      { label: 'Drug Conflict Detection', value: '99.98%' },
      { label: 'Clinical Trials Corpus', value: '100k Cases' }
    ],
    contentSections: [
      {
        title: 'Zero-Tolerance Verification in Medicine',
        body: 'Unlike consumer chatbots where minor inaccuracies are tolerable, clinical triage agents require mathematical bounds on probabilistic outputs. IISc developed a deterministic formal verification layer that wraps LLM outputs with hard pharmacological rule engines.'
      }
    ]
  }
];

export const UNEXPECTED_DISCOVERIES: UnexpectedDiscovery[] = [
  {
    id: 'disc-1',
    title: 'Offline Neuromorphic SLMs Running on Solar-Powered Farm Sensors in Punjab',
    tag: 'Edge Agritech Breakthrough',
    domain: 'iit-ropar.ac.in',
    excerpt: 'Sub-50MB Quantized small language models running on 2-watt RISC-V edge processors autonomously diagnose crop fungal infestations without internet connectivity.',
    insight: 'Overcomes rural connectivity deadzones by shifting inference directly to tractor battery-powered sensors.',
    relevanceReason: 'Cross-disciplinary fusion of RISC-V hardware with Indic agronomy datasets.',
    startupOrLab: 'IIT Ropar Agri-Edge Lab',
    thumbnail: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80',
    impactScore: 94
  },
  {
    id: 'disc-2',
    title: 'Bio-Inspired Swarm Consensus in Drone Delivery Corridors over Bengaluru',
    tag: 'Autonomous Robotics',
    domain: 'iisc.ac.in',
    excerpt: 'Applying honeybee foraging consensus algorithms to multi-agent drone swarms navigating high-density urban airspace without central air traffic controllers.',
    insight: 'Cuts inter-drone packet collision by 87% in high electromagnetic interference environments.',
    relevanceReason: 'Novel mathematical model bridging biological swarm intelligence with urban logistics.',
    startupOrLab: 'IISc Aerospace & Autonomous Systems',
    thumbnail: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
    impactScore: 92
  },
  {
    id: 'disc-3',
    title: 'Formal Verification of Smart Legal Contracts under Ancient Roman & Indic Jurisprudence',
    tag: 'Legal AI Theory',
    domain: 'nls.ac.in',
    excerpt: 'Researchers at National Law School Bangalore construct mathematically provable agent consensus rules for multi-party commercial dispute resolution.',
    insight: 'Enables autonomous escrow contracts that execute legally binding settlement terms without court delays.',
    relevanceReason: 'Deep intersection of formal logic, smart contracts, and Indian arbitration law.',
    startupOrLab: 'NLSIU Bangalore AI & Law Center',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    impactScore: 89
  }
];

export const TRACKED_COMPANIES_DATA: TrackedCompany[] = [
  {
    id: 'comp-1',
    name: 'Sarvam AI',
    category: 'Sovereign Indic LLMs & Voice Agents',
    stage: 'Series A ($41M Raised)',
    funding: '$41M (Lightspeed, Peak XV, Khosla)',
    location: 'Bengaluru, India',
    founded: '2023',
    keyProduct: 'Bulbul-v2 Streaming Speech Agent & Indic Tokenizers',
    status: 'High Activity',
    recentMentions: 142,
    sentiment: 'Rapid Growth',
    alertsActive: true,
    logoBg: 'bg-emerald-600',
    initials: 'SA',
    description: 'Pioneering foundational speech reasoning models and vernacular voice swarms across 22 scheduled Indian languages.',
    latestEvent: 'Released Bulbul-v2 with 280ms acoustic latency across 22 languages.'
  },
  {
    id: 'comp-2',
    name: 'DevRev',
    category: 'Autonomous Software & Support Agents',
    stage: 'Series A ($100M+ Raised, $1.15B Valuation)',
    funding: '$100M+ (Khosla Ventures)',
    location: 'Bengaluru / San Francisco',
    founded: '2020',
    keyProduct: 'OneCRM & AgentOS for Developer Support',
    status: 'High Activity',
    recentMentions: 98,
    sentiment: 'Bullish',
    alertsActive: true,
    logoBg: 'bg-violet-600',
    initials: 'DR',
    description: 'AI-native software engine connecting customer support, product management, and automated code review into self-operating pipelines.',
    latestEvent: 'Signed multi-year enterprise contracts with 3 global Fortune 500 banks.'
  },
  {
    id: 'comp-3',
    name: 'Krutrim AI',
    category: 'Sovereign Full-Stack AI & Cloud Infra',
    stage: 'Series A ($50M Raised, $1B Unicorn)',
    funding: '$50M (Matrix Partners India)',
    location: 'Bengaluru, India',
    founded: '2023',
    keyProduct: 'Krutrim Cloud & Indic Silicon Accelerators',
    status: 'Active',
    recentMentions: 76,
    sentiment: 'Bullish',
    alertsActive: true,
    logoBg: 'bg-amber-600',
    initials: 'KR',
    description: 'Building India’s sovereign AI cloud stack, sovereign LLM family, and foundational compute chips tailored for Indic applications.',
    latestEvent: 'Deployed Krutrim Enterprise across 14 state public administration portals.'
  },
  {
    id: 'comp-4',
    name: 'Karya',
    category: 'Ethical Vernacular Data & Agent Training',
    stage: 'Seed ($5M Raised)',
    funding: '$5M (Bill & Melinda Gates Foundation, Google)',
    location: 'Bengaluru / Pan-India',
    founded: '2021',
    keyProduct: 'Fair-Pay Dialect Ingestion & Speech Datasets',
    status: 'Active',
    recentMentions: 54,
    sentiment: 'Rapid Growth',
    alertsActive: false,
    logoBg: 'bg-blue-600',
    initials: 'KA',
    description: 'Empowering rural communities to earn fair wages creating high-fidelity Indic speech and text datasets for global LLM labs.',
    latestEvent: 'Reached 100,000 active rural dialect annotators across 18 states.'
  },
  {
    id: 'comp-5',
    name: 'Ema AI',
    category: 'Universal Enterprise AI Workmate',
    stage: 'Series A ($25M Raised)',
    funding: '$25M (Accel, Section 32, Prosus)',
    location: 'Bengaluru / San Francisco',
    founded: '2023',
    keyProduct: 'Universal AI Employee Persona Engine',
    status: 'High Activity',
    recentMentions: 68,
    sentiment: 'Rapid Growth',
    alertsActive: true,
    logoBg: 'bg-pink-600',
    initials: 'EM',
    description: 'Creating autonomous multi-persona agents that execute end-to-end enterprise jobs across sales, legal, and engineering.',
    latestEvent: 'Launched Universal Employee v3 with integrated compliance guardrails.'
  },
  {
    id: 'comp-6',
    name: 'NimbleBox (TrueFoundry)',
    category: 'LLM Orchestration & Agent Serving Mesh',
    stage: 'Series A ($7.5M Raised)',
    funding: '$7.5M (Eniac Ventures, Sequoia Surge)',
    location: 'Bengaluru / Silicon Valley',
    founded: '2021',
    keyProduct: 'Agent Serving Mesh & GPU Virtualization',
    status: 'Active',
    recentMentions: 43,
    sentiment: 'Bullish',
    alertsActive: false,
    logoBg: 'bg-cyan-600',
    initials: 'NB',
    description: 'Unified MLOps and autonomous agent deployment control plane for enterprise engineering teams.',
    latestEvent: 'Partnered with Yotta Data Services to provide 1-click vLLM agent serving.'
  }
];

export const WATCHLISTS_DATA: Watchlist[] = [
  {
    id: 'wl-1',
    name: 'Sovereign Indic Voice & Speech Stack',
    description: 'Foundational acoustic models, streaming tokenizers, and dialect datasets created in India.',
    companyIds: ['comp-1', 'comp-3', 'comp-4'],
    topicIds: ['startups', 'tools-platforms'],
    updatedAt: 'Updated 2h ago',
    itemCount: 3
  },
  {
    id: 'wl-2',
    name: 'Enterprise Agentic SaaS & Developer Infra',
    description: 'Autonomous coding agents, CRM orchestrators, and agent deployment meshes.',
    companyIds: ['comp-2', 'comp-5', 'comp-6'],
    topicIds: ['use-cases', 'market-trends'],
    updatedAt: 'Updated Yesterday',
    itemCount: 3
  },
  {
    id: 'wl-3',
    name: 'National Compute & Policy Watch',
    description: 'Tracking IndiaAI Mission allocations, MeitY directives, and DPDP Act enforcement.',
    companyIds: ['comp-1', 'comp-3'],
    topicIds: ['government-policy', 'funding'],
    updatedAt: 'Updated 3d ago',
    itemCount: 2
  }
];

export const DEFAULT_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'Tier-1 Indic Voice Architectures',
    description: 'Articles and benchmarks detailing sub-400ms streaming speech models in Hindi, Tamil, and Bengali.',
    color: 'from-blue-500 to-indigo-600',
    articleIds: ['art-1', 'art-7', 'art-9'],
    createdAt: 'Oct 01, 2026',
    updatedAt: 'Oct 08, 2026'
  },
  {
    id: 'col-2',
    name: 'Venture Deals & Funding Insights',
    description: 'Series A deals, investor thesis, and valuation multiples across Indian agent startups.',
    color: 'from-emerald-500 to-teal-600',
    articleIds: ['art-2', 'art-8'],
    createdAt: 'Oct 03, 2026',
    updatedAt: 'Yesterday'
  },
  {
    id: 'col-3',
    name: 'DPDP Regulatory & Compliance Playbooks',
    description: 'Formal verification, statutory data privacy audits, and government GPU compute access.',
    color: 'from-purple-500 to-pink-600',
    articleIds: ['art-3', 'art-5', 'art-12'],
    createdAt: 'Sep 29, 2026',
    updatedAt: 'Oct 04, 2026'
  }
];

export const DEFAULT_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: 'ss-1',
    query: 'AI agents in Indian startups',
    filter: 'All Sources',
    resultCount: 248,
    savedAt: 'Today at 10:30 AM'
  },
  {
    id: 'ss-2',
    query: 'Sarvam AI Bulbul acoustic tokenizers',
    filter: 'Research Papers',
    resultCount: 64,
    savedAt: 'Oct 07, 2026'
  },
  {
    id: 'ss-3',
    query: 'IndiaAI Compute Mission subsidized 10,000 GPU',
    filter: 'News',
    resultCount: 28,
    savedAt: 'Oct 04, 2026'
  },
  {
    id: 'ss-4',
    query: 'Autonomous tax compliance LangGraph DPDP Act',
    filter: 'Case Studies',
    resultCount: 45,
    savedAt: 'Sep 30, 2026'
  }
];

export const DEFAULT_SEARCH_HISTORY: SearchHistoryItem[] = [
  {
    id: 'sh-1',
    query: 'AI agents in Indian startups',
    timestamp: '14 mins ago',
    resultCount: 248
  },
  {
    id: 'sh-2',
    query: 'Vernacular voice reasoning models latency',
    timestamp: '2 hours ago',
    resultCount: 89
  },
  {
    id: 'sh-3',
    query: 'Peak XV Series A agent infrastructure 2026',
    timestamp: 'Yesterday',
    resultCount: 58
  },
  {
    id: 'sh-4',
    query: 'HDFC autonomous customer care agent swarm',
    timestamp: '3 days ago',
    resultCount: 42
  },
  {
    id: 'sh-5',
    query: 'MeitY GPU allocation quota application',
    timestamp: '5 days ago',
    resultCount: 31
  }
];

export const DEFAULT_RESEARCH_NOTES: ResearchNote[] = [
  {
    id: 'note-1',
    title: 'Voice Agent Latency Bottlenecks in Production',
    content: 'Key finding from Sarvam AI paper: Chunking acoustic phonemes into 40ms frames eliminates the need for full sentence buffering. Crucial for Tier-2 BFSI applications where user interruptions are frequent.',
    articleId: 'art-1',
    articleTitle: 'How Sarvam AI and BharatGen are Engineering Vernacular Autonomous Agent Swarms',
    tags: ['Acoustics', 'Latency', 'BFSI'],
    updatedAt: '2 hours ago'
  },
  {
    id: 'note-2',
    title: 'Investment Multiples on Agent Evaluation Platforms',
    content: 'VCs are paying premium 25x ARR multiples for evaluation suites and state stores because prompt wrappers have zero switching barrier. Long-term defensibility lies in proprietary telemetry datasets.',
    articleId: 'art-2',
    articleTitle: 'Venture Capital Surge: $420M Deployed in Indian Agentic Infrastructure',
    tags: ['Venture', 'Valuation', 'Defensibility'],
    updatedAt: 'Yesterday'
  },
  {
    id: 'note-3',
    title: 'DPDP Audit State Machine Design',
    content: 'Hierarchical 3-tier architecture with Auditor, Verifier, and Synthesizer nodes achieved 99.4% precision. Avoid unconstrained LLM execution for statutory clause checks.',
    articleId: 'art-3',
    articleTitle: 'Benchmarking Multi-Agent Swarms for Automated Tax & Regulatory Compliance',
    tags: ['DPDP', 'Compliance', 'Architecture'],
    updatedAt: 'Oct 05, 2026'
  }
];

export const BRIEFINGS_DATA: BriefingItem[] = [
  {
    id: 'br-1',
    title: 'Daily Intelligence Briefing: October 9, 2026',
    subtitle: 'Acoustic Model Breakthroughs, $420M Venture Inflow & MeitY Phase-2 GPU Allocations',
    date: 'Today, 08:30 AM',
    type: 'daily',
    readTime: '4 min read',
    sourcesCount: 142,
    audioDuration: '3m 45s',
    status: 'Ready',
    summary: 'Today’s top developments highlight Sarvam AI’s sub-300ms speech tokenizers, Peak XV leading fresh agent infrastructure rounds, and MeitY prioritizing autonomous agent founders for the 10,000 GPU sovereign cluster.',
    chapters: [
      {
        title: '1. Voice-First Agentic Shift in Bharat',
        content: 'Sarvam AI and BharatGen have established a new benchmark for low-latency streaming speech agents, reaching 280ms acoustic round-trip times across 22 scheduled Indian languages. This completely replaces fragile ASR-LLM-TTS pipelines with unified streaming phonetic reasoning.',
        keyPoints: [
          'Phonetic tokenization chunked into 40ms windows enables real-time tool calling while users speak.',
          'Piloted across 180,000 daily banking interactions with a 91% self-contained resolution rate.',
          'Compute cost reduced by 3.2x via edge state caching.'
        ],
        citations: [
          { title: 'How Sarvam AI and BharatGen are Engineering Vernacular Swarms', publisher: 'TechCrunch India', articleId: 'art-1' },
          { title: 'Agent Evaluation Frameworks in Hindi & Tamil Workflows', publisher: 'AI4Bharat', articleId: 'art-7' }
        ]
      },
      {
        title: '2. Capital Velocity: $420M Deployed Across Q1-Q3',
        content: 'Venture capital deployment has shifted heavily from horizontal conversational wrappers toward stateful evaluation harnesses, long-term memory fabrics, and deterministic execution state graphs.',
        keyPoints: [
          'Infra investments represent 62% of total Q1-Q3 venture capital deployed.',
          'Bengaluru accounts for 64% of deal flow, followed by Hyderabad and Chennai.',
          'Valuation multiples favor teams building vertical telemetry and compliance guardrails.'
        ],
        citations: [
          { title: 'Venture Capital Surge: $420M Deployed in Agentic Infra', publisher: 'Entrackr Intelligence', articleId: 'art-2' }
        ]
      },
      {
        title: '3. National GPU Infrastructure & Regulatory Checkpoints',
        content: 'MeitY announced Phase 2 allocations of the subsidized 10,000 GPU cluster under the IndiaAI Mission, specifically earmarking high-priority compute quotas for founders building in agriculture, BFSI, and legal compliance under the DPDP Act.',
        keyPoints: [
          'Subsidies reduce H100 GPU rental costs by up to 60% for verified DPIIT startups.',
          'IIT Madras benchmarks demonstrated 99.4% precision in statutory tax compliance using hierarchical swarms.'
        ],
        citations: [
          { title: 'IndiaAI Compute Mission: Accessing Subsidized GPU Cluster', publisher: 'Inc42 Media', articleId: 'art-5' },
          { title: 'Benchmarking Multi-Agent Swarms under DPDP Act', publisher: 'IIT Madras AI Lab', articleId: 'art-3' }
        ]
      }
    ]
  },
  {
    id: 'br-2',
    title: 'Weekly Executive Synthesis: Autonomous Agent Ecosystem Q3 2026',
    subtitle: 'Strategic Deep-Dive on Enterprise SaaS 2.0, Sovereign Indic Foundation Models & Talent Dynamics',
    date: 'Oct 06, 2026',
    type: 'weekly',
    readTime: '8 min read',
    sourcesCount: 248,
    audioDuration: '7m 10s',
    status: 'Ready',
    summary: 'A comprehensive multi-agent synthesis exploring the commercial transition from per-seat SaaS to outcome-based agentic software, sovereign computing milestones, and the talent crunch for Agent Systems Architects in South Asia.',
    chapters: [
      {
        title: 'Executive Summary & Macro Drivers',
        content: 'Indian B2B SaaS companies are fundamentally rebuilding product interfaces around proactive agent swarms. Instead of navigating static dashboards, enterprise users now prompt autonomous coordinator agents that execute complex multi-system workflows without manual oversight.',
        keyPoints: [
          'Outcome-based pricing models have reached 78% adoption across new Series A SaaS products.',
          'Customer retention increased by 34% when deploying proactive monitoring agents.'
        ],
        citations: [
          { title: 'From SaaS 1.0 to Autonomous Agent Swarms', publisher: 'YourStory AI Radar', articleId: 'art-6' },
          { title: 'Enterprise Case Study: HDFC & Flipkart Customer Swarms', publisher: 'The Ken', articleId: 'art-4' }
        ]
      },
      {
        title: 'Engineering & Talent Market Landscape',
        content: 'Demand for Agentic Systems Engineers has surged by 210% YoY, driving median compensation packages beyond ₹80L in Bengaluru. Simple prompt engineering has become commoditized. The premium talent market is exclusively focused on low-level CUDA optimizations, latency minimization in streaming audio, and stateful memory persistence.',
        keyPoints: [
          'Distributed serving and evaluation benchmark engineering command the highest salary premiums.',
          'IIT Madras and IISc AI labs have emerged as the primary source of specialized agent architects.'
        ],
        citations: [
          { title: 'The AI Systems Engineer Talent Crunch in Bengaluru', publisher: 'Mint Tech Digest', articleId: 'art-8' }
        ]
      }
    ]
  },
  {
    id: 'br-3',
    title: 'Topic Briefing: Sovereign Indic LLMs & Public Sector AI',
    subtitle: 'Focused Dossier on Krutrim, BharatGen, Bhashini, and State Government Implementations',
    date: 'Oct 02, 2026',
    type: 'topic',
    readTime: '5 min read',
    sourcesCount: 58,
    audioDuration: '4m 20s',
    status: 'Ready',
    summary: 'An on-demand executive intelligence report detailing the performance benchmarks, training datasets, and public administrative deployments of sovereign Indic models across 14 state governments.',
    chapters: [
      {
        title: 'Sovereign Dataset Provenance & Tokenization',
        content: 'Indian sovereign foundation models trained on 2.4+ trillion curated tokens of authentic vernacular content outperform generic global models on local administrative tasks by 42%.',
        keyPoints: [
          'Public administration portals in Karnataka, Maharashtra, and Tamil Nadu have deployed citizen welfare agents.',
          'Data sovereignty mandates under DPDP require strict on-shore inference for citizen telemetry.'
        ],
        citations: [
          { title: 'Krutrim & BharatGen: Scaling Sovereign LLM Architectures', publisher: 'Economic Times AI', articleId: 'art-9' }
        ]
      }
    ]
  }
];

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Breakthrough Acoustic Tokenizer Released',
    description: 'Sarvam AI announced Bulbul-v2 with 280ms latency across 22 Indic languages.',
    time: '4 mins ago',
    type: 'alert',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Daily Intelligence Briefing is Ready',
    description: 'October 9 Daily Briefing has been synthesized and indexed with 142 citations.',
    time: '1 hour ago',
    type: 'briefing',
    read: false
  },
  {
    id: 'notif-3',
    title: 'New Mention: Peak XV Partners Series A',
    description: 'Peak XV led $18M in autonomous QA evaluation startup based in Bengaluru.',
    time: '2 hours ago',
    type: 'mention',
    read: true
  },
  {
    id: 'notif-4',
    title: 'IndiaAI Compute Mission Update',
    description: 'Phase 2 GPU quotas opened for DPIIT registered autonomous agent builders.',
    time: 'Yesterday',
    type: 'system',
    read: true
  }
];

export const KEY_FINDINGS: KeyFinding[] = [
  {
    number: '01',
    title: 'Rapid Shift to Domain-Specific Autonomous Agents',
    summary: 'Enterprise adoption in fintech, BFSI, and logistics outpaces horizontal foundation model wrappers by 3.4x, prioritizing verifiable task execution over conversational generation.',
    impactTag: 'High Market Shift',
    impactColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    sourceCount: 64
  },
  {
    number: '02',
    title: 'Bengaluru & Hyderabad Emerge as Sovereign AI Epicenters',
    summary: 'Over 68% of new agentic startups founded between Q1 2025 and Q3 2026 originate from South India tech corridors, driven by deep engineering density and campus research labs.',
    impactTag: 'Regional Density',
    impactColor: 'bg-purple-100 text-purple-700 border-purple-200',
    sourceCount: 48
  },
  {
    number: '03',
    title: 'Vernacular Voice Agent Breakthroughs in Bharat',
    summary: 'Tier-2 and Tier-3 market penetration is heavily led by sub-400ms multi-lingual audio reasoning engines (Sarvam, Bhashini) designed for voice-first conversational commerce.',
    impactTag: 'Inclusion Engine',
    impactColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    sourceCount: 39
  },
  {
    number: '04',
    title: 'Venture Capital Consolidation around Agent Infra',
    summary: '$420M+ deployed across Seed to Series B rounds in 2026, with top tier VC firms explicitly prioritizing evaluation harnesses, memory layers, and guardrail architectures.',
    impactTag: 'Capital Velocity',
    impactColor: 'bg-amber-100 text-amber-700 border-amber-200',
    sourceCount: 52
  },
  {
    number: '05',
    title: 'Enterprise Compute & Data Privacy Bottlenecks',
    summary: 'DPDP statutory compliance and high-spec H100/B200 GPU availability remain the top operational friction points, accelerating adoption of the IndiaAI national compute scheme.',
    impactTag: 'Critical Challenge',
    impactColor: 'bg-rose-100 text-rose-700 border-rose-200',
    sourceCount: 31
  }
];

export const RELATED_QUESTIONS: ResearchQuestion[] = [
  {
    id: 'q-1',
    query: 'Which Indian AI agent startups have raised Series A in 2026?',
    category: 'Venture',
    sourceCount: 24
  },
  {
    id: 'q-2',
    query: 'How are Indian IT giants (TCS, Infosys, Wipro) deploying autonomous agents?',
    category: 'Enterprise',
    sourceCount: 36
  },
  {
    id: 'q-3',
    query: 'What is the ROI comparison between custom agent swarms vs API wrappers?',
    category: 'Architecture',
    sourceCount: 19
  },
  {
    id: 'q-4',
    query: 'How does the IndiaAI Compute Mission subsidize GPU access for agent startups?',
    category: 'Policy',
    sourceCount: 15
  },
  {
    id: 'q-5',
    query: 'What are the primary latency benchmarks for vernacular voice agents in Hindi & Tamil?',
    category: 'Engineering',
    sourceCount: 28
  }
];

export const SUGGESTED_QUERIES = [
  '⚡ Sarvam AI agentic models',
  '⚡ Fintech autonomous agents Bengaluru',
  '⚡ Enterprise LLM orchestration India',
  '⚡ Seed stage AI robotics India',
  '⚡ DPDP Act AI compliance'
];

export const FILTER_CHIPS = [
  'All Sources',
  'Last 3 Months',
  'Articles + Blogs',
  'Research Papers',
  'News',
  'Case Studies',
  'More Filters'
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Morgan',
  email: 'alex.morgan@contenthu.ai',
  role: 'Enterprise AI Lead',
  organization: 'Apex Ventures & Intelligence Labs',
  avatarInitials: 'AM',
  bio: 'Focusing on sovereign LLM architectures, vernacular voice intelligence, and enterprise agentic workflow deployments in South Asia.',
  researchFocus: ['Indic Speech Models', 'Agent Evaluation Harnesses', 'BFSI Autonomous Underwriting', 'DPDP Compliance', '10k GPU Compute']
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  summaryLength: 'Balanced',
  defaultCitation: 'APA 7th',
  defaultLandingPage: 'discover',
  density: 'comfortable',
  accentTheme: 'indigo-violet',
  emailDailyDigest: true,
  highImpactAlerts: true,
  weeklyRoundup: true,
  webhookUrl: 'https://hooks.slack.com/services/T00/B00/XXXXX',
  autoSaveHistory: true
};
