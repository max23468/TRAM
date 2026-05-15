# TRAM V1 - Specifica fixture test normalizzatori T4-T8 v0.1

Data: 2026-05-13
Stato: specifica test fixture, senza codice applicativo
Ambito: fixture per normalizzatori T4, T6, T7 e T8

## Scopo

Questo documento definisce le prime fixture test per verificare che i normalizzatori T4-T8 applichino la specifica e il config v0.1 in modo riproducibile.

Non è ancora un harness di test. È la mappa minima di input, output raw, baseline e assert che dovrà guidare la futura implementazione.

## Riferimenti

- Specifica normalizzatori: `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`
- Config normalizzatori: `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json`
- Report provider: `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t4-t8-compact-provider-benchmark-evaluation.md`
- Roll-up benchmark: `/Users/Matteo/Documents/TRAM/data/working/t4-t8-compact-benchmark-summary-v0-1.json`

## Principio

Ogni fixture deve verificare tre livelli:

1. `raw_output`: cosa ha restituito il provider o un caso sintetico controllato;
2. `normalized_output`: cosa deve produrre il normalizzatore;
3. `review_effect`: quale warning, blocco o review item deve nascere.

Il test non deve misurare “quanto è brava l’AI”. Deve misurare se TRAM impedisce all’AI di uscire dal perimetro.

## Struttura fixture futura

Ogni fixture dovrà avere questa forma logica:

```json
{
  "fixture_id": "t4_collection_alias_and_review_gate",
  "task_id": "T4",
  "normalizer_config_id": "tram_v1_normalizer_config_t4_t8_v0_1",
  "input_envelope_path": "...",
  "raw_output_path": "...",
  "expected_normalized_output_path": "...",
  "expected_assertions": [],
  "expected_warnings": [],
  "expected_review_items": []
}
```

I path possono puntare agli artifact benchmark esistenti o a fixture sintetiche future. Le fixture sintetiche non devono contenere dati riservati nuovi: usare ID, campi minimizzati e contenuti fittizi.

## Fixture T4

### T4-FX-001 - Alias collection e schema pass

Scopo: verificare che un raw output con collection `output` venga normalizzato in `items`.

Artifact:

- input: `/Users/Matteo/Documents/TRAM/data/working/t4-requirements-kpi-compact-v0-1/benchmark-inputs/tram-t4-requirements-kpi-compact-input-envelope-v0-1-r1.json`
- raw output: `/Users/Matteo/Documents/TRAM/data/working/t4-requirements-kpi-compact-v0-1/benchmark-runs/tram-t4-requirements-kpi-compact-output-mistral-medium-3-5-v0-1-r1.json`
- normalized output: `/Users/Matteo/Documents/TRAM/data/working/t4-requirements-kpi-compact-v0-1/benchmark-runs/tram-t4-requirements-kpi-compact-output-mistral-medium-3-5-normalized-v0-1-r1.json`
- evaluation: `/Users/Matteo/Documents/TRAM/data/working/t4-requirements-kpi-compact-v0-1/benchmark-evaluations/tram-t4-requirements-kpi-compact-eval-mistral-medium-3-5-normalized-v0-1-r1.json`

Assert:

- `normalized_run_status` è `normalized_pass` o `normalized_pass_with_warnings`;
- output collection canonica `items`;
- 20 item in output;
- nessun item extra rispetto all’envelope;
- warning `collection_alias_applied`;
- nessun campo vietato conservato.

### T4-FX-002 - KPI economic-linked scala a review/T5

Scopo: verificare che KPI con linkage economico non venga trattato come dato non sensibile.

Input base: item `CPH-T4-001`.

Assert:

- `financial_escalation` presente in `impact_tags`;
- `review_required=true`;
- `criticality` almeno `critical`;
- review item family `financials` o `KPI`;
- `blocking=true`;
- formula, target e soglie restano rule-owned.

### T4-FX-003 - Campo vietato eliminato

Scopo: verificare che un raw output sintetico con `formula_raw`, `target_raw` o valore economico venga pulito.

Assert:

- campi vietati presenti in `dropped_fields`;
- valori deterministici ripristinati solo dall’envelope;
- warning `forbidden_field_dropped`;
- review forzata se il campo vietato riguarda payment, penali o formula KPI.

## Fixture T6

### T6-FX-001 - Link deterministici ripristinati

Scopo: verificare che i link a requisiti, deliverable, KPI e financial item non siano valutati come output AI.

Artifact:

- input: `/Users/Matteo/Documents/TRAM/data/working/t6-cost-drivers-compact-v0-1/benchmark-inputs/tram-t6-cost-drivers-compact-input-envelope-v0-1-r1.json`
- raw output: `/Users/Matteo/Documents/TRAM/data/working/t6-cost-drivers-compact-v0-1/benchmark-runs/tram-t6-cost-drivers-compact-output-mistral-medium-3-5-v0-1-r1.json`
- normalized output: `/Users/Matteo/Documents/TRAM/data/working/t6-cost-drivers-compact-v0-1/benchmark-runs/tram-t6-cost-drivers-compact-output-mistral-medium-3-5-normalized-v0-1-r1.json`
- evaluation: `/Users/Matteo/Documents/TRAM/data/working/t6-cost-drivers-compact-v0-1/benchmark-evaluations/tram-t6-cost-drivers-compact-eval-mistral-medium-3-5-normalized-v0-1-r1.json`

Assert:

- 17 cost driver in output;
- link ripristinati dall’envelope;
- differenze sui link non sono mismatch AI;
- `linked_financial_item_ids` non contiene valori economici;
- nessun importo, unit rate, margine o prezzo in output.

### T6-FX-002 - Financial-linked forza review critica

Input base: `CPH-T6-001`.

Assert:

- `cost_confidence=financial_linked_review`;
- `risk_level` almeno `critical`;
- `review_required=true`;
- review item family `financials`;
- `blocking=true`;
- privacy eredita il massimo dalle fonti collegate.

### T6-FX-003 - Stima economica inventata eliminata

Scopo: raw output sintetico con `cost_estimate`, `unit_rate` o `price_recommendation`.

Assert:

- campo eliminato;
- warning `forbidden_field_dropped`;
- nessun valore economico entra in `CostDriver`;
- review forzata se il driver resta utile.

## Fixture T7

### T7-FX-001 - Output completo ma non promosso

Scopo: usare il run Mistral small batched per verificare che il normalizzatore non promuova severity/action AI.

Artifact:

- input: `/Users/Matteo/Documents/TRAM/data/working/t7-contradictions-compact-v0-1/benchmark-inputs/tram-t7-contradictions-compact-input-envelope-v0-1-r1.json`
- raw merged output: `/Users/Matteo/Documents/TRAM/data/working/t7-contradictions-compact-v0-1/benchmark-runs/tram-t7-contradictions-compact-output-mistral-small-2603-batched-merged-v0-1-r1.json`
- evaluation raw/merged: `/Users/Matteo/Documents/TRAM/data/working/t7-contradictions-compact-v0-1/benchmark-evaluations/tram-t7-contradictions-compact-eval-mistral-small-2603-batched-merged-v0-1-r1.json`

Assert:

- 20 candidate presenti;
- `why_it_may_be_a_conflict` può essere conservato se prudente;
- `severity_candidate` viene ricalcolato da regole;
- `recommended_action` viene ricalcolato da regole;
- `review_required` non viene abbassato dall’AI;
- `normalized_run_status=partial_requires_review` o equivalente se il raw resta qualitativamente insufficiente.

### T7-FX-002 - Date mismatch critico

Input base: `CPH-T7-001`.

Assert:

- `issue_type=date_mismatch`;
- `severity_candidate=critical`;
- `recommended_action=review_and_consider_query`;
- `review_required=true`;
- review item family `contradictions`;
- `blocking=true`.

### T7-FX-003 - Falso positivo o parser issue

Scopo: fixture sintetica con `candidate_type_hint=parser_issue` e nessun impatto dashboard.

Assert:

- `severity_candidate` massimo `low`;
- `recommended_action=mark_as_parser_issue`;
- `review_required=false` ammesso solo se prodotto da regole;
- nessun T8 seed automatico.

### T7-FX-004 - Valore finale vietato

Scopo: raw output sintetico con `final_value`, `winning_source` o `resolved_value`.

Assert:

- campi eliminati;
- warning `forbidden_field_dropped`;
- nessun dato consolidato generato;
- review obbligatoria se il conflitto resta plausibile.

## Fixture T8

### T8-FX-001 - Human approval sempre true

Scopo: usare il caso in cui il raw output imposta `human_approval_required=false` su alcuni `do_not_send`.

Artifact:

- input subset: `/Users/Matteo/Documents/TRAM/data/working/t8-query-draft-compact-v0-1/benchmark-inputs/tram-t8-query-draft-compact-l1-subset-input-envelope-v0-1-r1.json`
- raw output: `/Users/Matteo/Documents/TRAM/data/working/t8-query-draft-compact-v0-1/benchmark-runs/tram-t8-query-draft-compact-l1-subset-output-mistral-small-2603-v0-1-r1.json`
- normalized output: `/Users/Matteo/Documents/TRAM/data/working/t8-query-draft-compact-v0-1/benchmark-runs/tram-t8-query-draft-compact-l1-subset-output-mistral-small-2603-normalized-v0-1-r1.json`
- evaluation: `/Users/Matteo/Documents/TRAM/data/working/t8-query-draft-compact-v0-1/benchmark-evaluations/tram-t8-query-draft-compact-l1-subset-eval-mistral-small-2603-normalized-v0-1-r1.json`

Assert:

- 18 bozze di chiarimento nel subset L1/L0;
- `human_approval_required=true` per ogni item;
- nessuno status approvato, inviato o equivalente;
- warning `review_required_forced` se il raw aveva `false`;
- `pipeline_normalized_pass=true`.

### T8-FX-002 - Blocked sensitive L2

Input base: caso `blocked_sensitive` escluso dal provider run.

Assert:

- provider esterno bloccato;
- `status=blocked_sensitive`;
- `human_approval_required=true`;
- review item family `clarifications`;
- nessun `question_draft` generato da provider esterno.

### T8-FX-003 - Fatti non supportati rimossi

Scopo: raw output sintetico con fatto non presente in `facts_to_cite`.

Assert:

- fatto non supportato rimosso da `facts_cited` e `query_body`;
- warning `forbidden_field_dropped` o `unsupported_fact_dropped`;
- se non restano fatti citabili, `status=needs_more_review`;
- nessun tono accusatorio.

### T8-FX-004 - Status approvato vietato

Scopo: raw output sintetico con `status=approved`, `sent` o `ready_to_send`.

Assert:

- status normalizzato a `needs_more_review` o `blocked_sensitive`;
- `human_approval_required=true`;
- warning `enum_alias_applied`;
- review item bloccante.

## Fixture core comuni

### CORE-FX-001 - Extra item eliminato

Assert:

- item non presente nell’envelope viene eliminato;
- warning `extra_item_dropped`;
- run almeno `normalized_pass_with_warnings`.

### CORE-FX-002 - Item mancante blocca o degrada

Assert:

- item atteso mancante genera warning `missing_expected_item`;
- run `partial_requires_review` o `blocked_missing_items` secondo criticità;
- review item creato se l’item mancante è critico.

### CORE-FX-003 - L2 blocca provider esterno

Assert:

- qualunque task con `privacy_level_effective=L2_sensitive` e provider esterno viene bloccato;
- `blocked_reason_codes` include `external_provider_blocked`;
- nessun contenuto L2 normalizzato da raw provider esterno.

## Criteri minimi di pass

Il futuro harness passa se:

- tutte le fixture positive T4, T6 e T8 passano come pipeline normalizzata;
- tutte le fixture T7 confermano route rules/review-first;
- i campi vietati vengono sempre rimossi;
- i campi rule-owned vengono sempre ripristinati dall’envelope;
- i review gate obbligatori non vengono mai abbassati;
- `human_approval_required` è sempre true per T8;
- nessuna fixture genera contenuti approvati o inviati automaticamente;
- ogni warning atteso viene registrato.

## Debiti

- Creare fixture sintetiche minimizzate per casi vietati non presenti nei run reali.
- Decidere il formato finale delle fixture: JSON singolo per caso o manifest più file input/output.
- Definire naming dei futuri file fixture senza collisioni Markdown.
- ADR runtime definito in `/Users/Matteo/Documents/TRAM/docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md`: harness canonico TypeScript; test Python solo per compatibilità envelope del worker.
- Collegare fixture e config al futuro registro `AiCall`.

## Prossimo passo consigliato

Usare il registro `indicator_key` P0/P1 e il primo slice UI per costruire fixture applicative minime dei normalizzatori, collegate a dashboard e review queue.
