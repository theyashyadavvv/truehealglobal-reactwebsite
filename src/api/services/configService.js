/**
 * Config / System API Service — mirrors Flutter splash_repository.dart
 */
import { apiGet, saveModuleId, saveZoneIds } from '../config';
import * as EP from '../endpoints';

/** Get app configuration (payment gateways, toggles, version, etc.) */
export async function fetchConfig() {
    return apiGet(EP.CONFIG_URI);
}

/** Get available modules */
export async function fetchModules() {
    return apiGet(EP.MODULE_URI, null, { includeModuleId: false });
}

/** Set active module */
export function setModule(moduleId) {
    saveModuleId(moduleId);
}

/** Get zone ID based on lat/lng */
export async function getZoneId(lat, lng) {
    const data = await apiGet(`${EP.ZONE_URI}?lat=${lat}&lng=${lng}`);
    if (data.zone_id) saveZoneIds(Array.isArray(data.zone_id) ? data.zone_id : [data.zone_id]);
    return data;
}

/** Check if a zone is available */
export async function checkZone(lat, lng) {
    return apiGet(`${EP.CHECK_ZONE_URI}?lat=${lat}&lng=${lng}`);
}

/** Get list of all zones */
export async function fetchZoneList() {
    return apiGet(EP.ZONE_LIST_URI);
}

/** Get landing page data */
export async function fetchLandingPage() {
    return apiGet(EP.LANDING_PAGE_URI);
}

/** Geocode (lat/lng → address) */
export async function geocode(lat, lng) {
    return apiGet(`${EP.GEOCODE_URI}?lat=${lat}&lng=${lng}`);
}

/** Place autocomplete */
export async function placeAutocomplete(query) {
    return apiGet(`${EP.SEARCH_LOCATION_URI}?search_text=${encodeURIComponent(query)}`);
}

/** Place details */
export async function placeDetails(placeId) {
    return apiGet(`${EP.PLACE_DETAILS_URI}?placeid=${placeId}`);
}

/** Distance calculation */
export async function getDistance(originLat, originLng, destLat, destLng) {
    return apiGet(`${EP.DISTANCE_MATRIX_URI}?origin_lat=${originLat}&origin_lng=${originLng}&destination_lat=${destLat}&destination_lng=${destLng}`);
}

/** Direction */
export async function getDirection(originLat, originLng, destLat, destLng) {
    return apiGet(`${EP.DIRECTION_URI}?origin_lat=${originLat}&origin_lng=${originLng}&destination_lat=${destLat}&destination_lng=${destLng}`);
}
