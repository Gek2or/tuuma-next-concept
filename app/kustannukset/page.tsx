import type { Metadata } from "next";
import { CostCalculator } from "@/components/tuuma/CostCalculator";

export const metadata: Metadata = {
  title: "Asumisen kokonaiskustannus — Demo",
  description: "Vuokran ja muiden asumiskulujen interaktiivinen demo-laskuri.",
};

export default function Page() {
  return <CostCalculator />;
}
