/**
 * Central API barrel export — import any service from here.
 * Usage: import { login, fetchStores, fetchBanners } from '@/api';
 */

// Core
export { BASE_URL, getToken, saveToken, clearToken, getApiHeaders } from './config';

// Auth
export * from './services/auth';

// Config / System
export * from './services/configService';

// Banners & Ads
export * from './services/bannerService';

// Stores
export * from './services/stores';

// Items / Products
export * from './services/items';

// Categories
export * from './services/categories';

// Cart
export * from './services/cart';

// Orders
export * from './services/orders';

// Wishlist
export * from './services/wishlist';

// Coupons
export * from './services/coupons';

// Wallet & Loyalty
export * from './services/wallet';

// Customer / Profile
export * from './services/customer';

// Address
export * from './services/address';

// Messaging
export * from './services/messaging';

// Campaigns & Flash Sales
export * from './services/campaigns';

// Brands
export * from './services/brands';

// Cashback
export * from './services/cashback';

// Delivery
export * from './services/delivery';

// Parcel
export * from './services/parcel';

// Static Pages
export * from './services/pages';

// Map / Location
export * from './services/mapService';
