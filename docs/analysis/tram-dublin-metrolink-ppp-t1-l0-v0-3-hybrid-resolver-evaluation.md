# Dublin MetroLink PPP - T1 L0 v0.3 hybrid resolver evaluation

Data: 2026-05-13
Stato: Gemini pass, Mistral non eseguito per capacity free tier
Provider: Gemini, Mistral
Ambito: AI per natura/ruolo/incertezze, resolver deterministico per document family, version e currentness

## Scopo

Questa nota registra l’applicazione di T1 L0 v0.3 hybrid al pacchetto Dublin MetroLink PPP.

Il test verifica se il modello hybrid distingue una prequalifica PPP da un ITT/ITN e se evita di aspettarsi requisiti contrattuali O&M completi dove il pacchetto contiene soprattutto PQP, envelopes, form e dichiarazioni.

Il test usa solo metadati L0 minimizzati. Non invia corpo dei documenti, template compilabili, tabelle, dati personali, dati finanziari o pacchetti completi.

## File principali

Envelope MetroLink hybrid:

`/Users/Matteo/Documents/TRAM/data/working/dublin-metrolink-ppp/benchmark-inputs/tram-dublin-metrolink-ppp-t1-l0-input-envelope-v0-3-hybrid-r1.json`

Baseline MetroLink hybrid:

`/Users/Matteo/Documents/TRAM/data/working/dublin-metrolink-ppp/benchmark-baselines/tram-dublin-metrolink-ppp-t1-l0-baseline-v0-3-hybrid-r1.json`

Run Gemini r2:

`/Users/Matteo/Documents/TRAM/data/working/dublin-metrolink-ppp/benchmark-runs/tram-dublin-metrolink-ppp-t1-l0-run-gemini-25-flash-lite-hybrid-r2-v0-3.json`

Evaluation Gemini r2:

`/Users/Matteo/Documents/TRAM/data/working/dublin-metrolink-ppp/benchmark-evaluations/tram-dublin-metrolink-ppp-t1-l0-eval-gemini-25-flash-lite-hybrid-r2-v0-3.json`

Evaluation Mistral r1:

`/Users/Matteo/Documents/TRAM/data/working/dublin-metrolink-ppp/benchmark-evaluations/tram-dublin-metrolink-ppp-t1-l0-eval-mistral-medium-35-hybrid-r1-v0-3.json`

## Campione

Il campione contiene 16 item L0:

- PQP Part 1, Part 2 e Part 3;
- applicant details;
- members and key providers details;
- roles on project;
- project finance;
- financial standing letter;
- confidentiality letter;
- PQQ submission declaration;
- reference projects;
- safety management experience;
- O&M reference projects;
- maintenance asset management evidence;
- qualification and technical envelope workbook;
- qualification and technical response document.

## Esiti sintetici

| Provider/modello | Esito | Nota |
| --- | --- | --- |
| Gemini `gemini-2.5-flash-lite` | Pass | AI classification 16/16, resolver 16/16, 0 mismatch. |
| Mistral `mistral-medium-3.5` | Non eseguito | HTTP 429 `service_tier_capacity_exceeded` sul free tier. |

Metriche Gemini r2:

- latenza: 16.806 ms;
- input token: 11.401;
- output token: 3.792;
- totale token: 15.193;
- costo stimato: 0.

## Correzioni emerse

Il caso MetroLink mostra che v0.3 non ha categorie dedicate alla prequalifica.

Per mantenere il benchmark coerente:

- `prequalification_package` è lo stage corretto;
- i PQP Part sono mappati a `submission_template` / `form_of_tender` come categoria v0.3 più vicina, anche se in v0.4 servirà un ruolo più specifico;
- numeri come `01.`, `02.`, `1.15.2` e `2.6.5` sono prefissi di ordinamento o numbering del questionario, non versioni;
- `v1` nel workbook `Qualification + Technical Envelope_v1.xlsx` è invece una versione esplicita;
- `+` nel titolo è un separatore, non deve creare una family diversa;
- financial/economic standing, letters of undertaking, reference projects e O&M capability evidence non devono essere trattati come obblighi contrattuali O&M completi.

## Decisione

T1 L0 v0.3 hybrid passa su MetroLink con Gemini usando una baseline stage-aware.

Questo conferma che TRAM deve distinguere dashboard e indicatori per prequalifica rispetto a ITT/ITN: molti indicatori O&M contrattuali devono risultare non applicabili o preliminari, non mancanti.

Mistral non è valutabile su questo pacchetto in questo run perché il provider ha rifiutato la chiamata per capacità del service tier gratuito. Non è un fail qualitativo del modello.

## Debiti v0.4

Da aggiungere alla tassonomia T1:

- `selection_questionnaire`;
- `prequalification_questionnaire`;
- `qualification_envelope`;
- `technical_envelope`;
- `financial_standing_template`;
- `reference_project_template`;
- `capability_evidence_template`;
- `letter_of_undertaking`;
- `confidentiality_non_collusion_form`.

## Prossimo passo consigliato

Usare MetroLink come benchmark stage-aware per definire la dashboard di prequalifica: eligibility, envelopes, form richiesti, capability evidence e indicatori non applicabili rispetto a un ITT.
