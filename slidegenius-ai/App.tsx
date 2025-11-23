import React, { useState } from 'react';
import { Layout, Sparkles, Zap } from 'lucide-react';
import { InputForm } from './components/InputForm';
import { SlidePreview } from './components/SlidePreview';
import { AppState, GeneratedPresentation, PresentationConfig } from './types';
import { generatePresentationContent, generateImage, generateSlidesWithImages } from './services/geminiService';
import { createPDF } from './services/pdfService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [presentationData, setPresentationData] = useState<GeneratedPresentation | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const handleGenerate = async (config: PresentationConfig) => {
    try {
      setAppState('generating_structure');
      setStatusMessage('Analyzing topic and structuring presentation...');
      setProgress(10);
      
      // 1. Generate Text Content
      let slides = await generatePresentationContent(config);
      setProgress(40);

      let coverImageBase64: string | undefined = undefined;

      // 2. Generate Images (Cover + Slides)
      if (config.includeImages) {
        setAppState('generating_images');
        
        // Start Cover Generation
        const coverPromise = generateImage(`Abstract, professional background image about ${config.topic}`, "16:9");
        
        // Start Slide Images Generation (Batch)
        setStatusMessage('Designing smart visuals for slides...');
        const slidesPromise = generateSlidesWithImages(slides, config.topic);

        // Wait for both
        const [coverResult, slidesResult] = await Promise.all([coverPromise, slidesPromise]);
        
        coverImageBase64 = coverResult;
        slides = slidesResult;
        setProgress(90);
      }

      setPresentationData({
        topic: config.topic,
        theme: config.theme,
        slides,
        coverImageBase64
      });

      setProgress(100);
      setAppState('ready');
    } catch (error) {
      console.error(error);
      setAppState('error');
      setStatusMessage('An error occurred while creating your presentation. Please try again.');
    }
  };

  const handleDownload = () => {
    if (presentationData) {
      createPDF(presentationData);
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setPresentationData(null);
    setStatusMessage('');
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-dark bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e1b4b] via-dark to-black text-white font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-dark/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={handleReset}
          >
            <div className="bg-gradient-to-br from-primary to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
              <Layout className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-tight">SlideGenius <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-sans font-black italic">AI</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-400 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
            Powered by Gemini 2.5 Pro & Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 relative">
        
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

        {/* Hero Section (Only visible when idle) */}
        {appState === 'idle' && (
          <div className="text-center mb-16 space-y-6 animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-sm font-medium backdrop-blur-md">
              <Sparkles size={14} />
              <span>Next-Gen Presentation Builder</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 pb-4 leading-tight">
              Turn Ideas into Impactful <br /> Presentations Instantly
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Describe your topic, choose a style, and let our AI craft a professional slide deck with structured content, themes, and custom visuals.
            </p>
          </div>
        )}

        {/* Dynamic Content Area */}
        <div className="transition-all duration-500 ease-in-out min-h-[50vh]">
          
          {appState === 'idle' && (
            <InputForm onSubmit={handleGenerate} isLoading={false} />
          )}

          {(appState === 'generating_structure' || appState === 'generating_images') && (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-8 animate-fade-in">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-800 stroke-current"
                    strokeWidth="6"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-primary stroke-current transition-all duration-1000 ease-out"
                    strokeWidth="6"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * progress) / 100}
                    transform="rotate(-90 50 50)"
                  ></circle>
                </svg>
                <Sparkles className="absolute inset-0 m-auto text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" size={36} />
              </div>
              <div className="text-center space-y-3 max-w-md">
                <h3 className="text-3xl font-bold text-white font-serif">AI is Working</h3>
                <p className="text-indigo-200 text-lg animate-pulse">{statusMessage}</p>
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {appState === 'ready' && presentationData && (
            <SlidePreview presentation={presentationData} onDownload={handleDownload} />
          )}

          {appState === 'error' && (
             <div className="max-w-lg mx-auto text-center bg-red-500/10 border border-red-500/20 p-10 rounded-3xl backdrop-blur-sm">
               <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Zap size={32} className="text-red-400" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Generation Failed</h3>
               <p className="text-gray-400 mb-8">{statusMessage}</p>
               <button 
                 onClick={handleReset}
                 className="bg-white text-dark px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
               >
                 Try Again
               </button>
             </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20 py-10 text-center">
        <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
          &copy; {new Date().getFullYear()} SlideGenius AI. <span className="w-1 h-1 rounded-full bg-gray-600"></span> Crafted with Google Gemini API.
        </p>
      </footer>
    </div>
  );
};

export default App;