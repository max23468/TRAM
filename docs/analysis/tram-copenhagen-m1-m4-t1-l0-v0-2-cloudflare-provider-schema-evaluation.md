# Copenhagen M1-M4 O&M - Cloudflare Workers AI evaluation T1 L0 v0.2

Data: 2026-05-13
Stato: run eseguite, provider non promosso per T1 L0 v0.2
Provider: Cloudflare Workers AI
Modalità: JSON Mode con schema

## Scopo

Questa nota registra il benchmark Cloudflare Workers AI sul task T1 L0 v0.2, usando lo stesso envelope e la stessa baseline usati per Gemini, Mistral, Groq, Cerebras e OpenRouter.

Il test è L0: sono stati inviati solo metadati, filename, path e hint del pacchetto Copenhagen M1-M4 O&M. Non sono stati inviati documenti completi o chunk L1/L2.

## Fonti e setup

Fonti Cloudflare verificate il 2026-05-13:

- Cloudflare Workers AI JSON Mode: https://developers.cloudflare.com/workers-ai/features/json-mode/
- Cloudflare Workers AI REST run endpoint: https://developers.cloudflare.com/api/resources/ai/methods/run/
- Cloudflare Workers AI pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
- Cloudflare Workers AI data usage: https://developers.cloudflare.com/workers-ai/platform/data-usage/

Credenziali:

- `CLOUDFLARE_API_TOKEN` salvato nel Portachiavi con service `com.tram.cloudflare.api-token`;
- `CLOUDFLARE_ACCOUNT_ID` salvato nel Portachiavi con service `com.tram.cloudflare.account-id`;
- nessuna credenziale è stata scritta nei file del progetto.

Dashboard prima delle run complete:

- Workers AI mostrava `2.35/10k` Neuroni usati nel giorno corrente;
- la pagina indica reset giornaliero alle 00:00 UTC;
- dopo le run, il dashboard continuava a mostrare `2.35/10k`, quindi la metrica va trattata come ritardata o non immediatamente affidabile per il singolo benchmark.

## File principali

Prompt/schema:

`/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-2.md`

Envelope:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-inputs/tram-cph-m1m4-t1-l0-input-envelope-v0-2.json`

Baseline:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-baselines/tram-cph-m1m4-t1-l0-baseline-v0-2.json`

## Run eseguite

| Modello | Esito tecnico | Baseline-aware | Nota |
| --- | --- | --- | --- |
| `@cf/meta/llama-3.3-70b-instruct-fp8-fast` | Fail | Fail | Timeout Cloudflare `408`, errore `AiError: Request timeout`, 120.867 ms |
| `@cf/meta/llama-3.1-8b-instruct` | Pass formato | Fail | JSON/schema validi e 10 item restituiti, ma qualità semantica insufficiente |
| `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b` | Fail | Fail | Timeout client dopo 150 secondi senza risposta completa |

Run 70B:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-cloudflare-meta-llama-3-3-70b-instruct-fp8-fast-json-mode-schema-v0-2.json`

Evaluation 70B:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-cloudflare-meta-llama-3-3-70b-instruct-fp8-fast-json-mode-schema-v0-2.json`

Run 8B:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-cloudflare-meta-llama-3-1-8b-instruct-json-mode-schema-v0-2.json`

Evaluation 8B:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-cloudflare-meta-llama-3-1-8b-instruct-json-mode-schema-v0-2.json`

Run DeepSeek 32B:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-cloudflare-deepseek-r1-distill-qwen-32b-json-mode-schema-v0-2.json`

Evaluation DeepSeek 32B:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-cloudflare-deepseek-r1-distill-qwen-32b-json-mode-schema-v0-2.json`

## Dettaglio modello 8B

Il modello `@cf/meta/llama-3.1-8b-instruct` è l’unico che ha completato il task.

| Dimensione | Esito |
| --- | --- |
| Formato JSON | Pass |
| JSON Mode schema | Pass |
| Item restituiti | 10/10 |
| `package_phase` | 10/10 |
| `document_nature` | 5/10 |
| `document_role` | 8/10 |
| Versione | 10/10 |
| Currentness valutabile | 2/4 |
| Boundary D10 payment | Fail |
| Baseline-aware | Fail |
| Latenza | 25.666 ms |
| Input tokens | 5.362 |
| Output tokens | 2.524 |
| Token totali | 7.886 |

Errori principali:

- D2: non ha distinto correttamente il ruolo `track_changes_version`;
- D3/D4: non ha dedotto currentness dalla coppia versione `v3`/`v2`;
- D5-D9: ha confuso diversi valori di `document_nature` con `document_role`;
- D10: ha classificato correttamente la natura `payment_terms`, ma non il ruolo `payment_attachment` e non ha superato il boundary payment.

## Decisione

Cloudflare Workers AI non va promosso come provider T1 L0 v0.2 per classificazione documentale dell’envelope Copenhagen completo.

Motivi:

- il modello piccolo completa il task ma non passa la baseline semantica;
- i modelli più robusti provati vanno in timeout sull’envelope completo;
- la metrica Neuroni del dashboard non si aggiorna in modo abbastanza tempestivo per usarla come controllo puntuale del singolo benchmark;
- JSON Mode è disponibile e utile, ma da solo non garantisce qualità semantica.

## Implicazioni per TRAM

Cloudflare resta interessante per:

- task L0 più piccoli;
- classificazioni semplici;
- fallback privacy-oriented;
- embedding, RAG leggero o workflow Cloudflare futuri;
- deployment o architettura edge, se decideremo di valutare Cloudflare come piattaforma.

Per T1 L0 v0.2, la classifica provvisoria resta:

1. Gemini `gemini-2.5-flash-lite`;
2. Mistral `mistral-medium-3.5`;
3. Cloudflare Workers AI solo fallback tecnico per task più piccoli, non default;
4. Groq, Cerebras e OpenRouter non promossi sull’envelope attuale.

## Prossimo passo consigliato

Non eseguire altre run Cloudflare T1 L0 v0.2 sull’envelope completo. Chiudere il ciclo provider gratuiti con una raccomandazione provvisoria: Gemini e Mistral come candidati principali, Cloudflare come fallback da rivalutare su micro-task.
