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
  FileSpreadsheet
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
  const equivalentWeight21K = parsedWeight > 0 && parsedPurity > 0 
    ? (parsedWeight * parsedPurity) / 875 
    : 0;
  
  const totalValue = equivalentWeight21K * prices.g21;

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

  // Presets config
  const purityPresets = [
    { label: t.pureGold, value: '1000' },
    { label: t.g22Preset, value: '916.6' },
    { label: t.g21Preset, value: '875' },
    { label: t.g18Preset, value: '750' },
    { label: t.g14Preset, value: '583.3' },
  ];

  const handlePresetSelect = (val: string) => {
    setPurity(val);
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
      totalValue: totalValue,
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
      <div className="bento-card bg-gradient-to-br from-[#161616] via-[#111111] to-[#161616] border border-amber-500/20 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-36 w-36 rounded-full bg-yellow-500/[0.03] blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[var(--gold)] mb-3">
            <Scale className="h-5 w-5" />
            <span className="text-[10px] font-extrabold tracking-widest uppercase font-mono">{t.appName}</span>
          </div>
          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-white mb-2">
            {t.calculatorHeroTitle}
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            {t.calculatorHeroDesc}
          </p>
        </div>
      </div>

      {/* Main Bento Grid: Left column for Inputs, Right column for dynamic calibration values */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Controls Cell - Column Span 7 */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bento-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-[var(--gold)] tracking-widest uppercase flex items-center gap-2">
                <span className="text-xs">◆</span>
                {t.calculatorTab}
              </h3>
              <button 
                onClick={handleClearFields}
                className="text-xs text-neutral-500 hover:text-[var(--gold-light)] font-medium transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t.clear}
              </button>
            </div>

            {/* Premium Gold Form inputs */}
            <div className="space-y-6">
              
              {/* Weight input (جرام) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-2">
                  {t.weight} <span className="text-[var(--gold)]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="weight-input"
                    type="number"
                    step="any"
                    min="0"
                    placeholder={t.weightPlaceholder}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-[var(--gold)] rounded-xl px-4 py-3.5 text-lg font-bold text-white placeholder-neutral-700 focus:ring-1 focus:ring-[var(--gold)]/20 focus:outline-none transition-all font-mono"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                  <div className={`absolute inset-y-0 flex items-center px-4 text-xs font-bold text-neutral-500 ${language === 'ar' ? 'left-0 border-r border-neutral-850' : 'right-0 border-l border-neutral-850'}`}>
                    {language === 'ar' ? 'جرام [g]' : 'Gram [g]'}
                  </div>
                </div>
              </div>

              {/* Shishangi Sehm input (عيار الشيشنجي) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-2 flex justify-between">
                  <span>{t.purity} <span className="text-[var(--gold)]">*</span></span>
                  <span className="text-[10px] text-neutral-500 font-normal">{t.purityHelper}</span>
                </label>
                <div className="relative">
                  <input
                    id="purity-input"
                    type="number"
                    step="any"
                    min="1"
                    max="1000"
                    placeholder={t.purityPlaceholder}
                    value={purity}
                    onChange={(e) => setPurity(e.target.value)}
                    className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-[var(--gold)] rounded-xl px-4 py-3.5 text-lg font-bold text-white placeholder-neutral-700 focus:ring-1 focus:ring-[var(--gold)]/20 focus:outline-none transition-all font-mono"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  />
                  <div className={`absolute inset-y-0 flex items-center px-4 text-xs font-bold text-neutral-500 ${language === 'ar' ? 'left-0 border-r border-neutral-850' : 'right-0 border-l border-neutral-850'}`}>
                    {t.shares}
                  </div>
                </div>

                {/* Shishangi presets pills */}
                <div className="mt-4">
                  <span className="text-[10px] text-neutral-500 font-mono block mb-2.5">
                    {t.presets}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {purityPresets.map((preset) => {
                      const isSelected = Math.abs(parseFloat(purity) - parseFloat(preset.value)) < 0.5;
                      return (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => handlePresetSelect(preset.value)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[var(--gold)]/10 border border-[var(--gold)] text-[var(--gold-light)] font-bold'
                              : 'bg-black border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleSaveToHistory}
                  disabled={!isValid}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-extrabold transition-all ${
                    isValid
                      ? 'gold-gradient-bg text-neutral-950 hover:opacity-95 shadow-lg shadow-yellow-500/10 cursor-pointer hover:scale-[1.01]'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  <Save className="h-4.5 w-4.5" />
                  {t.saveToHistory}
                </button>
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
                <HelpCircle className="h-4 w-4 text-[var(--gold)]" />
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
                    <div className="rounded-lg bg-black p-3.5 font-mono text-center text-[var(--gold-light)] border border-neutral-900 block my-2" style={{ direction: 'ltr' }}>
                      21K weight = (W * P) / 875
                    </div>
                    <ul className="list-disc list-inside space-y-1 bg-neutral-900/30 p-3 rounded-lg">
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
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bento-card border border-[rgba(212,175,55,0.25)] flex flex-col justify-between h-full min-h-[350px]">
            {/* Glowing accents in the results card */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-yellow-500/[0.04] blur-2xl"></div>
            
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-neutral-900 pb-4">
                <h3 className="text-xs font-bold tracking-widest text-[var(--gold)] uppercase flex items-center gap-2 font-mono">
                  <span>◆</span>
                  {t.resultsTitle}
                </h3>
                <span className="rounded-full bg-[var(--gold)]/15 px-2.5 py-1 text-[10px] font-bold text-[var(--gold-light)] font-mono border border-[var(--gold)]/20">
                  {parsedPurity ? `${parsedPurity} ${t.shares}` : '-'}
                </span>
              </div>

              {/* NET WEIGHT CARD */}
              <div className="mb-6.5">
                <span className="block text-xs font-semibold text-neutral-500 mb-1">
                  {t.equivalentWeight} (21K)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5.5xl font-black font-mono tracking-tight gold-gradient-text">
                    {formatNumber(equivalentWeight21K, 3)}
                  </span>
                  <span className="text-sm font-semibold text-neutral-400">
                    {language === 'ar' ? 'جرام' : 'Grams'}
                  </span>
                </div>
              </div>

              {/* ESTIMATED VALUE CARD */}
              <div className="border-t border-neutral-900 pt-6">
                <span className="block text-xs font-semibold text-neutral-500 mb-1">
                  {t.financialValue}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight text-white">
                    {formatNumber(totalValue, 2)}
                  </span>
                  <span className="text-sm font-semibold text-[var(--gold)] font-mono">
                    {t.currency}
                  </span>
                </div>
                
                {/* Micro price info helper */}
                <div className="mt-3.5 flex items-center gap-1.5 text-[11px] text-neutral-500 bg-black/40 p-2.5 rounded-lg border border-neutral-900">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span>
                    {language === 'ar' 
                      ? `بناءً على السعر الحالي المعتمد: ${formatNumber(prices.g21, 0)} ${t.currency} لـ جرام 21` 
                      : `Based on current configured 21K price: ${formatNumber(prices.g21, 0)} ${t.currency}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual dynamic gold weight meter */}
            <div className="mt-8 border-t border-neutral-900 pt-5">
              <div className="flex justify-between text-[11px] text-neutral-400 mb-2 font-mono">
                <span>{t.rawWeight}: {formatNumber(parsedWeight, 2)}g</span>
                <span>21K: {formatNumber(equivalentWeight21K, 2)}g</span>
              </div>
              <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-neutral-900">
                <motion.div 
                  className="h-full bg-gradient-to-r from-yellow-700 via-amber-500 to-yellow-300" 
                  initial={{ width: 0 }}
                  animate={{ width: parsedWeight > 0 ? `${Math.min(100, (equivalentWeight21K / Math.max(1, parsedWeight)) * 100)}%` : '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
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
          <h3 className="text-xs font-bold text-[var(--gold)] tracking-widest uppercase flex items-center gap-2">
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
