# TRAM V1 - Wireframe funzionali MVP/V0 largo v0.1

Data: 2026-05-13  
Stato: baseline Fase 1A chiusa formalmente il 2026-05-13; aggiornamento Fase 2 networked control room del 2026-05-14; fixture Fase 2 chiuse il 2026-05-15  
Ambito: layout funzionali, route, stati UI, dati minimi e fixture per MVP/V0 largo

## Scopo

Questo documento traduce la roadmap MVP/V0 larga in wireframe funzionali.

Non è ancora un mock grafico ad alta fedeltà. Serve a definire:

- quali viste esistono;
- quali blocchi contiene ogni vista;
- quali dati minimi servono;
- quali azioni utente sono disponibili;
- quali stati vuoti, bloccati o critici vanno previsti;
- quali fixture applicative dovranno alimentare la UI prima del codice completo.

## Decisione

Il MVP/V0 largo mantiene tutte le superfici `T1`-`T8`, ma la navigazione deve restare semplice.

La UI deve partire da quattro superfici operative forti:

1. dashboard aggregata;
2. overview gara;
3. document map;
4. review queue.

Le altre viste specialistiche sono accessibili dalla gara e mostrano contenuti proporzionati alla maturità del task:

- T2 e T3 come viste operative forti;
- T4 e T6 come viste strutturate ma ancora review-heavy;
- T5 come vista Financials evidence-first, analizzabile da AI secondo data policy e gate provider;
- T7 come candidate issues;
- T8 come Q&A human-first: thread domanda-risposta tra bidder e stazione appaltante, con bozze interne approvate manualmente.

Aggiornamento Fase 2: la direzione visiva **networked control room** aggiunge una lettura a rete del Tender. Documenti, Timeline, Deliverables, Requisiti, Q&A, Financials, Cost driver e Criticità devono apparire come 8 nodi primari collegati, derivati dai dati già previsti e non come layer decorativo separato. Review e audit restano contesti trasversali.

## Principi UI

La UI TRAM deve essere:

- italiana;
- desktop-first, ma non rotta su mobile;
- densa, leggibile e sobria;
- orientata a tabelle, stati, filtri, fonti e review;
- evidence-first: nessun valore critico senza fonte o stato;
- review-first: ogni dato rischioso deve portare alla review queue;
- policy-aware: permessi, privacy level e AI gate devono essere visibili;
- networked control room: la UI deve rendere leggibili nodi, tratte, interscambi review e aggiornamenti Q&A;
- non marketing: niente hero, landing page o testi descrittivi superflui.

## Layout applicativo comune

Tutte le viste dopo il login usano una shell coerente:

```text
┌──────────────────────────────────────────────────────────────┐
│ Top bar: gara corrente, search, policy, utente               │
├───────────────┬──────────────────────────────────────────────┤
│ Sidebar       │ Header vista                                 │
│ - Tender      │ Filtri / azioni principali                   │
│ - Overview    ├──────────────────────────────────────────────┤
│ - Documenti   │ Contenuto principale                         │
│ - Timeline    │ Tabelle, card compatte, stati, grafici minimi│
│ - Deliverables│                                              │
│ - Requisiti   ├──────────────────────────────────────────────┤
│ - Financials   │ Drawer fonte / dettaglio review / audit      │
│ - Cost driver │ aperto solo quando richiesto                 │
│ - Criticità   │                                              │
│ - Q&A         │                                              │
│ - Review      │                                              │
│ - Audit       │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

Su mobile la sidebar diventa menu compatto e le tabelle diventano liste dense con colonne prioritarie.

## Componenti trasversali

### Badge stato

Stati principali:

- `draft`;
- `partially_validated`;
- `validated_internal`;
- `stale_due_to_new_docs`;
- `open_critical_issues`.

Stati valore:

- `proposed`;
- `confirmed`;
- `corrected`;
- `contested`;
- `unclear`;
- `superseded`;
- `not_applicable`.

Stati policy:

- L0 ammesso;
- L1 da approvare;
- L2 bloccato;
- quota esaurita;
- provider policy stale;
- clause scan non completato.

### Pannello fonte

Il pannello fonte si apre da ogni headline, riga tabella o review item.

Contiene:

- documento;
- versione;
- famiglia documento;
- pagina, sezione, tabella, riga o cella;
- snippet o riferimento sanificato;
- valore estratto o proposto;
- origine: parser, regola, AI, normalizzatore o utente;
- stato;
- confidenza;
- azioni review disponibili.

### Review mini-panel

Quando una riga ha review aperta, il mini-panel mostra:

- titolo item;
- rischio;
- blocking sì/no;
- valore proposto;
- fonte principale;
- azioni rapide: conferma, correggi, contesta, da chiarire, superato;
- link al dettaglio in `/tenders/:tender_id/review`.

### Tender route strip

La route strip è il componente trasversale che rende TRAM più vicino al mondo TPL senza trasformarlo in una mappa decorativa.

Mostra 8 nodi primari compatti:

- Documenti;
- Timeline;
- Deliverables;
- Requisiti;
- Q&A;
- Financials;
- Cost driver;
- Criticità.

Ogni nodo mostra stato, count essenziale, blocker e route di drill-down. Le connessioni mostrano relazioni operative, per esempio Q&A che modifica una scadenza, Financials collegato a un cost driver, addendum che rende stale un nodo o review contestuale che valida un dato.

Regole:

- la route strip è derivata da `IndicatorValue`, `ReviewItem`, `SourceReference`, `DashboardValidationState`, `FinancialItem`, `ClarificationThread` e AI gate;
- non deve creare una seconda verità modificabile;
- su mobile mantiene gli 8 nodi primari, con densità compatta o scroll orizzontale;
- Financials usa il nodo `route-financials` ma non è una tratta protetta per categoria.

### Filtri standard

Filtri ricorrenti:

- stato;
- rischio;
- review required;
- blocking;
- task T1-T8;
- privacy level;
- document family;
- fonte automazione;
- stato documento/versione;
- deadline vicina;
- dati sensibili.

## Route e viste

## `/tenders` - Dashboard aggregata

### Obiettivo

Mostrare tutte le gare e far capire dove intervenire.

### Wireframe funzionale

```text
Header: Tender
Azioni: Nuova gara, importa pacchetto, filtra

KPI strip:
[Tender attivi] [Criticità aperte] [Da aggiornare] [Scadenze prossime] [AI bloccata]

Tabella gare:
Tender | Tipo | Fase | Modalità | Prossima scadenza | Nuovi doc | Blocker | Q&A | Stato

Side drawer opzionale:
Dettaglio stato gara / blocker principali / policy AI
```

### Dati minimi

- `tender.identity.name`;
- `tender.identity.package_type`;
- `tender.identity.transport_mode`;
- `procurement.stage.current`;
- `procurement.deadline.next_critical`;
- `documents.changed_since_last_review_count`;
- `review.items.blocking_count`;
- `contradictions.critical_count`;
- `clarification_ready_count`;
- `dashboard.validation_state.overall`;
- `ai.external_use.status`.

### Azioni

- apri gara;
- filtra per stato;
- ordina per scadenza;
- apri review bloccanti;
- apri audit/policy.

### Stati

- nessuna gara;
- gara draft senza documenti;
- gara stale;
- gara con criticità aperte;
- gara validata internamente;
- AI/policy bloccata.

### Fixture richiesta

Almeno quattro righe: Copenhagen, Dublin Luas, Milano e MetroLink come archetipi sanificati, con stati diversi.

## `/tenders/:tender_id/overview` - Overview gara

### Obiettivo

Dare una panoramica direzionale della gara, con caratteristiche base, fase, stato documentale, stato analisi TRAM, rischi e blocker visibili.

La vista non deve sembrare un pannello tecnico del parser. Deve rispondere prima a: “che gara è, dove siamo ora, cosa richiede attenzione, quanto mi posso fidare”.

### Wireframe funzionale

```text
Header:
Nome gara | Authority | Paese | Tipo pacchetto | Fase | Stato dashboard

Alert band:
[Documenti nuovi] [Review bloccanti] [AI L1 da approvare] [Financials da validare]

Tender route strip:
Documenti -- Timeline -- Deliverables -- Requisiti -- Q&A -- Financials -- Cost driver -- Criticità

Prima riga direzionale:
[Fase gara] [Prossima scadenza] [Documenti/versioni] [Affidabilità dati]

Seconda riga operativa:
[Review bloccanti] [Deliverables mandatory] [Criticità candidate]
[Q&A da incorporare] [Financials da analizzare]

Sezioni:
1. Identità e caratteristiche base gara
2. Stato documenti e versioni
3. Timeline e prossime scadenze
4. Deliverables chiave
5. Rischi, criticità e Q&A
6. Stato interno analisi TRAM
7. Financials: analisi, fonte, AI gate e review
8. Audit AI/data policy
```

### Dati minimi

Tutti i P0 non puramente tecnici, più:

- stato interno analisi manuale minimo;
- ultimi job;
- ultimi blocker;
- policy gara;
- route strip e connessioni principali;
- link a review queue filtrata.

### Azioni

- apri fonte;
- apri vista specialistica;
- apri review filtrata;
- avvia parsing se permesso;
- approva policy L1 se owner;
- marca gara come da rivedere se emergono nuovi documenti.

### Stati

- overview vuota con documenti non caricati;
- parsing in corso;
- P0 parziali;
- validated internal;
- stale per nuovi documenti;
- open critical issues.
- internal status missing.

### Fixture richiesta

Una gara con P0 quasi completi e stato interno analisi chiaro, una gara con P0 parziali, almeno un blocker critico, un dato Financials analizzato e da review, una route strip con nodo rosso/ambra e un caso in cui lo stato interno è mancante o da aggiornare.

## `/tenders/:tender_id/documents` - Document map T1

### Obiettivo

Mostrare cosa c’è nel pacchetto, quale versione è corrente e cosa richiede review.

### Wireframe funzionale

```text
Header: Documenti
Summary: totale, correnti, superati, conflitti, da review

Layout:
Sinistra: albero cartelle/famiglie
Centro: tabella documenti
Destra: dettaglio documento o fonte

Tabella:
Famiglia | Titolo | Filename | Versione | Variante | Currentness | Privacy | Review | Fonte
```

### Dati minimi

- `documents.total_count`;
- `documents.current_count`;
- `documents.changed_since_last_review_count`;
- `documents.version_conflict_count`;
- document family;
- version label;
- variant type;
- stato documento/versione;
- privacy level;
- review required.

### Azioni

- filtra stato documento/versione;
- filtra privacy level;
- apri documento o estratto;
- confronta versioni, se disponibile;
- marca stato documento/versione da chiarire;
- crea review item.

### Stati

- documenti caricati ma non inventariati;
- parser issue;
- stato documento/versione non chiaro;
- version conflict;
- L2 non visibile per ruolo;
- documento superato.

### Fixture richiesta

Almeno:

- clean copy corrente;
- track changes;
- redline;
- addendum;
- pricing workbook L1 o L2 effettivo secondo policy;
- documento con stato versione non chiaro;
- documento superato.

## `/tenders/:tender_id/timeline` - Timeline T2

### Obiettivo

Mostrare deadline e milestone gara/contratto, distinguendo date certe, relative e conflittuali.

### Wireframe funzionale

```text
Header: Timeline
Tabs: Procurement | Contratto | Mobilitazione | Q&A | Tutto

Timeline compatta:
milestone critiche con badge stato

Tabella eventi:
Evento | Tipo | Data/Intervallo | Precisione | Fonte | Stato | Review | Deliverables collegati
```

### Dati minimi

- `procurement.deadline.next_critical`;
- `procurement.deadline.questions`;
- `procurement.deadline.submission`;
- `contract.duration.base`;
- `contract.duration.extension_options`;
- `contract.mobilisation.start`;
- `contract.operation.start`;
- `contract.operation.end`;
- `contradictions.timeline_count`.

### Azioni

- apri fonte;
- filtra eventi critici;
- apri conflitti;
- collega deliverable;
- crea thread di chiarimento se data da chiarire;
- conferma o correggi data.

### Stati

- nessuna timeline estratta;
- data relativa;
- timezone/orario incerto;
- conflitto MPP/PDF;
- addendum che supera data precedente;
- deadline P0 non validata.

### Fixture richiesta

Almeno:

- submission deadline confermata;
- deadline Q&A relativa;
- mismatch MPP/PDF;
- evento superato da addendum;
- evento collegato a deliverable.

## `/tenders/:tender_id/deliverables` - Deliverables T3

### Obiettivo

Trasformare istruzioni di gara e allegati in checklist operativa.

### Wireframe funzionale

```text
Header: Deliverables
Summary: totale, mandatory, economici/sensibili, prossima scadenza

Filtri: area, mandatory, deadline, sensitive, review

Tabella checklist:
Codice | Nome | Area | Mandatory | Formato | Page limit | Peso | Deadline | Fonte | Stato
```

### Dati minimi

- `deliverables.total_count`;
- `deliverables.mandatory_count`;
- `deliverables.next_due`;
- `financial.model.required`;
- `procurement.evaluation.model_summary`;
- source refs;
- sensitive flag.

### Azioni

- apri fonte;
- conferma mandatory;
- correggi area submission;
- collega a timeline;
- marca economico/sensibile;
- crea thread di chiarimento se requisiti contraddittori.

### Stati

- deliverable mandatory senza fonte chiara;
- formato/page limit incerto;
- peso valutativo da review;
- deadline collegata non validata;
- deliverable economico classificato secondo policy.

### Fixture richiesta

Almeno:

- deliverable amministrativo;
- deliverable tecnico valutativo;
- pricing workbook;
- PEF/modello finanziario;
- deliverable con deadline non validata;
- deliverable obbligatorio con page limit.

## `/tenders/:tender_id/requirements` - Requisiti e KPI T4

### Obiettivo

Mostrare requisiti O&M, KPI non finanziari e compliance in modo filtrabile.

### Wireframe funzionale

```text
Header: Requisiti e KPI
Tabs: Requisiti | KPI | Compliance | Cluster

Cluster strip:
Operations | Maintenance | Workforce | Safety | Customer | Compliance

Tabella:
Dominio | Requisito/KPI | Mandatory | Target/Formula | Fonte | Stato | Review | Link T5/T6
```

### Dati minimi

- `requirements.mandatory_count`;
- `kpi.critical_count`;
- P1 operations, maintenance, workforce, customer e compliance;
- source refs;
- review gate.

### Azioni

- filtra per dominio O&M;
- apri fonte;
- apri cost driver collegati;
- manda KPI economico a T5/review;
- conferma/correggi/contesta requisito;
- marca come non applicabile.

### Stati

- requisito mandatory non validato;
- KPI con formula o target da review;
- compliance safety/cyber/data L2 o review;
- requisito collegato a Financials;
- AI L1 bloccata da data policy.

### Fixture richiesta

Almeno:

- requisito operations mandatory;
- KPI con target;
- KPI collegato a bonus/malus;
- compliance cyber/data;
- requisito maintenance high-risk;
- item AI L1 da approvare.

## `/tenders/:tender_id/financials` - Financials T5

### Obiettivo

Mostrare stato, struttura, fonti e analisi dei contenuti economici del Tender senza trattarli come protetti per categoria.

### Wireframe funzionale

```text
Header: Financials
Policy band: AI/data policy + review state

Summary:
[Workbook prezzi] [Meccanismo remunerazione] [Penali] [Garanzie] [Review aperte]

Tabella Financials:
Classe | Documento | Sheet/Sezione | Stato parsing | Stato AI | Stato review | Link cost driver | Fonte
```

### Dati minimi

- `financial.payment_mechanism.summary`;
- `financial.pricing_documents.present`;
- `financial.review_count`;
- `financial.ai_analysis_status`;
- `financial.model.required`;
- P1 financial indexation, bonus/malus, penalties, guarantees.

### Azioni

- apri fonte;
- avvia o rivedi analisi AI se policy e quota lo consentono;
- apri review Financials;
- marca item come L2 solo se contiene dati interni/offerta, personali o clausole incompatibili;
- collega a cost driver;
- segnala parser issue;
- sospendi AI esterna solo se policy, privacy level, clausola o quota lo richiedono.

### Stati

- workbook presente ma non classificato;
- meccanismo di remunerazione da review;
- parser locale incompleto;
- AI ammessa ma in attesa di quota/provider;
- L2 effettivo bloccato verso provider esterni;
- valore economico non validato non mostrabile in overview.

### Fixture richiesta

Almeno:

- sintesi meccanismo di remunerazione da review;
- workbook pricing presente;
- penale/deduction;
- garanzia;
- item L2 nascosto a viewer;
- parser issue su sheet.

## `/tenders/:tender_id/cost-drivers` - Cost driver T6

### Obiettivo

Mostrare obblighi e attività che generano costo o rischio operativo, senza stimare l’offerta.

### Wireframe funzionale

```text
Header: Cost driver
Matrix: dominio O&M x livello rischio

Tabella:
Driver | Dominio | Rischio | Fonte | Collegamenti T4/T5/T3 | Stato | Review
```

### Dati minimi

- `cost_drivers.top_count`;
- P1 energy responsibility;
- asset renewal;
- subcontracting constraints;
- reporting burden;
- link a requisiti, Financials e deliverables.

### Azioni

- filtra high/critical;
- filtra financial-linked;
- apri fonte;
- apri financial review collegata;
- conferma driver;
- marca assunzione non ammessa.

### Stati

- driver high/critical non validato;
- driver collegato a Financials con AI/review gate;
- driver senza fonte;
- AI L1 non ammessa;
- importo non disponibile e non stimato.

### Fixture richiesta

Almeno:

- driver workforce;
- driver energy;
- driver asset renewal;
- driver reporting burden;
- driver financial-linked;
- driver high risk da review.

## `/tenders/:tender_id/contradictions` - Criticità candidate T7

### Obiettivo

Mostrare candidate issues e conflitti, senza presentarli come verità.

### Wireframe funzionale

```text
Header: Criticità
Tabs: Critiche | Timeline | Versioning | Financials | Tutte

Tabella:
Issue | Tipo | Severity | Fonte A | Fonte B | Stato review | Azione consigliata | Chiarimento

Comparison drawer:
Fonte A affiancata a Fonte B, con decisione review
```

### Dati minimi

- `contradictions.critical_count`;
- `contradictions.timeline_count`;
- `contradictions.versioning_count`;
- `contradictions.financial_count`;
- source refs coinvolte;
- review item collegato.

### Azioni

- apri fonti affiancate;
- conferma candidate issue;
- contesta;
- marca da chiarire;
- crea thread di chiarimento;
- collega a dashboard blocker.

### Stati

- candidate issue non reviewata;
- issue contestata;
- issue confermata;
- issue superata da addendum;
- issue Financials con L2 effettivo solo se classificato;
- chiarimento non approvato.

### Fixture richiesta

Almeno:

- mismatch timeline;
- version conflict;
- criticità Financials;
- ambiguity non bloccante;
- issue che genera thread di chiarimento.

## `/tenders/:tender_id/queries` - Q&A T8

### Obiettivo

Gestire gli scambi Q&A tra bidder e stazione appaltante senza invio automatico. La route tecnica resta `/queries`, ma l’etichetta UI preferita è **Q&A**.

### Wireframe funzionale

```text
Header: Q&A
Policy band: invio automatico disabilitato

Registro Q&A:
Oggetto | Stato | Issue collegata | Fonte | Sensibilità | Approvazione | Risposta ente | Ultima modifica

Editor leggero:
Bozza domanda | Risposta ricevuta | Fonti citate | Note interne | Azioni approvazione/export
```

### Dati minimi

- `clarification_ready_count`;
- `clarification_blocked_sensitive_count`;
- linked contradiction/review item;
- source refs;
- approval status.
- eventuale risposta ricevuta dalla stazione appaltante;
- flag di impatto su dashboard, timeline, deliverable o requisiti.

### Azioni

- crea thread da review item;
- modifica testo;
- marca pronta;
- approva per export se owner/reviewer delegato;
- registra risposta ricevuta;
- marca risposta come incorporata dopo review;
- dismiss;
- blocca per sensibilità;
- copia/esporta manualmente solo se approvato.

### Stati

- candidate;
- draft_question;
- under_review;
- approved_for_export;
- sent_to_authority;
- answered;
- incorporated;
- dismissed;
- blocked_sensitive;
- source refs insufficienti.

### Fixture richiesta

Almeno:

- chiarimento con bozza domanda da approvare;
- chiarimento bloccato perché sensibile;
- chiarimento con source refs insufficienti;
- chiarimento approvato per export;
- chiarimento con risposta ricevuta da incorporare;
- chiarimento dismissed.

## `/tenders/:tender_id/review` - Review queue

### Obiettivo

Centralizzare le decisioni umane critical-first.

### Wireframe funzionale

```text
Header: Review queue
Preset: Da fare oggi | Blocca dashboard | Q&A e criticità | Financials e KPI | Versioni e timeline

Lista item:
Rischio | Blocking | Famiglia | Titolo | Valore proposto | Fonte | Stato | Azioni

Detail panel:
Proposta, fonti, conflitti, audit, impatto dashboard, azioni avanzate
```

### Dati minimi

- `review.items.blocking_count`;
- `review.items.open_count`;
- `review.items.overdue_count`;
- `ReviewItem`;
- `SourceReference`;
- `ValidationAction`;
- linked indicator.

### Azioni

- conferma;
- correggi;
- contesta;
- da chiarire;
- superato;
- non applicabile;
- chiedi più evidenza;
- crea thread di chiarimento;
- apri fonte.

### Stati

- nessun item;
- item critical blocking;
- item Financials con stato AI/review;
- item chiarimento/Q&A;
- item contestato;
- item corretto;
- dashboard state aggiornato dopo azione.

### Fixture richiesta

Almeno dieci item, distribuiti tra T1-T8, con rischio critical/high/medium/low e almeno tre blocking.

## `/tenders/:tender_id/audit` - Audit e data policy

### Obiettivo

Rendere verificabile cosa ha fatto TRAM e perché.

### Wireframe funzionale

```text
Header: Audit
Tabs: Job | AI calls | Policy | Parser issues | Azioni utente

Job table:
Run | Task | Stato | Durata | Input | Output | Errori

AI table:
Provider | Modello | Prompt version | Gate | Costo stimato | Quota | Stato

Policy panel:
Profilo gara | Clause scan | L0/L1/L2 | Provider ammessi | Budget
```

### Dati minimi

- extraction runs;
- parser issues;
- `AiGateDecision`;
- `AiCall`;
- provider policy status;
- data policy gara;
- validation actions.

### Azioni

- apri dettaglio job;
- retry job se permesso;
- sospendi AI;
- approva L1 se owner;
- apri policy;
- esporta audit solo se in futuro approvato.

### Stati

- nessun run;
- run in corso;
- run fallito;
- quota AI esaurita;
- provider policy stale;
- clause scan unclear;
- L2 bloccato.

### Fixture richiesta

Almeno:

- parsing completato;
- parsing fallito;
- AI L0 ammessa;
- L1 in attesa owner;
- L2 bloccata;
- quota esaurita;
- azione review registrata.

## Comportamento per ruolo

| Azione | Owner | Editor | Reviewer | Viewer |
| --- | --- | --- | --- | --- |
| Vedere dashboard | sì | sì | sì | sì |
| Caricare documenti | sì | sì | no | no |
| Avviare parsing | sì | sì | no | no |
| Vedere L2 | sì | opzionale | opzionale | no |
| Validare review | sì | proposta | sì | no |
| Chiudere blocker | sì | no | sì | no |
| Creare thread di chiarimento | sì | sì | sì | no |
| Approvare export chiarimento | sì | no | se delegato | no |
| Approvare L1 esterna | sì | no | se delegato | no |

La UI non deve solo nascondere le azioni: deve spiegare quando un’azione è bloccata per ruolo, policy, quota o review.

## Stati responsive

Desktop:

- sidebar persistente;
- tabelle dense;
- drawer fonte laterale;
- filtri visibili.

Tablet:

- sidebar comprimibile;
- tabelle con colonne prioritarie;
- drawer full-height.

Mobile:

- menu route compatto;
- liste al posto delle tabelle più larghe;
- solo colonne essenziali;
- azioni secondarie in menu.

## Fixture comuni richieste

Le fixture applicative sono definite in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-application-fixtures-v0-1.md`.

Dovranno includere:

- quattro gare archetipali;
- almeno cinque stati dashboard;
- almeno quaranta indicatori tra P0 e P1;
- almeno trenta source reference sintetiche o sanificate;
- almeno dieci document version;
- almeno dieci review item;
- almeno cinque thread di chiarimento;
- almeno cinque contradiction candidate;
- almeno cinque eventi timeline;
- almeno sei deliverable;
- almeno sei requisiti/KPI;
- almeno cinque financial item con stati AI/review diversi;
- almeno cinque cost driver;
- almeno sei audit event;
- una route strip per ogni gara con 8 nodi primari, stati, connessioni fonte-review contestuali e resa mobile completa.

## Acceptance criteria wireframe

I wireframe funzionali sono sufficienti quando:

- ogni route ha scopo, dati, azioni, stati e fixture richieste;
- ogni vista T1-T8 è rappresentata;
- review queue e pannello fonte sono trasversali;
- la route strip è definita come componente derivato, coerente con la direzione networked control room;
- Financials e Q&A hanno guardrail espliciti;
- T7 resta candidate-first;
- ruoli e data policy sono riflessi nella UI;
- il prossimo documento può definire fixture applicative senza ridiscutere la struttura delle viste.

## Debiti non chiusi

- Derivare le viste specialistiche dal mock canonico e dalla direzione networked control room senza creare varianti parallele.
- Mantenere le viste specialistiche future allineate a contract, fixture compatte e direzione networked control room.
- Definire testi UI finali e glossario prodotto.
- Definire export PDF/Excel solo dopo stabilizzazione dashboard.
- Rimandare naming definitivo, logo completo e brand system esteso a dopo il primo mock dashboard validato.

## Prossimo passo consigliato

Usare il fixture pack sintetico compatto chiuso in Fase 2 e il data contract chiuso in Fase 3 come base di **Fase 4 - prototipo applicativo su fixture** e per le verifiche UI desktop/mobile.

La checklist di sviluppo/verifica MVP è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-development-verification-checklist-v0-1.md`.
