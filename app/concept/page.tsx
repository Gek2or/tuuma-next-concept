import type { Metadata } from "next";
import { ConceptStory } from "@/components/tuuma/ConceptStory";

export const metadata: Metadata = {
  title: "Konsepti",
  description: "Tuuma Next -konseptin digitaalinen mahdollisuus, ratkaisu ja liiketoimintahyöty.",
};

export default function Page() {
  return <ConceptStory />;
}
