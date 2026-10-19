import { HeroSearch } from "@/components/home/HeroSearch";
import {
  FeaturedFleet,
  HowItWorks,
  LocationsStrip,
  CtaBand,
} from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <FeaturedFleet />
      <HowItWorks />
      <LocationsStrip />
      <CtaBand />
    </>
  );
}
