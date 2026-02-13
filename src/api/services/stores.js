/**
 * Store API Service — mirrors Flutter store_repository.dart
 */
import { apiGet, apiPost } from '../config';
import * as EP from '../endpoints';

/** Fetch paginated store list with optional type filter (all/veg/non_veg) */
export async function fetchStores({ offset = 1, limit = 12, type = 'all', filterBy = '' } = {}) {
    // Primary: use /stores/get-stores
    let url = `${EP.STORE_URI}?offset=${offset}&limit=${limit}&type=${type}`;
    if (filterBy) url += `&filter_by=${filterBy}`;
    try {
        return await apiGet(url);
    } catch (err) {
        // Fallback: some backends don't have /get-stores, use /stores/latest instead
        if (err.status === 404) {
            return apiGet(`${EP.LATEST_STORE_URI}?offset=${offset}&limit=${limit}&type=${type}`);
        }
        throw err;
    }
}

/** Fetch store details by ID — unwrap if backend wraps in {store:{...}} */
export async function fetchStoreDetails(storeId) {
    const data = await apiGet(`${EP.STORE_DETAILS_URI}${storeId}`);
    return data?.store || data;
}

/** Fetch popular stores */
export async function fetchPopularStores({ offset = 1, limit = 10, type = 'all' } = {}) {
    return apiGet(`${EP.POPULAR_STORE_URI}?offset=${offset}&limit=${limit}&type=${type}`);
}

/** Fetch latest stores */
export async function fetchLatestStores({ offset = 1, limit = 10, type = 'all' } = {}) {
    return apiGet(`${EP.LATEST_STORE_URI}?offset=${offset}&limit=${limit}&type=${type}`);
}

/** Fetch top offer stores (near me) */
export async function fetchTopOfferStores({ offset = 1, limit = 10 } = {}) {
    return apiGet(`${EP.TOP_OFFER_STORE_URI}?offset=${offset}&limit=${limit}`);
}

/** Fetch recommended stores */
export async function fetchRecommendedStores({ offset = 1, limit = 10, type = 'all' } = {}) {
    return apiGet(`${EP.RECOMMENDED_STORE_URI}?offset=${offset}&limit=${limit}&type=${type}`);
}

/** Fetch store reviews */
export async function fetchStoreReviews(storeId, { offset = 1, limit = 10 } = {}) {
    return apiGet(`${EP.STORE_REVIEW_URI}?store_id=${storeId}&offset=${offset}&limit=${limit}`);
}

/** Fetch visit-again stores */
export async function fetchVisitAgainStores({ offset = 1, limit = 10 } = {}) {
    return apiGet(`${EP.VISIT_AGAIN_STORE_URI}?offset=${offset}&limit=${limit}`);
}

/** Search stores by name — Flutter: /api/v1/stores/search?name={query}&offset=1&limit=50 */
export async function searchStores(query, { offset = 1, limit = 50 } = {}) {
    return apiGet(`/api/v1/stores/search?name=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`);
}

/** Register vendor (store) */
export async function registerVendor(formData) {
    // Use multipart for file uploads
    const { apiPostMultipart } = await import('../config');
    return apiPostMultipart(EP.STORE_REGISTER_URI, formData);
}
