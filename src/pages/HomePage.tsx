import React, { useState, useEffect } from 'react';
import {
  IconTruckDelivery,
  IconSparkles,
  IconArrowRight,
  IconBolt,
  IconTag,
  IconShieldCheck,
  IconMapPin,
  IconFlame,
  IconStar,
  IconClock,
  IconChevronRight,
  IconBuildingStore,
  IconPackage,
  IconCheck,
  IconApple,
  IconHeadphones,
  IconTool,
  IconDeviceMobile,
  IconBook,
  IconHome,
  IconCar,
  IconHeart,
  IconPill,
  IconCamera,
  IconMicrophone,
  IconPhoto
} from '@tabler/icons-react';
import { useGetora } from '../context/GetoraContext';
import { StoreCard } from '../components/StoreCard';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const {
    categories,
    stores,
    products,
    isLoadingCatalog,
    navigate,
    applyCoupon,
    selectedAddress,
    openLocationModal,
    openAiFinder
  } = useGetora();

  const [storeFilter, setStoreFilter] = useState<'all' | 'fastest' | 'rating' | 'offers'>('all');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const handleCopyCoupon = (code: string) => {
    applyCoupon(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  // Primary 10 Quick Categories matching 4-per-row grid
  const QUICK_CATEGORIES = [
    { id: 'cat-grocery', name: 'Grocery', icon: IconApple, color: '#34C759', bg: 'rgba(52, 199, 89, 0.12)' },
    { id: 'cat-pharmacy', name: 'Pharmacy', icon: IconPill, color: '#0A84FF', bg: 'rgba(10, 132, 255, 0.12)' },
    { id: 'cat-electronics', name: 'Electronics', icon: IconHeadphones, color: '#5E5CE6', bg: 'rgba(94, 92, 230, 0.12)' },
    { id: 'cat-electrical', name: 'Electrical', icon: IconBolt, color: '#FFCC00', bg: 'rgba(255, 204, 0, 0.12)' },
    { id: 'cat-hardware', name: 'Hardware', icon: IconTool, color: '#FF9500', bg: 'rgba(255, 149, 0, 0.12)' },
    { id: 'cat-mobile', name: 'Mobile', icon: IconDeviceMobile, color: '#0A84FF', bg: 'rgba(10, 132, 255, 0.12)' },
    { id: 'cat-stationery', name: 'Stationery', icon: IconBook, color: '#30D158', bg: 'rgba(48, 209, 88, 0.12)' },
    { id: 'cat-home', name: 'Home', icon: IconHome, color: '#FF375F', bg: 'rgba(255, 55, 95, 0.12)' },
    { id: 'cat-auto', name: 'Auto Parts', icon: IconCar, color: '#BF5AF2', bg: 'rgba(191, 90, 242, 0.12)' },
    { id: 'cat-pet', name: 'Pet Care', icon: IconHeart, color: '#FF2D55', bg: 'rgba(255, 45, 85, 0.12)' }
  ];

  const visibleCategories = showAllCategories ? QUICK_CATEGORIES : QUICK_CATEGORIES.slice(0, 8);

  // Filter & sort stores
  const filteredStores = stores
    .filter((st) => {
      if (selectedCategoryTab === 'all') return true;
      return (
        st.businessCategory?.toLowerCase().includes(selectedCategoryTab.toLowerCase()) ||
        st.categoryName?.toLowerCase().includes(selectedCategoryTab.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (storeFilter === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (storeFilter === 'fastest') return (a.deliveryEtaMin || 20) - (b.deliveryEtaMin || 20);
      return 0;
    });

  const popularProducts = products.slice(0, 8);

  return (
    <div className="home-page-container" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '12px 16px 64px' }}>
      
      {/* ========================================================================= */}
      {/* 1. PROMOTIONAL / OFFER HERO BANNER (REUSING EXISTING THEME COLORS)        */}
      {/* ========================================================================= */}
      <section
        className="promo-hero-banner"
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, #0A0F0D 0%, #0F3D22 60%, #14532D 100%)',
          border: '1px solid var(--border-color)',
          padding: '24px 28px',
          overflow: 'hidden',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        {/* Glow & subtle dot overlay */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 'var(--radius-pill)', padding: '4px 12px', marginBottom: '12px' }}>
            <IconBolt size={15} color="var(--color-green-bright)" stroke={2.2} />
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-green-bright)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Instant Local Delivery
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(20px, 3.5vw, 32px)', fontWeight: 900, color: '#FFFFFF', lineHeight: '1.2', margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>
            Your Neighborhood Shops, <br />
            <span style={{ color: 'var(--color-green-bright)' }}>Delivered in 15 Minutes.</span>
          </h1>

          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', margin: '0 0 16px', lineHeight: '1.5' }}>
            Directly connect with nearby hardware, electrical, grocery, and electronic merchants in your locality.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            {/* Promo Code Pill with Copy */}
            <div
              onClick={() => handleCopyCoupon('GETORA10')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px dashed var(--color-green)',
                borderRadius: 'var(--radius-lg)',
                padding: '6px 12px',
                cursor: 'pointer'
              }}
            >
              <IconTag size={15} color="var(--color-green)" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFF', letterSpacing: '0.5px' }}>GETORA10</span>
              <span style={{ fontSize: '11px', color: 'var(--color-green)', fontWeight: 600 }}>
                {copiedCoupon === 'GETORA10' ? 'Applied ✓' : '₹50 OFF (Tap to Apply)'}
              </span>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('nearby-shops-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                padding: '8px 18px',
                background: 'var(--color-green)',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                color: '#000',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'transform 0.15s ease'
              }}
            >
              <span>Explore Nearby Shops</span>
              <IconArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. GETORA AI PRODUCT FINDER INTERACTIVE LAUNCHER BANNER                   */}
      {/* ========================================================================= */}
      <section
        className="ai-product-finder-home-banner"
        style={{
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, #141414 0%, #162419 60%, #143521 100%)',
          border: '1px solid rgba(29, 185, 84, 0.4)',
          padding: '20px 24px',
          marginBottom: '28px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#1DB954', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(29, 185, 84, 0.5)' }}>
                <IconSparkles size={22} stroke={2.5} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-display)' }}>
                    GETORA AI Product Finder
                  </h2>
                  <span style={{ padding: '2px 8px', borderRadius: '999px', background: 'rgba(29, 185, 84, 0.2)', border: '1px solid rgba(29, 185, 84, 0.4)', color: '#1DB954', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                    Photo / Voice / Compare
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#A7A7A7', margin: '2px 0 0' }}>
                  Upload a photo or speak in Hindi/English. We'll find nearby shops, compare lowest prices, and deliver in 15 mins.
                </p>
              </div>
            </div>

            {/* Main Action Trigger */}
            <button
              onClick={() => openAiFinder()}
              style={{
                padding: '9px 18px',
                background: '#1DB954',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                color: '#000',
                fontSize: '12px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(29, 185, 84, 0.35)',
                transition: 'all 0.15s ease'
              }}
              className="hover:scale-105 active:scale-95"
            >
              <span>Ask GETORA AI</span>
              <IconArrowRight size={15} stroke={2.5} />
            </button>
          </div>

          {/* Quick Triggers Grid (Photo Search, Voice Search, Preset Samples) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            
            {/* 1. Photo Search */}
            <div
              onClick={() => openAiFinder({ photoMode: true })}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(29, 185, 84, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'border 0.2s ease'
              }}
              className="hover:border-[#1DB954]"
            >
              <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(29, 185, 84, 0.15)', color: '#1DB954' }}>
                <IconCamera size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '12px', color: '#FFF', display: 'block' }}>Search by Photo</strong>
                <span style={{ fontSize: '10px', color: '#A7A7A7' }}>Upload or click product photo</span>
              </div>
            </div>

            {/* 2. Voice Search */}
            <div
              onClick={() => openAiFinder()}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(29, 185, 84, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'border 0.2s ease'
              }}
              className="hover:border-[#1DB954]"
            >
              <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(29, 185, 84, 0.15)', color: '#1DB954' }}>
                <IconMicrophone size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '12px', color: '#FFF', display: 'block' }}>Voice Assistant</strong>
                <span style={{ fontSize: '10px', color: '#A7A7A7' }}>Hindi, Hinglish, or English</span>
              </div>
            </div>

            {/* 3. Fast Sample: USB-C Charger */}
            <div
              onClick={() => openAiFinder({ query: 'USB-C Fast Charger 25W' })}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'border 0.2s ease'
              }}
              className="hover:border-[#1DB954]"
            >
              <span style={{ fontSize: '14px' }}>⚡</span>
              <div>
                <strong style={{ fontSize: '11px', color: '#FFF', display: 'block' }}>Fast Charger</strong>
                <span style={{ fontSize: '10px', color: 'var(--color-green)' }}>Compare ₹220 - ₹269</span>
              </div>
            </div>

            {/* 4. Fast Sample: Havells Wire */}
            <div
              onClick={() => openAiFinder({ query: 'Havells 1.5 sq mm copper wire' })}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'border 0.2s ease'
              }}
              className="hover:border-[#1DB954]"
            >
              <span style={{ fontSize: '14px' }}>🔌</span>
              <div>
                <strong style={{ fontSize: '11px', color: '#FFF', display: 'block' }}>Havells Wire 1.5mm</strong>
                <span style={{ fontSize: '10px', color: 'var(--color-green)' }}>Compare 3 Nearby Shops</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. QUICK CATEGORIES (PRIMARY 4-PER-ROW GRID WITH "SEE ALL" LINK)          */}
      {/* ========================================================================= */}
      <section className="quick-categories-section" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-display)' }}>
              Categories
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Select a category to browse local shops & products
            </p>
          </div>

          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-green)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{showAllCategories ? 'Show Less' : 'See all'}</span>
            <IconChevronRight size={14} />
          </button>
        </div>

        {/* 4-per-row mobile grid, 8-per-row desktop */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))',
            gap: '12px'
          }}
        >
          {visibleCategories.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedCategoryTab === cat.name;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  if (selectedCategoryTab === cat.name) {
                    setSelectedCategoryTab('all');
                  } else {
                    setSelectedCategoryTab(cat.name);
                  }
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  padding: '10px 4px',
                  borderRadius: 'var(--radius-lg)',
                  background: isSelected ? 'var(--color-green-dim)' : 'var(--bg-card)',
                  border: isSelected ? '1.5px solid var(--color-green)' : '1px solid var(--border-subtle)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                className="category-icon-card"
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: cat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: cat.color,
                    boxShadow: isSelected ? '0 0 12px var(--color-green-dim)' : 'none',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <IconComp size={22} stroke={2} />
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: isSelected ? 800 : 600,
                    color: isSelected ? 'var(--color-green)' : 'var(--text-primary)',
                    lineHeight: '1.2'
                  }}
                >
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. NEARBY SHOPS SECTION (CORE TO THE "NEAR BY SHOP" CONCEPT)              */}
      {/* ========================================================================= */}
      <section id="nearby-shops-section" style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-display)' }}>
                🏬 Nearby Local Shops
              </h2>
              <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--color-green-dim)', color: 'var(--color-green)' }}>
                {filteredStores.length} Open Near You
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Verified neighborhood merchants delivering within 15–20 minutes
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { id: 'all', label: 'All Stores' },
              { id: 'fastest', label: '⚡ Fastest (15m)' },
              { id: 'rating', label: '★ Top Rated (4.5+)' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStoreFilter(f.id as any)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: storeFilter === f.id ? '1px solid var(--color-green)' : '1px solid var(--border-subtle)',
                  background: storeFilter === f.id ? 'var(--color-green)' : 'var(--bg-secondary)',
                  color: storeFilter === f.id ? '#000' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nearby Shops Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          {filteredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              color: 'var(--text-muted)'
            }}
          >
            <IconBuildingStore size={36} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              No shops found in this category
            </p>
            <button
              onClick={() => setSelectedCategoryTab('all')}
              style={{
                marginTop: '10px',
                padding: '6px 14px',
                background: 'var(--color-green)',
                color: '#000',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              View All Nearby Shops
            </button>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. POPULAR PRODUCTS FROM NEARBY STORES                                    */}
      {/* ========================================================================= */}
      <section style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconFlame size={20} color="#FF375F" />
              <h2 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-display)' }}>
                Popular in Your Area
              </h2>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Fast-moving essentials and top rated products from local shops
            </p>
          </div>

          <button
            onClick={() => navigate('search')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-green)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>View all products</span>
            <IconChevronRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '14px'
          }}
        >
          {popularProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW GETORA WORKS (MINIMAL TRUST BADGES)                                 */}
      {/* ========================================================================= */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
          padding: '20px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-pill)', background: 'var(--color-green-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green)', flexShrink: 0 }}>
            <IconBuildingStore size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Direct Local Shops</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Discover verified merchants in your neighborhood</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-pill)', background: 'var(--color-green-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green)', flexShrink: 0 }}>
            <IconTruckDelivery size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>15–20 Min Delivery</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Real-time rider tracking from store to your door</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-pill)', background: 'var(--color-green-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green)', flexShrink: 0 }}>
            <IconShieldCheck size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>100% Genuine Billing</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Original store prices, MRP assurance & instant receipts</p>
          </div>
        </div>
      </section>

    </div>
  );
};
