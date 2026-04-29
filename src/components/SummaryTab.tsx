/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { pillarData, annualOverall, totalPerformance } from '../constants';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartDataLabels
);

interface SummaryTabProps {
  getStatus: (val: number, year: string) => 'excellent' | 'good' | 'low' | 'upcoming';
  getStatusText: (val: number, year: string) => string;
}

export default function SummaryTab({ getStatus, getStatusText }: SummaryTabProps) {
  const combinedAnnualData = {
    labels: ['2023', '2024', '2025', '2026', 'الأداء العام'],
    datasets: [{
      data: [75.40, 91.12, 86.93, 90.12, totalPerformance],
      backgroundColor: [
        'rgba(96, 97, 97, 0.6)', 
        'rgba(1, 167, 157, 0.6)', 
        'rgba(1, 167, 157, 0.4)', 
        'rgba(140, 195, 66, 0.6)',
        '#01a79d' // Primary color for the overall performance
      ],
      borderWidth: (context: any) => context.dataIndex === 4 ? 2 : 0,
      borderColor: '#01a79d',
      borderRadius: 10
    }]
  };

  const pillarLabels = Object.keys(pillarData);
  const pillarChartData = {
    labels: pillarLabels,
    datasets: [
      { 
        label: '2023', 
        data: pillarLabels.map(l => (pillarData as any)[l]['2023']), 
        backgroundColor: 'rgba(96, 97, 97, 0.7)', 
        borderRadius: 5 
      },
      { 
        label: '2024', 
        data: pillarLabels.map(l => (pillarData as any)[l]['2024']), 
        backgroundColor: '#01a79d', 
        borderRadius: 5 
      },
      { 
        label: '2025', 
        data: pillarLabels.map(l => (pillarData as any)[l]['2025']), 
        backgroundColor: 'rgba(140, 195, 66, 0.6)', 
        borderRadius: 5 
      },
      { 
        label: '2026', 
        data: pillarLabels.map(l => (pillarData as any)[l]['2026']), 
        backgroundColor: '#8cc342', 
        borderRadius: 5 
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { 
      y: { display: false },
      x: { grid: { display: false } }
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end' as const,
        align: 'top' as const,
        formatter: (v: number) => v.toFixed(1) + '%',
        font: { family: 'Outfit', weight: '800' as const, size: 12 },
        color: '#334155'
      }
    }
  };

  const pillarOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: { 
        display: true,
        position: 'bottom' as const, 
        labels: { 
          font: { family: 'Noto Sans Arabic', weight: 'bold', size: 12 },
          padding: 20
        } 
      },
      datalabels: {
        ...commonOptions.plugins.datalabels,
        font: { ...commonOptions.plugins.datalabels.font, size: 10 },
        offset: 4
      }
    },
    layout: {
      padding: {
        top: 30,
        bottom: 10
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* Total Performance Header Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-l from-primary-dark via-primary to-secondary p-10 rounded-[50px] shadow-premium text-white relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-right max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight">الأداء العام الاستراتيجي</h2>
            <p className="text-white/80 text-lg font-medium leading-relaxed">
              تحليل شامل لمستوى الإنجاز التراكمي لجميع الأهداف والمؤشرات الاستراتيجية خلال دورة التخطيط (2023-2026).
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[40px] border border-white/20 text-center min-w-[240px] shadow-2xl skew-x-[-2deg]">
            <span className="text-7xl font-display font-black block tracking-tighter drop-shadow-md">{totalPerformance}%</span>
            <div className="h-1 w-12 bg-white/40 mx-auto my-3 rounded-full"></div>
            <span className="text-2xl font-black tracking-widest uppercase opacity-90 block">جيد</span>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-60 h-60 bg-white/5 rounded-full blur-[80px]"></div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Object.entries(annualOverall).map(([year, val], i) => {
          const status = getStatus(val, year);
          return (
            <motion.div 
              key={year} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium text-center hover:shadow-hover hover:-translate-y-2 transition-all duration-500 group"
            >
              <span className="text-slate-400 block mb-3 font-bold text-sm tracking-widest uppercase">إنجاز عام {year}</span>
              <div className="relative inline-block mb-4">
                <span className={`text-5xl font-black font-display block relative z-10 ${
                  status === 'excellent' ? 'text-secondary' : 
                  status === 'good' ? 'text-amber-500' : 
                  status === 'low' ? 'text-red-500' : 'text-cyan-600'
                }`}>
                  {val.toFixed(1)}%
                </span>
                <div className={`absolute -bottom-1 -right-1 w-full h-4 opacity-10 rounded-full blur-md ${
                  status === 'excellent' ? 'bg-secondary' : 
                  status === 'good' ? 'bg-amber-500' : 
                  status === 'low' ? 'bg-red-500' : 'bg-cyan-600'
                }`}></div>
              </div>
              <div className={`mx-auto w-fit px-6 py-2 rounded-2xl text-white text-xs font-black shadow-lg shadow-current/10 transition-transform group-hover:scale-110 ${
                status === 'excellent' ? 'bg-secondary' : 
                status === 'good' ? 'bg-amber-500' : 
                status === 'low' ? 'bg-red-500' : 'bg-cyan-600'
              }`}>
                {getStatusText(val, year)}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-premium min-h-[600px] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-12">
            <h4 className="text-slate-800 font-black text-2xl pr-6 border-r-4 border-primary">🎯 أداء الأبعاد الاستراتيجية السنوي</h4>
            <div className="bg-primary/5 px-4 py-2 rounded-full text-primary font-black text-xs uppercase tracking-widest">تحليل الأبعاد</div>
          </div>
          <div className="h-[450px] relative z-10">
            <Bar data={pillarChartData} options={pillarOptions as any} />
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-premium min-h-[600px] relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-12">
            <h4 className="text-slate-800 font-black text-2xl pr-6 border-r-4 border-secondary">📊 مقارنة الإنجاز السنوي بالأداء العام</h4>
            <div className="bg-secondary/5 px-4 py-2 rounded-full text-secondary font-black text-xs uppercase tracking-widest">مقارنة تراكمية</div>
          </div>
          <div className="h-[450px] relative z-10">
            <Bar data={combinedAnnualData} options={commonOptions as any} />
          </div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors duration-700"></div>
        </motion.div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-slate-900 text-3xl font-black">تفصيل الأداء لكل بعد استراتيجي</h3>
          <div className="h-1 flex-1 mx-8 bg-slate-100 rounded-full"></div>
        </div>
        <div className="bg-white rounded-[50px] border border-slate-100 shadow-premium overflow-hidden p-4">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-slate-50/80 rounded-[30px] overflow-hidden">
                  <th className="p-8 text-right pr-12 text-slate-500 font-black text-xl rounded-r-[30px]">البعد الاستراتيجي</th>
                  <th className="p-8 text-slate-500 font-black text-xl">2023</th>
                  <th className="p-8 text-slate-500 font-black text-xl">2024</th>
                  <th className="p-8 text-slate-500 font-black text-xl">2025</th>
                  <th className="p-8 text-slate-500 font-black text-xl rounded-l-[30px]">2026</th>
                </tr>
              </thead>
              <tbody className="divide-y-8 divide-white">
                {Object.entries(pillarData).map(([pillar, years]) => (
                  <tr key={pillar} className="group hover:bg-slate-50 transition-all duration-300">
                    <td className="p-8 text-right pr-12 font-black text-xl text-primary-dark group-hover:translate-x-[-10px] transition-transform">{pillar}</td>
                    {Object.entries(years).map(([year, val]) => {
                      const status = getStatus(val, year);
                      return (
                        <td key={year} className={`p-8 font-display font-black text-2xl ${
                          status === 'excellent' ? 'text-secondary' : 
                          status === 'good' ? 'text-amber-500' : 
                          status === 'low' ? 'text-red-500' : 'text-cyan-600'
                        }`}>
                          {val === 0 && year === '2026' ? (
                            <span className="text-slate-300">-</span>
                          ) : (
                            `${val.toFixed(1)}%`
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
