import type { Metadata } from "next";
import { ResidentDashboard } from "@/components/tuuma/ResidentDashboard";
import { DemoAccess } from "@/components/tuuma/DemoAccess";

export const metadata: Metadata = {
  title: "Oma koti — Demo",
  description: "Asukkaan monikielinen digitaalinen palvelukeskus.",
};

export default function Page() {
  return <DemoAccess role="user"><ResidentDashboard /></DemoAccess>;
}
