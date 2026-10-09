import React, { useState } from 'react';
import { Sparkles, Orbit, Zap, ArrowUpRight, Shield, Cpu, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UniverseNode {
  id: string;
  name: string;
  category: string;
  orbitRadius: number; // percentage from center
  angle: number; // degrees
  color: string;
  glow: string;
  growth: string;
  articlesCount: number;
  startups: string[];
  icon: React.ElementType;
}

export const TopicUniverse: React.FC = () => {
  const { navigateToTopicResearch, showToast } = useApp();
  const [hoveredNode, setHoveredNode] = useState<UniverseNode | null>(null);
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('all');

  const universeNodes: UniverseNode[] = [
    {
      id: 'startups',
      name: 'Indic Speech & Voice SLMs',
      category: 'Foundation Models',
      orbitRadius: 28,
      angle: 30,
      color: 'from-blue-600 via-indigo-600 to-violet-600',
      glow: 'shadow-indigo-500/40',
      growth: '+142% MoM',
      articlesCount: 64,
      startups: ['Sarvam AI', 'BharatGen', 'Bhashini', 'Gnani.ai'],
      icon: Sparkles
    },
    {
      id: 'use-cases',
      name: 'BFSI Autonomous Underwriting',
      category: 'Enterprise Fintech',
      orbitRadius: 36,
      angle: 110,
      color: 'from-emerald-500 via-teal-500 to-cyan-600',
      glow: 'shadow-emerald-500/40',
      growth: '+94% MoM',
      articlesCount: 52,
      startups: ['Perfios AI', 'Decentro', 'Setu', 'HDFC Swarms'],
      icon: Shield
    },
    {
      id: 'funding',
      name: 'Agent Infra & State Stores',
      category: 'Venture Capital',
      orbitRadius: 42,
      angle: 195,
      color: 'from-purple-600 via-fuchsia-600 to-pink-600',
      glow: 'shadow-purple-500/40',
      growth: '+120% MoM',
      articlesCount: 58,
      startups: ['Peak XV', 'Lightspeed', 'Accel Surge'],
      icon: Zap
    },
    {
      id: 'government-policy',
      name: '10k GPU National Compute',
      category: 'Sovereign Policy',
      orbitRadius: 32,
      angle: 280,
      color: 'from-amber-500 via-orange-500 to-red-500',
      glow: 'shadow-amber-500/40',
      growth: '+65% MoM',
      articlesCount: 28,
      startups: ['IndiaAI Mission', 'MeitY', 'Yotta', 'Nxtra'],
      icon: Cpu
    },
    {
      id: 'tools-platforms',
      name: 'Autonomous Code Reviewers',
      category: 'Developer Infra',
      orbitRadius: 45,
      angle: 345,
      color: 'from-cyan-500 via-blue-600 to-indigo-600',
      glow: 'shadow-cyan-500/40',
      growth: '+88% MoM',
      articlesCount: 43,
      startups: ['DevRev', 'NimbleBox', 'TrueFoundry'],
      icon: Activity
    }
  ];

  const filteredNodes = selectedClusterFilter === 'all' 
    ? universeNodes 
    : universeNodes.filter(n => n.category.toLowerCase().includes(selectedClusterFilter.toLowerCase()));

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E1B4B] p-5 sm:p-7 text-white overflow-hidden border border-indigo-500/20 shadow-xl select-none">
      {/* Dynamic backdrop nebulae */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-60 h-60 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Orbit className="w-4 h-4 animate-spin" style={{ animationDuration: '24s' }} />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Interactive Topic Universe
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/50">
              Cosmic Radar
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Hover clusters to reveal emergent startup densities; click any orbital node to launch deep research.
          </p>
        </div>

        {/* Cluster filter pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto">
          {['all', 'Foundation', 'Enterprise', 'Venture', 'Sovereign', 'Developer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedClusterFilter(tab === 'all' ? 'all' : tab)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                (selectedClusterFilter === 'all' && tab === 'all') || selectedClusterFilter === tab
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Orbits' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Universe Canvas Visualization */}
      <div className="relative w-full h-[340px] sm:h-[400px] my-4 flex items-center justify-center overflow-hidden">
        {/* SVG Orbital Rings */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 400">
          <defs>
            <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Concentric orbital rings */}
          <circle cx="300" cy="200" r="70" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
          <circle cx="300" cy="200" r="120" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="5 7" opacity="0.5" />
          <circle cx="300" cy="200" r="165" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 8" opacity="0.4" />

          {/* Connection vectors to hovered node */}
          {hoveredNode && (
            <line
              x1="300"
              y1="200"
              x2={300 + (hoveredNode.orbitRadius * 3.5) * Math.cos((hoveredNode.angle * Math.PI) / 180)}
              y2={200 + (hoveredNode.orbitRadius * 2.2) * Math.sin((hoveredNode.angle * Math.PI) / 180)}
              stroke="#818CF8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Central Core: Macro Ecosystem */}
        <div 
          onClick={() => {
            navigateToTopicResearch('use-cases', 'Macro Indian AI Ecosystem');
            showToast('Opening full ecosystem synthesis');
          }}
          className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 p-0.5 shadow-2xl shadow-indigo-500/50 flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform"
        >
          <div className="absolute inset-0 rounded-full bg-indigo-400/20 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="w-full h-full rounded-full bg-[#0B1120] flex flex-col items-center justify-center p-2 text-center group-hover:bg-[#0B1120]/80 transition-colors">
            <Sparkles className="w-4 h-4 text-indigo-400 mb-0.5 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white leading-none">
              Macro AI
            </span>
            <span className="text-[9px] font-mono text-indigo-300 mt-0.5">
              Core Hub
            </span>
          </div>
        </div>

        {/* Orbiting Satellite Nodes */}
        {filteredNodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          // Calculate offset in percentage from center (50%, 50%)
          const xOffset = Math.cos(rad) * node.orbitRadius;
          const yOffset = Math.sin(rad) * (node.orbitRadius * 0.75); // slight perspective flattening
          const Icon = node.icon;
          const isHovered = hoveredNode?.id === node.id;

          return (
            <div
              key={node.id}
              style={{
                left: `calc(50% + ${xOffset}%)`,
                top: `calc(50% + ${yOffset}%)`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => {
                navigateToTopicResearch(node.id, node.name);
              }}
              className={`absolute z-20 cursor-pointer transition-all duration-300 ${
                isHovered ? 'scale-110 z-30' : 'hover:scale-105'
              }`}
            >
              {/* Node Circle */}
              <div className={`relative p-0.5 rounded-full bg-gradient-to-tr ${node.color} shadow-lg ${node.glow}`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950 flex items-center justify-center hover:bg-slate-900 transition-colors">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>

                {/* Node Mini Label Tag */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold border border-slate-700/80 shadow-md">
                  {node.name}
                </div>
              </div>
            </div>
          );
        })}

        {/* Hovered Node Floating Intelligence Card */}
        {hoveredNode && (
          <div className="absolute bottom-3 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-30 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 shadow-2xl space-y-2 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                {hoveredNode.category}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                {hoveredNode.growth}
              </span>
            </div>

            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{hoveredNode.name}</span>
            </h4>

            <div className="text-xs text-slate-300">
              Key Startups: <span className="text-indigo-200 font-semibold">{hoveredNode.startups.join(', ')}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                {hoveredNode.articlesCount} verified sources
              </span>
              <button
                onClick={() => navigateToTopicResearch(hoveredNode.id, hoveredNode.name)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Launch Research</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Universe Metric strip */}
      <div className="relative z-10 pt-3 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Total Active Clusters</span>
          <span className="text-sm font-bold text-white font-mono">8 Constellations</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Synthesized Papers</span>
          <span className="text-sm font-bold text-indigo-400 font-mono">142 Articles</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Capital Inflow</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">$420M Q1-Q3</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Model Engine</span>
          <span className="text-sm font-bold text-violet-300 font-mono">ContentHu Core v4.2</span>
        </div>
      </div>
    </div>
  );
};
