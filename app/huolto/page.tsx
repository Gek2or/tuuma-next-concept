import type { Metadata } from "next";
import { Suspense } from "react";
import { MaintenanceLive } from "@/components/tuuma/MaintenanceLive";

export const metadata: Metadata = {
  title: "Huolto Live — Demo",
  description: "Ohjattu ja seurattava huoltopyyntökonsepti.",
};

export default function Page() {
  return <Suspense><MaintenanceLive /></Suspense>;
}
