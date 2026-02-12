/**
 * Customer / Profile API Service — mirrors Flutter profile_repository.dart
 */
import { apiGet, apiPost, apiPostMultipart, apiDelete } from '../config';
import * as EP from '../endpoints';

/** Get customer info */
export async function fetchCustomerInfo() {
    return apiGet(EP.CUSTOMER_INFO_URI);
}

/** Update customer profile */
export async function updateProfile(formData) {
    return apiPostMultipart(EP.UPDATE_PROFILE_URI, formData);
}

/** Update Firebase token */
export async function updateFirebaseToken(token) {
    return apiPost(EP.TOKEN_URI, { _method: 'put', cm_firebase_token: token });
}

/** Update zone */
export async function updateZone(zoneIds) {
    return apiPost(EP.UPDATE_ZONE_URI, { zone_ids: zoneIds });
}

/** Update customer interests */
export async function updateInterests(interests) {
    return apiPost(EP.INTEREST_URI, { interest: interests });
}

/** Get suggested items */
export async function fetchSuggestedItems() {
    return apiGet(EP.SUGGESTED_ITEM_URI);
}

/** Get notifications */
export async function fetchNotifications({ offset = 1, limit = 10 } = {}) {
    return apiGet(`${EP.NOTIFICATION_URI}?offset=${offset}&limit=${limit}`);
}

/** Delete account */
export async function removeAccount() {
    return apiDelete(EP.CUSTOMER_REMOVE_URI);
}
