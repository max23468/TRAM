# TRAM V1 - Prompt/schema pack T3 deliverable v0.1

Data: 2026-05-13
Stato: proposta operativa validata con benchmark compatto
Ambito: T3 deliverable di gara, allegati, submission requirements, buste e template

## Scopo

Il pack T3 v0.1 definisce come TRAM deve individuare, normalizzare e validare i deliverable richiesti nei pacchetti gara.

La decisione principale è simile a T2: l’AI non è fonte primaria dei requisiti formali.

Per T3, la pipeline deve essere:

1. parser e regole individuano sezioni “documents to be submitted”, “tender submission requirements”, buste, allegati, criteri, page limit, punteggi, formato e obbligatorietà;
2. regole deterministiche salvano codice, obbligatorietà, formato, page limit, punteggio, deadline e fonte;
3. l’AI normalizza il nome deliverable, classifica tipo, area di submission, dominio O&M, dipendenze e incertezze;
4. la review queue riceve deliverable economici, PEF, pricing, deliverable con cost driver, pass/fail critici e casi ambigui.

## Decisione

Per T3 deliverable v0.1, l’AI può restituire solo:

- `deliverable_id`;
- `deliverable_name_normalized`;
- `deliverable_type`;
- `submission_area`;
- `o_and_m_domain`;
- `criticality`;
- `review_required`;
- `confidence`;
- `dependencies`;
- `uncertainties`.

L’AI non deve restituire:

- `code`;
- `mandatory`;
- `page_limit`;
- `max_marks`;
- `evaluation_weight`;
- `format_requirement`;
- `deadline_ref`;
- valori economici;
- formule di punteggio;
- clausole complete.

Questi campi restano responsabilità di parser e regole deterministiche.

## Versioni

| Campo | Valore |
| --- | --- |
| `prompt_pack_id` | `tram_free_ai_prompt_pack_t3_deliverables_v0_1` |
| `schema_pack_id` | `tram_free_ai_schema_pack_t3_deliverables_v0_1` |
| `schema_version` | `schema_t3_deliverables_v0_1` |
| `task_id` | `T3` |
| `benchmark_dataset_id` | `tram_t3_deliverables_compact_v0_1` |
| `privacy_default` | `L1_minimized` |
| `redaction_policy_pack` | `tram-ai-min-v0-1` |

## Regole comuni T3 v0.1

```text
Regole comuni TRAM AI T3 deliverable v0.1.

Lavori solo sull’envelope fornito.
Non estrarre, modificare o inventare codice, obbligatorietà, page limit, max marks, format requirement o deadline.
I requisiti formali sono stati prodotti da parser e regole deterministiche.
Normalizza il nome deliverable e classifica solo tipo deliverable, area di submission, dominio O&M, criticità, review, dipendenze e incertezze.
Se rule_hints segnala review_required=true, non attenuare il rischio.
Non aggiungere deliverable non presenti.
Non sintetizzare prezzi, payment mechanism, penali, dati personali o clausole riservate.
Ogni deliverable deve corrispondere a un deliverable_id ricevuto.
Restituisci solo JSON valido conforme allo schema.

Input payload:
{{PROMPT_ENVELOPE_JSON}}
```

## Input envelope

L’envelope T3 v0.1 contiene deliverable già individuati dalla pipeline locale.

Campi principali:

- `task_id`;
- `schema_version`;
- `dataset_id`;
- `privacy_context`;
- `task_rules`;
- `allowed_values`;
- `input_deliverables`.

Ogni `input_deliverable` contiene:

- `deliverable_id`;
- `package_id`;
- `package_phase`;
- `deliverable_name_raw`;
- `deterministic_values`;
- `rule_hints`;
- `source_refs`.

`deterministic_values` può includere:

- `code`;
- `mandatory`;
- `format_requirement`;
- `page_limit`;
- `max_marks`;
- `evaluation_weight`;
- `deadline_ref`.

Questi campi sono forniti all’AI come contesto, ma non devono essere restituiti.

## Output schema

```json
{
  "task_id": "T3",
  "schema_version": "schema_t3_deliverables_v0_1",
  "dataset_id": "tram_t3_deliverables_compact_v0_1",
  "response_status": "completed",
  "deliverables": [
    {
      "deliverable_id": "LUAS-T3-003",
      "deliverable_name_normalized": "Draft transition plan",
      "deliverable_type": "technical_plan",
      "submission_area": "technical",
      "o_and_m_domain": "transition",
      "criticality": "critical",
      "review_required": false,
      "confidence": 0.9,
      "dependencies": [],
      "uncertainties": []
    }
  ]
}
```

## Enum `deliverable_type`

```json
[
  "administrative_bundle",
  "form_of_tender",
  "technical_offer",
  "technical_plan",
  "timetable_roster",
  "pricing_workbook",
  "economic_offer_template",
  "financial_model",
  "combined_financial_offer",
  "declaration",
  "insurance_checklist",
  "subcontractor_list",
  "clarification_comment",
  "pqq_envelope_section",
  "reference_project",
  "letter_of_undertaking",
  "format_compliance_requirement",
  "supporting_evidence",
  "unknown"
]
```

## Enum `submission_area`

```json
[
  "administrative",
  "technical",
  "economic",
  "financial",
  "clarification",
  "pqq_qualification",
  "pqq_technical",
  "compliance",
  "unknown"
]
```

## Enum `o_and_m_domain`

```json
[
  "transition",
  "operations",
  "maintenance",
  "safety_security",
  "sustainability_environment",
  "workforce",
  "pricing_financial",
  "compliance",
  "procurement_admin",
  "project_finance",
  "reference_projects",
  "unknown"
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

Il normalizzatore T3 deve:

- eliminare eventuali campi vietati restituiti dall’AI;
- sostituire `deliverable_type`, `submission_area`, `o_and_m_domain`, `criticality` e `review_required` con i valori deterministici quando `rule_hints` li fornisce;
- preservare `deliverable_name_normalized` se utile;
- preservare `dependencies` e `uncertainties` se aggiungono informazione;
- bloccare il consolidamento se mancano deliverable attesi;
- mandare in review ogni deliverable economico, PEF, pricing, cost-driver, pass/fail critico o caso ambiguo.

## Regole di review iniziali

`review_required=true` è default per:

- pricing document, schedule of prices, economic offer e PEF;
- deliverable che possono includere cost driver o savings;
- deliverable pass/fail critici;
- technical offer quando può contenere rischio di contaminazione economica;
- combined offer o PEF combinatorio;
- casi in cui source refs o versioni documentali divergono.

`review_required=false` è ammesso per:

- form amministrativi chiari;
- liste e dichiarazioni standard;
- envelope PQP quando la struttura è chiara;
- reference projects se il requisito è solo classificatorio e non ancora valutativo.

## Benchmark v0.1

Il benchmark compatto T3 usa 22 deliverable su quattro pacchetti:

- Copenhagen M1-M4 O&M;
- Dublin Luas O&M;
- Milano lotti extraurbani O&M;
- Dublin MetroLink PPP.

Include:

- form of tender;
- schedule/pricing document;
- dichiarazioni;
- comments to tender documents e cost driver;
- list of subcontractors;
- draft transition, operations e maintenance plans;
- enhanced timetable e driver rosters;
- offerta tecnica;
- offerta economica;
- PEF e PEF combinatorio;
- PQQ qualification envelope;
- PQQ technical envelope;
- financial standing letter;
- reference projects O&M;
- format/page-limit compliance.

Artefatti:

- `/Users/Matteo/Documents/TRAM/data/working/t3-deliverables-compact-v0-1/benchmark-inputs/tram-t3-deliverables-compact-input-envelope-v0-1-r1.json`;
- `/Users/Matteo/Documents/TRAM/data/working/t3-deliverables-compact-v0-1/benchmark-baselines/tram-t3-deliverables-compact-baseline-v0-1-r1.json`;
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t3-deliverables-compact-benchmark-evaluation.md`.

## Decisione provider

Per T3 v0.1:

- Gemini e Mistral sono entrambi promossi sul benchmark compatto;
- Mistral resta utile come secondo provider europeo e controllo qualità;
- Cloudflare, Groq e OpenRouter restano esclusi dal T3 L1 minimizzato finché la matrice provider non li abilita esplicitamente;
- Cerebras non viene usato per T3 perché non promosso nei benchmark precedenti.

La route raccomandata per MVP è: parser locale + regole + Gemini o Mistral su envelope minimizzato + normalizzatore deterministico + review queue.

## Prossimo passo consigliato

Passare a una scelta di priorità tra T4 requisiti/KPI e design della dashboard MVP. Se si resta sulla pipeline AI, il prossimo benchmark più utile è T4 requisiti e KPI non finanziari, lasciando financial/payment mechanism a parser e review umana.
