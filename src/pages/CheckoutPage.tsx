import React, { useState, useMemo } from 'react';
import { useGetora } from '../context/GetoraContext';
import { OlaMap, MapMarkerItem } from '../components/OlaMap';
import { calculateDistanceKm, calculateDeliveryEta } from '../utils/geoUtils';
import { calculateDeliveryFee } from '../utils/deliveryFeeCalculator';
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
  IconBuildingStore,
  IconSparkles,
  IconInfoCircle
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

  const cartSummary = getCartSummary();

  // Resolve store & customer coordinates for distance & dynamic fee
  const storeLat = targetRetailer?.latitude || 26.8524;
  const storeLng = targetRetailer?.longitude || 75.8234;
  const customerLat = selectedAddress?.latitude || 26.8720;
  const customerLng = selectedAddress?.longitude || 75.7950;

  const distanceKm = useMemo(() => {
    return calculateDistanceKm(storeLat, storeLng, customerLat, customerLng);
  }, [storeLat, storeLng, customerLat, customerLng]);

  const eta = useMemo(() => {
    return calculateDeliveryEta(distanceKm);
  }, [distanceKm]);

  // Dynamic Ola Maps Delivery Fee Calculation
  const feeCalc = useMemo(() => {
    return calculateDeliveryFee({
      subtotal: cartSummary.subtotal,
      distanceKm: distanceKm,
      freeDeliveryThreshold: targetRetailer?.freeDeliveryThreshold || 499,
    });
  }, [cartSummary.subtotal, distanceKm, targetRetailer]);

  // Effective fee and grand total with dynamic delivery pricing
  const dynamicDeliveryFee = feeCalc.totalFee;
  const computedGrandTotal = Math.max(0, cartSummary.subtotal + dynamicDeliveryFee + cartSummary.platformFee - cartSummary.discount);

  // Map markers & route for checkout mini map
  const checkoutMarkers: MapMarkerItem[] = useMemo(() => {
    return [
      {
        id: 'store-pin',
        latitude: storeLat,
        longitude: storeLng,
        title: targetRetailer?.shopName || 'Store Location',
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
  }, [storeLat, storeLng, customerLat, customerLng, targetRetailer]);

  const checkoutRoute: [number, number][] = useMemo(() => {
    return [
      [storeLat, storeLng],
      [customerLat, customerLng],
    ];
  }, [storeLat, storeLng, customerLat, customerLng]);

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
    <div className="checkout-page-container" style={{ maxWidth: '1020px', margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => navigate('cart')}
          className="btn-secondary"
          style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <IconArrowLeft size={16} stroke={1.8} /> Back to Cart
        </button>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
            Secure Doorstep Checkout
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Live ETA: ~{eta.label} ({distanceKm} km via Ola Maps routing)
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        {/* Left Column: Address & Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Step 1: Address Card with Ola Maps Mini Preview */}
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#22C55E', color: '#000', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  1
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
                  Delivery Address & Corridor
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
              <div>
                <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedAddress.addressType}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>• {selectedAddress.city}</span>
                    <span style={{ fontSize: '10px', backgroundColor: 'rgba(34,197,94,0.15)', color: '#22C55E', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, marginLeft: 'auto' }}>
                      {distanceKm} km from store
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {selectedAddress.addressLine1}
                    {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Pincode: {selectedAddress.pincode} • Phone: {selectedAddress.phone || user?.phone || 'On file'}
                  </p>
                </div>

                {/* Delivery Route Mini Map */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <OlaMap
                    center={[(storeLat + customerLat) / 2, (storeLng + customerLng) / 2]}
                    zoom={13}
                    height="140px"
                    markers={checkoutMarkers}
                    routeCoordinates={checkoutRoute}
                    interactive={false}
                    showControls={false}
                  />
                </div>
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
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#22C55E', color: '#000', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                2
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
                Select Payment Method
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'COD', label: 'Cash on Delivery (COD)', desc: 'Pay cash or scan rider QR upon arrival', icon: <IconCash size={18} stroke={1.8} /> },
                { id: 'UPI', label: 'Instant UPI (Google Pay, PhonePe, Paytm)', desc: 'Fast UPI payment with instant order lock', icon: <IconDeviceMobile size={18} stroke={1.8} /> },
                { id: 'CARD', label: 'Credit / Debit Cards', desc: 'Visa, MasterCard, RuPay cards', icon: <IconCreditCard size={18} stroke={1.8} /> }
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  style={{
                    backgroundColor: paymentMethod === m.id ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-secondary)',
                    border: paymentMethod === m.id ? '1px solid #22C55E' : '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '14px 16px',
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
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{m.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.desc}</div>
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

        {/* Right Column: Order Items & Transparent Bill Breakdown */}
        <div>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
              {itemsToCheckout.map((it) => (
                <div key={it.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{it.product.name} × {it.quantity}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{it.unitPrice * it.quantity}</span>
                </div>
              ))}
            </div>

            {/* Transparent Bill breakdown with Ola Maps distance calculation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--text-primary)' }}>₹{cartSummary.subtotal}</span>
              </div>

              {/* Delivery Fee with Transparent Explanation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Delivery Fee</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    ({distanceKm} km via Ola Maps)
                  </span>
                </div>
                <div>
                  {feeCalc.isFreeDelivery ? (
                    <span style={{ color: '#22C55E', fontWeight: 700 }}>FREE</span>
                  ) : (
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{dynamicDeliveryFee}</span>
                  )}
                </div>
              </div>

              {/* Small helper text on delivery fee */}
              <div style={{ fontSize: '11px', color: feeCalc.isFreeDelivery ? '#4ADE80' : 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: '6px' }}>
                {feeCalc.breakdownDescription}
                {!feeCalc.isFreeDelivery && feeCalc.amountNeededForFreeDelivery > 0 && (
                  <div style={{ marginTop: '2px', color: '#F59E0B' }}>
                    Add ₹{feeCalc.amountNeededForFreeDelivery} more to unlock FREE delivery!
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Platform Convenience Fee</span>
                <span style={{ color: 'var(--text-primary)' }}>₹{cartSummary.platformFee}</span>
              </div>

              {cartSummary.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22C55E' }}>
                  <span>Discount</span>
                  <span>-₹{cartSummary.discount}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>Grand Total</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Incl. all taxes & delivery fees</span>
              </div>
              <span style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'Outfit', color: '#22C55E' }}>
                ₹{computedGrandTotal}
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
              {submitting ? <IconLoader2 size={18} stroke={1.8} className="spin" /> : `Confirm & Place Order (₹${computedGrandTotal})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
