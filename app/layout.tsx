import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/tuuma/Shell";
import { PwaRegister } from "@/components/tuuma/PwaRegister";
import { LanguageProvider } from "@/components/tuuma/LanguageProvider";
import { AssistantV2 } from "@/components/tuuma/AssistantV2";
export const metadata:Metadata={title:{default:"Tuuma Next — Digital Living Concept",template:"%s | Tuuma Next"},description:"Moderni digitaalinen asumisen palvelukonsepti — löydä koti, vertaile ja hoida asumisen asiat helposti.",manifest:"/manifest.webmanifest",robots:{index:false,follow:false},icons:{icon:"/favicon.svg"}};
export const viewport:Viewport={themeColor:"#f5f8fb",width:"device-width",initialScale:1};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){const schema={"@context":"https://schema.org","@type":"WebSite",name:"Tuuma Next — Digital Living Concept",inLanguage:["fi","en","sv"],description:"Demo of a modern digital housing service layer."};return <html lang="fi"><body><LanguageProvider><a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:bg-white focus:p-4">Siirry sisältöön</a><PwaRegister/><SiteHeader/>{children}<SiteFooter/><AssistantV2/></LanguageProvider><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/></body></html>}
