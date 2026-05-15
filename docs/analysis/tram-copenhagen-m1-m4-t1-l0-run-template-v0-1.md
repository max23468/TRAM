# Copenhagen M1-M4 O&M - Run template T1 L0 v0.1

Data: 2026-05-13
Stato: template pronto, nessuna chiamata AI eseguita
Task: `T1 - Classificazione documentale`
Livello privacy: `L0`

## Scopo

Questo documento definisce come registrare ogni smoke test T1 L0 su Gemini, Mistral, Groq, Cerebras e OpenRouter.

L’obiettivo è evitare valutazioni soggettive non tracciate. Ogni run deve salvare:

- provider e modello effettivo;
- policy dati applicata;
- hash dell’input e dell’output;
- consumo, latenza, quota e costo stimato;
- validazione schema;
- controlli automatici T1;
- review umana con score comparabile.

## File template

Template JSON:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-template-v0-1.json`

Envelope input:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-inputs/tram-cph-m1m4-t1-l0-input-envelope-v0-1.json`

Hash SHA-256 dell’envelope:

`ed9c910e934fff14a324f512465678d66f8a0085759c60f3b8265f83a3f5f3ec`

## Uso operativo

Per ogni provider:

1. copiare il template JSON in un file provider-specifico;
2. compilare `benchmark_run.provider`, `model`, `endpoint_family`, `account_tier` e policy dati;
3. assemblare il prompt T1 usando il prompt/schema pack v0.1;
4. eseguire la chiamata solo se costo stimato e budget restano pari a zero;
5. salvare raw output e parsed output in `data/working/copenhagen-m1-m4-om/benchmark-runs/`;
6. compilare metriche, controlli automatici e review umana;
7. decidere se il provider resta candidato, richiede retry o viene scartato.

## Naming consigliato per i run file

Usare nomi espliciti:

- `tram-cph-m1m4-t1-l0-run-gemini-v0-1.json`
- `tram-cph-m1m4-t1-l0-run-mistral-v0-1.json`
- `tram-cph-m1m4-t1-l0-run-groq-v0-1.json`
- `tram-cph-m1m4-t1-l0-run-cerebras-v0-1.json`
- `tram-cph-m1m4-t1-l0-run-openrouter-v0-1.json`

Per raw e parsed output:

- `tram-cph-m1m4-t1-l0-output-gemini-raw-v0-1.json`
- `tram-cph-m1m4-t1-l0-output-gemini-parsed-v0-1.json`

Sostituire `gemini` con il provider effettivo.

## Campi obbligatori

Prima di considerare una run valida, compilare almeno:

- `benchmark_run_id`;
- `provider`;
- `model`;
- `provider_route`, se applicabile;
- `zdr_or_training_policy`;
- `input_sha256`;
- `output_sha256`;
- `schema_parse_ok`;
- `items_returned`;
- `latency_ms`;
- `token_or_unit_usage`;
- `estimated_cost`;
- `free_quota`;
- `automatic_checks`;
- baseline-aware evaluation, quando esiste una baseline;
- `human_quality_review`.

## Controlli automatici T1

La run deve fallire se:

- l’output non è JSON valido;
- include markdown o testo extra fuori JSON;
- mancano `task_id`, `schema_version` o `dataset_id`;
- manca uno dei sample `D1-D10`;
- D1 e D2 vengono fusi;
- D3 e D4 vengono trattati come equivalenti senza distinguere formato/versione;
- D10 viene sintetizzato nel merito payment;
- mancano fonti per gli item;
- vengono inventate date o versioni non deducibili dal solo input L0;
- OpenRouter non registra provider o modello effettivo.

Quando esiste una baseline, la run deve inoltre distinguere:

- pass tecnico;
- accuratezza baseline-aware di `document_role`;
- accuratezza baseline-aware di `procurement_stage`;
- accuratezza versione;
- currentness solo sui sample in cui è valutabile da L0;
- boundary su documenti sensibili, per esempio D10 payment.

Un pass tecnico non promuove automaticamente il provider se il pass baseline-aware fallisce.

## Review umana

La review usa una scala `0-3`:

- `0`: fallito;
- `1`: debole;
- `2`: accettabile;
- `3`: buono.

Dimensioni:

- accuratezza ruolo documento;
- accuratezza fase;
- gestione versioni;
- gestione incertezza su currentness;
- qualità delle fonti;
- rispetto del boundary privacy;
- qualità dell’output italiano.

Una run può essere promossa oltre L0 solo se:

- passa tutti i controlli automatici critici;
- non inventa dati;
- mantiene D10 dentro il perimetro di classificazione;
- ottiene una review umana almeno accettabile;
- la policy dati del provider è compatibile con il livello successivo.

## Prossimo passo consigliato

Il primo run file provider-specifico per Gemini è stato preparato in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-gemini-run-v0-1.md`
- `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-gemini-v0-1.json`

Risultato aggiornato:

- il run principale `gemini-3.1-flash-lite` è fallito per `503 UNAVAILABLE`;
- la variante `gemini-2.5-flash-lite` con schema provider è fallita per complessità schema;
- la variante `gemini-2.5-flash-lite` in JSON mode è stata eseguita con successo tecnico, ma non passa la valutazione baseline-aware.

Variante riuscita:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-gemini-25-json-mode-run-v0-1.md`
- `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-gemini-25-flash-lite-json-mode-v0-1.json`

Baseline-aware evaluation:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-baseline-aware-evaluation-v0-1.md`
- `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-gemini-25-json-mode-v0-1.json`

Prossimo passo: aggiornare prompt/schema T1 per distinguere `package_phase` e `document_nature`, poi eseguire gli stessi smoke test su Mistral, Groq, Cerebras e OpenRouter.
