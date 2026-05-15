# TRAM V1 - Prompt/schema pack benchmark AI gratuito v0.2

Data: 2026-05-13
Stato: patch operativa T1 L0, da usare dopo la valutazione baseline-aware v0.1
Ambito: classificazione documentale Copenhagen M1-M4 O&M

## Scopo

Questo pack v0.2 corregge il problema emerso nel primo smoke test Gemini T1 L0.

Nel pack v0.1 il campo `procurement_stage` era ambiguo: un modello poteva usarlo per indicare la fase del pacchetto di gara oppure la natura/fase applicativa del documento. Nel test Copenhagen, questo ha portato Gemini a classificare D7-D10 come `itt` anche se sono documenti contrattuali o specifiche contrattuali.

La correzione v0.2 separa:

- `package_phase`: fase del pacchetto in cui il documento è fornito;
- `document_nature`: natura funzionale/contrattuale del documento;
- `document_role`: ruolo specifico del file;
- `currentness`: stato corrente esplicito, quando deducibile da metadati L0.

## Versioni

| Campo | Valore |
| --- | --- |
| `prompt_pack_id` | `tram_free_ai_prompt_pack_v0_2` |
| `schema_pack_id` | `tram_free_ai_schema_pack_v0_2` |
| `schema_version` | `schema_v0_2` |
| `benchmark_dataset_id` | `cph_m1m4_free_ai_l0_l1_v0_1` |
| `task_id` | `T1` |
| `privacy_default` | `L0` |

## Regole T1 v0.2

```text
Task T1 - Classificazione documentale v0.2.

Classifica ogni sample separando sempre:
- package_phase: fase del pacchetto gara in cui il documento è fornito;
- document_nature: natura funzionale o contrattuale del documento;
- document_role: ruolo specifico del file;
- currentness: se il file è candidato corrente, non corrente o non deducibile.

Regole importanti:
- Se il pacchetto è un ITT, un documento contrattuale incluso nel pacchetto avrà package_phase="itt_package" e document_nature contrattuale.
- Non usare la cartella come unica fonte: usa filename, folder_hint, package_phase_hint e filename_title_hint insieme.
- Non fondere versioni pulite e track changes.
- Se il filename contiene "with track changes", `document_role` deve essere "track_changes_version", anche quando `document_nature` resta "tender_instructions".
- Non considerare due file equivalenti solo perché hanno titolo simile.
- Regole currentness L0:
  - se due sample appartengono alla stessa famiglia documentale e uno è versione pulita mentre l’altro è "with track changes", la versione pulita è "current_candidate" e la track changes è "not_current_candidate";
  - se due sample appartengono alla stessa famiglia documentale ma hanno versioni diverse, la versione più alta è "current_candidate" e quella più bassa è "not_current_candidate";
  - se non esiste un confronto L0 sufficiente dentro i sample, usa "unknown".
- Se currentness non è deducibile dai soli metadati L0, usa "unknown".
- Se un file payment è incluso, classificalo soltanto: non sintetizzare il payment mechanism.
- Non inventare issue date o informazioni non presenti.
- Restituisci JSON conforme allo schema T1 v0.2.

Input payload:
{{INPUT_ENVELOPE_JSON}}
```

## Schema T1 v0.2

```json
{
  "type": "object",
  "required": ["task_id", "schema_version", "dataset_id", "items", "warnings"],
  "additionalProperties": false,
  "properties": {
    "task_id": { "type": "string", "enum": ["T1"] },
    "schema_version": { "type": "string", "enum": ["schema_v0_2"] },
    "dataset_id": { "type": "string" },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "sample_id",
          "package_phase",
          "document_nature",
          "document_role",
          "version",
          "issue_date",
          "currentness",
          "privacy_level",
          "source_refs",
          "confidence",
          "uncertainties"
        ],
        "additionalProperties": false,
        "properties": {
          "sample_id": { "type": "string" },
          "package_phase": {
            "type": "string",
            "enum": [
              "prequalification_package",
              "itt_package",
              "itn_package",
              "negotiation_package",
              "revised_tender_package",
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
              "unknown"
            ]
          },
          "version": { "type": ["string", "null"] },
          "issue_date": { "type": ["string", "null"] },
          "currentness": {
            "type": "string",
            "enum": ["current_candidate", "not_current_candidate", "unknown"]
          },
          "privacy_level": { "type": "string", "enum": ["L0", "L1", "L2"] },
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
          "uncertainties": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "warnings": { "type": "array", "items": { "type": "string" } }
  }
}
```

## Valutazione v0.2

La valutazione baseline-aware v0.2 deve misurare separatamente:

- `package_phase`;
- `document_nature`;
- `document_role`;
- `version`;
- `currentness`, solo dove deducibile da metadati L0;
- boundary privacy/payment.

Un provider può passare il formato JSON e fallire la qualità semantica. In quel caso resta candidato, ma non viene promosso.

## Prossimo passo consigliato

Usare il pack v0.3 per preparare l’envelope T1 L0 con gate, privacy, classi documentali e minimizzazione. Il v0.2 resta baseline semantica storica per confrontare Gemini e Mistral.
