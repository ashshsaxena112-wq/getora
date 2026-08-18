import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import { ProductCard } from '../components/ProductCard';
import { StoreCard } from '../components/StoreCard';
import { Search, MapPin, Store as StoreIcon, Package } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { viewParams, products, stores, searchQuery, setSearchQuery, navigate } = useGetora();
  const initialQuery = viewParams.q || searchQuery || '';
  const [localQuery, setLocalQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'stores'>('all');

  const query = localQuery.toLowerCase().trim();

  // Matched products
  const matchedProducts = products.filter((p) => {
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      (p.retailer && (p.retailer.shopName || p.retailer.name || '').toLowerCase().includes(query))
    );
  });

  // Matched stores
  const matchedStores = stores.filter((s) => {
    if (!query) return true;
    return (
      (s.shopName || s.name || '').toLowerCase().includes(query) ||
      s.businessCategory?.toLowerCase().includes(query) ||
      s.city?.toLowerCase().includes(query)
    );
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };

  return (
    <div className="search-page-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Search Header Bar */}
      <div style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#161616',
              border: '1px solid #292929',
              borderRadius: '9999px',
              padding: '10px 18px',
              gap: '12px',
              maxWidth: '680px'
            }}
          >
            <Search size={18} color="#A7A7A7" />
            <input
              type="text"
              placeholder="Search products, stores, categories..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              style={{ width: '100%', fontSize: '15px', color: '#fff', backgroundColor: 'transparent', border: 'none', outline: 'none' }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px', borderRadius: '9999px' }}
            >
              Search
            </button>
          </div>
        </form>

        {query && (
          <div style={{ marginTop: '14px', fontSize: '14px', color: '#A7A7A7' }}>
            Showing results for <strong style={{ color: '#1DB954' }}>"{query}"</strong>
          </div>
        )}
      </div>

      {/* Search Tabs */}
      <div className="filters-row" style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button
          className={`filter-chip ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Results ({matchedProducts.length + matchedStores.length})
        </button>

        <button
          className={`filter-chip ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products ({matchedProducts.length})
        </button>

        <button
          className={`filter-chip ${activeTab === 'stores' ? 'active' : ''}`}
          onClick={() => setActiveTab('stores')}
        >
          Stores ({matchedStores.length})
        </button>
      </div>

      {/* Results view */}
      {matchedProducts.length === 0 && matchedStores.length === 0 ? (
        <div style={{ backgroundColor: '#141414', border: '1px solid #222', borderRadius: '16px', padding: '60px 20px', textAlign: 'center' }}>
          <Package size={44} color="#333" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 700, marginBottom: '4px' }}>No matches found</h3>
          <p style={{ fontSize: '13px', color: '#8E8E93' }}>Try searching with different keywords or check spelling.</p>
        </div>
      ) : (
        <>
          {(activeTab === 'all' || activeTab === 'stores') && matchedStores.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px', fontFamily: 'Outfit' }}>
                Matching Stores ({matchedStores.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {matchedStores.map((st) => (
                  <StoreCard key={st.id} store={st} />
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'products') && matchedProducts.length > 0 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px', fontFamily: 'Outfit' }}>
                Matching Products ({matchedProducts.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {matchedProducts.map((pr) => (
                  <ProductCard key={pr.id} product={pr} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
