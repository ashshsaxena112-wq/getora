import React from 'react';
import { IconSparkles, IconCamera } from '@tabler/icons-react';
import { useGetora } from '../context/GetoraContext';

interface AiAssistantFloatingButtonProps {
  onOpen: () => void;
}

export const AiAssistantFloatingButton: React.FC<AiAssistantFloatingButtonProps> = ({ onOpen }) => {
  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 font-['Inter',sans-serif]">
      <button
        onClick={onOpen}
        className="group relative px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#121212] hover:bg-[#181818] border border-[#1DB954]/60 hover:border-[#1DB954] text-white font-bold text-xs sm:text-sm shadow-2xl shadow-[#1DB954]/30 flex items-center gap-2.5 cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95"
        title="Find products with GETORA AI"
      >
        {/* Glowing Background Pulse */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#1DB954] to-[#14532D] opacity-40 group-hover:opacity-75 blur-xs transition-opacity" />

        <div className="relative flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xs">
            <IconSparkles className="w-3.5 h-3.5 stroke-[2.5] animate-pulse" />
          </div>

          <span className="font-['Outfit',sans-serif] font-black tracking-wide text-white">
            Ask GETORA AI
          </span>

          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#14532D] border border-[#1DB954]/40 text-[#1DB954] text-[10px] font-extrabold uppercase">
            Photo / Price Finder
          </span>
        </div>
      </button>
    </div>
  );
};
