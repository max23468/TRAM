# TRAM V1 - Dashboard widget audit v0.1

Data: 2026-05-15  
Stato: prima decisione operativa per Fase 4  
Ambito: razionalizzazione dei contenuti dashboard prima dell’integrazione del mock nel MVP

## Scopo

Questo documento definisce cosa fare prima di trasformare il mock HTML canonico in componenti applicativi.

Il mock resta la base visuale unica, ma non deve essere integrato pari pari nel MVP. La dashboard deve prima essere verificata widget per widget, così ogni box mostrato in overview ha:

- uno scopo operativo chiaro;
- una fonte dati nelle fixture o nel data contract;
- una prossima azione o un motivo di consultazione;
- una ragione per stare in overview invece che in una vista specialistica.

## Decisione

Il prossimo passo non è il port completo del mock.

L’audit del 2026-05-15 conferma che la dashboard MVP deve essere più selettiva del mock e più selettiva dell’attuale prototipo applicativo. L’overview non deve diventare una pagina indice con anteprime di tutte le viste T1-T8: deve mostrare solo ciò che orienta una decisione immediata sulla gara.

La sequenza corretta è:

1. audit dei widget dashboard;
2. integrazione della grammatica visuale stabile nel MVP;
3. implementazione selettiva dei soli widget approvati;
4. verifica browser desktop/mobile su fixture.

## Cosa integrare subito

Questi elementi possono essere portati nel MVP senza aspettare l’audit completo dei contenuti:

| Elemento | Decisione | Motivo |
| --- | --- | --- |
| App shell desktop | Integrare | È coerente con dashboard operativa e sidebar già prevista. |
| Sidebar come linea di lavoro | Integrare con misura | Rafforza il carattere TPL senza cambiare i dati. |
| Token visuali `route-*` | Integrare | Sono già governati dalla direzione 1C-bis. |
| Route strip a nodi | Integrare selettivamente | Esiste già un componente MVP, va riallineato al mock e alle fixture. |
| T-node provvisorio | Integrare | Dà identità senza introdurre logo definitivo. |
| Pannello fonte aperta | Integrare | È distintivo ed evidence-first. |

## Cosa non integrare ancora

Questi elementi non vanno copiati nel MVP prima dell’audit:

| Elemento | Decisione | Motivo |
| --- | --- | --- |
| Tutti i box sotto la route strip | Audit prima | Alcuni sono utili, altri rischiano di essere riempitivo. |
| Mini mappa compatta del Tender | Audit prima | Deve dimostrare utilità rispetto alla route strip, altrimenti è ridondante. |
| Preview card delle viste specialistiche | Audit prima | Devono essere basate su dati reali e azioni, non su categorie decorative. |
| Mobile definitivo | Dopo desktop | Il mobile deve derivare dalla dashboard validata, non anticiparla. |
| Viste specialistiche complete | Fase 4/slice dedicate | Il mock le suggerisce, ma non le specifica abbastanza. |

## Esito audit widget

| Widget | Decisione | Dati richiesti | Azione utente | Note |
| --- | --- | --- |
| Header Tender e badge stato | Approvato | `Tender`, `DashboardValidationState` | Aprire dettaglio gara o fonte del blocker | Deve rispondere a “che gara è e in che stato è”. |
| Metriche headline | Approvato con taglio | `headline_indicators`, `review.blocking_count`, `clarifications.ready_count`, `documents.currentness_status`, `dashboard.validation_state.overall` | Aprire fonte, review o vista collegata | Massimo 4. Devono essere P0 o calcolate da review/indicatori. |
| Fonte aperta | Approvato | `SourceReferenceDetail`, `ReviewItemSummary` | Aprire fonte e review collegata | Deve mostrare estratto sintetico, stato e impatto. |
| Route strip | Approvato | `TenderRouteStrip` derivata da indicatori, review, source reference e AI gate | Navigare alla vista o al blocker | Codici: `DOC`, `TIME`, `DEL`, `REQ`, `QA`, `FIN`, `COST`, `CRIT`. |
| Box edge sotto route strip | Approvato solo per blocker | `route_network.edges`, `ReviewItemSummary` | Aprire il blocker | Mostrare massimo 3-4 edge, non descrizioni decorative. |
| Mappa compatta Fonti/Da consolidare/Blocchi | Non approvata per MVP | Duplicata da route strip e review | Nessuna azione distinta | Da eliminare dall’overview MVP. Può tornare se emerge un caso d’uso specifico. |
| Prossime decisioni | Approvato | `ReviewItemSummary`, `TimelineEvent`, `ClarificationThread`, `DashboardValidationState` | Validare, aprire fonte o vista | Sostituisce timeline generica quando l’evento cambia una decisione. |
| Preview Deliverables | Spostare | `TenderDeliverable[]` | Aprire `/deliverables` | In overview mostrare solo se contiene blocker P0. |
| Preview Q&A | Spostare/comprimere | `ClarificationThread[]`, `review.blocking_count` | Aprire `/queries` o review | In overview resta solo come alert se cambia timeline, deliverables o dashboard state. |
| Preview Financials | Spostare/comprimere | `FinancialItem[]`, AI gate, review item | Aprire `/financials` | In overview solo stato/gate, mai valori economici non validati. |
| Preview Criticità | Approvato se prioritario | `ContradictionCandidate[]`, `ReviewItemSummary` | Aprire `/contradictions` o review | Mostrare solo criticità alte/critiche, non lista completa. |
| Q&A con impatto | Comprimere | `ClarificationThread` con `requires_dashboard_update=true` | Aprire thread o review | Deve diventare alert o riga in “Prossime decisioni”. |
| Priorità da validare | Approvato | `ReviewItemSummary[]` | Confermare, correggere, contestare, segnare da chiarire | È il cuore operativo della dashboard. |
| Inspector fonte | Approvato | `SourceReferenceDetail`, `ReviewItemDetail` | Aprire fonte, azione review, viste collegate | In MVP può essere pannello laterale o sezione dedicata, non necessariamente sempre visibile. |
| Viste specialistiche derivate | Rimandato | Shape dedicate T1-T8 | Navigare alle route dedicate | Non sono parte dell’overview, servono per Fase 4/slice dedicate. |

## Widget overview approvati

La dashboard gara MVP deve partire da questi blocchi, in questo ordine:

1. **Header Tender**: nome gara, fase, stato dashboard, privacy, badge principali.
2. **Metriche headline**: massimo 4 valori P0 o calcolati, tutti cliccabili o collegati a fonte/stato.
3. **Route strip**: 8 nodi primari con stato e blocker, senza duplicare la verità dei dati.
4. **Fonte aperta / Inspector fonte**: il dato o blocker selezionato deve mostrare fonte, impatto e azione.
5. **Prossime decisioni**: 3-5 elementi che cambiano scadenze, validità, review o lavoro dell’offerta.
6. **Priorità da validare**: coda corta ordinata per rischio e blocco.
7. **Alert mirati**: solo Q&A, Financials, AI gate o documenti se cambiano dashboard state o bloccano un P0.

## Widget da eliminare o spostare

| Widget | Destinazione |
| --- | --- |
| Mini mappa Fonti/Da consolidare/Blocchi | Eliminare dall’overview MVP. |
| Preview complete Documenti/Timeline/Deliverables/Requisiti/Financials/Cost driver/Q&A/Audit | Spostare nelle viste dedicate. |
| Q&A thread esteso | Vista `/queries`, con alert sintetico in overview solo se bloccante. |
| Financials detail | Vista `/financials`, con sintesi stato/gate in overview. |
| Audit content | Vista `/audit`, salvo ultimo gate bloccante come badge/alert. |
| Viste specialistiche derivate del mock | Roadmap Fase 4, non port immediato. |

## Impatto sul prototipo applicativo esistente

L’attuale prototipo Next contiene già:

- `TenderRouteStrip`;
- metriche headline;
- `Priorità operative`;
- anteprime di tutte le sezioni T1-T8;
- `Q&A da incorporare` come notice;
- route specialistiche separate.

L’allineamento al mock non deve aggiungere altri blocchi sopra questa struttura. Deve invece ridurre e rifinire:

- mantenere la route strip, ma riallinearla a codici e grammatica visuale del mock;
- sostituire le preview estese con una dashboard più corta;
- promuovere `Fonte aperta`/inspector come pattern evidence-first;
- rendere `Priorità operative` più simile a `Priorità da validare`;
- trasformare Q&A e Financials in alert/stati quando bloccano, non in sezioni duplicate;
- lasciare Documenti, Timeline, Deliverables, Requisiti, Cost driver, Q&A completo, Financials e Audit alle rispettive route.

## Mapping minimo widget-dati

| Widget approvato | Fonte dati primaria | Fonte dati secondaria |
| --- | --- | --- |
| Header Tender | `Tender` | `DashboardValidationState`, `TenderPolicySummary` |
| Metriche headline | `IndicatorValue.is_headline=true` | `ReviewItemSummary`, indicatori calcolati |
| Route strip | `TenderRouteStrip` | `IndicatorValue`, `ReviewItemSummary`, `AiGateDecisionSummary` |
| Fonte aperta / Inspector | `SourceReferenceDetail` | `ReviewItemDetail`, route collegata |
| Prossime decisioni | `ReviewItemSummary` | `TimelineEvent`, `ClarificationThread`, `DashboardValidationState` |
| Priorità da validare | `ReviewItemSummary[]` | `SourceReferenceSummary` |
| Alert mirati | `ReviewItemSummary`, `AiGateDecisionSummary`, `ClarificationThread` | `DashboardValidationState` |

## Priorità implementativa

1. Rifinire shell, sidebar e route strip usando token e codici del mock.
2. Ridurre `DashboardView` ai widget approvati.
3. Aggiungere o derivare il pattern `Fonte aperta`/inspector.
4. Collegare metriche, priorità e alert a fixture/data contract esistenti.
5. Verificare desktop e mobile con browser su almeno una gara `open_critical_issues` e una `validated_internal`.

## Regole per approvare un widget

Un widget può entrare nella dashboard MVP solo se risponde a tutte queste domande:

1. Quale decisione aiuta a prendere?
2. Da quale dato fixture o contratto deriva?
3. Mostra fonte, stato o review quando il dato non è consolidato?
4. Cosa succede se l’utente clicca?
5. Perché deve stare in overview e non nella vista specialistica?

Se una risposta manca, il widget va eliminato, accorpato o spostato.

## Output atteso dell’audit

L’audit produce già una prima lista decisionale sufficiente per iniziare l’allineamento del MVP. Prima di chiuderlo definitivamente, va rieseguita una verifica sul browser dopo il primo refactor della dashboard.

## Prossimo passo operativo

Passare all’allineamento selettivo del codice MVP: shell, route strip, riduzione overview e pattern fonte aperta. Non portare il mock HTML come struttura completa.
