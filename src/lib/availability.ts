export type BlockedRange = { from: string; to: string };

export function rangesOverlap(
  aFrom: string,
  aTo: string,
  bFrom: string,
  bTo: string
): boolean {
  const aStart = Date.parse(aFrom);
  const aEnd = Date.parse(aTo);
  const bStart = Date.parse(bFrom);
  const bEnd = Date.parse(bTo);
  if (![aStart, aEnd, bStart, bEnd].every(Number.isFinite)) return false;
  return aStart < bEnd && aEnd > bStart;
}

export function isRangeAvailable(
  blocked: BlockedRange[],
  pickupDate: string,
  returnDate: string
): boolean {
  return !blocked.some((range) =>
    rangesOverlap(pickupDate, returnDate, range.from, range.to)
  );
}
