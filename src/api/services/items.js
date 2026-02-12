/**
 * Item / Product API Service — mirrors Flutter item_repository.dart
 */
import { apiGet, apiPost } from '../config';
import * as EP from '../endpoints';

/** Fetch item details by ID */
export async function fetchItemDetails(itemId) {
    return apiGet(`${EP.ITEM_DETAILS_URI}${itemId}`);
}

/** Fetch latest items (paginated) */
export async function fetchLatestItems({ offset = 1, limit = 12, type = 'all' } = {}) {
    return apiGet(`${EP.LATEST_ITEM_URI}?offset=${offset}&limit=${limit}&type=${type}`);
}

/** Fetch popular items (paginated) */
export async function fetchPopularItems({ offset = 1, limit = 12, type = 'all' } = {}) {
    return apiGet(`${EP.POPULAR_ITEM_URI}?type=${type}&offset=${offset}&limit=${limit}`);
}

/** Fetch most-reviewed items */
export async function fetchMostReviewedItems({ offset = 1, limit = 12, type = 'all' } = {}) {
    return apiGet(`${EP.REVIEWED_ITEM_URI}?type=${type}&offset=${offset}&limit=${limit}`);
}

/** Fetch items in a specific store */
export async function fetchStoreItems(storeId, { offset = 1, limit = 20, categoryId = 0, type = 'all' } = {}) {
    return apiGet(`${EP.LATEST_ITEM_URI}?store_id=${storeId}&category_id=${categoryId}&offset=${offset}&limit=${limit}&type=${type}`);
}

/** Fetch recommended items for a store */
export async function fetchRecommendedItems({ storeId, filter } = {}) {
    let url = EP.RECOMMENDED_ITEM_URI;
    const params = [];
    if (storeId) params.push(`store_id=${storeId}`);
    if (filter) params.push(`filter=${filter}`);
    if (params.length) url += '?' + params.join('&');
    return apiGet(url);
}

/** Fetch set-menu items */
export async function fetchSetMenuItems({ offset = 1, limit = 12 } = {}) {
    return apiGet(`${EP.SET_MENU_URI}?offset=${offset}&limit=${limit}`);
}

/** Fetch discounted items */
export async function fetchDiscountedItems({ offset = 1, limit = 12, type = 'all' } = {}) {
    return apiGet(`${EP.DISCOUNTED_ITEMS_URI}?type=${type}&offset=${offset}&limit=${limit}`);
}

/** Fetch basic medicine items (pharmacy) */
export async function fetchBasicMedicineItems({ offset = 1, limit = 12 } = {}) {
    return apiGet(`${EP.BASIC_MEDICINE_URI}?offset=${offset}&limit=${limit}`);
}

/** Fetch cart-store suggested items */
export async function fetchCartStoreSuggestedItems(storeId, { offset = 1, limit = 10 } = {}) {
    return apiGet(`${EP.CART_STORE_SUGGESTED_URI}?store_id=${storeId}&offset=${offset}&limit=${limit}`);
}

/** Search items and stores combined */
export async function searchItemsAndStores(query, { offset = 1, limit = 20 } = {}) {
    return apiGet(`${EP.SEARCH_SUGGESTIONS_URI}?name=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`);
}

/** Submit item review */
export async function submitItemReview(body) {
    return apiPost(EP.REVIEW_URI, body);
}

/** Fetch featured category items */
export async function fetchFeaturedCategoryItems() {
    return apiGet(EP.FEATURED_CATEGORIES_URI);
}
