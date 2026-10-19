import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { BookingsProvider } from "@/components/providers/BookingsProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "optional",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://driveph-rentals.vercel.app"),
  title: "DrivePH Rentals — Drive the islands",
  description:
    "Self-drive and chauffeur car rental across Manila, Cebu, Bohol and Siargao. Clear daily rates, real availability and instant booking.",
  openGraph: {
    title: "DrivePH Rentals — Drive the islands",
    description:
      "Car rental across Manila, Cebu, Bohol and Siargao with clear daily rates and real availability.",
    type: "website",
    locale: "en_PH",
    images: ["/images/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <MotionProvider>
          <AuthProvider>
            <BookingsProvider>
              <a
                href="#main"
                className="sr-only rounded-full bg-lime px-4 py-2 text-sm font-semibold text-night focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
              >
                Skip to content
              </a>
              <Header />
              <main id="main" className="min-h-[60svh]">
                {children}
              </main>
              <Footer />
            </BookingsProvider>
          </AuthProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
