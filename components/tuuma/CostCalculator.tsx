"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BusFront,
  Car,
  Droplets,
  Home,
  Info,
  Leaf,
  ShowerHead,
  Sparkles,
  Zap,
} from "lucide-react";
import { apartments } from "@/lib/data";
import { useLanguage } from "./LanguageProvider";

export function CostCalculator() {
  const { text } = useLanguage();
  const [apartmentId, setApartmentId] = useState("A12");
  const [people, setPeople] = useState(2);
  const [parking, setParking] = useState("35");
  const [sauna, setSauna] = useState(false);
  const [electricity, setElectricity] = useState(140);
  const [commuteDays, setCommuteDays] = useState(3);
  const [commuteKm, setCommuteKm] = useState(8);

  const apartment = apartments.find((item) => item.id === apartmentId) || apartments[0];
  const breakdown = useMemo(() => {
    const water = people * 24;
    const parkingCost = Number(parking);
    const saunaCost = sauna ? 18 : 0;
    const electricityCost = Math.round(electricity * 0.18);
    const commute = Math.round(commuteDays * 2 * commuteKm * 0.18 * 4.33);
    const total = apartment.rent + water + parkingCost + saunaCost + electricityCost + commute;
    return { water, parkingCost, saunaCost, electricityCost, commute, total };
  }, [apartment.rent, commuteDays, commuteKm, electricity, parking, people, sauna]);

  const extras = breakdown.total - apartment.rent;
  const rentShare = Math.round((apartment.rent / breakdown.total) * 100);

  return (
    <main id="main" className="shell py-10 sm:py-16">
      <div className="max-w-4xl">
        <span className="rounded-full bg-[#e5efff] px-3 py-2 text-[11px] font-black uppercase tracking-[.13em] text-[#0a55df]">Living cost planner · Demo</span>
        <h1 className="display mt-5 text-5xl sm:text-7xl">{text({ fi: "Mitä asuminen maksaa kokonaisuudessaan?", en: "What will living here cost in total?", sv: "Vad kostar boendet totalt?" })}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5d7388]">{text({ fi: "Vertaa vuokran lisäksi veden, pysäköinnin, saunan, sähkön ja työmatkan arviota. Näet yhdellä silmäyksellä realistisemman kuukausibudjetin.", en: "Compare rent together with estimated water, parking, sauna, electricity and commuting costs for a more realistic monthly budget.", sv: "Jämför hyran med uppskattade kostnader för vatten, parkering, bastu, el och arbetsresor för en mer realistisk månadsbudget." })}</p>
      </div>

      <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_.82fr]">
        <section className="rounded-[32px] bg-white p-6 sm:p-9">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-black sm:col-span-2">
              {text({ fi: "Valitse asunto", en: "Choose a home", sv: "Välj bostad" })}
              <select value={apartmentId} onChange={(event) => setApartmentId(event.target.value)} className="h-14 rounded-2xl border border-[#cfdbe5] bg-white px-4 text-base font-bold">
                {apartments.slice(0, 3).map((item) => <option key={item.id} value={item.id}>{item.title} · {item.rent} €/kk</option>)}
              </select>
            </label>

            <RangeField icon={Droplets} label={text({ fi: "Asukkaita", en: "Residents", sv: "Boende" })} value={people} min={1} max={5} suffix={text({ fi: " hlö", en: " people", sv: " pers." })} onChange={setPeople} />
            <label className="grid gap-2 text-sm font-black">
              <span className="flex items-center gap-2"><Car size={18} className="text-[#0a55df]" />{text({ fi: "Pysäköinti", en: "Parking", sv: "Parkering" })}</span>
              <select value={parking} onChange={(event) => setParking(event.target.value)} className="h-12 rounded-xl border border-[#cfdbe5] bg-white px-3 text-base font-bold">
                <option value="0">{text({ fi: "Ei autopaikkaa", en: "No parking", sv: "Ingen bilplats" })}</option>
                <option value="25">{text({ fi: "Pihapaikka 25 €", en: "Outdoor space €25", sv: "Gårdsplats 25 €" })}</option>
                <option value="35">{text({ fi: "Lämmityspaikka 35 €", en: "Heated space €35", sv: "Värmeplats 35 €" })}</option>
                <option value="55">{text({ fi: "EV-paikka 55 €", en: "EV space €55", sv: "Elbilsplats 55 €" })}</option>
              </select>
            </label>
            <RangeField icon={Zap} label={text({ fi: "Sähköarvio", en: "Electricity estimate", sv: "Eluppskattning" })} value={electricity} min={60} max={350} step={10} suffix=" kWh/kk" onChange={setElectricity} />
            <label className="flex min-h-24 cursor-pointer items-center gap-4 rounded-2xl bg-[#f0f5f9] p-5">
              <input type="checkbox" checked={sauna} onChange={(event) => setSauna(event.target.checked)} className="h-5 w-5 accent-[#0a55df]" />
              <span><ShowerHead size={19} className="text-[#0a55df]" /><b className="mt-2 block text-sm">{text({ fi: "Viikoittainen saunavuoro", en: "Weekly sauna slot", sv: "Veckovis bastutid" })}</b><small className="text-[#63778b]">18 €/kk</small></span>
            </label>
          </div>

          <div className="mt-7 rounded-[26px] bg-[#e6f1ff] p-5 sm:p-6">
            <div className="flex items-center gap-3"><BusFront className="text-[#0a55df]" /><div><h2 className="font-black">{text({ fi: "Työmatka-arvio", en: "Commute estimate", sv: "Uppskattad arbetsresa" })}</h2><p className="mt-1 text-sm text-[#61778d]">{text({ fi: "Muokkaa vain, jos haluat huomioida liikkumisen.", en: "Adjust only if you want travel included.", sv: "Justera bara om du vill räkna med resor." })}</p></div></div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2"><RangeField icon={Sparkles} label={text({ fi: "Päiviä viikossa", en: "Days per week", sv: "Dagar per vecka" })} value={commuteDays} min={0} max={5} suffix="" onChange={setCommuteDays} compact /><RangeField icon={Car} label={text({ fi: "Matka yhteen suuntaan", en: "One-way distance", sv: "Avstånd enkel väg" })} value={commuteKm} min={0} max={40} suffix=" km" onChange={setCommuteKm} compact /></div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <article className="rounded-[32px] bg-[#0d2e50] p-6 text-white sm:p-8">
            <p className="eyebrow !text-[#91b8df]">{text({ fi: "Arvio kuukaudessa", en: "Estimated per month", sv: "Uppskattning per månad" })}</p>
            <div className="mt-5 flex items-center gap-6">
              <div className="grid h-28 w-28 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(#55a8ff 0 ${rentShare}%, #d6e9ff ${rentShare}% 100%)` }}><div className="grid h-20 w-20 place-items-center rounded-full bg-[#0d2e50] text-center"><span><b className="block text-xl">{rentShare}%</b><small className="text-[#afc6db]">{text({ fi: "vuokra", en: "rent", sv: "hyra" })}</small></span></div></div>
              <div><p className="text-4xl font-black tracking-[-.045em] sm:text-5xl">{breakdown.total} €</p><p className="mt-2 text-sm text-[#bfd2e4]">{apartment.title}</p></div>
            </div>
            <div className="mt-8 grid gap-3 text-sm">
              <CostRow icon={Home} label={text({ fi: "Vuokra", en: "Rent", sv: "Hyra" })} value={apartment.rent} />
              <CostRow icon={Droplets} label={text({ fi: "Vesi", en: "Water", sv: "Vatten" })} value={breakdown.water} />
              <CostRow icon={Car} label={text({ fi: "Pysäköinti", en: "Parking", sv: "Parkering" })} value={breakdown.parkingCost} />
              <CostRow icon={ShowerHead} label={text({ fi: "Sauna", en: "Sauna", sv: "Bastu" })} value={breakdown.saunaCost} />
              <CostRow icon={Zap} label={text({ fi: "Sähköarvio", en: "Electricity estimate", sv: "Eluppskattning" })} value={breakdown.electricityCost} />
              <CostRow icon={BusFront} label={text({ fi: "Työmatka-arvio", en: "Commute estimate", sv: "Reseuppskattning" })} value={breakdown.commute} />
            </div>
            <div className="mt-6 border-t border-white/15 pt-5 text-sm text-[#bdd1e4]">{text({ fi: "Vuokran lisäksi", en: "Beyond rent", sv: "Utöver hyran" })} <b className="float-right text-white">+ {extras} €</b></div>
          </article>

          <article className="mt-5 rounded-[26px] bg-[#e6f6ef] p-6">
            <div className="flex items-center gap-3"><Leaf className="text-[#08705b]" /><div><p className="text-sm font-black text-[#08705b]">{text({ fi: "Energialuokka B", en: "Energy class B", sv: "Energiklass B" })}</p><p className="mt-1 text-xs text-[#4e7368]">{text({ fi: "Kohteen demo-tieto", en: "Demo property data", sv: "Demoobjektdata" })}</p></div></div>
            <Link href="/energia" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#08705b]">{text({ fi: "Katso energia ja sisäilma", en: "View energy and indoor climate", sv: "Se energi och inomhusklimat" })}<ArrowRight size={16} /></Link>
          </article>
        </aside>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#d8e2eb] bg-white p-5 text-sm leading-6 text-[#60758a]"><Info className="mt-0.5 shrink-0 text-[#0a55df]" size={18} /><p>{text({ fi: "Laskelma on suuntaa-antava demo, ei tarjous tai lasku. Tuotannossa hinnat, vesimaksut ja energiatodistus tuodaan kohdetiedoista; sähkö ja liikkuminen perustuvat käyttäjän omiin oletuksiin.", en: "This is an indicative demo calculation, not an offer or invoice. In production, prices, water fees and the energy certificate come from property data; electricity and travel use the customer's own assumptions.", sv: "Beräkningen är en riktgivande demo, inte ett erbjudande eller en faktura. I produktion hämtas priser, vattenavgifter och energicertifikat från objektdata; el och resor bygger på kundens egna antaganden." })}</p></div>
    </main>
  );
}

function RangeField({ icon: Icon, label, value, min, max, step = 1, suffix, onChange, compact = false }: { icon: typeof Droplets; label: string; value: number; min: number; max: number; step?: number; suffix: string; onChange: (value: number) => void; compact?: boolean }) {
  return <label className={`grid gap-3 text-sm font-black ${compact ? "" : "rounded-2xl bg-[#f0f5f9] p-5"}`}><span className="flex items-center gap-2"><Icon size={18} className="text-[#0a55df]" />{label}<b className="ml-auto text-[#0a55df]">{value}{suffix}</b></span><input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-[#0a55df]" /></label>;
}

function CostRow({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: number }) {
  return <div className="flex items-center gap-3 rounded-xl bg-white/7 px-4 py-3"><Icon size={16} className="text-[#72b5f5]" /><span>{label}</span><b className="ml-auto">{value} €</b></div>;
}
