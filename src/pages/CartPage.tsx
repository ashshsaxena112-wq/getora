import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import {
  IconShoppingBag,
  IconTrash,
  IconPlus,
  IconMinus,
  IconTag,
  IconMapPin,
  IconArrowRight,
  IconBuildingStore,
  IconShieldCheck,
  IconBolt,
  IconInfoCircle
} from '@tabler/icons-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getCartSummary,
    selectedAddress,
    openLocationModal,
    openAuthModal,
    user,
    navigate
  } = useGetora();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const { subtotal, deliveryFee, platformFee, discount, grandTotal, retailerGroups } = getCartSummary();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = (retailerId?: string) => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (!selectedAddress) {
      openLocationModal();
      return;
    }
    navigate('checkout', { retailerId: retailerId || retailerGroups[0]?.retailer?.id });
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page-empty" style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '0 20px' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            color: '#22C55E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}
        >
          <IconShoppingBag size={34} stroke={1.8} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Your cart is empty
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px', maxWidth: '380px', margin: '0 auto 28px' }}>
          Explore nearby neighborhood stores and add authentic local products to your basket for 15-minute delivery.
        </p>
        <button
          className="btn-primary"
          onClick={() => navigate('home')}
          style={{ padding: '12px 32px', fontSize: '15px' }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
          Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
        </h1>
        <button
          onClick={clearCart}
          style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          <IconTrash size={15} stroke={1.8} /> Clear Basket
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
        {/* Left Column: Cart Items grouped by Retailer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {retailerGroups.map((group, gIdx) => (
            <div
              key={gIdx}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '20px',
                overflow: 'hidden'
              }}
            >
              {/* Retailer Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IconBuildingStore size={18} stroke={1.8} color="#22C55E" />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {group.retailer?.shopName || 'Local Retailer'}
                    </h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{group.retailer?.city || 'Neighborhood Area'}</div>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => handleProceedToCheckout(group.retailer?.id)}
                  style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '12px' }}
                >
                  Checkout This Shop →
                </button>
              </div>

              {/* Items in this shop */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {group.items.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px',
                      paddingBottom: '14px',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '10px', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden', flexShrink: 0 }}>
                        <img
                          src={item.product.imageUrl || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=80'}
                          alt={item.product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                          {item.product.name}
                        </h4>
                        <div style={{ fontSize: '13px', color: '#22C55E', fontWeight: 700 }}>
                          ₹{item.unitPrice} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>each</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {/* Quantity Selector */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 'var(--bg-elevated)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '4px 8px',
                          gap: '10px'
                        }}
                      >
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}
                        >
                          <IconMinus size={13} stroke={2} />
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}
                        >
                          <IconPlus size={13} stroke={2} />
                        </button>
                      </div>

                      <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', minWidth: '60px', textAlign: 'right' }}>
                        ₹{item.unitPrice * item.quantity}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      >
                        <IconTrash size={15} stroke={1.8} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div>
          {/* Bill Summary Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '20px'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit', marginBottom: '16px' }}>
              Bill Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Item Subtotal</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Fee</span>
                <span style={{ color: deliveryFee === 0 ? '#22C55E' : 'var(--text-primary)', fontWeight: 600 }}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Platform Fee</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{platformFee}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22C55E' }}>
                  <span>Coupon Discount</span>
                  <span style={{ fontWeight: 700 }}>-₹{discount}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>To Pay</span>
              <span style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'Outfit', color: '#22C55E' }}>
                ₹{grandTotal}
              </span>
            </div>

            {/* Delivery address status */}
            <div
              onClick={openLocationModal}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconMapPin size={16} stroke={1.8} color="#22C55E" />
                <div style={{ fontSize: '13px' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {selectedAddress ? `${selectedAddress.addressType}: ${selectedAddress.city}` : 'Choose Address'}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                    {selectedAddress?.addressLine1 || 'Select delivery location'}
                  </div>
                </div>
              </div>
              <span style={{ color: '#22C55E', fontSize: '12px', fontWeight: 600 }}>Change</span>
            </div>

            <button
              className="btn-primary"
              onClick={() => handleProceedToCheckout()}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: 700 }}
            >
              Proceed to Checkout →
            </button>
          </div>

          {/* Coupon Box */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '18px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <IconTag size={16} stroke={1.8} color="#22C55E" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Apply Promo Code</span>
            </div>

            {appliedCoupon ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ color: '#22C55E', fontWeight: 700, fontSize: '13px' }}>✓ Code {appliedCoupon} Applied</span>
                <button onClick={removeCoupon} style={{ color: '#EF4444', fontSize: '12px', border: 'none', background: 'none', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. GETORA100"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
                <button type="submit" className="btn-secondary" style={{ padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
                  Apply
                </button>
              </form>
            )}

            {couponError && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{couponError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
