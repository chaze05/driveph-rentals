export function formatPeso(value: number): string {
  const rounded = Math.round(value);
  return "\u20B1" + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(`${iso}T00:00:00`));
  } catch {
    return iso;
  }
}
