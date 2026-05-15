# TRAM V1 - Prompt/schema pack T6 cost driver O&M v0.1

Data: 2026-05-13
Stato: proposta operativa impostata
Ambito: T6 cost driver O&M, attività costose, rischi operativi e dipendenze

## Scopo

Il pack T6 v0.1 definisce come TRAM deve mappare requisiti, KPI, deliverable, scope e financial item in driver di costo o rischio operativo.

La decisione principale è: T6 non calcola importi e non stima l’offerta economica.

Per T6, la pipeline deve essere:

1. parser e regole collegano requisiti, deliverable, KPI, asset, frequenze e fonti;
2. regole identificano driver candidati e livello privacy ereditato;
3. l’AI, se ammessa, propone famiglia costo, dominio O&M, descrizione sintetica, dipendenze e incertezze;
4. il normalizzatore blocca importi, stime e assunzioni economiche inventate;
5. la review queue conferma priorità, impatto e falsi positivi.

## Decisione

Per T6 v0.1, l’AI può restituire solo:

- `cost_driver_id`;
- `driver_family`;
- `description_normalized`;
- `o_and_m_domain`;
- `cost_confidence`;
- `risk_level`;
- `linked_requirement_ids`;
- `linked_deliverable_ids`;
- `linked_kpi_ids`;
- `linked_financial_item_ids`;
- `review_required`;
- `confidence`;
- `uncertainties`.

L’AI non deve restituire:

- importi;
- stime;
- unit rates;
- margini;
- formule economiche;
- assunzioni di offerta;
- raccomandazioni di prezzo;
- contenuti integrali di pricing/payment.

## Versioni

| Campo | Valore |
| --- | --- |
| `prompt_pack_id` | `tram_free_ai_prompt_pack_t6_cost_drivers_v0_1` |
| `schema_pack_id` | `tram_free_ai_schema_pack_t6_cost_drivers_v0_1` |
| `schema_version` | `schema_t6_cost_drivers_v0_1` |
| `task_id` | `T6` |
| `benchmark_dataset_id` | `tram_t6_cost_drivers_compact_v0_1` |
| `privacy_default` | `L1_or_inherited` |
| `redaction_policy_pack` | `tram-ai-min-v0-1` |

## Regole comuni T6 v0.1

```text
Regole comuni TRAM AI T6 cost driver O&M v0.1.

Lavori solo sull’envelope fornito.
Non stimare costi, importi, unit rates, margini o prezzi.
Non inventare assunzioni economiche.
Classifica solo famiglia costo, dominio O&M, rischio, dipendenze e incertezze.
Se un driver dipende da pricing, payment, penali o financial item, segnala review_required=true e non sintetizzare il contenuto economico.
Distinguere attività certa, costo potenziale e rischio non quantificato.
Non aggiungere cost driver non presenti o non motivati dagli input.
Ogni output deve corrispondere a un cost_driver_id ricevuto.
Restituisci solo JSON valido conforme allo schema.

Input payload:
{{PROMPT_ENVELOPE_JSON}}
```

## Input envelope

L’envelope T6 v0.1 contiene driver candidati prodotti da parser e regole.

Campi principali:

- `task_id`;
- `schema_version`;
- `dataset_id`;
- `privacy_context`;
- `task_rules`;
- `allowed_values`;
- `input_cost_drivers`.

Ogni `input_cost_driver` contiene:

- `cost_driver_id`;
- `package_id`;
- `candidate_description_raw`;
- `linked_requirement_ids`;
- `linked_deliverable_ids`;
- `linked_kpi_ids`;
- `linked_financial_item_ids`;
- `rule_hints`;
- `source_refs`.

I financial item collegati possono essere solo ID o classi, non valori.

## Output schema

```json
{
  "task_id": "T6",
  "schema_version": "schema_t6_cost_drivers_v0_1",
  "dataset_id": "tram_t6_cost_drivers_compact_v0_1",
  "response_status": "completed",
  "cost_drivers": [
    {
      "cost_driver_id": "CPH-T6-001",
      "driver_family": "maintenance",
      "description_normalized": "Preventive and corrective maintenance planning for critical assets",
      "o_and_m_domain": "maintenance",
      "cost_confidence": "potential_cost_driver",
      "risk_level": "high",
      "linked_requirement_ids": ["CPH-T4-003"],
      "linked_deliverable_ids": ["CPH-T3-004"],
      "linked_kpi_ids": [],
      "linked_financial_item_ids": [],
      "review_required": true,
      "confidence": 0.84,
      "uncertainties": []
    }
  ]
}
```

## Enum `driver_family`

```json
[
  "operations",
  "maintenance",
  "mobilisation",
  "workforce",
  "energy",
  "spares_tools",
  "IT_systems",
  "reporting_governance",
  "safety_security",
  "customer_service",
  "compliance",
  "risk_allocation",
  "financial_linked",
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

## Enum `cost_confidence`

```json
[
  "confirmed_activity",
  "potential_cost_driver",
  "risk_not_quantified",
  "financial_linked_review",
  "unknown"
]
```

## Enum `risk_level`

```json
[
  "low",
  "medium",
  "high",
  "critical"
]
```

## Normalizzatore deterministico post-AI

Il normalizzatore T6 deve:

- eliminare importi, stime e campi economici restituiti dall’AI;
- ripristinare link a requisiti, deliverable, KPI e financial item dai valori deterministici quando presenti;
- forzare `review_required=true` se il driver è financial-linked, safety/security, workforce, compliance o rischio alto;
- ereditare privacy level massimo dalle fonti collegate;
- bloccare provider esterno se un driver eredita `L2_sensitive`;
- preservare descrizione normalizzata e incertezze se utili.

## Regole di review iniziali

`review_required=true` è default per:

- driver collegati a T5;
- driver con pricing/payment/penalty;
- driver workforce o mobilisation;
- driver safety/security/compliance;
- driver con asset condition, obsolescence o spares critici;
- driver ad alto impatto ma fonte ambigua.

## Benchmark v0.1 da preparare

Dataset consigliato:

- 4 driver operations;
- 4 driver maintenance/asset;
- 3 driver workforce/mobilisation;
- 3 driver reporting/compliance;
- 3 driver legati a KPI o penali da tenere in review.

## Decisione provider

Stato benchmark: il dataset compatto T6 è stato preparato in `/Users/Matteo/Documents/TRAM/data/working/t6-cost-drivers-compact-v0-1/` ed è stato valutato in `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t4-t8-compact-provider-benchmark-evaluation.md`.

Per T6 v0.1:

- Mistral `mistral-medium-3.5` è promosso solo su input L1 approvati;
- Gemini resta candidato, ma nella tornata T4-T8 non è stato valutabile per quota free tier;
- input che eredita L2 effettivo da T5 resta bloccato verso provider esterni;
- Cloudflare/Groq solo micro-classificazioni L0;
- OpenRouter e Cerebras non default.

La route raccomandata per MVP è: regole + review + Mistral solo su envelope minimizzato e ammesso, con Gemini da ritestare quando la quota lo consente.

## Prossimo passo consigliato

La specifica tecnica del normalizzatore T6 è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`. Il config e la fixture spec sono in `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json` e `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md`. La sede runtime è definita nell’ADR `/Users/Matteo/Documents/TRAM/docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md`. Le viste dashboard MVP e il registro `indicator_key` P0/P1 sono definiti rispettivamente in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-dashboard-views-t1-t8-v0-1.md` e `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-key-registry-p0-p1-v0-1.md`. Il prossimo passo è preparare fixture dashboard/review per T6.
