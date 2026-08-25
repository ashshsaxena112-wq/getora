import {
  AdminAuditLog,
  AdminDeliveryPartner,
  AdminSupportTicket,
  AdminNotification,
  AdminCoupon,
  AdminZone
} from '../types/admin';

export const ADMIN_KPI_DATA = {
  totalOrders: { value: '1,248', count: 1248, trend: '+18.5% vs yesterday', isPositive: true },
  todayRevenue: { value: '₹2,45,786', amount: 245786, trend: '+22.4% vs yesterday', isPositive: true },
  getoraCommission: { value: '₹36,847', amount: 36847, trend: '+15.7% vs yesterday', isPositive: true },
  activeRetailers: { value: '356', count: 356, trend: '+8.2% vs yesterday', isPositive: true },
  activeDeliveryPartners: { value: '178', count: 178, trend: '+11.3% vs yesterday', isPositive: true },
  activeCustomers: { value: '3,218', count: 3218, trend: '+19.7% vs yesterday', isPositive: true }
};

export const ORDER_STATUS_DISTRIBUTION = [
  { id: 'pending', label: 'Pending', count: 27, percentage: '2.2%', color: '#F59E0B' },
  { id: 'confirmed', label: 'Confirmed', count: 74, percentage: '5.9%', color: '#3B82F6' },
  { id: 'preparing', label: 'Preparing', count: 162, percentage: '13.0%', color: '#F97316' },
  { id: 'out_for_delivery', label: 'Out for Delivery', count: 356, percentage: '28.5%', color: '#A855F7' },
  { id: 'delivered', label: 'Delivered', count: 598, percentage: '47.9%', color: '#1DB954' },
  { id: 'cancelled', label: 'Cancelled', count: 31, percentage: '2.5%', color: '#EF4444' }
];

export const STATUS_ACTION_CARDS = [
  { id: 'pending', label: 'Pending Orders', count: 27, color: '#F59E0B', linkTab: 'orders-pending' as const },
  { id: 'preparing', label: 'Preparing Orders', count: 162, color: '#F97316', linkTab: 'orders-active' as const },
  { id: 'out_for_delivery', label: 'Out for Delivery', count: 356, color: '#A855F7', linkTab: 'orders-active' as const },
  { id: 'delivered', label: 'Delivered Orders', count: 598, color: '#1DB954', linkTab: 'orders-completed' as const },
  { id: 'cancelled', label: 'Cancelled Orders', count: 31, color: '#EF4444', linkTab: 'orders-cancelled' as const },
  { id: 'refunds', label: 'Refunds Pending', count: 17, color: '#3B82F6', linkTab: 'orders-refunds' as const }
];

export const ORDERS_OVERVIEW_CHART = [
  { date: '19 May', orders: 620, revenue: 142000 },
  { date: '20 May', orders: 840, revenue: 189000 },
  { date: '21 May', orders: 750, revenue: 165000 },
  { date: '22 May', orders: 1050, revenue: 215000 },
  { date: '23 May', orders: 920, revenue: 198000 },
  { date: '24 May', orders: 890, revenue: 194000 },
  { date: '25 May', orders: 1248, revenue: 245786 }
];

export const RECENT_ORDERS_DATA = [
  {
    id: 'ord-10248',
    orderNumber: 'GT10248',
    customer: 'Rahul Sharma',
    phone: '+91 98290 12345',
    address: 'Flat 402, Royal Palms, Vaishali Nagar, Jaipur',
    retailer: 'Sharma Hardware',
    retailerId: 'store-1',
    amount: '₹1,256',
    numericAmount: 1256,
    status: 'preparing' as const,
    statusLabel: 'Preparing',
    statusColor: '#F97316',
    paymentMethod: 'UPI (PhonePe)',
    deliveryPartner: 'Vikram Gurjar',
    deliveryPhone: '+91 94140 88231',
    itemsCount: 3,
    items: [
      { name: 'Stanley 13mm Impact Drill Bit Set (10 Pcs)', quantity: 1, price: 650 },
      { name: 'Anchor 6A 3-Pin Socket Pack', quantity: 2, price: 180 },
      { name: 'Fevicol SH Ultimate Wood Adhesive (500g)', quantity: 1, price: 246 }
    ],
    time: '8 mins ago',
    createdAt: '2026-05-25T15:42:00Z'
  },
  {
    id: 'ord-10247',
    orderNumber: 'GT10247',
    customer: 'Priya Verma',
    phone: '+91 97841 55678',
    address: 'B-12, Sector 5, Malviya Nagar, Jaipur',
    retailer: 'Gupta Electricals',
    retailerId: 'store-2',
    amount: '₹2,450',
    numericAmount: 2450,
    status: 'out_for_delivery' as const,
    statusLabel: 'Out for Delivery',
    statusColor: '#A855F7',
    paymentMethod: 'Credit Card (Razorpay)',
    deliveryPartner: 'Sunil Kumar',
    deliveryPhone: '+91 99281 44512',
    itemsCount: 4,
    items: [
      { name: 'Havells 10W B22 LED Cool Day Light (Pack of 4)', quantity: 2, price: 720 },
      { name: 'Finolex 1.5 sq mm Flame Guard Wire (90m, Red)', quantity: 1, price: 1730 }
    ],
    time: '18 mins ago',
    createdAt: '2026-05-25T15:32:00Z'
  },
  {
    id: 'ord-10246',
    orderNumber: 'GT10246',
    customer: 'Amit Kumar',
    phone: '+91 96102 33490',
    address: '14, Lane 3, Mansarovar, Jaipur',
    retailer: 'Mobile Hub',
    retailerId: 'store-3',
    amount: '₹1,899',
    numericAmount: 1899,
    status: 'delivered' as const,
    statusLabel: 'Delivered',
    statusColor: '#1DB954',
    paymentMethod: 'Cash on Delivery (COD)',
    deliveryPartner: 'Manish Saini',
    deliveryPhone: '+91 93510 77123',
    itemsCount: 2,
    items: [
      { name: 'boAt 65W GaN Fast Dual Charger', quantity: 1, price: 1499 },
      { name: 'Type-C to Type-C Braided Cable (1.5m)', quantity: 1, price: 400 }
    ],
    time: '34 mins ago',
    createdAt: '2026-05-25T15:16:00Z'
  },
  {
    id: 'ord-10245',
    orderNumber: 'GT10245',
    customer: 'Neha Singh',
    phone: '+91 98280 66723',
    address: 'House 88, Jagatpura Main Road, Jaipur',
    retailer: 'Stationery Point',
    retailerId: 'store-4',
    amount: '₹456',
    numericAmount: 456,
    status: 'confirmed' as const,
    statusLabel: 'Confirmed',
    statusColor: '#3B82F6',
    paymentMethod: 'Paytm Wallet',
    deliveryPartner: 'Assigning partner...',
    deliveryPhone: '—',
    itemsCount: 5,
    items: [
      { name: 'Classmate Spiral Bound Notebook (Pack of 3)', quantity: 1, price: 210 },
      { name: 'Parker Vector Rollerball Pen', quantity: 1, price: 246 }
    ],
    time: '42 mins ago',
    createdAt: '2026-05-25T15:08:00Z'
  },
  {
    id: 'ord-10244',
    orderNumber: 'GT10244',
    customer: 'Ravi Saini',
    phone: '+91 94140 11984',
    address: 'Shop 4, Tonk Road, Jaipur',
    retailer: 'Sharma Hardware',
    retailerId: 'store-1',
    amount: '₹789',
    numericAmount: 789,
    status: 'cancelled' as const,
    statusLabel: 'Cancelled',
    statusColor: '#EF4444',
    paymentMethod: 'UPI',
    deliveryPartner: 'None',
    deliveryPhone: '—',
    itemsCount: 1,
    items: [
      { name: 'Godrej Nav-Tal 7 Levers Brass Padlock (60mm)', quantity: 1, price: 789 }
    ],
    time: '1 hour ago',
    createdAt: '2026-05-25T14:45:00Z'
  }
];

export const TOP_RETAILERS_DATA = [
  {
    id: 'ret-1',
    retailer: 'Sharma Hardware',
    owner: 'Ramesh Sharma',
    category: 'Hardware & Tools',
    orders: 128,
    revenue: '₹1,28,450',
    numericRevenue: 128450,
    commissionEarned: '₹15,414',
    rating: 4.8,
    status: 'Active',
    city: 'Jaipur',
    locality: 'Vaishali Nagar'
  },
  {
    id: 'ret-2',
    retailer: 'Gupta Electricals',
    owner: 'Suresh Gupta',
    category: 'Electrical & Lighting',
    orders: 97,
    revenue: '₹98,760',
    numericRevenue: 98760,
    commissionEarned: '₹11,851',
    rating: 4.7,
    status: 'Active',
    city: 'Jaipur',
    locality: 'Malviya Nagar'
  },
  {
    id: 'ret-3',
    retailer: 'Mobile Hub',
    owner: 'Ankit Jain',
    category: 'Mobile Accessories',
    orders: 86,
    revenue: '₹76,540',
    numericRevenue: 76540,
    commissionEarned: '₹9,184',
    rating: 4.6,
    status: 'Active',
    city: 'Jaipur',
    locality: 'Mansarovar'
  },
  {
    id: 'ret-4',
    retailer: 'Stationery Point',
    owner: 'Deepak Agarwal',
    category: 'Stationery & Office',
    orders: 65,
    revenue: '₹45,210',
    numericRevenue: 45210,
    commissionEarned: '₹5,425',
    rating: 4.9,
    status: 'Active',
    city: 'Jaipur',
    locality: 'Jagatpura'
  },
  {
    id: 'ret-5',
    retailer: 'Home Needs Store',
    owner: 'Vikas Meena',
    category: 'Home & Kitchen',
    orders: 54,
    revenue: '₹39,780',
    numericRevenue: 39780,
    commissionEarned: '₹4,773',
    rating: 4.5,
    status: 'Active',
    city: 'Jaipur',
    locality: 'Tonk Road'
  }
];

export const ALERTS_NOTIFICATIONS_DATA: AdminNotification[] = [
  {
    id: 'alt-1',
    type: 'critical',
    title: '20 orders are delayed',
    description: 'Some orders are taking more than expected time in Mansarovar & Malviya Nagar.',
    timestamp: '10 min ago',
    read: false,
    linkTab: 'orders-active'
  },
  {
    id: 'alt-2',
    type: 'warning',
    title: 'Low stock alert',
    description: '152 products are low in stock (< 5 units remaining across 14 merchant stores).',
    timestamp: '25 min ago',
    read: false,
    linkTab: 'inventory-low'
  },
  {
    id: 'alt-3',
    type: 'info',
    title: 'New retailer pending',
    description: '12 new retailers are waiting for GST/KYC verification & catalog onboarding.',
    timestamp: '1 hour ago',
    read: false,
    linkTab: 'retailers-pending'
  },
  {
    id: 'alt-4',
    type: 'success',
    title: 'Payouts completed',
    description: 'Retailer payouts of ₹1,25,000 completed via instant NEFT batch transfer.',
    timestamp: '2 hours ago',
    read: true,
    linkTab: 'finance-retailer-settlement'
  }
];

export const MAP_PINS_DATA = [
  { id: 'pin-1', type: 'rider', name: 'Rider #14 (Vikram)', status: 'On Delivery', eta: '6 mins', x: '42%', y: '48%', color: '#1DB954' },
  { id: 'pin-2', type: 'rider', name: 'Rider #28 (Sunil)', status: 'Going to Pickup', eta: '4 mins', x: '72%', y: '36%', color: '#1DB954' },
  { id: 'pin-3', type: 'rider', name: 'Rider #09 (Manish)', status: 'Online (Available)', eta: 'Idle', x: '58%', y: '64%', color: '#1DB954' },
  { id: 'pin-4', type: 'order', name: 'Order #GT10247', status: 'En-route', customer: 'Priya Verma', x: '75%', y: '40%', color: '#3B82F6' },
  { id: 'pin-5', type: 'order', name: 'Order #GT10248', status: 'Preparing', customer: 'Rahul Sharma', x: '40%', y: '52%', color: '#3B82F6' },
  { id: 'pin-6', type: 'shop', name: 'Sharma Hardware', status: 'Open', activeOrders: 4, x: '38%', y: '50%', color: '#F97316' },
  { id: 'pin-7', type: 'shop', name: 'Gupta Electricals', status: 'Open', activeOrders: 3, x: '70%', y: '35%', color: '#F97316' },
  { id: 'pin-8', type: 'shop', name: 'Mobile Hub', status: 'Open', activeOrders: 2, x: '55%', y: '60%', color: '#F97316' }
];

export const AUDIT_LOGS_MOCK: AdminAuditLog[] = [
  {
    id: 'log-1',
    adminName: 'Super Admin',
    adminEmail: 'admin@getora.com',
    action: 'Approved Retailer KYC',
    entityType: 'Retailer',
    entityId: 'ret-6',
    details: 'Verified GSTIN08AABCS1429B1Z and bank documents for Apex Mobile Store.',
    ipAddress: '122.160.144.18',
    timestamp: '25 May 2026, 4:32 PM'
  },
  {
    id: 'log-2',
    adminName: 'Super Admin',
    adminEmail: 'admin@getora.com',
    action: 'Changed Retailer Commission',
    entityType: 'Finance',
    entityId: 'ret-1',
    details: 'Updated Sharma Hardware commission rate from 10% to 12%.',
    ipAddress: '122.160.144.18',
    timestamp: '25 May 2026, 3:15 PM'
  },
  {
    id: 'log-3',
    adminName: 'Catalog Admin',
    adminEmail: 'catalog@getora.com',
    action: 'Added Master Product',
    entityType: 'Catalog',
    entityId: 'mp-88',
    details: 'Published Asian Paints Apex Ultima 20L Exterior Emulsion to catalog.',
    ipAddress: '122.160.144.22',
    timestamp: '25 May 2026, 1:40 PM'
  },
  {
    id: 'log-4',
    adminName: 'Operations Admin',
    adminEmail: 'ops@getora.com',
    action: 'Reassigned Delivery Rider',
    entityType: 'Order',
    entityId: 'GT10242',
    details: 'Reassigned order GT10242 to Rider Sunil Kumar (Auto-reassignment timeout).',
    ipAddress: '122.160.144.25',
    timestamp: '25 May 2026, 11:20 AM'
  }
];
