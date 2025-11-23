import React, { useState } from 'react';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';
import { HealthPlanResponse, UserProfile, Language } from './types';
import { generateHealthPlan } from './services/geminiService';
import { Sparkles, Leaf, Heart, Zap, Globe, XCircle } from 'lucide-react';
import { translations } from './utils/translations';

const App: React.FC = () => {
  const [plan, setPlan] = useState<HealthPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];

  const handleFormSubmit = async (profile: UserProfile) => {
    setLoading(true);
    setError(null);
    try {
      const generatedPlan = await generateHealthPlan(profile, language);
      setPlan(generatedPlan);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Application Error:", err);
      setError(t.error_generic);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 selection:bg-orange-100 selection:text-orange-900 relative">
      
      {/* Fixed Error Toast */}
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg animate-slide-down">
            <div className="bg-red-50 border-2 border-red-100 text-red-700 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                <XCircle className="w-6 h-6 flex-shrink-0" />
                <p className="font-medium">{error}</p>
                <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 p-1">
                    <span className="sr-only">Close</span>
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-2 rounded-xl shadow-lg shadow-orange-200">
                <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold text-stone-900 tracking-tight">Vitality<span className="text-orange-500">AI</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8 text-sm font-semibold text-stone-500">
                <a href="#" className="hover:text-orange-500 transition-colors">{t.nav_wellness}</a>
                <a href="#" className="hover:text-orange-500 transition-colors">{t.nav_nutrition}</a>
                <a href="#" className="hover:text-orange-500 transition-colors">{t.nav_movement}</a>
            </div>
            
            {/* Language Selector */}
            <div className="relative group">
                <button className="flex items-center gap-2 text-stone-600 hover:text-orange-600 font-medium px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors">
                    <Globe className="w-4 h-4" />
                    <span className="uppercase">{language}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-stone-100 opacity-0 group-hover:opacity-100 invisible group-hover:visible transform group-hover:translate-y-0 translate-y-2 transition-all duration-200 overflow-hidden z-50">
                    {(['en', 'de', 'tr', 'fr', 'it'] as Language[]).map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center justify-between ${language === lang ? 'bg-orange-50 text-orange-600' : 'text-stone-600'}`}
                        >
                            {lang === 'en' && 'English'}
                            {lang === 'de' && 'Deutsch'}
                            {lang === 'tr' && 'Türkçe'}
                            {lang === 'fr' && 'Français'}
                            {lang === 'it' && 'Italiano'}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="p-4 sm:p-6 lg:p-8">
        {!plan ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
            <div className="text-center mb-12 max-w-3xl relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
              
              <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4 border border-orange-200">
                {t.landing_badge}
              </span>
              <h1 className="text-5xl sm:text-6xl font-heading font-extrabold text-stone-900 mb-6 leading-tight tracking-tight">
                {t.landing_title}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500">{t.landing_subtitle}</span>
              </h1>
              <p className="text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
                {t.landing_desc}
              </p>
            </div>
            
            <InputForm onSubmit={handleFormSubmit} isLoading={loading} language={language} />

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-5xl">
                <div className="text-center p-6 rounded-3xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all">
                    <div className="bg-orange-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="font-heading font-bold text-stone-800 text-lg">{t.feature_nutrition}</h3>
                    <p className="text-stone-500 mt-2">{t.feature_nutrition_desc}</p>
                </div>
                <div className="text-center p-6 rounded-3xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all">
                    <div className="bg-teal-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Leaf className="w-6 h-6 text-teal-500" />
                    </div>
                    <h3 className="font-heading font-bold text-stone-800 text-lg">{t.feature_growth}</h3>
                    <p className="text-stone-500 mt-2">{t.feature_growth_desc}</p>
                </div>
                <div className="text-center p-6 rounded-3xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-all">
                    <div className="bg-pink-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-6 h-6 text-pink-500" />
                    </div>
                    <h3 className="font-heading font-bold text-stone-800 text-lg">{t.feature_chat}</h3>
                    <p className="text-stone-500 mt-2">{t.feature_chat_desc}</p>
                </div>
            </div>
          </div>
        ) : (
          <Dashboard plan={plan} onReset={handleReset} language={language} />
        )}
      </main>
    </div>
  );
};

export default App;