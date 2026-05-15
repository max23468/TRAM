# Copenhagen M1-M4 O&M - T1 L0 v0.3 hybrid resolver evaluation

Data: 2026-05-13
Stato: hybrid pass su Gemini e Mistral
Provider: Gemini, Mistral
Ambito: AI per natura/ruolo/incertezze, resolver deterministico per document family, version e currentness

## Scopo

Questa nota registra il rerun T1 L0 v0.3 in modalità hybrid dopo la specifica del resolver deterministico:

- AI responsabile di `package_phase`, `document_nature`, `document_role`, `confidence`, `review_required`, `uncertainties` e `source_refs`;
- resolver deterministico responsabile di `document_family_key`, `document_id_external`, `version`, `variant_type` e `currentness`;
- gateway locale responsabile dei campi audit v0.3, privacy e gate.

Il test usa solo metadati L0 minimizzati. Non invia corpo dei documenti, tabelle, importi, formule, dati personali o pacchetti completi.

## File principali

Specifica resolver:

`/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-document-family-version-currentness-resolver-v0-1.md`

Envelope hybrid:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-inputs/tram-cph-m1m4-t1-l0-input-envelope-v0-3-hybrid-r1.json`

Baseline hybrid:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-baselines/tram-cph-m1m4-t1-l0-baseline-v0-3-hybrid-r1.json`

Run Gemini r2:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-gemini-25-flash-lite-hybrid-r2-v0-3.json`

Evaluation Gemini r2:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-gemini-25-flash-lite-hybrid-r2-v0-3.json`

Run Mistral r2:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-mistral-medium-3-5-hybrid-r2-v0-3.json`

Evaluation Mistral r2:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-mistral-medium-3-5-hybrid-r2-v0-3.json`

## Lineage

| Iterazione | Esito | Nota |
| --- | --- | --- |
| Hybrid r1 Gemini | AI pass, resolver fail | AI classification 10/10, ma il resolver perdeva alcuni ID documento seguiti da underscore. |
| Hybrid r1 Mistral | AI pass, resolver fail | Stesso problema resolver, non provider. |
| Hybrid r2 Gemini | Pass | Nessuna nuova chiamata AI; merge locale sugli output AI r1 con resolver corretto. |
| Hybrid r2 Mistral | Pass | Nessuna nuova chiamata AI; merge locale sugli output AI r1 con resolver corretto. |

Correzione r2: il pattern ID documento non usa più solo `\b`, perché `_` è carattere di parola e rompe il confine regex. Il resolver ora riconosce correttamente casi come `CM-X-OMRT3-TD-0020_Instruction`.

## Esiti sintetici

| Provider/modello | AI classification | Resolver deterministico | Pipeline controls | Overall |
| --- | --- | --- | --- | --- |
| Gemini `gemini-2.5-flash-lite` | Pass | Pass | Pass | Pass |
| Mistral `mistral-medium-3.5` | Pass | Pass | Pass | Pass |

Metriche r1, cioè le chiamate AI reali:

| Provider/modello | Latenza | Input tokens | Output tokens | Totale token | Costo stimato |
| --- | ---: | ---: | ---: | ---: | --- |
| Gemini `gemini-2.5-flash-lite` | 15.459 ms | 8.501 | 2.571 | 11.072 | 0 |
| Mistral `mistral-medium-3.5` | 19.308 ms | 7.466 | 2.008 | 9.474 | 0 |

La run r2 è solo merge/evaluation locale, quindi non consuma nuove chiamate provider.

## Risultato su Copenhagen

| Dimensione | Gemini r2 | Mistral r2 |
| --- | --- | --- |
| Item restituiti | 10/10 | 10/10 |
| `package_phase` | 10/10 | 10/10 |
| `document_nature` | 10/10 | 10/10 |
| `document_role` | 10/10 | 10/10 |
| `document_family_key` | 10/10 | 10/10 |
| `version` | 10/10 | 10/10 |
| `variant_type` | 10/10 | 10/10 |
| `currentness` | 10/10 | 10/10 |
| Mismatch | 0 | 0 |

Esempi chiave:

| Sample | Versione | Variante | Currentness | Family key |
| --- | --- | --- | --- | --- |
| D1 | `v5` | `clean` | `current_candidate` | `CM-X-OMRT3-TD-0020|tender_instructions|instructions_to_tender` |
| D2 | `v5` | `track_changes` | `not_current_candidate` | `CM-X-OMRT3-TD-0020|tender_instructions|instructions_to_tender` |
| D3 | `v3` | `clean` | `current_candidate` | `CM-X-OMRT3-TD-0020|procurement_schedule|procurement_schedule` |
| D4 | `v2` | `clean` | `not_current_candidate` | `CM-X-OMRT3-TD-0020|procurement_schedule|procurement_schedule` |

## Decisione

La modalità hybrid diventa la direzione consigliata per T1 L0 nel MVP:

- AI esterna gratuita per classificazione semantica L0;
- resolver deterministico per famiglia, versione, variante e stato corrente;
- gateway locale per privacy/gate/audit;
- review queue per conflitti e casi non deterministici.

Questa modalità risolve il problema emerso nel rerun v0.3 precedente: l’AI può classificare bene il documento ma invertire lo stato corrente. Separare le responsabilità rende il risultato più stabile e più spiegabile.

## Implicazioni prodotto

Per la dashboard gara, TRAM deve mostrare:

- documento corrente come proposta rule-based, non come “verità AI”;
- motivo della scelta, per esempio clean copy vs track changes o versione numerica più alta;
- source refs e family key;
- stato review quando il resolver non può decidere.

Per la review queue, TRAM deve creare item quando:

- il resolver trova versioni conflittuali;
- una versione più alta è solo track changes/redline;
- AI e regole divergono su natura o ruolo;
- addendum o clarification possono modificare il contenuto senza sostituire il file.

## Limiti

Il test copre Copenhagen T1 L0, non tutto TRAM.

Restano da validare:

- naming convention Luas;
- revisioni alfabetiche o non numeriche;
- issue date come tie-breaker;
- addendum e clarification che superano previsioni senza sostituire file;
- versioning tratto da copertina o contenuto L1, non solo filename.

## Prossimo passo consigliato

Stato aggiornato: Luas è passato nel report `/Users/Matteo/Documents/TRAM/docs/analysis/tram-dublin-luas-om-t1-l0-v0-3-hybrid-resolver-evaluation.md`; T1 v0.4, T2 timeline v0.1 e T3 deliverable v0.1 sono stati completati nei report successivi. Usare questo documento come storico del resolver T1 v0.3.
