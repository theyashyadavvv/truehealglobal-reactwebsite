/**
 * Delivery Man API Service
 */
import { apiGet, apiPost } from '../config';
import * as EP from '../endpoints';

/** Get delivery person's last location */
export async function getDeliveryManLocation(orderId) {
    return apiGet(`${EP.LAST_LOCATION_URI}?order_id=${orderId}`);
}

/** Submit delivery man review */
export async function submitDeliveryReview(body) {
    return apiPost(EP.DELIVERY_REVIEW_URI, body);
}
