import React, { useState, useMemo } from 'react';
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
  IconLoader2,
  IconSearch,
  IconBolt,
  IconSparkles,
  IconCheck,
  IconX,
  IconTag,
  IconFilter,
  IconSend,
  IconInfoCircle,
  IconCategory
} from '@tabler/icons-react';
import { OrderStatus, Product, MasterProduct } from '../types';

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
    navigate,
    masterCatalog,
    productRequests,
    addMasterProductToShop,
    updateRetailerProductPriceStock,
    requestNewProduct,
    isMasterProductInShop
  } = useGetora();

  // Tab states: 'master-catalog' (default) | 'inventory' | 'requests' | 'orders' | 'custom-product'
  const [activeTab, setActiveTab] = useState<'master-catalog' | 'inventory' | 'requests' | 'orders' | 'custom-product'>('master-catalog');

  // Master Catalog Filter & Search States
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string>('all');

  // Add / Edit from Master Catalog Modal State
  const [selectedMasterProduct, setSelectedMasterProduct] = useState<MasterProduct | null>(null);
  const [modalSellingPrice, setModalSellingPrice] = useState<string>('');
  const [modalMrp, setModalMrp] = useState<string>('');
  const [modalStock, setModalStock] = useState<string>('20');
  const [modalUnit, setModalUnit] = useState<string>('');
  const [isModalEditMode, setIsModalEditMode] = useState<boolean>(false);
  const [editingShopProductId, setEditingShopProductId] = useState<string | null>(null);
  const [isSubmittingShopAdd, setIsSubmittingShopAdd] = useState<boolean>(false);

  // Request Product Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [reqName, setReqName] = useState('');
  const [reqBrand, setReqBrand] = useState('');
  const [reqCategoryId, setReqCategoryId] = useState(categories[0]?.id || 'cat-electrical');
  const [reqExpectedPrice, setReqExpectedPrice] = useState('');
  const [reqUnit, setReqUnit] = useState('1 pc');
  const [reqNotes, setReqNotes] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // Shop Inventory Filter State
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  // Custom Product Form State (Fallback)
  const [customName, setCustomName] = useState('');
  const [customCategoryId, setCustomCategoryId] = useState(categories[0]?.id || '');
  const [customBrand, setCustomBrand] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customSellingPrice, setCustomSellingPrice] = useState('');
  const [customStockQuantity, setCustomStockQuantity] = useState('20');
  const [customUnit, setCustomUnit] = useState('pcs');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submittingCustomProduct, setSubmittingCustomProduct] = useState(false);

  // Effective retailer ID
  const currentRetailerId = retailerProfile?.id || 'store-voltix';

  // Products belonging to this retailer
  const shopProducts = useMemo(() => {
    return products.filter((p) => p.retailerId === currentRetailerId);
  }, [products, currentRetailerId]);

  // Filtered Master Catalog
  const filteredMasterCatalog = useMemo(() => {
    return masterCatalog.filter((item) => {
      const matchCat =
        selectedCatalogCategory === 'all' ||
        item.categoryId === selectedCatalogCategory ||
        item.categoryName?.toLowerCase() === selectedCatalogCategory.toLowerCase();

      const matchSearch =
        !catalogSearch.trim() ||
        item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        item.brand.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        item.categoryName?.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        item.sku?.toLowerCase().includes(catalogSearch.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [masterCatalog, selectedCatalogCategory, catalogSearch]);

  // Filtered Shop Products
  const filteredShopProducts = useMemo(() => {
    return shopProducts.filter((p) => {
      const matchSearch =
        !inventorySearch.trim() ||
        p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        p.brand?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        p.categoryName?.toLowerCase().includes(inventorySearch.toLowerCase());

      const inStock = p.isAvailable && p.stockQuantity > 0;
      if (inventoryFilter === 'in_stock') return matchSearch && inStock;
      if (inventoryFilter === 'out_of_stock') return matchSearch && !inStock;
      return matchSearch;
    });
  }, [shopProducts, inventorySearch, inventoryFilter]);

  // Inventory Summary Stats
  const totalListed = shopProducts.length;
  const inStockCount = shopProducts.filter((p) => p.isAvailable && p.stockQuantity > 0).length;
  const outOfStockCount = totalListed - inStockCount;
  const totalUnits = shopProducts.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);

  // Open 1-Click Add / Edit Modal for Master Product
  const handleOpenAddModal = (masterProduct: MasterProduct) => {
    const { inShop, product } = isMasterProductInShop(masterProduct.id, currentRetailerId);
    setSelectedMasterProduct(masterProduct);

    if (inShop && product) {
      // Existing product edit mode (Duplicate prevention)
      setIsModalEditMode(true);
      setEditingShopProductId(product.id);
      setModalSellingPrice(String(product.sellingPrice));
      setModalMrp(String(product.price || masterProduct.suggestedPrice));
      setModalStock(String(product.stockQuantity));
      setModalUnit(product.unit || masterProduct.unit);
    } else {
      // New addition mode
      setIsModalEditMode(false);
      setEditingShopProductId(null);
      setModalSellingPrice(String(masterProduct.suggestedSellingPrice));
      setModalMrp(String(masterProduct.suggestedPrice));
      setModalStock('25');
      setModalUnit(masterProduct.unit);
    }
  };

  // Open Edit Modal from Shop Inventory
  const handleOpenEditShopProduct = (product: Product) => {
    const matchedMaster = masterCatalog.find((m) => m.id === product.masterProductId || m.name.toLowerCase() === product.name.toLowerCase());
    
    setSelectedMasterProduct(
      matchedMaster || {
        id: product.masterProductId || product.id,
        name: product.name,
        brand: product.brand || 'Local Brand',
        categoryId: product.categoryId || 'cat-electrical',
        categoryName: product.categoryName || 'General',
        description: product.description || '',
        suggestedPrice: product.price,
        suggestedSellingPrice: product.sellingPrice,
        unit: product.unit || '1 pc',
        imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=80'
      }
    );
    setIsModalEditMode(true);
    setEditingShopProductId(product.id);
    setModalSellingPrice(String(product.sellingPrice));
    setModalMrp(String(product.price));
    setModalStock(String(product.stockQuantity));
    setModalUnit(product.unit || '1 pc');
  };

  // Save Product to Shop (1-Click)
  const handleSaveToShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMasterProduct || !modalSellingPrice) return;

    setIsSubmittingShopAdd(true);
    const sellingPriceNum = Number(modalSellingPrice);
    const mrpNum = Number(modalMrp || modalSellingPrice);
    const stockNum = Number(modalStock || 0);

    if (isModalEditMode && editingShopProductId) {
      await updateRetailerProductPriceStock(editingShopProductId, {
        sellingPrice: sellingPriceNum,
        price: mrpNum,
        stockQuantity: stockNum,
        isAvailable: stockNum > 0
      });
    } else {
      await addMasterProductToShop(selectedMasterProduct, {
        sellingPrice: sellingPriceNum,
        price: mrpNum,
        stockQuantity: stockNum,
        unit: modalUnit || selectedMasterProduct.unit
      });
    }

    setIsSubmittingShopAdd(false);
    setSelectedMasterProduct(null);
  };

  // Submit Product Request
  const handleSubmitProductRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim()) return;

    setIsSubmittingRequest(true);
    await requestNewProduct({
      name: reqName.trim(),
      brand: reqBrand.trim() || undefined,
      categoryId: reqCategoryId,
      expectedPrice: reqExpectedPrice ? Number(reqExpectedPrice) : undefined,
      unit: reqUnit || '1 pc',
      notes: reqNotes.trim() || undefined
    });

    setIsSubmittingRequest(false);
    setIsRequestModalOpen(false);
    setReqName('');
    setReqBrand('');
    setReqExpectedPrice('');
    setReqNotes('');
    setActiveTab('requests');
  };

  // Handle Custom Fallback Product Creation
  const handleCreateCustomProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customSellingPrice) return;

    setSubmittingCustomProduct(true);
    const ok = await createProduct(
      {
        name: customName.trim(),
        categoryId: customCategoryId || categories[0]?.id,
        brand: customBrand.trim() || undefined,
        description: customDescription.trim() || undefined,
        price: Number(customPrice || customSellingPrice),
        sellingPrice: Number(customSellingPrice),
        stockQuantity: Number(customStockQuantity || 0),
        unit: customUnit
      },
      imageFile || undefined
    );

    setSubmittingCustomProduct(false);

    if (ok) {
      setCustomName('');
      setCustomBrand('');
      setCustomDescription('');
      setCustomPrice('');
      setCustomSellingPrice('');
      setImageFile(null);
      setImagePreview(null);
      setActiveTab('inventory');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Quick Open Request Modal with search term prefilled
  const handleOpenRequestWithSearch = () => {
    setReqName(catalogSearch.trim());
    setIsRequestModalOpen(true);
  };

  return (
    <div className="retailer-dashboard-page" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px 64px' }}>
      
      {/* ======================================================================= */}
      {/* 1. STORE HEADER & STATUS BANNER                                         */}
      {/* ======================================================================= */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '14px',
                backgroundColor: 'var(--primary-green)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
              }}
            >
              <IconBuildingStore size={32} stroke={1.8} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                  {retailerProfile?.shopName || 'Voltix Electricals & Hardware'}
                </h1>
                <span
                  style={{
                    backgroundColor: (retailerProfile?.isOpen ?? true) ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: (retailerProfile?.isOpen ?? true) ? '#22C55E' : '#EF4444',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    letterSpacing: '0.04em'
                  }}
                >
                  {(retailerProfile?.isOpen ?? true) ? '● LIVE & ACCEPTING ORDERS' : '● STORE PAUSED'}
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                Retailer ID: <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{currentRetailerId}</span> • {shopProducts.length} items listed in your shop
              </div>
            </div>
          </div>

          {/* Quick Actions Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              style={{
                padding: '10px 16px',
                borderRadius: '9999px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <IconSend size={15} stroke={1.8} color="#22C55E" />
              + Request New Product
            </button>

            {retailerProfile && (
              <button
                onClick={() => toggleStoreStatus(!retailerProfile.isOpen)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '9999px',
                  border: retailerProfile.isOpen ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(34, 197, 94, 0.4)',
                  backgroundColor: retailerProfile.isOpen ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  color: retailerProfile.isOpen ? '#EF4444' : '#22C55E',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <IconPower size={15} stroke={1.8} />
                {retailerProfile.isOpen ? 'Pause Store' : 'Open Store'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 2. TAB CONTROLS                                                         */}
      {/* ======================================================================= */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('master-catalog')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '9999px',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTab === 'master-catalog' ? '1px solid #22C55E' : '1px solid var(--border-color)',
            backgroundColor: activeTab === 'master-catalog' ? 'var(--primary-green)' : 'var(--bg-card)',
            color: activeTab === 'master-catalog' ? '#FFFFFF' : 'var(--text-primary)',
            boxShadow: activeTab === 'master-catalog' ? '0 4px 14px rgba(34, 197, 94, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <IconBolt size={16} stroke={2} />
          Add from Master Catalog
          <span
            style={{
              fontSize: '11px',
              padding: '2px 7px',
              borderRadius: '9999px',
              backgroundColor: activeTab === 'master-catalog' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(34, 197, 94, 0.15)',
              color: activeTab === 'master-catalog' ? '#FFFFFF' : '#22C55E',
              fontWeight: 800
            }}
          >
            {masterCatalog.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '9999px',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTab === 'inventory' ? '1px solid #22C55E' : '1px solid var(--border-color)',
            backgroundColor: activeTab === 'inventory' ? 'var(--primary-green)' : 'var(--bg-card)',
            color: activeTab === 'inventory' ? '#FFFFFF' : 'var(--text-primary)',
            boxShadow: activeTab === 'inventory' ? '0 4px 14px rgba(34, 197, 94, 0.3)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <IconPackage size={16} stroke={2} />
          My Shop Products
          <span
            style={{
              fontSize: '11px',
              padding: '2px 7px',
              borderRadius: '9999px',
              backgroundColor: activeTab === 'inventory' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(34, 197, 94, 0.15)',
              color: activeTab === 'inventory' ? '#FFFFFF' : '#22C55E',
              fontWeight: 800
            }}
          >
            {shopProducts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '9999px',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: 'pointer',
            border: activeTab === 'requests' ? '1px solid #22C55E' : '1px solid var(--border-color)',
            backgroundColor: activeTab === 'requests' ? 'var(--primary-green)' : 'var(--bg-card)',
            color: activeTab === 'requests' ? '#FFFFFF' : 'var(--text-primary)',
            boxShadow: activeTab === 'requests' ? '0 4px 14px rgba(34, 197, 94, 0.3)' : 'none'
          }}
        >
          <IconSend size={15} stroke={1.8} />
          Requested Products ({productRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '9999px',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: 'pointer',
            border: activeTab === 'orders' ? '1px solid #22C55E' : '1px solid var(--border-color)',
            backgroundColor: activeTab === 'orders' ? 'var(--primary-green)' : 'var(--bg-card)',
            color: activeTab === 'orders' ? '#FFFFFF' : 'var(--text-primary)',
            boxShadow: activeTab === 'orders' ? '0 4px 14px rgba(34, 197, 94, 0.3)' : 'none'
          }}
        >
          <IconClock size={15} stroke={1.8} />
          Orders ({retailerOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('custom-product')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 16px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px dashed var(--border-color)',
            backgroundColor: activeTab === 'custom-product' ? 'var(--bg-elevated)' : 'transparent',
            color: 'var(--text-muted)',
            marginLeft: 'auto'
          }}
          title="Manual fallback for unlisted custom items"
        >
          <IconPlus size={14} stroke={2} />
          Custom Item
        </button>
      </div>

      {/* ======================================================================= */}
      {/* TAB 1: GETORA PRE-BUILT MASTER CATALOG (1-CLICK PRODUCT ADDING)         */}
      {/* ======================================================================= */}
      {activeTab === 'master-catalog' && (
        <div>
          {/* Hero Value Explainer Box */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ maxWidth: '780px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ color: '#22C55E', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  ⚡ GETORA PRE-BUILT MASTER CATALOG
                </span>
                <span style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                  NO MANUAL TYPING OR PHOTO UPLOADS
                </span>
              </div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Select Products → Set Your Price & Stock → Start Selling
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Browse verified products with official photos, specs and descriptions. When you add a product, only your custom selling price and available quantity are saved to your shop.
              </p>
            </div>

            <button
              onClick={() => setIsRequestModalOpen(true)}
              style={{
                padding: '10px 18px',
                borderRadius: '9999px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: '#22C55E',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <IconPlus size={16} stroke={2} /> Can't find a product? Request it
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '9999px',
                padding: '8px 16px',
                maxWidth: '620px',
                width: '100%',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)'
              }}
            >
              <IconSearch size={18} stroke={1.8} color="#22C55E" style={{ marginRight: '10px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search master catalog (e.g. Philips bulb, Havells wire, Bosch drill, boAt, Fortune...)"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              />
              {catalogSearch && (
                <button
                  onClick={() => setCatalogSearch('')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <IconX size={16} stroke={2} />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
              <button
                onClick={() => setSelectedCatalogCategory('all')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: selectedCatalogCategory === 'all' ? '1px solid #22C55E' : '1px solid var(--border-color)',
                  backgroundColor: selectedCatalogCategory === 'all' ? 'var(--bg-elevated)' : 'var(--bg-card)',
                  color: selectedCatalogCategory === 'all' ? '#22C55E' : 'var(--text-secondary)'
                }}
              >
                All Categories ({masterCatalog.length})
              </button>

              {categories.map((c) => {
                const countInCat = masterCatalog.filter((m) => m.categoryId === c.id || m.categoryName?.toLowerCase() === c.name.toLowerCase()).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCatalogCategory(c.id)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '9999px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      border: selectedCatalogCategory === c.id ? '1px solid #22C55E' : '1px solid var(--border-color)',
                      backgroundColor: selectedCatalogCategory === c.id ? 'var(--bg-elevated)' : 'var(--bg-card)',
                      color: selectedCatalogCategory === c.id ? '#22C55E' : 'var(--text-secondary)'
                    }}
                  >
                    {c.name} ({countInCat})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Master Catalog Grid */}
          {filteredMasterCatalog.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <IconSearch size={40} stroke={1.8} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '17px', color: 'var(--text-primary)', fontWeight: 700 }}>
                No master product matching "{catalogSearch}"
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '18px' }}>
                You can submit a quick request for GETORA team to add this product to the master catalog.
              </p>
              <button
                className="btn-primary"
                onClick={handleOpenRequestWithSearch}
                style={{ padding: '10px 22px', borderRadius: '9999px', fontSize: '13.5px' }}
              >
                + Request "{catalogSearch}" to be Added
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
              {filteredMasterCatalog.map((masterItem) => {
                const { inShop, product: shopProd } = isMasterProductInShop(masterItem.id, currentRetailerId);

                return (
                  <div
                    key={masterItem.id}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: inShop ? '1.5px solid #22C55E' : '1px solid var(--border-color)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: inShop ? '0 4px 16px rgba(34, 197, 94, 0.15)' : 'var(--shadow-card)',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Image Block */}
                    <div style={{ width: '100%', height: '150px', backgroundColor: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={masterItem.imageUrl}
                        alt={masterItem.name}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />

                      {/* Brand Pill */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.75)',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        {masterItem.brand}
                      </div>

                      {/* In-Shop Status Badge */}
                      {inShop && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: '#22C55E',
                            color: '#FFFFFF',
                            fontSize: '10.5px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
                          }}
                        >
                          <IconCheck size={12} stroke={3} /> In Your Shop
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {masterItem.categoryName} • {masterItem.unit}
                          </span>
                        </div>

                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            lineHeight: 1.35,
                            marginBottom: '8px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                          title={masterItem.name}
                        >
                          {masterItem.name}
                        </h4>

                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                          Suggested MRP: <span style={{ textDecoration: 'line-through' }}>₹{masterItem.suggestedPrice}</span> • Selling at ~₹{masterItem.suggestedSellingPrice}
                        </div>
                      </div>

                      {/* Bottom Action Row (Duplicate Prevention & 1-Click Adding) */}
                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', marginTop: 'auto' }}>
                        {inShop && shopProd ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Your Listing:</div>
                              <div style={{ fontSize: '14px', fontWeight: 800, color: '#22C55E', fontFamily: 'Outfit' }}>
                                ₹{shopProd.sellingPrice} <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>({shopProd.stockQuantity} in stock)</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleOpenAddModal(masterItem)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '9999px',
                                border: '1px solid #22C55E',
                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                color: '#22C55E',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <IconEdit size={13} stroke={2} /> Edit Price/Stock
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenAddModal(masterItem)}
                            style={{
                              width: '100%',
                              padding: '8px 16px',
                              borderRadius: '9999px',
                              border: 'none',
                              backgroundColor: 'var(--primary-green)',
                              color: '#FFFFFF',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.25)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <IconPlus size={15} stroke={2.5} /> Add to My Shop
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 2: MY SHOP PRODUCTS (INVENTORY MANAGEMENT)                          */}
      {/* ======================================================================= */}
      {activeTab === 'inventory' && (
        <div>
          {/* Summary Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Listed in Shop</div>
              <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>{totalListed}</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>In-Stock Items</div>
              <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit', color: '#22C55E' }}>{inStockCount}</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Out of Stock</div>
              <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit', color: outOfStockCount > 0 ? '#EF4444' : 'var(--text-muted)' }}>
                {outOfStockCount}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Inventory Units</div>
              <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>{totalUnits}</div>
            </div>
          </div>

          {/* Shop Inventory Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {/* Search */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '9999px',
                padding: '6px 14px',
                maxWidth: '400px',
                width: '100%'
              }}
            >
              <IconSearch size={16} stroke={1.8} color="#22C55E" style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Filter your shop products..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '13px' }}
              />
            </div>

            {/* Quick CTAs */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('master-catalog')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: 'var(--primary-green)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.25)'
                }}
              >
                <IconBolt size={15} stroke={2} /> + Add Products from Master Catalog
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {shopProducts.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '60px 24px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <IconPackage size={48} stroke={1.5} color="#22C55E" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 800 }}>Your Shop Has No Products Yet</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '520px', margin: '6px auto 20px' }}>
                Quickly add Philips bulbs, Havells wires, tools, groceries and audio accessories in 1-click from the GETORA Master Catalog!
              </p>
              <button
                className="btn-primary"
                onClick={() => setActiveTab('master-catalog')}
                style={{ padding: '12px 28px', borderRadius: '9999px', fontSize: '14px', fontWeight: 700 }}
              >
                <IconBolt size={16} stroke={2} /> Open Master Catalog & Add Products
              </button>
            </div>
          ) : filteredShopProducts.length === 0 ? (
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
              <IconSearch size={32} stroke={1.8} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No shop products match your filter.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filteredShopProducts.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <div>
                    <div style={{ width: '100%', height: '140px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                      <img
                        src={prod.imageUrl || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop&q=80'}
                        alt={prod.name}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {prod.brand || 'Brand'} • {prod.unit || '1 pc'}
                      </span>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: prod.isAvailable && prod.stockQuantity > 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: prod.isAvailable && prod.stockQuantity > 0 ? '#22C55E' : '#EF4444'
                        }}
                      >
                        {prod.isAvailable && prod.stockQuantity > 0 ? `${prod.stockQuantity} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    <h4
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        lineHeight: 1.35,
                        marginBottom: '8px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                      title={prod.name}
                    >
                      {prod.name}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '17px', fontWeight: 800, color: '#22C55E', fontFamily: 'Outfit' }}>
                        ₹{prod.sellingPrice}
                      </span>
                      {prod.price > prod.sellingPrice && (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          ₹{prod.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Item Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => handleOpenEditShopProduct(prod)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <IconEdit size={13} stroke={2} /> Edit Price/Stock
                    </button>

                    <button
                      onClick={() => deleteProduct(prod.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '6px'
                      }}
                      title="Remove from shop"
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

      {/* ======================================================================= */}
      {/* TAB 3: REQUESTED PRODUCTS                                               */}
      {/* ======================================================================= */}
      {activeTab === 'requests' && (
        <div style={{ maxWidth: '840px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Your Product Requests
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Items submitted to GETORA catalog team for review and approval.
              </p>
            </div>

            <button
              className="btn-primary"
              onClick={() => setIsRequestModalOpen(true)}
              style={{ padding: '8px 18px', borderRadius: '9999px', fontSize: '13px' }}
            >
              + Request Another Product
            </button>
          </div>

          {productRequests.length === 0 ? (
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '48px 24px', textAlign: 'center' }}>
              <IconSend size={36} stroke={1.8} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 700 }}>No Pending Requests</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
                If you sell items not currently in the Master Catalog, submit a request and we'll add them with official photos and specs!
              </p>
              <button
                className="btn-primary"
                onClick={() => setIsRequestModalOpen(true)}
                style={{ padding: '10px 20px', borderRadius: '9999px', fontSize: '13px' }}
              >
                + Request a Product
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {productRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{req.name}</h4>
                      {req.brand && (
                        <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                          {req.brand}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      Category: {req.categoryName || req.categoryId} • Unit: {req.unit || '1 pc'} {req.expectedPrice ? `• Expected MRP: ₹${req.expectedPrice}` : ''}
                    </div>
                    {req.notes && (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                        "{req.notes}"
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        backgroundColor: req.status === 'approved' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                        color: req.status === 'approved' ? '#22C55E' : '#EAB308',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {req.status === 'approved' ? '✓ Approved & Added' : '⏳ Pending Review'}
                    </span>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 4: ORDERS MANAGEMENT                                                */}
      {/* ======================================================================= */}
      {activeTab === 'orders' && (
        <div>
          {retailerOrders.length === 0 ? (
            <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '60px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
              <IconClock size={44} stroke={1.8} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 700 }}>No Orders Received Yet</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                When customers order products from your shop, they will appear here in real-time.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {retailerOrders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: 'var(--shadow-card)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#22C55E', fontFamily: 'monospace' }}>
                        Order #{ord.orderNumber}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Placed on {new Date(ord.placedAt || ord.createdAt || new Date()).toLocaleTimeString()}
                      </div>
                    </div>

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
                      {(ord.orderStatus || ord.status || 'placed').replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div style={{ marginBottom: '14px', fontSize: '13px' }}>
                    {ord.items?.map((it) => (
                      <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                        <span>{it.productName} × {it.quantity}</span>
                        <span style={{ fontWeight: 600 }}>₹{it.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    {ord.orderStatus === 'placed' && (
                      <button className="btn-primary" onClick={() => updateOrderStatus(ord.id, 'accepted')} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}>
                        ✓ Accept Order
                      </button>
                    )}
                    {ord.orderStatus === 'accepted' && (
                      <button className="btn-primary" onClick={() => updateOrderStatus(ord.id, 'preparing')} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}>
                        📦 Start Packing
                      </button>
                    )}
                    {ord.orderStatus === 'preparing' && (
                      <button className="btn-primary" onClick={() => updateOrderStatus(ord.id, 'ready_for_pickup')} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}>
                        ⚡ Mark Ready for Rider
                      </button>
                    )}
                    {ord.orderStatus === 'ready_for_pickup' && (
                      <button className="btn-primary" onClick={() => updateOrderStatus(ord.id, 'picked_up')} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}>
                        🛵 Handed to Rider
                      </button>
                    )}
                    {ord.orderStatus === 'picked_up' && (
                      <button className="btn-primary" onClick={() => updateOrderStatus(ord.id, 'delivered')} style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12.5px' }}>
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

      {/* ======================================================================= */}
      {/* TAB 5: CUSTOM PRODUCT (MANUAL FALLBACK)                                 */}
      {/* ======================================================================= */}
      {activeTab === 'custom-product' && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '28px',
            maxWidth: '680px',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
              FALLBACK OPTION
            </span>
          </div>
          <h2 style={{ fontSize: '19px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '4px' }}>
            List Custom Handmade / Unlisted Product
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            For standard branded products (Philips, Havells, Bosch, boAt, etc.), use the <strong>Master Catalog</strong> instead to avoid manual typing.
          </p>

          <form onSubmit={handleCreateCustomProduct}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Product Title *</label>
              <input
                type="text"
                placeholder="e.g. Custom Brass Nameplate / Handmade item"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
                style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '13.5px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Category *</label>
                <select
                  value={customCategoryId}
                  onChange={(e) => setCustomCategoryId(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Brand (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Local Craft"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>MRP (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Selling Price (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 399"
                  value={customSellingPrice}
                  onChange={(e) => setCustomSellingPrice(e.target.value)}
                  required
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 14px', color: '#22C55E', fontWeight: 700, fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Stock Quantity</label>
                <input
                  type="number"
                  value={customStockQuantity}
                  onChange={(e) => setCustomStockQuantity(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Upload Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px dashed var(--border-color)', borderRadius: '10px', padding: '10px', color: 'var(--text-primary)', fontSize: '12.5px' }}
              />
              {imagePreview && (
                <div style={{ marginTop: '8px', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submittingCustomProduct}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: 700 }}
            >
              {submittingCustomProduct ? <IconLoader2 size={16} stroke={2} className="spin" /> : 'Publish Custom Item'}
            </button>
          </form>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. MODAL: 1-CLICK ADD / EDIT MASTER PRODUCT TO SHOP                      */}
      {/* ======================================================================= */}
      {selectedMasterProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 2000
          }}
          onClick={() => setSelectedMasterProduct(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span style={{ color: '#22C55E', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {isModalEditMode ? 'EDIT SHOP LISTING' : '1-CLICK PRODUCT ADDING'}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {isModalEditMode ? 'Update Price & Stock' : 'Add to My Shop'}
                </h3>
              </div>

              <button
                onClick={() => setSelectedMasterProduct(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <IconX size={20} stroke={2} />
              </button>
            </div>

            {/* Master Product Summary Preview */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '20px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--bg-card)' }}>
                <img src={selectedMasterProduct.imageUrl} alt={selectedMasterProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700 }}>{selectedMasterProduct.brand} • {selectedMasterProduct.categoryName}</div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginTop: '2px' }}>
                  {selectedMasterProduct.name}
                </h4>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Unit: {selectedMasterProduct.unit} {selectedMasterProduct.suggestedPrice ? `• Suggested MRP: ₹${selectedMasterProduct.suggestedPrice}` : ''}
                </div>
              </div>
            </div>

            {/* Price & Stock Input Form */}
            <form onSubmit={handleSaveToShop}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                    Your Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={modalSellingPrice}
                    onChange={(e) => setModalSellingPrice(e.target.value)}
                    required
                    autoFocus
                    placeholder="e.g. 120"
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-input)',
                      border: '1.5px solid #22C55E',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#22C55E',
                      fontSize: '16px',
                      fontWeight: 800,
                      outline: 'none',
                      fontFamily: 'Outfit'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', display: 'block' }}>
                    Price customers will pay
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    MRP Printed (₹)
                  </label>
                  <input
                    type="number"
                    value={modalMrp}
                    onChange={(e) => setModalMrp(e.target.value)}
                    placeholder="e.g. 199"
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', display: 'block' }}>
                    Printed box maximum price
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                    Stock / Quantity Available *
                  </label>
                  <input
                    type="number"
                    value={modalStock}
                    onChange={(e) => setModalStock(e.target.value)}
                    required
                    min="0"
                    placeholder="e.g. 20"
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Unit / Packing
                  </label>
                  <input
                    type="text"
                    value={modalUnit}
                    onChange={(e) => setModalUnit(e.target.value)}
                    placeholder="e.g. Pack of 1"
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Discount / Savings Preview */}
              {Number(modalMrp) > Number(modalSellingPrice) && Number(modalSellingPrice) > 0 && (
                <div
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: '#22C55E',
                    fontWeight: 600,
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <IconTag size={15} stroke={2} />
                  Customers save ₹{Number(modalMrp) - Number(modalSellingPrice)} (
                  {Math.round(((Number(modalMrp) - Number(modalSellingPrice)) / Number(modalMrp)) * 100)}% OFF) on MRP
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedMasterProduct(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '9999px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingShopAdd}
                  className="btn-primary"
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {isSubmittingShopAdd ? (
                    <IconLoader2 size={16} stroke={2} className="spin" />
                  ) : (
                    <>
                      <IconCheck size={16} stroke={2.5} />
                      {isModalEditMode ? 'Update Price & Stock' : '✓ Save to My Shop'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. MODAL: REQUEST NEW MASTER PRODUCT TO GETORA TEAM                      */}
      {/* ======================================================================= */}
      {isRequestModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 2000
          }}
          onClick={() => setIsRequestModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ color: '#22C55E', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                  CATALOG EXPANSION
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Request New Master Product
                </h3>
              </div>

              <button
                onClick={() => setIsRequestModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <IconX size={20} stroke={2} />
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Tell us which product you want to sell. GETORA catalog team will verify it and add high-resolution photos and specifications to the master catalog.
            </p>

            <form onSubmit={handleSubmitProductRequest}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '5px' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Havells 20W LED Batten Light / Stanley Screwdriver"
                  value={reqName}
                  onChange={(e) => setReqName(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Havells, Bosch, Philips"
                    value={reqBrand}
                    onChange={(e) => setReqBrand(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    Category *
                  </label>
                  <select
                    value={reqCategoryId}
                    onChange={(e) => setReqCategoryId(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} style={{ backgroundColor: 'var(--bg-card)' }}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    Expected MRP (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 299"
                    value={reqExpectedPrice}
                    onChange={(e) => setReqExpectedPrice(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    Unit / Pack Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 pc / Pack of 4"
                    value={reqUnit}
                    onChange={(e) => setReqUnit(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Model number, color variant, or specific wattage..."
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '9999px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingRequest}
                  className="btn-primary"
                  style={{
                    flex: 2,
                    padding: '11px',
                    borderRadius: '9999px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {isSubmittingRequest ? <IconLoader2 size={16} stroke={2} className="spin" /> : '✓ Submit Request to GETORA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
