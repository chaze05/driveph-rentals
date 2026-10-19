import type { BlockedRange } from "@/lib/availability";
import type { LocationName } from "./site";

export type CarType = "Sedan" | "Sports" | "Pickup";
export type Transmission = "Automatic" | "Manual";

export type Car = {
  slug: string;
  name: string;
  type: CarType;
  seats: number;
  doors: number;
  transmission: Transmission;
  dailyRate: number;
  location: LocationName;
  images: string[];
  features: string[];
  unavailable: BlockedRange[];
};

export const CAR_TYPES: CarType[] = ["Sedan", "Sports", "Pickup"];

export const CARS: Car[] = [
  {
    slug: "fiat-500",
    name: "Fiat 500",
    type: "Sedan",
    seats: 4,
    doors: 3,
    transmission: "Automatic",
    dailyRate: 2200,
    location: "Manila",
    images: ["/images/car-1.jpg", "/images/alt-1.jpg"],
    features: ["City icon", "Easy to park", "Apple CarPlay", "Unlimited mileage"],
    unavailable: [{ from: "2026-11-20", to: "2026-11-23" }],
  },
  {
    slug: "hyundai-accent",
    name: "Hyundai Accent",
    type: "Sedan",
    seats: 5,
    doors: 4,
    transmission: "Automatic",
    dailyRate: 2300,
    location: "Cebu",
    images: ["/images/car-2.jpg", "/images/alt-2.jpg"],
    features: ["Apple CarPlay", "Cruise control", "Unlimited mileage", "Child seat ready"],
    unavailable: [{ from: "2026-11-10", to: "2026-11-12" }],
  },
  {
    slug: "volkswagen-polo",
    name: "Volkswagen Polo",
    type: "Sedan",
    seats: 5,
    doors: 5,
    transmission: "Automatic",
    dailyRate: 2400,
    location: "Bohol",
    images: ["/images/car-5.jpg", "/images/alt-3.jpg"],
    features: ["Compact and nimble", "Apple CarPlay", "Unlimited mileage", "Island-ready"],
    unavailable: [],
  },
  {
    slug: "toyota-hilux",
    name: "Toyota Hilux",
    type: "Pickup",
    seats: 5,
    doors: 4,
    transmission: "Manual",
    dailyRate: 4200,
    location: "Siargao",
    images: ["/images/car-3.jpg", "/images/alt-1.jpg"],
    features: ["4x4", "Surfboard rack", "Load bed cover", "Island-ready"],
    unavailable: [{ from: "2026-12-20", to: "2027-01-03" }],
  },
  {
    slug: "nissan-gtr",
    name: "Nissan GT-R",
    type: "Sports",
    seats: 4,
    doors: 2,
    transmission: "Automatic",
    dailyRate: 9500,
    location: "Manila",
    images: ["/images/car-4.jpg", "/images/alt-2.jpg"],
    features: ["Premium performance", "2+2 seats", "Full insurance", "Airport delivery"],
    unavailable: [{ from: "2026-11-01", to: "2026-11-05" }],
  },
  {
    slug: "ford-mustang",
    name: "Ford Mustang",
    type: "Sports",
    seats: 4,
    doors: 2,
    transmission: "Automatic",
    dailyRate: 8800,
    location: "Cebu",
    images: ["/images/car-7.jpg", "/images/alt-3.jpg"],
    features: ["Iconic coupe", "Premium performance", "Full insurance", "Airport delivery"],
    unavailable: [],
  },
  {
    slug: "chevrolet-camaro",
    name: "Chevrolet Camaro",
    type: "Sports",
    seats: 4,
    doors: 2,
    transmission: "Automatic",
    dailyRate: 8500,
    location: "Siargao",
    images: ["/images/car-6.jpg", "/images/alt-1.jpg"],
    features: ["Bold coupe", "Premium performance", "Full insurance", "Airport delivery"],
    unavailable: [],
  },
  {
    slug: "audi-r8",
    name: "Audi R8",
    type: "Sports",
    seats: 2,
    doors: 2,
    transmission: "Automatic",
    dailyRate: 12000,
    location: "Manila",
    images: ["/images/car-8.jpg", "/images/alt-2.jpg"],
    features: ["Supercar experience", "2 seats", "Full insurance", "Chauffeur available"],
    unavailable: [],
  },
];

export function getCar(slug: string): Car | undefined {
  return CARS.find((car) => car.slug === slug);
}
