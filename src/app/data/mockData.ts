// Mock Data for VitalLogistics Portal

export type Product = {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  thc: number; // in mg
  description?: string;
  batchNumber?: string;
  coaLink?: string;
};

export type Order = {
  id: string;
  customer: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Paid' | 'Picking' | 'Packed';
  total: number;
  items: number;
  zone?: number;
};

export interface DeliveryZone {
    id: string;
    name: string;
    zoneId: number; // For mapping to Order.zone
    color: string;
    baseFee: number;
    freeThreshold: number;
    days: string[]; // ['Mon', 'Tue', etc.]
    description: string;
}

export const deliveryZones: DeliveryZone[] = [
    {
        id: 'zone-1',
        zoneId: 1,
        name: 'Zone 1: Metro Core',
        color: '#10b981', // emerald-500
        baseFee: 15.00,
        freeThreshold: 500,
        days: ['Mon', 'Wed', 'Fri'],
        description: 'Downtown and central business districts.'
    },
    {
        id: 'zone-2',
        zoneId: 2,
        name: 'Zone 2: Greater Metro',
        color: '#f59e0b', // amber-500
        baseFee: 35.00,
        freeThreshold: 1000,
        days: ['Tue', 'Thu'],
        description: 'Suburban areas within 20 miles.'
    },
    {
        id: 'zone-3',
        zoneId: 3,
        name: 'Zone 3: Regional',
        color: '#3b82f6', // blue-500
        baseFee: 65.00,
        freeThreshold: 2500,
        days: ['Wed'],
        description: 'Outer regions and satellite cities.'
    }
];

export const products: Product[] = [
  {
    id: '1',
    sku: 'GLO-CBD-1000',
    name: 'Premium CBD Oil Tincture 1000mg',
    brand: 'GreenLeaf Organics',
    price: 45.00,
    category: 'Tinctures',
    image: 'https://images.unsplash.com/photo-1629196914168-3a2652305f9e?auto=format&fit=crop&q=80&w=300&h=300',
    stock: 120,
    rating: 4.8,
    thc: 2.5,
    description: "Our Premium CBD Oil Tincture is crafted from organically grown hemp, ensuring the highest quality and purity. This full-spectrum formula provides a comprehensive range of cannabinoids and terpenes for the entourage effect. Ideal for wellness-focused retailers.",
    batchNumber: "GLO-23-089",
    coaLink: "/coa/GLO-CBD-1000.pdf"
  },
  {
    id: '2',
    sku: 'SWR-GUM-30',
    name: 'Hemp Infused Gummies (30ct)',
    brand: 'SweetRelief',
    price: 35.00,
    category: 'Edibles',
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=300&h=300',
    stock: 85,
    rating: 4.9,
    thc: 5.0,
    description: "Delicious and effective, SweetRelief Hemp Infused Gummies offer a convenient way to consume daily CBD. Each gummy contains a precise dose, making it easy for customers to manage their intake. Vegan and gluten-free.",
    batchNumber: "SWR-23-112",
    coaLink: "/coa/SWR-GUM-30.pdf"
  },
  {
    id: '3',
    sku: 'PH-BALM-001',
    name: 'Soothing Muscle Balm',
    brand: 'PureHemp',
    price: 28.50,
    category: 'Topicals',
    image: 'https://images.unsplash.com/photo-1611080541599-8c6dbde6edb8?auto=format&fit=crop&q=80&w=300&h=300',
    stock: 45,
    rating: 4.7,
    thc: 0,
    description: "PureHemp's Soothing Muscle Balm is formulated with high-potency CBD and essential oils to target muscle relief. Perfect for post-workout recovery or daily aches. Non-greasy formula absorbs quickly.",
    batchNumber: "PH-23-045",
    coaLink: "/coa/PH-BALM-001.pdf"
  },
  {
    id: '4',
    sku: 'C9V-D8-BLU',
    name: 'Delta-8 Vape Cartridge - Blue Dream',
    brand: 'Cloud9 Vapes',
    price: 32.00,
    category: 'Vapes',
    image: 'https://images.unsplash.com/photo-1574636603223-bdc7d3ba45c7?auto=format&fit=crop&q=80&w=300&h=300',
    stock: 200,
    rating: 4.6,
    thc: 850,
    description: "Experience the uplifting effects of Blue Dream with our Delta-8 Vape Cartridge. Cloud9 Vapes uses premium ceramic hardware for smooth hits and pure flavor. Lab-tested for safety and potency.",
    batchNumber: "C9V-23-331",
    coaLink: "/coa/C9V-D8-BLU.pdf"
  },
  {
    id: '5',
    sku: 'GLO-SFT-60',
    name: 'Full Spectrum Softgels',
    brand: 'GreenLeaf Organics',
    price: 55.00,
    category: 'Capsules',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300',
    stock: 60,
    rating: 4.9,
    thc: 1.5,
    description: "Convenient and tasteless, these Full Spectrum Softgels are perfect for customers on the go. Made with MCT oil for enhanced bioavailability.",
    batchNumber: "GLO-23-092",
    coaLink: "/coa/GLO-SFT-60.pdf"
  },
  {
    id: '6',
    sku: 'BNB-FLW-SSC',
    name: 'Hemp Flower - Sour Space Candy (3.5g)',
    brand: 'Buds & Blooms',
    price: 25.00,
    category: 'Flower',
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&q=80&w=300&h=300',
    stock: 150,
    rating: 4.5,
    thc: 18.5,
    description: "Sour Space Candy is a popular CBD-rich hemp strain known for its unique flavor profile of sour candy and tropical fruit. Hand-trimmed and slow-cured for optimal quality.",
    batchNumber: "BNB-23-011",
    coaLink: "/coa/BNB-FLW-SSC.pdf"
  },
  {
    id: '7',
    sku: 'EZ-DRK-LEM',
    name: 'Sparkling Lemon Hemp Beverage',
    brand: 'ZenSips',
    price: 18.00,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300&h=300',
    stock: 24,
    rating: 4.2,
    thc: 2.0,
    description: "Refresh and relax with ZenSips Sparkling Lemon Hemp Beverage. A light, bubbly drink infused with nano-emulsified hemp extract for fast-acting effects.",
    batchNumber: "EZ-23-550",
    coaLink: "/coa/EZ-DRK-LEM.pdf"
  },
  {
    id: '8',
    sku: 'PH-CAP-SLP',
    name: 'Sleep Support Capsules',
    brand: 'PureHemp',
    price: 42.00,
    category: 'Capsules',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=300&h=300',
    stock: 0, // Out of stock
    rating: 4.6,
    thc: 1.0,
    description: "Drift into a restful sleep with PureHemp Sleep Support Capsules. Combining CBD with melatonin and chamomile for a natural sleep aid.",
    batchNumber: "PH-23-088",
    coaLink: "/coa/PH-CAP-SLP.pdf"
  }
];

export const recentOrders: Order[] = [
  { id: 'ORD-7829', customer: 'Wellness Corner', date: '2023-10-25', status: 'Delivered', total: 1250.00, items: 45, zone: 1 },
  { id: 'ORD-7830', customer: 'Green Haven Dispensary', date: '2023-10-26', status: 'Processing', total: 840.50, items: 28, zone: 2 },
  { id: 'ORD-7831', customer: 'Natural Vibes', date: '2023-10-26', status: 'Pending', total: 2100.00, items: 112, zone: 3 },
  { id: 'ORD-7832', customer: 'Hemp City', date: '2023-10-27', status: 'Shipped', total: 560.00, items: 15, zone: 1 },
  { id: 'ORD-7833', customer: 'Urban Leaf', date: '2023-10-27', status: 'Pending', total: 920.00, items: 32, zone: 2 },
];

export const pendingFulfillmentOrders: Order[] = [
    { id: 'ORD-7834', customer: 'CannaLife', date: '2023-10-28', status: 'Paid', total: 1500.00, items: 60, zone: 1 },
    { id: 'ORD-7835', customer: 'Herbal Essence', date: '2023-10-28', status: 'Picking', total: 2300.00, items: 85, zone: 3 },
    { id: 'ORD-7836', customer: 'Green Giant', date: '2023-10-28', status: 'Packed', total: 800.00, items: 25, zone: 2 },
    { id: 'ORD-7837', customer: 'Nature\'s Best', date: '2023-10-29', status: 'Paid', total: 3200.00, items: 150, zone: 1 },
    { id: 'ORD-7838', customer: 'Hemp Works', date: '2023-10-29', status: 'Picking', total: 1100.00, items: 40, zone: 2 },
];

export const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5500 },
  { name: 'Thu', sales: 4800 },
  { name: 'Fri', sales: 6200 },
  { name: 'Sat', sales: 7800 },
  { name: 'Sun', sales: 5100 },
];
