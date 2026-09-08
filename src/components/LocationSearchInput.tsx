// ==============================================================================
// GETORA OLA MAPS AUTOCOMPLETE SEARCH INPUT
// Debounced predictive Indian address search powered by Ola Maps Places API
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { OlaMapsService, PlacePrediction } from '../services/olaMapsService';

export interface LocationSearchInputProps {
  placeholder?: string;
  value?: string;
  onSelectPlace: (place: PlacePrediction) => void;
  className?: string;
  autoFocus?: boolean;
}

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  placeholder = 'Search delivery area, apartment, landmark...',
  value = '',
  onSelectPlace,
  className = '',
  autoFocus = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Sync with controlled value if changed externally
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Click outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length < 2) {
      setPredictions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await OlaMapsService.autocomplete(query);
        setPredictions(results);
        setIsOpen(results.length > 0);
      } catch (err) {
        console.error('Autocomplete error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);
  };

  const handleSelect = (pred: PlacePrediction) => {
    setSearchTerm(pred.mainText);
    setIsOpen(false);
    onSelectPlace(pred);
  };

  const handleClear = () => {
    setSearchTerm('');
    setPredictions([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input Field */}
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9CA3AF]">
          <Search className="h-4 w-4 text-[#22C55E]" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            if (predictions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full rounded-lg border border-[rgba(34,197,94,0.2)] bg-[#0B1410] py-2.5 pl-9 pr-10 text-sm text-[#F5F5F5] placeholder-[#6B7280] transition-all focus:border-[#22C55E] focus:bg-[#0F1B15] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#22C55E]" />
          ) : searchTerm ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-[#9CA3AF] hover:text-[#F5F5F5]"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Autocomplete Predictions Dropdown */}
      {isOpen && predictions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-[rgba(34,197,94,0.25)] bg-[#0F1B15] p-1.5 shadow-2xl backdrop-blur-md">
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Suggested Locations (Ola Maps)
          </div>
          {predictions.map((p) => (
            <button
              key={p.placeId}
              type="button"
              onClick={() => handleSelect(p)}
              className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-[#162920] group"
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#22C55E] group-hover:scale-110 transition-transform" />
              <div className="flex-1 overflow-hidden">
                <div className="font-medium text-[#F5F5F5] truncate">{p.mainText}</div>
                {p.secondaryText && (
                  <div className="text-[11px] text-[#9CA3AF] truncate mt-0.5">
                    {p.secondaryText}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
