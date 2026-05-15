# TRAM V1 - Fixture applicative MVP/V0 largo v0.1

Data: 2026-05-13  
Ultimo aggiornamento: 2026-05-15  
Stato: Fase 2 chiusa su fixture compatte sintetiche  
Ambito: fixture applicative sintetiche o sanificate per UI, data contract, review queue e smoke test futuri

## Scopo

Questo documento definisce le fixture applicative non riservate per il MVP/V0 largo di TRAM.

Le fixture servono a testare:

- dashboard aggregata;
- overview gara;
- stato interno minimo dell’analisi TRAM;
- viste `T1`-`T8`;
- review queue;
- pannello fonte;
- audit e data policy;
- permessi owner/editor/reviewer/viewer;
- stati dashboard e stati valore.

Le fixture non sostituiscono i pacchetti reali. Sono un dataset applicativo controllato per sviluppare UI, data contract e test senza esporre dati riservati.

## Decisione

Le fixture MVP devono essere **sintetiche o sanificate**.

È ammesso rappresentare archetipi ispirati ai quattro pacchetti benchmark già analizzati, ma non copiare:

- testo integrale dei documenti;
- clausole reali;
- celle economiche reali;
- nomi di persone;
- formule riservate;
- file originali;
- contenuti L2;
- screenshot o preview dei documenti reali.

Ogni record deve essere verificabile come dato applicativo, non come estratto reale.

## Principi

1. Ogni valore mostrabile in UI deve avere `indicator_key`, stato e fonte sintetica o sanificata.
2. Ogni fonte deve puntare a un documento fixture, non a un file reale riservato.
3. Le fixture devono coprire casi sani, parziali, stale, bloccati e sensibili.
4. Le fixture devono permettere test deterministici: stesso input, stesso stato atteso.
5. Le fixture devono distinguere proposto, confermato, corretto, contestato, superato e da chiarire.
6. Le fixture devono includere errori e blocchi, non solo dati puliti.
7. Le fixture devono essere piccole abbastanza per sviluppo rapido, ma ricche abbastanza per T1-T8.
8. Le fixture devono distinguere lo stato della gara dallo stato interno dell’analisi TRAM.
9. Le fixture non devono simulare avanzamento dell’offerta preparata se l’offerta non è caricata.

## Formato consigliato

Decisione operativa del 2026-05-13:

- le fixture MVP/V0 nascono come **JSON fixture pack**;
- i JSON restano la source of truth iniziale per UI, test e validazione;
- appena nasce o cambia l’app Next.js, i JSON vengono validati con TypeScript/Zod o soluzione equivalente;
- quando esisterà uno schema Postgres stabile, eventuali seed DB saranno derivati dai JSON, non riscritti a mano come fonte separata.

Formato previsto:

```text
data/fixtures/mvp-wide/
  tram-mvp-wide-fixture-manifest.json
  tram-mvp-wide-tenders.json
  tram-mvp-wide-documents.json
  tram-mvp-wide-source-references.json
  tram-mvp-wide-indicators.json
  tram-mvp-wide-review-items.json
  tram-mvp-wide-domain-records.json
  tram-mvp-wide-route-network.json
  tram-mvp-wide-audit-events.json
```

Il prototipo applicativo ha già una prima fixture sintetica compatta; questa specifica resta il riferimento per completarla e verificarla.

Aggiornamento operativo del 2026-05-15: il prototipo Next usa per ora il fixture pack compatto `data/fixtures/tram-v1-mvp-synthetic-fixtures.json`, con sezione `route_networks` integrata e validata da Zod/Vitest. Il formato split `data/fixtures/mvp-wide/` resta il formato target quando servirà separare gli artefatti o derivare seed DB, ma non va duplicato finché il JSON compatto resta la fonte applicativa unica.

## Regole di sicurezza

Le fixture non devono contenere:

- percorsi dentro `data/packages/`;
- nomi file originali se rivelano contenuto riservato;
- testo estratto reale;
- importi, formule o valori di celle economiche reali;
- riferimenti personali;
- chiavi, token, path SSH o `.env`;
- clausole di riservatezza copiate;
- output AI reali su contenuto L1/L2 non sanificato.

I riferimenti fonte devono usare placeholder espliciti:

```text
Documento fixture: FX-COP-DOC-001
Pagina: p. 12
Sezione: "Submission timetable"
Snippet: "[estratto sintetico sanificato]"
```

## Aggiornamento Fase 2 - networked control room

La Fase 2 deve trasformare le fixture da semplice dataset T1-T8 a dataset utilizzabile per una **networked control room**. La metafora rete/linea non deve produrre dati decorativi: deve rendere visibili stati, fonti, review, Q&A, Financials e Criticità come nodi collegati del Tender.

La route strip e le connessioni di rete sono fixture derivate. Non sostituiscono `IndicatorValue`, `ReviewItem`, `SourceReference`, `FinancialItem` o `ClarificationThread`.

### Regole fixture per la rete Tender

1. Ogni gara deve avere una `TenderRouteStrip` con 8 nodi primari.
2. Ogni nodo deve puntare a route, indicatori, review item e fonti già presenti.
3. Ogni connessione deve spiegare una relazione operativa, non una decorazione grafica.
4. I colori `route-*` vengono usati come token funzionali, non come palette libera.
5. Financials è un nodo ordinario e analizzabile del Tender; diventa bloccato solo per L2 effettivo, policy, quota, provider o minimizzazione.

### Nodi route minimi

| `node_key` | Label UI | Token | Alimentato da | Stato da coprire |
| --- | --- | --- | --- | --- |
| `documents` | Documenti | `route-document` | T1 document map, version conflict, changed docs | current, stale, conflict |
| `timeline` | Timeline | `route-core` | T2 deadline, date relative, MPP/PDF | confirmed, unclear, contested |
| `deliverables` | Deliverables | `route-core` | T3 checklist e mandatory | confirmed, proposed, unclear |
| `requirements` | Requisiti | `route-core` | T4 requisiti O&M, KPI e compliance | confirmed, proposed, contested |
| `q_and_a` | Q&A | `route-qna` | T8 thread, risposte ente, addendum | draft, answered, blocked |
| `financials` | Financials | `route-financials` | T5 FinancialItem, AI gate, review | proposed, confirmed, blocked solo se L2 effettivo |
| `cost_drivers` | Cost driver | `route-core` | T6 driver e link T4/T5 | proposed, high risk |
| `criticalities` | Criticità | `route-risk` | T7 candidate issue | critical, high, superseded |

Review e audit non sono nodi primari: restano contesti trasversali collegati tramite `review_item_ids`, `audit_event_ids` futuri e route dedicate.

Su mobile la fixture deve mantenere tutti gli 8 nodi primari. La UI può renderli più compatti o in scroll orizzontale, ma non deve ridurre il set funzionale.

### Scenari route per archetipo

| Tender | Nodo primario | Connessioni obbligatorie | Esito UI atteso |
| --- | --- | --- | --- |
| Metro O&M Nord | `timeline` | `documents -> timeline`, `timeline -> criticalities`, `financials -> cost_drivers`, `q_and_a -> timeline` | route rossa/ambra, con mismatch MPP/PDF e Financials da validare in contesto review |
| Light Rail O&M Est | `documents` | `documents -> deliverables`, `financials -> cost_drivers`, `requirements -> documents` | route quasi stabile, con redline e Financials analizzato da review contestuale |
| Bus extraurbano multi-lotto | `documents` | `q_and_a -> timeline`, `q_and_a -> documents`, `financials -> cost_drivers`, `financials -> criticalities` | route stale per nuovo addendum e PEF da analizzare |
| Metro PPP Qualification | `deliverables` | `documents -> deliverables`, `requirements -> deliverables`, `criticalities -> documents` | route verde, Financials `not_applicable` o informativo |

### Connessioni route minime

| `route_edge_id` | Tender | Da | A | Relazione | Stato |
| --- | --- | --- | --- | --- | --- |
| `edge_fx_cop_docs_timeline` | Metro O&M Nord | `documents` | `timeline` | `source_to_review` | contested |
| `edge_fx_cop_qna_timeline` | Metro O&M Nord | `q_and_a` | `timeline` | `qna_updates_timeline` | unclear |
| `edge_fx_cop_fin_cost` | Metro O&M Nord | `financials` | `cost_drivers` | `financials_links_cost_driver` | proposed |
| `edge_fx_luas_fin_cost` | Light Rail O&M Est | `financials` | `cost_drivers` | `financials_links_cost_driver` | proposed |
| `edge_fx_milano_addendum_stale` | Bus extraurbano multi-lotto | `q_and_a` | `documents` | `addendum_stales_node` | stale_due_to_new_docs |
| `edge_fx_metro_requirements_deliverables` | Metro PPP Qualification | `requirements` | `deliverables` | `source_to_review` | confirmed |

### Fixture AI gate per Financials

Le fixture T5 devono dimostrare che l’AI può analizzare contenuti Financials ammessi, senza trattarli come area protetta per definizione.

| `audit_event_id` | Tender | Task | Privacy | Stato | Scopo |
| --- | --- | --- | --- | --- | --- |
| `audit_fx_ai_t5_l1_allowed` | Metro O&M Nord | T5 | L1 | allowed | Financials minimizzato ammesso dopo policy |
| `audit_fx_ai_t5_milano_pending` | Bus extraurbano multi-lotto | T5 | L1 | pending_owner_approval | PEF sintetico da autorizzare |
| `audit_fx_ai_l2_internal_offer_blocked` | Metro O&M Nord | T5 | L2 | blocked | nota interna offerta non inviabile a provider esterno |

Nessuna fixture deve usare espressioni come “tratta protetta” per Financials. Il blocco è sempre una conseguenza di classificazione, policy o quota, non della categoria T5.

## Archetipi gara

Le fixture MVP/V0 usano cinque gare sintetiche: quattro archetipi principali più una variante `draft` minima per coprire lo stato iniziale. Il campo tecnico resta `tender_id`, ma la UI deve parlare di gare.

| `tender_id` | Nome UI | Archetipo | Stato dashboard | Scopo fixture |
| --- | --- | --- | --- | --- |
| `tender_fx_cop_metro_om` | Metro O&M Nord | ITT O&M metro | `open_critical_issues` | versioning, MPP/PDF mismatch, Financials da validare, Q&A |
| `tender_fx_luas_light_rail_om` | Light Rail O&M Est | ITN O&M light rail | `partially_validated` | redline, data room, maintenance plans, financial model analizzato |
| `tender_fx_milano_bus_lots` | Bus extraurbano multi-lotto | ITT bus multi-lotto | `stale_due_to_new_docs` | lotti, PEF da analizzare, GTFS fixture, Q&A che modifica deadline |
| `tender_fx_metrolink_ppp_pq` | Metro PPP Qualification | prequalifica/PQP PPP | `validated_internal` | qualification envelope, standing, reference projects, meno obblighi O&M |
| `tender_fx_depot_ebus_om` | Deposito E-Bus O&M | bozza iniziale deposito elettrico | `draft` | pacchetto iniziale incompleto, utile a testare stato non processato |

Questi nomi sono descrittivi e sintetici. Non devono essere trattati come nomi ufficiali di gara.

## Utenti e ruoli fixture

| `user_id` | Ruolo primario | Note |
| --- | --- | --- |
| `user_owner_001` | owner | può approvare L1 ed export Q&A |
| `user_editor_001` | editor | può caricare e avviare parsing |
| `user_reviewer_001` | reviewer | può chiudere blocker e validare indicatori |
| `user_viewer_001` | viewer | non vede L2 e non valida |

Ogni gara deve includere membership per i quattro utenti, con almeno una variazione:

- in `tender_fx_cop_metro_om`, reviewer può vedere L2;
- in `tender_fx_milano_bus_lots`, viewer vede stato Financials ma non eventuali contenuti L2 effettivi collegati a note interne;
- in `tender_fx_metrolink_ppp_pq`, editor non può approvare L1.

## Documenti fixture T1

Ogni documento fixture deve avere:

- `document_version_id`;
- `tender_id`;
- `document_family_key`;
- `title_normalized`;
- `filename_display`;
- `version_label`;
- `variant_type`;
- `currentness`;
- `privacy_level`;
- `review_required`;
- `parser_status`.

### Set minimo documenti

| `document_version_id` | Tender | Famiglia | Variante | Currentness | Privacy | Stato atteso |
| --- | --- | --- | --- | --- | --- | --- |
| `doc_fx_cop_instructions_v2_clean` | Metro O&M Nord | instructions | clean | current | L1 | confermato |
| `doc_fx_cop_instructions_v2_track` | Metro O&M Nord | instructions | track_changes | superseded | L1 | review versioning |
| `doc_fx_cop_schedule_mpp` | Metro O&M Nord | procurement_schedule | mpp | current | L1 | mismatch timeline |
| `doc_fx_cop_payment_attachment` | Metro O&M Nord | payment | workbook | current | L1 | Financials analizzabile |
| `doc_fx_luas_contract_redline` | Light Rail O&M Est | contract | redline | candidate | L1 | review currentness |
| `doc_fx_luas_maintenance_plan` | Light Rail O&M Est | maintenance | pdf | current | L1 | deliverable/requisiti |
| `doc_fx_luas_financial_model` | Light Rail O&M Est | financial_model | workbook | current | L1 | analisi AI ammessa se policy ok |
| `doc_fx_milano_disciplinare` | Bus extraurbano multi-lotto | instructions | pdf | current | L1 | fonte T2/T3 |
| `doc_fx_milano_pef` | Bus extraurbano multi-lotto | financial_model | workbook | current | L1 | review obbligatoria |
| `doc_fx_milano_addendum_deadline` | Bus extraurbano multi-lotto | clarification | pdf | current | L1 | rende dashboard stale |
| `doc_fx_metro_pqp` | Metro PPP Qualification | prequalification | pdf | current | L1 | PQP validated |
| `doc_fx_metro_references_form` | Metro PPP Qualification | qualification_form | template | current | L1 | deliverable qualification |

## Source reference fixture

Ogni source reference deve essere sintetica o sanificata.

Campi minimi:

| Campo | Uso |
| --- | --- |
| `source_ref_id` | identificativo stabile |
| `document_version_id` | documento fixture |
| `location_type` | page, section, table, cell, mpp_row, synthetic_note |
| `location_label` | riferimento leggibile |
| `snippet_sanitized` | estratto sintetico, mai testo reale |
| `confidence` | high, medium, low, not_calculable |

### Set minimo fonti

| `source_ref_id` | Documento | Location | Snippet sanificato |
| --- | --- | --- | --- |
| `src_fx_cop_deadline_pdf` | `doc_fx_cop_instructions_v2_clean` | p. 12, schedule table | deadline revised tender indicata da tabella sanificata |
| `src_fx_cop_deadline_mpp` | `doc_fx_cop_schedule_mpp` | MPP row 42 | milestone revised tender con data diversa dalla tabella PDF |
| `src_fx_cop_payment` | `doc_fx_cop_payment_attachment` | workbook sheet placeholder | struttura payment presente, valori non esposti |
| `src_fx_luas_redline` | `doc_fx_luas_contract_redline` | p. 4, change summary | redline candidata non ancora riconciliata |
| `src_fx_luas_maintenance` | `doc_fx_luas_maintenance_plan` | p. 20, section heading | piano manutenzione richiesto come deliverable |
| `src_fx_milano_submission` | `doc_fx_milano_disciplinare` | p. 8, busta tecnica | offerta tecnica obbligatoria |
| `src_fx_milano_addendum` | `doc_fx_milano_addendum_deadline` | p. 2, clarification | chiarimento modifica o rende ambigua una scadenza |
| `src_fx_milano_pef` | `doc_fx_milano_pef` | workbook placeholder | PEF presente, chunk sintetico analizzabile |
| `src_fx_metro_pq_stage` | `doc_fx_metro_pqp` | p. 1, heading | pacchetto qualificazione, non ITT |
| `src_fx_metro_references` | `doc_fx_metro_references_form` | template field | referenze progetto richieste |

## Indicator value fixture

Ogni indicatore deve usare una chiave registrata nel registro P0/P1.

Campi minimi:

| Campo | Uso |
| --- | --- |
| `indicator_value_id` | identificativo stabile |
| `tender_id` | id tecnico gara |
| `indicator_key` | chiave canonica |
| `value_preview` | valore sintetico o placeholder |
| `value_state` | proposed, confirmed, corrected, contested, unclear, superseded, not_applicable |
| `source_ref_ids` | lista fonti |
| `review_item_id` | opzionale |
| `is_headline` | visibile in overview o dashboard |

### P0 minimi per gara

Ogni gara deve avere almeno questi P0:

- `tender.identity.name`;
- `tender.identity.package_type`;
- `tender.identity.transport_mode`;
- `authority.name`;
- `authority.country`;
- `procurement.stage.current`;
- `procurement.deadline.next_critical`;
- `procurement.deadline.submission`;
- `documents.total_count`;
- `documents.current_count`;
- `documents.changed_since_last_review_count`;
- `documents.version_conflict_count`;
- `review.items.blocking_count`;
- `dashboard.validation_state.overall`;
- `ai.external_use.status`.

Ogni gara deve inoltre avere uno stato interno manuale minimo:

- owner operativo;
- stato analisi tecnica;
- stato analisi economica;
- stato analisi amministrativa;
- prossima azione;
- eventuale blocker;
- ultimo aggiornamento.

### Indicatori scenario

| `indicator_value_id` | Tender | `indicator_key` | Stato | Scopo UI |
| --- | --- | --- | --- | --- |
| `ind_fx_cop_stage` | Metro O&M Nord | `procurement.stage.current` | confirmed | stage ITT/negotiation |
| `ind_fx_cop_next_deadline` | Metro O&M Nord | `procurement.deadline.next_critical` | unclear | mostra conflitto MPP/PDF |
| `ind_fx_cop_payment_status` | Metro O&M Nord | `financial.payment_mechanism.summary` | proposed | Financials da validare |
| `ind_fx_luas_contract_currentness` | Light Rail O&M Est | `documents.version_conflict_count` | proposed | redline/candidate |
| `ind_fx_luas_maintenance_deliv` | Light Rail O&M Est | `deliverables.mandatory_count` | confirmed | checklist deliverable |
| `ind_fx_milano_changed_docs` | Bus extraurbano multi-lotto | `documents.changed_since_last_review_count` | confirmed | stato stale |
| `ind_fx_milano_financial_review` | Bus extraurbano multi-lotto | `financial.review_count` | proposed | review Financials |
| `ind_fx_metro_package_type` | Metro PPP Qualification | `tender.identity.package_type` | confirmed | prequalifica/PQP |
| `ind_fx_metro_requirements` | Metro PPP Qualification | `requirements.mandatory_count` | proposed | requisiti qualification |
| `ind_fx_metro_dashboard_state` | Metro PPP Qualification | `dashboard.validation_state.overall` | confirmed | validated_internal |

## Review item fixture

La review queue deve contenere item distribuiti tra `T1`-`T8`.

Campi minimi:

| Campo | Uso |
| --- | --- |
| `review_item_id` | identificativo stabile |
| `tender_id` | id tecnico gara |
| `task` | T1-T8 |
| `family` | timeline, financials, deliverables, requirements, versioning, contradictions, clarifications, audit |
| `title` | titolo breve |
| `risk_class` | critical, high, medium, low |
| `blocking` | boolean |
| `status` | proposed, confirmed, corrected, contested, unclear, superseded, not_applicable |
| `source_ref_ids` | fonti |
| `linked_indicator_keys` | indicatori collegati |
| `allowed_actions` | azioni UI |

### Set minimo review queue

| `review_item_id` | Task | Famiglia | Rischio | Blocking | Titolo sintetico |
| --- | --- | --- | --- | --- | --- |
| `rev_fx_t1_cop_track_clean` | T1 | versioning | high | sì | Decidere se clean copy supera track changes |
| `rev_fx_t2_cop_mpp_pdf` | T2 | timeline | critical | sì | Risolvere mismatch deadline tra MPP e PDF |
| `rev_fx_t3_milano_pef` | T3 | deliverables | critical | sì | Classificare PEF come deliverable economico da review |
| `rev_fx_t4_luas_kpi` | T4 | KPI | high | sì | Validare KPI manutenzione con target sanificato |
| `rev_fx_t5_cop_payment` | T5 | Financials | critical | sì | Validare stato meccanismo di remunerazione senza esporre valori |
| `rev_fx_t6_milano_energy` | T6 | cost_driver | high | no | Confermare driver energia come rischio operativo |
| `rev_fx_t7_cop_deadline_issue` | T7 | contradictions | critical | sì | Candidate contradiction su deadline revised tender |
| `rev_fx_t8_cop_clarification` | T8 | clarifications | critical | sì | Approvare o bloccare chiarimento su deadline |
| `rev_fx_audit_l1_policy` | audit | data_policy | high | no | Approvare L1 esterna dopo clause scan |
| `rev_fx_low_doc_role` | T1 | document_map | low | no | Confermare ruolo documento non critico |

## Timeline fixture T2

Campi minimi:

- `timeline_event_id`;
- `tender_id`;
- `event_type`;
- `timeline_type`;
- `date_display`;
- `date_precision`;
- `is_relative`;
- `source_ref_ids`;
- `review_item_id`;
- `linked_deliverable_ids`.

Set minimo:

| `timeline_event_id` | Tender | Tipo | Stato | Caso coperto |
| --- | --- | --- | --- | --- |
| `tl_fx_cop_revised_pdf` | Metro O&M Nord | `revised_tender` | unclear | fonte PDF |
| `tl_fx_cop_revised_mpp` | Metro O&M Nord | `revised_tender` | contested | fonte MPP divergente |
| `tl_fx_milano_questions_relative` | Bus extraurbano multi-lotto | `clarification_deadline` | unclear | data relativa |
| `tl_fx_luas_service_start` | Light Rail O&M Est | `service_start` | proposed | milestone contratto |
| `tl_fx_metro_pq_submission` | Metro PPP Qualification | `submission_deadline` | confirmed | deadline PQP |

## Deliverables fixture T3

Campi minimi:

- `deliverable_id`;
- `tender_id`;
- `code`;
- `name_display`;
- `deliverable_type`;
- `submission_area`;
- `mandatory`;
- `format_requirement`;
- `page_limit`;
- `deadline_ref`;
- `sensitive_flag`;
- `source_ref_ids`;
- `review_item_id`.

Set minimo:

| `deliverable_id` | Tender | Tipo | Area | Sensitive | Stato |
| --- | --- | --- | --- | --- | --- |
| `del_fx_milano_offerta_tecnica` | Bus extraurbano multi-lotto | `technical_methodology` | technical | no | proposed |
| `del_fx_milano_pef` | Bus extraurbano multi-lotto | `financial_model` | financial | no | unclear |
| `del_fx_cop_schedule_prices` | Metro O&M Nord | `pricing_workbook` | pricing | no | proposed |
| `del_fx_luas_maintenance_plan` | Light Rail O&M Est | `maintenance_plan` | technical | no | confirmed |
| `del_fx_metro_references` | Metro PPP Qualification | `qualification_evidence` | qualification | no | confirmed |
| `del_fx_cop_comments` | Metro O&M Nord | `comments_to_tender_documents` | legal | sì | proposed |

`sensitive_flag` non va acceso per il solo fatto che il deliverable sia economico. Va usato per contenuti L2 effettivi o per casi in cui policy/clausole rendono il contenuto non esportabile o non analizzabile esternamente.

## Requisiti e KPI fixture T4

Set minimo:

| `requirement_id` | Tender | Dominio | Tipo | Stato | Review |
| --- | --- | --- | --- | --- | --- |
| `req_fx_luas_maintenance_kpi` | Light Rail O&M Est | maintenance | KPI | proposed | sì |
| `req_fx_cop_service_availability` | Metro O&M Nord | operations | KPI | unclear | sì |
| `req_fx_milano_reporting` | Bus extraurbano multi-lotto | operations | requirement | proposed | sì |
| `req_fx_metro_reference_projects` | Metro PPP Qualification | qualification | requirement | confirmed | no |
| `req_fx_luas_cyber` | Light Rail O&M Est | compliance | requirement | proposed | sì |
| `req_fx_milano_accessibility` | Bus extraurbano multi-lotto | customer | requirement | proposed | campione |

Nessuna fixture T4 deve contenere formule reali copiate da documenti. I target possono essere placeholder come `target_sanitized`.

## Financial fixture T5

Set minimo:

| `financial_item_id` | Tender | Classe | Privacy | Stato | UI attesa |
| --- | --- | --- | --- | --- | --- |
| `fin_fx_cop_payment_summary` | Metro O&M Nord | payment_mechanism | L1 | proposed | AI analysis + review |
| `fin_fx_cop_pricing_workbook` | Metro O&M Nord | pricing_workbook | L1 | proposed | no valori non validati in overview |
| `fin_fx_milano_pef_present` | Bus extraurbano multi-lotto | financial_model | L1 | unclear | AI analysis da completare |
| `fin_fx_luas_model_present` | Light Rail O&M Est | financial_model | L1 | proposed | review dopo AI |
| `fin_fx_cop_penalties` | Metro O&M Nord | penalties | L1 | proposed | collegamento KPI |

Regola: `value_preview` può usare descrizioni come “presente”, “da review”, “struttura rilevata” o valori sintetici non reali. In overview non mostrare valori non validati.

## Cost driver fixture T6

Set minimo:

| `cost_driver_id` | Tender | Dominio | Risk | Financials-linked | Stato |
| --- | --- | --- | --- | --- | --- |
| `cost_fx_milano_energy` | Bus extraurbano multi-lotto | energy | high | sì | proposed |
| `cost_fx_luas_asset_renewal` | Light Rail O&M Est | maintenance | high | sì | proposed |
| `cost_fx_cop_reporting` | Metro O&M Nord | reporting | medium | no | confirmed |
| `cost_fx_metro_references_burden` | Metro PPP Qualification | qualification | medium | no | confirmed |
| `cost_fx_luas_workforce_training` | Light Rail O&M Est | workforce | high | no | proposed |

Nessun cost driver deve avere importo stimato se non esiste formula esplicita sanificata.

## Criticità candidate fixture T7

Set minimo:

| `contradiction_id` | Tender | Tipo | Severity | Stato | Azione |
| --- | --- | --- | --- | --- | --- |
| `con_fx_cop_deadline_mismatch` | Metro O&M Nord | timeline | critical | proposed | review + chiarimento |
| `con_fx_cop_version_clean_track` | Metro O&M Nord | versioning | high | proposed | review currentness |
| `con_fx_milano_deadline_addendum` | Bus extraurbano multi-lotto | timeline | high | unclear | review |
| `con_fx_luas_redline_contract` | Light Rail O&M Est | versioning | medium | proposed | compare docs |
| `con_fx_cop_payment_kpi_link` | Metro O&M Nord | financial | high | proposed | review T5/T4 |

T7 deve sempre mostrare “candidate issue” o equivalente UI. Non usare “contraddizione confermata” finché non esiste `ValidationAction`.

## Q&A fixture T8

In TRAM una query è uno scambio Q&A tra bidder e stazione appaltante. La fixture T8 deve quindi rappresentare thread operativi, non solo bozze isolate.

Il campione CPH 2026-05-08 conferma il formato da coprire nelle fixture, senza copiarne contenuti reali: workbook con colonne `No.`, `Subject`, `Document reference`, `Question`, `Answer`, `Clarification/Correction`. Le fixture devono quindi includere almeno un registro Q&A sintetico con righe `clarification`, righe `correction`, riferimenti documentali presenti e mancanti, e allegato citato ma non disponibile.

Le fixture devono mostrare almeno un chiarimento che integra la documentazione, una correzione che supera una previsione precedente e una risposta che non può essere incorporata perché mancano gli allegati collegati.

Set minimo:

| `clarification_thread_id` | Tender | Stato | Sensibilità | Linked item | UI attesa |
| --- | --- | --- | --- | --- | --- |
| `clar_fx_cop_deadline` | Metro O&M Nord | under_review | L1 | `rev_fx_t2_cop_mpp_pdf` | non esportabile finché non approvata |
| `clar_fx_cop_internal_offer_note` | Metro O&M Nord | blocked_sensitive | L2 | `rev_fx_t5_cop_payment` | bloccata perché contiene nota interna offerta |
| `clar_fx_milano_deadline` | Bus extraurbano multi-lotto | draft_question | L1 | `rev_fx_t7_cop_deadline_issue` | modificabile |
| `clar_fx_luas_redline` | Light Rail O&M Est | dismissed | L1 | `rev_fx_t1_cop_track_clean` | archiviata |
| `clar_fx_metro_references` | Metro PPP Qualification | approved_for_export | L0 | `req_fx_metro_reference_projects` | export manuale possibile |
| `clar_fx_milano_answer_deadline` | Bus extraurbano multi-lotto | answered | L1 | `rev_fx_t2_milano_addendum` | risposta ricevuta da incorporare |

Nessuna fixture di chiarimento deve usare testo pronto per invio reale o risposta reale. I campi testo possono essere placeholder:

```text
[bozza sintetica sanificata con fonte, domanda da approvare e risposta sintetica se presente]
```

## Audit e AI gate fixture

Set minimo:

| `audit_event_id` | Tipo | Tender | Stato | Scopo |
| --- | --- | --- | --- | --- |
| `audit_fx_parse_success` | parsing | Metro O&M Nord | completed | job riuscito |
| `audit_fx_parse_error_xls` | parsing | Bus extraurbano multi-lotto | failed | parser issue workbook |
| `audit_fx_ai_l0_allowed` | ai_gate | Metro PPP Qualification | allowed | L0 ammesso |
| `audit_fx_ai_l1_pending` | ai_gate | Metro O&M Nord | pending_owner_approval | L1 da approvare |
| `audit_fx_ai_t5_l1_allowed` | ai_gate | Metro O&M Nord | allowed | Financials L1 ammesso su input minimizzato |
| `audit_fx_ai_l2_blocked` | ai_gate | Metro O&M Nord | blocked | L2 bloccato |
| `audit_fx_quota_exhausted` | ai_call | Light Rail O&M Est | suspended | quota gratuita esaurita |
| `audit_fx_review_action` | validation | Metro PPP Qualification | completed | azione reviewer |

## Dashboard state fixture

Ogni stato dashboard deve essere coperto:

| Stato | Tender fixture | Causa |
| --- | --- | --- |
| `draft` | Deposito E-Bus O&M | documenti non processati |
| `partially_validated` | Light Rail O&M Est | P0 presenti ma review aperte |
| `validated_internal` | Metro PPP Qualification | P0 confermati e nessun blocker |
| `stale_due_to_new_docs` | Bus extraurbano multi-lotto | addendum nuovo dopo review |
| `open_critical_issues` | Metro O&M Nord | blocker deadline/payment/Q&A |

Il valore `dashboard.validation_state.overall` deve essere calcolabile dagli indicatori e dai review item, non inserito come testo libero scollegato.

## Coverage per route

| Route | Fixture obbligatorie |
| --- | --- |
| `/tenders` | quattro gare, stati diversi, P0 aggregati |
| `/overview` | headline P0, Tender route strip, stato gara, stato analisi TRAM, blocker, policy, stato AI/review Financials |
| `/documents` | documenti correnti, superati, L2, version conflict |
| `/timeline` | evento confermato, relativo, conflittuale, superato |
| `/deliverables` | mandatory, tecnico, economico, qualification |
| `/requirements` | requisito, KPI, compliance, link T5/T6 |
| `/financials` | Financials L0/L1 analizzabili, eventuale L2 effettivo bloccato, parser issue |
| `/cost-drivers` | high/critical, financial-linked, no importi |
| `/contradictions` | candidate issue, fonti affiancate, status review |
| `/queries` | draft_question, blocked_sensitive, approved_for_export, answered, dismissed |
| `/review` | item T1-T8, azioni review, blocker |
| `/audit` | job, AI gate, quota, policy, validation action |

## Coverage per permessi

Le fixture devono permettere questi test:

- owner vede L2 e approva L1;
- editor avvia parsing ma non chiude blocker;
- reviewer chiude blocker e valida indicatori;
- viewer vede dashboard ma non L2;
- viewer vede messaggio esplicito quando una fonte L2 è bloccata;
- editor crea thread di chiarimento ma non approva export;
- reviewer delegato può approvare export solo nello scenario previsto;
- quota esaurita blocca job per tutti i ruoli.

## Coverage stati valore

Le fixture devono includere almeno un indicatore per ciascuno stato:

| Stato | Esempio fixture |
| --- | --- |
| `proposed` | sintesi meccanismo di remunerazione |
| `confirmed` | package type PQP |
| `corrected` | deadline corretta da reviewer |
| `contested` | data MPP divergente |
| `unclear` | deadline relativa Milano |
| `superseded` | instructions track changes |
| `not_applicable` | meccanismo di remunerazione su prequalifica |

## Validation action fixture

Set minimo azioni:

| `validation_action_id` | Azione | Item | Effetto atteso |
| --- | --- | --- | --- |
| `val_fx_confirm_pq_stage` | confirm | `ind_fx_metro_package_type` | resta `validated_internal` |
| `val_fx_correct_deadline` | correct | `rev_fx_t2_cop_mpp_pdf` | aggiorna indicatore deadline |
| `val_fx_contest_payment` | contest | `rev_fx_t5_cop_payment` | mantiene blocker Financials |
| `val_fx_mark_unclear_clarification` | mark_unclear | `rev_fx_t8_cop_clarification` | Q&A resta under_review |
| `val_fx_supersede_track` | mark_superseded | `rev_fx_t1_cop_track_clean` | track changes superato |
| `val_fx_not_applicable_payment_pq` | mark_not_applicable | payment PQP | Financials non applicabile |

## Manifest fixture

Il manifest futuro deve dichiarare:

- versione fixture;
- data;
- stato;
- autore o processo;
- nessun contenuto riservato;
- documenti coperti;
- route coperte;
- stati dashboard coperti;
- ruoli coperti;
- numero record per entità;
- hash dei file fixture se saranno creati.

Campi suggeriti:

| Campo | Esempio |
| --- | --- |
| `fixture_pack_id` | `tram_mvp_wide_v0_1` |
| `privacy_status` | `synthetic_or_sanitized_only` |
| `covers_routes` | `/tenders`, `/overview`, `T1`-`T8`, `/review`, `/audit` |
| `contains_real_documents` | `false` |
| `contains_l2_values` | `false` |
| `expected_dashboard_states` | tutti e cinque gli stati MVP |
| `contains_route_network` | `true` |

## Coverage di chiusura Fase 2

Il fixture pack compatto `data/fixtures/tram-v1-mvp-synthetic-fixtures.json` chiude la Fase 2 con questa copertura minima:

| Entità | Target | Fixture compatta |
| --- | ---: | ---: |
| Gare/Tender | 4+ | 5 |
| Stati dashboard MVP | 5 | 5 |
| Indicatori P0/P1 | 40 | 40 |
| Source reference | 30 | 30 |
| Document version | 10 | 10 |
| Review item | 10 | 10 |
| Thread Q&A | 5 | 5 |
| Criticità candidate | 5 | 5 |
| Eventi timeline | 5 | 5 |
| Deliverable | 6 | 6 |
| Requisiti/KPI | 6 | 6 |
| Financial item | 5 | 5 |
| Cost driver | 5 | 5 |
| Audit event | 6 | 6 |
| Route network | una per gara | 5 |

Ogni `route_network` contiene gli 8 nodi primari Documenti, Timeline, Deliverables, Requisiti, Q&A, Financials, Cost driver e Criticità. Review e audit restano contesti trasversali.

## Acceptance criteria fixture

Le fixture MVP sono pronte quando:

- rappresentano almeno quattro gare archetipali;
- coprono tutte le route definite nei wireframe;
- coprono `T1`-`T8`;
- contengono almeno un caso per ogni stato dashboard;
- contengono almeno un caso per ogni stato valore;
- contengono almeno dieci review item con rischio e blocking variabili;
- contengono almeno cinque source reference sintetiche per T1/T2/T3 e almeno una per T4-T8;
- contengono una route strip per ogni gara, con nodi e connessioni coerenti con la direzione networked control room;
- nessun record punta a file reali in `data/packages/`;
- nessun record contiene valori economici reali;
- ogni chiarimento resta candidate, draft_question, under_review, blocked, answered, dismissed, incorporated o approved_for_export manuale;
- ogni AI gate è coerente con data policy e privacy level;
- i permessi owner/editor/reviewer/viewer producono differenze visibili.

## Debiti non chiusi

- Estendere lo schema tecnico JSON quando il fixture pack verrà diviso o quando nascerà lo schema Postgres.
- Estendere il validatore TypeScript/Zod dei JSON quando il fixture pack verrà diviso in file `mvp-wide`.
- Derivare eventuale seed DB dai JSON quando esisterà schema Postgres stabile.
- Creare fisicamente `tram-mvp-wide-route-network.json` solo quando si decide lo split del fixture pack compatto.
- Creare mini pacchetto sintetico se servirà testare upload reale.
- Estendere il validatore automatico per casi futuri non coperti dal fixture pack compatto.

## Collegamento data contract

Il data contract MVP che usa queste fixture come base è documentato in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-data-contract-v0-1.md`.

## Prossimo passo consigliato

La checklist di sviluppo/verifica MVP è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-development-verification-checklist-v0-1.md`.

Prossimo passo consigliato: usare il fixture pack compatto chiuso, insieme al data contract Fase 3, come base per **Fase 4 - prototipo applicativo su fixture**, senza separare ancora fisicamente il pack `mvp-wide` finché il JSON unico resta più efficace per UI e test.
