import React from 'react';
import { Star, Clock, MapPin, Sparkles, ShieldCheck, Tag } from 'lucide-react';
import { Retailer } from '../types';
import { useGetora } from '../context/GetoraContext';

interface StoreCardProps {
  store: Retailer;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const { navigate } = useGetora();

  const handleCardClick = () => {
    navigate('store', { storeId: store.id });
  };

  const bannerImage =
    store.shopImageUrl ||
    store.shopLogoUrl ||
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80';

  return (
    <div
      className="store-card"
      onClick={handleCardClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Banner */}
      <div style={{ position: 'relative', height: '140px', width: '100%', backgroundColor: 'var(--bg-secondary)' }}>
        <img
          src={bannerImage}
          alt={store.shopName}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Store Open / Closed Status */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: store.isOpen ? 'rgba(29, 185, 84, 0.9)' : 'rgba(255, 69, 58, 0.9)',
            color: store.isOpen ? '#000' : '#fff',
            fontSize: '11px',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: '6px',
            backdropFilter: 'blur(4px)'
          }}
        >
          {store.isOpen ? '● OPEN NOW' : '○ CLOSED'}
        </div>

        {/* ETA Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backdropFilter: 'blur(4px)'
          }}
        >
          <Clock size={12} color="#1DB954" /> 15-25 min
        </div>
      </div>

      {/* Store Details */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'Outfit',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {store.shopName}
            </h3>
            {store.rating > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  backgroundColor: 'rgba(29, 185, 84, 0.15)',
                  color: '#1DB954',
                  fontSize: '12px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '6px'
                }}
              >
                <Star size={12} fill="#1DB954" /> {store.rating.toFixed(1)}
              </div>
            )}
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {store.businessCategory || 'General Hardware & Goods'} • {store.ownerName}
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={13} color="#1DB954" /> {store.city || 'Bengaluru'} {store.pincode ? `(${store.pincode})` : ''}
          </div>
        </div>

        {/* Free delivery badge */}
        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#1DB954', fontWeight: 600 }}>
          <span>✓ Instant Dispatch</span>
          <span>Hyperlocal Fleet</span>
        </div>
      </div>
    </div>
  );
};
