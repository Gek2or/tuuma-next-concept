import type { Metadata } from "next";
import { ApplicantPortal } from "@/components/tuuma/ApplicantPortal";

export const metadata: Metadata = {
  title: "Hakemukseni — Demo",
  description: "Monikielinen konsepti asuntohakemuksen etenemisen seurantaan.",
};

export default function Page() {
  return <ApplicantPortal />;
}
