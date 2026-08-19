import React from 'react';
import { useGetora } from '../context/GetoraContext';
import { ProductCard } from '../components/ProductCard';
import { IconHeart, IconArrowRight } from '@tabler/icons-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, navigate } = useGetora();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="wishlist-page-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px 60px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '4px' }}>
          My Wishlist ({wishlistedProducts.length})
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Saved products from your local neighborhood stores ready for fast dispatch.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '60px 20px',
            textAlign: 'center',
            maxWidth: '520px',
            margin: '40px auto'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <IconHeart size={30} stroke={1.8} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Your Wishlist is Empty
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '24px' }}>
            Save items you love by clicking the heart icon on any product card.
          </p>
          <button className="btn-primary" onClick={() => navigate('stores')}>
            Explore Stores <IconArrowRight size={16} stroke={1.8} />
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
