# TRAM V1 - Sintesi benchmark compatto sui quattro pacchetti v0.1

Data: 2026-05-13  
Stato: consolidato da benchmark esistenti, senza nuovo run AI in questo documento  
Ambito: Copenhagen M1-M4 O&M, Dublin Luas O&M, Milano lotti extraurbani O&M, Dublin MetroLink PPP

## Scopo

Questo documento consolida lo stato dei benchmark compatti TRAM V1 sui quattro pacchetti caricati.

Non sostituisce i report specifici T1-T8. Serve come vista unica per capire:

- cosa è già stato testato;
- quali task sono promossi;
- dove l’AI può aiutare;
- dove parser, regole e review devono restare dominanti;
- quali rischi restano prima dello sviluppo applicativo.

## Pacchetti coperti

| Package ID | Tipo | Dominio | Ruolo benchmark |
| --- | --- | --- | --- |
| `copenhagen-m1-m4-om` | ITT | Metro O&M | versioning, MPP, payment, contract specs, KPI, contradictions |
| `dublin-luas-om` | ITN | Light rail O&M | redline, schedules, data room, financial model, maintenance plans |
| `milano-lotti-extraurbani-om` | ITT | Bus extraurbano multi-lotto | disciplinare, lotti, PEF, offerta economica, GTFS, criteri |
| `dublin-metrolink-ppp` | Prequalifica/PQP | PPP metro | qualification envelope, standing, referenze O&M, fase pre-ITT |

La distinzione tra prequalifica, ITT e ITN è parte del benchmark: TRAM non deve trattare tutti i pacchetti come gare complete nello stesso modo.

## Copertura dataset per task

| Task | Item | Copenhagen | Dublin Luas | Milano | Dublin MetroLink | Stato |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| T1 document map | 21 | 5 | 5 | 7 | 4 | completato |
| T2 timeline | 19 | 5 | 4 | 5 | 5 | completato |
| T3 deliverable | 22 | 5 | 7 | 5 | 5 | completato |
| T4 requisiti/KPI | 20 | 8 | 4 | 4 | 4 | completato con Mistral |
| T5 financials/payment | 16 preparati | 5 | 3 | 5 | 3 | non eseguito su provider esterni per scelta |
| T6 cost driver | 17 | 5 | 5 | 3 | 4 | completato con Mistral |
| T7 contraddizioni | 20 | 9 | 3 | 4 | 4 | tentato, non promosso |
| T8 chiarimenti/Q&A | 19 bozze preparate, 18 L1/L0 testate | 7 | 3 | 4 | 5 | promosso solo subset human-first |

## Esito sintetico task

| Task | Esito | Decisione MVP |
| --- | --- | --- |
| T1 | Gemini + normalizzatore passa 21/21; Mistral non valutabile per capacity | baseline document map hybrid |
| T2 | Gemini passa come pipeline normalizzata; Mistral passa raw e pipeline su 19/19 | parser/regole per date, AI per normalizzazione |
| T3 | Gemini e Mistral passano raw e pipeline su 22/22 | parser/regole per requisiti formali, AI per normalizzazione |
| T4 | Mistral medium passa 20/20 su input L1 minimizzato | AI controllata ammessa dopo policy gate |
| T5 | 16 item preparati, nessun provider esterno | parser locale + review, no AI esterna default |
| T6 | Mistral medium passa 17/17 dopo normalizzazione link | AI controllata per classificazione, senza importi |
| T7 | Mistral small batched completa 20/20 ma fallisce qualitativamente | rules/review-first, AI non autonoma |
| T8 | Mistral small passa 18/18 subset L1/L0 dopo normalizzatore | supporto draft opzionale, sempre human-first |

## Provider e routing

| Provider | Stato consolidato |
| --- | --- |
| Gemini `gemini-2.5-flash-lite` | candidato principale T1 L0 e T2/T3 pipeline; rischio quota free su run multi-task |
| Mistral `mistral-medium-3.5` | candidato forte T2/T3/T4/T6; rischio capacity free tier osservato su T1/T7 |
| Mistral `mistral-small-2603` | utile su T8 subset L1/L0 e T7 batch completo ma non qualitativo |
| Cloudflare Workers AI | micro-task L0, non default su envelope completi |
| Groq | micro-task L0, non default su T1/T2/T3/T4-T8 |
| OpenRouter | sperimentale L0 con modello pinned |
| Cerebras | non promosso |

Decisione: il routing MVP resta provider-agnostic, ma non neutrale. Gemini e Mistral sono i candidati principali dove i benchmark li promuovono; T5 e T7 restano fuori dal default AI esterno.

## Evidenze principali

### T1

Artefatti:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t1-l0-v0-4-stage-aware-compact-benchmark-evaluation.md`
- `/Users/Matteo/Documents/TRAM/data/working/t1-l0-v0-4-stage-aware-compact/benchmark-evaluations/tram-t1-l0-stage-aware-compact-summary-v0-4-r2-normalized.json`

Risultato:

- output completo 21/21;
- stage-aware;
- nessun campo vietato;
- 5 normalizzazioni deterministiche;
- zero mismatch dopo normalizzatore.

### T2

Artefatti:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t2-timeline-compact-benchmark-evaluation.md`
- `/Users/Matteo/Documents/TRAM/data/working/t2-timeline-compact-v0-1/benchmark-evaluations/tram-t2-timeline-compact-summary-v0-1-r1.json`

Risultato:

- Gemini: pipeline pass, 2 mismatch raw conservativi su `review_required`;
- Mistral: raw e pipeline pass;
- nessun campo temporale vietato;
- tre contraddizioni candidate da review critica.

### T3

Artefatti:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t3-deliverables-compact-benchmark-evaluation.md`
- `/Users/Matteo/Documents/TRAM/data/working/t3-deliverables-compact-v0-1/benchmark-evaluations/tram-t3-deliverables-compact-summary-v0-1-r1.json`

Risultato:

- Gemini e Mistral passano 22/22;
- nessun campo requisiti vietato;
- 8 deliverable con review obbligatoria;
- deliverable economici/finanziari restano sensibili.

### T4-T8

Artefatti:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t4-t8-compact-provider-benchmark-evaluation.md`
- `/Users/Matteo/Documents/TRAM/data/working/t4-t8-compact-benchmark-summary-v0-1.json`

Risultato:

- T4 promosso con Mistral medium;
- T5 non eseguito su provider per scelta coerente con data policy;
- T6 promosso con Mistral medium;
- T7 non promosso come AI autonoma;
- T8 promosso solo come supporto draft subset L1/L0, human-first.

## Decisioni prodotto consolidate

1. TRAM V1 deve usare pipeline hybrid, non AI autonoma.
2. `T1`, `T2` e `T3` sono sufficientemente maturi per guidare il primo slice UI.
3. `T4` e `T6` possono entrare in V1 come AI controllata su input L1 minimizzati.
4. `T5` resta locale/review; nessun provider esterno default.
5. `T7` deve essere deterministico/review-first; AI solo eventuale supporto descrittivo.
6. `T8` può supportare la scrittura, ma non approva e non invia nulla.
7. La dashboard deve mostrare stati e blocker, non solo dati “puliti”.
8. Ogni benchmark deve restare collegato a `indicator_key`, review gate e data policy.

## Impatti sui punti 1-7 roadmap

| Punto | Stato dopo questo consolidamento |
| --- | --- |
| 1. Registro indicatori P0/P1 | definito in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-key-registry-p0-p1-v0-1.md` |
| 2. Priorità prima slice UI | definita in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-first-ui-slice-priority-v0-1.md` |
| 3. Permessi e ruoli MVP | definiti in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-roles-permissions-v0-1.md` |
| 4. Data policy per Tender | definita in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-tender-data-policy-v0-1.md` |
| 5. Workflow ingestion-dashboard | definito in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ingestion-to-dashboard-workflow-v0-1.md` |
| 6. Specifiche T2/T3 operative | definite in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-t2-t3-operational-spec-v0-1.md` |
| 7. Benchmark compatto quattro pacchetti | consolidato in questo documento |

## Rischi residui

- I benchmark sono compatti: non coprono ancora tutti i documenti dei pacchetti.
- Mistral ha mostrato rischio capacity sul tier gratuito.
- Gemini ha mostrato rischio quota gratuita su run T4-T8.
- T7 non è affidabile come task AI autonomo.
- T5 è volutamente non testato su provider esterni: serve parser locale robusto.
- I pacchetti reali possono contenere clausole che bloccano L1 esterno anche se il task è tecnicamente idoneo.
- Mancano ancora fixture applicative non riservate.

## Decisione finale del benchmark v0.1

La baseline TRAM V1 per sviluppo MVP è:

- T1/T2/T3 come nucleo iniziale UI e workflow;
- T4/T6 come estensione controllata dopo data policy;
- T5 local-only/review;
- T7 rules/review-first;
- T8 human-first e non esterno su L2;
- dashboard alimentata da `indicator_key` P0/P1;
- review queue come meccanismo centrale di affidabilità.

## Prossimo passo consigliato

Aggiornare i documenti governanti con i nuovi riferimenti e poi fare audit documentale: nomi Markdown univoci, accenti/apostrofi, link principali, assenza di segreti e copertura completa dei punti 1-7.
