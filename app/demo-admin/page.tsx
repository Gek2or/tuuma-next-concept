import { DemoAccess } from "@/components/tuuma/DemoAccess";
import type{Metadata}from"next";import{AdminDashboard}from"@/components/tuuma/AdminDashboard";export const metadata:Metadata={title:"Henkilöstönäkymä — Demo",description:"Kohdejulkaisu- ja analytiikkakonsepti henkilöstölle."};export default function Page(){return <DemoAccess role="admin"><main id="main"><AdminDashboard/></main></DemoAccess>}

