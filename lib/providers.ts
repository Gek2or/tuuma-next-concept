import { apartments, Apartment } from "./data";
export interface PropertyProvider { list(): Promise<Apartment[]>; get(id:string): Promise<Apartment|undefined>; }
export interface ApplicationProvider { begin(apartmentId:string): Promise<{redirectUrl:string}>; applicationStatus(applicationId:string): Promise<{stage:string;validUntil:string;missing:string[]}>; }
export interface MaintenanceProvider { create(input:{topic:string;urgent:boolean;masterKey?:boolean}): Promise<{ticketId:string}>; maintenanceStatus(ticketId:string): Promise<{stage:string;estimatedVisit?:string}>; }
export interface AnalyticsProvider { track(event:string, payload?:Record<string,unknown>): void; }
export interface ResidentProvider { overview(): Promise<{homeId:string;openBalance:number;notices:number}>; }
export interface BookingProvider { reserve(input:{resource:string;slot:string}): Promise<{bookingId:string}>; }
export interface NotificationProvider { saveSearch(input:{area:string;rooms:string;maxRent:number;features:string[]}): Promise<{alertId:string}>; }
export interface EnergyProvider { current(homeId:string): Promise<{temperature:number;humidity:number;co2:number;energyClass:string}>; }
/** Decouples the visitor UI from the capture vendor (Matterport, 360 camera,
 * render pipeline, or a future Tampuuri-linked media service). */
export interface PanoramaProvider { rooms(homeId:string): Promise<Array<{room:"living"|"kitchen"|"bedroom";src:string;resolution:"demo"|"6k"|"8k"}>>; }
export class MockPropertyProvider implements PropertyProvider { async list(){return apartments;} async get(id:string){return apartments.find(a=>a.id===id);} }
export class TampuuriAdapter implements ApplicationProvider, MaintenanceProvider { async begin(apartmentId:string){return {redirectUrl:`/hae?asunto=${apartmentId}&handoff=tampuuri`};} async applicationStatus(){return {stage:"review",validUntil:"2026-09-22",missing:["income-proof"]};} async create(){return {ticketId:"HUOLTO-DEMO-1042"};} async maintenanceStatus(){return {stage:"triaged",estimatedVisit:"tomorrow 10–12"};} }
export class MockLivingProvider implements ResidentProvider, BookingProvider, NotificationProvider, EnergyProvider { async overview(){return {homeId:"A12",openBalance:0,notices:2};} async reserve(){return {bookingId:"BOOK-DEMO-88"};} async saveSearch(){return {alertId:"ALERT-DEMO-31"};} async current(){return {temperature:21.4,humidity:41,co2:690,energyClass:"B"};} }
export class MockPanoramaProvider implements PanoramaProvider { async rooms(homeId:string){const home=apartments.find(item=>item.id===homeId)??apartments[0];return (["living","kitchen","bedroom"] as const).map(room=>({room,src:home.tour[room],resolution:"demo" as const}));} }
export class DemoAnalyticsProvider implements AnalyticsProvider { track(event:string,payload={}){if(typeof window!=="undefined") console.info("[Tuuma analytics]",event,payload);} }
const tampuuri=new TampuuriAdapter();
const living=new MockLivingProvider();
export const providers={properties:new MockPropertyProvider(),applications:tampuuri,maintenance:tampuuri,resident:living,bookings:living,notifications:living,energy:living,panoramas:new MockPanoramaProvider(),analytics:new DemoAnalyticsProvider()};
