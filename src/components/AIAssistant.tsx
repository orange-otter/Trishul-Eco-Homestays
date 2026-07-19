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
        <ul key={`ul-${listKey++}`} className="list-disc pl-6 my-4 space-y-2 text-stone-700 dark:text-stone-300 text-base md:text-lg">
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
        <h1 key={`h1-${i}`} className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-400 mt-6 mb-4 font-serif leading-tight">
          {parseInline(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList();
      renderedElements.push(
        <h2 key={`h2-${i}`} className="text-xl md:text-2xl font-bold text-stone-800 dark:text-stone-100 mt-6 mb-3 font-serif border-b border-stone-200 dark:border-stone-800 pb-2 leading-snug">
          {parseInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      flushList();
      renderedElements.push(
        <h3 key={`h3-${i}`} className="text-lg md:text-xl font-bold text-stone-850 dark:text-stone-250 mt-5 mb-2 leading-snug">
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
      <div className="flex items-center gap-2 mb-6">
        <Bot className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-stone-800">Eco-Assistant</h2>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setTaskType('itinerary')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            taskType === 'itinerary' 
              ? 'bg-green-100 text-green-800 border-2 border-green-500' 
              : 'bg-stone-50 text-stone-600 border-2 border-transparent hover:bg-stone-100'
          }`}
        >
          <Map className="w-4 h-4" />
          Plan Itinerary
        </button>
        <button
          type="button"
          onClick={() => setTaskType('recommendation')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            taskType === 'recommendation' 
              ? 'bg-green-100 text-green-800 border-2 border-green-500' 
              : 'bg-stone-50 text-stone-600 border-2 border-transparent hover:bg-stone-100'
          }`}
        >
          <Home className="w-4 h-4" />
          Get Recommendation
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
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
          />
        </div>
        
        <Button type="submit" disabled={loading || !prompt.trim()} className="w-full">
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <Loader size="sm" />
              Thinking...
            </span>
          ) : (
            "Ask Assistant"
          )}
        </Button>
      </form>

      {result && (
        <div className="mt-8 p-6 md:p-8 bg-stone-50/50 dark:bg-stone-900/50 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-md">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
            <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h3 className="font-bold text-stone-800 dark:text-stone-100 text-base uppercase tracking-wider font-serif">
              {taskType === 'itinerary' ? 'Your Curated Itinerary' : 'Homestay Recommendation'}
            </h3>
          </div>
          <div className="text-stone-700 dark:text-stone-200">
            {renderMarkdown(result)}
          </div>
        </div>
      )}
    </div>
  );
};
