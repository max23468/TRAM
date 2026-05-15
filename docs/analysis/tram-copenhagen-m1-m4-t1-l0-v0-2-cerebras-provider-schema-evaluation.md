# Copenhagen M1-M4 O&M - Cerebras provider schema evaluation T1 L0 v0.2

Data: 2026-05-13
Stato: test parziale eseguito, non promosso
Provider: Cerebras

## Scopo

Questa nota registra il primo benchmark Cerebras sul task T1 L0 v0.2, usando lo stesso envelope e la stessa baseline usati per Gemini, Mistral e Groq.

## Fonti provider verificate

Fonti consultate il 2026-05-13:

- Cerebras OpenAI compatibility: https://inference-docs.cerebras.ai/resources/openai
- Cerebras structured outputs: https://inference-docs.cerebras.ai/capabilities/structured-outputs
- Cerebras rate limits: https://inference-docs.cerebras.ai/support/rate-limits
- Cerebras models overview: https://inference-docs.cerebras.ai/models/overview
- Cerebras pricing: https://inference-docs.cerebras.ai/support/pricing

Sintesi operativa: Cerebras è compatibile con API stile OpenAI e supporta structured output strict con schema JSON. In strict mode richiede root object e `additionalProperties: false` su ogni oggetto; il nostro schema T1 v0.2 è compatibile con questo vincolo. I limiti free sono buoni sulla carta, ma l’accesso effettivo ai modelli e la congestione possono bloccare run su modelli grandi.

## File principali

Envelope:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-inputs/tram-cph-m1m4-t1-l0-input-envelope-v0-2.json`

Baseline:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-baselines/tram-cph-m1m4-t1-l0-baseline-v0-2.json`

Evaluation `llama3.1-8b`:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-cerebras-llama3-1-8b-provider-schema-strict-v0-2.json`

## Iterazioni

| Run | Esito | Nota |
| --- | --- | --- |
| `gpt-oss-120b` strict | Fail tecnico | Modello listato ma non accessibile dall’account: `model_not_found` |
| `qwen-3-235b-a22b-instruct-2507` strict r1 | Fail temporaneo | `queue_exceeded` per traffico alto |
| `qwen-3-235b-a22b-instruct-2507` strict r2 | Fail temporaneo | `request_quota_exceeded` per troppe richieste/minuto |
| `llama3.1-8b` strict | Fail semantico | Schema strict pass, ma qualità insufficiente |

## Esito `llama3.1-8b`

| Dimensione | Esito |
| --- | --- |
| Formato JSON | Pass |
| Provider schema strict | Pass |
| Item restituiti | 10/10 |
| `package_phase` | 10/10 |
| `document_nature` | 8/10 |
| `document_role` | 10/10 |
| Versione | 10/10 |
| Currentness valutabile | 2/4 |
| Boundary D10 payment | Pass |
| Baseline-aware | Fail |
| Latenza | 1.771 ms |
| Input tokens | 5.228 |
| Output tokens | 2.272 |

## Decisione

Cerebras resta candidato tecnico interessante, soprattutto per velocità e schema strict, ma non va promosso come provider V1 per T1 L0 finché non passa un modello semanticamente adeguato.

Decisioni operative:

- non usare `llama3.1-8b` come default T1;
- ritentare `qwen-3-235b-a22b-instruct-2507` in una finestra meno congestionata;
- trattare `gpt-oss-120b` come non disponibile su questo account finché l’accesso non cambia;
- prima di L1/L2 chiarire privacy, DPA e trasferimenti extra-UE.

## Prossimo passo consigliato

Ritentare solo `qwen-3-235b-a22b-instruct-2507` più avanti, senza ripetere i modelli già falliti. Nel frattempo proseguire il confronto con Cloudflare Workers AI e OpenRouter.
