/**
 * LocationPicker — Full-screen map picker matching Flutter's PickMapScreen
 * Uses Leaflet (OpenStreetMap) for map display + backend-proxied Google APIs for search/geocode
 *
 * Flow: Search → Autocomplete → Place Details → Move Map → Reverse Geocode → Zone Check → Return Address
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { HiSearch, HiX, HiLocationMarker, HiArrowLeft } from 'react-icons/hi';
import {
    searchPlaces, getPlaceDetails, reverseGeocode, getZoneFromLatLng,
    parsePredictions, extractLatLng, extractAddress,
} from '../api/services/mapService';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';

// Fix Leaflet default marker icon (Vite bundling issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom red pin marker
const pinIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

/** Component to handle map clicks and drag end */
function MapEventHandler({ onPositionChange }) {
    useMapEvents({
        moveend: (e) => {
            const center = e.target.getCenter();
            onPositionChange(center.lat, center.lng);
        },
    });
    return null;
}

/** Component to programmatically fly to a position */
function FlyToPosition({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 16, { duration: 1 });
        }
    }, [position, map]);
    return null;
}

export default function LocationPicker({ initialLat, initialLng, initialAddress, onPick, onClose }) {
    const defaultLat = parseFloat(initialLat) || 28.6139;
    const defaultLng = parseFloat(initialLng) || 77.2090;

    const [position, setPosition] = useState({ lat: defaultLat, lng: defaultLng });
    const [flyTarget, setFlyTarget] = useState(null);
    const [address, setAddress] = useState(initialAddress || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [searching, setSearching] = useState(false);
    const [geocoding, setGeocoding] = useState(false);
    const [inZone, setInZone] = useState(true);
    const [zoneData, setZoneData] = useState(null);
    const [error, setError] = useState('');
    const searchTimeout = useRef(null);

    // Reverse geocode + zone check when position changes
    const handlePositionChange = useCallback(async (lat, lng) => {
        setPosition({ lat, lng });
        setGeocoding(true);
        setError('');

        try {
            // Parallel: reverse geocode + zone check (matching Flutter's updatePosition)
            const [geoResult, zoneResult] = await Promise.allSettled([
                reverseGeocode(lat, lng),
                getZoneFromLatLng(lat, lng),
            ]);

            // Handle geocode
            if (geoResult.status === 'fulfilled') {
                const addr = extractAddress(geoResult.value);
                if (addr) setAddress(addr);
            }

            // Handle zone check
            if (zoneResult.status === 'fulfilled') {
                setInZone(true);
                setZoneData(zoneResult.value);
            } else {
                setInZone(false);
                setZoneData(null);
            }
        } catch (err) {
            console.error('Geocode/zone error:', err);
        } finally {
            setGeocoding(false);
        }
    }, []);

    // Initial reverse geocode on mount
    useEffect(() => {
        if (!initialAddress) {
            handlePositionChange(defaultLat, defaultLng);
        }
    }, []);

    // Search autocomplete with debounce
    const handleSearchInput = (query) => {
        setSearchQuery(query);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (query.length < 2) {
            setPredictions([]);
            return;
        }

        searchTimeout.current = setTimeout(async () => {
            setSearching(true);
            try {
                const data = await searchPlaces(query);
                const parsed = parsePredictions(data);
                setPredictions(parsed);
            } catch (err) {
                console.error('Search error:', err);
                setPredictions([]);
            } finally {
                setSearching(false);
            }
        }, 400);
    };

    // Select a prediction → get place details → fly map there
    const handleSelectPlace = async (prediction) => {
        setShowSearch(false);
        setSearchQuery('');
        setPredictions([]);
        setGeocoding(true);

        try {
            const data = await getPlaceDetails(prediction.place_id);
            const latLng = extractLatLng(data);
            if (latLng) {
                setPosition({ lat: latLng.lat, lng: latLng.lng });
                setFlyTarget([latLng.lat, latLng.lng]);
                setAddress(prediction.description);
                // Zone check for new position
                try {
                    const zoneResult = await getZoneFromLatLng(latLng.lat, latLng.lng);
                    setInZone(true);
                    setZoneData(zoneResult);
                } catch {
                    setInZone(false);
                    setZoneData(null);
                }
            } else {
                setError('Could not get location coordinates');
            }
        } catch (err) {
            setError('Failed to get place details');
            console.error(err);
        } finally {
            setGeocoding(false);
        }
    };

    // Use browser geolocation
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
        }
        setGeocoding(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setPosition({ lat, lng });
                setFlyTarget([lat, lng]);
                handlePositionChange(lat, lng);
            },
            (err) => {
                setError('Location access denied');
                setGeocoding(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // Confirm location pick
    const handleConfirm = () => {
        if (!inZone) {
            setError('Service not available in this area');
            return;
        }
        onPick({
            latitude: String(position.lat),
            longitude: String(position.lng),
            address: address,
            zone_id: zoneData?.zone_id || null,
            zone_ids: zoneData?.zone_ids || zoneData?.zone_id ? [zoneData.zone_id] : [],
        });
    };

    return (
        <div className="location-picker">
            {/* Top bar */}
            <div className="location-picker__topbar">
                <button className="location-picker__back" onClick={onClose}>
                    <HiArrowLeft size={22} />
                </button>
                <button className="location-picker__search-btn" onClick={() => setShowSearch(true)}>
                    <HiSearch size={18} />
                    <span>{address || 'Search for location...'}</span>
                </button>
            </div>

            {/* Search overlay */}
            {showSearch && (
                <div className="location-picker__search-overlay">
                    <div className="location-picker__search-header">
                        <button onClick={() => { setShowSearch(false); setPredictions([]); }}>
                            <HiArrowLeft size={22} />
                        </button>
                        <input
                            type="text"
                            className="location-picker__search-input"
                            placeholder="Search for area, street name..."
                            value={searchQuery}
                            onChange={e => handleSearchInput(e.target.value)}
                            autoFocus
                        />
                        {searchQuery && (
                            <button onClick={() => { setSearchQuery(''); setPredictions([]); }}>
                                <HiX size={18} />
                            </button>
                        )}
                    </div>

                    {/* Use my location button */}
                    <button className="location-picker__my-location" onClick={() => { handleUseMyLocation(); setShowSearch(false); }}>
                        <HiLocationMarker size={18} />
                        <span>Use my current location</span>
                    </button>

                    {/* Predictions */}
                    <div className="location-picker__predictions">
                        {searching && <div className="location-picker__loading">Searching...</div>}
                        {predictions.map((p, i) => (
                            <button key={i} className="location-picker__prediction" onClick={() => handleSelectPlace(p)}>
                                <HiLocationMarker size={16} />
                                <span>{p.description}</span>
                            </button>
                        ))}
                        {!searching && searchQuery.length >= 2 && predictions.length === 0 && (
                            <div className="location-picker__loading">No results found</div>
                        )}
                    </div>
                </div>
            )}

            {/* Map */}
            <div className="location-picker__map">
                <MapContainer
                    center={[position.lat, position.lng]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[position.lat, position.lng]} icon={pinIcon} />
                    <MapEventHandler onPositionChange={handlePositionChange} />
                    {flyTarget && <FlyToPosition position={flyTarget} />}
                </MapContainer>

                {/* Center crosshair indicator */}
                <div className="location-picker__center-pin">
                    <HiLocationMarker size={36} />
                </div>
            </div>

            {/* Bottom panel */}
            <div className="location-picker__bottom">
                {error && <div className="location-picker__error">{error}</div>}
                {!inZone && <div className="location-picker__warning">Service not available in this area</div>}

                <div className="location-picker__address-preview">
                    <HiLocationMarker size={20} className="location-picker__addr-icon" />
                    <div>
                        <p className="location-picker__addr-text">
                            {geocoding ? 'Getting address...' : (address || 'Move the map to select location')}
                        </p>
                    </div>
                </div>

                <button
                    className="location-picker__confirm-btn"
                    onClick={handleConfirm}
                    disabled={geocoding || !inZone || !address}
                >
                    {geocoding ? 'Loading...' : 'Pick This Location'}
                </button>
            </div>

            {/* My Location FAB */}
            <button className="location-picker__fab" onClick={handleUseMyLocation}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" /><path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                </svg>
            </button>
        </div>
    );
}
