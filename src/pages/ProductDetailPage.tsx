import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Store,
  Plus,
  Minus,
  ArrowLeft,
  Tag,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { viewParams, getProductById, getStoreById, addToCart, updateCartQuantity, getItemQuantityInCart, navigate } = useGetora();
  const productId = viewParams.productId || viewParams.id;
  const product = getProductById(productId);

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  if (!product) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center', padding: '40px' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: '#8E8E93', marginTop: '8px' }}>This product is no longer available in the catalog.</p>
        <button className="btn-primary" onClick={() => navigate('home')} style={{ marginTop: '20px' }}>
          Back to Home
        </button>
      </div>
    );
  }

  const store = getStoreById(product.retailerId || product.storeId || '');
  const quantityInCart = getItemQuantityInCart(product.id);

  const images = product.images && product.images.length > 0
    ? product.images.map((img) => (typeof img === 'string' ? img : img.imageUrl))
    : [product.imageUrl || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80'];

  const discountPercent =
    product.price > product.sellingPrice
      ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
      : 0;

  const inStock = product.isAvailable && product.stockQuantity > 0;

  return (
    <div className="product-detail-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(store ? 'store' : 'home', { storeId: store?.id })}
        className="btn-secondary"
        style={{
          padding: '8px 14px',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px'
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Main Product Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '40px', marginBottom: '60px' }}>
        {/* Left: Product Images */}
        <div>
          {/* Main Selected Image */}
          <div
            style={{
              backgroundColor: '#181818',
              border: '1px solid #282828',
              borderRadius: '20px',
              overflow: 'hidden',
              height: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: '16px'
            }}
          >
            <img
              src={images[selectedImgIndex] || images[0]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }}
            />

            {discountPercent > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: '#1DB954',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '8px'
                }}
              >
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '12px',
                    border: selectedImgIndex === idx ? '2px solid #1DB954' : '1px solid #282828',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundColor: '#181818',
                    flexShrink: 0
                  }}
                >
                  <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Card */}
        <div>
          {/* Store Pill */}
          {store && (
            <div
              onClick={() => navigate('store', { storeId: store.id })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#181818',
                border: '1px solid #282828',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '13px',
                color: '#1DB954',
                marginBottom: '16px',
                cursor: 'pointer'
              }}
            >
              <Store size={14} /> Sold & Packed by <strong style={{ color: '#fff' }}>{store.shopName}</strong>
            </div>
          )}

          <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', color: '#fff', lineHeight: 1.25, marginBottom: '8px' }}>
            {product.name}
          </h1>

          {product.brand && (
            <div style={{ fontSize: '14px', color: '#A7A7A7', marginBottom: '16px' }}>
              Brand: <strong style={{ color: '#fff' }}>{product.brand}</strong> • SKU: {product.sku || 'VERIFIED'}
            </div>
          )}

          {/* Pricing Block */}
          <div
            style={{
              backgroundColor: '#141414',
              border: '1px solid #242424',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'Outfit', color: '#FFFFFF' }}>
                ₹{product.sellingPrice}
              </span>
              {product.price > product.sellingPrice && (
                <span style={{ fontSize: '18px', color: '#6B6B6B', textDecoration: 'line-through' }}>
                  ₹{product.price}
                </span>
              )}
              {discountPercent > 0 && (
                <span style={{ color: '#1DB954', fontWeight: 700, fontSize: '15px' }}>
                  Save ₹{product.price - product.sellingPrice}
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#8E8E93' }}>
              Inclusive of all taxes • Unit: {product.unit || '1 pc'}
            </div>

            {/* Cart Button */}
            <div style={{ marginTop: '20px' }}>
              {!inStock ? (
                <button
                  disabled
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#202020',
                    color: '#8E8E93',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'not-allowed',
                    border: 'none'
                  }}
                >
                  Currently Out of Stock
                </button>
              ) : quantityInCart > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#1DB954',
                      color: '#000',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      gap: '16px',
                      fontWeight: 800
                    }}
                  >
                    <button
                      onClick={() => updateCartQuantity(product.id, quantityInCart - 1)}
                      style={{ border: 'none', background: 'transparent', color: '#000', cursor: 'pointer', display: 'flex' }}
                    >
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span style={{ fontSize: '16px' }}>{quantityInCart}</span>
                    <button
                      onClick={() => updateCartQuantity(product.id, quantityInCart + 1)}
                      style={{ border: 'none', background: 'transparent', color: '#000', cursor: 'pointer', display: 'flex' }}
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => navigate('cart')}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '14px' }}
                  >
                    View in Cart →
                  </button>
                </div>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => addToCart(product, 1)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: 700 }}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>

          {/* Value Props Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={18} color="#1DB954" />
              <span style={{ fontSize: '12px', color: '#D1D5DB' }}>15–25 Min Delivery</span>
            </div>
            <div style={{ backgroundColor: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={18} color="#1DB954" />
              <span style={{ fontSize: '12px', color: '#D1D5DB' }}>100% Genuine Item</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Product Overview</h3>
              <p style={{ color: '#A7A7A7', fontSize: '14px', lineHeight: 1.6 }}>{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
