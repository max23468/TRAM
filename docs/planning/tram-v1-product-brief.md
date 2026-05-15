# TRAM V1 - Product Brief e Piano di Definizione

Data: 2026-05-12
Stato: Fase 0 chiusa; documento vivo per V1 e MVP/V0
Nome in codice: TRAM, Tender Requirements Analysis & Monitoring

## Scopo

TRAM è una web app interna per semplificare l’analisi, la mappatura e il monitoraggio dei documenti di gara nel trasporto pubblico locale, con focus O&M.

La V1 deve aiutare chi analizza documentazione di gara e prepara offerte tecniche, economiche e amministrative a trasformare documenti complessi in una panoramica chiara, aggiornata, verificabile e criticamente utile.

TRAM è un nome in codice: in futuro potrà essere sostituito con un nome più brandabile e immediato.

Quando lavoreremo sul brand, oltre al nome dovremo definire esplicitamente anche cosa TRAM non è. Questo servirà a evitare posizionamenti sbagliati, aspettative eccessive e scope creep.

Nota terminologica decisa il 2026-05-13: il primo **MVP** di TRAM va letto come **V0 operativa**. È la prima versione interna navigabile, verificabile e utile su fixture e workflow controllati; non è la V1 completa.

## Principio di prodotto

TRAM deve privilegiare:

- schematicità;
- standardizzazione;
- rappresentazioni grafiche;
- minimalismo;
- sintesi;
- modernità;
- approccio critico;
- tracciabilità delle fonti;
- panoramica sempre aggiornata rispetto a integrazioni e versioni documentali.

L’AI deve essere un punto di forza, ma usata in modo sensato: deve aiutare a estrarre, controllare, confrontare, segnalare dubbi e proporre output, non sostituire il giudizio dell’utente nei passaggi ad alto rischio.

Per la V1 l’AI deve inoltre rispettare un vincolo economico preciso: deve essere gratuita per TRAM o protetta da budget pari a zero/minimo e hard cap. Questo non esclude provider cloud, ma esclude fallback automatici a pagamento.

## Decisione UX MVP - Dashboard direzionale first

Decisione del 2026-05-13: il primo MVP deve sentirsi prima di tutto come **cockpit direzionale della gara**, non come laboratorio di parsing.

Quando l’utente apre una gara, TRAM deve mostrare subito questi elementi operativi:

- che gara è;
- in che fase si trova;
- quali sono caratteristiche base, ambito e soggetti principali;
- quali documenti/versioni sono disponibili;
- quali scadenze e deliverable richiedono attenzione;
- quali dati sono validati, proposti, incerti o bloccati;
- quali rischi, criticità candidate e Q&A sono da guardare subito;
- quanto è affidabile la panoramica mostrata.

La dashboard può mostrare due categorie di stato, tenute sempre separate:

1. **Stato della gara**, ricavato dalla documentazione caricata o da metadati del contenitore di gara.
2. **Stato interno dell’analisi TRAM**, alimentato dal flusso applicativo e da input manuali minimi.

Lo stato interno ammesso nel MVP è leggero e dichiarativo: owner, area, stato analisi tecnica/economica/amministrativa, note sintetiche, blocker e prossima azione. Non deve fingere di sapere quanto sia pronta l’offerta se l’offerta non è stata caricata o modellata.

Le idee già definite su ingestion, parsing, review queue, T1-T8, audit, AI gate e viste specialistiche restano valide, ma vengono trattate come motore e drill-down progressivi della V1. Non vengono eliminate: vengono spostate dopo la prima esperienza direzionale.

## Terminologia Q&A

Decisione del 2026-05-13: in TRAM, quando si parla di **query** si intende lo scambio di domande e risposte tra bidder e stazione appaltante.

La UI MVP/V0 usa come etichetta operativa preferita **Q&A**. La query non è soltanto una bozza di domanda: è un thread che può includere domanda candidata, bozza interna, approvazione, export manuale, risposta della stazione appaltante, impatto su documenti/versioni/indicatori e stato di review.

Regola: nessuna domanda viene inviata automaticamente alla stazione appaltante. Una bozza di chiarimento è solo uno stato possibile del thread.

Nei pacchetti reali i Q&A possono arrivare come registri Excel/PDF, con domanda del bidder, risposta della stazione appaltante, riferimento documentale e classificazione del tipo “clarification/correction”. Quando sono pubblicati dall’ente, hanno lo stesso valore operativo della documentazione di gara: possono integrare, correggere, chiarire o superare ITT, allegati, schedule e versioni precedenti. TRAM deve importarli e incrociarli con ITT, allegati, schedule, versioni e source reference. La piattaforma dell’ente appaltante resta il canale esterno: TRAM può preparare, esportare o registrare manualmente lo stato, ma non invia nulla.

Per analisi AI o riconciliazioni affidabili serve il set completo di Q&A e relativi allegati. Un estratto parziale può servire a capire formato e workflow, non a chiudere analisi di merito.

## Concetto di gara

Nella UI il contenitore operativo si chiama **gara**. Nei contratti dati e negli id tecnici il campo canonico è `tender_id`; eventuali nomi legacy con `space` vanno considerati debito da bonificare quando si tocca quel modulo o documento.

Una gara può contenere pacchetti di natura diversa, da distinguere esplicitamente. La distinzione non va ridotta a "prequalifica = incompleta" e "ITT = completa": è soprattutto una distinzione di fase procedurale.

- avviso preliminare, market engagement o prior information notice;
- prequalifica, selection questionnaire, procurement specific questionnaire o request to participate;
- ITT, cioè Invitation to Tender, richiesta di offerta o tender pack;
- fase negoziale, dialogo competitivo, initial tender, revised tender o best and final offer, quando previsti;
- integrazioni, Q&A, addendum o versioni successive collegati a una delle fasi.

La distinzione è importante perché i pacchetti di selezione servono soprattutto a valutare idoneità, capacità, esperienza, requisiti minimi e condizioni di partecipazione. Gli ITT, invece, sono normalmente il punto in cui l’autorità fornisce le informazioni necessarie per preparare un’offerta: specifiche, criteri di aggiudicazione, metodo di valutazione, condizioni contrattuali e requisiti tecnici. Detto questo, un ITT non è automaticamente definitivo: Q&A, addendum e versioni successive possono modificare o superare parti del pacchetto iniziale.

Ogni gara include almeno:

- documenti caricati;
- versioni, integrazioni e Q&A;
- dashboard della gara;
- estrazioni strutturate;
- timeline;
- requisiti;
- definizioni;
- deliverable;
- attività e costi potenziali;
- criticità candidate e Q&A da aprire o monitorare;
- stato di avanzamento dell’analisi.

Le gare sono condivise tra più utenti autorizzati.

Serve anche una dashboard aggregata, cioè una dashboard delle dashboard, per vedere più gare insieme.

## Funzionalità V1 candidate

1. Estrarre caratteristiche del network:
   - km;
   - stazioni;
   - linee;
   - materiale rotabile;
   - altri elementi infrastrutturali e operativi rilevanti.
2. Mappare la timeline di gara e la timeline contrattuale.
3. Estrarre requisiti richiesti.
4. Estrarre elenco completo delle definizioni.
5. Estrarre deliverable con annessi, allegati, specifiche e scadenze.
6. Mappare le attività richieste che possono tradursi in costi.
7. Dare accesso intuitivo alla documentazione caricata.
8. Trovare criticità candidate tra documenti e produrre, quando serve, bozze Q&A da approvare prima di qualsiasi invio alla stazione appaltante.
9. Creare dashboard sintetiche e grafiche per ogni gara.
10. Gestire integrazioni documentali:
    - V2 di documenti;
    - rettifiche;
    - scambi Q&A;
    - modifiche a regole di gara o previsioni contrattuali;
    - versioni successive che superano o integrano contenuti precedenti.
11. Chiedere intervento all’utente quando l’AI ha dubbi, ambiguità o conflitti non risolvibili con confidenza sufficiente.
12. Conservare feedback utente e decisioni come conoscenza riutilizzabile nel contesto del prodotto, da progettare con attenzione per evitare apprendimento opaco o non controllato.

## Sviluppi futuri

### V2

TRAM confronta l’offerta preparata con la documentazione di gara.

Possibili superfici:

- verifica copertura requisiti;
- gap tra offerta e capitolato;
- coerenza tra proposta tecnica, economica e amministrativa;
- alert su obblighi non indirizzati;
- suggerimenti per rafforzare l’offerta.

### V3

TRAM mette in relazione più gare e più offerte.

Possibili superfici:

- pattern ricorrenti tra gare;
- best practice emerse da offerte precedenti;
- feedback storici riutilizzabili;
- suggerimenti per nuove offerte;
- proposte Q&A o modifiche documentali basate su casi analoghi;
- benchmark interni.

## Vincoli e preferenze iniziali

- V1 a uso interno.
- Primo utilizzo possibilmente gratuito o a costo molto contenuto.
- Funzioni a pagamento solo quando aumentano gare, utenti e complessità.
- Sviluppo graduale.
- Nessun nuovo codice non concordato finché piano, dati e guardrail della slice non sono chiari.
- Domande una o due alla volta.
- Le idee iniziali non sono dogmi: vanno sfidate quando emergono tradeoff, rischi o opzioni migliori.
- Se uno step viene saltato, va annotato in documentazione come tema da recuperare.

## Decisioni di metodo

- Il piano V1 verrà costruito e validato su almeno un pacchetto reale di gara fornito dall’utente, non solo su mock o ipotesi astratte.
- I documenti forniti non saranno trattati come "documenti grezzi", ma come pacchetti gara che TRAM dovrebbe poter usare come input applicativo.
- Quando definiamo concetti, tassonomie, requisiti, benchmark o workflow legati al mondo gare TPL/O&M, dobbiamo verificare anche fonti web aggiornate e autorevoli. Le indicazioni dell’utente sono input di dominio importanti, ma non vanno trattate come unica fonte.
- Il pacchetto gara servirà come benchmark privato per valutare:
  - qualità di estrazione;
  - riconoscimento della fase del pacchetto, per esempio prequalifica o ITT;
  - struttura dei dati;
  - gestione versioni e integrazioni;
  - fonti e citazioni;
  - criticità candidate;
  - costo per gara;
  - utilità reale delle dashboard.
- I mock potranno essere usati dopo, ma solo per UI, demo o test ripetibili.

## Prime ipotesi da verificare

Queste non sono decisioni approvate.

- TRAM probabilmente deve nascere come web app document-centric con database strutturato, storage documentale e pipeline di analisi asincrona.
- La V1 dovrebbe evitare automazioni troppo autonome senza controllo umano, soprattutto per criticità candidate, Q&A e interpretazioni contrattuali.
- Il valore iniziale non è "chat con i documenti", ma una mappa standardizzata e aggiornata della gara.
- L’AI dovrebbe citare sempre fonti e passaggi documentali da cui deriva ogni estrazione rilevante.
- Ogni dato estratto dovrebbe avere stato: proposto, confermato, contestato, superato, integrato o da chiarire.
- La gestione versioni e integrazioni non è una funzione accessoria: è un nucleo del prodotto.
- Il data model minimo evidence-first è documentato in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-data-model.md`.

## Questioni da definire

### Utenti e workflow

- Primi utenti interni V1: l’utente e due colleghi.
- Numero utenti prima fase: circa 3.
- I primi utenti proveranno e valideranno un po’ tutto: caricamento, navigazione documentale, estrazioni, dashboard, criticità candidate, Q&A suggeriti o monitorati e qualità generale dell’analisi.
- Il primo modello operativo può quindi essere expert-review first: TRAM propone, gli utenti esperti validano, correggono e aiutano a stabilizzare il metodo.
- Chi carica i documenti?
- Chi valida le estrazioni?
- Chi usa dashboard e output finali?
- Serve un ruolo revisore/approvatore?

### Documenti e formati

- Quale pacchetto reale usare come benchmark iniziale?
- Il pacchetto è una prequalifica, un ITT o un insieme misto?
- Il pacchetto può essere conservato localmente durante la fase di analisi?
- Quali tipi di documenti entrano nella V1?
- PDF nativi, PDF scannerizzati, Word, Excel, ZIP, PEC, allegati tecnici?
- Quanti documenti ha mediamente una gara?
- Quanto pesa un pacchetto documentale tipico?
- Quante versioni o integrazioni arrivano di solito?

### Output

- Quali output sono indispensabili nel primo MVP?
- Dashboard consultabile basta o servono export Excel/PDF/Word?
- I Q&A verso la stazione appaltante devono essere gestiti come thread operativo, testo pronto, documento formale o bozza editabile?

### AI e automazione

- Quali parti possono essere AI-first?
- Quali parti devono essere rule-based o validate manualmente?
- Per ogni task, va deciso se deve essere rule-based, AI-assisted o human-only.
- L’idea che l’AI trovi criticità candidate, suggerisca Q&A da aprire e svolga molte attività proattive è una proposta da validare, non una decisione già chiusa.
- La matrice decisionale iniziale è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-automation-decision-matrix.md`.
- Il modello di validazione consigliato per i primi utenti è critical-first ed è documentato in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-human-validation-workflow.md`.
- La prima review queue per rendere operativo il modello è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-review-queue-design.md`.
- La strategia AI gratuita V1 è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-strategy.md`.
- Il protocollo benchmark AI gratuito è documentato in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-benchmark-protocol.md`.
- Quanto è accettabile che TRAM dica "non so"?
- Come si misura la confidenza?
- Che cosa deve imparare dai feedback utente e con quali limiti?

### Tecnica e costi

- Stack da scegliere.
- Hosting.
- Database.
- Storage documentale.
- Motore OCR/parsing.
- Motore AI e costo per gara.
- AI gateway gratuito e provider-agnostic, con Gemini tra i candidati e budget controllato.
- Job asincroni.
- Autenticazione e permessi.
- Audit log.
- Backup e retention.
- La proposta iniziale di architettura MVP è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-architecture.md`.
- Framework MVP deciso: Next.js App Router.
- Package manager deciso: npm.
- UI stack deciso: React, TypeScript, Tailwind, shadcn/ui o componenti equivalenti.
- Formato fixture deciso: JSON fixture pack come source of truth; validatore TypeScript/Zod quando nasce l’app; seed DB futuro derivato dai JSON.
- Runtime MVP condiviso target deciso: Oracle Cloud Free Tier Ampere A1.
- Storage documentale MVP condiviso target deciso: OCI Object Storage Always Free.
- Sviluppo locale: filesystem locale solo per fixture, prototipo e mini pacchetto sintetico.
- La roadmap MVP larga e i criteri di successo sono documentati in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-roadmap-and-success-criteria-v0-1.md`.
- I wireframe funzionali del MVP largo sono documentati in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-functional-wireframes-v0-1.md`.
- Le fixture applicative non riservate del MVP largo sono documentate in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-application-fixtures-v0-1.md`.
- Il data contract MVP è documentato in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-data-contract-v0-1.md`.
- La checklist di sviluppo/verifica MVP è documentata in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-development-verification-checklist-v0-1.md`.

### Sicurezza e dati

- I documenti di gara possono contenere dati personali, commerciali o riservati.
- Va definito se usare solo servizi cloud, servizi europei, self-hosting o un mix.
- Va chiarito se i documenti possono essere inviati a provider AI esterni e con quali limiti.
- Per Gemini è accettabile collegare carta o billing solo se serve a ottenere accesso, cap o regime privacy corretto, con budget pari a zero o minimo e senza auto-reload non approvato.

### Repo e governance

- TRAM al momento è una cartella locale, non una repo Git inizializzata.
- La cartella contiene una chiave `ssh-key-tram.key`, da trattare come segreto locale e da non committare.
- `AGENTS.md` di progetto è stato creato nella root TRAM e fissa regole su stack, documentazione, test, release future, dati sensibili, AI e uso dei documenti reali.
- La toolchain locale di analisi documentale usa Python 3.12 nella `.venv`, Poppler, Tesseract/OCRmyPDF, OpenJDK e MPXJ. La scelta Python 3.12 è intenzionale per stabilità delle librerie native e documentali.

## Debito annotato da recuperare

- Completare l’analisi delle funzionalità emerse da Pratix, DocMolder, FiscalBay, SyncBay e SendChimp. Le regole operative trasferibili sono state integrate in `AGENTS.md`; resta da valutare nel dettaglio quali funzionalità di prodotto sono riutilizzabili per TRAM.
  Distinguere:
  - cosa è riutilizzabile per TRAM V1;
  - cosa è prematuro ma da tenere in roadmap;
  - cosa non va importato perché fuori dominio.
- Acquisire o indicizzare un pacchetto reale di gara da usare come caso benchmark iniziale.
- Definire naming futuro oltre il codice TRAM.
- Definire cosa TRAM non è, come parte del lavoro su brand e posizionamento.
- Definire glossario prodotto in italiano.
- Data model minimo definito in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-data-model.md`, da raffinare prima del codice.
- Pipeline ingestion-dashboard definita in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-ingestion-to-dashboard-workflow-v0-1.md`.
- Strategia AI con costi, privacy, confidenza e free tier definita nei documenti AI V1 e nella data policy per gara.
- Modello permessi e collaborazione definito in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-roles-permissions-v0-1.md`.
- Dashboard di singola gara e dashboard aggregata definite in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-dashboard-views-t1-t8-v0-1.md`.
- Registro `indicator_key` P0/P1 definito in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-key-registry-p0-p1-v0-1.md`.
- Roadmap MVP larga e criteri di successo definiti in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-roadmap-and-success-criteria-v0-1.md`.
- Wireframe funzionali MVP largo definiti in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-functional-wireframes-v0-1.md`.
- Fixture applicative non riservate MVP largo definite in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-application-fixtures-v0-1.md`.
- Data contract MVP definito in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-data-contract-v0-1.md`.
- Checklist sviluppo/verifica MVP definita in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-mvp-development-verification-checklist-v0-1.md`.
- Policy `.gitignore`/segreti definita in `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-gitignore-and-secrets-policy-v0-1.md`.
- Runbook OCI MVP runtime/storage definito in `/Users/Matteo/Documents/TRAM/docs/runbooks/tram-v1-oci-mvp-runtime-and-storage-runbook-v0-1.md`.
- Runbook sviluppo app locale definito in `/Users/Matteo/Documents/TRAM/docs/runbooks/tram-v1-local-app-development-runbook-v0-1.md`.
- Definire standard di verifica delle estrazioni.

## Chiusura Fase 0

La Fase 0 è chiusa come baseline di prodotto e governance MVP/V0. Restano debiti tracciati, ma non bloccano l’avanzamento ordinato verso Slice 0/Slice 1 operative.

Prossimo lavoro operativo: chiudere formalmente Slice 0 con verifica e pulizia minima, poi concentrare Slice 1 sulla dashboard direzionale di gara.
