# TRAM V1 - Tassonomia indicatori gara O&M

Data: 2026-05-12
Stato: bozza guida per griglie, dashboard e data model V1

## Perché serve

La griglia TRAM non deve limitarsi ai nomi indicati dall’utente o ai capitoli più visibili dei documenti. Deve usare una tassonomia autonoma, pensata per gare O&M di trasporto pubblico, e poi adattarla al pacchetto specifico.

L’obiettivo è far emergere rapidamente:

- che cosa si compra;
- quanto dura;
- quanto costa o può costare;
- chi porta quali rischi;
- come viene misurata la performance;
- quali obblighi generano lavoro operativo;
- quali informazioni mancano, divergono o sono superate.

## Fonti di orientamento

Fonti consultate o usate come riferimento metodologico:

- Metroselskabet e EU Tenders per il caso Copenhagen;
- Federal Transit Administration, Transit Asset Management performance measures: https://www.transit.dot.gov/PerformanceManagement
- SFMTA performance metrics, per esempi di indicatori di servizio, customer experience, accessibility, service quality, resiliency e asset condition: https://www.sfmta.com/performance-metrics
- Victorian Auditor-General’s Office, audit sulla manutenzione railway assets Melbourne, utile per distinguere maintenance performance, asset performance, asset condition e oversight: https://www.audit.vic.gov.au/report/maintaining-railway-assets-across-metropolitan-melbourne
- AIAI O&M Toolkit, utile per performance monitoring, KPI, payment mechanism, deductions e O&M provider financial capacity: https://aiai-infra.org/o-m-toolkit-performance-monitoring/
- AIAI O&M Toolkit, key concepts, utile per availability payments, revenue risk e deductions: https://aiai-infra.org/o-m-toolkit-key-concepts/
- UITP / Allens, Frameworks for Our Networks, utile come benchmark internazionale di contratti bus, rail, ferry e light rail su operational performance, asset management, customer experience e altri KPI: https://www.uitp.org/publications/frameworks-for-our-networks-a-review-of-public-transport-service-contracts-in-australia-and-new-zealand/
- UITP, Authorities: Strategic Conditions & Prerequisites, utile per service quality measurement, KPI comparabili e customer experience: https://www.uitp.org/wp-content/uploads/sites/7/2026/03/20260318_Strategic-Conditions-Authorities_WEB.pdf
- PNNL O&M KPI guidance, utile per evitare liste troppo lunghe e distinguere KPI da metriche operative;
- letteratura ferroviaria su maintenance performance indicators, utile come conferma che il dominio maintenance richiede indicatori specifici e non solo availability/punctuality.

## Metodo AI-assisted da validare

Il passaggio manuale fatto sui primi pacchetti non rappresenta il comportamento finale di TRAM. Serve a costruire un golden benchmark, cioè un set di esempi verificati contro cui misurare la qualità della futura pipeline.

Non è ancora deciso se tutti questi task debbano essere svolti dall’AI, solo alcuni, o se alcune parti debbano restare rule-based o manuali. L’ipotesi da validare è:

1. parsing deterministico dei file e metadati;
2. classificazione AI-assisted di documento, fase, ruolo, versione e stato;
3. estrazione AI su schema standard, sempre con fonte, pagina o riferimento testuale;
4. normalizzazione degli indicatori rispetto alla tassonomia TRAM;
5. riconciliazione cross-documento per trovare valori divergenti, documenti superati e contraddizioni;
6. generazione di alert, domande all’utente e chiarimenti/Q&A verso la stazione appaltante;
7. validazione o correzione da parte dell’utente esperto;
8. salvataggio del feedback come conoscenza controllata e tracciabile.

Quindi, in questa fase, TRAM non va progettato come “AI che decide tutto”, ma come sistema che decide task per task quale livello di automazione è sensato.

## Matrice automazione da validare

| Classe task | Candidato rule-based | Candidato AI-assisted | Candidato human-only |
| --- | --- | --- | --- |
| Ingestion | file type, dimensione, hash, path, OCR necessario | riconoscimento documento da titolo/contenuto | scelta di caricare o scartare documenti sensibili |
| Versioning | filename, document ID, issue date, checksum | clean vs track changes, superseded-by, confronto semantico | approvazione dello stato “corrente” in caso ambiguo |
| Timeline | date esplicite, `.mpp`, tabelle calendario | deduzione di milestone non tabellari | decisione su date contraddittorie o superate |
| Requisiti | pattern MR, shall, must, deliverable, report | classificazione requisito, cluster O&M, impatto costo/rischio | interpretazione legale definitiva |
| KPI | formule e soglie esplicite | normalizzazione KPI e collegamento a bonus/malus | validazione di formule critiche |
| Financials | celle Excel, currency, formule esplicite | sintesi payment mechanism e cost drivers | giudizio finale sulla sostenibilità economica |
| Contraddizioni | mismatch identici o numerici | conflitti semantici tra documenti, versioni e fonti | decisione se inviare un chiarimento alla stazione appaltante |
| Chiarimenti/Q&A | template e campi obbligatori | bozza argomentata con riferimenti fonte, risposta ricevuta e impatto su review | invio o approvazione finale |

Questa matrice dovrà diventare una decisione di architettura prima di scrivere codice.

La proposta più dettagliata è nel documento:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-automation-decision-matrix.md`

## Regola di prodotto

TRAM deve distinguere tre livelli:

1. **Indicatori executive**: pochi, leggibili in dashboard, utili a capire la gara in meno di un minuto.
2. **Indicatori analitici**: più dettagliati, utili a chi deve costruire offerta, costi, piani e chiarimenti/Q&A.
3. **Metriche sorgente**: valori puntuali estratti dai documenti, anche numerosi, che alimentano indicatori e alert.

Non tutto deve diventare dashboard. Alcuni dati devono restare in tabelle analitiche o nel layer di evidenze.

## Indicatori executive V1

Questi sono i blocchi che TRAM dovrebbe mostrare o sintetizzare per ogni spazio/gara.

| Famiglia | Indicatore | Perché conta |
| --- | --- | --- |
| Identità gara | Nome, stazione appaltante, paese, modalità, fase procurement | Serve a orientare subito lo spazio |
| Procurement | Tipo procedura, fase corrente, prossima scadenza, eventi condizionati | Determina urgenza e regole di gara |
| Contratto | Durata base, opzioni estensione, mobilizzazione, Start of Operation, fine contratto | Determina orizzonte economico e operativo |
| Scope O&M | Linee, km, stazioni, sistemi, asset, servizio 24/7, automazione | Determina scala e complessità |
| Financials | valore stimato, payment mechanism, price structure, bonus/malus, penalties, escalation/indexation, capex/opex/reinvestment | Determina sostenibilità economica e rischio offerta |
| Performance | KPI principali, soglie, formule, periodicità, bonus/malus, data sources | Determina come verrà giudicato il provider |
| Maintenance e assets | asset condition, useful life, maintenance plan, backlog, inspections, fault rates, spares, obsolescence | Determina rischio tecnico e costi nascosti |
| Operations | headway, service availability, punctuality/precision, disruption management, fallback operation, event management | Determina rischio operativo quotidiano |
| Customer/passenger | customer satisfaction, passenger information, accessibility, complaints, security perception, service disruption communication | Determina qualità percepita e penalità reputazionali |
| Workforce | staff transfer, key persons, staffing model, 24/7 manning, training, labour/social clauses | Determina costo, mobilizzazione e rischio HR |
| Compliance | safety, security, cyber, data protection, environmental, sanctions, AI constraints | Determina vincoli non negoziabili |
| Deliverables | deliverable di tender, deliverable contrattuali, report, piani, procedure, frequenze | Determina lavoro da produrre e presidiare |
| Risk allocation | responsabilità provider/authority, claims notice, force majeure, third-party works, interface risks | Determina esposizione economica e chiarimenti da aprire |
| Versioning | versioni, addendum, chiarimenti, track changes, documenti superati | Determina quale “verità” è corrente |
| Data quality | fonti discordanti, dati mancanti, OCR/parser issues, document lists non allineate | Determina confidenza e intervento umano |

## Indicatori analitici suggeriti

### Procurement e gara

- stage: prequalifica, ITT, ITN, negoziazione, revised tender, BAFO, award, addendum;
- procedure type;
- tender platform;
- submission method;
- deadline e timezone;
- standstill;
- bidder questions e clarification windows;
- negotiation meetings;
- evaluation model;
- prezzo/qualità e pesi;
- mandatory forms;
- page limits;
- reservations policy;
- prequalified tenderers, quando informazione pubblica o presente nel pacchetto.

### Contratto e durata

- contract signing;
- commencement date;
- mobilisation start;
- mobilisation duration;
- readiness milestones;
- Start of Operation;
- Operation Period;
- expiry date;
- extension options;
- demobilisation obligations;
- handover obligations;
- hyper care o early operation period;
- termination triggers;
- step-in rights;
- penalties e liquidated damages.

### Financials e payment

- estimated value;
- bid price structure;
- evaluated price formula;
- payment frequency;
- fixed/variable components;
- availability payments;
- unit prices;
- indexation/escalation;
- bonus;
- deductions/penalties;
- caps/collars;
- pain/gain share;
- reimbursable vs included costs;
- capex, opex, reinvestment, lifecycle cost;
- energy cost allocation;
- spare parts responsibility;
- insurance and guarantees;
- performance bond;
- parent company guarantee;
- currency;
- tax/VAT treatment;
- financial model presence.

### Performance e KPI

- KPI name;
- KPI family;
- formula;
- target;
- threshold;
- measurement period;
- responsible party;
- data source;
- exclusions;
- bonus/malus linkage;
- reporting frequency;
- audit rights;
- trend requirement;
- corrective action trigger.

### Operations

- operating hours;
- headway plans;
- scheduled service volume;
- planned vehicle kilometres;
- service availability;
- service precision/punctuality;
- delay attribution;
- disruption response;
- fallback operation;
- crowd/event management;
- passenger information during disruption;
- control room duties;
- station operations;
- security and emergency response.

### Maintenance e asset management

- asset classes;
- asset owner;
- asset handover;
- baseline condition;
- condition assessment;
- maintenance strategy;
- preventive maintenance;
- corrective maintenance;
- predictive maintenance;
- backlog;
- inspections;
- fault rates;
- MTBF e MTTR, se presenti;
- CMMS requirements;
- obsolescence management;
- spare parts strategy;
- critical spares;
- tools and equipment;
- asset renewal/reinvestment interface;
- lifecycle management.

### Customer e qualità servizio

- customer satisfaction;
- complaints;
- response time to complaints;
- passenger information;
- accessibility obligations;
- cleanliness;
- perceived safety/security;
- service information accuracy;
- ticketing/customer service;
- social media o public communication, se rilevante.

### Workforce e organizzazione

- transfer of employees;
- key persons;
- CV requirements;
- staffing levels;
- 24/7 manning;
- training;
- certifications;
- subcontractor limits;
- consortium rules;
- labour clauses;
- diversity/social clauses;
- H&S organization.

### Compliance, dati e tecnologia

- safety management;
- security;
- cyber security;
- data protection;
- AI clause;
- export controls/sanctions;
- environmental management;
- energy/carbon reporting;
- information sharing platform;
- data ownership;
- IPR;
- audit/logging;
- document searchability;
- reporting system interfaces.

### Document intelligence

- document role;
- document ID;
- version number;
- issue date;
- clean vs track changes;
- supersedes/superseded by;
- effective status;
- mandatory vs information-only document;
- cross references;
- definitions;
- contradictions;
- missing annexes;
- document list mismatch;
- OCR/text extraction confidence.

## Priorità MVP

Il registro operativo delle chiavi P0/P1 è definito in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-key-registry-p0-p1-v0-1.md`

### P0 - Da includere nella prima dashboard

- identità gara;
- fase procurement;
- prossime scadenze;
- durata contratto;
- scope network/O&M;
- document map;
- tender deliverables;
- evaluation model;
- KPI principali;
- financial/payment summary, anche se incompleto;
- top risks/open issues.

### P1 - Da includere nella prima analisi strutturata

- cost drivers;
- payment mechanism;
- bonus/malus;
- penalties;
- asset condition e maintenance obligations;
- reporting obligations;
- workforce/staff transfer;
- versioning e addendum;
- compliance/cyber/data/AI;
- chiarimenti candidati.

### P2 - Da rimandare dopo il primo MVP

- calcolo automatico completo dei bonus/malus;
- simulazioni economiche;
- confronto automatico tra più offerte;
- scoring di rischio avanzato;
- apprendimento cross-gara;
- benchmark storico V3.

## Implicazione per Copenhagen

La griglia Copenhagen va ampliata perché oggi copre bene network, timeline, deliverable, KPI e cost drivers, ma deve esplicitare meglio:

- financials;
- payment mechanism;
- durata e opzioni;
- risk allocation;
- workforce;
- compliance e AI;
- customer/passenger experience;
- asset condition;
- data sources e reporting;
- indicatori di qualità documentale.

## Implicazione per Luas

Quando applicheremo la griglia a Luas, la tassonomia va usata come guida e non come schema rigido. Alcuni indicatori saranno pieni, altri assenti, altri emergeranno con nomi diversi. Il valore di TRAM sarà proprio normalizzarli senza perdere la formulazione originale dei documenti.
