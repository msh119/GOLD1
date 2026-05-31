import React, { useState, useEffect } from 'react';
import { GoldPrices, Language, HistoryItem } from '../types';
import { translations } from '../utils/translations';
import { 
  Scale, 
  Trash2, 
  Save, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Calculator as CalcIcon, 
  HelpCircle,
  TrendingUp,
  History,
  RotateCcw,
  Download,
  FileSpreadsheet,
  Coins,
  Cpu,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
interface CalculatorProps {
  prices: GoldPrices;
  language: Language;
  history: HistoryItem[];
  saveHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  prices,
  language,
  history,
  saveHistoryItem,
  clearHistory,
  deleteHistoryItem
}) => {
  const t = translations[language];

  // In gold trading, weight and purity states are best kept as string to handle points
  const [weight, setWeight] = useState<string>('');
  const [purity, setPurity] = useState<string>('875'); // Default is 21K (875 shares)
  
  const [isFormulaExpanded, setIsFormulaExpanded] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Auto-calculated fields
  const parsedWeight = parseFloat(weight) || 0;
  const parsedPurity = parseFloat(purity) || 0;

  // التحييف على عيار 21 أساسه 875 سهم
  const equivalentWeight21K = parsedWeight > 0 && parsedPurity > 0 
    ? (parsedWeight * parsedPurity) / 875 
    : 0;
  
  // سعر الجرام الفعلي المحسوب بناء على التحييف على 875
  const activeGramPrice = (parsedPurity / 875) * prices.g21;
  const netGoldValue = equivalentWeight21K * prices.g21;
  const grandTotal = netGoldValue;

  // Active inputs validation
  const isValid = parsedWeight > 0 && parsedPurity > 0 && parsedPurity <= 1000;

  const handleExportToExcel = () => {
    if (history.length === 0) return;

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

    const BOM = '\uFEFF';
    const csvContent = BOM + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Pyramids_Gold_Calculations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveToHistory = () => {
    if (!isValid) {
      setNotification(t.invalidInputs);
      return;
    }
    saveHistoryItem({
      weight: parsedWeight,
      purity: parsedPurity,
      cleanWeight21k: equivalentWeight21K,
      pricePerGram21k: prices.g21,
      totalValue: grandTotal,
    });
    setNotification(t.historySavedSuccess);
  };

  const handleClearFields = () => {
    setWeight('');
    setPurity('875');
  };

  // Dismiss notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const getFormattedDate = (isoString: string) => {
    const d = new Date(isoString);
    if (language === 'ar') {
      return d.toLocaleDateString('ar-EG', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      
      {/* Upper Welcome Hero Card as a Premium Bento Cell */}
      <div className="bento-card bg-gradient-to-br from-[#251f12]/40 via-[#0d0d0d] to-[#161616] border border-amber-500/20 shadow-2xl shadow-amber-950/10">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-36 w-36 rounded-full bg-amber-500/[0.04] blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 mb-3">
              <Scale className="h-5 w-5" />
              <span className="text-[10px] font-extrabold tracking-widest uppercase font-mono">{t.appName}</span>
            </div>
            <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-white mb-2">
              {language === 'ar' ? 'حاسبة الذهب الذكية' : 'Smart Gold Calculator'}
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              {language === 'ar' ? 'قم بحساب قيمة الذهب والأوزان والعيارات المختلفة فوراً بأسعار السوق السارية.' : 'Calculate gold values and weight specs across standard and custom carats instantly using live market rates.'}
            </p>
          </div>
          <div className="bg-black/60 px-5 py-3.5 rounded-2xl border border-neutral-800 text-center shrink-0">
            <span className="text-[10px] text-neutral-500 block uppercase font-mono tracking-wider mb-1">{language === 'ar' ? 'سعر جرام عيار 21 اليوم' : 'Today 21K Price'}</span>
            <span className="text-xl font-black text-amber-400 font-mono">{formatNumber(prices.g21, 0)} {t.currency}</span>
          </div>
        </div>
      </div>

      {/* Main Bento Grid: Left column for Inputs, Right column for dynamic calibration values */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Controls Cell - Column Span 7 */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bento-card border border-neutral-800 bg-[#0d0e11] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 border-b border-neutral-900 pb-4 relative z-10">
              <h3 className="text-xs font-black text-amber-500 tracking-widest uppercase flex items-center gap-2">
                <span className="text-[10px]">●</span>
                {language === 'ar' ? 'المدخلات والعيار' : 'Weight & Caliber Specifications'}
              </h3>
              <button 
                onClick={handleClearFields}
                className="text-xs text-neutral-500 hover:text-amber-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t.clear}
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Weight Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  {language === 'ar' ? 'الوزن الإجمالي بالجرام:' : 'Gross Weight (Grams):'} <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder={t.weightPlaceholder}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-amber-500 rounded-2xl px-5 py-4 text-2xl font-black text-amber-400 focus:outline-none transition-all font-mono"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                  <div className={`absolute inset-y-0 flex items-center px-5 text-xs font-black text-neutral-500 ${language === 'ar' ? 'left-0 border-r border-neutral-850' : 'right-0 border-l border-neutral-850'}`}>
                    {language === 'ar' ? 'جرام [g]' : 'Gram [g]'}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {[0.1, 1, 5, 10, 50, 100].map((addAmount) => (
                    <button
                      key={addAmount}
                      type="button"
                      onClick={() => {
                        const currentVal = parseFloat(weight) || 0;
                        setWeight((currentVal + addAmount).toFixed(1).replace(/\.0$/, ''));
                      }}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-neutral-300 hover:text-white transition-all cursor-pointer"
                    >
                      +{addAmount}g
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setWeight('')}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-rose-950/20 border border-rose-900/30 text-rose-400 hover:bg-rose-900/20 transition-all cursor-pointer shrink-0"
                  >
                    C
                  </button>
                </div>
              </div>

              {/* Purity / Caliber Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    {language === 'ar' ? 'عيار الشيشنجي (بالأسهم):' : 'Shishangi Caliber (Shares):'} <span className="text-amber-500">*</span>
                  </label>
                  <span className="text-[10px] text-neutral-500 font-normal">{t.purityHelper}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="1"
                    max="1000"
                    placeholder={t.purityPlaceholder}
                    value={purity}
                    onChange={(e) => setPurity(e.target.value)}
                    className="w-full bg-[#07080a] border border-neutral-800 hover:border-neutral-700 focus:border-amber-500 rounded-xl px-4 py-3.5 text-base font-bold text-white placeholder-neutral-700 focus:outline-none transition-all font-mono"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                  <div className={`absolute inset-y-0 flex items-center px-4 text-xs font-bold text-neutral-500 ${language === 'ar' ? 'left-0 border-r border-neutral-850' : 'right-0 border-l border-neutral-850'}`}>
                    {t.shares}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Golden Collapsible Reference */}
          <div className="bento-card p-4">
            <button
              onClick={() => setIsFormulaExpanded(!isFormulaExpanded)}
              className="w-full flex items-center justify-between text-xs font-bold text-neutral-400 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-500" />
                {t.explainFormula}
              </span>
              {isFormulaExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            <AnimatePresence>
              {isFormulaExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-neutral-900 mt-4 pt-4"
                >
                  <div className="text-xs text-neutral-400 space-y-3 leading-relaxed">
                    <p className="font-bold text-neutral-300">{t.formulaUsed}</p>
                    <div className="rounded-lg bg-black p-3.5 font-mono text-center text-amber-400 border border-neutral-900 block my-2" style={{ direction: 'ltr' }}>
                      21K weight = (W * P) / 875
                    </div>
                    <ul className="list-disc list-inside space-y-1 bg-neutral-950/30 p-3 rounded-lg border border-neutral-900/40">
                      <li>{t.formulaExplanation}</li>
                      <li>{t.formulaValueExplanation}</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dynamic Calibration Output - Column Span 5 */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
          <div className="bento-card border border-amber-500/30 bg-[#060709] bg-gradient-to-b from-[#0a0c10] to-[#040507] flex flex-col justify-between h-full min-h-[460px] relative overflow-hidden p-6 rounded-3xl shadow-2xl">
            {/* Ambient gold glow in top right */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-amber-500/[0.06] blur-3xl pointer-events-none"></div>
            {/* Subtle vintage CRT terminal grid line pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%] opacity-20 pointer-events-none" />

            <div>
              {/* Screen Top Status Interface */}
              <div className="flex items-center justify-between mb-5 border-b border-neutral-850 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-black tracking-widest text-[#00ffcc] font-mono uppercase">
                    {language === 'ar' ? 'ميزان الشاشني الرقمي متصل' : 'LIVE ASSAY SCALES CONNECTED'}
                  </span>
                </div>
                {isValid ? (
                  <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase animate-pulse">
                    [ STABLE ● APPROVED ]
                  </span>
                ) : (
                  <span className="text-[9px] font-mono font-bold text-amber-500/70 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 uppercase">
                    [ PENDING INPUT ]
                  </span>
                )}
              </div>

              {/* PROFESSIONAL GOLD SCALE SCREEN DISPLAY */}
              <div className="bg-black/90 border border-neutral-850 rounded-2xl p-5 relative overflow-hidden shadow-inner flex flex-col gap-6">
                
                {/* 1. Scale Weights & Purity Grid (الوزن والميزان) */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Gross Physical Weight */}
                  <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-900 flex flex-col relative justify-between min-h-[85px]">
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">
                      {language === 'ar' ? 'الوزن القائم (الخام)' : 'Gross Raw Weight'}
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl md:text-2xl font-black font-mono text-neutral-200 tracking-tight">
                        {formatNumber(parsedWeight, 2)}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono font-bold uppercase">G</span>
                    </div>
                    <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden mt-1.5">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 ease-out"
                        style={{ width: `${Math.min((parsedWeight / 200) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Shishangi Purity Input / الميزان */}
                  <div className="bg-neutral-950/80 p-3 rounded-xl border border-neutral-900 flex flex-col relative justify-between min-h-[85px]">
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">
                      {language === 'ar' ? 'ميزان العيار (الأسهم)' : 'Caliber Purity (Shares)'}
                    </span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl md:text-2xl font-black font-mono text-amber-400/90 tracking-tight">
                        {formatNumber(parsedPurity, 1).replace(/\.0$/, '')}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono font-bold uppercase">S</span>
                    </div>
                    {/* Visual bar indicating pure gold ratio */}
                    <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden mt-1.5">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-500 ease-out" 
                        style={{ width: `${(parsedPurity / 1000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Interactive Analytical Balance Indicator (التثبيت البصري للوزن) */}
                <div className="bg-[#050608] border border-neutral-900 p-3 rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500 uppercase">
                    <span>{language === 'ar' ? 'معاير الذهب اللحظي' : 'Real-time Balancing Core'}</span>
                    <span className={`${isValid ? 'text-[#00ffcc] font-black' : 'text-neutral-600'}`}>
                      {isValid ? 'CALIBRATION ACTIVE' : 'SYSTEM IDLE'}
                    </span>
                  </div>
                  
                  {/* Simulated scale leveling bubble / balancing bars */}
                  <div className="flex items-center justify-between gap-1 h-5 px-1 bg-black/80 rounded border border-neutral-950">
                    <div className="w-1/2 flex justify-end gap-[2px]">
                      {Array.from({ length: 10 }).map((_, i) => {
                        const active = isValid && parsedPurity < 875 && (9 - i) < Math.floor((1 - parsedPurity/875) * 10);
                        return (
                          <div 
                            key={`L-${i}`} 
                            className={`w-[3px] h-3.5 rounded-sm transition-all duration-300 ${
                              active ? 'bg-amber-500/80 animate-pulse' : 'bg-neutral-900'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                      isValid ? 'border-emerald-500 bg-emerald-950/30' : 'border-neutral-800 bg-neutral-950'
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full transition-all ${
                        isValid ? 'bg-emerald-400 animate-ping' : 'bg-neutral-800'
                      }`} />
                    </div>
                    <div className="w-1/2 flex justify-start gap-[2px]">
                      {Array.from({ length: 10 }).map((_, i) => {
                        const active = isValid && parsedPurity >= 875 && i < Math.floor(((parsedPurity - 875)/125) * 10);
                        return (
                          <div 
                            key={`R-${i}`} 
                            className={`w-[3px] h-3.5 rounded-sm transition-all duration-300 ${
                              active ? 'bg-amber-400/80 animate-pulse' : 'bg-neutral-900'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Gold Calibrated Equivalent Weight (الوزن بعد التحييف) */}
                <div className="bg-[#0c0e12]/80 p-4 rounded-xl border border-amber-500/10 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">
                      {language === 'ar' ? 'الوزن المحييّف (عيار 21 / 875 سهم):' : 'Calibrated Weight (21K / 875):'}
                    </span>
                    <span className="text-xs text-neutral-500 block leading-tight">
                      {language === 'ar' ? '*الجرام الصافي بعد تحييف السهم على 875' : '*Net weight calculated based on baseline 875'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-2xl font-black font-mono text-amber-500 tracking-tight drop-shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                        {formatNumber(equivalentWeight21K, 3)}
                      </span>
                      <span className="text-xs text-amber-500/80 font-mono font-black">g</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {language === 'ar' ? `بمعدل تحييف: ${formatNumber(parsedPurity / 875, 4)}` : `Ratio: ${formatNumber(parsedPurity / 875, 4)}`}
                    </span>
                  </div>
                </div>

                {/* 4. Detailed Pricing Telemetry Info */}
                <div className="space-y-2 border-t border-neutral-950 pt-3.5 text-[11px] font-mono">
                  <div className="flex justify-between items-center text-neutral-400">
                    <span>{language === 'ar' ? 'سعر جرام 21 اليوم بالصاغة:' : 'Today 21K Gram Price:'}</span>
                    <span className="font-bold text-neutral-200">{formatNumber(prices.g21, 0)} {t.currency}</span>
                  </div>
                  <div className="flex justify-between items-center text-neutral-400">
                    <span>{language === 'ar' ? 'السعر المحتسب لعيار الشيشنجي:' : 'Computed Gram Cost for Caliber:'}</span>
                    <span className="font-black text-[#00ffcc]">{formatNumber(activeGramPrice, 2)} {t.currency}/g</span>
                  </div>
                </div>

              </div>

              {/* GRAND FINAL VALUE SCREEN (السعر الاجمالي الفاخر بوهج ذهبي) */}
              <div className="mt-6 bg-[#0a0805] bg-gradient-to-r from-[#17120a] to-[#040302] border border-amber-500/25 p-5 rounded-2xl relative shadow-lg">
                <div className="absolute top-0 left-0 w-20 h-20 bg-amber-500/[0.03] rounded-full blur-2xl pointer-events-none" />
                
                <span className="block text-xs font-black text-amber-500/90 mb-2 uppercase tracking-widest font-mono">
                  {language === 'ar' ? '◀ صافي القيمة المالية الإجمالية للذهب :' : '◀ GRAND TOTAL GOLD VALUATION :'}
                </span>
                
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-black font-mono tracking-tight text-yellow-400 drop-shadow-[0_0_20px_rgba(234,179,8,0.25)]">
                      {formatNumber(grandTotal, 2)}
                    </span>
                    <span className="text-sm font-black text-amber-400 uppercase tracking-widest font-mono">
                      {t.currency}
                    </span>
                  </div>
                  
                  {/* Interactive weight/price mini summary tag */}
                  <div className="text-right flex flex-col">
                    <span className="text-[9px] text-neutral-500 font-mono">
                      {language === 'ar' ? 'معادلة الذهب صافية' : 'Pure Gold Equation'}
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      {formatNumber(equivalentWeight21K, 2)}g x {formatNumber(prices.g21, 0)}
                    </span>
                  </div>
                </div>

                {/* Secure Trading compliance tag */}
                <div className="mt-4 flex items-start gap-1.5 text-[10px] text-neutral-500 bg-neutral-950/80 p-3 rounded-lg border border-neutral-900">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    {language === 'ar' 
                      ? 'تم تقييم هذا التسعير بناء علي تحييف الوزن على عيار ٢١ بسوق الصاغة بمعدل سهم ٨٧٥ وآخر الأسعار المحدثة من منصة الفاتورة.' 
                      : 'This valuation matches Pyramids Gold Market Standard with standard assaying reference 21K baseline at 875.'}
                  </span>
                </div>
              </div>

            </div>

            {/* Commit Log Execution Controls */}
            <div className="mt-6 pt-4 border-t border-neutral-950 flex gap-3">
              <button
                onClick={handleSaveToHistory}
                disabled={!isValid}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black uppercase tracking-wider transition-all border ${
                  isValid
                    ? 'bg-amber-500 border-amber-400 text-neutral-950 hover:bg-amber-400 hover:scale-[1.01] shadow-lg shadow-amber-500/10 cursor-pointer font-black'
                    : 'bg-neutral-900 border-neutral-850 text-neutral-600 cursor-not-allowed font-bold'
                }`}
              >
                <Save className="h-4.5 w-4.5" />
                {t.saveToHistory}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Notifications overlay (Toast warning/success inside layout) */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className={`rounded-xl px-4 py-3.5 text-xs font-bold shadow-lg flex items-center gap-2 max-w-sm self-center text-center ${
              notification.includes('الرجاء') || notification.includes('valid')
                ? 'bg-rose-950/90 border border-rose-800 text-rose-200'
                : 'bg-emerald-950/90 border border-emerald-800 text-emerald-200'
            }`}
          >
            <Info className="h-4.5 w-4.5 shrink-0" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calibration History Logs Section as a Bento card */}
      <div className="bento-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-blue-400 tracking-widest uppercase flex items-center gap-2">
            <span>◆</span>
            {t.historyTitle}
          </h3>
          {history.length > 0 && (
            <div className="flex items-center gap-4">
              <button
                onClick={handleExportToExcel}
                className="text-xs text-emerald-500 hover:text-emerald-400 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4" />
                {t.exportExcel}
              </button>
              <div className="h-3.5 w-px bg-neutral-800 hidden sm:block"></div>
              <button
                onClick={clearHistory}
                className="text-xs text-rose-500 hover:text-rose-400 font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                {t.clearHistory}
              </button>
            </div>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl bg-black/20">
            <Scale className="h-10 w-10 text-neutral-800 mb-3 stroke-1" />
            <p className="text-xs font-medium">{t.historyEmpty}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-850 bg-black">
            <table className="w-full text-xs text-neutral-300 min-w-[620px] border-collapse" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-neutral-950 border-b border-neutral-900 text-neutral-400 text-right">
                  <th className="px-5 py-3.5 text-start font-semibold">{t.date}</th>
                  <th className="px-5 py-3.5 font-semibold text-center">{t.rawWeight}</th>
                  <th className="px-5 py-3.5 font-semibold text-center">{t.purity}</th>
                  <th className="px-5 py-3.5 text-center font-semibold">{t.equivalentWeight} (21k)</th>
                  <th className="px-5 py-3.5 font-semibold text-center">{t.pricePerGram} 21k</th>
                  <th className="px-5 py-3.5 text-end font-semibold">{t.financialValue}</th>
                  <th className="px-5 py-3.5 text-center font-semibold w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-950">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-900/10 transition-colors">
                    <td className="px-5 py-4 text-start font-medium text-neutral-400">{getFormattedDate(item.timestamp)}</td>
                    <td className="px-5 py-4 font-mono font-medium text-neutral-200 text-center">{formatNumber(item.weight, 2)}g</td>
                    <td className="px-5 py-4 font-mono text-neutral-400 text-center">{formatNumber(item.purity, 1)} {t.shares}</td>
                    <td className="px-5 py-4 text-center font-mono font-bold text-[var(--gold)]">{formatNumber(item.cleanWeight21k, 3)}g</td>
                    <td className="px-5 py-4 font-mono text-neutral-400 text-center">{formatNumber(item.pricePerGram21k, 0)} {t.currency}</td>
                    <td className="px-5 py-4 text-end font-mono font-extrabold text-[var(--gold-light)]">{formatNumber(item.totalValue, 2)} {t.currency}</td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="text-neutral-600 hover:text-rose-500 transition-colors rounded p-1 hover:bg-neutral-900/60"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
