import React from 'react';
import { useGetora } from '../context/GetoraContext';
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
  IconMotorbike
} from '@tabler/icons-react';
import { OrderStatus } from '../types';

export const LiveTrackingPage: React.FC = () => {
  const { viewParams, getOrderById, orders, navigate } = useGetora();
  const orderId = viewParams.orderId;
  const order = (orderId ? getOrderById(orderId) : null) || orders[0];

  if (!order) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '40px' }}>
        <h2>No Active Order Found for Tracking</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Place an order to track live delivery updates.</p>
        <button className="btn-primary" onClick={() => navigate('orders')} style={{ marginTop: '20px' }}>
          View Orders
        </button>
      </div>
    );
  }

  const STATUS_STEPS: Array<{ key: OrderStatus; label: string }> = [
    { key: 'placed', label: 'Order Placed' },
    { key: 'accepted', label: 'Accepted by Store' },
    { key: 'preparing', label: 'Packing Items' },
    { key: 'ready_for_pickup', label: 'Ready for Pickup' },
    { key: 'picked_up', label: 'Rider Picked Up' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const currentStatus: OrderStatus = order.orderStatus || order.status || 'placed';

  const getStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.findIndex((s) => s.key === status);
  };

  const currentStepIdx = getStepIndex(currentStatus);

  return (
    <div className="live-tracking-page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Back button & Order Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={() => navigate('orders')}
          className="btn-secondary"
          style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <IconArrowLeft size={16} stroke={1.8} /> Back to Orders
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Order:</span>
          <span style={{ color: '#22C55E', fontWeight: 800, fontSize: '14px', fontFamily: 'monospace' }}>
            {order.orderNumber}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {/* Left Column: Live Status Timeline */}
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
                Estimated Delivery
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'Outfit', color: '#22C55E', marginTop: '2px' }}>
                {currentStatus === 'delivered' ? 'Order Delivered!' : '15–25 Minutes'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Status: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{currentStatus.replace(/_/g, ' ')}</strong>
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
              Delivery Progress
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
          {order.deliveryPartner && (
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#22C55E', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  <IconMotorbike size={20} stroke={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Assigned Rider</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{order.deliveryPartner.fullName}</div>
                  <div style={{ fontSize: '12px', color: '#22C55E' }}>{order.deliveryPartner.vehicleType || 'Electric Two-Wheeler'} ({order.deliveryPartner.vehicleNumber || 'EV-Fleet'})</div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Address */}
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
