import { CONTACT_EMAIL, OPERATOR_NAME, SITE_NAME } from "@/lib/site";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "introducere",
    title: "1. Introducere",
    paragraphs: [
      `Prezentele Termeni și condiții („Termenii”) reglementează accesul și utilizarea site-ului web și a serviciilor oferite sub denumirea ${SITE_NAME}, operate de ${OPERATOR_NAME} („Operatorul”, „noi”).`,
      "Prin accesarea site-ului, descărcarea aplicației mobile sau utilizarea serviciilor, confirmați că ați citit și acceptați acești Termeni. Dacă nu sunteți de acord, vă rugăm să nu utilizați serviciile.",
    ],
  },
  {
    id: "definitii",
    title: "2. Definiții",
    paragraphs: [
      `„Serviciul” înseamnă platforma ${SITE_NAME}, inclusiv site-ul web, aplicația mobilă, codurile QR, cupoanele, postările pentru clienți, funcțiile de marketing affiliat și statisticile de scanări.`,
      "„Utilizator” înseamnă orice persoană fizică sau juridică care accesează site-ul, creează cont în aplicație sau utilizează coduri QR generate prin platformă.",
      "„Firmă” înseamnă utilizatorul care își înregistrează datele comerciale și generează coduri QR pentru clienți.",
    ],
  },
  {
    id: "serviciu",
    title: "3. Descrierea serviciului",
    paragraphs: [
      `${SITE_NAME} permite firmelor să creeze și să distribuie coduri QR asociate ofertelor sau mesajelor pentru clienți, să urmărească scanările și să gestioneze informațiile de contact afișate public pe paginile generate de coduri.`,
      "Operatorul poate modifica, suspenda sau îmbunătăți funcționalitățile serviciului, cu informarea utilizatorilor prin site sau aplicație, atunci când modificările sunt semnificative.",
    ],
  },
  {
    id: "utilizare",
    title: "4. Utilizare acceptabilă",
    paragraphs: [
      "Vă obligați să utilizați serviciul în mod legal, să nu publicați conținut înșelător, discriminatoriu, ilegal sau care încalcă drepturile terților.",
      "Este interzisă utilizarea serviciului pentru spam, colectare neautorizată de date personale, atacuri asupra infrastructurii sau orice activitate care poate afecta disponibilitatea platformei.",
      "Operatorul își rezervă dreptul de a restricționa sau închide conturi care încalcă acești Termeni.",
    ],
  },
  {
    id: "conturi",
    title: "5. Conturi și aplicația mobilă",
    paragraphs: [
      "Pentru funcții complete este necesar un cont în aplicația mobilă. Sunteți responsabil pentru confidențialitatea credențialelor și pentru activitatea desfășurată din contul dvs.",
      "Datele firmă (nume, descriere, logo, website etc.) afișate pe paginile publice ale codurilor QR sunt furnizate de dvs. și trebuie să fie exacte și actualizate.",
    ],
  },
  {
    id: "proprietate",
    title: "6. Proprietate intelectuală",
    paragraphs: [
      `Mărcile, logo-urile, interfața și conținutul original al ${SITE_NAME} aparțin Operatorului sau licențiatorilor săi. Nu este permisă copierea sau reutilizarea fără acord scris.`,
      "Conținutul pe care îl încărcați (texte, imagini, oferte) rămâne al dvs.; ne acordați o licență limitată de a-l afișa și procesa în scopul furnizării serviciului.",
    ],
  },
  {
    id: "raspundere",
    title: "7. Limitarea răspunderii",
    paragraphs: [
      "Serviciul este furnizat „ca atare”. Operatorul nu garantează că platforma va fi neîntreruptă sau lipsită de erori.",
      "În măsura permisă de lege, Operatorul nu răspunde pentru pierderi indirecte, pierderi de profit sau daune rezultate din utilizarea codurilor QR de către terți, din conținutul publicat de Utilizatori sau din indisponibilitatea temporară a serviciului.",
      "Relația comercială dintre Firmă și clienții săi (oferte, prețuri, reduceri) este exclusiv responsabilitatea Firmei.",
    ],
  },
  {
    id: "reziliere",
    title: "8. Reziliere",
    paragraphs: [
      "Puteți înceta utilizarea serviciului oricând, prin ștergerea contului sau încetarea accesului la aplicație, conform instrucțiunilor din aplicație sau prin solicitare la adresa de contact.",
      "Operatorul poate suspenda accesul în caz de încălcare a Termenilor sau din motive tehnice sau legale.",
    ],
  },
  {
    id: "modificari",
    title: "9. Modificări ale Termenilor",
    paragraphs: [
      "Putem actualiza acești Termeni. Versiunea actuală este publicată pe această pagină, cu data ultimei actualizări indicată mai jos. Utilizarea continuă a serviciului după publicarea modificărilor constituie acceptarea noilor Termeni.",
    ],
  },
  {
    id: "lege",
    title: "10. Lege aplicabilă",
    paragraphs: [
      "Acești Termeni sunt guvernați de legislația română. Orice litigiu se soluționează pe cale amiabilă, iar în lipsa acordului, de instanțele competente din România.",
    ],
  },
  {
    id: "contact",
    title: "11. Contact",
    paragraphs: [
      `Pentru întrebări legate de acești Termeni: ${CONTACT_EMAIL}. Operator: ${OPERATOR_NAME}.`,
    ],
  },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "operator",
    title: "1. Operatorul de date",
    paragraphs: [
      `Operatorul datelor cu caracter personal este ${OPERATOR_NAME}, care administrează platforma ${SITE_NAME}.`,
      `Contact pentru protecția datelor: ${CONTACT_EMAIL}.`,
    ],
  },
  {
    id: "date",
    title: "2. Ce date prelucrăm",
    paragraphs: [
      "Prin formularul de contact de pe site: nume, adresă de email, număr de telefon și conținutul mesajului.",
      "În aplicația mobilă și contul Firmă: date de identificare și autentificare (ex. email asociat contului Google), date de profil firmă (nume, telefon, descriere, website, logo), coduri QR, statistici de scanări și mesaje asociate campaniilor.",
      "La accesarea paginilor publice ale codurilor QR: date tehnice minime (ex. înregistrarea unei scanări, dată/oră) necesare funcționării serviciului.",
      "Nu vindem datele personale către terți.",
    ],
  },
  {
    id: "scopuri",
    title: "3. Scopurile prelucrării",
    paragraphs: [
      "Răspuns la solicitările trimise prin formularul de contact.",
      "Furnizarea și administrarea conturilor, codurilor QR și statisticilor.",
      "Îmbunătățirea securității și funcționării platformei.",
      "Respectarea obligațiilor legale aplicabile.",
    ],
  },
  {
    id: "temei",
    title: "4. Temeiul legal (GDPR)",
    paragraphs: [
      "Art. 6 alin. (1) lit. b GDPR — executarea măsurilor precontractuale / contractului (utilizarea serviciului).",
      "Art. 6 alin. (1) lit. f GDPR — interes legitim (securitate, funcționare site, răspuns la solicitări).",
      "Art. 6 alin. (1) lit. a GDPR — consimțământ, acolo unde îl solicitați explicit (ex. bifarea acordului la trimiterea formularului de contact).",
    ],
  },
  {
    id: "durata",
    title: "5. Durata stocării",
    paragraphs: [
      "Mesajele de contact sunt păstrate cât este necesar pentru soluționarea solicitării și eventuale relații comerciale ulterioare, apoi șterse sau arhivate conform politicii interne, dacă nu există obligație legală de păstrare mai lungă.",
      "Datele contului Firmă sunt păstrate pe durata utilizării serviciului și pentru o perioadă rezonabilă după închiderea contului, pentru rezolvarea eventualelor litigii.",
    ],
  },
  {
    id: "destinatari",
    title: "6. Destinatari și transferuri",
    paragraphs: [
      "Datele sunt stocate pe infrastructura controlată de Operator (server propriu / furnizori de hosting). Accesul este limitat la personalul și subcontractanții necesari operării serviciului.",
      "Autentificarea poate utiliza servicii Google (Firebase) conform politicilor Google, în măsura în care utilizați autentificarea Google în aplicație.",
      "Nu transferăm date în afara Spațiului Economic European decât dacă există garanții adecvate prevăzute de GDPR.",
    ],
  },
  {
    id: "drepturi",
    title: "7. Drepturile dumneavoastră",
    paragraphs: [
      "Aveți dreptul de acces, rectificare, ștergere, restricționare, portabilitate (unde se aplică) și de opoziție, precum și dreptul de a vă retrage consimțământul fără a afecta legalitatea prelucrării anterioare.",
      "Puteți depune plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), www.dataprotection.ro.",
      `Pentru exercitarea drepturilor, scrieți la ${CONTACT_EMAIL}.`,
    ],
  },
  {
    id: "securitate",
    title: "8. Securitate",
    paragraphs: [
      "Aplicăm măsuri tehnice și organizatorice rezonabile (acces restricționat, comunicare securizată unde este posibil) pentru protejarea datelor. Niciun sistem nu poate garanta securitate absolută.",
    ],
  },
  {
    id: "cookies",
    title: "9. Cookie-uri",
    paragraphs: [
      "Site-ul utilizează în principal cookie-uri strict necesare funcționării (dacă sunt setate de framework-ul tehnic). Nu folosim în prezent instrumente de analiză publicitară (ex. Google Analytics) pe site-ul de prezentare.",
      "Dacă vom introduce cookie-uri non-esențiale, vom actualiza această politică și, unde este cazul, vom solicita consimțământul.",
    ],
  },
  {
    id: "modificari-privacy",
    title: "10. Modificări",
    paragraphs: [
      "Putem actualiza această politică. Data ultimei actualizări este indicată mai jos. Vă încurajăm să consultați periodic această pagină.",
    ],
  },
];

export const LEGAL_LAST_UPDATED = "22 mai 2026";
