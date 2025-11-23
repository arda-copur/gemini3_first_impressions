import React, { useState } from 'react';
import { DetailLevel, Tone, PresentationConfig, Theme } from '../types';
import { Wand2, FileText, Layers, Image as ImageIcon, Type, Palette, LayoutTemplate } from 'lucide-react';

interface Props {
  onSubmit: (config: PresentationConfig) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>(DetailLevel.Standard);
  const [pageCount, setPageCount] = useState(6);
  const [tone, setTone] = useState<Tone>(Tone.Professional);
  const [theme, setTheme] = useState<Theme>(Theme.Modern);
  const [includeImages, setIncludeImages] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmit({ topic, detailLevel, pageCount, tone, theme, includeImages });
  };

  // Theme visualization helper
  const getThemeColor = (t: Theme) => {
    switch(t) {
      case Theme.Modern: return 'bg-blue-600';
      case Theme.Minimal: return 'bg-gray-200';
      case Theme.Corporate: return 'bg-slate-800';
      case Theme.Creative: return 'bg-gradient-to-br from-purple-500 to-pink-500';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-surface/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Topic Input */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
            <FileText size={16} className="text-primary" />
            Presentation Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The Future of AI in Healthcare"
            className="w-full bg-dark/50 border border-gray-600 rounded-xl px-5 py-4 text-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-inner"
            disabled={isLoading}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Configuration Column */}
          <div className="space-y-6">
            {/* Page Count */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                <Layers size={16} className="text-secondary" />
                Length: {pageCount} Slides
              </label>
              <input
                type="range"
                min="4"
                max="12"
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                disabled={isLoading}
              />
            </div>

            {/* Detail Level */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                <LayoutTemplate size={16} className="text-blue-400" />
                Detail Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(DetailLevel).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDetailLevel(level)}
                    disabled={isLoading}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                      detailLevel === level 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-dark border-gray-600 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                <Type size={16} className="text-pink-500" />
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full bg-dark/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary outline-none"
                disabled={isLoading}
              >
                {Object.values(Tone).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Styling Column */}
          <div className="space-y-6">
             {/* Theme Selector */}
             <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                <Palette size={16} className="text-green-400" />
                Visual Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(Theme).map((t) => (
                  <div 
                    key={t}
                    onClick={() => !isLoading && setTheme(t)}
                    className={`cursor-pointer relative rounded-xl border-2 overflow-hidden transition-all h-16 flex items-end p-2 ${
                      theme === t ? 'border-primary ring-2 ring-primary/20' : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className={`absolute inset-0 opacity-30 ${getThemeColor(t)}`}></div>
                    <span className="relative z-10 font-medium text-sm text-white">{t}</span>
                    {theme === t && <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Image Toggle */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                <ImageIcon size={16} className="text-yellow-500" />
                Smart Visuals
              </label>
              <div 
                onClick={() => !isLoading && setIncludeImages(!includeImages)}
                className={`group flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  includeImages 
                  ? 'bg-primary/10 border-primary' 
                  : 'bg-dark/50 border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex flex-col">
                   <span className={`font-medium ${includeImages ? 'text-white' : 'text-gray-400'}`}>Auto-Generate Images</span>
                   <span className="text-xs text-gray-500">Creates cover & slide illustrations</span>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 flex transition-colors ${includeImages ? 'bg-primary justify-end' : 'bg-gray-700 justify-start'}`}>
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-5 rounded-2xl font-bold text-lg tracking-wide shadow-xl transform transition-all duration-200 
            ${isLoading ? 'bg-gray-700 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-primary to-indigo-600 hover:scale-[1.01] hover:shadow-primary/30 text-white'}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              <span>Crafting Presentation...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Wand2 size={22} />
              <span>Generate Presentation</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};