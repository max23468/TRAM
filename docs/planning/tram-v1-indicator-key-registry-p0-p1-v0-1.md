# TRAM V1 - Registro `indicator_key` P0/P1 v0.1

Data: 2026-05-13  
Stato: decisione operativa iniziale  
Ambito: dashboard MVP, review queue, normalizzatori, data model e benchmark T1-T8

## Scopo

Questo documento definisce il registro canonico degli `indicator_key` TRAM V1.

Un `indicator_key` è il nome stabile con cui TRAM identifica un dato normalizzato, indipendentemente dal nome usato nei documenti di gara. Serve a collegare:

- estrazioni e fonti;
- dashboard aggregata e dashboard Tender;
- review queue;
- normalizzatori deterministici;
- benchmark AI;
- futuro data model applicativo.

La tassonomia descrittiva resta in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-taxonomy.md`. Questo documento è più operativo: stabilisce le chiavi da usare.

## Principi

1. Ogni dato mostrato in dashboard deve avere un `indicator_key`.
2. Ogni `indicator_key` deve avere fonte, stato e livello di review.
3. Un indicatore può essere visibile anche se non validato, ma deve mostrare chiaramente `proposed`, `unclear`, `contested` o `superseded`.
4. Gli indicatori economici e sensibili possono essere P0 solo come sintesi o stato, non come dettaglio non validato.
5. Le chiavi sono tecniche e in inglese; le label UI restano in italiano.
6. Le chiavi non devono incorporare il nome del pacchetto, del paese o del provider.
7. P0 significa “necessario per prima dashboard MVP”; P1 significa “necessario per analisi strutturata V1”.

## Convenzione nomi

Formato:

```text
<domain>.<subject>.<measure>
```

Esempi:

- `procurement.deadline.next_critical`
- `contract.duration.base`
- `network.stations.count`
- `review.items.blocking_count`

Regole:

- usare `snake_case` solo dentro i segmenti;
- usare massimo quattro segmenti quando possibile;
- evitare abbreviazioni oscure;
- non cambiare una chiave dopo che entra in uso: deprecarla e crearne una nuova;
- non usare label documento come chiave;
- non usare valori come chiave.

## Campi minimi del registro

Ogni indicatore registrato deve avere questi campi concettuali:

| Campo | Significato |
| --- | --- |
| `indicator_key` | chiave canonica stabile |
| `priority` | `P0` o `P1` |
| `label_it` | label UI italiana |
| `family` | famiglia data model |
| `primary_task` | task T1-T8 principale |
| `value_type` | tipo valore atteso |
| `dashboard_use` | dove compare nel MVP |
| `review_gate` | quando richiede review |
| `source_policy` | tipo fonte minima richiesta |

## Stati valore ammessi

Gli stati sono quelli del data model `IndicatorValue`:

- `proposed`;
- `confirmed`;
- `corrected`;
- `contested`;
- `unclear`;
- `superseded`;
- `not_applicable`.

Regola P0: un indicatore P0 senza fonte resta visibile solo come “non disponibile” o “da estrarre”, mai come valore.

## Registro P0

Gli indicatori P0 alimentano dashboard aggregata, overview Tender, review queue e primi KPI di affidabilità.

| `indicator_key` | Label IT | Family | Task | Tipo valore | Uso dashboard | Review gate |
| --- | --- | --- | --- | --- | --- | --- |
| `tender.identity.name` | Nome gara | identity | T1 | text | aggregata, overview | se dedotto da più fonti discordanti |
| `tender.identity.package_type` | Tipo pacchetto | procurement | T1 | enum | aggregata, overview | se ambiguo tra prequalifica, ITT, ITN o PPP |
| `tender.identity.transport_mode` | Modalità trasporto | identity | T1/T4 | enum/list | aggregata, overview | se multimodale o dedotto |
| `authority.name` | Stazione appaltante | identity | T1 | text | aggregata, overview | se assente o conflittuale |
| `authority.country` | Paese | identity | T1 | country code/text | aggregata, overview | se non deducibile con certezza |
| `procurement.stage.current` | Fase procurement corrente | procurement | T1/T2 | enum | aggregata, overview | se ci sono addendum o documenti di fase diversa |
| `procurement.procedure.type` | Tipo procedura | procurement | T1/T2 | enum/text | overview | se dedotto da fonti non principali |
| `procurement.deadline.next_critical` | Prossima scadenza critica | procurement | T2 | date/datetime | aggregata, overview | sempre se fonte multipla o data relativa |
| `procurement.deadline.questions` | Scadenza chiarimenti | procurement | T2 | date/datetime/null | overview, timeline | se contraddittoria o relativa |
| `procurement.deadline.submission` | Scadenza offerta/domanda | procurement | T2 | date/datetime/null | aggregata, overview | sempre se P0 e non validata |
| `procurement.evaluation.model_summary` | Modello valutazione | procurement | T3/T4 | structured text | overview | se include pesi, formule o criteri complessi |
| `contract.duration.base` | Durata base contratto | contract | T2 | duration | overview | se durata relativa o fonte non contrattuale |
| `contract.duration.extension_options` | Opzioni di estensione | contract | T2 | list/duration | overview | se formula o facoltà non chiara |
| `contract.mobilisation.start` | Avvio mobilitazione | contract | T2 | date/datetime/null | overview, timeline | se relativa o condizionata |
| `contract.operation.start` | Avvio servizio | contract | T2 | date/datetime/null | aggregata, overview | se relativa o divergente |
| `contract.operation.end` | Fine periodo operativo | contract | T2 | date/datetime/null | overview | se calcolata da durata |
| `network.lines.count` | Numero linee | network | T4 | number/null | overview | se non esplicito o varia per lotto |
| `network.route_km.total` | Estensione rete | network | T4 | number + unit | overview | se misura non omogenea tra fonti |
| `network.stations.count` | Numero stazioni/fermate | network | T4 | number/null | overview | se stazioni e fermate sono miste |
| `network.rolling_stock.count` | Materiale rotabile | network | T4 | number/null | overview | se tipologia o proprietà non chiara |
| `network.service_pattern.summary` | Pattern servizio | operations | T4 | structured text | overview | se include 24/7, headway o casi speciali |
| `documents.total_count` | Documenti caricati | versioning | T1 | count | aggregata, documenti | no, salvo errore ingestion |
| `documents.current_count` | Documenti correnti | versioning | T1 | count | documenti, overview | se resolver non conclusivo |
| `documents.changed_since_last_review_count` | Nuovi/variati da ultima review | versioning | T1 | count | aggregata, overview | se maggiore di zero blocca stato validato |
| `documents.version_conflict_count` | Conflitti versione | versioning | T1 | count | documenti, review | sempre se maggiore di zero |
| `deliverables.total_count` | Deliverable individuati | deliverable | T3 | count | overview, deliverable | se parser incompleto |
| `deliverables.mandatory_count` | Deliverable obbligatori | deliverable | T3 | count | overview, deliverable | se mandatory non validato |
| `deliverables.next_due` | Prossimo deliverable rilevante | deliverable | T3/T2 | date/text/null | overview, timeline | se deadline collegata non validata |
| `requirements.mandatory_count` | Requisiti mandatory | requirements | T4 | count | overview, requisiti | se estrazione parziale |
| `kpi.critical_count` | KPI critici | KPI | T4/T5 | count | overview, requisiti | se collegati a bonus/malus o penali |
| `financial.payment_mechanism.summary` | Payment mechanism | financial | T5 | structured text/status | overview, financials | sempre review obbligatoria |
| `financial.pricing_documents.present` | Documenti pricing presenti | financial | T1/T5 | boolean/list | overview, financials | se workbook o PEF presenti |
| `financial.review_count` | Financials da validare | financial | T5 | count | overview, review | sempre se maggiore di zero |
| `cost_drivers.top_count` | Cost driver principali | risk | T6 | count/list | overview, cost driver | se impatto alto o fonte L2 |
| `contradictions.critical_count` | Contraddizioni critiche | risk | T7 | count | aggregata, overview | sempre se maggiore di zero |
| `clarifications.ready_count` | Chiarimenti da approvare o incorporare | clarifications | T8 | count | aggregata, chiarimenti | sempre approvazione umana |
| `review.items.blocking_count` | Review bloccanti | data_quality | T1-T8 | count | aggregata, overview | sempre se maggiore di zero |
| `dashboard.validation_state.overall` | Stato dashboard | data_quality | T1-T8 | enum | aggregata, overview | calcolato da regole |
| `ai.external_use.status` | Stato uso AI esterna | data_quality | T1-T8 | enum/status | overview, audit | se provider esterno non ammesso o quota esaurita |

## Registro P1

Gli indicatori P1 servono alla prima analisi strutturata V1. Non devono necessariamente comparire sopra la piega della dashboard, ma devono essere modellati per filtri, tabelle e review.

| `indicator_key` | Label IT | Family | Task | Tipo valore | Uso V1 | Review gate |
| --- | --- | --- | --- | --- | --- | --- |
| `procurement.timeline.standstill` | Standstill | procurement | T2 | date/range/null | timeline | se non esplicito |
| `procurement.timeline.negotiation_events` | Eventi negoziali | procurement | T2 | list | timeline | se condizionati |
| `procurement.timeline.bafo_expected` | BAFO o revised tender | procurement | T2 | boolean/date/null | timeline | se dedotto |
| `procurement.evaluation.quality_weight` | Peso qualità | procurement | T3/T4 | percent/null | deliverable/requisiti | sempre se economico/valutativo |
| `procurement.evaluation.price_weight` | Peso prezzo | procurement | T3/T5 | percent/null | deliverable/financials | sempre |
| `contract.handover.obligations` | Obblighi handover | contract | T4/T6 | list | requisiti/cost driver | se impatto costo |
| `contract.demobilisation.obligations` | Obblighi demobilitazione | contract | T4/T6 | list | requisiti/cost driver | se impatto costo |
| `contract.change_management.summary` | Change management | contract | T4/T7 | structured text | rischi/contraddizioni | se incide su costi o tempi |
| `contract.termination.triggers` | Cause di termination | risk | T4/T7 | list | rischi | sempre review |
| `network.asset_classes.list` | Asset class | maintenance | T4 | list | network/manutenzione | se incomplete |
| `network.systems.critical_list` | Sistemi critici | maintenance | T4 | list | network/manutenzione | se safety/cyber |
| `operations.operating_hours` | Orari esercizio | operations | T4 | structured text | operations | se 24/7 o special events |
| `operations.headway.summary` | Headway/frequenze | operations | T4 | structured text | operations | se varia per scenario |
| `operations.disruption_obligations` | Gestione disruption | operations | T4/T6 | list | requisiti/cost driver | se obbligo operativo critico |
| `operations.event_management_obligations` | Event management | operations | T4/T6 | list | requisiti/cost driver | se extra servizio ordinario |
| `maintenance.strategy.summary` | Strategia manutentiva richiesta | maintenance | T4/T6 | structured text | manutenzione | se include obblighi critici |
| `maintenance.inspection_obligations` | Ispezioni e condition assessment | maintenance | T4/T6 | list | manutenzione/cost driver | se genera attività |
| `maintenance.spares_responsibility` | Responsabilità spare parts | maintenance | T4/T6/T5 | enum/text | manutenzione/financials | se rischio economico |
| `maintenance.cmms_requirements` | Requisiti CMMS | maintenance | T4 | list | requisiti | se include integrazioni dati |
| `maintenance.asset_condition.baseline` | Baseline condition | maintenance | T4/T7 | structured text | manutenzione/rischi | se incompleta o conflittuale |
| `workforce.transfer_obligations` | Subentro personale | workforce | T4/T6 | structured text | workforce/cost driver | sempre se dati personali o HR |
| `workforce.key_persons.requirements` | Key persons | workforce | T3/T4 | list | deliverable/requisiti | se CV o nominativi |
| `workforce.training_obligations` | Formazione | workforce | T4/T6 | list | requisiti/cost driver | se obbligo continuativo |
| `workforce.social_clauses.summary` | Clausole sociali/lavoro | workforce | T4 | structured text | compliance | se mandatory |
| `customer.satisfaction_kpi` | Customer satisfaction KPI | customer | T4 | KPI/list | requisiti/KPI | se target o bonus/malus |
| `customer.information_obligations` | Informazione passeggeri | customer | T4/T6 | list | requisiti/cost driver | se real time/disruption |
| `customer.accessibility_obligations` | Accessibilità | customer | T4 | list | requisiti | se mandatory |
| `compliance.safety_obligations` | Safety | compliance | T4 | list | compliance | sempre se critico |
| `compliance.security_obligations` | Security | compliance | T4 | list | compliance | se operativo/cyber |
| `compliance.cyber_obligations` | Cyber security | compliance | T4 | list/status | compliance/audit | sempre L2 o review |
| `compliance.data_protection_ai_clause` | Clausole dati/AI | compliance | T1/T4 | status/text | audit/data policy | sempre prima di AI esterna |
| `compliance.environmental_obligations` | Ambiente/energia | compliance | T4/T6 | list | compliance/cost driver | se reporting o investimenti |
| `financial.indexation.summary` | Indicizzazione/escalation | financial | T5 | structured text | financials | sempre review |
| `financial.bonus_malus.summary` | Bonus/malus | financial | T5 | structured text | financials/KPI | sempre review |
| `financial.penalties.summary` | Penali/deductions | financial | T5 | structured text | financials/rischi | sempre review |
| `financial.guarantees.summary` | Garanzie | financial | T5 | structured text | financials | sempre review |
| `financial.model.required` | Modello finanziario richiesto | financial | T3/T5 | boolean/list | financials/deliverable | sempre se workbook/PEF |
| `cost_drivers.energy_responsibility` | Responsabilità energia | risk | T5/T6 | enum/text | cost driver | sempre se economica |
| `cost_drivers.asset_renewal` | Rinnovi/reinvestimenti asset | risk | T4/T6/T5 | list | cost driver | se capex/lifecycle |
| `cost_drivers.subcontracting_constraints` | Vincoli subcontracting | risk | T3/T4/T6 | list | cost driver | se limita delivery |
| `cost_drivers.reporting_burden` | Carico reporting | risk | T3/T4/T6 | count/list | cost driver | se frequente o oneroso |
| `contradictions.timeline_count` | Contraddizioni timeline | risk | T2/T7 | count | review/contraddizioni | sempre se maggiore di zero |
| `contradictions.versioning_count` | Contraddizioni versioning | risk | T1/T7 | count | review/documenti | sempre se maggiore di zero |
| `contradictions.financial_count` | Contraddizioni financials | risk | T5/T7 | count | review/financials | sempre |
| `clarifications.blocked_sensitive_count` | Chiarimenti bloccati perché sensibili | clarifications | T8 | count | chiarimenti/audit | sempre |
| `review.items.open_count` | Review aperte | data_quality | T1-T8 | count | review | no, metrica operativa |
| `review.items.overdue_count` | Review scadute/interne | data_quality | T1-T8 | count | review | se SLA interno definito |
| `data_quality.source_coverage_ratio` | Copertura fonti | data_quality | T1-T8 | percent | audit/dashboard | se sotto soglia |
| `data_quality.parser_issues_count` | Problemi parser/OCR | data_quality | T1-T8 | count | audit/documenti | se maggiore di zero |

## Indicatori calcolati

Alcuni `indicator_key` non arrivano direttamente da un documento, ma sono calcolati da regole:

| `indicator_key` | Regola sintetica |
| --- | --- |
| `dashboard.validation_state.overall` | massimo rischio tra dashboard area, blocker review, nuovi documenti e contraddizioni critiche |
| `review.items.blocking_count` | count di `ReviewItem` con `is_blocking_dashboard=true` e stato aperto |
| `documents.changed_since_last_review_count` | count di `DocumentVersion` nuove o cambiate dopo ultima validazione |
| `financial.review_count` | count item T5 non validati o con AI/parser issue aperti |
| `ai.external_use.status` | stato derivato da policy Tender, clausole pacchetto, quota e provider readiness |

Questi indicatori devono avere fonte tecnica/audit, non `SourceReference` documentale.

## Regole di review

Un indicatore genera review obbligatoria se:

- è P0 e non ha fonte;
- è P0 e ha fonti divergenti;
- deriva da documenti `track_changes`, redline, addendum o chiarimenti non consolidati;
- contiene o dipende da financials, payment, penali, KPI economici o garanzie;
- incide su chiarimenti/Q&A;
- è usato per cambiare `dashboard.validation_state.overall`;
- è stato corretto manualmente da un utente;
- deriva da provider AI esterno su contenuto L1.

## Collegamento con i task T1-T8

| Task | Indicatori principali |
| --- | --- |
| `T1` | identità Tender, tipo pacchetto, document map, versioning, privacy class, documenti nuovi/correnti |
| `T2` | deadline, timeline procurement, timeline contratto, mobilitazione, durata, conflitti data |
| `T3` | deliverable, submission area, mandatory, dipendenze, scadenze deliverable |
| `T4` | requisiti O&M, KPI non finanziari, network, operations, maintenance, workforce, compliance |
| `T5` | financials, payment mechanism, pricing documents, bonus/malus, penali, garanzie |
| `T6` | cost driver, attività che generano costi, carico reporting, asset renewal, energia |
| `T7` | contraddizioni candidate, severity, review action, fonte conflitto |
| `T8` | chiarimenti/Q&A, domande bloccate, domande pronte, risposte ricevute, approvazione umana |

## Collegamento con le viste MVP

| Vista | Chiavi minime |
| --- | --- |
| Dashboard aggregata | `tender.identity.name`, `tender.identity.package_type`, `procurement.stage.current`, `procurement.deadline.next_critical`, `documents.changed_since_last_review_count`, `review.items.blocking_count`, `contradictions.critical_count`, `clarifications.ready_count`, `dashboard.validation_state.overall` |
| Overview Tender | tutti i P0 non puramente audit |
| Documenti T1 | `documents.total_count`, `documents.current_count`, `documents.changed_since_last_review_count`, `documents.version_conflict_count` |
| Timeline T2 | `procurement.deadline.*`, `contract.*`, `contradictions.timeline_count` |
| Deliverable T3 | `deliverables.total_count`, `deliverables.mandatory_count`, `deliverables.next_due` |
| Review queue | `review.items.blocking_count`, `review.items.open_count`, `review.items.overdue_count`, più indicatori collegati all’item |
| Audit AI/data policy | `ai.external_use.status`, `compliance.data_protection_ai_clause`, `data_quality.*` |

## Soglie iniziali MVP

Queste soglie non sono scoring finale, ma regole pratiche per stato dashboard:

| Condizione | Effetto |
| --- | --- |
| `review.items.blocking_count > 0` | dashboard `open_critical_issues` |
| `documents.changed_since_last_review_count > 0` | dashboard `stale_due_to_new_docs` |
| `documents.version_conflict_count > 0` | area documenti bloccante |
| `contradictions.critical_count > 0` | area rischi bloccante |
| `financial.review_count > 0` | area financials non validata |
| `data_quality.source_coverage_ratio` sotto soglia futura | area interessata `partially_validated` o `draft` |

## Debiti

- Definire enum tecnici completi per `package_type`, `transport_mode`, `procurement_stage`, `dashboard.validation_state.overall` e `ai.external_use.status`.
- Collegare ogni `indicator_key` a fixture minime quando inizieranno i test applicativi.
- Decidere quali P1 diventano P0 dopo i primi test con utenti.
- Definire soglie numeriche per `data_quality.source_coverage_ratio`.
- Creare script futuro di validazione per impedire `indicator_key` non registrati.

## Prossimo passo consigliato

Usare questo registro per chiudere il primo slice UI MVP: dashboard aggregata, overview Tender, documenti T1 e review queue. Poi collegare ruoli, data policy e workflow ingestion in modo che ogni indicatore P0 abbia un percorso chiaro da file caricato a dato visibile.
