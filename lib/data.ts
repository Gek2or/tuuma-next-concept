export type Apartment = {
  id:string; title:string; area:"Hyrylä"|"Jokela"|"Kellokoski"; address:string; rent:number; size:number; rooms:number; floor:number;
  image:string; type:string; available:string; balcony:boolean; sauna:boolean; pets:boolean; accessible:boolean; parking:boolean; ev:boolean; transport:number; tags:string[];
};

export const apartments: Apartment[] = [
 {id:"A12",title:"Kalliolinna A12",area:"Hyrylä",address:"Kalliorinteentie 8",rent:790,size:56.5,rooms:2,floor:3,image:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=82",type:"Kerrostalo",available:"Vapaa 1.10.",balcony:true,sauna:false,pets:true,accessible:true,parking:true,ev:true,transport:8,tags:["Lemmikit sallittu","Esteetön","EV-lataus"]},
 {id:"B24",title:"Asemanvalo B24",area:"Jokela",address:"Opintie 4",rent:865,size:68,rooms:3,floor:4,image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=82",type:"Kerrostalo",available:"Heti vapaa",balcony:true,sauna:true,pets:true,accessible:false,parking:true,ev:false,transport:4,tags:["Juna lähellä","Oma sauna","Perheelle"]},
 {id:"C07",title:"Ruukinranta C07",area:"Kellokoski",address:"Ruukinkuja 12",rent:675,size:44,rooms:2,floor:1,image:"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=82",type:"Rivitalo",available:"Vapaa 15.9.",balcony:false,sauna:false,pets:true,accessible:true,parking:true,ev:false,transport:14,tags:["Oma piha","Luonnon lähellä","Esteetön"]},
 {id:"A31",title:"Kalliolinna A31",area:"Hyrylä",address:"Kalliorinteentie 8",rent:1040,size:78,rooms:4,floor:5,image:"https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=1400&q=82",type:"Kerrostalo",available:"Vapaa 1.11.",balcony:true,sauna:true,pets:true,accessible:true,parking:true,ev:true,transport:8,tags:["Perheasunto","Oma sauna","Lasitettu parveke"]},
 {id:"D18",title:"Peltokaarre D18",area:"Jokela",address:"Veturitie 16",rent:620,size:35.5,rooms:1,floor:2,image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=82",type:"Kerrostalo",available:"Heti vapaa",balcony:true,sauna:false,pets:false,accessible:true,parking:false,ev:false,transport:6,tags:["Kompakti","Parveke","Aseman lähellä"]},
 {id:"E05",title:"Keravanjoen piha E05",area:"Kellokoski",address:"Rantatie 3",rent:920,size:72,rooms:3,floor:1,image:"https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=82",type:"Rivitalo",available:"Vapaa 1.10.",balcony:false,sauna:true,pets:true,accessible:false,parking:true,ev:true,transport:12,tags:["Oma piha","EV-lataus","Oma sauna"]}
];
export const residentHelp = ["Asunnossa on vika","Vuokra ja maksut","Avaimet","Autopaikka","Muutto sisään","Muutto pois","Sauna","Kierrätys","Järjestyssäännöt","Lomakkeet"];

