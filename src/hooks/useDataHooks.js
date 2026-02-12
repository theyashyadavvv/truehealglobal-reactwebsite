/**
 * Domain-specific hooks — wrappers around useApi for each data type.
 * These provide clean, self-documenting data access throughout the app.
 */
import { useCallback } from 'react';
import useApi from './useApi';

/** Extract array from paginated API responses like { stores: [...] } or { products: [...] } */
const toArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
        // Find the first array-valued key (stores, products, items, brands, etc.)
        const arrKey = Object.keys(data).find(k => Array.isArray(data[k]));
        if (arrKey) return data[arrKey];
    }
    return [];
};

// ─── Banner Hooks ────────────────────────────────────────────────────────
import { fetchBanners, fetchStoreBanners, fetchPromotionalBanners, fetchWhyChooseBanners } from '../api/services/bannerService';

export function useBanners() {
    return useApi(fetchBanners, { initialData: [] });
}

export function useStoreBanners(storeId) {
    const fn = useCallback(() => fetchStoreBanners(storeId), [storeId]);
    return useApi(fn, { deps: [storeId], initialData: [], immediate: !!storeId });
}

export function usePromotionalBanners() {
    return useApi(fetchPromotionalBanners, { initialData: null });
}

export function useWhyChooseBanners() {
    return useApi(fetchWhyChooseBanners, { initialData: null });
}

// ─── Store Hooks ─────────────────────────────────────────────────────────
import { fetchStores, fetchStoreDetails, fetchPopularStores, fetchLatestStores, fetchTopOfferStores, fetchRecommendedStores } from '../api/services/stores';

export function useStores(options = {}) {
    const fn = useCallback(() => fetchStores(options), [JSON.stringify(options)]);
    return useApi(fn, { deps: [JSON.stringify(options)], initialData: null });
}

export function useStoreDetails(storeId) {
    const fn = useCallback(() => fetchStoreDetails(storeId), [storeId]);
    return useApi(fn, { deps: [storeId], immediate: !!storeId, initialData: null });
}

export function usePopularStores(options = {}) {
    const fn = useCallback(() => fetchPopularStores(options), [JSON.stringify(options)]);
    return useApi(fn, { initialData: [], transform: toArray });
}

export function useLatestStores(options = {}) {
    const fn = useCallback(() => fetchLatestStores(options), [JSON.stringify(options)]);
    return useApi(fn, { initialData: [], transform: toArray });
}

export function useTopOfferStores() {
    return useApi(fetchTopOfferStores, { initialData: [], transform: toArray });
}

export function useRecommendedStores() {
    return useApi(fetchRecommendedStores, { initialData: [], transform: toArray });
}

// ─── Item / Product Hooks ────────────────────────────────────────────────
import { fetchItemDetails, fetchLatestItems, fetchPopularItems, fetchMostReviewedItems, fetchStoreItems, fetchRecommendedItems, fetchDiscountedItems } from '../api/services/items';

export function useItemDetails(itemId) {
    const fn = useCallback(() => fetchItemDetails(itemId), [itemId]);
    return useApi(fn, { deps: [itemId], immediate: !!itemId, initialData: null });
}

export function useLatestItems(options = {}) {
    const fn = useCallback(() => fetchLatestItems(options), [JSON.stringify(options)]);
    return useApi(fn, { initialData: [], transform: toArray });
}

export function usePopularItems(options = {}) {
    const fn = useCallback(() => fetchPopularItems(options), [JSON.stringify(options)]);
    return useApi(fn, { initialData: [], transform: toArray });
}

export function useMostReviewedItems(options = {}) {
    const fn = useCallback(() => fetchMostReviewedItems(options), [JSON.stringify(options)]);
    return useApi(fn, { initialData: [], transform: toArray });
}

export function useStoreItems(storeId, options = {}) {
    const fn = useCallback(() => fetchStoreItems(storeId, options), [storeId, JSON.stringify(options)]);
    return useApi(fn, { deps: [storeId], immediate: !!storeId, initialData: null });
}

export function useRecommendedItems(options = {}) {
    const fn = useCallback(() => fetchRecommendedItems(options), [JSON.stringify(options)]);
    return useApi(fn, { initialData: [], transform: toArray });
}

export function useDiscountedItems(options = {}) {
    const fn = useCallback(() => fetchDiscountedItems(options), [JSON.stringify(options)]);
    return useApi(fn, { initialData: [], transform: toArray });
}

// ─── Category Hooks ──────────────────────────────────────────────────────
import { fetchCategories, fetchSubCategories, fetchCategoryItems, fetchCategoryStores, fetchPopularCategories } from '../api/services/categories';

export function useCategories() {
    return useApi(fetchCategories, { initialData: [], transform: toArray });
}

export function useSubCategories(categoryId) {
    const fn = useCallback(() => fetchSubCategories(categoryId), [categoryId]);
    return useApi(fn, { deps: [categoryId], immediate: !!categoryId, initialData: [] });
}

export function useCategoryItems(categoryId, options = {}) {
    const fn = useCallback(() => fetchCategoryItems(categoryId, options), [categoryId, JSON.stringify(options)]);
    return useApi(fn, { deps: [categoryId], immediate: !!categoryId, initialData: null });
}

export function useCategoryStores(categoryId, options = {}) {
    const fn = useCallback(() => fetchCategoryStores(categoryId, options), [categoryId, JSON.stringify(options)]);
    return useApi(fn, { deps: [categoryId], immediate: !!categoryId, initialData: null });
}

export function usePopularCategories() {
    return useApi(fetchPopularCategories, { initialData: [], transform: toArray });
}

// ─── Campaign & Flash Sale Hooks ─────────────────────────────────────────
import { fetchBasicCampaigns, fetchFlashSales, fetchFlashSaleProducts } from '../api/services/campaigns';

export function useBasicCampaigns() {
    return useApi(fetchBasicCampaigns, { initialData: [] });
}

export function useFlashSales() {
    return useApi(fetchFlashSales, { initialData: null });
}

// ─── Brand Hooks ─────────────────────────────────────────────────────────
import { fetchBrands, fetchBrandItems } from '../api/services/brands';

export function useBrands(options = {}) {
    const fn = useCallback(() => fetchBrands(options), [JSON.stringify(options)]);
    return useApi(fn, { initialData: [], transform: toArray });
}

export function useBrandItems(brandId, options = {}) {
    const fn = useCallback(() => fetchBrandItems(brandId, options), [brandId, JSON.stringify(options)]);
    return useApi(fn, { deps: [brandId], immediate: !!brandId, initialData: null });
}

// ─── Wishlist Hook ───────────────────────────────────────────────────────
import { fetchWishlist } from '../api/services/wishlist';

export function useWishlist() {
    return useApi(fetchWishlist, { initialData: null });
}

// ─── Coupon Hook ─────────────────────────────────────────────────────────
import { fetchCoupons } from '../api/services/coupons';

export function useCoupons(options = {}) {
    const fn = useCallback(() => fetchCoupons(options), [JSON.stringify(options)]);
    return useApi(fn, { initialData: null });
}

// ─── Order Hooks ─────────────────────────────────────────────────────────
import { fetchRunningOrders, fetchOrderHistory, fetchOrderDetails } from '../api/services/orders';

export function useRunningOrders(options = {}) {
    const fn = useCallback(() => fetchRunningOrders(options), [JSON.stringify(options)]);
    return useApi(fn, { initialData: null });
}

export function useOrderHistory(options = {}) {
    const fn = useCallback(() => fetchOrderHistory(options), [JSON.stringify(options)]);
    return useApi(fn, { initialData: null });
}

export function useOrderDetails(orderId) {
    const fn = useCallback(() => fetchOrderDetails(orderId), [orderId]);
    return useApi(fn, { deps: [orderId], immediate: !!orderId, initialData: null });
}

// ─── Notification Hook ──────────────────────────────────────────────────
import { fetchNotifications } from '../api/services/customer';

export function useNotifications(options = {}) {
    const fn = useCallback(() => fetchNotifications(options), [JSON.stringify(options)]);
    return useApi(fn, { initialData: null });
}

// ─── Wallet Hook ─────────────────────────────────────────────────────────
import { fetchWalletTransactions } from '../api/services/wallet';

export function useWalletTransactions(options = {}) {
    const fn = useCallback(() => fetchWalletTransactions(options), [JSON.stringify(options)]);
    return useApi(fn, { initialData: null });
}

// ─── Address Hook ────────────────────────────────────────────────────────
import { fetchAddresses } from '../api/services/address';

export function useAddresses() {
    return useApi(fetchAddresses, { initialData: null });
}
