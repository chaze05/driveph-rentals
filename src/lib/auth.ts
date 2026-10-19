export type Role = "client" | "admin";

export type DemoUser = {
  email: string;
  password: string;
  name: string;
  role: Role;
};

export const DEMO_USERS: DemoUser[] = [
  {
    email: "client@driveph.ph",
    password: "demo1234",
    name: "Camille Reyes",
    role: "client",
  },
  {
    email: "admin@driveph.ph",
    password: "demo1234",
    name: "DrivePH Admin",
    role: "admin",
  },
];

export function findDemoUser(email: string, password: string): DemoUser | undefined {
  const normalized = email.trim().toLowerCase();
  return DEMO_USERS.find(
    (user) => user.email === normalized && user.password === password
  );
}
