import React, { useState, useMemo } from 'react';
import { useGetora } from '../context/GetoraContext';
import { StoreProductGridItem } from '../components/StoreProductGridItem';
import {
  IconStar,
  IconClock,
  IconMapPin,
  IconSearch,
  IconArrowLeft,
  IconPackage,
  IconShieldCheck,
  IconPhone,
  IconSparkles,
  IconCheck,
  IconFilter,
  IconBuildingStore
} from '@tabler/icons-react';

interface CategoryTab {
  id: string;
  name: string;
  count: number;
  imageUrl?: string;
  icon?: string;
}

export const StoreDetailPage: React.FC = () => {
  const { viewParams, getStoreById, getProductsByStore, navigate } = useGetora();
  const storeId = viewParams.storeId || viewParams.id;
  const store = getStoreById(storeId);

  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  const storeProducts = useMemo(() => {
    return store ? getProductsByStore(store.id) : [];
  }, [store, getProductsByStore]);

  // Extract unique categories / subcategories specific to this shop
  const shopCategories = useMemo<CategoryTab[]>(() => {
    if (!storeProducts || storeProducts.length === 0) return [];

    const catMap = new Map<string, { name: string; count: number; imageUrl?: string }>();

    storeProducts.forEach((p) => {
      // Use subCategory if available, otherwise categoryName or category?.name
      const catKey = p.subCategory || p.categoryName || p.category?.name || 'General';
      const catImg =
        p.subCategoryImageUrl ||
        p.imageUrl ||
        (typeof p.images?.[0] === 'string' ? p.images[0] : p.images?.[0]?.imageUrl);

      if (catMap.has(catKey)) {
        const existing = catMap.get(catKey)!;
        existing.count += 1;
        if (!existing.imageUrl && catImg) existing.imageUrl = catImg;
      } else {
        catMap.set(catKey, {
          name: catKey,
          count: 1,
          imageUrl: catImg
        });
      }
    });

    const categoriesList: CategoryTab[] = Array.from(catMap.entries()).map(([key, data]) => ({
      id: key,
      name: data.name,
      count: data.count,
      imageUrl: data.imageUrl
    }));

    return categoriesList;
  }, [storeProducts]);

  // Filtered products based on active category & search
  const displayedProducts = useMemo(() => {
    return storeProducts.filter((p) => {
      // Category filter
      const itemCategory = p.subCategory || p.categoryName || p.category?.name || 'General';
      const matchesCategory = selectedCategory === 'all' || itemCategory === selectedCategory;

      // Search filter
      const query = localSearch.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        p.name.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.variantLabel?.toLowerCase().includes(query) ||
        itemCategory.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [storeProducts, selectedCategory, localSearch]);

  if (!store) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center', padding: '40px' }}>
        <h2>Store Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          The requested store is not available or inactive.
        </p>
        <button className="btn-primary" onClick={() => navigate('stores')} style={{ marginTop: '20px' }}>
          Back to Stores
        </button>
      </div>
    );
  }

  const bannerImage =
    store.bannerUrl ||
    store.shopImageUrl ||
    store.shopLogoUrl ||
    store.logoUrl ||
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80';

  const logoImage =
    store.shopLogoUrl ||
    store.logoUrl ||
    store.shopImageUrl ||
    bannerImage;

  const handleToggleProductExpand = (productId: string) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
  };

  return (
    <div className="store-detail-page" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Top Back Nav Button */}
      <button
        onClick={() => navigate('stores')}
        className="btn-secondary"
        style={{
          padding: '8px 16px',
          borderRadius: '10px',
          marginBottom: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 600,
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        <IconArrowLeft size={16} stroke={2} /> Back to Nearby Stores
      </button>

      {/* ========================================================================= */}
      {/* 1. SHOP HEADER (TOP) */}
      {/* ========================================================================= */}
      <div
        className="store-hero-header"
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#121212',
          border: '1px solid var(--border-color)',
          marginBottom: '28px',
          minHeight: '230px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.92) 80%, rgba(10,10,10,0.98) 100%), url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '24px 28px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '24px',
            flexWrap: 'wrap',
            zIndex: 1
          }}
        >
          {/* Shop Photo / Logo Avatar */}
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '18px',
              backgroundColor: '#181818',
              border: '2.5px solid #22C55E',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
            }}
          >
            <img
              src={logoImage}
              alt={store.shopName || store.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Shop Info Beside Image */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '6px'
              }}
            >
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  fontFamily: 'Outfit, sans-serif',
                  color: '#FFFFFF',
                  margin: 0,
                  letterSpacing: '-0.3px'
                }}
              >
                {store.shopName || store.name}
              </h1>

              {/* Status Badge */}
              <span
                style={{
                  backgroundColor: store.isOpen ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${store.isOpen ? '#22C55E' : '#EF4444'}`,
                  color: store.isOpen ? '#22C55E' : '#EF4444',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: store.isOpen ? '#22C55E' : '#EF4444'
                  }}
                />
                {store.isOpen ? 'OPEN FOR ORDERS' : 'CLOSED'}
              </span>

              {/* Verified Badge */}
              <span
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#60A5FA',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <IconShieldCheck size={13} /> Verified Store
              </span>
            </div>

            <p style={{ color: '#D1D5DB', fontSize: '13.5px', margin: '0 0 10px 0', maxWidth: '700px' }}>
              {store.tagline || store.description || store.businessCategory || 'Authorized neighborhood retailer with verified stock.'}
            </p>

            {/* Metrics: Rating, Distance, ETA, Hours */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                flexWrap: 'wrap',
                fontSize: '13px',
                color: '#9CA3AF'
              }}
            >
              {/* Rating */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#22C55E',
                  fontWeight: 700,
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                <IconStar size={14} stroke={2} fill="#22C55E" color="#22C55E" />
                <span>{store.rating ? store.rating.toFixed(1) : '4.8'}</span>
                <span style={{ color: '#6EE7B7', fontSize: '11.5px', fontWeight: 500 }}>
                  ({store.reviewCount || 120}+)
                </span>
              </div>

              {/* ETA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#F3F4F6' }}>
                <IconClock size={15} stroke={1.8} color="#22C55E" />
                <span>{store.deliveryEtaMin || 20} mins avg delivery</span>
              </div>

              {/* Distance */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#F3F4F6' }}>
                <IconMapPin size={15} stroke={1.8} color="#22C55E" />
                <span>
                  {store.distanceKm ? `${store.distanceKm} km away • ` : ''}
                  {store.locality || store.addressLine1 || store.city || 'Local Neighborhood'}
                </span>
              </div>

              {/* Hours */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#9CA3AF' }}>
                <IconClock size={14} stroke={1.8} color="var(--text-muted)" />
                <span>Hours: {store.openTime || store.openingTime || '8:00 AM'} - {store.closeTime || store.closingTime || '9:30 PM'}</span>
              </div>

              {/* Call / Contact Store Action */}
              <a
                href={`tel:${store.phone || '+918041234567'}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
                title="Call store directly"
              >
                <IconPhone size={13} stroke={2} color="#22C55E" />
                <span>Call Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* In-Store Search and Summary Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              fontFamily: 'Outfit, sans-serif',
              margin: 0
            }}
          >
            Store Catalog
            <span style={{ fontSize: '14px', color: '#22C55E', marginLeft: '8px', fontWeight: 600 }}>
              ({storeProducts.length} Items in {shopCategories.length} Categories)
            </span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Browse categories on the sidebar to filter products with live quantity & weight selectors.
          </p>
        </div>

        {/* Search inside this store */}
        <div style={{ width: '100%', maxWidth: '340px', position: 'relative' }}>
          <IconSearch
            size={16}
            stroke={2}
            color="var(--text-muted)"
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          <input
            type="text"
            placeholder="Search within this store..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input, #181818)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '10px 14px 10px 38px',
              color: 'var(--text-primary, #FFFFFF)',
              fontSize: '13.5px',
              outline: 'none',
              transition: 'border-color 0.15s ease'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#22C55E')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CONTENT LAYOUT: 2. LEFT CATEGORY SIDEBAR + 3. RIGHT PRODUCT GRID */}
      {/* ========================================================================= */}
      <div
        className="store-catalog-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* ======================================================================= */}
        {/* 2. LEFT SIDEBAR — CATEGORY LIST (Sticky & Scrollable) */}
        {/* ======================================================================= */}
        <aside
          className="store-category-sidebar"
          style={{
            position: 'sticky',
            top: '80px',
            backgroundColor: 'var(--bg-card, #141414)',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            padding: '14px',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 8px 8px',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '4px'
            }}
          >
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <IconFilter size={14} color="#22C55E" /> Shop Categories
            </span>
            <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700 }}>
              {shopCategories.length} Categories
            </span>
          </div>

          {/* "All Products" option */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setExpandedProductId(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '10px 12px',
              borderRadius: '12px',
              backgroundColor: selectedCategory === 'all' ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
              border: selectedCategory === 'all' ? '1.5px solid #22C55E' : '1px solid transparent',
              color: selectedCategory === 'all' ? '#FFFFFF' : 'var(--text-primary)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: selectedCategory === 'all' ? '#22C55E' : 'var(--bg-secondary)',
                  color: selectedCategory === 'all' ? '#000000' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <IconBuildingStore size={18} stroke={2} />
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: selectedCategory === 'all' ? 700 : 500 }}>
                All Shop Items
              </span>
            </div>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                backgroundColor: selectedCategory === 'all' ? '#22C55E' : 'var(--bg-secondary)',
                color: selectedCategory === 'all' ? '#000000' : 'var(--text-muted)',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}
            >
              {storeProducts.length}
            </span>
          </button>

          {/* Specific Shop Categories */}
          {shopCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setExpandedProductId(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                  border: isSelected ? '1.5px solid #22C55E' : '1px solid transparent',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  {/* Category Thumbnail Image */}
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: 'var(--bg-secondary)',
                      border: isSelected ? '1px solid #22C55E' : '1px solid var(--border-color)',
                      flexShrink: 0
                    }}
                  >
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px'
                        }}
                      >
                        📦
                      </div>
                    )}
                  </div>

                  {/* Category Name */}
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: isSelected ? 700 : 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={cat.name}
                  >
                    {cat.name}
                  </span>
                </div>

                {/* Count Badge */}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: isSelected ? '#22C55E' : 'var(--bg-secondary)',
                    color: isSelected ? '#000000' : 'var(--text-muted)',
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    flexShrink: 0
                  }}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </aside>

        {/* ======================================================================= */}
        {/* 3. RIGHT SIDE — PRODUCT GRID */}
        {/* ======================================================================= */}
        <main className="store-product-content">
          {/* Active Filter Title Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              padding: '12px 18px',
              borderRadius: '14px'
            }}
          >
            <div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Showing Category:
              </span>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: '2px 0 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ color: '#22C55E' }}>●</span>
                {selectedCategory === 'all' ? 'All Products' : selectedCategory}
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  ({displayedProducts.length} items)
                </span>
              </h3>
            </div>

            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setExpandedProductId(null);
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Clear Category Filter
              </button>
            )}
          </div>

          {/* Product Grid / Empty State */}
          {displayedProducts.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center'
              }}
            >
              <IconPackage size={44} stroke={1.5} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 700 }}>
                No products found in this category
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Try selecting another category or clear your search term.
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  setSelectedCategory('all');
                  setLocalSearch('');
                }}
                style={{
                  marginTop: '16px',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  backgroundColor: '#22C55E',
                  color: '#000',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                View All Products
              </button>
            </div>
          ) : (
            <div
              className="store-product-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                gap: '18px'
              }}
            >
              {displayedProducts.map((prod) => (
                <StoreProductGridItem
                  key={prod.id}
                  product={prod}
                  isExpanded={expandedProductId === prod.id}
                  onToggleExpand={() => handleToggleProductExpand(prod.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
