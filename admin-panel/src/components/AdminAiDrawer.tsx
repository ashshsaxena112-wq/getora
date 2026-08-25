import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  X
} from 'lucide-react';

interface AdminAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAiDrawer: React.FC<AdminAiDrawerProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text: "Hello Super Admin! I'm your GETORA Intelligence Assistant. Ask me anything about live platform sales, delivery delays in Jaipur, top merchant performance, or low stock alerts.",
      time: 'Just now'
    }
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Which category sold the most today?',
    'Which area has the highest delivery delay?',
    'Which retailers are performing best?',
    'Which items have zero search results?'
  ];

  const handleSend = (textToSend?: string) => {
    const prompt = textToSend || query;
    if (!prompt.trim()) return;

    const userMsg = { sender: 'user' as const, text: prompt, time: 'Just now' };
    let aiResponseText = '';

    if (prompt.includes('category') || prompt.includes('sold')) {
      aiResponseText =
        '📊 **Category Sales Summary (Today):**\n1. **Hardware & Fasteners**: ₹1,12,450 (46% of today’s GMV)\n2. **Electrical & Lighting**: ₹84,600 (34%)\n3. **Mobile Accessories**: ₹32,100 (13%)\n4. **Stationery & Others**: ₹16,636 (7%)\n\n*Top single item:* Stanley 13mm Impact Drill Bit Set (42 orders).';
    } else if (prompt.includes('delay') || prompt.includes('area')) {
      aiResponseText =
        '⚠️ **Delivery Delays Detected:**\n• **Mansarovar Zone**: 14 orders delayed by ~12 mins due to heavy evening traffic on Tonk Road.\n• **Malviya Nagar**: 6 orders delayed due to rain.\n• Recommendation: Reassign 4 idle riders from Vaishali Nagar to Mansarovar.';
    } else if (prompt.includes('retailer') || prompt.includes('best')) {
      aiResponseText =
        '🏬 **Top 3 Retailers Today:**\n1. **Sharma Hardware** (Vaishali Nagar): 128 orders, ₹1,28,450 revenue (4.8 ★)\n2. **Gupta Electricals** (Malviya Nagar): 97 orders, ₹98,760 revenue (4.7 ★)\n3. **Mobile Hub** (Mansarovar): 86 orders, ₹76,540 revenue (4.6 ★)';
    } else {
      aiResponseText =
        '🔍 **Search Demand Opportunity:**\n• "Bosch 13mm Rotary Drill": 184 searches with 0 available in Jaipur.\n• "Crompton 25W LED Panel": 92 searches.\n• Recommendation: Click "Add to Master Catalog" and invite local hardware merchants to stock these items.';
    }

    setMessages((prev) => [
      ...prev,
      userMsg,
      { sender: 'ai' as const, text: aiResponseText, time: 'Just now' }
    ]);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end animate-fadeIn font-['Inter',sans-serif]">
      <div className="w-full max-w-md bg-[#181818] border-l border-[#292929] h-full flex flex-col justify-between p-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#292929]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#169C46] to-[#1DB954] text-black flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                GETORA AI Assistant
              </h3>
              <p className="text-[10px] text-[#1DB954] font-semibold">Live Operational Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#202020] text-white flex items-center justify-center cursor-pointer hover:bg-[#292929]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-3 custom-scrollbar text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-6 h-6 rounded-lg bg-[#14532D] text-[#1DB954] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#14532D] text-white rounded-tr-none'
                    : 'bg-[#121212] text-[#E5E7EB] border border-[#292929] rounded-tl-none whitespace-pre-line'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="py-2 border-t border-[#292929] flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-lg bg-[#121212] hover:bg-[#202020] border border-[#292929] text-[10px] text-[#A7A7A7] hover:text-white whitespace-nowrap cursor-pointer transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI about sales, delays, inventory..."
            className="flex-1 px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-xs text-white placeholder-[#6F6F6F] focus:outline-none focus:border-[#1DB954]"
          />
          <button
            onClick={() => handleSend()}
            className="p-2 bg-[#1DB954] hover:bg-[#39D353] text-black font-bold rounded-xl cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
