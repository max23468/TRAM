# TRAM V1 - Protocollo benchmark AI gratuito

Data: 2026-05-13
Stato: protocollo operativo da usare prima di scegliere il provider AI default
Ambito: benchmark AI V1 su Copenhagen M1-M4 O&M, Dublin Luas O&M, Milano lotti extraurbani O&M e Dublin MetroLink PPP

## Scopo

Questo documento definisce come valutare i provider AI gratuiti o con budget pari a zero/minimo per TRAM V1.

Il benchmark serve a rispondere a quattro domande:

1. quale provider gratuito produce le estrazioni più utili e verificabili;
2. quali task possono essere AI-assisted già in V1;
3. quali task devono restare parser/rule-based o human-only;
4. quali vincoli di privacy, quota, costo e stabilità impediscono l’uso su documenti reali.

Il benchmark non serve a scegliere “il modello migliore in assoluto”. Serve a scegliere un routing pratico per TRAM.

## Principio guida

TRAM non invia pacchetti completi ai provider AI.

Il benchmark deve lavorare su:

- testo estratto da parser/OCR;
- tabelle o celle già lette da strumenti deterministici;
- chunks selezionati;
- riferimenti fonte;
- schemi JSON semplici e validabili.

Ogni output deve essere valutabile da un utente esperto guardando fonte, estratto, stato e confidenza.

## Non obiettivi

Il benchmark non include:

- caricamento integrale dei pacchetti benchmark dentro un provider AI;
- uso di provider a pagamento senza cap;
- invio automatico di domande o chiarimenti alla stazione appaltante;
- fine-tuning;
- training su documenti reali;
- uso di dati personali non minimizzati;
- confronto dell’offerta con la documentazione, che resta V2;
- best practice cross-gara, che resta V3.

## Provider candidati

| Provider | Ruolo nel benchmark | Punti da misurare | Vincolo prima di uso reale |
| --- | --- | --- | --- |
| Gemini API / AI Studio | Candidato principale per task complessi | qualità estrazione, long context, structured output, capacità di citare fonti | verificare setup EEA, billing/carta e budget pari a zero/minimo |
| Mistral AI Studio / API | Candidato europeo per task complessi e JSON | qualità estrazione, JSON mode/function calling, rate limit free, data center EU, OCR futuro | verificare opt-out training sul piano Experiment o usare solo L0 finché privacy non è chiusa |
| Groq | Candidato velocità e JSON strict su modelli supportati | velocità, structured output, costo zero, ZDR/Data Controls | abilitare o verificare Data Controls/ZDR prima di documenti confidenziali |
| Cloudflare Workers AI | Candidato fallback privacy e task leggeri | free allocation, data usage, JSON mode, modelli piccoli/medi | T1 L0 v0.2 non passato su envelope completo; rivalutare su micro-task |
| Cerebras | Candidato tecnico L0/L1 per modelli grandi e structured output strict | qualità, velocità, schema compliance, rate limits free, privacy/DPA | usare L1 solo dopo verifica privacy/DPA; non usare L2 senza approvazione |
| OpenRouter | Candidato aggregatore per free model smoke test | disponibilità modelli free, routing, modello selezionato, ZDR/data policy, compatibilità API | usare solo L0 finché non è possibile pinning modello + ZDR + provider policy accettabile |
| VPS gratuita/self-hosted | Fallback privacy-first | fattibilità, lentezza, modelli piccoli, batch notturni | usare solo se il costo operativo e la qualità sono accettabili |

Aggiornamento v0.4: Cloudflare Workers AI e Groq sono candidati operativi solo per micro-task L0. OpenRouter resta smoke L0 sperimentale con modello pinned. Cerebras resta test tecnico non promosso.

## Fonti provider verificate

- Gemini Structured Outputs: https://ai.google.dev/gemini-api/docs/structured-output
- Gemini pricing: https://ai.google.dev/gemini-api/docs/pricing
- Gemini terms: https://ai.google.dev/gemini-api/terms
- Cloudflare Workers AI pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
- Cloudflare Workers AI data usage: https://developers.cloudflare.com/workers-ai/platform/data-usage/
- Cloudflare Workers AI JSON mode: https://developers.cloudflare.com/workers-ai/features/json-mode/
- Groq rate limits: https://console.groq.com/docs/rate-limits
- Groq structured outputs: https://console.groq.com/docs/structured-outputs
- Groq data policy: https://console.groq.com/docs/your-data
- Cerebras rate limits: https://inference-docs.cerebras.ai/support/rate-limits
- Cerebras structured outputs: https://inference-docs.cerebras.ai/capabilities/structured-outputs
- Mistral rate limits and usage tiers: https://docs.mistral.ai/admin/user-management-finops/tier
- Mistral known limitations: https://docs.mistral.ai/resources/known-limitations
- Mistral data training policy: https://help.mistral.ai/en/articles/347617-do-you-use-my-user-data-to-train-your-artificial-intelligence-models
- Mistral usage limits: https://docs.mistral.ai/admin/user-management-finops/usage-limits
- OpenRouter pricing: https://openrouter.ai/pricing
- OpenRouter free models router: https://openrouter.ai/docs/guides/routing/routers/free-models-router
- OpenRouter provider logging: https://openrouter.ai/docs/guides/privacy/provider-logging
- OpenRouter ZDR: https://openrouter.ai/docs/guides/features/zdr

## Pacchetti benchmark

### Copenhagen M1-M4 O&M

Uso nel benchmark:

- tender pack/ITT O&M;
- 59 file utili;
- PDF, DOCX, XLSX, MPP;
- forte presenza di versioni, track changes e schedule;
- già esiste una griglia di riferimento compilata manualmente.

Task prioritari:

- classificazione documento;
- timeline procurement e contratto;
- deliverable di tender;
- KPI;
- payment mechanism;
- contraddizioni candidate;
- chiarimenti/Q&A.

### Dublin Luas O&M

Uso nel benchmark:

- tender O&M in fase negoziale/ITN;
- 99 file utili;
- PDF, DOCX, XLSX, XLS;
- forte presenza di pricing, financial model, schedules, annexes e redline.

Task prioritari:

- classificazione documento e fase;
- versioning/redline;
- financial model e pricing structure;
- timetable e network;
- cost drivers;
- requisiti O&M;
- confronto con pattern Copenhagen.

### Milano Lotti Extraurbani O&M

Uso nel benchmark:

- ITT bus extraurbano O&M multi-lotto;
- 97 file utili;
- PDF, DOCX, DOC, XLSX, XLS, XLSM, ZIP e P7M;
- forte presenza di GTFS, PEF, linee, fermate, percorrenze, mezzi, personale, offerta tecnica ed economica.

Task prioritari:

- classificazione documento e lotti;
- lettura metadati ZIP/GTFS;
- financials, PEF e modelli economici;
- network bus, fermate, linee e percorrenze;
- personale, mezzi, impianti e tecnologie;
- qualità, penali e criteri di valutazione.

### Dublin MetroLink PPP

Uso nel benchmark:

- prequalifica PPP/PQP;
- 37 file utili;
- PDF, DOCX e XLSX;
- forte presenza di Qualification Envelope, Technical Envelope, form, declarations e template di risposta.

Task prioritari:

- classificazione stage-aware prequalifica;
- requisiti di partecipazione;
- financial and economic standing;
- capability evidence e reference projects;
- envelopes e form richiesti;
- identificazione degli indicatori non applicabili rispetto a ITT e ITN.

## Dataset di test

Il benchmark usa tre livelli di dataset.

| Livello | Nome | Contenuto | Uso |
| --- | --- | --- | --- |
| L0 | Pubblico o non sensibile | Titoli file, nomi documenti, metadati, indici, estratti brevi non riservati | Test provider, quota, JSON, latenza |
| L1 | Riservato minimizzato | Chunks mirati da documenti reali, senza inviare interi documenti | Benchmark qualità V1 |
| L2 | Critico | Payment, penali, clausole AI/privacy, dati personali, garanzie, requisiti legali | Solo provider approvato e review umana obbligatoria |

Regola iniziale:

- L0 può essere usato su tutti i provider candidati.
- L1 può essere usato su Gemini, Mistral, Groq, Cloudflare o Cerebras se la policy dati è accettabile per quel task.
- OpenRouter resta L0-only finché non sono verificati modello pinned, policy provider e ZDR.
- L2 richiede approvazione esplicita prima dell’invio a provider esterno.

Il primo dataset operativo Copenhagen L0/L1 è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-free-ai-benchmark-dataset.md`

Il prompt/schema pack v0.1 è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-1.md`

Il prompt/schema pack v0.2 è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-2.md`

Il prompt/schema pack v0.3 con gate, privacy, classi documentali e minimizzazione è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-v0-3.md`

Risultati T1 L0 v0.3 hybrid stage-aware aggiuntivi:

- Milano lotti extraurbani O&M: Gemini pass su campione 26 item; Mistral non valutabile per HTTP 429 `service_tier_capacity_exceeded`;
- Dublin MetroLink PPP: Gemini pass su campione 16 item; Mistral non valutabile per HTTP 429 `service_tier_capacity_exceeded`.

Questi risultati non chiudono la tassonomia: indicano che v0.3 funziona come baseline MVP, ma v0.4 deve aggiungere categorie dedicate a bus, lotti, prequalifica e dataset operativi.

Risultato micro-routing v0.4:

- Cloudflare Workers AI passa su 5/5 item L0 minimizzati;
- Groq passa su 5/5 item L0 minimizzati;
- OpenRouter passa solo con `google/gemma-4-26b-a4b-it:free`, mentre altri modelli free testati sono stati rate-limited upstream;
- Cerebras non passa: modello grande bloccato da capacity, fallback piccolo incompleto.

Il report è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-ai-routing-micro-benchmark-v0-4-evaluation.md`

Risultato T1 L0 stage-aware v0.4:

- dataset compatto da 21 item sui quattro pacchetti;
- Gemini raw completo 21/21 con stage pass, review sensibile pass e nessun campo vietato;
- Gemini raw non passa perfettamente la classificazione canonica perché alcuni enum richiedono normalizzazione;
- Gemini + normalizzatore deterministico post-AI passa 21/21;
- Mistral non valutabile per HTTP 429 `service_tier_capacity_exceeded`.

Il report è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t1-l0-v0-4-stage-aware-compact-benchmark-evaluation.md`

Risultato T2 timeline v0.1:

- dataset compatto da 19 eventi sui quattro pacchetti;
- input L1 minimizzato con righe MPP/TSV ed estratti brevi, senza invio di documenti completi;
- Gemini raw completo 19/19, senza campi temporali vietati, ma con 2 mismatch conservativi su `review_required`;
- Gemini + normalizzatore deterministico passa;
- Mistral raw passa 19/19 e produce incertezze più informative sui casi critici;
- tre contraddizioni candidate entrano in review: due divergenze Copenhagen MPP/PDF e una criticità Milano su chiarimenti/offerta.

Il prompt/schema pack e il report sono documentati in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t2-timeline-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t2-timeline-compact-benchmark-evaluation.md`

Risultato T3 deliverable v0.1:

- dataset compatto da 22 deliverable sui quattro pacchetti;
- input L1 minimizzato con estratti brevi e source refs, senza invio di documenti completi;
- Gemini raw e pipeline pass su 22/22 item;
- Mistral raw e pipeline pass su 22/22 item;
- nessun provider ha restituito campi requisiti vietati;
- 8 deliverable economici, finanziari, valutativi o tecnicamente critici entrano in review obbligatoria.

Il prompt/schema pack e il report sono documentati in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t3-deliverables-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t3-deliverables-compact-benchmark-evaluation.md`

La tassonomia completa T1-T8 è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-tx-task-taxonomy-t1-t8.md`

I prompt/schema pack T4-T8 v0.1 sono documentati in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t4-requirements-kpi-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t5-financials-payment-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t6-cost-drivers-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t7-contradictions-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-prompt-schema-pack-t8-query-draft-v0-1.md`

I benchmark compatti T4-T8 sono stati preparati ed eseguiti selettivamente sui provider:

- report: `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t4-t8-compact-benchmark-preparation.md`;
- valutazione provider: `/Users/Matteo/Documents/TRAM/docs/analysis/tram-t4-t8-compact-provider-benchmark-evaluation.md`;
- roll-up: `/Users/Matteo/Documents/TRAM/data/working/t4-t8-compact-benchmark-summary-v0-1.json`.

## Task benchmark

### T1 - Classificazione documentale

Input:

- filename;
- path relativo;
- prime pagine o abstract estratto;
- eventuali metadati.

Output JSON:

- `package_phase`;
- `document_nature`;
- `document_role`;
- `currentness`;
- `version`;
- `issue_date`;
- `content_classes`;
- `privacy_level`;
- `redaction_policy_id`;
- `minimization_summary`;
- `response_status`;
- `confidence`;
- `source_refs`;
- `uncertainties`.

Nota dopo rerun v0.3: `currentness` va misurato nel benchmark perché è un campo utile, ma non va trattato come responsabilità esclusiva del provider AI. Il protocollo deve distinguere score di classificazione documento e score di risoluzione deterministica dello stato corrente.

Nota v0.3: il benchmark deve usare anche `content_classes`, `privacy_level`, `redaction_policy_id`, `minimization_summary` e `response_status`.

Nota v0.3 hybrid: il gateway può compilare i campi privacy/gate/audit e il resolver può compilare `version`, `document_family_key`, `variant_type` e `currentness`. In questo caso la valutazione va separata in `ai_classification_pass`, `deterministic_resolver_pass` e `pipeline_controls_pass`.

Valutazione:

- accuratezza ruolo documento;
- riconoscimento fase prequalifica/ITT/ITN/addendum;
- capacità di dichiarare incertezza.

### T2 - Timeline procurement e contratto

Input:

- eventi già individuati da parser e regole;
- righe MPP convertite o lette dal parser;
- estratti brevi da tabelle timeline;
- source refs locali;
- valori temporali deterministici.

Output JSON:

- `event_id`;
- `event_name_normalized`;
- `timeline_type`;
- `event_type`;
- `criticality`;
- `review_required`;
- `confidence`;
- `uncertainties`.

Nota T2 v0.1: l’AI non deve restituire date, orari, durate o timezone. Questi valori restano nel merge deterministico TRAM.

Valutazione:

- formato valido;
- eventi completi;
- nessun campo temporale vietato;
- distinzione gara/contratto/mobilitazione;
- review obbligatoria su date divergenti;
- qualità delle incertezze;
- pass della pipeline normalizzata.

### T3 - Tender deliverables

Input:

- deliverable candidati già individuati da parser, tabelle e regole;
- estratti brevi da Instructions to Tender, PQQ, disciplinari o appendici;
- source refs locali;
- valori deterministici separati da output AI.

Output JSON:

- `deliverable_id`;
- `deliverable_name_normalized`;
- `deliverable_type`;
- `submission_area`;
- `o_and_m_domain`;
- `criticality`;
- `review_required`;
- `dependencies`;
- `uncertainties`;
- `confidence`.

Nota T3 v0.1: l’AI non deve restituire `code`, `mandatory`, `page_limit`, `max_marks`, `evaluation_weight`, `format_requirement`, `deadline_ref`, valori economici, formule di scoring o clausole complete. Questi valori restano responsabilità di parser, regole, source refs e review.

Valutazione:

- formato valido;
- deliverable completi rispetto ai candidati estratti;
- nessun campo requisiti vietato;
- classificazione semantica;
- rispetto del review gate;
- qualità di dipendenze e incertezze;
- pass della pipeline normalizzata.

### T4 - Requisiti O&M e KPI non finanziari

Input:

- requisiti candidati individuati da parser/regole;
- clausole `shall`, `must`, MR o equivalenti;
- tabelle KPI non finanziarie;
- formule, target e soglie già estratte come testo/fonte;
- source refs locali.

Output JSON:

- `requirement_id` o `kpi_id`;
- `item_type`;
- `text_or_name_normalized`;
- `requirement_family` o `kpi_family`;
- `o_and_m_domain`;
- `impact_tags`;
- `linked_deliverable_ids`;
- `review_required`;
- `uncertainties`;
- `confidence`.

Nota T4 v0.1 da impostare: l’AI non deve riscrivere il testo completo del requisito, cambiare formule, target, soglie, obbligatorietà o collegamenti economici. KPI con bonus/malus, deductions, payment o penali scala a T5 e review; L2 solo se effettivo.

Valutazione:

- formato valido;
- classificazione requisito/KPI;
- dominio O&M corretto;
- nessuna alterazione di formule o target;
- review obbligatoria su mandatory, formule, compliance e casi che scalano a T5;
- utilità del clustering.

### T5 - Financials, pricing e payment mechanism

Input:

- workbook prezzi letto da parser locale;
- PEF e modelli economici letti da parser locale;
- payment mechanism;
- conditions su garanzie, penali, indexation e currency;
- source refs locali.

Output JSON:

- `financial_item_id`;
- `financial_class`;
- `source_sheet_or_section`;
- `value_raw`;
- `unit_or_currency`;
- `formula_raw`;
- `payment_mechanism_component`;
- `risk_allocation`;
- `review_required`;
- `source_refs`.

Nota T5 v0.1 da impostare: T5 è `L2_sensitive` di default. Provider esterni non sono route default V1. Il benchmark T5 iniziale deve misurare parsing, classificazione, routing privacy e review, non sintesi economica AI su contenuti completi.

Valutazione:

- separazione tra dati estratti e interpretazione;
- nessuna stima economica inventata;
- evidenza delle assunzioni;
- nessun workbook completo inviato a provider esterni;
- capacità di classificare contenuti sensibili e bloccare route non ammesse.

### T6 - Cost drivers O&M

Input:

- requisiti operation;
- requisiti maintenance;
- pricing/payment solo come link o fonte locale, non come payload AI;
- reporting obligations;
- workforce/mobilisation;
- KPI e deliverable collegati.

Output JSON:

- `cost_driver_id`;
- `driver_family`;
- `description`;
- `trigger_requirement_ids`;
- `linked_deliverable_ids`;
- `linked_kpi_ids`;
- `linked_financial_item_ids`;
- `o_and_m_domain`;
- `cost_confidence`;
- `risk_level`;
- `review_required`;
- `source_refs`;
- `confidence`.

Nota T6 v0.1 da impostare: T6 non calcola importi e non inventa stime. Se un driver dipende da pricing/payment, eredita il privacy level effettivo della fonte.

Valutazione:

- collegamenti utili a costi reali;
- distinzione tra attività e costo quantificato;
- priorità O&M sensata;
- nessun importo inventato;
- review obbligatoria sui driver economici o ambigui.

### T7 - Contraddizioni candidate

Input:

- coppie o gruppi di chunks selezionati da documenti diversi;
- indicatori già estratti da parser/regole;
- documenti correnti e versioni.

Output JSON:

- `contradiction_id`;
- `issue_title`;
- `issue_type`;
- `conflicting_values`;
- `documents_involved`;
- `why_it_may_be_a_conflict`;
- `severity_candidate`;
- `recommended_action`;
- `source_refs`;
- `uncertainties`;
- `confidence`.

Nota T7 v0.1 da impostare: T7 produce candidate, non verità. Il task deve distinguere contraddizione, ambiguità, missing evidence, version conflict e parser issue.

Valutazione:

- utilità dell’alert;
- falsi positivi;
- capacità di non trasformare un dubbio in verità;
- chiarezza per review umana.

### T8 - Chiarimenti/Q&A

Input:

- issue candidate confermata o almeno considerata plausibile in review;
- fonti;
- contesto gara.

Output JSON:

- `subject`;
- `question_draft`;
- `authority_answer`;
- `answer_received_at`;
- `facts_cited`;
- `requested_clarification`;
- `tone`;
- `source_refs`;
- `human_approval_required`;
- `status`.

Nota T8 v0.1 da impostare: nessuna domanda o chiarimento viene inviato automaticamente. Default V1: template + review umana; AI esterna non default. Un chiarimento non deve includere strategia d’offerta, note interne o dati non destinati alla stazione appaltante.

Valutazione:

- testo inviabile dopo revisione;
- tono professionale;
- citazioni precise;
- nessuna affermazione non supportata.

## Schemi JSON

Gli schemi devono essere semplici, poco profondi e compatibili con provider diversi.

Regole:

- root sempre `object`;
- usare `additionalProperties: false` quando compatibile;
- campi obbligatori anche se nullable;
- optional rappresentati come `null`;
- enum per stati, task type e risk level;
- array con limite massimo quando possibile;
- source refs sempre obbligatorie;
- confidence sempre numerica o enum coerente.

Motivo:

- Gemini supporta structured output con un sottoinsieme JSON Schema;
- Groq ha structured outputs strict su modelli supportati e JSON object mode su altri;
- Cerebras richiede schema root object e `additionalProperties: false` per compatibilità futura;
- Cloudflare Workers AI supporta JSON mode, ma va misurata l’aderenza schema.

## Metriche di valutazione

| Metrica | Peso | Come si valuta |
| --- | --- | --- |
| Accuratezza sostanziale | 25% | Confronto con griglia Copenhagen e review esperta |
| Fonte e citabilità | 20% | Ogni claim rilevante ha source ref utile |
| Completezza | 15% | Campi P0 presenti senza omissioni importanti |
| Prudenza | 10% | Dichiara incertezza, non inventa, non forza conclusioni |
| JSON/schema compliance | 10% | Output parsabile e aderente allo schema |
| Utilità per review | 10% | Riduce lavoro dell’utente, non crea rumore |
| Costo/quota | 5% | Resta nel free tier o budget zero/minimo |
| Latenza/stabilità | 5% | Tempi compatibili con batch o uso interattivo |

Soglia per provider default:

- almeno 80/100 sul totale ponderato;
- almeno 4/5 su fonte e citabilità nei task critici;
- nessun fail grave su privacy/costo;
- schema compliance almeno 95% sui task scelti per la V1.

Soglia per provider fallback:

- almeno 65/100;
- utile su almeno due task specifici;
- nessun fail grave su privacy/costo.

## Errori bloccanti

Un provider o modello viene escluso dal default se:

- genera costi non approvati;
- richiede upgrade paid non controllato;
- non consente controllo adeguato su dati o retention per il task;
- inventa fonti o riferimenti;
- produce output non parsabile in modo ricorrente;
- non distingue fatti, assunzioni e interpretazioni;
- trasforma una contraddizione candidata in affermazione certa;
- non permette di sospendere il job a quota esaurita.

## Registro benchmark

Ogni run deve salvare almeno:

- `benchmark_run_id`;
- data e ora;
- pacchetto;
- task;
- provider;
- modello;
- modalità free/billing/cap;
- prompt version;
- schema version;
- input hash;
- input privacy level;
- output hash;
- token/unità consumo;
- costo stimato;
- quota residua se disponibile;
- latenza;
- esito parsing JSON;
- score automatico;
- score umano;
- note reviewer;
- decisione: promosso, fallback, escluso, da riprovare.

## Esecuzione proposta

### Fase A - Preparazione senza AI esterna

1. Generare inventory aggiornato dei file.
2. Estrarre testo e tabelle dai documenti scelti.
3. Convertire o leggere MPP dove possibile.
4. Creare chunks con source refs stabili.
5. Etichettare ogni chunk L0, L1 o L2.
6. Definire prompt e schema version per ogni task.

### Fase B - Smoke test provider

1. Usare solo input L0.
2. Eseguire T1 e un task JSON semplice su ogni provider.
3. Verificare credenziali, quota, costo zero, latenza e parsing.
4. Per OpenRouter, registrare anche modello effettivamente selezionato e policy provider.
5. Escludere provider che falliscono setup o schema base.

### Fase C - Benchmark Copenhagen

1. Usare Copenhagen come pacchetto principale perché ha già griglia manuale.
2. Eseguire T1, T2, T3, T4, T7 e T8.
3. Confrontare output AI con la griglia Copenhagen.
4. Segnare errori, omissioni e falsi positivi.
5. Decidere provider default provvisorio per task.

### Fase D - Benchmark Luas

1. Usare Luas per stress test su pacchetto più grande e negoziale/ITN.
2. Eseguire T1, T5, T6 e versioning/redline.
3. Verificare se il routing scelto su Copenhagen regge su un caso diverso.
4. Aggiornare tassonomia e task matrix.

### Fase E - Decisione routing V1

Produrre una tabella finale:

| Task | Default | Fallback | Human gate | Stato V1 |
| --- | --- | --- | --- | --- |
| Classificazione documento | Provider con score più alto su T1 e nessun fail privacy/costo | Secondo provider sopra 65/100 | Solo ambigui | Candidato V1 |
| Timeline | Parser + provider con migliore score su T2 | Parser only | Divergenze | Candidato V1 |
| Deliverables | Provider con migliore score su T3 | Parser/rules | Valutativi | Candidato V1 |
| Requisiti/KPI non finanziari | Parser/regole + provider con migliore score su T4 | Parser/rules | Obbligatorio su mandatory/formule | Candidato V1 |
| Financials/payment | Parser Excel/PDF locale; AI esterna non default | Human-assisted o self-hosted futuro | Obbligatorio | Candidato V1 parziale |
| Cost drivers | Regole + provider con migliore score su T6, solo se review utile almeno 4/5 | Human-assisted | Obbligatorio | Candidato V1 parziale |
| Contraddizioni | Regole + provider con migliore score su T7 | Regole | Obbligatorio | Candidato V1 |
| Chiarimenti/Q&A | Provider con migliore score su T8 e tono approvato | Nessuno | Obbligatorio | Candidato V1 |

## Output del benchmark

Il benchmark deve produrre tre artefatti:

1. report provider: score, limiti, privacy, costo e raccomandazione;
2. report task: cosa entra in V1 come AI-assisted, cosa resta parser/rule-based e cosa resta human-only;
3. backlog tecnico: adapter provider, schemi JSON, prompt version, registry chiamate AI, quota guard e UI review.

## Decisione raccomandata prima del test

Partire con questo ordine, aggiornato dopo i test T1, T2 e T3:

1. Gemini come candidato principale per qualità e task complessi; `gemini-2.5-flash-lite` ha passato T1 L0 v0.2, T1 L0 hybrid, T2 timeline v0.1 e T3 deliverable v0.1 come pipeline.
2. Mistral come candidato europeo forte; `mistral-medium-3.5` ha passato T1 L0 v0.2, T1 L0 hybrid su Copenhagen/Luas, T2 timeline v0.1 e T3 deliverable v0.1, con attenzione ai limiti capacity del tier gratuito.
3. Cloudflare Workers AI come candidato per task leggeri e postura privacy interessante; T1 L0 v0.2 non è passato sull’envelope completo, ma resta da rivalutare su micro-task.
4. Groq come candidato per velocità e micro-task: T1 L0 v0.2 non è passato con l’envelope attuale, ma il micro-routing v0.4 passa.
5. OpenRouter come candidato sperimentale L0 per free models e confronto rapido: usare solo modello pinned, perché il free tier ha rate limit upstream frequenti.
6. Cerebras come candidato tecnico L0/L1 da ritentare su modello grande: `llama3.1-8b` non è sufficiente per T1 e non è bastato nemmeno sul micro-routing v0.4.
7. VPS/self-hosted come fallback privacy-first, accettando lentezza e qualità inferiore.

Questa è una priorità di test, non una scelta definitiva.

La raccomandazione provvisoria consolidata è in:

`/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-provider-recommendation-v0-1.md`

## Prossimo passo operativo

I prompt/schema pack T4-T8 v0.1, i relativi benchmark compatti e la valutazione provider selettiva sono stati completati.

Prossimo passo:

1. usare la specifica normalizzatori T4-T8 in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`;
2. includere `T5` nei benchmark provider su input L0/L1 minimizzati e approvati, mantenendo blocco solo per L2 effettivo o policy incompatibile;
3. usare il config `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json` e la fixture spec `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md`;
4. usare l’ADR `/Users/Matteo/Documents/TRAM/docs/decisions/tram-adr-001-normalizer-runtime-placement-v0-1.md` come decisione runtime dei normalizzatori;
5. usare la specifica viste dashboard MVP in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-dashboard-views-t1-t8-v0-1.md`;
6. usare il registro `indicator_key` P0/P1 già definito per fixture dashboard/review;
7. introdurre scheduler quota-aware per Gemini e policy capacity/retry per Mistral;
8. registrare provider, modello, latenza, schema compliance, quota residua e note privacy in ogni run futura;
9. bloccare o sospendere qualunque caso `blocked_sensitive`, payment, penali o chiarimento strategico.
