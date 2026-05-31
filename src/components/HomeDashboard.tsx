import React from 'react';
import { ActiveTab, GoldPrices, Language, HistoryItem } from '../types';
import { translations } from '../utils/translations';
import { 
  TrendingUp, 
  Coins, 
  Download, 
  FileSpreadsheet, 
  Clock, 
  Sparkles, 
  Calculator, 
  BookOpen, 
  ChevronRight,
  ChevronLeft,
  Calendar,
  Scale
} from 'lucide-react';
import { motion } from 'motion/react';
import { ThreeDBullion } from './ThreeDVisuals';
import { AIMarketAnalyst } from './AIMarketAnalyst';

interface HomeDashboardProps {
  prices: GoldPrices;
  language: Language;
  history: HistoryItem[];
  setActiveTab: (tab: ActiveTab) => void;
  deleteHistoryItem: (id: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  prices,
  language,
  history,
  setActiveTab,
  deleteHistoryItem
}) => {
  const t = translations[language];

  // Calculated Metrics
  const totalOperations = history.length;
  
  const totalWeight21K = history.reduce((sum, item) => sum + item.cleanWeight21k, 0);
  const totalValueSum = history.reduce((sum, item) => sum + item.totalValue, 0);

  // Formatting helper
  const formatNum = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const getFormattedDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  // Excel Excel XML / CSV Downloader with clean UTF-8 BOM encoding for seamless Excel Arabic parsing
  const exportToExcel = () => {
    if (history.length === 0) return;

    // Build standard CSV file with Arabic Headers and BOM
    const headers = language === 'ar' 
      ? ['التاريخ', 'الوزن الخام (جرام)', 'العيار بالأسهم', 'مكافئ عيار 21 (جرام)', 'سعر جرام 21 وقتها', 'القيمة الإجمالية (ج.م)']
      : ['Date', 'Raw Weight (g)', 'Purity (Shares)', '21K Equivalent (g)', '21K Spot Price', 'Total Value (EGP)'];

    const rows = history.map(item => {
      const formattedDate = new Date(item.timestamp).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
      return [
        `"${formattedDate}"`,
        item.weight,
        item.purity,
        item.cleanWeight21k,
        item.pricePerGram21k,
        item.totalValue
      ];
    });

    // Unicode BOM to force Excel into UTF-8 mode
    const BOM = '\uFEFF';
    const csvContent = BOM + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Pyramids_Gold_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      
      {/* Front Welcome Bento Hero Card */}
      <div className="bento-card bg-gradient-to-br from-[#132247]/20 via-[#0d0d0d] to-[#161616] border border-blue-500/25 shadow-2xl shadow-blue-950/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-36 w-36 rounded-full bg-blue-500/[0.06] blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 text-amber-500 mb-3">
            <Sparkles className="h-4 w-4 text-amber-500 font-bold animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-widest uppercase font-mono">{t.appName}</span>
          </div>
          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-white mb-2">
            {t.dashboardWelcome}
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            {t.dashboardDesc}
          </p>
        </div>

        {/* Decorative Brand Logo circle */}
        <div className="relative z-10 flex-shrink-0 self-start md:self-auto">
          <div className="relative h-20 w-20 rounded-2xl bg-neutral-900 border-2 border-amber-500/40 p-1 shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center overflow-hidden">
            <img 
              src="https://scontent.fcai19-6.fna.fbcdn.net/v/t39.30808-6/555918514_1376236214503912_7142926422343815940_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-Ee25hTmxCsQ7kNvwFuTPVH&_nc_oc=AdqlyaoAk5d0Tbidf0BDTv33gNOoATPHt8IsqnLkEr8D8HCTA-Lghj9jSqN9Q02pH08&_nc_zt=23&_nc_ht=scontent.fcai19-6.fna&_nc_gid=k43zHmpgIfbl2j-2R1K4ZA&_nc_ss=7b289&oh=00_Af_9jhFH_u1URl5j79AU6yq4YZ8Na-96gHa85T9AbfomEQ&oe=6A2261F2" 
              alt="Logo Big" 
              className="h-full w-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* KPI Performance Metrics Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Operations Count Card */}
        <div className="bento-card flex flex-col justify-between p-6 relative overflow-hidden group">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-blue-500/[0.02] group-hover:bg-blue-500/[0.04] transition-colors blur-xl"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-500 block">{t.statsLogCount}</span>
              <span className="text-3xl font-black font-mono tracking-tight text-white">
                {formatNum(totalOperations, 0)}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-900 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span>{language === 'ar' ? 'مسارات المعايرة المتكاملة' : 'Active system records logged'}</span>
          </div>
        </div>

        {/* Total Weight Equivalent 21K Grams Card */}
        <div className="bento-card flex flex-col justify-between p-6 relative overflow-hidden group">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-yellow-500/[0.02] group-hover:bg-yellow-500/[0.04] transition-colors blur-xl"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-500 block">{t.statsTotalWeight}</span>
              <span className="text-3xl font-black font-mono tracking-tight gold-gradient-text">
                {formatNum(totalWeight21K, 3)} <span className="text-sm font-semibold text-neutral-400 font-sans">{language === 'ar' ? 'جم' : 'g'}</span>
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[var(--gold)]">
              <Scale className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-900 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span>{language === 'ar' ? 'العائد المكافئ الصافي لـ جرام 21' : 'Net equivalent 21K grade gold'}</span>
          </div>
        </div>

        {/* Aggregated Estimated Commercial Valuation */}
        <div className="bento-card flex flex-col justify-between p-6 relative overflow-hidden group">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-20 w-20 rounded-full bg-emerald-500/[0.02] group-hover:bg-emerald-500/[0.04] transition-colors blur-xl"></div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-500 block">{t.statsTotalValue}</span>
              <span className="text-3xl font-black font-mono tracking-tight text-emerald-400">
                {formatNum(totalValueSum, 2)} <span className="text-sm font-semibold text-neutral-500 font-sans">{t.currency}</span>
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-900 flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span>{language === 'ar' ? 'أقرب تسعير حسب الأسعار الجارية' : 'Value evaluated inside the platform'}</span>
          </div>
        </div>

      </div>

      {/* Main Column Bento grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left main: Active market overview and benchmarks - Col span 7 */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <ThreeDBullion language={language} price24K={prices.g24} price21K={prices.g21} />
          
          <div className="bento-card">
            <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest font-mono flex items-center gap-2 mb-6 border-b border-neutral-900 pb-3">
              <span>◆</span>
              {t.marketOverview}
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              
              <div className="bg-black/40 border border-neutral-900 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
                <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase block mb-1">{t.g24}</span>
                <span className="text-lg md:text-xl font-black font-mono text-cyan-400">{formatNum(prices.g24, 0)}</span>
                <span className="text-[9px] text-neutral-500 font-medium block mt-3 select-none">100% {t.pureGold.split(' ')[0]}</span>
              </div>

              <div className="bg-black/40 border border-neutral-900 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
                <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase block mb-1">{t.g21}</span>
                <span className="text-lg md:text-xl font-black font-mono text-yellow-500">{formatNum(prices.g21, 0)}</span>
                <span className="text-[9px] text-neutral-500 font-medium block mt-3 select-none">87.5% {language === 'ar' ? 'نقاء' : 'Fine'}</span>
              </div>

              <div className="bg-black/40 border border-neutral-900 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
                <span className="text-[10px] font-bold text-neutral-500 font-mono uppercase block mb-1">{t.g18}</span>
                <span className="text-lg md:text-xl font-black font-mono text-amber-600">{formatNum(prices.g18, 0)}</span>
                <span className="text-[9px] text-neutral-500 font-medium block mt-3 select-none">75% {language === 'ar' ? 'نقاء' : 'Fine'}</span>
              </div>

            </div>

            {/* Quick guidance formula widget */}
            <div className="rounded-xl border border-neutral-900 bg-neutral-950/40 p-4.5 flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">{language === 'ar' ? 'تسعير مالي تفاعلي متزامن والأسعار' : 'Interactive Weight to Spot Value Conversion'}</h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  {language === 'ar' 
                    ? 'يتم تحييف كل النواتج ومزامنتها لحظياً بالأسعار السارية المدخلة. لضمان دقة بالغة للثروات وتثمين صفقات الاستيراد.'
                    : 'The conversion computes weight equivalent instantly, multiplying standard EGP averages dynamically.'}
                </p>
              </div>
            </div>

            {/* Simulated Chart visual representing bullion fineness proportions */}
            <div className="mt-6 border-t border-neutral-900 pt-5">
              <span className="block text-[11px] font-bold text-neutral-400 mb-3.5 uppercase font-mono tracking-wider">{t.chartPurityDistribution}</span>
              <div className="h-4 w-full bg-neutral-950 rounded-full flex overflow-hidden border border-neutral-900/40">
                <div className="bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-500 h-full" style={{ width: '24%' }} title="24K" />
                <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full" style={{ width: '51%' }} title="21K" />
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-200 h-full" style={{ width: '25%' }} title="18K" />
              </div>
              <div className="flex justify-between items-center text-[10px] text-neutral-500 mt-2 font-mono">
                <span>{t.g18} (25%)</span>
                <span>{t.g21} (51%)</span>
                <span>{t.g24} (24%)</span>
              </div>
            </div>

          </div>

          {/* Quick Access Lanes / Actions Card */}
          <div className="bento-card">
            <h3 className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest font-mono mb-5 border-b border-neutral-900 pb-3">
              <span>◆</span>
              {t.quickActions}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <button
                onClick={() => setActiveTab('calculator')}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 hover:border-yellow-500/40 text-left transition-all group cursor-pointer"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-yellow-500/20 rounded-lg flex items-center justify-center text-[var(--gold)]">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-none">{t.startCalibration}</h4>
                    <p className="text-[9px] text-neutral-500 mt-1">{language === 'ar' ? 'معادلة التحييف الرسمية' : 'Calibrate scrap gold weights'}</p>
                  </div>
                </div>
                {language === 'ar' ? <ChevronLeft className="h-4 w-4 text-neutral-500 group-hover:text-yellow-400 transition-colors" /> : <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-yellow-400 transition-colors" />}
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 hover:border-orange-500/40 text-left transition-all group cursor-pointer"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-none">{t.viewGuide}</h4>
                    <p className="text-[9px] text-neutral-500 mt-1">{language === 'ar' ? 'شرح الأسهم وحظ الموازين' : 'Formulas, metrics & history manual'}</p>
                  </div>
                </div>
                {language === 'ar' ? <ChevronLeft className="h-4 w-4 text-neutral-500 group-hover:text-orange-400 transition-colors" /> : <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-orange-400 transition-colors" />}
              </button>

            </div>
          </div>

        </div>

        {/* Right side: Excel Exporter widget & Recent list logs - Col span 5 */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Excel Download Operations Widget */}
          <div className="bento-card bg-gradient-to-b from-[#161616] to-[#0c0c0c] border border-emerald-500/25 relative overflow-hidden flex flex-col justify-between p-6">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-emerald-500/[0.04] blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
                <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase font-mono">
                  {language === 'ar' ? 'مزامنة السجلات وإكسل' : 'EXCEL COMPATIBILITY'}
                </span>
              </div>
              
              <h4 className="text-base font-bold text-white mb-2">
                {language === 'ar' ? 'تحميل سجل الصاغة وصادرات الحساب' : 'Download Complete Assayer Log'}
              </h4>
              
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                {language === 'ar' 
                  ? 'قم بتنزيل كافة المعاملات المحفوظة مباشرة في قالب متوافق تماماً مع Microsoft Excel للطباعة السهلة والتحليلات اليدوية الإضافية.' 
                  : 'Save your calibrations database directly as a spreadsheet. Preserves Arabic metadata, dates, pure weights, and spot market values.'}
              </p>
            </div>

            <button
              onClick={exportToExcel}
              disabled={history.length === 0}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold transition-all shadow-md ${
                history.length > 0
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black cursor-pointer hover:scale-[1.01]'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Download className="h-4 w-4" />
              {t.exportExcel}
            </button>
          </div>

          {/* Quick Active Reels Recent History list item */}
          <div className="bento-card flex-1 min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-5 border-b border-neutral-900 pb-3">
              <h3 className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest font-mono flex items-center gap-2">
                <span>◆</span>
                {t.latestOperations}
              </h3>
              <span className="text-[10px] font-mono font-bold text-neutral-500 bg-neutral-900 px-2.5 py-1 rounded-sm">
                {history.length}
              </span>
            </div>

            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-neutral-500">
                <Calendar className="h-8 w-8 text-neutral-800 mb-2 stroke-1" />
                <p className="text-[11px] font-medium">{t.historyEmpty}</p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {history.slice(0, 5).map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 bg-black/40 border border-neutral-900/80 rounded-xl hover:border-neutral-800 transition-colors flex justify-between items-center text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-white">{formatNum(item.weight, 1)}g</span>
                        <span className="text-[10px] text-neutral-500">({item.purity} {t.shares})</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 block font-mono">
                        {getFormattedDate(item.timestamp)}
                      </span>
                    </div>

                    <div className="text-right flex flex-col gap-1 items-end">
                      <div className="font-mono font-bold text-[var(--gold-light)]">
                        + {formatNum(item.cleanWeight21k, 2)}g <span className="text-[9px] font-sans text-neutral-400">21K</span>
                      </div>
                      <div className="text-[10px] font-mono font-semibold text-neutral-400">
                        {formatNum(item.totalValue, 0)} {t.currency}
                      </div>
                    </div>
                  </div>
                ))}
                
                {history.length > 5 && (
                  <button 
                    onClick={() => setActiveTab('calculator')}
                    className="w-full text-center py-2 text-[10px] text-neutral-500 hover:text-[var(--gold)] transition-colors font-bold font-mono uppercase tracking-wider"
                  >
                    + {history.length - 5} {language === 'ar' ? 'عمليات إضافية في حاسبة التحييف' : 'more items inside calibration tool'}
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 🔮 AI Market Decider, Connected Servers Tracker & Pyramids Corporate Overview */}
      <AIMarketAnalyst prices={prices} language={language} />

    </div>
  );
};
