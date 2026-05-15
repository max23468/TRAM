# Copenhagen M1-M4 O&M - Gemini e Mistral rerun T1 L0 v0.3

Data: 2026-05-13
Stato: rerun completato, nessun provider promosso come esecutore autonomo T1 L0 v0.3
Provider: Gemini, Mistral
Ambito: envelope con gate privacy/costo, minimizzazione e schema comune v0.3

## Scopo

Questa nota registra il rerun T1 L0 v0.3 su Copenhagen M1-M4 O&M dopo l’introduzione di:

- `provider_context`;
- `privacy_context`;
- `gate_context`;
- `minimization_context`;
- output comune con `response_status`, `privacy_assessment`, `gate_decision_echo` e `task_output`;
- vincolo L0 con soli metadati documentali minimizzati.

Il test non invia corpo dei documenti, tabelle, importi, formule, dati personali o pacchetti completi.

## File principali

Prompt/schema pack:

`/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-3.md`

Envelope r3:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-inputs/tram-cph-m1m4-t1-l0-input-envelope-v0-3-r3.json`

Baseline r3:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-baselines/tram-cph-m1m4-t1-l0-baseline-v0-3-r3.json`

Run Gemini r3:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-gemini-25-flash-lite-r3-v0-3.json`

Evaluation Gemini r3:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-gemini-25-flash-lite-r3-v0-3.json`

Run Mistral r2:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-mistral-medium-3-5-r2-v0-3.json`

Evaluation Mistral r2:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-mistral-medium-3-5-r2-v0-3.json`

Run Mistral r3 retry:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-runs/tram-cph-m1m4-t1-l0-run-mistral-medium-3-5-r3-retry1-v0-3.json`

Evaluation Mistral r3 retry:

`/Users/Matteo/Documents/TRAM/data/working/copenhagen-m1-m4-om/benchmark-evaluations/tram-cph-m1m4-t1-l0-eval-mistral-medium-3-5-r3-retry1-v0-3.json`

## Lineage delle iterazioni

| Iterazione | Esito | Nota |
| --- | --- | --- |
| v0.3 r1 | Non usata per decisione provider | L’envelope iniziale aveva uno shape `version_label/currentness_assessment` non allineato al pack v0.3 ufficiale. È un artifact di lavoro, non una baseline decisionale. |
| v0.3 r2 Gemini | Fail operativo | `503 UNAVAILABLE` per alta domanda del modello. Nessun fallback paid. |
| v0.3 r2 Mistral | Fail semantico leggero | Schema/gate pass, 10 item, ma D3 currentness e D5 document_nature non allineati alla baseline. |
| v0.3 r3 Gemini | Fail semantico | Schema/gate pass, 10 item, classificazione documento corretta, ma currentness invertita sulle coppie D1/D2 e D3/D4. |
| v0.3 r3 Mistral | Fail operativo | `429 service_tier_capacity_exceeded` sul tier gratuito. |
| v0.3 r3 Mistral retry | Fail semantico/gate echo | 10 item, D5 corretto, ma D3 currentness ancora errata e `privacy_assessment` non rispetta pienamente lo shape richiesto. |

## Esiti sintetici

| Provider/modello | Run migliore v0.3 | JSON/gate | Item | Classificazione natura/ruolo | Currentness valutabile | Esito |
| --- | --- | --- | --- | --- | --- | --- |
| Gemini `gemini-2.5-flash-lite` | r3 | Pass | 10/10 | 10/10 | 0/4 | Fail baseline-aware |
| Mistral `mistral-medium-3.5` | r2 | Pass | 10/10 | 9/10 | 3/4 | Fail baseline-aware |
| Mistral `mistral-medium-3.5` | r3 retry | Partial pass | 10/10 | 10/10 | 3/4 | Fail baseline-aware |

## Dettaglio Gemini r3

| Dimensione | Esito |
| --- | --- |
| Formato JSON | Pass |
| `response_status` | Pass |
| Privacy L0 echo | Pass |
| Gate `allowed_minimized` | Pass |
| Item restituiti | 10/10 |
| `package_phase` | 10/10 |
| `document_nature` | 10/10 |
| `document_role` | 10/10 |
| Versione | 10/10 |
| Currentness valutabile | 0/4 |
| Baseline-aware | Fail |
| Latenza | 14.582 ms |

Errori:

- D1/D2: ha invertito clean copy e track changes;
- D3/D4: ha invertito Procurement Schedule v3 e v2.

L’errore è concentrato su una logica comparativa che TRAM può risolvere meglio con regole deterministiche su filename, document family e version number.

## Dettaglio Mistral

### r2

| Dimensione | Esito |
| --- | --- |
| Formato JSON | Pass |
| `response_status` | Pass |
| Privacy L0 echo | Pass |
| Gate `allowed_minimized` | Pass |
| Item restituiti | 10/10 |
| Baseline-aware | Fail |
| Latenza | 19.416 ms |

Errori:

- D3: Procurement Schedule v3 marcato `not_current_candidate`;
- D5: Form of Tender classificato come `tender_instructions` invece di `submission_template`.

### r3 retry

| Dimensione | Esito |
| --- | --- |
| Formato JSON | Pass |
| `response_status` | Pass |
| Privacy L0 echo | Fail parziale |
| Gate `allowed_minimized` | Pass |
| Item restituiti | 10/10 |
| Baseline-aware | Fail |
| Latenza | 27.709 ms |

Il chiarimento tassonomico ha corretto D5, ma D3 resta errato. Inoltre l’output usa uno shape privacy compatto e non conforme al common schema v0.3.

## Decisione

Il rerun v0.3 non promuove né Gemini né Mistral come esecutori autonomi dell’intero T1 L0.

La decisione di prodotto è più utile del semplice ranking provider:

- AI esterna gratuita resta utile per `document_nature`, `document_role`, classificazione semantica e spiegazione con fonte;
- `version` e soprattutto `currentness` non devono dipendere solo dall’AI;
- TRAM V1 deve introdurre un resolver deterministico per versioni, clean copy, track changes e candidati correnti;
- l’AI può commentare anomalie e casi ambigui, ma il dato consolidato `currentness` deve arrivare da regole e review queue quando possibile;
- il free tier introduce rischi operativi reali: Gemini può rispondere `503` e Mistral può rispondere `429 service_tier_capacity_exceeded`.

## Implicazioni per il data model

T1 va separato in almeno tre responsabilità:

1. classificazione AI-assisted del documento;
2. estrazione deterministica di ID documento, versione, estensione, famiglia e varianti;
3. risoluzione deterministica o human-in-the-loop dello stato corrente.

Un possibile schema operativo:

- `document_nature_ai_suggestion`;
- `document_role_ai_suggestion`;
- `version_rule_extraction`;
- `document_family_rule_key`;
- `currentness_rule_candidate`;
- `currentness_ai_comment`;
- `currentness_review_status`.

Questo mantiene TRAM coerente con il principio “AI sensata e non eccessiva”.

## Stato provider dopo v0.3

La promozione v0.2 resta valida solo per il task T1 L0 senza gate wrapper completo.

Dopo v0.3:

- Gemini resta candidato principale per classificazione L0, ma non per currentness autonoma;
- Mistral resta candidato secondario forte, ma il tier gratuito mostra limiti di capacity e va usato con retry/backoff e job sospendibili;
- nessun provider va promosso a L1/L2 sulla base di questo test;
- nessun fallback paid è stato usato.

## Prossimo passo consigliato

Definire la specifica del resolver deterministico `document_family/version/currentness`, poi rieseguire T1 L0 v0.3 con:

- AI responsabile di natura/ruolo/uncertainties;
- regole responsabili di versioni e currentness;
- review queue per conflitti e casi non risolti.

Stato aggiornato: questo passo è stato completato nel report `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-t1-l0-v0-3-hybrid-resolver-evaluation.md`. Il prossimo passo è applicare T1 L0 v0.3 hybrid a Luas.
