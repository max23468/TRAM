# TRAM V1 - Prompt/schema pack benchmark AI gratuito v0.3

Data: 2026-05-13
Stato: proposta operativa per envelope AI con privacy, minimizzazione e stati di blocco
Ambito: T1 L0, primi task L1 controllati, blocco L2 verso provider esterni

## Scopo

Questo pack v0.3 evolve il pack v0.2 aggiungendo i campi necessari per usare TRAM con un AI gateway governato:

- classi documentali `dc_*`;
- privacy level richiesto ed effettivo;
- gate status;
- provider candidato;
- policy di redazione;
- minimization summary;
- stati di blocco;
- review umana obbligatoria quando serve.

Il pack v0.3 non cambia la decisione provider: Gemini resta candidato principale T1 L0 e Mistral resta secondo provider forte. Il cambiamento è architetturale: ogni prompt deve essere costruito da un envelope tracciabile, minimizzato e coerente con il registro `AiCall`.

## Relazione con v0.2

Il pack v0.2 resta valido come benchmark T1 L0 di classificazione documentale.

Nota dopo il rerun Copenhagen v0.3: `currentness` resta nel `task_output` perché è utile per audit e confronto, ma non deve essere consolidato come verità se arriva solo dall’AI. Per V1, `document_family`, `version` e `currentness` vanno risolti prima o dopo la chiamata AI con regole deterministiche e review queue; l’AI può proporre commenti, anomalie e incertezze.

Nota dopo il rerun hybrid: per T1 L0 il gateway può usare un output AI ridotto a natura/ruolo/incertezze e completare `version`, `document_family_key`, `variant_type` e `currentness` con il resolver deterministico. Questa è la modalità consigliata per MVP.

Nota dopo Luas: T1 L0 v0.3 hybrid passa anche su un campione Luas di 19 item. Le naming convention `Rev n`, `_Redline`, `_RedLine` e codice project-level `TII400` vanno considerate nel resolver, non nel prompt provider.

Nota dopo Milano e MetroLink: T1 L0 v0.3 hybrid passa con Gemini anche su un ITT bus multi-lotto e su una prequalifica PPP, ma solo usando baseline compatibili con gli enum attuali. Lo schema v0.3 non ha ancora ruoli dedicati per prequalifica, PEF guidance, GTFS, firme `.p7m`, criteri di valutazione, qualità/penali e lotti. Questi casi vanno segnati come debito v0.4, non risolti con prompt più lunghi.

Il pack v0.3 aggiunge un livello comune sopra i task:

- `PromptEnvelope`: input governato da gate e minimizzazione;
- `TaskOutput`: output specifico del task, per esempio classificazione documentale o requisiti O&M;
- `PolicyOutcome`: stato prodotto dal gateway quando la chiamata non può partire o quando l’output richiede review.

In pratica:

- per T1 L0, v0.3 conserva i campi `package_phase`, `document_nature`, `document_role`, `currentness`;
- per L1, v0.3 impone source refs, minimizzazione e review;
- per L2 verso provider esterni, v0.3 prevede un record di blocco, non una chiamata AI.

## Versioni

| Campo | Valore |
| --- | --- |
| `prompt_pack_id` | `tram_free_ai_prompt_pack_v0_3` |
| `schema_pack_id` | `tram_free_ai_schema_pack_v0_3` |
| `schema_version` | `schema_v0_3` |
| `benchmark_dataset_id` | `cph_m1m4_free_ai_l0_l1_v0_1` |
| `supported_task_ids` | `T1`, `T_requirements_l1`, `T5_blocked_external` |
| `privacy_default` | task-specific |
| `redaction_policy_pack` | `tram-ai-min-v0-1` |

## Regole comuni v0.3

```text
Regole comuni TRAM AI v0.3.

Lavori solo sull'envelope fornito.
Non chiedere, dedurre o usare contenuti non presenti nell'envelope.
Non inventare documenti, date, importi, KPI, clausole o fonti.
Non sintetizzare payment mechanism, prezzi, penali, garanzie, dati personali, clausole AI/data protection o cyber/security se l'envelope è L0 o L1.
Se l'envelope non contiene evidenze sufficienti, restituisci "insufficient_context".
Se trovi nel chunk contenuti che sembrano più sensibili del privacy_level dichiarato, segnala "privacy_escalation_suspected".
Ogni item deve citare almeno una source_ref.
Ogni output critico deve avere review_required=true.
Restituisci solo JSON conforme allo schema.

Input payload:
{{PROMPT_ENVELOPE_JSON}}
```

## Prompt envelope v0.3

Questo envelope è costruito dal gateway prima della chiamata AI. Il provider non deve ricevere contenuti fuori da `input_chunks`.

```json
{
  "schema_version": "schema_v0_3",
  "prompt_pack_id": "tram_free_ai_prompt_pack_v0_3",
  "task_id": "T1",
  "dataset_id": "cph_m1m4_free_ai_l0_l1_v0_1",
  "run_id": "ai-run-cph-t1-l0-v0-3-example",
  "tender_space_ref": {
    "tender_id": "copenhagen-m1-m4-om",
    "package_id": "cph-m1m4-tender-pack",
    "package_phase_hint": "itt_package"
  },
  "provider_context": {
    "provider_candidate": "gemini",
    "model_candidate": "gemini-2.5-flash-lite",
    "account_tier": "free_or_capped",
    "policy_snapshot_id": "provider-policy-gemini-2026-05-13",
    "budget_policy_id": "budget-policy-zero-cost"
  },
  "gate_context": {
    "gate_decision_id": "gate-cph-t1-l0-v0-3-example",
    "gate_status": "allowed_minimized",
    "clause_scan_status": "no_blocker_found",
    "cost_gate_status": "allowed_free",
    "human_approval_required": false
  },
  "privacy_context": {
    "requested_privacy_level": "L0",
    "effective_privacy_level": "L0",
    "content_classes": ["dc_document_classification"],
    "external_provider_allowed": true,
    "escalation_policy": "escalate_to_l2_if_sensitive_content_detected"
  },
  "minimization_context": {
    "redaction_policy_id": "tram-ai-min-v0-1-l0-document-classification",
    "minimization_summary": {
      "included": ["filename", "folder_hint", "title_hint", "version_label", "headings"],
      "excluded": ["document_body", "pricing_tables", "personal_data"],
      "reason": "Task limited to L0 document classification.",
      "escalation": "none"
    },
    "excluded_content_summary": "Body text and any pricing or personal data were excluded."
  },
  "input_chunks": [
    {
      "chunk_id": "D1-meta",
      "sample_id": "D1",
      "document_ref": {
        "document_id": "D1",
        "document_version_id": "D1-v5",
        "file_name_normalized": "Instructions to Tender v5.pdf"
      },
      "source_refs": [
        {
          "source_id": "D1",
          "source_type": "metadata",
          "locator": "filename",
          "evidence_summary": "Filename indicates Instructions to Tender version 5."
        }
      ],
      "chunk_text_redacted": "filename: Instructions to Tender v5.pdf\nfolder_hint: Tender documents\nversion_label: v5\nheading_hints: Instructions to Tender",
      "included_fields": ["filename", "folder_hint", "version_label", "heading_hints"],
      "excluded_fields": ["document_body"],
      "char_count": 135
    }
  ],
  "task_payload": {
    "expected_output": "document_classification"
  }
}
```

## Gate status enum

| Stato | Significato |
| --- | --- |
| `allowed_minimized` | Chiamata ammessa con input già minimo |
| `allowed_redacted` | Chiamata ammessa dopo redazione |
| `requires_human_approval` | Il gateway deve chiedere approvazione prima della chiamata |
| `requires_policy_review` | Provider, clausole o policy non chiari |
| `blocked_privacy` | Contenuto troppo sensibile per provider esterno |
| `blocked_clauses` | Clausole gara impediscono o rendono incerto l’invio |
| `blocked_budget` | Costo o quota non ammessi |
| `local_only` | Ammesso solo locale/self-hosted |
| `human_only` | Da gestire solo manualmente |

## Schema response comune v0.3

Ogni risposta AI ammessa deve rispettare questa struttura comune.

```json
{
  "type": "object",
  "required": [
    "task_id",
    "schema_version",
    "dataset_id",
    "response_status",
    "privacy_assessment",
    "task_output",
    "warnings"
  ],
  "additionalProperties": false,
  "properties": {
    "task_id": { "type": "string" },
    "schema_version": { "type": "string", "enum": ["schema_v0_3"] },
    "dataset_id": { "type": "string" },
    "response_status": {
      "type": "string",
      "enum": [
        "completed",
        "completed_with_warnings",
        "insufficient_context",
        "privacy_escalation_suspected",
        "schema_unable_to_comply"
      ]
    },
    "privacy_assessment": {
      "type": "object",
      "required": [
        "effective_privacy_level_echo",
        "content_classes_echo",
        "privacy_escalation_suspected",
        "review_required"
      ],
      "additionalProperties": false,
      "properties": {
        "effective_privacy_level_echo": {
          "type": "string",
          "enum": ["L0", "L1", "L2"]
        },
        "content_classes_echo": {
          "type": "array",
          "items": { "type": "string" }
        },
        "privacy_escalation_suspected": { "type": "boolean" },
        "privacy_escalation_reason": { "type": ["string", "null"] },
        "review_required": { "type": "boolean" }
      }
    },
    "task_output": { "type": "object" },
    "warnings": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```

## T1 - Classificazione documentale v0.3

### Prompt task

```text
Task T1 - Classificazione documentale v0.3.

Classifica ogni input chunk separando:
- package_phase;
- document_nature;
- document_role;
- version;
- issue_date;
- currentness.

Usa solo metadati, titolo, heading e source refs presenti nell'envelope.
Non usare corpo documento se non è nell'envelope.
Se il documento è payment, pricing o financial, classificalo soltanto.
Non sintetizzare il contenuto economico.
Se rilevi che il contenuto sembra L2, segnala privacy_escalation_suspected=true.
```

### Output `task_output` T1

```json
{
  "type": "object",
  "required": ["items"],
  "additionalProperties": false,
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "chunk_id",
          "sample_id",
          "package_phase",
          "document_nature",
          "document_role",
          "version",
          "issue_date",
          "currentness",
          "source_refs",
          "confidence",
          "review_required",
          "uncertainties"
        ],
        "additionalProperties": false,
        "properties": {
          "chunk_id": { "type": "string" },
          "sample_id": { "type": "string" },
          "package_phase": {
            "type": "string",
            "enum": [
              "prequalification_package",
              "itt_package",
              "itn_package",
              "negotiation_package",
              "revised_tender_package",
              "bafo_package",
              "addendum_package",
              "clarification_package",
              "contract_package",
              "unknown"
            ]
          },
          "document_nature": {
            "type": "string",
            "enum": [
              "tender_instructions",
              "version_comparison",
              "procurement_schedule",
              "submission_template",
              "pricing_workbook",
              "contract_conditions",
              "contract_definitions",
              "contract_specification",
              "payment_terms",
              "technical_attachment",
              "data_room",
              "clarification",
              "addendum",
              "unknown"
            ]
          },
          "document_role": {
            "type": "string",
            "enum": [
              "instructions_to_tender",
              "track_changes_version",
              "procurement_schedule",
              "form_of_tender",
              "schedule_of_prices",
              "conditions_of_contract",
              "definitions_and_abbreviations",
              "contract_specifications",
              "payment_attachment",
              "technical_attachment",
              "data_processing_agreement",
              "ai_clause_document",
              "unknown"
            ]
          },
          "version": { "type": ["string", "null"] },
          "issue_date": { "type": ["string", "null"] },
          "currentness": {
            "type": "string",
            "enum": ["current_candidate", "not_current_candidate", "unknown"]
          },
          "source_refs": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["source_id", "source_type", "locator", "evidence_summary"],
              "additionalProperties": false,
              "properties": {
                "source_id": { "type": "string" },
                "source_type": { "type": "string" },
                "locator": { "type": "string" },
                "evidence_summary": { "type": "string" }
              }
            }
          },
          "confidence": { "type": "number" },
          "review_required": { "type": "boolean" },
          "uncertainties": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }
    }
  }
}
```

## T_requirements_l1 - Requisiti O&M L1

### Prompt task

```text
Task T_requirements_l1 - Estrazione requisiti O&M v0.3.

Estrai solo requisiti presenti nei chunk.
Non usare sezioni non presenti.
Non estrarre pricing, payment mechanism, penali, dati personali, cyber/security dettagliata o clausole AI/data protection.
Se un requisito contiene contenuto L2, non sintetizzarlo: segnala escalation.
Ogni requisito deve avere source_refs e review_required.
```

### Output `task_output` requisiti L1

```json
{
  "type": "object",
  "required": ["requirements"],
  "additionalProperties": false,
  "properties": {
    "requirements": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "chunk_id",
          "requirement_text",
          "requirement_type",
          "owner",
          "action",
          "object",
          "frequency",
          "deadline",
          "linked_deliverable",
          "linked_kpi",
          "cost_driver_candidate",
          "risk_class",
          "source_refs",
          "confidence",
          "review_required",
          "escalation"
        ],
        "additionalProperties": false,
        "properties": {
          "chunk_id": { "type": "string" },
          "requirement_text": { "type": "string" },
          "requirement_type": {
            "type": "string",
            "enum": ["mandatory", "general", "information", "evaluation_factor", "unclear"]
          },
          "owner": { "type": ["string", "null"] },
          "action": { "type": ["string", "null"] },
          "object": { "type": ["string", "null"] },
          "frequency": { "type": ["string", "null"] },
          "deadline": { "type": ["string", "null"] },
          "linked_deliverable": { "type": ["string", "null"] },
          "linked_kpi": { "type": ["string", "null"] },
          "cost_driver_candidate": { "type": "boolean" },
          "risk_class": { "type": "string", "enum": ["critical", "high", "medium", "low", "unclear"] },
          "source_refs": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["source_id", "source_type", "locator", "evidence_summary"],
              "additionalProperties": false,
              "properties": {
                "source_id": { "type": "string" },
                "source_type": { "type": "string" },
                "locator": { "type": "string" },
                "evidence_summary": { "type": "string" }
              }
            }
          },
          "confidence": { "type": "number" },
          "review_required": { "type": "boolean" },
          "escalation": {
            "type": "string",
            "enum": ["none", "possible_l2", "insufficient_context", "human_review"]
          }
        }
      }
    }
  }
}
```

## T5_blocked_external - Payment mechanism L2

Per provider esterni, T5 non deve generare una chiamata AI nella V1.

Il gateway deve produrre invece un record di blocco:

```json
{
  "schema_version": "schema_v0_3",
  "task_id": "T5_blocked_external",
  "gate_status": "blocked_privacy",
  "effective_privacy_level": "L2",
  "content_classes": [
    "dc_payment_mechanism",
    "dc_financials_pricing",
    "dc_kpi_financial_linked"
  ],
  "provider_candidate": "external_provider",
  "reason": "Payment mechanism and pricing content are L2. External providers are blocked in TRAM V1.",
  "allowed_routes": [
    "local_parser",
    "human_review",
    "self_hosted_after_runbook"
  ],
  "review_required": true,
  "source_refs": []
}
```

Se il task gira localmente o su self-hosted approvato, può usare lo stesso envelope v0.3 ma con:

- `provider_candidate = self_hosted`;
- `external_provider_allowed = false`;
- `gate_status = local_only`;
- `review_required = true`.

## Validazione v0.3

Per ogni run v0.3 misurare:

- schema valid JSON;
- presenza di `content_classes`;
- privacy level coerente;
- assenza di contenuti vietati nel prompt envelope;
- `redaction_policy_id` presente;
- `minimization_summary` presente;
- source refs presenti;
- review flag corretto;
- escalation L2 rilevata quando compare contenuto sensibile;
- nessuna sintesi payment su provider esterno.

## Impatti su benchmark e sviluppo

Il pack v0.3 rende possibili:

- rerun T1 L0 con envelope più vicino all’architettura finale;
- primi test L1 solo dopo approvazione e policy provider;
- blocco automatico dei task L2 verso provider esterni;
- log coerente in `AiCall`;
- review queue più informata, perché ogni output porta `review_required` e motivi di escalation.

## Documenti collegati

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-2.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-call-registry-and-gates-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-document-class-provider-matrix-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-chunk-minimization-redaction-policy-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-document-family-version-currentness-resolver-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-benchmark-protocol.md`

## Debiti da recuperare

- Consolidare T1 L0 v0.3 hybrid come baseline document map MVP.
- Passare a T2 timeline su Luas timetables e Copenhagen Procurement Schedule/MPP.
- Creare una baseline v0.3 che includa anche privacy/gate fields.
- Definire test automatici per verificare che un envelope L2 non venga inviato a provider esterni.
- Decidere se usare v0.3 anche per il micro-task Cloudflare o mantenerlo separato.
- Stato successivo già completato: T1 v0.4 stage-aware, T2 timeline v0.1 e T3 deliverable v0.1 sono stati definiti e benchmarkati.
- Usare v0.3 solo come storico della transizione verso v0.4.

## Prossimo passo consigliato

Usare T1 v0.4, T2 v0.1, T3 v0.1 e il registro `indicator_key` P0/P1 per fixture applicative del primo slice UI.
