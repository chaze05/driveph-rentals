import type { MetadataRoute } from "next";
import { CARS } from "@/data/cars";

const BASE = "https://driveph-rentals.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/cars", "/contact", "/login"];
  return [
    ...routes.map((route) => ({
      url: BASE + route,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...CARS.map((car) => ({
      url: `${BASE}/cars/${car.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
