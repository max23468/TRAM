# TRAM V1 - Prompt/schema pack T7 contraddizioni candidate v0.1

Data: 2026-05-13
Stato: proposta operativa impostata
Ambito: T7 contraddizioni candidate, mismatch, version conflict, ambiguità e missing evidence

## Scopo

Il pack T7 v0.1 definisce come TRAM deve produrre contraddizioni candidate tra documenti, versioni, timeline, requisiti, KPI, deliverable e financial item.

La decisione principale è: T7 produce candidate, non verità.

Per T7, la pipeline deve essere:

1. parser e regole confrontano valori, date, versioni, ID documento, liste documentali, requisiti e source refs;
2. regole producono issue candidate con fonti minime;
3. l’AI, se ammessa dal livello privacy, spiega perché potrebbe essere un conflitto e propone severità candidata;
4. il normalizzatore distingue contraddizione, ambiguità, missing evidence, version conflict e parser issue;
5. la review queue conferma, respinge o trasforma in T8 chiarimenti/Q&A.

## Decisione

Per T7 v0.1, l’AI può restituire solo:

- `contradiction_id`;
- `issue_title`;
- `issue_type`;
- `why_it_may_be_a_conflict`;
- `severity_candidate`;
- `recommended_action`;
- `review_required`;
- `confidence`;
- `uncertainties`.

L’AI non deve:

- scegliere quale fonte è vera;
- consolidare un valore finale;
- trasformare un dubbio in certezza;
- proporre chiarimento definitivo;
- sintetizzare contenuti L2 non ammessi;
- inventare documenti o fonti.

## Versioni

| Campo | Valore |
| --- | --- |
| `prompt_pack_id` | `tram_free_ai_prompt_pack_t7_contradictions_v0_1` |
| `schema_pack_id` | `tram_free_ai_schema_pack_t7_contradictions_v0_1` |
| `schema_version` | `schema_t7_contradictions_v0_1` |
| `task_id` | `T7` |
| `benchmark_dataset_id` | `tram_t7_contradictions_compact_v0_1` |
| `privacy_default` | `inherits_from_sources` |
| `redaction_policy_pack` | `tram-ai-min-v0-1` |

## Regole comuni T7 v0.1

```text
Regole comuni TRAM AI T7 contraddizioni candidate v0.1.

Lavori solo sull’envelope fornito.
Ogni item è una contraddizione o ambiguità candidata generata da parser/regole.
Non decidere quale fonte sia vera.
Non consolidare valori finali.
Non trasformare un possibile conflitto in affermazione certa.
Spiega in modo prudente perché il caso potrebbe richiedere review.
Se il caso sembra parser issue o missing evidence, classificalo così.
Non aggiungere nuove fonti o documenti.
Ogni output deve corrispondere a un contradiction_id ricevuto.
Restituisci solo JSON valido conforme allo schema.

Input payload:
{{PROMPT_ENVELOPE_JSON}}
```

## Input envelope

L’envelope T7 v0.1 contiene issue candidate prodotte da regole.

Campi principali:

- `task_id`;
- `schema_version`;
- `dataset_id`;
- `privacy_context`;
- `task_rules`;
- `allowed_values`;
- `input_candidates`.

Ogni `input_candidate` contiene:

- `contradiction_id`;
- `package_id`;
- `candidate_type_hint`;
- `conflicting_values`;
- `documents_involved`;
- `rule_reason`;
- `source_refs`;
- `privacy_level_effective`.

## Output schema

```json
{
  "task_id": "T7",
  "schema_version": "schema_t7_contradictions_v0_1",
  "dataset_id": "tram_t7_contradictions_compact_v0_1",
  "response_status": "completed",
  "contradictions": [
    {
      "contradiction_id": "CPH-T7-001",
      "issue_title": "Different tender opening dates in schedule sources",
      "issue_type": "date_mismatch",
      "why_it_may_be_a_conflict": "Two current schedule sources indicate different dates for the same milestone.",
      "severity_candidate": "high",
      "recommended_action": "review_and_consider_query",
      "review_required": true,
      "confidence": 0.88,
      "uncertainties": []
    }
  ]
}
```

## Enum `issue_type`

```json
[
  "numeric_mismatch",
  "date_mismatch",
  "version_conflict",
  "obligation_conflict",
  "definition_conflict",
  "missing_document",
  "document_list_mismatch",
  "legal_reference_mismatch",
  "ambiguity",
  "parser_issue",
  "not_a_conflict",
  "unknown"
]
```

## Enum `severity_candidate`

```json
[
  "low",
  "medium",
  "high",
  "critical"
]
```

## Enum `recommended_action`

```json
[
  "review_only",
  "review_and_update_value",
  "review_and_consider_query",
  "mark_as_parser_issue",
  "mark_as_missing_evidence",
  "dismiss_candidate",
  "unknown"
]
```

## Normalizzatore deterministico post-AI

Il normalizzatore T7 deve:

- eliminare valori finali consolidati restituiti dall’AI;
- ripristinare `conflicting_values`, `documents_involved` e source refs dai valori deterministici;
- forzare `review_required=true` salvo `not_a_conflict` o `parser_issue` a basso rischio;
- ereditare privacy level massimo dalle fonti;
- bloccare provider esterno se il caso eredita L2;
- preservare spiegazione e incertezze se prudenti e supportate.

## Regole di review iniziali

`review_required=true` è default per:

- date mismatch;
- version conflict;
- obligation conflict;
- valori economici o payment;
- KPI/formule;
- documenti mancanti;
- ambiguità su requisiti mandatory;
- casi che potrebbero generare chiarimenti.

## Benchmark v0.1 da preparare

Dataset consigliato:

- 3 date mismatch;
- 3 version conflict;
- 3 numeric/scope mismatch;
- 3 obligation conflict;
- 3 missing document o document list mismatch;
- almeno 5 falsi positivi controllati per misurare prudenza.

## Decisione provider

Stato benchmark: il dataset compatto T7 è stato preparato in `/Users/Matteo/Documents/TRAM/data/working/t7-contradictions-compact-v0-1/` ed è stato valutato in `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t4-t8-compact-provider-benchmark-evaluation.md`.

Per T7 v0.1:

- nessun provider è promosso come default T7;
- Mistral small restituisce tutti gli item in batch, ma non supera severity/action e review gate;
- Gemini resta candidato teorico, ma nella tornata T4-T8 non è stato valutabile per quota free tier;
- casi con fonti L2 restano locali/human-first;
- Cloudflare/Groq solo micro-classificazioni L0;
- T7 deve sempre generare review item, non dato validato.

La route raccomandata per MVP è: regole/confronti + review queue; AI solo come supporto descrittivo opzionale, non per severity/action.

## Prossimo passo consigliato

La specifica tecnica del normalizzatore T7 è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`. Il config e la fixture spec sono in `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json` e `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md`. La sede runtime è definita nell’ADR `/Users/Matteo/Documents/TRAM/docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md`. Le viste dashboard MVP e il registro `indicator_key` P0/P1 sono definiti rispettivamente in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-dashboard-views-t1-t8-v0-1.md` e `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-key-registry-p0-p1-v0-1.md`. Il prossimo passo è preparare fixture T7 rules/review-first, lasciando severity, action e review gate a regole/review umana.
