import type { BookingStatus } from "@/lib/bookings";

export type Booking = {
  ref: string;
  carSlug: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  chauffeur: boolean;
  insurance: boolean;
  childSeat: boolean;
  subtotal: number;
  vat: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
};

export const DEMO_CLIENT_EMAIL = "client@driveph.ph";

export const SEED_BOOKINGS: Booking[] = [
  {
    ref: "DP-8K2M4Q",
    carSlug: "fiat-500",
    customerName: "Camille Reyes",
    customerEmail: DEMO_CLIENT_EMAIL,
    customerPhone: "+63 917 555 0142",
    pickupLocation: "Manila",
    pickupDate: "2026-10-24",
    returnDate: "2026-10-27",
    chauffeur: false,
    insurance: true,
    childSeat: false,
    subtotal: 12000,
    vat: 1440,
    total: 13440,
    status: "confirmed",
    createdAt: "2026-10-14T09:12:00.000Z",
  },
  {
    ref: "DP-3XQ7LP",
    carSlug: "nissan-gtr",
    customerName: "Camille Reyes",
    customerEmail: DEMO_CLIENT_EMAIL,
    customerPhone: "+63 917 555 0142",
    pickupLocation: "Manila",
    pickupDate: "2026-12-02",
    returnDate: "2026-12-06",
    chauffeur: false,
    insurance: true,
    childSeat: false,
    subtotal: 51500,
    vat: 6180,
    total: 57680,
    status: "pending",
    createdAt: "2026-10-17T14:05:00.000Z",
  },
  {
    ref: "DP-5RT9WN",
    carSlug: "volkswagen-polo",
    customerName: "Marco Santos",
    customerEmail: "marco@example.com",
    customerPhone: "+63 918 222 3311",
    pickupLocation: "Manila",
    pickupDate: "2026-10-20",
    returnDate: "2026-10-23",
    chauffeur: true,
    insurance: true,
    childSeat: true,
    subtotal: 19100,
    vat: 2292,
    total: 21392,
    status: "active",
    createdAt: "2026-10-12T07:30:00.000Z",
  },
  {
    ref: "DP-7HB2KC",
    carSlug: "chevrolet-camaro",
    customerName: "Andrea Lim",
    customerEmail: "andrea@example.com",
    customerPhone: "+63 920 555 7788",
    pickupLocation: "Manila",
    pickupDate: "2026-10-02",
    returnDate: "2026-10-05",
    chauffeur: false,
    insurance: true,
    childSeat: false,
    subtotal: 37200,
    vat: 4464,
    total: 41664,
    status: "completed",
    createdAt: "2026-09-25T11:00:00.000Z",
  },
  {
    ref: "DP-9JW4FD",
    carSlug: "ford-mustang",
    customerName: "Paolo Garcia",
    customerEmail: "paolo@example.com",
    customerPhone: "+63 917 333 4455",
    pickupLocation: "Cebu",
    pickupDate: "2026-10-15",
    returnDate: "2026-10-18",
    chauffeur: true,
    insurance: false,
    childSeat: false,
    subtotal: 41200,
    vat: 4944,
    total: 46144,
    status: "completed",
    createdAt: "2026-10-05T08:45:00.000Z",
  },
];
