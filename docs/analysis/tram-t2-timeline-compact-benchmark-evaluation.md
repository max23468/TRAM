# TRAM V1 - Benchmark compatto T2 timeline v0.1

Data: 2026-05-13
Stato: completato
Ambito: Copenhagen M1-M4 O&M, Dublin Luas O&M, Milano lotti extraurbani O&M, Dublin MetroLink PPP

## Scopo

Questo benchmark verifica il prompt/schema pack T2 timeline v0.1.

L’obiettivo non è far estrarre le date all’AI. L’obiettivo è verificare se, su eventi già individuati da parser e regole, l’AI sa normalizzare il nome evento, classificare tipo timeline e tipo evento, produrre incertezze utili e non alterare i valori temporali deterministici.

## Perimetro dati

Il benchmark usa input L1 minimizzato:

- righe MPP già convertite in TSV;
- estratti testuali brevi da PDF convertiti con `pdftotext`;
- snippets minimi di tabelle timeline;
- source refs locali;
- valori temporali già calcolati da parser/regole.

Non sono stati inviati:

- pacchetti completi;
- PDF completi;
- workbook completi;
- ZIP o GTFS completi;
- pricing values;
- payment formulas;
- dati personali;
- clausole complete.

## Dataset compatto

Il dataset contiene 19 eventi:

| Pacchetto | Eventi | Focus |
| --- | ---: | --- |
| Copenhagen M1-M4 O&M | 5 | procurement schedule, standstill, mobilitazione, divergenze MPP/PDF |
| Dublin Luas O&M | 4 | ITN timetable, chiarimenti, award/commencement, durata contratto |
| Milano lotti extraurbani O&M | 5 | scadenza offerta, chiarimenti, avvio servizio, avvio anticipato, durata concessione |
| Dublin MetroLink PPP | 5 | prequalifica/PQQ, tender dialogue, financial close |

Artefatti principali:

- input: `/Users/Matteo/Documents/TRAM/data/working/t2-timeline-compact-v0-1/benchmark-inputs/tram-t2-timeline-compact-input-envelope-v0-1-r1.json`;
- baseline: `/Users/Matteo/Documents/TRAM/data/working/t2-timeline-compact-v0-1/benchmark-baselines/tram-t2-timeline-compact-baseline-v0-1-r1.json`;
- summary: `/Users/Matteo/Documents/TRAM/data/working/t2-timeline-compact-v0-1/benchmark-evaluations/tram-t2-timeline-compact-summary-v0-1-r1.json`.

## Contraddizioni candidate

Il dataset include tre casi da review critica:

| Event ID | Pacchetto | Motivo |
| --- | --- | --- |
| `CPH-T2-002` | Copenhagen | MPP: `2026-05-15`; PDF schedule: `2026-05-13` per `Opening of revised tenders` |
| `CPH-T2-003` | Copenhagen | MPP: `2026-07-15`; PDF schedule: `2026-07-22` per `Opening of second revised tenders` |
| `MIL-T2-001` | Milano | il termine chiarimenti è indicato come `30 settembre 2026`, ma la stessa fonte dice che i quesiti vanno inoltrati almeno trenta giorni prima della scadenza offerte, che è anch’essa `30 settembre 2026` |

Decisione: questi casi non vanno consolidati automaticamente. Devono entrare in review queue con fonte, alternative e query draft futura.

## Provider testati

| Provider | Modello | Esito raw | Esito pipeline normalizzata |
| --- | --- | --- | --- |
| Gemini | `gemini-2.5-flash-lite` | Fail leggero: 2 mismatch su `review_required` | Pass |
| Mistral | `mistral-medium-3.5` | Pass | Pass |

Entrambi i provider hanno rispettato il vincolo principale: nessun campo temporale vietato è stato restituito.

## Esito Gemini

Run:

- `/Users/Matteo/Documents/TRAM/data/working/t2-timeline-compact-v0-1/benchmark-runs/tram-t2-timeline-compact-run-gemini-25-flash-lite-v0-1-r1.json`;
- `/Users/Matteo/Documents/TRAM/data/working/t2-timeline-compact-v0-1/benchmark-runs/tram-t2-timeline-compact-output-gemini-25-flash-lite-v0-1-r1.json`;
- `/Users/Matteo/Documents/TRAM/data/working/t2-timeline-compact-v0-1/benchmark-evaluations/tram-t2-timeline-compact-eval-gemini-25-flash-lite-v0-1-r1.json`.

Metriche:

| Metrica | Esito |
| --- | --- |
| `format_pass` | true |
| `items_returned` | 19/19 |
| `enum_pass` | true |
| `no_forbidden_date_fields_pass` | true |
| `contradiction_review_pass` | true |
| `ai_classification_pass` | false |
| `pipeline_normalized_pass` | true |

Mismatch raw:

| Event ID | Campo | Atteso | Restituito |
| --- | --- | --- | --- |
| `LUAS-T2-004` | `review_required` | false | true |
| `MIL-T2-005` | `review_required` | false | true |

L’errore non è pericoloso: Gemini è stato più conservativo sulle durate relative. La pipeline deterministica può riportare questi eventi allo stato previsto oppure mantenerli in review se il prodotto preferisce una postura più prudente.

## Esito Mistral

Run:

- `/Users/Matteo/Documents/TRAM/data/working/t2-timeline-compact-v0-1/benchmark-runs/tram-t2-timeline-compact-run-mistral-medium-3-5-v0-1-r1.json`;
- `/Users/Matteo/Documents/TRAM/data/working/t2-timeline-compact-v0-1/benchmark-runs/tram-t2-timeline-compact-output-mistral-medium-3-5-v0-1-r1.json`;
- `/Users/Matteo/Documents/TRAM/data/working/t2-timeline-compact-v0-1/benchmark-evaluations/tram-t2-timeline-compact-eval-mistral-medium-3-5-v0-1-r1.json`.

Metriche:

| Metrica | Esito |
| --- | --- |
| `format_pass` | true |
| `items_returned` | 19/19 |
| `enum_pass` | true |
| `no_forbidden_date_fields_pass` | true |
| `contradiction_review_pass` | true |
| `ai_classification_pass` | true |
| `pipeline_normalized_pass` | true |

Mistral ha prodotto incertezze più utili sui tre casi critici, esplicitando le date divergenti Copenhagen e la criticità Milano.

## Decisione T2

T2 timeline v0.1 è promosso come pipeline hybrid MVP con questa responsabilità:

1. parser e regole leggono date, orari, periodi, quarter, durate e timezone;
2. regole deterministiche classificano conflitti e stato review;
3. AI normalizza nome evento e produce incertezze leggibili;
4. normalizzatore post-AI rimuove eventuali campi vietati e applica la tassonomia canonica;
5. review queue gestisce contraddizioni, quarter e milestone critiche.

Per T2, l’AI non deve essere valutata sulla “data corretta”. Deve essere valutata su:

- formato;
- completezza eventi;
- assenza di campi vietati;
- classificazione semantica;
- qualità delle incertezze;
- rispetto delle review critiche.

## Implicazioni prodotto

La dashboard timeline V1 dovrebbe distinguere almeno:

- deadline gara;
- periodi di preparazione;
- standstill;
- award/commencement;
- mobilitazione;
- avvio servizio;
- durata contratto;
- eventi quarter-only;
- contraddizioni candidate;
- eventi condizionati o relativi.

La UI non deve mostrare una sola data quando esiste un conflitto fonte. Deve mostrare alternative, fonte, impatto e stato review.

## Debiti

- Decidere se le durate relative senza data esatta devono andare sempre in review o solo se sono contrattualmente critiche.
- Estendere il parser MPP per rilevare differenze tra file sorgente e PDF/rendering esportato.
- Aggiungere una regola calendar-aware per casi come “almeno trenta giorni prima” rispetto a una scadenza assoluta.
- Definire la vista review per contraddizioni timeline e query draft verso stazione appaltante.
- Ripetere T2 su un dataset più ampio dopo T3 deliverable, non prima.

## Prossimo passo consigliato

Stato aggiornato: T3 deliverable v0.1, il registro `indicator_key` P0/P1 e la specifica operativa T2/T3 sono stati completati.

Usare i casi timeline critici come fixture dashboard/review, mantenendo parser e regole responsabili dei valori temporali.
