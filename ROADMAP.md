# TRAM - Roadmap

Questo documento governa priorità, milestone, criteri di uscita e debiti visibili. I dettagli tecnici vivono nei documenti di area, ma la roadmap deve conservare le decisioni operative già concordate.

## Stato Corrente

Fase corrente: **Fase 7 - Pilot interno e stabilizzazione MVP**, avviata con piano operativo.

Fase appena chiusa: **Fase 6 - Estrazioni T1-T8 e pilot-ready**.

Fasi già chiuse o assorbite:

- Fase 0 - Governance MVP/V0: chiusa.
- Fase 1 - Wireframe funzionali e direzione visuale: chiusa.
- Fase 2 - Fixture applicative non riservate: chiusa su fixture pack sintetico.
- Fase 3 - Data contract MVP/V0: chiusa e coperta da fixture/test.
- Consolidamento documentale: chiuso, da 85 Markdown a 12 Markdown governanti.

Verifica tecnica più recente:

```bash
npm run verify
```

Esito: lint, typecheck, 41 test Vitest e build Next passati sul branch locale corrente.

## Perimetro MVP/V0

Il primo MVP TRAM è una **V0 operativa interna**: navigabile, verificabile e utile su fixture e workflow controllati. Non è la V1 completa.

Tutte le aree `T1`-`T8` devono essere visibili o rappresentate, ma non tutte hanno lo stesso livello di automazione:

- `T1`, `T2`, `T3`: nucleo end-to-end.
- `T4`, `T6`: aree MVP controllate, AI solo su input ammessi e minimizzati.
- `T5`: dominio Tender analizzabile con parser/regole e AI ammessa solo secondo data policy e gate.
- `T7`: candidate issues rules/review-first, non verità automatica.
- `T8`: Q&A human-first, senza invio automatico.

Baricentro UX:

- dashboard direzionale first;
- prima schermata utile: `/tenders/:tender_id/overview`;
- T1-T8 alimentano overview, rischi, stato e drill-down;
- parser, review queue e viste specialistiche sono il motore di affidabilità;
- l’MVP non deve stimare avanzamento o qualità dell’offerta non caricata.

## Non Obiettivi MVP

Il primo MVP non include:

- confronto dell’offerta preparata con la gara, che resta V2;
- benchmark cross-gara e best practice storiche, che restano V3;
- invio automatico di domande o Q&A alla stazione appaltante;
- scoring economico o sostenibilità dell’offerta;
- AI esterna su L2;
- apprendimento cross-gara non revisionato;
- export PDF/Excel completi come requisito bloccante;
- workflow approvativi multilivello;
- piattaforma enterprise multi-tenant completa.

## Criteri Di Successo MVP

Il primo MVP è riuscito se:

- un utente interno capisce rapidamente stato, priorità e rischi di un Tender senza leggere l’intero pacchetto;
- la document map distingue documenti correnti, superati, dubbi, addendum, redline e conflitti di versione;
- T1, T2 e T3 funzionano end-to-end almeno su fixture e mini pacchetto sintetico;
- T4-T8 sono rappresentati con stati, fonti, policy AI e review coerenti anche se l’automazione è ancora parziale;
- ogni dato mostrato in dashboard ha fonte, stato, rischio e accesso alla review;
- i valori economici, i requisiti mandatory, le contraddizioni e i chiarimenti non vengono consolidati senza validazione umana;
- l’utente può vedere perché un dato è bloccato, stale, contestato o da chiarire;
- l’AI gratuita resta entro budget/quota e si sospende in modo esplicito quando non può procedere;
- nessun dato reale o riservato finisce in Git, log, fixture pubblicabili o screenshot non approvati;
- il prototipo è navigabile su desktop e mobile senza overflow o stati incoerenti.

## Criteri Di Fallimento

Il primo MVP va considerato insufficiente se:

- TRAM si comporta come chat generica sui PDF;
- la dashboard nasconde fonti, stati o incertezze;
- un dato critico appare come verità senza review;
- l’MVP dipende da provider paid, quote non controllate o invio di documenti completi a LLM;
- T2/T3 perdono date, formati, obbligatorietà o deadline perché delegate all’AI;
- T5 mostra importi, formule o meccanismi economici non validati come headline direzionale;
- T8 permette invio automatico o export di chiarimenti senza approvazione;
- i pacchetti benchmark reali vengono trasformati in fixture o log senza sanificazione;
- l’aggiunta di V2/V3 complica l’MVP prima che il nucleo T1/T2/T3 sia affidabile.

## Gate Di Avanzamento

- Da Fase 4 a Fase 5: shell, overview, document map, review queue e source/audit panel devono essere navigabili su fixture, con test locali verdi.
- Da Fase 5 a Fase 6: ingestion locale, hash, parser issues e source reference devono funzionare senza loggare contenuti integrali.
- Da Fase 6 a Fase 7: estrazioni candidate, review gate e readiness devono essere visibili; il pilot reale resta da eseguire.
- Da Fase 7 a Fase 8: T1/T2/T3 devono avere metriche minime su falsi positivi, falsi negativi e blocchi manuali.
- Da Fase 8 a Fase 9: T4/T6 devono avere normalizzazione controllata, review e collegamento a fonti prima di rafforzare T5/T7/T8.
- Da Fase 9 a Fase 10: financials, criticità e Q&A devono essere human-first, auditabili e protetti da policy dati.
- Da Fase 10 a V1: pilot interno, policy dati, hardening e runbook devono essere sufficienti per chiamarla prima versione operativa.
- Da V1 a V2: TRAM deve leggere, versionare e validare bene la gara prima di confrontare l’offerta.
- Da V2 a V3: le offerte e i feedback storici devono avere policy privacy, comparabilità e spiegabilità prima del benchmark cross-gara.

## Fasi

| Fase | Stato | Obiettivo | Output principale | Done quando |
| --- | --- | --- | --- | --- |
| Fase 0 - Governance MVP/V0 | chiusa | Chiarire perimetro, guardrail, indicatori e policy | Documenti governanti, roadmap, ruoli, data policy | Non serve reinterpretare il perimetro prima delle slice operative |
| Fase 1 - Wireframe e visual direction | chiusa | Disegnare esperienza applicativa reale | Route, mock, direzione brand/UI, richiamo TPL | Dashboard e viste minime hanno struttura, stati, fonti e direzione visuale |
| Fase 2 - Fixture applicative | chiusa | Creare dati sintetici non riservati | Fixture pack con tender, indicatori, source reference, review, audit | Le fixture coprono stati dashboard, T1-T8, ruoli e route minime |
| Fase 3 - Data contract | chiusa | Rendere implementabili wireframe e fixture | Shape dati, mapping route-vista-indicatori, effetti review | Ogni componente previsto ha dati sufficienti e test di copertura |
| Fase 4 - Prototipo su fixture | chiusa | Costruire prima esperienza navigabile | Dashboard aggregata, dashboard gara, T1-T8, review, fonte/audit | L’utente capisce gara, priorità, fonti, blocker e può navigare le sezioni |
| Fase 5 - Ingestion e parsing locale | chiusa | Collegare app a pipeline documentale locale | Inventario, hash, parsing, source reference, parser issues | Ogni file produce metadati o errore tracciabile senza loggare contenuti integrali |
| Fase 6 - Estrazioni T1-T8 e pilot | chiusa/pilot-ready | Validare TRAM su pacchetti reali/rappresentativi | Estrazioni controllate, review, gate AI, feedback utenti | Lato prodotto/codice pronto; pilot reale con tre utenti resta debito operativo |
| Fase 7 - Pilot interno e stabilizzazione MVP | in corso | Validare il flusso con utenti e stabilizzare T1/T2/T3 | Scenario pilot, feedback, bugfix, metriche T1/T2/T3 | Tre utenti interni completano un giro utile e i problemi P0/P1 sono tracciati |
| Fase 8 - Robustezza T1/T2/T3 | da fare | Rendere affidabile il nucleo end-to-end | Document map, timeline, deliverable, metriche errore | T1/T2/T3 reggono mini pacchetto sintetico e pacchetto rappresentativo controllato |
| Fase 9 - Estensioni T4-T8 controllate | da fare | Rafforzare requisiti, financials, cost driver, criticità e Q&A | Normalizzazioni, review, policy, Q&A human-first | T4-T8 restano review-first e non consolidano dati critici senza validazione |
| Fase 10 - Preparazione V1 operativa | da fare | Hardening, policy, ruoli e runbook prima della V1 | Policy dati, runbook, backup, ruoli, checklist release | Si può decidere consapevolmente se chiamare TRAM V1 |

## Roadmap MVP Prima Della V1

### Fase 7 - Pilot Interno E Stabilizzazione MVP

Focus:

- scenario pilot interno;
- checklist per tre utenti;
- raccolta feedback su overview, document map, review, audit e source inspector;
- classificazione problemi P0/P1/P2;
- bugfix e cleanup prima di rafforzare i parser;
- decisione esplicita su cosa manca per chiamare il prodotto V1.

Il pilot deve verificare:

- comprensione rapida dello stato Tender;
- utilità della dashboard aggregata e della dashboard gara;
- leggibilità della document map;
- capacità di trovare fonte, stato, rischio e review item;
- chiarezza di timeline, deliverable, requisiti, financials, cost driver, criticità e Q&A;
- comprensione del blocco AI quando policy, quota o privacy non consentono procedere;
- assenza di ambiguità tra dato proposto, dato confermato e dato da chiarire.

Scenario pilot per ogni utente:

1. Aprire la lista Tender.
2. Identificare la gara più critica e spiegare perché.
3. Entrare nella dashboard gara.
4. Trovare una fonte collegata a un indicatore operativo.
5. Aprire document map e verificare documenti vigenti, superati o da verificare.
6. Aprire timeline e deliverable e individuare almeno un item da review.
7. Aprire financials o cost driver e confermare che i valori critici non sono mostrati come verità validata.
8. Aprire criticità e Q&A e verificare che non esista invio automatico.
9. Usare la coda review per simulare conferma, correzione, contestazione e richiesta chiarimento.
10. Aprire audit e spiegare se il pilot è pronto, bloccato o incompleto.

Checklist di osservazione:

- tempo per capire lo stato generale della gara;
- passaggi in cui l’utente cerca una fonte e non la trova;
- label o stati non chiari;
- punti in cui un candidato sembra erroneamente dato validato;
- dati critici privi di contesto sufficiente;
- overflow, clipping, problemi mobile o navigazione confusa;
- azioni review che non comunicano effetto o limite;
- aspettative spontanee su export, confronto offerta o benchmark storico.

Classificazione feedback:

- `P0`: blocca comprensione, sicurezza dati, review umana o fonte; va risolto prima di dichiarare MVP stabile.
- `P1`: riduce molto utilità o fiducia, ma non espone dati né trasforma proposte in verità.
- `P2`: miglioramento di chiarezza, wording, densità o comfort operativo.

Ogni feedback deve avere sezione o route, descrizione osservabile, severità e decisione: fix immediato, backlog MVP, backlog V1 o fuori perimetro. Screenshot solo se non contengono dati riservati.

Criteri di uscita Fase 7:

- tre utenti interni completano lo scenario;
- tutti i `P0` sono risolti o trasformati in stop condition esplicita;
- i `P1` hanno decisione owner e priorità;
- la roadmap registra cosa resta prima della V1;
- `npm run verify` passa dopo eventuali fix;
- eventuali smoke browser desktop/mobile vengono ripetuti se cambiano superfici UI.

Debiti non coperti:

- il pilot non misura ancora accuratezza robusta T1/T2/T3 su pacchetti estesi: quello resta Fase 8;
- il pilot non introduce provider AI esterni né benchmark paid;
- il pilot non abilita invio Q&A, export ufficiali o confronto offerta-gara.

### Slice Operative Fase 7

| Slice | Stato | Obiettivo | Verifica minima |
| --- | --- | --- | --- |
| F7-S1 - Piano pilot interno | completata | Definire scenario, checklist, classificazione feedback e criteri di uscita | Roadmap aggiornata |
| F7-S2 - Sessioni con tre utenti | in corso | Eseguire scenario controllato e raccogliere feedback osservabile | Tre schede feedback classificate P0/P1/P2 senza dati riservati |
| F7-S3 - Triage stabilizzazione | in corso | Decidere fix immediati, backlog MVP, backlog V1 e fuori perimetro | Tutti i P0/P1 hanno decisione owner/priorità |
| F7-S4 - Fix e verifica post-pilot | in corso | Correggere problemi bloccanti e ripetere gate proporzionati | `npm run verify` e smoke UI se cambiano superfici applicative |

Feedback pilot già emerso:

| Route | Feedback | Severità | Decisione |
| --- | --- | --- | --- |
| `/tenders` | Il badge `Criticità aperte` fa identificare correttamente Metro Nord come gara prioritaria | positiva | Mantenere badge come segnale primario |
| `/overview` | La card Timeline comunica priorità, ma il bordo del riquadro risulta tagliato | P2 | Fix UI post-pilot |
| `/timeline` | La vista non rende chiaro il conflitto e non mostra date/riferimenti documentali in modo sufficiente | P1 | Rendere espliciti data, documento fonte e azione di validazione |
| `/documents` | La document map mostra lessico tecnico come parser/metadati e non rende chiaro l’accesso alla fonte | P1 | Tradurre la UI in linguaggio operativo e mostrare riferimenti fonte |
| `/review` | La sezione Da validare manca di gerarchia, scopo e differenza tra azioni | P1 | Ridisegnare gerarchia, CTA, spiegazioni e significato delle azioni |

### Fase 8 - Robustezza T1/T2/T3

Focus:

- document map più robusta;
- confronto MPP/PDF per timeline;
- checklist deliverable più affidabile;
- fixture estese oltre dataset compatto;
- smoke end-to-end su mini pacchetto sintetico.

### Fase 9 - Estensioni T4-T8 Controllate

Focus:

- T4 requisiti/KPI filtrabili;
- T6 cost driver con link a requisiti, Financials e review;
- normalizzatori T4/T6;
- policy L1 più chiara;
- quality metrics per falsi positivi e falsi negativi.

#### Sottofocus Fase 9 - Financials, Criticità E Q&A

Focus:

- T5 parser locale più robusto su workbook e meccanismo di remunerazione;
- T7 regole sulle criticità più forti;
- T8 Q&A con registro, template domanda, approvazione e gestione risposta;
- protezioni L2 e audit accessi;
- export manuale controllato, se approvato.

### Fase 10 - Preparazione V1 Operativa

Focus:

- decisione sul perimetro minimo V1;
- ruoli e permessi applicativi;
- backup e retention;
- logging e audit;
- performance su pacchetti più grandi;
- scelta hosting condiviso e storage.

## V1 - Prima Versione Operativa

V1 inizia solo quando l’MVP è stato validato con pilot interno e il maintainer decide esplicitamente che il perimetro è pronto per essere chiamato V1.

Condizioni minime:

- pilot interno completato con feedback tracciato;
- T1/T2/T3 affidabili su pacchetti sintetici e rappresentativi controllati;
- T4-T8 presenti come flussi controllati e review-first;
- policy dati e provider chiare;
- nessun dato reale in Git, log o screenshot non approvati;
- runbook operativo sufficiente per ambiente condiviso o locale controllato.

## V2 - Confronto Offerta-Gara

V2 inizia solo quando V1 sa leggere e validare bene la documentazione di gara. Il suo scopo è confrontare un’offerta preparata o in preparazione con il Tender.

Possibili superfici:

- verifica copertura requisiti;
- gap tra offerta e capitolato;
- coerenza tra proposta tecnica, economica e amministrativa;
- alert su obblighi non indirizzati;
- suggerimenti per rafforzare l’offerta;
- controllo coerenza tra deliverable richiesti e sezioni dell’offerta;
- confronto tra payment mechanism, rischi economici e assunzioni d’offerta.

Guardrail:

- l’offerta preparata è L2 per default finché non viene definita una policy specifica;
- nessun provider esterno riceve contenuti d’offerta senza decisione esplicita;
- TRAM non deve trasformarsi in autore autonomo dell’offerta;
- suggerimenti e gap restano soggetti a giudizio umano.

## V3 - Memoria Storica E Benchmark Cross-Gara

V3 mette in relazione più gare, più offerte e feedback storici. Non è prerequisito per V1 e non va anticipata nel codice se complica il modello MVP.

Possibili superfici:

- pattern ricorrenti tra gare;
- best practice emerse da offerte precedenti;
- feedback storici riutilizzabili;
- suggerimenti per nuove offerte;
- proposte Q&A o modifiche documentali basate su casi analoghi;
- benchmark interni;
- confronto tra tender simili per requisiti, KPI, payment mechanism, rischi e deliverable.

Guardrail:

- niente apprendimento opaco o non revisionato;
- separare benchmark storici da verità del Tender corrente;
- distinguere sempre casi comparabili e non comparabili;
- proteggere dati interni, offerte precedenti, feedback utenti e informazioni commerciali;
- ogni suggerimento cross-gara deve essere spiegabile e validabile.

## Fase 4 - Prototipo Applicativo Su Fixture

La Fase 4 è chiusa.

Prima di ampliare le viste specialistiche, la dashboard gara va razionalizzata rispetto al mock canonico: il mock è una base visuale, non un port completo da copiare. Ogni widget deve avere utilità operativa, fonte dati e azione o stato chiaro.

Include:

- analisi contenuti della dashboard gara e razionalizzazione widget;
- integrazione selettiva del mock canonico;
- shell, sidebar, route strip, token, T-node e pannello fonte;
- overview direzionale gara;
- dashboard aggregata;
- document map T1;
- review queue e pannello fonte;
- timeline T2 e deliverable T3;
- viste T4-T8;
- audit e data policy;
- stati vuoti, errore, stale, blocked e quota esaurita;
- permessi UI minimi.

Criteri di uscita:

- l’utente capisce quale gara richiede attenzione;
- la dashboard gara non contiene preview ridondanti di tutte le viste T1-T8;
- ogni widget in overview ha fonte dati, stato e azione o motivo di consultazione;
- ogni headline apre fonte o review item;
- si può confermare, correggere, contestare o segnare da chiarire un item;
- una review bloccante porta la gara a `open_critical_issues`;
- un nuovo documento porta la gara a `stale_due_to_new_docs`;
- T5 non espone valori economici non validati in overview;
- T8 non consente invio automatico;
- desktop e mobile non hanno overflow, clipping o testi incoerenti.

## Slice Operative Fase 4

| Slice | Stato | Obiettivo | Verifica minima |
| --- | --- | --- | --- |
| S0 - Setup progetto e guardrail | completata | Base Next.js, npm, fixture, `.gitignore`, storage adapter, test | `npm run verify` passa |
| S1 - Fixture e data contract direzionali | completata | Fixture sintetiche, route contract, review actions, AI gate | `npm run verify` passa con test fixture e data contract |
| S2 - Shell UI e route | completata | Layout comune, sidebar, route principali, stati controllati | Tutte le route previste caricano senza pagina rotta |
| S3 - Dashboard aggregata | completata | Lista gare, filtri, stato, blocker, accesso overview | Smoke Playwright desktop/mobile su `/tenders` |
| S4 - Overview gara | completata | Dashboard direzionale con widget utili e fonti | Smoke Playwright desktop/mobile su `/tenders/:id/overview` |
| S5 - Document map T1 | completata | Stato documenti, versioni, fonte, review | Smoke Playwright desktop/mobile: documenti fixture navigabili e fonti apribili |
| S6 - Review queue e fonte | completata | Azioni review e source/audit panel | Smoke Playwright desktop/mobile: azioni visibili, stato locale coerente e fonte collegata |
| S7 - Timeline e deliverable | completata | T2/T3 navigabili e collegati a fonti | Smoke Playwright desktop/mobile: scadenze e deliverable mostrano stato, fonte e review collegata |
| S8 - Viste T4-T8 | completata | Requisiti, financials, cost driver, criticità, Q&A | Smoke Playwright desktop/mobile: dati proposti mostrano stato, fonte e review senza apparire come verità validata |
| S9 - Audit e data policy | completata | AI gate, provider, policy, eventi audit | Smoke Safari desktop e Playwright WebKit desktop/mobile: stati AI/policy visibili e fail-closed |

## Fase 5 - Ingestion E Parsing Locale

La Fase 5 è chiusa. L’obiettivo è collegare TRAM a una pipeline locale controllata che inventaria pacchetti, produce metadati verificabili e prepara parser issues senza loggare contenuti integrali dei documenti.

Include:

- inventario locale di pacchetto con hash, dimensioni, mime type e path relativo;
- storage key sicure e compatibili con lo storage adapter;
- piano parser per PDF, DOCX, XLSX, XLS, MPP, CSV/testo;
- parser issues applicative per file vuoti, formati non supportati, OCR da verificare e path non sicuri;
- nessuna chiamata AI esterna;
- nessun output committabile contenente documenti, OCR, tabelle estratte o contenuti integrali;
- test su fixture sintetiche generate a runtime.

Criteri di uscita:

- ogni file produce metadati o issue tracciabile;
- l’hash SHA-256 è disponibile per deduplica e audit;
- il contenuto dei file non viene serializzato nell’inventario;
- i formati non supportati non rompono la pipeline ma aprono issue bloccante;
- i PDF entrano in stato di verifica OCR prima delle source reference;
- i test locali coprono casi felici e failure path principali.

## Slice Operative Fase 5

| Slice | Stato | Obiettivo | Verifica minima |
| --- | --- | --- | --- |
| F5-S1 - Inventario pacchetto locale | completata | Scanner directory con hash, metadati, storage key, parser plan e parser issues | `npm run typecheck && npm run test` passa con fixture sintetiche runtime |
| F5-S2 - Persistenza ingestion locale | completata | Salvare inventario e parser issues in storage/app state locale escluso da Git | `npm run typecheck && npm run test` passa; nessun output in repo; storage key validate e test fail-closed |
| F5-S3 - Parser tecnici minimi | completata | Estrarre metadati tecnici da PDF/DOCX/XLSX/XLS/MPP senza contenuti integrali nei log | `npm run typecheck && npm run test` passa su PDF, testo/CSV, Office ZIP, XLS/MPP e firme incoerenti |
| F5-S4 - Source reference preliminari | completata | Creare source reference tecniche da pagine, file, line range o container rilevabili | `npm run typecheck && npm run test` passa; ogni source reference ha documento, locator e stato review |
| F5-S5 - UI ingestion status | completata | Mostrare stato ingestion/parsing e issue nella document map | Smoke Playwright WebKit desktop/mobile su documenti, fonti e drawer verso review |

## Fase 6 - Estrazioni T1-T8 E Pilot

La Fase 6 è chiusa lato prodotto/codice e resta pilot-ready. L’obiettivo è produrre estrazioni candidate controllate su base ingestion/source reference, aprire review dove serve, bloccare claim non supportati e preparare un pilot interno senza inviare dati a provider esterni.

Include:

- extraction run con candidati, stato, fonte, rischio, confidenza e policy AI;
- estrattori deterministici T1-T3 su metadati e source reference;
- estrattori controllati T4-T8 come candidati review-first;
- gate review e metriche qualità minime;
- superficie pilot-ready su fixture sintetiche;
- debito esplicito per il pilot reale con utenti interni.

Criteri di uscita:

- ogni candidato T1-T8 ha fonte e stato;
- nessun candidato diventa verità validata senza review;
- T2/T3 non inventano date, formati o obbligatorietà;
- T5 non inventa importi o formule;
- T8 non abilita invio automatico;
- output senza fonte o con policy bloccante apre review/blocker;
- metriche minime mostrano coverage, burden review e claim non supportati;
- il pilot reale resta tracciato se non ancora eseguito con utenti.

## Slice Operative Fase 6

| Slice | Stato | Obiettivo | Verifica minima |
| --- | --- | --- | --- |
| F6-S1 - Extraction run contract | completata | Modellare candidati, run, stato review e policy AI locale/fail-closed | `npm run typecheck && npm run test` passa |
| F6-S2 - Estrattori T1-T3 | completata | Generare candidati document envelope, timeline e deliverable senza delegare campi formali all’AI | `npm run typecheck && npm run test` passa; nessuna data/formato/obbligatorietà inventata |
| F6-S3 - Estrattori T4-T8 | completata | Generare candidati requisiti, financials, cost driver, criticità e Q&A come review-first | `npm run typecheck && npm run test` passa; nessun importo/formula/invio automatico |
| F6-S4 - Review gate e metriche | completata | Calcolare blocker, burden review, source coverage e unsupported claim count | `npm run typecheck && npm run test` passa su metriche e gate bloccanti |
| F6-S5 - Pilot-ready surface | completata | Mostrare stato estrazioni/pilot e debiti residui in UI/roadmap | Smoke Playwright WebKit desktop/mobile su audit e drawer verso documenti |

## Rotte MVP

Rotte previste:

- `/tenders`
- `/tenders/:tender_id/overview`
- `/tenders/:tender_id/documents`
- `/tenders/:tender_id/timeline`
- `/tenders/:tender_id/deliverables`
- `/tenders/:tender_id/requirements`
- `/tenders/:tender_id/financials`
- `/tenders/:tender_id/cost-drivers`
- `/tenders/:tender_id/contradictions`
- `/tenders/:tender_id/queries`
- `/tenders/:tender_id/review`
- `/tenders/:tender_id/audit`

Per il primo slice operativo sono obbligatorie:

- `/tenders`;
- `/tenders/:tender_id/overview`;
- `/tenders/:tender_id/documents`;
- `/tenders/:tender_id/review`.

## Regole UI MVP

- Non mostrare codici task (`T1`-`T8`) come nomi di sezione o titoli utente.
- Non mostrare classi privacy nude (`L0`, `L1`, `L2`); usare label comprensibili.
- Non usare `fixture`, `Slice 0` o nomi scaffold nella navigazione utente.
- Non mostrare `currentness`; usare `stato documenti`, `vigente`, `superato`, `da verificare`.
- Tradurre stati raw come `needs_review`, `candidate`, `human_review_required`.
- Usare `Q&A`, `Deliverables`, `Financials`, `Criticità`, `Da validare`, `Registro attività`.
- Mantenere codici tecnici nel data model, nei test e nei documenti governanti, non nella superficie primaria.

## Fixture E Stati Da Coprire

Le fixture devono coprire:

- almeno quattro tender archetipali;
- documenti correnti, superati, redline, track changes, version conflict;
- deadline critica, mismatch MPP/PDF, addendum stale;
- deliverable mandatory, valutativo ed economico da review;
- requisiti O&M mandatory, KPI critico, compliance safety/cyber/data;
- financials con stato AI/review visibile e nessun valore non validato in overview;
- cost driver high/critical e financial-linked senza importi inventati;
- criticità candidate su timeline, versioning e financials;
- Q&A da approvare, domanda bloccata, risposta da incorporare;
- review item critico, alto, medio e basso;
- audit AI ammessa L0, L1 da approvare, L2 bloccata, quota esaurita, provider policy stale;
- stati dashboard `draft`, `partially_validated`, `validated_internal`, `stale_due_to_new_docs`, `open_critical_issues`.

## Debiti Visibili

- Verifica browser reale della Tender Shell: smoke desktop Safari completato il 2026-05-15 su `/tenders`, `/overview`, `/documents`, `/review` e `/audit`; smoke automatico completato su tutte le 12 route MVP; smoke Playwright WebKit desktop/mobile completato per S9; navigazione mobile a drawer verificata. Ripetere verifica responsive dopo le prossime patch UI.
- Pilot reale Fase 7 con tre utenti interni non ancora eseguito: la UI mostra readiness e metriche, ma il feedback utente va raccolto prima di considerare validato l’MVP e prima di aprire una vera V1.
- Formalizzare policy release quando TRAM sarà pubblicata su GitHub.
- Decidere se introdurre `CHANGELOG.md` solo quando inizierà un flusso release reale.

## Regola Di Aggiornamento

Ogni modifica che cambia priorità, milestone, perimetro MVP, slice operative o debito residuo deve aggiornare questo file nello stesso commit o in un commit documentale immediatamente collegato.
