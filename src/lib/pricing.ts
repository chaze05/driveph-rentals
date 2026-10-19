export const CHAUFFEUR_PER_DAY = 1500;
export const INSURANCE_PER_DAY = 800;
export const CHILD_SEAT_FEE = 300;
export const VAT_RATE = 0.12;
export const MAX_RENTAL_DAYS = 30;

const DAY_MS = 86400000;

export function rentalDays(pickupDate: string, returnDate: string): number {
  const pickup = Date.parse(pickupDate);
  const dropoff = Date.parse(returnDate);
  if (!Number.isFinite(pickup) || !Number.isFinite(dropoff) || dropoff <= pickup) {
    return 1;
  }
  return Math.max(1, Math.round((dropoff - pickup) / DAY_MS) + 1);
}

export type QuoteInput = {
  dailyRate: number;
  days: number;
  chauffeur: boolean;
  insurance: boolean;
  childSeat: boolean;
};

export type Quote = {
  base: number;
  extras: number;
  subtotal: number;
  vat: number;
  total: number;
};

export function priceQuote({
  dailyRate,
  days,
  chauffeur,
  insurance,
  childSeat,
}: QuoteInput): Quote {
  const base = dailyRate * days;
  const extras =
    (chauffeur ? CHAUFFEUR_PER_DAY * days : 0) +
    (insurance ? INSURANCE_PER_DAY * days : 0) +
    (childSeat ? CHILD_SEAT_FEE : 0);
  const subtotal = base + extras;
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = Math.round((subtotal + vat) * 100) / 100;
  return { base, extras, subtotal, vat, total };
}
