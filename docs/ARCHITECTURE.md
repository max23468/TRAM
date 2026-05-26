# TRAM - Architecture

Questo documento governa architettura, data model e verità applicativa.

## Direzione Tecnica

TRAM deve restare:

- free-first;
- self-hostable;
- provider-agnostic;
- containerizzabile;
- basata su Postgres standard;
- con storage controllato e astratto;
- con worker Python documentale separato;
- con AI gateway interno gratuito/capped;
- con job queue inizialmente basata su Postgres;
- evidence-first e review-first.

Vercel, Supabase e OpenAI sono alternative possibili o fonti utili, non default automatici.

## Stack Attuale

App locale:

- Next.js 16;
- React 19;
- TypeScript;
- Tailwind CSS;
- Vitest;
- ESLint;
- storage adapter `filesystem | oci`;
- workspace locale MVP in `.local/tram-workspace`;
- upload locale controllato via API interne Next.js;
- fixture sintetiche in `data/fixtures/`.

Comandi principali:

```bash
npm run dev
npm run verify
```

## Componenti Logici

L’architettura V1 deve restare separata in componenti chiari:

- app TypeScript containerizzabile per UI, route, dashboard, review e API interne;
- Postgres standard per dati applicativi, audit, job queue iniziale, auth futura e stati di review;
- storage documentale separato, astratto e sostituibile, preferibilmente S3-compatible o equivalente;
- worker Python documentale separato per parsing, OCR, tabelle, DOCX, XLS/XLSX e MPP;
- AI gateway interno gratuito/capped per routing, policy, logging e sospensione job;
- normalizzatori deterministici post-parser/post-AI;
- resolver deterministico per famiglia documentale, versioni e currentness;
- audit log e registry per AI, review, policy, import e modifiche utente.

La V1 può girare localmente o in ambiente self-hosted. Vercel, Supabase, OCI, VPS, storage managed o provider cloud restano alternative da decidere tramite runbook e ADR, non default impliciti.

## Alternative Considerate

- Tutto serverless: rinviato perché rischia costi, lock-in e limiti su parsing documentale pesante.
- Tutto locale sul Mac dell’utente: respinto come runtime applicativo V1, perché TRAM deve essere condivisibile e non dipendere dal laptop.
- AI File Search o caricamento pacchetto completo a provider: respinto per privacy, costi, audit e perdita di controllo sui chunk.
- Stack gestito Vercel/Supabase: possibile per parti applicative, ma non automatico perché TRAM è free-first e deve gestire documenti sensibili.
- Worker documentale nello stesso processo web: accettabile solo per prototipi piccoli; la direzione stabile è worker separato.

## Concetti Core

- `Tender`: contenitore operativo di una gara o fase di gara.
- `TenderMember`: relazione utente-ruolo-permessi sul Tender.
- `DocumentPackage`: pacchetto caricato, ricevuto o importato in una data occasione.
- `Document`: concetto logico.
- `DocumentVersion`: versione fisica o documentale.
- `ExtractionRun`: esecuzione di parser, regole, OCR, normalizzatori o AI.
- `AiGateDecision`: decisione pre-flight che autorizza, blocca o richiede conferma per una chiamata AI.
- `AiCall`: registro hashato e auditabile della chiamata AI.
- `AiProviderPolicySnapshot`: fotografia della policy provider usata al momento della decisione.
- `AiBudgetPolicy`: limiti di quota, costo, budget e sospensione.
- `SourceReference`: riferimento centrale a documento, pagina, sezione, tabella o cella.
- `Extraction`: proposta derivata da parser, regole o AI.
- `IndicatorValue`: valore normalizzato o aggregato, sempre collegato a fonte.
- `Requirement`: requisito formale, operativo, tecnico, safety, customer, cyber/data o compliance.
- `KPI`: indicatore non finanziario con target, formula, finestra, fonte e stato.
- `TimelineEvent`: evento, deadline, milestone, chiarimento, addendum o submission.
- `TenderDeliverable`: elaborato richiesto, formato, responsabilità, obbligatorietà e deadline.
- `FinancialItem`: voce economica, formula, payment mechanism, penalità, incentivo o pass-through.
- `CostDriver`: fattore di costo collegato a requisito, KPI, servizio, asset, personale o rischio.
- `ContradictionCandidate`: dubbio generato da regole o confronto tra fonti, non verità consolidata.
- `ClarificationThread`: domanda candidata, bozza, invio approvato, risposta e incorporazione.
- `ReviewItem`: elemento da validare, correggere, contestare o chiarire.
- `ValidationAction`: evento di conferma, correzione, contestazione, override o chiusura.
- `DashboardValidationState`: stato sintetico che governa overview e dashboard aggregata.

## Stati Dato

Ogni dato rilevante deve avere uno stato esplicito:

- estratto;
- proposto;
- confermato;
- corretto;
- contestato;
- da chiarire;
- superato;
- non applicabile.

Gli stati tecnici possono essere codificati in inglese nel modello, ma la UI deve mostrarli in italiano comprensibile. Gli stati bloccanti minimi sono:

- `needs_review`: dato da validare;
- `human_review_required`: decisione manuale obbligatoria;
- `blocked_by_policy`: AI o automazione non ammessa;
- `stale_due_to_new_docs`: dato superato o da rivalutare dopo nuovi documenti;
- `open_critical_issues`: Tender con criticità aperte;
- `quota_exhausted`: job sospeso per quota o budget;
- `provider_policy_stale`: policy provider da riverificare.

## Flussi Applicativi

### Ingestion

1. Ricezione pacchetto o caricamento controllato.
2. Calcolo hash, metadati, dimensioni, mime type e provenienza.
3. Creazione `DocumentPackage`.
4. Creazione o aggiornamento di `Document` e `DocumentVersion`.
5. Resolver di famiglia e currentness.
6. Parser/OCR/tabelle/MPP.
7. Creazione di `SourceReference`, `ExtractionRun` e parser issues.
8. Review queue per conflitti, file non letti o documenti dubbi.

### Workspace Locale MVP

Il workspace locale è il ponte operativo tra prototipo navigabile e uso quotidiano controllato:

1. `/tenders/intake` raccoglie dati minimi gara e documenti selezionati dall’utente.
2. `POST /api/local-tenders` salva i file nel driver storage locale, fuori dal repository.
3. TRAM calcola hash, estensione, dimensione, parser atteso, stato documento e controlli iniziali.
4. Il workspace viene salvato in `.local/tram-workspace/tenders/*.json`.
5. `/tenders` legge i workspace locali e mostra solo le gare create dall’utente.
6. `/tenders?vista=demo` apre esplicitamente la modalità dimostrativa con fixture sintetiche e Copenhagen.
7. Le route `/tenders/:id/overview`, `/documents`, `/review`, `/audit` e sezioni specialistiche aprono la gara locale quando l’id è locale.
8. `readWorkspaceTenderViewModel` normalizza workspace locale, fixture sintetiche e dataset dimostrativo Copenhagen in un payload unico per shell, overview, documenti, controlli, audit e sezioni operative.
9. `/api/tenders/:id/documents/:documentId` è l’endpoint standard per aprire il file originale della gara; non esistono più endpoint documentali paralleli per dataset o route dimostrative.
10. `WorkspaceTenderSectionPage` rende la stessa struttura per workspace reale, fixture sintetiche e Copenhagen, evitando pagine parallele con logiche diverse.

Questo flusso non sostituisce Postgres, ruoli, job queue o worker Python della V1. È il perimetro MVP locale: utile, verificabile, senza provider esterni e senza contenuti documentali in Git.

### Estrazione E Normalizzazione

1. Parser e regole producono candidati con fonte.
2. AI gate valuta task, privacy, provider, budget e policy.
3. AI, quando ammessa, normalizza o sintetizza solo chunk minimizzati.
4. Normalizzatori deterministici controllano schema, enum, confidenza e fonti.
5. Indicatori e item specialistici vengono creati come proposte.
6. Dashboard mostra solo stato, rischio e accesso alla fonte, non verità implicita.

### Validazione

1. Review queue ordina item per criticità, impatto e urgenza.
2. L’utente conferma, corregge, contesta, marca da chiarire o non applicabile.
3. Ogni azione crea `ValidationAction` e audit.
4. Gli indicatori derivati si aggiornano solo se le dipendenze sono compatibili.
5. Nuovi documenti o addendum possono riportare item e dashboard a stato stale.

### Q&A

1. T8 crea domande candidate o bozze interne.
2. L’utente approva, modifica o respinge.
3. Nessun invio esterno è automatico.
4. Le risposte ricevute diventano fonti, aggiornano currentness e possono aprire nuova review.

## Data Contract MVP

Le route MVP devono ricevere dati già normalizzati per vista, senza costringere i componenti UI a ricostruire regole di dominio. Ogni payload deve distinguere:

- identificativi stabili;
- label utente;
- valori grezzi e valori normalizzati quando entrambi servono;
- `SourceReference`;
- stato review;
- severità o priorità;
- confidenza;
- blocchi policy;
- timestamp e versione;
- azioni ammesse dal ruolo.

Le fixture sintetiche devono coprire stati felici e stati limite. Gli errori devono essere dati applicativi espliciti, non eccezioni invisibili: file non letto, parser fallito, OCR necessario, AI bloccata, quota esaurita, conflitto di versione, fonte mancante.

## Resolver Documentale

Il resolver di famiglia/versione/currentness è deterministico e governa:

- normalizzazione nome file e titolo;
- identificazione della famiglia documentale;
- riconoscimento variante, lingua, lotto, appendice, allegato, redline o track changes;
- ordinamento versioni, addendum e documenti sostituiti;
- stato `vigente`, `superato`, `dubbio`, `in conflitto`, `da verificare`;
- link tra Q&A/addendum e documenti impattati;
- apertura review quando la regola non basta.

L’AI può aiutare a classificare envelope o famiglia documentale solo su input ammessi, ma non decide currentness finale senza regole e review.

## Ruoli E Permessi

Ruoli minimi:

- `Owner`: configura Tender, membri, policy, storage e decisioni bloccanti.
- `Editor`: carica documenti, avvia parsing, propone correzioni e gestisce item.
- `Reviewer`: valida, contesta, corregge, chiude review e approva bozze Q&A.
- `Viewer`: consulta dashboard, fonti e stati senza modificare.

Capability flags da modellare:

- caricare documenti;
- vedere documenti sensibili;
- avviare AI esterna;
- approvare AI L1;
- vedere financials;
- validare financials;
- approvare o esportare Q&A;
- modificare policy Tender;
- gestire membri;
- esportare dati.

La UI deve mostrare azioni disabilitate con motivo operativo, non errori tecnici.

## Storage E Sicurezza

I pacchetti gara, estrazioni, OCR, tabelle, working extract, export e dati sensibili non devono stare in Git. Lo storage documentale deve essere separato dal repository.

La chiave locale `ssh-key-tram.key` è un segreto: non leggerla, non copiarla, non committarla.

Lo storage applicativo è già astratto in `src/lib/storage/`:

- `filesystem` è il driver locale di default, con root `.local/tram-storage`;
- `oci` è predisposto ma fail-closed finché mancano bucket, IAM e runbook approvati;
- le storage key non sicure vengono rifiutate.

I workspace gara creati dalla UI locale sono metadati applicativi e vivono in `.local/tram-workspace`. Anche questa cartella resta fuori da Git.

## Rischi Architetturali

- Crescita incontrollata del data model prima della V1: mitigare con slice e fixture.
- Dipendenza da provider AI gratuiti instabili: mitigare con gate, sospensione e fallback locale/manuale.
- Parser documentali fragili su PDF scansionati, Excel complessi e MPP: mitigare con worker separato e parser issues visibili.
- Currentness sbagliata su addendum e redline: mitigare con resolver deterministico e review bloccante.
- Dashboard troppo assertiva: mitigare con stati, fonte e review-first.
- Storage e log di dati reali nel repo: mitigare con `.gitignore`, runbook, verifiche e policy.

## Configurazioni Applicative

File applicativi oggi ammessi in Git:

- `data/config/tram-v1-normalizer-config-t4-t8-v0-1.json`;
- `data/fixtures/manifest.json`;
- `data/fixtures/tram-v1-mvp-synthetic-fixtures.json`.

Il suffisso `v1` può rimanere in config o fixture storiche, ma i documenti governanti non devono usarlo nel filename.
