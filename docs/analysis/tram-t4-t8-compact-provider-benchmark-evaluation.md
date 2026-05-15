# TRAM V1 - Valutazione provider benchmark compatti T4-T8 v0.1

Data: 2026-05-13
Stato: completato per Mistral su T4, T6 e T8 L1 subset; T7 tentato e non promosso; Gemini sospeso per quota free
Ambito: benchmark compatti T4-T8 preparati sui quattro pacchetti TRAM

## Scopo

Questo documento registra il primo run provider sui benchmark compatti `T4`-`T8`.

Il run rispetta i vincoli V1:

- nessun pacchetto completo inviato;
- nessun workbook completo inviato;
- nessun valore economico inviato;
- nessun payment mechanism completo inviato;
- `T5` non eseguito su provider esterni;
- nessun fallback a pagamento;
- query draft sempre human-first.

## Esito sintetico

| Task | Miglior esito corrente | Item | Decisione |
| --- | --- | ---: | --- |
| `T4` requisiti/KPI | Mistral `mistral-medium-3.5` pass | 20/20 | Promosso come normalizzazione controllata |
| `T5` financials/payment | Non eseguito su provider | 16 preparati | Parser locale + review |
| `T6` cost driver | Mistral `mistral-medium-3.5` pass dopo normalizzazione deterministica link | 17/17 | Promosso come classificazione controllata |
| `T7` contraddizioni | Mistral small batched completo ma fail qualitativo | 20/20 | Non promosso come task AI autonomo |
| `T8` query draft | Mistral `mistral-small-2603` pass su subset L1/L0 dopo normalizzatore | 18/18 | Promosso solo come supporto draft human-first |

Roll-up:

- `/Users/Matteo/Documents/TRAM/data/working/t4-t8-compact-benchmark-summary-v0-1.json`

## Gemini

Gemini `gemini-2.5-flash-lite` non è stato valutabile in questa tornata.

Esito:

- `429 RESOURCE_EXHAUSTED`;
- quota free tier su `generate_content_free_tier_requests`;
- retry prudente su `T4` ancora fallito;
- nessun fallback paid attivato.

Decisione:

- non declassare la qualità Gemini dai benchmark precedenti;
- registrare però il rischio operativo: in V1 free-first Gemini può bloccarsi per quota durante run multi-task;
- prima di run estesi serve batch scheduler con quota awareness e sospensione esplicita.

## Mistral T4

Artefatti principali:

- run: `/Users/Matteo/Documents/TRAM/data/working/t4-requirements-kpi-compact-v0-1/benchmark-runs/tram-t4-requirements-kpi-compact-mistral-medium-3-5-v0-1-r1.json`;
- output normalizzato: `/Users/Matteo/Documents/TRAM/data/working/t4-requirements-kpi-compact-v0-1/benchmark-runs/tram-t4-requirements-kpi-compact-output-mistral-medium-3-5-normalized-v0-1-r1.json`;
- evaluation: `/Users/Matteo/Documents/TRAM/data/working/t4-requirements-kpi-compact-v0-1/benchmark-evaluations/tram-t4-requirements-kpi-compact-eval-mistral-medium-3-5-normalized-v0-1-r1.json`.

Metriche:

| Metrica | Esito |
| --- | --- |
| `items_returned` | 20/20 |
| `enum_pass` | true |
| `no_forbidden_fields_pass` | true |
| `review_gate_pass` | true |
| `ai_classification_pass` | true |
| `pipeline_normalized_pass` | true |
| `mismatches` | 0 |

Nota: l’output raw usava una chiave generica `output`; il normalizzatore l’ha rinominata in `items`. È un difetto di aderenza formale recuperabile.

Decisione: `T4` è promosso con Mistral su envelope L1 minimizzato, mantenendo parser/regole come fonte primaria per testo, formula, target, soglia e obbligatorietà.

## Mistral T6

Artefatti principali:

- run: `/Users/Matteo/Documents/TRAM/data/working/t6-cost-drivers-compact-v0-1/benchmark-runs/tram-t6-cost-drivers-compact-mistral-medium-3-5-v0-1-r1.json`;
- output normalizzato: `/Users/Matteo/Documents/TRAM/data/working/t6-cost-drivers-compact-v0-1/benchmark-runs/tram-t6-cost-drivers-compact-output-mistral-medium-3-5-normalized-v0-1-r1.json`;
- evaluation: `/Users/Matteo/Documents/TRAM/data/working/t6-cost-drivers-compact-v0-1/benchmark-evaluations/tram-t6-cost-drivers-compact-eval-mistral-medium-3-5-normalized-v0-1-r1.json`.

Metriche:

| Metrica | Esito |
| --- | --- |
| `items_returned` | 17/17 |
| `enum_pass` | true |
| `no_forbidden_fields_pass` | true |
| `review_gate_pass` | true |
| `ai_classification_pass` | true |
| `pipeline_normalized_pass` | true |
| mismatches rimasti | 0 |
| link ignorati dal normalizzatore | 30 |

Nota: i 30 link a requisiti, deliverable, KPI e financial item erano campi deterministici da preservare nel merge, non campi da penalizzare come classificazione AI. La prima valutazione li aveva contati come mismatch; la valutazione normalizzata corregge il criterio.

Decisione: `T6` è promosso per classificare famiglia driver, dominio O&M, confidenza costo e rischio, senza importi o stime.

## Mistral T7

Artefatti principali:

- small full run: `/Users/Matteo/Documents/TRAM/data/working/t7-contradictions-compact-v0-1/benchmark-runs/tram-t7-contradictions-compact-mistral-small-2603-v0-1-r1.json`;
- small batched merged output: `/Users/Matteo/Documents/TRAM/data/working/t7-contradictions-compact-v0-1/benchmark-runs/tram-t7-contradictions-compact-output-mistral-small-2603-batched-merged-v0-1-r1.json`;
- small batched evaluation: `/Users/Matteo/Documents/TRAM/data/working/t7-contradictions-compact-v0-1/benchmark-evaluations/tram-t7-contradictions-compact-eval-mistral-small-2603-batched-merged-v0-1-r1.json`;
- medium batched evaluation: `/Users/Matteo/Documents/TRAM/data/working/t7-contradictions-compact-v0-1/benchmark-evaluations/tram-t7-contradictions-compact-eval-mistral-medium-3-5-batched-merged-v0-1-r1.json`.

Esiti:

- `mistral-medium-3.5` full: fallito per `service_tier_capacity_exceeded`;
- `mistral-small-2603` full: formato valido, ma 12/20 item;
- `mistral-small-2603` batched: 20/20 item, enum validi, ma 19 mismatch;
- `mistral-medium-3.5` batched: batch 1 completato, batch 2 fallito per capacity.

Problemi principali:

- severità troppo bassa su date mismatch e obligation conflict;
- azione spesso `review_and_update_value` invece di `review_and_consider_query`;
- una ambiguità MetroLink viene scartata invece di andare in review;
- due falsi positivi Luas vengono classificati come `numeric_mismatch`, anche se poi correttamente scartati.

Decisione: `T7` non è promosso come task AI autonomo. La route MVP resta:

1. regole/confronti deterministici per generare candidate;
2. severity/action deterministiche o review-first;
3. AI solo come supporto descrittivo, se supera un prompt più vincolante;
4. review queue obbligatoria prima di qualsiasi `T8`.

## Mistral T8

Artefatti principali:

- run: `/Users/Matteo/Documents/TRAM/data/working/t8-query-draft-compact-v0-1/benchmark-runs/tram-t8-query-draft-compact-l1-subset-mistral-small-2603-v0-1-r1.json`;
- output normalizzato: `/Users/Matteo/Documents/TRAM/data/working/t8-query-draft-compact-v0-1/benchmark-runs/tram-t8-query-draft-compact-l1-subset-output-mistral-small-2603-normalized-v0-1-r1.json`;
- evaluation: `/Users/Matteo/Documents/TRAM/data/working/t8-query-draft-compact-v0-1/benchmark-evaluations/tram-t8-query-draft-compact-l1-subset-eval-mistral-small-2603-normalized-v0-1-r1.json`.

Metriche:

| Metrica | Esito |
| --- | --- |
| `items_returned` | 18/18 |
| `enum_pass` | true |
| `no_forbidden_fields_pass` | true |
| `human_approval_gate_pass` | true dopo normalizzatore |
| `ai_classification_pass` | true dopo normalizzatore |
| `pipeline_normalized_pass` | true |
| `mismatches` | 0 |

Nota: nel raw output `human_approval_required=false` su alcuni casi `do_not_send`. Il normalizzatore T8 forza sempre `human_approval_required=true`, quindi il pass è pipeline, non raw puro.

Decisione: `T8` può essere testato come supporto draft su subset L1/L0, ma resta non default e sempre human-first. Il caso `blocked_sensitive` T8 collegato a payment è rimasto escluso dai provider esterni.

## Decisioni aggiornate

- Mistral diventa candidato operativo per `T4` e `T6` su input L1 minimizzato.
- Mistral small può supportare `T8` solo come bozza human-first su subset L1/L0.
- `T7` resta rules-first e review-first; non usare AI per severity/action come verità applicativa.
- Gemini resta candidato dai benchmark precedenti, ma la quota free è un rischio operativo concreto.
- `T5` resta escluso dai provider esterni in V1 default.

## Prossimo passo consigliato

Usare la specifica tecnica dei normalizzatori `T4`, `T6`, `T7` e `T8`, il config, la fixture spec, l’ADR, le viste dashboard e il registro `indicator_key` P0/P1 per preparare fixture applicative dashboard/review.
