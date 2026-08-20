import React, { useState, useId, useMemo } from 'react';
import {
  IconPlus,
  IconMinus,
  IconChevronDown,
  IconChevronUp,
  IconScale,
  IconPackage,
  IconShoppingCart,
  IconCheck,
  IconSparkles
} from '@tabler/icons-react';
import { Product } from '../types';
import { useGetora } from '../context/GetoraContext';

interface StoreProductGridItemProps {
  product: Product;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const StoreProductGridItem: React.FC<StoreProductGridItemProps> = ({
  product,
  isExpanded,
  onToggleExpand
}) => {
  const { addToCart, getItemQuantityInCart } = useGetora();
  const accordionId = useId();

  // Unit / Weight / Count State
  const unitType = product.unitType || 'count';
  const defaultWeightOptions = [50, 100, 250, 500, 1000];
  const weightOptions =
    product.unitOptions && product.unitOptions.length > 0
      ? product.unitOptions
      : defaultWeightOptions;

  const defaultCountOptions = [1, 2, 3, 5, 10];
  const countOptions =
    product.unitOptions && product.unitOptions.length > 0
      ? product.unitOptions
      : defaultCountOptions;

  const [selectedWeight, setSelectedWeight] = useState<number>(weightOptions[0] || 100);
  const [countQuantity, setCountQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const quantityInCart = getItemQuantityInCart(product.id);
  const inStock = product.isAvailable !== false && (product.stockQuantity ?? 1) > 0;

  // Extract all gallery images
  const imageList = useMemo(() => {
    const list: string[] = [];
    if (product.imageUrl) list.push(product.imageUrl);
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        const url = typeof img === 'string' ? img : img?.imageUrl;
        if (url && !list.includes(url)) list.push(url);
      });
    }
    if (list.length === 0) {
      list.push('https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80');
    }
    return list;
  }, [product]);

  const displayImage = imageList[activeImageIndex] || imageList[0];

  // Pricing calculation
  const basePrice = product.sellingPrice || product.price;
  const discountPercent =
    product.price && product.sellingPrice && product.price > product.sellingPrice
      ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
      : product.discountPercent || 0;

  // Base unit weight reference (default to first option or 100g)
  const baseWeightRef = weightOptions[0] || 100;

  // Calculate dynamic price based on unit type and selection
  const calculatedPrice =
    unitType === 'weight'
      ? Math.round((basePrice * selectedWeight) / baseWeightRef)
      : basePrice * countQuantity;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inStock || isAdding) return;
    setIsAdding(true);

    try {
      const qtyToAdd = unitType === 'count' ? countQuantity : 1;
      await addToCart(product, qtyToAdd);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    } finally {
      setTimeout(() => setIsAdding(false), 450);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unitType === 'count') {
      setCountQuantity((prev) => Math.min(prev + 1, product.stockQuantity || 99));
    } else {
      const curIndex = weightOptions.indexOf(selectedWeight);
      if (curIndex < weightOptions.length - 1) {
        setSelectedWeight(weightOptions[curIndex + 1]);
      } else {
        setSelectedWeight((prev) => prev + (prev >= 1000 ? 500 : 50));
      }
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unitType === 'count') {
      setCountQuantity((prev) => Math.max(prev - 1, 1));
    } else {
      const curIndex = weightOptions.indexOf(selectedWeight);
      if (curIndex > 0) {
        setSelectedWeight(weightOptions[curIndex - 1]);
      } else {
        setSelectedWeight((prev) => Math.max(prev - 25, 25));
      }
    }
  };

  return (
    <div
      className={`store-product-wrapper ${isExpanded ? 'is-expanded' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '18px',
        border: isExpanded ? '1.5px solid #22C55E' : '1px solid var(--border-color)',
        boxShadow: isExpanded
          ? '0 12px 32px -8px rgba(34, 197, 94, 0.28), 0 6px 16px rgba(0,0,0,0.5)'
          : 'var(--shadow-card)',
        overflow: 'hidden',
        transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative'
      }}
    >
      {/* Top Product Card Tile */}
      <div
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={accordionId}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleExpand();
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          padding: '14px',
          userSelect: 'none',
          height: '100%',
          justifyContent: 'space-between'
        }}
      >
        {/* Product Image & Badges */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '160px',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-secondary)',
            overflow: 'hidden',
            marginBottom: '12px'
          }}
        >
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isExpanded ? 'scale(1.06)' : 'scale(1)'
            }}
          />

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                backgroundColor: '#22C55E',
                color: '#000000',
                fontWeight: 800,
                fontSize: '10.5px',
                padding: '3px 8px',
                borderRadius: '6px',
                letterSpacing: '-0.2px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              {discountPercent}% OFF
            </span>
          )}

          {/* Cart Quantity Badge if Already in Cart */}
          {quantityInCart > 0 && (
            <span
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                backgroundColor: '#22C55E',
                color: '#000000',
                fontWeight: 800,
                fontSize: '10.5px',
                padding: '2px 7px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                zIndex: 2
              }}
            >
              <IconCheck size={11} stroke={3} /> {quantityInCart} in cart
            </span>
          )}

          {/* Unit Type Indicator (Weight vs Count) */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(14, 14, 14, 0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '3px 7px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10.5px',
              color: '#E5E7EB',
              fontWeight: 600
            }}
          >
            {unitType === 'weight' ? (
              <>
                <IconScale size={12} color="#22C55E" stroke={2.2} /> By Weight
              </>
            ) : (
              <>
                <IconPackage size={12} color="#22C55E" stroke={2.2} /> By Unit
              </>
            )}
          </div>

          {/* Size / Variant Label Tag on Image bottom-left */}
          {product.variantLabel && (
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#22C55E',
                border: '1px solid rgba(34, 197, 94, 0.35)',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                backdropFilter: 'blur(4px)',
                maxWidth: quantityInCart > 0 ? 'calc(100% - 100px)' : 'calc(100% - 16px)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {product.variantLabel}
            </div>
          )}
        </div>

        {/* Product Basic Info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Brand */}
          {product.brand && (
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                letterSpacing: '0.6px',
                fontWeight: 700,
                marginBottom: '2px'
              }}
            >
              {product.brand}
            </span>
          )}

          {/* Product Name */}
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.35,
              marginBottom: '8px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '38px'
            }}
            title={product.name}
          >
            {product.name}
          </h4>

          {/* Price & Expand Indicator Row */}
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '10px',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#22C55E',
                  fontFamily: 'Outfit, sans-serif',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '3px'
                }}
              >
                ₹{product.sellingPrice || product.price}
                {unitType === 'weight' && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                    /{product.weightUnit || `${baseWeightRef}g`}
                  </span>
                )}
              </div>
              {product.price && product.price > (product.sellingPrice || 0) && (
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textDecoration: 'line-through'
                  }}
                >
                  ₹{product.price}
                </div>
              )}
            </div>

            {/* Expand / Collapse Button Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: isExpanded ? 'rgba(34, 197, 94, 0.18)' : 'var(--bg-secondary)',
                color: isExpanded ? '#22C55E' : 'var(--text-secondary)',
                border: isExpanded ? '1px solid #22C55E' : '1px solid var(--border-color)',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                transition: 'all 0.2s ease'
              }}
            >
              <span>{isExpanded ? 'Close' : 'Select'}</span>
              {isExpanded ? (
                <IconChevronUp size={14} stroke={2.5} />
              ) : (
                <IconChevronDown size={14} stroke={2.5} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. EXPANDABLE PRODUCT DETAIL BOX (Inline Accordion below tapped product) */}
      {/* ========================================================================= */}
      <div
        id={accordionId}
        style={{
          maxHeight: isExpanded ? '720px' : '0px',
          opacity: isExpanded ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease',
          backgroundColor: '#141414',
          borderTop: isExpanded ? '1px solid var(--border-color)' : 'none'
        }}
      >
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Multiple Image Preview Thumbnails if available */}
          {imageList.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Views:</span>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
                {imageList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(idx);
                    }}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: activeImageIndex === idx ? '2px solid #22C55E' : '1px solid rgba(255, 255, 255, 0.1)',
                      padding: 0,
                      backgroundColor: '#222',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                    aria-label={`Product image ${idx + 1}`}
                  >
                    <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Description */}
          {product.description && (
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  marginBottom: '4px'
                }}
              >
                About this item
              </div>
              <p
                style={{
                  fontSize: '12.5px',
                  color: '#D1D5DB',
                  lineHeight: 1.45,
                  margin: 0
                }}
              >
                {product.description}
              </p>
            </div>
          )}

          {/* Feature Specs Pills */}
          {product.features && product.features.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {product.features.slice(0, 4).map((feat, idx) => {
                const label = typeof feat === 'string' ? feat : `${feat.label}: ${feat.value}`;
                return (
                  <span
                    key={idx}
                    style={{
                      fontSize: '11px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          )}

          {/* DYNAMIC SELECTOR BASED ON unitType */}
          <div
            style={{
              backgroundColor: '#1E1E1E',
              borderRadius: '14px',
              padding: '12px 14px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* WEIGHT-BASED SELECTOR */}
            {unitType === 'weight' ? (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <IconScale size={14} color="#22C55E" /> Select Weight ({product.weightUnit || 'g'}):
                  </span>
                  <span
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 800,
                      color: '#22C55E',
                      fontFamily: 'Outfit, sans-serif'
                    }}
                  >
                    {selectedWeight >= 1000 ? `${(selectedWeight / 1000).toFixed(1)} kg` : `${selectedWeight}g`}
                  </span>
                </div>

                {/* Weight Options Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {weightOptions.map((wt) => {
                    const isSelected = selectedWeight === wt;
                    const displayLabel = wt >= 1000 ? `${wt / 1000}kg` : `${wt}g`;
                    return (
                      <button
                        key={wt}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWeight(wt);
                        }}
                        style={{
                          backgroundColor: isSelected ? '#22C55E' : '#2A2A2A',
                          color: isSelected ? '#000000' : '#E5E7EB',
                          fontWeight: isSelected ? 800 : 600,
                          fontSize: '11.5px',
                          border: isSelected ? '1px solid #22C55E' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          padding: '5px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {displayLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Weight Stepper */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#121212',
                    borderRadius: '10px',
                    padding: '6px 10px',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Fine-tune:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleDecrement}
                      style={{
                        backgroundColor: '#2A2A2A',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        width: '26px',
                        height: '26px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      aria-label="Decrease weight"
                    >
                      <IconMinus size={12} stroke={2.5} />
                    </button>
                    <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF', minWidth: '45px', textAlign: 'center' }}>
                      {selectedWeight >= 1000 ? `${(selectedWeight / 1000).toFixed(1)}kg` : `${selectedWeight}g`}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      style={{
                        backgroundColor: '#2A2A2A',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        width: '26px',
                        height: '26px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      aria-label="Increase weight"
                    >
                      <IconPlus size={12} stroke={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* COUNT-BASED SELECTOR */
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <IconPackage size={14} color="#22C55E" /> Quantity ({product.unit || 'units'}):
                  </span>
                  <span
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 800,
                      color: '#22C55E',
                      fontFamily: 'Outfit, sans-serif'
                    }}
                  >
                    ×{countQuantity}
                  </span>
                </div>

                {/* Quick Count Pick Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {countOptions.map((opt) => {
                    const isSelected = countQuantity === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCountQuantity(opt);
                        }}
                        style={{
                          backgroundColor: isSelected ? '#22C55E' : '#2A2A2A',
                          color: isSelected ? '#000000' : '#E5E7EB',
                          fontWeight: isSelected ? 800 : 600,
                          fontSize: '11.5px',
                          border: isSelected ? '1px solid #22C55E' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {opt} {opt === 1 ? 'unit' : 'units'}
                      </button>
                    );
                  })}
                </div>

                {/* Count Stepper */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#121212',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <span style={{ fontSize: '12px', color: '#D1D5DB' }}>Units to pack:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={countQuantity <= 1}
                      style={{
                        backgroundColor: countQuantity <= 1 ? '#222' : '#2A2A2A',
                        opacity: countQuantity <= 1 ? 0.35 : 1,
                        border: 'none',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: countQuantity <= 1 ? 'not-allowed' : 'pointer'
                      }}
                      aria-label="Decrease quantity"
                    >
                      <IconMinus size={14} stroke={2.5} />
                    </button>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        minWidth: '28px',
                        textAlign: 'center'
                      }}
                    >
                      {countQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      style={{
                        backgroundColor: '#2A2A2A',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      aria-label="Increase quantity"
                    >
                      <IconPlus size={14} stroke={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add To Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock || isAdding}
            style={{
              width: '100%',
              backgroundColor: justAdded ? '#16A34A' : inStock ? '#22C55E' : '#374151',
              color: inStock ? '#000000' : '#9CA3AF',
              fontWeight: 800,
              fontSize: '13.5px',
              fontFamily: 'Outfit, sans-serif',
              padding: '11px 16px',
              borderRadius: '12px',
              border: 'none',
              cursor: inStock ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: inStock ? '0 4px 16px rgba(34, 197, 94, 0.38)' : 'none',
              transition: 'all 0.18s ease'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              {justAdded ? (
                <>
                  <IconCheck size={17} stroke={3} /> Added to Basket!
                </>
              ) : isAdding ? (
                <>
                  <IconSparkles size={16} stroke={2.2} /> Updating Basket...
                </>
              ) : (
                <>
                  <IconShoppingCart size={16} stroke={2.2} /> Add to Cart
                </>
              )}
            </span>
            <span style={{ fontSize: '14px', fontWeight: 800 }}>
              ₹{calculatedPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

