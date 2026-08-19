import React from 'react';
import { IconPlus, IconMinus } from '@tabler/icons-react';
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
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        boxShadow: 'var(--shadow-card)'
      }}
    >
      {/* Product Image */}
      <div
        style={{
          width: '100%',
          height: '160px',
          backgroundColor: 'var(--bg-secondary)',
          position: 'relative',
          overflow: 'hidden',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
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
              backgroundColor: 'var(--primary-green)',
              color: '#000000',
              fontWeight: 800,
              fontSize: '11px',
              padding: '2px 7px',
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
              backgroundColor: 'rgba(0,0,0,0.65)',
              color: '#FFFFFF',
              fontSize: '10.5px',
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
              fontWeight: 500,
              color: 'var(--text-primary)',
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
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {product.unit || '1 pc'} • {product.retailer?.shopName || 'Local Shop'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary-green)', fontFamily: 'Outfit' }}>
              ₹{product.sellingPrice}
            </div>
            {product.price > product.sellingPrice && (
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.price}
              </div>
            )}
          </div>

          {!inStock ? (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-elevated)', padding: '4px 8px', borderRadius: '9999px', fontWeight: 600 }}>
              Out of Stock
            </span>
          ) : quantityInCart > 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--primary-green)',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '4px 10px',
                gap: '8px',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleDecrement}
                style={{ border: 'none', background: 'transparent', color: '#FFFFFF', cursor: 'pointer', display: 'flex', padding: '2px' }}
                aria-label="Decrease quantity"
              >
                <IconMinus size={14} stroke={2.5} />
              </button>
              <span style={{ fontSize: '13px', minWidth: '14px', textAlign: 'center' }}>{quantityInCart}</span>
              <button
                onClick={handleIncrement}
                style={{ border: 'none', background: 'transparent', color: '#FFFFFF', cursor: 'pointer', display: 'flex', padding: '2px' }}
                aria-label="Increase quantity"
              >
                <IconPlus size={14} stroke={2.5} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              style={{
                backgroundColor: 'var(--primary-green)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '12.5px',
                padding: '6px 18px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 10px rgba(34, 197, 94, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(34, 197, 94, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(34, 197, 94, 0.25)';
              }}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
