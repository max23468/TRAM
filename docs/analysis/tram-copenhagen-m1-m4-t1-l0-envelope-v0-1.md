# Copenhagen M1-M4 O&M - Envelope T1 L0 v0.1

Data: 2026-05-13
Stato: pronto per smoke test provider, senza chiamate AI eseguite
Pacchetto: `copenhagen-m1-m4-om`
Task: `T1 - Classificazione documentale`

## Scopo

Questo documento registra il primo input operativo per il benchmark AI gratuito di TRAM.

L’envelope serve a testare se un provider riesce a classificare dieci documenti Copenhagen usando solo metadati L0:

- filename;
- path relativo;
- estensione;
- hint di titolo e versione ricavati dal filename;
- riferimenti a estratti locali disponibili, senza includerne il contenuto.

## File operativo

Payload JSON:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-inputs/tram-cph-m1m4-t1-l0-input-envelope-v0-1.json`

Il file è in `data/working/` perché è un artefatto operativo collegato a un pacchetto reale o rappresentativo, non documentazione prodotto generale.

## Cosa contiene

- `request_id`, `benchmark_dataset_id`, `prompt_pack_id`, `schema_pack_id`;
- policy L0 per lo smoke test;
- lista dei provider candidati per il primo giro;
- dieci sample `D1-D10`;
- controlli di review da applicare dopo l’output;
- riferimento alla baseline attesa nel dataset benchmark.

## Cosa non contiene

- testo integrale dei documenti;
- chunk L1 o L2;
- ruoli attesi del dataset benchmark;
- payment mechanism o dettagli economici;
- dati personali;
- prompt con credenziali o configurazioni provider.

Questa separazione è intenzionale: l’AI deve classificare dai metadati, mentre la baseline attesa resta nel documento benchmark per valutare l’output.

## Uso previsto

Per ogni provider:

1. usare le regole comuni dal prompt/schema pack v0.1;
2. usare il prompt utente T1;
3. sostituire `{{INPUT_ENVELOPE_JSON}}` con il contenuto del file JSON;
4. richiedere output JSON conforme allo schema T1;
5. salvare provider, modello, prompt version, input hash, output hash, latenza, quota e policy dati applicata;
6. confrontare l’output con la sezione T1 del dataset benchmark.

Documento prompt/schema:

`/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-1.md`

Baseline:

`/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-free-ai-benchmark-dataset.md`

## Pass/fail specifici T1

La run fallisce se:

- l’output non è JSON valido;
- manca anche un solo sample tra `D1` e `D10`;
- D1 e D2 vengono fusi;
- D3 e D4 vengono trattati come duplicati equivalenti senza distinguere versione e formato;
- D10 viene sintetizzato nel merito payment invece di restare su classificazione documentale;
- manca almeno una fonte per item;
- l’AI inventa date, issue date, versioni o stato corrente non deducibili dall’input.

## Prossimo passo consigliato

Il template di run/output T1 L0 è stato preparato in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-run-template-v0-1.md`
- `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-template-v0-1.json`

Prossimo passo: creare il primo run file provider-specifico per Gemini, poi eseguire lo stesso schema su Mistral, Groq, Cerebras e OpenRouter.
