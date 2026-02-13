/**
 * Wishlist API Service — mirrors Flutter favourite_repository.dart
 */
import { apiGet, apiPost, apiDelete } from '../config';
import * as EP from '../endpoints';

/** Get wishlist */
export async function fetchWishlist() {
    return apiGet(EP.WISHLIST_GET_URI);
}

/** Add item/store to wishlist — Flutter: POST with null body, id in query param */
export async function addToWishlist(id, isStore = false) {
    const param = isStore ? `store_id=${id}` : `item_id=${id}`;
    return apiPost(`${EP.WISHLIST_ADD_URI}?${param}`, {});
}

/** Remove item/store from wishlist — Flutter: DELETE, id in query param */
export async function removeFromWishlist(id, isStore = false) {
    const param = isStore ? `store_id=${id}` : `item_id=${id}`;
    return apiDelete(`${EP.WISHLIST_REMOVE_URI}?${param}`);
}
