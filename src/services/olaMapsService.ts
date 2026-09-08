// ==============================================================================
// GETORA OLA MAPS CLIENT SERVICE (Backend Proxy Architecture)
// Routes all browser requests through GETORA Backend (/api/maps/*) to protect
// server-side API keys and returns real Ola API responses without fake mocks.
// ==============================================================================

import { calculateDistanceKm, calculateDeliveryEta } from '../utils/geoUtils';

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  latitude?: number;
  longitude?: number;
}

export interface GeocodedAddress {
  formattedAddress: string;
  streetArea?: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  landmark?: string;
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  coordinates: [number, number][]; // [lat, lng] array
  summary?: string;
  isMockFallback?: boolean;
}

const BACKEND_API_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_API_URL) ? import.meta.env.VITE_BACKEND_API_URL.replace(/\/$/, '') : '';
const BACKEND_MAPS_BASE = `${BACKEND_API_URL}/api/maps`;

export class OlaMapsService {
  /**
   * Checks whether the backend proxy has an active server-side API key.
   */
  public static async checkBackendHealth(): Promise<{ hasApiKey: boolean; provider: string }> {
    try {
      const res = await fetch(`${BACKEND_MAPS_BASE}/health`);
      if (res.ok) {
        return await res.json();
      }
      return { hasApiKey: false, provider: 'Unknown' };
    } catch {
      return { hasApiKey: false, provider: 'Backend Offline' };
    }
  }

  /**
   * Gets the official vector tile style URL according to Ola Maps Web SDK v2 specs.
   * Light: https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json
   * Dark: https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json
   */
  public static getMapStyleUrl(theme: 'dark' | 'light' = 'dark'): string {
    return theme === 'light'
      ? 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json'
      : 'https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json';
  }

  /**
   * Fallback vector style if tile server is offline or CORS restricted
   */
  public static getFallbackMapStyleUrl(theme: 'dark' | 'light' = 'dark'): string {
    return theme === 'light'
      ? 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
  }

  /**
   * Real-time autocomplete suggestions via GETORA Backend Proxy -> Ola Maps.
   * Returns real Ola API results and throws/logs actual error status if rejected.
   */
  public static async autocomplete(query: string): Promise<PlacePrediction[]> {
    if (!query || query.trim().length < 2) return [];

    const url = `${BACKEND_MAPS_BASE}/autocomplete?input=${encodeURIComponent(query.trim())}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errMsg = data.message || data.error || `HTTP ${res.status}`;
      console.error(`[Ola Maps Proxy Error ${res.status}]: ${errMsg}`);
      // Return empty list and do not inject fake mock predictions
      return [];
    }

    const predictions = data.predictions || [];
    return predictions.map((p: any) => ({
      placeId: p.place_id || p.id || Math.random().toString(36).slice(2),
      description: p.description || p.structured_formatting?.main_text || query,
      mainText: p.structured_formatting?.main_text || p.description?.split(',')[0] || query,
      secondaryText: p.structured_formatting?.secondary_text || p.description?.split(',').slice(1).join(',').trim() || '',
      latitude: p.geometry?.location?.lat,
      longitude: p.geometry?.location?.lng,
    }));
  }

  /**
   * Reverse geocoding via GETORA Backend Proxy -> Ola Maps.
   */
  public static async reverseGeocode(lat: number, lng: number): Promise<GeocodedAddress | null> {
    const url = `${BACKEND_MAPS_BASE}/reverse-geocode?lat=${lat}&lng=${lng}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errMsg = data.message || data.error || `HTTP ${res.status}`;
      console.error(`[Ola Maps Reverse Geocode Error ${res.status}]: ${errMsg}`);
      return null;
    }

    const result = (data.results && data.results[0]) || null;
    if (!result) return null;

    let city = 'Jaipur';
    let state = 'Rajasthan';
    let pincode = '';
    let streetArea = '';

    if (Array.isArray(result.address_components)) {
      for (const comp of result.address_components) {
        const types: string[] = comp.types || [];
        if (types.includes('locality') || types.includes('administrative_area_level_2')) {
          city = comp.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          state = comp.long_name;
        }
        if (types.includes('postal_code')) {
          pincode = comp.long_name;
        }
        if (types.includes('sublocality') || types.includes('route') || types.includes('neighborhood')) {
          streetArea = streetArea ? `${streetArea}, ${comp.long_name}` : comp.long_name;
        }
      }
    }

    if (!streetArea && result.formatted_address) {
      const parts = result.formatted_address.split(',');
      if (parts.length > 2) {
        streetArea = parts.slice(0, 2).join(', ').trim();
      } else {
        streetArea = parts[0].trim();
      }
    }

    return {
      formattedAddress: result.formatted_address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      streetArea: streetArea || 'Current Location',
      city: city || 'Jaipur',
      state: state || 'Rajasthan',
      pincode: pincode || '',
      latitude: lat,
      longitude: lng,
      landmark: result.name || undefined,
    };
  }

  /**
   * Forward geocoding via GETORA Backend Proxy -> Ola Maps.
   */
  public static async geocode(address: string): Promise<{ latitude: number; longitude: number } | null> {
    if (!address || address.trim().length === 0) return null;

    const url = `${BACKEND_MAPS_BASE}/geocode?address=${encodeURIComponent(address)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(`[Ola Maps Geocode Error ${res.status}]: ${data.message || data.error}`);
      return null;
    }

    const loc = data.geocodingResults?.[0]?.geometry?.location || data.results?.[0]?.geometry?.location;
    if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
      return { latitude: loc.lat, longitude: loc.lng };
    }
    return null;
  }

  /**
   * Driving directions & route polyline via GETORA Backend Proxy -> Ola Maps.
   */
  public static async getDirections(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<RouteResult | null> {
    const url = `${BACKEND_MAPS_BASE}/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=driving`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(`[Ola Maps Directions Error ${res.status}]: ${data.message || data.error}`);
      return null;
    }

    const route = data.routes?.[0];
    if (!route) return null;

    const leg = route.legs?.[0];
    const distanceMeters = leg?.distance?.value || 0;
    const durationSeconds = leg?.duration?.value || 0;

    let coords: [number, number][] = [];
    if (typeof route.overview_polyline === 'string') {
      coords = this.decodePolyline(route.overview_polyline);
    } else if (route.overview_polyline?.points) {
      coords = this.decodePolyline(route.overview_polyline.points);
    }

    return {
      distanceKm: Math.round((distanceMeters / 1000) * 10) / 10,
      durationMinutes: Math.round(durationSeconds / 60),
      coordinates: coords,
      summary: route.summary || leg?.summary || 'Ola Maps Driving Route',
      isMockFallback: false,
    };
  }

  /**
   * Decodes Google / Mapbox / Ola encoded polyline format string into [lat, lng] pairs.
   */
  public static decodePolyline(encoded: string): [number, number][] {
    const poly: [number, number][] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b: number;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      poly.push([lat / 1e5, lng / 1e5]);
    }

    return poly;
  }
}
