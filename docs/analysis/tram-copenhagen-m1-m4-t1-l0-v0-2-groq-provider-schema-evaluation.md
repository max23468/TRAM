# Copenhagen M1-M4 O&M - Groq provider schema evaluation T1 L0 v0.2

Data: 2026-05-13
Stato: test eseguito, non promosso
Provider: Groq

## Scopo

Questa nota registra il primo benchmark Groq sul task T1 L0 v0.2, usando lo stesso envelope e la stessa baseline usati per Gemini e Mistral.

## Fonti provider verificate

Fonti consultate il 2026-05-13:

- Groq rate limits: https://console.groq.com/docs/rate-limits
- Groq structured outputs: https://console.groq.com/docs/structured-outputs
- Groq data policy: https://console.groq.com/docs/your-data

Sintesi operativa: Groq è interessante per velocità e per structured output sui modelli supportati, ma il free tier può bloccare richieste L0 non piccolissime per TPM e lo strict schema va validato modello per modello.

## File principali

Envelope:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-inputs/tram-cph-m1m4-t1-l0-input-envelope-v0-2.json`

Baseline:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-baselines/tram-cph-m1m4-t1-l0-baseline-v0-2.json`

Evaluation best-effort:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-groq-llama-4-scout-17b-best-effort-v0-2.json`

## Iterazioni

| Run | Esito | Nota |
| --- | --- | --- |
| `openai/gpt-oss-120b` strict r1 | Fail tecnico | Richiesta oltre TPM free tier: 10.014 token richiesti contro limite 8.000 |
| `openai/gpt-oss-120b` strict r2/r3 | Fail tecnico | Il provider ha rigettato la generazione perché mancava il campo `warnings` richiesto dallo schema |
| `meta-llama/llama-4-scout-17b-16e-instruct` best-effort | Fail semantico | JSON valido, ma baseline-aware fail |

## Esito `llama-4-scout` best-effort

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
| Latenza | 7.960 ms |
| Input tokens | 4.860 |
| Output tokens | 2.456 |

## Decisione

Groq resta candidato tecnico per task molto rapidi e leggeri, ma non va promosso come provider V1 per classificazione documentale T1 con l’envelope attuale.

Decisioni operative:

- non usare Groq come default T1;
- rivalutarlo su envelope più compatti o task più piccoli;
- prima di L1/L2 verificare Data Controls/ZDR e limiti effettivi del workspace;
- se si usa Groq, applicare validazione lato TRAM anche quando il provider dichiara structured output.

## Prossimo passo consigliato

Tenere Groq come candidato fallback per task atomici o per benchmark successivi su prompt ridotti. Non investire ora tuning ulteriore finché Cloudflare Workers AI, Cerebras modello grande e OpenRouter non sono stati confrontati.
