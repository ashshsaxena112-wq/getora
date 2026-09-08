// ==============================================================================
// GETORA GEO UTILITIES (Ola Maps & Realtime Coordinate Math)
// ==============================================================================

/**
 * Calculates the great-circle distance between two coordinates in kilometers using the Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Estimates delivery ETA based on distance in km and average urban 2-wheeler speed (20 km/h)
 * plus store preparation time (default 12-15 mins).
 */
export function calculateDeliveryEta(
  distanceKm: number,
  preparationTimeMinutes: number = 12
): { minMinutes: number; maxMinutes: number; label: string } {
  // Urban speed ~ 18-22 km/h -> ~3 minutes per km + buffer for signals/traffic
  const travelTimeMinutes = Math.max(4, Math.round(distanceKm * 3.2));
  const totalMin = preparationTimeMinutes + travelTimeMinutes;
  const totalMax = totalMin + Math.max(5, Math.round(travelTimeMinutes * 0.4));

  // Round to nearest 5 for clean UX
  const roundedMin = Math.max(10, Math.round(totalMin / 5) * 5);
  const roundedMax = Math.max(roundedMin + 5, Math.round(totalMax / 5) * 5);

  return {
    minMinutes: roundedMin,
    maxMinutes: roundedMax,
    label: `${roundedMin}-${roundedMax} mins`,
  };
}

/**
 * Ray-casting algorithm to test whether a coordinate is inside a polygon boundary.
 * Point: [lat, lng] or [lng, lat]
 * Polygon: Array of [lat, lng] or [lng, lat] (must match point format)
 */
export function isPointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Formats a coordinate pair into a human-readable string.
 */
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
}

/**
 * Calculates initial bearing between two points in degrees (0 to 360).
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Linearly interpolates between two coordinates given fraction t in [0, 1].
 */
export function interpolatePosition(
  start: [number, number],
  end: [number, number],
  t: number
): [number, number] {
  const lat = start[0] + (end[0] - start[0]) * Math.min(Math.max(t, 0), 1);
  const lng = start[1] + (end[1] - start[1]) * Math.min(Math.max(t, 0), 1);
  return [lat, lng];
}
