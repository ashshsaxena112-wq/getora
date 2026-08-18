import React, { useState, useEffect } from 'react';
import {
  Truck,
  Sparkles,
  ArrowRight,
  Zap,
  Tag,
  ShieldCheck,
  MapPin,
  Flame,
  Star,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Store as StoreIcon,
  Package,
  Bike,
  ShieldAlert,
  Percent,
  Search,
  Loader2
} from 'lucide-react';
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
    openAuthModal,
    user,
    role,
    searchQuery,
    setSearchQuery
  } = useGetora();

  const [storeFilter, setStoreFilter] = useState<'all' | 'nearest' | 'rating' | 'fastest' | 'offers'>('all');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Flash deal countdown timer state (hours:mins:secs)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter & sort stores
  const filteredStores = stores.filter((st) => {
    if (selectedCategoryTab === 'all') return true;
    return st.businessCategory?.toLowerCase().includes(selectedCategoryTab.toLowerCase());
  }).sort((a, b) => {
    if (storeFilter === 'rating') return b.rating - a.rating;
    if (storeFilter === 'fastest') return 0;
    if (storeFilter === 'offers') return 0;
    return 0;
  });

  const popularProducts = products.slice(0, 8);

  const handleCopyCoupon = (code: string) => {
    applyCoupon(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const handleQuickSearch = (keyword: string) => {
    setSearchQuery(keyword);
    navigate('search', { q: keyword });
  };

  return (
    <div className="home-page-container" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 16px 64px' }}>
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER & SEARCH BAR                                              */}
      {/* ========================================================================= */}
      <section 
        className="hero-banner"
        style={{
          position: 'relative',
          borderRadius: '24px',
          padding: '48px 36px',
          margin: '20px 0 40px',
          background: 'radial-gradient(ellipse at 80% 20%, rgba(29, 185, 84, 0.2) 0%, rgba(18, 18, 18, 0.95) 70%), #121212',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '720px', position: 'relative', zIndex: 2 }}>
          {/* Location Badge */}
          <div 
            onClick={openLocationModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(29, 185, 84, 0.12)',
              border: '1px solid rgba(29, 185, 84, 0.35)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#39D353',
              marginBottom: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <MapPin size={15} />
            <span>Delivering to: <strong style={{ color: '#FFFFFF' }}>{selectedAddress?.city || 'Bengaluru'}</strong> {selectedAddress?.addressLine2 ? `(${selectedAddress.addressLine2})` : ''}</span>
            <ChevronRight size={14} />
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 800,
            lineHeight: 1.15,
            fontFamily: 'Outfit, Inter, sans-serif',
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            marginBottom: '18px'
          }}>
            Everything You Need, <br />
            <span style={{ 
              background: 'linear-gradient(90deg, #1DB954 0%, #39D353 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Delivered in 15–25 Mins.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 17px)',
            color: '#A7A7A7',
            lineHeight: 1.6,
            marginBottom: '32px',
            maxWidth: '600px'
          }}>
            Order authentic hardware, electrical supplies, tech accessories, stationery, and daily home essentials directly from verified local shops in your neighborhood.
          </p>

          {/* Quick Search on Hero */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#181818',
            border: '1px solid #292929',
            borderRadius: '16px',
            padding: '8px 12px 8px 18px',
            maxWidth: '560px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            marginBottom: '20px'
          }}>
            <Search size={20} color="#A7A7A7" style={{ marginRight: '10px' }} />
            <input 
              type="text"
              placeholder="Search products, brands, or local shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate('search', { q: searchQuery.trim() });
                }
              }}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '15px',
                outline: 'none'
              }}
            />
            <button 
              className="btn-primary"
              onClick={() => {
                if (searchQuery.trim()) navigate('search', { q: searchQuery.trim() });
                else navigate('stores');
              }}
              style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '14px' }}
            >
              Search
            </button>
          </div>

          {/* Quick Search Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '13px', color: '#A7A7A7' }}>
            <span style={{ fontWeight: 600, color: '#fff' }}>Trending:</span>
            {['LED Bulbs', 'Drill Kits', 'Fast Charger', 'FR Wire', 'Switch Plate', 'Pet Care'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleQuickSearch(tag)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#D1D5DB',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Floating Feature Pill Cards (Right Side Desktop) */}
        <div 
          style={{
            position: 'absolute',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 2
          }}
          className="hero-badge-desktop"
        >
          <div style={{
            backgroundColor: 'rgba(24, 24, 24, 0.85)',
            border: '1px solid #292929',
            padding: '16px 20px',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            width: '240px'
          }}>
            <div style={{ backgroundColor: 'rgba(29, 185, 84, 0.15)', color: '#1DB954', padding: '10px', borderRadius: '12px' }}>
              <Zap size={22} />
            </div>
            <div>
              <div style={{ color: '#1DB954', fontWeight: 800, fontSize: '18px', fontFamily: 'Outfit' }}>15–25 MINS</div>
              <div style={{ color: '#A7A7A7', fontSize: '12px' }}>Hyperlocal Delivery</div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(24, 24, 24, 0.85)',
            border: '1px solid #292929',
            padding: '16px 20px',
            borderRadius: '16px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            width: '240px'
          }}>
            <div style={{ backgroundColor: 'rgba(57, 211, 83, 0.15)', color: '#39D353', padding: '10px', borderRadius: '12px' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '16px', fontFamily: 'Outfit' }}>100% Genuine</div>
              <div style={{ color: '#A7A7A7', fontSize: '12px' }}>Verified Local Retailers</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1.5 MOBILE QUICK CATEGORIES RAIL (Blinkit/Zepto Native App Style)         */}
      {/* ========================================================================= */}
      <section style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'Outfit', color: '#fff' }}>
            Quick Categories
          </h3>
          <button
            onClick={() => navigate('categories')}
            style={{ fontSize: '12.5px', color: '#1DB954', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}
          >
            See All <ChevronRight size={14} />
          </button>
        </div>
        <div className="mobile-category-rail">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="mobile-category-chip"
              onClick={() => navigate('categories', { categoryId: cat.id })}
            >
              <div className="mobile-category-icon-circle">
                <img
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=80'}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
              <span className="mobile-category-chip-label">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST & SPEED VALUE PROPOSITION STRIP                                */}
      {/* ========================================================================= */}
      <section className="trust-strip-grid">
        {[
          { icon: <Zap color="#1DB954" size={20} />, title: '15-25 Min Fast Delivery', desc: 'Dispatched instantly from neighbor shops' },
          { icon: <StoreIcon color="#1DB954" size={20} />, title: 'Local Neighborhood Stores', desc: 'Support trusted local merchants near you' },
          { icon: <Bike color="#1DB954" size={20} />, title: 'Live GPS Fleet Tracking', desc: 'Real-time rider updates to your doorstep' },
          { icon: <ShieldCheck color="#1DB954" size={20} />, title: 'Cash on Delivery & UPI', desc: 'Secure payments & easy 24/7 support' }
        ].map((item, idx) => (
          <div 
            key={idx}
            style={{
              backgroundColor: '#141414',
              border: '1px solid #242424',
              padding: '14px 16px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{ backgroundColor: 'rgba(29,185,84,0.1)', padding: '9px', borderRadius: '10px', flexShrink: 0 }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>{item.title}</div>
              <div style={{ fontSize: '11px', color: '#8E8E93' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ========================================================================= */}
      {/* 3. BROWSE CATEGORIES SECTION (Real Supabase Categories)                   */}
      {/* ========================================================================= */}
      <section style={{ marginBottom: '44px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Outfit', color: '#fff' }}>
              Explore Categories
            </h2>
            <p style={{ color: '#A7A7A7', fontSize: '12.5px', marginTop: '2px' }}>
              Select a category to explore neighborhood inventory
            </p>
          </div>
          <button 
            className="section-link" 
            onClick={() => navigate('categories')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1DB954', fontWeight: 600, fontSize: '13.5px' }}
          >
            View All <ArrowRight size={15} />
          </button>
        </div>

        {/* Loading / Categories Grid */}
        {isLoadingCatalog ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#1DB954', gap: '10px' }}>
            <Loader2 size={24} className="spin" /> Loading categories...
          </div>
        ) : (
          <div className="home-categories-grid">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate('categories', { categoryId: cat.id })}
                style={{
                  backgroundColor: '#181818',
                  border: '1px solid #262626',
                  borderRadius: '14px',
                  padding: '12px 8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  margin: '0 auto 8px',
                  overflow: 'hidden',
                  backgroundColor: '#202020'
                }}>
                  <img 
                    src={cat.imageUrl || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=80'} 
                    alt={cat.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    loading="lazy" 
                  />
                </div>
                <h3 style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff', marginBottom: '2px', lineHeight: 1.2 }}>{cat.name}</h3>
                <p style={{ fontSize: '11px', color: '#1DB954', fontWeight: 500 }}>Shop Now</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. FLASH DEALS & PROMOTIONS STRIP                                         */}
      {/* ========================================================================= */}
      <section style={{ marginBottom: '44px' }}>
        <div className="flash-deal-banner">
          {/* Left info & countdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: 'rgba(29, 185, 84, 0.18)',
              color: '#1DB954',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Flame size={24} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>
                  Flash Offer: Flat ₹100 Off
                </span>
                <span style={{
                  backgroundColor: 'rgba(255, 82, 82, 0.2)',
                  color: '#FF5252',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}>
                  ENDS SOON
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#A7A7A7' }}>
                Use code <strong style={{ color: '#1DB954' }}>GETORA100</strong> on your order above ₹299.
              </div>
            </div>

            {/* Countdown Display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '10px' }}>
              <Clock size={16} color="#A7A7A7" />
              <div style={{ display: 'flex', gap: '4px', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: '#fff' }}>
                <span style={{ backgroundColor: '#202020', padding: '4px 8px', borderRadius: '6px' }}>{String(timeLeft.hours).padStart(2, '0')}h</span> :
                <span style={{ backgroundColor: '#202020', padding: '4px 8px', borderRadius: '6px' }}>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
                <span style={{ backgroundColor: '#202020', padding: '4px 8px', borderRadius: '6px' }}>{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn-primary"
              onClick={() => handleCopyCoupon('GETORA100')}
              style={{
                backgroundColor: copiedCoupon === 'GETORA100' ? '#39D353' : '#1DB954',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px'
              }}
            >
              {copiedCoupon === 'GETORA100' ? '✓ Applied Code!' : 'Apply Code GETORA100'}
            </button>
            <button 
              className="btn-outline" 
              onClick={() => navigate('offers')}
              style={{ padding: '12px 20px', borderRadius: '12px', fontSize: '14px' }}
            >
              All Coupons
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. NEARBY LOCAL STORES SECTION (Real Supabase Retailers)                  */}
      {/* ========================================================================= */}
      <section style={{ marginBottom: '56px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit', color: '#fff' }}>
              Nearby Stores in {selectedAddress?.city || 'Bengaluru'}
            </h2>
            <p style={{ color: '#A7A7A7', fontSize: '13px', marginTop: '2px' }}>
              Real-time inventory from neighborhood shops
            </p>
          </div>
          <button 
            className="section-link" 
            onClick={() => navigate('stores')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1DB954', fontWeight: 600, fontSize: '14px' }}
          >
            Explore All {stores.length} Stores <ArrowRight size={16} />
          </button>
        </div>

        {/* Stores Grid */}
        {isLoadingCatalog ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#1DB954', gap: '10px' }}>
            <Loader2 size={24} className="spin" /> Loading stores...
          </div>
        ) : stores.length === 0 ? (
          <div style={{ backgroundColor: '#141414', border: '1px solid #222', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <StoreIcon size={40} color="#333" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 700, marginBottom: '6px' }}>No Stores Registered Yet</h3>
            <p style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '16px' }}>Be the first local merchant to list your store on GETORA!</p>
            <button className="btn-primary" onClick={openAuthModal} style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px' }}>
              Register as Retailer
            </button>
          </div>
        ) : (
          <div className="stores-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredStores.slice(0, 6).map((st) => (
              <StoreCard key={st.id} store={st} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 6. POPULAR & TRENDING PRODUCTS (Real Supabase Products)                   */}
      {/* ========================================================================= */}
      <section style={{ marginBottom: '60px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#1DB954', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                LOCAL CATALOG
              </span>
            </div>
            <h2 className="section-title" style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit', color: '#fff' }}>
              Popular Products Near You
            </h2>
          </div>
          <button 
            className="section-link" 
            onClick={() => navigate('search', { q: '' })}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1DB954', fontWeight: 600, fontSize: '14px' }}
          >
            View All Products <ArrowRight size={16} />
          </button>
        </div>

        {/* Products Grid */}
        {isLoadingCatalog ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#1DB954', gap: '10px' }}>
            <Loader2 size={24} className="spin" /> Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ backgroundColor: '#141414', border: '1px solid #222', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <Package size={40} color="#333" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 700, marginBottom: '6px' }}>No Products Listed Yet</h3>
            <p style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '16px' }}>Retailers can add new items from their shop dashboard.</p>
            {role === 'retailer' && (
              <button className="btn-primary" onClick={() => navigate('retailer-dashboard')} style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px' }}>
                Go to Shop Dashboard
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {popularProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 7. HOW GETORA WORKS (WEBSITE EXPLAINER)                                   */}
      {/* ========================================================================= */}
      <section style={{
        backgroundColor: '#121212',
        border: '1px solid #262626',
        borderRadius: '24px',
        padding: '44px 36px',
        marginBottom: '60px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
          <span style={{ color: '#1DB954', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            HYPERLOCAL COMMERCE
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 800, fontFamily: 'Outfit', color: '#fff', marginTop: '6px' }}>
            How GETORA Delivers in Minutes
          </h2>
          <p style={{ color: '#A7A7A7', fontSize: '14px', marginTop: '8px' }}>
            We connect you with authentic neighbourhood retailers with instant EV-rider fulfillment.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            {
              step: '01',
              title: 'Select Store & Products',
              desc: 'Browse live inventory from authorized hardware, electrical, electronics & grocery shops around you.'
            },
            {
              step: '02',
              title: 'Fast Merchant Packing',
              desc: 'The retailer receives your order instantly and packs genuine brand items within 5 minutes.'
            },
            {
              step: '03',
              title: 'Live GPS Doorstep Delivery',
              desc: 'Our electric rider fleet picks up your parcel and delivers to your doorstep with live route tracking.'
            }
          ].map((s, idx) => (
            <div 
              key={idx}
              style={{
                backgroundColor: '#181818',
                border: '1px solid #282828',
                borderRadius: '18px',
                padding: '28px 24px',
                position: 'relative'
              }}
            >
              <div style={{
                fontSize: '32px',
                fontWeight: 900,
                color: 'rgba(29, 185, 84, 0.4)',
                fontFamily: 'Outfit',
                marginBottom: '12px'
              }}>
                {s.step}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{s.title}</h3>
              <p style={{ fontSize: '14px', color: '#A7A7A7', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MERCHANT & RIDER ONBOARDING CTA BANNER                                */}
      {/* ========================================================================= */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {/* Retailer Card */}
        <div style={{
          backgroundColor: '#151816',
          border: '1px solid rgba(29, 185, 84, 0.25)',
          borderRadius: '20px',
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'inline-flex', padding: '8px 12px', backgroundColor: 'rgba(29, 185, 84, 0.15)', color: '#1DB954', borderRadius: '10px', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
              🏪 For Shop Owners
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit', marginBottom: '10px' }}>
              Grow Your Local Retail Store
            </h3>
            <p style={{ color: '#A7A7A7', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              List your inventory on GETORA. Reach thousands of neighborhood customers with automated delivery.
            </p>
          </div>
          <button 
            className="btn-primary" 
            onClick={openAuthModal}
            style={{ width: 'fit-content', padding: '12px 24px', borderRadius: '12px' }}
          >
            Register as Retailer
          </button>
        </div>

        {/* Delivery Partner Card */}
        <div style={{
          backgroundColor: '#161616',
          border: '1px solid #282828',
          borderRadius: '20px',
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'inline-flex', padding: '8px 12px', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#fff', borderRadius: '10px', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
              ⚡ For Delivery Riders
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit', marginBottom: '10px' }}>
              Deliver & Earn with GETORA Fleet
            </h3>
            <p style={{ color: '#A7A7A7', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              Flexible hours, instant weekly payouts, and EV incentives. Join our high-speed local delivery team.
            </p>
          </div>
          <button 
            className="btn-outline" 
            onClick={openAuthModal}
            style={{ width: 'fit-content', padding: '12px 24px', borderRadius: '12px' }}
          >
            Join as Delivery Partner
          </button>
        </div>
      </section>

    </div>
  );
};
