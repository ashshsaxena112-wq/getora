import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import { ProductCard } from '../components/ProductCard';
import { StoreCard } from '../components/StoreCard';
import { Grid, ArrowLeft, SlidersHorizontal, Sparkles, Loader2, Package } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, products, stores, viewParams, navigate, isLoadingCatalog } = useGetora();
  const selectedCatId = viewParams.categoryId || viewParams.category || 'all';
  const [activeSort, setActiveSort] = useState<'popular' | 'price-low' | 'price-high'>('popular');

  const selectedCategory = categories.find((c) => c.id === selectedCatId);

  const displayedProducts = (
    selectedCatId === 'all'
      ? products
      : products.filter((p) => p.categoryId === selectedCatId)
  ).sort((a, b) => {
    if (activeSort === 'price-low') return a.sellingPrice - b.sellingPrice;
    if (activeSort === 'price-high') return b.sellingPrice - a.sellingPrice;
    return b.sellingPrice - a.sellingPrice;
  });

  const categoryStores = selectedCatId === 'all'
    ? stores
    : stores.filter((s) => s.businessCategory?.toLowerCase().includes(selectedCategory?.name?.toLowerCase() || ''));

  return (
    <div className="categories-page-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Category Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          {selectedCatId !== 'all' && (
            <button
              onClick={() => navigate('categories', { categoryId: 'all' })}
              className="btn-secondary"
              style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} /> All Categories
            </button>
          )}
          <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
            {selectedCategory ? selectedCategory.name : 'Explore All Categories'}
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {selectedCategory?.description ||
            'Browse verified neighborhood stores and authentic products across all local categories.'}
        </p>
      </div>

      {/* Category Chips Selector */}
      <div className="filters-row" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '32px' }}>
        <button
          className={`filter-chip ${selectedCatId === 'all' ? 'active' : ''}`}
          onClick={() => navigate('categories', { categoryId: 'all' })}
        >
          <Grid size={14} /> All Categories ({categories.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-chip ${selectedCatId === cat.id ? 'active' : ''}`}
            onClick={() => navigate('categories', { categoryId: cat.id })}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoadingCatalog ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', color: '#1DB954', gap: '10px' }}>
          <Loader2 size={24} className="spin" /> Loading category items...
        </div>
      ) : (
        <>
          {/* Stores Offering this category */}
          {categoryStores.length > 0 && (
            <section style={{ marginBottom: '44px' }}>
              <div className="section-header" style={{ marginBottom: '16px' }}>
                <h2 className="section-title" style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                  {selectedCategory ? `Nearby ${selectedCategory.name} Stores` : 'Featured Local Stores'}
                </h2>
              </div>
              <div className="stores-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {categoryStores.map((st) => (
                  <StoreCard key={st.id} store={st} />
                ))}
              </div>
            </section>
          )}

          {/* Products in this category */}
          <section>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 className="section-title" style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                  Available Products ({displayedProducts.length})
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Delivered in 15-25 minutes from local stores
                </p>
              </div>

              {/* Sort selector */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={`filter-chip ${activeSort === 'popular' ? 'active' : ''}`}
                  onClick={() => setActiveSort('popular')}
                  style={{ fontSize: '12px' }}
                >
                  Featured
                </button>
                <button
                  className={`filter-chip ${activeSort === 'price-low' ? 'active' : ''}`}
                  onClick={() => setActiveSort('price-low')}
                  style={{ fontSize: '12px' }}
                >
                  Price: Low to High
                </button>
                <button
                  className={`filter-chip ${activeSort === 'price-high' ? 'active' : ''}`}
                  onClick={() => setActiveSort('price-high')}
                  style={{ fontSize: '12px' }}
                >
                  Price: High to Low
                </button>
              </div>
            </div>

            {displayedProducts.length === 0 ? (
              <div className="empty-state-card" style={{ padding: '40px', textAlign: 'center' }}>
                <Package size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
                <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 700 }}>No products listed in this category</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Check back soon as local stores update their inventories.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {displayedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};
