# Copenhagen M1-M4 O&M - Valutazione baseline-aware T1 L0 v0.1

Data: 2026-05-13
Stato: baseline T1 esplicitata e prima valutazione Gemini completata
Task: `T1 - Classificazione documentale`

## Scopo

Questa nota introduce il controllo baseline-aware per T1.

Il controllo precedente verificava soprattutto formato, JSON, numero di item, fonti, versioni e boundary privacy. Era utile, ma insufficiente: poteva promuovere una risposta tecnicamente pulita anche se semanticamente parziale.

Da ora T1 distingue:

- pass tecnico;
- accuratezza `document_role`;
- accuratezza `procurement_stage`;
- accuratezza versione;
- currentness solo dove è valutabile da L0;
- rispetto del boundary su D10 payment.

## File creati

Baseline:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-baselines/tram-cph-m1m4-t1-l0-baseline-v0-1.json`

Valutazione Gemini:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-gemini-25-json-mode-v0-1.json`

Run valutata:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-gemini-25-flash-lite-json-mode-v0-1.json`

## Mapping baseline

La baseline normalizza il dataset T1 nello schema `schema_v0_1`.

Decisioni principali:

- `Tender` e `Submission` vengono normalizzati a `itt`, perché lo schema T1 non ha un enum `submission`;
- D7-D10 devono essere `contract`, anche se sono nel pacchetto ITT;
- `currentness` viene valutata solo per D1-D4, dove il sottoinsieme contiene confronti espliciti di versione o track changes;
- D10 deve restare classificazione documentale, senza sintesi payment.

## Esito Gemini 2.5 Flash-Lite JSON mode

| Dimensione | Esito |
| --- | --- |
| Formato JSON | Pass |
| Item restituiti | 10/10 |
| Document role | 10/10 |
| Procurement stage | 6/10 |
| Versione | 10/10 |
| Currentness valutabile | 0/4 |
| Boundary D10 payment | Pass |
| Esito baseline-aware | Partial fail |

## Findings

1. Il modello riconosce bene il ruolo documento.
2. Il modello confonde la fase del pacchetto con la natura del documento: D7-D10 sono contrattuali, ma vengono classificati `itt`.
3. Il modello non risolve `is_current_candidate` nei quattro casi in cui il dato era valutabile da L0.
4. La modalità JSON mode è tecnicamente valida, ma non equivale a structured output strict.

## Implicazioni per TRAM

Gemini resta candidato, ma non ancora promosso.

Il risultato suggerisce una modifica al modello dati o al prompt:

- separare `package_phase` da `document_nature`;
- oppure chiarire nel prompt T1 che `procurement_stage` indica la natura/fase applicativa del documento, non la cartella o il pacchetto in cui compare;
- valutare uno schema T1 più semplice per provider schema strict e una validazione più ricca lato TRAM.

## Prossimo passo consigliato

Il prompt/schema T1 v0.2 è stato preparato e Gemini `gemini-2.5-flash-lite` ha superato la valutazione baseline-aware con provider schema.

Prossimo passo: usare T1 L0 v0.2 come baseline per Mistral, Groq, Cerebras e OpenRouter.
