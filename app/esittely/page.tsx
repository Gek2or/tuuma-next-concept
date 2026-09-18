import type {Metadata} from 'next';
import {Presentation} from '@/components/tuuma/Presentation';
export const metadata:Metadata={title:'Tuuma Next · esittely',description:'Kokeile kodin etsintää, konseptiasuntojen 360°-kierroksia ja asioinnin demoroolien näkymiä.',robots:{index:false,follow:false}};
export default function Page(){return <Presentation/>}
