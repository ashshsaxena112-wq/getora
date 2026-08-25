import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  AuthProfile,
  CustomerProfile,
  CustomerAddress,
  Category,
  Retailer,
  Product,
  MasterProduct,
  ProductRequest,
  ProductImage,
  Cart,
  CartItem,
  Order,
  OrderItem,
  OrderStatus,
  DeliveryPartner,
  DeliveryLocation,
  Review,
  Notification,
  ToastMessage
} from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MASTER_PRODUCT_CATALOG } from '../data/masterCatalog';

interface GetoraContextType {
  // Navigation & View Routing
  currentView: string;
  viewParams: Record<string, any>;
  navigate: (view: string, params?: Record<string, any>) => void;

  // Supabase Connection & Session
  isSupabaseConnected: boolean;
  user: any | null;
  profile: CustomerProfile | AuthProfile | null;
  role: UserRole;
  isAuthLoading: boolean;

  // Auth Modals & Actions
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string) => Promise<{ success: boolean; message?: string }>;
  signInWithPhone: (phone: string) => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (params: {
    email?: string;
    phone?: string;
    token: string;
    type: 'email' | 'sms';
    fullName?: string;
    role?: UserRole;
    shopName?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signUpWithPassword: (
    email: string,
    password: string,
    meta?: { fullName?: string; role?: UserRole; shopName?: string }
  ) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<CustomerProfile>) => Promise<boolean>;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Theme Management (Auto / Dark / Light)
  themeMode: 'auto' | 'dark' | 'light';
  resolvedTheme: 'dark' | 'light';
  setThemeMode: (mode: 'auto' | 'dark' | 'light') => void;

  // Catalog Data (Direct from Supabase)
  categories: Category[];
  stores: Retailer[];
  products: Product[];
  isLoadingCatalog: boolean;
  refreshCatalog: () => Promise<void>;
  getStoreById: (id: string) => Retailer | undefined;
  getProductById: (id: string) => Product | undefined;
  getProductsByStore: (retailerId: string) => Product[];
  getProductsByCategory: (categoryId: string) => Product[];

  // Customer Addresses
  savedAddresses: CustomerAddress[];
  selectedAddress: CustomerAddress | null;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  selectLocation: (address: CustomerAddress) => void;
  addAddress: (address: Omit<CustomerAddress, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;

  // Shopping Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemQuantityInCart: (productId: string) => number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  getCartSummary: () => {
    subtotal: number;
    deliveryFee: number;
    platformFee: number;
    discount: number;
    grandTotal: number;
    retailerGroups: { retailer: Retailer | undefined; items: CartItem[]; subtotal: number }[];
  };

  // Orders & Live Tracking
  orders: Order[];
  isLoadingOrders: boolean;
  refreshOrders: () => Promise<void>;
  placeOrder: (params: {
    retailerId: string;
    addressId: string;
    paymentMethod: string;
    items: CartItem[];
  }) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  getOrderById: (orderId: string) => Order | undefined;

  // Retailer Specific Operations & Master Catalog
  retailerProfile: Retailer | null;
  retailerProducts: Product[];
  retailerOrders: Order[];
  toggleStoreStatus: (isOpen: boolean) => Promise<boolean>;
  createProduct: (product: Partial<Product>, imageFile?: File) => Promise<boolean>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;

  // Master Catalog & Product Management System
  masterCatalog: MasterProduct[];
  productRequests: ProductRequest[];
  addMasterProductToShop: (
    masterProduct: MasterProduct,
    details: { price: number; sellingPrice: number; stockQuantity: number; unit?: string }
  ) => Promise<boolean>;
  updateRetailerProductPriceStock: (
    productId: string,
    updates: { sellingPrice: number; price?: number; stockQuantity: number; isAvailable?: boolean }
  ) => Promise<boolean>;
  requestNewProduct: (request: {
    name: string;
    brand?: string;
    categoryId: string;
    categoryName?: string;
    expectedPrice?: number;
    unit?: string;
    notes?: string;
  }) => Promise<boolean>;
  isMasterProductInShop: (
    masterProductId: string,
    retailerId?: string
  ) => { inShop: boolean; product?: Product };

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Driver Chat Modal
  activeDriverChat: { orderNumber: string; deliveryPartner: DeliveryPartner } | null;
  openDriverChat: (chatInfo: { orderNumber: string; deliveryPartner: DeliveryPartner }) => void;
  closeDriverChat: () => void;

  // Review Modal
  activeReviewModal: { orderId: string; storeId: string; storeName: string } | null;
  openReviewModal: (modalInfo: { orderId: string; storeId: string; storeName: string }) => void;
  closeReviewModal: () => void;

  // Notifications & Reviews
  notifications: Notification[];
  reviews: Review[];
  submitReview: (
    orderIdOrParams: string | {
      orderId: string;
      rating: number;
      reviewText: string;
      retailerId?: string;
      productId?: string;
      deliveryPartnerId?: string;
    },
    storeIdOrRating?: string | number,
    ratingOrComment?: number | string,
    comment?: string
  ) => Promise<boolean>;

  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const GetoraContext = createContext<GetoraContextType | undefined>(undefined);

export const GetoraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Theme Management (Auto / Dark / Light)
  const [themeMode, setThemeModeState] = useState<'auto' | 'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('getora_theme_mode');
      if (saved === 'dark' || saved === 'light' || saved === 'auto') return saved;
    } catch (e) {}
    return 'auto';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const resolvedTheme: 'dark' | 'light' =
    themeMode === 'auto' ? (systemPrefersDark ? 'dark' : 'light') : themeMode;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', resolvedTheme);
      document.documentElement.classList.remove('theme-dark', 'theme-light');
      document.documentElement.classList.add(`theme-${resolvedTheme}`);
    }
  }, [resolvedTheme]);

  const setThemeMode = (mode: 'auto' | 'dark' | 'light') => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('getora_theme_mode', mode);
    } catch (e) {}
    showToast(
      'Theme Updated',
      mode === 'auto'
        ? 'Theme set to Auto (Syncs with device mode)'
        : mode === 'dark'
        ? 'Dark Theme Enabled (Black & Green)'
        : 'Light Theme Enabled (White & Green)',
      'info'
    );
  };

  // Auth & Session
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | AuthProfile | null>(null);
  const [role, setRole] = useState<UserRole>('customer');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Catalog
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Retailer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(true);

  // Addresses & Cart
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);

  // Retailer Specific & Master Catalog
  const [retailerProfile, setRetailerProfile] = useState<Retailer | null>(null);
  const [retailerProducts, setRetailerProducts] = useState<Product[]>([]);
  const [retailerOrders, setRetailerOrders] = useState<Order[]>([]);
  const [masterCatalog] = useState<MasterProduct[]>(MASTER_PRODUCT_CATALOG);
  const [productRequests, setProductRequests] = useState<ProductRequest[]>(() => {
    try {
      const saved = localStorage.getItem('getora_product_requests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Notifications & Reviews
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('getora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem('getora_wishlist', JSON.stringify(next));
      } catch {}
      showToast(
        prev.includes(productId) ? 'Removed from Wishlist' : 'Saved to Wishlist',
        prev.includes(productId) ? 'Item removed from favorites' : 'Item added to your favorites',
        'info'
      );
      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Driver Chat Modal State
  const [activeDriverChat, setActiveDriverChat] = useState<{
    orderNumber: string;
    deliveryPartner: DeliveryPartner;
  } | null>(null);

  const openDriverChat = (chatInfo: { orderNumber: string; deliveryPartner: DeliveryPartner }) => {
    setActiveDriverChat(chatInfo);
  };

  const closeDriverChat = () => {
    setActiveDriverChat(null);
  };

  // Review Modal State
  const [activeReviewModal, setActiveReviewModal] = useState<{
    orderId: string;
    storeId: string;
    storeName: string;
  } | null>(null);

  const openReviewModal = (modalInfo: { orderId: string; storeId: string; storeName: string }) => {
    setActiveReviewModal(modalInfo);
  };

  const closeReviewModal = () => {
    setActiveReviewModal(null);
  };

  // Toast manager
  const showToast = useCallback(
    (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigate = (view: string, params: Record<string, any> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================================================
  // 1. SUPABASE AUTH & PROFILE SYNCHRONIZATION
  // ============================================================================

  // Fetch or create profile for authenticated user
  const fetchUserProfile = useCallback(async (authUser: any) => {
    if (!authUser) {
      setProfile(null);
      setRole('customer');
      setRetailerProfile(null);
      return;
    }

    try {
      // 1. Check if user is a Retailer
      const { data: retailerData } = await supabase
        .from('retailers')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (retailerData) {
        const formattedRetailer: Retailer = {
          id: retailerData.id,
          userId: retailerData.user_id,
          ownerName: retailerData.owner_name,
          phone: retailerData.phone,
          email: retailerData.email,
          profileImageUrl: retailerData.profile_image_url,
          shopName: retailerData.shop_name,
          shopLogoUrl: retailerData.shop_logo_url,
          shopImageUrl: retailerData.shop_image_url,
          businessCategory: retailerData.business_category,
          description: retailerData.description,
          gstNumber: retailerData.gst_number,
          panNumber: retailerData.pan_number,
          addressLine1: retailerData.address_line1,
          addressLine2: retailerData.address_line2,
          landmark: retailerData.landmark,
          city: retailerData.city,
          state: retailerData.state,
          pincode: retailerData.pincode,
          latitude: retailerData.latitude,
          longitude: retailerData.longitude,
          openingTime: retailerData.opening_time,
          closingTime: retailerData.closing_time,
          isOpen: retailerData.is_open ?? false,
          isVerified: retailerData.is_verified ?? false,
          isActive: retailerData.is_active ?? true,
          rating: Number(retailerData.rating || 0),
          totalOrders: retailerData.total_orders || 0,
          createdAt: retailerData.created_at,
          updatedAt: retailerData.updated_at
        };

        setRetailerProfile(formattedRetailer);
        setProfile({
          id: retailerData.id,
          userId: retailerData.user_id,
          role: 'retailer',
          fullName: retailerData.owner_name,
          email: retailerData.email,
          phone: retailerData.phone,
          profileImageUrl: retailerData.profile_image_url,
          isActive: retailerData.is_active,
          isVerified: retailerData.is_verified
        });
        setRole('retailer');
        return;
      }

      // 2. Check if user is a Customer
      const { data: customerData, error: custError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (customerData) {
        const custProfile: CustomerProfile = {
          id: customerData.id,
          userId: customerData.user_id,
          role: 'customer',
          fullName: customerData.full_name || authUser.email?.split('@')[0] || 'Customer',
          email: customerData.email || authUser.email || '',
          phone: customerData.phone || authUser.phone || '',
          profileImageUrl: customerData.profile_image_url,
          dateOfBirth: customerData.date_of_birth,
          gender: customerData.gender,
          isVerified: customerData.is_verified ?? false,
          isActive: customerData.is_active ?? true,
          latitude: customerData.latitude,
          longitude: customerData.longitude,
          currentAddress: customerData.current_address,
          city: customerData.city,
          state: customerData.state,
          pincode: customerData.pincode
        };
        setProfile(custProfile);
        setRole('customer');
      } else {
        // Auto-create Customer profile if missing
        const newFullName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'GETORA User';
        const { data: createdCust, error: createError } = await supabase
          .from('customers')
          .insert({
            user_id: authUser.id,
            full_name: newFullName,
            email: authUser.email,
            phone: authUser.phone,
            is_active: true
          })
          .select()
          .single();

        if (createdCust && !createError) {
          setProfile({
            id: createdCust.id,
            userId: createdCust.user_id,
            role: 'customer',
            fullName: createdCust.full_name,
            email: createdCust.email,
            phone: createdCust.phone,
            isActive: true,
            isVerified: false
          });
          setRole('customer');
        }
      }
    } catch (err) {
      console.error('Error fetching user profile from Supabase:', err);
    }
  }, []);

  // Initialize Auth listener
  useEffect(() => {
    setIsAuthLoading(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setProfile(null);
        setRole('customer');
      }
      setIsAuthLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setProfile(null);
        setRole('customer');
      }
      setIsAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Auth Functions
  const signInWithEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true }
      });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error sending Email OTP' };
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: { shouldCreateUser: true }
      });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error sending SMS OTP' };
    }
  };

  const verifyOtp = async (params: {
    email?: string;
    phone?: string;
    token: string;
    type: 'email' | 'sms';
    fullName?: string;
    role?: UserRole;
    shopName?: string;
  }) => {
    try {
      let verifyRes;
      if (params.email) {
        verifyRes = await supabase.auth.verifyOtp({
          email: params.email,
          token: params.token,
          type: 'email'
        });
      } else if (params.phone) {
        verifyRes = await supabase.auth.verifyOtp({
          phone: params.phone,
          token: params.token,
          type: 'sms'
        });
      }

      if (verifyRes?.error) throw verifyRes.error;

      if (verifyRes?.data?.user) {
        const u = verifyRes.data.user;
        setUser(u);

        // If retailer specified during signup
        if (params.role === 'retailer') {
          await supabase.from('retailers').upsert({
            user_id: u.id,
            owner_name: params.fullName || 'Retailer',
            shop_name: params.shopName || 'My Shop',
            email: params.email,
            phone: params.phone,
            is_active: true
          });
        }

        await fetchUserProfile(u);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Invalid or expired OTP' };
    }
  };

  const signInWithPassword = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Authentication failed' };
    }
  };

  const signUpWithPassword = async (
    email: string,
    pass: string,
    meta?: { fullName?: string; role?: UserRole; shopName?: string }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: meta?.fullName,
            role: meta?.role || 'customer',
            shop_name: meta?.shopName
          }
        }
      });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Signup failed' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRole('customer');
    setCart([]);
    setOrders([]);
    showToast('Signed Out', 'You have been safely signed out', 'info');
    navigate('home');
  };

  const updateProfile = async (updates: Partial<CustomerProfile>) => {
    if (!profile) return false;
    try {
      if (role === 'retailer') {
        const { error } = await supabase.from('retailers').update(updates).eq('id', profile.id);
        if (error) throw error;
      } else {
        const dbUpdates: any = {};
        if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
        if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
        if (updates.dateOfBirth !== undefined) dbUpdates.date_of_birth = updates.dateOfBirth;
        if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
        if (updates.profileImageUrl !== undefined) dbUpdates.profile_image_url = updates.profileImageUrl;
        if (updates.currentAddress !== undefined) dbUpdates.current_address = updates.currentAddress;
        if (updates.city !== undefined) dbUpdates.city = updates.city;
        if (updates.state !== undefined) dbUpdates.state = updates.state;
        if (updates.pincode !== undefined) dbUpdates.pincode = updates.pincode;

        const { error } = await supabase.from('customers').update(dbUpdates).eq('id', profile.id);
        if (error) throw error;
      }
      showToast('Profile Updated', 'Your profile details have been saved', 'success');
      if (user) await fetchUserProfile(user);
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to update profile', 'error');
      return false;
    }
  };

  // ============================================================================
  // 2. REAL SUPABASE CATALOG (Categories, Retailers, Products)
  // ============================================================================

  const refreshCatalog = useCallback(async () => {
    setIsLoadingCatalog(true);
    try {
      // 1. Categories
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (catData) {
        setCategories(
          catData.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            imageUrl: c.image_url,
            isActive: c.is_active,
            sortOrder: c.sort_order,
            createdAt: c.created_at
          }))
        );
      }

      // 2. Retailers / Stores
      const { data: retData } = await supabase
        .from('retailers')
        .select('*')
        .eq('is_active', true);

      if (retData) {
        setStores(
          retData.map((r) => ({
            id: r.id,
            userId: r.user_id,
            ownerName: r.owner_name,
            phone: r.phone,
            email: r.email,
            profileImageUrl: r.profile_image_url,
            shopName: r.shop_name,
            shopLogoUrl: r.shop_logo_url,
            shopImageUrl: r.shop_image_url,
            businessCategory: r.business_category,
            description: r.description,
            gstNumber: r.gst_number,
            panNumber: r.pan_number,
            addressLine1: r.address_line1,
            addressLine2: r.address_line2,
            landmark: r.landmark,
            city: r.city,
            state: r.state,
            pincode: r.pincode,
            latitude: r.latitude,
            longitude: r.longitude,
            openingTime: r.opening_time,
            closingTime: r.closing_time,
            isOpen: r.is_open ?? true,
            isVerified: r.is_verified ?? false,
            isActive: r.is_active ?? true,
            rating: Number(r.rating || 0),
            totalOrders: r.total_orders || 0,
            createdAt: r.created_at,
            updatedAt: r.updated_at
          }))
        );
      }

      // 3. Products + Images
      const { data: prodData } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          retailer:retailers(*),
          images:product_images(*)
        `)
        .eq('is_active', true);

      if (prodData) {
        setProducts(
          prodData.map((p) => ({
            id: p.id,
            retailerId: p.retailer_id,
            categoryId: p.category_id,
            name: p.name,
            description: p.description,
            brand: p.brand,
            sku: p.sku,
            price: Number(p.price || 0),
            sellingPrice: Number(p.selling_price || p.price || 0),
            stockQuantity: p.stock_quantity || 0,
            unit: p.unit || 'pcs',
            imageUrl: p.image_url || p.images?.[0]?.image_url,
            isAvailable: p.is_available ?? true,
            isActive: p.is_active ?? true,
            category: p.category,
            retailer: p.retailer,
            images: p.images
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching catalog data from Supabase:', err);
    } finally {
      setIsLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();

    // Supabase Realtime Channels for Retailers & Products
    const catalogChannel = supabase
      .channel('customer-catalog-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'retailers' }, () => {
        refreshCatalog();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        refreshCatalog();
      })
      .subscribe();

    // Local Storage cross-window event sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'getora_stores_updated') {
        refreshCatalog();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      supabase.removeChannel(catalogChannel);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshCatalog]);

  const getStoreById = (id: string) => stores.find((s) => s.id === id);
  const getProductById = (id: string) => products.find((p) => p.id === id);
  const getProductsByStore = (retailerId: string) => products.filter((p) => p.retailerId === retailerId);
  const getProductsByCategory = (categoryId: string) => products.filter((p) => p.categoryId === categoryId);

  // ============================================================================
  // 3. CUSTOMER ADDRESSES
  // ============================================================================

  const refreshAddresses = useCallback(async () => {
    if (!profile?.id || role !== 'customer') return;

    try {
      const { data } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', profile.id)
        .order('is_default', { ascending: false });

      if (data) {
        const formatted: CustomerAddress[] = data.map((a) => ({
          id: a.id,
          customerId: a.customer_id,
          addressType: a.address_type || 'Home',
          fullName: a.full_name,
          phone: a.phone,
          addressLine1: a.address_line1,
          addressLine2: a.address_line2,
          landmark: a.landmark,
          city: a.city,
          state: a.state,
          pincode: a.pincode,
          latitude: a.latitude,
          longitude: a.longitude,
          isDefault: a.is_default ?? false,
          createdAt: a.created_at,
          updatedAt: a.updated_at
        }));

        setSavedAddresses(formatted);
        if (formatted.length > 0 && !selectedAddress) {
          setSelectedAddress(formatted.find((a) => a.isDefault) || formatted[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching customer addresses:', err);
    }
  }, [profile?.id, role, selectedAddress]);

  useEffect(() => {
    refreshAddresses();
  }, [refreshAddresses]);

  const addAddress = async (
    addr: Omit<CustomerAddress, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!profile?.id) {
      setIsAuthModalOpen(true);
      return false;
    }

    try {
      const { error } = await supabase.from('customer_addresses').insert({
        customer_id: profile.id,
        address_type: addr.addressType,
        full_name: addr.fullName,
        phone: addr.phone,
        address_line1: addr.addressLine1,
        address_line2: addr.addressLine2,
        landmark: addr.landmark,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        latitude: addr.latitude,
        longitude: addr.longitude,
        is_default: addr.isDefault
      });

      if (error) throw error;
      showToast('Address Saved', 'New delivery location added', 'success');
      await refreshAddresses();
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to add address', 'error');
      return false;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const { error } = await supabase.from('customer_addresses').delete().eq('id', id);
      if (error) throw error;
      showToast('Address Removed', 'Address deleted successfully', 'info');
      await refreshAddresses();
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to delete address', 'error');
      return false;
    }
  };

  const setDefaultAddress = async (id: string) => {
    if (!profile?.id) return false;
    try {
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('customer_id', profile.id);

      await supabase.from('customer_addresses').update({ is_default: true }).eq('id', id);
      await refreshAddresses();
      return true;
    } catch (err: any) {
      return false;
    }
  };

  const selectLocation = (address: CustomerAddress) => {
    setSelectedAddress(address);
    setIsLocationModalOpen(false);
  };

  // ============================================================================
  // 4. DATABASE SHOPPING CART
  // ============================================================================

  // Refresh cart from database if user is authenticated
  const refreshCart = useCallback(async () => {
    if (!profile?.id || role !== 'customer') return;

    try {
      const { data: cartData } = await supabase
        .from('carts')
        .select(`
          id,
          customer_id,
          retailer_id,
          items:cart_items (
            id,
            cart_id,
            product_id,
            quantity,
            unit_price,
            product:products (*)
          )
        `)
        .eq('customer_id', profile.id);

      if (cartData && cartData.length > 0) {
        const loadedItems: CartItem[] = [];
        cartData.forEach((c: any) => {
          c.items?.forEach((it: any) => {
            if (it.product) {
              loadedItems.push({
                id: it.id,
                cartId: it.cart_id,
                productId: it.product_id,
                quantity: it.quantity,
                unitPrice: Number(it.unit_price || it.product.selling_price),
                product: {
                  id: it.product.id,
                  retailerId: it.product.retailer_id,
                  categoryId: it.product.category_id,
                  name: it.product.name,
                  description: it.product.description,
                  brand: it.product.brand,
                  sku: it.product.sku,
                  price: Number(it.product.price || 0),
                  sellingPrice: Number(it.product.selling_price || 0),
                  stockQuantity: it.product.stock_quantity || 0,
                  unit: it.product.unit || 'pcs',
                  imageUrl: it.product.image_url,
                  isAvailable: it.product.is_available,
                  isActive: it.product.is_active
                }
              });
            }
          });
        });
        setCart(loadedItems);
      }
    } catch (err) {
      console.error('Error fetching cart from Supabase:', err);
    }
  }, [profile?.id, role]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!profile?.id) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      // 1. Get or create cart for this retailer
      let { data: cartRec } = await supabase
        .from('carts')
        .select('id')
        .eq('customer_id', profile.id)
        .eq('retailer_id', product.retailerId)
        .maybeSingle();

      if (!cartRec) {
        const { data: newCart, error: cartErr } = await supabase
          .from('carts')
          .insert({ customer_id: profile.id, retailer_id: product.retailerId })
          .select('id')
          .single();
        if (cartErr) throw cartErr;
        cartRec = newCart;
      }

      // 2. Check if item already in cart
      const existingItem = cart.find((i) => i.productId === product.id);
      const newQty = existingItem ? existingItem.quantity + quantity : quantity;

      const { error: itemErr } = await supabase.from('cart_items').upsert(
        {
          cart_id: cartRec.id,
          product_id: product.id,
          quantity: newQty,
          unit_price: product.sellingPrice
        },
        { onConflict: 'cart_id,product_id' }
      );

      if (itemErr) throw itemErr;

      showToast('Added to Cart', `${product.name} added to your basket`, 'success');
      await refreshCart();
    } catch (err: any) {
      showToast('Cart Error', err.message || 'Could not update cart', 'error');
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!profile?.id) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const item = cart.find((i) => i.productId === productId);
      if (item?.cartId) {
        await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('cart_id', item.cartId)
          .eq('product_id', productId);

        await refreshCart();
      }
    } catch (err: any) {
      console.error('Error updating cart quantity:', err);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!profile?.id) return;
    try {
      const item = cart.find((i) => i.productId === productId);
      if (item?.cartId) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', item.cartId)
          .eq('product_id', productId);

        showToast('Removed', 'Item removed from cart', 'info');
        await refreshCart();
      }
    } catch (err: any) {
      console.error('Error removing from cart:', err);
    }
  };

  const clearCart = async () => {
    if (!profile?.id) return;
    try {
      await supabase.from('carts').delete().eq('customer_id', profile.id);
      setCart([]);
    } catch (err: any) {
      console.error('Error clearing cart:', err);
    }
  };

  const getItemQuantityInCart = (productId: string) => {
    return cart.find((i) => i.productId === productId)?.quantity || 0;
  };

  const applyCoupon = (code: string) => {
    if (code.toUpperCase() === 'GETORA100') {
      setAppliedCoupon('GETORA100');
      return { success: true, message: '₹100 discount applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code' };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const getCartSummary = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 29;
    const platformFee = subtotal > 0 ? 5 : 0;
    const discount = appliedCoupon === 'GETORA100' && subtotal >= 299 ? 100 : 0;
    const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee - discount);

    // Group items by retailer
    const retailerMap = new Map<string, CartItem[]>();
    cart.forEach((it) => {
      const retId = it.product.retailerId || it.product.storeId || '';
      if (!retailerMap.has(retId)) retailerMap.set(retId, []);
      retailerMap.get(retId)!.push(it);
    });

    const retailerGroups = Array.from(retailerMap.entries()).map(([retId, items]) => {
      const retailer = stores.find((s) => s.id === retId);
      const retSubtotal = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
      return { retailer, items, subtotal: retSubtotal };
    });

    return { subtotal, deliveryFee, platformFee, discount, grandTotal, retailerGroups };
  };

  // ============================================================================
  // 5. ORDERS & REALTIME LIFECYCLE
  // ============================================================================

  const refreshOrders = useCallback(async () => {
    if (!profile?.id) return;
    setIsLoadingOrders(true);

    try {
      let query = supabase.from('orders').select(`
        *,
        retailer:retailers(*),
        deliveryPartner:delivery_partners(*),
        address:customer_addresses(*),
        items:order_items(*)
      `);

      if (role === 'customer') {
        query = query.eq('customer_id', profile.id);
      } else if (role === 'retailer') {
        query = query.eq('retailer_id', profile.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (data && !error) {
        const mappedOrders: Order[] = data.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          customerId: o.customer_id,
          retailerId: o.retailer_id,
          deliveryPartnerId: o.delivery_partner_id,
          addressId: o.address_id,
          subtotal: Number(o.subtotal || 0),
          deliveryFee: Number(o.delivery_fee || 0),
          discount: Number(o.discount || 0),
          tax: Number(o.tax || 0),
          totalAmount: Number(o.total_amount || 0),
          paymentMethod: o.payment_method || 'COD',
          paymentStatus: o.payment_status || 'pending',
          orderStatus: o.order_status || 'placed',
          placedAt: o.placed_at || o.created_at,
          acceptedAt: o.accepted_at,
          pickedUpAt: o.picked_up_at,
          deliveredAt: o.delivered_at,
          cancelledAt: o.cancelled_at,
          createdAt: o.created_at,
          updatedAt: o.updated_at,
          retailer: o.retailer,
          deliveryPartner: o.deliveryPartner,
          address: o.address,
          items: o.items
        }));

        setOrders(mappedOrders);
        if (role === 'retailer') setRetailerOrders(mappedOrders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [profile?.id, role]);

  useEffect(() => {
    refreshOrders();

    // Supabase Realtime subscription on orders
    const orderSubscription = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          refreshOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderSubscription);
    };
  }, [refreshOrders]);

  const placeOrder = async (params: {
    retailerId: string;
    addressId: string;
    paymentMethod: string;
    items: CartItem[];
  }) => {
    if (!profile?.id) {
      setIsAuthModalOpen(true);
      return { success: false, error: 'Authentication required' };
    }

    try {
      const summary = getCartSummary();

      // 1. Create order record
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          customer_id: profile.id,
          retailer_id: params.retailerId,
          address_id: params.addressId,
          subtotal: summary.subtotal,
          delivery_fee: summary.deliveryFee,
          discount: summary.discount,
          total_amount: summary.grandTotal,
          payment_method: params.paymentMethod,
          payment_status: params.paymentMethod === 'COD' ? 'pending' : 'paid',
          order_status: 'placed'
        })
        .select()
        .single();

      if (orderErr || !orderData) throw orderErr || new Error('Order creation failed');

      // 2. Insert order items snapshot
      const orderItemsToInsert = params.items.map((it) => ({
        order_id: orderData.id,
        product_id: it.productId,
        product_name: it.product.name,
        quantity: it.quantity,
        unit_price: it.unitPrice,
        total_price: it.unitPrice * it.quantity
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItemsToInsert);
      if (itemsErr) throw itemsErr;

      // 3. Clear cart in Supabase
      await clearCart();

      showToast('Order Placed!', `Order #${orderData.order_number} confirmed`, 'success');
      await refreshOrders();

      return { success: true, orderId: orderData.id };
    } catch (err: any) {
      showToast('Order Error', err.message || 'Failed to place order', 'error');
      return { success: false, error: err.message };
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: 'cancelled', cancelled_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      showToast('Order Cancelled', 'Your order has been cancelled', 'info');
      await refreshOrders();
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to cancel order', 'error');
      return false;
    }
  };

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId);

  // ============================================================================
  // 6. RETAILER PORTAL OPERATIONS
  // ============================================================================

  const toggleStoreStatus = async (isOpen: boolean) => {
    if (!retailerProfile?.id) return false;
    try {
      const { error } = await supabase
        .from('retailers')
        .update({ is_open: isOpen })
        .eq('id', retailerProfile.id);

      if (error) throw error;
      setRetailerProfile((prev) => (prev ? { ...prev, isOpen } : null));
      showToast('Store Updated', `Store is now ${isOpen ? 'Open for orders' : 'Closed'}`, 'success');
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to update store status', 'error');
      return false;
    }
  };

  const createProduct = async (product: Partial<Product>, imageFile?: File) => {
    if (!retailerProfile?.id) return false;
    try {
      let uploadedImageUrl = product.imageUrl;

      // Upload image to product-images bucket if file provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
        uploadedImageUrl = urlData.publicUrl;
      }

      const { data: newProd, error: insertError } = await supabase
        .from('products')
        .insert({
          retailer_id: retailerProfile.id,
          category_id: product.categoryId,
          name: product.name,
          description: product.description,
          brand: product.brand,
          sku: product.sku,
          price: product.price,
          selling_price: product.sellingPrice,
          stock_quantity: product.stockQuantity || 0,
          unit: product.unit || 'pcs',
          image_url: uploadedImageUrl,
          is_available: true,
          is_active: true
        })
        .select()
        .single();

      if (insertError) throw insertError;

      showToast('Product Added', `${product.name} is now listed in your shop`, 'success');
      await refreshCatalog();
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to add product', 'error');
      return false;
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          selling_price: updates.sellingPrice,
          stock_quantity: updates.stockQuantity,
          is_available: updates.isAvailable
        })
        .eq('id', productId);

      if (error) throw error;
      showToast('Product Updated', 'Product details updated successfully', 'success');
      await refreshCatalog();
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to update product', 'error');
      return false;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      showToast('Product Deleted', 'Product removed from catalog', 'info');
      await refreshCatalog();
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to delete product', 'error');
      return false;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updates: any = { order_status: status };
      if (status === 'accepted') updates.accepted_at = new Date().toISOString();
      if (status === 'picked_up') updates.picked_up_at = new Date().toISOString();
      if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
        updates.payment_status = 'paid';
      }

      const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
      if (error) throw error;

      showToast('Status Updated', `Order status set to ${status.replace(/_/g, ' ')}`, 'success');
      await refreshOrders();
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to update order status', 'error');
      return false;
    }
  };

  // ============================================================================
  // 6.5 MASTER PRODUCT CATALOG & 1-CLICK ADDING SYSTEM
  // ============================================================================

  const isMasterProductInShop = (masterProductId: string, targetRetailerId?: string) => {
    const retId = targetRetailerId || retailerProfile?.id || (role === 'retailer' ? profile?.id : null);
    if (!retId) return { inShop: false };

    const master = masterCatalog.find((m) => m.id === masterProductId);
    const prod = products.find(
      (p) =>
        p.retailerId === retId &&
        (p.masterProductId === masterProductId || (master && p.name.toLowerCase() === master.name.toLowerCase()))
    );

    return { inShop: !!prod, product: prod };
  };

  const addMasterProductToShop = async (
    masterProduct: MasterProduct,
    details: { price: number; sellingPrice: number; stockQuantity: number; unit?: string }
  ) => {
    const targetRetailerId = retailerProfile?.id || (role === 'retailer' ? profile?.id : null) || 'store-voltix';
    if (!targetRetailerId) {
      showToast('Login Required', 'Please sign in with a retailer account to manage your store', 'warning');
      return false;
    }

    try {
      // 1. Check for duplicate prevention
      const existingProduct = products.find(
        (p) =>
          p.retailerId === targetRetailerId &&
          (p.masterProductId === masterProduct.id || p.name.toLowerCase() === masterProduct.name.toLowerCase())
      );

      if (existingProduct) {
        // Update existing item's price and stock instead of creating duplicate
        await updateRetailerProductPriceStock(existingProduct.id, {
          sellingPrice: details.sellingPrice,
          price: details.price,
          stockQuantity: details.stockQuantity,
          isAvailable: true
        });
        showToast('Shop Updated', `Updated price (₹${details.sellingPrice}) and stock (${details.stockQuantity}) for ${masterProduct.name}`, 'success');
        return true;
      }

      // 2. Create new shop product linked to Master Catalog
      const newProductData: Partial<Product> = {
        retailerId: targetRetailerId,
        masterProductId: masterProduct.id,
        categoryId: masterProduct.categoryId,
        categoryName: masterProduct.categoryName,
        name: masterProduct.name,
        brand: masterProduct.brand,
        description: masterProduct.description,
        unit: details.unit || masterProduct.unit,
        price: Number(details.price || details.sellingPrice),
        sellingPrice: Number(details.sellingPrice),
        stockQuantity: Number(details.stockQuantity || 0),
        imageUrl: masterProduct.imageUrl,
        isAvailable: true,
        isActive: true,
        sku: masterProduct.sku || `SKU-${masterProduct.id}`
      };

      if (isSupabaseConfigured()) {
        try {
          const { data: inserted, error } = await supabase
            .from('products')
            .insert({
              retailer_id: targetRetailerId,
              category_id: masterProduct.categoryId,
              name: masterProduct.name,
              brand: masterProduct.brand,
              description: masterProduct.description,
              unit: details.unit || masterProduct.unit,
              price: Number(details.price || details.sellingPrice),
              selling_price: Number(details.sellingPrice),
              stock_quantity: Number(details.stockQuantity || 0),
              image_url: masterProduct.imageUrl,
              sku: masterProduct.sku || `SKU-${masterProduct.id}`,
              is_available: true,
              is_active: true
            })
            .select()
            .single();

          if (inserted && !error) {
            newProductData.id = inserted.id;
          }
        } catch (dbErr) {
          console.warn('Supabase product insert skipped or offline, storing locally', dbErr);
        }
      }

      if (!newProductData.id) {
        newProductData.id = `prod-shop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      }

      // Update state live
      setProducts((prev) => [newProductData as Product, ...prev]);

      showToast('Added to My Shop', `${masterProduct.name} is now listed in your shop at ₹${details.sellingPrice}!`, 'success');
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to add product to shop', 'error');
      return false;
    }
  };

  const updateRetailerProductPriceStock = async (
    productId: string,
    updates: { sellingPrice: number; price?: number; stockQuantity: number; isAvailable?: boolean }
  ) => {
    try {
      if (isSupabaseConfigured()) {
        try {
          const dbUpdates: any = {
            selling_price: updates.sellingPrice,
            stock_quantity: updates.stockQuantity
          };
          if (updates.price !== undefined) dbUpdates.price = updates.price;
          if (updates.isAvailable !== undefined) dbUpdates.is_available = updates.isAvailable;

          await supabase.from('products').update(dbUpdates).eq('id', productId);
        } catch (dbErr) {
          console.warn('Supabase product update error:', dbErr);
        }
      }

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              sellingPrice: updates.sellingPrice,
              price: updates.price !== undefined ? updates.price : p.price,
              stockQuantity: updates.stockQuantity,
              isAvailable: updates.isAvailable !== undefined ? updates.isAvailable : p.isAvailable
            };
          }
          return p;
        })
      );

      showToast('Updated', 'Product price and stock updated', 'success');
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to update product', 'error');
      return false;
    }
  };

  const requestNewProduct = async (request: {
    name: string;
    brand?: string;
    categoryId: string;
    categoryName?: string;
    expectedPrice?: number;
    unit?: string;
    notes?: string;
  }) => {
    const targetRetailerId = retailerProfile?.id || (role === 'retailer' && profile?.id ? profile.id : 'retailer-guest');
    const retailerName = retailerProfile?.shopName || profile?.fullName || 'Retailer';

    const newRequest: ProductRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      retailerId: targetRetailerId,
      retailerName,
      name: request.name.trim(),
      brand: request.brand?.trim(),
      categoryId: request.categoryId,
      categoryName: request.categoryName || categories.find((c) => c.id === request.categoryId)?.name || 'General',
      expectedPrice: request.expectedPrice,
      unit: request.unit || '1 pc',
      notes: request.notes,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setProductRequests((prev) => {
      const updated = [newRequest, ...prev];
      try {
        localStorage.setItem('getora_product_requests', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    showToast('Request Submitted', `GETORA team will review and add "${request.name}" to the master catalog shortly.`, 'success');
    return true;
  };

  // ============================================================================
  // 7. REVIEWS & NOTIFICATIONS
  // ============================================================================

  const submitReview = async (
    orderIdOrParams: string | {
      orderId: string;
      rating: number;
      reviewText: string;
      retailerId?: string;
      productId?: string;
      deliveryPartnerId?: string;
    },
    storeIdOrRating?: string | number,
    ratingOrComment?: number | string,
    comment?: string
  ) => {
    let orderId = '';
    let rating = 5;
    let reviewText = '';
    let retailerId: string | undefined;
    let productId: string | undefined;
    let deliveryPartnerId: string | undefined;

    if (typeof orderIdOrParams === 'object') {
      orderId = orderIdOrParams.orderId;
      rating = orderIdOrParams.rating;
      reviewText = orderIdOrParams.reviewText;
      retailerId = orderIdOrParams.retailerId;
      productId = orderIdOrParams.productId;
      deliveryPartnerId = orderIdOrParams.deliveryPartnerId;
    } else {
      orderId = orderIdOrParams;
      if (typeof storeIdOrRating === 'string') {
        retailerId = storeIdOrRating;
      } else if (typeof storeIdOrRating === 'number') {
        rating = storeIdOrRating;
      }
      if (typeof ratingOrComment === 'number') {
        rating = ratingOrComment;
      } else if (typeof ratingOrComment === 'string') {
        reviewText = ratingOrComment;
      }
      if (typeof comment === 'string') {
        reviewText = comment;
      }
    }

    if (!profile?.id) return false;
    try {
      const { error } = await supabase.from('reviews').insert({
        customer_id: profile.id,
        order_id: orderId,
        rating,
        review_text: reviewText || 'Great experience!',
        retailer_id: retailerId,
        product_id: productId,
        delivery_partner_id: deliveryPartnerId
      });

      if (error) throw error;
      showToast('Review Submitted', 'Thank you for your feedback!', 'success');
      closeReviewModal();
      return true;
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to submit review', 'error');
      return false;
    }
  };

  return (
    <GetoraContext.Provider
      value={{
        currentView,
        viewParams,
        navigate,

        isSupabaseConnected: isSupabaseConfigured(),
        user,
        profile,
        role,
        isAuthLoading,

        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        signInWithEmail,
        signInWithPhone,
        verifyOtp,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        updateProfile,

        searchQuery,
        setSearchQuery,

        themeMode,
        resolvedTheme,
        setThemeMode,

        categories,
        stores,
        products,
        isLoadingCatalog,
        refreshCatalog,
        getStoreById,
        getProductById,
        getProductsByStore,
        getProductsByCategory,

        wishlist,
        toggleWishlist,
        isInWishlist,

        savedAddresses,
        selectedAddress,
        isLocationModalOpen,
        openLocationModal: () => setIsLocationModalOpen(true),
        closeLocationModal: () => setIsLocationModalOpen(false),
        selectLocation,
        addAddress,
        deleteAddress,
        setDefaultAddress,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getItemQuantityInCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        getCartSummary,

        orders,
        isLoadingOrders,
        refreshOrders,
        placeOrder,
        cancelOrder,
        getOrderById,

        activeDriverChat,
        openDriverChat,
        closeDriverChat,

        activeReviewModal,
        openReviewModal,
        closeReviewModal,

        retailerProfile,
        retailerProducts,
        retailerOrders,
        toggleStoreStatus,
        createProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,

        masterCatalog,
        productRequests,
        addMasterProductToShop,
        updateRetailerProductPriceStock,
        requestNewProduct,
        isMasterProductInShop,

        notifications,
        reviews,
        submitReview,

        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </GetoraContext.Provider>
  );
};

export const useGetora = () => {
  const context = useContext(GetoraContext);
  if (!context) {
    throw new Error('useGetora must be used within a GetoraProvider');
  }
  return context;
};
