# TRAM V1 - Tassonomia task Tx T1-T8

Data: 2026-05-13
Stato: decisione operativa iniziale
Ambito: pipeline V1, benchmark AI gratuito, parser/regole, review queue e dashboard

## Scopo

Questo documento formalizza i task `T1`-`T8` di TRAM V1.

I task Tx servono a evitare che TRAM diventi una somma confusa di estrazioni. Ogni task deve avere:

- uno scopo chiaro;
- una responsabilità primaria tra parser, regole, AI e utente;
- input minimizzati;
- output schema-ready;
- gate privacy/costo;
- review umana quando il dato incide su offerta, costi, compliance o chiarimenti/Q&A.

## Decisione

Per la V1 manteniamo **8 task Tx**:

| Task | Nome breve | Stato |
| --- | --- | --- |
| `T1` | Document map e versioning | Benchmarkato |
| `T2` | Timeline gara/contratto | Benchmarkato |
| `T3` | Deliverable di gara | Benchmarkato |
| `T4` | Requisiti O&M e KPI non finanziari | Benchmark Mistral passato |
| `T5` | Financials, pricing e payment mechanism | Benchmark preparato, AI esterna non default |
| `T6` | Cost driver O&M | Benchmark Mistral passato |
| `T7` | Contraddizioni candidate | Benchmark tentato, non promosso |
| `T8` | Chiarimenti/Q&A | Benchmark Mistral passato su subset L1/L0, human-first |

Non separiamo subito requisiti e KPI in due task diversi. In O&M sono troppo intrecciati: molti requisiti diventano KPI, molti KPI rimandano a performance regime, report, corrective actions e possibili penali. Se in futuro il benchmark mostra che il task è troppo ampio, potremo introdurre sottotask `T4A` requisiti e `T4B` KPI senza rinumerare la roadmap principale.

## Principio comune

Per tutti i task vale questa regola:

1. parser, OCR, tabelle, Excel, MPP e regole producono la prima evidenza;
2. l’AI lavora solo su envelope minimizzati e versionati;
3. l’AI propone normalizzazioni, cluster, spiegazioni e incertezze;
4. il normalizzatore deterministico applica enum canonici e rimuove campi vietati;
5. la review queue conferma, corregge o respinge dati critici;
6. dashboard e griglie mostrano sempre fonte, stato e confidenza.

Un output AI non è mai verità applicativa da solo.

## Fonti dominio usate

La struttura T1-T8 è coerente con il lavoro sui pacchetti TRAM e con fonti esterne di dominio:

- FTA, BPPM Methods of Solicitation and Selection: conferma l’importanza di criteri di valutazione, fattori tecnici, prezzo e best value nelle procedure competitive.
- AIAI, O&M Toolkit Performance Monitoring: conferma il legame tra O&M documentation, technical approach, performance specifications, financial capacity, KPI e payment mechanism.
- World Bank PPP, Structuring Management, Operation and Maintenance Services: conferma che contratti O&M possono includere fee fisse, incentivi, performance targets, liquidated damages e rischio asset.
- World Bank PPP, Checklist for Operation and Maintenance Agreement: conferma le aree da verificare in un accordo O&M, tra cui scope, performance standards, liabilities, liquidated damages, incentives, service area, maintenance schedule e variations.

Link:

- https://www.transit.dot.gov/funding/procurement/bppm-methods-solicitation-and-selection
- https://aiai-infra.org/o-m-toolkit-performance-monitoring/
- https://ppp.worldbank.org/structuring-management-operation-and-maintenance-services
- https://ppp.worldbank.org/checklist-operation-and-maintenance-agreement

## Stato complessivo

| Task | Prompt/schema pack | Benchmark compatto | Route MVP | Provider esterno default |
| --- | --- | --- | --- | --- |
| `T1` | v0.4 stage-aware | Sì | Hybrid | Gemini, Mistral se disponibile |
| `T2` | v0.1 timeline | Sì | Parser/regole + AI normalizzazione | Gemini o Mistral |
| `T3` | v0.1 deliverable | Sì | Parser/regole + AI normalizzazione | Gemini o Mistral |
| `T4` | v0.1 requisiti/KPI | Sì, Mistral pass | Parser/regole + AI controllata | Mistral; Gemini da ritestare con quota |
| `T5` | v0.1 financials/payment | Preparato, non eseguito | Parser locale + review | Nessuno in V1 default |
| `T6` | v0.1 cost driver | Sì, Mistral pass | Regole + review + AI limitata | Mistral solo se fonti L1 approvate |
| `T7` | v0.1 contraddizioni | Tentato, non promosso | Regole/confronti + AI spiegazione | Nessuno come default |
| `T8` | v0.1 chiarimenti/Q&A | Sì, subset L1/L0 Mistral pass | Thread + template + review + AI opzionale | Mistral small solo su subset ammesso |

## T1 - Document map e versioning

### Scopo

Costruire la mappa documentale del Tender:

- fase pacchetto;
- natura documento;
- ruolo documento;
- famiglia documento;
- versione;
- variante;
- currentness;
- classi contenuto;
- privacy level iniziale.

### Responsabilità

| Componente | Responsabilità |
| --- | --- |
| Parser/regole | filename, path, estensione, hash, ID documento, version label, clean/track changes, famiglia, currentness candidate |
| AI | natura, ruolo, classi contenuto, incertezze |
| Normalizzatore | enum canonici, fallback, controlli privacy/gate |
| Utente | conferma casi ambigui o documenti critici |

### Output minimo

- `document_id`;
- `package_phase`;
- `document_nature`;
- `document_role`;
- `document_family_key`;
- `version_label`;
- `variant_type`;
- `currentness_rule_candidate`;
- `content_classes`;
- `privacy_level`;
- `review_required`;
- `source_refs`;
- `uncertainties`.

### Regole

- L’AI non decide `currentness` come fonte unica.
- Track changes, redline e clean copy vanno riconciliati da resolver deterministico.
- Documenti pricing, payment, KPI economici, penali, AI/privacy e dati personali generano review.

### Stato

T1 è già benchmarkato con pack v0.4 stage-aware e resolver deterministico.

## T2 - Timeline gara/contratto

### Scopo

Costruire timeline verificabile di gara, contratto, mobilitazione, avvio servizio, durata, chiarimenti e fasi negoziali.

### Responsabilità

| Componente | Responsabilità |
| --- | --- |
| Parser/regole | date, orari, timezone, durate, quarter, date relative, conflitti fonte |
| AI | nome evento normalizzato, tipo evento, tipo timeline, incertezze leggibili |
| Normalizzatore | rimozione campi temporali vietati, enum canonici, review gate |
| Utente | date divergenti, milestone critiche, date relative ambigue |

### Output minimo

- `event_id`;
- `event_name_raw`;
- `event_name_normalized`;
- `timeline_type`;
- `event_type`;
- `date_start`;
- `date_end`;
- `date_precision`;
- `duration`;
- `criticality`;
- `review_required`;
- `source_refs`;
- `uncertainties`.

### Regole

- L’AI non restituisce né consolida date, orari, durate o timezone.
- Se due fonti divergono, la UI mostra alternative e stato review.
- Le milestone contrattuali critiche non diventano confermate senza fonte chiara.

### Stato

T2 è benchmarkato con pack timeline v0.1.

## T3 - Deliverable di gara

### Scopo

Costruire checklist dei deliverable richiesti per submission, buste, PQQ/ITT/ITN, allegati, form, piani tecnici, modelli economici e documenti di supporto.

### Responsabilità

| Componente | Responsabilità |
| --- | --- |
| Parser/regole | deliverable candidati, codice, obbligatorietà, limiti pagina, formato, pesi, deadline, source refs |
| AI | nome normalizzato, tipo, area submission, dominio O&M, dipendenze, incertezze |
| Normalizzatore | enum canonici, rimozione campi vietati, review gate |
| Utente | checklist finale, deliverable economici, valutativi o tecnicamente critici |

### Output minimo

- `deliverable_id`;
- `code`;
- `name_raw`;
- `name_normalized`;
- `deliverable_type`;
- `submission_area`;
- `o_and_m_domain`;
- `mandatory`;
- `page_limit`;
- `format_requirement`;
- `evaluation_weight`;
- `deadline_ref`;
- `dependencies`;
- `review_required`;
- `source_refs`.

### Regole

- L’AI non decide obbligatorietà, limiti pagina, formati, pesi, deadline o valori economici.
- PEF, pricing workbook, schedule of prices e offerte economiche sono indicizzati localmente e review-first.

### Stato

T3 è benchmarkato con pack deliverable v0.1.

## T4 - Requisiti O&M e KPI non finanziari

### Scopo

Estrarre e normalizzare requisiti operativi, manutentivi, organizzativi, compliance, reporting e KPI non finanziari.

T4 include:

- obblighi `shall/must` o equivalenti;
- requisiti MR o mandatory requirement;
- requisiti operations;
- requisiti maintenance e asset management;
- requisiti workforce, mobilitazione, security, safety, customer;
- KPI non finanziari;
- formule, target, soglie e misurazioni quando non includono valori economici.

### Responsabilità

| Componente | Responsabilità |
| --- | --- |
| Parser/regole | clausole, requisiti candidati, MR pattern, shall/must, tabelle KPI, formule, target, unità, source refs |
| AI | normalizzazione testo breve, famiglia requisito, dominio O&M, clustering, impatto potenziale, incertezze |
| Normalizzatore | enum canonici, deduplica requisito, separazione KPI non finanziario vs KPI economico |
| Utente | requisiti mandatory, formule KPI, target critici, obblighi compliance e ambiguità |

### Output minimo

Per requisiti:

- `requirement_id`;
- `requirement_text_short`;
- `requirement_type`;
- `o_and_m_domain`;
- `mandatory_candidate`;
- `impact_tags`;
- `linked_deliverable_ids`;
- `review_required`;
- `source_refs`;
- `uncertainties`.

Per KPI non finanziari:

- `kpi_id`;
- `kpi_name`;
- `kpi_family`;
- `formula_raw`;
- `target_raw`;
- `measurement_period`;
- `data_source`;
- `exclusions`;
- `linked_requirement_ids`;
- `review_required`;
- `source_refs`.

### Regole

- L’AI non deve cambiare formule, target o soglie.
- KPI con bonus/malus, deductions, payment o penali scala a T5 e review; scala a L2 solo se contiene dati interni/offerta, dati personali, clausole incompatibili o payload non minimizzabile.
- Requisiti cyber/security, AI/privacy, dati personali o clausole legali critiche generano review e possono essere esclusi da provider esterni.

### Benchmark da impostare

Dataset compatto consigliato:

- 6 requisiti operations;
- 6 requisiti maintenance/asset;
- 4 requisiti reporting/compliance;
- 4 KPI non finanziari;
- almeno 4 casi che scalano a review.

## T5 - Financials, pricing e payment mechanism

### Scopo

Mappare financials, pricing, PEF, workbook economici, payment mechanism, bonus/malus, penali, garanzie, indexation, currency e allocazioni economiche.

### Responsabilità

| Componente | Responsabilità |
| --- | --- |
| Parser locale | Excel, PDF, tabelle, formule, sheet, celle, currency, valori, riferimenti |
| Regole | classificazione payment, pricing items, garanzie, cap/collar, indexation, escalation, penali |
| AI esterna | Non default V1 |
| Utente | validazione obbligatoria |

### Output minimo

- `financial_item_id`;
- `financial_class`;
- `source_document`;
- `source_sheet_or_section`;
- `value_raw`;
- `unit_or_currency`;
- `formula_raw`;
- `payment_mechanism_component`;
- `risk_allocation`;
- `review_required`;
- `source_refs`.

### Regole

- T5 è `L2_sensitive` di default.
- Nessun workbook completo o payment mechanism completo va inviato a provider esterni in V1.
- L’AI può entrare solo in futuro con VPS/self-hosted o approvazione esplicita su estratti minimizzati.
- Le sintesi economiche non devono inventare stime, assunzioni o missing values.

### Benchmark da impostare

Dataset compatto consigliato:

- 5 item Excel/PEF/pricing senza valori monetari esposti nel prompt pubblico;
- 5 componenti payment/penalty/indexation descritti solo per classe e fonte;
- 3 garanzie/securities;
- valutazione solo su classificazione e routing, non su calcolo economico AI.

## T6 - Cost driver O&M

### Scopo

Tradurre requisiti, deliverable, KPI, scope e financials in attività che possono generare costo o rischio operativo.

T6 non calcola l’offerta economica. Crea una mappa critica di ciò che “fa costo”.

### Responsabilità

| Componente | Responsabilità |
| --- | --- |
| Regole | mapping da requisiti/deliverable/KPI a famiglie costo, collegamento a pricing section |
| Parser | fonte, requisito, asset, frequenza, quantità se esplicita |
| AI | proposta di famiglia costo, descrizione sintetica, dipendenze, incertezze su input L1 approvato |
| Utente | priorità, conferma impatto, esclusione falsi positivi |

### Output minimo

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
- `source_refs`.

### Regole

- T6 non deve inventare importi.
- Se il driver dipende da pricing/payment, eredita il privacy level effettivo della fonte.
- I driver devono distinguere attività certa, costo potenziale e rischio non quantificato.

### Benchmark da impostare

Dataset compatto consigliato:

- 4 driver operations;
- 4 driver maintenance/asset;
- 3 driver workforce/mobilisation;
- 3 driver reporting/compliance;
- 3 driver legati a KPI o penali da tenere in review.

## T7 - Contraddizioni candidate

### Scopo

Identificare possibili contraddizioni, mismatch, conflitti di versione, ambiguità o omissioni tra documenti e fonti.

T7 produce **candidate**, non verità.

### Responsabilità

| Componente | Responsabilità |
| --- | --- |
| Regole | confronto valori, date, versioni, document lists, ID, duplicate, source refs |
| Parser | evidenze strutturate e valori normalizzati |
| AI | spiegazione del possibile conflitto, severità candidata, domanda da porre all’utente |
| Utente | conferma, respinge o trasforma in thread di chiarimento |

### Output minimo

- `contradiction_id`;
- `contradiction_type`;
- `title`;
- `conflicting_values`;
- `documents_involved`;
- `why_it_may_be_a_conflict`;
- `severity_candidate`;
- `recommended_action`;
- `review_required`;
- `source_refs`;
- `uncertainties`.

### Regole

- T7 deve distinguere `contradiction`, `ambiguity`, `missing_evidence`, `version_conflict` e `parser_issue`.
- L’AI non deve trasformare un dubbio in affermazione certa.
- Se una fonte è L2, tutto il caso eredita L2 e provider esterni sono bloccati salvo approvazione esplicita.

### Benchmark da impostare

Dataset compatto consigliato:

- 3 date mismatch;
- 3 version conflict;
- 3 numeric/scope mismatch;
- 3 obligation conflict;
- 3 missing document o document list mismatch;
- almeno 5 falsi positivi controllati per misurare prudenza.

## T8 - Chiarimenti/Q&A

### Scopo

Gestire thread di chiarimento tra bidder e stazione appaltante partendo da contraddizioni o ambiguità già validate o considerate plausibili. La bozza di domanda è solo uno stato interno del thread.

T8 è l’ultimo task della catena, non il primo.

### Responsabilità

| Componente | Responsabilità |
| --- | --- |
| Template/regole | struttura del chiarimento, campi obbligatori, tono, riferimenti fonte |
| AI | bozza linguistica se autorizzata e su input non L2, con citazioni precise |
| Utente | approvazione, modifica, export/invio manuale, registrazione risposta o scarto |

### Output minimo

- `clarification_thread_id`;
- `linked_contradiction_id`;
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

### Regole

- Nessuna domanda o chiarimento viene inviato automaticamente.
- T8 non deve includere dati interni, strategia d’offerta o commenti non destinati alla stazione appaltante.
- Default V1: template + review umana; AI esterna non default.
- Se il chiarimento riguarda dati personali, clausole AI/privacy, rischio legale o elementi payment/penali non minimizzabili, resta L2 e richiede workflow locale/human-first.
- Se arriva una risposta della stazione appaltante, TRAM deve poterla collegare a fonte/stato e riaprire review su dati già validati.

### Benchmark da impostare

Dataset compatto consigliato:

- 5 chiarimenti su contraddizioni confermate;
- 5 chiarimenti su ambiguità;
- 3 chiarimenti su documenti mancanti;
- 3 chiarimenti su conflitti timeline;
- 3 casi da non trasformare in chiarimento perché troppo deboli.

## Routing sintetico T1-T8

| Task | Parser/regole | AI esterna | Review | Privacy default |
| --- | --- | --- | --- | --- |
| `T1` | Alta | Sì, L0/L1 minimizzato | Ambigui/critici | L0/L1 |
| `T2` | Alta | Sì, solo normalizzazione | Date divergenti/critiche | L1 |
| `T3` | Alta | Sì, solo normalizzazione | Checklist e sensibili | L1 |
| `T4` | Alta | Sì, controllata | Mandatory/KPI/formule | L1 con escalation L2 |
| `T5` | Molto alta | No default | Obbligatoria | L2 |
| `T6` | Alta | Limitata | Obbligatoria | L1/L2 ereditato |
| `T7` | Alta | Dipende dalle fonti | Obbligatoria | Eredita fonte |
| `T8` | Media | No default | Obbligatoria prima di invio | L2 se strategico/sensibile |

## Ordine operativo

L’ordine di sviluppo e benchmark resta:

1. `T1` document map e versioning;
2. `T2` timeline;
3. `T3` deliverable;
4. `T4` requisiti O&M e KPI non finanziari;
5. `T5` financials/payment, con parser locale, AI su input ammessi e review;
6. `T6` cost driver;
7. `T7` contraddizioni candidate;
8. `T8` chiarimenti/Q&A.

T5 può essere anticipato parzialmente se serve a T6 e può usare AI esterna su L0/L1 minimizzati e approvati; L2 effettivo resta bloccato o self-hosted.

## Impatto data model

Le entità specialistiche minime collegate ai Tx sono:

- `Document` / `DocumentVersion` per T1;
- `TimelineEvent` per T2;
- `TenderDeliverable` per T3;
- `Requirement` e `KPI` per T4;
- `FinancialItem` o vista specialistica su `Extraction` per T5;
- `CostDriver` per T6;
- `ContradictionCandidate` per T7;
- `ClarificationDraft` per T8.

Se non creiamo subito tabelle dedicate, gli output devono comunque essere rappresentabili come `Extraction`, `IndicatorValue`, `ReviewItem` e `SourceReference`.

## Impatto UI

La UI V1 dovrebbe trasformare i Tx in aree leggibili:

- Documenti;
- Timeline;
- Deliverable;
- Requisiti e KPI;
- Financials;
- Cost driver;
- Contraddizioni;
- Chiarimenti/Q&A.

Ogni area deve mostrare:

- fonte;
- stato;
- confidenza;
- review richiesta;
- ultimo aggiornamento;
- provider o tool che ha prodotto la proposta, se applicabile.

## Debiti

- Usare la specifica tecnica dei normalizzatori T4-T8 in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-spec-t4-t8-v0-1.md`.
- Usare il config `/Users/Matteo/Documents/TRAM/data/config/tram-v1-normalizer-config-t4-t8-v0-1.json` e la fixture spec `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ai-normalizer-fixture-test-spec-t4-t8-v0-1.md`.
- Usare la specifica viste dashboard MVP in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-dashboard-views-t1-t8-v0-1.md`.
- Definire naming interno dei sottotask, per esempio `T4A` requisiti e `T4B` KPI, solo se il benchmark T4 risulta troppo ampio.

## Prossimo passo consigliato

Usare il registro `indicator_key` e le specifiche operative T2/T3 per preparare fixture applicative minime, mantenendo distinti campi AI-owned, rule-owned e review-owned.
