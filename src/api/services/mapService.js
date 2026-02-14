/**
 * Map / Location API Service
 * Mirrors Flutter's location_repository.dart
 * All Google API calls are proxied through the 6ammart backend.
 */
import { apiGet } from '../config';
import * as EP from '../endpoints';

/**
 * Reverse Geocode — lat/lng → address string
 * Flutter: LocationRepository.getAddressFromGeocode()
 */
export async function reverseGeocode(lat, lng) {
    return apiGet(`${EP.GEOCODE_URI}?lat=${lat}&lng=${lng}`);
}

/**
 * Place Autocomplete — search text → list of place suggestions
 * Flutter: LocationRepository.searchLocation()
 * Response: { suggestions: [{ placePrediction: { text: { text }, placeId } }] } (Google Places New API)
 *        or { predictions: [{ description, place_id }] } (Legacy format)
 */
export async function searchPlaces(query) {
    return apiGet(`${EP.SEARCH_LOCATION_URI}?search_text=${encodeURIComponent(query)}`);
}

/**
 * Place Details — placeId → lat/lng
 * Flutter: LocationRepository.getLatLng()
 */
export async function getPlaceDetails(placeId) {
    return apiGet(`${EP.PLACE_DETAILS_URI}?placeid=${placeId}`);
}

/**
 * Get Zone ID — check if a lat/lng is in a valid delivery zone
 * Flutter: LocationRepository.getZone()
 * Returns zone_id + zone_ids if valid, 404 if not in zone
 */
export async function getZoneFromLatLng(lat, lng) {
    return apiGet(`${EP.ZONE_URI}?lat=${lat}&lng=${lng}`);
}

/**
 * Check Zone availability
 * Flutter: LocationRepository.checkZone()
 */
export async function checkZone(lat, lng) {
    return apiGet(`${EP.CHECK_ZONE_URI}?lat=${lat}&lng=${lng}`);
}

/**
 * Distance Matrix — origin → destination distance/time
 * Flutter: LocationRepository.getDistanceInKM()
 */
export async function getDistanceMatrix(originLat, originLng, destLat, destLng) {
    return apiGet(`${EP.DISTANCE_MATRIX_URI}?origin_lat=${originLat}&origin_lng=${originLng}&destination_lat=${destLat}&destination_lng=${destLng}`);
}

/**
 * Direction — polyline points between two locations
 * Flutter: LocationRepository.getDirection()
 */
export async function getDirections(originLat, originLng, destLat, destLng) {
    return apiGet(`${EP.DIRECTION_URI}?origin_lat=${originLat}&origin_lng=${originLng}&destination_lat=${destLat}&destination_lng=${destLng}`);
}

/**
 * Parse autocomplete predictions from various response formats
 * The backend may return Google Places New API or Legacy format
 */
export function parsePredictions(data) {
    // New Google Places API format
    if (data?.suggestions) {
        return data.suggestions
            .filter(s => s.placePrediction)
            .map(s => ({
                description: s.placePrediction.text?.text || s.placePrediction.structuredFormat?.mainText?.text || '',
                place_id: s.placePrediction.placeId || '',
            }));
    }
    // Legacy Google Places API format
    if (data?.predictions) {
        return data.predictions.map(p => ({
            description: p.description || '',
            place_id: p.place_id || '',
        }));
    }
    // Direct array
    if (Array.isArray(data)) {
        return data.map(p => ({
            description: p.description || p.text || '',
            place_id: p.place_id || p.placeId || '',
        }));
    }
    return [];
}

/**
 * Extract lat/lng from place details response
 */
export function extractLatLng(data) {
    // Try various response shapes
    if (data?.location) {
        return { lat: data.location.latitude || data.location.lat, lng: data.location.longitude || data.location.lng };
    }
    if (data?.result?.geometry?.location) {
        return { lat: data.result.geometry.location.lat, lng: data.result.geometry.location.lng };
    }
    if (data?.lat && data?.lng) {
        return { lat: data.lat, lng: data.lng };
    }
    if (data?.latitude && data?.longitude) {
        return { lat: data.latitude, lng: data.longitude };
    }
    return null;
}

/**
 * Extract address string from reverse geocode response
 */
export function extractAddress(data) {
    if (typeof data === 'string') return data;
    // Multiple possible formats
    if (data?.results?.[0]?.formatted_address) return data.results[0].formatted_address;
    if (data?.result?.formatted_address) return data.result.formatted_address;
    if (data?.formatted_address) return data.formatted_address;
    if (data?.address) return data.address;
    if (data?.display_name) return data.display_name;
    return '';
}
