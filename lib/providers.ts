import { apartments, Apartment } from "./data";
export interface PropertyProvider { list(): Promise<Apartment[]>; get(id:string): Promise<Apartment|undefined>; }
export interface ApplicationProvider { begin(apartmentId:string): Promise<{redirectUrl:string}>; }
export interface MaintenanceProvider { create(input:{topic:string;urgent:boolean}): Promise<{ticketId:string}>; }
export interface AnalyticsProvider { track(event:string, payload?:Record<string,unknown>): void; }
export class MockPropertyProvider implements PropertyProvider { async list(){return apartments;} async get(id:string){return apartments.find(a=>a.id===id);} }
export class TampuuriAdapter implements ApplicationProvider, MaintenanceProvider { async begin(apartmentId:string){return {redirectUrl:`/hae?asunto=${apartmentId}&handoff=tampuuri`};} async create(){return {ticketId:"HUOLTO-DEMO-1042"};} }
export class DemoAnalyticsProvider implements AnalyticsProvider { track(event:string,payload={}){if(typeof window!=="undefined") console.info("[Tuuma analytics]",event,payload);} }
export const providers={properties:new MockPropertyProvider(),applications:new TampuuriAdapter(),maintenance:new TampuuriAdapter(),analytics:new DemoAnalyticsProvider()};
