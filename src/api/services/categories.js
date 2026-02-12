/**
 * Category API Service — mirrors Flutter category_repository.dart
 */
import { apiGet } from '../config';
import * as EP from '../endpoints';

/** Fetch all categories */
export async function fetchCategories() {
    return apiGet(EP.CATEGORY_URI);
}

/** Fetch sub-categories by parent ID */
export async function fetchSubCategories(categoryId) {
    return apiGet(`${EP.SUB_CATEGORY_URI}${categoryId}`);
}

/** Fetch items in a category (paginated) */
export async function fetchCategoryItems(categoryId, { offset = 1, limit = 12, type = 'all' } = {}) {
    return apiGet(`${EP.CATEGORY_ITEM_URI}${categoryId}?offset=${offset}&limit=${limit}&type=${type}`);
}

/** Fetch stores in a category */
export async function fetchCategoryStores(categoryId, { offset = 1, limit = 12, type = 'all' } = {}) {
    return apiGet(`${EP.CATEGORY_STORE_URI}${categoryId}?offset=${offset}&limit=${limit}&type=${type}`);
}

/** Fetch featured category items */
export async function fetchFeaturedCategoryItems() {
    return apiGet(EP.FEATURED_CATEGORIES_URI);
}

/** Fetch popular categories */
export async function fetchPopularCategories() {
    return apiGet(EP.POPULAR_CATEGORIES_URI);
}
