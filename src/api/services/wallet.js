/**
 * Wallet & Loyalty API Service — mirrors Flutter wallet_repository.dart
 */
import { apiGet, apiPost } from '../config';
import * as EP from '../endpoints';

/** Get wallet transactions */
export async function fetchWalletTransactions({ offset = 1, limit = 10 } = {}) {
    return apiGet(`${EP.WALLET_TRANSACTION_URI}?offset=${offset}&limit=${limit}`);
}

/** Add funds to wallet */
export async function addFundToWallet(body) {
    return apiPost(EP.ADD_FUND_URI, body);
}

/** Get wallet bonuses */
export async function fetchWalletBonuses() {
    return apiGet(EP.WALLET_BONUS_URI);
}

/** Get loyalty point transactions */
export async function fetchLoyaltyTransactions({ offset = 1, limit = 10 } = {}) {
    return apiGet(`${EP.LOYALTY_TRANSACTION_URI}?offset=${offset}&limit=${limit}`);
}

/** Transfer loyalty points to wallet */
export async function transferLoyaltyPoints(point) {
    return apiPost(EP.LOYALTY_TRANSFER_URI, { point });
}
