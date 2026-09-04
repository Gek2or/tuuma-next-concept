import type { Metadata } from "next";
import { ResidentDashboard } from "@/components/tuuma/ResidentDashboard";

export const metadata: Metadata = {
  title: "Oma koti — Demo",
  description: "Asukkaan monikielinen digitaalinen palvelukeskus.",
};

export default function Page() {
  return <ResidentDashboard />;
}
