import type {Metadata} from 'next';
import {Presentation} from '@/components/tuuma/Presentation';
export const metadata:Metadata={title:'Tuuma Next · esittelyluonnos',description:'Kehitysdemon esittely ja toteutuksen tilanne.',robots:{index:false,follow:false}};
export default function Page(){return <Presentation/>}
