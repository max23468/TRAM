# TRAM V1 - Valutazione micro-benchmark routing AI v0.4

Data: 2026-05-13
Stato: valutazione L0 completata
Ambito: provider gratuiti o free-tier per micro-task di classificazione documentale

## Scopo

Questo report risponde alla domanda: oltre a Gemini e Mistral, quali provider AI possono essere usati in TRAM V1?

Il test v0.4 non sostituisce T1 L0 v0.3 hybrid. Serve a capire se provider che non avevano retto l’envelope Copenhagen completo possono comunque essere utili su micro-task L0 molto piccoli, cioè classificazioni basate solo su metadati documentali.

## Perimetro dati

Il micro-benchmark ha usato solo input L0:

- nome file;
- title hint;
- version hint;
- package phase hint;
- nessun corpo documento;
- nessuna tabella;
- nessun contenuto di pricing;
- nessun dato personale;
- nessun allegato completo.

Questo è coerente con la regola TRAM: nessun pacchetto completo deve essere inviato a un LLM.

## Dataset

| Item | Caso | Obiettivo |
| --- | --- | --- |
| `MB1` | Copenhagen MPP Procurement Schedule v3 | Riconoscere schedule di procurement e file `.mpp` |
| `MB2` | Dublin Luas pricing redline Rev 5 | Riconoscere pricing workbook/redline in fase ITN |
| `MB3` | Milano GTFS Lotto 1 ZIP | Riconoscere dataset operativo GTFS |
| `MB4` | Milano errata corrige `.pdf.p7m` | Riconoscere chiarimento/integrazione firmata |
| `MB5` | Dublin MetroLink PQP Part 1 | Riconoscere prequalifica/PQP |

Artefatti locali:

- input: `/Users/Matteo/Documents/TRAM/data/working/ai-routing-micro-benchmark-v0-4/benchmark-inputs/tram-ai-routing-micro-benchmark-v0-4-input-envelope-r1.json`;
- baseline: `/Users/Matteo/Documents/TRAM/data/working/ai-routing-micro-benchmark-v0-4/benchmark-baselines/tram-ai-routing-micro-benchmark-v0-4-baseline-r1.json`;
- summary: `/Users/Matteo/Documents/TRAM/data/working/ai-routing-micro-benchmark-v0-4/benchmark-evaluations/tram-ai-routing-micro-benchmark-v0-4-summary.json`.

## Risultati

| Provider | Modello | Esito | Interpretazione TRAM |
| --- | --- | --- | --- |
| Cloudflare Workers AI | `@cf/meta/llama-3.1-8b-instruct` | Pass, 5/5 | Usabile per micro-task L0 e fallback leggero |
| Groq | `llama-3.3-70b-versatile` | Pass, 5/5 | Usabile per micro-task L0 quando quota free disponibile |
| Cerebras | `qwen-3-235b-a22b-instruct-2507` | HTTP 429, `queue_exceeded` | Non valutabile per capacity; non promuovere |
| Cerebras | `llama3.1-8b` | Format pass, classification fail | Non sufficiente per routing TRAM |
| OpenRouter | `qwen/qwen3-next-80b-a3b-instruct:free` | HTTP 429 upstream | Instabile sul free tier |
| OpenRouter | `meta-llama/llama-3.3-70b-instruct:free` | HTTP 429 upstream | Instabile sul free tier |
| OpenRouter | `google/gemma-4-26b-a4b-it:free` | Pass, 5/5 | Usabile solo come smoke L0 sperimentale con modello pinned |

## Lettura critica

Cloudflare e Groq si riescono a usare, ma non per gli stessi compiti di Gemini e Mistral. Il pass v0.4 mostra che possono classificare metadati molto piccoli; non dimostra che possano estrarre requisiti, KPI, timeline o contraddizioni da documenti reali.

OpenRouter si riesce a usare solo con cautela: il modello `google/gemma-4-26b-a4b-it:free` ha passato il test, ma due free model sono stati bloccati da rate limit upstream. Quindi OpenRouter è utile per confronto e smoke test, non come default operativo V1.

Cerebras resta interessante tecnicamente, ma in questa sessione il modello grande non era disponibile per traffico/quota e il fallback piccolo non ha prodotto output completo. Non va promosso.

## Decisione V1

Per TRAM V1:

- Gemini resta provider principale T1 L0 hybrid;
- Mistral resta secondo provider forte, con rischio capacity e privacy da chiudere prima di L1/L2;
- Cloudflare Workers AI diventa fallback ammesso per micro-task L0;
- Groq diventa fallback ammesso per micro-task L0, soprattutto quando velocità e JSON semplice contano;
- OpenRouter resta sperimentale L0 con modello pinned e ZDR/policy da verificare;
- Cerebras resta solo benchmark tecnico da ritentare, non route applicativa.

La promozione di Cloudflare e Groq è stretta: `L0`, input minimizzato, classificazione leggera, niente contenuto documentale sostanziale.

## Fonti provider ricontrollate

- Cloudflare Workers AI pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
- Cloudflare Workers AI data usage: https://developers.cloudflare.com/workers-ai/platform/data-usage/
- Groq rate limits: https://console.groq.com/docs/rate-limits
- Cerebras rate limits: https://inference-docs.cerebras.ai/support/rate-limits
- OpenRouter free models router: https://openrouter.ai/docs/guides/routing/routers/free-models-router
- OpenRouter ZDR: https://openrouter.ai/docs/guides/features/zdr

## Prossimo passo consigliato

Consolidare questa decisione nella matrice di routing AI e poi usare T2 timeline come prossimo benchmark utile: parser/regole per estrarre date e AI solo per normalizzazione, incertezze e classificazione evento.
