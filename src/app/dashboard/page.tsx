import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/AuthGate";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";

export const metadata: Metadata = {
  title: "My bookings — DrivePH Rentals",
  description: "Your DrivePH demo bookings.",
};

export default function DashboardPage() {
  return (
    <AuthGate>
      <ClientDashboard />
    </AuthGate>
  );
}
