# Copenhagen M1-M4 O&M - Mistral provider schema evaluation T1 L0 v0.2

Data: 2026-05-13
Stato: una run pass, una run fail semantico
Provider: Mistral
Modalità: provider schema

## Scopo

Questa nota registra il primo benchmark Mistral sul task T1 L0 v0.2, usando lo stesso envelope e la stessa baseline già usati per Gemini.

Il test serve a distinguere:

- compatibilità tecnica con structured output;
- qualità semantica del singolo modello;
- idoneità privacy/costo per TRAM V1.

## Fonti provider verificate

Fonti consultate il 2026-05-13:

- Mistral API keys: https://docs.mistral.ai/admin/security-access/api-keys
- Mistral rate limits and usage tiers: https://docs.mistral.ai/admin/user-management-finops/tier
- Mistral API chat completions: https://docs.mistral.ai/api/
- Mistral models overview: https://docs.mistral.ai/models/overview
- Mistral Experiment plan help center: https://help.mistral.ai/en/articles/455206-how-can-i-try-the-api-for-free-with-the-experiment-plan

Sintesi operativa: Mistral dichiara un piano API Experiment/free per evaluation e prototyping, con rate limit ridotti. La privacy del piano Experiment resta un gate: per TRAM è ammesso solo L0 finché non è chiarito opt-out/training o finché non si usa un piano con policy dati accettabile.

## File principali

Prompt/schema:

`/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-2.md`

Envelope:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-inputs/tram-cph-m1m4-t1-l0-input-envelope-v0-2.json`

Baseline:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-baselines/tram-cph-m1m4-t1-l0-baseline-v0-2.json`

Run `mistral-small-2603`:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-mistral-small-2603-provider-schema-v0-2.json`

Evaluation `mistral-small-2603`:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-mistral-small-2603-provider-schema-v0-2.json`

Run `mistral-medium-3.5`:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-mistral-medium-3-5-provider-schema-v0-2.json`

Evaluation `mistral-medium-3.5`:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-mistral-medium-3-5-provider-schema-v0-2.json`

## Esiti

| Modello | Formato | Baseline-aware | Note |
| --- | --- | --- | --- |
| `mistral-small-2603` | Pass | Fail | Schema valido, ma errori su currentness D3/D4 e natura D10 |
| `mistral-medium-3.5` | Pass | Pass | Candidato operativo T1 L0 |

## Metriche

### `mistral-small-2603`

| Dimensione | Esito |
| --- | --- |
| Formato JSON | Pass |
| Item restituiti | 10/10 |
| `package_phase` | 10/10 |
| `document_nature` | 9/10 |
| `document_role` | 10/10 |
| Versione | 10/10 |
| Currentness valutabile | 2/4 |
| Boundary D10 payment | Pass |
| Baseline-aware | Fail |
| Latenza | 10.008 ms |
| Input tokens | 4.787 |
| Output tokens | 1.988 |

Errori principali:

- D3/D4: ha evitato di scegliere la versione corrente perché i file erano MPP/PDF, anche se la baseline L0 richiede confronto per famiglia documentale e versione;
- D10: ha classificato l’allegato pagamento come `contract_specification` invece di `payment_terms`.

### `mistral-medium-3.5`

| Dimensione | Esito |
| --- | --- |
| Formato JSON | Pass |
| Item restituiti | 10/10 |
| `package_phase` | 10/10 |
| `document_nature` | 10/10 |
| `document_role` | 10/10 |
| Versione | 10/10 |
| Currentness valutabile | 4/4 |
| Boundary D10 payment | Pass |
| Baseline-aware | Pass |
| Latenza | 13.888 ms |
| Input tokens | 4.787 |
| Output tokens | 2.553 |

## Decisione

Mistral resta nella shortlist TRAM V1, ma non come “provider unico”: va valutato per modello e per livello privacy.

Decisioni operative:

- `mistral-medium-3.5` è candidato forte per T1 L0;
- `mistral-small-2603` non va promosso per classificazione documentale senza ulteriore prompt tuning o fallback rule-based;
- Mistral Experiment resta L0-only finché non è chiarita la policy training/opt-out per input e output;
- nessun test L1/L2 va eseguito su Mistral senza nuova decisione privacy.

## Confronto con Gemini

Su T1 L0 v0.2:

- Gemini `gemini-2.5-flash-lite` ha passato la baseline con latenza inferiore;
- Mistral `mistral-medium-3.5` ha passato la baseline ma con latenza superiore;
- Mistral `mistral-small-2603` ha confermato che il solo schema provider non basta: serve misurare qualità semantica modello per modello.

## Prossimo passo consigliato

Proseguire il batch T1 L0 v0.2 su Cloudflare Workers AI e OpenRouter quando sono disponibili le credenziali gratuite. Per Mistral, prima di L1/L2 va chiuso il gate privacy.
