// ==============================================================================
// GETORA ADMIN OPERATIONAL MAP COMPONENT
// Powered by MapLibre GL & Ola Maps Proxy Architecture
// Features: Multi-layer (Dark Operations, Streets & Houses, Real Satellite View)
// ==============================================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Navigation, Loader2, Layers } from 'lucide-react';

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

export type AdminMapLayer = 'dark' | 'streets' | 'satellite';

const ADMIN_MAP_STYLES: Record<AdminMapLayer, any> = {
  dark: {
    version: 8,
    name: 'Carto Dark Matter (GETORA Operations)',
    sources: {
      'dark-tiles': {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png',
          'https://b.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png',
          'https://c.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png',
          'https://d.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}@2x.png',
        ],
        tileSize: 256,
        attribution: '© CartoDB, © OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: 'dark-raster',
        type: 'raster',
        source: 'dark-tiles',
        minzoom: 0,
        maxzoom: 20,
      },
    ],
  },
  streets: {
    version: 8,
    name: 'Carto Voyager (Ghar, Sadak aur Dukaan)',
    sources: {
      'streets-tiles': {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
          'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
          'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
          'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        ],
        tileSize: 256,
        attribution: '© CartoDB, © OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: 'streets-raster',
        type: 'raster',
        source: 'streets-tiles',
        minzoom: 0,
        maxzoom: 20,
      },
    ],
  },
  satellite: {
    version: 8,
    name: 'Satellite Aerial (Asli Chhat & Makaan)',
    sources: {
      'satellite-imagery': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '© Esri, Maxar',
      },
      'satellite-labels': {
        type: 'raster',
        tiles: [
          'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '© Esri',
      },
    },
    layers: [
      {
        id: 'satellite-raster',
        type: 'raster',
        source: 'satellite-imagery',
        minzoom: 0,
        maxzoom: 19,
      },
      {
        id: 'satellite-labels-raster',
        type: 'raster',
        source: 'satellite-labels',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
};

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
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<AdminMapLayer>('dark');
  const [containerId] = useState(() => `admin-ola-map-${Math.random().toString(36).substring(2, 9)}`);

  const setupZones = useCallback((map: maplibregl.Map) => {
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
            'fill-opacity': 0.1,
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
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isCancelled = false;
    const initialStyle = ADMIN_MAP_STYLES[currentLayer];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [center[1], center[0]],
      zoom: zoom,
      attributionControl: false,
    });

    mapInstanceRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'bottom-right');

    map.on('load', () => {
      if (!isCancelled) {
        setMapLoaded(true);
        setupZones(map);
      }
    });

    return () => {
      isCancelled = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch Map Layer
  const handleLayerChange = (newLayer: AdminMapLayer) => {
    if (newLayer === currentLayer || !mapInstanceRef.current) return;
    setCurrentLayer(newLayer);

    const map = mapInstanceRef.current;
    map.setStyle(ADMIN_MAP_STYLES[newLayer]);

    map.once('styledata', () => {
      setupZones(map);
    });
  };

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
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18.5" cy="17.5" r="3.5"></circle>
            <circle cx="5.5" cy="17.5" r="3.5"></circle>
            <circle cx="15" cy="5" r="1"></circle>
            <path d="M12 17.5V14l-3-3 4-3 2 3h2"></path>
          </svg>
        `;
      } else if (pin.type === 'order') {
        iconSvg = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
            <path d="M3 6h18"></path>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        `;
      } else {
        // Shop
        iconSvg = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
          <div style="width:${isSelected ? '38px' : '32px'}; height:${isSelected ? '38px' : '32px'}; border-radius:50%; background-color:${pin.color}; color:${pin.type === 'rider' ? '#000000' : '#FFFFFF'}; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px ${glowColor}AA, 0 4px 12px rgba(0,0,0,0.8); border:2.5px solid ${isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}; transition:all 0.2s ease;">
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
      zoom: 14,
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

      {/* Layer Switcher Pill (Top Right, next to Recenter button) */}
      {mapLoaded && (
        <div className="absolute top-4 right-16 z-10 flex items-center gap-1 rounded-xl border border-[#333333] bg-[#121212]/90 p-1 backdrop-blur-md shadow-xl">
          <button
            type="button"
            onClick={() => handleLayerChange('dark')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
              currentLayer === 'dark'
                ? 'bg-[#1DB954] text-black shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🌙</span>
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => handleLayerChange('streets')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
              currentLayer === 'streets'
                ? 'bg-[#1DB954] text-black shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🏠</span>
            <span>Sadak & Ghar</span>
          </button>

          <button
            type="button"
            onClick={() => handleLayerChange('satellite')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
              currentLayer === 'satellite'
                ? 'bg-[#1DB954] text-black shadow-md'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🛰️</span>
            <span>Satellite</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0F1318]/90 backdrop-blur-sm text-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#A7A7A7]">
            Initializing Live Operational Map & Jaipur Zones...
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

      {/* Live Telemetry Badge */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg border border-[#292929] bg-[#121212]/90 px-3 py-1.5 backdrop-blur-md text-[11px] font-semibold text-white">
        <span className="h-2 w-2 rounded-full bg-[#1DB954] animate-ping" />
        <span>GETORA Live Fleet & Dispatch Telemetry (Jaipur Hub)</span>
      </div>
    </div>
  );
};
