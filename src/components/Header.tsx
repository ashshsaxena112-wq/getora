import React, { useState, useRef, useEffect } from 'react';
import {
  IconSearch,
  IconMapPin,
  IconShoppingBag,
  IconBell,
  IconUser,
  IconX,
  IconChevronDown,
  IconBuildingStore,
  IconLogout,
  IconTag,
  IconSun,
  IconMoon,
  IconMicrophone,
  IconSparkles,
  IconArrowRight,
  IconCheck
} from '@tabler/icons-react';
import { useGetora } from '../context/GetoraContext';
import { GetoraLogo } from './GetoraLogo';

export const Header: React.FC = () => {
  const {
    navigate,
    selectedAddress,
    openLocationModal,
    openAuthModal,
    user,
    profile,
    role,
    signOut,
    cart,
    products,
    stores,
    searchQuery,
    setSearchQuery,
    themeMode,
    setThemeMode
  } = useGetora();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const cartTotalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Voice Search Trigger
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        navigate('search', { q: transcript });
        setIsSearchFocused(false);
      };

      recognition.start();
    } else {
      alert('Voice search is not supported on this browser.');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('search', { q: searchQuery.trim() });
      setIsSearchFocused(false);
    }
  };

  // Filter matching suggestions
  const matchingStores = searchQuery.trim()
    ? stores.filter(
        (s) =>
          s.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.businessCategory?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const matchingProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }}>
      {/* 1. TOP LOCATION BAR */}
      <div className="header-top-bar" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '6px 16px', fontSize: '12px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          
          {/* Delivering to location button */}
          <button
            onClick={openLocationModal}
            className="location-pill-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              padding: '2px 6px',
              borderRadius: 'var(--radius-pill)',
              transition: 'background 0.2s ease'
            }}
          >
            <IconMapPin size={15} color="var(--color-green)" stroke={2.2} />
            <span style={{ color: 'var(--text-muted)' }}>Delivering to:</span>
            <strong style={{ color: 'var(--color-green)', fontWeight: 700 }}>
              {selectedAddress?.streetArea || selectedAddress?.addressLine1 || selectedAddress?.city || 'Vaishali Nagar, Jaipur'}
            </strong>
            <IconChevronDown size={14} color="var(--text-muted)" />
          </button>

          {/* Right micro-actions: Offers & Retailer Portal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => navigate('offers')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600
              }}
            >
              <IconTag size={13} color="var(--color-green)" />
              <span>Flat ₹50 OFF</span>
            </button>

            {role === 'retailer' ? (
              <button
                onClick={() => navigate('retailer-dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'var(--color-green-dim)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--color-green)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <IconBuildingStore size={13} />
                <span>Shop Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('retailer-dashboard')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 500
                }}
              >
                Partner with GETORA
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Unified Search, Notifications, Cart, User) */}
      <div className="header-main-nav" style={{ maxWidth: '1280px', margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        
        {/* Brand Logo */}
        <div onClick={() => navigate('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <GetoraLogo />
        </div>

        {/* UNIFIED SINGLE SEARCH BAR */}
        <div ref={searchContainerRef} style={{ flex: '1', maxWidth: '640px', position: 'relative' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-input)',
                border: isSearchFocused ? '1.5px solid var(--color-green)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-pill)',
                padding: '0 14px',
                height: '44px',
                boxShadow: isSearchFocused ? '0 0 16px var(--color-green-dim)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <IconSearch size={18} color={isSearchFocused ? 'var(--color-green)' : 'var(--text-muted)'} style={{ flexShrink: 0, marginRight: '10px' }} />
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search shop, product or category"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500
                }}
              />

              {/* Clear button if text */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}
                >
                  <IconX size={15} />
                </button>
              )}

              {/* Voice Search Mic Button */}
              <button
                type="button"
                onClick={handleVoiceSearch}
                title="Voice Search"
                style={{
                  background: isListening ? 'var(--color-green)' : 'transparent',
                  border: 'none',
                  color: isListening ? '#000' : 'var(--text-muted)',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  padding: '6px',
                  marginLeft: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <IconMicrophone size={17} />
              </button>
            </div>
          </form>

          {/* Instant Search Dropdown Suggestions */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                padding: '12px',
                zIndex: 200,
                maxHeight: '380px',
                overflowY: 'auto'
              }}
            >
              {matchingStores.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    Matching Shops
                  </p>
                  {matchingStores.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => {
                        navigate('store', { storeId: st.id });
                        setIsSearchFocused(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      className="search-suggest-item"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IconBuildingStore size={16} color="var(--color-green)" />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{st.shopName}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{st.businessCategory}</span>
                    </div>
                  ))}
                </div>
              )}

              {matchingProducts.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    Matching Products
                  </p>
                  {matchingProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        navigate('product', { productId: prod.id });
                        setIsSearchFocused(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      className="search-suggest-item"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={prod.imageUrl} alt={prod.name} style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{prod.name}</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-green)' }}>₹{prod.sellingPrice}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleSearchSubmit}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '8px',
                  background: 'var(--color-green-dim)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-green)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>View all search results for "{searchQuery}"</span>
                <IconArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT ACTIONS: Notifications, Cart, Theme, Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          
          {/* Notifications Bell */}
          <div ref={notifMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              title="Notifications"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <IconBell size={19} stroke={1.8} />
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--color-green)'
                }}
              />
            </button>

            {isNotifOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '280px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-card)',
                  padding: '12px',
                  zIndex: 200
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</span>
                  <span style={{ fontSize: '10px', color: 'var(--color-green)', fontWeight: 600 }}>1 New</span>
                </div>
                <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', fontSize: '12px' }}>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>⚡ 15-Min Delivery Active</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: '2px 0 0' }}>Local stores in your area are now open and ready for orders.</p>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon with Live Item Count Badge */}
          <button
            onClick={() => navigate('cart')}
            title="View Cart"
            style={{
              height: '40px',
              padding: '0 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--bg-secondary)',
              border: cartTotalItems > 0 ? '1.5px solid var(--color-green)' : '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <IconShoppingBag size={19} color={cartTotalItems > 0 ? 'var(--color-green)' : 'inherit'} stroke={1.8} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Cart</span>
            {cartTotalItems > 0 && (
              <span
                style={{
                  background: 'var(--color-green)',
                  color: '#000',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-pill)',
                  lineHeight: '1.2'
                }}
              >
                {cartTotalItems}
              </span>
            )}
          </button>

          {/* Theme Mode Toggle (Sun / Moon) */}
          <button
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {themeMode === 'dark' ? <IconSun size={18} color="#FFCC00" /> : <IconMoon size={18} />}
          </button>

          {/* Account / User Profile */}
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            {user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--color-green)',
                    color: '#000',
                    fontWeight: 800,
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {(profile?.fullName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600 }} className="hidden sm:inline">
                  {profile?.fullName?.split(' ')[0] || 'Account'}
                </span>
                <IconChevronDown size={14} color="var(--text-muted)" />
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                style={{
                  height: '40px',
                  padding: '0 16px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--color-green)',
                  border: 'none',
                  color: '#000',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <IconUser size={17} />
                <span>Login</span>
              </button>
            )}

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '200px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-card)',
                  padding: '8px',
                  zIndex: 200
                }}
              >
                <div style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {profile?.fullName || 'GETORA Customer'}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>{user?.email || user?.phone}</p>
                </div>

                <button
                  onClick={() => {
                    navigate('orders');
                    setIsUserMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                  className="dropdown-item"
                >
                  My Orders
                </button>

                <button
                  onClick={() => {
                    navigate('account');
                    setIsUserMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                  className="dropdown-item"
                >
                  Saved Addresses
                </button>

                <button
                  onClick={async () => {
                    await signOut();
                    setIsUserMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: '#EF4444',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  className="dropdown-item"
                >
                  <IconLogout size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
