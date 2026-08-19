import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import { StoreCard } from '../components/StoreCard';
import { IconMapPin, IconBolt, IconTag, IconStar, IconBuildingStore, IconLoader2 } from '@tabler/icons-react';

export const NearbyStoresPage: React.FC = () => {
  const { stores, isLoadingCatalog, selectedAddress, openLocationModal, openAuthModal } = useGetora();
  const [filter, setFilter] = useState<'all' | 'rating' | 'open'>('all');

  const filteredStores = stores.filter((st) => {
    if (filter === 'rating') return st.rating >= 4.0;
    if (filter === 'open') return st.isOpen;
    return true;
  });

  return (
    <div className="nearby-stores-page-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
              Nearby Stores in {selectedAddress?.city || 'Bengaluru'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
              Direct ordering from local neighborhood merchants with 15–25 min doorstep delivery.
            </p>
          </div>

          <button
            onClick={openLocationModal}
            className="btn-secondary"
            style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <IconMapPin size={15} stroke={1.8} color="#22C55E" /> Change Location
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="filters-row" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '28px' }}>
        <button
          className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Stores ({stores.length})
        </button>
        <button
          className={`filter-chip ${filter === 'open' ? 'active' : ''}`}
          onClick={() => setFilter('open')}
        >
          ● Open Now
        </button>
        <button
          className={`filter-chip ${filter === 'rating' ? 'active' : ''}`}
          onClick={() => setFilter('rating')}
        >
          ★ Rating 4.0+
        </button>
      </div>

      {/* Stores Grid */}
      {isLoadingCatalog ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', color: '#22C55E', gap: '10px' }}>
          <IconLoader2 size={24} stroke={1.8} className="spin" /> Loading nearby stores...
        </div>
      ) : filteredStores.length === 0 ? (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
          <IconBuildingStore size={44} stroke={1.8} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}>No Stores Found</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            No registered stores match your current filter.
          </p>
          <button className="btn-primary" onClick={openAuthModal} style={{ padding: '10px 22px', borderRadius: '10px', fontSize: '14px' }}>
            Register Your Local Shop
          </button>
        </div>
      ) : (
        <div className="stores-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredStores.map((st) => (
            <StoreCard key={st.id} store={st} />
          ))}
        </div>
      )}
    </div>
  );
};
