# TRAM V1 - Benchmark compatto T1 L0 stage-aware v0.4

Data: 2026-05-13
Stato: completato
Ambito: Copenhagen M1-M4 O&M, Dublin Luas O&M, Milano lotti extraurbani O&M, Dublin MetroLink PPP

## Scopo

Questo benchmark verifica il prompt/schema pack T1 L0 v0.4 stage-aware prima di passare a T2 timeline e T3 deliverable.

Il test misura se TRAM riesce a classificare documenti di fasi diverse senza forzare tutto dentro categorie ITT generiche.

## Perimetro dati

Il benchmark usa solo L0:

- filename;
- relative path;
- folder hint;
- file extension;
- title hint;
- version hint quando già presente nei metadati;
- package phase hint;
- source refs.

Non sono stati inviati:

- corpo documento;
- testo OCR;
- tabelle;
- celle workbook;
- contenuti ZIP;
- pricing values;
- payment formulas;
- dati personali;
- firme o allegati completi.

## Dataset compatto

Il dataset contiene 21 item:

| Pacchetto | Item | Focus |
| --- | ---: | --- |
| Copenhagen M1-M4 O&M | 5 | ITT, track changes, MPP, pricing, payment attachment |
| Dublin Luas O&M | 5 | ITN, redline, schedules, data room, pricing |
| Milano lotti extraurbani O&M | 7 | ITT bus, errata corrige, GTFS, qualità/penali, PEF, criteri, offerta economica |
| Dublin MetroLink PPP | 4 | Prequalifica/PQP, financial standing, O&M references, qualification envelope |

Artefatti principali:

- input r2: `/Users/Matteo/Documents/TRAM/data/working/t1-l0-v0-4-stage-aware-compact/benchmark-inputs/tram-t1-l0-stage-aware-compact-input-envelope-v0-4-r2.json`;
- baseline r2: `/Users/Matteo/Documents/TRAM/data/working/t1-l0-v0-4-stage-aware-compact/benchmark-baselines/tram-t1-l0-stage-aware-compact-baseline-v0-4-r2.json`;
- summary raw r2: `/Users/Matteo/Documents/TRAM/data/working/t1-l0-v0-4-stage-aware-compact/benchmark-evaluations/tram-t1-l0-stage-aware-compact-summary-v0-4-r2.json`;
- summary normalized r2: `/Users/Matteo/Documents/TRAM/data/working/t1-l0-v0-4-stage-aware-compact/benchmark-evaluations/tram-t1-l0-stage-aware-compact-summary-v0-4-r2-normalized.json`.

## Provider testati

| Provider | Modello | Esito |
| --- | --- | --- |
| Gemini | `gemini-2.5-flash-lite` | Raw completato; pipeline normalizzata pass |
| Mistral | `mistral-medium-3.5` | Non valutabile: HTTP 429 `service_tier_capacity_exceeded` |

Mistral non viene degradato qualitativamente: il fallimento è operativo/capacity del tier gratuito.

## Esito raw Gemini r2

| Metrica | Esito |
| --- | --- |
| `format_pass` | true |
| `items_returned` | 21/21 |
| `stage_pass` | true |
| `sensitive_title_review_pass` | true |
| `no_forbidden_fields_pass` | true |
| `ai_classification_pass` | false |

Il raw output Gemini ha fallito su alcune label, ma non su aspetti bloccanti di architettura:

- nessun campo vietato `version`, `currentness`, `document_family_key`, `variant_type`;
- corretta distinzione stage tra prequalifica, ITT, ITN e chiarimenti;
- review correttamente richiesta su titoli sensibili dopo il rerun r2;
- output completo 21/21.

Mismatches raw principali:

- `instructions_to_negotiate` invece di `invitation_to_negotiate`;
- `transport_dataset` invece di `gtfs_dataset`, pur con ruolo `gtfs_archive`;
- `financial_model` per un economic offer template;
- `operations_requirements` per un O&M reference template in prequalifica;
- `selection_questionnaire` per un qualification envelope workbook.

## Normalizzatore deterministico

Il benchmark conferma che T1 L0 v0.4 deve avere un normalizzatore post-AI leggero.

Normalizzazioni applicate: 5.

| Caso | Normalizzazione |
| --- | --- |
| `instructions_to_negotiate` | `invitation_to_negotiate` |
| `transport_dataset` + `gtfs_archive` | `gtfs_dataset` |
| `financial_model` + `economic_offer_template` | `pricing_workbook` |
| `operations_requirements` + `o_and_m_reference_template` in prequalifica | `capability_evidence_template` |
| `selection_questionnaire` + `qualification_envelope` | `qualification_envelope` |

## Esito pipeline normalizzata

| Metrica | Esito |
| --- | --- |
| `format_pass` | true |
| `items_returned` | 21/21 |
| `ai_classification_pass` | true |
| `stage_pass` | true |
| `sensitive_title_review_pass` | true |
| `no_forbidden_fields_pass` | true |
| `mismatches` | 0 |

Decisione: T1 L0 v0.4 è promosso come baseline document map MVP se implementato come pipeline hybrid:

1. AI per classificazione stage-aware;
2. normalizzatore post-AI per alias e riconciliazione natura/ruolo;
3. resolver deterministico per famiglia, versione, variante e currentness;
4. review queue per titoli sensibili, aggiornamenti, redline e casi non risolti.

## Implicazioni

La v0.4 migliora il perimetro rispetto alla v0.3 perché distingue meglio:

- prequalifica/PQP;
- ITN e redline;
- ITT bus multi-lotto;
- GTFS e ZIP;
- PEF/economic offer;
- criteri di valutazione;
- qualità/penali;
- data room;
- O&M reference template in prequalifica.

Il risultato conferma anche una scelta di prodotto: TRAM non deve chiedere all’AI di essere perfettamente canonica. Deve usare l’AI per capire il senso del documento e poi standardizzare con regole tracciabili.

## Debiti

- Ritentare Mistral quando il tier gratuito non è saturo.
- Valutare se aggiungere `instructions_to_negotiate` come alias UI o mantenerlo solo come alias interno normalizzato.
- Trasformare il normalizzatore post-AI in specifica `AiClassificationNormalizer` quando inizierà il codice.
- Aggiornare il resolver document family/currentness per tenere conto delle nuove classi v0.4.
- Estendere il benchmark T1 v0.4 solo se emergono nuovi tipi documento prima del codice.

## Prossimo passo consigliato

Stato aggiornato: T2 timeline v0.1, T3 deliverable v0.1, il registro `indicator_key` P0/P1 e la sintesi benchmark sui quattro pacchetti sono stati completati.

Usare T1 come base document map del primo slice UI e delle fixture dashboard/review.
