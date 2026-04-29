/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { rawData, pillarData } from '../constants';

interface YearTabProps {
  year: string;
  getStatus: (val: number, year: string) => 'excellent' | 'good' | 'low' | 'upcoming';
}

export default function YearTab({ year, getStatus }: YearTabProps) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openGoals, setOpenGoals] = useState<Record<string, boolean>>({});

  const togglePillar = (p: string) => {
    setOpenPillars(prev => ({ ...prev, [p]: !prev[p] }));
  };

  const toggleGoal = (gCode: string) => {
    setOpenGoals(prev => ({ ...prev, [gCode]: !prev[gCode] }));
  };

  return (
    <div className="space-y-8">
      {Object.keys(pillarData).map((p, i) => {
        const pPerf = (pillarData as any)[p][year];
        const pStatus = getStatus(pPerf, year);

        const pGoals = rawData.filter(g => {
          const yD = (g.years as any)[year];
          if (!yD) return false;
          const activePillar = yD.pOverride || g.pillar;
          return activePillar === p;
        }).sort((a, b) => {
          const aD = (a.years as any)[year];
          const bD = (b.years as any)[year];
          const aStatus = getStatus(aD.p, year);
          const bStatus = getStatus(bD.p, year);
          if (aStatus === 'upcoming' && bStatus !== 'upcoming') return 1;
          if (aStatus !== 'upcoming' && bStatus === 'upcoming') return -1;
          return 0;
        });

        if (pGoals.length === 0) return null;

        const isPillarOpen = !!openPillars[p];

        return (
          <motion.div 
            key={p} 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[45px] border border-slate-100 shadow-premium overflow-hidden group hover:shadow-hover transition-all duration-500"
          >
            <button 
              onClick={() => togglePillar(p)}
              className="w-full p-8 flex justify-between items-center hover:bg-slate-50/50 transition-colors text-right"
            >
              <div className="flex items-center gap-6">
                <div className={`w-4 h-4 rounded-full shadow-lg ${
                  pStatus === 'excellent' ? 'bg-secondary animate-pulse' : 
                  pStatus === 'good' ? 'bg-amber-500' : 
                  pStatus === 'low' ? 'bg-red-500' : 'bg-cyan-500'
                }`} />
                <span className="text-2xl font-black text-slate-800">{p}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className={`text-3xl font-display font-black leading-none ${
                    pStatus === 'excellent' ? 'text-secondary' : 
                    pStatus === 'good' ? 'text-amber-500' : 
                    pStatus === 'low' ? 'text-red-500' : 'text-cyan-500'
                  }`}>
                    {year === '2026' && pPerf === 0 ? '0%' : pPerf.toFixed(2) + '%'}
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">الإنجاز الكلي</span>
                </div>
                <div className={`p-2.5 rounded-full transition-all duration-300 ${isPillarOpen ? 'bg-primary text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                  <ChevronDown className="w-5 h-5 stroke-[3]" />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isPillarOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="bg-slate-50/30"
                >
                  <div className="p-8 space-y-6">
                    {pGoals.map((g, gi) => {
                      const yData = (g.years as any)[year];
                      const gStatus = getStatus(yData.p, year);
                      const isGoalOpen = !!openGoals[g.code];

                      return (
                        <motion.div 
                          key={g.code} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: gi * 0.05 }}
                          className="bg-white border border-slate-100 rounded-[35px] overflow-hidden shadow-sm hover:shadow-md transition-shadow group/goal"
                        >
                          <button 
                            onClick={() => toggleGoal(g.code)}
                            className="w-full p-6 flex justify-between items-center hover:bg-slate-50 transition-colors text-right"
                          >
                            <div className="flex items-center gap-4">
                              <span className="bg-primary-light text-primary-dark text-xs font-black px-3 py-1.5 rounded-xl border border-primary/10">{g.code}</span>
                              <div className="flex flex-col">
                                <span className="font-black text-lg text-slate-700 leading-tight group-hover/goal:text-primary transition-colors">
                                  {g.name}
                                  {gStatus === 'upcoming' && (
                                    <span className="text-cyan-600 mr-2 text-sm font-bold bg-cyan-50 px-2 py-0.5 rounded-lg"> - لم يحن استحقاقه</span>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`font-display font-black text-xl ${
                                gStatus === 'excellent' ? 'text-secondary' : 
                                gStatus === 'good' ? 'text-amber-500' : 
                                gStatus === 'low' ? 'text-red-500' : 'text-cyan-500'
                              }`}>
                                {yData.p}%
                              </span>
                              <ChevronDown className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${isGoalOpen ? 'rotate-180 text-primary' : ''}`} />
                            </div>
                          </button>

                          <AnimatePresence>
                            {isGoalOpen && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-slate-50 bg-slate-50/50"
                              >
                                <div className="p-6">
                                  <div className="bg-white rounded-[25px] border border-slate-100 overflow-hidden">
                                    <div className="overflow-x-auto no-scrollbar">
                                      <table className="w-full border-collapse">
                                        <thead>
                                          <tr className="bg-slate-50/80">
                                            <th className="p-4 text-right text-slate-400 font-black text-[10px] uppercase tracking-wider pr-6">المؤشر</th>
                                            <th className="p-4 text-center text-slate-400 font-black text-[10px] uppercase tracking-wider">المستهدف</th>
                                            <th className="p-4 text-center text-slate-400 font-black text-[10px] uppercase tracking-wider">المحقق</th>
                                            <th className="p-4 text-center text-slate-400 font-black text-[10px] uppercase tracking-wider pl-6">الإنجاز</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                          {yData.k.map((k: any, ki: number) => (
                                            <tr key={ki} className="hover:bg-slate-50/50 transition-colors">
                                              <td className="p-4 text-right pr-6 text-slate-700 font-bold text-base leading-relaxed">{k.n}</td>
                                              <td className="p-4 text-center font-display font-bold text-lg text-slate-500">{k.t}</td>
                                              <td className="p-4 text-center font-display font-bold text-lg text-slate-500">{k.a}</td>
                                              <td className={`p-4 text-center font-display font-black text-xl pl-6 ${
                                                getStatus(k.p, year) === 'excellent' ? 'text-secondary' : 
                                                getStatus(k.p, year) === 'good' ? 'text-amber-500' : 'text-red-500'
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
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
