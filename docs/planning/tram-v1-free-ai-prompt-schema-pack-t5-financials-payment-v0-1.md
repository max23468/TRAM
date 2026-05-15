# TRAM V1 - Prompt/schema pack T5 financials, pricing e payment v0.1

Data: 2026-05-13  
Ultimo aggiornamento: 2026-05-14  
Stato: proposta operativa aggiornata
Ambito: T5 financials, pricing workbook, PEF, payment mechanism, garanzie, penali, indexation e currency

## Scopo

Il pack T5 v0.1 definisce come TRAM deve trattare i contenuti economici e finanziari nella V1.

Decisione aggiornata il 2026-05-14: T5 non è `L2_sensitive` per categoria. Financials, pricing e payment sono elementi del Tender come gli altri e l’AI deve poterli analizzare quando data policy, clausole pacchetto, provider, quota e minimizzazione lo consentono.

Per T5, la pipeline deve essere:

1. parser locali leggono Excel, PDF, tabelle, formule, sheet, celle, sezioni e source refs;
2. regole classificano financial item, pricing structure, payment components, garanzie, penali, indexation e currency;
3. AI normalizza/classifica/sintetizza l’item T5 su chunk ammessi e minimizzati;
4. review queue riceve gli item T5 che richiedono conferma, correzione o contestazione.

## Decisione

Per T5 v0.1, l’AI esterna è ammessa sugli input L0/L1 approvati dal Tender. Può restituire:

- `financial_item_id`;
- `financial_class`;
- `payment_component_type`;
- `sensitivity_level`;
- `parser_action`;
- `review_required`;
- `confidence`;
- `uncertainties`.

L’AI esterna non deve ricevere o restituire quando non minimizzato o non autorizzato:

- workbook completi;
- sheet completi;
- celle con valori economici non minimizzati;
- formule complete se sensibili;
- valori monetari;
- payment mechanism completo se il chunk non è stato isolato/minimizzato;
- penali, cap, collar o deductions dettagliati;
- assunzioni economiche interne;
- valutazioni di sostenibilità dell’offerta.

## Versioni

| Campo | Valore |
| --- | --- |
| `prompt_pack_id` | `tram_free_ai_prompt_pack_t5_financials_payment_v0_1` |
| `schema_pack_id` | `tram_free_ai_schema_pack_t5_financials_payment_v0_1` |
| `schema_version` | `schema_t5_financials_payment_v0_1` |
| `task_id` | `T5` |
| `benchmark_dataset_id` | `tram_t5_financials_payment_compact_v0_1` |
| `privacy_default` | derivato da contenuto, policy spazio e classe documento |
| `redaction_policy_pack` | `tram-ai-min-v0-1` |

## Regole comuni T5 v0.1

```text
Regole comuni TRAM T5 financials, pricing e payment v0.1.

T5 non è sensibile per default.
Usa provider AI esterni solo se policy spazio, clausole pacchetto, provider e quota lo consentono.
Non inviare workbook completi o sheet completi. Invia solo chunk, tabelle o estratti minimizzati con source refs.
Classifica il tipo di financial item, sintetizza il contenuto ammesso e indica l’azione parser/review.
Non stimare importi, costi, margini, sostenibilità economica o assunzioni mancanti.
Non trasformare una classificazione economica in raccomandazione di offerta.
Ogni financial item deve corrispondere a un financial_item_id ricevuto.
Restituisci solo JSON valido conforme allo schema.

Input payload:
{{PROMPT_ENVELOPE_JSON}}
```

## Input envelope

L’envelope T5 v0.1 per eventuale micro-classificazione esterna contiene solo metadati e segnali minimizzati.

Campi principali:

- `task_id`;
- `schema_version`;
- `dataset_id`;
- `privacy_context`;
- `task_rules`;
- `allowed_values`;
- `input_financial_items`.

Ogni `input_financial_item` contiene:

- `financial_item_id`;
- `package_id`;
- `package_phase`;
- `source_document_role`;
- `source_sheet_or_section_label`;
- `value_presence_flag`;
- `formula_presence_flag`;
- `rule_hints`;
- `source_refs`.

`value_presence_flag` e `formula_presence_flag` indicano presenza o assenza, non contenuto.

## Output schema

```json
{
  "task_id": "T5",
  "schema_version": "schema_t5_financials_payment_v0_1",
  "dataset_id": "tram_t5_financials_payment_compact_v0_1",
  "response_status": "completed",
  "financial_items": [
    {
      "financial_item_id": "MIL-T5-001",
      "financial_class": "financial_model",
      "payment_component_type": "not_applicable",
      "sensitivity_level": "L2_sensitive",
      "parser_action": "parse_locally_and_review",
      "review_required": true,
      "confidence": 0.91,
      "uncertainties": []
    }
  ]
}
```

## Enum `financial_class`

```json
[
  "pricing_workbook",
  "financial_model",
  "economic_offer",
  "combined_financial_offer",
  "payment_mechanism",
  "guarantee",
  "penalty_liquidated_damage",
  "indexation_escalation",
  "energy_cost_allocation",
  "insurance",
  "tax_currency",
  "financial_standing",
  "unknown"
]
```

## Enum `payment_component_type`

```json
[
  "availability_payment",
  "fixed_fee",
  "variable_fee",
  "unit_price",
  "bonus",
  "deduction",
  "penalty",
  "cap_collar",
  "indexation",
  "reimbursable",
  "not_applicable",
  "unknown"
]
```

## Enum `sensitivity_level`

```json
[
  "L1_controlled",
  "L2_sensitive",
  "blocked_external_ai",
  "unknown"
]
```

## Enum `parser_action`

```json
[
  "parse_locally",
  "parse_locally_and_review",
  "extract_formula_locally",
  "classify_only",
  "block_external_ai",
  "needs_human_review",
  "unknown"
]
```

## Normalizzatore deterministico post-AI

Il normalizzatore T5 deve:

- derivare `sensitivity_level` dal payload, dalla policy spazio e dalle classi documento;
- forzare `review_required=true` quando l’output contiene valori, formule, payment logic, penali, incertezze o impatto su dashboard;
- eliminare eventuali valori economici, formule, celle o testo sensibile restituiti dall’AI;
- bloccare output con importi inventati, assunzioni economiche o raccomandazioni di offerta;
- mantenere solo classificazione, parser action e incertezze;
- registrare blocchi o sospensioni come decisione `AiGateDecision` quando provider esterno non è ammesso.

## Regole di review iniziali

`review_required=true` è sempre default per:

- pricing workbook;
- schedule of prices;
- PEF e modelli economici;
- payment mechanism;
- bonus/malus, deductions, penali;
- indexation, escalation, cap/collar;
- garanzie, insurance, performance bond, parent company guarantee;
- tax, VAT, currency e financial standing.

## Benchmark v0.1 da preparare

Il benchmark T5 deve misurare quanto l’AI aiuta ad analizzare Financials del Tender su input ammessi, senza inventare importi o trasformare la lettura in raccomandazione di offerta.

Dataset consigliato:

- 5 item Excel/PEF/pricing rappresentati con valori sintetici o minimizzati nel payload AI;
- 5 componenti payment/penalty/indexation rappresentati per classe e fonte;
- 3 garanzie/securities;
- 3 casi da bloccare perché L2 effettivo o policy incompatibile;
- valutazione su routing, privacy, parser action e review, non su calcolo economico.

## Decisione provider

Stato benchmark: il dataset compatto T5 è stato preparato in `/Users/Matteo/Documents/TRAM/data/working/t5-financials-payment-compact-v0-1/` ed è riepilogato in `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t4-t8-compact-benchmark-preparation.md`.

Per T5 v0.1:

- provider AI esterni ammessi su L0/L1 approvati, minimizzati e con policy provider accettabile;
- Gemini/Mistral possono essere testati su Financials ammessi e chunk minimizzati;
- Cloudflare/Groq/OpenRouter non sono default;
- VPS/self-hosted futura resta utile per L2 effettivo o pacchetti che vietano provider esterni, ma richiede runbook e approvazione.

La route raccomandata per MVP è: parser locale + regole + AI su chunk T5 ammessi + normalizzatore + review queue + dashboard evidence-first.

## Prossimo passo consigliato

Prima del benchmark T5 pieno, creare extractor locali per workbook e sezioni payment e rerun di qualità AI su fixture Financials sintetiche, includendo casi ammessi e casi L2 effettivi da bloccare.
