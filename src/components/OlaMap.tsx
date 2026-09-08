// ==============================================================================
// GETORA INTERACTIVE MAP COMPONENT (Powered by MapLibre GL & Ola Maps Proxy)
// Features:
// 1. Street View (Carto Voyager @2x): House footprints, streets, lanes, shops
// 2. Satellite View (ESRI World Imagery + Labels): Real rooftops, houses, sky view
// 3. Dark Mode (Carto Dark Matter): Sleek GETORA emerald theme
// 4. Live GPS Detection: User's exact live location with pulsing radar pin
// 5. Layer Switcher: Easy 1-click toggle between Ghar/Sadak and Asli Satellite
// ==============================================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { OlaMapsService, MapLayerStyle } from '../services/olaMapsService';
import { Navigation, Layers, RefreshCw, Crosshair, MapPin, Eye } from 'lucide-react';

export interface MapMarkerItem {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  subtitle?: string;
  type?: 'customer' | 'store' | 'rider' | 'hub';
  isDraggable?: boolean;
  onDragEnd?: (coords: { latitude: number; longitude: number }) => void;
  onClick?: () => void;
}

export interface MapZonePolygon {
  id: string;
  name?: string;
  coordinates: [number, number][]; // [lat, lng] array
  color?: string;
}

export interface OlaMapProps {
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  markers?: MapMarkerItem[];
  routeCoordinates?: [number, number][]; // [lat, lng] array for route polyline
  zones?: MapZonePolygon[];
  interactive?: boolean;
  height?: string | number;
  className?: string;
  theme?: 'dark' | 'light';
  defaultLayer?: MapLayerStyle;
  showControls?: boolean;
  showLayerSwitcher?: boolean;
  showGpsButton?: boolean;
  onMapClick?: (coords: { latitude: number; longitude: number }) => void;
  onLocationDetected?: (coords: { latitude: number; longitude: number }) => void;
}

export const OlaMap: React.FC<OlaMapProps> = ({
  center = [26.9124, 75.7873], // Default Jaipur
  zoom = 14,
  markers = [],
  routeCoordinates = [],
  zones = [],
  interactive = true,
  height = '400px',
  className = '',
  defaultLayer = 'streets',
  showControls = true,
  showLayerSwitcher = true,
  showGpsButton = true,
  onMapClick,
  onLocationDetected,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<MapLayerStyle>(defaultLayer);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [containerId] = useState(() => `getora-map-${Math.random().toString(36).substring(2, 9)}`);

  // Helper to attach route polyline
  const renderRoutePolyline = useCallback((map: maplibregl.Map, coords: [number, number][]) => {
    if (!map || coords.length < 2) return;

    const sourceId = 'route-source';
    const layerGlowId = 'route-glow-layer';
    const layerLineId = 'route-line-layer';

    const geojsonCoords = coords.map((c) => [c[1], c[0]]);
    const routeGeoJson: any = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: geojsonCoords,
      },
    };

    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(routeGeoJson);
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data: routeGeoJson,
      });

      map.addLayer({
        id: layerGlowId,
        type: 'line',
        source: sourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#22C55E',
          'line-width': 8,
          'line-opacity': 0.35,
          'line-blur': 3,
        },
      });

      map.addLayer({
        id: layerLineId,
        type: 'line',
        source: sourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#4ADE80',
          'line-width': 4,
          'line-opacity': 0.95,
        },
      });
    }
  }, []);

  // Helper to attach delivery zone polygons
  const renderZones = useCallback((map: maplibregl.Map, zoneList: MapZonePolygon[]) => {
    if (!map || !zoneList.length) return;

    zoneList.forEach((z) => {
      const sourceId = `zone-source-${z.id}`;
      const fillLayerId = `zone-fill-${z.id}`;
      const borderLayerId = `zone-border-${z.id}`;

      const polygonCoords = z.coordinates.map((c) => [c[1], c[0]]);
      const zoneGeoJson: any = {
        type: 'Feature',
        properties: { name: z.name },
        geometry: {
          type: 'Polygon',
          coordinates: [polygonCoords],
        },
      };

      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(zoneGeoJson);
      } else {
        map.addSource(sourceId, {
          type: 'geojson',
          data: zoneGeoJson,
        });

        map.addLayer({
          id: fillLayerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': z.color || '#22C55E',
            'fill-opacity': 0.12,
          },
        });

        map.addLayer({
          id: borderLayerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': z.color || '#22C55E',
            'line-width': 2,
            'line-dasharray': [2, 2],
          },
        });
      }
    });
  }, []);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isCancelled = false;
    const initialStyle = OlaMapsService.getLayerStyle(currentLayer);

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [center[1], center[0]], // [lng, lat]
      zoom: zoom,
      interactive: interactive,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    if (interactive && showControls) {
      map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'bottom-right');
    }

    map.on('load', () => {
      if (!isCancelled) {
        setMapLoaded(true);
        if (routeCoordinates.length > 1) {
          renderRoutePolyline(map, routeCoordinates);
        }
        if (zones.length > 0) {
          renderZones(map, zones);
        }
      }
    });

    if (onMapClick) {
      map.on('click', (e) => {
        onMapClick({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
      });
    }

    return () => {
      isCancelled = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Layer Style Switching
  const handleLayerChange = (newLayer: MapLayerStyle) => {
    if (newLayer === currentLayer || !mapInstanceRef.current) return;
    setCurrentLayer(newLayer);

    const map = mapInstanceRef.current;
    const newStyle = OlaMapsService.getLayerStyle(newLayer);

    map.setStyle(newStyle);

    // Re-attach routes and zones when new style is fully applied
    map.once('styledata', () => {
      if (routeCoordinates.length > 1) {
        renderRoutePolyline(map, routeCoordinates);
      }
      if (zones.length > 0) {
        renderZones(map, zones);
      }
    });
  };

  // Update center when prop changes smoothly
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;
    map.flyTo({
      center: [center[1], center[0]],
      zoom: zoom,
      essential: true,
      duration: 1000,
    });
  }, [center[0], center[1], zoom, mapLoaded]);

  // Update Markers with pulsing radar for user's location
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    // Remove obsolete markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    markers.forEach((m) => {
      const el = document.createElement('div');
      el.className = 'getora-map-pin-container';
      el.style.cursor = m.isDraggable ? 'grab' : 'pointer';

      let bgColor = '#22C55E';
      let iconSvg = '';
      let isCustomer = m.type === 'customer';

      if (isCustomer) {
        bgColor = '#22C55E';
        iconSvg = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        `;
      } else if (m.type === 'rider') {
        bgColor = '#F59E0B';
        iconSvg = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18.5" cy="17.5" r="3.5"></circle>
            <circle cx="5.5" cy="17.5" r="3.5"></circle>
            <circle cx="15" cy="5" r="1"></circle>
            <path d="M12 17.5V14l-3-3 4-3 2 3h2"></path>
          </svg>
        `;
      } else if (m.type === 'hub') {
        bgColor = '#A855F7';
        iconSvg = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        `;
      } else {
        // Store
        bgColor = '#3B82F6';
        iconSvg = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        `;
      }

      // Live location badge & pulsing radar ring
      const pinTitle = m.title || (isCustomer ? 'Aapki Live Location' : 'Location');
      el.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; transform: translate(0, -50%); position:relative;">
          <!-- Pin Label Badge -->
          <div style="background:rgba(10,15,13,0.92); border:1.5px solid ${bgColor}; border-radius:8px; color:#FFFFFF; font-size:11px; font-weight:700; padding:3px 10px; margin-bottom:6px; white-space:nowrap; box-shadow:0 6px 16px rgba(0,0,0,0.6); display:flex; align-items:center; gap:6px; backdrop-filter:blur(6px);">
            <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:${bgColor}; box-shadow:0 0 8px ${bgColor};"></span>
            ${pinTitle}
          </div>

          <!-- Radar Pulse Effect for User's House/Location -->
          ${isCustomer ? `
            <div style="position:absolute; top:32px; width:64px; height:64px; border-radius:50%; background:rgba(34,197,94,0.3); animation:getoraPing 1.8s cubic-bezier(0,0,0.2,1) infinite; pointer-events:none;"></div>
            <div style="position:absolute; top:42px; width:44px; height:44px; border-radius:50%; background:rgba(34,197,94,0.4); animation:getoraPing 1.8s cubic-bezier(0,0,0.2,1) 0.6s infinite; pointer-events:none;"></div>
          ` : ''}

          <!-- Pin Circle -->
          <div style="position:relative; width:40px; height:40px; border-radius:50%; background:${bgColor}; display:flex; align-items:center; justify-content:center; color:#0A0F0D; box-shadow:0 0 20px ${bgColor}AA, 0 6px 14px rgba(0,0,0,0.7); border:3px solid #FFFFFF; z-index:2;">
            ${iconSvg}
          </div>
          <!-- Pointer Arrow -->
          <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:7px solid ${bgColor}; margin-top:-1px; z-index:2;"></div>
        </div>
      `;

      if (m.onClick) {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          m.onClick!();
        });
      }

      const marker = new maplibregl.Marker({
        element: el,
        draggable: Boolean(m.isDraggable),
      })
        .setLngLat([m.longitude, m.latitude])
        .addTo(map);

      if (m.isDraggable && m.onDragEnd) {
        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          m.onDragEnd!({ latitude: lngLat.lat, longitude: lngLat.lng });
        });
      }

      markersRef.current.set(m.id, marker);
    });
  }, [markers, mapLoaded]);

  // Update Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;
    renderRoutePolyline(map, routeCoordinates);

    if (routeCoordinates.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      routeCoordinates.forEach((c) => bounds.extend([c[1], c[0]]));
      map.fitBounds(bounds, { padding: 45, maxZoom: 16 });
    }
  }, [routeCoordinates, mapLoaded, renderRoutePolyline]);

  // Update Delivery Zones
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;
    renderZones(map, zones);
  }, [zones, mapLoaded, renderZones]);

  // Trigger high-accuracy browser GPS to center on user's exact house
  const handleLocateMe = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingUser(false);
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 16.8, // House-level close zoom
            essential: true,
            duration: 1400,
          });
        }
        if (onLocationDetected) {
          onLocationDetected({ latitude, longitude });
        }
      },
      (err) => {
        setIsLocatingUser(false);
        console.warn('GPS location request failed:', err.message);
        // Fallback flyTo existing center
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo({
            center: [center[1], center[0]],
            zoom: 16.5,
            essential: true,
          });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [center, onLocationDetected]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-[rgba(34,197,94,0.3)] bg-[#0A0F0D] shadow-2xl ${className}`}
      style={{ height }}
    >
      {/* Map Container */}
      <div id={containerId} ref={mapContainerRef} className="h-full w-full" />

      {/* Layer Switcher Pill (Streets / Satellite / Dark) */}
      {showLayerSwitcher && mapLoaded && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-xl border border-[rgba(34,197,94,0.35)] bg-[#0A0F0D]/90 p-1 backdrop-blur-md shadow-xl">
          <button
            type="button"
            onClick={() => handleLayerChange('streets')}
            title="Ghar, Sadak aur Building Layout"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
              currentLayer === 'streets'
                ? 'bg-[#22C55E] text-[#0A0F0D] shadow-md'
                : 'text-[#D1D5DB] hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🏠</span>
            <span>Sadak & Ghar</span>
          </button>

          <button
            type="button"
            onClick={() => handleLayerChange('satellite')}
            title="Asli Chhat, Makaan aur Satellite View"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
              currentLayer === 'satellite'
                ? 'bg-[#22C55E] text-[#0A0F0D] shadow-md'
                : 'text-[#D1D5DB] hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🛰️</span>
            <span>Asli Satellite</span>
          </button>

          <button
            type="button"
            onClick={() => handleLayerChange('dark')}
            title="GETORA Night Operations Theme"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
              currentLayer === 'dark'
                ? 'bg-[#22C55E] text-[#0A0F0D] shadow-md'
                : 'text-[#D1D5DB] hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🌙</span>
            <span>Dark</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0A0F0D]/95 backdrop-blur-sm">
          <RefreshCw className="h-8 w-8 animate-spin text-[#22C55E]" />
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
            Loading Live Map & Building Footprints...
          </p>
        </div>
      )}

      {/* Floating GPS 'Locate Me' Button */}
      {showGpsButton && interactive && mapLoaded && (
        <div className="absolute bottom-4 right-14 z-10">
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocatingUser}
            title="Mera Ghar / Auto-Detect My Live Location"
            className="flex items-center gap-2 rounded-xl border border-[rgba(34,197,94,0.4)] bg-[#0A0F0D]/90 px-3 py-2 text-xs font-bold text-[#4ADE80] shadow-2xl backdrop-blur-md transition-all hover:bg-[#162920] active:scale-95 cursor-pointer"
          >
            <Crosshair className={`h-4 w-4 ${isLocatingUser ? 'animate-spin' : ''}`} />
            <span>{isLocatingUser ? 'Locating...' : 'Mera Ghar (GPS)'}</span>
          </button>
        </div>
      )}

      {/* Ola Maps Engine & Live Telemetry Badge */}
      <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 rounded-md border border-[rgba(34,197,94,0.25)] bg-[#0A0F0D]/90 px-2.5 py-1 backdrop-blur-md text-[10px] font-semibold text-[#9CA3AF]">
        <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse"></span>
        <span>GETORA Live Map • Ola Maps Routing</span>
      </div>
    </div>
  );
};
