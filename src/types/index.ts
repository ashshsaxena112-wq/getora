// ==============================================================================
// GETORA TYPES & MODELS (Directly Mapped to Supabase PostgreSQL Schema)
// ==============================================================================

export type UserRole = 'customer' | 'retailer' | 'delivery_partner' | 'admin';

export interface AuthProfile {
  id: string; // matches customers.id, retailers.id, or delivery_partners.id
  userId: string; // matches auth.users.id
  role: UserRole;
  fullName: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface CustomerProfile extends AuthProfile {
  dateOfBirth?: string;
  gender?: string;
  latitude?: number;
  longitude?: number;
  currentAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface CustomerAddress {
  id: string;
  customerId?: string;
  tag?: string;
  addressType?: string;
  fullName?: string;
  phone?: string;
  flatNo?: string;
  streetArea?: string;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Alias for legacy / mock compatibility
export type Address = CustomerAddress;

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  iconName?: string;
  storeCount?: number;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

export interface Retailer {
  id: string;
  userId?: string;
  ownerName?: string;
  name?: string;
  slug?: string;
  phone?: string;
  email?: string;
  profileImageUrl?: string;
  shopName?: string;
  shopLogoUrl?: string;
  shopImageUrl?: string;
  businessCategory?: string;
  categoryName?: string;
  categoryId?: string;
  description?: string;
  gstNumber?: string;
  panNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  locality?: string;
  address?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  openingTime?: string;
  openTime?: string;
  closingTime?: string;
  closeTime?: string;
  isOpen: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  rating: number;
  ratingCount?: number;
  reviewCount?: number;
  totalOrders?: number;
  createdAt?: string;
  updatedAt?: string;
  // Legacy / UI optional fields
  bannerUrl?: string;
  logoUrl?: string;
  tagline?: string;
  offerText?: string;
  featured?: boolean;
  deliveryEtaMin?: number;
  deliveryFee?: number;
  freeDeliveryThreshold?: number;
  minOrderAmount?: number;
  distanceKm?: number;
}

// Alias for legacy / mock compatibility
export type Store = Retailer;

export interface ProductImage {
  id: string;
  productId: string;
  storagePath: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  retailerId: string;
  categoryId?: string;
  name: string;
  slug?: string;
  description?: string;
  brand?: string;
  sku?: string;
  price: number;
  mrp?: number;
  sellingPrice: number;
  stockQuantity: number;
  inStock?: boolean;
  unit?: string;
  packInfo?: string;
  imageUrl?: string;
  features?: (string | { label: string; value: string })[];
  colors?: string[];
  isPopular?: boolean;
  isAvailable?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Joins / Computed
  category?: Category;
  retailer?: Retailer;
  images?: (ProductImage | string)[];
  storeId?: string;
  storeName?: string;
  storeLocality?: string;
  categoryName?: string;
  rating?: number;
  ratingCount?: number;
  reviewCount?: number;
  discountPercentage?: number;
  discountPercent?: number;
  deliveryEtaMin?: number;
}

export interface CartItem {
  id?: string;
  cartId?: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: Product;
}

export interface Cart {
  id: string;
  customerId: string;
  retailerId: string;
  items: CartItem[];
  createdAt?: string;
}

export interface Coupon {
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed' | 'flat';
  discountValue?: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  validUntil: string;
}

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id?: string;
  orderId?: string;
  productId?: string;
  productName?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  product?: Product;
}

export interface DeliveryPartner {
  id: string;
  userId?: string;
  fullName?: string;
  name?: string;
  phone?: string;
  email?: string;
  profileImageUrl?: string;
  avatarUrl?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  vehicle?: string;
  drivingLicenseNumber?: string;
  isOnline?: boolean;
  isAvailable?: boolean;
  isVerified?: boolean;
  rating: number;
  totalDeliveries?: number;
}

export interface DeliveryLocation {
  id?: string;
  orderId?: string;
  deliveryPartnerId?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  progressPercent?: number;
  createdAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  retailerId: string;
  storeId?: string;
  deliveryPartnerId?: string;
  addressId: string;
  subtotal: number;
  deliveryFee: number;
  platformFee?: number;
  discount: number;
  tax: number;
  totalAmount: number;
  grandTotal?: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: OrderStatus;
  status?: OrderStatus;
  couponCode?: string;
  deliveryAddress?: CustomerAddress;
  deliveryInstructions?: string;
  estimatedDeliveryTime?: string;
  placedAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  // Joins & UI compatibility
  customer?: CustomerProfile;
  retailer?: Retailer;
  deliveryPartner?: DeliveryPartner;
  address?: CustomerAddress;
  items?: OrderItem[];
  latestLocation?: DeliveryLocation;
  driverLocation?: DeliveryLocation | any;
  storeName?: string;
  storeAddress?: string;
}

export interface Review {
  id: string;
  customerId: string;
  orderId: string;
  retailerId?: string;
  deliveryPartnerId?: string;
  productId?: string;
  rating: number;
  reviewText?: string;
  createdAt: string;
  customer?: {
    fullName: string;
    profileImageUrl?: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  orderId?: string;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
