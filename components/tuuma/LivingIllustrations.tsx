"use client";

import Link from "next/link";
import { ArrowUpRight, Home, ScanLine, Wrench } from "lucide-react";
import { useLanguage, type LocalizedText } from "./LanguageProvider";

type Story = {
  image: string;
  icon: typeof Home;
  eyebrow: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
  action: LocalizedText;
  href: string;
  alt: LocalizedText;
};

const stories: Story[] = [
  {
    image: "/art/editorial-new-home-v1.webp",
    icon: Home,
    eyebrow: { fi: "Löydä oma rytmisi", en: "Find your rhythm", sv: "Hitta din rytm" },
    title: { fi: "Koti alkaa pihalta", en: "Home starts at the courtyard", sv: "Hemmet börjar på gården" },
    body: {
      fi: "Vertaa kodin lisäksi arjen reittejä, pihapiiriä ja sitä, miltä alue tuntuu ensimmäisenä aamuna.",
      en: "Compare more than the home: everyday routes, the courtyard and the feeling of the first morning in the area.",
      sv: "Jämför mer än bostaden: vardagsvägar, gården och känslan av den första morgonen i området.",
    },
    action: { fi: "Tutustu alueisiin", en: "Explore areas", sv: "Utforska områden" },
    href: "/alueet",
    alt: { fi: "Perhe saapuu modernin pohjoismaisen talon pihaan", en: "Family arriving at a modern Nordic apartment courtyard", sv: "Familj som kommer till en modern nordisk bostadsgård" },
  },
  {
    image: "/art/editorial-resident-care-v1.webp",
    icon: Wrench,
    eyebrow: { fi: "Apua silloin kun tarvitset", en: "Help when you need it", sv: "Hjälp när du behöver den" },
    title: { fi: "Selkeästi, ilman arvaamista", en: "Clear help, no guesswork", sv: "Tydlig hjälp utan gissningar" },
    body: {
      fi: "Ohjattu apu erottaa kiireellisen tilanteen, kertoo seuraavan vaiheen ja säästää aikaa sekä asukkaalta että huollolta.",
      en: "Guided help identifies urgent situations, explains the next step and saves time for both residents and maintenance.",
      sv: "Guidad hjälp identifierar brådskande ärenden, förklarar nästa steg och sparar tid för både boende och service.",
    },
    action: { fi: "Avaa asukaspalvelu", en: "Open resident services", sv: "Öppna boendeservice" },
    href: "/asukkaille",
    alt: { fi: "Asukas ja huoltotyöntekijä kodin ovella", en: "Resident and maintenance worker at a home entrance", sv: "Boende och servicetekniker vid hemmets dörr" },
  },
  {
    image: "/art/editorial-digital-tour-v1.webp",
    icon: ScanLine,
    eyebrow: { fi: "Näe tila ennen näyttöä", en: "See the space before viewing", sv: "Se bostaden före visning" },
    title: { fi: "Kierros, joka tekee kodista ymmärrettävän", en: "A tour that makes a home understandable", sv: "En rundtur som gör bostaden begriplig" },
    body: {
      fi: "360°-kierros, pohjapiirros ja digitaalinen malli kertovat valosta, mittakaavasta ja huoneiden yhteydestä yhdellä näkymällä.",
      en: "A 360° tour, floor plan and digital model show light, scale and room connections in one place.",
      sv: "En 360°-tur, planritning och digital modell visar ljus, skala och kopplingen mellan rummen på ett ställe.",
    },
    action: { fi: "Kokeile 3D-kierrosta", en: "Try the 3D tour", sv: "Prova 3D-turen" },
    href: "/kohteet/kalliolinna?asunto=F20",
    alt: { fi: "Pohjoismainen olohuone ja digitaalinen pohjapiirros", en: "Nordic living room with a digital floor plan", sv: "Nordiskt vardagsrum med digital planritning" },
  },
];

export function LivingIllustrations() {
  const { text } = useLanguage();

  return (
    <section className="shell py-10 sm:py-16" aria-labelledby="living-stories-title">
      <div className="mb-8 max-w-2xl sm:mb-10">
        <p className="eyebrow">{text({ fi: "Asuminen näkyväksi", en: "Make living visible", sv: "Gör boendet synligt" })}</p>
        <h2 id="living-stories-title" className="display mt-3 text-4xl sm:text-5xl">
          {text({ fi: "Pienet asiat kertovat, miltä koti tuntuu.", en: "Small things reveal how a home feels.", sv: "Små saker visar hur ett hem känns." })}
        </h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {stories.map((story) => {
          const Icon = story.icon;
          return (
            <article key={story.image} className="group overflow-hidden rounded-[30px] border border-[#dfe6e9] bg-[#fffdf8] shadow-[0_16px_42px_rgba(22,50,73,.08)]">
              <div className="relative aspect-[3/2] overflow-hidden bg-[#e4ebef]">
                <img src={story.image} alt={text(story.alt)} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" loading="lazy" decoding="async" />
                <div className="absolute inset-x-4 top-4 flex justify-end"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#0a55df] shadow-sm backdrop-blur"><Icon size={19} aria-hidden="true" /></span></div>
              </div>
              <div className="p-6 sm:p-7">
                <p className="eyebrow">{text(story.eyebrow)}</p>
                <h3 className="display mt-3 text-3xl leading-[1.04] text-[#173655]">{text(story.title)}</h3>
                <p className="mt-4 min-h-24 text-[0.98rem] leading-7 text-[#5b7187]">{text(story.body)}</p>
                <Link href={story.href} className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-[#0a55df] hover:text-[#073f9e]">
                  {text(story.action)} <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
