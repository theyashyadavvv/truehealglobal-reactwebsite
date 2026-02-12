/**
 * Order API Service — mirrors Flutter order_repository.dart
 */
import { apiGet, apiPost, apiPostMultipart } from '../config';
import * as EP from '../endpoints';

/** Place a new order */
export async function placeOrder(body) {
    return apiPost(EP.PLACE_ORDER_URI, body);
}

/** Place prescription order (multipart with image) */
export async function placePrescriptionOrder(formData) {
    return apiPostMultipart(EP.PRESCRIPTION_ORDER_URI, formData);
}

/** Get running orders */
export async function fetchRunningOrders({ offset = 1, limit = 10 } = {}) {
    return apiGet(`${EP.RUNNING_ORDER_URI}?offset=${offset}&limit=${limit}`);
}

/** Get order history */
export async function fetchOrderHistory({ offset = 1, limit = 10 } = {}) {
    return apiGet(`${EP.ORDER_LIST_URI}?offset=${offset}&limit=${limit}`);
}

/** Get order details by ID */
export async function fetchOrderDetails(orderId) {
    return apiGet(`${EP.ORDER_DETAILS_URI}?order_id=${orderId}`);
}

/** Cancel an order */
export async function cancelOrder({ order_id, reason }) {
    return apiPost(EP.ORDER_CANCEL_URI, { order_id, reason });
}

/** Track an order */
export async function trackOrder(orderId) {
    return apiGet(`${EP.ORDER_TRACK_URI}?order_id=${orderId}`);
}

/** Switch payment method (COD) */
export async function switchPaymentMethod(body) {
    return apiPost(EP.COD_SWITCH_URI, body);
}

/** Get refund reasons */
export async function fetchRefundReasons() {
    return apiGet(EP.REFUND_REASONS_URI);
}

/** Submit refund request */
export async function submitRefundRequest(formData) {
    return apiPostMultipart(EP.REFUND_REQUEST_URI, formData);
}

/** Get cancellation reasons */
export async function fetchCancellationReasons() {
    return apiGet(EP.CANCELLATION_REASONS_URI);
}

/** Save offline payment info */
export async function saveOfflinePayment(body) {
    return apiPost(EP.OFFLINE_PAYMENT_SAVE_URI, body);
}

/** Update offline payment */
export async function updateOfflinePayment(body) {
    return apiPost(EP.OFFLINE_PAYMENT_UPDATE_URI, body);
}

/** Get parcel instructions */
export async function fetchParcelInstructions() {
    return apiGet(EP.PARCEL_INSTRUCTION_URI);
}

/** Get order tax */
export async function getOrderTax(orderId) {
    return apiGet(`${EP.ORDER_TAX_URI}?order_id=${orderId}`);
}

/** Get surge price */
export async function getSurgePrice(orderId) {
    return apiGet(`${EP.SURGE_PRICE_URI}?order_id=${orderId}`);
}
