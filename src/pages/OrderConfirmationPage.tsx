import React from 'react';
import { useGetora } from '../context/GetoraContext';
import {
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  ArrowRight,
  Truck,
  Store,
  ChevronRight
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { viewParams, getOrderById, navigate } = useGetora();
  const orderId = viewParams.orderId;
  const order = getOrderById(orderId);

  return (
    <div className="order-confirmation-page" style={{ maxWidth: '640px', margin: '40px auto', padding: '0 16px 60px' }}>
      <div
        style={{
          backgroundColor: '#141414',
          border: '1px solid #282828',
          borderRadius: '24px',
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}
      >
        {/* Animated Check Icon */}
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: 'rgba(29, 185, 84, 0.15)',
            color: '#1DB954',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '2px solid rgba(29, 185, 84, 0.3)'
          }}
        >
          <CheckCircle2 size={42} />
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'Outfit', color: '#fff', marginBottom: '8px' }}>
          Order Successfully Placed!
        </h1>

        <p style={{ color: '#A7A7A7', fontSize: '14px', marginBottom: '24px' }}>
          Your order has been transmitted directly to the store merchant. Packing will commence within 5 minutes.
        </p>

        {order && (
          <div
            style={{
              backgroundColor: '#181818',
              border: '1px solid #282828',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '28px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #222', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Number</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#1DB954', fontFamily: 'monospace' }}>
                  {order.orderNumber}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Amount</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>₹{order.totalAmount}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#D1D5DB' }}>
              <Clock size={16} color="#1DB954" />
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
              <Truck size={16} /> Live Order Tracking
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
