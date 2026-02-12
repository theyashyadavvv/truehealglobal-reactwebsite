/**
 * Wishlist API Service — mirrors Flutter favourite_repository.dart
 */
import { apiGet, apiPost } from '../config';
import * as EP from '../endpoints';

/** Get wishlist */
export async function fetchWishlist() {
    return apiGet(EP.WISHLIST_GET_URI);
}

/** Add item to wishlist */
export async function addToWishlist(itemId) {
    return apiPost(`${EP.WISHLIST_ADD_URI}?item_id=${itemId}`);
}

/** Remove item from wishlist */
export async function removeFromWishlist(itemId) {
    return apiGet(`${EP.WISHLIST_REMOVE_URI}?item_id=${itemId}`);
}
