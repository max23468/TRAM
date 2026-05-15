# Copenhagen M1-M4 O&M - Analisi semantica benchmark

Data: 2026-05-12
Stato: prima analisi semantica per TRAM V1
Pacchetto locale: `/Users/Matteo/Documents/TRAM/data/packages/copenhagen-m1-m4-om/`

## Scopo

Questa nota sintetizza il primo passaggio di analisi semantica sul pacchetto Copenhagen M1-M4 O&M.

L’obiettivo non è sostituire l’analisi completa di gara, ma capire che cosa TRAM V1 deve saper leggere, organizzare e mostrare quando riceve un pacchetto ITT O&M evolutivo, con documenti contrattuali, specifiche tecniche, allegati, prezzi, schedule `.mpp`, versioni successive e track changes.

## Fonti analizzate

Fonti locali principali:

- `Instructions to Tender v5.pdf`;
- `List of Essential Tender Documents.pdf`;
- `Procurement Schedule v3.mpp`;
- `Conditions of Contract.docx` e PDF collegato;
- `Definitions and Abbreviations`;
- `Change Management`;
- `Key Baseline Assumptions`;
- `Contract Specifications`;
- allegati tecnici principali, in particolare Payment, Traffic Operations, Standards and Compliance, Meeting Requirements, Reporting Requirements, Transition and Interface Agreement, Asset Inspections and Condition Assessment;
- `Schedule of Prices Excel Workbook v5.xlsx`.

Fonti web di contesto:

- Metroselskabet, pagina progetto “The future operation and maintenance contract (O&M)”: https://metroselskabet.dk/en/projects-and-development/current-projects/the-future-operation-and-maintenance-contract-om/
- Metroselskabet, comunicato 1 luglio 2025: https://metroselskabet.dk/en/contact-and-press/press/press-releases/future-operation-and-maintenance-of-copenhagen-metro-sent-out-for-tender/
- Metroselskabet, comunicato 1 settembre 2025: https://metroselskabet.dk/en/contact-and-press/press/press-releases/great-interest-in-operating-the-metro-in-copenhagen-three-tenderers-will-proceed-in-the-tender-process/
- EU Tenders, procurement details Copenhagen Metro O&M: https://op.europa.eu/en/web/public-procurement/procurement-details/-/procurement/27055ac2-c281-33e0-a083-7415b359463a
- EUR-Lex, Regulation (EU) 2016/2338: https://eur-lex.europa.eu/legal-content/en/TXT/?uri=CELEX%3A32016R2338

## Classificazione procurement

Il pacchetto Copenhagen va trattato come ITT/tender pack O&M post-prequalifica, dentro una procedura negoziata.

Segnali principali:

- l’ITT dichiara che la gara è una negotiated procedure;
- l’ITT copre il periodo dopo la prequalifica e fino alla firma del contratto;
- la prequalifica è richiamata nel Contract Notice 423877-2025 e nell’ESPD;
- Metroselskabet conferma pubblicamente che si tratta di EU tender con negotiation and prequalification;
- al 1 settembre 2025 risultano tre tenderer prequalificati;
- il pacchetto contiene più versioni di ITT, track changes e documenti contrattuali aggiornati.

Alla data di questa analisi, 2026-05-12, la timeline del pacchetto colloca la gara dopo la prima negoziazione e poco prima della scadenza per il first revised tender, indicata al 2026-05-15.

Implicazione per TRAM: Copenhagen non è un ITT statico. È un pacchetto vivo, dove un requisito o una regola può essere corrente, negoziabile, superata, rettificata o ancora oggetto di chiarimento.

## Mappa dei documenti e ruoli

### Tender documents

Ruolo: governano la fase di offerta.

Contenuti chiave:

- istruzioni ai tenderer;
- calendario di gara;
- regole di comunicazione;
- metodologia dei requisiti;
- criteri di aggiudicazione;
- deliverable di offerta;
- modelli per form of tender, schedule of prices, riserve, subcontractor list, letter of commitment.

TRAM deve estrarre da questa famiglia soprattutto timeline, output richiesti ai bidder, vincoli formali, pesi di valutazione, limiti pagina e regole di submission.

### Conditions of Contract

Ruolo: base contrattuale e allocazione dei rischi.

Contenuti chiave:

- durata, mobilizzazione, Start of Operation e Operation Period;
- obblighi generali dell’O&M Provider;
- asset messi a disposizione;
- change management;
- reporting, supervision, quality management;
- payment, third-party works, insurance, liability, penalties;
- data, deliverables, intellectual property, confidentiality;
- termination, step-in rights, disputes;
- sezione specifica su Artificial Intelligence.

TRAM deve trattare questo blocco come fonte principale per obblighi, rischi, responsabilità, penali, diritti di Metroselskabet, claims e condizioni di modifica.

### Contract Specifications

Ruolo: capitolato tecnico-operativo O&M.

Contenuti chiave:

- vision del servizio;
- performance measurability;
- operation;
- maintenance;
- investment e third-party works;
- organisation and management processes;
- contract management;
- mobilisation;
- end of contract.

TRAM deve trattare questo blocco come fonte principale per requisiti tecnici, KPI, attività operative, manutenzione, processi, piani, procedure e deliverable gestionali.

### Allegati tecnici

Ruolo: dettaglio operativo specialistico.

Allegati mappati nel Contract Specifications:

- A Payment;
- B Traffic Operations;
- C Nordhavn Extension and M5;
- D Standards and Compliance;
- E Re-signalling and Rolling Stock Renewal;
- F Information Sharing Platform;
- G Meeting Requirements;
- H Reporting Requirements;
- I Static and Dynamic Signage;
- J Headway Plans;
- K Travel Pass and Event Tickets;
- L Refurbishment Project;
- M Transition and Interface Agreement;
- M.1 Transfer of Employees;
- M.2 Asset Inspections and Condition Assessment;
- NL VDR.

TRAM deve collegare ogni requisito al suo allegato e non limitarsi al documento principale, perché molte informazioni utilizzabili per costi, staffing, sistemi e piani sono negli allegati.

## Network e perimetro O&M

Segnali estratti:

- oggetto: operation and maintenance del sistema completo Copenhagen Metro M1, M2, M3 e M4;
- rete: quattro linee;
- stazioni: 44;
- estensione: Metroselskabet parla di 43 km di track, mentre EU Tenders indica circa 40 km di double track;
- servizio: sistema 24/7;
- automazione: fully automated, driverless, GoA4;
- struttura tecnica: due sistemi separati, M1/M2 e M3/M4, ciascuno con proprio Control and Maintenance Center;
- operazione senza operator staff sui treni;
- asset: tunnel, stazioni, strutture, power supply, traction power, permanent way, ATC, platform screen doors/gates, passenger information/security systems, SCADA, access control, intrusion detection, radio, transmission, passenger counting, Rejsekort/ticketing, vehicles, escalators, CMC, manuals, IT systems, spare parts e consumables.

Nota critica: il dato “43 km” e il dato “40 km double track” non vanno fusi automaticamente. TRAM deve conservare valore, unità, formulazione e fonte. In dashboard può mostrare un dato preferito, ma deve mantenere l’evidenza delle differenze.

## Timeline di gara

Date principali da ITT:

| Evento | Data |
| --- | --- |
| Publishing Contract Notice | 2025-06-30 |
| Submission of prequalification application | 2025-07-31, 13:00 CET |
| Prequalification / invitation to tender | 2025-08-30 |
| Project Briefing | settembre 2025 |
| Submission of the first Tender | 2026-02-09 |
| First round of negotiation meetings | 2026-03-19/20, 2026-03-23/24, 2026-03-25/26 |
| Submission of the first revised Tender | 2026-05-15 |
| Second round of negotiation meetings, if any | 2026-06-15, 2026-06-16, 2026-06-17 |
| Submission of the second revised Tender, if any | 2026-07-15 |
| Contract Award | 2026-08-28 |
| Standstill period | 2026-08-28 - 2026-09-07 |
| Expected contract signing | 2026-09-25 |

Il file `.mpp` aggiunge passaggi operativi utili:

- preparing applications: 2025-06-30 - 2025-07-30;
- evaluation applications: 2025-07-30 - 2025-08-29;
- preparing tenders: 2025-08-30 - 2026-02-09;
- release MOM dopo le negotiation meeting di marzo 2026;
- release basis for revised tender: 2026-04-13;
- preparing revised tender: 2026-04-13 - 2026-05-15;
- contract preparation: 2026-08-31 - 2026-09-25;
- start mobilisation: 2026-09-29.

Implicazione per TRAM: la timeline non deve essere solo una lista di date. Deve distinguere eventi, finestre di lavoro, milestone, eventi condizionati e versioni documentali associate.

## Timeline contrattuale

Segnali principali:

- Contract signing atteso: 2026-09-25;
- Start Mobilisation nel file `.mpp`: 2026-09-29;
- Start of Operation: 2027-09-29;
- durata Operation Period fino al 2039, con opzione di estensione per massimo 36 mesi;
- Conditions of Contract: Metroselskabet può estendere l’Operation Period tre volte, fino a dodici mesi per volta;
- il provider deve presentare una readiness declaration un mese prima dello Start of Operation;
- Metroselskabet deve confermare lo Start of Operation non oltre quattordici giorni prima;
- ritardo nello Start of Operation può generare una penale settimanale rilevante.

Implicazione per TRAM: la dashboard deve separare la gara dalla vita contrattuale. Per l’utente O&M sono due timeline diverse: procurement e contract delivery.

## Requisiti e metodo di estrazione

L’ITT distingue:

- Minimum Requirements, cioè requisiti mandatori che non possono essere modificati durante la gara, salvo eccezioni previste, e non sono oggetto di valutazione perché devono essere rispettati;
- General requirements, cioè requisiti diversi dai minimum requirements, potenzialmente oggetto di negoziazione, che devono comunque essere rispettati nell’offerta finale.

Esempi di Minimum Requirements nelle specifiche:

- il provider deve eseguire la mobilizzazione per essere pronto allo Start of Operation;
- il provider è responsabile dell’operazione della Copenhagen Metro;
- il provider è responsabile della maggioranza della manutenzione;
- il provider deve assistere demobilizzazione e passaggio al successivo provider.

Implicazione per TRAM: il requisito non basta estrarlo come testo. Servono almeno:

- tipo requisito: MR, general requirement, obligation, information, evaluation factor;
- fase: tender, negotiation, contract, mobilisation, operation, end of contract;
- fonte;
- stato: corrente, superato, modificato, dubbio;
- impatto: tecnico, economico, staffing, rischio, deliverable, compliance.

## KPI e performance regime

I KPI centrali emergono da Contract Specifications e Key Baseline Assumptions:

- Operation: Service Availability, Service Precision, Travel Time;
- Customer Satisfaction;
- Maintenance: Short-Term Maintenance, Long-Term Maintenance;
- Collaboration and Projects: Collaboration.

Elementi importanti:

- Service Availability misura l’aderenza all’Headway Plan;
- Service Availability è calcolata separatamente per M1/M2 e M3/M4;
- la formula usa Planned Departures, Actual Departures, Missed Departures, Unplanned Departures e Quality Exclusions;
- Rush-Hour Service Availability usa fasce 07:00-09:00 e 15:00-18:00, esclusi alcuni headway plans;
- Service Precision si applica quando l’headway schedulato è di almeno 10 minuti;
- Service Precision considera delayed una departure se non avviene tra 30 secondi prima e 150 secondi dopo l’orario pianificato;
- Travel Time misura il 90° percentile dell’Interstation Run Time su journey type specifici;
- Long-Term Maintenance coincide con Asset Condition Assessment KPI.

Implicazione per TRAM: i KPI sono candidati forti per visualizzazioni grafiche V1, ma in prima fase è più importante mapparne struttura, fonte, formula, soglie e impatto bonus/malus. Il calcolo automatico completo può arrivare dopo.

## Deliverable di offerta

Il pacchetto definisce deliverable di tender con ruolo diretto nella valutazione:

| Ref | Deliverable | Peso o uso | Limite |
| --- | --- | --- | --- |
| EP | Evaluated Price e Form of Tender | prezzo | template obbligatorio |
| EP | Schedule of Prices in PDF | prezzo | template obbligatorio |
| N | Reservations | non direttamente valutativo | massimo 2 pagine |
| M | Mobilisation | qualità 10% | massimo 105 pagine |
| CO | CVs and Organisation | qualità 25% | massimo 135 pagine, CV esclusi; massimo 20 CV, 3 pagine ciascuno |
| Re-I | Re-investment / Investment Projects | qualità 5% | massimo 95 pagine |
| 3xR | Re-signalling and Rolling Stock Replacement | qualità 5% | massimo 95 pagine |
| EX | Execution | qualità 15% | massimo 95 pagine |

Il criterio complessivo è price-quality ratio:

- Evaluated Prices: 40%;
- Quality: 60%.

TRAM deve collegare i deliverable a:

- criterio e sub-criterio;
- contenuto richiesto;
- evaluation factors;
- limiti formali;
- requisiti collegati;
- rischi di non conformità;
- attività che generano effort interno per l’offerta.

## Costi e price taxonomy

Lo Schedule of Prices XLSX contiene una struttura utile come tassonomia di costo:

- Evaluated Price;
- Schedule of Prices Summary;
- Operation;
- Maintenance;
- Train Maintenance M1/M2;
- Train Maintenance M3/M4;
- Signalling System M1/M2;
- Signalling System M3/M4;
- Permanent Way M1/M2;
- Permanent Way M3/M4;
- Operational Systems M1/M2;
- Operational Systems M3/M4;
- IT Systems;
- Administration / Other.

Implicazione per TRAM: per Copenhagen, la tassonomia di costo distingue sia per dominio O&M sia per sistema M1/M2 vs M3/M4. Questa distinzione è molto utile anche per il modello dati: una stessa attività può avere natura operativa, manutentiva, IT, amministrativa o system-specific.

## Versioni, integrazioni e anomalie

Segnali rilevati:

- presenza di ITT v3, v4, v5 e versioni con track changes;
- Contract Specifications versione 2.0 del 2026-04-13;
- Conditions of Contract con versioning e confronto;
- release basis for revised tender nel file `.mpp` al 2026-04-13;
- documenti tender e contract con liste essenziali non perfettamente identiche;
- ITT che richiama Regulation (EU) 2026/2338, ma la fonte normativa corretta sembra essere Regulation (EU) 2016/2338;
- metadati e testi estratti presentano alcune incongruenze di data/versione, per esempio riferimenti combinati tipo `2026-04-1325-06-30` nelle Conditions of Contract.

Implicazione per TRAM: la gestione versioni deve essere disegnata già nell’MVP. Non basta ordinare i file per nome. Serve una logica che riconosca:

- version number;
- issue date;
- document ID;
- track changes;
- relazione tra versione pulita e versione con modifiche;
- documento sostituito;
- documento che integra o corregge;
- anomalia da portare all’utente.

## Cosa TRAM dovrebbe mostrare in dashboard V1

Per Copenhagen la dashboard V1 dovrebbe mostrare almeno:

- stato procedurale: ITT post-prequalifica, procedura negoziata, first revised tender in corso;
- prossime scadenze di gara;
- timeline procurement e timeline contratto separate;
- network card con linee, stazioni, km, servizio 24/7, GoA4, sistemi M1/M2 e M3/M4;
- mappa documenti per ruolo: tender, contract, specification, attachment, pricing, schedule, VDR;
- top requirement clusters: operation, maintenance, mobilisation, reporting, asset management, passenger services, IT/cyber, transition, end of contract;
- KPI map con SA, SP, TT, Customer Satisfaction, STM, LTM, Collaboration;
- tender deliverables con pesi, limiti pagina e output richiesti;
- cost taxonomy da Schedule of Prices;
- alert su anomalie: versioni multiple, dati di network divergenti, riferimento normativo probabilmente errato, document lists non allineate;
- dubbi da validare con utente.

## Implicazioni per MVP

### Must-have

- ingestione PDF, DOCX, XLSX e MPP;
- classificazione documentale per ruolo e fase;
- estrazione timeline da PDF e MPP;
- riconoscimento versioni e track changes;
- estrazione deliverable di tender;
- estrazione KPI e requisiti principali;
- collegamento fonte-dato;
- stato di confidenza o “da validare”;
- dashboard sintetica per gara.

### Should-have

- confronto semantico tra versioni;
- normalizzazione dei requisiti in cluster O&M;
- mappa costo-attività derivata da pricing workbook;
- alert automatici su contraddizioni e anomalie;
- query draft per la stazione appaltante.

### Non ancora da automatizzare troppo

- interpretazione legale definitiva;
- calcolo completo bonus/malus;
- ranking automatico di rischi economici senza validazione umana;
- suggerimenti negoziali non tracciati a fonte;
- apprendimento automatico dai feedback senza governance.

## Data model minimo suggerito

Entità utili emerse dal caso Copenhagen:

- `Tender`: gara/spazio;
- `DocumentPackage`: pacchetto caricato;
- `Document`: singolo file;
- `DocumentVersion`: versione, track changes, issue date, document ID;
- `DocumentRole`: ITT, contract, specification, attachment, pricing, schedule, clarification, VDR;
- `ProcurementEvent`: evento di gara;
- `ContractEvent`: evento contrattuale;
- `Requirement`: requisito o obbligo;
- `RequirementType`: MR, general requirement, obligation, evaluation factor, information;
- `TenderDeliverable`: output richiesto al bidder;
- `KPI`: metrica, formula, soglia, bonus, malus;
- `AssetScope`: network, linee, sistemi, asset, CMC;
- `CostDriver`: attività che genera costo;
- `ContradictionCandidate`: potenziale conflitto o anomalia;
- `ClarificationDraft`: bozza di query;
- `UserValidation`: conferma, correzione, rigetto, nota esperta.

## Open issues da recuperare

- Analizzare nel dettaglio Appendix 5 Change Management.
- Estrarre il glossario da Definitions and Abbreviations e capire quali definizioni sono riutilizzabili in più gare.
- Verificare se l’Artificial Intelligence clause introduce vincoli concreti su uso AI, dati, vendor o output.
- Confrontare le versioni ITT v3, v4 e v5 per misurare il valore del version comparison.
- Confrontare la lista essenziale tender documents con la lista allegati del Contract Specifications.
- Estrarre i requisiti reporting da Attachment H in tabella.
- Estrarre dal Payment attachment il payment mechanism e i legami bonus/malus.
- Preparare una prima lista di query potenziali per Metroselskabet, partendo da date/versioni, riferimento normativo e divergenze documentali.

## Decisione di prodotto provvisoria

Copenhagen è un benchmark più utile di un mock perché contiene quasi tutti i problemi reali che TRAM dovrà gestire:

- procurement multi-stage;
- fase negoziata;
- documenti aggiornati;
- track changes;
- MPP schedule;
- workbook prezzi;
- specifiche O&M profonde;
- KPI formalizzati;
- obblighi di mobilizzazione;
- transizione da provider corrente;
- sistema 24/7 driverless;
- documenti pubblici e privati da riconciliare.

Per TRAM V1, Copenhagen va usato come caso guida per disegnare dashboard, data model e pipeline documentale minima. Luas servirà come confronto cross-country e cross-mode, soprattutto per capire quali campi sono davvero standardizzabili tra metro e light rail.

## Prossimo passo consigliato

Usare questa analisi per produrre una prima griglia standard TRAM di estrazione V1:

- tabella “Network”;
- tabella “Procurement timeline”;
- tabella “Contract timeline”;
- tabella “Document map”;
- tabella “Tender deliverables”;
- tabella “KPI”;
- tabella “Cost drivers”;
- tabella “Open issues / contradictions”.

Questa griglia diventerà il primo scheletro della dashboard Copenhagen e poi verrà testata sul pacchetto Luas.
