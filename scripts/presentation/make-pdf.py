from pathlib import Path
import json
import os
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public/presentation/tuuma-next-esittely.pdf'
manifest=json.loads((ROOT/'public/panoramas/manifest.json').read_text(encoding='utf-8'))
if manifest['status']!='complete' or manifest['completedPoints']!=25:
 raise ValueError('The final presentation requires all 25 panorama pairs.')
fonts=Path(os.environ.get('WINDIR','C:/Windows'))/'Fonts'
normal,bold=(fonts/'arial.ttf',fonts/'arialbd.ttf') if fonts.exists() else (Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'),Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Tuuma',str(normal)))
pdfmetrics.registerFont(TTFont('TuumaBold',str(bold)))
W,H=1120,630
c=canvas.Canvas(str(OUT),pagesize=(W,H));c.setTitle('Tuuma Next - esittely 14.9.2026');c.setAuthor('Tuuma Next Concept')
NAVY='#22264b';MUTED='#62677f'
def para(text,x,y,width,size=19,color=NAVY,bold=False):
 p=Paragraph(text,ParagraphStyle('p',fontName='TuumaBold' if bold else 'Tuuma',fontSize=size,leading=size*1.48,textColor=HexColor(color)))
 _,height=p.wrap(width,H);p.drawOn(c,x,H-y-height);return height

def photo(path,x,y,w,h):
 c.drawImage(ImageReader(str(ROOT/path)),x,H-y-h,width=w,height=h,preserveAspectRatio=True,anchor='c',mask='auto')
def start(n,title):
 c.setFillColor(HexColor('#ffffff'));c.rect(0,0,W,H,fill=1,stroke=0)
 para('TUUMA NEXT',48,30,500,12,NAVY,True)
 para('ESITTELY  /  14.9.2026',730,30,342,12,MUTED)
 para(title,48,78,1000,38,NAVY,True)
 c.setStrokeColor(HexColor('#e5e6ed'));c.line(48,48,W-48,48)
 para('Itsenäinen konseptidemo. Ei Tuuma Koditin virallinen palvelu.',48,H-34,930,10,MUTED)
 para(str(n),1040,H-34,32,10,MUTED)
def finish():c.showPage()
start(1,'Asiakkaan digitaalinen palvelu')
para('Tampuurin ja eTampuurin rinnalle',48,164,360,24)
para('Kodin etsintä, asuntoon tutustuminen ja asukkaan asiointi samassa käyttöliittymässä.',48,230,340,20)
para('Kolme konseptikotia, 25 katselupistettä ja tyhjän sekä kalustetun tilan vertailu.',48,352,340,17,MUTED)
photo('public/panoramas/C09/oh-furnished-gallery.webp',430,155,642,395);finish()
start(2,'Nykyiset palvelut säilyvät')
para('Tuuma Kodit tarjoaa jo asuntohaun, hakemuksen, huoltopyynnöt ja eTampuurin asukassivut.',48,160,985,22)
for y,a,b in [(260,'Asuntohaku ja hakemus','Ohjattu sopivuushaku, suosikit ja vertailu'),(340,'Kohdetiedot ja kuvagalleria','Kuvaparit, 360° ja pyöritettävä konseptipohja'),(420,'Asukasohjeet ja eTampuuri','Tehtävittäin ryhmitelty apu ja demoroolit')]:
 para(a,48,y,400,20,bold=True);para(b,480,y,570,20)
para('Lähteet: tuumakodit.fi ja tuumakodit.fi/kalliolinna/, tarkistettu 14.9.2026. Vertailu koskee tarkastettuja julkisia sivuja.',48,522,1024,12,MUTED)
c.linkURL('https://tuumakodit.fi/',(48,66,500,104),relative=0);finish()
start(3,'Kolme esimerkkikotia')
for x,id,label in [(48,'c09','C09  /  56,5 m²  /  2H + KK'),(399,'e15','E15  /  77 m²  /  3H + K'),(750,'f20','F20  /  92 m²  /  4H + K')]:
 photo('public/panoramas/'+id.upper()+'/oh-empty-gallery.webp',x,174,322,218);para(label,x,410,322,17,bold=True)
 c.linkURL('https://tuuma-next-concept.stasgek.chatgpt.site/kohteet/kalliolinna?asunto='+id.upper(),(x,H-450,x+322,H-174),relative=0)
para('Koot ja asuntotyypit: Tuuma Koditin huoneistoluettelo. Huonejako ja kuvat ovat konseptisuunnittelua. Vuokrat ovat esimerkkihintoja.',48,480,1024,17,MUTED)
c.linkURL('https://tuumakodit.fi/kalliolinnan-huoneistot/',(48,70,1072,143),relative=0);finish()
start(4,'Kalustuksen vertailu')
photo('public/panoramas/C09/oh-empty-gallery.webp',48,170,497,300)
photo('public/panoramas/C09/oh-furnished-gallery.webp',575,170,497,300)
para('Tyhjä',48,475,497,20,bold=True);para('Kalustettu konseptikuva',575,475,497,20,bold=True)
para('Sama kamera, tilarakenne ja valaistus. Kiinteät varusteet säilyvät tyhjässä asunnossa. Renderöityjä konseptikuvia; kalusteet eivät sisälly vuokraan.',48,519,1024,14,MUTED);finish()
start(5,'Asuntoon tutustuminen')
photo('public/panoramas/F20/porras2-furnished-gallery.webp',455,160,617,390)
para('Kuvat, 360°, pohja ja 3D löytyvät asuntosivun välilehdistä.',48,173,358,24)
para('Käännä katselusuuntaa ja siirry ovipainikkeista huoneeseen. Kalustuksen vaihto säilyttää kamerapaikan ja suunnan.',48,286,358,19,MUTED)
para('25 katselupistettä ja 50 panoraamaa. Pohja ja pyöritettävä malli täydentävät kierrosta.',48,432,358,17,MUTED)
c.linkURL('https://tuuma-next-concept.stasgek.chatgpt.site/kohteet/kalliolinna?asunto=F20',(48,82,1072,465),relative=0);finish()
start(6,'Asukkaan ja henkilöstön demoroolit')
para('OmaKoti',48,172,440,28,bold=True);para('Henkilöstö',596,172,440,28,bold=True)
para('user / 1234',48,225,440,22);para('admin / 1234',596,225,440,22)
para('Esimerkkiasukkaan tiedot ja asumisen palvelut. Sisäänkirjautuminen ja uloskirjautuminen.',48,290,440,20)
para('Kohteiden tilat ja julkaisutyön kulku. Analytiikka näyttää synteettisiä esimerkkejä.',596,290,440,20)
para('Vain demotietoja. Roolivalinta ei suojaa oikeita henkilötietoja. Pankkitunnistautuminen ja tuotantorajapinnat edellyttävät erillistä toteutusta.',48,452,1024,18,MUTED)
c.linkURL('https://tuuma-next-concept.stasgek.chatgpt.site/oma-koti',(48,160,488,440),relative=0)
c.linkURL('https://tuuma-next-concept.stasgek.chatgpt.site/demo-admin',(596,160,1036,440),relative=0);finish()
start(7,'Hyödyt arvioidaan pilotissa')
for y,title,body in [(165,'Asunnon valinta','Seurataan haun, vertailun ja hakemuksen aloituksen etenemistä.'),(280,'Asukaspalvelu','Mitataan toistuvat kysymykset ja ohjeen löytämiseen kuluva aika.'),(395,'Henkilöstön työ','Verrataan kohteen julkaisuun käytettyä aikaa ennen uutta työnkulkua ja sen jälkeen.')]:
 para(title,48,y,320,24,bold=True);para(body,410,y,640,21)
para('Säästöä ja konversion kasvua koskevat väitteet ovat testattavia oletuksia. Tässä esityksessä ei luvata tarkkoja prosentteja.',48,518,1024,15,MUTED);finish()
start(8,'Demo ja seuraava vaihe')
para('Kodin etsinnästä asuntoon ja asumisen asiointiin',48,168,1024,25,bold=True)
para('Kokeile kokonaisuutta ja arvioi, missä se auttaa asiakasta tai henkilöstöä. Vaikutukset selvitetään pilotissa.',48,230,1000,22)
para('Ennen tuotantokäyttöä vahvistetaan aidot kohdetiedot ja kuvat, tunnistautuminen, tietosuoja sekä yhteydet Tampuuriin.',48,331,1000,22)
para('Avaa interaktiivinen esittely ja kokeile toimintoja',48,458,1000,20,bold=True)
para('tuuma-next-concept.stasgek.chatgpt.site/esittely',48,497,1000,17,MUTED)
c.linkURL('https://tuuma-next-concept.stasgek.chatgpt.site/esittely',(48,95,1050,176),relative=0)
finish();c.save();print(OUT)
