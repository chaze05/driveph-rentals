import type { Car } from "@/data/cars";

export type CarFilters = {
  query?: string;
  type?: string;
  location?: string;
  transmission?: string;
  seats?: number;
  maxPrice?: number;
};

export function filterCars(cars: Car[], filters: CarFilters): Car[] {
  const query = (filters.query ?? "").trim().toLowerCase();

  return cars.filter((car) => {
    if (
      query &&
      ![car.name, car.type, car.location, ...car.features].some((field) =>
        field.toLowerCase().includes(query)
      )
    ) {
      return false;
    }
    if (filters.type && car.type !== filters.type) return false;
    if (filters.location && car.location !== filters.location) return false;
    if (filters.transmission && car.transmission !== filters.transmission) {
      return false;
    }
    if (filters.seats && car.seats < filters.seats) return false;
    if (filters.maxPrice && car.dailyRate > filters.maxPrice) return false;
    return true;
  });
}
