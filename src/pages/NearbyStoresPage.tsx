import React, { useState, useMemo } from 'react';
import { useGetora } from '../context/GetoraContext';
import { StoreCard } from '../components/StoreCard';
import { OlaMap, MapMarkerItem, MapZonePolygon } from '../components/OlaMap';
import { calculateDistanceKm, calculateDeliveryEta } from '../utils/geoUtils';
import { DELIVERY_ZONES, getActiveDeliveryZone } from '../config/deliveryZones';
import { Retailer } from '../types';
import {
  IconMapPin,
  IconClock,
  IconStar,
  IconBuildingStore,
  IconLoader2,
  IconLayoutGrid,
  IconMap,
  IconArrowRight
} from '@tabler/icons-react';

export const NearbyStoresPage: React.FC = () => {
  const { stores, isLoadingCatalog, selectedAddress, openLocationModal, openAuthModal, navigate } = useGetora();
  const [filter, setFilter] = useState<'all' | 'rating' | 'open'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedStore, setSelectedStore] = useState<Retailer | null>(null);

  // Customer coordinates (fallback to Jaipur Central or Bangalore depending on city)
  const customerLat = selectedAddress?.latitude || (selectedAddress?.city?.toLowerCase().includes('jaipur') ? 26.9124 : 12.9352);
  const customerLng = selectedAddress?.longitude || (selectedAddress?.city?.toLowerCase().includes('jaipur') ? 75.7873 : 77.6245);

  const activeZone = useMemo(() => {
    return getActiveDeliveryZone(customerLat, customerLng);
  }, [customerLat, customerLng]);

  // Ensure each store has valid coordinates (distribute around hub if not explicitly set)
  const storesWithCoords = useMemo(() => {
    return stores.map((st, idx) => {
      let lat = st.latitude;
      let lng = st.longitude;

      if (!lat || !lng) {
        // Deterministic offset based on store ID
        const angle = (idx * 1.37) % (2 * Math.PI);
        const radius = 0.015 + ((idx % 4) * 0.008);
        lat = activeZone.center[0] + radius * Math.cos(angle);
        lng = activeZone.center[1] + radius * Math.sin(angle);
      }

      const distance = calculateDistanceKm(customerLat, customerLng, lat, lng);
      const eta = calculateDeliveryEta(distance);

      return {
        ...st,
        latitude: lat,
        longitude: lng,
        distanceKm: distance,
        deliveryEtaMin: eta.minMinutes,
      };
    });
  }, [stores, customerLat, customerLng, activeZone]);

  const filteredStores = useMemo(() => {
    return storesWithCoords.filter((st) => {
      if (filter === 'rating') return st.rating >= 4.0;
      if (filter === 'open') return st.isOpen;
      return true;
    });
  }, [storesWithCoords, filter]);

  // Markers for Ola Map
  const mapMarkers: MapMarkerItem[] = useMemo(() => {
    const list: MapMarkerItem[] = [];

    // Customer pin
    list.push({
      id: 'customer-pin',
      latitude: customerLat,
      longitude: customerLng,
      title: 'Your Location',
      type: 'customer',
    });

    // Store pins
    filteredStores.forEach((st) => {
      if (st.latitude && st.longitude) {
        list.push({
          id: `store-${st.id}`,
          latitude: st.latitude,
          longitude: st.longitude,
          title: `${st.shopName} (${st.rating}★)`,
          subtitle: `${st.distanceKm} km away`,
          type: 'store',
          onClick: () => {
            setSelectedStore(st);
          },
        });
      }
    });

    return list;
  }, [filteredStores, customerLat, customerLng]);

  // Route coordinates between customer and selected store
  const routeCoords: [number, number][] = useMemo(() => {
    if (!selectedStore?.latitude || !selectedStore?.longitude) return [];
    return [
      [customerLat, customerLng],
      [selectedStore.latitude, selectedStore.longitude],
    ];
  }, [selectedStore, customerLat, customerLng]);

  const zones: MapZonePolygon[] = useMemo(() => {
    return [
      {
        id: activeZone.id,
        name: activeZone.name,
        coordinates: activeZone.polygon,
        color: '#22C55E',
      },
    ];
  }, [activeZone]);

  return (
    <div className="nearby-stores-page-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#22C55E', backgroundColor: 'rgba(34,197,94,0.12)', padding: '3px 8px', borderRadius: '6px' }}>
                Ola Maps Local Discovery
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Zone: {activeZone.name.split('(')[0]}
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
              Nearby Stores in {selectedAddress?.city || activeZone.city}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
              Direct ordering from neighborhood merchants with live GPS tracking and 15–25 min doorstep delivery.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* View Mode Toggle */}
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: viewMode === 'grid' ? '#22C55E' : 'transparent',
                  color: viewMode === 'grid' ? '#0A0F0D' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <IconLayoutGrid size={15} /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: viewMode === 'map' ? '#22C55E' : 'transparent',
                  color: viewMode === 'map' ? '#0A0F0D' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <IconMap size={15} /> Ola Map
              </button>
            </div>

            <button
              onClick={openLocationModal}
              className="btn-secondary"
              style={{ padding: '9px 16px', borderRadius: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <IconMapPin size={15} stroke={1.8} color="#22C55E" /> Change Location
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="filters-row" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
        <button
          className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Stores ({storesWithCoords.length})
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

      {/* Stores Content: Map View or Grid View */}
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
      ) : viewMode === 'map' ? (
        /* ================= OLA MAP VIEW ================= */
        <div style={{ display: 'grid', gridTemplateColumns: selectedStore ? '1fr 340px' : '1fr', gap: '20px', alignItems: 'start' }}>
          <div style={{ position: 'relative' }}>
            <OlaMap
              center={[customerLat, customerLng]}
              zoom={13}
              height="580px"
              markers={mapMarkers}
              routeCoordinates={routeCoords}
              zones={zones}
              className="rounded-2xl shadow-2xl border border-[rgba(34,197,94,0.25)]"
            />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 10, backgroundColor: 'rgba(10,15,13,0.85)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }}></span>
              <span style={{ fontSize: '12px', color: '#F5F5F5', fontWeight: 600 }}>
                {filteredStores.length} Stores pinned in your neighborhood
              </span>
            </div>
          </div>

          {/* Selected Store Floating Panel */}
          {selectedStore && (
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ position: 'relative', height: '140px', borderRadius: '14px', overflow: 'hidden', marginBottom: '14px' }}>
                <img
                  src={
                    selectedStore.shopImageUrl ||
                    selectedStore.shopLogoUrl ||
                    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={selectedStore.shopName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', color: '#22C55E', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                  ★ {selectedStore.rating.toFixed(1)}
                </div>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
                {selectedStore.shopName}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {selectedStore.businessCategory || 'Local Retail Merchant'}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {selectedStore.addressLine1 || selectedStore.locality || selectedStore.city}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '14px 0', padding: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Distance</span>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#22C55E' }}>
                    {selectedStore.distanceKm} km
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Delivery ETA</span>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F5F5F5' }}>
                    {selectedStore.deliveryEtaMin ? `${selectedStore.deliveryEtaMin} mins` : '15-25 mins'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedStore(null)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => navigate('store', { storeId: selectedStore.id })}
                  className="btn-primary"
                  style={{
                    flex: 2,
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Enter Store</span>
                  <IconArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= GRID VIEW ================= */
        <div className="stores-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredStores.map((st) => (
            <StoreCard key={st.id} store={st} />
          ))}
        </div>
      )}
    </div>
  );
};
