import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import {
  MapPin,
  Plus,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Banknote,
  Smartphone,
  Loader2,
  Store
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    viewParams,
    getStoreById,
    cart,
    savedAddresses,
    selectedAddress,
    selectLocation,
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
    const targetRetId = targetRetailer?.id || itemsToCheckout[0]?.product.retailerId || itemsToCheckout[0]?.product.storeId || '';

    const res = await placeOrder({
      retailerId: targetRetId,
      addressId: selectedAddress.id,
      paymentMethod,
      items: itemsToCheckout
    });

    setSubmitting(false);

    if (res.success && res.orderId) {
      navigate('order-confirmation', { orderId: res.orderId });
    }
  };

  return (
    <div className="checkout-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px 60px' }}>
      <button
        onClick={() => navigate('cart')}
        className="btn-secondary"
        style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
      >
        <ArrowLeft size={16} /> Back to Cart
      </button>

      <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', color: '#fff', marginBottom: '24px' }}>
        Checkout & Confirmation
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Left Column: Address & Payment Methods */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Step 1: Delivery Address */}
          <div style={{ backgroundColor: '#141414', border: '1px solid #282828', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#1DB954', color: '#000', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  1
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', fontFamily: 'Outfit' }}>
                  Delivery Address
                </h3>
              </div>
              <button
                onClick={openLocationModal}
                style={{ background: 'none', border: 'none', color: '#1DB954', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                + Add / Change
              </button>
            </div>

            {selectedAddress ? (
              <div style={{ backgroundColor: '#181818', border: '1px solid #292929', borderRadius: '14px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{selectedAddress.addressType}</span>
                  <span style={{ fontSize: '12px', color: '#8E8E93' }}>• {selectedAddress.city}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.4 }}>
                  {selectedAddress.addressLine1}
                  {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                </p>
                <p style={{ fontSize: '12px', color: '#8E8E93', marginTop: '4px' }}>
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
                  border: '1px dashed #1DB954',
                  backgroundColor: 'rgba(29, 185, 84, 0.08)',
                  color: '#1DB954',
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
          <div style={{ backgroundColor: '#141414', border: '1px solid #282828', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#1DB954', color: '#000', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                2
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', fontFamily: 'Outfit' }}>
                Select Payment Method
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'COD', label: 'Cash on Delivery (COD)', desc: 'Pay cash or scan QR upon doorstep arrival', icon: <Banknote size={18} /> },
                { id: 'UPI', label: 'Instant UPI (Google Pay, PhonePe, Paytm)', desc: 'Instant UPI payment confirmation', icon: <Smartphone size={18} /> },
                { id: 'CARD', label: 'Credit / Debit Cards', desc: 'Visa, MasterCard, RuPay & Corporate Cards', icon: <CreditCard size={18} /> }
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  style={{
                    backgroundColor: paymentMethod === m.id ? 'rgba(29, 185, 84, 0.08)' : '#181818',
                    border: paymentMethod === m.id ? '1px solid #1DB954' : '1px solid #282828',
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
                    <div style={{ color: paymentMethod === m.id ? '#1DB954' : '#A7A7A7' }}>{m.icon}</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{m.label}</div>
                      <div style={{ fontSize: '12px', color: '#8E8E93' }}>{m.desc}</div>
                    </div>
                  </div>

                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: paymentMethod === m.id ? '5px solid #1DB954' : '2px solid #555',
                      backgroundColor: '#000'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Items & Pay Button */}
        <div>
          <div style={{ backgroundColor: '#141414', border: '1px solid #282828', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit', marginBottom: '16px' }}>
              Order Review ({itemsToCheckout.length} Items)
            </h3>

            {/* Target Shop */}
            {targetRetailer && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #222', marginBottom: '14px', color: '#1DB954', fontSize: '13px', fontWeight: 600 }}>
                <Store size={15} /> Fulfilling Store: <span style={{ color: '#fff' }}>{targetRetailer.shopName}</span>
              </div>
            )}

            {/* Items list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingBottom: '14px', borderBottom: '1px solid #222', marginBottom: '16px' }}>
              {itemsToCheckout.map((it) => (
                <div key={it.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#D1D5DB' }}>{it.product.name} × {it.quantity}</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>₹{it.unitPrice * it.quantity}</span>
                </div>
              ))}
            </div>

            {/* Bill breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#A7A7A7', paddingBottom: '16px', borderBottom: '1px solid #222', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: '#fff' }}>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery</span>
                <span style={{ color: deliveryFee === 0 ? '#1DB954' : '#fff' }}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Platform Fee</span>
                <span style={{ color: '#fff' }}>₹{platformFee}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1DB954' }}>
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Grand Total</span>
              <span style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'Outfit', color: '#1DB954' }}>
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
              {submitting ? <Loader2 size={18} className="spin" /> : `Place Order (₹${grandTotal})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
