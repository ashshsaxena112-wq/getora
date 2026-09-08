// ==============================================================================
// GETORA DELIVERY HUBS & SERVICEABLE ZONES (Ola Maps Integration)
// ==============================================================================

export interface DeliveryZone {
  id: string;
  name: string;
  city: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  radiusKm: number;
  surgeMultiplier: number;
  polygon: [number, number][]; // [lat, lng] boundary coordinates
  active: boolean;
}

export const DELIVERY_ZONES: Record<string, DeliveryZone> = {
  jaipur_central: {
    id: 'jaipur_central',
    name: 'Jaipur Central Hub (Malviya Nagar & C-Scheme)',
    city: 'Jaipur',
    center: [26.9124, 75.7873],
    zoom: 13,
    radiusKm: 12,
    surgeMultiplier: 1.0,
    polygon: [
      [26.9600, 75.7400],
      [26.9600, 75.8600],
      [26.8300, 75.8600],
      [26.8300, 75.7400],
      [26.9600, 75.7400],
    ],
    active: true,
  },
  jaipur_vaishali: {
    id: 'jaipur_vaishali',
    name: 'Jaipur West (Vaishali Nagar & Mansarovar)',
    city: 'Jaipur',
    center: [26.8920, 75.7450],
    zoom: 13,
    radiusKm: 10,
    surgeMultiplier: 1.0,
    polygon: [
      [26.9200, 75.7000],
      [26.9200, 75.7700],
      [26.8400, 75.7700],
      [26.8400, 75.7000],
      [26.9200, 75.7000],
    ],
    active: true,
  },
  bengaluru_koramangala: {
    id: 'bengaluru_koramangala',
    name: 'Bengaluru South (Koramangala & HSR Layout)',
    city: 'Bengaluru',
    center: [12.9352, 77.6245],
    zoom: 13,
    radiusKm: 10,
    surgeMultiplier: 1.0,
    polygon: [
      [12.9600, 77.6000],
      [12.9600, 77.6800],
      [12.9000, 77.6800],
      [12.9000, 77.6000],
      [12.9600, 77.6000],
    ],
    active: true,
  },
  bengaluru_indiranagar: {
    id: 'bengaluru_indiranagar',
    name: 'Bengaluru Central (Indiranagar & CBD)',
    city: 'Bengaluru',
    center: [12.9784, 77.6408],
    zoom: 13,
    radiusKm: 8,
    surgeMultiplier: 1.0,
    polygon: [
      [13.0100, 77.6100],
      [13.0100, 77.6700],
      [12.9500, 77.6700],
      [12.9500, 77.6100],
      [13.0100, 77.6100],
    ],
    active: true,
  },
};

export const DEFAULT_MAP_CENTER: [number, number] = [26.9124, 75.7873]; // Jaipur
export const DEFAULT_MAP_ZOOM = 13;

/**
 * Returns the nearest active delivery zone or default Jaipur central.
 */
export function getActiveDeliveryZone(lat?: number, lng?: number): DeliveryZone {
  if (!lat || !lng) return DELIVERY_ZONES.jaipur_central;

  for (const zone of Object.values(DELIVERY_ZONES)) {
    if (zone.active) {
      // Check rough bounding box
      const lats = zone.polygon.map(p => p[0]);
      const lngs = zone.polygon.map(p => p[1]);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
        return zone;
      }
    }
  }

  return DELIVERY_ZONES.jaipur_central;
}
