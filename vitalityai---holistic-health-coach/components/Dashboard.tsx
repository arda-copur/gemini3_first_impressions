import React, { useState, useEffect } from 'react';
import { HealthPlanResponse, Language } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, Flame, Droplets, Utensils, Dumbbell, MessageCircle, X, ShoppingCart, Check, Heart, Sun, Moon, Leaf } from 'lucide-react';
import { chatWithCoach } from '../services/geminiService';
import { translations } from '../utils/translations';

interface DashboardProps {
  plan: HealthPlanResponse;
  onReset: () => void;
  language: Language;
}

const COLORS = ['#f97316', '#14b8a6', '#f59e0b']; // Orange, Teal, Amber

const Dashboard: React.FC<DashboardProps> = ({ plan, onReset, language }) => {
  const [activeTab, setActiveTab] = useState<'diet' | 'workout' | 'wellness'>('diet');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  // Interactive State
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [showShoppingList, setShowShoppingList] = useState(false);

  const t = translations[language];

  // Update initial chat message when language changes
  useEffect(() => {
    setChatMessages([{ role: 'model', text: t.chat_welcome }]);
  }, [language]);

  const macroData = [
    { name: t.protein, value: plan.dietPlan.macros.protein },
    { name: t.carbs, value: plan.dietPlan.macros.carbs },
    { name: t.fats, value: plan.dietPlan.macros.fats },
  ];

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
        const historyForApi = chatMessages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));
        const reply = await chatWithCoach(historyForApi, userMsg, language);
        setChatMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (err) {
        setChatMessages(prev => [...prev, { role: 'model', text: t.chat_error }]);
    } finally {
        setChatLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      
      {/* Welcome / Summary Header */}
      <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500 rounded-3xl shadow-xl shadow-orange-200/50 text-white p-8 md:p-10 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-0 opacity-10 pointer-events-none">
            <Sun className="w-64 h-64 -mr-10 -mt-10" />
        </div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">{t.dash_title}</h1>
                <button onClick={onReset} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all">
                    {t.start_new}
                </button>
            </div>
            <p className="text-orange-50 text-lg leading-relaxed max-w-3xl">{plan.summary}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                 <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <div className="text-orange-100 text-sm font-medium mb-1 flex items-center gap-2">
                        <Flame className="w-4 h-4" /> Daily Energy
                    </div>
                    <div className="text-2xl font-bold">{plan.dietPlan.dailyCalories} <span className="text-base font-normal opacity-80">kcal</span></div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <div className="text-blue-100 text-sm font-medium mb-1 flex items-center gap-2">
                        <Droplets className="w-4 h-4" /> Water Goal
                    </div>
                    <div className="text-2xl font-bold">{plan.dietPlan.hydrationGoal}</div>
                </div>
                 <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <div className="text-teal-100 text-sm font-medium mb-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Schedule
                    </div>
                    <div className="text-2xl font-bold">{plan.workoutPlan.weeklySchedule.length} <span className="text-base font-normal opacity-80">days/wk</span></div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col justify-center items-center">
                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{t.dash_focus}</span>
                    <span className="text-lg font-semibold text-white text-center leading-tight mt-1">
                        {plan.workoutPlan.weeklySchedule[0]?.focusArea || "Wellness"}
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {[
            { id: 'diet', label: t.tab_diet, icon: Utensils, color: 'text-orange-600' },
            { id: 'workout', label: t.tab_workout, icon: Dumbbell, color: 'text-teal-600' },
            { id: 'wellness', label: t.tab_wellness, icon: Heart, color: 'text-pink-600' },
        ].map((tab) => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-heading font-bold text-lg transition-all duration-300 ${
                    activeTab === tab.id 
                    ? 'bg-white shadow-lg scale-105 text-stone-800 ring-1 ring-stone-100' 
                    : 'bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-stone-600'
                }`}
            >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : 'text-stone-400'}`} />
                {tab.label}
            </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
      {activeTab === 'diet' && (
        <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Meals */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-heading font-bold text-stone-800">{t.menu_title}</h3>
                    <button 
                        onClick={() => setShowShoppingList(!showShoppingList)}
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium bg-orange-50 px-4 py-2 rounded-full transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4" /> {showShoppingList ? t.hide_list : t.shopping_list}
                    </button>
                </div>

                {showShoppingList && (
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-6 animate-slide-down">
                        <h4 className="font-bold text-orange-800 mb-4 flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> {t.weekly_essentials}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {plan.dietPlan.shoppingList?.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-orange-900/80 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> {item}
                                </div>
                            )) || <p className="text-stone-500 text-sm col-span-3">Shopping list not available.</p>}
                        </div>
                    </div>
                )}

                {plan.dietPlan.meals.map((meal, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow border border-stone-100">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-2">
                            <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                {idx === 0 && <Sun className="w-5 h-5 text-orange-400" />}
                                {idx === 1 && <Sun className="w-5 h-5 text-yellow-500" />}
                                {idx === 2 && <Moon className="w-5 h-5 text-indigo-400" />}
                                {meal.name}
                            </h3>
                            <span className="bg-stone-100 text-stone-600 px-4 py-1.5 rounded-full text-sm font-bold">
                                {meal.totalCalories} kcal
                            </span>
                        </div>
                        <div className="space-y-4">
                            {meal.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-stone-50 pb-3 last:border-0 last:pb-0">
                                    <div className="flex flex-col">
                                        <span className="text-stone-800 font-semibold">{item.name}</span>
                                        <span className="text-stone-500 text-sm">{item.portion}</span>
                                    </div>
                                    <span className="text-stone-400 text-sm font-medium">{item.calories}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Right: Stats & Hydration */}
            <div className="lg:col-span-1 space-y-8">
                {/* Hydration Tracker */}
                <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 text-center">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center justify-center gap-2">
                        <Droplets className="w-5 h-5" /> {t.water_tracker}
                    </h3>
                    <div className="flex justify-center gap-2 flex-wrap mb-4">
                        {[...Array(8)].map((_, i) => (
                            <button 
                                key={i}
                                onClick={() => setWaterGlasses(prev => prev === i + 1 ? i : i + 1)}
                                className={`w-8 h-10 rounded-md border-2 transition-all ${
                                    i < waterGlasses 
                                    ? 'bg-blue-500 border-blue-500 shadow-lg shadow-blue-200' 
                                    : 'bg-white border-blue-200 hover:border-blue-300'
                                }`}
                            ></button>
                        ))}
                    </div>
                    <p className="text-blue-800 font-medium">{waterGlasses * 250}ml / {plan.dietPlan.hydrationGoal}</p>
                </div>

                {/* Macros */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                    <h3 className="text-lg font-bold text-stone-800 mb-2 text-center">{t.macro_balance}</h3>
                    <div className="h-64 w-full relative">
                         {/* Center Text */}
                         <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-xs text-stone-400 font-bold uppercase">{t.total}</span>
                            <span className="text-2xl font-bold text-stone-700">{plan.dietPlan.dailyCalories}</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={macroData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {macroData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between px-2">
                        <div className="text-center">
                            <div className="w-3 h-3 rounded-full bg-orange-500 mx-auto mb-1"></div>
                            <div className="text-xs text-stone-400 uppercase font-bold">{t.protein}</div>
                            <div className="font-bold text-stone-700">{plan.dietPlan.macros.protein}g</div>
                        </div>
                        <div className="text-center">
                            <div className="w-3 h-3 rounded-full bg-teal-500 mx-auto mb-1"></div>
                            <div className="text-xs text-stone-400 uppercase font-bold">{t.carbs}</div>
                            <div className="font-bold text-stone-700">{plan.dietPlan.macros.carbs}g</div>
                        </div>
                        <div className="text-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 mx-auto mb-1"></div>
                            <div className="text-xs text-stone-400 uppercase font-bold">{t.fats}</div>
                            <div className="font-bold text-stone-700">{plan.dietPlan.macros.fats}g</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'workout' && (
        <div className="space-y-8 animate-fade-in">
             {/* Warmup & Recovery Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-teal-50 p-8 rounded-3xl border border-teal-100">
                    <h3 className="font-heading font-bold text-teal-900 text-lg mb-3 flex items-center gap-2">
                        <Flame className="w-5 h-5" /> {t.warmup}
                    </h3>
                    <p className="text-teal-800/80 leading-relaxed">{plan.workoutPlan.recommendedWarmup}</p>
                </div>
                <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
                    <h3 className="font-heading font-bold text-indigo-900 text-lg mb-3 flex items-center gap-2">
                        <Moon className="w-5 h-5" /> {t.recovery}
                    </h3>
                    <p className="text-indigo-800/80 leading-relaxed">{plan.workoutPlan.recoveryAdvice}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plan.workoutPlan.weeklySchedule.map((day, idx) => (
                    <div key={idx} className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="bg-stone-900 text-white p-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-heading font-bold text-xl">{day.dayName}</h3>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                    {day.durationMinutes} min
                                </span>
                            </div>
                            <p className="text-teal-400 font-medium mt-2 flex items-center gap-2">
                                <Dumbbell className="w-4 h-4" /> {day.focusArea}
                            </p>
                        </div>
                        <div className="p-6 flex-grow bg-white">
                            <ul className="space-y-5">
                                {day.exercises.map((ex, i) => (
                                    <li key={i} className="border-b border-stone-100 last:border-0 pb-4 last:pb-0">
                                        <div className="flex justify-between font-bold text-stone-800 mb-1">
                                            <span className="text-base">{ex.name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm items-center">
                                            <span className="text-stone-500 italic text-xs max-w-[60%]">{ex.notes || 'Keep good form'}</span>
                                            {/* Smart Logic to remove N/A */}
                                            <span className="bg-stone-100 text-stone-700 px-2 py-1 rounded-md font-semibold text-xs">
                                                {ex.type === 'cardio' || ex.type === 'flexibility' || !ex.sets 
                                                    ? (ex.duration || 'As needed') 
                                                    : `${ex.sets} sets × ${ex.reps}`
                                                }
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'wellness' && (
          <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
              <div className="bg-gradient-to-r from-pink-100 to-orange-100 p-10 rounded-[3rem] text-center relative overflow-hidden">
                  <Leaf className="w-40 h-40 absolute -bottom-10 -left-10 text-white opacity-40" />
                  <Leaf className="w-40 h-40 absolute -top-10 -right-10 text-white opacity-40 rotate-180" />
                  
                  <h3 className="text-stone-500 font-bold uppercase tracking-widest text-sm mb-4">{t.mantra}</h3>
                  <p className="text-3xl md:text-4xl font-heading font-bold text-stone-800 italic leading-tight">
                    "{plan.wellnessPlan?.dailyMantra || "I am capable of achieving balance and health."}"
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
                    <h3 className="font-heading font-bold text-xl text-stone-800 mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-500" /> {t.mindfulness}
                    </h3>
                    <div className="p-4 bg-pink-50 rounded-2xl text-pink-900 font-medium">
                        {plan.wellnessPlan?.mindfulnessActivity || "Try 5 minutes of box breathing."}
                    </div>
                    <p className="mt-4 text-stone-500 leading-relaxed text-sm">
                        Taking a moment to center yourself reduces cortisol levels and improves workout recovery.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
                    <h3 className="font-heading font-bold text-xl text-stone-800 mb-4 flex items-center gap-2">
                        <Moon className="w-5 h-5 text-indigo-500" /> {t.sleep}
                    </h3>
                    <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-900 font-medium">
                        {plan.wellnessPlan?.sleepAdvice || "No screens 1 hour before bed."}
                    </div>
                     <p className="mt-4 text-stone-500 leading-relaxed text-sm">
                        Recovery happens when you sleep. Prioritize your rest as much as your reps.
                    </p>
                </div>
              </div>
          </div>
      )}
      </div>

      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 bg-stone-900 text-white p-4 rounded-full shadow-2xl shadow-stone-400/50 hover:bg-stone-800 hover:scale-110 transition-all z-50 group"
      >
        <MessageCircle className="w-7 h-7 group-hover:animate-bounce" />
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-6">
            <div className="bg-white w-full sm:max-w-md h-[85vh] sm:h-[600px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up border border-stone-100">
                <div className="bg-stone-900 text-white p-5 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold font-heading flex items-center gap-2 text-lg">{t.chat_coach}</h3>
                        <span className="text-stone-400 text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> {t.chat_online}</span>
                    </div>
                    <button onClick={() => setIsChatOpen(false)} className="hover:text-stone-300 bg-white/10 p-2 rounded-full transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-stone-50 scrollbar-hide">
                    {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-orange-500 text-white rounded-tr-sm' 
                                : 'bg-white text-stone-700 border border-stone-100 rounded-tl-sm'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {chatLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-stone-100 p-4 rounded-2xl rounded-tl-sm text-sm flex gap-1 items-center text-stone-400">
                                <span className="animate-bounce">●</span><span className="animate-bounce delay-100">●</span><span className="animate-bounce delay-200">●</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-white border-t border-stone-100">
                    <div className="flex gap-2 relative">
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={t.chat_placeholder}
                            className="flex-grow p-3 pl-4 pr-12 bg-stone-100 border-transparent rounded-xl focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={chatLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// Little helper icon for the input
const ArrowRight = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

export default Dashboard;