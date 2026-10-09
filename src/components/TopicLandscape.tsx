import React, { useState } from 'react';
import { 
  Sparkles, 
  Workflow, 
  DollarSign, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  ListFilter, 
  Grid
} from 'lucide-react';
import { TOPIC_NODES, CENTRAL_TOPIC } from '../data/mockData';

interface TopicLandscapeProps {
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string | null) => void;
}

export const TopicLandscape: React.FC<TopicLandscapeProps> = ({
  selectedTopicId,
  onSelectTopic
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Workflow': return Workflow;
      case 'DollarSign': return DollarSign;
      case 'TrendingUp': return TrendingUp;
      case 'Cpu': return Cpu;
      case 'ShieldCheck': return ShieldCheck;
      case 'Users': return Users;
      case 'AlertTriangle': return AlertTriangle;
      default: return Sparkles;
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.75));
  const handleReset = () => {
    setZoomLevel(1);
    onSelectTopic(null);
  };

  // Center coordinate in percentage
  const centerX = 50;
  const centerY = 50;

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#FAFCFF] via-[#F5F3FF]/70 to-[#EEF2FF] border border-slate-200/90 shadow-sm overflow-hidden p-4 md:p-6 transition-all">
      {/* Top Landscape Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 z-20 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/10 border border-indigo-200 flex items-center justify-center">
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
                Topic Intelligence Landscape
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200">
                Interactive Graph
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {selectedTopicId 
                ? `Filtered by "${TOPIC_NODES.find(n => n.id === selectedTopicId)?.label}". Click node again to reset.` 
                : 'Click any node to isolate specific research articles and synthesized insights.'}
            </p>
          </div>
        </div>

        {/* View and Zoom controls */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-slate-200/80 shadow-xs">
          {/* Map vs List Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg mr-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === 'map' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 text-slate-600">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-indigo-600"
              title="Reset view & filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      {viewMode === 'map' ? (
        <div 
          className="relative w-full h-[460px] md:h-[500px] rounded-xl overflow-hidden bg-radial from-white via-[#F8FAFC]/90 to-[#EDF2F7]/50 border border-indigo-100/70 select-none flex items-center justify-center"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.12) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        >
          {/* Zoom container */}
          <div 
            className="w-full h-full relative transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* SVG Connecting lines layer */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="activeLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Connecting filaments from Center to 8 Nodes */}
              {TOPIC_NODES.map((node) => {
                const isSelected = selectedTopicId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isActive = isSelected || isHovered;

                return (
                  <g key={`connector-${node.id}`}>
                    <path
                      d={`M ${centerX}% ${centerY}% Q ${(centerX + node.xPercent) / 2}% ${(centerY + node.yPercent) / 2 + (node.yPercent > 50 ? 5 : -5)}%, ${node.xPercent}% ${node.yPercent}%`}
                      stroke={isActive ? 'url(#activeLineGrad)' : '#CBD5E1'}
                      strokeWidth={isActive ? 2.5 : 1.2}
                      strokeDasharray={isActive ? '4 4' : 'none'}
                      className={isActive ? 'animate-dash-flow' : ''}
                      fill="none"
                      opacity={selectedTopicId && !isActive ? 0.25 : 0.8}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Central Node */}
            <div 
              onClick={() => onSelectTopic(null)}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${centerX}%`, top: `${centerY}%` }}
            >
              {/* Outer soft glowing halo */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-pink-500/20 blur-md animate-soft-pulse" />
              
              <div className={`
                relative w-36 h-36 md:w-40 md:h-40 rounded-full
                bg-gradient-to-tr from-[#0F172A] via-[#1E1B4B] to-[#312E81]
                p-1 text-white text-center flex flex-col items-center justify-center
                border-2 border-indigo-400/80 shadow-2xl transition-all duration-300
                group-hover:scale-105 group-hover:border-indigo-300
                ${selectedTopicId === null ? 'ring-4 ring-indigo-400/40' : 'opacity-90'}
              `}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-400 flex items-center justify-center mb-1 shadow-md">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="font-extrabold text-[12px] md:text-[13px] leading-tight px-3 tracking-tight">
                  {CENTRAL_TOPIC.title}
                </div>
                <div className="mt-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-semibold text-indigo-200 border border-white/10">
                  <span>{CENTRAL_TOPIC.totalArticles} articles</span>
                  <span>•</span>
                  <span>{CENTRAL_TOPIC.totalFunding}</span>
                </div>
              </div>
            </div>

            {/* 8 Surrounding Topic Nodes */}
            {TOPIC_NODES.map((node) => {
              const isSelected = selectedTopicId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const Icon = getIcon(node.iconName);

              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => onSelectTopic(isSelected ? null : node.id)}
                  className={`
                    absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer
                    transition-all duration-300 ease-out
                    ${isSelected ? 'scale-110 z-20' : 'hover:scale-105'}
                    ${selectedTopicId && !isSelected ? 'opacity-40 hover:opacity-90' : 'opacity-100'}
                  `}
                  style={{ left: `${node.xPercent}%`, top: `${node.yPercent}%` }}
                >
                  {/* Outer pulse when selected */}
                  {isSelected && (
                    <div className="absolute -inset-2.5 rounded-full bg-indigo-500/30 blur-sm animate-ping" />
                  )}

                  <div className={`
                    relative w-24 h-24 md:w-28 md:h-28 rounded-full
                    bg-gradient-to-br ${node.color}
                    p-0.5 text-white flex flex-col items-center justify-center text-center
                    shadow-lg ${node.glowClass} border-2 border-white/80
                    ${isSelected ? 'ring-4 ring-indigo-500 ring-offset-2 ring-offset-white' : ''}
                  `}>
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1">
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    
                    <span className="font-bold text-[11px] md:text-[12px] leading-tight px-1.5 drop-shadow-xs">
                      {node.label}
                    </span>
                    
                    <span className="mt-0.5 text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-black/25 text-white/95">
                      {node.statLabel}
                    </span>
                  </div>

                  {/* Satellite Bubbles */}
                  <div className="hidden sm:block">
                    {node.satellites.slice(0, 2).map((sat, idx) => {
                      const offsetAngle = (idx === 0 ? -45 : 45);
                      const rad = (offsetAngle * Math.PI) / 180;
                      const dist = 52;
                      const satX = Math.cos(rad) * dist;
                      const satY = Math.sin(rad) * dist;

                      return (
                        <div
                          key={`sat-${node.id}-${idx}`}
                          className={`
                            absolute pointer-events-none transition-all duration-300
                            px-1.5 py-0.5 rounded-md text-[9px] font-semibold whitespace-nowrap
                            bg-white/95 text-slate-700 border border-slate-200/90 shadow-xs
                            ${isSelected || isHovered ? 'scale-100 opacity-100 text-indigo-900 border-indigo-200 bg-indigo-50/95 font-bold' : 'scale-90 opacity-75'}
                          `}
                          style={{
                            transform: `translate(${satX}px, ${satY}px)`,
                            left: '50%',
                            top: '50%',
                          }}
                        >
                          {sat}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Floating Legend / Tip */}
          <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between text-[11px] text-slate-500 pointer-events-none z-10">
            <span className="bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-200/70 shadow-xs">
              ⚡ 8 clusters identified • 248 validated Indian AI sources
            </span>
            {selectedTopicId && (
              <button 
                onClick={() => onSelectTopic(null)}
                className="pointer-events-auto bg-slate-900 text-white font-semibold px-2.5 py-1 rounded-lg shadow-xs hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <span>Clear Selection</span>
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* List View alternative */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {TOPIC_NODES.map((node) => {
            const isSelected = selectedTopicId === node.id;
            const Icon = getIcon(node.iconName);

            return (
              <div
                key={node.id}
                onClick={() => onSelectTopic(isSelected ? null : node.id)}
                className={`
                  p-3.5 rounded-xl border transition-all duration-200 cursor-pointer text-left
                  ${isSelected
                    ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-300 shadow-md'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${node.color} flex items-center justify-center text-white shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {node.statLabel}
                  </span>
                </div>
                <h4 className="text-[13px] font-bold text-slate-900 mb-1">
                  {node.label}
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight mb-2.5 line-clamp-2">
                  {node.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {node.satellites.slice(0, 3).map((sat) => (
                    <span key={sat} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {sat}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
