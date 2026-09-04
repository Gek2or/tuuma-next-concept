import type {Metadata} from "next";import {ApartmentSearch} from "@/components/tuuma/ApartmentSearch";
export const metadata:Metadata={title:"Vapaat kodit",description:"Etsi ja vertaile demoasuntoja Hyrylässä, Jokelassa ja Kellokoskella."};
export default function Page(){return <main id="main"><ApartmentSearch/></main>}

