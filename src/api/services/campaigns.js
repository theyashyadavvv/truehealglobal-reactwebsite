/**
 * Campaign & Flash Sale API Service — mirrors Flutter campaign_repository.dart
 */
import { apiGet } from '../config';
import * as EP from '../endpoints';

/** Fetch basic campaigns */
export async function fetchBasicCampaigns() {
    return apiGet(EP.BASIC_CAMPAIGN_URI);
}

/** Fetch item campaigns */
export async function fetchItemCampaigns() {
    return apiGet(EP.ITEM_CAMPAIGN_URI);
}

/** Fetch campaign details */
export async function fetchCampaignDetails(campaignId) {
    return apiGet(`${EP.CAMPAIGN_DETAILS_URI}?basic_campaign_id=${campaignId}`);
}

/** Fetch flash sales */
export async function fetchFlashSales() {
    return apiGet(EP.FLASH_SALE_URI);
}

/** Fetch flash sale products */
export async function fetchFlashSaleProducts(flashSaleId, { offset = 1, limit = 12 } = {}) {
    return apiGet(`${EP.FLASH_SALE_PRODUCTS_URI}?flash_sale_id=${flashSaleId}&offset=${offset}&limit=${limit}`);
}
