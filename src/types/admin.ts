export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'orders-pending'
  | 'orders-active'
  | 'orders-completed'
  | 'orders-cancelled'
  | 'orders-refunds'
  | 'retailers'
  | 'retailers-pending'
  | 'retailers-kyc'
  | 'retailers-settlements'
  | 'catalog'
  | 'catalog-categories'
  | 'catalog-brands'
  | 'catalog-variants'
  | 'catalog-upload'
  | 'inventory'
  | 'inventory-low'
  | 'inventory-out'
  | 'customers'
  | 'delivery-partners'
  | 'zones'
  | 'finance'
  | 'finance-transactions'
  | 'finance-revenue'
  | 'finance-retailer-settlement'
  | 'finance-delivery-settlement'
  | 'finance-refunds'
  | 'coupons'
  | 'marketing'
  | 'support'
  | 'reviews'
  | 'analytics'
  | 'alerts'
  | 'ai-insights'
  | 'reports'
  | 'admin-users'
  | 'security'
  | 'settings';

export interface AdminAuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AdminDeliveryPartner {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'Bike' | 'EV Scooter' | 'Van';
  vehicleNumber: string;
  status: 'online' | 'offline' | 'on_delivery' | 'suspended';
  currentOrderId?: string;
  rating: number;
  totalDeliveries: number;
  earnings: number;
  latitude: number;
  longitude: number;
  currentZone: string;
  joinedAt: string;
}

export interface AdminSupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderId?: string;
  retailerName?: string;
  subject: string;
  category: 'Wrong Product' | 'Delayed Delivery' | 'Damaged Item' | 'Refund Issue' | 'Payment Failure' | 'Other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: {
    id: string;
    sender: 'customer' | 'admin' | 'system';
    text: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminNotification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  linkTab?: AdminTab;
  linkId?: string;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  categoryLimit?: string;
}

export interface AdminZone {
  id: string;
  name: string;
  city: string;
  activeRetailers: number;
  activeRiders: number;
  baseDeliveryFee: number;
  perKmRate: number;
  surgeMultiplier: number;
  polygonCoords: [number, number][];
  isServiceable: boolean;
}
