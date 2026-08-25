import React, { useState, useRef, useEffect } from 'react';
import {
  IconSparkles,
  IconCamera,
  IconMicrophone,
  IconSearch,
  IconX,
  IconMapPin,
  IconCheck,
  IconShoppingBag,
  IconShieldCheck,
  IconClock,
  IconFlame,
  IconStar,
  IconArrowRight,
  IconChevronRight,
  IconRefresh,
  IconInfoCircle,
  IconBuildingStore,
  IconTag,
  IconBolt,
  IconPhoto,
  IconAdjustmentsHorizontal
} from '@tabler/icons-react';
import { useGetora } from '../context/GetoraContext';
import {
  identifyAndFindNearbyProducts,
  AiComparisonResponse,
  ShopComparisonItem
} from '../services/aiProductFinderService';
import { Product } from '../types';

interface GetoraAiProductFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialPhotoMode?: boolean;
}

// Preset Quick Sample Items for 1-Tap Customer Testing
const QUICK_SAMPLE_PRODUCTS = [
  {
    label: '⚡ USB-C Fast Charger',
    query: 'USB-C Fast Charger 25W',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    category: 'Mobile & Electronics'
  },
  {
    label: '💡 Philips 9W LED Bulb',
    query: 'Philips 9W LED Bulb',
    image: 'https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=600&auto=format&fit=crop&q=80',
    category: 'Electrical'
  },
  {
    label: '🔌 Havells 1.5mm Wire',
    query: 'Havells 1.5 sq mm copper wire',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    category: 'Electrical'
  },
  {
    label: '🔘 Anchor 6A Switch',
    query: 'Anchor 6A modular switch',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    category: 'Electrical'
  },
  {
    label: '🔧 Taparia Screwdriver Set',
    query: 'Taparia screwdriver set',
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&auto=format&fit=crop&q=80',
    category: 'Hardware'
  }
];

export const GetoraAiProductFinderModal: React.FC<GetoraAiProductFinderModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  initialPhotoMode = false
}) => {
  const {
    stores,
    products,
    selectedAddress,
    addToCart,
    openLocationModal,
    navigate
  } = useGetora();

  const [activeTab, setActiveTab] = useState<'input' | 'scanning' | 'results'>(
    initialQuery || initialPhotoMode ? 'scanning' : 'input'
  );

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [sortBy, setSortBy] = useState<'best_overall' | 'price' | 'distance' | 'speed' | 'rating'>('best_overall');
  const [addedStoreIds, setAddedStoreIds] = useState<Record<string, boolean>>({});

  const [comparisonData, setComparisonData] = useState<AiComparisonResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const SCAN_STEPS = [
    'Scanning product photo & specifications...',
    'Matching with live catalog & verified local stores in Jaipur...',
    'Calculating exact distance & 15-min delivery fees from your location...',
    'Comparing prices & generating optimal recommendations...'
  ];

  // Run AI discovery pipeline
  const runAiDiscovery = async (queryText?: string, imageSrc?: string, fileName?: string) => {
    setActiveTab('scanning');
    setScanStepIndex(0);
    setErrorMessage(null);

    // Step progress animation
    const stepInterval = setInterval(() => {
      setScanStepIndex((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      // Allow realistic analyzing feel (1.4s)
      await new Promise((res) => setTimeout(res, 1200));

      const result = await identifyAndFindNearbyProducts({
        query: queryText || inputQuery,
        imagePreviewUrl: imageSrc || selectedImage || undefined,
        imageFileName: fileName || imageFileName,
        customerAddress: selectedAddress,
        allStores: stores,
        allProducts: products
      });

      clearInterval(stepInterval);
      setComparisonData(result);
      setActiveTab('results');
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage('Unable to process AI product discovery right now. Please try again.');
      setActiveTab('input');
    }
  };

  // Handle Initial Trigger
  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setInputQuery(initialQuery);
        runAiDiscovery(initialQuery);
      } else if (initialPhotoMode) {
        // Open file picker or photo UI
        setActiveTab('input');
      } else {
        setActiveTab('input');
      }
    } else {
      // Reset state on close
      setInputQuery('');
      setSelectedImage(null);
      setImageFileName('');
      setComparisonData(null);
      setErrorMessage(null);
    }
  }, [isOpen, initialQuery, initialPhotoMode]);

  if (!isOpen) return null;

  // File Upload / Photo Capture Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setSelectedImage(dataUrl);
        runAiDiscovery(file.name.replace(/\.[^/.]+$/, ''), dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick Preset Click
  const handleQuickSampleClick = (sample: (typeof QUICK_SAMPLE_PRODUCTS)[0]) => {
    setInputQuery(sample.query);
    setSelectedImage(sample.image);
    setImageFileName(sample.label);
    runAiDiscovery(sample.query, sample.image, sample.label);
  };

  // Voice Search Handler (Web Speech API supporting Hindi/English)
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN'; // Supports Hindi + Hinglish + English

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        runAiDiscovery(transcript);
      };

      recognition.start();
    } else {
      alert('Voice search is not supported on this browser. Please type or upload a photo.');
    }
  };

  // Add to Cart handler
  const handleAddToCart = async (item: ShopComparisonItem) => {
    await addToCart(item.product, 1);
    setAddedStoreIds((prev) => ({ ...prev, [item.storeId]: true }));
    setTimeout(() => {
      setAddedStoreIds((prev) => ({ ...prev, [item.storeId]: false }));
    }, 2000);
  };

  // Sort shop options
  const sortedShopOptions = comparisonData?.shopOptions
    ? [...comparisonData.shopOptions].sort((a, b) => {
        if (sortBy === 'price') return a.totalPayable - b.totalPayable;
        if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
        if (sortBy === 'speed') return a.estimatedDeliveryMin - b.estimatedDeliveryMin;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        // Default best overall
        return (b as any)._compositeScore - (a as any)._compositeScore;
      })
    : [];

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn font-['Inter',sans-serif]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#121212] border border-[#292929] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* ========================================================================= */}
        {/* MODAL HEADER: Iconic GETORA AI Bar                                        */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-[#292929] bg-[#161616] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Iconic GETORA AI Badge Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14532D] to-[#1DB954]/40 border border-[#1DB954]/50 flex items-center justify-center text-[#1DB954] shadow-lg shadow-[#1DB954]/20 relative">
              <IconSparkles className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#1DB954] ring-2 ring-[#121212]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit',sans-serif]">
                  GETORA AI Product Finder
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#1DB954]/20 border border-[#1DB954]/40 text-[#1DB954] text-[10px] font-extrabold tracking-wide uppercase">
                  15-Min Delivery
                </span>
              </div>
              <p className="text-[11px] text-[#A7A7A7] flex items-center gap-1 mt-0.5">
                <IconMapPin className="w-3 h-3 text-[#1DB954] inline" />
                <span>Near:</span>
                <strong className="text-white font-medium">
                  {selectedAddress?.streetArea || selectedAddress?.city || 'Vaishali Nagar, Jaipur'}
                </strong>
                <button
                  onClick={openLocationModal}
                  className="text-[10px] text-[#1DB954] underline hover:text-[#39D353] ml-1 cursor-pointer font-bold"
                >
                  Change
                </button>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#202020] hover:bg-[#282828] text-[#A7A7A7] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#292929]"
            title="Close AI Finder"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MODAL BODY (Input / Scanning / Results)                                   */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] flex items-center gap-2.5 text-xs">
              <IconInfoCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STATE 1: INPUT & UPLOAD VIEW                                            */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === 'input' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Photo Upload Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative border-2 border-dashed border-[#292929] hover:border-[#1DB954] rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#181818]/60 hover:bg-[#181818]"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#14532D]/40 group-hover:bg-[#14532D]/70 border border-[#1DB954]/30 flex items-center justify-center text-[#1DB954] transition-all transform group-hover:scale-105 shadow-md">
                  <IconCamera className="w-7 h-7" />
                </div>

                <h3 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                  Search by Product Photo
                </h3>
                <p className="text-xs text-[#A7A7A7] mt-1 max-w-sm mx-auto">
                  Take a photo of any charger, wire, bulb, switch, hardware tool, or grocery item. GETORA AI will find nearby shops with exact prices & stock!
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1DB954]/15 border border-[#1DB954]/30 text-[#1DB954] text-[11px] font-bold">
                  <IconPhoto className="w-3.5 h-3.5" />
                  <span>Upload / Click Photo</span>
                </div>
              </div>

              {/* Text & Voice Query Search Bar */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#A7A7A7] uppercase tracking-wider">
                  Or Describe What You Need (Voice / Text)
                </label>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (inputQuery.trim()) runAiDiscovery(inputQuery);
                  }}
                  className="relative flex items-center"
                >
                  <div className="relative w-full flex items-center">
                    <IconSearch className="w-4 h-4 absolute left-3.5 text-[#6F6F6F]" />
                    <input
                      type="text"
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      placeholder='e.g. "500 ke andar fast charger", "Havells 1.5mm wire", "9W LED bulb"'
                      className="w-full pl-10 pr-24 py-3 bg-[#181818] border border-[#292929] rounded-2xl text-xs text-white placeholder-[#6F6F6F] focus:outline-none focus:border-[#1DB954] shadow-inner transition-colors"
                    />

                    <div className="absolute right-2 flex items-center gap-1.5">
                      {/* Voice Mic Button */}
                      <button
                        type="button"
                        onClick={handleVoiceSearch}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isListening
                            ? 'bg-[#EF4444] text-white border-[#EF4444] animate-pulse'
                            : 'bg-[#222222] hover:bg-[#292929] text-[#1DB954] border-[#292929]'
                        }`}
                        title="Voice Search (Hindi / English)"
                      >
                        <IconMicrophone className="w-4 h-4" />
                      </button>

                      {/* Find Button */}
                      <button
                        type="submit"
                        disabled={!inputQuery.trim()}
                        className="px-3.5 py-2 bg-[#1DB954] hover:bg-[#39D353] disabled:opacity-40 text-black font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1"
                      >
                        <span>Find</span>
                        <IconArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                </form>

                {isListening && (
                  <p className="text-[11px] text-[#1DB954] font-bold text-center animate-pulse mt-1">
                    🎙️ Listening in Hindi / English... Bolna shuru kijiye!
                  </p>
                )}
              </div>

              {/* 1-Tap Sample Products */}
              <div className="space-y-2 pt-2 border-t border-[#292929]">
                <span className="text-[11px] font-bold text-[#A7A7A7] uppercase tracking-wider block">
                  ⚡ Try Instant Sample Searches (1-Tap):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {QUICK_SAMPLE_PRODUCTS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickSampleClick(sample)}
                      className="p-2.5 rounded-xl bg-[#181818] hover:bg-[#202020] border border-[#292929] hover:border-[#1DB954]/50 text-left transition-all cursor-pointer group"
                    >
                      <span className="text-xs font-semibold text-white group-hover:text-[#1DB954] block truncate">
                        {sample.label}
                      </span>
                      <span className="text-[10px] text-[#6F6F6F] block mt-0.5">
                        {sample.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STATE 2: AI SCANNING & ANALYZING VIEW                                   */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === 'scanning' && (
            <div className="py-10 text-center space-y-6 animate-fadeIn">
              
              {/* Radar Scanner Animation */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#1DB954]/30 animate-ping opacity-75" />
                <div className="absolute inset-2 rounded-full border-2 border-[#1DB954]/50 animate-pulse" />
                <div className="w-20 h-20 rounded-2xl bg-[#14532D]/80 border-2 border-[#1DB954] flex items-center justify-center text-[#1DB954] shadow-xl shadow-[#1DB954]/30 z-10">
                  <IconSparkles className="w-9 h-9 animate-spin" />
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit',sans-serif]">
                  GETORA AI is finding the best options near you...
                </h3>
                <p className="text-xs text-[#1DB954] font-medium mt-1 animate-pulse">
                  {SCAN_STEPS[scanStepIndex]}
                </p>
              </div>

              {/* Progress Pills */}
              <div className="max-w-md mx-auto grid grid-cols-4 gap-1.5 pt-2">
                {SCAN_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i <= scanStepIndex ? 'bg-[#1DB954]' : 'bg-[#292929]'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* STATE 3: COMPARISON RESULTS & NEARBY STORES                             */}
          {/* ----------------------------------------------------------------------- */}
          {activeTab === 'results' && comparisonData && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Top Identified Product Summary Card */}
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#292929] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  {comparisonData.productInfo.imageUrl && (
                    <img
                      src={comparisonData.productInfo.imageUrl}
                      alt={comparisonData.productInfo.identifiedProductName}
                      className="w-14 h-14 rounded-xl object-cover border border-[#292929] bg-[#121212] flex-shrink-0"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#14532D] text-[#1DB954] text-[9px] font-black uppercase">
                        AI Identified ✓
                      </span>
                      <span className="text-[10px] text-[#A7A7A7]">
                        {comparisonData.productInfo.categoryName}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit',sans-serif] mt-0.5">
                      {comparisonData.productInfo.identifiedProductName}
                    </h3>
                    <p className="text-[11px] text-[#A7A7A7]">
                      Brand: <strong className="text-white">{comparisonData.productInfo.brand}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('input');
                    setInputQuery('');
                    setSelectedImage(null);
                  }}
                  className="text-xs text-[#1DB954] hover:text-[#39D353] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <IconRefresh className="w-3.5 h-3.5" />
                  <span>Scan Another</span>
                </button>
              </div>

              {/* AI Recommendation Banner */}
              {comparisonData.bestRecommendation && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#14532D]/50 to-[#0F3D22]/30 border border-[#1DB954]/50 flex items-start gap-3 shadow-md">
                  <div className="p-1.5 rounded-lg bg-[#1DB954] text-black flex-shrink-0 mt-0.5">
                    <IconSparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1DB954] block">
                      GETORA AI Recommendation
                    </span>
                    <p className="text-xs font-bold text-white mt-0.5">
                      "{comparisonData.bestRecommendation.text}"
                    </p>
                  </div>
                </div>
              )}

              {/* Sorting Filter Tabs */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar pb-1">
                <span className="text-xs font-bold text-[#A7A7A7] uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
                  <IconAdjustmentsHorizontal className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span>Sort By:</span>
                </span>

                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'best_overall', label: '🏆 Best Overall' },
                    { id: 'price', label: '💰 Lowest Price' },
                    { id: 'distance', label: '📍 Nearest' },
                    { id: 'speed', label: '⚡ Fastest Delivery' },
                    { id: 'rating', label: '⭐ Best Rated' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSortBy(tab.id as any)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                        sortBy === tab.id
                          ? 'bg-[#1DB954] text-black shadow-xs'
                          : 'bg-[#181818] text-[#A7A7A7] hover:text-white border border-[#292929]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nearby Store Comparison Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#A7A7A7] uppercase tracking-wider">
                  <span>Available at {sortedShopOptions.length} Nearby Shops</span>
                  <span>Price + Delivery Fee</span>
                </div>

                {sortedShopOptions.map((item) => {
                  const isAdded = !!addedStoreIds[item.storeId];
                  return (
                    <div
                      key={item.storeId}
                      className="p-4 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#1DB954]/60 transition-all shadow-md space-y-3"
                    >
                      {/* Store Header & Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm sm:text-base font-bold text-white font-['Outfit',sans-serif]">
                              {item.storeName}
                            </h4>
                            {item.isVerified && (
                              <span title="Verified Local Merchant">
                                <IconShieldCheck className="w-4 h-4 text-[#1DB954]" />
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#A7A7A7] mt-0.5">
                            <span className="flex items-center gap-1 text-[#1DB954] font-bold">
                              <IconMapPin className="w-3.5 h-3.5" />
                              <span>{item.distanceKm} km away ({item.locality})</span>
                            </span>

                            <span>•</span>

                            <span className="flex items-center gap-1 font-medium">
                              <IconClock className="w-3.5 h-3.5 text-[#FFCC00]" />
                              <span>{item.estimatedDeliveryMin} min ETA</span>
                            </span>

                            <span>•</span>

                            <span className="flex items-center gap-1 text-[#FFCC00] font-bold">
                              <IconStar className="w-3.5 h-3.5 fill-current" />
                              <span>{item.rating}</span>
                            </span>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center justify-end gap-1">
                          {item.badges.includes('best_overall') && (
                            <span className="px-2 py-0.5 rounded-full bg-[#1DB954]/20 border border-[#1DB954]/50 text-[#1DB954] text-[10px] font-black uppercase">
                              🏆 Best Overall
                            </span>
                          )}
                          {item.badges.includes('cheapest') && (
                            <span className="px-2 py-0.5 rounded-full bg-[#34C759]/20 border border-[#34C759]/50 text-[#34C759] text-[10px] font-black uppercase">
                              💰 Cheapest
                            </span>
                          )}
                          {item.badges.includes('nearest') && (
                            <span className="px-2 py-0.5 rounded-full bg-[#0A84FF]/20 border border-[#0A84FF]/50 text-[#0A84FF] text-[10px] font-black uppercase">
                              📍 Nearest
                            </span>
                          )}
                          {item.badges.includes('fastest') && (
                            <span className="px-2 py-0.5 rounded-full bg-[#FFCC00]/20 border border-[#FFCC00]/50 text-[#FFCC00] text-[10px] font-black uppercase">
                              ⚡ Fastest
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing & Add to Cart Action Row */}
                      <div className="pt-3 border-t border-[#292929] flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg sm:text-xl font-black text-white">
                              ₹{item.productPrice}
                            </span>
                            {item.originalPrice && (
                              <span className="text-xs text-[#6F6F6F] line-through">
                                ₹{item.originalPrice}
                              </span>
                            )}
                            <span className="text-[11px] text-[#A7A7A7]">
                              + ₹{item.deliveryFee} delivery
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-[#1DB954]">
                            Total: ₹{item.totalPayable} • {item.stockStatus}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigate('store', { storeId: item.storeId });
                              onClose();
                            }}
                            className="hidden sm:inline-flex px-3 py-2 bg-[#202020] hover:bg-[#282828] text-[#A7A7A7] hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                          >
                            View Store
                          </button>

                          <button
                            onClick={() => handleAddToCart(item)}
                            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                              isAdded
                                ? 'bg-[#14532D] text-[#1DB954] border border-[#1DB954]'
                                : 'bg-[#1DB954] hover:bg-[#39D353] text-black active:scale-95'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <IconCheck className="w-4 h-4 stroke-[3]" />
                                <span>Added ✓</span>
                              </>
                            ) : (
                              <>
                                <IconShoppingBag className="w-4 h-4" />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Similar / Compatible Alternatives */}
              {comparisonData.alternatives.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-[#292929]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#A7A7A7] uppercase tracking-wider">
                      🔄 Similar / Compatible Products
                    </span>
                    <span className="text-[10px] text-[#1DB954] font-semibold">
                      (Verified Alternatives)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {comparisonData.alternatives.map((alt, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#181818] border border-[#292929] flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <span className="text-[9px] font-bold text-[#FF9500] uppercase block">
                            Alternative
                          </span>
                          <h5 className="font-bold text-white truncate max-w-[160px] sm:max-w-[200px]">
                            {alt.product.name}
                          </h5>
                          <span className="text-[11px] text-[#A7A7A7]">
                            ₹{alt.productPrice} • {alt.storeName} ({alt.distanceKm} km)
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(alt)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#202020] hover:bg-[#1DB954] text-white hover:text-black font-extrabold text-[11px] transition-colors cursor-pointer flex-shrink-0"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* MODAL FOOTER                                                              */}
        {/* ========================================================================= */}
        <div className="p-3.5 sm:p-4 border-t border-[#292929] bg-[#161616] flex items-center justify-between flex-shrink-0 text-xs">
          <div className="flex items-center gap-1.5 text-[#A7A7A7]">
            <IconBolt className="w-4 h-4 text-[#1DB954]" />
            <span className="hidden sm:inline">GETORA Local Intelligence • Instant Local Delivery</span>
            <span className="sm:hidden">GETORA AI</span>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'results' && (
              <button
                onClick={() => {
                  navigate('cart');
                  onClose();
                }}
                className="px-4 py-2 bg-[#1DB954] hover:bg-[#39D353] text-black font-extrabold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
              >
                <IconShoppingBag className="w-4 h-4" />
                <span>Go to Cart</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#202020] hover:bg-[#282828] text-white rounded-xl font-bold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
