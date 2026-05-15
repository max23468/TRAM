# TRAM V1 - Roadmap MVP e criteri di successo v0.1

Data: 2026-05-13  
Ultimo aggiornamento: 2026-05-15  
Stato: baseline Fase 0 chiusa; Fase 1 chiusa con addendum TPL; Fase 2 chiusa su fixture networked control room; Fase 3 chiusa su data contract MVP/V0  
Ambito: roadmap V1/MVP-V0, criteri di successo, gate per wireframe funzionali e fixture applicative

## Scopo

Questo documento chiude la definizione iniziale della roadmap MVP/V0 di TRAM V1.

L’obiettivo è trasformare i documenti già creati in una sequenza operativa chiara:

- cosa entra nel primo MVP;
- cosa resta V1 ma dopo il primo rilascio interno;
- quali criteri dicono che l’MVP è utile;
- quali gate servono prima di wireframe, fixture e codice applicativo.

## Decisione

Il primo MVP TRAM usa il perimetro **MVP largo**.

Nota terminologica decisa il 2026-05-13: in TRAM il termine **MVP** va letto come **V0 operativa**. Non indica la V1 completa, ma la prima versione interna navigabile, verificabile e utile su fixture e workflow controllati.

Questo significa che tutte le aree `T1`-`T8` devono essere visibili o rappresentate nel prodotto MVP, ma non tutte hanno lo stesso livello di automazione, affidabilità o profondità.

La regola è:

- `T1`, `T2` e `T3` sono il nucleo end-to-end;
- `T4` e `T6` entrano come aree V1 controllate, con AI solo su input ammessi e minimizzati;
- `T5` entra come dominio Tender analizzabile, con parser/regole e AI ammessa secondo data policy, minimizzazione e gate provider; non è protetto per categoria;
- `T7` entra come candidate issues rules/review-first, non come verità automatica;
- `T8` entra come gestione Q&A human-first: scambi domanda-risposta tra bidder e stazione appaltante, con bozza solo come stato interno e senza invio automatico.

Questa decisione rende l’MVP più ampio, ma mantiene i guardrail già definiti: fonti, stati, data policy, ruoli, review queue e audit.

Baricentro UX deciso il 2026-05-13:

- il primo MVP è **dashboard direzionale first**;
- la prima schermata utile è `/tenders/:tender_id/overview`;
- T1-T8 sono importanti nella misura in cui alimentano overview, rischi, stato e drill-down;
- parser, review queue e viste specialistiche sono il motore di affidabilità, non il primo messaggio prodotto;
- lo stato del lavoro interno può essere mostrato solo se nasce dal flusso TRAM o da input manuali espliciti;
- l’MVP non deve stimare avanzamento o qualità dell’offerta non caricata.

Le idee precedenti non vengono cestinate: restano backlog V1 e vengono ordinate dopo la prima dashboard direzionale.

## Non obiettivi del primo MVP

Il primo MVP non deve includere:

- confronto dell’offerta preparata con la gara, che resta V2;
- benchmark cross-gara e best practice storiche, che restano V3;
- invio automatico di domande o Q&A alla stazione appaltante;
- scoring economico o sostenibilità dell’offerta;
- AI esterna su L2;
- apprendimento cross-gara non revisionato;
- export PDF/Excel completi come requisito bloccante;
- workflow approvativi multilivello;
- piattaforma enterprise multi-tenant completa.

## Roadmap MVP

### Fase 0 - Governance MVP/V0 chiusa

Stato: chiusa formalmente il 2026-05-13.

Output richiesti:

- product brief aggiornato;
- registro `indicator_key` P0/P1;
- priorità primo slice UI;
- ruoli e permessi MVP;
- data policy per gara;
- workflow ingestion-dashboard;
- specifiche operative T2/T3;
- sintesi benchmark sui quattro pacchetti;
- roadmap e criteri di successo MVP/V0;
- wireframe funzionali MVP largo;
- fixture applicative non riservate.

Criterio di uscita:

- le decisioni principali sono documentate e non serve reinterpretare il perimetro prima di procedere con le slice operative.

### Fase 1 - Wireframe funzionali

Obiettivo: disegnare l’esperienza applicativa reale, non una landing page.

Stato aggiornato il 2026-05-14: **Fase 1A chiusa formalmente; Fase 1B chiusa sul mock visuale canonico; Fase 1C chiusa sulla direzione visiva minima e brand light; Fase 1C-bis aggiunta per richiami TPL e brand a doppio senso; Fase 1 complessiva chiusa**.

La specifica funzionale testuale è accettata come baseline Fase 1A. La Fase 1 complessiva è chiusa perché sono stati validati anche mock visuali desktop/mobile e direzione visiva minima. Il prototipo applicativo già creato resta una base tecnica anticipata, non il criterio di chiusura della fase.

La Fase 1 è divisa in tre sottofasi operative:

| Sottofase | Output | Stato |
| --- | --- | --- |
| Fase 1A - Wireframe funzionali testuali | Route, blocchi, dati, azioni, stati e fixture richieste per ogni vista | Chiusa formalmente il 2026-05-13 |
| Fase 1B - Mock visuali desktop/mobile | Mock statico della dashboard direzionale, con layout reale, gerarchia, stati, responsive e confronto light/dark | Chiusa il 2026-05-14 sul mock canonico in `docs/design/tram-v1-mvp-ui-mock.html`; le iterazioni HTML precedenti sono state rimosse per evitare ambiguità |
| Fase 1C - Direzione visiva e brand light | Palette UI, tipografia, densità, componenti base, wordmark provvisorio e nota su posizionamento | Chiusa il 2026-05-14 in `docs/design/tram-v1-fase-1c-visual-direction-brand-light-v0-1.md`; fonte decisionale: mock HTML canonico |
| Fase 1C-bis - Richiami TPL e brand a doppio senso | Revisione non dogmatica del mock, metafora rete/linea, T-node, route strip, timeline come linea e sidebar rail | Chiusa il 2026-05-14 in `docs/design/tram-v1-fase-1c-bis-tpl-brand-direction-v0-1.md`; integra Fase 1C |

La direzione visiva minima parte nella Fase 1 perché senza palette, tipografia e regole di densità i mock restano schemi grigi. Naming definitivo, logo completo e brand system esteso non devono invece diventare esercizi isolati prima di aver validato almeno la dashboard direzionale.

Nota di chiusura Fase 1B: il mock canonico viene accettato come direzione visuale della dashboard principale e non come produzione completa di tutte le route. Le viste specialistiche, tra cui documenti, review, Q&A completo, Financials e audit, dovranno essere derivate in Fase 2 e nelle slice applicative, senza riaprire la validazione della direzione dashboard.

Nota di chiusura Fase 1C: la direzione visuale minima usa come fonte `docs/design/tram-v1-mvp-ui-mock.html`. Il PDF esportato resta artefatto storico di revisione e non è fonte decisionale per palette, tipografia, densità o componenti.

Nota di chiusura Fase 1C-bis: il mock HTML canonico non è dogma. Le prossime iterazioni devono modificare quello stesso file, mantenendo densità e struttura ma rendendo TRAM più caratteristico con richiami medi al mondo TPL: rete, linee, nodi, interscambi, stati di servizio e sala controllo operativa.

Viste minime:

| Vista | Scopo |
| --- | --- |
| `/tenders` | dashboard aggregata delle gare |
| `/tenders/:tender_id/overview` | dashboard operativa della gara |
| `/tenders/:tender_id/documents` | document map T1 e stato documenti |
| `/tenders/:tender_id/timeline` | timeline T2 |
| `/tenders/:tender_id/deliverables` | checklist T3 |
| `/tenders/:tender_id/requirements` | requisiti e KPI T4 |
| `/tenders/:tender_id/financials` | stato Financials T5, vista evidence-first con AI/review gate |
| `/tenders/:tender_id/cost-drivers` | cost driver T6 |
| `/tenders/:tender_id/contradictions` | criticità candidate T7 |
| `/tenders/:tender_id/queries` | Q&A T8 |
| `/tenders/:tender_id/review` | review queue trasversale |
| `/tenders/:tender_id/audit` | audit, AI gate, provider, parsing e policy |

Criteri di uscita:

- ogni vista mostra fonte, stato e review quando il dato non è validato;
- ogni headline P0 apre fonte o review item;
- Financials e Q&A non sono presentati come verità libere: fonte, stato, AI gate e review restano visibili;
- T7 mostra candidate issues, non verità;
- desktop è il target principale, mobile non è rotto;
- ruoli e data policy hanno stati UI visibili;
- i mock visuali desktop/mobile coprono almeno `/tenders`, `/tenders/:tender_id/overview`, `/tenders/:tender_id/documents` e `/tenders/:tender_id/review`;
- Q&A, Timeline, Deliverables, Financials e Criticità sono rappresentati almeno come sezioni o stati navigabili nel mock overview;
- palette, tipografia, densità, badge, tabelle, sidebar e timeline hanno una prima direzione coerente, documentata in `docs/design/tram-v1-fase-1c-visual-direction-brand-light-v0-1.md` e integrata dalla lente TPL in `docs/design/tram-v1-fase-1c-bis-tpl-brand-direction-v0-1.md`;
- brand light e wordmark provvisorio sono sufficienti a non rendere TRAM un’app generica, senza bloccare naming definitivo o brand system completo;
- il maintainer valida che la dashboard risponda a “che tender è, dove siamo ora, cosa blocca, cosa devo guardare”.

La specifica dei wireframe funzionali è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-functional-wireframes-v0-1.md`.

### Fase 2 - Fixture applicative non riservate

Obiettivo: creare dati applicativi sintetici o sanificati per testare UI, stati e workflow senza caricare contenuti riservati in repo.

Fixture minime:

| Area | Fixture richiesta |
| --- | --- |
| Tender | almeno quattro tender, cioè gare in senso italiano, che rappresentano Copenhagen, Dublin Luas, Milano e MetroLink come archetipi, senza contenuto riservato |
| T1 | documenti correnti, superati, track changes, redline, version conflict |
| T2 | deadline critica, data relativa, mismatch MPP/PDF, nuovo addendum stale |
| T3 | deliverable mandatory, deliverable valutativo, deliverable economico da review |
| T4 | requisito O&M mandatory, KPI critico, compliance safety/cyber/data |
| T5 | meccanismo di remunerazione presente, workbook prezzi, item Financials da analizzare, stato AI/review visibile, nessun valore non validato esposto in overview |
| T6 | cost driver high/critical, driver financial-linked, driver senza importi inventati |
| T7 | criticità timeline, versioning e Financials come candidate issues |
| T8 | registro Q&A da approvare, domanda bloccata perché sensibile, avviso dismissibile, risposta ricevuta da incorporare |
| Review | item critico, alto, medio e basso; azioni conferma, correggi, contesta, da chiarire, superato |
| Audit | AI ammessa L0, L1 da approvare, L2 bloccata, quota esaurita, provider policy stale |
| Networked control room | route strip per ogni gara, 8 nodi primari Documenti/Timeline/Deliverables/Requisiti/Q&A/Financials/Cost driver/Criticità, Review e audit contestuali, connessioni fonte-review e resa mobile completa |

Criteri di uscita:

- nessuna fixture contiene documento reale integrale o segreto;
- ogni fixture ha `indicator_key`, fonte sintetica o riferimento sanificato, stato e review gate;
- le fixture coprono `draft`, `partially_validated`, `validated_internal`, `stale_due_to_new_docs` e `open_critical_issues`;
- ogni gara ha una route strip derivata da indicatori, review item, source reference, AI gate e stati dashboard;
- le fixture permettono di testare permessi owner/editor/reviewer/viewer.

La specifica delle fixture applicative è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-application-fixtures-v0-1.md`.

Nota di chiusura del 2026-05-15: la Fase 2 è chiusa sul fixture pack compatto `data/fixtures/tram-v1-mvp-synthetic-fixtures.json` versione `0.2.0`. Il pack copre 5 gare sintetiche, tutti i 5 stati dashboard MVP, 40 indicatori P0/P1, 30 source reference, almeno le soglie minime per T1-T8, Review, Audit e una `route_network` a 8 nodi primari per ogni gara.

### Fase 3 - Data contract MVP/V0

Obiettivo: trasformare wireframe e fixture in contratti minimi implementabili.

Output richiesti:

- shape dati per `Tender`;
- shape dati per `DocumentVersion`;
- shape dati per `IndicatorValue`;
- shape dati per `ReviewItem`;
- shape dati per `SourceReference`;
- shape dati per `DashboardValidationState`;
- shape dati per `AiGateDecision` e audit minimo;
- mapping route-vista-indicatori.

Criteri di uscita:

- ogni componente UI previsto ha dati sufficienti;
- ogni stato dashboard è calcolabile;
- ogni azione review ha effetto previsto;
- non ci sono campi UI senza origine documentata.

Il data contract MVP è documentato in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-data-contract-v0-1.md`.

Nota di chiusura del 2026-05-15: la Fase 3 è chiusa. Il data contract è allineato alle fixture compatte `0.2.0`, agli enum applicativi, al mapping `route -> vista -> indicatori`, agli effetti review, agli stati dashboard calcolabili, agli AI gate e agli audit event minimi. I test applicativi verificano che ogni indicatore fixture sia coperto da una route e che ogni route richiesta abbia indicatori presenti.

### Fase 4 - Prototipo applicativo su fixture

Obiettivo: costruire la prima esperienza navigabile usando fixture, senza dipendere ancora dal parsing completo dei pacchetti reali.

Nota di roadmap del 2026-05-15: prima di trasformare il mock canonico in componenti applicativi, va svolta una revisione dedicata della dashboard gara. Il mock resta base visuale unica, ma molti box informativi devono essere rivalutati rispetto a utilità, chiarezza, priorità decisionale e collegamento a dati reali/fixture. La revisione deve decidere quali widget tenere, accorpare, rimuovere o spostare nelle viste specialistiche. Il documento operativo è `docs/design/tram-v1-dashboard-widget-audit-v0-1.md`.

Include:

- analisi contenuti della dashboard gara e razionalizzazione dei widget;
- integrazione selettiva del mock canonico nel MVP, senza port completo dell’HTML statico;
- pass UX/visuale sull’overview reale dopo la riduzione dei widget;
- allineamento di shell, sidebar, route strip, token, T-node e pannello fonte alla direzione `networked control room`;
- collegamento dei widget approvati a fixture e data contract, evitando box senza fonte dati;
- dashboard aggregata;
- dashboard gara;
- viste T1-T8;
- review queue;
- pannello fonte/audit;
- permessi UI minimi;
- stati vuoti, errore, stale, blocked e quota esaurita.

Criteri di uscita:

- l’utente può capire quale gara richiede attenzione;
- la dashboard gara reale non contiene preview ridondanti di tutte le viste T1-T8;
- ogni widget in overview ha scopo operativo, fonte dati e azione o stato chiaro;
- può aprire una fonte o review item da ogni headline;
- può confermare, correggere, contestare o segnare da chiarire un item;
- una review bloccante porta la gara a `open_critical_issues`;
- un nuovo documento porta la gara a `stale_due_to_new_docs`;
- T5 non espone valori economici non validati in overview;
- T8 non consente invio automatico.

### Fase 5 - Ingestion e parsing locale controllato

Obiettivo: collegare il prototipo alla pipeline documentale locale.

Include:

- inventario file;
- hash, estensione, dimensione, page count se disponibile;
- parsing PDF/DOCX/XLSX/XLS/MPP secondo toolchain locale;
- `SourceReference`;
- parser issues;
- primo output T1 document map;
- stati job visibili in UI.

Criteri di uscita:

- ogni file produce metadati o errore tracciabile;
- nessun contenuto documentale integrale finisce nei log;
- i documenti reali restano fuori da Git;
- T1 distingue currentness deterministico da classificazione AI;
- i problemi parser diventano review tecnica o audit.

### Fase 6 - Estrazioni T1-T8 e pilot interno

Obiettivo: validare TRAM con i primi tre utenti su pacchetti reali o rappresentativi, rispettando policy e costi.

Include:

- T1/T2/T3 end-to-end;
- T4/T6 con AI controllata solo se policy e quota lo consentono;
- T5 con parser/regole, AI su input ammessi e review;
- T7 rules/review-first;
- T8 human-first;
- dashboard aggregata multi-gara;
- raccolta feedback utenti.

Criteri di uscita:

- i primi utenti riescono a usare TRAM per orientarsi in almeno due gare;
- gli indicatori P0 principali hanno fonte o stato “da estrarre/non disponibile”;
- i blocker sono chiari e non nascosti;
- la review queue riduce il lavoro umano a decisioni esplicite;
- costi AI restano zero o entro hard cap approvato;
- nessun passaggio esterno avviene senza gate umano.

## Roadmap V1 dopo il primo MVP

Le proposte emerse durante la revisione del prototipo su fixture non cambiano l’ordine del piano. Vanno trattate come backlog trasversale e applicate quando la fase corrispondente è già prevista.

Backlog trasversale non bloccante:

- passaggio copy/glossario UI: evitare mix italiano/inglese non deciso, usare `Tender` nella superficie utente, mantenere solo label approvate come `Q&A`, `Financials` e `Deliverables`;
- policy avvisi: distinguere avvisi informativi chiudibili da blocker persistenti finché la causa resta aperta;
- Q&A scalabile: usare registro filtrabile/espandibile, non card dispersive, perché i set reali possono avere centinaia di righe;
- affinamento dashboard gara: verificare periodicamente che risponda a “che gara è, dove siamo, cosa blocca, cosa devo guardare ora”; in particolare, riesaminare tutti i box del mock canonico ed eliminare quelli poco chiari, ridondanti o non azionabili;
- pannello fonte/dettaglio come elemento distintivo, da sviluppare nella slice già prevista per review queue e pannello fonte.

Il passaggio visuale TRAM non resta backlog generico: viene anticipato nella Fase 1 come mock visuale e direzione visiva minima. Il backlog V1 conserva solo brand system esteso, naming definitivo e materiali di comunicazione, se necessari.

### V1.1 - Stabilizzazione T1/T2/T3

Focus:

- document map più robusta;
- confronto MPP/PDF per timeline;
- checklist deliverable più affidabile;
- fixture estese oltre dataset compatto;
- smoke end-to-end su mini pacchetto sintetico.

### V1.2 - Requisiti, KPI e cost driver

Focus:

- T4 requisiti/KPI filtrabili;
- T6 cost driver con link a requisiti, Financials e review;
- normalizzatori T4/T6;
- policy L1 più chiara;
- quality metrics per falsi positivi e falsi negativi.

### V1.3 - Financials, criticità e Q&A

Focus:

- T5 parser locale più robusto su workbook e meccanismo di remunerazione;
- T7 regole sulle criticità più forti;
- T8 Q&A con registro, template domanda, approvazione e gestione risposta;
- protezioni L2 e audit accessi;
- export manuale controllato, se approvato.

### V1.4 - Pilot operativo e hardening

Focus:

- onboarding primi tre utenti;
- ruoli e permessi applicativi;
- backup e retention;
- logging e audit;
- performance su pacchetti più grandi;
- scelta hosting condiviso e storage.

## Criteri di successo MVP

### Successo prodotto

TRAM MVP funziona se un utente interno può:

- vedere tutte le gare e capire quali richiedono attenzione;
- aprire una gara e capire fase, scadenze, documenti correnti, deliverable, criticità e blocchi;
- distinguere dati confermati, proposti, contestati, superati e da chiarire;
- arrivare rapidamente alla fonte di un dato;
- usare la review queue per trasformare in decisioni le criticità;
- evitare uso improprio di Financials, Q&A e output AI.

### Successo funzionale

Il primo MVP passa se:

- la dashboard aggregata distingue almeno prequalifica, ITT, ITN, negotiation/BAFO e addendum;
- l’overview mostra gli indicatori P0 disponibili e lo stato di quelli assenti;
- ogni headline P0 ha fonte, stato o review item;
- T1 mostra currentness, versioni, track changes, redline e documenti da review;
- T2 mostra deadline critiche, date relative, conflitti e stato review;
- T3 mostra checklist deliverable con mandatory, formato, deadline, fonte e sensibilità;
- T4 mostra requisiti/KPI filtrabili e review gate;
- T5 mostra stato e classi Financials senza esporre valori economici in overview;
- T6 mostra cost driver senza inventare importi;
- T7 mostra criticità candidate con fonti affiancate e stato review;
- T8 mostra Q&A human-first; eventuali bozze di domanda restano da approvare;
- review queue permette conferma, correzione, contestazione, da chiarire e superato;
- audit mostra almeno origine, run, provider/regola, policy gate e azioni utente.

### Successo qualità dati

Target iniziali:

| Criterio | Soglia MVP |
| --- | --- |
| Headline P0 con fonte o stato esplicito | 100% |
| Review item critici collegati a fonte o motivo tecnico | 100% |
| Dashboard state calcolabile da indicatori/review | 100% |
| Invii automatici di domande/Q&A | 0 |
| AI esterna su L2 default | 0 |
| Valori economici esposti in overview senza review | 0 |
| Fixture con contenuto riservato reale | 0 |
| Pacchetti benchmark rappresentati come archetipi fixture | almeno 4 |
| Indicatori P0 correttamente estratti nel pilot reale | target iniziale 80%, da misurare |

La soglia 80% sugli indicatori P0 vale per il pilot su pacchetti reali o rappresentativi, non per le fixture applicative. Sulle fixture il comportamento atteso deve essere deterministico.

### Successo AI e costi

TRAM passa il criterio AI/costi se:

- ogni chiamata AI ha provider, modello, prompt/schema version, input hash, output hash e costo stimato;
- quota o budget esauriti sospendono il job;
- non esiste fallback paid automatico;
- L1 esterno richiede data policy approvata;
- L2 resta locale/review;
- T5 usa provider esterni su L0/L1 minimizzati e approvati; L2 effettivo resta locale/self-hosted o bloccato;
- T7 non usa AI come decisore autonomo;
- T8 richiede sempre approvazione umana per export o invio della domanda e review per incorporare la risposta.

### Successo UX

TRAM passa il criterio UX se:

- le viste sono dense, leggibili e operative;
- la UI è in italiano;
- ogni stato critico è visibile senza aprire tre livelli di dettaglio;
- le tabelle sono filtrabili sulle dimensioni essenziali;
- mobile non è rotto, anche se il target MVP è desktop-first;
- non ci sono hero, landing marketing o testi che spiegano ovvietà dell’interfaccia;
- il pannello fonte/audit è raggiungibile da dashboard, viste specialistiche e review queue.

## Criteri di fallimento

Il primo MVP non va considerato riuscito se:

- una dashboard sembra validata mentre ha blocker critici aperti;
- un dato P0 appare come valore senza fonte, stato o warning;
- Financials senza fonte, stato, AI gate o review sono esposti come dati ordinari;
- T7 presenta criticità come verità;
- T8 presenta Q&A o domande come approvati senza azione utente;
- un provider AI riceve L2 o pacchetti completi;
- quota/budget AI porta a fallback paid automatico;
- le fixture contengono contenuto riservato reale;
- la review queue diventa una lista non prioritaria e ingestibile.

## Gate per passare ai wireframe

Gate già superato nella Fase 0. La baseline resta valida se:

- questo documento è accettato come baseline;
- il perimetro MVP largo è confermato;
- le route minime sono accettate;
- T1-T8 hanno responsabilità e guardrail espliciti;
- export PDF/Excel resta non bloccante;
- il prossimo documento può concentrarsi solo su layout, stati e interazioni.

## Gate per passare alle fixture

Si può passare alle fixture quando:

- i wireframe indicano quali dati servono in ogni vista;
- i mock visuali principali mostrano layout desktop/mobile, gerarchia, densità e stati chiave;
- palette, tipografia e componenti base sono sufficientemente stabili per non riscrivere subito le fixture UI;
- ogni vista ha almeno uno stato pieno, vuoto, errore/blocco e review;
- le fixture sono dichiarate sintetiche o sanificate;
- ogni item fixture ha fonte, stato e review gate;
- i casi Copenhagen, Dublin Luas, Milano e MetroLink sono rappresentati come archetipi senza contenuto riservato.
- la Fase 1C-bis ha chiarito che la route strip è derivata, non una nuova fonte di verità.

## Gate per passare al codice applicativo

Non scrivere codice applicativo finché:

- wireframe funzionali e fixture applicative non sono definiti;
- la scelta framework non è registrata nella documentazione tecnica applicativa;
- storage documentale e gestione segreti hanno una policy minima;
- il data contract MVP è sufficiente;
- i controlli minimi di documentazione e segreti sono chiari;
- il maintainer approva esplicitamente l’avvio del codice.

## Debiti non chiusi

- Analizzare in modo dedicato contenuto e utilità dei widget dashboard prima dell’implementazione: ogni box deve avere uno scopo operativo, una fonte dati e una ragione per stare in overview invece che in una vista specialistica.
- Definire retention concreta per originali, OCR, estratti e output AI.
- Definire export PDF/Excel solo dopo stabilizzazione dashboard.
- Derivare le viste specialistiche dal mock canonico senza riaprire la direzione visuale della dashboard.
- Rimandare naming definitivo, logo completo e brand system esteso a dopo la stabilizzazione delle prime slice applicative.
- Definire smoke test end-to-end su mini pacchetto sintetico.
- Definire soglie numeriche per `data_quality.source_coverage_ratio`.

## Prossimo passo consigliato

Procedere con **Fase 4 - prototipo applicativo su fixture**, usando fixture compatte `0.2.0` e data contract Fase 3 come fonti uniche. Lo split fisico `mvp-wide` resta rimandato finché il JSON unico è più semplice da validare e usare nel prototipo Next.

La checklist di sviluppo/verifica MVP è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-development-verification-checklist-v0-1.md`.
