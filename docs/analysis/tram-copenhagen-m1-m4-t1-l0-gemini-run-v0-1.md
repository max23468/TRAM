# Copenhagen M1-M4 O&M - Gemini run T1 L0 v0.1

Data: 2026-05-13
Stato: run eseguita con SDK; fallita per errore temporaneo provider `503 UNAVAILABLE`
Provider: Gemini
Modello scelto: `gemini-3.1-flash-lite`

## Scopo

Questo documento registra il primo run provider-specifico per lo smoke test TRAM T1 L0 su Gemini.

La run usa solo l’envelope L0 Copenhagen:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-inputs/tram-cph-m1m4-t1-l0-input-envelope-v0-1.json`

Non invia testo integrale, chunk L1/L2, payment mechanism, dati personali o risposte attese.

## File run

Run JSON:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-gemini-v0-1.json`

Output attesi quando la run verrà eseguita:

- `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-output-gemini-raw-v0-1.json`

Nota aggiornata: il file parsed con quel nome non è presente nello storage corrente; i run successivi usano nomi provider/modello più espliciti.

## Decisione modello

Fonti ufficiali verificate il 2026-05-13:

- Gemini pricing: `https://ai.google.dev/gemini-api/docs/pricing`
- Gemini structured output: `https://ai.google.dev/gemini-api/docs/structured-output`
- Gemini models: `https://ai.google.dev/gemini-api/docs/models`
- Gemini terms: `https://ai.google.dev/gemini-api/terms`

Motivo della scelta:

- `gemini-3.1-flash-lite` risulta disponibile nel free tier;
- supporta structured output;
- è più adatto di un modello Pro per uno smoke test L0 a costo zero;
- il task T1 è classificazione da metadati, non ragionamento complesso.

## Privacy e costo

La run resta L0.

Nota privacy:

- la pagina pricing distingue free e paid anche per l’uso dei contenuti;
- i termini Gemini riportano una disciplina specifica per EEA/CH/UK;
- per TRAM questo è sufficiente per smoke test L0, ma non basta per promuovere Gemini a L1/L2 senza review dell’account e della policy effettiva.

Nota costo:

- il run file imposta costo stimato a `0`;
- search, grounding, URL context e file upload sono disabilitati;
- se il provider segnala costo maggiore di zero, la run va sospesa.

## Stato operativo

Controllo ambiente locale iniziale:

- `GEMINI_API_KEY`: assente;
- `GOOGLE_API_KEY`: assente;
- `GOOGLE_GENERATIVE_AI_API_KEY`: assente.

La key è stata poi salvata nel Portachiavi macOS:

- service: `com.tram.gemini.api-key`;
- account: `GEMINI_API_KEY`.

Tooling:

- installato `google-genai` nella `.venv`;
- non installata Gemini CLI, perché non serve al benchmark o al runtime TRAM V1.

Tentativi:

1. REST diretto: fallito con `400 INVALID_ARGUMENT` perché il campo REST usato, `responseFormat`, è stato respinto dal backend come non valido in `generation_config`. L’errore è stato conservato in:
   `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-output-gemini-rest-error-v0-1.json`
2. SDK `google-genai` su `gemini-3.1-flash-lite`: richiesta accettata a livello client, ma fallita con `503 UNAVAILABLE` per alta domanda temporanea del modello. Il retry sullo stesso modello ha restituito ancora `503`.
3. Variante `gemini-2.5-flash-lite` con schema provider: fallita con `400 INVALID_ARGUMENT`, perché lo schema T1 completo genera troppi stati per il serving.
4. Variante `gemini-2.5-flash-lite` in JSON mode: completata con 10 item restituiti e controlli automatici passati.

Il file run JSON principale resta relativo a `gemini-3.1-flash-lite` ed è stato aggiornato con stato `failed`.

La variante riuscita è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-gemini-25-json-mode-run-v0-1.md`
- `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-gemini-25-flash-lite-json-mode-v0-1.json`

## Prossimo passo consigliato

Aggiornare i controlli automatici T1 con verifica baseline-aware su `document_role` e `procurement_stage`, poi ripetere lo stesso smoke test su Mistral, Groq, Cerebras e OpenRouter.
