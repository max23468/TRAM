# Dublin Luas O&M - T1 L0 v0.3 hybrid resolver evaluation

Data: 2026-05-13
Stato: hybrid pass su Gemini e Mistral
Provider: Gemini, Mistral
Ambito: AI per natura/ruolo/incertezze, resolver deterministico per document family, version e currentness

## Scopo

Questa nota registra l’applicazione di T1 L0 v0.3 hybrid al pacchetto Dublin Luas O&M, dopo il pass Copenhagen.

Il test verifica se il resolver `document_family/version/currentness` generalizza su una naming convention diversa:

- revisioni `Rev n`;
- redline indicati come `_Redline`, `_RedLine` o `Redline`;
- codice `TII400` condiviso da molti documenti;
- cartelle ITN, contract, schedules, pricing, financial model, data room, timetables e maintenance maps.

Il test usa solo metadati L0 minimizzati. Non invia corpo dei documenti, tabelle, importi, formule, dati personali o pacchetti completi.

## File principali

Specifica resolver:

`/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-document-family-version-currentness-resolver-v0-1.md`

Envelope Luas hybrid:

`/Users/Matteo/Documents/TRAM/data/working/dublin-luas-om/benchmark-inputs/tram-dublin-luas-om-t1-l0-input-envelope-v0-3-hybrid-r1.json`

Baseline Luas hybrid:

`/Users/Matteo/Documents/TRAM/data/working/dublin-luas-om/benchmark-baselines/tram-dublin-luas-om-t1-l0-baseline-v0-3-hybrid-r1.json`

Run Gemini r3:

`/Users/Matteo/Documents/TRAM/data/working/dublin-luas-om/benchmark-runs/tram-dublin-luas-om-t1-l0-run-gemini-25-flash-lite-hybrid-r3-v0-3.json`

Evaluation Gemini r3:

`/Users/Matteo/Documents/TRAM/data/working/dublin-luas-om/benchmark-evaluations/tram-dublin-luas-om-t1-l0-eval-gemini-25-flash-lite-hybrid-r3-v0-3.json`

Run Mistral r3:

`/Users/Matteo/Documents/TRAM/data/working/dublin-luas-om/benchmark-runs/tram-dublin-luas-om-t1-l0-run-mistral-medium-3-5-hybrid-r3-v0-3.json`

Evaluation Mistral r3:

`/Users/Matteo/Documents/TRAM/data/working/dublin-luas-om/benchmark-evaluations/tram-dublin-luas-om-t1-l0-eval-mistral-medium-3-5-hybrid-r3-v0-3.json`

## Campione

Il campione contiene 19 item L0:

- financial model instructions e redline;
- financial model template;
- ITN clean/redline;
- contract Rev 4 redline e Rev 5 clean;
- schedules Part 1 clean/redline;
- schedules Part 3 Rev 7 redline e Rev 8 clean;
- data room agreement e VDR access details;
- timetable annex e timetable Excel;
- maintenance boundary maps;
- pricing instructions clean/redline;
- pricing workbook.

## Lineage

| Iterazione | Esito | Nota |
| --- | --- | --- |
| Hybrid r1 Gemini | AI pass, resolver fail | AI classification 19/19, ma il resolver non riconosceva `Rev n` prima di underscore nei redline. |
| Hybrid r1 Mistral | AI pass, resolver fail | Stesso limite resolver, non provider. |
| Hybrid r2 | Resolver ancora partial fail | La baseline e il resolver avevano ancora due problemi: `Rev n` nella family key e ordine `contract` prima di `schedule`. |
| Hybrid r3 Gemini | Pass | Nessuna nuova chiamata AI; merge locale sugli output AI r1 con resolver corretto. |
| Hybrid r3 Mistral | Pass | Nessuna nuova chiamata AI; merge locale sugli output AI r1 con resolver corretto. |

Correzioni emerse da Luas:

- `Rev 1_Redline` e `Rev 5_RedLine` devono essere letti come versioni esplicite;
- `Rev n` va rimosso dalla title/family key anche quando seguito da underscore;
- `TII400` è project-level e non può essere l’unico ID della family;
- nei redline degli schedules, controllare `schedule` prima di `contract`, perché i filename contengono entrambe le parole.

## Esiti sintetici

| Provider/modello | AI classification | Resolver deterministico | Pipeline controls | Overall |
| --- | --- | --- | --- | --- |
| Gemini `gemini-2.5-flash-lite` | Pass | Pass | Pass | Pass |
| Mistral `mistral-medium-3.5` | Pass | Pass | Pass | Pass |

Metriche r1, cioè le chiamate AI reali:

| Provider/modello | Latenza | Input tokens | Output tokens | Totale token | Costo stimato |
| --- | ---: | ---: | ---: | ---: | --- |
| Gemini `gemini-2.5-flash-lite` | 22.956 ms | 11.811 | 4.360 | 16.171 | 0 |
| Mistral `mistral-medium-3.5` | 23.848 ms | 10.326 | 3.154 | 13.480 | 0 |

La run r3 è solo merge/evaluation locale, quindi non consuma nuove chiamate provider.

## Risultato

| Dimensione | Gemini r3 | Mistral r3 |
| --- | --- | --- |
| Item restituiti | 19/19 | 19/19 |
| `package_phase` | 19/19 | 19/19 |
| `document_nature` | 19/19 | 19/19 |
| `document_role` | 19/19 | 19/19 |
| `document_family_key` | 19/19 | 19/19 |
| `version` | 19/19 | 19/19 |
| `variant_type` | 19/19 | 19/19 |
| `currentness` | 19/19 | 19/19 |
| Mismatch | 0 | 0 |

Esempi chiave:

| Sample | Versione | Variante | Currentness | Family key |
| --- | --- | --- | --- | --- |
| L1 | `Rev 1` | `clean` | `current_candidate` | `no-id|pricing_workbook|schedule_of_prices|sustainable financial operating model instructions` |
| L2 | `Rev 1` | `redline` | `not_current_candidate` | `no-id|pricing_workbook|schedule_of_prices|sustainable financial operating model instructions` |
| L4 | `Rev 8` | `clean` | `current_candidate` | `TII400|tender_instructions|instructions_to_tender|contract volume 1 invitation to negotiate` |
| L5 | `Rev 8` | `redline` | `not_current_candidate` | `TII400|tender_instructions|instructions_to_tender|contract volume 1 invitation to negotiate` |
| L6 | `Rev 4` | `redline` | `not_current_candidate` | `TII400|contract_conditions|conditions_of_contract|contract volume 2 contract` |
| L7 | `Rev 5` | `clean` | `current_candidate` | `TII400|contract_conditions|conditions_of_contract|contract volume 2 contract` |
| L8 | `Rev 9` | `clean` | `current_candidate` | `TII400|contract_specification|contract_specifications|contract volume 3 part 1 schedules 1 to 16` |
| L9 | `Rev 9` | `redline` | `not_current_candidate` | `TII400|contract_specification|contract_specifications|contract volume 3 part 1 schedules 1 to 16` |

## Decisione

T1 L0 v0.3 hybrid passa sia su Copenhagen sia su Luas.

La modalità hybrid può diventare baseline del document map MVP:

- AI per classificazione semantica L0;
- resolver deterministico per famiglia, versione, variante e stato corrente;
- gateway locale per privacy/gate/audit;
- review queue per casi non deterministici.

Questa decisione non autorizza ancora L1/L2 o contenuto documentale verso provider esterni. Vale solo per metadati L0.

## Implicazioni

Per TRAM V1:

- `currentness` va mostrato come proposta rule-based con motivo e fonte;
- redline e track changes non devono essere trattati come documenti correnti se esiste clean copy equivalente;
- codici project-level come `TII400` non bastano per raggruppare documenti;
- naming convention diverse devono essere gestite come regole del resolver, non come prompt più lunghi.

## Limiti

Il test copre un campione rappresentativo, non tutti i 99 file del pacchetto Luas.

Restano da validare:

- full-package L0 su tutti i file Luas;
- duplicate DOCX/PDF della stessa fonte;
- map sheet series complete;
- issue date e dati da copertina;
- addendum o clarification che superano contenuti senza sostituire file;
- relationship tra schedules, annexes e timetables.

## Prossimo passo consigliato

Stato aggiornato: T1 v0.4, T2 timeline v0.1 e T3 deliverable v0.1 sono stati completati nei report successivi. Usare questo documento come storico del resolver T1 v0.3 su Dublin Luas.
