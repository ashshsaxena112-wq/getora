import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  ADMIN_KPI_DATA,
  ORDER_STATUS_DISTRIBUTION,
  STATUS_ACTION_CARDS,
  ORDERS_OVERVIEW_CHART,
  RECENT_ORDERS_DATA,
  TOP_RETAILERS_DATA,
  ALERTS_NOTIFICATIONS_DATA,
  MAP_PINS_DATA,
  AUDIT_LOGS_MOCK
} from '../data/adminMockData';

interface AdminContextType {
  // Connection state
  isConnectedToSupabase: boolean;
  isLoading: boolean;
  lastSyncedAt: string;
  refreshAllData: () => Promise<void>;

  // Metrics
  kpiData: typeof ADMIN_KPI_DATA;
  orderDistribution: typeof ORDER_STATUS_DISTRIBUTION;
  statusCards: typeof STATUS_ACTION_CARDS;
  overviewChart: typeof ORDERS_OVERVIEW_CHART;

  // Data lists
  orders: any[];
  retailers: any[];
  products: any[];
  customers: any[];
  notifications: any[];
  auditLogs: any[];
  mapPins: any[];

  // Real-time Action handlers
  updateOrderStatus: (orderId: string, newStatus: string, label: string, color: string) => Promise<boolean>;
  toggleRetailerStatus: (retailerId: string) => Promise<boolean>;
  approveRetailerKYC: (retailerId: string) => Promise<boolean>;
  addMasterProduct: (product: any) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnectedToSupabase, setIsConnectedToSupabase] = useState(isSupabaseConfigured());
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(new Date().toLocaleTimeString());

  // State data
  const [orders, setOrders] = useState<any[]>(RECENT_ORDERS_DATA);
  const [retailers, setRetailers] = useState<any[]>(TOP_RETAILERS_DATA);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>(ALERTS_NOTIFICATIONS_DATA);
  const [auditLogs, setAuditLogs] = useState<any[]>(AUDIT_LOGS_MOCK);
  const [mapPins, setMapPins] = useState<any[]>(MAP_PINS_DATA);

  // Dynamic KPI Metrics
  const [kpiData, setKpiData] = useState(ADMIN_KPI_DATA);
  const [orderDistribution, setOrderDistribution] = useState(ORDER_STATUS_DISTRIBUTION);
  const [statusCards, setStatusCards] = useState(STATUS_ACTION_CARDS);
  const [overviewChart, setOverviewChart] = useState(ORDERS_OVERVIEW_CHART);

  // Fetch all Supabase data with fallback to mock data
  const refreshAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Retailers from Supabase
      const { data: retData, error: retErr } = await supabase
        .from('retailers')
        .select('*');

      if (!retErr && retData && retData.length > 0) {
        const mappedRetailers = retData.map((r: any) => ({
          id: r.id,
          retailer: r.shop_name || 'Local Store',
          owner: r.owner_name || 'Merchant Owner',
          category: r.business_category || 'General Store',
          orders: r.total_orders || Math.floor(20 + Math.random() * 80),
          revenue: `₹${(Number(r.total_orders || 35) * 850).toLocaleString('en-IN')}`,
          numericRevenue: Number(r.total_orders || 35) * 850,
          commissionEarned: `₹${(Number(r.total_orders || 35) * 850 * 0.12).toLocaleString('en-IN')}`,
          rating: Number(r.rating || 4.8),
          status: r.is_active ? 'Active' : 'Suspended',
          isVerified: r.is_verified ?? true,
          city: r.city || 'Jaipur',
          locality: r.landmark || r.address_line1 || 'Jaipur Central'
        }));
        setRetailers(mappedRetailers);
      }

      // 2. Fetch Orders from Supabase
      const { data: ordData, error: ordErr } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          retailer:retailers(*),
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (!ordErr && ordData && ordData.length > 0) {
        const mappedOrders = ordData.map((o: any) => {
          let statusColor = '#3B82F6';
          let statusLabel = 'Confirmed';
          if (o.status === 'pending') {
            statusColor = '#F59E0B';
            statusLabel = 'Pending';
          } else if (o.status === 'preparing') {
            statusColor = '#F97316';
            statusLabel = 'Preparing';
          } else if (o.status === 'out_for_delivery') {
            statusColor = '#A855F7';
            statusLabel = 'Out for Delivery';
          } else if (o.status === 'delivered') {
            statusColor = '#1DB954';
            statusLabel = 'Delivered';
          } else if (o.status === 'cancelled') {
            statusColor = '#EF4444';
            statusLabel = 'Cancelled';
          }

          return {
            id: o.id,
            orderNumber: o.order_number || `GT${o.id.slice(0, 5).toUpperCase()}`,
            customer: o.customer?.full_name || 'Customer',
            phone: o.customer?.phone || '+91 98290 00000',
            address: o.delivery_address || 'Jaipur, Rajasthan',
            retailer: o.retailer?.shop_name || 'Retailer Shop',
            retailerId: o.retailer_id,
            amount: `₹${Number(o.total_amount || 0).toLocaleString('en-IN')}`,
            numericAmount: Number(o.total_amount || 0),
            status: o.status,
            statusLabel,
            statusColor,
            paymentMethod: o.payment_method || 'Online UPI',
            deliveryPartner: o.delivery_partner_id ? 'Assigned Rider' : 'Auto Assigning...',
            deliveryPhone: '—',
            itemsCount: o.items?.length || 1,
            items: o.items?.map((it: any) => ({
              name: it.product_name || 'Item',
              quantity: it.quantity || 1,
              price: Number(it.unit_price || 0)
            })) || [],
            time: 'Just now',
            createdAt: o.created_at
          };
        });
        setOrders(mappedOrders);
      }

      // 3. Fetch Products from Supabase
      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (!prodErr && prodData) {
        setProducts(prodData);
      }

      // 4. Fetch Customers from Supabase
      const { data: custData, error: custErr } = await supabase
        .from('customers')
        .select('*');

      if (!custErr && custData) {
        setCustomers(custData);
      }

      setLastSyncedAt(new Date().toLocaleTimeString());
      setIsConnectedToSupabase(true);
    } catch (err) {
      console.warn('[AdminContext] Supabase live query notice (falling back to mock store):', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Real-time Supabase subscription on Orders and Retailers
  useEffect(() => {
    refreshAllData();

    // Subscribe to realtime orders
    const ordersSubscription = supabase
      .channel('admin-live-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        console.log('⚡ Realtime Order Update Received in Admin:', payload);
        refreshAllData();
        // Add dynamic notification
        setNotifications((prev) => [
          {
            id: `alt-${Date.now()}`,
            type: 'info',
            title: `Live Order Updated (${payload.eventType})`,
            description: `Order table modified in real-time by customer platform.`,
            timestamp: 'Just now',
            read: false,
            linkTab: 'orders'
          },
          ...prev
        ]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, [refreshAllData]);

  // Order status mutation
  const updateOrderStatus = async (
    orderId: string,
    newStatus: string,
    label: string,
    color: string
  ): Promise<boolean> => {
    // 1. Optimistic UI update
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus, statusLabel: label, statusColor: color } : o
      )
    );

    // 2. Persist to Supabase
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      return true;
    } catch (err) {
      console.error('Error updating order status in Supabase:', err);
      return false;
    }
  };

  // Toggle Retailer active status
  const toggleRetailerStatus = async (retailerId: string): Promise<boolean> => {
    const target = retailers.find((r) => r.id === retailerId);
    const newStatus = target?.status === 'Active' ? 'Suspended' : 'Active';
    const isActive = newStatus === 'Active';

    setRetailers((prev) =>
      prev.map((r) => (r.id === retailerId ? { ...r, status: newStatus } : r))
    );

    try {
      await supabase.from('retailers').update({ is_active: isActive }).eq('id', retailerId);
      return true;
    } catch (err) {
      console.error('Error updating retailer status in Supabase:', err);
      return false;
    }
  };

  // 1-Click Approve Retailer KYC
  const approveRetailerKYC = async (retailerId: string): Promise<boolean> => {
    setRetailers((prev) =>
      prev.map((r) => (r.id === retailerId ? { ...r, isVerified: true, status: 'Active' } : r))
    );

    try {
      await supabase.from('retailers').update({ is_verified: true, is_active: true }).eq('id', retailerId);
      return true;
    } catch (err) {
      console.error('Error approving retailer in Supabase:', err);
      return false;
    }
  };

  // Add Master Product
  const addMasterProduct = async (prod: any): Promise<boolean> => {
    setProducts((prev) => [prod, ...prev]);
    try {
      await supabase.from('products').insert({
        name: prod.name,
        brand: prod.brand,
        price: prod.suggestedPrice,
        selling_price: prod.suggestedSellingPrice,
        unit: prod.unit,
        sku: prod.sku,
        image_url: prod.imageUrl,
        description: prod.description,
        is_active: true
      });
      return true;
    } catch (err) {
      console.error('Error adding master product in Supabase:', err);
      return false;
    }
  };

  // Delete Product
  const deleteProduct = async (productId: string): Promise<boolean> => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await supabase.from('products').update({ is_active: false }).eq('id', productId);
      return true;
    } catch (err) {
      console.error('Error removing product in Supabase:', err);
      return false;
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
        statusCards,
        overviewChart,
        orders,
        retailers,
        products,
        customers,
        notifications,
        auditLogs,
        mapPins,
        updateOrderStatus,
        toggleRetailerStatus,
        approveRetailerKYC,
        addMasterProduct,
        deleteProduct
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
