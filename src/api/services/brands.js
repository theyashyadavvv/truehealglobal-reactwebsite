/**
 * Brand API Service — mirrors Flutter brand_repository.dart
 */
import { apiGet } from '../config';
import * as EP from '../endpoints';

/** Fetch all brands */
export async function fetchBrands({ offset = 1, limit = 20 } = {}) {
    return apiGet(`${EP.BRAND_LIST_URI}?offset=${offset}&limit=${limit}`);
}

/** Fetch items for a specific brand */
export async function fetchBrandItems(brandId, { offset = 1, limit = 12 } = {}) {
    return apiGet(`${EP.BRAND_ITEMS_URI}?brand_id=${brandId}&offset=${offset}&limit=${limit}`);
}
