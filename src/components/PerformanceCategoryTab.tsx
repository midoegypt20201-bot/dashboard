/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { overallProgressData, rawData } from '../constants';
import { Target, TrendingUp, TrendingDown, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Award } from 'lucide-react';

interface PerformanceCategoryTabProps {
  status: 'excellent' | 'good' | 'low';
  getStatus: (val: number, year: string) => string;
}

export default function PerformanceCategoryTab({ status, getStatus }: PerformanceCategoryTabProps) {
  const [selectedYear, setSelectedYear] = useState('2023');
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  const years = ['2023', '2024', '2025', '2026'];

  // Define thresholds and styles based on status
  const config = {
    excellent: {
      min: 90,
      max: 100,
      title: 'الأهداف ذات الأداء الممتاز',
      desc: 'حصر للأهداف والمؤشرات التي حققت نسبة إنجاز 90% فأعلى.',
      icon: Award,
      colorClass: 'text-secondary',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      label: 'ممتاز',
      labelColor: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    good: {
      min: 70,
      max: 89.9,
      title: 'الأهداف ذات الأداء الجيد',
      desc: 'حصر للأهداف والمؤشرات التي حققت نسبة إنجاز بين 70% و 89.9%.',
      icon: CheckCircle2,
      colorClass: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      label: 'جيد',
      labelColor: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    low: {
      min: 0,
      max: 69.9,
      title: 'الأهداف ذات الأداء الضعيف',
      desc: 'حصر للأهداف والمؤشرات التي لم تتجاوز نسبة إنجازها 69.9%.',
      icon: AlertCircle,
      colorClass: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      label: 'ضعيف',
      labelColor: 'bg-red-100 text-red-700 border-red-200'
    }
  }[status];

  // Filter objectives based on the performance IN THE SELECTED YEAR
  const filteredObjectives = rawData.filter(goal => {
    const yearData = (goal.years as any)[selectedYear];
    if (!yearData) return false;
    const p = yearData.p;
    
    if (status === 'excellent') return p >= 90;
    if (status === 'good') return p >= 70 && p < 90;
    
    // Status is 'low'
    // If year is 2026, exclude 0% values
    if (selectedYear === '2026' && p === 0) return false;
    return p < 70;
  });

  const StatusIcon = config.icon;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white p-10 rounded-[50px] shadow-premium border border-slate-100 text-center relative overflow-hidden">
        <div className={`inline-flex items-center justify-center w-16 h-16 ${config.bgColor} ${config.colorClass} rounded-2xl mb-6 relative z-10`}>
          <StatusIcon size={32} />
        </div>
        <h2 className="text-slate-800 text-3xl font-black mb-4 relative z-10">{config.title}</h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto mb-8 relative z-10 leading-relaxed">
          {config.desc}
        </p>
        
        {/* Internal Year Selector */}
        <div className="flex justify-center gap-2 relative z-10">
          {years.map(y => (
            <button
              key={y}
              onClick={() => {
                setSelectedYear(y);
                setExpandedGoal(null);
              }}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                selectedYear === y 
                  ? `${config.bgColor} ${config.colorClass} border-2 ${config.borderColor} shadow-sm` 
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              عام {y}
            </button>
          ))}
        </div>

        <div className={`absolute top-[-20%] left-[-10%] w-64 h-64 ${config.colorClass.replace('text', 'bg')}/5 rounded-full blur-3xl`}></div>
      </div>

      {filteredObjectives.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredObjectives.map((goal, idx) => {
            const yearData = (goal.years as any)[selectedYear];
            const isExpanded = expandedGoal === goal.name;
            // Filter indicators for this goal that also match the status in this year
            const filteredKPIs = yearData.k.filter((kpi: any) => {
              if (status === 'excellent') return kpi.p >= 90;
              if (status === 'good') return kpi.p >= 70 && kpi.p < 90;
              
              // Status is 'low'
              if (selectedYear === '2026' && kpi.p === 0) return false;
              return kpi.p < 70;
            });
            
            return (
              <motion.div 
                key={goal.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-[40px] border border-slate-100 shadow-premium overflow-hidden transition-all duration-300 hover:shadow-hover"
              >
                {/* Goal Header (Clickable) */}
                <div 
                  className={`p-8 cursor-pointer transition-colors ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                  onClick={() => setExpandedGoal(isExpanded ? null : goal.name)}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[11px] font-black ${config.labelColor} px-3 py-1 rounded-lg border uppercase tracking-tighter`}>
                          {goal.code}
                        </span>
                        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-lg border border-slate-200">
                          {goal.pillar}
                        </span>
                      </div>
                      <h3 className="text-slate-800 font-black text-xl leading-tight">{goal.name}</h3>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                          <span className={`text-4xl font-display font-black ${config.colorClass} leading-none`}>
                            {yearData.p}%
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">إنجاز عام {selectedYear}</span>
                      </div>
                      <div className={`w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 bg-white`}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Indicators */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50/30"
                    >
                      <div className="p-8 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-6">
                          <Target size={18} className={config.colorClass} />
                          <h4 className="text-slate-700 font-black text-sm">المؤشرات المرتبطة ذات الأداء {config.label}</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredKPIs.length > 0 ? filteredKPIs.map((kpi: any, kIdx: number) => (
                            <div 
                              key={kIdx} 
                              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group/kpi"
                            >
                              <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                                <p className="text-slate-800 font-bold text-sm leading-relaxed">{kpi.n}</p>
                                <div>
                                  <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] text-slate-400 font-black">الإنجاز</span>
                                    <span className={`text-lg font-display font-black ${config.colorClass}`}>
                                      {kpi.p}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${kpi.p}%` }}
                                      className={`h-full rounded-full ${config.colorClass.replace('text', 'bg')}`}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 mt-4">
                                    <div className="bg-slate-50/50 p-2 rounded-xl text-center border border-slate-100/30 text-xs font-black text-slate-500">
                                      <span className="block text-[8px] opacity-60 mb-0.5">المستهدف</span>
                                      {kpi.t}
                                    </div>
                                    <div className="bg-slate-50/50 p-2 rounded-xl text-center border border-slate-100/30 text-xs font-black text-slate-500">
                                      <span className="block text-[8px] opacity-60 mb-0.5">المحقق</span>
                                      {kpi.t.includes('%') && !String(kpi.a).includes('%') && kpi.a !== '-' ? `${kpi.a}%` : kpi.a}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )) : (
                            <div className="col-span-full py-6 text-center text-slate-400 font-medium italic text-sm">
                              جميع مؤشرات هذا الهدف في هذا العام تقع خارج هذا التصنيف.
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Visual indicator of matching KPIs */}
                {!isExpanded && filteredKPIs.length > 0 && (
                  <div className="px-8 py-2 bg-slate-50/50 border-t border-slate-50 flex items-center gap-4">
                    <div className="flex -space-x-2 space-x-reverse">
                      {filteredKPIs.slice(0, 3).map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${config.colorClass.replace('text', 'bg')} border border-white`}></div>
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-400">
                      يوجد {filteredKPIs.length} مؤشر{filteredKPIs.length > 1 ? 'ات' : ''} ضمن هذا التصنيف
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[50px] shadow-premium border border-slate-100 text-center">
          <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <StatusIcon size={40} />
          </div>
          <h3 className="text-slate-600 text-xl font-black mb-2">لا توجد أهداف في هذا العام</h3>
          <p className="text-slate-400">لم يتم العثور على أهداف أو مؤشرات بهذا الأداء خلال عام {selectedYear}.</p>
        </div>
      )}
    </div>
  );
}
