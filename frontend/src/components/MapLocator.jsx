import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

export default function MapLocator({ onLocationSelect, initialPosition }) {
    const mapContainerRef = useRef(null);
    const mapInstance = useRef(null);
    const markerInstance = useRef(null);

    useEffect(() => {
        if (!mapContainerRef.current || mapInstance.current) return;

        // Initialize map
        const defaultCenter = initialPosition || { lat: 51.505, lng: -0.09 };
        mapInstance.current = L.map(mapContainerRef.current).setView([defaultCenter.lat, defaultCenter.lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(mapInstance.current);

        if (initialPosition) {
            markerInstance.current = L.marker([initialPosition.lat, initialPosition.lng]).addTo(mapInstance.current);
        }

        // Handle clicks
        mapInstance.current.on('click', (e) => {
            const { lat, lng } = e.latlng;
            if (markerInstance.current) {
                markerInstance.current.setLatLng([lat, lng]);
            } else {
                markerInstance.current = L.marker([lat, lng]).addTo(mapInstance.current);
            }
            if (onLocationSelect) {
                onLocationSelect({ lat, lng });
            }
        });

        // Try geolocation on mount if no initial position
        if (!initialPosition && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    if (mapInstance.current) {
                        mapInstance.current.setView([latitude, longitude], 13);
                    }
                },
                (err) => console.log('Geolocation error:', err),
                { timeout: 5000 }
            );
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []); // Only run once on mount

    return (
        <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: '220px' }}>
            {/* Instruction overlay */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse inline-block" />
                Click map to pin your location
            </div>
            <div ref={mapContainerRef} className="h-full w-full z-10" />
        </div>
    );
}
