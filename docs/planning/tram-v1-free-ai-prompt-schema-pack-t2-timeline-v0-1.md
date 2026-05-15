# TRAM V1 - Prompt/schema pack T2 timeline v0.1

Data: 2026-05-13
Stato: proposta operativa validata con benchmark compatto
Ambito: T2 timeline procurement, contratto, mobilitazione e milestone operative

## Scopo

Il pack T2 v0.1 definisce come TRAM deve estrarre, normalizzare e validare timeline di gara e di contratto.

La decisione principale è netta: le date non sono responsabilità primaria dell’AI.

Per T2, la pipeline deve essere:

1. parser e regole estraggono date, orari, durate, timezone, range, quarter e riferimenti fonte;
2. regole deterministiche identificano conflitti, precisione, stato corrente e necessità di review;
3. l’AI normalizza il nome evento, aiuta a classificare natura/ruolo e produce incertezze leggibili;
4. la review queue riceve date divergenti, quarter, eventi condizionati e milestone critiche.

## Decisione

Per T2 timeline v0.1, l’AI può restituire solo:

- `event_id`;
- `event_name_normalized`;
- `timeline_type`;
- `event_type`;
- `criticality`;
- `review_required`;
- `confidence`;
- `uncertainties`.

L’AI non deve restituire:

- `date_start`;
- `date_end`;
- `time_start`;
- `time_end`;
- `timezone`;
- `duration_years`;
- `anchor_event`;
- `currentness`;
- `superseded_by`;
- `source_priority`;
- qualunque valore economico o clausola completa.

Date, orari, durate, conflitti tra fonti e stato corrente sono proprietà della pipeline deterministica.

## Versioni

| Campo | Valore |
| --- | --- |
| `prompt_pack_id` | `tram_free_ai_prompt_pack_t2_timeline_v0_1` |
| `schema_pack_id` | `tram_free_ai_schema_pack_t2_timeline_v0_1` |
| `schema_version` | `schema_t2_timeline_v0_1` |
| `task_id` | `T2` |
| `benchmark_dataset_id` | `tram_t2_timeline_compact_v0_1` |
| `privacy_default` | `L1_minimized` |
| `redaction_policy_pack` | `tram-ai-min-v0-1` |

## Regole comuni T2 v0.1

```text
Regole comuni TRAM AI T2 timeline v0.1.

Lavori solo sull’envelope fornito.
Non estrarre, modificare o inventare date, orari, durate, timezone o range.
I valori temporali sono stati prodotti da parser e regole deterministiche.
Normalizza il nome evento e classifica solo tipo timeline, tipo evento, criticità, review e incertezze.
Se rule_hints segnala contradiction_candidate o review_required=true, non attenuare il rischio.
Se una data è quarter-only, relativa o condizionata, mantieni un’incertezza leggibile.
Se le fonti divergono, l’evento resta contradiction_candidate e review_required=true.
Non sintetizzare payment mechanism, penali, prezzi, dati personali o clausole riservate.
Ogni evento deve corrispondere a un event_id ricevuto.
Restituisci solo JSON valido conforme allo schema.

Input payload:
{{PROMPT_ENVELOPE_JSON}}
```

## Input envelope

L’envelope T2 v0.1 contiene eventi già individuati dalla pipeline locale.

Campi principali:

- `task_id`;
- `schema_version`;
- `dataset_id`;
- `privacy_context`;
- `task_rules`;
- `allowed_values`;
- `input_events`.

Ogni `input_event` contiene:

- `event_id`;
- `package_id`;
- `package_phase`;
- `event_name_raw`;
- `deterministic_values`;
- `rule_hints`;
- `source_refs`.

`deterministic_values` può includere:

- `date_start`;
- `date_end`;
- `time_start`;
- `time_end`;
- `timezone`;
- `date_precision`;
- `duration_years`;
- `anchor_event`.

Questi campi sono forniti all’AI come contesto, ma non devono essere restituiti.

## Output schema

```json
{
  "task_id": "T2",
  "schema_version": "schema_t2_timeline_v0_1",
  "dataset_id": "tram_t2_timeline_compact_v0_1",
  "response_status": "completed",
  "events": [
    {
      "event_id": "CPH-T2-001",
      "event_name_normalized": "Submission of first tender",
      "timeline_type": "procurement",
      "event_type": "deadline",
      "criticality": "high",
      "review_required": false,
      "confidence": 0.9,
      "uncertainties": []
    }
  ]
}
```

## Enum `timeline_type`

```json
[
  "procurement",
  "contract",
  "mobilisation",
  "service_timetable",
  "clarification_update",
  "relative_dialogue_sequence",
  "unknown"
]
```

## Enum `event_type`

```json
[
  "milestone",
  "period",
  "deadline",
  "meeting",
  "standstill",
  "document_issue",
  "service_commencement",
  "financial_close",
  "contradiction_candidate",
  "relative_sequence",
  "missing_evidence",
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

Il normalizzatore T2 deve:

- eliminare eventuali campi vietati restituiti dall’AI;
- sostituire `timeline_type`, `event_type`, `criticality` e `review_required` con i valori deterministici quando `rule_hints` li fornisce;
- preservare `event_name_normalized` se utile;
- preservare `uncertainties` se aggiungono informazione;
- bloccare il consolidamento se mancano event_id attesi;
- mandare in review ogni conflitto, quarter range o milestone critica con precisione insufficiente.

Questa scelta evita di trasformare l’AI in fonte di verità temporale.

## Precisione date

`date_precision` è calcolato dalle regole, non dall’AI.

Valori ammessi iniziali:

- `minute`;
- `day`;
- `week`;
- `month`;
- `quarter`;
- `year`;
- `relative`;
- `conflict`;
- `unknown`.

Esempi:

- `2026-06-25 12:00` diventa `minute`;
- `Q1 2026` diventa `quarter`;
- `sette anni dalla data di avvio del servizio` diventa `relative`;
- due fonti con date diverse diventano `conflict`.

## Contraddizioni candidate

Un evento diventa `contradiction_candidate` quando:

- due fonti autorevoli riportano date diverse per lo stesso evento;
- una fonte contiene una regola relativa incompatibile con una data assoluta;
- una versione aggiornata sembra cambiare una milestone senza chiara gerarchia fonte;
- il parser MPP e il rendering PDF danno date divergenti.

La pipeline non deve scegliere automaticamente la data “giusta”. Deve mostrare le alternative, fonte per fonte, e creare un item di review.

## Benchmark v0.1

Il benchmark compatto T2 usa 19 eventi su quattro pacchetti:

- Copenhagen M1-M4 O&M;
- Dublin Luas O&M;
- Milano lotti extraurbani O&M;
- Dublin MetroLink PPP.

Include:

- deadline di gara;
- apertura tender revisionati;
- standstill;
- mobilitazione;
- durata contrattuale;
- avvio servizio;
- early start window;
- prequalifica/PQQ;
- financial close;
- tre contraddizioni candidate.

Artefatti:

- `/Users/Matteo/Documents/TRAM/data/working/t2-timeline-compact-v0-1/benchmark-inputs/tram-t2-timeline-compact-input-envelope-v0-1-r1.json`;
- `/Users/Matteo/Documents/TRAM/data/working/t2-timeline-compact-v0-1/benchmark-baselines/tram-t2-timeline-compact-baseline-v0-1-r1.json`;
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t2-timeline-compact-benchmark-evaluation.md`.

## Decisione provider

Per T2 v0.1:

- Gemini resta candidato primario perché stabile e già integrato nel routing;
- Mistral è promosso come candidato forte per T2, perché nel benchmark compatto passa raw e pipeline;
- Cloudflare, Groq e OpenRouter restano esclusi dal T2 L1 minimizzato finché la matrice provider non li abilita esplicitamente;
- Cerebras non viene usato per T2 perché non promosso nei benchmark precedenti.

La route raccomandata per MVP è: parser locale + regole + Gemini o Mistral su envelope minimizzato + normalizzatore deterministico + review queue.

## Prossimo passo consigliato

T3 deliverable v0.1 e i pack T4-T8 v0.1 sono stati costruiti usando questo modello hybrid, adattandolo al diverso livello di rischio dei task.

Il benchmark compatto selettivo T4-T8 ha promosso T4 e T6 con Mistral medium, T8 solo su subset L1/L0 con Mistral small e normalizzazione, mentre T7 non è stato promosso. La specifica dei normalizzatori deterministici T4-T8 è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`.

Il config JSON v0.1 e la specifica fixture test T4-T8 sono documentati in `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json` e `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md`.

La sede runtime dei normalizzatori è definita nell’ADR `/Users/Matteo/Documents/TRAM/docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md`.

Le viste dashboard MVP collegate ai task T1-T8 sono definite in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-dashboard-views-t1-t8-v0-1.md`.

Il registro `indicator_key` P0/P1 e la specifica operativa T2/T3 sono definiti. Il passo successivo sulla pipeline AI/prodotto è costruire fixture applicative T2 collegate a dashboard e review queue, mantenendo T5 su parser locale e review.
