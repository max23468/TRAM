# TRAM V1 - Prompt/schema pack benchmark AI gratuito v0.1

Data: 2026-05-13
Stato: pack operativo per benchmark L0, pronto per essere trasformato in richieste provider
Ambito: dataset Copenhagen M1-M4 O&M L0/L1

## Scopo

Questo documento definisce `prompt_v0_1` e `schema_v0_1` per il primo benchmark AI gratuito di TRAM.

Il pack serve a testare in modo comparabile:

- classificazione documentale;
- timeline procurement e contratto;
- tender deliverables;
- KPI e formule;
- contraddizioni candidate;
- bozze di chiarimento/Q&A.

Non esegue chiamate AI e non introduce codice applicativo. È un artefatto di progettazione operativa.

## Versioni

| Campo | Valore |
| --- | --- |
| `prompt_pack_id` | `tram_free_ai_prompt_pack_v0_1` |
| `schema_pack_id` | `tram_free_ai_schema_pack_v0_1` |
| `benchmark_dataset_id` | `cph_m1m4_free_ai_l0_l1_v0_1` |
| `default_output_language` | `it` |
| `clarification_draft_language` | `en` |
| `privacy_default` | `L0` |
| `tasks` | `T1`, `T2`, `T3`, `T4`, `T7`, `T8` |

## Provider target v0.1

| Provider | Uso v0.1 | Nota |
| --- | --- | --- |
| Gemini | L0 smoke, poi L1 se privacy/cap ok | Candidato qualità e task complessi |
| Mistral | L0 smoke, poi L1 se opt-out training/privacy ok | Candidato europeo forte |
| Groq | L0 smoke, poi L1 se ZDR/Data Controls ok | Candidato velocità |
| Cerebras | L0 smoke, poi L1 se privacy/DPA ok | Candidato tecnico structured output strict |
| OpenRouter | Solo L0 | Aggregatore: registrare provider/modello effettivo e policy |
| Cloudflare Workers AI | Non obbligatorio nello smoke v0.1 | Fallback da aggiungere dopo il primo giro |

## Regole comuni

Queste regole vanno nel system prompt o nel developer prompt, a seconda del provider.

```text
You are TRAM, an evidence-first extraction engine for public transport O&M tender documents.

Extract only from the provided input payload.
Do not use outside knowledge unless the task explicitly asks for a legal or public-reference check.
Do not invent documents, dates, weights, formulas, page limits, sources, issue types or conclusions.
If a value is missing, ambiguous or not supported by the input, return null and explain the uncertainty.
Every material claim must include source_refs.
Treat every output as a proposal requiring human review, not as final truth.
Keep L0, L1 and L2 boundaries visible.
Do not request or suggest sending full tender packages to a provider.
Do not include long verbatim excerpts from tender documents.
Return JSON only. No markdown. No prose outside JSON.
Use Italian labels and summaries unless the field explicitly requires an English clarification draft.
```

## Input envelope

Ogni chiamata deve ricevere un envelope uniforme.

```json
{
  "benchmark_dataset_id": "cph_m1m4_free_ai_l0_l1_v0_1",
  "prompt_pack_id": "tram_free_ai_prompt_pack_v0_1",
  "schema_pack_id": "tram_free_ai_schema_pack_v0_1",
  "task_id": "T1",
  "privacy_level": "L0",
  "package_slug": "copenhagen-m1-m4-om",
  "source_language": "en",
  "target_output_language": "it",
  "samples": []
}
```

Regole:

- `samples` contiene solo item del dataset benchmark, non documenti interi.
- Per lo smoke test iniziale usare solo `privacy_level = "L0"`.
- Per OpenRouter usare solo L0 anche se un sample è marcato L1 nel dataset.
- Per L1 serve conferma policy provider prima dell’esecuzione.

## Source reference

Ogni schema task usa questo concetto di fonte.

```json
{
  "source_id": "D1",
  "source_type": "dataset_item",
  "locator": "ITT lines 602-617",
  "evidence_summary": "Il documento richiede Form of Tender e Schedule of Prices come contenuti della tender submission."
}
```

Regole:

- `evidence_summary` deve essere una sintesi breve, non un dump di testo.
- `locator` deve essere abbastanza specifico da permettere review umana.
- Se la fonte non è sufficiente, il campo deve restare in `uncertainties`.

## T1 - Classificazione documentale

### Prompt utente

```text
Task T1 - Classificazione documentale.

Classifica ogni sample come documento di gara o contratto.
Devi restituire ruolo documento, fase, versione se presente, se è candidato corrente, livello privacy e incertezze.
Non fondere versioni pulite e track changes.
Non considerare due file equivalenti solo perché hanno titolo simile.
Restituisci JSON conforme allo schema T1.

Input payload:
{{INPUT_ENVELOPE_JSON}}
```

### Schema T1

```json
{
  "type": "object",
  "required": ["task_id", "schema_version", "dataset_id", "items", "warnings"],
  "additionalProperties": false,
  "properties": {
    "task_id": { "type": "string", "enum": ["T1"] },
    "schema_version": { "type": "string", "enum": ["schema_v0_1"] },
    "dataset_id": { "type": "string" },
    "items": {
      "type": "array",
      "maxItems": 20,
      "items": {
        "type": "object",
        "required": [
          "sample_id",
          "document_role",
          "procurement_stage",
          "version",
          "issue_date",
          "is_current_candidate",
          "privacy_level",
          "source_refs",
          "confidence",
          "uncertainties"
        ],
        "additionalProperties": false,
        "properties": {
          "sample_id": { "type": "string" },
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
          "procurement_stage": {
            "type": "string",
            "enum": ["prequalification", "itt", "itn", "negotiation", "revised_tender", "contract", "unknown"]
          },
          "version": { "type": ["string", "null"] },
          "issue_date": { "type": ["string", "null"] },
          "is_current_candidate": { "type": ["boolean", "null"] },
          "privacy_level": { "type": "string", "enum": ["L0", "L1", "L2"] },
          "source_refs": {
            "type": "array",
            "minItems": 1,
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
          "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
          "uncertainties": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "warnings": { "type": "array", "items": { "type": "string" } }
  }
}
```

## T2 - Timeline

### Prompt utente

```text
Task T2 - Timeline procurement e contratto.

Estrai eventi timeline dai sample forniti.
Distingui timeline procurement e timeline contratto.
Se un evento è una finestra, imposta is_window=true e valorizza date_start/date_end.
Se un evento è condizionato, spiega la condizione.
Non inventare timezone o date mancanti.
Restituisci JSON conforme allo schema T2.

Input payload:
{{INPUT_ENVELOPE_JSON}}
```

### Schema T2

```json
{
  "type": "object",
  "required": ["task_id", "schema_version", "dataset_id", "items", "warnings"],
  "additionalProperties": false,
  "properties": {
    "task_id": { "type": "string", "enum": ["T2"] },
    "schema_version": { "type": "string", "enum": ["schema_v0_1"] },
    "dataset_id": { "type": "string" },
    "items": {
      "type": "array",
      "maxItems": 20,
      "items": {
        "type": "object",
        "required": [
          "sample_id",
          "event_name",
          "timeline_type",
          "date_start",
          "date_end",
          "timezone",
          "is_window",
          "condition",
          "source_refs",
          "confidence",
          "uncertainties"
        ],
        "additionalProperties": false,
        "properties": {
          "sample_id": { "type": "string" },
          "event_name": { "type": "string" },
          "timeline_type": { "type": "string", "enum": ["procurement", "contract", "versioning", "unknown"] },
          "date_start": { "type": ["string", "null"] },
          "date_end": { "type": ["string", "null"] },
          "timezone": { "type": ["string", "null"] },
          "is_window": { "type": "boolean" },
          "condition": { "type": ["string", "null"] },
          "source_refs": {
            "type": "array",
            "minItems": 1,
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
          "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
          "uncertainties": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "warnings": { "type": "array", "items": { "type": "string" } }
  }
}
```

## T3 - Tender deliverables

### Prompt utente

```text
Task T3 - Tender deliverables.

Estrai deliverable richiesti, codice, peso, limite pagina, contenuto richiesto e condizioni.
Non confondere il peso del criterio prezzo/qualità con il peso dei singoli deliverable.
Se il limite pagina o il peso non è presente, usa null.
Restituisci JSON conforme allo schema T3.

Input payload:
{{INPUT_ENVELOPE_JSON}}
```

### Schema T3

```json
{
  "type": "object",
  "required": ["task_id", "schema_version", "dataset_id", "items", "warnings"],
  "additionalProperties": false,
  "properties": {
    "task_id": { "type": "string", "enum": ["T3"] },
    "schema_version": { "type": "string", "enum": ["schema_v0_1"] },
    "dataset_id": { "type": "string" },
    "items": {
      "type": "array",
      "maxItems": 20,
      "items": {
        "type": "object",
        "required": [
          "sample_id",
          "deliverable_code",
          "deliverable_name",
          "weight",
          "page_limit",
          "required_content",
          "submission_condition",
          "source_refs",
          "confidence",
          "uncertainties"
        ],
        "additionalProperties": false,
        "properties": {
          "sample_id": { "type": "string" },
          "deliverable_code": { "type": ["string", "null"] },
          "deliverable_name": { "type": "string" },
          "weight": { "type": ["string", "null"] },
          "page_limit": { "type": ["string", "null"] },
          "required_content": { "type": "array", "items": { "type": "string" } },
          "submission_condition": { "type": ["string", "null"] },
          "source_refs": {
            "type": "array",
            "minItems": 1,
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
          "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
          "uncertainties": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "warnings": { "type": "array", "items": { "type": "string" } }
  }
}
```

## T4 - KPI e formule

### Prompt utente

```text
Task T4 - KPI e formule.

Estrai KPI, famiglia, formula o metodo, variabili, soglie, frequenza, scope e link bonus/malus.
Preserva formule, percentuali, finestre temporali e segmentazione per linee/sistemi.
Non semplificare formule se questo cambia il significato.
Se il collegamento economico non è certo, dichiaralo come da verificare.
Restituisci JSON conforme allo schema T4.

Input payload:
{{INPUT_ENVELOPE_JSON}}
```

### Schema T4

```json
{
  "type": "object",
  "required": ["task_id", "schema_version", "dataset_id", "items", "warnings"],
  "additionalProperties": false,
  "properties": {
    "task_id": { "type": "string", "enum": ["T4"] },
    "schema_version": { "type": "string", "enum": ["schema_v0_1"] },
    "dataset_id": { "type": "string" },
    "items": {
      "type": "array",
      "maxItems": 20,
      "items": {
        "type": "object",
        "required": [
          "sample_id",
          "kpi_name",
          "kpi_family",
          "formula_or_method",
          "variables",
          "target_or_threshold",
          "frequency",
          "scope",
          "bonus_malus_link",
          "source_refs",
          "confidence",
          "uncertainties"
        ],
        "additionalProperties": false,
        "properties": {
          "sample_id": { "type": "string" },
          "kpi_name": { "type": "string" },
          "kpi_family": { "type": "string", "enum": ["operation", "maintenance", "customer_experience", "governance", "financial", "unknown"] },
          "formula_or_method": { "type": ["string", "null"] },
          "variables": { "type": "array", "items": { "type": "string" } },
          "target_or_threshold": { "type": ["string", "null"] },
          "frequency": { "type": ["string", "null"] },
          "scope": { "type": ["string", "null"] },
          "bonus_malus_link": { "type": "string", "enum": ["certain", "probable", "to_verify", "none"] },
          "source_refs": {
            "type": "array",
            "minItems": 1,
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
          "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
          "uncertainties": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "warnings": { "type": "array", "items": { "type": "string" } }
  }
}
```

## T7 - Contraddizioni candidate

### Prompt utente

```text
Task T7 - Contraddizioni candidate e open issues.

Valuta ogni issue candidata come possibile alert, non come verità definitiva.
Spiega perché potrebbe essere un problema e quale azione raccomandare.
Non trasformare differenze terminologiche in contraddizioni certe.
Non generare un chiarimento se l’azione corretta è prima un controllo interno.
Restituisci JSON conforme allo schema T7.

Input payload:
{{INPUT_ENVELOPE_JSON}}
```

### Schema T7

```json
{
  "type": "object",
  "required": ["task_id", "schema_version", "dataset_id", "items", "warnings"],
  "additionalProperties": false,
  "properties": {
    "task_id": { "type": "string", "enum": ["T7"] },
    "schema_version": { "type": "string", "enum": ["schema_v0_1"] },
    "dataset_id": { "type": "string" },
    "items": {
      "type": "array",
      "maxItems": 20,
      "items": {
        "type": "object",
        "required": [
          "sample_id",
          "issue_title",
          "issue_type",
          "conflicting_values",
          "why_it_may_be_an_issue",
          "severity_candidate",
          "recommended_action",
          "source_refs",
          "confidence",
          "uncertainties"
        ],
        "additionalProperties": false,
        "properties": {
          "sample_id": { "type": "string" },
          "issue_title": { "type": "string" },
          "issue_type": {
            "type": "string",
            "enum": ["numeric_mismatch", "legal_reference", "document_completeness", "versioning", "privacy_ai_governance", "data_quality", "unknown"]
          },
          "conflicting_values": { "type": "array", "items": { "type": "string" } },
          "why_it_may_be_an_issue": { "type": "string" },
          "severity_candidate": { "type": "string", "enum": ["low", "medium", "high"] },
          "recommended_action": { "type": "string", "enum": ["internal_review", "document_diff", "legal_check", "clarification_draft", "block_external_ai", "no_action_yet"] },
          "source_refs": {
            "type": "array",
            "minItems": 1,
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
          "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
          "uncertainties": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "warnings": { "type": "array", "items": { "type": "string" } }
  }
}
```

## T8 - Chiarimenti/Q&A

### Prompt utente

```text
Task T8 - Chiarimenti/Q&A.

Genera una bozza di chiarimento professionale, breve e neutra, basata solo sui fatti forniti.
Il chiarimento deve essere in inglese.
Non accusare la stazione appaltante.
Non aggiungere riferimenti non presenti nell’input.
Imposta human_approval_required sempre a true.
Restituisci JSON conforme allo schema T8.

Input payload:
{{INPUT_ENVELOPE_JSON}}
```

### Schema T8

```json
{
  "type": "object",
  "required": ["task_id", "schema_version", "dataset_id", "items", "warnings"],
  "additionalProperties": false,
  "properties": {
    "task_id": { "type": "string", "enum": ["T8"] },
    "schema_version": { "type": "string", "enum": ["schema_v0_1"] },
    "dataset_id": { "type": "string" },
    "items": {
      "type": "array",
      "maxItems": 10,
      "items": {
        "type": "object",
        "required": [
          "sample_id",
          "clarification_subject",
          "clarification_body",
          "facts_cited",
          "requested_clarification",
          "tone",
          "source_refs",
          "human_approval_required",
          "confidence",
          "uncertainties"
        ],
        "additionalProperties": false,
        "properties": {
          "sample_id": { "type": "string" },
          "clarification_subject": { "type": "string" },
          "clarification_body": { "type": "string" },
          "facts_cited": { "type": "array", "items": { "type": "string" } },
          "requested_clarification": { "type": "string" },
          "tone": { "type": "string", "enum": ["professional_neutral"] },
          "source_refs": {
            "type": "array",
            "minItems": 1,
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
          "human_approval_required": { "type": "boolean", "enum": [true] },
          "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
          "uncertainties": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "warnings": { "type": "array", "items": { "type": "string" } }
  }
}
```

## Adattamenti provider

| Provider | Modalità suggerita | Adattamento |
| --- | --- | --- |
| Gemini | Structured output / JSON response quando disponibile | Usare schema come target; se il sottoinsieme schema non supporta qualche vincolo, validare lato TRAM |
| Mistral | JSON mode o function calling | JSON mode garantisce JSON, non necessariamente schema; per schema strict preferire function calling se disponibile |
| Groq | Structured outputs sui modelli supportati | Usare strict schema; fallback JSON object mode solo per smoke L0 |
| Cerebras | `response_format` con `json_schema`, `strict: true` | Richiede `additionalProperties: false`; ottimo per test schema compliance |
| OpenRouter | API compatibile OpenAI, solo L0 | Preferire modello free pinned; se si usa `openrouter/free`, registrare modello effettivo e policy provider |

## Registro minimo per ogni run

Ogni run del pack deve salvare:

- `benchmark_run_id`;
- `provider`;
- `model`;
- `provider_route`, se diverso dal provider diretto;
- `task_id`;
- `prompt_pack_id`;
- `schema_pack_id`;
- `dataset_id`;
- `privacy_level`;
- `input_hash`;
- `output_hash`;
- `schema_parse_ok`;
- `items_expected`;
- `items_returned`;
- `latency_ms`;
- `token_or_unit_usage`;
- `estimated_cost`;
- `free_quota_remaining`, se disponibile;
- `zdr_or_training_policy`;
- `human_review_status`.

## Pass/fail automatico

La run fallisce automaticamente se:

- l’output non è JSON valido;
- `task_id`, `schema_version` o `dataset_id` sono mancanti;
- il numero di item non corrisponde al campione richiesto;
- manca una `source_ref` su un claim materiale;
- un valore assente viene inventato;
- OpenRouter usa un provider o modello non registrato;
- un item L1/L2 viene inviato a provider non approvato;
- `human_approval_required` non è `true` per T8.

## Primo smoke test consigliato

Ordine consigliato:

1. T1 su soli sample D1-D10 in L0.
2. T2 su 3 eventi L0/L1 ridotti a metadata, senza chunk sensibili.
3. T8 su un chiarimento seed L0, senza invio esterno.

Provider:

1. Gemini.
2. Mistral.
3. Groq.
4. Cerebras.
5. OpenRouter solo L0.

Cloudflare può essere aggiunto nel secondo giro se il primo smoke chiarisce schema e baseline di qualità.

## Debiti v0.1

- Schemi ancora volutamente semplici: non includono `DocumentVersion`, `ReviewItem` o `IndicatorValue` completi.
- Non è incluso il task T5 payment mechanism in questo pack iniziale; dopo la decisione 2026-05-14 T5 va trattato in un pack dedicato con AI ammessa su L0/L1 minimizzati e L2 solo effettivo.
- Non è incluso il task T6 cost driver completo.
- Non è stato creato codice di validazione JSON.
- Le prime chiamate Gemini hanno mostrato che lo schema T1 completo può essere troppo vincolante per alcuni provider/modelli quando imposto come provider schema; va prevista una variante JSON mode con validazione lato TRAM.
- I controlli automatici T1 devono restare baseline-aware su `document_role` e `procurement_stage`; il pass tecnico non basta a dichiarare qualità semantica.
- T1 v0.1 confonde facilmente `procurement_stage` con la fase del pacchetto. Debito v0.2: separare `package_phase` e `document_nature`, oppure chiarire il significato di `procurement_stage`.
- La patch T1 v0.2 è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-2.md`.
- Prima di L1 servono policy provider e conferma umana.

## Prossimo passo consigliato

Preparare l’envelope L0 per T1 usando i 10 documenti del dataset Copenhagen, poi eseguire uno smoke test comparato su Gemini, Mistral, Groq, Cerebras e OpenRouter.
