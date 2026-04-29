/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { overallProgressData, rawData } from '../constants';

interface OverallProgressTabProps {
  getStatus: (val: number, year: string) => 'excellent' | 'good' | 'low' | 'upcoming';
}

const PILLARS = ['الكل', 'بعد المستفيدين', 'بعد أصحاب المصلحة', 'البعد المالي', 'بعد العمليات الداخلية', 'بعد التعلم والنمو'];

export default function OverallProgressTab({ getStatus }: OverallProgressTabProps) {
  const [filter, setFilter] = useState('الكل');

  const filteredData = filter === 'الكل' 
    ? overallProgressData 
    : overallProgressData.filter(d => d.pillar === filter);

  return (
    <div className="space-y-12">
      <div className="bg-white p-10 rounded-[50px] shadow-premium border border-slate-100 text-center relative overflow-hidden">
        <h2 className="text-slate-800 text-3xl font-black mb-8 relative z-10">مستوى تقدم الأهداف الاستراتيجية (2023-2026)</h2>
        
        <div className="flex flex-wrap gap-3 justify-center relative z-10">
          {PILLARS.map(p => (
            <button 
              key={p}
              onClick={() => setFilter(p)}
              className={`px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${
                filter === p 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredData.map((item, idx) => {
          const status = getStatus(item.p, '2024'); 
          const color = status === 'excellent' ? 'var(--color-secondary)' : (status === 'good' ? 'var(--color-amber-500)' : 'var(--color-red-500)');
          
          const goalDetails = rawData.find(g => g.name === item.n);
          const years = ['2023', '2024', '2025', '2026'];
          
          return (
            <div key={idx} className="bg-white p-8 rounded-[45px] border border-slate-100 shadow-premium flex flex-col gap-8 hover:shadow-hover hover:-translate-y-1 transition-all duration-500">
              <div className="flex justify-between items-start gap-6">
                <div className="flex flex-col gap-3">
                  {goalDetails && (
                    <span className="text-[10px] font-black bg-primary-light text-primary-dark px-3 py-1 rounded-lg w-fit border border-primary/5">
                      {goalDetails.code}
                    </span>
                  )}
                  <span className="text-slate-800 font-black text-xl leading-snug">{item.n}</span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className={`text-4xl font-display font-black leading-none ${
                    status === 'excellent' ? 'text-secondary' : 
                    status === 'good' ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {item.p}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">الإنجاز الكلي</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-4 text-xs flex rounded-full bg-slate-100 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.p}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000"
                      style={{ 
                        backgroundColor: color,
                        boxShadow: `0 0 12px 0 ${color}44`
                      }}
                    ></motion.div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 pt-2">
                  {years.map(year => {
                    const yearData = goalDetails ? (goalDetails.years as any)[year] : null;
                    const val = yearData ? yearData.p : 0;
                    const yStatus = getStatus(val, year);
                    
                    return (
                      <div key={year} className="bg-slate-50/70 rounded-2xl py-3 px-2 border border-slate-50 flex flex-col items-center gap-1 hover:bg-white hover:shadow-sm transition-all">
                        <span className="text-[10px] text-slate-400 font-black uppercase">{year}</span>
                        <span className={`text-base font-display font-black ${
                          yStatus === 'excellent' ? 'text-secondary' : 
                          yStatus === 'good' ? 'text-amber-500' : 
                          yStatus === 'upcoming' ? 'text-cyan-600' : 'text-red-500'
                        }`}>
                          {yStatus === 'upcoming' ? '-' : `${val.toFixed(0)}%`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
