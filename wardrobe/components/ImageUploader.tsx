import React, { useRef } from 'react';
import { Plus, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  image: string | null;
  onUpload: (file: string) => void;
  onClear: () => void;
  aspectRatio?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onUpload, onClear, aspectRatio = 'aspect-[3/4]' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="group relative w-full">
      <div className={`relative w-full ${aspectRatio} overflow-hidden rounded-none border border-stone-200 bg-stone-50 transition-all duration-500 hover:border-stone-400 ${image ? 'shadow-xl' : ''}`}>
        
        {image ? (
          <>
            <img src={image} alt={label} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            <button 
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-stone-900 shadow-sm backdrop-blur-md transition-transform hover:scale-110"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center text-stone-400 hover:text-stone-600"
          >
            <div className="mb-4 rounded-full border border-dashed border-stone-300 p-6 transition-transform group-hover:scale-105">
              <Plus size={24} className="stroke-1" />
            </div>
            <span className="font-serif text-lg italic tracking-wide text-stone-500">{label}</span>
            <span className="mt-2 text-xs font-light uppercase tracking-widest opacity-60">Tap to Upload</span>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
      
      {/* Decorative Corners */}
      <div className="absolute -left-1 -top-1 h-4 w-4 border-l border-t border-stone-300 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute -right-1 -bottom-1 h-4 w-4 border-r border-b border-stone-300 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
};
