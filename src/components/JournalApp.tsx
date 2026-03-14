'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TreePine, Waves, Mountain, Send, Brain, 
  PieChart, History, Sparkles, Feather, 
  ChevronRight, Calendar, User, LayoutDashboard,
  Target
} from 'lucide-react';

type Entry = {
  id: string;
  userId: string;
  ambience: string;
  text: string;
  emotion: string;
  keywords: string[];
  summary: string;
  createdAt: string;
};

type Insights = {
  totalEntries: number;
  topEmotion: string;
  mostUsedAmbience: string;
  recentKeywords: string[];
};

export default function JournalApp() {
  const [userId, setUserId] = useState('demo-user-123');
  const [text, setText] = useState('');
  const [ambience, setAmbience] = useState('forest');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    fetchEntries();
    fetchInsights();
  }, [userId]);

  const fetchEntries = async () => {
    try {
      const res = await fetch(`/api/journal/${userId}`);
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await fetch(`/api/journal/insights/${userId}`);
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyzeOnly = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/journal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ambience, text }),
      });
      if (res.ok) {
        setText('');
        setAnalysisResult(null);
        await fetchEntries();
        await fetchInsights();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getThemeColor = () => {
    switch (ambience) {
      case 'forest': return 'emerald';
      case 'ocean': return 'blue';
      case 'mountain': return 'amber';
      default: return 'primary';
    }
  };

  const getAmbienceIcon = (a: string, size = 5) => {
    const className = `w-${size} h-${size}`;
    switch (a) {
      case 'forest': return <TreePine className={`${className} text-emerald-400`} />;
      case 'ocean': return <Waves className={`${className} text-blue-400`} />;
      case 'mountain': return <Mountain className={`${className} text-amber-400`} />;
      default: return null;
    }
  };

  const theme = getThemeColor();

  return (
    <div className="relative min-h-screen">
      <div className="bg-mesh" />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-950/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">Arvya<span className="text-primary">X</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400 mr-6">
            <a href="#" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="hover:text-white transition-colors">Community</a>
            <a href="#" className="hover:text-white transition-colors">Sessions</a>
          </div>
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="w-6 h-6 rounded-full bg-indigo-500 overflow-hidden flex items-center justify-center text-[10px] font-bold">
              JD
            </div>
            <span className="text-xs font-semibold text-slate-300">Jane Doe</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-14">
        
        {/* Left Column: Sidebar & Insights */}
        <aside className="lg:col-span-3 space-y-12">
          <section className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3 text-lg font-bold">
              <div className="p-2 rounded-lg bg-primary/10">
                <LayoutDashboard className="w-5 h-5 text-primary" />
              </div>
              <h2>Overview</h2>
            </div>

            {!insights ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl w-full" />)}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="group relative overflow-hidden p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="relative z-10">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Total Impact</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-4xl font-extrabold text-white">{insights.totalEntries}</span>
                       <span className="text-xs text-emerald-400 font-bold">sessions</span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Feather className="w-16 h-16" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-3">Dominant Aura</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center ring-1 ring-primary/40">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold capitalize text-white">{insights.topEmotion}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Emotional Balance</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-3">Recent Vibe</p>
                  <div className="flex flex-wrap gap-2">
                    {insights.recentKeywords.map(k => (
                      <span key={k} className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 group">
              View Detailed Metrics
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </section>
        </aside>

        {/* Middle Column: Composer */}
        <div className="lg:col-span-6 space-y-16">
          <section className="glass-card overflow-hidden p-[1px] rounded-[32px] group">
            <div className="bg-slate-950/80 p-10 space-y-10 rounded-[31px]">
              <div className="space-y-2">
                <h2 className="text-3xl font-black gradient-text">Reflection</h2>
                <p className="text-slate-500 text-sm font-medium">Deepen your connection with the environment.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Current Ambience</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['forest', 'ocean', 'mountain'] as const).map((a) => {
                      const isActive = ambience === a;
                      const themeColor = a === 'forest' ? 'emerald' : a === 'ocean' ? 'blue' : 'amber';
                      
                      return (
                        <button
                          key={a}
                          onClick={() => setAmbience(a)}
                          className={`group relative py-4 rounded-2xl border flex flex-col items-center gap-3 capitalize transition-all duration-500 overflow-hidden ${
                            isActive 
                              ? `bg-white/10 border-white/40 text-white ring-2 ring-white/10` 
                              : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                          }`}
                          style={isActive ? { borderColor: `var(--${a})`, color: `var(--${a})` } : {}}
                        >
                          {getAmbienceIcon(a, 6)}
                          <span className="text-xs font-bold">{a}</span>
                          {isActive && (
                            <motion.div 
                              layoutId="active-bg" 
                              className="absolute inset-0 -z-10"
                              style={{ background: `var(--${a}-glow)` }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Translate your session into words... How do you feel right now?"
                      className="w-full h-56 p-8 rounded-3xl bg-white/[0.03] border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none text-slate-100 placeholder:text-slate-600 resize-none transition-all text-lg leading-relaxed shadow-inner"
                    />
                    <div className="absolute bottom-6 right-6 flex items-center gap-2">
                       <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{text.length} characters</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !text.trim()}
                      className="flex-[2] py-5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 disabled:opacity-30 disabled:grayscale text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transform active:scale-95 transition-all"
                    >
                      {isSubmitting ? <Sparkles className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                      Sync With Soul
                    </button>
                    
                    <button
                      onClick={handleAnalyzeOnly}
                      disabled={isAnalyzing || !text.trim()}
                      className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl border border-white/10 flex items-center justify-center gap-3 transition-all backdrop-blur-md"
                    >
                      {isAnalyzing ? <Brain className="animate-pulse w-5 h-5 text-primary" /> : <Brain className="w-5 h-5 text-slate-400" />}
                      Deconstruct
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {analysisResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative overflow-hidden p-6 rounded-3xl bg-primary/10 border border-primary/20"
                  >
                    <div className="relative z-10 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                          <Brain className="w-4 h-4" />
                          <span>AI Synthesis</span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase ring-1 ring-primary/30">
                          {analysisResult.emotion}
                        </div>
                      </div>
                      
                      <p className="text-slate-300 text-base font-medium leading-relaxed italic">
                        "{analysisResult.summary}"
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {analysisResult.keywords?.map((k: string) => (
                          <span key={k} className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-slate-500 border border-white/5">
                            #{k}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="absolute -top-10 -right-10 opacity-20 transform rotate-12">
                       <Sparkles className="w-32 h-32 text-primary" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* History Section */}
          <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <History className="w-5 h-5 text-orange-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Journey Log</h2>
              </div>
              <button className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {entries.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="glass-card p-12 text-center rounded-[32px] border-dashed"
                  >
                    <Feather className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Your thoughts are waiting to be captured.</p>
                  </motion.div>
                ) : (
                  entries.map((entry, idx) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                      className="glass-card p-10 rounded-[32px] relative overflow-hidden group border-white/5 hover:border-white/20"
                    >
                      <div className="flex flex-col gap-8">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors`}>
                              {getAmbienceIcon(entry.ambience, 7)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-3 h-3 text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                  {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              <h3 className="text-xl font-extrabold text-white capitalize">{entry.ambience} Session</h3>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="px-4 py-1.5 rounded-full bg-white/5 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 group-hover:border-primary/30 transition-colors">
                              {entry.emotion}
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-300 text-lg font-medium leading-relaxed">
                          {entry.text}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
                          <div className="flex flex-wrap gap-2">
                            {entry.keywords.map(k => (
                              <span key={k} className="text-[10px] font-bold text-slate-500 bg-white/5 px-2.5 py-1 rounded-lg hover:text-white transition-colors cursor-default">
                                #{k}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 font-bold italic text-xs">
                             <Brain className="w-3 h-3" />
                             <span className="max-w-[200px] truncate">{entry.summary}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: User Profile & Quick Actions */}
        <aside className="lg:col-span-3 space-y-12 hidden lg:block">
          <section className="glass-card p-8 rounded-[32px] text-center space-y-6">
            <div className="relative mx-auto w-24 h-24">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary to-indigo-600 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform opacity-20" />
               <div className="relative bg-slate-900 rounded-3xl w-full h-full flex items-center justify-center p-1">
                  <div className="w-full h-full rounded-2xl bg-indigo-500 overflow-hidden flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
               </div>
               <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-slate-950" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">Jane Doe</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Master Wanderer</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xl font-bold text-white">12</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Streak</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xl font-bold text-white">2.4k</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">XP Points</p>
              </div>
            </div>

            <button className="w-full py-4 rounded-2xl bg-white/5 text-slate-300 font-bold text-sm border border-white/10 hover:bg-white/10 transition-all">
              Edit Spiritual Profile
            </button>
          </section>

          <section className="p-6 rounded-[32px] bg-gradient-to-br from-indigo-600 to-primary text-white space-y-6 shadow-2xl shadow-indigo-500/20">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-xl bg-white/20">
                 <Sparkles className="w-5 h-5" />
               </div>
               <h3 className="text-lg font-bold">Nature Quest</h3>
             </div>
             <p className="text-sm font-medium opacity-90">Unlock the 'Mountain Zen' badge by completing 3 forest sessions this week.</p>
             <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-white shadow-[0_0_10px_white]" />
             </div>
             <p className="text-[10px] font-black uppercase text-center tracking-widest">66% COMPLETED</p>
          </section>
        </aside>

      </main>
    </div>
  );
}
