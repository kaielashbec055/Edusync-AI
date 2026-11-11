import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Bot, X, Send, Sparkles, RefreshCw, Zap, Lightbulb, Loader2 } from 'lucide-react';

export const FloatingAIAssistant: React.FC = () => {
  const { isOpen, setIsOpen, messages, sendMessage, clearMessages, isLoading } = useChat();
  const { role } = useApp();
  const { t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const textToSend = inputText;
    setInputText('');
    await sendMessage(textToSend, role);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    sendMessage(prompt, role);
  };

  return (
    <>
      {/* Floating Action Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.08, rotate: 3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-4 rounded-3xl bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#C084FC] text-white shadow-xl glow-purple flex items-center justify-center cursor-pointer"
          title="Open EduSync AI Assistant"
        >
          <Bot className="w-7 h-7 text-white animate-bounce" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-ping"></span>

          <div className="absolute right-full mr-3 bg-white text-[#1E1B4B] text-xs px-3.5 py-1.5 rounded-2xl border border-purple-100 shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-extrabold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>{t('chat.title')}</span>
          </div>
        </motion.button>
      </div>

      {/* Floating Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[92vw] sm:w-[440px] h-[580px] bg-white/95 backdrop-blur-2xl border border-purple-100 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-purple-50/90 border-b border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] p-0.5 shadow-sm">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-[#1E1B4B]">{t('chat.title')}</h4>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {t('chat.online')}
                    </span>
                  </div>
                  <p className="text-[10px] text-purple-800 font-semibold">{t('chat.subtitle')} {role}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearMessages}
                  className="p-1.5 text-purple-400 hover:text-purple-700 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
                  title={t('chat.clear')}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-purple-400 hover:text-purple-700 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
                  title={t('chat.close')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF7FF]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 pt-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-xl object-cover ring-1 ring-purple-200 flex-shrink-0 mt-0.5"
                  />
                  <div className={`max-w-[82%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white rounded-tr-none shadow-xs'
                        : 'bg-white text-[#1E1B4B] border border-purple-100 rounded-tl-none shadow-xs'
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-purple-600 font-semibold block px-1">{msg.timestamp}</span>

                    {/* Suggested Chips */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((action, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isLoading}
                            onClick={() => handleQuickPrompt(action)}
                            className="px-2.5 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-[#7C3AED] border border-purple-200 text-[11px] font-extrabold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <Zap className="w-3 h-3 text-[#7C3AED]" />
                            <span>{action}</span>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Animated Loading / Thinking Bubble */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 pt-1"
                >
                  <div className="w-7 h-7 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-[#7C3AED] animate-pulse" />
                  </div>
                  <div className="bg-white border border-purple-100 rounded-2xl rounded-tl-none p-3.5 shadow-xs flex items-center gap-2">
                    <span className="text-xs text-purple-900 font-bold">{t('chat.thinking')}</span>
                    <div className="flex items-center gap-1 pt-1">
                      <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-3.5 py-2 bg-purple-50/80 border-t border-purple-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="text-[10px] text-purple-900 font-extrabold flex-shrink-0">{t('chat.quickPrompts')}</span>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickPrompt('Can you explain photosynthesis in simple words?')}
                className="text-[10px] px-2.5 py-1 bg-white hover:bg-purple-100 border border-purple-200 font-bold text-purple-900 rounded-xl whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {t('chat.photosynthesis')}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickPrompt('Where is School Bus KA 09 AB 1234 right now?')}
                className="text-[10px] px-2.5 py-1 bg-white hover:bg-purple-100 border border-purple-200 font-bold text-purple-900 rounded-xl whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {t('chat.trackBus')}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickPrompt('Show my attendance summary')}
                className="text-[10px] px-2.5 py-1 bg-white hover:bg-purple-100 border border-purple-200 font-bold text-purple-900 rounded-xl whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {t('chat.attendance')}
              </button>
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-purple-100 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                disabled={isLoading}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isLoading ? `${t('chat.thinking')}...` : `${t('chat.placeholder')} (${role})...`}
                className="flex-1 bg-purple-50/50 border border-purple-100 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E1B4B] placeholder-purple-400 font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all disabled:opacity-50"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] text-white rounded-2xl transition-all shadow-xs cursor-pointer disabled:opacity-40"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
