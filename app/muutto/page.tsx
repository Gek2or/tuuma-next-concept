import type { Metadata } from "next";
import { MovingWizard } from "@/components/tuuma/MovingWizard";

export const metadata: Metadata = {
  title: "Muuttoapuri — Demo",
  description: "Ohjattu sisään- ja poismuuton digitaalinen tarkistuslista.",
};

export default function Page() {
  return <MovingWizard />;
}
