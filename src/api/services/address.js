/**
 * Address API Service — mirrors Flutter location_repository.dart
 */
import { apiGet, apiPost, apiPut, apiDelete } from '../config';
import * as EP from '../endpoints';

/** Get all saved addresses */
export async function fetchAddresses() {
    return apiGet(EP.ADDRESS_LIST_URI);
}

/** Add a new address */
export async function addAddress(body) {
    return apiPost(EP.ADD_ADDRESS_URI, body);
}

/** Update an existing address */
export async function updateAddress(addressId, body) {
    return apiPut(`${EP.UPDATE_ADDRESS_URI}${addressId}`, body);
}

/** Delete an address */
export async function deleteAddress(addressId) {
    return apiDelete(`${EP.REMOVE_ADDRESS_URI}?address_id=${addressId}`);
}
