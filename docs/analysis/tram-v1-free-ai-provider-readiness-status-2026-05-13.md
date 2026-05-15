# TRAM V1 - Stato readiness provider AI gratuiti

Data: 2026-05-13
Stato: Gemini e Mistral promossi su T1 L0 hybrid, T2 timeline minimizzata e T3 deliverable minimizzati; Cloudflare e Groq promossi solo per micro-task L0; OpenRouter sperimentale L0 con modello pinned; Cerebras non promosso

## Scopo

Questa nota registra lo stato operativo dei provider AI candidati per il benchmark gratuito TRAM V1.

Aggiornamento v0.3: il rerun Copenhagen con gate privacy/costo e minimizzazione conferma che Gemini e Mistral restano candidati L0, ma non devono essere usati come fonte unica per `currentness`. La risoluzione dello stato corrente deve passare da regole deterministiche su famiglia documento, versione e track changes, con AI solo come supporto e review queue per anomalie.

Aggiornamento v0.3 hybrid: Gemini e Mistral passano entrambi quando T1 L0 viene separato in AI classification e resolver deterministico. Il pass è confermato su Copenhagen e su un campione Dublin Luas. Gemini passa anche su Milano lotti extraurbani e Dublin MetroLink PPP. Mistral non è stato valutabile sui due nuovi pacchetti per `service_tier_capacity_exceeded` sul free tier. Questa diventa la modalità consigliata per il document map MVP, con attenzione alla capacity del provider.

Aggiornamento v0.4 micro-routing: Cloudflare Workers AI e Groq passano un micro-benchmark L0 su cinque casi misti, basato solo su metadati file e title/version hint. OpenRouter passa solo con `google/gemma-4-26b-a4b-it:free`, mentre altri modelli free sono stati rate-limited upstream. Cerebras non viene promosso: il modello grande è stato bloccato da capacity e `llama3.1-8b` ha restituito solo 1 item su 5.

Aggiornamento T1 L0 stage-aware v0.4: Gemini passa il benchmark compatto sui quattro pacchetti come pipeline AI + normalizzatore deterministico post-AI. Il raw output Gemini è completo e stage-aware, ma richiede 5 normalizzazioni enum/natura-ruolo. Mistral non è valutabile nel run per HTTP 429 `service_tier_capacity_exceeded`.

Aggiornamento T2 timeline v0.1: Gemini e Mistral completano il benchmark compatto da 19 eventi su quattro pacchetti senza restituire campi temporali vietati. Gemini passa come pipeline normalizzata, con 2 mismatch conservativi su `review_required`; Mistral passa raw e pipeline, con incertezze più informative sulle contraddizioni candidate. T2 resta parser/rule-first: l’AI non consolida date, orari, durate o conflitti.

Aggiornamento T3 deliverable v0.1: Gemini e Mistral completano il benchmark compatto da 22 deliverable su quattro pacchetti senza restituire campi requisiti vietati. Entrambi passano raw e pipeline normalizzata. T3 resta parser/rule-first: l’AI non consolida codici, obbligatorietà, limiti pagina, formati, pesi, deadline, valori economici o checklist finale.

Aggiornamento T4-T8 v0.1: i benchmark compatti sono stati eseguiti selettivamente. Mistral `mistral-medium-3.5` passa T4 e T6 come pipeline normalizzata; Mistral `mistral-small-2603` passa T8 su subset L1/L0 dopo normalizzatore human-first; T7 è stato tentato ma non promosso per severità/azioni troppo deboli. Gemini non è stato valutabile in questa tornata per quota free tier `429 RESOURCE_EXHAUSTED`. T5 resta parser locale + review senza AI esterna default.

## Stato chiavi locali

| Provider | Env rilevata | Portachiavi | Stato |
| --- | --- | --- | --- |
| Gemini | assente | presente | Testato T1 L0 v0.2 |
| Mistral | assente | presente | Testato T1 L0 v0.2 |
| Groq | assente | presente | Promosso solo micro-task L0 v0.4 |
| Cloudflare Workers AI | assente | presente | Promosso solo micro-task L0 v0.4 |
| Cerebras | assente | presente | Testato T1/micro L0, non promosso |
| OpenRouter | assente | presente | Sperimentale L0 con modello pinned |

Convenzione Portachiavi proposta:

| Provider | Account | Service |
| --- | --- | --- |
| Gemini | `GEMINI_API_KEY` | `com.tram.gemini.api-key` |
| Mistral | `MISTRAL_API_KEY` | `com.tram.mistral.api-key` |
| Groq | `GROQ_API_KEY` | `com.tram.groq.api-key` |
| Cloudflare Workers AI | `CLOUDFLARE_API_TOKEN` | `com.tram.cloudflare.api-token` |
| Cloudflare Workers AI | `CLOUDFLARE_ACCOUNT_ID` | `com.tram.cloudflare.account-id` |
| Cerebras | `CEREBRAS_API_KEY` | `com.tram.cerebras.api-key` |
| OpenRouter | `OPENROUTER_API_KEY` | `com.tram.openrouter.api-key` |

## Gemini

Stato: candidato operativo T1 L0.

Nota v0.3: candidato operativo per classificazione L0 di natura/ruolo, non per `currentness` autonoma.

Nota v0.3 hybrid: pass su Copenhagen con AI classification 10/10 e resolver deterministico 10/10; pass su Dublin Luas con AI classification 19/19 e resolver deterministico 19/19; pass su Milano lotti extraurbani con AI classification 26/26 e resolver deterministico 26/26; pass su Dublin MetroLink PPP con AI classification 16/16 e resolver deterministico 16/16.

Nota v0.4 stage-aware: pass pipeline su benchmark compatto 21/21 usando normalizzatore post-AI; raw output completo ma non completamente canonico.

Nota T2 timeline v0.1: pass pipeline su 19/19 eventi; raw completo e senza campi temporali vietati, ma con 2 mismatch conservativi su `review_required` per durate relative.

Nota T3 deliverable v0.1: pass raw e pipeline su 22/22 deliverable; output completo e senza campi requisiti vietati.

Nota T4-T8 v0.1: non valutabile nella tornata T4-T8 per quota free tier `429 RESOURCE_EXHAUSTED`; resta candidato dai benchmark precedenti, ma richiede scheduler quota-aware prima di run multi-task.

Run riuscita:

`/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-gemini-provider-schema-evaluation.md`

Risultato:

- modello: `gemini-2.5-flash-lite`;
- modalità: provider schema;
- costo stimato: 0;
- baseline-aware pass.

## Mistral

Stato: candidato operativo T1 L0 con modello selezionato; privacy da chiudere prima di L1/L2.

Nota v0.3: candidato operativo per classificazione L0 di natura/ruolo, con rischio capacity sul tier gratuito e senza promozione per `currentness` autonoma.

Nota v0.3 hybrid: pass su Copenhagen con AI classification 10/10 e resolver deterministico 10/10; pass su Dublin Luas con AI classification 19/19 e resolver deterministico 19/19; resta il rischio capacity del piano gratuito. Su Milano e Dublin MetroLink il modello `mistral-medium-3.5` non è stato valutabile perché l’API ha restituito HTTP 429 `service_tier_capacity_exceeded`.

Nota v0.4 stage-aware: non valutabile nel benchmark compatto perché l’API ha restituito HTTP 429 `service_tier_capacity_exceeded`.

Nota T2 timeline v0.1: pass raw e pipeline su 19/19 eventi; output completo, nessun campo temporale vietato e incertezze utili sui conflitti Copenhagen e Milano.

Nota T3 deliverable v0.1: pass raw e pipeline su 22/22 deliverable; output completo, nessun campo requisiti vietato e nessun mismatch rispetto alla baseline.

Nota T4-T8 v0.1: `mistral-medium-3.5` passa T4 e T6 come pipeline normalizzata; su T7/T8 il modello medium è instabile per capacity. `mistral-small-2603` passa T8 L1/L0 dopo normalizzatore, ma non promuove T7.

Run documentata:

`/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-mistral-provider-schema-evaluation.md`

Risultato:

- `mistral-medium-3.5`: provider schema pass, baseline-aware pass;
- `mistral-small-2603`: provider schema pass, baseline-aware fail;
- costo monetario non restituito dall’API; uso effettuato nel perimetro Experiment/free API;
- usare Mistral solo L0 finché non è chiarita la policy training/opt-out del piano Experiment.

Fonti verificate il 2026-05-13:

- Mistral API keys: https://docs.mistral.ai/admin/security-access/api-keys
- Mistral rate limits and usage tiers: https://docs.mistral.ai/admin/user-management-finops/tier
- Mistral API chat completions: https://docs.mistral.ai/api/
- Mistral Experiment plan: https://help.mistral.ai/en/articles/455206-how-can-i-try-the-api-for-free-with-the-experiment-plan

## Cloudflare Workers AI

Stato: non promosso per envelope Copenhagen completo; promosso solo per micro-task L0.

Credenziali locali:

- `CLOUDFLARE_API_TOKEN` salvato nel Portachiavi con service `com.tram.cloudflare.api-token`;
- `CLOUDFLARE_ACCOUNT_ID` salvato nel Portachiavi con service `com.tram.cloudflare.account-id`;
- nessuna credenziale Cloudflare deve essere scritta in repo, log, fixture o documentazione.

Smoke test eseguito il 2026-05-13:

- `GET /accounts/{account_id}/ai/models/search`: successo, 91 modelli restituiti;
- `POST /accounts/{account_id}/ai/run/@cf/meta/llama-3.1-8b-instruct`: successo, risposta minima `OK`, 42 token totali;
- `GET /user/tokens/verify`: risposta `Invalid API Token`; non considerato bloccante perché gli endpoint account Workers AI funzionano con lo stesso token.

Run T1 L0 v0.2 documentata:

`/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-cloudflare-provider-schema-evaluation.md`

Risultato:

- `@cf/meta/llama-3.3-70b-instruct-fp8-fast`: timeout Cloudflare `408`;
- `@cf/meta/llama-3.1-8b-instruct`: formato/schema pass, 10 item restituiti, baseline-aware fail;
- `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b`: timeout client dopo 150 secondi;
- Cloudflare resta candidato per task L0 più piccoli o workflow futuri, non default per T1 sull’envelope completo.

Run micro-routing v0.4:

- modello: `@cf/meta/llama-3.1-8b-instruct`;
- input: 5 item L0, solo metadati e hint;
- esito: formato pass, classificazione pass, 5/5 item restituiti;
- ruolo V1: fallback micro-task L0, non sostituto di Gemini/Mistral per T1 hybrid completo.

Motivo per includerlo:

- ha una free allocation giornaliera;
- se la quota gratuita viene superata, le operazioni falliscono invece di passare automaticamente a pagamento su Workers Free;
- Cloudflare dichiara che il Customer Content non viene usato per training o miglioramento senza consenso esplicito;
- supporta JSON Mode con schema, anche se l’aderenza allo schema va misurata lato TRAM.

Fonti verificate il 2026-05-13:

- Cloudflare Workers AI pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
- Cloudflare Workers AI privacy/data usage: https://developers.cloudflare.com/workers-ai/platform/data-usage/
- Cloudflare Workers AI JSON Mode: https://developers.cloudflare.com/workers-ai/features/json-mode/
- Cloudflare Workers AI REST API: https://developers.cloudflare.com/api/resources/ai/methods/run/

Prima di altri test Cloudflare:

- ridurre envelope o task;
- evitare ulteriori run complete T1 L0 v0.2 senza una ragione specifica;
- registrare sempre latenza, timeout e quota/costo osservabili;
- sospendere il job se la quota gratuita o il budget non sono controllabili.

## Groq

Stato: non promosso per envelope Copenhagen completo; promosso solo per micro-task L0.

Run documentata:

`/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-groq-provider-schema-evaluation.md`

Risultato:

- `openai/gpt-oss-120b`: bloccato da TPM free tier e poi da schema validation;
- `meta-llama/llama-4-scout-17b-16e-instruct`: JSON valido ma baseline-aware fail;
- Groq resta candidato per task più piccoli o envelope ridotti, non default T1.

Run micro-routing v0.4:

- modello: `llama-3.3-70b-versatile`;
- input: 5 item L0, solo metadati e hint;
- esito: formato pass, classificazione pass, 5/5 item restituiti;
- ruolo V1: fallback micro-task L0, utile per JSON semplice e classificazioni corte quando quota free disponibile.

## Cerebras

Stato: test parziale T1 L0 v0.2, non promosso.

Run documentata:

`/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-cerebras-provider-schema-evaluation.md`

Risultato:

- `gpt-oss-120b`: listato ma non accessibile dall’account;
- `qwen-3-235b-a22b-instruct-2507`: bloccato da traffico/quota durante i tentativi;
- `llama3.1-8b`: provider schema strict pass, ma baseline-aware fail;
- Cerebras resta candidato tecnico da ritentare sul modello grande, non default T1.

Run micro-routing v0.4:

- `qwen-3-235b-a22b-instruct-2507`: HTTP 429 `queue_exceeded`;
- `llama3.1-8b`: formato pass, ma solo 1 item su 5 restituito;
- decisione: non promosso nemmeno come fallback micro-task.

## OpenRouter

Stato: test parziale T1 L0 v0.2, non promosso.

Credenziali locali:

- `OPENROUTER_API_KEY` salvato nel Portachiavi con service `com.tram.openrouter.api-key`;
- nessuna credenziale OpenRouter deve essere scritta in repo, log, fixture o documentazione.

Risultato:

- `qwen/qwen3-next-80b-a3b-instruct:free`: bloccato da upstream rate limit;
- `nvidia/nemotron-3-super-120b-a12b:free`: risposta HTTP 200, ma format pass fallito e nessun item valido restituito;
- `google/gemma-4-31b-it:free`: bloccato da upstream rate limit;
- OpenRouter resta utile per smoke test L0 e confronto esplorativo, non come default su documenti riservati.

Run micro-routing v0.4:

- `qwen/qwen3-next-80b-a3b-instruct:free`: HTTP 429 upstream;
- `meta-llama/llama-3.3-70b-instruct:free`: HTTP 429 upstream;
- `google/gemma-4-26b-a4b-it:free`: formato pass, classificazione pass, 5/5 item restituiti;
- decisione: usare solo per smoke L0 sperimentali con modello pinned, ZDR/policy provider verificata e nessun contenuto L1/L2.

Prima di eseguire altri test:

- verificare fonte ufficiale aggiornata per free tier, modello e structured/JSON output;
- usare modello pinned, non router generico;
- verificare ZDR, provider logging e policy del provider effettivo;
- non inviare chunk L1/L2;
- non abilitare web/search/file upload/tool esterni.

## Prossimo passo consigliato

La raccomandazione provvisoria provider V1 free-first è documentata in:

`/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-provider-recommendation-v0-1.md`

Decisione sintetica: Gemini è il candidato più solido per T1 L0 hybrid sui quattro benchmark attuali e passa T2/T3 come pipeline normalizzata. Mistral resta candidato principale e passa T2/T3 raw, ma con rischio capacity sul tier gratuito, quindi non deve essere l’unico fallback operativo. Cloudflare e Groq sono promossi solo per micro-task L0. OpenRouter resta sperimentale L0 con modello pinned. Cerebras non è promosso.

Prossimo passo: usare il registro `indicator_key` P0/P1 già definito per scheduler quota-aware Gemini, policy capacity/retry Mistral e fixture applicative del primo slice UI.
