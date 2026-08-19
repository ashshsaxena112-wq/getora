import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import {
  IconBuildingStore,
  IconPackage,
  IconPlus,
  IconClock,
  IconCircleCheck,
  IconAlertCircle,
  IconTruckDelivery,
  IconPhoto,
  IconCurrencyDollar,
  IconLayersLinked,
  IconEdit,
  IconTrash,
  IconPower,
  IconLoader2
} from '@tabler/icons-react';
import { OrderStatus, Product } from '../types';

export const RetailerDashboardPage: React.FC = () => {
  const {
    retailerProfile,
    categories,
    products,
    retailerOrders,
    toggleStoreStatus,
    createProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    navigate
  } = useGetora();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'add-product'>('orders');

  // New Product Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('20');
  const [unit, setUnit] = useState('pcs');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  if (!retailerProfile) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center', padding: '40px' }}>
        <h2>Retailer Account Required</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Please sign in with a registered retailer account to manage your store.
        </p>
        <button className="btn-primary" onClick={() => navigate('account')} style={{ marginTop: '20px' }}>
          Go to Account / Sign In
        </button>
      </div>
    );
  }

  // Filter products for this retailer
  const shopProducts = products.filter((p) => p.retailerId === retailerProfile.id);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sellingPrice) return;

    setSubmittingProduct(true);
    const ok = await createProduct(
      {
        name: name.trim(),
        categoryId: categoryId || categories[0]?.id,
        brand: brand.trim() || undefined,
        description: description.trim() || undefined,
        price: Number(price || sellingPrice),
        sellingPrice: Number(sellingPrice),
        stockQuantity: Number(stockQuantity || 0),
        unit
      },
      imageFile || undefined
    );

    setSubmittingProduct(false);

    if (ok) {
      setName('');
      setBrand('');
      setDescription('');
      setPrice('');
      setSellingPrice('');
      setImageFile(null);
      setImagePreview(null);
      setActiveTab('inventory');
    }
  };

  return (
    <div className="retailer-dashboard-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Top Banner / Store Header */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '16px',
                backgroundColor: '#22C55E',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconBuildingStore size={34} stroke={1.8} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                  {retailerProfile.shopName}
                </h1>
                <span
                  style={{
                    backgroundColor: retailerProfile.isOpen ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: retailerProfile.isOpen ? '#22C55E' : '#EF4444',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px'
                  }}
                >
                  {retailerProfile.isOpen ? 'OPEN FOR ORDERS' : 'STORE CLOSED'}
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                Owner: {retailerProfile.ownerName} • {retailerProfile.city || 'Local Neighborhood'}
              </div>
            </div>
          </div>

          {/* Open / Close Toggle Button */}
          <button
            onClick={() => toggleStoreStatus(!retailerProfile.isOpen)}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: retailerProfile.isOpen ? '1px solid #EF4444' : '1px solid #22C55E',
              backgroundColor: retailerProfile.isOpen ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)',
              color: retailerProfile.isOpen ? '#EF4444' : '#22C55E',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <IconPower size={16} stroke={1.8} />
            {retailerProfile.isOpen ? 'Close Store for Today' : 'Open Store for Orders'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="filters-row" style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
        <button
          className={`filter-chip ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <IconClock size={15} stroke={1.8} /> Incoming Orders ({retailerOrders.length})
        </button>

        <button
          className={`filter-chip ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <IconPackage size={15} stroke={1.8} /> Shop Products ({shopProducts.length})
        </button>

        <button
          className={`filter-chip ${activeTab === 'add-product' ? 'active' : ''}`}
          onClick={() => setActiveTab('add-product')}
        >
          <IconPlus size={15} stroke={1.8} /> Add New Product
        </button>
      </div>

      {/* TAB 1: Real Orders Management */}
      {activeTab === 'orders' && (
        <div>
          {retailerOrders.length === 0 ? (
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '60px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
              <IconClock size={44} stroke={1.8} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 700 }}>No Orders Received Yet</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                When customers order products from your shop, they will appear here in real-time.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {retailerOrders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '20px',
                    padding: '24px',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#22C55E', fontFamily: 'monospace' }}>
                        Order #{ord.orderNumber}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Placed on {new Date(ord.placedAt || ord.createdAt || new Date()).toLocaleTimeString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.15)',
                          color: '#22C55E',
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          textTransform: 'uppercase'
                        }}
                      >
                        Status: {(ord.orderStatus || ord.status || 'placed').replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {ord.items?.map((it) => (
                        <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                          <span>{it.productName} × {it.quantity}</span>
                          <span style={{ fontWeight: 600 }}>₹{it.totalPrice}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Transition Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                    {ord.orderStatus === 'placed' && (
                      <button
                        className="btn-primary"
                        onClick={() => updateOrderStatus(ord.id, 'accepted')}
                        style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
                      >
                        ✓ Accept Order
                      </button>
                    )}

                    {ord.orderStatus === 'accepted' && (
                      <button
                        className="btn-primary"
                        onClick={() => updateOrderStatus(ord.id, 'preparing')}
                        style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
                      >
                        📦 Start Packing
                      </button>
                    )}

                    {ord.orderStatus === 'preparing' && (
                      <button
                        className="btn-primary"
                        onClick={() => updateOrderStatus(ord.id, 'ready_for_pickup')}
                        style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
                      >
                        ⚡ Mark Ready for Rider
                      </button>
                    )}

                    {ord.orderStatus === 'ready_for_pickup' && (
                      <button
                        className="btn-primary"
                        onClick={() => updateOrderStatus(ord.id, 'picked_up')}
                        style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
                      >
                        🛵 Handed to Rider
                      </button>
                    )}

                    {ord.orderStatus === 'picked_up' && (
                      <button
                        className="btn-primary"
                        onClick={() => updateOrderStatus(ord.id, 'delivered')}
                        style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
                      >
                        ✓ Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Inventory Management */}
      {activeTab === 'inventory' && (
        <div>
          {shopProducts.length === 0 ? (
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '60px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
              <IconPackage size={44} stroke={1.8} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 700 }}>No Products in Catalog</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
                Add your hardware, electrical, or tech inventory to start receiving orders.
              </p>
              <button className="btn-primary" onClick={() => setActiveTab('add-product')} style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px' }}>
                + Add First Product
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {shopProducts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <div>
                    <div style={{ width: '100%', height: '140px', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                      <img
                        src={p.imageUrl || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=80'}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{p.name}</h4>
                    <div style={{ fontSize: '13px', color: '#22C55E', fontWeight: 700, marginBottom: '6px' }}>
                      ₹{p.sellingPrice} <span style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{p.price}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Stock Quantity: <strong>{p.stockQuantity}</strong> {p.unit}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                      title="Delete Product"
                    >
                      <IconTrash size={16} stroke={1.8} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Add New Product Form */}
      {activeTab === 'add-product' && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '720px',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '20px' }}>
            List New Product in Store
          </h2>

          <form onSubmit={handleCreateProduct}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Product Title *</label>
              <input
                type="text"
                placeholder="e.g. 10mm Impact Drill Machine"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 14px', color: 'var(--text-primary)', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 14px', color: 'var(--text-primary)', fontSize: '14px' }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Brand / Manufacturer</label>
                <input
                  type="text"
                  placeholder="e.g. Bosch, Philips, Havells"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 14px', color: 'var(--text-primary)', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>MRP (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1999"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 14px', color: 'var(--text-primary)', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Selling Price (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 1499"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  required
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 14px', color: '#22C55E', fontWeight: 700, fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Available Stock</label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 14px', color: 'var(--text-primary)', fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Photo Upload to Supabase Storage */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Upload Product Photo (Supabase Storage: product-images)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '12px',
                  padding: '12px',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />
              {imagePreview && (
                <div style={{ marginTop: '10px', width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Product Description</label>
              <textarea
                rows={3}
                placeholder="Product specs, warranty, features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 14px', color: 'var(--text-primary)', fontSize: '13px' }}
              />
            </div>

            <button
              type="submit"
              disabled={submittingProduct}
              className="btn-primary"
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
              {submittingProduct ? <IconLoader2 size={18} stroke={1.8} className="spin" /> : 'Publish Product to Live Store'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
