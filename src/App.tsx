import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Calculator } from './components/Calculator';
import { Settings } from './components/Settings';
import { SystemInfo } from './components/SystemInfo';
import { HomeDashboard } from './components/HomeDashboard';
import { ActiveTab, GoldPrices, Language, HistoryItem } from './types';
import { translations } from './utils/translations';
import { motion, AnimatePresence } from 'motion/react';

// Default standard Egyptian pricing averages if none saved in localStorage
const DEFAULT_PRICES: GoldPrices = {
  g24: 4200,
  g21: 3675,
  g18: 3150,
};

export default function App() {
  // Safe load of prices
  const [prices, setPrices] = useState<GoldPrices>(() => {
    try {
      const saved = localStorage.getItem('pyramids_gold_prices');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading prices:', e);
    }
    return DEFAULT_PRICES;
  });

  // State for bilingual language support (starts in Arabic 'ar')
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('pyramids_gold_lang');
      if (saved === 'ar' || saved === 'en') {
        return saved as Language;
      }
    } catch (e) {}
    return 'ar';
  });

  // Active navigation tab
  const [activeTab, setActiveTab ] = useState<ActiveTab>('home');

  // Calculation calibration history log records
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('pyramids_gold_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading calibration history:', e);
    }
    return [];
  });

  // Synchronize gold prices changes
  const savePrices = (newPrices: GoldPrices) => {
    setPrices(newPrices);
    try {
      localStorage.setItem('pyramids_gold_prices', JSON.stringify(newPrices));
    } catch (e) {
      console.error('Failed to save prices:', e);
    }
  };

  // Synchronize language toggles
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('pyramids_gold_lang', lang);
    } catch (e) {}
  };

  // Add a successful calculation to history log
  const saveHistoryItem = (newItem: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const freshItem: HistoryItem = {
      ...newItem,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
    };
    const updatedHistory = [freshItem, ...history].slice(0, 100); // Caps history at 100 entries
    setHistory(updatedHistory);
    try {
      localStorage.setItem('pyramids_gold_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save calibration logs:', e);
    }
  };

  // Clear all history reports
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('pyramids_gold_history');
    } catch (e) {}
  };

  // Delete single history log
  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem('pyramids_gold_history', JSON.stringify(updated));
    } catch (e) {}
  };

  // Synchronize document direction attribute relative to selected language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeDashboard
            prices={prices}
            language={language}
            history={history}
            setActiveTab={setActiveTab}
            deleteHistoryItem={handleDeleteHistoryItem}
          />
        );
      case 'calculator':
        return (
          <Calculator
            prices={prices}
            language={language}
            history={history}
            saveHistoryItem={saveHistoryItem}
            clearHistory={handleClearHistory}
            deleteHistoryItem={handleDeleteHistoryItem}
          />
        );
      case 'settings':
        return (
          <Settings
            prices={prices}
            savePrices={savePrices}
            language={language}
          />
        );
      case 'info':
        return <SystemInfo language={language} />;
      default:
        return (
          <Calculator
            prices={prices}
            language={language}
            history={history}
            saveHistoryItem={saveHistoryItem}
            clearHistory={handleClearHistory}
            deleteHistoryItem={handleDeleteHistoryItem}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-100 selection:bg-yellow-500/20 selection:text-yellow-400">
      
      {/* Golden accent bar at the very top */}
      <div className="h-1 w-full bg-gradient-to-r from-yellow-700 via-amber-500 to-yellow-300" />

      {/* Dynamic Header */}
      <Header 
        prices={prices} 
        language={language} 
        setLanguage={handleSetLanguage} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Body Frame Wrapper */}
      <div className="mx-auto flex max-w-[1600px]">
        
        {/* Sidebar Nav (Desktop only) */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} language={language} />

        {/* Core Main Viewport content */}
        <main className="flex-1 px-4 py-8 sm:px-6 md:px-8 pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveSection()}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* Sticky Bottom Nav (Mobile only) */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
    </div>
  );
}
