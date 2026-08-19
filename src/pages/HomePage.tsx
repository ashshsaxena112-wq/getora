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
  IconCircleCheck,
  IconClock,
  IconChevronRight,
  IconTrendingUp,
  IconBuildingStore,
  IconPackage,
  IconMotorbike,
  IconShield,
  IconPercentage,
  IconSearch,
  IconLoader2
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
      <section className="hero-banner">
        <div style={{ maxWidth: '720px', position: 'relative', zIndex: 2 }}>
          {/* Location Badge */}
          <div 
            onClick={openLocationModal}
            className="hero-location-badge"
          >
            <IconMapPin size={16} stroke={1.8} />
            <span>Delivering to: <strong className="hero-location-city">{selectedAddress?.city || 'Bengaluru'}</strong> {selectedAddress?.addressLine2 ? `(${selectedAddress.addressLine2})` : ''}</span>
            <IconChevronRight size={15} stroke={1.8} />
          </div>

          {/* Main SEO Headline (H1) */}
          <h1 className="hero-headline">
            Get Anything Fast from <br />
            <span className="hero-headline-gradient">
              Local Shops with GETORA
            </span>
          </h1>

          <p className="hero-subtitle">
            GETORA connects customers with nearby local shops and fast delivery. Discover nearby shops online, find products from local stores, and enjoy fast local delivery in 15–25 minutes.
          </p>

          {/* Quick Search on Hero */}
          <div className="hero-search-box">
            <div className="hero-search-input-row">
              <IconSearch size={20} stroke={1.8} color="#22C55E" style={{ marginRight: '10px', flexShrink: 0 }} />
              <input 
                type="text"
                className="hero-search-input"
                placeholder="Search products, brands, or local shops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate('search', { q: searchQuery.trim() });
                  }
                }}
              />
            </div>
            <button 
              className="btn-primary hero-search-btn"
              onClick={() => {
                if (searchQuery.trim()) navigate('search', { q: searchQuery.trim() });
                else navigate('stores');
              }}
            >
              Search
            </button>
          </div>

          {/* Quick Search Chips */}
          <div className="hero-trending-row">
            <span className="hero-trending-label">Trending:</span>
            {['LED Bulbs', 'Drill Kits', 'Fast Charger', 'FR Wire', 'Switch Plate', 'Pet Care'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleQuickSearch(tag)}
                className="hero-trending-tag"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Floating Feature Pill Cards (Right Side Desktop) */}
        <div className="hero-badge-desktop">
          <div className="hero-floating-card">
            <div className="hero-floating-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' }}>
              <IconBolt size={22} stroke={1.8} />
            </div>
            <div>
              <div className="hero-floating-title" style={{ color: '#22C55E' }}>15–25 MINS</div>
              <div className="hero-floating-desc">Hyperlocal Delivery</div>
            </div>
          </div>

          <div className="hero-floating-card">
            <div className="hero-floating-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' }}>
              <IconShieldCheck size={22} stroke={1.8} />
            </div>
            <div>
              <div className="hero-floating-title">100% Genuine</div>
              <div className="hero-floating-desc">Verified Local Retailers</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1.5 MOBILE QUICK CATEGORIES RAIL (Blinkit/Zepto Native App Style)         */}
      {/* ========================================================================= */}
      <section style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
            Quick Categories
          </h3>
          <button
            onClick={() => navigate('categories')}
            style={{ fontSize: '12.5px', color: '#22C55E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}
          >
            See All <IconChevronRight size={14} stroke={1.8} />
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
          { icon: <IconBolt color="#22C55E" size={20} stroke={1.8} />, title: '15-25 Min Fast Delivery', desc: 'Dispatched instantly from neighbor shops' },
          { icon: <IconBuildingStore color="#22C55E" size={20} stroke={1.8} />, title: 'Local Neighborhood Stores', desc: 'Support trusted local merchants near you' },
          { icon: <IconTruckDelivery color="#22C55E" size={20} stroke={1.8} />, title: 'Local Hyperlocal Fleet', desc: 'Real-time rider updates to your doorstep' },
          { icon: <IconShieldCheck color="#22C55E" size={20} stroke={1.8} />, title: 'Cash on Delivery & UPI', desc: 'Secure payments & easy 24/7 support' }
        ].map((item, idx) => (
          <div 
            key={idx}
            className="trust-strip-item"
          >
            <div className="trust-icon-box">
              {item.icon}
            </div>
            <div>
              <div className="trust-title">{item.title}</div>
              <div className="trust-desc">{item.desc}</div>
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
            <h2 className="section-title">
              Explore Categories
            </h2>
            <p className="section-subtitle">
              Select a category to explore neighborhood inventory
            </p>
          </div>
          <button 
            className="section-link" 
            onClick={() => navigate('categories')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22C55E', fontWeight: 600, fontSize: '13.5px' }}
          >
            View All <IconArrowRight size={15} stroke={1.8} />
          </button>
        </div>

        {/* Loading / Categories Grid */}
        {isLoadingCatalog ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#22C55E', gap: '10px' }}>
            <IconLoader2 size={24} stroke={1.8} className="spin" /> Loading categories...
          </div>
        ) : (
          <div className="home-categories-grid">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate('categories', { categoryId: cat.id })}
                className="home-category-card"
              >
                <div className="home-category-img-box">
                  <img 
                    src={cat.imageUrl || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=80'} 
                    alt={cat.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    loading="lazy" 
                  />
                </div>
                <h3 className="home-category-name">{cat.name}</h3>
                <p className="home-category-cta">Shop Now</p>
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
              backgroundColor: 'rgba(34, 197, 94, 0.18)',
              color: '#22C55E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <IconFlame size={24} stroke={1.8} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span className="flash-deal-title">
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
              <div className="flash-deal-desc">
                Use code <strong style={{ color: '#22C55E' }}>GETORA100</strong> on your order above ₹299.
              </div>
            </div>

            {/* Countdown Display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '10px' }}>
              <IconClock size={16} stroke={1.8} color="var(--text-muted)" />
              <div className="flash-countdown-digits">
                <span className="countdown-digit-box">{String(timeLeft.hours).padStart(2, '0')}h</span> :
                <span className="countdown-digit-box">{String(timeLeft.minutes).padStart(2, '0')}m</span> :
                <span className="countdown-digit-box">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn-primary"
              onClick={() => handleCopyCoupon('GETORA100')}
              style={{
                backgroundColor: copiedCoupon === 'GETORA100' ? '#22C55E' : '#22C55E',
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
            <h2 className="section-title">
              Nearby Stores in {selectedAddress?.city || 'Bengaluru'}
            </h2>
            <p className="section-subtitle">
              Real-time inventory from neighborhood shops
            </p>
          </div>
          <button 
            className="section-link" 
            onClick={() => navigate('stores')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22C55E', fontWeight: 600, fontSize: '14px' }}
          >
            Explore All {stores.length} Stores <IconArrowRight size={16} stroke={1.8} />
          </button>
        </div>

        {/* Stores Grid */}
        {isLoadingCatalog ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#22C55E', gap: '10px' }}>
            <IconLoader2 size={24} stroke={1.8} className="spin" /> Loading stores...
          </div>
        ) : stores.length === 0 ? (
          <div className="empty-state-card" style={{ padding: '40px', textAlign: 'center' }}>
            <IconBuildingStore size={40} stroke={1.8} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}>No Stores Registered Yet</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Be the first local merchant to list your store on GETORA!</p>
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
              <span style={{ color: '#22C55E', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                LOCAL CATALOG
              </span>
            </div>
            <h2 className="section-title">
              Popular Products Near You
            </h2>
          </div>
          <button 
            className="section-link" 
            onClick={() => navigate('search', { q: '' })}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22C55E', fontWeight: 600, fontSize: '14px' }}
          >
            View All Products <IconArrowRight size={16} stroke={1.8} />
          </button>
        </div>

        {/* Products Grid */}
        {isLoadingCatalog ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#22C55E', gap: '10px' }}>
            <IconLoader2 size={24} stroke={1.8} className="spin" /> Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state-card" style={{ padding: '40px', textAlign: 'center' }}>
            <IconPackage size={40} stroke={1.8} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}>No Products Listed Yet</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Retailers can add new items from their shop dashboard.</p>
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
      <section className="how-getora-works-card">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
          <span style={{ color: '#1DB954', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            HYPERLOCAL COMMERCE
          </span>
          <h2 className="how-works-heading">
            How GETORA Delivers in Minutes
          </h2>
          <p className="how-works-subtext">
            We connect you with authentic neighbourhood retailers with instant EV-rider fulfillment.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            {
              step: '01',
              title: 'Discover Nearby Local Shops & Products',
              desc: 'Customers can discover nearby local shops, browse verified store inventories, and buy from local shops online effortlessly.'
            },
            {
              step: '02',
              title: 'Local Shops Reach Customers',
              desc: 'Neighborhood retailers receive customer orders in real time and prepare genuine, high-quality products for immediate dispatch.'
            },
            {
              step: '03',
              title: 'Fast Local Delivery by Partners',
              desc: 'Trained delivery partners pick up orders from local stores and ensure safe, fast local delivery to your doorstep in minutes.'
            }
          ].map((s, idx) => (
            <div 
              key={idx}
              className="how-step-card"
            >
              <div className="how-step-num">
                {s.step}
              </div>
              <h3 className="how-step-title">{s.title}</h3>
              <p className="how-step-desc">{s.desc}</p>
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
        <div className="cta-retailer-card">
          <div>
            <div style={{ display: 'inline-flex', padding: '8px 12px', backgroundColor: 'rgba(29, 185, 84, 0.15)', color: '#1DB954', borderRadius: '10px', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
              🏪 For Shop Owners
            </div>
            <h3 className="cta-card-title">
              Grow Your Local Retail Store
            </h3>
            <p className="cta-card-desc">
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
        <div className="cta-rider-card">
          <div>
            <div style={{ display: 'inline-flex', padding: '8px 12px', backgroundColor: 'rgba(29, 185, 84, 0.15)', color: '#1DB954', borderRadius: '10px', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
              ⚡ For Delivery Riders
            </div>
            <h3 className="cta-card-title">
              Deliver & Earn with GETORA Fleet
            </h3>
            <p className="cta-card-desc">
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
