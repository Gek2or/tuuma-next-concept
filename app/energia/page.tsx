import type { Metadata } from "next";
import { EnergyDashboard } from "@/components/tuuma/EnergyDashboard";

export const metadata: Metadata = {
  title: "Energia ja sisäilma — Demo",
  description: "Asukkaan energia- ja sisäilmadataa selkeyttävä konseptinäkymä.",
};

export default function Page() {
  return <EnergyDashboard />;
}
