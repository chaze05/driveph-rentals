import type { Metadata } from "next";
import { AuthGate } from "@/components/auth/AuthGate";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin — DrivePH Rentals",
  description: "DrivePH demo admin dashboard for fleet and bookings.",
};

export default function AdminPage() {
  return (
    <AuthGate role="admin">
      <AdminDashboard />
    </AuthGate>
  );
}
