# TRAM V1 - Prompt/schema pack T1 L0 stage-aware v0.4

Data: 2026-05-13
Stato: proposta operativa per benchmark compatto multi-pacchetto
Ambito: T1 L0, document map, classificazione stage-aware su Copenhagen, Dublin Luas, Milano lotti extraurbani e Dublin MetroLink PPP

## Scopo

Il pack v0.4 aggiorna T1 L0 per renderlo davvero stage-aware.

La v0.3 ha dimostrato che la modalità corretta per il MVP è hybrid:

- l’AI classifica natura, ruolo e incertezze;
- il resolver deterministico calcola famiglia documento, versione, variante e stato corrente;
- la review queue gestisce conflitti e casi sensibili.

La v0.4 mantiene questa separazione, ma amplia la tassonomia per non forzare pacchetti diversi dentro categorie troppo generiche. In particolare aggiunge supporto esplicito per:

- prequalifica/PQP/PQQ;
- ITN e fasi negoziali;
- lotti bus extraurbani;
- GTFS, ZIP e dataset operativi;
- PEF, modelli economici e istruzioni economiche;
- chiarimenti, errata corrige, addendum e firme `.p7m`;
- criteri di valutazione, qualità, penali, personale e mezzi;
- envelope di qualificazione e tecnici.

## Decisione

Per T1 L0 v0.4, l’AI deve restituire solo:

- `package_phase`;
- `document_nature`;
- `document_role`;
- `stage_specificity`;
- `confidence`;
- `review_required`;
- `source_refs`;
- `uncertainties`.

L’AI non deve restituire:

- `version`;
- `document_family_key`;
- `variant_type`;
- `currentness`.

Questi campi restano responsabilità del resolver deterministico TRAM.

## Versioni

| Campo | Valore |
| --- | --- |
| `prompt_pack_id` | `tram_free_ai_prompt_pack_v0_4` |
| `schema_pack_id` | `tram_free_ai_schema_pack_v0_4` |
| `schema_version` | `schema_v0_4` |
| `task_id` | `T1` |
| `benchmark_dataset_id` | `tram_t1_l0_stage_aware_compact_v0_4` |
| `privacy_default` | `L0` |
| `redaction_policy_pack` | `tram-ai-min-v0-1` |

## Regole comuni v0.4

```text
Regole comuni TRAM AI T1 L0 v0.4.

Lavori solo sull’envelope fornito.
Usi solo metadati L0: filename, path, folder hint, title hint, file extension, package phase hint e source refs.
Non usare, chiedere o dedurre contenuti documentali non presenti.
Non sintetizzare prezzi, payment mechanism, penali, dati personali, clausole AI/privacy, cyber/security o contenuti contrattuali.
Classifica solo natura e ruolo del documento.
Se un titolo indica contenuti sensibili, segnala review_required=true, ma non sintetizzare il contenuto.
Se il documento appartiene a prequalifica, non forzarlo in categorie ITT.
Se il documento è ITN o negotiation, mantieni `package_phase=itn_package` o `negotiation_package` quando il pacchetto lo indica.
Se un file è `.zip`, `.p7m`, `.xlsm` o `.mpp`, usa l’estensione solo come segnale tecnico, non come prova del contenuto.
Non restituire version, currentness, document_family_key o variant_type.
Ogni item deve citare almeno una source_ref.
Restituisci solo JSON valido conforme allo schema.

Input payload:
{{PROMPT_ENVELOPE_JSON}}
```

## Envelope v0.4

L’envelope v0.4 resta compatibile con v0.3 ma aggiunge contesto di fase e valori consentiti espliciti.

Campi principali:

- `schema_version`;
- `prompt_pack_id`;
- `task_id`;
- `dataset_id`;
- `run_id`;
- `privacy_context`;
- `minimization_context`;
- `stage_context`;
- `allowed_values`;
- `input_chunks`;
- `task_payload`.

Il provider non deve ricevere corpo documento, tabelle, immagini, workbook, ZIP payload o testo OCR.

## Stage context

```json
{
  "stage_context": {
    "package_stage_hints": [
      "prequalification_package",
      "itt_package",
      "itn_package",
      "clarification_package"
    ],
    "stage_rules": [
      "Prequalification/PQP/PQQ/SQ documents are about selection, capability and envelopes, not full tender requirements.",
      "ITT documents are the main tender pack and may include contract, technical, economic and submission documents.",
      "ITN documents are tender/negotiation documents and may include redlines and revised instructions.",
      "Clarifications, addenda and errata corrige update the knowledge base but do not automatically replace a base document."
    ]
  }
}
```

## Enum `package_phase`

```json
[
  "prequalification_package",
  "itt_package",
  "itn_package",
  "negotiation_package",
  "revised_tender_package",
  "bafo_package",
  "addendum_package",
  "clarification_package",
  "contract_package",
  "market_engagement_package",
  "unknown"
]
```

## Enum `document_nature`

```json
[
  "tender_instructions",
  "prequalification_instructions",
  "selection_questionnaire",
  "qualification_envelope",
  "technical_envelope",
  "capability_evidence_template",
  "financial_standing_template",
  "submission_template",
  "evaluation_criteria",
  "pricing_workbook",
  "financial_guidance",
  "financial_model",
  "pef_guidance",
  "pef_workbook",
  "contract_conditions",
  "contract_definitions",
  "contract_specification",
  "payment_terms",
  "procurement_schedule",
  "service_schedule",
  "network_scope",
  "transport_dataset",
  "gtfs_dataset",
  "stops_dataset",
  "fleet_asset_data",
  "workforce_transfer",
  "quality_penalties",
  "data_room",
  "data_processing",
  "confidentiality_declaration",
  "clarification",
  "corrigendum",
  "addendum",
  "signed_wrapper",
  "technical_attachment",
  "operations_requirements",
  "maintenance_requirements",
  "unknown"
]
```

## Enum `document_role`

```json
[
  "instructions_to_tender",
  "invitation_to_negotiate",
  "prequalification_questionnaire",
  "prequalification_instructions",
  "qualification_envelope",
  "technical_envelope",
  "response_template",
  "form_of_tender",
  "declaration_form",
  "reference_project_template",
  "financial_standing_template",
  "o_and_m_reference_template",
  "track_changes_version",
  "procurement_schedule",
  "service_programme",
  "schedule_of_prices",
  "pef_guidance",
  "pef_model",
  "economic_offer_template",
  "conditions_of_contract",
  "definitions_and_abbreviations",
  "contract_specifications",
  "payment_attachment",
  "network_attachment",
  "line_sheets",
  "stops_list",
  "gtfs_archive",
  "fleet_attachment",
  "workforce_transfer_attachment",
  "quality_penalties_specification",
  "evaluation_criteria",
  "technical_offer_template",
  "data_room_agreement",
  "data_processing_agreement",
  "confidentiality_non_collusion",
  "clarification_update",
  "addendum_update",
  "signed_update",
  "technical_attachment",
  "unknown"
]
```

## Enum `stage_specificity`

```json
[
  "prequalification_only",
  "itt_core",
  "itn_negotiation",
  "clarification_or_addendum",
  "contract_execution_support",
  "cross_stage_support",
  "unknown"
]
```

## Schema response T1 L0 v0.4

```json
{
  "type": "object",
  "required": ["task_id", "schema_version", "dataset_id", "response_status", "task_output", "warnings"],
  "additionalProperties": false,
  "properties": {
    "task_id": { "type": "string", "enum": ["T1"] },
    "schema_version": { "type": "string", "enum": ["schema_v0_4"] },
    "dataset_id": { "type": "string" },
    "response_status": {
      "type": "string",
      "enum": ["completed", "completed_with_warnings", "insufficient_context", "schema_unable_to_comply"]
    },
    "task_output": {
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
              "stage_specificity",
              "source_refs",
              "confidence",
              "review_required",
              "uncertainties"
            ],
            "additionalProperties": false,
            "properties": {
              "chunk_id": { "type": "string" },
              "sample_id": { "type": "string" },
              "package_phase": { "type": "string" },
              "document_nature": { "type": "string" },
              "document_role": { "type": "string" },
              "stage_specificity": { "type": "string" },
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
    },
    "warnings": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}
```

## Tassonomia stage-aware

Regole per i casi benchmark:

- `Invitation to Negotiate` va classificato come `itn_package`, non come ITT generico.
- `Rev n Redline` mantiene la natura del documento base e usa `document_role=track_changes_version`.
- PQP/PQQ/prequalification pack usa `prequalification_package`, `selection_questionnaire`, `prequalification_questionnaire` o envelope/template specifici.
- `Qualification Envelope` e `Technical Envelope` non sono `form_of_tender`: sono envelope di risposta prequalifica.
- `GTFS` in `.zip` è `gtfs_dataset` con ruolo `gtfs_archive`.
- `PEF`, `modello redazione PEF`, financial/economic standing e economic offer non vanno sintetizzati: classificazione L0 e review.
- `Errata corrige`, clarification, addendum e query responses sono aggiornamenti, non documenti base.
- `.p7m` indica firma/wrapper: usare `signed_update` se il documento è un aggiornamento, altrimenti classificare la natura base e segnalare review se serve.
- qualità e penali vanno classificate come `quality_penalties`, ma non bisogna sintetizzare penali o KPI economici.
- `with track changes`, `track changes`, `redline` e `redlined` implicano `document_role=track_changes_version` e `review_required=true`.
- `Invitation to Negotiate` implica `document_role=invitation_to_negotiate`; non usare valori non previsti come `instructions_to_negotiate`.
- nei pacchetti Luas, `Schedules 1 to 16` e simili indicano `contract_specification` / `contract_specifications`, non condizioni contrattuali.
- `Financial and Economic Standing` o `Financial Standing Letter` in prequalifica indica `financial_standing_template` e richiede review.

## Criteri benchmark v0.4

Il benchmark compatto misura:

- `format_pass`: JSON valido e item leggibili;
- `ai_classification_pass`: `package_phase`, `document_nature`, `document_role`, `stage_specificity`;
- `stage_pass`: distinzione corretta tra prequalifica, ITT, ITN e chiarimenti;
- `sensitive_title_review_pass`: review richiesta quando il titolo indica pricing, payment, PEF, quality/penalties, personale o firma/aggiornamento;
- `no_forbidden_fields_pass`: assenza di `version`, `currentness`, `document_family_key`, `variant_type` nell’output AI.

## Normalizzatore post-AI

La v0.4 introduce anche un normalizzatore deterministico leggero, distinto dal resolver di versione/currentness.

Scopo:

- mappare alias non canonici verso enum ufficiali;
- riconciliare `document_nature` e `document_role` quando il ruolo è più specifico della natura;
- evitare che un output semanticamente corretto ma non standard rompa la pipeline.

Regole iniziali:

| Caso | Normalizzazione |
| --- | --- |
| `document_role=instructions_to_negotiate` | `document_role=invitation_to_negotiate` |
| `document_role=gtfs_archive` e `document_nature=transport_dataset` | `document_nature=gtfs_dataset` |
| `document_role=economic_offer_template` e `document_nature=financial_model` | `document_nature=pricing_workbook` |
| `package_phase=prequalification_package`, `document_role=o_and_m_reference_template`, `document_nature=operations_requirements` | `document_nature=capability_evidence_template` |
| `document_role=qualification_envelope`, `document_nature=selection_questionnaire` | `document_nature=qualification_envelope` |

Il normalizzatore deve salvare sempre il valore AI originale e il motivo della normalizzazione. Non deve inventare versioni, stato corrente o family key.

## Prossimo passo consigliato

Stato aggiornato: il benchmark compatto T1 L0 v0.4 è completato; T2 timeline v0.1 e T3 deliverable v0.1 sono documentati; i benchmark compatti T4-T8 v0.1 sono stati preparati ed eseguiti selettivamente.

La tassonomia complessiva T1-T8 è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-tx-task-taxonomy-t1-t8.md`.

Il report di preparazione T4-T8 è documentato in `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t4-t8-compact-benchmark-preparation.md`.

Il report di valutazione provider T4-T8 è documentato in `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t4-t8-compact-provider-benchmark-evaluation.md`.

La specifica dei normalizzatori deterministici T4-T8 è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`. Il config v0.1 è in `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json`; la specifica fixture è in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md`.

La sede runtime dei normalizzatori è definita nell’ADR `/Users/Matteo/Documents/TRAM/docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md`: TypeScript lato app/API/AI gateway come runtime canonico, con T5 su parser locale e review.

Le viste dashboard MVP collegate ai task T1-T8 sono definite in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-dashboard-views-t1-t8-v0-1.md`.

Il registro `indicator_key` P0/P1 è definito in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-key-registry-p0-p1-v0-1.md`; il passo successivo è usarlo per fixture applicative e wireframe del primo slice UI.
