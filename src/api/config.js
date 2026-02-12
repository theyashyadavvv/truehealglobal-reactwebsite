/**
 * API Configuration for THG Website
 * Mirrors the header structure from the Flutter app's ApiClient.
 * Matches 6ammart backend requirements exactly.
 */

export const BASE_URL = 'https://admin.truehealglobal.com';

// ─── Storage Keys (same as Flutter app_constants) ────────────────────────
const STORAGE_KEYS = {
    TOKEN: '6ammart_token',
    GUEST_ID: '6ammart_guest_id',
    USER_ADDRESS: '6ammart_user_address',
    MODULE_ID: '6ammart_module_id',
    ZONE_IDS: '6ammart_zone_ids',
    LATITUDE: '6ammart_latitude',
    LONGITUDE: '6ammart_longitude',
    LANGUAGE: '6ammart_language',
};

// ─── Defaults ────────────────────────────────────────────────────────────
const DEFAULTS = {
    ZONE_IDS: [7],
    MODULE_ID: 6,
    LATITUDE: '28.6139',
    LONGITUDE: '77.2090',
    LANGUAGE: 'en',
};

// ─── Token / Session Management ──────────────────────────────────────────
export function getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) || null;
}
export function saveToken(token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}
export function clearToken() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
}

export function getGuestId() {
    return localStorage.getItem(STORAGE_KEYS.GUEST_ID) || null;
}
export function saveGuestId(id) {
    localStorage.setItem(STORAGE_KEYS.GUEST_ID, String(id));
}

// ─── Zone / Module / Location ────────────────────────────────────────────
export function getZoneIds() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.ZONE_IDS);
        return raw ? JSON.parse(raw) : DEFAULTS.ZONE_IDS;
    } catch { return DEFAULTS.ZONE_IDS; }
}
export function saveZoneIds(ids) {
    localStorage.setItem(STORAGE_KEYS.ZONE_IDS, JSON.stringify(ids));
}

export function getModuleId() {
    const raw = localStorage.getItem(STORAGE_KEYS.MODULE_ID);
    return raw ? Number(raw) : DEFAULTS.MODULE_ID;
}
export function saveModuleId(id) {
    localStorage.setItem(STORAGE_KEYS.MODULE_ID, String(id));
}

export function getLatitude() {
    return localStorage.getItem(STORAGE_KEYS.LATITUDE) || DEFAULTS.LATITUDE;
}
export function getLongitude() {
    return localStorage.getItem(STORAGE_KEYS.LONGITUDE) || DEFAULTS.LONGITUDE;
}
export function saveLocation(lat, lng) {
    localStorage.setItem(STORAGE_KEYS.LATITUDE, String(lat));
    localStorage.setItem(STORAGE_KEYS.LONGITUDE, String(lng));
}

export function getLanguage() {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULTS.LANGUAGE;
}

// ─── Clear all session data (logout) ─────────────────────────────────────
export function clearAllSession() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
}

// ─── Build Headers (mirrors Flutter ApiClient.updateHeader) ──────────────
export function getApiHeaders(token = null, { includeModuleId = true } = {}) {
    const t = token || getToken();
    const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'zoneId': JSON.stringify(getZoneIds()),
        'X-localization': getLanguage(),
        'latitude': getLatitude(),
        'longitude': getLongitude(),
    };
    if (includeModuleId) {
        headers['moduleId'] = String(getModuleId());
    }
    if (t) {
        headers['Authorization'] = `Bearer ${t}`;
    }
    return headers;
}

// ─── Response Handler (mirrors Flutter ApiClient.handleResponse) ─────────
async function handleResponse(response) {
    const data = await response.json().catch(() => null);

    if (response.ok) return data;

    // 401 → clear session
    if (response.status === 401) {
        clearAllSession();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    // Extract error message like Flutter does
    let message = `API error ${response.status}`;
    if (data) {
        if (data.errors && data.errors.length > 0) {
            message = data.errors.map(e => e.message || e.code).join(', ');
        } else if (data.message) {
            message = data.message;
        }
    }
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
}

// ─── Append guest_id to URL for unauthenticated cart/order calls ─────────
function appendGuestId(url) {
    if (!getToken()) {
        const guestId = getGuestId();
        if (guestId) {
            const sep = url.includes('?') ? '&' : '?';
            return `${url}${sep}guest_id=${guestId}`;
        }
    }
    return url;
}

// ─── HTTP Methods ────────────────────────────────────────────────────────
export async function apiGet(endpoint, token = null, opts = {}) {
    const url = appendGuestId(`${BASE_URL}${endpoint}`);
    const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders(token, opts),
    });
    return handleResponse(response);
}

export async function apiPost(endpoint, body = {}, token = null, opts = {}) {
    const url = appendGuestId(`${BASE_URL}${endpoint}`);
    // Strip null values (same as Flutter)
    const cleaned = Object.fromEntries(
        Object.entries(body).filter(([, v]) => v !== null && v !== undefined)
    );
    const response = await fetch(url, {
        method: 'POST',
        headers: getApiHeaders(token, opts),
        body: JSON.stringify(cleaned),
    });
    return handleResponse(response);
}

export async function apiPut(endpoint, body = {}, token = null) {
    const url = appendGuestId(`${BASE_URL}${endpoint}`);
    const cleaned = Object.fromEntries(
        Object.entries(body).filter(([, v]) => v !== null && v !== undefined)
    );
    const response = await fetch(url, {
        method: 'PUT',
        headers: getApiHeaders(token),
        body: JSON.stringify(cleaned),
    });
    return handleResponse(response);
}

export async function apiDelete(endpoint, token = null) {
    const url = appendGuestId(`${BASE_URL}${endpoint}`);
    const response = await fetch(url, {
        method: 'DELETE',
        headers: getApiHeaders(token),
    });
    return handleResponse(response);
}

export async function apiPostMultipart(endpoint, formData, token = null) {
    const t = token || getToken();
    const headers = {
        'zoneId': JSON.stringify(getZoneIds()),
        'moduleId': String(getModuleId()),
        'X-localization': getLanguage(),
        'latitude': getLatitude(),
        'longitude': getLongitude(),
    };
    if (t) headers['Authorization'] = `Bearer ${t}`;
    // No Content-Type — browser sets multipart boundary automatically

    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
    });
    return handleResponse(response);
}
