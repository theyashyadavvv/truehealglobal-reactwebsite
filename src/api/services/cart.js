/**
 * Cart API Service — mirrors Flutter cart_repository.dart (online cart)
 */
import { apiGet, apiPost, apiDelete } from '../config';
import * as EP from '../endpoints';

/** Get the full cart list */
export async function fetchCartList() {
    return apiGet(EP.GET_CART_LIST_URI);
}

/** Add an item to the online cart */
export async function addToCart(body) {
    // body: { item_id, price, quantity, variation, add_on_ids[], add_on_qtys[], variant }
    return apiPost(EP.ADD_CART_URI, body);
}

/** Update a cart item (quantity, variation, etc.) */
export async function updateCartItem(body) {
    return apiPost(EP.UPDATE_CART_URI, body);
}

/** Remove ALL items from cart */
export async function removeAllCart() {
    return apiDelete(EP.REMOVE_ALL_CART_URI);
}

/** Remove a specific item from cart */
export async function removeCartItem(cartId) {
    return apiDelete(`${EP.REMOVE_ITEM_CART_URI}?cart_id=${cartId}`);
}
