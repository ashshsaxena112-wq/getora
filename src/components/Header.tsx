import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  ShoppingBag,
  Clock,
  User,
  X,
  ChevronDown,
  Store,
  LogOut,
  Tag,
  Sun,
  Moon,
  Monitor,
  Grid,
  Wrench,
  Zap,
  Smartphone,
  BookOpen,
  Home,
  Car,
  Heart,
  Apple,
  Headphones,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useGetora } from '../context/GetoraContext';
import { GetoraLogo } from './GetoraLogo';

const HEADER_CATEGORIES = [
  { id: 'cat-hardware', name: 'Hardware', icon: Wrench, color: '#FF9500' },
  { id: 'cat-electrical', name: 'Electrical', icon: Zap, color: '#FFCC00' },
  { id: 'cat-mobile', name: 'Mobile Accessories', icon: Smartphone, color: '#0A84FF' },
  { id: 'cat-stationery', name: 'Stationery', icon: BookOpen, color: '#30D158' },
  { id: 'cat-home', name: 'Home Essentials', icon: Home, color: '#FF375F' },
  { id: 'cat-auto', name: 'Auto Accessories', icon: Car, color: '#BF5AF2' },
  { id: 'cat-pet', name: 'Pet Products', icon: Heart, color: '#FF2D55' },
  { id: 'cat-grocery', name: 'Grocery & Essentials', icon: Apple, color: '#34C759' },
  { id: 'cat-electronics', name: 'Electronics', icon: Headphones, color: '#5E5CE6' }
];

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
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const categoriesMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const cartTotalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target) &&
        mobileSearchContainerRef.current &&
        !mobileSearchContainerRef.current.contains(target)
      ) {
        setIsSearchFocused(false);
      }
      if (
        categoriesMenuRef.current &&
        !categoriesMenuRef.current.contains(target)
      ) {
        setIsCategoriesOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(target)
      ) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate('search', { q: searchQuery.trim() });
    }
  };

  const matchingProducts = searchQuery.trim()
    ? products
        .filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const matchingStores = searchQuery.trim()
    ? stores
        .filter((s) =>
          (s.shopName || s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.businessCategory?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 4)
    : [];

  return (
    <header className="header-wrapper">
      <div className="header-container">
        {/* Main Desktop & Tablet Top Navbar Row */}
        <div className="header-main-row">
          
          {/* Brand Logo & Tag */}
          <div
            className="header-brand"
            onClick={() => navigate('home')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <GetoraLogo size="md" showBadge={true} />
          </div>

          {/* Categories Dropdown Trigger (Desktop / Tablet) */}
          <div className="header-categories-container" ref={categoriesMenuRef}>
            <button
              className={`header-categories-btn ${isCategoriesOpen ? 'active' : ''}`}
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              title="Browse Categories"
            >
              <Grid size={17} color="#1DB954" />
              <span className="categories-btn-text">Categories</span>
              <ChevronDown
                size={14}
                style={{
                  transform: isCategoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>

            {/* Categories Dropdown Menu */}
            {isCategoriesOpen && (
              <div className="categories-dropdown-menu">
                <div className="categories-dropdown-header">
                  <span>Browse Categories</span>
                  <button
                    onClick={() => {
                      setIsCategoriesOpen(false);
                      navigate('categories', { categoryId: 'all' });
                    }}
                    style={{ fontSize: '12px', color: '#1DB954', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    View All <ArrowRight size={13} />
                  </button>
                </div>

                <div className="categories-dropdown-grid">
                  {HEADER_CATEGORIES.map((cat) => {
                    const IconComponent = cat.icon;
                    return (
                      <div
                        key={cat.id}
                        className="category-dropdown-item"
                        onClick={() => {
                          setIsCategoriesOpen(false);
                          navigate('categories', { categoryId: cat.id });
                        }}
                      >
                        <div
                          className="category-dropdown-icon"
                          style={{ color: cat.color, backgroundColor: `${cat.color}15` }}
                        >
                          <IconComponent size={18} />
                        </div>
                        <span className="category-dropdown-label">{cat.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Global Search Bar (Desktop View) */}
          <div className="header-search desktop-search-bar" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="search-bar-input-box">
                <Search size={17} color="#1DB954" />
                <input
                  type="text"
                  placeholder="Search products, shops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ display: 'flex', color: '#A7A7A7' }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </form>

            {/* Live Search Autocomplete Dropdown */}
            {isSearchFocused && (searchQuery.trim().length > 0 || matchingStores.length > 0) && (
              <div className="search-dropdown-menu">
                {matchingStores.length > 0 && (
                  <div className="search-section">
                    <div className="search-section-title">Matching Shops</div>
                    {matchingStores.map((st) => (
                      <div
                        key={st.id}
                        className="search-result-item"
                        onClick={() => {
                          setIsSearchFocused(false);
                          navigate('store', { storeId: st.id });
                        }}
                      >
                        <div className="search-result-icon">
                          <Store size={16} color="#1DB954" />
                        </div>
                        <div>
                          <div className="search-result-name">{st.shopName || st.name}</div>
                          <div className="search-result-meta">{st.businessCategory || 'Local Retailer'} • {st.city || 'Bengaluru'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {matchingProducts.length > 0 && (
                  <div className="search-section">
                    <div className="search-section-title">Matching Products</div>
                    {matchingProducts.map((pr) => (
                      <div
                        key={pr.id}
                        className="search-result-item"
                        onClick={() => {
                          setIsSearchFocused(false);
                          navigate('product', { productId: pr.id });
                        }}
                      >
                        <div className="search-result-icon">
                          <Tag size={16} color="#1DB954" />
                        </div>
                        <div>
                          <div className="search-result-name">{pr.name}</div>
                          <div className="search-result-meta">₹{pr.sellingPrice} • {pr.brand || 'Verified Stock'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {matchingProducts.length === 0 && matchingStores.length === 0 && searchQuery.trim() && (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#A7A7A7', fontSize: '13px' }}>
                    Press <strong>Enter</strong> to search all items for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Right Actions */}
          <div className="header-actions">
            
            {/* Location Picker */}
            <button className="location-btn" onClick={openLocationModal} title="Select Delivery Address">
              <MapPin size={16} color="#1DB954" />
              <div className="location-btn-text">
                <span className="location-label">Deliver To</span>
                <span className="location-val">
                  {selectedAddress ? `${selectedAddress.city}` : 'Select City'}
                </span>
              </div>
              <ChevronDown size={14} color="#A7A7A7" />
            </button>

            {/* Retailer Portal Link (If retailer) */}
            {role === 'retailer' && (
              <button
                className="action-icon-btn retailer-portal-btn"
                onClick={() => navigate('retailer-dashboard')}
                title="Retailer Dashboard"
                style={{ color: '#1DB954', backgroundColor: 'rgba(29,185,84,0.1)' }}
              >
                <Store size={18} />
                <span className="btn-label-desktop">Shop Portal</span>
              </button>
            )}

            {/* Orders Link (Desktop) */}
            {user && (
              <button
                className="action-icon-btn desktop-only-btn"
                onClick={() => navigate('orders')}
                title="My Orders"
              >
                <Clock size={18} />
                <span className="btn-label-desktop">Orders</span>
              </button>
            )}

            {/* 🛒 PROMINENT CART BUTTON (NEVER HIDDEN) */}
            <button
              className="action-icon-btn cart-btn-pill"
              onClick={() => navigate('cart')}
              title="Shopping Cart"
            >
              <div className="cart-badge-wrapper">
                <ShoppingBag size={18} />
                {cartTotalItems > 0 && (
                  <span className="cart-count-badge">
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <span className="cart-label-text">
                Cart {cartTotalItems > 0 ? `(${cartTotalItems})` : ''}
              </span>
            </button>

            {/* Theme Switcher Button */}
            <div style={{ position: 'relative' }} ref={themeMenuRef}>
              <button
                className="action-icon-btn theme-toggle-btn"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                title={`Theme: ${themeMode === 'auto' ? 'Auto (System)' : themeMode === 'dark' ? 'Dark' : 'Light'}`}
              >
                {themeMode === 'auto' ? (
                  <Monitor size={17} />
                ) : themeMode === 'dark' ? (
                  <Moon size={17} />
                ) : (
                  <Sun size={17} />
                )}
              </button>

              {/* Theme Dropdown */}
              {isThemeMenuOpen && (
                <div className="theme-dropdown-menu">
                  <div className="theme-dropdown-header">
                    Theme Mode
                  </div>

                  <button
                    onClick={() => {
                      setThemeMode('auto');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`theme-option-btn ${themeMode === 'auto' ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Monitor size={15} /> Auto (System)
                    </div>
                    {themeMode === 'auto' && <span style={{ fontSize: '12px' }}>✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      setThemeMode('dark');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`theme-option-btn ${themeMode === 'dark' ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Moon size={15} /> Dark Mode
                    </div>
                    {themeMode === 'dark' && <span style={{ fontSize: '12px' }}>✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      setThemeMode('light');
                      setIsThemeMenuOpen(false);
                    }}
                    className={`theme-option-btn ${themeMode === 'light' ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sun size={15} /> Light Mode
                    </div>
                    {themeMode === 'light' && <span style={{ fontSize: '12px' }}>✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* User Account / Login Button */}
            {user ? (
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  className="action-icon-btn user-profile-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="user-avatar-circle">
                    {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="user-name-desktop">
                    {profile?.fullName || 'Account'}
                  </span>
                  <ChevronDown size={13} color="#A7A7A7" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="user-dropdown-menu">
                    <div className="user-dropdown-header">
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {profile?.fullName || 'GETORA User'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        Role: {role}
                      </div>
                    </div>

                    <div
                      className="user-dropdown-item"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('account');
                      }}
                    >
                      <User size={15} /> Profile & Settings
                    </div>

                    <div
                      className="user-dropdown-item"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('orders');
                      }}
                    >
                      <Clock size={15} /> My Orders
                    </div>

                    {role === 'retailer' && (
                      <div
                        className="user-dropdown-item"
                        style={{ color: 'var(--color-green)' }}
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('retailer-dashboard');
                        }}
                      >
                        <Store size={15} /> Shop Dashboard
                      </div>
                    )}

                    <div
                      className="user-dropdown-item signout-item"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut();
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="btn-primary signin-header-btn"
                onClick={openAuthModal}
              >
                <User size={15} /> <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search & Categories Row (Full Width on Phones) */}
        <div className="header-mobile-search-row" ref={mobileSearchContainerRef}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
            {/* Mobile Categories Button */}
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="mobile-category-pill-btn"
              title="Categories"
            >
              <Grid size={16} color="#1DB954" />
              <span>Categories</span>
            </button>

            {/* Mobile Search Box */}
            <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
              <div className="search-bar-input-box">
                <Search size={16} color="#1DB954" />
                <input
                  type="text"
                  placeholder="Search products, shops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ display: 'flex', color: '#A7A7A7' }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Mobile Categories Dropdown */}
          {isCategoriesOpen && (
            <div className="categories-dropdown-menu mobile-categories-dropdown">
              <div className="categories-dropdown-header">
                <span>Browse Categories</span>
                <button
                  onClick={() => {
                    setIsCategoriesOpen(false);
                    navigate('categories', { categoryId: 'all' });
                  }}
                  style={{ fontSize: '12px', color: '#1DB954', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  View All <ArrowRight size={13} />
                </button>
              </div>

              <div className="categories-dropdown-grid">
                {HEADER_CATEGORIES.map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      className="category-dropdown-item"
                      onClick={() => {
                        setIsCategoriesOpen(false);
                        navigate('categories', { categoryId: cat.id });
                      }}
                    >
                      <div
                        className="category-dropdown-icon"
                        style={{ color: cat.color, backgroundColor: `${cat.color}15` }}
                      >
                        <IconComponent size={17} />
                      </div>
                      <span className="category-dropdown-label">{cat.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mobile Live Search Dropdown */}
          {isSearchFocused && (searchQuery.trim().length > 0 || matchingStores.length > 0) && (
            <div className="search-dropdown-menu mobile-search-dropdown">
              {matchingStores.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Matching Shops</div>
                  {matchingStores.map((st) => (
                    <div
                      key={st.id}
                      className="search-result-item"
                      onClick={() => {
                        setIsSearchFocused(false);
                        navigate('store', { storeId: st.id });
                      }}
                    >
                      <div className="search-result-icon">
                        <Store size={15} color="#1DB954" />
                      </div>
                      <div>
                        <div className="search-result-name">{st.shopName || st.name}</div>
                        <div className="search-result-meta">{st.businessCategory || 'Local Retailer'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {matchingProducts.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Matching Products</div>
                  {matchingProducts.map((pr) => (
                    <div
                      key={pr.id}
                      className="search-result-item"
                      onClick={() => {
                        setIsSearchFocused(false);
                        navigate('product', { productId: pr.id });
                      }}
                    >
                      <div className="search-result-icon">
                        <Tag size={15} color="#1DB954" />
                      </div>
                      <div>
                        <div className="search-result-name">{pr.name}</div>
                        <div className="search-result-meta">₹{pr.sellingPrice} • {pr.brand || 'Verified'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
