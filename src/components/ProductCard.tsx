import React from 'react';
import { Heart, Plus, Minus, Tag, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { useGetora } from '../context/GetoraContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate, addToCart, updateCartQuantity, getItemQuantityInCart } = useGetora();

  const quantityInCart = getItemQuantityInCart(product.id);
  const discountPercent =
    product.price > product.sellingPrice
      ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
      : 0;

  const handleCardClick = () => {
    navigate('product', { productId: product.id });
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable || product.stockQuantity <= 0) return;
    addToCart(product, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartQuantity(product.id, quantityInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartQuantity(product.id, quantityInCart - 1);
  };

  const firstImg = product.images?.[0];
  const displayImage =
    product.imageUrl ||
    (typeof firstImg === 'string' ? firstImg : firstImg?.imageUrl) ||
    'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=80';

  const inStock = product.isAvailable && product.stockQuantity > 0;

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      style={{
        backgroundColor: '#181818',
        border: '1px solid #262626',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#1DB954';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#262626';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Product Image */}
      <div
        style={{
          width: '100%',
          height: '160px',
          backgroundColor: '#202020',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <img
          src={displayImage}
          alt={product.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {discountPercent > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: '#1DB954',
              color: '#000000',
              fontWeight: 800,
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '6px'
            }}
          >
            {discountPercent}% OFF
          </div>
        )}

        {product.brand && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: '4px',
              backdropFilter: 'blur(4px)'
            }}
          >
            {product.brand}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              lineHeight: 1.35,
              marginBottom: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
            title={product.name}
          >
            {product.name}
          </h4>
          <div style={{ fontSize: '12px', color: '#8E8E93', marginBottom: '12px' }}>
            Unit: {product.unit || '1 pc'} • {product.retailer?.shopName || 'Neighborhood Store'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Outfit' }}>
              ₹{product.sellingPrice}
            </div>
            {product.price > product.sellingPrice && (
              <div style={{ fontSize: '12px', color: '#6B6B6B', textDecoration: 'line-through' }}>
                ₹{product.price}
              </div>
            )}
          </div>

          {!inStock ? (
            <span style={{ fontSize: '11px', color: '#8E8E93', backgroundColor: '#222', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>
              Out of Stock
            </span>
          ) : quantityInCart > 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#1DB954',
                color: '#000',
                borderRadius: '8px',
                padding: '2px 6px',
                gap: '8px',
                fontWeight: 800
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleDecrement}
                style={{ border: 'none', background: 'transparent', color: '#000', cursor: 'pointer', display: 'flex', padding: '2px' }}
              >
                <Minus size={13} strokeWidth={3} />
              </button>
              <span style={{ fontSize: '13px' }}>{quantityInCart}</span>
              <button
                onClick={handleIncrement}
                style={{ border: 'none', background: 'transparent', color: '#000', cursor: 'pointer', display: 'flex', padding: '2px' }}
              >
                <Plus size={13} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              style={{
                backgroundColor: 'rgba(29, 185, 84, 0.15)',
                border: '1px solid rgba(29, 185, 84, 0.4)',
                color: '#1DB954',
                fontWeight: 700,
                fontSize: '12px',
                padding: '6px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1DB954';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(29, 185, 84, 0.15)';
                e.currentTarget.style.color = '#1DB954';
              }}
            >
              + ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
