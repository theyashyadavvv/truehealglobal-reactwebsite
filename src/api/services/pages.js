/**
 * Static Pages API Service
 */
import { apiGet, apiPost } from '../config';
import * as EP from '../endpoints';

/** About Us */
export async function fetchAboutUs() { return apiGet(EP.ABOUT_US_URI); }

/** Privacy Policy */
export async function fetchPrivacyPolicy() { return apiGet(EP.PRIVACY_POLICY_URI); }

/** Terms & Conditions */
export async function fetchTermsAndConditions() { return apiGet(EP.TERMS_URI); }

/** Cancellation Policy */
export async function fetchCancellationPolicy() { return apiGet(EP.CANCELLATION_URI); }

/** Refund Policy */
export async function fetchRefundPolicy() { return apiGet(EP.REFUND_POLICY_URI); }

/** Shipping Policy */
export async function fetchShippingPolicy() { return apiGet(EP.SHIPPING_POLICY_URI); }

/** Subscribe to newsletter */
export async function subscribeNewsletter(email) {
    return apiPost(EP.NEWSLETTER_URI, { email });
}

/** Fetch offline payment methods */
export async function fetchOfflinePaymentMethods() {
    return apiGet(EP.OFFLINE_METHODS_URI);
}
