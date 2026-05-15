# TRAM V1 - Fase 1C-bis richiami TPL e brand a doppio senso v0.1

Data: 2026-05-14  
Stato: addendum integrativo alla Fase 1C  
Ambito: caratterizzazione TPL, brand light evoluto e revisione critica del mock HTML canonico  
Documento integrato: `docs/design/tram-v1-fase-1c-visual-direction-brand-light-v0-1.md`  
Fonte di revisione: `docs/design/tram-v1-mvp-ui-mock.html`

## Scopo

Questo addendum integra la direzione Fase 1C prima dell’avvio della Fase 2.

La Fase 1C resta valida su densità, struttura applicativa, token semantici, light/dark e componenti base. Questo documento corregge però un rischio emerso: il mock HTML canonico è utile, ma può risultare ancora troppo vicino a un SaaS operativo generico. TRAM deve invece avere richiami riconoscibili al mondo TPL, coerenti con il nome e con il dominio gare di trasporto pubblico locale.

Il mock HTML canonico non va quindi trattato come dogma. Va usato come base unica da migliorare in place, senza creare varianti parallele.

## Decisione

La direzione aggiornata è **networked control room**.

TRAM deve combinare:

- dashboard direzionale e sala di controllo operativa;
- grammatica visiva da rete metro/tram moderna;
- mappa critica di fonti, stati, scadenze, Q&A, Deliverables, Financials e Criticità;
- brand a doppio senso: `TRAM` come acronimo tecnico e come idea di rete, linea, percorso, fermate e interscambi.

Il livello di richiamo TPL è **medio**: abbastanza visibile da rendere TRAM caratteristico, non così forte da sembrare una consumer app di mobilità o una mappa decorativa.

È ammesso un livello più forte solo in alcuni elementi identitari: mark, hero operativo della dashboard, route strip o mappa sintetica del Tender. Il resto della UI resta sobrio e professionale.

## Riferimenti di maturità

Questi riferimenti orientano la grammatica, non vanno copiati.

| Riferimento | Cosa prendere | Cosa evitare |
| --- | --- | --- |
| Metro e tram europei moderni | Linee, nodi, interscambi, segnaletica leggibile, codici cromatici disciplinati | Icone letterali, estetica turistica, mappe decorative complesse |
| Sale controllo TPL | Stato di servizio, allarmi, priorità, vista d’insieme e drill-down | Look tecnico troppo industriale o “SCADA” pesante |
| Wayfinding urbano | Orientamento rapido, gerarchia, colori funzionali, label brevi | Segnaletica usata come tema grafico ovunque |
| Dashboard operative mature | Densità, tabelle, review, azioni e stati persistenti | SaaS generico senza memoria di dominio |

## Tesi visiva aggiornata

TRAM è una **mappa operativa del Tender**.

Ogni Tender può essere letto come una linea o una rete:

- documenti e versioni sono fermate o nodi di origine;
- timeline e scadenze sono tratte temporali;
- Q&A e addendum sono service updates che modificano la linea;
- Deliverables sono uscite operative;
- Requisiti, Financials e Cost driver sono nodi del Tender come gli altri, con fonte, stato, AI gate e review visibili;
- Criticità e contraddizioni sono disruption candidate;
- Review e audit sono livelli contestuali obbligati prima di consolidare il quadro.

La metafora deve restare strutturale, non verbale in modo invadente. Non serve chiamare tutto “fermata” o “linea” in UI. Serve che l’interfaccia si comporti come una rete controllabile.

## Cosa tenere del mock canonico

Il mock HTML canonico resta utile per:

- app shell desktop con sidebar stabile;
- dashboard direzionale first;
- densità complessiva;
- pannello `Fonte aperta`;
- tabella `Priorità da validare`;
- timeline compatta;
- sidebar con contesto Tender;
- stati light/dark;
- trattamento evidence-first di Financials e Q&A;
- assenza di landing marketing.

## Cosa rivedere del mock canonico

Prima di trasformarlo in UI reale vanno migliorati:

- mark `T`, oggi troppo generico;
- sidebar, oggi SaaS standard, da rendere più simile a una linea di navigazione o rete di aree;
- timeline, oggi fatta di dot generici, da trasformare in tratta con nodi e stati;
- overview, da arricchire con una `Tender route strip` o mini mappa dello stato;
- badge, da collegare meglio a stati di servizio e impatto;
- mobile tabs, da trattare come selettore di linea compatto;
- palette, da estendere con colori di linea senza perdere sobrietà;
- wording, da far percepire come controllo rete/Tender senza forzare metafore.

## Brand a doppio senso

`TRAM` resta acronimo tecnico, ma può iniziare a comportarsi come brand con doppio senso evoluto.

Significati ammessi:

- tram come rete leggibile;
- tram come percorso guidato;
- tram come sequenza di fermate, interscambi e deviazioni;
- tram come mezzo operativo che attraversa documenti, versioni e scadenze;
- monitoring come sala controllo della linea Tender.

Significati da evitare:

- prodotto simpatico o giocoso sul tram;
- icona tram letterale come logo principale;
- linguaggio da app per passeggeri;
- mappe decorative senza funzione;
- palette da linee metropolitane applicata a caso.

## Wordmark e mark evolutivi

Il wordmark resta `TRAM`.

Il mark provvisorio va evoluto da quadrato con `T` a **T-node**:

- una `T` costruita come incrocio tra una linea verticale e una linea orizzontale;
- un nodo o punto di interscambio nel punto di giunzione;
- radius contenuto, coerente con il mock;
- nessun disegno di veicolo;
- leggibile a 32 px;
- usabile in sidebar, mobile header e favicon futura.

Varianti possibili:

| Variante | Descrizione | Quando usarla |
| --- | --- | --- |
| T-node semplice | `T` geometrica con nodo centrale | Default MVP-V0 |
| T-line | `T` con segmento orizzontale più marcato, come capolinea o linea principale | Se serve maggiore riconoscibilità |
| T-interchange | `T` con due piccoli nodi, uno centrale e uno terminale | Se il brand vuole spingere di più sulla rete |

Per ora scegliere `T-node semplice`.

## Palette TPL integrativa

I token Fase 1C restano validi. Aggiungere però una piccola famiglia `route-*` per linee, nodi, mappe compatte e connessioni tra aree.

| Token | Light | Dark | Uso |
| --- | --- | --- | --- |
| `route-core` | `oklch(50% 0.085 188)` | `oklch(72% 0.09 188)` | Linea principale Tender, stato informativo, tratte correnti |
| `route-document` | `oklch(45% 0.055 230)` | `oklch(69% 0.06 230)` | Documenti, versioni, fonti |
| `route-qna` | `oklch(56% 0.105 72)` | `oklch(78% 0.11 78)` | Q&A, addendum, aggiornamenti da incorporare |
| `route-review` | `oklch(50% 0.075 148)` | `oklch(73% 0.09 148)` | Validazioni, review, stati confermati |
| `route-financials` | `oklch(38% 0.045 255)` | `oklch(66% 0.045 255)` | Financials, pricing, payment e nodi economici del Tender |
| `route-risk` | `oklch(45% 0.13 26)` | `oklch(72% 0.12 28)` | Criticità, blocchi, disruption candidate |

Regole:

- I colori `route-*` servono soprattutto per linee e nodi, non per riempire card intere.
- Non usare più di 3 colori di linea nella stessa vista compatta.
- Financials non deve diventare “viola premium”: resta sobrio, evidence-first e analizzabile con AI gate visibile.
- Rischio e warning restano più importanti della decorazione di linea.

## Pattern UI TPL

### Tender route strip

Componente da aggiungere alla dashboard overview.

Mostra una linea orizzontale compatta con 8 nodi primari:

- Documenti;
- Timeline;
- Deliverables;
- Requisiti;
- Q&A;
- Financials;
- Cost driver;
- Criticità.

Review e audit non sono nodi primari della route: restano contesti trasversali di validazione e tracciamento, apribili dai nodi quando servono.

Ogni nodo mostra:

- stato;
- count essenziale;
- collegamento alla vista;
- eventuale blocker.

La route strip risponde a “dove siamo nella rete del Tender”.

### Timeline come linea

La timeline non deve essere solo una lista con dot.

Regole:

- linea verticale o orizzontale visibile;
- nodi pieni per eventi consolidati;
- nodi ambra per eventi da validare;
- nodi rossi per blocchi;
- collegamento visuale tra Q&A e scadenza modificata;
- massimo 3-5 eventi in overview.

### Sidebar come linea di lavoro

La sidebar può avere un rail sottile:

- item attivo come nodo illuminato;
- count come pill compatta;
- aree con criticità come piccoli marker;
- Tender card come testata della linea.

Il rail non deve ridurre leggibilità o diventare decorazione.

### Inspector fonte come interscambio

L’inspector fonte deve mostrare connessioni:

- fonte;
- area colpita;
- stato;
- azione;
- viste collegate.

Visivamente può usare mini connector o chip collegati, ma senza grafici complessi.

### Mobile come linea compatta

Su mobile:

- tabs come pill di linea;
- route strip completa con gli 8 nodi primari, resa come sequenza compatta o scroll orizzontale;
- priorità come lista, non tabella compressa;
- fonte aperta sempre vicina al blocco.

## UX e micro-interazioni future

Quando ci sarà codice:

- hover su nodo route strip: evidenzia tratte e mostra fonte/stato;
- click su nodo: apre vista o filtro collegato;
- cambio stato review: nodo passa da ambra o rosso a verde solo dopo conferma;
- nuovo Q&A: piccolo marker pulse, massimo 1.2 s e rispettando `prefers-reduced-motion`;
- Financials con AI gate: stato visuale sobrio, nessuna animazione enfatica.

Nessuna micro-interazione deve far sembrare automatico ciò che richiede review umana.

## Wording UI

Mantenere la terminologia decisa:

- `Tender`;
- `Q&A`;
- `Financials`;
- `Deliverables`;
- `Criticità`;
- `tender_id`.

Aggiungere metafore TPL solo dove aiutano:

| Ammesso | Da usare con cautela | Da evitare |
| --- | --- | --- |
| `Percorso Tender` | `Linea Tender` | `Linea tram` |
| `Stato rete` | `Contesto review` | `Stazione` per ogni documento |
| `Aggiornamento Q&A` | `Deviazione` | battute o giochi di parole |
| `Nodo critico` | `Tratta riservata`, solo se c’è L2 effettivo | linguaggio da app passeggeri |

La metafora è soprattutto visuale. Il testo resta preciso e professionale.

## Impatto sulla Fase 2

La Fase 2 può partire senza rifare i wireframe, ma le fixture dovrebbero consentire di provare:

- Tender con rete quasi pulita;
- Tender con Q&A che modifica una scadenza;
- Tender con Financials analizzato dall’AI e poi validato o corretto in review;
- Tender con Criticità bloccante;
- Tender con nuovo addendum che rende stale alcuni nodi;
- Tender con review che cambia stato da aperto a confermato.

Non serve aggiungere campi core solo per la grafica. La route strip può essere derivata da indicatori, review item, aree T1-T8 e stati già previsti. Dashboard resta il collante direzionale; Review e audit restano superfici contestuali.

## Debiti rimandati

Restano rimandati:

- logo completo;
- naming definitivo;
- sistema iconografico completo;
- motion system;
- illustrazioni o pattern brand;
- eventuale mappa Tender interattiva avanzata;
- confronto visivo con brand TPL reali;
- test utente sul grado di riconoscibilità della metafora.

## Decisione finale

La Fase 1C-bis promuove TRAM da “premium SaaS documentale operativo” a **networked control room per Tender TPL**.

Il mock HTML canonico resta base utile, ma la prossima iterazione visuale deve introdurre richiami TPL strutturali: T-node, route strip a 8 nodi primari, timeline come linea, sidebar rail, nodi di stato e connessioni fonte-review contestuali. Questo rende TRAM più caratteristico senza trasformarlo in una mappa decorativa o in una consumer app di mobilità.
