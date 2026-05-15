# TRAM - Roadmap

Questo documento governa priorità, milestone, criteri di uscita e debiti visibili. I dettagli tecnici vivono nei documenti di area, ma la roadmap deve conservare le decisioni operative già concordate.

## Stato Corrente

Fase corrente: **Fase 4 - Prototipo applicativo su fixture**.

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

Esito: lint, typecheck, 16 test Vitest e build Next passati sul branch `codex/docs-consolidation`.

## Perimetro MVP/V0

Il primo MVP TRAM è una **V0 operativa interna**: navigabile, verificabile e utile su fixture e workflow controllati. Non è la V1 completa.

Tutte le aree `T1`-`T8` devono essere visibili o rappresentate, ma non tutte hanno lo stesso livello di automazione:

- `T1`, `T2`, `T3`: nucleo end-to-end.
- `T4`, `T6`: aree V1 controllate, AI solo su input ammessi e minimizzati.
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

## Fasi

| Fase | Stato | Obiettivo | Output principale | Done quando |
| --- | --- | --- | --- | --- |
| Fase 0 - Governance MVP/V0 | chiusa | Chiarire perimetro, guardrail, indicatori e policy | Documenti governanti, roadmap, ruoli, data policy | Non serve reinterpretare il perimetro prima delle slice operative |
| Fase 1 - Wireframe e visual direction | chiusa | Disegnare esperienza applicativa reale | Route, mock, direzione brand/UI, richiamo TPL | Dashboard e viste minime hanno struttura, stati, fonti e direzione visuale |
| Fase 2 - Fixture applicative | chiusa | Creare dati sintetici non riservati | Fixture pack con tender, indicatori, source reference, review, audit | Le fixture coprono stati dashboard, T1-T8, ruoli e route minime |
| Fase 3 - Data contract | chiusa | Rendere implementabili wireframe e fixture | Shape dati, mapping route-vista-indicatori, effetti review | Ogni componente previsto ha dati sufficienti e test di copertura |
| Fase 4 - Prototipo su fixture | in corso | Costruire prima esperienza navigabile | Dashboard aggregata, dashboard gara, T1-T8, review, fonte/audit | L’utente capisce gara, priorità, fonti, blocker e può navigare le sezioni |
| Fase 5 - Ingestion e parsing locale | da fare | Collegare app a pipeline documentale locale | Inventario, hash, parsing, source reference, parser issues | Ogni file produce metadati o errore tracciabile senza loggare contenuti integrali |
| Fase 6 - Estrazioni T1-T8 e pilot | da fare | Validare TRAM su pacchetti reali/rappresentativi | Estrazioni controllate, review, gate AI, feedback utenti | Tre utenti interni completano un giro utile con dati e rischi tracciati |

## Roadmap Dopo Il Primo MVP

### V1.1 - Stabilizzazione T1/T2/T3

Focus:

- document map più robusta;
- confronto MPP/PDF per timeline;
- checklist deliverable più affidabile;
- fixture estese oltre dataset compatto;
- smoke end-to-end su mini pacchetto sintetico.

### V1.2 - Requisiti, KPI E Cost Driver

Focus:

- T4 requisiti/KPI filtrabili;
- T6 cost driver con link a requisiti, Financials e review;
- normalizzatori T4/T6;
- policy L1 più chiara;
- quality metrics per falsi positivi e falsi negativi.

### V1.3 - Financials, Criticità E Q&A

Focus:

- T5 parser locale più robusto su workbook e meccanismo di remunerazione;
- T7 regole sulle criticità più forti;
- T8 Q&A con registro, template domanda, approvazione e gestione risposta;
- protezioni L2 e audit accessi;
- export manuale controllato, se approvato.

### V1.4 - Pilot Operativo E Hardening

Focus:

- onboarding primi tre utenti;
- ruoli e permessi applicativi;
- backup e retention;
- logging e audit;
- performance su pacchetti più grandi;
- scelta hosting condiviso e storage.

## V2 - Confronto Offerta-Gara

V2 inizia solo quando la V1 sa leggere e validare bene la documentazione di gara. Il suo scopo è confrontare un’offerta preparata o in preparazione con il Tender.

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

La Fase 4 è la fase corrente.

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
| S1 - Fixture e data contract direzionali | completata/parziale | Fixture sintetiche, route contract, review actions, AI gate | Test fixture e storage passano |
| S2 - Shell UI e route | parzialmente avviata | Layout comune, sidebar, route principali, stati controllati | Tutte le route previste caricano senza pagina rotta |
| S3 - Dashboard aggregata | da verificare | Lista gare, filtri, stato, blocker, accesso overview | Browser smoke su `/tenders` |
| S4 - Overview gara | da verificare | Dashboard direzionale con widget utili e fonti | Browser smoke su `/tenders/:id/overview` |
| S5 - Document map T1 | da fare | Stato documenti, versioni, fonte, review | Documenti fixture navigabili e fonte apribile |
| S6 - Review queue e fonte | da fare | Azioni review e source/audit panel | Azioni visibili e stati coerenti |
| S7 - Timeline e deliverable | da fare | T2/T3 navigabili e collegati a fonti | Scadenze e deliverable mostrano stato/fonte |
| S8 - Viste T4-T8 | da fare | Requisiti, financials, cost driver, criticità, Q&A | Dati proposti non appaiono come verità validata |
| S9 - Audit e data policy | da fare | AI gate, provider, policy, eventi audit | Stati AI/policy visibili e fail-closed |

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

- Verifica browser reale della Tender Shell.
- Razionalizzare widget overview rispetto al mock, evitando preview ridondanti.
- Completare document map e review queue come prime viste affidabili.
- Formalizzare policy release quando TRAM sarà pubblicata su GitHub.
- Decidere se introdurre `CHANGELOG.md` solo quando inizierà un flusso release reale.

## Regola Di Aggiornamento

Ogni modifica che cambia priorità, milestone, perimetro MVP, slice operative o debito residuo deve aggiornare questo file nello stesso commit o in un commit documentale immediatamente collegato.
