# Copenhagen M1-M4 O&M - Gemini 2.5 Flash-Lite JSON mode run T1 L0 v0.1

Data: 2026-05-13
Stato: run eseguita
Provider: Gemini
Modello: `gemini-2.5-flash-lite`
Modalità: JSON mode, schema validato lato TRAM

## Scopo

Questa è una variante del benchmark T1 L0 creata dopo due blocchi sul modello Gemini principale:

- `gemini-3.1-flash-lite`: due risposte `503 UNAVAILABLE` per alta domanda temporanea;
- `gemini-2.5-flash-lite` con schema provider: risposta `400 INVALID_ARGUMENT` perché lo schema T1 completo genera troppi stati per il serving.

La variante usa quindi:

- stesso prompt T1;
- stesso envelope L0;
- stesso modello `gemini-2.5-flash-lite`;
- `response_mime_type = application/json`;
- nessuno schema imposto al provider;
- validazione struttura e controlli T1 lato TRAM.

## File run

Run JSON:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-gemini-25-flash-lite-json-mode-v0-1.json`

Output:

- raw: `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-output-gemini-25-flash-lite-json-mode-raw-v0-1.json`
- parsed: `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-output-gemini-25-flash-lite-json-mode-parsed-v0-1.json`

## Esito tecnico

| Campo | Valore |
| --- | --- |
| Stato run | `completed` |
| Latenza | 14.493 ms |
| Input tokens | 5.214 |
| Output tokens | 2.287 |
| Item attesi | 10 |
| Item restituiti | 10 |
| JSON parse | OK |
| Schema shape locale | OK |
| Controlli tecnici automatici | Passati |
| Controlli baseline-aware | Partial fail |
| Costo stimato | 0 |

## Esito automatico

Controlli passati:

- tutti i sample `D1-D10` restituiti;
- D1 e D2 non fusi;
- D3 e D4 non fusi;
- D10 classificato come `payment_attachment` senza sintesi payment;
- nessuna `issue_date` inventata;
- versioni coerenti con i filename;
- livello privacy `L0` rispettato.

## Osservazione critica preliminare

L’output passa i controlli tecnici, ma non passa la valutazione baseline-aware.

Nel parsed output, Gemini ha classificato anche D7-D10 come `itt`, mentre la baseline TRAM considera quei documenti come parte del blocco contrattuale o contract/specification:

- D7: `conditions_of_contract`;
- D8: `definitions_and_abbreviations`;
- D9: `contract_specifications`;
- D10: `payment_attachment`.

Questo non invalida il test tecnico, ma mostra che il benchmark deve distinguere:

- capacità di rispettare formato e boundary privacy;
- accuratezza semantica rispetto alla baseline TRAM.

La valutazione baseline-aware è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-baseline-aware-evaluation-v0-1.md`
- `/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-gemini-25-json-mode-v0-1.json`

## Implicazioni

- Gemini può produrre JSON valido e completo in modalità L0.
- Lo schema T1 completo è probabilmente troppo pesante per alcuni modelli Gemini quando imposto come provider schema.
- Il controllo automatico T1 include ora una verifica di accuratezza baseline-aware su `document_role`, `procurement_stage`, versione e currentness valutabile.
- La review umana resta necessaria prima di promuovere Gemini oltre lo smoke test.

## Prossimo passo consigliato

Aggiornare il prompt/schema T1 per distinguere `package_phase` e `document_nature`, poi ripetere Gemini o confrontare subito con Mistral, Groq, Cerebras e OpenRouter.
