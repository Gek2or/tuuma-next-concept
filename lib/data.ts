import panoramas from "../public/panoramas/manifest.json" with { type: "json" };

export type ApartmentVariant = "kalliolinna" | "asemanvalo" | "ruukinranta" | "peltokaarre" | "keravanjoen";

export type ApartmentTour = {
  living: string;
  bedroom: string;
  kitchen: string;
  startHeading?: number;
};

export type RoomMedia = {
  id: string;
  label: { fi: string; en: string; sv: string };
  empty: string;
  furnished?: string;
  source: "empty-master-edit" | "concept-render" | "scene-render";
  thumbnail?: string;
  /** Single reference frames are explicitly marked instead of being presented as an empty home. */
  state?: "empty" | "furnished";
};

export type Apartment = {
  id: string;
  title: string;
  area: "Hyrylä" | "Jokela" | "Kellokoski";
  address: string;
  rent: number;
  size: number;
  rooms: number;
  floor: number;
  image: string;
  emptyImage?: string;
  gallery?: string[];
  roomMedia?: RoomMedia[];
  tour: ApartmentTour;
  variant: ApartmentVariant;
  type: string;
  available: string;
  balcony: boolean;
  sauna: boolean;
  pets: boolean;
  accessible: boolean;
  parking: boolean;
  ev: boolean;
  transport: number;
  tags: string[];
  description: string;
  standards: string[];
  materials: string[];
  /** Public unit category + original in-product model are both clear to a pitch viewer. */
  layoutLabel?: string;
  levels?: number;
  showcaseReady?: boolean;
  priceIsDemo?: boolean;
  publicSource?: string;
};

const apartmentListings: Apartment[] = [
  {
    id: "A12",
    title: "Kalliolinna A12",
    area: "Hyrylä",
    address: "Kalliorinteentie 8",
    rent: 790,
    size: 56.5,
    rooms: 2,
    floor: 3,
    image: "/art/kalliolinna-a12-empty.webp",
    emptyImage: "/art/kalliolinna-a12-empty.webp",
    gallery: ["/art/kalliolinna-a12-empty.webp", "/art/a12-living-furnished-v2.webp", "/art/a12-bedroom-empty-v2.webp", "/art/a12-bedroom-furnished-v2.webp", "/art/a12-bathroom-empty-v2.webp"],
    roomMedia: [
      { id: "living", label: { fi: "Olohuone ja keittiö", en: "Living room & kitchen", sv: "Vardagsrum och kök" }, empty: "/art/kalliolinna-a12-empty.webp", furnished: "/art/a12-living-furnished-v2.webp", source: "empty-master-edit" },
      { id: "bedroom", label: { fi: "Makuuhuone", en: "Bedroom", sv: "Sovrum" }, empty: "/art/a12-bedroom-empty-v2.webp", furnished: "/art/a12-bedroom-furnished-v2.webp", source: "empty-master-edit" },
      { id: "bathroom", label: { fi: "Kylpyhuone", en: "Bathroom", sv: "Badrum" }, empty: "/art/a12-bathroom-empty-v2.webp", source: "empty-master-edit" },
      { id: "hall", label: { fi: "Eteinen", en: "Entrance hall", sv: "Hall" }, empty: "/art/a12-hall-empty-v2.webp", source: "empty-master-edit" },
      { id: "balcony", label: { fi: "Lasitettu parveke", en: "Glazed balcony", sv: "Inglasad balkong" }, empty: "/art/a12-balcony-empty-v2.webp", furnished: "/art/a12-balcony-furnished-v2.webp", source: "empty-master-edit" },
    ],
    tour: { living: "/art/kalliolinna-living-360.webp", bedroom: "/art/kalliolinna-bedroom-360.webp", kitchen: "/art/kalliolinna-living-360.webp", startHeading: 0 },
    variant: "kalliolinna",
    type: "Kerrostalo",
    available: "Vapaa 1.10.",
    balcony: true,
    sauna: false,
    pets: true,
    accessible: true,
    parking: true,
    ev: true,
    transport: 8,
    tags: ["Lemmikit sallittu", "Esteetön", "EV-lataus"],
    description: "Rauhallinen länteen avautuva kaksio, jossa avokeittiö jatkaa suoraan olohuoneeseen ja lasitettu parveke tuo päivänvalon syvälle kotiin.",
    standards: ["Esteetön sisäänkäynti ja hissi", "Kylpyhuoneessa pesutorni-varaus", "10 Mbit/s internet sisältyy vuokraan"],
    materials: ["Vaalea tammi", "Himmeä savunsininen", "Mattalakattu koivu"],
  },
  {
    id: "B24",
    title: "Asemanvalo B24",
    area: "Jokela",
    address: "Opintie 4",
    rent: 865,
    size: 68,
    rooms: 3,
    floor: 4,
    image: "/art/asemanvalo-b24-furnished.webp",
    emptyImage: "/art/asemanvalo-b24-empty.webp",
    gallery: ["/art/asemanvalo-b24-furnished.webp", "/art/asemanvalo-b24-empty.webp", "/art/jokela-editorial-area.webp"],
    tour: { living: "/art/asemanvalo-b24-360.webp", bedroom: "/art/asemanvalo-b24-360.webp", kitchen: "/art/asemanvalo-b24-360.webp", startHeading: -0.22 },
    variant: "asemanvalo",
    type: "Kerrostalo",
    available: "Heti vapaa",
    balcony: true,
    sauna: true,
    pets: true,
    accessible: false,
    parking: true,
    ev: false,
    transport: 4,
    tags: ["Juna lähellä", "Oma sauna", "Perheelle"],
    description: "Kolmio Jokelan aseman tuntumassa. Keittiön ja ruokailun ympärille rakentuu joustava arki perheelle tai etätyötä tekevälle.",
    standards: ["Juna-asema noin 4 minuutin päässä", "Asuntokohtainen sauna", "Lasitettu parveke syys- ja kevätkaudelle"],
    materials: ["Hunajakenno-tammi", "Terrakotta", "Koivuvaneri"],
  },
  {
    id: "A14",
    title: "Kalliolinna A14",
    area: "Hyrylä",
    address: "Kalliorinteentie 8",
    rent: 865,
    size: 68,
    rooms: 3,
    floor: 3,
    image: "/art/kalliolinna-a14-furnished.webp",
    emptyImage: "/art/kalliolinna-a14-empty.webp",
    gallery: ["/art/kalliolinna-a14-furnished.webp", "/art/kalliolinna-a14-empty.webp", "/art/tuusula-editorial-area.webp"],
    tour: { living: "/art/kalliolinna-a14-360.webp", bedroom: "/art/kalliolinna-a14-360.webp", kitchen: "/art/kalliolinna-a14-360.webp", startHeading: -0.28 },
    variant: "kalliolinna",
    type: "Kerrostalo",
    available: "Vapaa 15.10.",
    balcony: true,
    sauna: false,
    pets: true,
    accessible: true,
    parking: true,
    ev: true,
    transport: 8,
    tags: ["Työhuone", "Länsiparveke", "EV-lataus"],
    description: "Joustava kolmio, jonka toinen huone toimii lastenhuoneena, työtilana tai rauhallisena vierashuoneena.",
    standards: ["Muuntojoustava 3H + KT", "Länteen avautuva lasitettu parveke", "Hissi ja esteetön kulku"],
    materials: ["Vaalea saarni", "Pellavabeige", "Himmeä sininen"],
  },
  {
    id: "C07",
    title: "Ruukinranta C07",
    area: "Kellokoski",
    address: "Ruukinkuja 12",
    rent: 675,
    size: 44,
    rooms: 2,
    floor: 1,
    image: "/art/ruukinranta-c07-furnished.webp",
    emptyImage: "/art/ruukinranta-c07-empty.webp",
    gallery: ["/art/ruukinranta-c07-furnished.webp", "/art/ruukinranta-c07-empty.webp", "/art/kellokoski-editorial-area.webp"],
    tour: { living: "/art/ruukinranta-c07-360.webp", bedroom: "/art/ruukinranta-c07-360.webp", kitchen: "/art/ruukinranta-c07-360.webp", startHeading: 0.24 },
    variant: "ruukinranta",
    type: "Rivitalo",
    available: "Vapaa 15.9.",
    balcony: false,
    sauna: false,
    pets: true,
    accessible: true,
    parking: true,
    ev: false,
    transport: 14,
    tags: ["Oma piha", "Luonnon lähellä", "Esteetön"],
    description: "Kompakti, esteetön koti joen ja ruukkimiljöön lähellä. Olohuoneen leveä ikkuna avautuu omaan vihreään pihaan.",
    standards: ["Matalan kynnyksen kulku ja oma sisäänkäynti", "Pihapaikka lähellä ovea", "Luonnonvalo ja näkymä Keravanjoelle"],
    materials: ["Pystypaneeli mänty", "Sammalenvihreä", "Luonnonvärinen pellava"],
  },
  {
    id: "A31",
    title: "Kalliolinna A31",
    area: "Hyrylä",
    address: "Kalliorinteentie 8",
    rent: 1040,
    size: 78,
    rooms: 4,
    floor: 5,
    image: "/art/kalliolinna-a31-furnished.webp",
    emptyImage: "/art/kalliolinna-a31-empty.webp",
    gallery: ["/art/kalliolinna-a31-furnished.webp", "/art/kalliolinna-a31-empty.webp", "/art/tuusula-editorial-area.webp"],
    tour: { living: "/art/kalliolinna-a31-360.webp", bedroom: "/art/kalliolinna-a31-360.webp", kitchen: "/art/kalliolinna-a31-360.webp", startHeading: 0.4 },
    variant: "kalliolinna",
    type: "Kerrostalo",
    available: "Vapaa 1.11.",
    balcony: true,
    sauna: true,
    pets: true,
    accessible: true,
    parking: true,
    ev: true,
    transport: 8,
    tags: ["Perheasunto", "Oma sauna", "Lasitettu parveke"],
    description: "Tilava viides kerros perheelle: kolme makuuhuonetta, oma sauna ja näkymä Kalliolinnan puistoon.",
    standards: ["Energiatehokas ulkovaippa", "Oma sauna ja pesutorni", "Lämmin autopaikka / EV-varaus"],
    materials: ["Pähkinä", "Syvä sinivihreä", "Harjattu teräs"],
  },
  {
    id: "D18",
    title: "Peltokaarre D18",
    area: "Jokela",
    address: "Veturitie 16",
    rent: 620,
    size: 35.5,
    rooms: 1,
    floor: 2,
    image: "/art/peltokaarre-d18-furnished.webp",
    emptyImage: "/art/peltokaarre-d18-empty.webp",
    gallery: ["/art/peltokaarre-d18-furnished.webp", "/art/peltokaarre-d18-empty.webp", "/art/jokela-editorial-area.webp"],
    tour: { living: "/art/peltokaarre-d18-360.webp", bedroom: "/art/peltokaarre-d18-360.webp", kitchen: "/art/peltokaarre-d18-360.webp", startHeading: 1.1 },
    variant: "peltokaarre",
    type: "Kerrostalo",
    available: "Heti vapaa",
    balcony: true,
    sauna: false,
    pets: false,
    accessible: true,
    parking: false,
    ev: false,
    transport: 6,
    tags: ["Kompakti", "Parveke", "Aseman lähellä"],
    description: "Helppohoitoinen yksiö, jossa parveke jatkaa oleskelutilaa ja aseman palvelut ovat lyhyen pyörämatkan päässä.",
    standards: ["Kompakti märkätila", "Selkeä esteetön kulkureitti", "Huoneistokohtainen ilmanvaihto"],
    materials: ["Vaalea koivu", "Pilvensininen", "Mustat yksityiskohdat"],
  },
  {
    id: "E05",
    title: "Keravanjoen piha E05",
    area: "Kellokoski",
    address: "Rantatie 3",
    rent: 920,
    size: 72,
    rooms: 3,
    floor: 1,
    image: "/art/keravanjoen-e05-furnished.webp",
    emptyImage: "/art/keravanjoen-e05-empty.webp",
    gallery: ["/art/keravanjoen-e05-furnished.webp", "/art/keravanjoen-e05-empty.webp", "/art/kellokoski-editorial-area.webp"],
    tour: { living: "/art/keravanjoen-e05-360.webp", bedroom: "/art/keravanjoen-e05-360.webp", kitchen: "/art/keravanjoen-e05-360.webp", startHeading: -0.7 },
    variant: "keravanjoen",
    type: "Rivitalo",
    available: "Vapaa 1.10.",
    balcony: false,
    sauna: true,
    pets: true,
    accessible: false,
    parking: true,
    ev: true,
    transport: 12,
    tags: ["Oma piha", "EV-lataus", "Oma sauna"],
    description: "Kolmio rauhallisessa rivitalopihassa. Sauna ja jokirannan ulkoilureitit tekevät kodista viikonlopun tukikohdan.",
    standards: ["Oma piha ja lämmin varasto", "Asuntokohtainen sauna", "EV-latausvalmius pihapaikalla"],
    materials: ["Luonnonmänty", "Harmaansininen", "Kivitason mattapinta"],
  },
  {
    id: "C09",
    title: "Kalliolinna C09",
    area: "Hyrylä",
    address: "Mahlamäentie 14 C, 04300 Tuusula",
    rent: 990,
    size: 56.5,
    rooms: 2,
    floor: 1,
    image: "/art/kalliolinna-c09-exterior.webp",
    emptyImage: "/art/kalliolinna-c09-empty.webp",
    gallery: ["/art/kalliolinna-c09-exterior.webp", "/art/kalliolinna-c09-empty.webp", "/art/kalliolinna-c09-furnished.webp"],
    roomMedia: [
      { id: "exterior", label: { fi: "Julkisivu ja oma terassi", en: "Exterior & private terrace", sv: "Fasad och egen terrass" }, empty: "/art/kalliolinna-c09-exterior.webp", source: "empty-master-edit" },
      { id: "living", label: { fi: "Olohuone ja keittiö", en: "Living room & kitchen", sv: "Vardagsrum och kök" }, empty: "/art/kalliolinna-c09-empty.webp", furnished: "/art/kalliolinna-c09-furnished.webp", source: "empty-master-edit" },
    ],
    tour: { living: "/art/kalliolinna-c09-furnished.webp", bedroom: "/art/kalliolinna-c09-empty.webp", kitchen: "/art/kalliolinna-c09-furnished.webp", startHeading: 0 },
    variant: "kalliolinna",
    type: "Rivitalo",
    available: "Konseptiesimerkki · ei reaaliaikaista saatavuutta",
    balcony: false,
    sauna: false,
    pets: true,
    accessible: true,
    parking: true,
    ev: true,
    transport: 8,
    tags: ["Konseptiesimerkki", "Lemmikit sallittu", "3D + 360°"],
    description: "Mahlamäentie 14 C:n julkiseen asuntotyyppiin pohjautuva alkuperäinen 2H+KK-konseptimalli. Oma terassi, selkeä arjen säilytys ja olohuoneeseen jatkuva keittiö tekevät tilasta helposti hahmotettavan myös puhelimella.",
    standards: ["Huoneistokohtainen ilmanvaihto", "Vesikiertoinen lattialämmitys", "50 Mbit/s laajakaista sisältyy vuokraan"],
    materials: ["Vaalea tammi", "Mattalakattu koivu", "Himmeä savunsininen"],
    layoutLabel: "2H + KK",
    levels: 1,
    showcaseReady: true,
    priceIsDemo: true,
    publicSource: "https://tuumakodit.fi/kalliolinna/",
  },
  {
    id: "E15",
    title: "Kalliolinna E15",
    area: "Hyrylä",
    address: "Mahlamäentie 14 E, 04300 Tuusula",
    rent: 1270.5,
    size: 77,
    rooms: 3,
    floor: 1,
    image: "/art/kalliolinna-e15-exterior.webp",
    emptyImage: "/art/kalliolinna-e15-empty.webp",
    gallery: ["/art/kalliolinna-e15-exterior.webp", "/art/kalliolinna-e15-empty.webp", "/art/kalliolinna-e15-living.webp"],
    roomMedia: [
      { id: "exterior", label: { fi: "Julkisivu ja oma piha", en: "Exterior & private yard", sv: "Fasad och egen gård" }, empty: "/art/kalliolinna-e15-exterior.webp", source: "empty-master-edit" },
      { id: "living", label: { fi: "Olohuone, keittiö ja portaat", en: "Living room, kitchen & stairs", sv: "Vardagsrum, kök och trappa" }, empty: "/art/kalliolinna-e15-empty.webp", furnished: "/art/kalliolinna-e15-living.webp", source: "empty-master-edit" },
    ],
    tour: { living: "/art/kalliolinna-e15-living.webp", bedroom: "/art/kalliolinna-e15-living.webp", kitchen: "/art/kalliolinna-e15-living.webp", startHeading: -0.15 },
    variant: "kalliolinna",
    type: "Rivitalo",
    available: "Konseptiesimerkki · ei reaaliaikaista saatavuutta",
    balcony: false,
    sauna: false,
    pets: true,
    accessible: false,
    parking: true,
    ev: true,
    transport: 8,
    tags: ["Konseptiesimerkki", "2 tasoa", "Oma piha"],
    description: "Mahlamäentie 14 E:n julkiseen 3H+K-tyyppiin pohjautuva kaksitasoinen digital-twin-konsepti. Alempi taso kokoaa yhteisen arjen, ylempi taso keskittyy lepoon, pesutiloihin ja säilytykseen.",
    standards: ["Huoneistokohtainen ilmanvaihto", "Savuton kohde", "Hidas EV-lataus 3,6 kW"],
    materials: ["Vaalea tammi", "Pellavabeige", "Himmeä sininen"],
    layoutLabel: "3H + K",
    levels: 2,
    showcaseReady: true,
    priceIsDemo: true,
    publicSource: "https://tuumakodit.fi/kalliolinna/",
  },
  {
    id: "F20",
    title: "Kalliolinna F20",
    area: "Hyrylä",
    address: "Mahlamäentie 14 F, 04300 Tuusula",
    rent: 1490,
    size: 92,
    rooms: 4,
    floor: 1,
    image: "/art/kalliolinna-f20-exterior.webp",
    emptyImage: "/art/kalliolinna-f20-empty.webp",
    gallery: ["/art/kalliolinna-f20-exterior.webp", "/art/kalliolinna-f20-empty.webp", "/art/kalliolinna-f20-living.webp", "/art/kalliolinna-f20-master-bedroom.webp", "/art/kalliolinna-f20-family-bedroom.webp"],
    roomMedia: [
      { id: "exterior", label: { fi: "Julkisivu ja oma terassi", en: "Exterior & private terrace", sv: "Fasad och egen terrass" }, empty: "/art/kalliolinna-f20-exterior.webp", source: "empty-master-edit" },
      { id: "living", label: { fi: "Olohuone, keittiö ja portaat", en: "Living room, kitchen & stairs", sv: "Vardagsrum, kök och trappa" }, empty: "/art/kalliolinna-f20-empty.webp", furnished: "/art/kalliolinna-f20-living.webp", source: "empty-master-edit" },
      { id: "master", label: { fi: "Päämakuuhuone · konseptisisustus", en: "Main bedroom · concept furnishing", sv: "Huvudsovrum · konceptinredning" }, empty: "/art/kalliolinna-f20-master-bedroom.webp", source: "concept-render", state: "furnished" },
      { id: "family", label: { fi: "Perheen makuuhuone · konseptisisustus", en: "Family bedroom · concept furnishing", sv: "Familjesovrum · konceptinredning" }, empty: "/art/kalliolinna-f20-family-bedroom.webp", source: "concept-render", state: "furnished" },
    ],
    tour: { living: "/art/kalliolinna-f20-living.webp", bedroom: "/art/kalliolinna-f20-living.webp", kitchen: "/art/kalliolinna-f20-living.webp", startHeading: .18 },
    variant: "kalliolinna",
    type: "Rivitalo",
    available: "Konseptiesimerkki · ei reaaliaikaista saatavuutta",
    balcony: false,
    sauna: false,
    pets: true,
    accessible: false,
    parking: true,
    ev: true,
    transport: 8,
    tags: ["Konseptiesimerkki", "4H + K", "Perheelle"],
    description: "Mahlamäentie 14 F:n julkiseen 4H+K-tyyppiin pohjautuva alkuperäinen perhekodin konseptimalli. Kaksi tasoa, kolme makuuhuonetta ja väljät yhteiset tilat näytetään yhdellä piirustus–3D–kierrosketjulla.",
    standards: ["Vesikiertoinen lattialämmitys", "iLOQ-lukitus", "Lemmikit tervetulleita"],
    materials: ["Vaalea tammi", "Sammalenvihreä", "Harjattu teräs"],
    layoutLabel: "4H + K",
    levels: 2,
    showcaseReady: true,
    priceIsDemo: true,
    publicSource: "https://tuumakodit.fi/kalliolinna/",
  },
];
export const apartments: Apartment[] = apartmentListings.map(apartment => {
  const home = panoramas.apartments.find(item => item.id === apartment.id);
  if (!home) return apartment;
  const living = home.points.find(point => point.id === "oh")!;
  return {
    ...apartment,
    image: living.images.empty.gallery,
    emptyImage: living.images.empty.gallery,
    gallery: home.points.map(point => point.images.empty.gallery),
    roomMedia: home.points.map(point => ({
      id: point.id,
      label: point.labels,
      empty: point.images.empty.gallery,
      furnished: point.images.furnished.gallery,
      thumbnail: point.images.empty.thumbnail,
      source: "scene-render" as const,
    })),
  };
});

export const residentHelp = ["Asunnossa on vika","Vuokra ja maksut","Avaimet","Autopaikka","Muutto sisään","Muutto pois","Sauna","Kierrätys","Järjestyssäännöt","Lomakkeet"];
