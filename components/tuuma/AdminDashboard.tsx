"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Camera,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Eye,
  FileImage,
  FilePlus2,
  ImagePlus,
  Lightbulb,
  MessageCircle,
  Search,
  Upload,
  Wrench,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apartments } from "@/lib/data";
import { useLanguage } from "./LanguageProvider";

const initial = [
  { id: "C09", name: "Kalliolinna C09", status: "Draft" },
  { id: "E15", name: "Kalliolinna E15", status: "Draft" },
  { id: "F20", name: "Kalliolinna F20", status: "Draft" },
  { id: "A12", name: "Kalliolinna A12", status: "Published" },
  { id: "A14", name: "Kalliolinna A14", status: "Ready" },
  { id: "B24", name: "Asemanvalo B24", status: "Reserved" },
  { id: "C07", name: "Ruukinranta C07", status: "Draft" },
];
const statuses = ["Draft", "Ready", "Published", "Reserved", "Rented"];

export function AdminDashboard() {
  const { text } = useLanguage();
  const [items, setItems] = useState(initial);
  const [notice, setNotice] = useState("");
  const [fixed, setFixed] = useState<string[]>([]);
  const [resolved, setResolved] = useState<string[]>([]);
  const quality = 82 + fixed.length * 4;

  function advance(id: string) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const index = statuses.indexOf(item.status);
        return {
          ...item,
          status: statuses[Math.min(index + 1, statuses.length - 1)],
        };
      }),
    );
    setNotice(
      text({
        fi: "Tila päivitetty demo-näkymässä",
        en: "Status updated in the demo",
        sv: "Statusen uppdaterades i demon",
      }),
    );
  }

  const analytics = [
    [
      text({ fi: "Suosituin alue", en: "Most searched area", sv: "Mest sökta område" }),
      "Hyrylä",
      text({ fi: "hakusignaali", en: "search signal", sv: "söksignal" }),
    ],
    [
      text({ fi: "Keskimääräinen budjetti", en: "Average search budget", sv: "Genomsnittlig sökbudget" }),
      "860 €",
      text({ fi: "demo-data", en: "demo data", sv: "demodata" }),
    ],
    ["360° views", "1 248", "demo data"],
    [
      text({ fi: "Hakemuskonversio", en: "Application conversion", sv: "Ansökningskonvertering" }),
      text({ fi: "Mitattavissa", en: "Measurable", sv: "Mätbar" }),
      "search → home → apply",
    ],
    [
      text({ fi: "Yleisin asukaskysymys", en: "Top resident question", sv: "Vanligaste boendefrågan" }),
      text({ fi: "Vuokra ja maksut", en: "Rent and payments", sv: "Hyra och betalningar" }),
      "Kysy Tuumalta",
    ],
    [
      text({ fi: "Huollon seuranta", en: "Maintenance tracking", sv: "Serviceuppföljning" }),
      "SLA visible",
      text({ fi: "demo-konsepti", en: "demo concept", sv: "demokoncept" }),
    ],
  ];

  return (
    <section className="shell py-10 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="rounded-full bg-[#fff0d8] px-3 py-2 text-[11px] font-black uppercase tracking-wider text-[#8a5600]">
            Staff concept / demo
          </span>
          <h1 className="display mt-5 text-5xl sm:text-6xl">
            {text({ fi: "Palvelun ohjaamo", en: "Service control room", sv: "Tjänstens kontrollrum" })}
          </h1>
          <p className="mt-4 max-w-2xl text-[#60758a]">
            {text({
              fi: "Kohteet, sisältölaatu, 360°-julkaisut, asukaspalvelu ja kysyntäsignaalit yhdessä näkymässä.",
              en: "Properties, content quality, 360° publishing, resident service and demand signals in one view.",
              sv: "Objekt, innehållskvalitet, 360°-publicering, boendeservice och efterfrågesignaler i en vy.",
            })}
          </p>
        </div>
        <button
          onClick={() =>
            setNotice(
              text({
                fi: "Uuden asunnon luonnos luotu",
                en: "New home draft created",
                sv: "Ett nytt bostadsutkast skapades",
              }),
            )
          }
          className="flex min-h-12 items-center gap-2 rounded-full bg-[#0a55df] px-5 text-sm font-black text-white"
        >
          <FilePlus2 size={18} />
          {text({ fi: "Lisää asunto", en: "Add home", sv: "Lägg till bostad" })}
        </button>
      </div>

      {notice && (
        <div
          className="mt-6 flex items-center gap-2 rounded-2xl bg-[#e6f6ef] p-4 text-sm font-bold text-[#08715b]"
          role="status"
        >
          <Check size={18} />
          {notice}
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Summary
          icon={ClipboardCheck}
          label={text({ fi: "Sisältölaatu", en: "Content quality", sv: "Innehållskvalitet" })}
          value={quality + "/100"}
          detail={text({ fi: "4 kohdetta tarkistettu", en: "4 properties checked", sv: "4 objekt granskade" })}
          tone="blue"
        />
        <Summary
          icon={Clock3}
          label="Maintenance SLA"
          value="11 / 13"
          detail={text({ fi: "tavoiteajassa · demo", en: "within target · demo", sv: "inom målet · demo" })}
          tone="green"
        />
        <Summary
          icon={MessageCircle}
          label={text({ fi: "Avoimet AI-kysymykset", en: "Unresolved AI questions", sv: "Öppna AI-frågor" })}
          value={String(3 - resolved.length)}
          detail={text({ fi: "vaatii hyväksytyn ohjeen", en: "need approved guidance", sv: "behöver godkänd anvisning" })}
          tone="amber"
        />
        <Summary
          icon={Activity}
          label={text({ fi: "Aktiiviset haut", en: "Active search alerts", sv: "Aktiva sökbevakningar" })}
          value="184"
          detail={text({ fi: "demo-data", en: "demo data", sv: "demodata" })}
          tone="blue"
        />
      </div>

      <Tabs defaultValue="properties" className="mt-8">
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-12 min-w-max rounded-full bg-white p-1">
            <TabsTrigger value="properties" className="rounded-full px-5">
              {text({ fi: "Kohteet", en: "Properties", sv: "Objekt" })}
            </TabsTrigger>
            <TabsTrigger value="quality" className="rounded-full px-5">
              {text({ fi: "Laatu", en: "Quality", sv: "Kvalitet" })}
            </TabsTrigger>
            <TabsTrigger value="service" className="rounded-full px-5">
              {text({ fi: "Palvelu", en: "Service", sv: "Service" })}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-full px-5">
              {text({ fi: "Analytiikka", en: "Analytics", sv: "Analys" })}
            </TabsTrigger>
            <TabsTrigger value="workflow" className="rounded-full px-5">
              360° workflow
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="properties">
          <div className="mt-6 overflow-hidden rounded-[28px] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e1e8ef] p-5">
              <div className="flex min-w-[240px] flex-1 items-center gap-3 rounded-xl bg-[#eef3f7] px-4 py-3">
                <Search size={17} />
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder={text({ fi: "Hae asuntoa tai kohdetta", en: "Search home or property", sv: "Sök bostad eller objekt" })}
                  aria-label={text({ fi: "Hae asuntoa", en: "Search homes", sv: "Sök bostad" })}
                />
              </div>
              <button className="rounded-xl border px-4 py-3 text-sm font-bold">
                {text({ fi: "Suodata", en: "Filter", sv: "Filtrera" })}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-[#6a7d90]">
                    <th className="p-5">{text({ fi: "Asunto", en: "Home", sv: "Bostad" })}</th>
                    <th className="p-5">Media</th>
                    <th className="p-5">{text({ fi: "Vuokra", en: "Rent", sv: "Hyra" })}</th>
                    <th className="p-5">{text({ fi: "Tila", en: "Status", sv: "Status" })}</th>
                    <th className="p-5">{text({ fi: "Toiminto", en: "Action", sv: "Åtgärd" })}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => { const home = apartments.find(home => home.id === item.id)!; return (
                    <tr key={item.id} className="border-t border-[#e7edf2]">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <img src={home.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
                          <div>
                            <b>{item.name}</b>
                            <small className="block text-[#687d91]">
                              {home.area} · {home.size} m²
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="flex items-center gap-2 text-sm font-bold">
                          <Camera size={17} className="text-[#0a55df]" />
                          {["C09", "E15", "F20"].includes(item.id) ? text({fi:"360° työn alla",en:"360° in progress",sv:"360° under arbete"}) : item.id === "C07"
                            ? text({ fi: "Kuvat puuttuvat", en: "Photos missing", sv: "Bilder saknas" })
                            : "360° ready"}
                        </span>
                      </td>
                      <td className="p-5 font-bold">{home.rent} €</td>
                      <td className="p-5"><Status value={item.status} /></td>
                      <td className="p-5">
                        <button onClick={() => advance(item.id)} className="rounded-xl border px-3 py-2 text-sm font-bold">
                          {text({ fi: "Seuraava tila", en: "Next status", sv: "Nästa status" })}
                        </button>
                      </td>
                    </tr>
                  ); })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quality">
          <div className="mt-6 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
            <article className="rounded-[28px] bg-[#0d2e50] p-7 text-white">
              <div className="flex items-center justify-between">
                <ClipboardCheck className="text-[#77b8f6]" />
                <span className="rounded-full bg-white/10 px-3 py-2 text-sm font-black">{quality}/100</span>
              </div>
              <h2 className="display mt-8 text-4xl">
                {text({ fi: "Julkaisulaatu näkyväksi", en: "Make publishing quality visible", sv: "Gör publiceringskvaliteten synlig" })}
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#c4d7e8]">
                {text({
                  fi: "Automaattinen tarkistus löytää puuttuvat kuvat, pohjat, alt-tekstit ja epäselvät vuokratiedot ennen julkaisua.",
                  en: "Automatic checks find missing photos, floor plans, alt text and unclear rental information before publishing.",
                  sv: "Automatiska kontroller hittar saknade bilder, planritningar, alt-texter och otydliga hyresuppgifter före publicering.",
                })}
              </p>
              <div className="mt-7 h-3 rounded-full bg-white/12">
                <div className="h-3 rounded-full bg-[#72b5f5] transition-all" style={{ width: quality + "%" }} />
              </div>
            </article>
            <div className="grid gap-3">
              {[
                {
                  id: "photos",
                  icon: FileImage,
                  title: "Ruukinranta C07",
                  issue: text({ fi: "Pääkuva ja huonekuvat puuttuvat", en: "Main and room photos missing", sv: "Huvudbild och rumsbilder saknas" }),
                },
                {
                  id: "floorplan",
                  icon: FileImage,
                  title: "Asemanvalo B24",
                  issue: text({ fi: "Pohjakuva tarvitsee alt-tekstin", en: "Floor plan needs alt text", sv: "Planritningen behöver alt-text" }),
                },
                {
                  id: "rent",
                  icon: AlertTriangle,
                  title: "Kalliolinna A14",
                  issue: text({ fi: "Vesimaksun tieto tarkistamatta", en: "Water fee not verified", sv: "Vattenavgiften inte verifierad" }),
                },
              ].map((item) => {
                const Icon = item.icon;
                const isFixed = fixed.includes(item.id);
                return (
                  <article key={item.id} className={["flex items-center gap-4 rounded-2xl p-5", isFixed ? "bg-[#e6f6ef]" : "bg-white"].join(" ")}>
                    <span className={["grid h-11 w-11 shrink-0 place-items-center rounded-2xl", isFixed ? "bg-[#08705b] text-white" : "bg-[#fff1dc] text-[#8a5900]"].join(" ")}>
                      {isFixed ? <Check size={19} /> : <Icon size={19} />}
                    </span>
                    <div>
                      <b>{item.title}</b>
                      <p className="mt-1 text-sm text-[#60758a]">
                        {isFixed ? text({ fi: "Tarkistus valmis", en: "Check complete", sv: "Kontrollen klar" }) : item.issue}
                      </p>
                    </div>
                    <button
                      disabled={isFixed}
                      onClick={() => setFixed((current) => [...current, item.id])}
                      className="ml-auto rounded-full border border-[#ccd9e4] px-4 py-2 text-sm font-black disabled:opacity-40"
                    >
                      {isFixed ? text({ fi: "Valmis", en: "Done", sv: "Klart" }) : text({ fi: "Korjaa", en: "Fix", sv: "Åtgärda" })}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="service">
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[28px] bg-white p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="eyebrow">Huolto Live</p>
                  <h2 className="mt-3 text-xl font-black">
                    {text({ fi: "Tilannekuva ja toistuvat viat", en: "Workload and recurring issues", sv: "Lägesbild och återkommande fel" })}
                  </h2>
                </div>
                <Wrench className="text-[#0a55df]" />
              </div>
              <div className="mt-7 grid gap-3">
                {[
                  ["Vesikalusteet", 8, "76%"],
                  ["Ovien lukitus", 5, "48%"],
                  ["Ilmanvaihto", 3, "30%"],
                ].map(([label, count, width]) => (
                  <div key={String(label)}>
                    <div className="mb-2 flex justify-between text-sm font-bold"><span>{label}</span><span>{count}</span></div>
                    <div className="h-2 rounded-full bg-[#e4ecf2]"><div className="h-2 rounded-full bg-[#0a55df]" style={{ width: String(width) }} /></div>
                  </div>
                ))}
              </div>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#e6f6ef] p-4"><small className="text-[#4a7165]">{text({ fi: "Tavoiteajassa", en: "Within target", sv: "Inom målet" })}</small><b className="mt-2 block text-2xl">11 / 13</b></div>
                <div className="rounded-2xl bg-[#fff1dc] p-4"><small className="text-[#765f35]">{text({ fi: "Vaatii huomiota", en: "Needs attention", sv: "Kräver uppmärksamhet" })}</small><b className="mt-2 block text-2xl">2</b></div>
              </div>
            </article>
            <article className="rounded-[28px] bg-[#dfeeff] p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="eyebrow">Kysy Tuumalta</p>
                  <h2 className="mt-3 text-xl font-black">
                    {text({ fi: "Kysymykset ilman hyväksyttyä vastausta", en: "Questions without approved answers", sv: "Frågor utan godkända svar" })}
                  </h2>
                </div>
                <MessageCircle className="text-[#0a55df]" />
              </div>
              <div className="mt-6 grid gap-3">
                {[
                  { id: "noise", q: text({ fi: "Saako parvekkeella grillata?", en: "Can I grill on the balcony?", sv: "Får man grilla på balkongen?" }) },
                  { id: "bike", q: text({ fi: "Mihin vieraan pyörä jätetään?", en: "Where should a guest leave a bike?", sv: "Var ska en gäst lämna sin cykel?" }) },
                  { id: "paint", q: text({ fi: "Voinko maalata seinän?", en: "May I paint a wall?", sv: "Får jag måla en vägg?" }) },
                ]
                  .filter((item) => !resolved.includes(item.id))
                  .map((item) => (
                    <div key={item.id} className="rounded-2xl bg-white p-4">
                      <b className="text-sm">{item.q}</b>
                      <div className="mt-3 flex items-center justify-between">
                        <small className="text-[#667b8e]">{text({ fi: "3 samankaltaista kysymystä", en: "3 similar questions", sv: "3 liknande frågor" })}</small>
                        <button onClick={() => setResolved((current) => [...current, item.id])} className="text-sm font-black text-[#0a55df]">
                          {text({ fi: "Lisää ohje", en: "Add guidance", sv: "Lägg till anvisning" })}
                        </button>
                      </div>
                    </div>
                  ))}
                {resolved.length === 3 && (
                  <div className="flex items-center gap-3 rounded-2xl bg-[#e6f6ef] p-5 font-black text-[#08705b]">
                    <CheckCircle2 />{text({ fi: "Kaikki kysymykset käsitelty", en: "All questions handled", sv: "Alla frågor hanterade" })}
                  </div>
                )}
              </div>
            </article>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {analytics.map((item, index) => (
              <article key={item[0]} className={["rounded-[26px] p-6", index === 3 ? "bg-[#0a55df] text-white" : "bg-white"].join(" ")}>
                <p className={["text-sm font-bold", index === 3 ? "text-[#cfe0ff]" : "text-[#64788c]"].join(" ")}>{item[0]}</p>
                <strong className="mt-5 block text-3xl tracking-[-.04em]">{item[1]}</strong>
                <small className={["mt-2 block", index === 3 ? "text-[#e1ebff]" : "text-[#77899a]"].join(" ")}>{item[2]}</small>
              </article>
            ))}
          </div>
          <div className="mt-5 rounded-[28px] bg-white p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">{text({ fi: "Asuntohaku-funneli", en: "Home-search funnel", sv: "Söktratt för bostäder" })}</p>
                <h2 className="mt-3 text-xl font-black">Search → home → 360° → apply</h2>
              </div>
              <BarChart3 className="text-[#0a55df]" />
            </div>
            <div className="mt-8 grid gap-5">
              {[
                ["Search results", 100],
                ["Property page", 64],
                ["360° tour", 42],
                ["Application", 18],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <div className="mb-2 flex justify-between text-sm font-bold"><span>{label}</span><span>{value}</span></div>
                  <div className="h-3 rounded-full bg-[#e5edf4]"><div className="h-3 rounded-full bg-[#0a55df]" style={{ width: String(value) + "%" }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <article className="rounded-[26px] bg-[#e6f1ff] p-6">
              <Lightbulb className="text-[#0a55df]" />
              <h3 className="mt-5 font-black">{text({ fi: "Kysyntähavainto", en: "Demand insight", sv: "Efterfrågeinsikt" })}</h3>
              <p className="mt-3 text-sm leading-6 text-[#587087]">
                {text({
                  fi: "Hyrylän esteettömät kaksiot tallennetaan usein hakuhälytyksiin. Näkyvyyttä voidaan lisätä heti, ilman tarkkaa prosenttilupausta.",
                  en: "Accessible one-bedroom homes in Hyrylä are often saved to search alerts. Visibility can be increased without making a precise outcome claim.",
                  sv: "Tillgängliga tvåor i Hyrylä sparas ofta i sökbevakningar. Synligheten kan ökas utan exakta effektlöften.",
                })}
              </p>
            </article>
            <article className="rounded-[26px] bg-[#0d2e50] p-6 text-white">
              <Lightbulb className="text-[#77b8f6]" />
              <h3 className="mt-5 font-black">{text({ fi: "Suositeltu seuraava testi", en: "Recommended next test", sv: "Rekommenderat nästa test" })}</h3>
              <p className="mt-3 text-sm leading-6 text-[#c4d7e8]">
                {text({
                  fi: "Nosta kokonaiskustannuslaskuri näkyviin kolmen suosituimman kohteen sivulla ja vertaa hakemuksen aloituksia.",
                  en: "Feature the total-cost calculator on the three most popular properties and compare application starts.",
                  sv: "Lyft fram totalkostnadskalkylatorn på de tre populäraste objekten och jämför startade ansökningar.",
                })}
              </p>
            </article>
          </div>
        </TabsContent>

        <TabsContent value="workflow">
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <WorkflowCard icon={Upload} step="01 / Upload" title={text({ fi: "Lisää kuvat", en: "Add media", sv: "Lägg till media" })} body={text({ fi: "Pudota kuvat ja 360°-aineisto tai kuvaa tuetulla mobiilityönkululla.", en: "Drop photos and 360° media or use the supported mobile capture flow.", sv: "Lägg till bilder och 360°-material eller använd det stödda mobilflödet." })} action={text({ fi: "Valitse tiedostot", en: "Choose files", sv: "Välj filer" })} />
            <WorkflowCard icon={Camera} step="02 / Review" title={text({ fi: "Tarkista huoneet", en: "Review rooms", sv: "Granska rum" })} body={text({ fi: "Nimeä tilat, sijoita hotspotit ja tarkista pohjakartan yhteys.", en: "Name rooms, place hotspots and verify floor-plan links.", sv: "Namnge rum, placera hotspots och kontrollera kopplingen till planritningen." })} action={text({ fi: "Avaa esikatselu", en: "Open preview", sv: "Öppna förhandsvisning" })} blue />
            <WorkflowCard icon={ArrowUpRight} step="03 / Publish" title={text({ fi: "Julkaise kohteelle", en: "Publish to property", sv: "Publicera på objektet" })} body={text({ fi: "Valmis kierros liittyy asuntoon ja päivittyy asiakassivulle yhdellä toiminnolla.", en: "The completed tour links to the home and updates the customer page in one action.", sv: "Den färdiga rundturen kopplas till bostaden och uppdaterar kundsidan med en åtgärd." })} action={text({ fi: "Julkaise 360°", en: "Publish 360°", sv: "Publicera 360°" })} dark />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function Status({ value }: { value: string }) {
  const className =
    value === "Published"
      ? "bg-[#e4f6ee] text-[#08735c]"
      : value === "Reserved"
        ? "bg-[#fff0d8] text-[#8a5600]"
        : "bg-[#edf2f6] text-[#526a82]";
  return <span className={"rounded-full px-3 py-2 text-xs font-black " + className}>{value}</span>;
}

function Summary({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  detail: string;
  tone: "blue" | "green" | "amber";
}) {
  const style =
    tone === "green"
      ? "bg-[#e6f6ef] text-[#08705b]"
      : tone === "amber"
        ? "bg-[#fff1dc] text-[#8a5900]"
        : "bg-[#e6f1ff] text-[#0a55df]";
  return (
    <article className="rounded-[24px] bg-white p-5">
      <div className={"grid h-10 w-10 place-items-center rounded-2xl " + style}><Icon size={18} /></div>
      <p className="mt-5 text-sm font-bold text-[#64788c]">{label}</p>
      <strong className="mt-2 block text-2xl">{value}</strong>
      <small className="mt-2 block text-[#718497]">{detail}</small>
    </article>
  );
}

function WorkflowCard({
  icon: Icon,
  step,
  title,
  body,
  action,
  blue,
  dark,
}: {
  icon: typeof Upload;
  step: string;
  title: string;
  body: string;
  action: string;
  blue?: boolean;
  dark?: boolean;
}) {
  const surface = dark ? "bg-[#102e4e] text-white" : blue ? "bg-[#e3effc]" : "bg-white";
  return (
    <article className={"rounded-[28px] p-7 " + surface}>
      <Icon className={dark ? "text-[#76b5ff]" : "text-[#0a55df]"} />
      <span className={"eyebrow mt-8 block " + (dark ? "!text-[#8fb9df]" : "")}>{step}</span>
      <h2 className="mt-3 text-xl font-black">{title}</h2>
      <p className={"mt-3 leading-7 " + (dark ? "text-[#c3d6e8]" : "text-[#60758a]")}>{body}</p>
      <button className={"mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-transparent py-3 font-bold " + (dark ? "bg-white text-[#102e4e]" : "bg-white")}>
        {blue ? <Eye size={18} /> : <ImagePlus size={18} />}
        {action}
      </button>
    </article>
  );
}
