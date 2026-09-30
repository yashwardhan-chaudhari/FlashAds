import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default leaflet marker icon issue in Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom FlashAds Branded Map Pin
const flashAdsIcon = L.divIcon({
  className: 'custom-flashads-marker',
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #2563eb, #f97316);
      border: 3px solid #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      color: white;
      font-weight: bold;
      font-size: 14px;
    ">
      ⚡
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export default function LeafletMap({
  latitude = 18.5204,
  longitude = 73.8567,
  title = 'Advertising Space',
  address = 'Pune, Maharashtra',
  zoom = 15,
  height = '350px',
  className = ''
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const lat = Number(latitude) || 18.5204;
    const lng = Number(longitude) || 73.8567;

    // Initialize map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // OpenStreetMap CartoDB Positron / OSM tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker
      const marker = L.marker([lat, lng], { icon: flashAdsIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; padding: 4px;">
          <strong style="font-size: 13px; color: #0f172a; display: block; margin-bottom: 2px;">${title}</strong>
          <span style="font-size: 11px; color: #64748b;">${address}</span>
        </div>
      `);

      mapInstanceRef.current = map;
    } else {
      // Update center
      mapInstanceRef.current.setView([lat, lng], zoom);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom, title, address]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className={`rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs z-10 ${className}`}
    />
  );
}
