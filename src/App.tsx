/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import SummaryTab from './components/SummaryTab';
import OverallProgressTab from './components/OverallProgressTab';
import YearTab from './components/YearTab';
import PerformanceCategoryTab from './components/PerformanceCategoryTab';
import { rawData } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('summary');
  const [currentYear, setCurrentYear] = useState('2024');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const getStatus = (val: number, year: string) => {
    const cappedVal = Math.min(val, 100);
    if (year === '2026' && cappedVal === 0) return 'upcoming';
    if (cappedVal >= 90) return 'excellent';
    if (cappedVal >= 70) return 'good';
    return 'low';
  };

  const getStatusText = (val: number, year: string) => {
    const cappedVal = Math.min(val, 100);
    if (year === '2026' && cappedVal === 0) return 'لم يحن دورية قياسه';
    if (cappedVal >= 90) return 'ممتاز';
    if (cappedVal >= 70) return 'جيد';
    return 'ضعيف';
  };

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return rawData.filter(g => 
      g.name.toLowerCase().includes(query) || 
      g.code.toLowerCase().includes(query) ||
      ((g.years as any)[currentYear] && (g.years as any)[currentYear].k.some((k: any) => k.n.toLowerCase().includes(query)))
    );
  }, [searchQuery, currentYear]);

  const renderContent = () => {
    if (searchQuery.trim()) {
      return (
        <div className="space-y-10">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-2xl font-black text-slate-800">نتائج البحث عن: <span className="text-primary">"{searchQuery}"</span></h3>
            <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-sm font-bold">{filteredResults.length} نتيجة</span>
          </div>
          {filteredResults.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-24 text-center rounded-[50px] border border-slate-100 shadow-premium"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-xl font-bold text-slate-400">لا توجد نتائج تطابق بحثك حالياً.</p>
              <button onClick={() => setSearchQuery('')} className="mt-6 text-primary font-black hover:underline">عرض كل الأهداف</button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {filteredResults.map((g, gi) => {
                const yD = (g.years as any)[currentYear];
                if (!yD) return null;
                const gStatus = getStatus(yD.p, currentYear);
                return (
                  <motion.div 
                    key={gi} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.05 }}
                    className="bg-white rounded-[45px] border border-slate-100 shadow-premium overflow-hidden p-8 hover:shadow-hover transition-all duration-500"
                  >
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-6">
                        <span className="bg-primary text-white text-sm font-black px-4 py-2 rounded-xl shadow-md shadow-primary/10">{g.code}</span>
                        <h4 className="text-2xl font-black text-slate-800">{g.name}</h4>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-4xl font-display font-black leading-none ${
                          gStatus === 'excellent' ? 'text-secondary' : 
                          gStatus === 'good' ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {yD.p}%
                        </span>
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">الإنجاز في {currentYear}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50/50 rounded-[35px] border border-slate-100 p-6 overflow-hidden">
                        <div className="overflow-x-auto no-scrollbar">
                         <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b-2 border-slate-200/50">
                                <th className="p-4 text-right text-slate-400 font-black text-sm uppercase tracking-wider">المؤشر</th>
                                <th className="p-4 text-center text-slate-400 font-black text-sm uppercase tracking-wider">المستهدف</th>
                                <th className="p-4 text-center text-slate-400 font-black text-sm uppercase tracking-wider">المحقق</th>
                                <th className="p-4 text-center text-slate-400 font-black text-sm uppercase tracking-wider">الإنجاز</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/50">
                              {yD.k.map((k: any, ki: number) => (
                                <tr key={ki} className="hover:bg-white/50 transition-colors">
                                  <td className="p-5 text-right text-primary-dark font-black text-lg leading-relaxed max-w-sm">{k.n}</td>
                                  <td className="p-5 text-center font-display font-bold text-xl text-slate-600">{k.t}</td>
                                  <td className="p-5 text-center font-display font-bold text-xl text-slate-600">{k.a}</td>
                                  <td className={`p-5 text-center font-display font-black text-2xl ${
                                    getStatus(k.p, currentYear) === 'excellent' ? 'text-secondary' : 
                                    getStatus(k.p, currentYear) === 'good' ? 'text-amber-500' : 'text-red-500'
                                  }`}>
                                    {k.p}%
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    switch (activeTab) {
      case 'summary': return <SummaryTab getStatus={getStatus} getStatusText={getStatusText} />;
      case 'overall-progress': return <OverallProgressTab getStatus={getStatus} />;
      case '2023': 
      case '2024': 
      case '2025': 
      case '2026': return <YearTab year={activeTab} getStatus={getStatus} />;
      case 'cat-excellent': return <PerformanceCategoryTab status="excellent" getStatus={getStatus} />;
      case 'cat-good': return <PerformanceCategoryTab status="good" getStatus={getStatus} />;
      case 'cat-low': return <PerformanceCategoryTab status="low" getStatus={getStatus} />;
      default: return <SummaryTab getStatus={getStatus} getStatusText={getStatusText} />;
    }
  };

  const navItems = [
    { id: 'summary', label: 'الملخص التنفيذي' },
    { id: 'overall-progress', label: 'مستوى تقدم الأهداف' },
    { id: '2023', label: '2023' },
    { id: '2024', label: '2024' },
    { id: '2025', label: '2025' },
    { id: '2026', label: '2026' },
  ];

  const categoryItems = [
    { id: 'cat-excellent', label: 'الأهداف ذات الأداء الممتاز', color: 'text-secondary' },
    { id: 'cat-good', label: 'الأهداف ذات الأداء الجيد', color: 'text-amber-500' },
    { id: 'cat-low', label: 'الأهداف ذات الأداء الضعيف', color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans overflow-x-hidden" dir="rtl">
      <header className="bg-gradient-to-br from-[#01a79d] via-[#01968e] to-[#8cc342] text-white pt-16 pb-24 rounded-b-[60px] shadow-2xl mb-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] aspect-square bg-white opacity-5 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] aspect-square bg-white opacity-5 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[10%] w-24 h-24 border-4 border-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-[15%] left-[15%] w-32 h-32 border-8 border-white opacity-5 rounded-3xl rotate-12"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-right"
            >
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tight drop-shadow-lg mb-4">
                لوحة قيادة الاستراتيجية الرابعة
              </h1>
              <p className="text-white/80 text-lg md:text-2xl font-medium tracking-wide max-w-2xl mx-auto md:mx-0">
                جمعية تراؤف (2023-2026) • قياس الأداء والتقدم الاستراتيجي
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="shrink-0 bg-white p-6 md:p-8 rounded-[50px] shadow-2xl relative group border-4 border-primary/10"
            >
              <img 
                src="https://up6.cc/2026/04/177748081963651.png" 
                alt="جمعية تراؤف" 
                className="h-28 md:h-36 lg:h-44 xl:h-52 object-contain" 
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pb-24 -mt-16 relative z-20">
        <div className="bg-white/80 backdrop-blur-md p-2 rounded-3xl shadow-xl mb-12 border border-white/50 sticky top-4 z-40 max-w-6xl mx-auto">
          <div className="flex overflow-x-visible gap-2 p-1 no-scrollbar items-center justify-center md:justify-start">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchQuery('');
                  setIsCategoryMenuOpen(false);
                  if (['2023', '2024', '2025', '2026'].includes(item.id)) {
                    setCurrentYear(item.id);
                  }
                }}
                className={`flex-shrink-0 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 relative group truncate ${
                  activeTab === item.id && !searchQuery
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                    : `bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800`
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="relative">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className={`flex-shrink-0 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 relative group flex items-center gap-1 ${
                  activeTab.startsWith('cat-')
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                    : `bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800`
                }`}
              >
                تصنيفات الأهداف حسب الأداء
                <ChevronDown size={14} className={`transition-transform grow-0 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isCategoryMenuOpen && (
                  <>
                    {/* Backdrop to close on mobile/click outside */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsCategoryMenuOpen(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-72 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-4 border border-slate-100 z-50 origin-top-right"
                    >
                      <div className="space-y-2">
                        {categoryItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setSearchQuery('');
                              setIsCategoryMenuOpen(false);
                            }}
                            className={`w-full text-right px-5 py-4 rounded-2xl transition-all font-black text-sm flex items-center justify-between group ${
                              activeTab === item.id 
                                ? 'bg-slate-50 text-primary ring-1 ring-primary/5' 
                                : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                            }`}
                          >
                            <span className="flex-1">{item.label}</span>
                            <div className={`w-3 h-3 rounded-full mr-4 ${item.color.replace('text', 'bg')} shadow-sm group-hover:scale-125 transition-transform`}></div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-16 relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl group-hover:bg-primary/10 transition-all duration-500"></div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن هدف، أو مؤشر، أو كود استراتيجي..."
              className="w-full bg-white px-8 py-5 rounded-[26px] border-2 border-slate-100 focus:border-primary-dark focus:outline-none transition-all text-xl pr-14 shadow-lg ring-4 ring-slate-50/50"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-7 h-7" />
          </div>
        </div>

        <motion.div
           layout
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           key={activeTab + (searchQuery ? 'search' : '')}
        >
          {renderContent()}
        </motion.div>
      </main>

      <footer className="text-center py-8 text-slate-400 text-sm border-t border-slate-100 bg-white">
        &copy; {new Date().getFullYear()} جمعية تراؤف - جميع الحقوق محفوظة
      </footer>
    </div>
  );
}
