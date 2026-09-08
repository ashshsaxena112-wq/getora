// ==============================================================================
// GETORA OLA MAP / KRUTRIM MAPS INTERACTIVE COMPONENT
// Powered by MapLibre GL & Ola Maps Vector Tile Service
// Matches GETORA Dark Emerald Theme (#22C55E, #0A0F0D, #0F1B15)
// ==============================================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { OlaMaps } from 'olamaps-web-sdk';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { OlaMapsService } from '../services/olaMapsService';
import { RefreshCw, Navigation, Maximize2, AlertCircle } from 'lucide-react';

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
  showControls?: boolean;
  onMapClick?: (coords: { latitude: number; longitude: number }) => void;
}

export const OlaMap: React.FC<OlaMapProps> = ({
  center = [26.9124, 75.7873], // Default Jaipur
  zoom = 13,
  markers = [],
  routeCoordinates = [],
  zones = [],
  interactive = true,
  height = '400px',
  className = '',
  theme = 'dark',
  showControls = true,
  onMapClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [containerId] = useState(() => `ola-map-${Math.random().toString(36).substring(2, 9)}`);

  // Initialize Map using Ola Maps Web SDK v2
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isCancelled = false;
    let mapInstance: any = null;

    (async () => {
      try {
        const styleUrl = OlaMapsService.getMapStyleUrl(theme);
        const apiKey = (import.meta as any).env.VITE_OLA_MAPS_API_KEY || 'getora-web-client';

        // Official Ola Maps Web SDK v2 Initialization
        const olaMaps = new OlaMaps({ apiKey });

        const map = await olaMaps.init({
          style: styleUrl,
          container: containerId,
          center: [center[1], center[0]], // [lng, lat]
          zoom: zoom,
        });

        if (isCancelled) {
          map.remove();
          return;
        }

        mapInstance = map;
        mapInstanceRef.current = map;

        if (interactive && showControls) {
          map.addControl(olaMaps.addNavigationControls({ showCompass: true, showZoom: true }), 'bottom-right');
        }

        map.on('load', () => {
          if (!isCancelled) {
            setMapLoaded(true);
            setLoadError(null);
          }
        });

        map.on('error', (e: any) => {
          console.warn('Ola Maps Web SDK tile notice:', e);
        });

        if (onMapClick) {
          map.on('click', (e: any) => {
            onMapClick({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
          });
        }
      } catch (sdkErr: any) {
        console.warn('Ola Maps Web SDK fallback init:', sdkErr?.message);
        if (isCancelled || !mapContainerRef.current) return;

        try {
          const fallbackStyle = OlaMapsService.getFallbackMapStyleUrl(theme);
          const fallbackMap = new maplibregl.Map({
            container: mapContainerRef.current,
            style: fallbackStyle,
            center: [center[1], center[0]],
            zoom: zoom,
            interactive: interactive,
            attributionControl: false,
          });

          if (isCancelled) {
            fallbackMap.remove();
            return;
          }

          mapInstance = fallbackMap;
          mapInstanceRef.current = fallbackMap;

          if (interactive && showControls) {
            fallbackMap.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'bottom-right');
          }

          fallbackMap.on('load', () => {
            if (!isCancelled) {
              setMapLoaded(true);
              setLoadError(null);
            }
          });

          if (onMapClick) {
            fallbackMap.on('click', (e: any) => {
              onMapClick({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
            });
          }
        } catch (err: any) {
          console.error('Failed to initialize map instance:', err);
          if (!isCancelled) {
            setLoadError(err?.message || 'Could not load map renderer.');
          }
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
  }, [theme]); // Recreate if theme changes

  // Update center when prop changes smoothly
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;
    map.flyTo({
      center: [center[1], center[0]],
      zoom: zoom,
      essential: true,
      duration: 1200,
    });
  }, [center[0], center[1], zoom, mapLoaded]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    markers.forEach((m) => {
      // Create custom styled DOM element for marker
      const el = document.createElement('div');
      el.className = 'getora-map-pin-wrapper';
      el.style.cursor = 'pointer';

      let bgColor = '#22C55E';
      let iconSvg = '';
      let badgeLabel = m.type?.toUpperCase() || 'POINT';

      if (m.type === 'customer') {
        bgColor = '#3B82F6';
        badgeLabel = 'YOU';
        iconSvg = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        `;
      } else if (m.type === 'rider') {
        bgColor = '#F59E0B';
        badgeLabel = 'RIDER';
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
        badgeLabel = 'HUB';
        iconSvg = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        `;
      } else {
        // Store
        bgColor = '#22C55E';
        badgeLabel = 'STORE';
        iconSvg = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        `;
      }

      el.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; transform: translate(0, -50%);">
          ${m.title ? `<div style="background:rgba(15,27,21,0.92); backdrop-filter:blur(6px); border:1px solid rgba(34,197,94,0.3); border-radius:6px; color:#F5F5F5; font-size:11px; font-weight:600; padding:2px 8px; margin-bottom:4px; white-space:nowrap; box-shadow:0 4px 12px rgba(0,0,0,0.5); display:flex; align-items:center; gap:4px;">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${bgColor};"></span>
            ${m.title}
          </div>` : ''}
          <div style="position:relative; width:36px; height:36px; border-radius:50%; background:${bgColor}; display:flex; align-items:center; justify-content:center; color:#0A0F0D; box-shadow:0 0 16px ${bgColor}88, 0 4px 12px rgba(0,0,0,0.6); border:2.5px solid #FFFFFF;">
            ${iconSvg}
          </div>
          <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid ${bgColor}; margin-top:-1px;"></div>
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

    const sourceId = 'route-source';
    const layerGlowId = 'route-glow-layer';
    const layerLineId = 'route-line-layer';

    // Format coordinates into GeoJSON [lng, lat]
    const geojsonCoords = routeCoordinates.map((c) => [c[1], c[0]]);

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
    } else if (geojsonCoords.length > 1) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: routeGeoJson,
      });

      // Ambient glow layer
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

      // Sharp main road route
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

    // Auto-fit route bounds if route exists
    if (geojsonCoords.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      geojsonCoords.forEach((c) => bounds.extend(c as [number, number]));
      map.fitBounds(bounds, { padding: 45, maxZoom: 16 });
    }
  }, [routeCoordinates, mapLoaded]);

  // Update Delivery Zones
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    zones.forEach((z) => {
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
  }, [zones, mapLoaded]);

  const handleRecenter = useCallback(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: [center[1], center[0]],
      zoom: zoom,
      essential: true,
    });
  }, [center, zoom]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-[rgba(34,197,94,0.2)] bg-[#0A0F0D] shadow-xl ${className}`}
      style={{ height }}
    >
      {/* Map Container */}
      <div id={containerId} ref={mapContainerRef} className="h-full w-full" />

      {/* Loading Skeleton */}
      {!mapLoaded && !loadError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0A0F0D]/90 backdrop-blur-sm">
          <RefreshCw className="h-8 w-8 animate-spin text-[#22C55E]" />
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Loading Ola Maps Engine...
          </p>
        </div>
      )}

      {/* Error Overlay */}
      {loadError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0A0F0D]/95 p-6 text-center">
          <AlertCircle className="h-10 w-10 text-amber-500 mb-2" />
          <h4 className="text-sm font-semibold text-white">Map Display Offline</h4>
          <p className="text-xs text-[#9CA3AF] max-w-sm mt-1">{loadError}</p>
        </div>
      )}

      {/* Floating Map Action Buttons */}
      {interactive && mapLoaded && (
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleRecenter}
            title="Recenter Map"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(34,197,94,0.3)] bg-[#0F1B15]/90 text-[#4ADE80] shadow-lg backdrop-blur-md transition-all hover:bg-[#162920] active:scale-95"
          >
            <Navigation className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Ola Maps Branding Badge */}
      <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 rounded-md border border-[rgba(34,197,94,0.2)] bg-[#0A0F0D]/85 px-2 py-0.5 backdrop-blur-md text-[10px] font-medium text-[#9CA3AF]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
        <span>Ola Maps Vector</span>
      </div>
    </div>
  );
};
