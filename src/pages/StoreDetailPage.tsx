import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  Clock,
  MapPin,
  Search,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Phone,
  Package
} from 'lucide-react';

export const StoreDetailPage: React.FC = () => {
  const { viewParams, getStoreById, getProductsByStore, navigate } = useGetora();
  const storeId = viewParams.storeId || viewParams.id;
  const store = getStoreById(storeId);

  const [inStoreSearch, setInStoreSearch] = useState('');

  if (!store) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center', padding: '40px' }}>
        <h2>Store Not Found</h2>
        <p style={{ color: '#8E8E93', marginTop: '8px' }}>The requested store is not available or inactive.</p>
        <button className="btn-primary" onClick={() => navigate('stores')} style={{ marginTop: '20px' }}>
          Back to Stores
        </button>
      </div>
    );
  }

  const storeProducts = getProductsByStore(store.id);

  const displayedProducts = storeProducts.filter((p) => {
    return (
      inStoreSearch.trim() === '' ||
      p.name.toLowerCase().includes(inStoreSearch.toLowerCase()) ||
      p.brand?.toLowerCase().includes(inStoreSearch.toLowerCase()) ||
      p.description?.toLowerCase().includes(inStoreSearch.toLowerCase())
    );
  });

  const bannerImage =
    store.shopImageUrl ||
    store.shopLogoUrl ||
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="store-detail-page" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('stores')}
        className="btn-secondary"
        style={{
          padding: '8px 14px',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px'
        }}
      >
        <ArrowLeft size={16} /> Back to Nearby Stores
      </button>

      {/* Store Cover Banner */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#141414',
          border: '1px solid #292929',
          marginBottom: '32px',
          minHeight: '220px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundImage: `linear-gradient(180deg, rgba(11,11,11,0.2) 0%, rgba(11,11,11,0.92) 85%), url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '28px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
          {/* Store Logo */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              backgroundColor: '#181818',
              border: '2px solid #1DB954',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <img
              src={bannerImage}
              alt={store.shopName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Store Details Header */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: 800, fontFamily: 'Outfit', color: '#fff' }}>
                {store.shopName}
              </h1>
              <span
                style={{
                  backgroundColor: store.isOpen ? 'rgba(29, 185, 84, 0.2)' : 'rgba(255, 69, 58, 0.2)',
                  color: store.isOpen ? '#39D353' : '#FF453A',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}
              >
                {store.isOpen ? '● OPEN FOR ORDERS' : '○ CLOSED'}
              </span>
            </div>

            <p style={{ color: '#D1D5DB', fontSize: '14px', marginBottom: '12px' }}>
              {store.description || store.businessCategory || 'Authorized neighborhood retailer with verified stock.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#A7A7A7' }}>
              {store.rating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1DB954', fontWeight: 700 }}>
                  <Star size={14} fill="#1DB954" /> {store.rating.toFixed(1)}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} /> 15-25 mins avg delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="#1DB954" /> {store.addressLine1 || store.city || 'Local Area'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store In-Store Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
            Store Catalog ({storeProducts.length} Items)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>All items packed directly by {store.ownerName}</p>
        </div>

        <div style={{ width: '100%', maxWidth: '320px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search items in this shop..."
            value={inStoreSearch}
            onChange={(e) => setInStoreSearch(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '10px 14px 10px 36px',
              color: 'var(--text-primary)',
              fontSize: '13px'
            }}
          />
        </div>
      </div>

      {/* Product Grid */}
      {displayedProducts.length === 0 ? (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '48px 24px', textAlign: 'center' }}>
          <Package size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 700 }}>No products found</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>This shop has not listed matching products yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {displayedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};
