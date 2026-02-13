import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import './GlobeSection.css';

const Globe3D = lazy(() => import('../ui/3d-globe').then(m => ({ default: m.Globe3D })));

const sampleMarkers = [
    { lat: 40.7128, lng: -74.006, src: 'https://assets.aceternity.com/avatars/1.webp', label: 'New York' },
    { lat: 51.5074, lng: -0.1278, src: 'https://assets.aceternity.com/avatars/2.webp', label: 'London' },
    { lat: 35.6762, lng: 139.6503, src: 'https://assets.aceternity.com/avatars/3.webp', label: 'Tokyo' },
    { lat: -33.8688, lng: 151.2093, src: 'https://assets.aceternity.com/avatars/4.webp', label: 'Sydney' },
    { lat: 48.8566, lng: 2.3522, src: 'https://assets.aceternity.com/avatars/5.webp', label: 'Paris' },
    { lat: 28.6139, lng: 77.209, src: 'https://assets.aceternity.com/avatars/6.webp', label: 'New Delhi' },
    { lat: 55.7558, lng: 37.6173, src: 'https://assets.aceternity.com/avatars/7.webp', label: 'Moscow' },
    { lat: -22.9068, lng: -43.1729, src: 'https://assets.aceternity.com/avatars/8.webp', label: 'Rio de Janeiro' },
    { lat: 31.2304, lng: 121.4737, src: 'https://assets.aceternity.com/avatars/9.webp', label: 'Shanghai' },
    { lat: 25.2048, lng: 55.2708, src: 'https://assets.aceternity.com/avatars/10.webp', label: 'Dubai' },
    { lat: -34.6037, lng: -58.3816, src: 'https://assets.aceternity.com/avatars/11.webp', label: 'Buenos Aires' },
    { lat: 1.3521, lng: 103.8198, src: 'https://assets.aceternity.com/avatars/12.webp', label: 'Singapore' },
    { lat: 37.5665, lng: 126.978, src: 'https://assets.aceternity.com/avatars/13.webp', label: 'Seoul' },
];

export default function GlobeSection() {
    return (
        <section className="globe-section">
            {/* Text content */}
            <div className="globe-section__content">
                <h2 className="globe-section__title">
                    Delivering wellness all over the world with a click.
                </h2>
                <p className="globe-section__desc">
                    Shop from our curated collection of health and wellness products, delivered to your doorstep from trusted stores worldwide.
                </p>
                <div className="globe-section__buttons">
                    <Link to="/stores" className="globe-section__btn globe-section__btn--primary">
                        Explore Stores
                    </Link>
                    <Link to="/categories" className="globe-section__btn globe-section__btn--secondary">
                        Browse Categories
                    </Link>
                </div>
            </div>

            {/* Globe */}
            <div className="globe-section__globe">
                <Suspense fallback={
                    <div className="globe-section__loading">Loading globe...</div>
                }>
                    <Globe3D
                        className="globe-section__canvas"
                        markers={sampleMarkers}
                        config={{
                            showAtmosphere: true,
                            atmosphereColor: '#4da6ff',
                            atmosphereIntensity: 20,
                            bumpScale: 5,
                            autoRotateSpeed: 0.3,
                        }}
                    />
                </Suspense>
            </div>
        </section>
    );
}
