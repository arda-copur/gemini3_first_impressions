import React from 'react';
import { GeneratedPresentation } from '../types';
import { Download, CheckCircle, ImageIcon } from 'lucide-react';

interface Props {
  presentation: GeneratedPresentation;
  onDownload: () => void;
}

export const SlidePreview: React.FC<Props> = ({ presentation, onDownload }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Success Banner */}
      <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center gap-4 text-green-400 backdrop-blur-sm">
        <div className="bg-green-500/20 p-2 rounded-full">
          <CheckCircle size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg">Presentation Ready!</h3>
          <p className="text-sm opacity-80">Your content and visuals have been generated. Review below and download PDF.</p>
        </div>
      </div>

      {/* Header & Download */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-8">
        <div>
           <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">{presentation.topic}</h2>
           <span className="inline-block mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
             Theme: {presentation.theme}
           </span>
        </div>
        
        <button
          onClick={onDownload}
          className="flex items-center gap-2 bg-white text-dark px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] transform hover:scale-105"
        >
          <Download size={20} />
          Download PDF
        </button>
      </div>

      {/* Cover Preview */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-gray-700 group">
         {presentation.coverImageBase64 ? (
           <img 
             src={`data:image/png;base64,${presentation.coverImageBase64}`} 
             alt="Presentation Cover" 
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
           />
         ) : (
           <div className="w-full h-full bg-gradient-to-br from-primary to-purple-900"></div>
         )}
         
         <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8 text-center backdrop-blur-[2px]">
           <h1 className="text-5xl md:text-6xl font-bold text-white font-serif drop-shadow-2xl mb-4">
             {presentation.topic}
           </h1>
           <p className="text-white/80 text-lg font-light tracking-widest uppercase">
             Created with SlideGenius AI
           </p>
         </div>
         
         <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white border border-white/10 flex items-center gap-2">
           <ImageIcon size={12} /> Cover Slide
         </div>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 gap-8">
        {presentation.slides.map((slide, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-6 bg-surface/50 border border-white/5 p-6 rounded-2xl hover:bg-surface/80 transition-colors">
            
            {/* Content Side */}
            <div className="flex-1 space-y-4">
               <div className="flex items-center gap-3 mb-2">
                 <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                   {idx + 1}
                 </span>
                 <h3 className="text-2xl font-bold text-white">{slide.title}</h3>
               </div>
               
               <ul className="space-y-3 pl-2">
                {slide.content.map((point, i) => (
                  <li key={i} className="flex gap-3 text-gray-300">
                    <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>

              {slide.footerNote && (
                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500 italic">
                  Note: {slide.footerNote}
                </div>
              )}
            </div>

            {/* Visual Side (If Image Exists) */}
            {slide.imageBase64 && (
               <div className="w-full md:w-1/3 shrink-0">
                 <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/10 relative">
                    <img 
                      src={`data:image/png;base64,${slide.imageBase64}`} 
                      className="w-full h-full object-cover"
                      alt={`Slide ${idx + 1} visual`}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white backdrop-blur-sm">
                      AI Generated
                    </div>
                 </div>
                 <p className="text-[10px] text-gray-500 mt-2 line-clamp-1 text-center px-2">
                   Prompt: {slide.visualDescription}
                 </p>
               </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};