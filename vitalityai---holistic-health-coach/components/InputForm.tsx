import React, { useState } from 'react';
import { ActivityLevel, Gender, Goal, UserProfile, Language } from '../types';
import { ArrowRight, Activity, User, CheckCircle2, Sparkles } from 'lucide-react';
import { translations } from '../utils/translations';

interface InputFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
  language: Language;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, language }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    age: 28,
    gender: Gender.Female,
    height: 165,
    weight: 60,
    goal: Goal.Maintain,
    activityLevel: ActivityLevel.ModeratelyActive,
    dietaryPreferences: '',
    equipment: '',
  });

  const t = translations[language];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  
  const handleSubmit = () => {
    onSubmit(profile);
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl shadow-orange-100/50 overflow-hidden border border-stone-100">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-32 h-32" />
        </div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-2xl font-heading font-bold">{t.step_header}</h2>
            <p className="text-orange-50 text-sm mt-1">
              {step === 1 ? t.step_1_title : step === 2 ? t.step_2_title : t.step_3_title}
            </p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 bg-white">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2 font-heading">
              <span className="bg-orange-100 text-orange-500 p-2 rounded-lg"><User className="w-5 h-5" /></span>
              {t.step_1_title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-stone-600 mb-2">{t.label_gender}</label>
                <div className="relative">
                    <select 
                    className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-orange-400 focus:ring-0 outline-none appearance-none transition-colors"
                    value={profile.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    >
                    {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">▼</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-2">{t.label_age}</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-orange-400 focus:ring-0 outline-none transition-colors"
                  value={profile.age}
                  onChange={(e) => updateField('age', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-2">{t.label_height}</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-orange-400 focus:ring-0 outline-none transition-colors"
                  value={profile.height}
                  onChange={(e) => updateField('height', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-2">{t.label_weight}</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-orange-400 focus:ring-0 outline-none transition-colors"
                  value={profile.weight}
                  onChange={(e) => updateField('weight', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2 font-heading">
                <span className="bg-orange-100 text-orange-500 p-2 rounded-lg"><Activity className="w-5 h-5" /></span>
                {t.step_2_title}
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-3">{t.label_focus}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.values(Goal).map((g) => (
                  <button
                    key={g}
                    onClick={() => updateField('goal', g)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all duration-200 ${
                      profile.goal === g 
                      ? 'border-orange-400 bg-orange-50 text-orange-700 shadow-sm scale-[1.02]' 
                      : 'border-stone-100 hover:border-orange-200 text-stone-500 bg-stone-50'
                    }`}
                  >
                    <span className="font-medium block">{t.goals[g]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-3">{t.label_activity}</label>
              <select 
                className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-orange-400 focus:ring-0 outline-none transition-colors"
                value={profile.activityLevel}
                onChange={(e) => updateField('activityLevel', e.target.value)}
              >
                {Object.values(ActivityLevel).map(a => (
                  <option key={a} value={a}>{t.activities[a]}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2 font-heading">
                <span className="bg-orange-100 text-orange-500 p-2 rounded-lg"><CheckCircle2 className="w-5 h-5" /></span>
                {t.step_3_title}
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-2">{t.label_diet}</label>
              <input 
                type="text" 
                placeholder={t.placeholder_diet}
                className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-orange-400 focus:ring-0 outline-none transition-colors"
                value={profile.dietaryPreferences}
                onChange={(e) => updateField('dietaryPreferences', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-2">{t.label_equipment}</label>
              <input 
                type="text" 
                placeholder={t.placeholder_equipment}
                className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-orange-400 focus:ring-0 outline-none transition-colors"
                value={profile.equipment}
                onChange={(e) => updateField('equipment', e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-between items-center">
          {step > 1 ? (
            <button 
              onClick={handleBack}
              className="px-6 py-3 text-stone-500 font-semibold hover:text-stone-800 transition-colors"
            >
              {t.back}
            </button>
          ) : <div></div>}

          {step < 3 ? (
            <button 
              onClick={handleNext}
              className="bg-stone-900 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 hover:shadow-xl hover:-translate-y-1"
            >
              {t.next} <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:shadow-orange-200/50 hover:shadow-xl transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? t.loading : t.generate} <Sparkles className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputForm;