# TRAM V1 - Raccomandazione provider AI gratuiti v0.1

Data: 2026-05-13
Stato: raccomandazione provvisoria per V1/T1/T2/T3, aggiornata con T3 deliverable v0.1
Ambito: AI gratuita, classificazione documentale, timeline, deliverable e workflow evidence-first

## Scopo

Questo documento consolida i benchmark T1 L0 v0.2 e trasforma le singole run provider in una raccomandazione operativa per TRAM V1.

La raccomandazione non sceglie un provider definitivo per tutto TRAM. Definisce invece:

- provider candidati per task L0 di classificazione documentale;
- limiti prima di passare a L1/L2;
- fallback ammessi;
- decisioni da recuperare prima dello sviluppo applicativo.

## Decisione sintetica

Per TRAM V1, allo stato attuale:

1. **Gemini `gemini-2.5-flash-lite`** è il candidato principale per T1 L0 e candidato operativo per T2 timeline e T3 deliverable minimizzati.
2. **Mistral `mistral-medium-3.5`** è il candidato secondario forte, preferibile come alternativa europea, e ha passato raw i benchmark T2 e T3; richiede chiarimento privacy prima di L1/L2.
3. **Cloudflare Workers AI** non è promosso per T1 L0 sull’envelope Copenhagen completo, ma resta candidato per micro-task L0, embedding, fallback leggeri o workflow edge.
4. **Groq `llama-3.3-70b-versatile`** non è promosso per T1 completo, ma è promosso per micro-task L0.
5. **OpenRouter** resta sperimentale L0: può funzionare con modello pinned, ma il free tier è instabile.
6. **Cerebras** non è promosso: resta solo benchmark tecnico.
7. **VPS/self-hosted** resta fallback privacy-first per task sensibili, accettando qualità e velocità inferiori.

Questa decisione vale solo per:

- `task_id = T1`, `task_id = T2`, `task_id = T3` e micro-routing documentale L0;
- privacy level `L0`;
- dataset Copenhagen M1-M4 O&M, Dublin Luas O&M, Milano lotti extraurbani O&M e Dublin MetroLink PPP limitatamente ai campioni già testati;
- envelope v0.2/v0.3 e micro-benchmark v0.4;
- envelope T2 timeline v0.1 con input L1 minimizzato;
- envelope T3 deliverable v0.1 con input L1 minimizzato;
- stato provider verificato il 2026-05-13.

Non autorizza invio di documenti integrali, chunk L1/L2, payment mechanism, dati personali o clausole sensibili a provider esterni.

La tassonomia T1-T8 completa è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-tx-task-taxonomy-t1-t8.md`

Per `T4`-`T8`, questa raccomandazione imposta solo il routing iniziale:

- `T4`: Gemini/Mistral candidati solo su L1 minimizzato e con parser/regole come fonte primaria;
- `T5`: nessun provider esterno default V1;
- `T6`: AI limitata a famiglie costo e incertezze su input ammessi, senza importi;
- `T7`: AI solo per spiegazione prudente se il livello fonte lo consente;
- `T8`: template e review umana obbligatori, AI esterna non default.

Aggiornamento v0.3: il rerun con gate privacy/costo e minimizzazione completa non promuove nessun provider come esecutore autonomo dell’intero T1 L0. Gemini e Mistral restano candidati per classificazione L0 di `document_nature` e `document_role`, ma `version` e soprattutto `currentness` devono essere risolti con regole deterministiche e review queue, usando l’AI solo come supporto o commento sui casi ambigui.

Aggiornamento v0.3 hybrid: separando AI e resolver, Gemini e Mistral passano entrambi su Copenhagen T1 L0 e su un campione Luas T1 L0. La raccomandazione operativa non è “più AI”, ma AI per classificazione semantica e regole per famiglia/versione/currentness.

Aggiornamento v0.4 micro-routing: Cloudflare Workers AI e Groq passano su un test L0 ristretto a cinque metadati file rappresentativi di MPP, pricing redline, GTFS ZIP, chiarimento firmato `.p7m` e prequalifica/PQP. OpenRouter passa solo con `google/gemma-4-26b-a4b-it:free`; altri modelli free testati sono stati rate-limited upstream. Cerebras non viene promosso.

Aggiornamento T1 L0 stage-aware v0.4: Gemini `gemini-2.5-flash-lite` passa il benchmark compatto sui quattro pacchetti solo come pipeline, cioè AI + normalizzatore deterministico post-AI. Il raw output è completo e stage-aware, ma alcuni enum richiedono normalizzazione. Mistral non è stato valutabile per HTTP 429 `service_tier_capacity_exceeded`.

Aggiornamento T2 timeline v0.1: Gemini e Mistral completano il benchmark da 19 eventi su quattro pacchetti senza restituire campi temporali vietati. Gemini passa come pipeline normalizzata; Mistral passa raw e pipeline. Per T2 la raccomandazione resta parser/rule-first: l’AI non decide date, orari, durate o conflitti.

Aggiornamento T4-T8 v0.1: i benchmark compatti sono stati eseguiti selettivamente. Mistral passa T4 e T6 come pipeline normalizzata e passa T8 su subset L1/L0 dopo normalizzatore human-first. T7 non è promosso: il modello restituisce tutti gli item in modalità batch, ma sottostima severità/azioni e manca un review gate. Gemini non è stato valutabile per quota free tier `429 RESOURCE_EXHAUSTED`. Aggiornamento 2026-05-14: T5 non resta fuori dai provider esterni per categoria; va benchmarkato su Financials L0/L1 minimizzati e approvati, con blocco solo per L2 effettivo o policy incompatibile.

Aggiornamento T3 deliverable v0.1: Gemini e Mistral completano il benchmark da 22 deliverable su quattro pacchetti senza restituire campi requisiti vietati. Entrambi passano raw e pipeline. Per T3 la raccomandazione resta parser/rule-first: l’AI non decide codici, obbligatorietà, limiti pagina, formati, pesi, deadline, valori economici o checklist finale.

## Evidenze usate

Report provider:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-gemini-provider-schema-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-mistral-provider-schema-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-groq-provider-schema-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-cerebras-provider-schema-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-2-cloudflare-provider-schema-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-3-gemini-mistral-rerun-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-3-hybrid-resolver-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-dublin-luas-om-t1-l0-v0-3-hybrid-resolver-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-ai-routing-micro-benchmark-v0-4-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t1-l0-v0-4-stage-aware-compact-benchmark-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t2-timeline-compact-benchmark-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t3-deliverables-compact-benchmark-evaluation.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-v1-free-ai-provider-readiness-status-2026-05-13.md`

Dataset, envelope e baseline:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-free-ai-benchmark-dataset.md`
- `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-inputs/tram-cph-m1m4-t1-l0-input-envelope-v0-2.json`
- `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-baselines/tram-cph-m1m4-t1-l0-baseline-v0-2.json`

## Ranking operativo

| Rank | Provider/modello | Ruolo V1 provvisorio | Esito T1 L0 v0.2 | Uso ammesso ora | Blocco prima di L1/L2 |
| --- | --- | --- | --- | --- | --- |
| 1 | Gemini `gemini-2.5-flash-lite` | Primario T1 L0, candidato T2/T3 | Pass baseline-aware; T2 pipeline pass; T3 raw pass | Classificazione documentale L0, timeline e deliverable minimizzati, altri task controllati | Verifica account, billing, privacy, clausole gara e budget |
| 2 | Mistral `mistral-medium-3.5` | Secondario T1 L0, forte T2/T3 | Pass baseline-aware; T2 raw pass; T3 raw pass | Classificazione documentale L0, timeline e deliverable minimizzati, confronto qualità con Gemini | Chiarire opt-out training e regime dati del piano Experiment |
| 3 | Cloudflare Workers AI | Fallback micro-task | Fail su envelope completo; pass micro v0.4 | Micro-task L0, task leggeri, test edge/embedding futuri | Non usare su T1 completo o L1/L2 senza nuova decisione |
| 4 | Groq `llama-3.3-70b-versatile` | Fallback micro-task | Fail su envelope completo; pass micro v0.4 | Micro-task L0, JSON semplice, classificazioni corte | Rate/token limit e policy dati prima di L1 |
| 5 | OpenRouter | Sperimentale L0 | Pass solo con modello pinned; rate limit su altri free model | Smoke L0 e confronto esplorativo | ZDR, provider logging, policy provider effettivo |
| 6 | Cerebras | Sperimentale tecnico | Fail/parziale anche su micro v0.4 | Ritentare solo se serve confronto tecnico su modello grande | Accesso modello grande, privacy, DPA, qualità dominio |
| 7 | VPS/self-hosted | Fallback privacy-first | Non benchmarkato qui | Task sensibili o batch lenti se provider esterni non ammessi | Modello, risorse, qualità, runbook e costi reali |

## Perché Gemini primo

Gemini `gemini-2.5-flash-lite` ha passato T1 L0 v0.2 con:

- JSON/schema pass;
- 10/10 item restituiti;
- `package_phase` 10/10;
- `document_nature` 10/10;
- `document_role` 10/10;
- versioni 10/10;
- currentness valutabile 4/4;
- boundary payment D10 pass;
- latenza 8.856 ms;
- costo stimato 0 nel test.

Limite: il test è solo L0 e non chiude privacy, billing, spend cap o clausole di gara.

## Perché Mistral secondo

Mistral `mistral-medium-3.5` ha passato T1 L0 v0.2 con qualità semantica equivalente alla baseline. È un candidato importante perché:

- è europeo;
- usa API diretta;
- è adatto come secondo provider per confronto, fallback e riduzione lock-in.

Limiti:

- `mistral-small-2603` non è sufficiente per T1 L0 senza tuning;
- prima di L1/L2 va chiarito se e come il piano Experiment consente opt-out training o altra base privacy accettabile;
- latenza superiore a Gemini nel benchmark.

## Perché Cloudflare non è default

Cloudflare Workers AI ha confermato che API e JSON Mode funzionano, ma non passa l’envelope Copenhagen completo:

- `@cf/meta/llama-3.3-70b-instruct-fp8-fast`: timeout Cloudflare `408`;
- `@cf/meta/llama-3.1-8b-instruct`: schema e formato validi, ma baseline semantica fail;
- `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b`: timeout client dopo 150 secondi.

Cloudflare resta comunque utile da tenere nel radar per:

- task L0 molto piccoli;
- classificazioni elementari;
- embedding;
- RAG leggero;
- workflow edge;
- futura valutazione architetturale se Cloudflare diventa parte dello stack.

## Provider non promossi o limitati

Groq non viene promosso per T1 completo perché:

- il modello più robusto testato ha incontrato limiti TPM/schema;
- il modello completato non ha passato la baseline semantica.

Dopo v0.4, Groq viene però ammesso per micro-task L0 con input minimizzati e schema semplice.

Cerebras non viene promosso perché:

- `llama3.1-8b` non è semanticamente sufficiente;
- il modello grande candidato è stato bloccato da traffico/quota;
- privacy/DPA non sono chiuse.

OpenRouter non viene promosso come default perché:

- i modelli free sono risultati instabili o rate-limited;
- il modello free riuscito va comunque pinned e rivalutato nel tempo;
- per L1/L2 serve modello pinned, ZDR e policy provider verificata.

## Policy operativa V1

Fino a nuova decisione:

- usare Gemini come primo candidato per task T1 L0;
- per T1 L0 v0.4 usare Gemini insieme a normalizzatore post-AI e resolver deterministico;
- usare Mistral medium come secondo candidato o confronto;
- per T2 timeline usare parser/regole per date e conflitti, con Gemini o Mistral solo per normalizzare eventi e incertezze;
- per T3 deliverable usare parser/regole per individuare deliverable e requisiti formali, con Gemini o Mistral solo per normalizzare nome, tipo, area, dominio O&M, dipendenze e incertezze;
- non usare Gemini o Mistral come fonte unica per `currentness` dei documenti;
- non usare Gemini o Mistral come fonte unica per date, orari, durate o stato review degli eventi timeline;
- non usare Gemini o Mistral come fonte unica per obbligatorietà, limiti pagina, formati, pesi, deadline, valori economici o checklist finale dei deliverable;
- calcolare `currentness` con resolver deterministico su famiglia documento, versione, clean copy e track changes, poi inviare alla review queue i casi ambigui;
- far compilare al gateway locale i campi privacy/gate/audit comuni, senza dipendere dal modello per questi echo tecnici;
- non usare Cloudflare, Groq, Cerebras o OpenRouter come default T1;
- usare Cloudflare o Groq solo per micro-task L0 con input minimizzati;
- usare OpenRouter solo per smoke L0 con modello pinned e policy verificata;
- non usare alcun provider su L1/L2 senza gate privacy e conferma del maintainer;
- non inviare mai pacchetti completi o documenti integrali;
- salvare sempre provider, modello, endpoint, prompt/schema version, input hash, output hash, token/unità, costo stimato, quota se disponibile, stato e motivazione;
- sospendere il job se termina quota gratuita o se il costo non è controllabile.

## Gate prima di L1/L2

Prima di inviare chunk L1 o L2 a qualsiasi provider esterno, TRAM deve avere:

1. classificazione del documento e del chunk per sensibilità;
2. verifica clausole del pacchetto gara su riservatezza, AI, data processing e subprocessor;
3. policy provider aggiornata e compatibile;
4. budget o free-tier guard;
5. logging senza contenuti integrali;
6. review umana obbligatoria per output critici;
7. opzione “non inviabile a provider AI” per Tender o documento.

## Impatto sull’architettura

L’architettura deve restare provider-agnostic.

Decisioni tecniche conseguenti:

- creare un AI gateway interno o adapter layer;
- non cablare Gemini direttamente nel dominio applicativo;
- mantenere registry delle chiamate AI;
- progettare prompt/schema versionati;
- separare output proposto, review item e dato validato;
- prevedere provider fallback per task diversi, non un solo modello globale;
- trattare la VPS/self-hosted come fallback privacy, non come requisito immediato per tutti i task.

## Debiti e decisioni da recuperare

- Verificare sul progetto Gemini reale free tier, billing, prepay e spend cap.
- Verificare Mistral Experiment: opt-out training, retention, rate limit e base privacy.
- Estendere T1 hybrid al full-package L0 se serve copertura su tutti i file, dopo il pass dei campioni Copenhagen e Luas.
- Trasformare il micro-routing v0.4 in schema `AiRouteDecision` quando inizierà il codice.
- Trasformare il normalizzatore T1 L0 v0.4 in specifica `AiClassificationNormalizer`.
- Trasformare il normalizzatore T2 v0.1 in specifica `TimelineEventNormalizer`.
- Trasformare il normalizzatore T3 v0.1 in specifica `TenderDeliverableNormalizer`.
- Usare la specifica tecnica dei normalizzatori T4-T8 in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`.
- Usare il config normalizzatori in `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json`.
- Usare la specifica fixture test in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md`.
- Definire una regola calendar-aware per conflitti tipo “almeno trenta giorni prima” rispetto a una data assoluta.
- Valutare se ritentare Cerebras `qwen-3-235b-a22b-instruct-2507`.
- Trasformare il registro tecnico delle chiamate AI in schema applicativo.
- Estendere policy di redazione/minimizzazione chunks a tutte le classi `dc_*`.
- Raffinare classi documentali inviabili/non inviabili a provider esterni su altri pacchetti.

## Prossimo passo consigliato

Usare la specifica viste dashboard MVP e il registro `indicator_key` P0/P1 per preparare fixture applicative. In particolare: T7 deve restare rules-first per severity/action, mentre T8 deve forzare sempre `human_approval_required=true`.
