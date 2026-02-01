// For Web (Admin Panel) - Next.js
export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };
  
  // Collection names - centralized to avoid typos
  export const COLLECTIONS = {
    USERS: 'users',
    ADMINS: 'admins',
    PRODUCTS: 'products',
    METAL_RATES: 'metalRates',
    MAKING_CHARGES: 'makingCharges',
    TAX_SETTINGS: 'taxSettings',
    COUPONS: 'coupons',
    ORDERS: 'orders',
    STORES: 'stores',
    BANNERS: 'banners',
    COLLECTIONS: 'collections',
    NOTIFICATIONS: 'notifications',
    REVIEWS: 'reviews',
    PRICE_HISTORY: 'priceHistory'
  };
  
  // Storage paths
  export const STORAGE_PATHS = {
    PRODUCTS: 'products',
    BANNERS: 'banners',
    STORES: 'stores',
    COLLECTIONS: 'collections',
    CERTIFICATES: 'certificates'
  };
  
  // Order status constants
  export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    READY_FOR_PICKUP: 'ready_for_pickup',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  };
  
  // Payment status constants
  export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  };