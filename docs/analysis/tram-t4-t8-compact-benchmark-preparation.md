# TRAM V1 - Preparazione benchmark compatti T4-T8 v0.1

Data: 2026-05-13
Stato: preparato; provider benchmark eseguito e documentato separatamente
Ambito: Copenhagen M1-M4 O&M, Dublin Luas O&M, Milano lotti extraurbani O&M, Dublin MetroLink PPP

## Scopo

Questo documento registra la preparazione dei benchmark compatti per i task `T4`-`T8`.

L’obiettivo non è dimostrare che l’AI possa “leggere tutto” in autonomia. L’obiettivo è preparare envelope standard, minimizzati e confrontabili per verificare se l’AI, dove ammessa, sa normalizzare, classificare, spiegare e dichiarare incertezze senza sostituire parser, regole e review umana.

## Perimetro dati

I benchmark usano solo input minimizzati:

- estratti brevi;
- source refs locali;
- metadati documentali;
- segnali deterministici già prodotti da parser, regole o analisi precedente;
- ID di collegamento tra task, per esempio `T3`, `T4`, `T5` e `T7`.

Non sono stati duplicati o inviati a provider:

- pacchetti completi;
- PDF completi;
- workbook completi;
- payment mechanism completi;
- valori economici;
- formule economiche complete;
- dati personali;
- query approvate o inviate.

## Dataset preparati

| Task | Dataset | Item | Stato |
| --- | --- | ---: | --- |
| `T4` | `tram_t4_requirements_kpi_compact_v0_1` | 20 | Preparato |
| `T5` | `tram_t5_financials_payment_compact_v0_1` | 16 | Preparato, AI esterna non default |
| `T6` | `tram_t6_cost_drivers_compact_v0_1` | 17 | Preparato |
| `T7` | `tram_t7_contradictions_compact_v0_1` | 20 | Preparato |
| `T8` | `tram_t8_query_draft_compact_v0_1` | 19 | Preparato, human-first |

Roll-up:

- `/Users/Matteo/Documents/TRAM/data/working/t4-t8-compact-benchmark-summary-v0-1.json`

Valutazione provider:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t4-t8-compact-provider-benchmark-evaluation.md`

## Artefatti

### T4 requisiti e KPI

- input: `/Users/Matteo/Documents/TRAM/data/working/t4-requirements-kpi-compact-v0-1/benchmark-inputs/tram-t4-requirements-kpi-compact-input-envelope-v0-1-r1.json`;
- baseline: `/Users/Matteo/Documents/TRAM/data/working/t4-requirements-kpi-compact-v0-1/benchmark-baselines/tram-t4-requirements-kpi-compact-baseline-v0-1-r1.json`;
- summary: `/Users/Matteo/Documents/TRAM/data/working/t4-requirements-kpi-compact-v0-1/benchmark-evaluations/tram-t4-requirements-kpi-compact-summary-v0-1-r1.json`.

Focus:

- requisiti operations;
- requisiti maintenance e asset management;
- reporting e compliance;
- KPI non finanziari;
- casi con escalation a `T5` o review.

### T5 financials e payment

- input: `/Users/Matteo/Documents/TRAM/data/working/t5-financials-payment-compact-v0-1/benchmark-inputs/tram-t5-financials-payment-compact-input-envelope-v0-1-r1.json`;
- baseline: `/Users/Matteo/Documents/TRAM/data/working/t5-financials-payment-compact-v0-1/benchmark-baselines/tram-t5-financials-payment-compact-baseline-v0-1-r1.json`;
- summary: `/Users/Matteo/Documents/TRAM/data/working/t5-financials-payment-compact-v0-1/benchmark-evaluations/tram-t5-financials-payment-compact-summary-v0-1-r1.json`.

Focus:

- pricing workbook;
- PEF e modelli economici;
- payment mechanism;
- penalty, deduction e indexation come classi, non come contenuti;
- garanzie, insurance e financial standing;
- blocco di casi troppo sensibili per AI esterna.

### T6 cost driver

- input: `/Users/Matteo/Documents/TRAM/data/working/t6-cost-drivers-compact-v0-1/benchmark-inputs/tram-t6-cost-drivers-compact-input-envelope-v0-1-r1.json`;
- baseline: `/Users/Matteo/Documents/TRAM/data/working/t6-cost-drivers-compact-v0-1/benchmark-baselines/tram-t6-cost-drivers-compact-baseline-v0-1-r1.json`;
- summary: `/Users/Matteo/Documents/TRAM/data/working/t6-cost-drivers-compact-v0-1/benchmark-evaluations/tram-t6-cost-drivers-compact-summary-v0-1-r1.json`.

Focus:

- operations;
- maintenance e asset management;
- workforce e mobilitazione;
- reporting e compliance;
- driver collegati a KPI o financial item, senza stime o importi.

### T7 contraddizioni candidate

- input: `/Users/Matteo/Documents/TRAM/data/working/t7-contradictions-compact-v0-1/benchmark-inputs/tram-t7-contradictions-compact-input-envelope-v0-1-r1.json`;
- baseline: `/Users/Matteo/Documents/TRAM/data/working/t7-contradictions-compact-v0-1/benchmark-baselines/tram-t7-contradictions-compact-baseline-v0-1-r1.json`;
- summary: `/Users/Matteo/Documents/TRAM/data/working/t7-contradictions-compact-v0-1/benchmark-evaluations/tram-t7-contradictions-compact-summary-v0-1-r1.json`.

Focus:

- date mismatch;
- version conflict;
- legal reference mismatch;
- obligation conflict;
- document list mismatch;
- parser issue;
- falsi positivi controllati per misurare prudenza.

### T8 query draft

- input: `/Users/Matteo/Documents/TRAM/data/working/t8-query-draft-compact-v0-1/benchmark-inputs/tram-t8-query-draft-compact-input-envelope-v0-1-r1.json`;
- baseline: `/Users/Matteo/Documents/TRAM/data/working/t8-query-draft-compact-v0-1/benchmark-baselines/tram-t8-query-draft-compact-baseline-v0-1-r1.json`;
- summary: `/Users/Matteo/Documents/TRAM/data/working/t8-query-draft-compact-v0-1/benchmark-evaluations/tram-t8-query-draft-compact-summary-v0-1-r1.json`.

Focus:

- query su contraddizioni candidate;
- query su ambiguità;
- query su documenti o allegati da chiarire;
- casi `do_not_send`;
- caso `blocked_sensitive` su payment.

## Decisioni operative

- `T4` può essere eseguito con Gemini/Mistral solo su envelope L1 minimizzato e dopo gate privacy.
- `T5` resta parser locale + review: l’AI esterna non è default e il benchmark misura routing, privacy e parser action, non sintesi economica.
- `T6` può usare AI solo per classificare famiglia driver, rischio e incertezze; non deve stimare costi.
- `T7` produce candidate, non verità: l’AI può spiegare prudenzialmente ma non decidere quale fonte prevale.
- `T8` è human-first: nessuna query può diventare approvata o inviata senza utente.

## Debiti e cautela

- Alcuni source refs derivano da benchmark precedenti o analisi già documentate e vanno induriti con riga fonte primaria prima di un run decisivo.
- I casi economici T5 sono volutamente ridotti a metadati e classi; il parsing reale dei workbook richiederà extractor locali dedicati.
- La possibile query su riferimento normativo Copenhagen richiede verifica puntuale della fonte primaria prima di qualunque draft esterno.
- I casi T8 `do_not_send` sono parte del test: devono far emergere prudenza, non produttività apparente.

## Prossimo passo consigliato

La specifica tecnica dei normalizzatori `T4`, `T6`, `T7` e `T8` è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`.

Il config JSON v0.1 e la specifica fixture test sono documentati in `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json` e `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md`.

La sede runtime dei normalizzatori è definita nell’ADR `/Users/Matteo/Documents/TRAM/docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md`, mantenendo distinti campi AI-owned, campi rule-owned, campi review-owned e forzature deterministiche prima della review queue.

Le viste dashboard MVP collegate ai task T1-T8 sono definite in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-dashboard-views-t1-t8-v0-1.md`.

Il registro `indicator_key` P0/P1 è definito in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-key-registry-p0-p1-v0-1.md`; il passo successivo è usarlo per fixture dashboard/review.
