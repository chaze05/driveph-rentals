export const SITE = {
  name: "DrivePH Rentals",
  tagline: "Drive the islands.",
  description:
    "Self-drive and chauffeur car rental across Manila, Cebu, Bohol and Siargao — clear prices, real availability, no surprises.",
  email: "hello@driveph.ph",
  phone: "+63 917 555 0110",
  address: "2F One Park Drive, BGC, Taguig",
  hours: "Daily · 7:00am – 9:00pm",
  locations: ["Manila", "Cebu", "Bohol", "Siargao"] as const,
};

export type LocationName = (typeof SITE.locations)[number];
