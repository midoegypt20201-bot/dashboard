/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { rawData } from '../constants';

interface CategoryTabProps {
  status: 'excellent' | 'good' | 'low';
  currentYear: string;
  setYear: (y: string) => void;
  getStatus: (val: number, year: string) => 'excellent' | 'good' | 'low' | 'upcoming';
}

export default function CategoryTab({ status, currentYear, setYear, getStatus }: CategoryTabProps) {
  const [openGoals, setOpenGoals] = useState<Record<string, boolean>>({});

  const toggleGoal = (gCode: string) => {
    setOpenGoals(prev => ({ ...prev, [gCode]: !prev[gCode] }));
  };

  const statusMap = { 'excellent': 'الممتازة', 'good': 'الجيدة', 'low': 'المنخفضة' };
  
  const filtered = rawData.map(g => {
    const yD = (g.years as any)[currentYear];
    if (!yD) return null;
    if (getStatus(yD.p, currentYear) === status) {
      // Filter indicators to only show those that match the current tab's status
      const mk = yD.k.filter((k: any) => getStatus(k.p, currentYear) === status);
      return { ...g, mk, tP: yD.p };
    }
    return null;
  }).filter(g => g !== null && g.mk.length > 0) as any[];

  return (
    <div className="space-y-12">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-10 bg-white rounded-[45px] border-r-[12px] shadow-premium relative overflow-hidden ${
          status === 'excellent' ? 'border-secondary' : 
          status === 'good' ? 'border-amber-500' : 'border-red-500'
        }`}
      >
        <div className="relative z-10">
          <h2 className="text-slate-900 text-3xl font-black mb-8">الأهداف ذات الأداء {statusMap[status]} لعام {currentYear}</h2>
          <div className="flex flex-wrap gap-3">
            {['2023', '2024', '2025', '2026'].map(y => (
              <button 
                key={y}
                onClick={() => setYear(y)}
                className={`px-8 py-3 rounded-2xl text-base font-black transition-all duration-300 ${
                  y === currentYear 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:scale-105'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-slate-50 rounded-full blur-3xl"></div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.length === 0 ? (
          <div className="p-20 text-center bg-white rounded-[45px] text-slate-400 font-bold text-xl border border-slate-100 shadow-sm">
            لا توجد أهداف إجمالي أدائها "{statusMap[status]}" لعام {currentYear}.
          </div>
        ) : (
          filtered.map((g, idx) => {
            const isGoalOpen = !!openGoals[g.code];
            
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-[40px] border border-slate-100 shadow-premium overflow-hidden group hover:shadow-hover transition-all duration-500"
              >
                <button 
                  onClick={() => toggleGoal(g.code)}
                  className="w-full p-8 flex justify-between items-center hover:bg-slate-50/80 transition-colors text-right"
                >
                  <div className="flex items-center gap-6">
                    <span className="bg-primary text-white text-sm font-black px-4 py-2 rounded-xl shadow-md shadow-primary/10">{g.code}</span>
                    <span className="font-black text-2xl text-slate-800 leading-tight group-hover:text-primary transition-colors">{g.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <span className={`text-4xl font-display font-black ${
                        status === 'excellent' ? 'text-secondary' : 
                        status === 'good' ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {g.tP}%
                      </span>
                      <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">الإنجاز الكلي</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isGoalOpen ? 180 : 0 }}
                      className={`p-3 rounded-full transition-colors ${isGoalOpen ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </motion.div>
                  </div>
                </button>
                <AnimatePresence>
                  {isGoalOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 pt-2">
                         <div className="bg-slate-50/50 rounded-[35px] border border-slate-100 p-6 overflow-hidden">
                          <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full border-collapse">
                                <thead>
                                  <tr className="border-b-2 border-slate-200/50">
                                    <th className="p-4 text-right text-slate-400 font-black text-sm uppercase tracking-wider">المؤشر الاستراتيجي</th>
                                    <th className="p-4 text-center text-slate-400 font-black text-sm uppercase tracking-wider">المستهدف</th>
                                    <th className="p-4 text-center text-slate-400 font-black text-sm uppercase tracking-wider">المحقق</th>
                                    <th className="p-4 text-center text-slate-400 font-black text-sm uppercase tracking-wider">نسبة الإنجاز</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100/50">
                                  {g.mk.map((k: any, ki: number) => (
                                    <tr key={ki} className="hover:bg-white/50 transition-colors">
                                      <td className="p-5 text-right text-primary-dark font-black text-lg leading-relaxed max-w-sm">{k.n}</td>
                                      <td className="p-5 text-center font-display font-bold text-xl text-slate-600">{k.t}</td>
                                      <td className="p-5 text-center font-display font-bold text-xl text-slate-600">{k.a}</td>
                                      <td className={`p-5 text-center font-display font-black text-2xl ${
                                        status === 'excellent' ? 'text-secondary' : 
                                        status === 'good' ? 'text-amber-500' : 'text-red-500'
                                      }`}>
                                        {k.p}%
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
