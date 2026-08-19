import React from 'react';
import { useGetora } from '../context/GetoraContext';
import {
  IconCircleCheck,
  IconPackage,
  IconMapPin,
  IconClock,
  IconArrowRight,
  IconTruckDelivery,
  IconBuildingStore,
  IconChevronRight
} from '@tabler/icons-react';

export const OrderConfirmationPage: React.FC = () => {
  const { viewParams, getOrderById, navigate } = useGetora();
  const orderId = viewParams.orderId;
  const order = getOrderById(orderId);

  return (
    <div className="order-confirmation-page" style={{ maxWidth: '640px', margin: '40px auto', padding: '0 16px 60px' }}>
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        {/* Animated Check Icon */}
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            color: '#22C55E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '2px solid rgba(34, 197, 94, 0.3)'
          }}
        >
          <IconCircleCheck size={42} stroke={1.8} />
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Order Successfully Placed!
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          Your order has been transmitted directly to the store merchant. Packing will commence within 5 minutes.
        </p>

        {order && (
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '28px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Number</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#22C55E', fontFamily: 'monospace' }}>
                  {order.orderNumber}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Amount</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>₹{order.totalAmount}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <IconClock size={16} stroke={1.8} color="#22C55E" />
              <span>Estimated Delivery: <strong>15–25 Minutes</strong></span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {order && (
            <button
              className="btn-primary"
              onClick={() => navigate('track-order', { orderId: order.id })}
              style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <IconTruckDelivery size={16} stroke={1.8} /> Live Order Tracking
            </button>
          )}
          <button
            className="btn-secondary"
            onClick={() => navigate('home')}
            style={{ padding: '12px 20px', borderRadius: '12px', fontSize: '14px' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
