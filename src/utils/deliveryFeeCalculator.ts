// ==============================================================================
// GETORA DYNAMIC DELIVERY FEE CALCULATOR (Ola Maps Distance Based)
// ==============================================================================

export interface DeliveryFeeCalculation {
  distanceKm: number;
  baseFee: number;
  distanceFee: number;
  surgeMultiplier: number;
  surgeFee: number;
  totalFee: number;
  isFreeDelivery: boolean;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  savings: number;
  breakdownDescription: string;
}

export interface DeliveryFeeOptions {
  subtotal: number;
  distanceKm: number;
  freeDeliveryThreshold?: number; // default 499
  surgeMultiplier?: number; // default 1.0
  isNightTime?: boolean; // 11 PM to 6 AM (adds small flat convenience)
}

export const DEFAULT_BASE_DISTANCE_KM = 3;
export const DEFAULT_BASE_FEE = 29;
export const DEFAULT_PER_KM_FEE = 8;
export const DEFAULT_FREE_THRESHOLD = 499;
export const MAX_DELIVERY_FEE = 99;

export function calculateDeliveryFee({
  subtotal,
  distanceKm,
  freeDeliveryThreshold = DEFAULT_FREE_THRESHOLD,
  surgeMultiplier = 1.0,
  isNightTime = false,
}: DeliveryFeeOptions): DeliveryFeeCalculation {
  const safeDistance = Math.max(0.1, Math.round(distanceKm * 10) / 10);

  // Free delivery check
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const amountNeeded = Math.max(0, freeDeliveryThreshold - subtotal);

  // Distance calculations
  const baseFee = DEFAULT_BASE_FEE;
  const extraKm = Math.max(0, safeDistance - DEFAULT_BASE_DISTANCE_KM);
  const rawDistanceFee = Math.round(extraKm * DEFAULT_PER_KM_FEE);

  // Base + Distance combined
  const standardSubFee = baseFee + rawDistanceFee;

  // Surge or night convenience
  const effectiveMultiplier = Math.max(1.0, surgeMultiplier);
  const surgeDifference = Math.round(standardSubFee * (effectiveMultiplier - 1));
  const nightConvenience = isNightTime ? 15 : 0;
  const totalSurgeFee = surgeDifference + nightConvenience;

  const rawTotal = Math.min(MAX_DELIVERY_FEE, standardSubFee + totalSurgeFee);

  if (isFreeDelivery) {
    return {
      distanceKm: safeDistance,
      baseFee,
      distanceFee: rawDistanceFee,
      surgeMultiplier: effectiveMultiplier,
      surgeFee: totalSurgeFee,
      totalFee: 0,
      isFreeDelivery: true,
      freeDeliveryThreshold,
      amountNeededForFreeDelivery: 0,
      savings: rawTotal,
      breakdownDescription: `FREE delivery applied (Order over ₹${freeDeliveryThreshold})`,
    };
  }

  let desc = `₹${baseFee} base (up to ${DEFAULT_BASE_DISTANCE_KM} km)`;
  if (extraKm > 0) {
    desc += ` + ₹${rawDistanceFee} (${extraKm.toFixed(1)} km × ₹${DEFAULT_PER_KM_FEE}/km)`;
  }
  if (totalSurgeFee > 0) {
    desc += ` + ₹${totalSurgeFee} surge`;
  }

  return {
    distanceKm: safeDistance,
    baseFee,
    distanceFee: rawDistanceFee,
    surgeMultiplier: effectiveMultiplier,
    surgeFee: totalSurgeFee,
    totalFee: rawTotal,
    isFreeDelivery: false,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery: amountNeeded,
    savings: 0,
    breakdownDescription: desc,
  };
}
