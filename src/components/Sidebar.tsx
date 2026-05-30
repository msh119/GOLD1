import React from 'react';
import { ActiveTab, Language } from '../types';
import { translations } from '../utils/translations';
import { Home, Calculator, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language }) => {
  const t = translations[language];

  const menuItems = [
    {
      id: 'home' as ActiveTab,
      label: t.homeTab,
      icon: Home,
      color: 'from-yellow-400 to-amber-500',
    },
    {
      id: 'calculator' as ActiveTab,
      label: t.calculatorTab,
      icon: Calculator,
      color: 'from-amber-400 to-yellow-500',
    },
    {
      id: 'info' as ActiveTab,
      label: t.infoTab,
      icon: Info,
      color: 'from-orange-500 to-yellow-600',
    },
  ];

  return (
    <aside className="sticky top-[89px] hidden h-[calc(100vh-89px)] w-64 border-r border-neutral-800 bg-neutral-950 p-6 md:block">
      <div className="flex flex-col gap-6">
        
        {/* Navigation Section */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'text-yellow-400 bg-gradient-to-r from-yellow-500/10 to-transparent border-l-2 border-yellow-500'
                    : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200'
                }`}
                style={{
                  borderLeft: isActive && language === 'en' ? '2px solid #d4af37' : '',
                  borderRight: isActive && language === 'ar' ? '2px solid #d4af37' : '',
                }}
              >
                {/* Visual Glow or dot in background of active */}
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute inset-0 rounded-xl bg-yellow-500/[0.02]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon 
                  className={`h-5 w-5 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-yellow-400' : 'text-neutral-500 group-hover:text-neutral-400'
                  }`} 
                />
                
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Brand visual bottom card */}
        <div className="mt-auto rounded-2xl border border-neutral-800/80 bg-gradient-to-b from-neutral-900 to-neutral-950 p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
              {t.systemStatus}
            </span>
          </div>
          <p className="text-xs font-bold text-neutral-300">
            {t.appName}
          </p>
          <p className="mt-1 text-[10px] text-neutral-500 leading-relaxed">
            {language === 'ar' 
              ? 'الخيارات والحاسبات تتم محلياً وبشكل آمن تماماً للتبادل التجاري العادل.'
              : 'All operations and calibrations run locally and securely.'}
          </p>
        </div>
      </div>
    </aside>
  );
};
