import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, UserRole } from '../types';
import { sendAiChatApi } from '../services/api';

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: ChatMessage[];
  sendMessage: (text: string, currentRole: UserRole) => Promise<void>;
  clearMessages: () => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load message history from localStorage if available
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('edupulse_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'welcome_ai',
        senderId: 'ai_bot',
        senderName: 'EduSync AI Guide',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        role: 'assistant',
        text: 'Greetings! I am EduSync AI, your universal academic guide and campus assistant. How can I help you today?',
        timestamp: 'Just now',
        suggestedActions: [
          'Can you explain photosynthesis?',
          'Solve math equation: 45 * 12',
          'Where is School Bus KA 09 AB 1234?',
          'Show my attendance report'
        ]
      }
    ];
  });

  // Save chat history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('edupulse_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
  }, [messages]);

  const sendMessage = async (text: string, role: UserRole) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      senderId: 'current_user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await sendAiChatApi(trimmed, role);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        senderId: 'ai_bot',
        senderName: 'EduSync AI Guide',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        role: 'assistant',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: res.suggestedActions || ['Ask follow-up question', 'View Study Notes']
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `ai_err_${Date.now()}`,
        senderId: 'ai_bot',
        senderName: 'EduSync AI Guide',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        role: 'assistant',
        text: `⚠️ **Connection Notice**: Unable to contact the remote AI cluster at this moment. Local academic assistant engine is active. Please ask your question again or explore the quick prompts below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: ['Explain Photosynthesis', 'Track School Bus', 'Attendance Summary']
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    const welcomeMsg: ChatMessage = {
      id: `welcome_${Date.now()}`,
      senderId: 'ai_bot',
      senderName: 'EduSync AI Guide',
      senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      role: 'assistant',
      text: 'Conversation reset. How can I assist you today?',
      timestamp: 'Just now',
      suggestedActions: [
        'Can you explain photosynthesis?',
        'Solve math equation: 45 * 12',
        'Where is School Bus KA 09 AB 1234?',
        'Show my attendance report'
      ]
    };
    setMessages([welcomeMsg]);
  };

  return (
    <ChatContext.Provider value={{
      isOpen,
      setIsOpen,
      messages,
      sendMessage,
      clearMessages,
      isLoading
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
