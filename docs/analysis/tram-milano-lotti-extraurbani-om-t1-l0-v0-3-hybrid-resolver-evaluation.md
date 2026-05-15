# Milano Lotti Extraurbani O&M - T1 L0 v0.3 hybrid resolver evaluation

Data: 2026-05-13
Stato: Gemini pass, Mistral non eseguito per capacity free tier
Provider: Gemini, Mistral
Ambito: AI per natura/ruolo/incertezze, resolver deterministico per document family, version e currentness

## Scopo

Questa nota registra l’applicazione di T1 L0 v0.3 hybrid al pacchetto Milano lotti extraurbani O&M.

Il test verifica se il modello hybrid generalizza su un ITT bus extraurbano multi-lotto, diverso dai benchmark rail/metro già analizzati.

Il test usa solo metadati L0 minimizzati. Non invia corpo dei documenti, tabelle, archivi GTFS, formule, firme digitali, importi, dati personali o pacchetti completi.

## File principali

Envelope Milano hybrid:

`/Users/Matteo/Documents/TRAM/data/working/milano-lotti-extraurbani-om/benchmark-inputs/tram-milano-lotti-extraurbani-om-t1-l0-input-envelope-v0-3-hybrid-r1.json`

Baseline Milano hybrid:

`/Users/Matteo/Documents/TRAM/data/working/milano-lotti-extraurbani-om/benchmark-baselines/tram-milano-lotti-extraurbani-om-t1-l0-baseline-v0-3-hybrid-r1.json`

Run Gemini r3:

`/Users/Matteo/Documents/TRAM/data/working/milano-lotti-extraurbani-om/benchmark-runs/tram-milano-lotti-extraurbani-om-t1-l0-run-gemini-25-flash-lite-hybrid-r3-v0-3.json`

Evaluation Gemini r3:

`/Users/Matteo/Documents/TRAM/data/working/milano-lotti-extraurbani-om/benchmark-evaluations/tram-milano-lotti-extraurbani-om-t1-l0-eval-gemini-25-flash-lite-hybrid-r3-v0-3.json`

Evaluation Mistral r2:

`/Users/Matteo/Documents/TRAM/data/working/milano-lotti-extraurbani-om/benchmark-evaluations/tram-milano-lotti-extraurbani-om-t1-l0-eval-mistral-medium-35-hybrid-r2-v0-3.json`

## Campione

Il campione contiene 26 item L0:

- disciplinare e disciplinare firmato `.p7m`;
- errata corrige firmata `.p7m`;
- schema di contratto;
- relazione di affidamento;
- schede di linea master e lotto;
- riepilogo linee e percorrenze;
- programma di esercizio;
- GTFS di progetto e GTFS stato di fatto;
- fermate master e lotto;
- qualità e penali;
- personale, mezzi, PEF, matrice rischi;
- offerta tecnica, modelli PdE, istruzioni compilazione modelli;
- offerta economica e modello economico;
- istanza di partecipazione;
- monitoraggio/PAD;
- comodato dispositivi controlleria.

## Esiti sintetici

| Provider/modello | Esito | Nota |
| --- | --- | --- |
| Gemini `gemini-2.5-flash-lite` | Pass | AI classification 26/26, resolver 26/26, 0 mismatch. |
| Mistral `mistral-medium-3.5` | Non eseguito | HTTP 429 `service_tier_capacity_exceeded` sul free tier. |

Metriche Gemini r3:

- item restituiti: 26/26;
- costo stimato: 0;
- metriche token non disponibili nel run record finale perché la risposta valida è stata processata localmente dopo un wrapper interrotto;
- nessun contenuto documentale, tabellare o archivio è stato inviato.

## Correzioni emerse

Il caso Milano mostra che lo schema v0.3 è ancora troppo centrato sui pacchetti rail/metro.

Per rendere il benchmark stage-aware e compatibile con v0.3:

- `All 02.1`, `All 12.5` e simili sono numeri di allegato, non versioni;
- `Lotto 1`, `Lotti 1+2` e combinazioni simili sono dimensioni di lotto, non versioni;
- `.p7m` è un wrapper di firma digitale e non deve cambiare da solo la family;
- `.zip` con GTFS è un dataset trasportistico strutturabile, ma v0.3 non ha ancora un `variant_type` dedicato;
- `.xlsm` PEF va trattato come workbook economico con attenzione a macro/formule, senza leggere formule in L0;
- ruoli come criteri di valutazione, PEF guidance, qualità/penali e personale di subentro richiedono enum più precisi in v0.4.

## Decisione

T1 L0 v0.3 hybrid passa su Milano con Gemini usando una baseline compatibile con gli enum attuali.

Questo non significa che la tassonomia sia completa. Significa che il flusso MVP può classificare il pacchetto a L0 senza leggere contenuti, ma deve registrare debito tassonomico per v0.4.

Mistral non è valutabile su questo pacchetto in questo run perché il provider ha rifiutato la chiamata per capacità del service tier gratuito. Non è un fail qualitativo del modello.

## Debiti v0.4

Da aggiungere alla tassonomia T1:

- `evaluation_criteria`;
- `financial_model_guidance`;
- `kpi_penalty_regime`;
- `staff_transfer`;
- `transport_dataset`;
- `signed_document_wrapper`;
- `lot_specific_attachment`.

## Prossimo passo consigliato

Usare Milano come benchmark principale per T2/T3 su rete bus, lotti, GTFS, PEF e modelli economici, ma prima estendere la tassonomia v0.4 per evitare mapping troppo generici.
