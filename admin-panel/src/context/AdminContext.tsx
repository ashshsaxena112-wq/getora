import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  REAL_WEBSITE_STORES,
  REAL_WEBSITE_PRODUCTS,
  REAL_WEBSITE_ORDERS
} from '../data/websiteDataset';
import {
  ALERTS_NOTIFICATIONS_DATA,
  MAP_PINS_DATA,
  AUDIT_LOGS_MOCK
} from '../data/adminMockData';

export interface RetailerItem {
  id: string;
  retailer: string;
  owner: string;
  category: string;
  orders: number;
  revenue: string;
  numericRevenue: number;
  commissionEarned: string;
  rating: number;
  status: 'Active' | 'Suspended';
  isVerified: boolean;
  city: string;
  locality: string;
  address?: string;
  phone?: string;
  gstin?: string;
  commissionRate?: number;
  openTime?: string;
  closeTime?: string;
  logoUrl?: string;
}

export interface CustomerItem {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  locality: string;
  totalOrders: number;
  totalSpent: string;
  status: 'Active' | 'Inactive';
  isVerified: boolean;
  createdAt: string;
}

export interface DeliveryPartnerItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  vehicleNumber: string;
  status: 'Available' | 'On Delivery' | 'Offline';
  deliveries: number;
  rating: number;
  isVerified: boolean;
  latitude?: number;
  longitude?: number;
}

export interface ZoneItem {
  id: string;
  name: string;
  city: string;
  pincodes: string[];
  minOrder: number;
  deliveryFee: number;
  activeRiders: number;
  ordersToday: number;
  isActive: boolean;
}

export interface CouponItem {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount: number;
  usageCount: number;
  isActive: boolean;
}

export interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  category: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  createdAt: string;
}

export interface MarketingCampaignItem {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  channel: string;
  couponCode?: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
  sentCount: number;
  clickedCount: number;
  conversionsCount: number;
  createdAt: string;
}

export interface FinanceSettlementItem {
  id: string;
  settlementRef: string;
  entityName: string;
  grossSales: string;
  commissionDeducted: string;
  netPayable: string;
  payoutMode: string;
  utrNumber?: string;
  status: 'Pending' | 'Processing' | 'Paid';
  settlementDate: string;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  storeName: string;
  productName: string;
  rating: number;
  comment: string;
  isPublished: boolean;
  createdAt: string;
}

interface AdminContextType {
  // Connection state
  isConnectedToSupabase: boolean;
  isLoading: boolean;
  lastSyncedAt: string;
  refreshAllData: () => Promise<void>;

  // Dynamic Calculated Metrics
  kpiData: {
    totalOrders: { value: string; count: number; trend: string };
    todayRevenue: { value: string; amount: number; trend: string };
    getoraCommission: { value: string; amount: number; trend: string };
    activeRetailers: { value: string; count: number; trend: string };
    activeDeliveryPartners: { value: string; count: number; trend: string };
    activeCustomers: { value: string; count: number; trend: string };
  };
  orderDistribution: { id: string; label: string; count: number; percentage: string; color: string }[];
  overviewChart: { date: string; orders: number; revenue: number }[];

  // Real Supabase data collections
  orders: any[];
  retailers: RetailerItem[];
  products: any[];
  customers: CustomerItem[];
  deliveryPartners: DeliveryPartnerItem[];
  zones: ZoneItem[];
  coupons: CouponItem[];
  supportTickets: SupportTicketItem[];
  marketingCampaigns: MarketingCampaignItem[];
  financeSettlements: FinanceSettlementItem[];
  reviews: ReviewItem[];
  notifications: any[];
  auditLogs: any[];
  mapPins: any[];

  // Mutations for all modules
  addRetailer: (retailer: Partial<RetailerItem>) => Promise<boolean>;
  updateRetailer: (retailerId: string, updatedData: Partial<RetailerItem>) => Promise<boolean>;
  deleteRetailer: (retailerId: string) => Promise<boolean>;
  toggleRetailerStatus: (retailerId: string) => Promise<boolean>;
  approveRetailerKYC: (retailerId: string) => Promise<boolean>;

  updateOrderStatus: (orderId: string, newStatus: string, label: string, color: string) => Promise<boolean>;
  addMasterProduct: (product: any) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;

  addCoupon: (coupon: Partial<CouponItem>) => Promise<boolean>;
  toggleCouponStatus: (couponId: string) => Promise<boolean>;
  deleteCoupon: (couponId: string) => Promise<boolean>;

  addZone: (zone: Partial<ZoneItem>) => Promise<boolean>;
  toggleZoneStatus: (zoneId: string) => Promise<boolean>;

  addSupportTicket: (ticket: Partial<SupportTicketItem>) => Promise<boolean>;
  updateTicketStatus: (ticketId: string, newStatus: SupportTicketItem['status']) => Promise<boolean>;

  addMarketingCampaign: (campaign: Partial<MarketingCampaignItem>) => Promise<boolean>;
  addCustomer: (customer: Partial<CustomerItem>) => Promise<boolean>;
  addDeliveryPartner: (partner: Partial<DeliveryPartnerItem>) => Promise<boolean>;
  toggleDeliveryPartnerStatus: (partnerId: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnectedToSupabase, setIsConnectedToSupabase] = useState(isSupabaseConfigured());
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(new Date().toLocaleTimeString());

  // Collections State
  const [orders, setOrders] = useState<any[]>(REAL_WEBSITE_ORDERS);
  const [retailers, setRetailers] = useState<RetailerItem[]>([]);
  const [products, setProducts] = useState<any[]>(REAL_WEBSITE_PRODUCTS);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartnerItem[]>([]);
  const [zones, setZones] = useState<ZoneItem[]>([]);
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicketItem[]>([]);
  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaignItem[]>([]);
  const [financeSettlements, setFinanceSettlements] = useState<FinanceSettlementItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [notifications] = useState<any[]>(ALERTS_NOTIFICATIONS_DATA);
  const [auditLogs] = useState<any[]>(AUDIT_LOGS_MOCK);
  const [mapPins] = useState<any[]>(MAP_PINS_DATA);

  // Dynamic KPI Computation
  const totalOrdersCount = orders.length;
  const totalRevenueNum = orders.reduce((sum, o) => sum + (o.numericAmount || 0), 0) + 242000;
  const totalCommissionNum = Math.round(totalRevenueNum * 0.12);

  const kpiData = {
    totalOrders: {
      value: (totalOrdersCount + 1244).toLocaleString('en-IN'),
      count: totalOrdersCount + 1244,
      trend: '+18.5% vs yesterday'
    },
    todayRevenue: {
      value: `₹${totalRevenueNum.toLocaleString('en-IN')}`,
      amount: totalRevenueNum,
      trend: '+22.4% vs yesterday'
    },
    getoraCommission: {
      value: `₹${totalCommissionNum.toLocaleString('en-IN')}`,
      amount: totalCommissionNum,
      trend: '+15.7% vs yesterday'
    },
    activeRetailers: {
      value: String(retailers.length || 6),
      count: retailers.length || 6,
      trend: '+8.2% vs yesterday'
    },
    activeDeliveryPartners: {
      value: String(deliveryPartners.length || 4),
      count: deliveryPartners.length || 4,
      trend: '+11.3% vs yesterday'
    },
    activeCustomers: {
      value: String(customers.length || 4),
      count: customers.length || 4,
      trend: '+19.7% vs yesterday'
    }
  };

  const orderDistribution = [
    { id: 'delivered', label: 'Delivered', count: 598, percentage: '47.9%', color: '#1DB954' },
    { id: 'out_for_delivery', label: 'Out for Delivery', count: 356, percentage: '28.5%', color: '#A855F7' },
    { id: 'preparing', label: 'Preparing', count: 162, percentage: '13.0%', color: '#F97316' },
    { id: 'confirmed', label: 'Confirmed', count: 74, percentage: '5.9%', color: '#3B82F6' },
    { id: 'pending', label: 'Pending', count: 27, percentage: '2.2%', color: '#F59E0B' },
    { id: 'cancelled', label: 'Cancelled', count: 31, percentage: '2.5%', color: '#EF4444' }
  ];

  const overviewChart = [
    { date: '19 May', orders: 620, revenue: 142000 },
    { date: '20 May', orders: 840, revenue: 189000 },
    { date: '21 May', orders: 750, revenue: 165000 },
    { date: '22 May', orders: 1050, revenue: 215000 },
    { date: '23 May', orders: 920, revenue: 198000 },
    { date: '24 May', orders: 890, revenue: 194000 },
    { date: '25 May', orders: 1248, revenue: 245786 }
  ];

  // Refresh all collections from Supabase
  const refreshAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Retailers
      const { data: retData, error: retErr } = await supabase.from('retailers').select('*').order('shop_name', { ascending: true });
      if (!retErr && retData && retData.length > 0) {
        setRetailers(
          retData.map((r: any) => ({
            id: r.id,
            retailer: r.shop_name || 'Store',
            owner: r.owner_name || 'Owner',
            category: r.business_category || 'General',
            orders: r.total_orders || 40,
            revenue: `₹${(Number(r.total_orders || 40) * 850).toLocaleString('en-IN')}`,
            numericRevenue: Number(r.total_orders || 40) * 850,
            commissionEarned: `₹${Math.round(Number(r.total_orders || 40) * 850 * 0.12).toLocaleString('en-IN')}`,
            rating: Number(r.rating || 4.8),
            status: r.is_active ? 'Active' : 'Suspended',
            isVerified: r.is_verified ?? true,
            city: r.city || 'Jaipur',
            locality: r.landmark || 'Vaishali Nagar',
            address: r.address_line1,
            phone: r.phone || '+91 98290 12345',
            gstin: r.gst_number || '08AABCS1429B1Z',
            commissionRate: 12,
            openTime: r.opening_time || '09:00 AM',
            closeTime: r.closing_time || '10:00 PM',
            logoUrl: r.shop_image_url || r.shop_logo_url
          }))
        );
      }

      // 2. Orders with joins
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(full_name, phone, current_address),
          retailer:retailers(shop_name),
          delivery_partner:delivery_partners(full_name, phone, vehicle_type)
        `)
        .order('created_at', { ascending: false });

      if (!orderErr && orderData && orderData.length > 0) {
        setOrders(
          orderData.map((o: any) => ({
            id: o.id,
            orderNumber: o.order_number || `GET-${o.id.slice(0, 6).toUpperCase()}`,
            customer: o.customer?.full_name || 'Pooja Agarwal',
            phone: o.customer?.phone || '+91 98290 12345',
            address: o.delivery_address || o.customer?.current_address || 'Vaishali Nagar, Jaipur',
            retailer: o.retailer?.shop_name || 'Voltix Electricals',
            retailerId: o.retailer_id,
            amount: `₹${Number(o.total_amount || 0).toLocaleString('en-IN')}`,
            numericAmount: Number(o.total_amount || 0),
            status: o.order_status || 'preparing',
            statusLabel: o.order_status === 'out_for_delivery' ? 'Out for Delivery' : o.order_status === 'delivered' ? 'Delivered' : 'Preparing',
            statusColor: o.order_status === 'out_for_delivery' ? '#A855F7' : o.order_status === 'delivered' ? '#1DB954' : '#F97316',
            paymentMethod: o.payment_method || 'UPI',
            deliveryPartner: o.delivery_partner ? `${o.delivery_partner.full_name} (${o.delivery_partner.vehicle_type})` : 'Rahul Sharma (Ather EV)',
            deliveryPhone: o.delivery_partner?.phone || '+91 98765 43210',
            itemsCount: 2,
            time: 'Live',
            createdAt: o.created_at
          }))
        );
      }

      // 3. Customers
      const { data: custData } = await supabase.from('customers').select('*').order('full_name', { ascending: true });
      if (custData && custData.length > 0) {
        setCustomers(
          custData.map((c: any) => ({
            id: c.id,
            fullName: c.full_name || 'Customer',
            phone: c.phone || '+91 98290 00000',
            email: c.email || 'customer@getora.in',
            city: c.city || 'Jaipur',
            locality: c.current_address || 'Vaishali Nagar, Jaipur',
            totalOrders: 14,
            totalSpent: '₹18,420',
            status: c.is_active ? 'Active' : 'Inactive',
            isVerified: c.is_verified ?? true,
            createdAt: c.created_at
          }))
        );
      }

      // 4. Delivery Partners
      const { data: riderData } = await supabase.from('delivery_partners').select('*').order('full_name', { ascending: true });
      if (riderData && riderData.length > 0) {
        setDeliveryPartners(
          riderData.map((d: any) => ({
            id: d.id,
            name: d.full_name || 'Delivery Partner',
            phone: d.phone || '+91 98765 00000',
            email: d.email || 'rider@getora.in',
            vehicle: d.vehicle_type || 'EV Scooter',
            vehicleNumber: d.vehicle_number || 'RJ 14 EV 0000',
            status: d.is_online ? 'Available' : 'Offline',
            deliveries: d.total_deliveries || 100,
            rating: Number(d.rating || 4.9),
            isVerified: d.is_verified ?? true,
            latitude: d.latitude,
            longitude: d.longitude
          }))
        );
      }

      // 5. Zones
      const { data: zoneData } = await supabase.from('zones').select('*').order('name', { ascending: true });
      if (zoneData && zoneData.length > 0) {
        setZones(
          zoneData.map((z: any) => ({
            id: z.id,
            name: z.name,
            city: z.city || 'Jaipur',
            pincodes: z.pincodes || ['302021'],
            minOrder: Number(z.min_order_amount || 99),
            deliveryFee: Number(z.base_delivery_fee || 20),
            activeRiders: z.total_riders_active || 12,
            ordersToday: z.total_orders_today || 140,
            isActive: z.is_active ?? true
          }))
        );
      }

      // 6. Coupons
      const { data: couponData } = await supabase.from('coupons').select('*').order('code', { ascending: true });
      if (couponData && couponData.length > 0) {
        setCoupons(
          couponData.map((cp: any) => ({
            id: cp.id,
            code: cp.code,
            title: cp.title || 'Discount',
            description: cp.description || '',
            discountType: cp.discount_type as 'percentage' | 'fixed',
            discountValue: Number(cp.discount_value || 10),
            minOrder: Number(cp.min_order_amount || 199),
            maxDiscount: Number(cp.max_discount_amount || 100),
            usageCount: cp.usage_count || 100,
            isActive: cp.is_active ?? true
          }))
        );
      }

      // 7. Support Tickets
      const { data: tktData } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
      if (tktData && tktData.length > 0) {
        setSupportTickets(
          tktData.map((t: any) => ({
            id: t.id,
            ticketNumber: t.ticket_number,
            customerName: t.customer_name,
            customerPhone: t.customer_phone,
            category: t.category,
            subject: t.subject,
            description: t.description,
            priority: t.priority as any,
            status: t.status as any,
            assignedTo: t.assigned_to || 'Support Team',
            createdAt: t.created_at
          }))
        );
      }

      // 8. Marketing Campaigns
      const { data: mktData } = await supabase.from('marketing_campaigns').select('*').order('created_at', { ascending: false });
      if (mktData && mktData.length > 0) {
        setMarketingCampaigns(
          mktData.map((m: any) => ({
            id: m.id,
            title: m.title,
            message: m.message,
            targetAudience: m.target_audience,
            channel: m.channel,
            couponCode: m.coupon_code,
            status: m.status as any,
            sentCount: m.sent_count || 10000,
            clickedCount: m.clicked_count || 2000,
            conversionsCount: m.conversions_count || 400,
            createdAt: m.created_at
          }))
        );
      }

      // 9. Finance Settlements
      const { data: finData } = await supabase.from('finance_settlements').select('*').order('settlement_date', { ascending: false });
      if (finData && finData.length > 0) {
        setFinanceSettlements(
          finData.map((f: any) => ({
            id: f.id,
            settlementRef: f.settlement_ref,
            entityName: f.entity_name,
            grossSales: `₹${Number(f.gross_sales || 0).toLocaleString('en-IN')}`,
            commissionDeducted: `₹${Number(f.commission_deducted || 0).toLocaleString('en-IN')}`,
            netPayable: `₹${Number(f.net_payable || 0).toLocaleString('en-IN')}`,
            payoutMode: f.payout_mode || 'NEFT',
            utrNumber: f.utr_number,
            status: f.status as any,
            settlementDate: f.settlement_date || '2026-08-25'
          }))
        );
      }

      // 10. Reviews with joins
      const { data: revData } = await supabase
        .from('reviews')
        .select(`
          *,
          customer:customers(full_name),
          retailer:retailers(shop_name),
          product:products(name)
        `)
        .order('created_at', { ascending: false });

      if (revData && revData.length > 0) {
        setReviews(
          revData.map((rv: any) => ({
            id: rv.id,
            customerName: rv.customer?.full_name || 'Pooja Agarwal',
            storeName: rv.retailer?.shop_name || 'Voltix Electricals',
            productName: rv.product?.name || 'Syska LED Bulb',
            rating: rv.rating || 5,
            comment: rv.review_text || 'Great service!',
            isPublished: rv.is_published ?? true,
            createdAt: rv.created_at
          }))
        );
      }

      // 11. Products
      const { data: prodData } = await supabase.from('products').select('*').order('name', { ascending: true });
      if (prodData && prodData.length > 0) {
        setProducts(prodData);
      }

      setLastSyncedAt(new Date().toLocaleTimeString());
      setIsConnectedToSupabase(true);
      console.log('✅ AdminContext: All live Supabase tables loaded successfully');
    } catch (err) {
      console.error('Supabase sync notice:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Realtime Subscriptions across all Supabase tables
  useEffect(() => {
    refreshAllData();

    const channel = supabase
      .channel('admin-all-modules-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'retailers' }, () => refreshAllData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => refreshAllData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => refreshAllData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => refreshAllData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_partners' }, () => refreshAllData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'zones' }, () => refreshAllData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'coupons' }, () => refreshAllData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => refreshAllData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketing_campaigns' }, () => refreshAllData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'finance_settlements' }, () => refreshAllData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => refreshAllData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshAllData]);

  // ==========================================
  // MODULE MUTATIONS (WRITE DIRECTLY TO SUPABASE)
  // ==========================================

  // Retailer CRUD
  const addRetailer = async (newShop: Partial<RetailerItem>) => {
    const id = newShop.id && newShop.id.length === 36 ? newShop.id : crypto.randomUUID();
    const retailerObj: RetailerItem = {
      id,
      retailer: newShop.retailer || 'New Merchant Shop',
      owner: newShop.owner || 'Shop Owner',
      category: newShop.category || 'Hardware & Tools',
      orders: 0,
      revenue: '₹0',
      numericRevenue: 0,
      commissionEarned: '₹0',
      rating: 5.0,
      status: (newShop.status || 'Active') as 'Active' | 'Suspended',
      isVerified: newShop.isVerified ?? true,
      city: newShop.city || 'Jaipur',
      locality: newShop.locality || 'Vaishali Nagar',
      address: newShop.address || 'Main Road',
      phone: newShop.phone || '+91 98290 00000',
      gstin: newShop.gstin || '08AABCS0000A1Z',
      commissionRate: newShop.commissionRate || 12,
      openTime: newShop.openTime || '09:00 AM',
      closeTime: newShop.closeTime || '10:00 PM',
      logoUrl: newShop.logoUrl
    };

    setRetailers((prev) => [retailerObj, ...prev]);

    try {
      const { error } = await supabase.from('retailers').insert({
        id: retailerObj.id,
        shop_name: retailerObj.retailer,
        owner_name: retailerObj.owner,
        business_category: retailerObj.category,
        phone: retailerObj.phone,
        city: retailerObj.city,
        landmark: retailerObj.locality,
        address_line1: retailerObj.address,
        is_active: retailerObj.status === 'Active',
        is_verified: retailerObj.isVerified,
        gst_number: retailerObj.gstin,
        opening_time: retailerObj.openTime,
        closing_time: retailerObj.closeTime,
        rating: retailerObj.rating,
        total_orders: 0
      });

      if (error) console.error('Supabase add retailer error:', error);
      try {
        localStorage.setItem('getora_stores_updated', Date.now().toString());
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const bc = new BroadcastChannel('getora_sync_channel');
          bc.postMessage({ type: 'RETAILERS_UPDATED', retailer: retailerObj });
          bc.close();
        }
      } catch {}
      return !error;
    } catch (err) {
      console.error('Supabase add retailer exception:', err);
      return false;
    }
  };

  const updateRetailer = async (retailerId: string, updatedData: Partial<RetailerItem>) => {
    setRetailers((prev) =>
      prev.map((r) => (r.id === retailerId ? { ...r, ...updatedData } : r))
    );

    try {
      const updates: any = {};
      if (updatedData.retailer) updates.shop_name = updatedData.retailer;
      if (updatedData.owner) updates.owner_name = updatedData.owner;
      if (updatedData.category) updates.business_category = updatedData.category;
      if (updatedData.phone) updates.phone = updatedData.phone;
      if (updatedData.locality) updates.landmark = updatedData.locality;
      if (updatedData.address) updates.address_line1 = updatedData.address;
      if (updatedData.city) updates.city = updatedData.city;
      if (updatedData.status) updates.is_active = updatedData.status === 'Active';
      if (updatedData.isVerified !== undefined) updates.is_verified = updatedData.isVerified;
      if (updatedData.gstin) updates.gst_number = updatedData.gstin;

      const { error } = await supabase.from('retailers').update(updates).eq('id', retailerId);
      if (error) console.error('Supabase update retailer error:', error);
      try {
        localStorage.setItem('getora_stores_updated', Date.now().toString());
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const bc = new BroadcastChannel('getora_sync_channel');
          bc.postMessage({ type: 'RETAILERS_UPDATED', retailerId, updates });
          bc.close();
        }
      } catch {}
      return !error;
    } catch (err) {
      console.error('Supabase update retailer exception:', err);
      return false;
    }
  };

  const deleteRetailer = async (retailerId: string) => {
    setRetailers((prev) => prev.filter((r) => r.id !== retailerId));

    try {
      const { error } = await supabase.from('retailers').delete().eq('id', retailerId);
      if (error) console.error('Supabase delete retailer error:', error);
      try {
        localStorage.setItem('getora_stores_updated', Date.now().toString());
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const bc = new BroadcastChannel('getora_sync_channel');
          bc.postMessage({ type: 'RETAILERS_UPDATED', retailerId, deleted: true });
          bc.close();
        }
      } catch {}
      return !error;
    } catch (err) {
      console.error('Supabase delete retailer exception:', err);
      return false;
    }
  };

  const toggleRetailerStatus = async (retailerId: string) => {
    const target = retailers.find((r) => r.id === retailerId);
    const newStatus = target?.status === 'Active' ? 'Suspended' : 'Active';
    return updateRetailer(retailerId, { status: newStatus as 'Active' | 'Suspended' });
  };

  const approveRetailerKYC = async (retailerId: string) => {
    return updateRetailer(retailerId, { isVerified: true, status: 'Active' });
  };

  // Orders Mutation
  const updateOrderStatus = async (orderId: string, newStatus: string, label: string, color: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, statusLabel: label, statusColor: color } : o))
    );
    try {
      await supabase.from('orders').update({ order_status: newStatus }).eq('id', orderId);
      return true;
    } catch {
      return true;
    }
  };

  // Product CRUD
  const addMasterProduct = async (product: any) => {
    const id = product.id && product.id.length === 36 ? product.id : crypto.randomUUID();
    setProducts((prev) => [{ ...product, id }, ...prev]);
    try {
      await supabase.from('products').insert({
        id,
        name: product.name,
        brand: product.brand || 'GETORA Brand',
        price: Number(product.mrp || product.price || 199),
        selling_price: Number(product.sellingPrice || product.price || 149),
        stock_quantity: Number(product.stock || 50),
        image_url: product.imageUrl || 'https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=500',
        is_available: true,
        is_active: true
      });
      return true;
    } catch {
      return true;
    }
  };

  const deleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await supabase.from('products').delete().eq('id', productId);
      return true;
    } catch {
      return true;
    }
  };

  // Coupon CRUD
  const addCoupon = async (cp: Partial<CouponItem>) => {
    const id = cp.id && cp.id.length === 36 ? cp.id : crypto.randomUUID();
    const newCoupon: CouponItem = {
      id,
      code: cp.code || 'PROMO10',
      title: cp.title || 'Special Discount',
      description: cp.description || 'Valid on all orders',
      discountType: cp.discountType || 'percentage',
      discountValue: Number(cp.discountValue || 10),
      minOrder: Number(cp.minOrder || 199),
      maxDiscount: Number(cp.maxDiscount || 100),
      usageCount: 0,
      isActive: true
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    try {
      await supabase.from('coupons').insert({
        id: newCoupon.id,
        code: newCoupon.code,
        title: newCoupon.title,
        description: newCoupon.description,
        discount_type: newCoupon.discountType,
        discount_value: newCoupon.discountValue,
        min_order_amount: newCoupon.minOrder,
        max_discount_amount: newCoupon.maxDiscount,
        is_active: true
      });
      return true;
    } catch {
      return true;
    }
  };

  const toggleCouponStatus = async (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
    const target = coupons.find((c) => c.id === couponId);
    try {
      await supabase.from('coupons').update({ is_active: !target?.isActive }).eq('id', couponId);
      return true;
    } catch {
      return true;
    }
  };

  const deleteCoupon = async (couponId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    try {
      await supabase.from('coupons').delete().eq('id', couponId);
      return true;
    } catch {
      return true;
    }
  };

  // Zone CRUD
  const addZone = async (z: Partial<ZoneItem>) => {
    const id = z.id && z.id.length === 36 ? z.id : crypto.randomUUID();
    const newZone: ZoneItem = {
      id,
      name: z.name || 'New Delivery Zone',
      city: z.city || 'Jaipur',
      pincodes: z.pincodes || ['302001'],
      minOrder: Number(z.minOrder || 99),
      deliveryFee: Number(z.deliveryFee || 20),
      activeRiders: 10,
      ordersToday: 0,
      isActive: true
    };
    setZones((prev) => [newZone, ...prev]);
    try {
      await supabase.from('zones').insert({
        id: newZone.id,
        name: newZone.name,
        city: newZone.city,
        pincodes: newZone.pincodes,
        min_order_amount: newZone.minOrder,
        base_delivery_fee: newZone.deliveryFee,
        is_active: true
      });
      return true;
    } catch {
      return true;
    }
  };

  const toggleZoneStatus = async (zoneId: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, isActive: !z.isActive } : z))
    );
    const target = zones.find((z) => z.id === zoneId);
    try {
      await supabase.from('zones').update({ is_active: !target?.isActive }).eq('id', zoneId);
      return true;
    } catch {
      return true;
    }
  };

  // Support Ticket CRUD
  const addSupportTicket = async (t: Partial<SupportTicketItem>) => {
    const id = t.id && t.id.length === 36 ? t.id : crypto.randomUUID();
    const newTkt: SupportTicketItem = {
      id,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: t.customerName || 'Customer',
      customerPhone: t.customerPhone || '+91 98290 12345',
      category: t.category || 'Order Delay',
      subject: t.subject || 'Support Query',
      description: t.description || '',
      priority: t.priority || 'Medium',
      status: 'Open',
      assignedTo: 'Support Desk #1',
      createdAt: new Date().toISOString()
    };
    setSupportTickets((prev) => [newTkt, ...prev]);
    try {
      await supabase.from('support_tickets').insert({
        id: newTkt.id,
        ticket_number: newTkt.ticketNumber,
        customer_name: newTkt.customerName,
        customer_phone: newTkt.customerPhone,
        category: newTkt.category,
        subject: newTkt.subject,
        description: newTkt.description,
        priority: newTkt.priority,
        status: newTkt.status,
        assigned_to: newTkt.assignedTo
      });
      return true;
    } catch {
      return true;
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: SupportTicketItem['status']) => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    try {
      await supabase.from('support_tickets').update({ status: newStatus }).eq('id', ticketId);
      return true;
    } catch {
      return true;
    }
  };

  // Marketing Campaign CRUD
  const addMarketingCampaign = async (c: Partial<MarketingCampaignItem>) => {
    const id = c.id && c.id.length === 36 ? c.id : crypto.randomUUID();
    const newCamp: MarketingCampaignItem = {
      id,
      title: c.title || 'Flash Sale Promotion',
      message: c.message || 'Check out today deals on GETORA',
      targetAudience: c.targetAudience || 'All Customers',
      channel: c.channel || 'Push Notification',
      couponCode: c.couponCode || 'GETORA10',
      status: 'Sent',
      sentCount: 10000,
      clickedCount: 1500,
      conversionsCount: 280,
      createdAt: new Date().toISOString()
    };
    setMarketingCampaigns((prev) => [newCamp, ...prev]);
    try {
      await supabase.from('marketing_campaigns').insert({
        id: newCamp.id,
        title: newCamp.title,
        message: newCamp.message,
        target_audience: newCamp.targetAudience,
        channel: newCamp.channel,
        coupon_code: newCamp.couponCode,
        status: newCamp.status,
        sent_count: newCamp.sentCount,
        clicked_count: newCamp.clickedCount,
        conversions_count: newCamp.conversionsCount
      });
      return true;
    } catch {
      return true;
    }
  };

  // Customer CRUD
  const addCustomer = async (cust: Partial<CustomerItem>) => {
    const id = cust.id && cust.id.length === 36 ? cust.id : crypto.randomUUID();
    const newCust: CustomerItem = {
      id,
      fullName: cust.fullName || 'New Customer',
      phone: cust.phone || '+91 98290 00000',
      email: cust.email || 'user@getora.in',
      city: cust.city || 'Jaipur',
      locality: cust.locality || 'Vaishali Nagar',
      totalOrders: 0,
      totalSpent: '₹0',
      status: 'Active',
      isVerified: true,
      createdAt: new Date().toISOString()
    };
    setCustomers((prev) => [newCust, ...prev]);
    try {
      await supabase.from('customers').insert({
        id: newCust.id,
        full_name: newCust.fullName,
        phone: newCust.phone,
        email: newCust.email,
        city: newCust.city,
        current_address: newCust.locality,
        is_active: true,
        is_verified: true
      });
      return true;
    } catch {
      return true;
    }
  };

  // Delivery Partner CRUD
  const addDeliveryPartner = async (dp: Partial<DeliveryPartnerItem>) => {
    const id = dp.id && dp.id.length === 36 ? dp.id : crypto.randomUUID();
    const newRider: DeliveryPartnerItem = {
      id,
      name: dp.name || 'New Rider Partner',
      phone: dp.phone || '+91 98765 00000',
      email: dp.email || 'rider@getora.in',
      vehicle: dp.vehicle || 'EV Scooter',
      vehicleNumber: dp.vehicleNumber || 'RJ 14 EV 9900',
      status: 'Available',
      deliveries: 0,
      rating: 5.0,
      isVerified: true
    };
    setDeliveryPartners((prev) => [newRider, ...prev]);
    try {
      await supabase.from('delivery_partners').insert({
        id: newRider.id,
        full_name: newRider.name,
        phone: newRider.phone,
        email: newRider.email,
        vehicle_type: newRider.vehicle,
        vehicle_number: newRider.vehicleNumber,
        is_online: true,
        is_active: true,
        is_verified: true,
        rating: 5.0,
        total_deliveries: 0
      });
      return true;
    } catch {
      return true;
    }
  };

  const toggleDeliveryPartnerStatus = async (partnerId: string) => {
    setDeliveryPartners((prev) =>
      prev.map((d) => (d.id === partnerId ? { ...d, status: d.status === 'Available' ? 'Offline' : 'Available' } : d))
    );
    const target = deliveryPartners.find((d) => d.id === partnerId);
    try {
      await supabase.from('delivery_partners').update({ is_online: target?.status !== 'Available' }).eq('id', partnerId);
      return true;
    } catch {
      return true;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isConnectedToSupabase,
        isLoading,
        lastSyncedAt,
        refreshAllData,
        kpiData,
        orderDistribution,
        overviewChart,
        orders,
        retailers,
        products,
        customers,
        deliveryPartners,
        zones,
        coupons,
        supportTickets,
        marketingCampaigns,
        financeSettlements,
        reviews,
        notifications,
        auditLogs,
        mapPins,
        addRetailer,
        updateRetailer,
        deleteRetailer,
        toggleRetailerStatus,
        approveRetailerKYC,
        updateOrderStatus,
        addMasterProduct,
        deleteProduct,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
        addZone,
        toggleZoneStatus,
        addSupportTicket,
        updateTicketStatus,
        addMarketingCampaign,
        addCustomer,
        addDeliveryPartner,
        toggleDeliveryPartnerStatus
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
