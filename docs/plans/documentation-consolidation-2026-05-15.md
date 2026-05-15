# TRAM - Piano consolidamento documentazione 2026-05-15

## Stato

Questo documento governa il riordino della documentazione TRAM dopo l’inizializzazione Git locale.

Stato finale: consolidamento eseguito sul branch `codex/docs-consolidation`.

Esito:

- documenti Markdown tracciati ridotti da 85 a 13;
- nuovo set governante creato con nomi brevi e stabili;
- vecchi documenti assorbiti rimossi dal workspace;
- storico mantenuto da Git, senza archivio massivo.

Stato rilevato sul branch `codex/docs-consolidation`:

- Markdown tracciati da Git: 85.
- Righe Markdown in `docs/` e `data/`: circa 23.209.
- Distribuzione:
  - `docs/planning`: 48 file.
  - `docs/analysis`: 28 file.
  - `docs/runbooks`: 3 file.
  - `docs/design`: 3 file Markdown, più un mock HTML.
  - `docs/decisions`: 1 file.
  - `data`: 1 file Markdown.
  - root: `AGENTS.md`.

Il problema non è solo quantitativo. Molti documenti sono versioni intermedie, benchmark run, valutazioni provider o specifiche granulari nate per esplorare. In questa forma rischiano di essere lette come fonti primarie anche quando sono superate o solo storiche.

## Obiettivo

Ridurre la documentazione viva a pochi documenti governanti, usando convenzioni simili a Pratix, DocMolder e FiscalBay: nomi brevi, stabili, non legati a V1/V2/V3 nel filename, con roadmap separata e decisioni tracciate.

Obiettivo finale indicativo:

- 8-10 documenti vivi, includendo entrypoint e roadmap.
- Nessun archivio massivo: Git diventa lo storico dei documenti assorbiti.
- Un indice leggibile che dica cosa leggere prima di modificare prodotto, AI, dati, UI, runbook o deploy.
- Nessuna cancellazione nella prima fase: prima consolidamento, poi rimozione dei documenti assorbiti in un passaggio separato.

## Regole di consolidamento

- `AGENTS.md` resta la fonte operativa primaria per agenti e collaboratori.
- I documenti consolidati devono diventare fonti primarie; i documenti assorbiti non devono governare decisioni future.
- Ogni documento vivo deve avere responsabilità chiara, senza sovrapporsi agli altri.
- Le analisi benchmark vanno sintetizzate nei documenti vivi; i dettagli completi restano recuperabili da Git, salvo pochissime evidenze non riassumibili.
- I prompt e gli schema pack vanno consolidati per task e versione corrente, non mantenuti come catena dispersa di versioni.
- I file con dati reali o pacchetti gara restano fuori da Git secondo `.gitignore`.
- Ogni fase deve lasciare `git status` leggibile e commit atomici.

## Convenzione Nomi

Convenzione scelta, ispirata alle repo già usate:

- file root per orientamento generale: `README.md`, `ROADMAP.md`, `CHANGELOG.md` quando servirà;
- file governanti in `docs/` con nomi brevi e maiuscoli: `docs/ARCHITECTURE.md`, `docs/OPERATIONS.md`, `docs/BRAND.md`;
- decisioni stabili in `docs/decisions/` con numerazione progressiva se servono ADR puntuali;
- piani temporanei in `docs/plans/` con nomi descrittivi kebab-case;
- niente suffissi `v1`, `v2`, `v3` nei documenti governanti: le versioni sono sezioni interne;
- niente prefisso `tram-` nei documenti governanti, perché la repo è già TRAM.

## Set Finale Proposto

### 1. README

File proposto: `README.md`

Contenuto:

- cos’è TRAM in breve;
- come avviare o leggere il progetto;
- link ai documenti governanti;
- stato corrente del progetto.

### 2. Roadmap

File proposto: `ROADMAP.md`

Contenuto:

- milestone;
- stato;
- priorità;
- criteri di completamento;
- debiti e residui rilevanti.

La roadmap è separata dal contesto prodotto, come nelle altre repo.

### 3. Docs Index

File proposto: `docs/INDEX.md`

Contenuto:

- mappa dei documenti vivi;
- ordine di lettura;
- responsabilità di ciascun documento;
- link a decisioni e piani temporanei.

### 4. Context

File proposto: `docs/CONTEXT.md`

Contenuto:

- cosa TRAM è e non è;
- utenti e casi d’uso;
- perimetro V1/V2/V3;
- principi prodotto;
- tassonomia procurement minima;
- criteri di successo generali.

Assorbe soprattutto product brief, ruoli, benchmark packages, appunti di posizionamento e policy di ricerca dominio.

### 5. Architecture

File proposto: `docs/ARCHITECTURE.md`

Contenuto:

- architettura MVP;
- data model evidence-first;
- data contract;
- fixture applicative;
- resolver versioni documentali;
- policy storage e segreti a livello architetturale;
- evoluzione tecnica futura, quando serve.

### 6. AI And Document Pipeline

File proposto: `docs/AI_AND_DOCUMENT_PIPELINE.md`

Contenuto:

- pipeline ingestion, parsing, OCR, chunking, extraction;
- task taxonomy T1-T8;
- strategia AI gratuita;
- minimizzazione/redazione chunk;
- classi documentali e provider ammessi;
- routing AI;
- registry chiamate e gate costo/privacy;
- prompt/schema correnti per T1-T8.

### 7. UX And Review Workflow

File proposto: `docs/UX_REVIEW_WORKFLOW.md`

Contenuto:

- wireframe funzionali;
- dashboard views;
- primo slice UI;
- review queue;
- validazione umana;
- workflow ingestion-to-dashboard;
- stati, fonti, rischio, confidenza.

### 8. Operations

File proposto: `docs/OPERATIONS.md`

Contenuto:

- sviluppo locale;
- toolchain document processing;
- runtime/storage OCI MVP;
- verifiche minime;
- gestione `.gitignore`, segreti e dati esclusi;
- note future su deploy/VPS quando approvate.

### 9. Brand

File proposto: `docs/BRAND.md`

Contenuto:

- direzione visiva;
- brand light;
- richiami TPL;
- audit widget;
- riferimenti al mock HTML come artefatto, non come documento governante.

### 10. Decisions

File proposto: `docs/DECISIONS.md`

Contenuto:

- elenco decisioni stabili;
- stato `accepted`, `superseded`, `deferred`;
- link agli ADR dettagliati quando servono;
- decisioni pendenti rilevanti.

L’ADR 001 può restare come dettaglio in `docs/decisions/`, ma `docs/DECISIONS.md` diventa il punto di ingresso.

## Mappa Di Consolidamento

### Root E Data

| File attuale | Azione | Destinazione |
| --- | --- | --- |
| `AGENTS.md` | keep | Resta fonte operativa primaria |
| `data/tram-data-packages-guide.md` | merge then keep/reference | `CONTEXT.md` e `AI_AND_DOCUMENT_PIPELINE.md`; può restare in `data/` come guida dati |

### Planning Core

| File attuale | Azione | Destinazione |
| --- | --- | --- |
| `docs/planning/tram-v1-product-brief.md` | merge | `CONTEXT.md` |
| `docs/planning/tram-v1-mvp-roadmap-and-success-criteria-v0-1.md` | merge | `ROADMAP.md` e `CONTEXT.md` |
| `docs/planning/tram-v1-mvp-roles-permissions-v0-1.md` | merge | `CONTEXT.md` |
| `docs/planning/tram-v1-benchmark-packages.md` | merge | `CONTEXT.md` e evidenza sintetizzata |
| `docs/planning/tram-brand-positioning-notes.md` | review then merge | `CONTEXT.md` o `BRAND.md` |
| `docs/planning/tram-procurement-stage-taxonomy.md` | merge | `CONTEXT.md` |
| `docs/planning/tram-domain-research-policy.md` | merge | `CONTEXT.md` e `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-documentation-naming-conventions.md` | merge | `OPERATIONS.md` e `Git storico` |
| `docs/planning/tram-v1-mvp-v0-slice-status-alignment-2026-05-13.md` | assorbito poi rimosso | `Git storico` |

### Architecture, Data, Fixtures

| File attuale | Azione | Destinazione |
| --- | --- | --- |
| `docs/planning/tram-v1-mvp-architecture.md` | merge | `ARCHITECTURE.md` |
| `docs/planning/tram-v1-data-model.md` | merge | `ARCHITECTURE.md` |
| `docs/planning/tram-v1-mvp-data-contract-v0-1.md` | merge | `ARCHITECTURE.md` |
| `docs/planning/tram-v1-mvp-application-fixtures-v0-1.md` | merge | `ARCHITECTURE.md` |
| `docs/planning/tram-v1-document-family-version-currentness-resolver-v0-1.md` | merge | `ARCHITECTURE.md` |
| `docs/planning/tram-v1-gitignore-and-secrets-policy-v0-1.md` | merge | `ARCHITECTURE.md` e `OPERATIONS.md` |
| `docs/planning/tram-v1-tender-data-policy-v0-1.md` | merge | `ARCHITECTURE.md` e `AI_AND_DOCUMENT_PIPELINE.md` |
| `data/config/tram-v1-normalizer-config-t4-t8-v0-1.json` | keep | Config applicativa, non doc da consolidare |
| `data/fixtures/manifest.json` | keep | Fixture applicativa |
| `data/fixtures/tram-v1-mvp-synthetic-fixtures.json` | keep | Fixture applicativa |

### Pipeline, AI, Prompt, Provider

| File attuale | Azione | Destinazione |
| --- | --- | --- |
| `docs/planning/tram-v1-free-ai-strategy.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-free-ai-provider-recommendation-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-ai-document-class-provider-matrix-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-ai-chunk-minimization-redaction-policy-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-ai-routing-matrix-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-ai-call-registry-and-gates-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-automation-decision-matrix.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-tx-task-taxonomy-t1-t8.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-t2-t3-operational-spec-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-free-ai-benchmark-protocol.md` | merge then remove | `AI_AND_DOCUMENT_PIPELINE.md` e evidenza sintetizzata |
| `docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-1.md` | remove after extracting deltas | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-2.md` | remove after extracting deltas | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-3.md` | remove after extracting deltas | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-4.md` | merge current T1 L0 | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-free-ai-prompt-schema-pack-t2-timeline-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-free-ai-prompt-schema-pack-t3-deliverables-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-free-ai-prompt-schema-pack-t4-requirements-kpi-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-free-ai-prompt-schema-pack-t5-financials-payment-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-free-ai-prompt-schema-pack-t6-cost-drivers-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-free-ai-prompt-schema-pack-t7-contradictions-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-free-ai-prompt-schema-pack-t8-query-draft-v0-1.md` | merge | `AI_AND_DOCUMENT_PIPELINE.md` |

### UX, Dashboard, Review

| File attuale | Azione | Destinazione |
| --- | --- | --- |
| `docs/planning/tram-v1-mvp-functional-wireframes-v0-1.md` | merge | `UX_REVIEW_WORKFLOW.md` |
| `docs/planning/tram-v1-dashboard-views-t1-t8-v0-1.md` | merge | `UX_REVIEW_WORKFLOW.md` |
| `docs/planning/tram-v1-first-ui-slice-priority-v0-1.md` | merge | `UX_REVIEW_WORKFLOW.md` |
| `docs/planning/tram-v1-review-queue-design.md` | merge | `UX_REVIEW_WORKFLOW.md` |
| `docs/planning/tram-v1-human-validation-workflow.md` | merge | `UX_REVIEW_WORKFLOW.md` |
| `docs/planning/tram-v1-ingestion-to-dashboard-workflow-v0-1.md` | merge | `UX_REVIEW_WORKFLOW.md` e `AI_AND_DOCUMENT_PIPELINE.md` |
| `docs/planning/tram-v1-indicator-taxonomy.md` | merge | `UX_REVIEW_WORKFLOW.md` |
| `docs/planning/tram-v1-indicator-key-registry-p0-p1-v0-1.md` | merge | `UX_REVIEW_WORKFLOW.md` |
| `docs/planning/tram-v1-mvp-development-verification-checklist-v0-1.md` | merge | `OPERATIONS.md` e `UX_REVIEW_WORKFLOW.md` |

### Runbooks

| File attuale | Azione | Destinazione |
| --- | --- | --- |
| `docs/runbooks/tram-v1-local-app-development-runbook-v0-1.md` | merge | `OPERATIONS.md` |
| `docs/runbooks/tram-local-document-processing-toolchain.md` | merge | `OPERATIONS.md` |
| `docs/runbooks/tram-v1-oci-mvp-runtime-and-storage-runbook-v0-1.md` | merge | `OPERATIONS.md` |

### Design

| File attuale | Azione | Destinazione |
| --- | --- | --- |
| `docs/design/tram-v1-fase-1c-visual-direction-brand-light-v0-1.md` | merge | `BRAND.md` |
| `docs/design/tram-v1-fase-1c-bis-tpl-brand-direction-v0-1.md` | merge | `BRAND.md` |
| `docs/design/tram-v1-dashboard-widget-audit-v0-1.md` | merge | `BRAND.md` e `UX_REVIEW_WORKFLOW.md` |
| `docs/design/tram-v1-mvp-ui-mock.html` | keep as artifact | Referenziato da `BRAND.md` |

### Decisions

| File attuale | Azione | Destinazione |
| --- | --- | --- |
| `docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md` | keep and index | `DECISIONS.md` |

### Analysis E Benchmark

| File attuale | Azione | Destinazione |
| --- | --- | --- |
| `docs/analysis/tram-loaded-packages-inventory-2026-05-12.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-loaded-packages-inventory-2026-05-13.md` | merge latest summary then remove | `Git storico` e `CONTEXT.md` |
| `docs/analysis/tram-copenhagen-m1-m4-semantic-benchmark-analysis.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-v1-extraction-grid.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-free-ai-benchmark-dataset.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-t1-l0-envelope-v0-1.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-t1-l0-run-template-v0-1.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-t1-l0-gemini-run-v0-1.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-t1-l0-gemini-25-json-mode-run-v0-1.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-t1-l0-baseline-aware-evaluation-v0-1.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-gemini-provider-schema-evaluation.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-mistral-provider-schema-evaluation.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-groq-provider-schema-evaluation.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-cerebras-provider-schema-evaluation.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-cloudflare-provider-schema-evaluation.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-3-gemini-mistral-rerun-evaluation.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-3-hybrid-resolver-evaluation.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-dublin-luas-om-t1-l0-v0-3-hybrid-resolver-evaluation.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-dublin-metrolink-ppp-t1-l0-v0-3-hybrid-resolver-evaluation.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-milano-lotti-extraurbani-om-t1-l0-v0-3-hybrid-resolver-evaluation.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-ai-routing-micro-benchmark-v0-4-evaluation.md` | merge decision summary then remove | `AI_AND_DOCUMENT_PIPELINE.md` e `Git storico` |
| `docs/analysis/tram-t1-l0-v0-4-stage-aware-compact-benchmark-evaluation.md` | merge decision summary then remove | `AI_AND_DOCUMENT_PIPELINE.md` e `Git storico` |
| `docs/analysis/tram-t2-timeline-compact-benchmark-evaluation.md` | merge decision summary then remove | `AI_AND_DOCUMENT_PIPELINE.md` e `Git storico` |
| `docs/analysis/tram-t3-deliverables-compact-benchmark-evaluation.md` | merge decision summary then remove | `AI_AND_DOCUMENT_PIPELINE.md` e `Git storico` |
| `docs/analysis/tram-t4-t8-compact-benchmark-preparation.md` | assorbito poi rimosso | `Git storico` |
| `docs/analysis/tram-t4-t8-compact-provider-benchmark-evaluation.md` | merge decision summary then remove | `AI_AND_DOCUMENT_PIPELINE.md` e `Git storico` |
| `docs/analysis/tram-v1-four-package-compact-benchmark-synthesis-v0-1.md` | merge summary then remove | `CONTEXT.md`, `AI_AND_DOCUMENT_PIPELINE.md`, `Git storico` |
| `docs/analysis/tram-v1-free-ai-provider-readiness-status-2026-05-13.md` | merge current status then remove | `AI_AND_DOCUMENT_PIPELINE.md`, `Git storico` |

## Sequenza Operativa

### Fase 1 - Approvazione mappa

- Confermare o correggere questo piano.
- Confermare il set finale ispirato a Pratix, DocMolder e FiscalBay:
  `README.md`, `ROADMAP.md`, `docs/INDEX.md`, `docs/CONTEXT.md`, `docs/ARCHITECTURE.md`, `docs/AI_AND_DOCUMENT_PIPELINE.md`, `docs/UX_REVIEW_WORKFLOW.md`, `docs/OPERATIONS.md`, `docs/BRAND.md`, `docs/DECISIONS.md`.
- Confermare che non si crea un archivio massivo: i documenti assorbiti vengono rimossi dal workspace dopo il consolidamento.

Output atteso: piano approvato o corretto.

### Fase 2 - Creazione documenti consolidati vuoti o sintetici

- Creare i nuovi documenti governanti.
- Inserire in ciascuno una struttura stabile.
- Aggiungere nota iniziale: “documento consolidato, sostituisce progressivamente i file elencati”.

Output atteso: scheletro leggibile, ancora senza eliminare i vecchi file.

### Fase 3 - Consolidamento contenuti core

Ordine consigliato:

1. `README.md` e `docs/INDEX.md`.
2. `ROADMAP.md`.
3. `docs/CONTEXT.md`.
4. `docs/ARCHITECTURE.md`.
5. `docs/AI_AND_DOCUMENT_PIPELINE.md`.
6. `docs/UX_REVIEW_WORKFLOW.md`.
7. `docs/OPERATIONS.md`.
8. `docs/BRAND.md`.
9. `docs/DECISIONS.md`.

Output atteso: documenti vivi completi e coerenti.

### Fase 4 - Rimozione documenti assorbiti

- Verificare che le decisioni utili siano presenti nei documenti vivi.
- Rimuovere dal workspace i documenti assorbiti.
- Conservare solo eventuali evidenze benchmark non sintetizzabili, da decidere caso per caso.
- Usare Git come storico principale per recuperare documenti rimossi.

Output atteso: workspace più pulito, senza archivio massivo.

### Fase 5 - Pulizia riferimenti

- Aggiornare `AGENTS.md` per sostituire la lista lunga di documenti con il nuovo set minimo.
- Aggiornare link interni ai nuovi documenti consolidati.
- Verificare naming Markdown univoco.
- Verificare accenti/apostrofi nei documenti nuovi.

Output atteso: agenti e collaboratori sanno quali documenti leggere.

### Fase 6 - Commit atomici

Commit suggeriti:

1. `docs: add TRAM documentation consolidation plan`
2. `docs: consolidate TRAM product and architecture docs`
3. `docs: consolidate TRAM AI and pipeline docs`
4. `docs: consolidate TRAM UX and operations docs`
5. `docs: remove superseded TRAM analysis docs`
6. `docs: update TRAM agent documentation entrypoints`

## Verifiche

Verifiche minime per questa fase:

```bash
git status --short
```

```bash
find . -path './.venv' -prune -o -path './node_modules' -prune -o -path './data/packages' -prune -o -name '*.md' -type f -print | awk -F/ '{print $NF}' | sort | uniq -d
```

```bash
rg -n "perche|piu|attivita|qualita|criticita|possibilita|responsabilita|modalita" docs data --glob '*.md' --glob '!data/packages/**'
```

Per i documenti consolidati, aggiungere rilettura manuale mirata prima del commit.

## Decisioni Risolte Nel Consolidamento

- `data/tram-data-packages-guide.md` è stato assorbito nei documenti governanti e rimosso dal workspace.
- Non è stata creata una cartella archivio massiva.
- Gli ADR singoli restano in `docs/decisions/`.
- Il mock HTML è stato spostato in `docs/assets/mvp-ui-mock.html`.
- Le versioni superate di prompt pack sono state rimosse dal workspace dopo sintesi nei documenti governanti.

## Prossimo Passo Consigliato

Usare il nuovo set governante come fonte primaria e aggiornare solo i documenti pertinenti quando cambiano prodotto, AI, architettura, operations, UX, brand o decisioni.
