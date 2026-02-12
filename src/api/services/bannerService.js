/**
 * Banner & Advertisement API Service
 * Mirrors Flutter banner_repository.dart + home_repository.dart
 *
 * Response shape (from Flutter BannerModel):
 * {
 *   banners: [{ id, title, type, image_full_url, link, store, item }],
 *   campaigns: [...]
 * }
 */
import { apiGet } from '../config';
import * as EP from '../endpoints';

/** Fetch all main banners (home page). Returns { banners, campaigns } */
export async function fetchBanners() {
    const data = await apiGet(EP.BANNER_URI);
    return data.banners || [];
}

/** Fetch all banner data including campaigns */
export async function fetchBannerData() {
    return apiGet(EP.BANNER_URI);
}

/** Fetch banners for a specific store */
export async function fetchStoreBanners(storeId) {
    const data = await apiGet(`${EP.BANNER_URI}/${storeId}`);
    return data.banners || [];
}

/** Fetch promotional/other banners */
export async function fetchPromotionalBanners() {
    return apiGet(EP.PROMOTIONAL_BANNER_URI);
}

/** Fetch "Why Choose Us" banners */
export async function fetchWhyChooseBanners() {
    return apiGet(EP.WHY_CHOOSE_URI);
}

/** Fetch video content */
export async function fetchVideoContent() {
    return apiGet(EP.VIDEO_CONTENT_URI);
}

/** Fetch advertisement list */
export async function fetchAdvertisements({ offset = 1, limit = 10 } = {}) {
    return apiGet(`${EP.ADVERTISEMENT_LIST_URI}?offset=${offset}&limit=${limit}`);
}
