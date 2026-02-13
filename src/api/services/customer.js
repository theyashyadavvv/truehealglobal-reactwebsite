/**
 * Customer / Profile API Service — mirrors Flutter profile_repository.dart
 */
import { apiGet, apiPost, apiPostMultipart, apiDelete } from '../config';
import * as EP from '../endpoints';

/** Get customer info */
export async function fetchCustomerInfo() {
    return apiGet(EP.CUSTOMER_INFO_URI);
}

/** Update customer profile — matches Flutter profile_repository.dart (multipart with 'image' field) */
export async function updateProfile(profileData, imageFile = null) {
    // If already FormData, pass through
    if (profileData instanceof FormData) {
        return apiPostMultipart(EP.UPDATE_PROFILE_URI, profileData);
    }
    // Convert plain object to FormData (Flutter sends Map<String, String> + MultipartBody)
    const formData = new FormData();
    // Flutter's UpdateUserModel.toJson() sends: name, email, phone, otp, button_type, etc.
    const name = `${profileData.f_name || ''} ${profileData.l_name || ''}`.trim();
    formData.append('name', name || '');
    formData.append('email', profileData.email || '');
    formData.append('phone', profileData.phone || '');
    if (profileData.button_type) formData.append('button_type', profileData.button_type);
    if (profileData.password) formData.append('password', profileData.password);
    // Append image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
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

/** Get notifications — Flutter: simple GET, no pagination, returns plain array */
export async function fetchNotifications() {
    return apiGet(EP.NOTIFICATION_URI);
}

/** Delete account */
export async function removeAccount() {
    return apiDelete(EP.CUSTOMER_REMOVE_URI);
}
