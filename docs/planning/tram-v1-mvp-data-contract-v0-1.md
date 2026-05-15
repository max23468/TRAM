# TRAM V1 - Data contract MVP v0.1

Data: 2026-05-13  
Ultimo aggiornamento: 2026-05-15  
Stato: Fase 3 chiusa su data contract MVP/V0 e fixture compatte `0.2.0`  
Ambito: shape dati minime per UI, fixture, review queue, indicatori, fonti, audit e permessi

## Scopo

Questo documento definisce il data contract MVP/V0 di TRAM.

Non è uno schema database definitivo. È il contratto minimo che deve permettere a wireframe, fixture e implementazione applicativa di parlare la stessa lingua.

Serve a stabilire:

- quali shape dati servono alla UI;
- quali campi sono obbligatori nel MVP;
- quali stati ed enum devono essere coerenti;
- quali relazioni devono essere navigabili;
- quali dati possono restare derivati o calcolati;
- quali informazioni sono necessarie per fonti, review, audit, policy e permessi.

## Fonti governanti

Questo data contract deriva da:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-data-model.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-key-registry-p0-p1-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-functional-wireframes-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-application-fixtures-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-roles-permissions-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-tender-data-policy-v0-1.md`
- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ingestion-to-dashboard-workflow-v0-1.md`

## Principi

1. Ogni dato headline deve avere stato e fonte, oppure stato esplicito di non disponibilità.
2. Ogni valore in dashboard deve usare un `indicator_key` registrato.
3. `SourceReference` deve essere apribile da dashboard, viste specialistiche e review queue.
4. `ReviewItem` è il meccanismo centrale per blocchi, correzioni e validazione.
5. Financials, Q&A, L2 e AI esterna devono portare sempre data policy e permessi nella UI.
6. Gli stati derivati, come `dashboard.validation_state.overall`, devono essere calcolabili da indicatori, review e documenti.
7. Le fixture devono poter implementare questo contract senza contenuti riservati.

## Convenzioni

### Identificativi

Nel MVP/V0 ogni record esposto alla UI deve avere un id stabile testuale o UUID.

Per fixture e test si usano id leggibili:

- `tender_fx_cop_metro_om`;
- `doc_fx_cop_instructions_v2_clean`;
- `src_fx_cop_deadline_pdf`;
- `rev_fx_t2_cop_mpp_pdf`.

In produzione potranno diventare UUID, ma la UI non deve dipendere dal formato.

### Date

Date e datetime devono essere trasmesse in formato ISO quando note. La UI può mostrare una `display_label` per date relative, incerte o parziali.

Campi temporali consigliati:

- `date_value`: ISO date/datetime/null;
- `display_label`: testo UI;
- `precision`: date, datetime, month, quarter, year, relative, unknown;
- `timezone`: string/null;
- `is_relative`: boolean.

### Privacy level

Valori MVP:

- `L0`;
- `L1`;
- `L2`.

L2 non deve essere inviato a provider esterni in V1 default e non deve essere visibile a `viewer`.

## Enum MVP

### Stati valore

```text
extracted
proposed
confirmed
corrected
contested
unclear
superseded
not_applicable
```

Nota: il registro `indicator_key` usa soprattutto gli stati da `proposed` in avanti. `extracted` resta utile per dati tecnici non ancora normalizzati.

### Stati dashboard

```text
draft
partially_validated
validated_internal
stale_due_to_new_docs
open_critical_issues
```

### Risk class

```text
critical
high
medium
low
```

### Automation source

```text
deterministic
rule_based
ai_extraction
ai_reasoning
normalizer
manual
mixed
```

### Review action

```text
confirm
correct
contest
mark_unclear
mark_superseded
mark_not_applicable
request_more_evidence
regenerate
create_clarification_thread
approve_for_export
dismiss
```

### Ruoli gara

```text
owner
editor
reviewer
viewer
```

## Shape core

## `TenderSummary`

Usato da `/tenders`.

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `tender_id` | string | sì | id stabile |
| `name` | string | sì | nome UI |
| `authority_name` | string/null | sì | può essere null se non estratto |
| `country` | string/null | sì | testo o country code |
| `package_type` | enum/string/null | sì | da `tender.identity.package_type` |
| `transport_mode` | enum/list/null | sì | da `tender.identity.transport_mode` |
| `procurement_stage` | enum/string/null | sì | da `procurement.stage.current` |
| `next_critical_deadline` | `DateValue`/null | sì | da T2 |
| `dashboard_state` | dashboard state | sì | stato overall |
| `changed_documents_count` | number | sì | calcolato |
| `blocking_review_count` | number | sì | calcolato |
| `critical_contradiction_count` | number | sì | calcolato |
| `clarification_ready_count` | number | sì | thread Q&A con azione richiesta |
| `ai_external_use_status` | string | sì | sintesi policy |
| `last_updated_at` | datetime/null | sì | ultimo job o modifica |

Regola UI: se `dashboard_state=open_critical_issues`, la riga deve mostrare link diretto alla review filtrata.

## `TenderOverview`

Usato da `/tenders/:tender_id/overview`.

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `tender` | `TenderSummary` | sì | header e stato |
| `headline_indicators` | `IndicatorValue[]` | sì | P0 sopra la piega |
| `alert_band` | `AlertItem[]` | sì | stale, blocker, policy, quota |
| `section_cards` | `OverviewSection[]` | sì | blocchi T1-T8 |
| `route_strip` | `TenderRouteStrip` | sì | rete sintetica del Tender derivata da T1-T8 |
| `internal_work_status` | `InternalWorkStatusSummary` | sì | stato interno analisi TRAM |
| `policy_summary` | `TenderPolicySummary` | sì | L0/L1/L2 e clause scan |
| `recent_review_items` | `ReviewItemSummary[]` | sì | primi blocker |
| `recent_audit_events` | `AuditEventSummary[]` | sì | job/policy recenti |

`headline_indicators` deve includere almeno fase gara, prossima scadenza critica, stato documenti correnti, affidabilità dati, deliverables mandatory, review bloccanti, criticità candidate, Q&A da approvare o incorporare, stato Financials e stato AI/data policy.

Regola: `internal_work_status` non deriva automaticamente dai documenti di gara. Deriva da workflow TRAM, review item, job tecnici o input manuali espliciti. Non deve rappresentare avanzamento dell’offerta preparata se l’offerta non è caricata o modellata.

## `TenderRouteStrip`

Usato da `/tenders/:tender_id/overview` per la direzione **networked control room**. Non introduce una nuova fonte di verità: è uno strato UI derivato da indicatori, review item, stati dashboard, source reference e AI gate.

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `tender_id` | string | sì | id tecnico gara |
| `nodes` | `TenderRouteNode[]` | sì | nodi principali della rete Tender |
| `edges` | `TenderRouteEdge[]` | sì | connessioni sintetiche tra nodi |
| `overall_state` | dashboard state | sì | allineato a `DashboardValidationState` |
| `primary_blocker_node_key` | string/null | sì | nodo che spiega il blocco principale |
| `updated_at` | datetime/null | sì | ultimo aggiornamento dati derivati |

Regole:

- i nodi non devono essere editabili direttamente;
- un cambio review aggiorna il nodo solo tramite indicatori, review item o stati calcolati;
- la route strip espone sempre gli 8 nodi primari anche su mobile, usando densità compatta o scroll orizzontale;
- Financials è un nodo ordinario del Tender: è bloccato solo se l’item è L2 effettivo, policy-incompatibile, non minimizzabile o senza quota/provider ammesso.

## `TenderRouteNode`

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `route_node_id` | string | sì | id stabile |
| `tender_id` | string | sì | id tecnico gara |
| `node_key` | documents/timeline/deliverables/requirements/q_and_a/financials/cost_drivers/criticalities | sì | nodo primario della route Tender |
| `label_it` | string | sì | label breve UI |
| `route_token` | route-core/route-document/route-qna/route-review/route-financials/route-risk | sì | token visuale Fase 1C-bis |
| `state` | value state/dashboard state | sì | stato sintetico del nodo |
| `risk_class` | risk class/null | sì | rischio massimo collegato |
| `count_label` | string/null | sì | es. `3 blocker`, `12 doc`, `2 Q&A` |
| `target_route` | string | sì | route applicativa di drill-down |
| `source_ref_ids` | string[] | sì | fonti principali, se presenti |
| `review_item_ids` | string[] | sì | review collegate |
| `indicator_keys` | string[] | sì | indicatori che alimentano il nodo |
| `ai_gate_status` | string/null | sì | se il nodo dipende da AI/policy |
| `is_primary_blocker` | boolean | sì | evidenza overview |

Review e audit non sono `node_key` primari della route strip. Restano superfici contestuali, richiamate da `review_item_ids`, log attività e route dedicate.

## `TenderRouteEdge`

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `route_edge_id` | string | sì | id stabile |
| `tender_id` | string | sì | id tecnico gara |
| `from_node_key` | string | sì | nodo origine |
| `to_node_key` | string | sì | nodo destinazione |
| `relation_type` | source_to_review/qna_updates_timeline/financials_links_cost_driver/addendum_stales_node/review_validates_node/criticality_blocks_dashboard | sì | tipo relazione |
| `state` | value state/dashboard state | sì | stato della connessione |
| `source_ref_ids` | string[] | sì | fonti che giustificano la connessione |
| `review_item_ids` | string[] | sì | review collegate |
| `label_it` | string/null | sì | testo UI breve |

## `InternalWorkStatusSummary`

Usato da `/tenders/:tender_id/overview`.

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `owner_user_id` | string/null | sì | owner operativo |
| `overall_status` | not_started/in_progress/blocked/ready_for_review/validated_internal/stale | sì | stato analisi TRAM |
| `technical_analysis_status` | status/null | sì | stato area tecnica |
| `economic_analysis_status` | status/null | sì | stato area economica, senza valori |
| `administrative_analysis_status` | status/null | sì | stato area amministrativa |
| `next_action` | string/null | sì | prossima azione manuale o review |
| `blocking_reason` | string/null | sì | se bloccato |
| `updated_by` | string/null | sì | utente o sistema |
| `updated_at` | datetime/null | sì | ultimo aggiornamento |

Stati area ammessi: `not_started`, `in_progress`, `blocked`, `ready_for_review`, `validated_internal`, `not_applicable`.

Regole:

- non usare percentuali di completamento offerta in V1;
- mostrare “non impostato” se manca input interno;
- se ci sono review item bloccanti, `overall_status` non può essere `validated_internal`;
- se arriva un nuovo documento rilevante, lo stato può diventare `stale`.

## `IndicatorValue`

Usato da dashboard, overview e viste T1-T8.

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `indicator_value_id` | string | sì | id stabile |
| `tender_id` | string | sì | id tecnico gara |
| `indicator_key` | string | sì | deve esistere nel registro |
| `label_it` | string | sì | label UI |
| `family` | string | sì | identity, procurement, financial, ecc. |
| `primary_task` | T1-T8/audit | sì | task principale |
| `priority` | P0/P1 | sì | dal registro |
| `value_type` | string | sì | text, count, date, status, list, structured |
| `value` | JSON/null | sì | valore normalizzato o null |
| `display_value` | string | sì | testo UI sanificato |
| `state` | value state | sì | proposed/confirmed/ecc. |
| `confidence` | high/medium/low/not_calculable | sì | anche per deterministic |
| `privacy_level` | L0/L1/L2 | sì | governa visibilità |
| `source_refs` | `SourceReferenceSummary[]` | sì | può essere vuoto solo per calcolati |
| `technical_source` | `TechnicalSource`/null | sì | per indicatori calcolati |
| `review_item_id` | string/null | sì | se review aperta o storica |
| `is_headline` | boolean | sì | overview/dashboard |
| `updated_at` | datetime | sì | audit |

Regole:

- P0 senza fonte documentale o tecnica non deve mostrare valore come verità.
- Indicatori calcolati usano `technical_source`, non `SourceReference` documentale.
- L2 deve essere mascherato se il ruolo non ha `can_view_l2_content`.

## `SourceReferenceSummary`

Usato in lista, tooltip e drawer fonte.

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `source_ref_id` | string | sì | id stabile |
| `document_version_id` | string | sì | documento/versione |
| `document_title` | string | sì | titolo normalizzato |
| `document_family_key` | string | sì | famiglia |
| `location_type` | enum/string | sì | page, section, table, cell, mpp_row, synthetic_note |
| `location_label` | string | sì | es. p. 12, table 3 |
| `snippet_sanitized` | string/null | sì | null se L2 non visibile |
| `privacy_level` | L0/L1/L2 | sì | governa visibilità |
| `can_open` | boolean | sì | calcolato da permessi/policy |
| `blocked_reason` | string/null | sì | messaggio UI se bloccato |

## `SourceReferenceDetail`

Usato dal pannello fonte. Estende `SourceReferenceSummary` con:

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `extraction_id` | string/null | sì | se deriva da estrazione |
| `extraction_run_id` | string/null | sì | run che ha prodotto la fonte |
| `automation_source` | enum | sì | parser/regola/AI/manuale |
| `provider_label` | string/null | sì | se AI |
| `prompt_schema_version` | string/null | sì | se AI |
| `normalizer_version` | string/null | sì | se normalizzato |
| `audit_events` | `AuditEventSummary[]` | sì | eventi collegati |

## `DocumentVersionRow`

Usato da `/documents`.

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `document_version_id` | string | sì | id stabile |
| `tender_id` | string | sì | id tecnico gara |
| `document_family_key` | string | sì | es. instructions, payment |
| `title_normalized` | string | sì | titolo UI |
| `filename_display` | string | sì | nome sanificato se serve |
| `version_label` | string/null | sì | v1, v2, final, unknown |
| `variant_type` | string | sì | clean, track_changes, redline, workbook, template, mpp, pdf |
| `currentness` | current/superseded/candidate/unknown/duplicate/informational | sì | T1 resolver |
| `privacy_level` | L0/L1/L2 | sì | policy |
| `content_classes` | string[] | sì | financial, KPI, data, ecc. |
| `parser_status` | string | sì | not_started/parsed/failed/partial |
| `review_required` | boolean | sì | T1 gate |
| `review_item_id` | string/null | sì | se richiesto |
| `changed_since_last_review` | boolean | sì | stato stale |
| `source_refs_count` | number | sì | utile UI |

Regola: `currentness` non deve essere deciso solo da AI.

## `ReviewItemSummary`

Usato da overview, dashboard aggregata e liste compatte.

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `review_item_id` | string | sì | id stabile |
| `tender_id` | string | sì | id tecnico gara |
| `task` | T1-T8/audit | sì | origine |
| `family` | string | sì | timeline, financials, ecc. |
| `title` | string | sì | titolo breve |
| `risk_class` | risk class | sì | critical/high/medium/low |
| `blocking` | boolean | sì | blocca dashboard |
| `status` | value state | sì | stato review |
| `linked_indicator_keys` | string[] | sì | indicatori impattati |
| `primary_source_ref` | `SourceReferenceSummary`/null | sì | fonte principale |
| `created_at` | datetime | sì | audit |
| `updated_at` | datetime | sì | audit |

## `ReviewItemDetail`

Usato da `/review`. Estende `ReviewItemSummary` con:

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `summary` | string | sì | descrizione leggibile |
| `proposed_value` | JSON/string/null | sì | valore proposto |
| `current_value` | JSON/string/null | sì | dopo azioni |
| `source_refs` | `SourceReferenceSummary[]` | sì | una o più fonti |
| `conflicting_source_refs` | `SourceReferenceSummary[]` | sì | vuoto se non applicabile |
| `confidence` | high/medium/low/not_calculable | sì | confidenza |
| `automation_source` | enum | sì | origine |
| `allowed_actions` | review action[] | sì | filtrate per ruolo/policy |
| `impact` | `ReviewImpact` | sì | dashboard/Q&A/Financials/ecc. |
| `validation_actions` | `ValidationAction[]` | sì | storico |
| `linked_clarification_thread_id` | string/null | sì | se presente |

## `ValidationAction`

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `validation_action_id` | string | sì | id |
| `review_item_id` | string | sì | item |
| `user_id` | string | sì | utente |
| `action_type` | review action | sì | enum |
| `previous_value` | JSON/null | sì | audit |
| `new_value` | JSON/null | sì | audit |
| `reason` | string/null | sì | obbligatorio per correzioni critiche |
| `created_at` | datetime | sì | audit |

## `DashboardValidationState`

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `dashboard_state_id` | string | sì | id |
| `tender_id` | string | sì | id tecnico gara |
| `dashboard_area` | overview/documents/timeline/deliverables/requirements/financials/cost_drivers/contradictions/queries/audit/all | sì | area; `queries` indica la vista Q&A |
| `state` | dashboard state | sì | enum |
| `blocking_review_item_count` | number | sì | calcolato |
| `open_review_item_count` | number | sì | calcolato |
| `changed_documents_count` | number | sì | calcolato |
| `critical_contradiction_count` | number | sì | calcolato |
| `last_validated_at` | datetime/null | sì | audit |
| `last_validated_by` | string/null | sì | user |
| `calculation_reason` | string | sì | spiegazione UI breve |

Regola di precedenza iniziale:

1. blocker critici aperti -> `open_critical_issues`;
2. documenti cambiati dopo review -> `stale_due_to_new_docs`;
3. P0 parziali o non validati -> `partially_validated`;
4. P0 validati e nessun blocker -> `validated_internal`;
5. nessuna estrazione sufficiente -> `draft`.

## Policy, AI e audit

## `TenderPolicySummary`

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `tender_id` | string | sì | id tecnico gara |
| `tender_policy_status` | draft/approved/suspended | sì | policy gara |
| `default_external_ai_level` | none/L0_only/L1_with_approval | sì | default |
| `l2_handling` | local_only/self_hosted_if_available/human_only | sì | V1 default local/human |
| `clause_scan_status` | not_started/no_restriction_found/restriction_found/unclear | sì | gate |
| `provider_policy_status` | verified/stale/unknown | sì | provider |
| `free_budget_policy` | zero_budget/capped_budget/suspended | sì | costi |
| `sensitive_access_policy` | owner_only/owner_reviewer/custom | sì | L2 |
| `clarification_export_policy` | owner_only/reviewer_delegated/disabled | sì | T8 |
| `ui_status_label` | string | sì | testo italiano |

## `AiGateDecisionSummary`

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `ai_gate_decision_id` | string | sì | id |
| `tender_id` | string | sì | id tecnico gara |
| `task` | T1-T8/audit | sì | task |
| `privacy_level` | L0/L1/L2 | sì | input previsto |
| `decision` | allowed_l0_minimized/pending_l1_owner_approval/blocked_l2_effective/quota_exhausted/provider_policy_stale | sì | decisione normalizzata fixture MVP |
| `reason_code` | string | sì | quota, L2, clausola, provider, policy |
| `provider` | string/null | sì | se applicabile |
| `model` | string/null | sì | se applicabile |
| `quota_status` | available/exhausted/unknown/not_applicable | sì | free-first |
| `estimated_cost` | number/null | sì | costo stimato |
| `created_at` | datetime | sì | audit |

## `AiCallSummary`

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `ai_call_id` | string | sì | id |
| `ai_gate_decision_id` | string | sì | gate |
| `provider` | string | sì | Gemini, Mistral, ecc. |
| `model` | string | sì | modello |
| `prompt_schema_version` | string | sì | prompt/schema |
| `input_hash` | string | sì | hash |
| `output_hash` | string | sì | hash |
| `estimated_tokens` | number/null | sì | se noto |
| `estimated_cost` | number | sì | deve essere 0 o capped |
| `status` | completed/failed/suspended | sì | esito |

## `AuditEventSummary`

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `audit_event_id` | string | sì | id |
| `tender_id` | string | sì | id tecnico gara |
| `event_type` | parsing/ai_gate/ai_call/validation/policy/access/error | sì | tipo |
| `title` | string | sì | testo UI |
| `status` | not_started/running/completed/failed/blocked/suspended | sì | stato |
| `task` | T1-T8/audit/null | sì | task se noto |
| `related_record_id` | string/null | sì | link a item |
| `actor` | string | sì | utente o processo sintetico |
| `action` | string | sì | codice azione audit |
| `created_at` | datetime | sì | audit |

## Shape specialistiche T1-T8

Le shape specialistiche possono essere implementate come record dedicati o viste derivate da `IndicatorValue` + `ReviewItem`. Il contract le definisce perché la UI ne ha bisogno.

## `TimelineEvent`

| Campo | Tipo | Obbligatorio |
| --- | --- | --- |
| `timeline_event_id` | string | sì |
| `tender_id` | string | sì |
| `event_name` | string | sì |
| `event_type` | string | sì |
| `timeline_type` | procurement/contract/mobilisation/operation/handover/clarification/prequalification/other | sì |
| `date_value` | date/datetime/null | sì |
| `display_label` | string | sì |
| `precision` | string | sì |
| `is_relative` | boolean | sì |
| `timezone` | string/null | sì |
| `source_refs` | `SourceReferenceSummary[]` | sì |
| `state` | value state | sì |
| `review_item_id` | string/null | sì |
| `linked_deliverable_ids` | string[] | sì |

## `TenderDeliverable`

| Campo | Tipo | Obbligatorio |
| --- | --- | --- |
| `deliverable_id` | string | sì |
| `tender_id` | string | sì |
| `code` | string/null | sì |
| `name_display` | string | sì |
| `deliverable_type` | string | sì |
| `submission_area` | string | sì |
| `mandatory` | boolean/null | sì |
| `format_requirement` | string/null | sì |
| `page_limit` | string/null | sì |
| `evaluation_weight` | string/null | sì |
| `deadline_ref` | string/null | sì |
| `sensitive_flag` | boolean | sì |
| `source_refs` | `SourceReferenceSummary[]` | sì |
| `state` | value state | sì |
| `review_item_id` | string/null | sì |

## `RequirementKpiItem`

| Campo | Tipo | Obbligatorio |
| --- | --- | --- |
| `requirement_id` | string | sì |
| `tender_id` | string | sì |
| `item_kind` | requirement/KPI/compliance | sì |
| `domain` | operations/maintenance/workforce/safety/customer/compliance/qualification/other | sì |
| `title` | string | sì |
| `mandatory` | boolean/null | sì |
| `target_or_formula_display` | string/null | sì |
| `privacy_level` | L0/L1/L2 | sì |
| `source_refs` | `SourceReferenceSummary[]` | sì |
| `state` | value state | sì |
| `review_item_id` | string/null | sì |
| `linked_financial_item_ids` | string[] | sì |
| `linked_cost_driver_ids` | string[] | sì |

Regola: se target o formula incide su payment, penali o bonus/malus, la UI deve aprire review T5/T4.

## `FinancialItem`

| Campo | Tipo | Obbligatorio |
| --- | --- | --- |
| `financial_item_id` | string | sì |
| `tender_id` | string | sì |
| `financial_class` | pricing_workbook/financial_model/payment_mechanism/penalties/guarantees/indexation/bonus_malus/other | sì |
| `document_version_id` | string | sì |
| `display_summary` | string | sì |
| `privacy_level` | L0/L1/L2 | sì |
| `parser_status` | string | sì |
| `review_state` | value state | sì |
| `source_refs` | `SourceReferenceSummary[]` | sì |
| `review_item_id` | string/null | sì |
| `linked_cost_driver_ids` | string[] | sì |
| `can_show_detail` | boolean | sì |
| `blocked_reason` | string/null | sì |

Regole:

- `FinancialItem` non è L2 per categoria: pricing, payment, penali, garanzie e modelli economici del Tender possono essere L0/L1 e analizzabili se data policy, minimizzazione, provider e quota lo consentono;
- L2 si applica solo a contenuti effettivamente protetti, per esempio dati interni dell’offerta, dati personali, clausole incompatibili o payload non minimizzabile;
- `display_summary` non deve contenere importi reali nelle fixture e non deve apparire come dettaglio economico in overview.

## `CostDriver`

| Campo | Tipo | Obbligatorio |
| --- | --- | --- |
| `cost_driver_id` | string | sì |
| `tender_id` | string | sì |
| `domain` | string | sì |
| `title` | string | sì |
| `risk_class` | risk class | sì |
| `financial_linked` | boolean | sì |
| `source_refs` | `SourceReferenceSummary[]` | sì |
| `state` | value state | sì |
| `review_item_id` | string/null | sì |
| `linked_requirement_ids` | string[] | sì |
| `linked_financial_item_ids` | string[] | sì |
| `amount_estimate` | null | sì |

Regola MVP: `amount_estimate` resta null salvo decisione futura e formula esplicita sanificata.

## `ContradictionCandidate`

| Campo | Tipo | Obbligatorio |
| --- | --- | --- |
| `contradiction_id` | string | sì |
| `tender_id` | string | sì |
| `issue_type` | timeline/versioning/financial/semantic/missing_document/parser_issue/other | sì |
| `title` | string | sì |
| `severity` | risk class | sì |
| `status` | value state | sì |
| `source_ref_a` | `SourceReferenceSummary` | sì |
| `source_ref_b` | `SourceReferenceSummary`/null | sì |
| `review_item_id` | string | sì |
| `linked_clarification_thread_id` | string/null | sì |

Regola UI: mostrare sempre “candidate issue” finché non esiste validazione umana.

## `ClarificationThread`

Rappresenta uno scambio Q&A tra bidder e stazione appaltante. La bozza di domanda è solo una parte del thread.

| Campo | Tipo | Obbligatorio |
| --- | --- | --- |
| `clarification_thread_id` | string | sì |
| `tender_id` | string | sì |
| `subject` | string | sì |
| `status` | candidate/draft_question/under_review/approved_for_export/sent_to_authority/answered/incorporated/dismissed/blocked_sensitive | sì |
| `sensitivity_level` | L0/L1/L2 | sì |
| `source_channel` | q_and_a_register/procurement_portal/manual/internal_draft | sì |
| `source_register_row_no` | string/null | sì |
| `document_reference_raw` | string/null | sì |
| `clarification_kind` | clarification/correction/answer/update/unknown | sì |
| `currentness_effect` | none/clarifies/corrects/supersedes/adds_requirement/removes_requirement/unknown | sì |
| `affected_source_ref_ids` | string[] | sì |
| `question_draft_sanitized` | string/null | sì |
| `authority_answer_sanitized` | string/null | sì |
| `answer_received_at` | datetime/null | sì |
| `authority_platform_reference` | string/null | sì |
| `source_refs` | `SourceReferenceSummary[]` | sì |
| `linked_review_item_ids` | string[] | sì |
| `approval_required` | boolean | sì |
| `approved_by` | string/null | sì |
| `can_export` | boolean | sì |
| `blocked_reason` | string/null | sì |
| `requires_dashboard_update` | boolean | sì |

Regole:

- nessuna domanda o chiarimento ha invio automatico nel MVP;
- `sent_to_authority` è solo uno stato registrato manualmente o importato dal portale/registro, non un’azione automatica di TRAM;
- un Q&A pubblicato dall’ente ha valore di documentazione di gara e può modificare la verità corrente di requisiti, scadenze, deliverable, definizioni o istruzioni;
- una risposta della stazione appaltante può rendere obsolete timeline, deliverable, requisiti o indicatori e deve aprire review quando incide su dati già validati;
- i testi in fixture devono essere sintetici e sanificati.

## `ClarificationRegisterImport`

Usato per importare registri Q&A ricevuti come Excel/PDF o export dal portale dell’ente appaltante.

| Campo | Tipo | Obbligatorio | Note |
| --- | --- | --- | --- |
| `clarification_import_id` | string | sì | id import |
| `tender_id` | string | sì | id tecnico gara |
| `source_document_version_id` | string | sì | file registro |
| `source_filename` | string | sì | nome file, non path assoluto |
| `row_count` | number | sì | righe importate |
| `column_map` | JSON | sì | es. No., Subject, Document reference, Question, Answer, Clarification/Correction |
| `rows_with_document_reference_count` | number | sì | per coverage |
| `rows_without_document_reference_count` | number | sì | da review |
| `clarification_count` | number | sì | se disponibile |
| `correction_count` | number | sì | se disponibile |
| `missing_attachment_count` | number | sì | se il registro cita allegati non presenti |
| `import_status` | draft/imported/needs_review/blocked_sensitive | sì | stato |

Regola: un registro Q&A incompleto può alimentare solo workflow e struttura. Per analisi AI di merito o riconciliazione completa servono tutti i registri Q&A e gli allegati collegati.

## Permessi e capability

La UI deve ricevere capability già calcolate per utente e gara.

## `TenderUserCapability`

| Campo | Tipo | Obbligatorio |
| --- | --- | --- |
| `tender_id` | string | sì |
| `user_id` | string | sì |
| `role` | owner/editor/reviewer/viewer | sì |
| `can_manage_tender` | boolean | sì |
| `can_manage_members` | boolean | sì |
| `can_upload_documents` | boolean | sì |
| `can_run_processing` | boolean | sì |
| `can_view_l2_content` | boolean | sì |
| `can_view_financials` | boolean | sì |
| `can_validate_indicators` | boolean | sì |
| `can_close_blocking_review` | boolean | sì |
| `can_approve_l1_external_ai` | boolean | sì |
| `can_create_clarification_thread` | boolean | sì |
| `can_approve_clarification_export` | boolean | sì |
| `can_view_ai_audit` | boolean | sì |

Regola: una capability falsa deve produrre stato UI bloccato, non errore generico.

## Contract per route

| Route | Shape principale | Shape secondarie |
| --- | --- | --- |
| `/tenders` | `TenderSummary[]` | `TenderUserCapability`, `DashboardValidationState` |
| `/tenders/:tender_id/overview` | `TenderOverview` | `IndicatorValue`, `TenderRouteStrip`, `ReviewItemSummary`, `TenderPolicySummary` |
| `/tenders/:tender_id/documents` | `DocumentVersionRow[]` | `SourceReferenceSummary`, `ReviewItemSummary` |
| `/tenders/:tender_id/timeline` | `TimelineEvent[]` | `ReviewItemSummary`, `TenderDeliverable` |
| `/tenders/:tender_id/deliverables` | `TenderDeliverable[]` | `TimelineEvent`, `ReviewItemSummary` |
| `/tenders/:tender_id/requirements` | `RequirementKpiItem[]` | `FinancialItem`, `CostDriver`, `ReviewItemSummary` |
| `/tenders/:tender_id/financials` | `FinancialItem[]` | `TenderUserCapability`, `ReviewItemSummary` |
| `/tenders/:tender_id/cost-drivers` | `CostDriver[]` | `RequirementKpiItem`, `FinancialItem` |
| `/tenders/:tender_id/contradictions` | `ContradictionCandidate[]` | `SourceReferenceSummary`, `ClarificationThread` |
| `/tenders/:tender_id/queries` | `ClarificationThread[]` | `ReviewItemSummary`, `SourceReferenceSummary` |
| `/tenders/:tender_id/review` | `ReviewItemDetail[]` | `ValidationAction`, `SourceReferenceDetail` |
| `/tenders/:tender_id/audit` | `AuditEventSummary[]` | `AiGateDecisionSummary`, `AiCallSummary`, `TenderPolicySummary` |

### Mapping route-vista-indicatori

Il mapping seguente è il contract operativo di Fase 3. È duplicato nel codice applicativo come `ROUTE_VIEW_CONTRACTS` e verificato dai test sulle fixture compatte.

| Route | Shape principale | Indicatori minimi |
| --- | --- | --- |
| `/tenders` | `TenderSummary[]` | `dashboard.validation_state.overall`, `package.stage`, `review.blocking_count` |
| `/tenders/:tender_id/overview` | `TenderOverview` | `dashboard.validation_state.overall`, `package.stage`, `documents.currentness_status`, `data_quality.source_coverage_ratio`, `clarifications.ready_count`, `clarifications.register_coverage_status`, `financials.payment_mechanism_status`, `review.blocking_count`, `audit.last_gate` |
| `/tenders/:tender_id/documents` | `DocumentVersionRow[]` | `documents.currentness_status`, `documents.ingestion_status` |
| `/tenders/:tender_id/timeline` | `TimelineEvent[]` | `timeline.next_deadline_risk`, `timeline.date_conflict_count`, `timeline.deadline_status`, `timeline.schedule_status` |
| `/tenders/:tender_id/deliverables` | `TenderDeliverable[]` | `deliverables.mandatory_count`, `deliverables.review_gate_count` |
| `/tenders/:tender_id/requirements` | `RequirementKpiItem[]` | `requirements.kpi_count`, `requirements.critical_kpi_count` |
| `/tenders/:tender_id/financials` | `FinancialItem[]` | `financials.item_count`, `financials.payment_mechanism_status`, `financials.ai_review_status`, `financials.owner_approval_status`, `financials.applicability` |
| `/tenders/:tender_id/cost-drivers` | `CostDriver[]` | `cost_drivers.high_risk_count` |
| `/tenders/:tender_id/contradictions` | `ContradictionCandidate[]` | `criticalities.candidate_count`, `criticalities.pef_issue_count`, `criticalities.redline_candidate_count` |
| `/tenders/:tender_id/queries` | `ClarificationThread[]` | `clarifications.ready_count`, `clarifications.register_coverage_status`, `qna.addendum_status` |
| `/tenders/:tender_id/review` | `ReviewItemDetail[]` | `review.blocking_count`, `review.open_count` |
| `/tenders/:tender_id/audit` | `AuditEventSummary[]` | `audit.last_gate`, `ai.external_use.status` |

Regole di chiusura Fase 3:

- ogni `indicator_key` presente nelle fixture compatte deve comparire in almeno una route;
- ogni indicatore richiesto da una route deve essere presente nelle fixture compatte;
- `dashboard.validation_state.overall` deve esistere per ogni gara e coincidere con `Tender.dashboard_state` e `TenderRouteStrip.overall_state`;
- `Review` e `Audit` restano route contestuali, non nodi primari della route strip.

## Contract per fixture

Decisione operativa del 2026-05-13:

- i file fixture MVP saranno JSON;
- i JSON saranno la source of truth iniziale;
- il validatore TypeScript/Zod viene mantenuto insieme all’app Next.js;
- eventuali seed DB saranno derivati dai JSON dopo schema Postgres stabile.

I file fixture futuri devono poter contenere queste sezioni logiche:

| File suggerito | Shape |
| --- | --- |
| `tram-mvp-wide-tenders.json` | `TenderSummary`, `TenderOverview`, `TenderUserCapability` |
| `tram-mvp-wide-documents.json` | `DocumentVersionRow` |
| `tram-mvp-wide-source-references.json` | `SourceReferenceSummary`, `SourceReferenceDetail` |
| `tram-mvp-wide-indicators.json` | `IndicatorValue` |
| `tram-mvp-wide-review-items.json` | `ReviewItemSummary`, `ReviewItemDetail`, `ValidationAction` |
| `tram-mvp-wide-domain-records.json` | `TimelineEvent`, `TenderDeliverable`, `RequirementKpiItem`, `FinancialItem`, `CostDriver`, `ContradictionCandidate`, `ClarificationThread` |
| `tram-mvp-wide-route-network.json` | `TenderRouteStrip`, `TenderRouteNode`, `TenderRouteEdge` |
| `tram-mvp-wide-audit-events.json` | `AuditEventSummary`, `AiGateDecisionSummary`, `AiCallSummary`, `TenderPolicySummary` |

Il manifest fixture deve dichiarare quali shape sono presenti e quante righe contiene ciascuna sezione.

## Regole di calcolo MVP

### `review.items.blocking_count`

Conta `ReviewItem` con:

- `blocking=true`;
- stato non finale.

Stati finali MVP:

- `confirmed`;
- `corrected`;
- `superseded`;
- `not_applicable`.

### `documents.changed_since_last_review_count`

Conta `DocumentVersionRow` con:

- `changed_since_last_review=true`;
- `currentness` diverso da `superseded` o `duplicate`, salvo se la variazione riguarda un documento corrente.

### `dashboard.validation_state.overall`

Usa la precedenza definita in `DashboardValidationState`.

### `financial.review_count`

Conta `FinancialItem` con:

- stato diverso da `confirmed`, `corrected`, `not_applicable`;
- oppure analisi AI da verificare;
- oppure parser issue aperto.

### `ai.external_use.status`

Deriva da:

- `TenderPolicySummary`;
- ultimo `AiGateDecisionSummary`;
- quota/budget;
- privacy level del task richiesto.

## Errori e stati bloccati

Ogni shape mostrabile in UI può includere opzionalmente:

| Campo | Tipo | Uso |
| --- | --- | --- |
| `ui_state` | ready/loading/empty/blocked/error | stato render |
| `blocked_reason` | string/null | motivo leggibile |
| `error_code` | string/null | codice tecnico |
| `requires_action` | string/null | azione consigliata |

Questi campi possono essere calcolati dal backend o dal layer UI, ma le fixture devono coprirli almeno per:

- L2 bloccato;
- quota AI esaurita;
- parser error;
- policy L1 in attesa owner;
- documento nuovo che rende dashboard stale.

## Acceptance criteria data contract

Il data contract è sufficiente quando:

- ogni route dei wireframe ha una shape principale;
- ogni fixture definita può essere rappresentata senza inventare campi nuovi;
- ogni `indicator_key` visibile passa da `IndicatorValue`;
- ogni dato critico può aprire `SourceReference` o `ReviewItem`;
- ogni route strip è derivabile da indicatori, review item, source reference e AI gate senza duplicare la verità;
- ogni stato dashboard è calcolabile;
- ogni azione review ha effetto tracciabile;
- ogni blocco L2/policy/quota/ruolo ha un campo UI spiegabile;
- Financials e Q&A rispettano i guardrail V1;
- il prossimo passo può produrre checklist di sviluppo/verifica senza ridiscutere il modello concettuale.

Nota di chiusura del 2026-05-15: questi criteri sono soddisfatti dal fixture pack compatto `0.2.0` e dai test applicativi su schema Zod, route-view contract, stati dashboard, route strip, referenze interne, AI gate e audit.

## Debiti non chiusi

- Estendere lo schema JSON tecnico quando il fixture pack verrà diviso o quando nascerà lo schema Postgres.
- Rafforzare il validatore TypeScript/Zod solo per nuove entità o nuove invarianti non ancora rappresentate dal fixture pack compatto.
- Derivare eventuale seed DB dai JSON dopo schema Postgres stabile.
- Allineare eventuali enum tecnici futuri con database e normalizzatori.
- Creare validatore automatico per `indicator_key`, stati, privacy level e path vietati.
- Definire naming definitivo delle route se lo scaffold Next.js richiede aggiustamenti tecnici.

## Prossimo passo consigliato

La checklist di sviluppo/verifica MVP è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-development-verification-checklist-v0-1.md`.

Procedere con **Fase 4 - prototipo applicativo su fixture**, usando il fixture pack compatto e il route-view contract di Fase 3 come fonti uniche. Lo split `mvp-wide` e i seed DB restano decisioni successive, da fare solo quando serviranno davvero.
