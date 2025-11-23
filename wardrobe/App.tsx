import React, { useState } from 'react';
import { Loader2, Sparkles, Shirt, Camera, ArrowRight, ChevronLeft, CloudSun } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { ContextForm } from './components/ContextForm';
import { generateVirtualTryOn, generateStyleAdvice, generateContextualAdvice } from './services/wardrobeService';
import { AppView, CuratorParams, CuratorResult } from './types';

const App: React.FC = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ image?: string; advice?: string; curator?: CuratorResult } | null>(null);
  const [mode, setMode] = useState<AppView>('try-on');
  
  // Curator State
  const [curatorParams, setCuratorParams] = useState<CuratorParams>({
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: 'Evening',
    occasion: '',
    relationshipStatus: 'First Date'
  });

  const handleTryOn = async () => {
    if (!userImage || !garmentImage) return;
    setIsGenerating(true);
    setResult(null);
    try {
      const res = await generateVirtualTryOn(userImage, garmentImage);
      setResult({ image: res.imageUrl });
    } catch (e) {
      alert("Something went wrong in the atelier. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdvice = async () => {
    if (!userImage) return;
    setIsGenerating(true);
    setResult(null);
    try {
      const res = await generateStyleAdvice(userImage);
      setResult({ advice: res.text });
    } catch (e) {
      alert("Our stylist is currently busy. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCurator = async () => {
    if (!userImage || !curatorParams.location || !curatorParams.occasion) {
      alert("Please provide your photo, location, and occasion details.");
      return;
    }
    setIsGenerating(true);
    setResult(null);
    try {
      const res = await generateContextualAdvice(userImage, curatorParams);
      setResult({ curator: res });
    } catch (e) {
       console.error(e);
      alert("Could not connect to the concierge service. Please check your connection.");
    } finally {
      setIsGenerating(false);
    }
  }

  const reset = () => {
    setResult(null);
  };
  
  const getButtonLabel = () => {
    if (mode === 'try-on') return 'Visualize Fit';
    if (mode === 'advice') return 'Generate Lookbook';
    return 'Curate Outfit';
  };

  return (
    <div className="min-h-screen w-full bg-[#FDFBF7] text-[#1A1A1A] selection:bg-stone-200">
      
      {/* Navigation / Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center glass-panel border-b-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-black text-white flex items-center justify-center rounded-sm font-serif font-bold text-xl">W</div>
          <span className="font-serif text-2xl font-medium tracking-tight">Wardrobe.</span>
        </div>
        <div className="flex gap-4 md:gap-8 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
          <button 
            onClick={() => setMode('try-on')}
            className={`pb-1 transition-all ${mode === 'try-on' ? 'border-b border-black text-black' : 'text-stone-400 hover:text-black'}`}
          >
            Atelier
          </button>
          <button 
            onClick={() => setMode('advice')}
            className={`pb-1 transition-all ${mode === 'advice' ? 'border-b border-black text-black' : 'text-stone-400 hover:text-black'}`}
          >
            Stylist
          </button>
          <button 
            onClick={() => setMode('curator')}
            className={`pb-1 transition-all ${mode === 'curator' ? 'border-b border-black text-black' : 'text-stone-400 hover:text-black'}`}
          >
            Curator
          </button>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto">
        
        {/* VIEW: RESULT GENERATED */}
        {result ? (
           <div className="fade-in min-h-[70vh] grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 flex flex-col justify-center space-y-8">
                <div>
                   <button onClick={() => setResult(null)} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-black mb-6 transition-colors">
                      <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Studio
                   </button>
                   <h1 className="font-serif text-5xl md:text-6xl italic leading-[1.1] mb-4">The <br/>Edit</h1>
                   <p className="text-stone-500 max-w-xs font-light leading-relaxed">
                     {mode === 'try-on' && "A bespoke visualization of your selection. The fabric flow and fit have been re-imagined."}
                     {mode === 'advice' && "Curated suggestions based on your personal aesthetic signature."}
                     {mode === 'curator' && "A hyper-personalized outfit recipe for your specific event and forecast."}
                   </p>
                </div>

                {/* Curator specific result info */}
                {result.curator && (
                  <div className="bg-stone-100 p-4 border border-stone-200">
                    <div className="flex items-center gap-2 mb-2 text-stone-500">
                      <CloudSun size={16} />
                      <span className="text-xs font-bold tracking-widest uppercase">Forecast</span>
                    </div>
                    <p className="font-serif italic text-lg">{result.curator.weather}</p>
                  </div>
                )}

                {/* Text Content */}
                {(result.advice || result.curator?.outfitDescription) && (
                   <div className="prose prose-stone prose-p:font-light prose-headings:font-serif prose-li:font-light max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                     <div dangerouslySetInnerHTML={{ 
                       __html: (result.advice || result.curator?.outfitDescription || '').replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                     }} />
                   </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button onClick={reset} className="flex-1 py-4 border border-stone-200 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                    Start Over
                  </button>
                </div>
              </div>

              <div className="lg:col-span-8 relative bg-white p-4 shadow-2xl rotate-1 transition-transform hover:rotate-0 duration-700">
                 <div className="w-full h-full min-h-[500px] bg-stone-100 flex items-center justify-center overflow-hidden">
                    {(result.image || result.curator?.visualUrl) ? (
                      <img src={result.image || result.curator?.visualUrl} alt="Generated Result" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-12">
                         <Sparkles size={48} className="mx-auto text-stone-300 mb-4" />
                         <p className="font-serif text-2xl italic text-stone-400">Style Plan Created</p>
                         <p className="text-xs text-stone-300 mt-2 uppercase tracking-widest">No visualization generated</p>
                      </div>
                    )}
                 </div>
                 <div className="absolute bottom-8 right-8 bg-white/80 backdrop-blur px-4 py-2 text-[10px] font-bold tracking-widest uppercase">
                    Generated by Gemini
                 </div>
              </div>
           </div>

        ) : (
          
        /* VIEW: STUDIO INPUT */
          <div className="fade-in">
            <div className="text-center mb-12 space-y-4">
               <h2 className="font-serif text-5xl md:text-7xl text-[#1A1A1A]">
                 {mode === 'try-on' && 'Virtual Atelier'}
                 {mode === 'advice' && 'Style Identity'}
                 {mode === 'curator' && 'Event Curator'}
               </h2>
               <p className="text-stone-500 font-light tracking-wide">
                 {mode === 'try-on' && "Upload your photo and a garment to visualize the fit."}
                 {mode === 'advice' && "Let our AI analyze your profile and suggest your next aesthetic."}
                 {mode === 'curator' && "Outfit planning based on weather, venue, and occasion."}
               </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start max-w-6xl mx-auto relative">
              
              {/* Left: User Photo (Always present) */}
              <div className="space-y-6 lg:sticky lg:top-32">
                 <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold tracking-widest uppercase text-stone-400">01. The Muse</span>
                    <Camera size={16} className="text-stone-400" />
                 </div>
                 <ImageUploader 
                   label="Your Photo" 
                   image={userImage} 
                   onUpload={setUserImage} 
                   onClear={() => setUserImage(null)}
                   aspectRatio="aspect-[3/4]"
                 />
                 <p className="text-xs text-stone-400 text-center font-light">High resolution, good lighting recommended.</p>
              </div>

              {/* Right: Dynamic Inputs based on Mode */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold tracking-widest uppercase text-stone-400">
                        {mode === 'try-on' ? '02. The Piece' : '02. The Context'}
                      </span>
                      <Shirt size={16} className="text-stone-400" />
                  </div>

                  {mode === 'try-on' && (
                    <>
                      <ImageUploader 
                        label="Garment Photo" 
                        image={garmentImage} 
                        onUpload={setGarmentImage} 
                        onClear={() => setGarmentImage(null)}
                        aspectRatio="aspect-[3/4]"
                      />
                      <p className="text-xs text-stone-400 text-center font-light">Flat lay or mannequin photos preferred.</p>
                    </>
                  )}

                  {mode === 'advice' && (
                     <div className="h-[400px] flex items-center justify-center p-12 border border-dashed border-stone-200 bg-stone-50/50 rounded-sm">
                        <div className="text-center space-y-4">
                           <Sparkles size={32} className="mx-auto text-stone-300" />
                           <h3 className="font-serif text-2xl italic">AI Stylist</h3>
                           <p className="text-sm text-stone-500 font-light leading-relaxed max-w-xs mx-auto">
                             Based on your uploaded photo, we will generate 3 unique style personas and outfit recipes tailored to your vibe.
                           </p>
                        </div>
                     </div>
                  )}

                  {mode === 'curator' && (
                    <ContextForm params={curatorParams} onChange={setCuratorParams} />
                  )}

              </div>

            </div>

            {/* Action Bar */}
            <div className="mt-16 flex justify-center pb-24">
              <button
                onClick={() => {
                  if (mode === 'try-on') handleTryOn();
                  if (mode === 'advice') handleAdvice();
                  if (mode === 'curator') handleCurator();
                }}
                disabled={isGenerating || !userImage || (mode === 'try-on' && !garmentImage)}
                className="group relative overflow-hidden bg-[#1A1A1A] text-white px-16 py-6 transition-all disabled:bg-stone-200 disabled:cursor-not-allowed hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="relative z-10 flex items-center gap-3">
                   {isGenerating ? (
                     <>
                       <Loader2 className="animate-spin" size={18} />
                       <span className="text-sm font-bold tracking-[0.2em] uppercase">Processing...</span>
                     </>
                   ) : (
                     <>
                       <span className="text-sm font-bold tracking-[0.2em] uppercase">
                         {getButtonLabel()}
                       </span>
                       <Sparkles size={16} className="group-hover:text-yellow-200 transition-colors" />
                     </>
                   )}
                </div>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-6 w-full text-center pointer-events-none z-10">
        <p className="text-[10px] font-bold tracking-widest text-stone-300 uppercase">
          Wardrobe Application • v2.2 • Powered by Gemini
        </p>
      </footer>

    </div>
  );
};

export default App;
