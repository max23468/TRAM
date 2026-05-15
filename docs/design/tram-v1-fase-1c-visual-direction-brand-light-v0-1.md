# TRAM V1 - Fase 1C direzione visiva e brand light v0.1

Data: 2026-05-14  
Stato: baseline Fase 1C chiusa  
Ambito: direzione visiva minima e brand light per TRAM V1/MVP-V0  
Fonte decisionale: `docs/design/tram-v1-mvp-ui-mock.html`

Addendum successivo: `docs/design/tram-v1-fase-1c-bis-tpl-brand-direction-v0-1.md` integra questa baseline con richiami TPL, brand a doppio senso e regole per far evolvere il mock canonico senza creare nuove varianti parallele.

## Scopo

Questo documento chiude la Fase 1C della roadmap TRAM V1/MVP-V0.

L’obiettivo non è definire un brand completo, ma fissare una direzione visiva minima sufficiente per costruire la prima applicazione senza tornare a un’interfaccia generica.

Il PDF esportato dalla revisione precedente resta artefatto storico. La fonte da usare è il mock HTML canonico.

## Sintesi decisionale

La direzione TRAM V1/MVP-V0 è **premium SaaS documentale operativo**. Dopo l’addendum Fase 1C-bis, la formulazione più precisa è **networked control room per Tender TPL**.

TRAM deve sembrare una control room per tender complessi: densa, sobria, verificabile, orientata a fonti, stati, rischi e prossime azioni. Non deve sembrare una landing page, una chat con PDF, un archivio documentale generalista o un prodotto editoriale puro.

La dashboard direzionale resta il primo schermo guida: deve rispondere rapidamente a “che Tender è, dove siamo ora, cosa blocca, cosa devo guardare”.

## Riferimenti di maturità

I riferimenti sotto sono categorie di comportamento e qualità, non modelli da copiare.

| Riferimento | Cosa prendere | Cosa evitare |
| --- | --- | --- |
| Linear | Densità operativa, sidebar stabile, liste con stato chiaro, gerarchia forte senza decorazione inutile | Look da issue tracker puro, perdita del contesto documentale |
| Vercel Dashboard | Tipografia pulita, superfici disciplinate, azioni primarie asciutte, dark mode credibile | Minimalismo troppo astratto o developer-first |
| Stripe Dashboard | Fiducia operativa, tabelle leggibili, stati e pagamenti trattati con cautela | Sensazione fintech generica o eccesso di metriche economiche |

## Tesi visiva

TRAM usa un linguaggio da **sala operativa documentale**:

- sidebar scura come ancora di navigazione e contesto Tender;
- canvas chiaro, leggermente caldo, per lavoro quotidiano e leggibilità;
- superfici bianche o quasi bianche, separate da bordi e ombre basse;
- accento teal tecnico per elementi informativi e progressi;
- rosso, ambra e verde riservati a rischio, attenzione e validazione;
- citazioni e fonti con trattamento più “documentale”, distinto dalla UI operativa.

La parte memorabile non deve essere un’illustrazione o un logo forte, ma il modo in cui TRAM rende visibili fonte, stato, rischio e prossima azione nello stesso colpo d’occhio.

## Posizionamento light

### Cosa TRAM promette

- Trasformare pacchetti Tender complessi in una mappa direzionale verificabile.
- Mostrare che cosa è consolidato, che cosa è proposto e che cosa richiede review.
- Ridurre il tempo di orientamento su scadenze, documenti, Q&A, Deliverables, Financials e Criticità.
- Rendere ogni dato importante riconducibile a fonte, estratto, stato e azione.

### Cosa TRAM non promette

- Non decide al posto dell’utente.
- Non è una chat generica con i documenti.
- Non prepara automaticamente l’offerta completa.
- Non invia Q&A senza approvazione umana.
- Non trasforma Financials, KPI o Criticità candidate in verità senza review.

## Terminologia UI da mantenere

Questi termini restano deliberatamente visibili in UI:

- `Tender`;
- `Q&A`;
- `Financials`;
- `Deliverables`;
- `Criticità`;
- `tender_id`.

La UI può essere in italiano operativo, ma questi termini sono parte del lessico prodotto V1 e non vanno tradotti automaticamente.

## Palette

La palette nasce dai token OKLCH consolidati nel mock HTML canonico. In implementazione Next.js/Tailwind va esposta come token semantici, non come colori raw sparsi nei componenti.

### Token neutrali

| Token | Light | Dark | Uso |
| --- | --- | --- | --- |
| `canvas` | `oklch(96.5% 0.01 112)` | `oklch(15.5% 0.02 244)` | Sfondo dell’area applicativa |
| `canvas-strong` | `oklch(93.8% 0.014 112)` | `oklch(12.5% 0.018 244)` | Fondo secondario e profondità |
| `surface` | `oklch(99.2% 0.004 112)` | `oklch(20.5% 0.022 244)` | Panel e card principali |
| `surface-subtle` | `oklch(97.2% 0.006 112)` | `oklch(24% 0.024 244)` | Campi, righe interne, citazioni leggere |
| `surface-raised` | `oklch(100% 0 0)` | `oklch(27% 0.026 244)` | Evidenze e pannelli in primo piano |
| `ink` | `oklch(19% 0.018 245)` | `oklch(93% 0.008 112)` | Testo principale |
| `ink-soft` | `oklch(37% 0.026 245)` | `oklch(78% 0.014 112)` | Testo secondario importante |
| `muted` | `oklch(54% 0.024 242)` | `oklch(63% 0.018 224)` | Label, note, metadati |
| `border` | `oklch(86% 0.012 112)` | `oklch(100% 0 0 / 0.1)` | Bordi principali |
| `border-soft` | `oklch(91% 0.008 112)` | `oklch(100% 0 0 / 0.065)` | Separazioni interne |

### Token di contesto

| Token | Light | Dark | Uso |
| --- | --- | --- | --- |
| `sidebar` | `oklch(20.5% 0.04 226)` | `oklch(11% 0.018 244)` | Navigazione, identità applicativa |
| `sidebar-soft` | `oklch(27% 0.042 226)` | `oklch(19% 0.024 244)` | Blocchi interni sidebar |
| `sidebar-text` | `oklch(92% 0.01 112)` | `oklch(93% 0.008 112)` | Testo sidebar |
| `sidebar-muted` | `oklch(70% 0.025 218)` | `oklch(65% 0.018 224)` | Metadati sidebar |
| `accent` | `oklch(50% 0.085 188)` | `oklch(72% 0.09 188)` | Stato informativo, progressi, elementi attivi |
| `accent-soft` | `oklch(90% 0.052 188)` | `oklch(31% 0.052 188)` | Background di badge e dot informativi |
| `risk` | `oklch(45% 0.13 26)` | `oklch(72% 0.12 28)` | Blocco, rischio alto, Criticità |
| `risk-soft` | `oklch(92% 0.04 28)` | `oklch(29% 0.07 28)` | Background rischio |
| `warn` | `oklch(52% 0.1 72)` | `oklch(78% 0.11 78)` | Da validare, da incorporare, attenzione |
| `warn-soft` | `oklch(92% 0.052 80)` | `oklch(31% 0.06 78)` | Background attenzione |
| `success` | `oklch(48% 0.09 148)` | `oklch(73% 0.09 148)` | Vigente, ammesso, validato |
| `success-soft` | `oklch(92% 0.05 148)` | `oklch(30% 0.06 148)` | Background positivo |

### Regole palette

- La modalità chiara è default per lavoro quotidiano.
- La modalità scura deve essere completa, non una semplice inversione.
- `risk`, `warn` e `success` sono colori di stato, non colori decorativi.
- Il teal `accent` non deve competere con rischio e blocchi.
- Evitare gradienti decorativi, orbs e fondi atmosferici.
- Le superfici annidate devono distinguersi con bordo, step di luminosità o ombra bassa.
- Le viste Financials devono mantenere fonte, stato, AI gate e review anche quando usano numeri o tabelle.

## Tipografia

### Stack di produzione consigliato

| Ruolo | Font | Uso |
| --- | --- | --- |
| UI e display | `Geist Sans`, con fallback `Aptos`, `SF Pro Text`, `Segoe UI`, `system-ui`, `sans-serif` | Navigazione, dashboard, titoli, controlli |
| Mono | `Geist Mono`, con fallback `SF Mono`, `Roboto Mono`, `ui-monospace`, `monospace` | `tender_id`, contatori, date, label tecniche |
| Evidence | `Source Serif 4`, con fallback `Iowan Old Style`, `Georgia`, `serif` | Estratti fonte, citazioni, snippet documentali |

Il mock usa Aptos come riferimento visivo. Per l’implementazione Next.js è preferibile un font caricabile e controllabile, con Geist come prima opzione operativa. La scelta finale del caricamento font va validata quando nasce il progetto applicativo.

### Scala tipografica iniziale

| Elemento | Desktop | Mobile | Note |
| --- | --- | --- | --- |
| Titolo Tender | 31-43 px | 34 px | Peso 760-780, line-height 1.02 |
| Titolo sezione | 18-23 px | 19 px | Peso 760, letter spacing solo se serve |
| Body operativo | 12-14 px | 12-14 px | Line-height 1.45-1.55 |
| Sidebar item | 13 px | Non presente nella vista mobile compatta | Navigazione densa |
| Badge e metadati | 10-11 px | 10-11 px | Peso 650-740, spesso mono |
| Tabelle | 12 px | Variante mobile a lista | Numeri tabulari |

Regole:

- Non usare font-size scalato sul viewport.
- Usare numeri tabulari per scadenze, contatori, percentuali ed età.
- Evitare display type eccessivo fuori dalla dashboard principale.
- I testi tecnici devono restare leggibili a 320 px.

## Densità e layout

TRAM deve essere densa senza sembrare compressa.

| Area | Regola iniziale |
| --- | --- |
| App shell desktop | Sidebar 248 px, main fluido, target 1440 px |
| Sidebar compatta | Gruppi chiari: brand, Tender, area di lavoro, aggiornamenti, nota policy |
| Workspace | Padding 18-24 px, gap 14-18 px |
| Panel | Radius 14 px, padding 18 px, bordo sottile |
| Card compatte | Radius 7-10 px, padding 10-12 px |
| Bottoni | Altezza minima 34 px, radius 5 px, testo 12 px |
| Badge | Altezza 20-24 px, radius 5 px o pill solo per contatori |
| Tabelle | Header uppercase mono, righe compatte, numeri allineati a destra |
| Mobile | 390 px come riferimento, una colonna, tabs orizzontali, card sintetiche |

La dashboard non deve diventare un collage di card decorative. Le card servono quando racchiudono un’unità operativa: fonte aperta, priorità, Q&A, stato documenti, policy dati.

## Componenti base

### App shell

Struttura primaria:

- sidebar scura con brand, contesto Tender e navigazione;
- topbar con breadcrumb e azioni principali;
- workspace con griglie responsive;
- inspector fonte sempre disponibile nelle viste che mostrano dati proposti o critici.

### Brand e navigazione

Componenti minimi:

- wordmark `TRAM`;
- mark provvisorio con `T`;
- sottotitolo contestuale, per esempio `Analisi tender`;
- tender card con `tender_id`, nome Tender, stage e copertura fonti;
- nav item con label e count/stato.

### Dashboard summary

Deve includere:

- stage Tender;
- stato di validazione;
- descrizione sintetica del blocco principale;
- 3-4 metriche direzionali;
- collegamento a fonte o review.

Le metriche devono essere orientative e verificabili. Non introdurre avanzamento dell’offerta se l’offerta non è caricata.

### Badge e stati

Badge base:

- informativo: `Revised tender`, `Metro O&M`;
- warning: `Da validare`, `Da incorporare`, `Da approvare`;
- rischio: `Bloccante`, `Validazione richiesta`, `Da review`;
- positivo: `Mappato`, `Vigente`, `Ammesso`;
- neutro: count, filtri, aree.

I badge non devono sostituire il testo di contesto. Servono a far scansionare priorità e stato.

### Tabelle

La tabella `Priorità da validare` diventa componente base per review e dashboard:

- prima colonna con elemento e metadato;
- area;
- rischio;
- stato;
- fonte;
- azione;
- età o urgenza.

Su mobile la tabella diventa lista prioritaria, non tabella compressa.

### Timeline

La timeline è compatta e orientativa:

- data a sinistra in mono;
- dot semantico;
- evento;
- stato a destra;
- massimo 3-5 eventi nella dashboard.

Il dettaglio esteso resta nella vista Timeline.

### Inspector fonte

Componente centrale del prodotto:

- documento;
- riferimento;
- impatto;
- stato;
- estratto o citazione;
- prossima azione;
- collegamenti a viste colpite.

L’inspector deve apparire come strumento operativo, non come nota a margine.

### Q&A thread

Il Q&A in dashboard è sintetico:

- domanda;
- risposta ricevuta o bozza interna;
- fonte;
- impatto;
- stato;
- azione.

Nessuna UI deve suggerire invio automatico.

### Policy dati e AI

Componente di stato sempre sobrio:

- pubblico ammesso;
- uso interno da approvare;
- Financials con policy e AI gate espliciti;
- quota o provider stale quando rilevante.

Non usare colori “ottimistici” se la policy richiede blocco o review.

## Wordmark provvisorio

Per MVP-V0 il wordmark provvisorio è:

- mark: quadrato 32 x 32 px, radius 9 px, fondo chiaro caldo, lettera `T`;
- testo: `TRAM`, maiuscolo, peso 740 circa;
- sottotitolo: `Analisi tender` nella sidebar, oppure `Dashboard` nelle viste mobile compatte.

Regole:

- Non disegnare un logo completo in Fase 1C.
- Non usare icone ferroviarie o tram come metafora visiva principale.
- Non trasformare `TRAM` in un marchio marketing prima della validazione applicativa.
- Il mark provvisorio serve a rendere riconoscibile l’app shell e può essere sostituito.

## Regole light/dark

### Modalità chiara

- Default di lavoro.
- Sidebar scura per orientamento e memoria di prodotto.
- Canvas caldo e desaturato.
- Panel quasi bianchi con bordo visibile.
- Ombre basse: profondità sì, effetto floating no.

### Modalità scura

- Deve mantenere la stessa gerarchia della modalità chiara.
- Evitare nero puro esteso tranne nella sidebar più profonda.
- Usare superfici a step: canvas, panel, raised.
- Bordi e contrasto sostituiscono molte ombre.
- Stato e rischio devono restare leggibili senza saturazione eccessiva.

### Parità funzionale

Light e dark devono mostrare:

- stessi dati;
- stessi stati;
- stessi blocchi;
- stesso inspector fonte;
- stessa evidenza di Financials analizzato, AI gate e Q&A da validare.

## Component strategy per Next.js/Tailwind/shadcn

Quando parte il codice applicativo:

- usare CSS custom properties semantiche come single source of truth;
- mappare i token in Tailwind;
- usare componenti shadcn/ui o equivalenti solo se rispettano densità, radius e stati TRAM;
- non accettare il default shadcn se produce UI generica;
- usare icone lucide solo dove aumentano scansione e riconoscibilità;
- mantenere componenti piccoli: `AppShell`, `TenderSidebar`, `StatusBadge`, `SourceInspector`, `PriorityTable`, `TimelineCompact`, `QnaImpactCard`, `PolicyStatusList`.

## Accessibilità minima da verificare in implementazione

La Fase 1C non sostituisce il testing applicativo. Quando esisterà la UI reale, verificare:

- contrasto dei badge in light e dark;
- focus visibile su nav, bottoni, tab e righe azionabili;
- navigazione tastiera in tabelle e inspector;
- target minimi su mobile;
- stato non comunicato solo dal colore;
- nomi accessibili per icone e bottoni;
- riduzione motion se introdotta.

## Debiti rimandati

Debiti esplicitamente rimandati oltre la Fase 1C:

- naming definitivo;
- logo completo;
- brand system esteso;
- tono di voce completo;
- iconografia definitiva;
- chart palette e regole data visualization;
- stati empty, loading, errore e quota esaurita in dettaglio;
- component library reale;
- verifica contrasto automatizzata sui token implementati;
- design delle viste specialistiche complete;
- export PDF/Excel;
- materiali esterni o presentazione commerciale.

## Criterio di chiusura

La Fase 1C si considera chiusa perché sono definite:

- palette semantica light/dark;
- tipografia iniziale;
- densità e layout;
- componenti base;
- wordmark provvisorio;
- posizionamento light;
- regole light/dark;
- debiti da rimandare.

La Fase 2 può derivare fixture e prime slice applicative dal mock HTML canonico e da questo documento senza riaprire la direzione visuale della dashboard.
