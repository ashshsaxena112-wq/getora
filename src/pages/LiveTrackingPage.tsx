import React, { useState, useEffect, useMemo } from 'react';
import { useGetora } from '../context/GetoraContext';
import { OlaMap, MapMarkerItem } from '../components/OlaMap';
import { supabase } from '../lib/supabase';
import { calculateDistanceKm, calculateDeliveryEta, interpolatePosition } from '../utils/geoUtils';
import {
  IconClock,
  IconMapPin,
  IconTruckDelivery,
  IconPhone,
  IconCircleCheck,
  IconBuildingStore,
  IconHome,
  IconShieldCheck,
  IconStar,
  IconChevronRight,
  IconArrowLeft,
  IconNavigation,
  IconMotorbike,
  IconRefresh
} from '@tabler/icons-react';
import { OrderStatus } from '../types';

export const LiveTrackingPage: React.FC = () => {
  const { viewParams, getOrderById, orders, navigate } = useGetora();
  const orderId = viewParams.orderId;
  const order = (orderId ? getOrderById(orderId) : null) || orders[0];

  if (!order) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '40px' }}>
        <h2 style={{ color: 'var(--text-primary)', fontFamily: 'Outfit' }}>No Active Order Found for Tracking</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Place an order to track live doorstep delivery updates.</p>
        <button className="btn-primary" onClick={() => navigate('orders')} style={{ marginTop: '20px' }}>
          View Orders
        </button>
      </div>
    );
  }

  const currentStatus: OrderStatus = order.orderStatus || order.status || 'placed';

  // Resolved Coordinates
  const storeLat = order.retailer?.latitude || 26.8524;
  const storeLng = order.retailer?.longitude || 75.8234;
  const customerLat = order.address?.latitude || 26.8720;
  const customerLng = order.address?.longitude || 75.7950;

  // Real-time rider coordinates
  const [riderPos, setRiderPos] = useState<{ lat: number; lng: number }>(() => {
    // Initial position based on status
    let fraction = 0;
    if (currentStatus === 'picked_up') fraction = 0.35;
    else if (currentStatus === 'out_for_delivery') fraction = 0.75;
    else if (currentStatus === 'delivered') fraction = 1.0;

    const [lat, lng] = interpolatePosition([storeLat, storeLng], [customerLat, customerLng], fraction);
    return { lat, lng };
  });

  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  // Supabase Realtime Subscription for delivery_locations
  useEffect(() => {
    if (!order.id) return;

    // 1. Initial fetch of latest location
    const fetchLatestLoc = async () => {
      try {
        const { data } = await supabase
          .from('delivery_locations')
          .select('latitude, longitude, created_at')
          .eq('order_id', order.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && data.latitude && data.longitude) {
          setRiderPos({ lat: data.latitude, lng: data.longitude });
          setLastUpdated(new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (err) {
        console.warn('Could not fetch initial delivery location:', err);
      }
    };

    fetchLatestLoc();

    // 2. Realtime channel subscription
    const channel = supabase
      .channel(`tracking:${order.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'delivery_locations',
          filter: `order_id=eq.${order.id}`,
        },
        (payload) => {
          if (payload.new?.latitude && payload.new?.longitude) {
            setRiderPos({ lat: payload.new.latitude, lng: payload.new.longitude });
            setLastUpdated('Live update received');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id]);

  // Simulated continuous progress simulation when in transit for rich demonstration
  useEffect(() => {
    if (currentStatus !== 'out_for_delivery' && currentStatus !== 'picked_up') return;

    const interval = setInterval(() => {
      setRiderPos((prev) => {
        // Move 2% closer to customer
        const dLat = customerLat - prev.lat;
        const dLng = customerLng - prev.lng;
        if (Math.abs(dLat) < 0.0001 && Math.abs(dLng) < 0.0001) {
          return prev;
        }
        return {
          lat: prev.lat + dLat * 0.04,
          lng: prev.lng + dLng * 0.04,
        };
      });
      setLastUpdated('GPS Active');
    }, 4000);

    return () => clearInterval(interval);
  }, [currentStatus, customerLat, customerLng]);

  // Computed metrics
  const remainingDistanceKm = useMemo(() => {
    return calculateDistanceKm(riderPos.lat, riderPos.lng, customerLat, customerLng);
  }, [riderPos, customerLat, customerLng]);

  const eta = useMemo(() => {
    return calculateDeliveryEta(remainingDistanceKm, currentStatus === 'out_for_delivery' ? 2 : 10);
  }, [remainingDistanceKm, currentStatus]);

  // Markers
  const mapMarkers: MapMarkerItem[] = useMemo(() => {
    const list: MapMarkerItem[] = [
      {
        id: 'store-pin',
        latitude: storeLat,
        longitude: storeLng,
        title: order.retailer?.shopName || 'Store',
        type: 'store',
      },
      {
        id: 'customer-pin',
        latitude: customerLat,
        longitude: customerLng,
        title: 'Delivery Address',
        type: 'customer',
      },
    ];

    if (currentStatus !== 'delivered' && currentStatus !== 'cancelled') {
      list.push({
        id: 'rider-pin',
        latitude: riderPos.lat,
        longitude: riderPos.lng,
        title: order.deliveryPartner?.fullName ? `${order.deliveryPartner.fullName} (Rider)` : 'GETORA Express Rider',
        type: 'rider',
      });
    }

    return list;
  }, [storeLat, storeLng, customerLat, customerLng, riderPos, currentStatus, order]);

  // Full corridor route
  const routeCoords: [number, number][] = useMemo(() => {
    return [
      [storeLat, storeLng],
      [riderPos.lat, riderPos.lng],
      [customerLat, customerLng],
    ];
  }, [storeLat, storeLng, riderPos, customerLat, customerLng]);

  const STATUS_STEPS: Array<{ key: OrderStatus; label: string }> = [
    { key: 'placed', label: 'Order Placed' },
    { key: 'accepted', label: 'Accepted by Store' },
    { key: 'preparing', label: 'Packing Items' },
    { key: 'ready_for_pickup', label: 'Ready for Pickup' },
    { key: 'picked_up', label: 'Rider Picked Up' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.findIndex((s) => s.key === status);
  };

  const currentStepIdx = getStepIndex(currentStatus);

  return (
    <div className="live-tracking-page" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Back button & Order Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={() => navigate('orders')}
          className="btn-secondary"
          style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <IconArrowLeft size={16} stroke={1.8} /> Back to Orders
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(34,197,94,0.12)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.25)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E', display: 'inline-block' }} className="animate-pulse"></span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ADE80', letterSpacing: '0.04em' }}>
              OLA MAPS LIVE REALTIME
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Order:</span>
            <span style={{ color: '#22C55E', fontWeight: 800, fontSize: '14px', fontFamily: 'monospace' }}>
              {order.orderNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Ola Map Banner */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <OlaMap
          center={[riderPos.lat, riderPos.lng]}
          zoom={14}
          height="380px"
          markers={mapMarkers}
          routeCoordinates={routeCoords}
          className="rounded-2xl shadow-2xl border border-[rgba(34,197,94,0.3)]"
        />

        {/* Floating Tracking HUD */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 10,
            backgroundColor: 'rgba(10,15,13,0.92)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '14px',
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E' }}>
            <IconNavigation size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Remaining to Destination
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#F5F5F5', fontFamily: 'Outfit' }}>
              {currentStatus === 'delivered' ? '0 km (Delivered)' : `${remainingDistanceKm} km • ~${eta.label}`}
            </div>
            <div style={{ fontSize: '10px', color: '#4ADE80', marginTop: '2px' }}>
              ● {lastUpdated} via Supabase Realtime
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Order Details & Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: ETA & Stepper Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* ETA Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Estimated Doorstep Arrival
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'Outfit', color: '#22C55E', marginTop: '2px' }}>
                {currentStatus === 'delivered' ? 'Order Delivered!' : eta.label}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Current Phase: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{currentStatus.replace(/_/g, ' ')}</strong>
              </div>
            </div>

            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#22C55E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconTruckDelivery size={28} stroke={1.8} />
            </div>
          </div>

          {/* Stepper Timeline */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>
              Live Fulfillment Progress
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '8px' }}>
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: isPassed ? '#22C55E' : 'var(--bg-elevated)',
                        color: isPassed ? '#000' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 800,
                        zIndex: 2
                      }}
                    >
                      {isPassed ? <IconCircleCheck size={16} stroke={2.5} /> : idx + 1}
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: isCurrent ? 800 : isPassed ? 600 : 400, color: isPassed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Store & Delivery Partner Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Store Info Card */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E' }}>
                <IconBuildingStore size={20} stroke={1.8} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Fulfilling Store</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{order.retailer?.shopName || 'Neighborhood Shop'}</div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {order.retailer?.addressLine1 || order.retailer?.city || 'Local Neighborhood'}
            </div>
          </div>

          {/* Delivery Partner Card */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#22C55E', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                <IconMotorbike size={20} stroke={1.8} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Assigned Ola Fleet Rider</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {order.deliveryPartner?.fullName || 'Rahul Sharma'}
                </div>
                <div style={{ fontSize: '12px', color: '#22C55E' }}>
                  {order.deliveryPartner?.vehicleType || 'Electric Scooter'} ({order.deliveryPartner?.vehicleNumber || 'RJ-14-EV-9214'})
                </div>
              </div>

              <a
                href={`tel:${order.deliveryPartner?.phone || '+919876543210'}`}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(34,197,94,0.15)',
                  color: '#22C55E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
                title="Call Rider"
              >
                <IconPhone size={18} />
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <IconShieldCheck size={16} color="#22C55E" />
              <span>Safety gear checked & contactless delivery enabled</span>
            </div>
          </div>

          {/* Delivery Destination */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22C55E', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
              <IconHome size={15} stroke={1.8} /> Delivery Destination
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {order.address?.addressLine1}
              {order.address?.addressLine2 && `, ${order.address.addressLine2}`}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {order.address?.city} - {order.address?.pincode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
