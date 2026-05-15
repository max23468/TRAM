# Copenhagen M1-M4 O&M - Griglia estrazione V1

Data: 2026-05-12
Stato: prima griglia standard TRAM V1 compilata su Copenhagen
Pacchetto locale: `/Users/Matteo/Documents/TRAM/data/packages/copenhagen-m1-m4-om/`

## Scopo

Questa griglia trasforma l’analisi semantica Copenhagen in un formato più operativo, pensato per diventare:

- scheletro della dashboard di gara;
- base del data model V1;
- checklist di estrazione automatica o semi-automatica;
- formato di confronto con il pacchetto Luas.

La griglia deve essere letta insieme alla tassonomia indicatori TRAM: `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-taxonomy.md`.

Ogni riga deve conservare fonte, stato e possibile uso in TRAM. Il punto non è solo “estrarre dati”, ma capire se un dato è corrente, negoziabile, da validare, contraddittorio o utile per una decisione O&M.

## Convenzione colonne

| Colonna | Significato |
| --- | --- |
| Campo TRAM | Nome sintetico del dato da rappresentare in app |
| Valore Copenhagen | Dato estratto o normalizzato dal pacchetto |
| Fonte primaria | Documento o fonte web da cui deriva |
| Stato | Corrente, da validare, candidato alert, derivato o incompleto |
| Uso MVP | Come il dato può apparire nella V1 |

## 1. Network

| Campo TRAM | Valore Copenhagen | Fonte primaria | Stato | Uso MVP |
| --- | --- | --- | --- | --- |
| Nome gara | Copenhagen Metro M1-M4 O&M | ITT, Contract Notice, Metroselskabet | Corrente | Titolo spazio |
| Modalità | Metro | Contract Notice, Metroselskabet | Corrente | Filtro dashboard multi-gara |
| Ambito contratto | Operation and maintenance del sistema completo M1, M2, M3, M4 | EU Tenders, Contract Specifications | Corrente | Card perimetro |
| Linee | M1, M2, M3, M4 | Metroselskabet, EU Tenders | Corrente | Network summary |
| Stazioni | 44 | Metroselskabet, EU Tenders | Corrente | Network summary |
| Estensione rete | 43 km di track secondo Metroselskabet; circa 40 km double track secondo EU Tenders | Metroselskabet, EU Tenders | Candidato alert | Mostrare valore con fonte e nota di differenza |
| Regime servizio | 24/7 | EU Tenders, Contract Specifications | Corrente | Rilevanza operativa e cost driver |
| Automazione | Fully automated, driverless, GoA4 | EU Tenders | Corrente | Network summary e risk profile |
| Sistemi tecnici | M1/M2 e M3/M4 come due sistemi separati | EU Tenders, Contract Specifications | Corrente | Segmentazione KPI, costi e requisiti |
| Control and Maintenance Center | Un CMC per M1/M2 e un CMC per M3/M4 | EU Tenders | Corrente | Asset scope |
| Staff a bordo | Operazione senza operator staff sui treni | EU Tenders | Corrente | Staffing e passenger service |
| Asset principali | Tunnels, stations, power supply, traction power, permanent way, ATC, platform screen doors/gates, passenger systems, SCADA, access control, radio, transmission, vehicles, escalators, CMC, IT systems, spare parts | EU Tenders, Contract Specifications | Corrente | Asset map |

## 2. Procurement timeline

| Campo TRAM | Valore Copenhagen | Fonte primaria | Stato | Uso MVP |
| --- | --- | --- | --- | --- |
| Tipo procedura | Negotiated procedure con prequalification | ITT, Metroselskabet | Corrente | Badge fase gara |
| Publishing Contract Notice | 2025-06-30 | ITT, MPP | Corrente | Timeline procurement |
| Submission prequalification | 2025-07-31, 13:00 CET | ITT | Corrente | Timeline procurement |
| Invitation to tenderers | 2025-08-30 | ITT, MPP | Corrente | Timeline procurement |
| Project Briefing | Settembre 2025 | ITT | Corrente | Timeline procurement |
| Submission first tender | 2026-02-09 | ITT, MPP | Corrente | Timeline procurement |
| First negotiation meetings | 2026-03-19/20, 2026-03-23/24, 2026-03-25/26 | ITT, MPP | Corrente | Timeline procurement |
| Release MOM first negotiation | 2026-03-30, 2026-03-31, 2026-04-01 | MPP | Derivato da schedule | Timeline dettagliata |
| Release basis for revised tender | 2026-04-13 | MPP | Corrente | Versioning event |
| Submission first revised tender | 2026-05-15 | ITT, MPP | Corrente | Scadenza critica |
| Second negotiation meetings, if any | 2026-06-15, 2026-06-16, 2026-06-17 | ITT, MPP | Condizionato | Timeline con flag “if any” |
| Submission second revised tender, if any | 2026-07-15 | ITT, MPP | Condizionato | Timeline con flag “if any” |
| Contract Award | 2026-08-28 | ITT | Corrente | Milestone gara |
| Standstill period | 2026-08-28 - 2026-09-07 | ITT, MPP | Corrente | Milestone gara |
| Contract signing | 2026-09-25 | ITT, MPP, Metroselskabet | Corrente | Milestone gara e inizio contratto |

## 3. Contract timeline

| Campo TRAM | Valore Copenhagen | Fonte primaria | Stato | Uso MVP |
| --- | --- | --- | --- | --- |
| Start mobilisation | 2026-09-29 | MPP | Corrente | Timeline contratto |
| Mobilisation phase | Da firma contratto a Start of Operation | Conditions of Contract | Corrente | Workstream mobilizzazione |
| Readiness declaration | Un mese prima dello Start of Operation | Conditions of Contract | Corrente | Alert contrattuale |
| Conferma Start of Operation | Entro quattordici giorni prima dello Start of Operation | Conditions of Contract | Corrente | Alert contrattuale |
| Start of Operation | 2027-09-29 | Conditions of Contract, Metroselskabet | Corrente | Milestone contrattuale critica |
| Hyper Care Period | Primi tre mesi dopo Start of Operation | Conditions of Contract | Da approfondire | Workstream iniziale |
| Operation Period end | 2039 | Conditions of Contract, Metroselskabet | Corrente | Timeline contratto |
| Opzioni estensione | Tre estensioni fino a dodici mesi ciascuna, massimo 36 mesi | Conditions of Contract | Corrente | Scenario timeline |
| Demobilisation / handover | Assistenza al successivo O&M Provider | Contract Specifications | Corrente | End of contract |
| Penale Start of Operation | Penale settimanale rilevante in caso di ritardo imputabile al provider | Conditions of Contract | Da validare importo/testo | Risk alert |

## 4. Document map

| Campo TRAM | Valore Copenhagen | Fonte primaria | Stato | Uso MVP |
| --- | --- | --- | --- | --- |
| Tender instructions | Instructions to Tender v3, v4, v5, anche con track changes | Cartella `a. Tender documents` | Corrente con versioni | Document map e version compare |
| Procurement schedule | PDF v2 e MPP v3 | Tender documents | Corrente | Timeline extraction |
| Form of Tender | PDF e Word, con versioni | Tender documents | Corrente | Deliverable map |
| Schedule of Prices | Excel Workbook v5 | Tender documents | Corrente | Price taxonomy |
| List of Essential Tender Documents | Documento tender e appendice contract | Tender documents, Conditions appendices | Candidato confronto | Document map e alert |
| Conditions of Contract | DOCX e PDF v2.0, comparison v1.0 | Conditions folder | Corrente con versioni | Contract obligations |
| Definitions and Abbreviations | Appendix 1 | Conditions folder | Da estrarre | Glossario |
| Change Management | Appendix 5 | Conditions folder | Da analizzare | Versioning e claims |
| Key Baseline Assumptions | Appendix 7 | Conditions folder | Estratto parziale | Baseline e KPI |
| Contract Specifications | Versione 2.0, 2026-04-13 | Contract specification folder | Corrente | Requirements core |
| Technical attachments | A, B, C, D, E, F, G, H, I, J, K, L, M, M.1, M.2, NL | Contract Specifications | Corrente | Requirement clusters |
| VDR | Richiamato come Virtual Data Room | Essential Tender Documents, Contract Specifications | Incompleto nel pacchetto locale | Data room scope |

## 5. Tender deliverables

| Campo TRAM | Valore Copenhagen | Fonte primaria | Stato | Uso MVP |
| --- | --- | --- | --- | --- |
| Award model | Price-quality ratio | ITT Appendix 10.1 | Corrente | Evaluation summary |
| Evaluated Prices | 40% | ITT Appendix 10.1 | Corrente | Evaluation summary |
| Quality | 60% | ITT Appendix 10.1 | Corrente | Evaluation summary |
| EP - Form of Tender | Fully completed Form of Tender | ITT Appendix 10.1 | Corrente | Deliverable checklist |
| EP - Schedule of Prices | Fully completed Schedule of Prices in PDF | ITT Appendix 10.1 | Corrente | Deliverable checklist |
| N - Reservations | Reservations, if any | ITT Appendix 10.1 | Corrente | Compliance checklist |
| N - Reservations page limit | Massimo 2 pagine | ITT Appendix 10.1 | Corrente | Formal alert |
| M - Mobilisation | Organizzazione, governance, mobilisation plan, staff transition, ottimizzazione periodo | ITT Appendix 10.1 | Corrente | Workstream offerta |
| M - Peso | 10% | ITT Appendix 10.1 | Corrente | Evaluation summary |
| M - Page limit | Massimo 105 pagine | ITT Appendix 10.1 | Corrente | Formal alert |
| CO - CVs and Organisation | Organizzazione operation period, leadership, key persons, specialist resources | ITT Appendix 10.1 | Corrente | Workstream offerta |
| CO - Peso | 25% | ITT Appendix 10.1 | Corrente | Evaluation summary |
| CO - Page limit | Massimo 135 pagine per descrizione, CV esclusi; massimo 20 CV, 3 pagine ciascuno | ITT Appendix 10.1 | Corrente | Formal alert |
| Re-I - Re-investment | Supporto a Investment Projects, capacità, disturbo minimo al 24/7, governance safety approval | ITT Appendix 10.1 | Corrente | Workstream offerta |
| Re-I - Peso | 5% | ITT Appendix 10.1 | Corrente | Evaluation summary |
| Re-I - Page limit | Massimo 95 pagine | ITT Appendix 10.1 | Corrente | Formal alert |
| 3xR | Supporto a Re-signalling and Rolling Stock Replacement su M1/M2 | ITT Appendix 10.1 | Corrente | Workstream offerta |
| 3xR - Peso | 5% | ITT Appendix 10.1 | Corrente | Evaluation summary |
| 3xR - Page limit | Massimo 95 pagine | ITT Appendix 10.1 | Corrente | Formal alert |
| EX - Execution | Fall-back operation, steward tasks, passenger information, customer service, events, maintenance coordination, CMMS data, QA, asset condition, predictive maintenance, supply chain | ITT Appendix 10.1 | Corrente | Workstream offerta |
| EX - Peso | 15% | ITT Appendix 10.1 | Corrente | Evaluation summary |
| EX - Page limit | Massimo 95 pagine | ITT Appendix 10.1 | Corrente | Formal alert |

## 6. KPI

| Campo TRAM | Valore Copenhagen | Fonte primaria | Stato | Uso MVP |
| --- | --- | --- | --- | --- |
| KPI family - Operation | Service Availability, Service Precision, Travel Time | Contract Specifications, Key Baseline Assumptions | Corrente | KPI map |
| KPI family - Customer Satisfaction | Customer Satisfaction | Contract Specifications, Key Baseline Assumptions | Corrente | KPI map |
| KPI family - Maintenance | Short-Term Maintenance, Long-Term Maintenance | Contract Specifications, Key Baseline Assumptions | Corrente | KPI map |
| KPI family - Collaboration | Collaboration | Contract Specifications, Key Baseline Assumptions | Corrente | KPI map |
| Service Availability purpose | Misura aderenza all’Headway Plan | Contract Specifications | Corrente | KPI detail |
| Service Availability scope | Calcolo separato per M1/M2 e M3/M4 | Contract Specifications | Corrente | KPI segmentation |
| Service Availability variables | PD, AD, MD, UD, QE | Contract Specifications | Corrente | Formula map |
| Rush-Hour Service Availability | 07:00-09:00 e 15:00-18:00, con esclusioni | Contract Specifications | Corrente | KPI detail |
| Service Precision trigger | Headway schedulato pari o superiore a 10 minuti | Contract Specifications | Corrente | KPI detail |
| Service Precision delayed window | Nessuna Actual Departure da 30 secondi prima a 150 secondi dopo l’orario previsto | Contract Specifications | Corrente | KPI detail |
| Travel Time method | 90° percentile ISRT per journey type | Contract Specifications | Corrente | KPI detail |
| Travel Time journey types | M1 VAN-VEA, M1 VEA-VAN, M2 VAN-CPH, M2 CPH-VAN, M3 KH-KH, M4 NEL-ORK, M4 ORK-NEL | Contract Specifications | Corrente | KPI detail |
| Long-Term Maintenance | Asset Condition Assessment KPI, target 90% | Contract Specifications | Corrente | Maintenance dashboard |
| Reporting data sources | SCADA, CMMS, FRACAS, MetroLog, altri sistemi | Contract Specifications | Corrente | Data source map |

## 7. Cost drivers

| Campo TRAM | Valore Copenhagen | Fonte primaria | Stato | Uso MVP |
| --- | --- | --- | --- | --- |
| Operation | Prezzi e attività operation, split M1/M2 e M3/M4 | Schedule of Prices | Corrente | Cost taxonomy |
| Maintenance summary | Sintesi prezzi maintenance | Schedule of Prices | Corrente | Cost taxonomy |
| Train maintenance M1/M2 | Preventive maintenance e categorie rolling stock M1/M2 | Schedule of Prices | Corrente | Cost taxonomy |
| Train maintenance M3/M4 | Preventive maintenance e categorie rolling stock M3/M4 | Schedule of Prices | Corrente | Cost taxonomy |
| Signalling M1/M2 | Signalling system maintenance M1/M2 | Schedule of Prices | Corrente | Cost taxonomy |
| Signalling M3/M4 | Signalling system maintenance M3/M4 | Schedule of Prices | Corrente | Cost taxonomy |
| Permanent Way M1/M2 | Permanent way maintenance M1/M2 | Schedule of Prices | Corrente | Cost taxonomy |
| Permanent Way M3/M4 | Permanent way maintenance M3/M4 | Schedule of Prices | Corrente | Cost taxonomy |
| Operational systems M1/M2 | Operational systems maintenance M1/M2 | Schedule of Prices | Corrente | Cost taxonomy |
| Operational systems M3/M4 | Operational systems maintenance M3/M4 | Schedule of Prices | Corrente | Cost taxonomy |
| IT Systems | IT systems administration | Schedule of Prices | Corrente | Cost taxonomy |
| Administration / Other | Administration and other prices | Schedule of Prices | Corrente | Cost taxonomy |
| Mobilisation | Piani, staff transfer, IT mobilisation, operational procedures, readiness | ITT, Conditions, Contract Specifications | Corrente | Cost driver cluster |
| Reporting | Monthly, quarterly, annual, immediate and issue-specific reporting | Attachment H, Contract Specifications | Da estrarre in dettaglio | Cost driver cluster |
| Asset condition | Asset inspections, CMMS, knowledge of asset condition, long-term maintenance KPI | Contract Specifications, Attachment M.2 | Corrente | Cost driver cluster |
| Supply chain | Critical spare parts, consumables, provider responsibility except certain TSSSA scope | Contract Specifications, EU Tenders | Corrente | Cost driver cluster |
| 3xR | Re-signalling and Rolling Stock Replacement support on M1/M2 | ITT, Attachment E | Corrente | Cost driver cluster |

## 8. Financials e payment

| Campo TRAM | Valore Copenhagen | Fonte primaria | Stato | Uso MVP |
| --- | --- | --- | --- | --- |
| Estimated contract value | Non estratto dal pacchetto locale; fonte OJEU terza indica 2,4 miliardi EUR, da verificare su fonte ufficiale | OJEU mirror, non ancora fonte primaria | Da validare | Financial summary |
| Evaluated price weight | 40% | ITT Appendix 10.1 | Corrente | Evaluation model |
| Quality weight | 60% | ITT Appendix 10.1 | Corrente | Evaluation model |
| Price workbook structure | Summary, operation, maintenance, train maintenance, signalling, permanent way, operational systems, IT, administration | Schedule of Prices | Corrente | Price structure |
| System split in pricing | M1/M2 e M3/M4 separati per molte voci | Schedule of Prices | Corrente | Cost segmentation |
| Payment mechanism | Attachment A Payment presente, non ancora sintetizzato | Contract Specifications Attachment A | Da analizzare | Payment summary |
| Bonus/malus | Presenti nei KPI e collegati a performance | Contract Specifications, Attachment A da verificare | Parziale | Financial risk |
| Penalties | Penale Start of Operation e altre penali contrattuali da mappare | Conditions of Contract | Da validare | Risk alert |
| Guarantees | Advance Payment Guarantee, Performance and Warranty Guarantee | Conditions appendices | Corrente | Financial security |
| Currency | EUR e DKK compaiono nei testi; struttura esatta da confermare | Conditions, pricing documents | Da validare | Financial normalization |
| Energy/electricity allocation | Traction power e altre electricity uses richiamate | Key Baseline Assumptions | Da analizzare | Cost allocation |
| Spare parts responsibility | Provider responsabile di spare parts e consumables, con eccezioni per contratti separati | EU Tenders, Contract Specifications | Corrente | Cost driver |
| Financial model | Non presente come modello finanziario completo nel pacchetto Copenhagen, a differenza di Luas | Inventario pacchetto | Corrente | Package comparison |

## 9. Risk allocation e governance contrattuale

| Campo TRAM | Valore Copenhagen | Fonte primaria | Stato | Uso MVP |
| --- | --- | --- | --- | --- |
| Owner / contracting entity | Metroselskabet I/S | ITT, Conditions | Corrente | Stakeholder map |
| O&M Provider responsibility | Tutto ciò che serve per erogare i servizi, salvo responsabilità espresse di Metroselskabet | Conditions of Contract | Corrente | Risk allocation |
| Authority obligations | Obblighi di Metroselskabet definiti in modo esaustivo nel contratto | Conditions of Contract | Corrente | Risk allocation |
| Claims notice | Obbligo di notice entro termini stretti per lack of participation | Conditions of Contract | Corrente | Risk alert |
| Force majeure / exclusions | Quality Exclusions e cause oltre controllo provider nei KPI | Contract Specifications | Corrente | KPI exclusions |
| Third-party works | Investment projects e third-party works durante il contratto | Contract Specifications, EU Tenders | Corrente | Interface risk |
| Reinvestment interface | 3xR e investment projects richiedono supporto provider | ITT, Attachment E | Corrente | Strategic risk |
| Change management | Appendix 5 presente, da modellare | Conditions Appendix 5 | Da analizzare | Change control |
| Step-in rights | Sezione presente nelle Conditions | Conditions of Contract | Da analizzare | Authority remedies |
| Termination | Sezioni terminate/end of contract presenti | Conditions, Contract Specifications | Da analizzare | Contract risk |
| Data ownership | Metroselskabet possiede dati/database generati da asset, servizi e deliverable | Conditions of Contract | Parziale | Data governance |

## 10. Customer, workforce e compliance

| Campo TRAM | Valore Copenhagen | Fonte primaria | Stato | Uso MVP |
| --- | --- | --- | --- | --- |
| Customer satisfaction | KPI specifico | Contract Specifications | Corrente | Customer dashboard |
| Passenger information | Oggetto di deliverable EX e requisiti operativi | ITT, Contract Specifications | Corrente | Customer experience |
| Complaints/customer service | Richiamato nei requisiti di execution/customer service | ITT, Contract Specifications | Da estrarre meglio | Customer experience |
| Accessibility/elevators/escalators | Asset e availability di elevator/escalator citati nel performance regime | Contract Specifications, EU Tenders | Parziale | Accessibility indicator |
| Cleanliness | Inclusa in maintenance/QA e steward tasks | ITT, Contract Specifications | Parziale | Customer-facing asset quality |
| Staffing transfer | Transfer of employees e handling staff durante mobilisation | ITT, Conditions, Attachment M.1 | Corrente | Workforce risk |
| Key persons | Richiesti nel deliverable CO | ITT Appendix 10.1 | Corrente | Bid deliverables |
| 24/7 manning | Richiamato nel deliverable CO e operatività 24/7 | ITT, Contract Specifications | Corrente | Staffing model |
| Labour/social clauses | Social clauses e labour clauses presenti | Conditions appendices | Da analizzare | Compliance |
| Safety management | Sezioni safety e reporting presenti | Contract Specifications | Da analizzare | Compliance |
| Cyber/IT security | IT services e cyber security nel perimetro O&M | EU Tenders, Contract Specifications | Da analizzare | Compliance |
| Data protection | Data Processing Agreement presente | Conditions appendices | Da analizzare | Compliance |
| AI clause | Sezione Artificial Intelligence presente | Conditions of Contract | Da analizzare | AI/legal risk |
| Environmental/energy/carbon | Environmental management, energy e carbon management richiamati | EU Tenders, Contract Specifications | Da analizzare | ESG/compliance |
| Sanctions/export controls | Declaration sanctions Russia e export controls presenti | Tender documents, Conditions | Da analizzare | Compliance |

## 11. AI extraction candidates

Questa sezione non decide ancora cosa farà l’AI in produzione. Serve a segnare quali task sono candidati per automazione o assistenza AI e quali richiedono validazione umana.

| Task candidato | Output atteso | Automazione candidata | Validazione richiesta |
| --- | --- | --- | --- |
| Classificazione documentale | Ruolo, fase, versione, stato corrente | AI-assisted + regole | Campione utente su documenti critici |
| Timeline extraction | Eventi, date, finestre, timezone, condizionalità | Rule-based + AI-assisted | Utente per date divergenti |
| Requirement extraction | MR, general requirement, obligation, evaluation factor | AI-assisted | Utente su requisiti ad alto impatto |
| KPI extraction | Nome, formula, soglia, esclusioni, bonus/malus | AI-assisted + parser tabelle | Utente su formule e valori economici |
| Financial extraction | Price structure, payment mechanism, penalties, guarantees | AI-assisted + parser Excel | Utente su sintesi economica |
| Contradiction detection | Mismatch numerici, normativi, versioni, document list | AI-assisted + regole | Utente prima di query esterne |
| Query draft | Bozza citata e pronta da revisionare | AI-assisted | Approvazione umana obbligatoria |
| Learning from feedback | Correzioni riusabili su tassonomia e prompt | Da progettare | Governance esplicita |

## 12. Open issues e contraddizioni

| Campo TRAM | Valore Copenhagen | Fonte primaria | Stato | Uso MVP |
| --- | --- | --- | --- | --- |
| Network length mismatch | 43 km di track vs circa 40 km double track | Metroselskabet, EU Tenders | Candidato alert | Segnalazione “dato divergente” |
| Regulation typo | ITT richiama Regulation (EU) 2026/2338, ma la fonte esterna corretta sembra Regulation (EU) 2016/2338 | ITT, EUR-Lex | Candidato query | Query draft |
| Version/date extraction anomaly | Esempi di testo estratto con date fuse, come `2026-04-1325-06-30` | Conditions of Contract extraction | Candidato controllo OCR/parser | Data quality alert |
| Essential document lists | Lista tender e lista contract da confrontare per coerenza | List of Essential Tender Documents, Appendix 6 | Da validare | Document completeness check |
| VDR content | VDR citato, ma non analizzato integralmente nel pacchetto locale | Essential Tender Documents | Incompleto | Data room gap |
| AI clause | Sezione Artificial Intelligence presente nelle Conditions, non ancora analizzata nel dettaglio | Conditions of Contract | Da analizzare | AI/legal risk |
| Change Management | Appendix 5 presente, non ancora modellato | Conditions of Contract Appendix 5 | Da analizzare | Versioning e claims |
| Reporting requirements | Attachment H letto solo a livello macro | Attachment H | Da estrarre in dettaglio | Deliverables e cost drivers |
| Payment mechanism | Attachment A non ancora sintetizzato nel dettaglio | Attachment A Payment | Da analizzare | Bonus/malus e cost model |
| Track changes value | Versioni ITT v3, v4, v5 presenti, confronto non ancora eseguito | Tender documents | Da analizzare | Version comparison |

## Vista dashboard derivata

Per una prima dashboard Copenhagen, la griglia produce questi blocchi:

| Blocco dashboard | Contenuto minimo V1 | Fonte griglia |
| --- | --- | --- |
| Header gara | Nome, modalità, fase, procedura, prossima scadenza | Network, Procurement timeline |
| Network snapshot | Linee, stazioni, km, GoA4, 24/7, split M1/M2 e M3/M4 | Network |
| Timeline gara | Milestone, finestre, eventi condizionati, standstill | Procurement timeline |
| Timeline contratto | Mobilisation, readiness, Start of Operation, end, extension options | Contract timeline |
| Document map | Ruoli documento, versioni, allegati, VDR | Document map |
| Tender deliverables | Output, pesi, limiti pagina, workstream offerta | Tender deliverables |
| KPI map | KPI family, formule, soglie, segmentazione, fonti dati | KPI |
| Cost map | Tassonomia prezzi e cluster cost driver | Cost drivers |
| Financial map | Price structure, payment mechanism, penalties, guarantees, energy/spares | Financials e payment |
| Risk map | Responsabilità, claims, force majeure, third-party works, change management | Risk allocation |
| Compliance map | Safety, cyber, data protection, AI, environmental, sanctions | Customer, workforce e compliance |
| Alert | Contraddizioni, anomalie, gap, query candidate | Open issues |

## Regole di prodotto derivate

- Ogni dato deve avere una fonte leggibile dall’utente.
- Ogni dato deve avere uno stato, anche quando sembra banale.
- Le timeline devono supportare eventi puntuali, finestre e condizioni “if any”.
- I documenti con track changes devono essere collegati alla versione pulita equivalente.
- Le anomalie non devono bloccare la dashboard: devono diventare alert o domande da validare.
- I cost driver devono nascere sia da requisiti testuali sia da workbook economici.
- I KPI devono essere rappresentati prima come mappa strutturata; il calcolo automatico può arrivare in una fase successiva.
- Le funzioni AI devono essere classificate task per task: rule-based, AI-assisted o human-only.

## Prossimo passo consigliato

Applicare la stessa griglia al pacchetto Luas per capire:

- quali campi sono universali;
- quali campi sono specifici del contesto metro;
- quali campi cambiano per light rail/tram;
- quali dati devono restare flessibili;
- quali blocchi sono davvero prioritari nella dashboard MVP.
