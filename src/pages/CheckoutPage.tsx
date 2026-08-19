import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import {
  IconMapPin,
  IconPlus,
  IconArrowLeft,
  IconShieldCheck,
  IconCircleCheck,
  IconClock,
  IconCreditCard,
  IconCash,
  IconDeviceMobile,
  IconLoader2,
  IconBuildingStore
} from '@tabler/icons-react';

export const CheckoutPage: React.FC = () => {
  const {
    viewParams,
    getStoreById,
    cart,
    selectedAddress,
    openLocationModal,
    getCartSummary,
    placeOrder,
    user,
    openAuthModal,
    navigate
  } = useGetora();

  const retailerId = viewParams.retailerId;
  const targetRetailer = retailerId ? getStoreById(retailerId) : undefined;

  // Filter items for target retailer if specified
  const itemsToCheckout = targetRetailer
    ? cart.filter((i) => i.product.retailerId === targetRetailer.id)
    : cart;

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD'>('COD');
  const [submitting, setSubmitting] = useState(false);

  const { subtotal, deliveryFee, platformFee, discount, grandTotal } = getCartSummary();

  const handleConfirmOrder = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (!selectedAddress) {
      openLocationModal();
      return;
    }

    if (itemsToCheckout.length === 0) {
      navigate('cart');
      return;
    }

    setSubmitting(true);
    try {
      const res = await placeOrder({
        retailerId: targetRetailer?.id || itemsToCheckout[0]?.product?.retailerId || 'default-store',
        addressId: selectedAddress.id,
        paymentMethod,
        items: itemsToCheckout
      });

      if (res.success && res.orderId) {
        navigate('order-confirmation', { orderId: res.orderId });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <button
          onClick={() => navigate('cart')}
          className="btn-secondary"
          style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <IconArrowLeft size={16} stroke={1.8} /> Back to Cart
        </button>
        <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
          Secure Checkout
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
        {/* Left Column: Address & Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Step 1: Address Card */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#22C55E', color: '#000', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  1
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
                  Delivery Address
                </h3>
              </div>
              <button
                onClick={openLocationModal}
                style={{ background: 'none', border: 'none', color: '#22C55E', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                + Add / Change
              </button>
            </div>

            {selectedAddress ? (
              <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedAddress.addressType}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• {selectedAddress.city}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {selectedAddress.addressLine1}
                  {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Pincode: {selectedAddress.pincode} • Phone: {selectedAddress.phone || user?.phone || 'On file'}
                </p>
              </div>
            ) : (
              <button
                onClick={openLocationModal}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px dashed #22C55E',
                  backgroundColor: 'rgba(34, 197, 94, 0.08)',
                  color: '#22C55E',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                + Select or Add Delivery Address
              </button>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#22C55E', color: '#000', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                2
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
                Select Payment Method
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'COD', label: 'Cash on Delivery (COD)', desc: 'Pay cash or scan QR upon doorstep arrival', icon: <IconCash size={18} stroke={1.8} /> },
                { id: 'UPI', label: 'Instant UPI (Google Pay, PhonePe, Paytm)', desc: 'Instant UPI payment confirmation', icon: <IconDeviceMobile size={18} stroke={1.8} /> },
                { id: 'CARD', label: 'Credit / Debit Cards', desc: 'Visa, MasterCard, RuPay & Corporate Cards', icon: <IconCreditCard size={18} stroke={1.8} /> }
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  style={{
                    backgroundColor: paymentMethod === m.id ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-secondary)',
                    border: paymentMethod === m.id ? '1px solid #22C55E' : '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: paymentMethod === m.id ? '#22C55E' : 'var(--text-muted)' }}>{m.icon}</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{m.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{m.desc}</div>
                    </div>
                  </div>

                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: paymentMethod === m.id ? '5px solid #22C55E' : '2px solid var(--border-highlight)',
                      backgroundColor: 'transparent'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Items & Pay Button */}
        <div>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit', marginBottom: '16px' }}>
              Order Review ({itemsToCheckout.length} Items)
            </h3>

            {/* Target Shop */}
            {targetRetailer && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '14px', color: '#22C55E', fontSize: '13px', fontWeight: 600 }}>
                <IconBuildingStore size={15} stroke={1.8} /> Fulfilling Store: <span style={{ color: 'var(--text-primary)' }}>{targetRetailer.shopName}</span>
              </div>
            )}

            {/* Items list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
              {itemsToCheckout.map((it) => (
                <div key={it.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{it.product.name} × {it.quantity}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{it.unitPrice * it.quantity}</span>
                </div>
              ))}
            </div>

            {/* Bill breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--text-primary)' }}>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery</span>
                <span style={{ color: deliveryFee === 0 ? '#22C55E' : 'var(--text-primary)' }}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Platform Fee</span>
                <span style={{ color: 'var(--text-primary)' }}>₹{platformFee}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22C55E' }}>
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>Grand Total</span>
              <span style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'Outfit', color: '#22C55E' }}>
                ₹{grandTotal}
              </span>
            </div>

            <button
              className="btn-primary"
              disabled={submitting}
              onClick={handleConfirmOrder}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {submitting ? <IconLoader2 size={18} stroke={1.8} className="spin" /> : `Place Order (₹${grandTotal})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
