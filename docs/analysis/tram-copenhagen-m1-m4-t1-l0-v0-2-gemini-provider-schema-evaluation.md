# Copenhagen M1-M4 O&M - Gemini provider schema evaluation T1 L0 v0.2

Data: 2026-05-13
Stato: run completata e baseline-aware pass
Provider: Gemini
Modello: `gemini-2.5-flash-lite`
Modalità: provider schema

## Scopo

Questa nota registra l’esito della correzione T1 v0.2 dopo i problemi del pack v0.1:

- `procurement_stage` ambiguo;
- schema T1 v0.1 troppo complesso per alcune modalità provider;
- mancanza di controllo baseline-aware pieno;
- currentness non risolta.

La patch v0.2 separa:

- `package_phase`;
- `document_nature`;
- `document_role`;
- `currentness`.

## File principali

Prompt/schema:

`/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-2.md`

Envelope:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-inputs/tram-cph-m1m4-t1-l0-input-envelope-v0-2.json`

Baseline:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-baselines/tram-cph-m1m4-t1-l0-baseline-v0-2.json`

Run:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-gemini-25-provider-schema-r3-v0-2.json`

Evaluation:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-gemini-25-provider-schema-r3-v0-2.json`

## Iterazioni

| Run | Esito | Nota |
| --- | --- | --- |
| `gemini-3.1-flash-lite` v0.1 | Fail | `503 UNAVAILABLE` ripetuto |
| `gemini-2.5-flash-lite` v0.1 provider schema | Fail | schema troppo complesso |
| `gemini-2.5-flash-lite` v0.1 JSON mode | Pass tecnico, partial fail semantico | D7-D10 classificati male su stage |
| `gemini-2.5-flash-lite` v0.2 provider schema r1 | Partial fail | currentness non risolta |
| `gemini-2.5-flash-lite` v0.2 provider schema r2 | Partial fail | D2 role non corretto |
| `gemini-2.5-flash-lite` v0.2 provider schema r3 | Pass | baseline-aware pass |

## Esito r3

| Dimensione | Esito |
| --- | --- |
| Formato JSON | Pass |
| Provider schema | Pass |
| Item restituiti | 10/10 |
| `package_phase` | 10/10 |
| `document_nature` | 10/10 |
| `document_role` | 10/10 |
| Versione | 10/10 |
| Currentness valutabile | 4/4 |
| Boundary D10 payment | Pass |
| Baseline-aware | Pass |
| Latenza | 8.856 ms |
| Input tokens | 5.273 |
| Output tokens | 3.059 |
| Costo stimato | 0 |

## Decisione

Gemini `gemini-2.5-flash-lite` resta candidato forte per T1 L0.

Non va ancora promosso a L1/L2 perché:

- la policy dati va verificata sullo specifico account/billing;
- il test è solo T1 L0;
- mancano confronto con Cloudflare Workers AI e OpenRouter;
- manca ancora una review umana finale sul contenuto, anche se la baseline automatica è pass.

## Implicazioni per TRAM

La separazione `package_phase` / `document_nature` è corretta e va portata nel data model applicativo.

Per V1, `procurement_stage` non deve restare un campo ambiguo unico. Va sostituito o affiancato da:

- fase del pacchetto/document set;
- natura del documento;
- stato corrente/versioning;
- fase contrattuale o gara a cui il documento si riferisce.

## Prossimo passo consigliato

Eseguire T1 L0 v0.2 sugli altri provider quando sono disponibili le credenziali gratuite, usando la stessa baseline e lo stesso envelope.
