export type ApartmentVariant = "kalliolinna" | "asemanvalo" | "ruukinranta" | "peltokaarre" | "keravanjoen";

export type ApartmentTour = {
  living: string;
  bedroom: string;
  kitchen: string;
  startHeading?: number;
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
};

export const apartments: Apartment[] = [
  {
    id: "A12",
    title: "Kalliolinna A12",
    area: "Hyrylä",
    address: "Kalliorinteentie 8",
    rent: 790,
    size: 56.5,
    rooms: 2,
    floor: 3,
    image: "/art/kalliolinna-a12-furnished.webp",
    emptyImage: "/art/kalliolinna-a12-empty.webp",
    gallery: ["/art/kalliolinna-a12-furnished.webp", "/art/kalliolinna-a12-empty.webp", "/art/tuusula-editorial-area.webp"],
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
];
export const residentHelp = ["Asunnossa on vika","Vuokra ja maksut","Avaimet","Autopaikka","Muutto sisään","Muutto pois","Sauna","Kierrätys","Järjestyssäännöt","Lomakkeet"];
