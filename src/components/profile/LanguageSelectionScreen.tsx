import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../../translations/translations';
import { Globe, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const LanguageSelectionScreen: React.FC = () => {
  const { user, role, setIsLanguageSetupActive, setActiveTab, addNotification } = useApp();
  const { language, setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language || 'en');

  const languageCards: {
    code: SupportedLanguage;
    name: string;
    nativeName: string;
    greeting: string;
    desc: string;
  }[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      greeting: 'Welcome to EduSync AI',
      desc: 'Standard global educational dialect & interface'
    },
    {
      code: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      greeting: 'ఎడ్యుసింక్ AI కి స్వాగతం',
      desc: 'ఆంధ్రప్రదేశ్ & తెలంగాణ ప్రాంతీయ భాష'
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      greeting: 'एड्यूसिंक AI में आपका स्वागत है',
      desc: 'भारत की प्रमुख राष्ट्रभाषा एवं शैक्षणिक इंटरफेस'
    },
    {
      code: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      greeting: 'எடுசின்க் AI-க்கு நல்வரவு',
      desc: 'தமிழ்நாடு & பாரம்பரிய திராவிட மொழி இடைமுகம்'
    },
    {
      code: 'ml',
      name: 'Malayalam',
      nativeName: 'മലയാളം',
      greeting: 'എഡ്യുസിങ്ക് AI-ലേക്ക് സ്വാഗതം',
      desc: 'കേരള സംസ്ഥാനത്തിന്റെ ഔദ്യോഗിക ഭാഷാ സമ്പർക്കമുഖം'
    }
  ];

  const handleConfirm = () => {
    setLanguage(selectedLang);
    setIsLanguageSetupActive(false);
    setActiveTab('dashboard');

    const meta = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang);
    addNotification({
      title: 'Language Set Successfully',
      message: `System language set to ${meta?.name || 'English'}. You can modify this anytime in Settings.`,
      type: 'academic'
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7FF] py-12 px-4 sm:px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="max-w-3xl w-full bg-white border border-purple-100 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Banner */}
        <div className="purple-gradient-hero p-6 sm:p-8 text-white relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md">
              <Globe className="w-7 h-7 text-amber-300 animate-pulse" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider border border-white/30 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> New Account Onboarding • Step 2 of 2
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1.5">Choose Your Preferred Language</h1>
              <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
                Welcome, {user.name}! Select the language for your {role.toUpperCase()} dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {languageCards.map((card) => {
              const isSelected = selectedLang === card.code;
              return (
                <motion.div
                  key={card.code}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedLang(card.code)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#7C3AED] bg-purple-50/80 shadow-md ring-2 ring-[#7C3AED]/20'
                      : 'border-purple-100 bg-white hover:border-purple-300 hover:bg-purple-50/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#7C3AED] uppercase bg-purple-100 px-2 py-0.5 rounded-md">
                        {card.code}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-[#7C3AED]" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-purple-200" />
                      )}
                    </div>
                    <h3 className="text-base font-black text-[#1E1B4B] pt-1">{card.nativeName}</h3>
                    <p className="text-xs text-purple-900 font-bold">{card.name}</p>
                    <p className="text-[11px] text-slate-500 pt-1 leading-snug">{card.desc}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-purple-100 text-[10px] text-purple-700 italic font-semibold">
                    "{card.greeting}"
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-purple-700 font-medium">
              ✓ Language preferences apply to all dashboard widgets, reports, and menus.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirm}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white font-black text-xs shadow-lg glow-purple flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm & Enter {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
