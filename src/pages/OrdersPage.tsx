import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import {
  IconClock,
  IconTruckDelivery,
  IconRotateClockwise,
  IconStar,
  IconMapPin,
  IconCircleCheck,
  IconAlertCircle,
  IconBuildingStore,
  IconShoppingBag,
  IconLoader2
} from '@tabler/icons-react';
import { Order, OrderStatus } from '../types';

export const OrdersPage: React.FC = () => {
  const { orders, isLoadingOrders, cancelOrder, navigate } = useGetora();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');

  const getOrderStatus = (o: Order): OrderStatus => o.orderStatus || o.status || 'placed';
  const getPlacedAt = (o: Order): string => o.placedAt || o.createdAt || new Date().toISOString();

  const filteredOrders = orders.filter((o) => {
    const st = getOrderStatus(o);
    if (activeTab === 'active') {
      return ['placed', 'accepted', 'preparing', 'ready_for_pickup', 'picked_up', 'out_for_delivery'].includes(st);
    }
    if (activeTab === 'completed') {
      return st === 'delivered';
    }
    return st === 'cancelled';
  });

  return (
    <div className="orders-page-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 16px 60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '4px' }}>
          My Orders
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Track active orders in real-time or view your order history.
        </p>
      </div>

      {/* Tabs */}
      <div className="filters-row" style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
        <button
          className={`filter-chip ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <IconTruckDelivery size={15} stroke={1.8} /> Active Orders ({orders.filter((o) => ['placed', 'accepted', 'preparing', 'ready_for_pickup', 'picked_up', 'out_for_delivery'].includes(getOrderStatus(o))).length})
        </button>

        <button
          className={`filter-chip ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <IconCircleCheck size={15} stroke={1.8} /> Completed ({orders.filter((o) => getOrderStatus(o) === 'delivered').length})
        </button>

        <button
          className={`filter-chip ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          <IconAlertCircle size={15} stroke={1.8} /> Cancelled ({orders.filter((o) => getOrderStatus(o) === 'cancelled').length})
        </button>
      </div>

      {/* Loading state */}
      {isLoadingOrders ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', color: '#22C55E', gap: '10px' }}>
          <IconLoader2 size={24} stroke={1.8} className="spin" /> Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '50px 20px',
            textAlign: 'center',
            maxWidth: '540px',
            margin: '20px auto'
          }}
        >
          <IconShoppingBag size={40} stroke={1.8} color="#22C55E" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            No {activeTab} orders found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '20px' }}>
            Explore verified neighborhood stores and start shopping.
          </p>
          <button className="btn-primary" onClick={() => navigate('stores')}>
            Explore Nearby Stores
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredOrders.map((ord) => {
            const st = getOrderStatus(ord);
            const isLive = ['placed', 'accepted', 'preparing', 'ready_for_pickup', 'picked_up', 'out_for_delivery'].includes(st);

            return (
              <div
                key={ord.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: isLive ? '1.5px solid #22C55E' : '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '24px',
                  position: 'relative'
                }}
              >
                {/* Top bar: Order ID, Shop Name, Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#22C55E', fontFamily: 'monospace' }}>
                        {ord.orderNumber}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        • {new Date(getPlacedAt(ord)).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>
                      <IconBuildingStore size={16} stroke={1.8} color="#22C55E" /> {ord.retailer?.shopName || 'Neighborhood Store'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        backgroundColor:
                          st === 'delivered'
                            ? 'rgba(34, 197, 94, 0.15)'
                            : st === 'cancelled'
                            ? 'rgba(239, 68, 68, 0.15)'
                            : 'rgba(245, 158, 11, 0.15)',
                        color:
                          st === 'delivered'
                            ? '#22C55E'
                            : st === 'cancelled'
                            ? '#EF4444'
                            : '#F59E0B',
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {st.replace(/_/g, ' ')}
                    </span>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
                      ₹{ord.totalAmount}
                    </div>
                  </div>
                </div>

                {/* Items preview */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {ord.items?.map((it) => `${it.productName} (×${it.quantity})`).join(', ') || 'Items details in tracking'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                    <IconMapPin size={14} stroke={1.8} color="#22C55E" /> Delivery to: {ord.address?.addressLine1 || 'Saved Address'}, {ord.address?.city || 'Bengaluru'}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  {isLive && (
                    <button
                      className="btn-primary"
                      onClick={() => navigate('track-order', { orderId: ord.id })}
                      style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <IconTruckDelivery size={16} stroke={1.8} /> Live Track Order
                    </button>
                  )}

                  {ord.orderStatus === 'placed' && (
                    <button
                      onClick={() => cancelOrder(ord.id)}
                      style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', border: '1px solid var(--border-color)', color: '#EF4444', background: 'none', cursor: 'pointer' }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
