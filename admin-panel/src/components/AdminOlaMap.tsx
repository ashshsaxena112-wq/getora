// ==============================================================================
// GETORA ADMIN OLA MAP / KRUTRIM MAPS OPERATIONAL COMPONENT
// Powered by MapLibre GL & Ola Maps Vector Tile Service
// Dark Operations Theme (#121212, #181818, #1DB954)
// ==============================================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { OlaMaps } from 'olamaps-web-sdk';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Navigation, Loader2 } from 'lucide-react';

export interface AdminMapPin {
  id: string;
  type: 'rider' | 'order' | 'shop';
  name: string;
  status: string;
  eta?: string;
  customer?: string;
  activeOrders?: number;
  color: string;
  lat: number;
  lng: number;
  zone?: string;
}

export interface AdminOlaMapProps {
  pins: AdminMapPin[];
  selectedPin: AdminMapPin | null;
  onSelectPin: (pin: AdminMapPin | null) => void;
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  height?: string;
}

const JAIPUR_ZONES = [
  {
    id: 'zone-vaishali',
    name: 'Vaishali Nagar & Civil Lines',
    color: '#1DB954',
    polygon: [
      [26.9200, 75.7200],
      [26.9200, 75.7800],
      [26.8600, 75.7800],
      [26.8600, 75.7200],
      [26.9200, 75.7200],
    ],
  },
  {
    id: 'zone-malviya',
    name: 'Malviya Nagar & Jagatpura',
    color: '#3B82F6',
    polygon: [
      [26.8700, 75.7900],
      [26.8700, 75.8600],
      [26.8100, 75.8600],
      [26.8100, 75.7900],
      [26.8700, 75.7900],
    ],
  },
  {
    id: 'zone-mansarovar',
    name: 'Mansarovar & Sanganer',
    color: '#F59E0B',
    polygon: [
      [26.8800, 75.7400],
      [26.8800, 75.7900],
      [26.8200, 75.7900],
      [26.8200, 75.7400],
      [26.8800, 75.7400],
    ],
  },
];

export const AdminOlaMap: React.FC<AdminOlaMapProps> = ({
  pins,
  selectedPin,
  onSelectPin,
  center = [26.8800, 75.7800], // Center of Jaipur
  zoom = 12.2,
  height = '620px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [containerId] = useState(() => `admin-ola-map-${Math.random().toString(36).substring(2, 9)}`);

  // Initialize Map using Ola Maps Web SDK v2
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isCancelled = false;
    let mapInstance: any = null;

    const setupZones = (map: any) => {
      JAIPUR_ZONES.forEach((z) => {
        const sourceId = `admin-zone-${z.id}`;
        const polygonCoords = z.polygon.map((c) => [c[1], c[0]]);

        const zoneGeoJson: any = {
          type: 'Feature',
          properties: { name: z.name },
          geometry: {
            type: 'Polygon',
            coordinates: [polygonCoords],
          },
        };

        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: 'geojson',
            data: zoneGeoJson,
          });

          map.addLayer({
            id: `${sourceId}-fill`,
            type: 'fill',
            source: sourceId,
            paint: {
              'fill-color': z.color,
              'fill-opacity': 0.08,
            },
          });

          map.addLayer({
            id: `${sourceId}-line`,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': z.color,
              'line-width': 1.5,
              'line-dasharray': [3, 3],
            },
          });
        }
      });
    };

    (async () => {
      try {
        const apiKey = ((import.meta as any).env.VITE_OLA_MAPS_API_KEY as string) || 'getora-admin-client';
        const styleUrl = 'https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json';

        // Official Ola Maps Web SDK v2 Initialization
        const olaMaps = new OlaMaps({ apiKey });

        const map = await olaMaps.init({
          style: styleUrl,
          container: containerId,
          center: [center[1], center[0]],
          zoom: zoom,
        });

        if (isCancelled) {
          map.remove();
          return;
        }

        mapInstance = map;
        mapInstanceRef.current = map;

        map.addControl(olaMaps.addNavigationControls({ showCompass: true, showZoom: true }), 'bottom-right');

        map.on('load', () => {
          if (!isCancelled) {
            setMapLoaded(true);
            setupZones(map);
          }
        });
      } catch (sdkErr: any) {
        console.warn('Admin Ola Maps Web SDK fallback init:', sdkErr?.message);
        if (isCancelled || !mapContainerRef.current) return;

        try {
          const fallbackMap = new maplibregl.Map({
            container: mapContainerRef.current,
            style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
            center: [center[1], center[0]],
            zoom: zoom,
            attributionControl: false,
          });

          if (isCancelled) {
            fallbackMap.remove();
            return;
          }

          mapInstance = fallbackMap;
          mapInstanceRef.current = fallbackMap;

          fallbackMap.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'bottom-right');

          fallbackMap.on('load', () => {
            if (!isCancelled) {
              setMapLoaded(true);
              setupZones(fallbackMap);
            }
          });
        } catch (err) {
          console.error('Failed to initialize admin map:', err);
        }
      }
    })();

    return () => {
      isCancelled = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      if (mapInstance) {
        mapInstance.remove();
      }
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    pins.forEach((pin) => {
      const isSelected = selectedPin?.id === pin.id;

      const el = document.createElement('div');
      el.className = 'cursor-pointer group';
      el.style.transform = 'translate(-50%, -50%)';

      let iconSvg = '';
      if (pin.type === 'rider') {
        iconSvg = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18.5" cy="17.5" r="3.5"></circle>
            <circle cx="5.5" cy="17.5" r="3.5"></circle>
            <circle cx="15" cy="5" r="1"></circle>
            <path d="M12 17.5V14l-3-3 4-3 2 3h2"></path>
          </svg>
        `;
      } else if (pin.type === 'order') {
        iconSvg = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
            <path d="M3 6h18"></path>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        `;
      } else {
        // Shop
        iconSvg = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
            <path d="M2 7h20"></path>
          </svg>
        `;
      }

      const glowColor = isSelected ? '#FFFFFF' : pin.color;

      el.innerHTML = `
        <div style="position:relative; display:flex; align-items:center; justify-content:center;">
          <div style="width:${isSelected ? '36px' : '30px'}; height:${isSelected ? '36px' : '30px'}; border-radius:50%; background-color:${pin.color}; color:${pin.type === 'rider' ? '#000000' : '#FFFFFF'}; display:flex; align-items:center; justify-content:center; box-shadow:0 0 18px ${glowColor}99, 0 4px 10px rgba(0,0,0,0.8); border:2.5px solid ${isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}; transition:all 0.2s ease;">
            ${iconSvg}
          </div>
          ${isSelected ? `<span style="position:absolute; inset:-4px; border-radius:50%; border:2px solid #FFFFFF; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite; opacity:0.6; pointer-events:none;"></span>` : ''}
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectPin(pin);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);

      markersRef.current.set(pin.id, marker);
    });
  }, [pins, selectedPin, mapLoaded, onSelectPin]);

  // Fly to selected pin if changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !selectedPin) return;

    map.flyTo({
      center: [selectedPin.lng, selectedPin.lat],
      zoom: 13.5,
      essential: true,
      duration: 1000,
    });
  }, [selectedPin, mapLoaded]);

  const handleRecenter = useCallback(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: [center[1], center[0]],
      zoom: zoom,
      essential: true,
    });
  }, [center, zoom]);

  return (
    <div className="relative w-full rounded-2xl bg-[#0F1318] border border-[#292929] overflow-hidden shadow-2xl" style={{ height }}>
      {/* Map Container */}
      <div id={containerId} ref={mapContainerRef} className="h-full w-full" />

      {/* Loading Skeleton */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0F1318]/90 backdrop-blur-sm text-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#A7A7A7]">
            Initializing Ola Maps Operational Engine...
          </p>
        </div>
      )}

      {/* Floating Recenter Button */}
      {mapLoaded && (
        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter Operational Map"
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-[#292929] bg-[#181818]/90 text-[#1DB954] shadow-lg backdrop-blur-md transition-all hover:bg-[#222222] active:scale-95 cursor-pointer"
        >
          <Navigation className="h-4 w-4" />
        </button>
      )}

      {/* Ola Maps Telemetry Badge */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg border border-[#292929] bg-[#121212]/90 px-3 py-1.5 backdrop-blur-md text-[11px] font-semibold text-white">
        <span className="h-2 w-2 rounded-full bg-[#1DB954] animate-ping" />
        <span>Ola Maps Vector Telemetry (Jaipur Operating Hub)</span>
      </div>
    </div>
  );
};
