"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Box, LayoutPanelTop, Sparkles } from "lucide-react";
import type { Apartment } from "@/lib/data";
import { ApartmentPlan } from "./ApartmentPlan";
import { useLanguage } from "./LanguageProvider";

const ApartmentDollhouse = dynamic(() => import("./ApartmentDollhouse"), {
  ssr: false,
  loading: () => <div className="grid min-h-[360px] place-items-center rounded-3xl bg-[#eef1ef] text-sm font-semibold text-[#516a7b]">3D-malli latautuu…</div>,
});

/** Keeps a technical drawing and the matching spatial model in one compact place. */
export function SpatialPlanSwitcher({ apartment }: { apartment: Apartment }) {
  const { text } = useLanguage();
  const [view, setView] = useState<"plan" | "model">("plan");
  const copy = (fi: string, en: string, sv: string) => text({ fi, en, sv });

  return <section aria-label={copy("Pohja ja 3D-malli", "Plan and 3D model", "Plan och 3D-modell")}>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#d8e0df] bg-[#f2f5f3] p-3 sm:p-4">
      <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[.16em] text-[#667a83]">{apartment.id} · spatial twin</p><p className="mt-1 text-sm text-[#466174]">{copy("Sama alkuperäinen konseptigeometria piirustuksessa ja 3D:ssä.", "The same original concept geometry in drawing and 3D.", "Samma ursprungliga konceptgeometri i ritning och 3D.")}</p></div>
      <div className="grid shrink-0 grid-cols-2 rounded-full border border-[#cfd9d7] bg-white p-1" role="group" aria-label={copy("Esitystapa", "Presentation mode", "Visningsläge")}>
        <button onClick={() => setView("plan")} aria-pressed={view === "plan"} className={`flex min-h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-bold sm:px-4 ${view === "plan" ? "bg-[#173655] text-white" : "text-[#36516a]"}`}><LayoutPanelTop size={16}/>{copy("Piirustus", "Plan", "Ritning")}</button>
        <button onClick={() => setView("model")} aria-pressed={view === "model"} className={`flex min-h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-bold sm:px-4 ${view === "model" ? "bg-[#173655] text-white" : "text-[#36516a]"}`}><Box size={16}/>3D</button>
      </div>
    </div>
    {view === "plan" ? <ApartmentPlan key={`plan-${apartment.id}`} initialApartment={apartment.id} /> : <div className="space-y-3"><ApartmentDollhouse key={`dollhouse-${apartment.id}`} apartment={apartment} /><p className="flex items-start gap-2 rounded-2xl border border-[#ead8a8] bg-[#fff9e9] px-4 py-3 text-xs leading-5 text-[#6e5b2b]"><Sparkles className="mt-0.5 shrink-0" size={15}/>{copy("3D-malli on konseptidigital twin: se havainnollistaa tilaa, materiaaleja ja kalustusvaihtoehtoja, ei korvaa virallista rakennuspiirustusta.", "The 3D model is a concept digital twin: it illustrates space, materials and furnishing options; it does not replace an official construction drawing.", "3D-modellen är en konceptuell digital tvilling: den visar rum, material och inredningsalternativ och ersätter inte en officiell byggritning.")}</p></div>}
  </section>;
}
