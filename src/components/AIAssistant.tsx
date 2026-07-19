import React, { useState } from 'react';
import { Button, Input, Loader, toast } from './ui';
import { Bot, Map, Home } from 'lucide-react';

const parseInline = (text: string): React.ReactNode[] => {
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  return boldParts.flatMap((part, bIdx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`b-${bIdx}`} className="font-bold text-stone-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    
    const italicParts = part.split(/(\*.*?\*)/g);
    return italicParts.map((subPart, iIdx) => {
      if (subPart.startsWith('*') && subPart.endsWith('*')) {
        return (
          <em key={`i-${bIdx}-${iIdx}`} className="italic text-stone-700 dark:text-stone-300">
            {subPart.slice(1, -1)}
          </em>
        );
      }
      return subPart;
    });
  });
};

const renderMarkdown = (content: string) => {
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`ul-${listKey++}`} className="list-disc pl-6 my-4 space-y-2 text-stone-700 dark:text-stone-350 text-base md:text-lg">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      flushList();
      renderedElements.push(
        <h1 key={`h1-${i}`} className="text-2xl md:text-3xl font-bold text-emerald-850 dark:text-emerald-450 mt-6 mb-4 font-serif leading-tight">
          {parseInline(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList();
      renderedElements.push(
        <h2 key={`h2-${i}`} className="text-xl md:text-2xl font-bold text-stone-850 dark:text-stone-100 mt-6 mb-3 font-serif border-b border-emerald-900/5 dark:border-emerald-500/5 pb-2 leading-snug">
          {parseInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      flushList();
      renderedElements.push(
        <h3 key={`h3-${i}`} className="text-lg md:text-xl font-bold text-stone-800 dark:text-stone-250 mt-5 mb-2 leading-snug">
          {parseInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const contentText = trimmed.startsWith('* ') ? trimmed.slice(2) : trimmed.slice(2);
      currentList.push(
        <li key={`li-${i}`} className="leading-relaxed pl-1 text-stone-700 dark:text-stone-350">
          {parseInline(contentText)}
        </li>
      );
    } else if (trimmed === '---') {
      flushList();
      renderedElements.push(<hr key={`hr-${i}`} className="my-6 border-stone-200 dark:border-stone-800" />);
    } else if (trimmed === '') {
      continue;
    } else {
      flushList();
      renderedElements.push(
        <p key={`p-${i}`} className="my-4 leading-relaxed text-stone-700 dark:text-stone-300 text-base md:text-lg">
          {parseInline(line)}
        </p>
      );
    }
  }
  flushList();

  return <div className="space-y-1">{renderedElements}</div>;
};

export const AIAssistant: React.FC = () => {
  const [taskType, setTaskType] = useState<'itinerary' | 'recommendation'>('itinerary');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_type: taskType, prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      toast.error('Failed to get AI assistance. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-stone-50/90 via-white to-emerald-50/20 dark:from-gray-900/90 dark:via-gray-900 dark:to-emerald-950/10 p-8 rounded-3xl border border-emerald-900/10 dark:border-emerald-500/10 shadow-[0_15px_40px_rgba(4,120,87,0.03)] hover:shadow-[0_15px_40px_rgba(4,120,87,0.06)] transition-all duration-500 backdrop-blur-md">
      
      {/* Header with Glowing indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 shadow-inner">
          <Bot className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-serif text-stone-850 dark:text-white tracking-wide">Trishul AI Concierge</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 tracking-wider uppercase font-semibold">Your Personal Himalayan Guide</p>
        </div>
      </div>

      {/* Segmented Control Pill Switcher */}
      <div className="p-1 bg-stone-105 dark:bg-gray-800/80 rounded-2xl flex gap-1 mb-8 max-w-md border border-stone-200/50 dark:border-gray-700/50 shadow-inner">
        <button
          type="button"
          onClick={() => setTaskType('itinerary')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
            taskType === 'itinerary'
              ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-sm transform scale-[1.01]'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-750 dark:hover:text-stone-200'
          }`}
        >
          <Map className={`w-4 h-4 transition-transform duration-300 ${taskType === 'itinerary' ? 'rotate-3 scale-110' : ''}`} />
          Plan Itinerary
        </button>
        <button
          type="button"
          onClick={() => setTaskType('recommendation')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
            taskType === 'recommendation'
              ? 'bg-white dark:bg-gray-700 text-emerald-800 dark:text-emerald-300 shadow-sm transform scale-[1.01]'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-750 dark:hover:text-stone-200'
          }`}
        >
          <Home className={`w-4 h-4 transition-transform duration-300 ${taskType === 'recommendation' ? 'rotate-3 scale-110' : ''}`} />
          Get Recommendation
        </button>
      </div>

      {/* Interactive Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold tracking-wide text-stone-700 dark:text-stone-300 uppercase">
            {taskType === 'itinerary' 
              ? "How many days and what are your interests?" 
              : "What is your ideal vacation vibe?"}
          </label>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={taskType === 'itinerary' 
              ? "e.g., 3 days, hiking and local food" 
              : "e.g., quiet, remote, sustainable"}
            disabled={loading}
            className="w-full bg-white/60 dark:bg-gray-900/60 border border-stone-200 dark:border-gray-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl transition-all duration-300"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={loading || !prompt.trim()} 
          className={`w-full py-4 rounded-2xl text-base font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
            loading || !prompt.trim()
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed dark:bg-gray-800 dark:text-stone-600 shadow-none'
              : 'bg-gradient-to-r from-emerald-700 to-green-800 text-white hover:from-emerald-800 hover:to-green-900 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-emerald-700/10 dark:shadow-emerald-950/20'
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <Loader size="sm" className="text-current" />
              Crafting Response...
            </span>
          ) : (
            "Consult AI Concierge"
          )}
        </Button>
      </form>

      {/* Parchment styled response container */}
      {result && (
        <div className="mt-8 p-6 md:p-8 bg-gradient-to-br from-emerald-50/20 via-stone-50/40 to-emerald-50/10 dark:from-emerald-950/5 dark:via-gray-900/40 dark:to-emerald-950/10 rounded-3xl border border-emerald-900/10 dark:border-emerald-500/10 shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-900/5 dark:border-emerald-500/10">
            <Bot className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-emerald-850 dark:text-emerald-350 text-sm uppercase tracking-widest font-serif">
              {taskType === 'itinerary' ? 'Your Curated Itinerary' : 'Homestay Recommendation'}
            </h3>
          </div>
          <div className="text-stone-800 dark:text-stone-200">
            {renderMarkdown(result)}
          </div>
        </div>
      )}
    </div>
  );
};
