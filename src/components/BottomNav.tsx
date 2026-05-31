import React from 'react';
import { ActiveTab, Language } from '../types';
import { translations } from '../utils/translations';
import { Home, Calculator, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, language }) => {
  const t = translations[language];

  const menuItems = [
    {
      id: 'home' as ActiveTab,
      label: t.homeTab.split(' ')[0], // keep it short for mobile
      icon: Home,
    },
    {
      id: 'calculator' as ActiveTab,
      label: t.calculatorTab.split(' ')[0], // keep it short for mobile
      icon: Calculator,
    },
    {
      id: 'info' as ActiveTab,
      label: t.infoTab.split(' ')[0],
      icon: Info,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-xl md:hidden pb-safe">
      <div className="flex justify-around items-center px-2 py-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-1 flex-col items-center justify-center py-1.5 transition-all outline-none"
            >
              {/* Blue dot indicating active state */}
              {isActive && (
                <motion.span
                  layoutId="activeBottomDot"
                  className="absolute top-0 h-1 w-8 rounded-full bg-blue-500"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <Icon
                className={`h-5 w-5 mb-1 transition-transform ${
                  isActive ? 'text-blue-400 scale-110' : 'text-neutral-500'
                }`}
              />

              <span
                className={`text-[11px] font-medium tracking-tight ${
                  isActive ? 'text-blue-400' : 'text-neutral-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
