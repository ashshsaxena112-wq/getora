import React from 'react';
import { useGetora } from '../context/GetoraContext';
import { Tag, Check, Copy, Sparkles } from 'lucide-react';

export const OffersPage: React.FC = () => {
  const { applyCoupon, appliedCoupon, navigate, showToast } = useGetora();

  const coupons = [
    {
      code: 'GETORA100',
      description: 'Flat ₹100 OFF on your order above ₹299 from any neighborhood store.',
      minOrderValue: 299,
      validUntil: 'Active Today'
    },
    {
      code: 'FREEDEL',
      description: 'Free instant 15-minute delivery on hardware, electrical and tech orders above ₹499.',
      minOrderValue: 499,
      validUntil: 'Valid this week'
    }
  ];

  const handleApply = (code: string) => {
    applyCoupon(code);
    navigate('cart');
  };

  const handleCopy = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      showToast('Code Copied', `Coupon ${code} copied to clipboard`, 'success');
    }
  };

  return (
    <div className="offers-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px 60px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', color: '#fff', marginBottom: '4px' }}>
          Offers & Coupons
        </h1>
        <p style={{ color: '#A7A7A7', fontSize: '14px' }}>
          Exclusive discounts and free delivery vouchers for neighborhood orders.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {coupons.map((c) => {
          const isApplied = appliedCoupon === c.code;

          return (
            <div
              key={c.code}
              style={{
                backgroundColor: '#141414',
                border: '1px solid',
                borderColor: isApplied ? '#1DB954' : '#282828',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isApplied && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(29, 185, 84, 0.15)',
                    color: '#1DB954',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid #1DB954'
                  }}
                >
                  APPLIED IN CART
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(29, 185, 84, 0.12)',
                      color: '#1DB954',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Tag size={18} />
                  </div>

                  <span
                    style={{
                      fontFamily: 'Outfit',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#1DB954',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {c.code}
                  </span>
                </div>

                <p style={{ color: '#fff', fontSize: '14.5px', fontWeight: 600, marginBottom: '6px' }}>
                  {c.description}
                </p>

                <div style={{ fontSize: '12.5px', color: '#A7A7A7', marginBottom: '20px' }}>
                  Min order value: ₹{c.minOrderValue} • {c.validUntil}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #202020', paddingTop: '16px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => handleCopy(c.code)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Copy size={14} /> Copy
                </button>

                <button
                  className="btn-primary"
                  onClick={() => handleApply(c.code)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px' }}
                >
                  {isApplied ? 'Applied' : 'Apply to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
