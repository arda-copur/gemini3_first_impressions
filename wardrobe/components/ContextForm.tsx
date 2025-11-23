import React from 'react';
import { MapPin, Calendar, Clock, Heart, GlassWater } from 'lucide-react';
import { CuratorParams } from '../types';

interface ContextFormProps {
  params: CuratorParams;
  onChange: (params: CuratorParams) => void;
}

export const ContextForm: React.FC<ContextFormProps> = ({ params, onChange }) => {
  
  const handleChange = (key: keyof CuratorParams, value: string) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div className="space-y-8 p-8 bg-white border border-stone-100 shadow-sm">
      <h3 className="font-serif text-2xl italic text-stone-800 mb-6">Event Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Location */}
        <div className="space-y-2 group">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 group-focus-within:text-black transition-colors">
            <MapPin size={14} /> Location (City)
          </label>
          <input 
            type="text" 
            value={params.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g. Paris, France"
            className="w-full border-b border-stone-200 py-2 bg-transparent focus:outline-none focus:border-black transition-colors placeholder:font-serif placeholder:italic placeholder:text-stone-300"
          />
        </div>

        {/* Date */}
        <div className="space-y-2 group">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 group-focus-within:text-black transition-colors">
            <Calendar size={14} /> Date
          </label>
          <input 
            type="date" 
            value={params.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full border-b border-stone-200 py-2 bg-transparent focus:outline-none focus:border-black transition-colors font-serif"
          />
        </div>

        {/* Time */}
        <div className="space-y-2 group">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 group-focus-within:text-black transition-colors">
            <Clock size={14} /> Time of Day
          </label>
          <select 
            value={params.time}
            onChange={(e) => handleChange('time', e.target.value)}
            className="w-full border-b border-stone-200 py-2 bg-transparent focus:outline-none focus:border-black transition-colors font-serif appearance-none cursor-pointer"
          >
            <option value="Morning">Morning / Brunch</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Late Night">Late Night</option>
          </select>
        </div>

        {/* Relationship/Company */}
        <div className="space-y-2 group">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 group-focus-within:text-black transition-colors">
            <Heart size={14} /> Company / Status
          </label>
          <select 
            value={params.relationshipStatus}
            onChange={(e) => handleChange('relationshipStatus', e.target.value)}
            className="w-full border-b border-stone-200 py-2 bg-transparent focus:outline-none focus:border-black transition-colors font-serif appearance-none cursor-pointer"
          >
             <option value="First Date">First Date</option>
             <option value="Partner/Spouse">Partner / Spouse</option>
             <option value="Business Meeting">Business Meeting</option>
             <option value="Friends">Friends / Casual</option>
             <option value="Solo">Solo / Self-Care</option>
          </select>
        </div>

        {/* Occasion */}
        <div className="md:col-span-2 space-y-2 group">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 group-focus-within:text-black transition-colors">
            <GlassWater size={14} /> Specific Occasion
          </label>
          <input 
            type="text" 
            value={params.occasion}
            onChange={(e) => handleChange('occasion', e.target.value)}
            placeholder="e.g. Anniversary Dinner at a rooftop bar, Job Interview, Gallery Opening..."
            className="w-full border-b border-stone-200 py-2 bg-transparent focus:outline-none focus:border-black transition-colors placeholder:font-serif placeholder:italic placeholder:text-stone-300"
          />
        </div>

      </div>
    </div>
  );
};
