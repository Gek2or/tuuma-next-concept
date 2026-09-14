"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
type Role = "user" | "admin";
const key = "tuuma-demo-role";
/** Synthetic presentation role switch; never an authentication boundary for real data. */
export function DemoAccess({ role, children }: { role: Role; children: ReactNode }) {
  const { text } = useLanguage();
  const [session, setSession] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { const saved = sessionStorage.getItem(key); setSession(saved === "user" || saved === "admin" ? saved : null); setReady(true); }, []);
  function logout() { sessionStorage.removeItem(key); setSession(null); setPassword(""); setError(""); }
  if (!ready) return <div className="shell min-h-64 py-16" role="status">{text({fi:"Avataan demoa…",en:"Opening demo…",sv:"Öppnar demon…"})}</div>;
  if (session === role) return <><div className="shell flex flex-wrap items-center justify-between gap-3 border-b py-4 text-sm"><p><b>DEMO · {role === "admin" ? "Admin" : "OmaKoti"}</b> · {text({fi:"Vain esimerkkitietoja",en:"Synthetic data only",sv:"Endast exempeldata"})}</p><button className="min-h-11 rounded-full border px-5 font-bold" onClick={logout}>{text({fi:"Kirjaudu ulos",en:"Sign out",sv:"Logga ut"})}</button></div>{children}</>;
  return <main id="main" className="shell py-12 sm:py-20"><div className="mx-auto max-w-md rounded-3xl border border-[#d8dae5] bg-white p-6 sm:p-9"><p className="eyebrow">CONCEPT / DEMO</p><h1 className="mt-4 text-3xl font-bold text-[#22264b]">{role === "admin" ? text({fi:"Henkilöstön demo",en:"Staff demo",sv:"Personaldemo"}) : "OmaKoti"}</h1><p className="mt-4 text-sm leading-6 text-[#62677f]">{text({fi:"Kokeile palvelua esimerkkitiedoilla. Tämä ei ole pankkitunnistautuminen eikä oikea asukastili.",en:"Explore with synthetic data. This is not bank identification or a real resident account.",sv:"Prova tjänsten med exempeldata. Detta är inte bankidentifiering eller ett riktigt boendekonto."})}</p>
    {session && <p className="mt-4 rounded-xl bg-[#fff2d3] p-3 text-sm">{text({fi:"Vaihda tähän demorooliin kirjautumalla alla.",en:"Sign in below to switch to this demo role.",sv:"Logga in nedan för att byta till denna demoroll."})}</p>}
    <form className="mt-6 space-y-4" onSubmit={event => { event.preventDefault(); if (name.trim().toLowerCase() === role && password === "1234") { sessionStorage.setItem(key, role); setSession(role); setError(""); setPassword(""); } else setError(text({fi:"Tarkista demon käyttäjätunnus ja salasana.",en:"Check the demo username and password.",sv:"Kontrollera demons användarnamn och lösenord."})); }}>
      <label className="block text-sm font-semibold">{text({fi:"Käyttäjätunnus",en:"Username",sv:"Användarnamn"})}<input autoComplete="off" required value={name} onChange={e=>setName(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border px-4" /></label>
      <label className="block text-sm font-semibold">{text({fi:"Salasana",en:"Password",sv:"Lösenord"})}<input type="password" autoComplete="off" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border px-4" /></label>
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      <button className="showcase-primary w-full" type="submit">{text({fi:"Avaa demo",en:"Open demo",sv:"Öppna demo"})}</button>
    </form><p className="mt-4 rounded-xl bg-[#f3f4f8] p-3 text-sm">Demo: <b>{role} / 1234</b></p><Link className="mt-4 flex min-h-11 items-center text-sm font-semibold underline" href={role === "admin" ? "/oma-koti" : "/demo-admin"}>{role === "admin" ? text({fi:"Asukkaan demo",en:"Resident demo",sv:"Boendedemo"}) : text({fi:"Henkilöstön demo",en:"Staff demo",sv:"Personaldemo"})}</Link>
  </div></main>;
}
