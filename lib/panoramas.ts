import manifest from "@/public/panoramas/manifest.json";

export type PanoramaHome = (typeof manifest.apartments)[number];
export type PanoramaPoint = PanoramaHome["points"][number];
export const panoramaHomes = manifest.apartments;
export function panoramaFor(id: string) {
  return panoramaHomes.find(home => home.id === id);
}
