/**
 * Coupon API Service — mirrors Flutter coupon_repository.dart
 */
import { apiGet } from '../config';
import * as EP from '../endpoints';

/** Fetch all available coupons */
export async function fetchCoupons({ offset = 1, limit = 20 } = {}) {
    return apiGet(`${EP.COUPON_LIST_URI}?offset=${offset}&limit=${limit}`);
}

/** Apply a coupon code */
export async function applyCoupon(code, storeId) {
    let url = `${EP.COUPON_APPLY_URI}?code=${encodeURIComponent(code)}`;
    if (storeId) url += `&store_id=${storeId}`;
    return apiGet(url);
}
