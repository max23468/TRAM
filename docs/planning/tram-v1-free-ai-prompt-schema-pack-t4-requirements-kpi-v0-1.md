# TRAM V1 - Prompt/schema pack T4 requisiti O&M e KPI non finanziari v0.1

Data: 2026-05-13
Stato: proposta operativa impostata
Ambito: T4 requisiti O&M, obblighi, MR, KPI non finanziari, performance regime non economico

## Scopo

Il pack T4 v0.1 definisce come TRAM deve normalizzare requisiti O&M e KPI non finanziari già individuati da parser e regole.

La decisione principale è: l’AI non è fonte primaria del testo del requisito, della formula KPI o dell’obbligatorietà.

Per T4, la pipeline deve essere:

1. parser e regole individuano clausole, righe tabellari, `shall`, `must`, MR, KPI, formule, target, unità e source refs;
2. regole deterministiche salvano testo raw, formula raw, target raw, obbligatorietà candidata e fonte;
3. l’AI normalizza famiglia requisito/KPI, dominio O&M, impatto candidato, clustering e incertezze;
4. il normalizzatore separa KPI non finanziari da KPI con linkage economico;
5. la review queue riceve requisiti mandatory, formule, target critici, compliance e casi che scalano a T5.

## Decisione

Per T4 v0.1, l’AI può restituire solo:

- `item_id`;
- `item_type`;
- `text_or_name_normalized`;
- `requirement_family`;
- `kpi_family`;
- `o_and_m_domain`;
- `impact_tags`;
- `linked_deliverable_ids`;
- `criticality`;
- `review_required`;
- `confidence`;
- `cluster_label`;
- `uncertainties`.

L’AI non deve restituire o modificare:

- testo completo del requisito;
- `formula_raw`;
- `target_raw`;
- `threshold_raw`;
- `mandatory`;
- valori economici;
- bonus/malus;
- deductions;
- penali;
- payment mechanism;
- clausole complete.

Questi campi restano responsabilità di parser, regole e review.

## Versioni

| Campo | Valore |
| --- | --- |
| `prompt_pack_id` | `tram_free_ai_prompt_pack_t4_requirements_kpi_v0_1` |
| `schema_pack_id` | `tram_free_ai_schema_pack_t4_requirements_kpi_v0_1` |
| `schema_version` | `schema_t4_requirements_kpi_v0_1` |
| `task_id` | `T4` |
| `benchmark_dataset_id` | `tram_t4_requirements_kpi_compact_v0_1` |
| `privacy_default` | `L1_minimized` |
| `redaction_policy_pack` | `tram-ai-min-v0-1` |

## Regole comuni T4 v0.1

```text
Regole comuni TRAM AI T4 requisiti O&M e KPI non finanziari v0.1.

Lavori solo sull’envelope fornito.
Non riscrivere il testo completo del requisito.
Non cambiare formule, target, soglie, unità, obbligatorietà o fonte.
Non sintetizzare valori economici, payment mechanism, bonus/malus, deductions o penali.
Se un item contiene o suggerisce linkage economico, segnala review_required=true e financial_escalation tra gli impact_tags.
Classifica solo famiglia, dominio O&M, impatto candidato, cluster e incertezze.
Non aggiungere requisiti o KPI non presenti.
Ogni output deve corrispondere a un item_id ricevuto.
Restituisci solo JSON valido conforme allo schema.

Input payload:
{{PROMPT_ENVELOPE_JSON}}
```

## Input envelope

L’envelope T4 v0.1 contiene requisiti e KPI candidati già individuati dalla pipeline locale.

Campi principali:

- `task_id`;
- `schema_version`;
- `dataset_id`;
- `privacy_context`;
- `task_rules`;
- `allowed_values`;
- `input_items`.

Ogni `input_item` contiene:

- `item_id`;
- `package_id`;
- `package_phase`;
- `item_type_hint`;
- `text_or_name_raw`;
- `deterministic_values`;
- `rule_hints`;
- `source_refs`.

`deterministic_values` può includere:

- `requirement_text_raw`;
- `formula_raw`;
- `target_raw`;
- `threshold_raw`;
- `unit_raw`;
- `mandatory_candidate`;
- `measurement_period_raw`;
- `data_source_raw`;
- `linked_deliverable_ids`.

Questi campi sono contesto, non output AI da consolidare.

## Output schema

```json
{
  "task_id": "T4",
  "schema_version": "schema_t4_requirements_kpi_v0_1",
  "dataset_id": "tram_t4_requirements_kpi_compact_v0_1",
  "response_status": "completed",
  "items": [
    {
      "item_id": "LUAS-T4-001",
      "item_type": "requirement",
      "text_or_name_normalized": "Disruption management procedure",
      "requirement_family": "operations_requirement",
      "kpi_family": null,
      "o_and_m_domain": "operations",
      "impact_tags": ["cost", "risk", "deliverable"],
      "linked_deliverable_ids": ["LUAS-T3-004"],
      "criticality": "high",
      "review_required": true,
      "confidence": 0.86,
      "cluster_label": "Disruption and fallback operations",
      "uncertainties": []
    }
  ]
}
```

## Enum `item_type`

```json
[
  "requirement",
  "kpi",
  "mixed_requirement_kpi",
  "escalate_to_t5",
  "unknown"
]
```

## Enum `requirement_family`

```json
[
  "mandatory_requirement",
  "operations_requirement",
  "maintenance_requirement",
  "asset_management_requirement",
  "mobilisation_requirement",
  "reporting_requirement",
  "workforce_requirement",
  "safety_security_requirement",
  "customer_experience_requirement",
  "sustainability_requirement",
  "compliance_requirement",
  "interface_requirement",
  "data_system_requirement",
  "unknown"
]
```

## Enum `kpi_family`

```json
[
  "availability",
  "punctuality_precision",
  "service_delivery",
  "asset_condition",
  "maintenance_performance",
  "safety_security",
  "customer_satisfaction",
  "passenger_information",
  "environment_sustainability",
  "reporting_quality",
  "workforce_training",
  "unknown"
]
```

## Enum `o_and_m_domain`

```json
[
  "transition",
  "operations",
  "maintenance",
  "asset_management",
  "safety_security",
  "customer_experience",
  "sustainability_environment",
  "workforce",
  "reporting_governance",
  "compliance",
  "data_systems",
  "pricing_financial",
  "unknown"
]
```

## Enum `impact_tags`

```json
[
  "cost",
  "risk",
  "deliverable",
  "timeline",
  "compliance",
  "kpi",
  "financial_escalation",
  "query_candidate"
]
```

## Enum `criticality`

```json
[
  "low",
  "medium",
  "high",
  "critical"
]
```

## Normalizzatore deterministico post-AI

Il normalizzatore T4 deve:

- eliminare eventuali campi vietati restituiti dall’AI;
- ripristinare testo raw, formula raw, target raw e mandatory candidate dai valori deterministici;
- sostituire enum non canonici con enum ufficiali;
- forzare `review_required=true` su mandatory, formule KPI, compliance, safety/security, AI/privacy e casi economici;
- forzare `item_type=escalate_to_t5` quando compaiono payment, bonus/malus, deductions, penali o valori economici;
- preservare `cluster_label` e `uncertainties` se utili alla review;
- bloccare il consolidamento se un item atteso manca nell’output.

## Regole di review iniziali

`review_required=true` è default per:

- requisiti mandatory o MR;
- KPI con formula, target o soglia;
- safety, security, cyber, data protection, AI clause e compliance critica;
- requisiti con impatto costo/rischio alto;
- item con `financial_escalation`;
- casi con fonte ambigua, OCR incerto o versioning non risolto.

`review_required=false` è ammesso per:

- requisiti informativi semplici;
- KPI descrittivi senza formula o collegamento economico;
- reporting standard a basso impatto;
- cluster già supportati da fonte chiara e non critici.

## Benchmark v0.1 da preparare

Il benchmark compatto T4 deve usare i quattro pacchetti:

- Copenhagen M1-M4 O&M;
- Dublin Luas O&M;
- Milano lotti extraurbani O&M;
- Dublin MetroLink PPP.

Dataset consigliato:

- 6 requisiti operations;
- 6 requisiti maintenance/asset;
- 4 requisiti reporting/compliance;
- 4 KPI non finanziari;
- almeno 4 casi che scalano a review o T5.

## Decisione provider

Stato benchmark: il dataset compatto T4 è stato preparato in `/Users/Matteo/Documents/TRAM/data/working/t4-requirements-kpi-compact-v0-1/` ed è stato valutato in `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t4-t8-compact-provider-benchmark-evaluation.md`.

Per T4 v0.1:

- Mistral `mistral-medium-3.5` è promosso su envelope L1 minimizzato;
- Gemini resta candidato, ma nella tornata T4-T8 non è stato valutabile per quota free tier;
- Cloudflare e Groq restano esclusi salvo micro-classificazioni L0;
- OpenRouter resta escluso salvo smoke L0;
- Cerebras resta escluso finché non viene promosso da benchmark dedicato;
- ogni uso L1 richiede gate privacy, clausole pacchetto e budget free/capped.

La route raccomandata per MVP è: parser locale + regole + Mistral su envelope minimizzato, Gemini quando la quota lo consente, normalizzatore deterministico + review queue.

## Prossimo passo consigliato

La specifica tecnica del normalizzatore T4 è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`. Il config e la fixture spec sono in `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json` e `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md`. La sede runtime è definita nell’ADR `/Users/Matteo/Documents/TRAM/docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md`. Le viste dashboard MVP e il registro `indicator_key` P0/P1 sono definiti rispettivamente in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-dashboard-views-t1-t8-v0-1.md` e `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-key-registry-p0-p1-v0-1.md`. Il prossimo passo è preparare fixture dashboard/review per T4.
