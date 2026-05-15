# TRAM ADR 001 - Sede runtime dei normalizzatori AI

Data: 2026-05-13
Stato: accettata come default MVP, da rivalidare all’avvio del codice
Ambito: normalizzatori AI, AI gateway, worker documentale, review queue

## Contesto

TRAM V1 prevede:

- app TypeScript containerizzabile;
- worker Python documentale separato;
- AI gateway interno gratuito/capped;
- registro `AiCall`;
- review queue evidence-first;
- normalizzatori deterministici post-AI per impedire che l’output del modello diventi verità applicativa senza controlli.

La specifica T4-T8 ha chiarito che i normalizzatori non sono semplici parser. Sono il confine di sicurezza tra:

- raw output AI;
- valori deterministici da parser/regole;
- data model applicativo;
- review queue;
- audit, privacy e cost gates.

Serve quindi decidere dove vivranno quando inizierà il codice.

## Decisione

Il runtime canonico dei normalizzatori TRAM V1 sarà TypeScript, lato app/API/AI gateway.

La configurazione resta dichiarativa e condivisa:

- config: `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json`;
- specifica consolidata: `/Users/Matteo/Documents/TRAM/docs/AI_AND_DOCUMENT_PIPELINE.md`;
- architettura consolidata: `/Users/Matteo/Documents/TRAM/docs/ARCHITECTURE.md`.

Il worker Python documentale non sarà la sede canonica dei normalizzatori AI. Potrà:

- produrre evidenze, chunk, tabelle, OCR, MPP, Excel e candidate rule-based;
- leggere il config per pre-check o export fixture;
- validare localmente forme semplici quando utile;
- inviare al gateway envelope minimizzati e source refs.

La normalizzazione che produce record applicativi, review item, audit e stati finali resta nel livello TypeScript governato dall’AI gateway.

## Perché

### 1. I normalizzatori scrivono verità applicativa proposta

T4, T6, T7 e T8 non producono solo file intermedi. Producono o preparano:

- `Requirement`;
- `KPI`;
- `CostDriver`;
- `ContradictionCandidate`;
- `ClarificationDraft`;
- `ReviewItem`;
- audit collegato ad `AiCall`.

Questi oggetti appartengono al dominio applicativo e alla review queue. Tenerli nel runtime app riduce duplicazioni e rende più chiaro quale componente decide lo stato finale.

### 2. Il gateway AI deve applicare gate e normalizzazione nello stesso confine

Il gateway AI decide:

- provider;
- modello;
- privacy level;
- costo/quota;
- policy e clausole;
- sospensione o blocco;
- hash input/output;
- schema compliance.

Il normalizzatore deve vedere la stessa `route_decision`. Separare gate e normalizzazione in runtime diversi aumenterebbe il rischio di divergenze.

### 3. Il worker Python deve restare documentale

Python è la scelta giusta per:

- PDF;
- OCR;
- DOCX;
- XLS/XLSX;
- MPP;
- parsing tecnico;
- estrazione tabelle;
- preprocessing documentale.

Non deve diventare anche la fonte primaria di business state, review queue e chiarimenti/Q&A. Questo mantiene il worker sostituibile e scalabile.

### 4. Il config JSON riduce il lock-in del runtime

La parte più stabile e auditabile resta in config/schema:

- enum;
- alias;
- campi vietati;
- campi rule-owned;
- review forces;
- severity rules;
- status rules.

Così Python può leggere lo stesso contratto, ma l’esecuzione canonica resta una sola.

## Opzioni considerate

### Opzione A - Normalizzatori canonici in TypeScript

Decisione scelta.

Vantaggi:

- vicino ad app, data model, review queue e AI gateway;
- migliore controllo su `AiCall`, `ReviewItem`, audit e stati;
- più semplice per UI e API;
- evita duplicare logica business in Python;
- coerente con app TypeScript containerizzabile.

Svantaggi:

- richiede passare al gateway gli output del worker;
- parsing documentale e normalizzazione stanno in runtime diversi;
- alcune fixture potranno richiedere wrapper Python solo per preparare input.

### Opzione B - Normalizzatori canonici in Python worker

Scartata per MVP.

Vantaggi:

- vicino a parser, OCR e artifact documentali;
- comodo per batch documentali;
- riusa toolchain già prevista.

Svantaggi:

- sposta logica applicativa e review queue nel worker;
- aumenta il rischio di due fonti di verità;
- rende più complesso audit `AiCall` e gate provider;
- avvicina il worker a decisioni su chiarimenti, dashboard e record applicativi.

### Opzione C - Solo config/schema condiviso, runtime doppio

Scartata come default, mantenuta come possibile evoluzione per test.

Vantaggi:

- massima portabilità;
- Python e TypeScript possono validare gli stessi casi;
- utile per fixture e CI futura.

Svantaggi:

- rischio alto di divergenza tra implementazioni;
- debugging più costoso;
- poco necessario in MVP.

Decisione: config condiviso sì, runtime canonico doppio no.

### Opzione D - Normalizzazione in database o stored procedure

Scartata.

Vantaggi:

- centralità del dato;
- possibile enforcement vicino al DB.

Svantaggi:

- difficile da testare sui benchmark AI;
- poco adatta a testo, warning e dropped fields;
- lock-in su Postgres procedural logic;
- meno leggibile per sviluppo iterativo.

## Conseguenze operative

Quando inizierà il codice:

1. creare un modulo TypeScript dedicato, per esempio `normalizers` o equivalente;
2. caricare il config JSON versionato;
3. implementare un `NormalizerCore` comune;
4. implementare normalizzatori T4, T6, T8 e poi T7;
5. collegare output normalizzato ad `AiCall`, `Extraction`, `ReviewItem` e record dominio;
6. mantenere il worker Python limitato a parsing, OCR, extraction e candidate generation;
7. testare i normalizzatori con le fixture documentate;
8. aggiungere test Python solo se servono a garantire compatibilità degli envelope prodotti dal worker.

## Regola di integrazione app-worker

Il worker Python può produrre:

- `prompt_envelope`;
- `source_refs`;
- `deterministic_values`;
- candidate T4/T5/T6/T7;
- artifact tecnici.

Il gateway/app TypeScript produce:

- `route_decision`;
- chiamata AI o blocco;
- `AiCall`;
- output normalizzato;
- `ReviewItem`;
- stato finale del run;
- link a record dominio.

Se in futuro un job documentale gira interamente in un worker separato, quel worker dovrà chiamare il servizio normalizzatore TypeScript o eseguire lo stesso package TypeScript in un container dedicato. Non deve nascere una seconda implementazione canonica in Python.

## Impatto su T4-T8

| Task | Runtime canonico | Nota |
| --- | --- | --- |
| T4 requisiti/KPI | TypeScript normalizer | Parser fornisce testo, formule e source refs; normalizer ripristina campi rule-owned |
| T6 cost driver | TypeScript normalizer | Link e privacy inheritance restano controllati dal gateway/app |
| T7 contraddizioni | TypeScript normalizer | Severity/action restano rules/review-first |
| T8 chiarimenti/Q&A | TypeScript normalizer | Human approval e status sono sempre forzati lato app |
| T5 financials/payment | Python parser + AI normalizer/gateway su chunk ammessi + review | Provider esterno ammesso su L0/L1 minimizzato; L2 effettivo bloccato o self-hosted |

## Impatto su test

Il primo harness di test dovrà essere TypeScript.

Minimo richiesto:

- leggere config JSON;
- leggere input envelope e raw output benchmark;
- produrre normalized output;
- verificare assert fixture;
- verificare dropped fields, warning e review gates;
- fallire se T8 produce output approvato o inviabile;
- fallire se T7 usa severity/action AI come verità.

Test Python futuri possono verificare che il worker produca envelope compatibili, non che normalizzi la verità applicativa.

## Rischi

| Rischio | Mitigazione |
| --- | --- |
| Duplicazione tra Python e TypeScript | Python non implementa normalizzatore canonico |
| Config troppo complesso | mantenere config declarativo, non trasformarlo in linguaggio nascosto |
| Gateway troppo carico | separare in futuro un servizio/container normalizer TypeScript |
| Fixture troppo legate ai benchmark attuali | aggiungere fixture sintetiche minimizzate per casi vietati |
| Cambi data model | mantenere normalizzatori orientati a output logico e mapping separato |

## Decisioni da non prendere ora

Questo ADR non decide ancora:

- framework finale app, Next.js o TanStack Start;
- struttura esatta dei package TypeScript;
- ORM o query builder;
- schema DB definitivo;
- CI e harness reali;
- deploy del servizio normalizer;
- eventuale condivisione package tra app e worker.

## Debiti

- Quando inizierà il codice, creare una mini ADR o sezione tecnica su package layout.
- Definire se il config JSON resterà in `data/config` o migrerà in una cartella applicativa versionata.
- Definire fixture sintetiche minimizzate per campi vietati e L2.
- Specifica viste dashboard e review workflow consolidata in `/Users/Matteo/Documents/TRAM/docs/UX_REVIEW_WORKFLOW.md`.
- Usare il registro indicatori consolidato nei documenti `/Users/Matteo/Documents/TRAM/docs/UX_REVIEW_WORKFLOW.md` e `/Users/Matteo/Documents/TRAM/docs/AI_AND_DOCUMENT_PIPELINE.md`.

## Prossimo passo consigliato

Preparare fixture applicative minime per normalizzatori e dashboard usando il registro `indicator_key`, il primo slice UI e il workflow ingestion-dashboard.
