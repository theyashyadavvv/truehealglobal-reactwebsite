/**
 * Cashback API Service
 */
import { apiGet } from '../config';
import * as EP from '../endpoints';

/** Fetch cashback offers */
export async function fetchCashbackOffers() {
    return apiGet(EP.CASHBACK_LIST_URI);
}

/** Get cashback amount for an order */
export async function getCashbackAmount(orderAmount) {
    return apiGet(`${EP.CASHBACK_AMOUNT_URI}?amount=${orderAmount}`);
}
