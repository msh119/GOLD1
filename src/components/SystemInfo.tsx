import React from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { Info, HelpCircle, FileText, Sparkles, Compass, ShieldAlert } from 'lucide-react';

interface SystemInfoProps {
  language: Language;
}

export const SystemInfo: React.FC<SystemInfoProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      
      {/* Upper Welcome Header Section - Styled as a Premium Bento Cell */}
      <div className="bento-card bg-gradient-to-br from-[#161616] via-[#111111] to-[#161616] border border-amber-500/20 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-36 w-36 rounded-full bg-yellow-500/[0.03] blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[var(--gold)] mb-3">
            <Info className="h-5 w-5" />
            <span className="text-[10px] font-extrabold tracking-widest uppercase font-mono">{t.infoTab}</span>
          </div>
          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-white mb-2">
            {t.guideTitle}
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
            {t.guideIntro}
          </p>
        </div>
      </div>

      {/* Main Educational Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Shishangi & Shares */}
        <div className="bento-card space-y-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/20 border border-amber-500/20 flex items-center justify-center text-[var(--gold)] shadow-md">
            <Compass className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {t.conceptTitle1}
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.conceptDesc1}
          </p>
        </div>

        {/* Card 2: Math Calibration */}
        <div className="bento-card space-y-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/20 border border-yellow-500/20 flex items-center justify-center text-[var(--gold)] shadow-md">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {t.conceptTitle2}
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.conceptDesc2}
          </p>
        </div>

        {/* Card 3: Valuation Model */}
        <div className="bento-card space-y-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-600/20 border border-orange-500/20 flex items-center justify-center text-[var(--gold-light)] shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {t.conceptTitle3}
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.conceptDesc3}
          </p>
        </div>

      </div>

      {/* Calibration Reference List and Explanation */}
      <div className="bento-card">
        <h3 className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest font-mono mb-5 flex items-center gap-2 border-b border-neutral-900 pb-3">
          <ShieldAlert className="h-4.5 w-4.5" />
          {language === 'ar' ? 'معايير نقاوة الذهب ومكافئ السهم العربي' : 'Gold Purity Standard & Arabic Shares Equivalence'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-xs text-neutral-400">
          <div>
            <p className="mb-3.5">
              {language === 'ar' 
                ? 'تاريخياً، قست الصاغة العربية نقاوة الذهب عن طريق تقسيم السبيكة أو الحلية لـ 24 جزء يسمى "قيراط"، لكن عيب هذا النظام هو جموده؛ لذلك اعتمد الصاغة والمصانع نظام المليون أو الـ 1000 سهم لزيادة الحسابات دقة.'
                : 'Traditionally, Arab scales measured gold by dividing alloys into 24 fractions called "Karats". To maximize precision, state assayers and professional foundries migrated to the millesimal fineness index represented in "Shares" (out of 1000 points).'}
            </p>
            <p className="text-neutral-500">
              {language === 'ar' 
                ? 'عند استلام ذهب مجهول النقاوة أو ذهب كسر مكسر، يخضع لتحليل "الشيشنجي" الذي يسلم الزبون شهادة مدموغة بالأسهم، مثل: (882 سهم)، فيأتي دور هذه المنصة لتحويل هذا الوزن لنظيره المكافئ من عيار 21 مباشرة.'
                : 'When receiving raw scrap alloys of irregular purity, the metallurgical laboratory issues a certificate stating the fineness in shares (e.g. 882 shares). This platform converts that arbitrary alloy into standard 21K, which serves as the wholesale trading benchmark.'}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-850 bg-black p-4 space-y-3 font-mono">
            <span className="block text-xs font-bold text-neutral-300 mb-2 border-b border-neutral-900 pb-2">
              {language === 'ar' ? 'جدول المرجع التقني المعتمد:' : 'Certified conversion index:'}
            </span>
            <div className="flex justify-between border-b border-neutral-900 pb-1.5 text-[11px]">
              <span className="text-neutral-500">{t.g24}</span>
              <span className="text-[var(--gold)] font-bold">1000 سهم [1.00 Fine]</span>
            </div>
            <div className="flex justify-between border-b border-neutral-900 pb-1.5 text-[11px]">
              <span className="text-neutral-500">عيار 22</span>
              <span className="text-[var(--gold)] font-bold">916.6 سهم [0.916 Fine]</span>
            </div>
            <div className="flex justify-between border-b border-neutral-900 pb-1.5 text-[11px]">
              <span className="text-neutral-500">{t.g21}</span>
              <span className="text-[var(--gold)] font-bold font-black">875 سهم [0.875 Fine]</span>
            </div>
            <div className="flex justify-between border-b border-neutral-900 pb-1.5 text-[11px]">
              <span className="text-neutral-500">{t.g18}</span>
              <span className="text-[var(--gold)] font-bold">750 سهم [0.75 Fine]</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-neutral-500">عيار 14</span>
              <span className="text-[var(--gold)] font-bold">583.3 سهم [0.58 Fine]</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
