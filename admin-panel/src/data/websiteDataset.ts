// Shared Real Dataset Matching Customer Website (GETORA Platform)

export interface SharedStore {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  categoryId: string;
  categoryName: string;
  logoUrl: string;
  bannerUrl: string;
  rating: number;
  reviewCount: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  isVerified?: boolean;
  address: string;
  locality: string;
  city?: string;
  distanceKm: number;
  deliveryEtaMin: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  offerText: string;
  featured: boolean;
  ownerName?: string;
  phone?: string;
  totalOrders?: number;
  totalRevenue?: number;
}

export const REAL_WEBSITE_STORES: SharedStore[] = [
  {
    id: 'store-voltix',
    name: 'Voltix Electricals',
    slug: 'voltix-electricals',
    tagline: 'Premium Industrial & Home Lighting',
    categoryId: 'cat-electrical',
    categoryName: 'Electrical',
    logoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 124,
    openTime: '09:00 AM',
    closeTime: '10:00 PM',
    isOpen: true,
    isVerified: true,
    address: '14, 80 Feet Road, 4th Block',
    locality: 'Koramangala',
    city: 'Jaipur',
    distanceKm: 2.4,
    deliveryEtaMin: 20,
    deliveryFee: 40,
    freeDeliveryThreshold: 499,
    offerText: '₹50 OFF on ₹399',
    featured: true,
    ownerName: 'Suresh Gupta',
    phone: '+91 98290 44102',
    totalOrders: 142,
    totalRevenue: 128450
  },
  {
    id: 'store-abc-electrical',
    name: 'ABC Electrical Store',
    slug: 'abc-electrical-store',
    tagline: 'Neighborhood Electric & Hardware Experts',
    categoryId: 'cat-electrical',
    categoryName: 'Electrical',
    logoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1200&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 98,
    openTime: '08:30 AM',
    closeTime: '09:30 PM',
    isOpen: true,
    isVerified: true,
    address: '52, 1st Cross, Vaishali Nagar',
    locality: 'Vaishali Nagar',
    city: 'Jaipur',
    distanceKm: 1.2,
    deliveryEtaMin: 20,
    deliveryFee: 40,
    freeDeliveryThreshold: 399,
    offerText: '15% OFF on Fans',
    featured: true,
    ownerName: 'Rajesh Agrawal',
    phone: '+91 97841 88319',
    totalOrders: 118,
    totalRevenue: 98760
  },
  {
    id: 'store-natures-fresh',
    name: "Nature's Fresh Grocery",
    slug: 'natures-fresh-grocery',
    tagline: 'Farm Fresh Veggies, Fruits & Daily Dairy',
    categoryId: 'cat-grocery',
    categoryName: 'Grocery & Essentials',
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 312,
    openTime: '07:00 AM',
    closeTime: '11:00 PM',
    isOpen: true,
    isVerified: true,
    address: '88, 12th Main, Malviya Nagar',
    locality: 'Malviya Nagar',
    city: 'Jaipur',
    distanceKm: 0.5,
    deliveryEtaMin: 12,
    deliveryFee: 0,
    freeDeliveryThreshold: 199,
    offerText: '10% OFF',
    featured: true,
    ownerName: 'Mukesh Sharma',
    phone: '+91 94140 12894',
    totalOrders: 284,
    totalRevenue: 184500
  },
  {
    id: 'store-techhub',
    name: 'TechHub Electronics',
    slug: 'techhub-electronics',
    tagline: 'Authorized Accessories, Audio & Cables',
    categoryId: 'cat-electronics',
    categoryName: 'Electronics',
    logoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 85,
    openTime: '10:00 AM',
    closeTime: '09:00 PM',
    isOpen: true,
    isVerified: true,
    address: '22, Main Market, Mansarovar',
    locality: 'Mansarovar',
    city: 'Jaipur',
    distanceKm: 2.8,
    deliveryEtaMin: 30,
    deliveryFee: 60,
    freeDeliveryThreshold: 999,
    offerText: 'Special Weekend Deals',
    featured: true,
    ownerName: 'Ankit Jain',
    phone: '+91 96102 33490',
    totalOrders: 92,
    totalRevenue: 76540
  },
  {
    id: 'store-sonix',
    name: 'Sonix Official Store',
    slug: 'sonix-official-store',
    tagline: 'Flagship Acoustics, ANC Headphones & Earbuds',
    categoryId: 'cat-electronics',
    categoryName: 'Electronics',
    logoUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewCount: 1284,
    openTime: '10:00 AM',
    closeTime: '09:30 PM',
    isOpen: true,
    isVerified: true,
    address: 'Shop 104, Tonk Road',
    locality: 'Tonk Road',
    city: 'Jaipur',
    distanceKm: 3.1,
    deliveryEtaMin: 25,
    deliveryFee: 50,
    freeDeliveryThreshold: 799,
    offerText: 'Up to 40% OFF',
    featured: true,
    ownerName: 'Deepak Saxena',
    phone: '+91 98280 66723',
    totalOrders: 78,
    totalRevenue: 64200
  },
  {
    id: 'store-city-hardware',
    name: 'City Hardware & Tools',
    slug: 'city-hardware-tools',
    tagline: 'Power Tools, Fasteners & Plumbing Fittings',
    categoryId: 'cat-hardware',
    categoryName: 'Hardware',
    logoUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 210,
    openTime: '08:00 AM',
    closeTime: '09:00 PM',
    isOpen: true,
    isVerified: true,
    address: '74, Sanganer Road',
    locality: 'Sanganer',
    city: 'Jaipur',
    distanceKm: 3.5,
    deliveryEtaMin: 25,
    deliveryFee: 40,
    freeDeliveryThreshold: 499,
    offerText: 'Free Drill Bit on ₹999',
    featured: true,
    ownerName: 'Ramesh Sharma',
    phone: '+91 94140 77123',
    totalOrders: 156,
    totalRevenue: 136200
  }
];

export const REAL_WEBSITE_PRODUCTS = [
  {
    id: 'prod-volt-01',
    retailerId: 'store-voltix',
    storeName: 'Voltix Electricals',
    categoryId: 'cat-electrical',
    categoryName: 'Electrical',
    name: 'Syska 9W B22 LED Cool White Bulb (Pack of 2)',
    brand: 'Syska',
    sku: 'SYS-LED-9W',
    price: 320,
    sellingPrice: 199,
    stockQuantity: 42,
    unit: 'pack',
    imageUrl: 'https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'prod-volt-02',
    retailerId: 'store-voltix',
    storeName: 'Voltix Electricals',
    categoryId: 'cat-electrical',
    categoryName: 'Electrical',
    name: 'Havells Crabtree 16A 1-Way Modular Switch (White)',
    brand: 'Havells',
    sku: 'HVL-SW-16A',
    price: 145,
    sellingPrice: 119,
    stockQuantity: 88,
    unit: 'pcs',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'prod-volt-03',
    retailerId: 'store-voltix',
    storeName: 'Voltix Electricals',
    categoryId: 'cat-electrical',
    categoryName: 'Electrical',
    name: 'Finolex 1.5 sq mm Flame Retardant Wire (90m, Red)',
    brand: 'Finolex',
    sku: 'FIN-WR-15R',
    price: 2150,
    sellingPrice: 1730,
    stockQuantity: 18,
    unit: 'roll',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'prod-tech-01',
    retailerId: 'store-techhub',
    storeName: 'TechHub Electronics',
    categoryId: 'cat-electronics',
    categoryName: 'Electronics',
    name: 'boAt Rockerz 450 Bluetooth On-Ear Headphones',
    brand: 'boAt',
    sku: 'BOT-ROC-450',
    price: 3990,
    sellingPrice: 1499,
    stockQuantity: 24,
    unit: 'pcs',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'prod-hard-01',
    retailerId: 'store-city-hardware',
    storeName: 'City Hardware & Tools',
    categoryId: 'cat-hardware',
    categoryName: 'Hardware',
    name: 'Stanley 13mm Impact Hammer Drill (650W)',
    brand: 'Stanley',
    sku: 'STN-IMP-650',
    price: 3499,
    sellingPrice: 2899,
    stockQuantity: 8,
    unit: 'pcs',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    isActive: true
  },
  {
    id: 'prod-groc-01',
    retailerId: 'store-natures-fresh',
    storeName: "Nature's Fresh Grocery",
    categoryId: 'cat-grocery',
    categoryName: 'Grocery & Essentials',
    name: 'Fresh Organic Farm Broccoli (500g)',
    brand: "Nature's Fresh",
    sku: 'GRO-BROC-500',
    price: 120,
    sellingPrice: 89,
    stockQuantity: 35,
    unit: 'pack',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    isAvailable: true,
    isActive: true
  }
];

export const REAL_WEBSITE_ORDERS = [
  {
    id: 'ord-883921',
    orderNumber: 'GET-883921',
    customer: 'Rahul Sharma',
    phone: '+91 98290 12345',
    address: 'A-42, Royal Palms, Vaishali Nagar, Jaipur',
    retailer: 'Voltix Electricals',
    retailerId: 'store-voltix',
    amount: '₹663',
    numericAmount: 663,
    status: 'out_for_delivery',
    statusLabel: 'Out for Delivery',
    statusColor: '#A855F7',
    paymentMethod: 'UPI (PhonePe)',
    deliveryPartner: 'Rahul Sharma (Hero Electric EV)',
    deliveryPhone: '+91 98765 43210',
    itemsCount: 2,
    items: [
      { name: 'Syska 9W B22 LED Cool White Bulb (Pack of 2)', quantity: 2, price: 199 },
      { name: 'Havells Crabtree 16A 1-Way Modular Switch (White)', quantity: 1, price: 119 }
    ],
    time: '12 mins ago',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  },
  {
    id: 'ord-774102',
    orderNumber: 'GET-774102',
    customer: 'Priya Verma',
    phone: '+91 97841 55678',
    address: 'B-12, Sector 5, Malviya Nagar, Jaipur',
    retailer: "Nature's Fresh Grocery",
    retailerId: 'store-natures-fresh',
    amount: '₹832',
    numericAmount: 832,
    status: 'delivered',
    statusLabel: 'Delivered',
    statusColor: '#1DB954',
    paymentMethod: 'UPI (Google Pay)',
    deliveryPartner: 'Vikram Patel (Ather 450X)',
    deliveryPhone: '+91 98111 22334',
    itemsCount: 2,
    items: [
      { name: 'Fresh Organic Farm Broccoli (500g)', quantity: 2, price: 89 },
      { name: 'Ratnagiri Alphonso Mangoes (1kg)', quantity: 1, price: 654 }
    ],
    time: '45 mins ago',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'ord-665209',
    orderNumber: 'GET-665209',
    customer: 'Amit Kumar',
    phone: '+91 96102 33490',
    address: '14, Lane 3, Mansarovar, Jaipur',
    retailer: 'TechHub Electronics',
    retailerId: 'store-techhub',
    amount: '₹1,499',
    numericAmount: 1499,
    status: 'preparing',
    statusLabel: 'Preparing',
    statusColor: '#F97316',
    paymentMethod: 'Cash on Delivery',
    deliveryPartner: 'Manish Saini',
    deliveryPhone: '+91 93510 77123',
    itemsCount: 1,
    items: [
      { name: 'boAt Rockerz 450 Bluetooth On-Ear Headphones', quantity: 1, price: 1499 }
    ],
    time: '8 mins ago',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString()
  },
  {
    id: 'ord-554190',
    orderNumber: 'GET-554190',
    customer: 'Neha Singh',
    phone: '+91 98280 66723',
    address: 'House 88, Jagatpura Main Road, Jaipur',
    retailer: 'City Hardware & Tools',
    retailerId: 'store-city-hardware',
    amount: '₹2,899',
    numericAmount: 2899,
    status: 'confirmed',
    statusLabel: 'Confirmed',
    statusColor: '#3B82F6',
    paymentMethod: 'Credit Card (Razorpay)',
    deliveryPartner: 'Auto Assigning...',
    deliveryPhone: '—',
    itemsCount: 1,
    items: [
      { name: 'Stanley 13mm Impact Hammer Drill (650W)', quantity: 1, price: 2899 }
    ],
    time: '2 mins ago',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString()
  }
];
