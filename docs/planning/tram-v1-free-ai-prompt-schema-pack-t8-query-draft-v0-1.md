# TRAM V1 - Prompt/schema pack T8 chiarimenti/Q&A v0.1

Data: 2026-05-13
Stato: proposta operativa impostata
Ambito: T8 chiarimenti/Q&A, bozze verso la stazione appaltante, testo citato e review umana

## Scopo

Il pack T8 v0.1 definisce come TRAM deve generare bozze dentro thread di chiarimento/Q&A tra bidder e stazione appaltante.

La decisione principale è: T8 è human-first. Nessuna domanda o chiarimento viene inviato automaticamente.

Nota compatibilità: i nomi tecnici `query_draft_*` restano in questo pack v0.1 perché erano già usati nei benchmark. Nel data contract MVP aggiornato l’entità concettuale è `ClarificationThread`: la bozza è solo uno stato del thread.

Per T8, la pipeline deve essere:

1. T7 o review umana propone una issue plausibile;
2. template/regole costruiscono struttura, campi e riferimenti fonte;
3. l’AI può aiutare nella bozza linguistica solo se autorizzata e se il contenuto non è L2 bloccato;
4. il normalizzatore rimuove contenuti interni, strategia d’offerta e affermazioni non supportate;
5. l’utente modifica, approva, esporta o scarta il chiarimento.

## Decisione

Per T8 v0.1, l’AI può restituire solo:

- `query_draft_id`;
- `linked_contradiction_id`;
- `query_subject`;
- `query_body`;
- `facts_cited`;
- `requested_clarification`;
- `tone`;
- `human_approval_required`;
- `status`;
- `confidence`;
- `uncertainties`.

L’AI non deve:

- inviare chiarimenti;
- approvare chiarimenti;
- includere strategia interna;
- includere commenti non destinati alla stazione appaltante;
- inventare fatti o fonti;
- usare tono accusatorio;
- trasformare una contraddizione non validata in accusa;
- includere contenuti L2 senza workflow locale o approvazione esplicita.

## Versioni

| Campo | Valore |
| --- | --- |
| `prompt_pack_id` | `tram_free_ai_prompt_pack_t8_query_draft_v0_1` |
| `schema_pack_id` | `tram_free_ai_schema_pack_t8_query_draft_v0_1` |
| `schema_version` | `schema_t8_query_draft_v0_1` |
| `task_id` | `T8` |
| `benchmark_dataset_id` | `tram_t8_query_draft_compact_v0_1` |
| `privacy_default` | `L2_if_strategic_or_sensitive` |
| `redaction_policy_pack` | `tram-ai-min-v0-1` |

## Regole comuni T8 v0.1

```text
Regole comuni TRAM AI T8 chiarimenti/Q&A v0.1.

Lavori solo sull’envelope fornito.
Scrivi una bozza professionale, prudente e citata.
Non inviare, approvare o marcare come pronto il chiarimento.
Non includere strategia interna d’offerta, giudizi riservati o commenti non destinati alla stazione appaltante.
Non inventare fatti, fonti, clausole o conseguenze.
Se l’evidenza è debole, proponi status=needs_more_review o do_not_send.
Mantieni tono neutro e collaborativo.
Ogni output deve corrispondere a un query_draft_id ricevuto.
Restituisci solo JSON valido conforme allo schema.

Input payload:
{{PROMPT_ENVELOPE_JSON}}
```

## Input envelope

L’envelope T8 v0.1 contiene issue già selezionate da review o da T7.

Campi principali:

- `task_id`;
- `schema_version`;
- `dataset_id`;
- `privacy_context`;
- `task_rules`;
- `allowed_values`;
- `input_query_candidates`.

Ogni `input_query_candidate` contiene:

- `query_draft_id`;
- `linked_contradiction_id`;
- `package_id`;
- `issue_summary`;
- `facts_to_cite`;
- `requested_clarification_hint`;
- `tone_hint`;
- `source_refs`;
- `review_status`;
- `privacy_level_effective`.

## Output schema

```json
{
  "task_id": "T8",
  "schema_version": "schema_t8_query_draft_v0_1",
  "dataset_id": "tram_t8_query_draft_compact_v0_1",
  "response_status": "completed",
  "query_drafts": [
    {
      "query_draft_id": "CPH-T8-001",
      "linked_contradiction_id": "CPH-T7-001",
      "query_subject": "Clarification on tender opening date",
      "query_body": "We kindly ask the Contracting Entity to clarify which date applies to the opening of revised tenders, as the documents cited below appear to indicate different dates for the same milestone.",
      "facts_cited": [
        "Source A indicates 2026-05-15 for the milestone.",
        "Source B indicates 2026-05-13 for the same milestone."
      ],
      "requested_clarification": "Please confirm the applicable date and indicate whether one of the schedule sources is superseded.",
      "tone": "neutral_professional",
      "human_approval_required": true,
      "status": "draft_for_review",
      "confidence": 0.84,
      "uncertainties": []
    }
  ]
}
```

## Enum `tone`

```json
[
  "neutral_professional",
  "formal",
  "concise",
  "collaborative",
  "needs_user_tone_review"
]
```

## Enum `status`

```json
[
  "draft_for_review",
  "needs_more_review",
  "do_not_send",
  "blocked_sensitive",
  "unknown"
]
```

## Normalizzatore deterministico post-AI

Il normalizzatore T8 deve:

- forzare `human_approval_required=true`;
- impedire qualsiasi stato equivalente ad approvato o inviato;
- eliminare affermazioni non presenti in `facts_to_cite`;
- bloccare contenuti interni o strategici;
- ereditare privacy level massimo dalle fonti;
- forzare `status=blocked_sensitive` se il payload è L2 e provider esterno non è autorizzato;
- preservare tono e testo solo se supportati da fonte.

## Regole di review iniziali

`human_approval_required=true` sempre.

`status=do_not_send` è raccomandato se:

- la fonte è debole;
- il caso sembra parser issue;
- il chiarimento rivelerebbe strategia interna;
- la questione è già risolta da addendum o chiarimento successivo;
- il tono non è recuperabile senza intervento umano.

`status=blocked_sensitive` è raccomandato se:

- il chiarimento riguarda payment, penali, dati personali, AI/privacy, cyber/security o rischio legale;
- il contenuto richiede workflow locale/human-first.

## Benchmark v0.1 da preparare

Dataset consigliato:

- 5 chiarimenti su contraddizioni confermate;
- 5 chiarimenti su ambiguità;
- 3 chiarimenti su documenti mancanti;
- 3 chiarimenti su conflitti timeline;
- 3 casi da non trasformare in chiarimento perché troppo deboli.

## Decisione provider

Stato benchmark: il dataset compatto T8 è stato preparato in `/Users/Matteo/Documents/TRAM/data/working/t8-query-draft-compact-v0-1/` ed è stato valutato in `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t4-t8-compact-provider-benchmark-evaluation.md`.

Per T8 v0.1:

- provider AI esterni non sono default V1;
- Mistral `mistral-small-2603` passa solo su subset L1/L0 e dopo normalizzatore human-first;
- Gemini resta candidato teorico, ma nella tornata T4-T8 non è stato valutabile per quota free tier;
- casi L2 restano human-first o self-hosted futuro;
- nessun provider può produrre output inviabile senza review.

La route raccomandata per MVP è: template + review umana + AI opzionale solo quando privacy e utilità lo giustificano.

## Prossimo passo consigliato

La specifica tecnica del normalizzatore T8 è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`. Il config e la fixture spec sono in `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json` e `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md`. La sede runtime è definita nell’ADR `/Users/Matteo/Documents/TRAM/docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md`. Le viste dashboard MVP e il registro `indicator_key` P0/P1 sono definiti rispettivamente in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-dashboard-views-t1-t8-v0-1.md` e `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-key-registry-p0-p1-v0-1.md`. Il prossimo passo è costruire fixture T8 human-first, forzando sempre `human_approval_required=true` e bloccando casi L2 o strategici.
