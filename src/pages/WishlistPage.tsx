import React from 'react';
import { useGetora } from '../context/GetoraContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, navigate } = useGetora();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="wishlist-page-container">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', color: '#fff', marginBottom: '4px' }}>
          My Wishlist ({wishlistedProducts.length})
        </h1>
        <p style={{ color: '#A7A7A7', fontSize: '14px' }}>
          Saved products from your local neighborhood stores ready for fast dispatch.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div
          style={{
            backgroundColor: '#121212',
            border: '1px solid #292929',
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
              backgroundColor: 'rgba(255, 77, 79, 0.1)',
              color: '#ff4d4f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <Heart size={30} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            Your Wishlist is Empty
          </h2>
          <p style={{ color: '#A7A7A7', fontSize: '13.5px', marginBottom: '24px' }}>
            Save items you love by clicking the heart icon on any product card.
          </p>
          <button className="btn-primary" onClick={() => navigate('stores')}>
            Explore Stores <ArrowRight size={16} />
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
