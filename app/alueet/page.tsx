import type { Metadata } from "next";
import { AreaExperience } from "@/components/tuuma/AreaExperience";

export const metadata: Metadata = { title: "Alueet", description: "Tutustu Hyrylään, Jokelaan ja Kellokoskeen asumisen näkökulmasta." };

export default function Page() {
  return <AreaExperience />;
}
