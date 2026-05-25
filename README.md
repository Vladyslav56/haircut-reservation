# Rezervační systém pro kadeřnictví

Webová aplikace umožňující klientům rezervovat návštěvu online a administrátorům spravovat zaměstnance, služby, pracovní dobu a rezervace.

---

## Architektura a zdůvodnění volby

Aplikace je single-page aplikace postavená na **React + Vite** s **Firebase** jako plnohodnotným backendem (Firestore + Authentication). Záměrně jsem nezaváděl vlastní server — pro tento rozsah projektu by přidal zbytečnou komplexitu bez přidané hodnoty. Firebase zajišťuje perzistenci dat, autentizaci admina a reálný databázový model, zatímco veškerá business logika (generování volných slotů, validace formulářů, výpočet cen) žije přímo v klientovi.

Stavový management je řešen kombinací lokálních custom hooků (`useBookings`, `useServices`, `useEmployees`, `useExceptions`) a jednoho sdíleného kontextu `DataContext`, který načítá zaměstnance a služby při startu a distribuuje je do celého stromu komponent. Tím se eliminují zbytečné opakované dotazy do Firestore — číselníkové entity (zaměstnanci, služby) se načtou jednou; dynamické entity (rezervace, výjimky) si každá stránka načítá sama. Routing zajišťuje React Router; styling Tailwind CSS bez extra UI knihoven, aby vizuální výsledek zůstal plně pod kontrolou.

---

## Spuštění lokálně

### Předpoklady

- Node.js ≥ 18
- npm ≥ 9
- Soubor .env, který zaslal e-mailem

### Postup

```bash
git clone <repo-url>
cd haircut-reservation
npm install
```

Přidejte do projektových souborů soubor .env, který byl zaslán e-mailem.

```bash
npm run dev
```

Aplikace běží na [http://localhost:5173](http://localhost:5173).

### Build pro produkci

```bash
npm run build
npm run preview
```

---

## URL nasazené aplikace

Aplikace je nasazená na **Vercel** — zvolil jsem ho proto, že s ním mám předchozí zkušenosti a umožňuje rychlý deploy přímo z Git repozitáře bez nutnosti konfigurace CI/CD.

> https://haircut-reservation-gray.vercel.app

---

## Přístupové údaje k seedovaným adminům

| Role  | E-mail          | Heslo    |
| ----- | --------------- | -------- |
| Admin | admin@admin.com | admin123 |

> Přihlášení je dostupné na `/admin`. Přihlašovací údaje nastavte přímo v **Firebase Authentication** → Add user.

---

## Předpoklady, které jsem si musel udělat

Zadání neřešilo několik věcí, které jsem vyřešil vlastním úsudkem:

1. **Délka slotu** — generátor slotů posouvá okno po 30 minutách bez ohledu na délku služby. Předpokládám, že zaokrouhlení na 30 min odpovídá reálné praxi kadeřnictví.
2. **Přiřazení ceny ke službě** — cena není globální vlastnost služby, ale závisí na konkrétním zaměstnanci. Každý zaměstnanec má vlastní ceník (`employee.services[].price`).
3. **Jeden admin účet** — zadání nespecifikovalo správu uživatelů, proto jsem zvolil jednoduchou Firebase Authentication bez vlastní správy rolí.
4. **Délka horizontu pro výběr data** — v rezervačním wizardu se zobrazuje 30 dní dopředu. Uplynulé dny se nezobrazují.
5. **Výjimky (dny volna)** — výjimka blokuje celý den pro daného zaměstnance; dílčí bloky (pozdní příchod, ranní volno) nejsou podporovány.
6. **Formát telefonu** — žádná validace formátu, pouze kontrola neprázdnosti.

---

## Co bych ještě udělal, kdyby byl víc čas

- E-mailové potvrzení rezervace klientovi ihned po dokončení
- Upomínky před návštěvou (SMS nebo e-mail 24 h předem)
- Správa více adminů s rozdílnými právy
- Storno ze strany klienta přes link v potvrzovacím e-mailu
- Opakující se výjimky — dovolená jako rozsah dat, ne jednotlivé dny
- Překlad UI do češtiny

---

## Co bych udělal jinak v produkční verzi

- **Firestore Security Rules** — momentálně jsou pravděpodobně otevřené. V produkci bych nastavil striktní pravidla: klient může pouze číst zaměstnance/služby a vytvořit rezervaci; admin může vše.
- **Vlastní backend (Cloud Functions nebo Node.js API)** — pro odesílání e-mailů, SMS a zpracování plateb. Nevystavoval bych API klíče třetích stran v prohlížeči.
- **Rate limiting** — bez serveru je veřejný endpoint pro vytvoření rezervace zranitelný na spam.
- **TypeScript** — přidal bych striktní typování, zejména pro datové modely (`Booking`, `Employee`, `Service`), kde teď spoléhám na tvar objektu z Firestore.

---

## Známé bugy a omezení

- **Race condition při rychlém přepínání dat** — pokud uživatel rychle mění datum nebo zaměstnance v rezervačním wizardu, může se zobrazit starší sada slotů. Chybí cleanup předchozího `getBookings` volání (AbortController nebo cancel token).
- **Sloty se generují i bez vybrané služby** — admin formulář pro vytvoření rezervace načte sloty ihned, protože generátor používá fallback délku 30 min při nulové délce vybraných služeb.
- **Nevalidovaný rozsah pracovní doby** — ScheduleEditor nebrání nastavení `end` < `start`. Výsledkem je prázdný seznam slotů bez chybové hlášky.
- **Smazání zaměstnance neodstraní jeho rezervace** — existující rezervace i výjimky zůstanou v Firestore osiřelé a budou se zobrazovat bez jména.
- **Smazání služby neodstraní ji z existujících rezervací** — v historii rezervací se pak zobrazí `serviceId` místo názvu.
- **Fotka zaměstnance není validována** — ukládá se jako URL string; neexistující nebo expirovaná URL způsobí broken image bez fallbacku.
- **Mobilní responsivita admin sekce** — admin stránky jsou optimalizovány pro desktop; na velmi malých obrazovkách (< 400 px) může být mřížka časových slotů stísněná.

---

## Nástroje použité při vývoji

Při vývoji jsem využíval **[Claude](https://claude.ai)** (Anthropic) jako AI asistenta a **[Claude Code](https://claude.ai/code)** jako CLI nástroj přímo v terminálu. Claude Code mi umožnil rychle iterovat nad kódem, refaktorovat komponenty, generovat opakující se struktury (formuláře, CRUD hooky) a okamžitě diskutovat architektonická rozhodnutí bez přepínání kontextu.

---

## Mock integrace — co bych použil v produkci

### E-mail (potvrzení rezervace, upomínky)

Momentálně se žádný e-mail neodesílá. V produkci bych použil **[Resend](https://resend.com)** — moderní transakční e-mail API s čistým SDK, dobrým free tirem a výbornou doručitelností.

### SMS (upomínky před návštěvou)

Žádné SMS se neodesílají. V produkci bych použil **[Twilio](https://www.twilio.com)** nebo **[SMSAPI.cz](https://smsapi.cz)**.

### Platby

Platby nejsou implementovány — rezervace se vytvářejí bez platby předem. V produkci bych integroval **GoPay** nebo **Comgate**, protože nativně podporují české platební metody (QR platba, bankovní převod, platba na dobírku).
