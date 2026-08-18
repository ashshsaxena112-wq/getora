import { Category, Store, Product, Coupon, Address, Order } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-grocery',
    name: 'Grocery & Essentials',
    slug: 'grocery-essentials',
    description: 'Fresh daily, delivered instantly.',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    iconName: 'Apple',
    storeCount: 14
  },
  {
    id: 'cat-electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Headphones, cables, chargers & audio gear.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    iconName: 'Headphones',
    storeCount: 18
  },
  {
    id: 'cat-electrical',
    name: 'Electrical',
    slug: 'electrical',
    description: 'Bulbs, wires, switches & lighting.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    iconName: 'Zap',
    storeCount: 9
  },
  {
    id: 'cat-hardware',
    name: 'Hardware',
    slug: 'hardware',
    description: 'Tools, plumbing, fixtures & fasteners.',
    imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
    iconName: 'Wrench',
    storeCount: 11
  },
  {
    id: 'cat-mobile',
    name: 'Mobile Accessories',
    slug: 'mobile-accessories',
    description: 'Cases, screen guards, chargers & stands.',
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    iconName: 'Smartphone',
    storeCount: 22
  },
  {
    id: 'cat-stationery',
    name: 'Stationery',
    slug: 'stationery',
    description: 'Notebooks, pens, office & art supplies.',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
    iconName: 'BookOpen',
    storeCount: 8
  },
  {
    id: 'cat-home',
    name: 'Home Essentials',
    slug: 'home-essentials',
    description: 'Kitchen, storage & cleaning utilities.',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    iconName: 'Home',
    storeCount: 15
  },
  {
    id: 'cat-auto',
    name: 'Auto Accessories',
    slug: 'auto-accessories',
    description: 'Helmets, bike polish, car care & bulbs.',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80',
    iconName: 'Car',
    storeCount: 7
  },
  {
    id: 'cat-pet',
    name: 'Pet Supplies',
    slug: 'pet-supplies',
    description: 'Pet food, treats, toys & grooming.',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=80',
    iconName: 'Heart',
    storeCount: 6
  },
  {
    id: 'cat-care',
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Grooming, skincare & pharmacy basics.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    iconName: 'Sparkles',
    storeCount: 16
  }
];

export const INITIAL_STORES: Store[] = [
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
    address: '14, 80 Feet Road, 4th Block',
    locality: 'Koramangala, Bengaluru',
    distanceKm: 2.4,
    deliveryEtaMin: 20,
    deliveryFee: 40,
    freeDeliveryThreshold: 499,
    offerText: '₹50 OFF on ₹399',
    featured: true
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
    address: '52, 1st Cross, Indiranagar',
    locality: 'Indiranagar, Bengaluru',
    distanceKm: 1.2,
    deliveryEtaMin: 20,
    deliveryFee: 40,
    freeDeliveryThreshold: 399,
    offerText: '15% OFF on Fans',
    featured: true
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
    address: '88, 12th Main, HAL 2nd Stage',
    locality: 'Indiranagar, Bengaluru',
    distanceKm: 0.5,
    deliveryEtaMin: 12,
    deliveryFee: 0,
    freeDeliveryThreshold: 199,
    offerText: '10% OFF',
    featured: true
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
    address: '22, Brigade Road',
    locality: 'MG Road, Bengaluru',
    distanceKm: 2.8,
    deliveryEtaMin: 30,
    deliveryFee: 60,
    freeDeliveryThreshold: 999,
    offerText: 'Special Weekend Deals',
    featured: true
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
    closeTime: '10:00 PM',
    isOpen: true,
    address: '101, 100 Feet Road',
    locality: 'Indiranagar, Bengaluru',
    distanceKm: 1.5,
    deliveryEtaMin: 15,
    deliveryFee: 0,
    freeDeliveryThreshold: 500,
    offerText: 'Flat 32% OFF',
    featured: true
  },
  {
    id: 'store-ganesh-hardware',
    name: 'Shree Ganesh Hardware & Tools',
    slug: 'shree-ganesh-hardware',
    tagline: 'Plumbing, Power Tools & Fasteners',
    categoryId: 'cat-hardware',
    categoryName: 'Hardware',
    logoUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 76,
    openTime: '08:00 AM',
    closeTime: '09:00 PM',
    isOpen: true,
    address: '33, CMH Road',
    locality: 'Indiranagar, Bengaluru',
    distanceKm: 1.8,
    deliveryEtaMin: 25,
    deliveryFee: 35,
    freeDeliveryThreshold: 499,
    offerText: '₹100 OFF on Tools',
    featured: false
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Sonix Flagship (Screenshot 3)
  {
    id: 'prod-sonix-nc700',
    retailerId: 'store-sonix',
    storeId: 'store-sonix',
    storeName: 'Sonix Official Store',
    storeLocality: 'Indiranagar',
    categoryId: 'cat-electronics',
    categoryName: 'Electronics',
    name: 'Sonix Pro NC-700 Active Noise Cancelling Headphones',
    slug: 'sonix-pro-nc-700-active-noise-cancelling-headphones',
    brand: 'SONIX',
    description: 'Engineered for exceptional studio sound and ultra-quiet isolation. Equipped with custom tuned 40mm beryllium drivers, smart active noise cancellation, low-latency gaming mode, and featherlight plush ear cushions for all-day comfort.',
    price: 12999,
    sellingPrice: 12999,
    mrp: 18999,
    discountPercent: 32,
    inStock: true,
    stockQuantity: 18,
    unit: '1 unit',
    packInfo: 'Includes travel case, AUX cable & USB-C fast charging cord',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      { label: 'Battery', value: '40 Hours Playtime' },
      { label: 'Noise Cancelling', value: 'Active Hybrid ANC' },
      { label: 'Connectivity', value: 'Bluetooth 5.3 + Multipoint' },
      { label: 'Microphone', value: '6-Mic Beamforming System' }
    ],
    colors: ['#1A1A1A', '#F0F0F0', '#1B2A4A'],
    isPopular: true,
    rating: 4.8,
    reviewCount: 1284,
    deliveryEtaMin: 15
  },

  // Voltix Electricals Products (Screenshot 4)
  {
    id: 'prod-philips-9w-bulb',
    retailerId: 'store-voltix',
    storeId: 'store-voltix',
    storeName: 'Voltix Electricals',
    storeLocality: 'Koramangala',
    categoryId: 'cat-electrical',
    categoryName: 'Electrical',
    name: 'Philips 9W B22 LED Bulb, Cool Day Light',
    slug: 'philips-9w-b22-led-bulb',
    brand: 'Philips',
    description: 'Bright 6500K cool day light with EyeComfort technology. 85% energy savings over standard incandescent bulbs, lasts up to 15,000 hours with built-in surge protection.',
    price: 149,
    sellingPrice: 149,
    mrp: 199,
    discountPercent: 25,
    inStock: true,
    stockQuantity: 120,
    unit: 'Pack of 1',
    packInfo: 'Base: B22 Pin Cap | Wattage: 9W',
    images: [
      'https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532009324734-20a7a5813719?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      { label: 'Wattage', value: '9W (825 Lumens)' },
      { label: 'Color Temp', value: '6500K Cool White' },
      { label: 'Warranty', value: '1 Year Manufacturer' },
      { label: 'Holder Type', value: 'B22 Indian Pin Base' }
    ],
    isPopular: true,
    rating: 4.7,
    reviewCount: 340,
    deliveryEtaMin: 20
  },
  {
    id: 'prod-havells-wire',
    retailerId: 'store-voltix',
    storeId: 'store-voltix',
    storeName: 'Voltix Electricals',
    storeLocality: 'Koramangala',
    categoryId: 'cat-electrical',
    categoryName: 'Electrical',
    name: 'Havells 1.5 sq mm Single Core FR PVC Wire',
    slug: 'havells-1-5-sq-mm-wire-red',
    brand: 'Havells',
    description: 'High conductivity pure electrolytic copper conductors insulated with heat-resistant Flame Retardant (FR) grade PVC compound for absolute residential & commercial electrical safety.',
    price: 1250,
    sellingPrice: 1250,
    mrp: 1490,
    discountPercent: 16,
    inStock: true,
    stockQuantity: 45,
    unit: '90m Length Coil',
    packInfo: 'Color: Red | 1100V Grade ISI Certified',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      { label: 'Conductor', value: '100% Pure Copper' },
      { label: 'Insulation', value: 'Flame Retardant FR PVC' },
      { label: 'Length', value: '90 Meters' },
      { label: 'Certification', value: 'ISI Mark IS:694' }
    ],
    isPopular: true,
    rating: 4.8,
    reviewCount: 89,
    deliveryEtaMin: 20
  },
  {
    id: 'prod-atomberg-fan',
    retailerId: 'store-voltix',
    storeId: 'store-voltix',
    storeName: 'Voltix Electricals',
    storeLocality: 'Koramangala',
    categoryId: 'cat-electrical',
    categoryName: 'Electrical',
    name: 'Atomberg Renesa 1200mm BLDC Motor Ceiling Fan',
    slug: 'atomberg-renesa-1200mm-bldc-fan',
    brand: 'Atomberg',
    description: 'Super energy efficient BLDC motor consuming only 28W at top speed. Saves up to ₹1,500/year on electricity. Comes with smart remote control with Sleep, Boost and Timer modes.',
    price: 3490,
    sellingPrice: 3490,
    mrp: 4750,
    discountPercent: 26,
    inStock: true,
    stockQuantity: 22,
    unit: '1 unit',
    packInfo: 'Finish: Matte Black | Span: 1200mm (48 Inch)',
    images: [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      { label: 'Motor', value: 'Energy Saver BLDC (28W)' },
      { label: 'Air Delivery', value: '235 CMM @ 360 RPM' },
      { label: 'Control', value: 'Smart Remote Included' },
      { label: 'Warranty', value: '2+1 Year On-site' }
    ],
    isPopular: true,
    rating: 4.9,
    reviewCount: 420,
    deliveryEtaMin: 20
  },
  {
    id: 'prod-legrand-switch-plate',
    retailerId: 'store-voltix',
    storeId: 'store-voltix',
    storeName: 'Voltix Electricals',
    storeLocality: 'Koramangala',
    categoryId: 'cat-electrical',
    categoryName: 'Electrical',
    name: 'Legrand Myrius Modular Switch Plate (3 Module)',
    slug: 'legrand-myrius-modular-switch-plate',
    brand: 'Legrand',
    description: 'Sleek gunmetal grey textured finish with fire-retardant virgin polycarbonate material. Scratch-resistant surface designed for modern minimalist interiors.',
    price: 420,
    sellingPrice: 420,
    mrp: 510,
    discountPercent: 18,
    inStock: true,
    stockQuantity: 80,
    unit: '1 unit',
    packInfo: 'Finish: Gunmetal Grey | 3 Modules Grid',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      { label: 'Material', value: 'Fire-Safe Polycarbonate' },
      { label: 'Finish', value: 'Matte Gunmetal' },
      { label: 'Capacity', value: '3 Modules' }
    ],
    isPopular: false,
    rating: 4.6,
    reviewCount: 45,
    deliveryEtaMin: 20
  },
  {
    id: 'prod-fluke-multimeter',
    retailerId: 'store-voltix',
    storeId: 'store-voltix',
    storeName: 'Voltix Electricals',
    storeLocality: 'Koramangala',
    categoryId: 'cat-electrical',
    categoryName: 'Electrical',
    name: 'Fluke 101 Digital Multimeter',
    slug: 'fluke-101-digital-multimeter',
    brand: 'Fluke',
    description: 'Pocket-sized CAT III 600V safety rated professional digital multimeter for electrical troubleshooting. Measures AC/DC voltage, resistance, continuity and diode testing.',
    price: 2800,
    sellingPrice: 2800,
    mrp: 3200,
    discountPercent: 12,
    inStock: false,
    stockQuantity: 0,
    unit: '1 unit',
    packInfo: 'Includes test leads, AAA batteries & manual',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      { label: 'Safety Rating', value: 'CAT III 600 V' },
      { label: 'Display', value: '6000 Count LCD' },
      { label: 'Form Factor', value: 'Compact Pocket Size' }
    ],
    isPopular: false,
    rating: 4.9,
    reviewCount: 210,
    deliveryEtaMin: 20
  },

  // Grocery Products (Screenshot 1 & 5)
  {
    id: 'prod-organic-broccoli',
    retailerId: 'store-natures-fresh',
    storeId: 'store-natures-fresh',
    storeName: "Nature's Fresh Grocery",
    storeLocality: 'Indiranagar',
    categoryId: 'cat-grocery',
    categoryName: 'Grocery & Essentials',
    name: 'Fresh Organic Green Broccoli',
    slug: 'fresh-organic-green-broccoli',
    brand: 'Farm Fresh',
    description: 'Crisp, pesticide-free farm-fresh broccoli florets packed with antioxidants, Vitamin C and dietary fiber. Harvested at sunrise.',
    price: 89,
    sellingPrice: 89,
    mrp: 120,
    discountPercent: 26,
    inStock: true,
    stockQuantity: 40,
    unit: '500g Pack',
    packInfo: 'Hydroponically grown & sanitized',
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      { label: 'Origin', value: 'Ooty Farm Direct' },
      { label: 'Shelf Life', value: '4 Days refrigerated' },
      { label: 'Weight', value: '500g Approx' }
    ],
    isPopular: true,
    rating: 4.9,
    reviewCount: 156,
    deliveryEtaMin: 12
  },
  {
    id: 'prod-alphonso-mangoes',
    retailerId: 'store-natures-fresh',
    storeId: 'store-natures-fresh',
    storeName: "Nature's Fresh Grocery",
    storeLocality: 'Indiranagar',
    categoryId: 'cat-grocery',
    categoryName: 'Grocery & Essentials',
    name: 'Ratnagiri Alphonso Mangoes (GI Tagged)',
    slug: 'ratnagiri-alphonso-mangoes',
    brand: 'Nature Choice',
    description: 'Naturally ripened, sweet and aromatic original Ratnagiri Alphonso mangoes. Chemical-free and carbide-free ripening.',
    price: 699,
    sellingPrice: 699,
    mrp: 850,
    discountPercent: 18,
    inStock: true,
    stockQuantity: 25,
    unit: 'Box of 6 Pcs',
    packInfo: 'A-Grade Jumbo Size (250g+ each)',
    images: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      { label: 'Ripening', value: '100% Grass Ripened' },
      { label: 'Origin', value: 'Ratnagiri, Maharashtra' }
    ],
    isPopular: true,
    rating: 4.9,
    reviewCount: 388,
    deliveryEtaMin: 12
  },

  // TechHub Products
  {
    id: 'prod-anker-65w-charger',
    retailerId: 'store-techhub',
    storeId: 'store-techhub',
    storeName: 'TechHub Electronics',
    storeLocality: 'MG Road',
    categoryId: 'cat-electronics',
    categoryName: 'Electronics',
    name: 'Anker Nano II 65W GaN Fast Wall Charger',
    slug: 'anker-nano-ii-65w-gan-charger',
    brand: 'Anker',
    description: 'Ultra-compact high-speed Gallium Nitride (GaN II) fast charger. Powers MacBooks, iPads, iPhones, and Samsung Galaxy fast charging seamlessly.',
    price: 2499,
    sellingPrice: 2499,
    mrp: 3499,
    discountPercent: 28,
    inStock: true,
    stockQuantity: 30,
    unit: '1 unit',
    packInfo: 'Input: 100-240V | USB-C Power Delivery 3.0',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      { label: 'Power', value: '65W Max Output' },
      { label: 'Technology', value: 'GaN II Fast Charging' },
      { label: 'Port', value: 'USB Type-C PD' }
    ],
    isPopular: true,
    rating: 4.8,
    reviewCount: 160,
    deliveryEtaMin: 30
  },
  {
    id: 'prod-boat-stone-speaker',
    retailerId: 'store-techhub',
    storeId: 'store-techhub',
    storeName: 'TechHub Electronics',
    storeLocality: 'MG Road',
    categoryId: 'cat-electronics',
    categoryName: 'Electronics',
    name: 'boAt Stone 350 10W Portable Bluetooth Speaker',
    slug: 'boat-stone-350-portable-speaker',
    brand: 'boAt',
    description: '10W stereo sound with immersive bass, IPX7 water resistance, and 12-hour continuous battery life. Perfect for travel and desk setups.',
    price: 1299,
    sellingPrice: 1299,
    mrp: 2990,
    discountPercent: 56,
    inStock: true,
    stockQuantity: 50,
    unit: '1 unit',
    packInfo: 'Includes AUX cord & USB charging cable',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      { label: 'Sound', value: '10W RMS Dynamic Sound' },
      { label: 'Waterproof', value: 'IPX7 Certified' },
      { label: 'Battery', value: 'Up to 12 Hours' }
    ],
    isPopular: false,
    rating: 4.5,
    reviewCount: 94,
    deliveryEtaMin: 30
  },

  // Hardware Products
  {
    id: 'prod-bosch-drill',
    retailerId: 'store-ganesh-hardware',
    storeId: 'store-ganesh-hardware',
    storeName: 'Shree Ganesh Hardware & Tools',
    storeLocality: 'Indiranagar',
    categoryId: 'cat-hardware',
    categoryName: 'Hardware',
    name: 'Bosch GSB 500W Professional Impact Drill Kit',
    slug: 'bosch-gsb-500w-impact-drill-kit',
    brand: 'Bosch',
    description: 'Powerful 500W forward/reverse impact drill machine with complete 100-piece accessory kit for masonry, wood and metal drilling.',
    price: 3699,
    sellingPrice: 3699,
    mrp: 4500,
    discountPercent: 18,
    inStock: true,
    stockQuantity: 15,
    unit: '1 Kit',
    packInfo: 'Includes sturdy carry case & 100 attachments',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80'
    ],
    features: [
      { label: 'Power', value: '500 Watts Motor' },
      { label: 'Chuck Size', value: '10 mm Keyed' },
      { label: 'Warranty', value: '6 Months Bosch Warranty' }
    ],
    isPopular: true,
    rating: 4.8,
    reviewCount: 77,
    deliveryEtaMin: 25
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'GETORA100',
    description: 'Flat ₹100 off on your first local store order above ₹299',
    discount: 100,
    discountType: 'fixed',
    discountValue: 100,
    minOrderValue: 299,
    maxDiscount: 100,
    validUntil: '2026-12-31'
  },
  {
    code: 'LOCALFAST',
    description: '20% off on all neighborhood electronics & electrical items',
    discount: 20,
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 199,
    maxDiscount: 150,
    validUntil: '2026-12-31'
  },
  {
    code: 'FREEDEL',
    description: 'Free Delivery on any local order above ₹149',
    discount: 40,
    discountType: 'fixed',
    discountValue: 40,
    minOrderValue: 149,
    maxDiscount: 40,
    validUntil: '2026-12-31'
  }
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-home',
    tag: 'Home',
    addressType: 'Home',
    addressLine1: 'A-42, Tech Park Enclave',
    flatNo: 'A-42, Tech Park Enclave',
    streetArea: '100 Feet Road, HAL 2nd Stage, Indiranagar',
    landmark: 'Opp. BDA Complex',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    isDefault: true
  },
  {
    id: 'addr-work',
    tag: 'Work',
    addressType: 'Work',
    addressLine1: 'Tower B, 4th Floor, Nexus Coworking',
    flatNo: 'Tower B, 4th Floor, Nexus Coworking',
    streetArea: '80 Feet Road, Koramangala 4th Block',
    landmark: 'Near Sony World Junction',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    isDefault: false
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-883921',
    orderNumber: 'GET-883921',
    customerId: 'cust-demo-01',
    retailerId: 'store-voltix',
    addressId: 'addr-home',
    storeId: 'store-voltix',
    storeName: 'Voltix Electricals',
    storeAddress: '14, 80 Feet Road, Koramangala',
    items: [
      {
        product: INITIAL_PRODUCTS[1], // Philips Bulb
        quantity: 2
      },
      {
        product: INITIAL_PRODUCTS[4], // Legrand Plate
        quantity: 1
      }
    ],
    orderStatus: 'out_for_delivery',
    status: 'out_for_delivery',
    subtotal: 718,
    deliveryFee: 40,
    platformFee: 5,
    discount: 100,
    tax: 0,
    totalAmount: 663,
    grandTotal: 663,
    couponCode: 'GETORA100',
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    deliveryAddress: INITIAL_ADDRESSES[0],
    deliveryInstructions: 'Ring bell and leave at door',
    deliveryPartner: {
      id: 'd1111111-1111-1111-1111-111111111111',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      vehicle: 'Hero Electric Optima (KA-05-EV-4421)',
      rating: 4.9,
      totalDeliveries: 1420,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    estimatedDeliveryTime: '12 mins (Around 10:45 PM)',
    placedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    driverLocation: {
      lat: 12.9725,
      lng: 77.6410,
      progressPercent: 70
    }
  },
  {
    id: 'ord-774102',
    orderNumber: 'GET-774102',
    customerId: 'cust-demo-01',
    retailerId: 'store-natures-fresh',
    addressId: 'addr-home',
    storeId: 'store-natures-fresh',
    storeName: "Nature's Fresh Grocery",
    storeAddress: '88, 12th Main, Indiranagar',
    items: [
      {
        product: INITIAL_PRODUCTS[6], // Organic Broccoli
        quantity: 2
      },
      {
        product: INITIAL_PRODUCTS[7], // Alphonso Mangoes
        quantity: 1
      }
    ],
    orderStatus: 'delivered',
    status: 'delivered',
    subtotal: 877,
    deliveryFee: 0,
    platformFee: 5,
    discount: 50,
    tax: 0,
    totalAmount: 832,
    grandTotal: 832,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    deliveryAddress: INITIAL_ADDRESSES[0],
    deliveryPartner: {
      id: 'd2222222-2222-2222-2222-222222222222',
      name: 'Vikram Patel',
      phone: '+91 98111 22334',
      vehicle: 'Ather 450X (KA-01-EQ-9090)',
      rating: 4.8,
      totalDeliveries: 980,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    estimatedDeliveryTime: 'Delivered',
    placedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 23.5).toISOString(),
    deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 23.5).toISOString()
  }
];
