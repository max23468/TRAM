# TRAM V1 - Matrice decisionale automazione e AI

Data: 2026-05-12
Stato: proposta da validare prima dello sviluppo
Ambito: MVP/V1 TRAM per analisi documenti gara TPL O&M

## Scopo

Questa matrice decide, in modo provvisorio ma operativo, quali task di TRAM V1 conviene affidare a:

- parser, regole e logica deterministica;
- AI come assistente di estrazione, classificazione o ragionamento;
- utente esperto, quando serve giudizio umano o responsabilità finale.

La proposta nasce dai pacchetti Copenhagen e Luas, dalla tassonomia indicatori TRAM e da benchmark internazionali su contratti O&M, performance regimes, asset management e service quality.

## Principio guida

TRAM non deve essere “AI che decide tutto”.

La V1 dovrebbe essere un sistema documentale strutturato con AI controllata:

- le regole e i parser gestiscono ciò che è oggettivo, ripetibile e verificabile;
- l’AI propone sintesi, classificazioni, estrazioni semantiche, contraddizioni e bozze di chiarimento;
- l’utente valida ciò che ha impatto contrattuale, economico, legale o comunicativo.

La qualità del prodotto dipenderà dalla combinazione, non dalla quantità di AI usata.

Vincolo V1 aggiornato: quando questa matrice parla di AI-assisted, per l’MVP significa AI gratuita o protetta da budget pari a zero/minimo. L’AI può essere cloud, ma deve passare da un gateway provider-agnostic e non deve generare costi automatici.

La strategia AI gratuita V1 è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-free-ai-strategy.md`

La tassonomia task T1-T8, che traduce questa matrice in unità operative benchmarkabili, è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-tx-task-taxonomy-t1-t8.md`

Mapping sintetico:

| Tx | Area matrice |
| --- | --- |
| `T1` | Document map, versioning, classificazione documento |
| `T2` | Timeline |
| `T3` | Deliverables |
| `T4` | Requisiti, KPI non finanziari, operations, maintenance, compliance |
| `T5` | Financials, pricing, payment mechanism |
| `T6` | Cost drivers |
| `T7` | Contraddizioni |
| `T8` | Chiarimenti/Q&A |

## Livelli di automazione

| Codice | Livello | Descrizione | Esempio |
| --- | --- | --- | --- |
| D | Deterministico | Output ottenibile con parser, metadata, OCR, hash, tabelle o regole stabili | tipo file, numero pagine, hash, celle Excel |
| R | Rule-based | Regole esplicite, pattern, dizionari e controlli numerici | date ISO, version number, duplicate filename |
| A1 | AI-assisted extraction | AI propone estrazioni strutturate con fonte e confidenza | requisito, definizione, deliverable, KPI |
| A2 | AI-assisted reasoning | AI confronta, ragiona, riconcilia o segnala possibili conflitti | contraddizione tra due documenti |
| H1 | Human validation required | AI o regole propongono, ma serve conferma utente prima di consolidare | requisito ad alto rischio, chiarimento da inviare |
| H2 | Human-only decision | Decisione finale non delegabile a TRAM | inviare chiarimento, interpretazione legale definitiva, strategia offerta |

## Regole trasversali

- Ogni output AI deve avere fonte, estratto, riferimento documento e livello di confidenza.
- Ogni chiamata AI deve indicare provider, modello, prompt version, input hash, output hash e consumo stimato.
- Se finisce la quota gratuita o il budget, il job si sospende senza fallback automatico a pagamento.
- Ogni dato critico deve avere stato: proposto, confermato, contestato, superato, da chiarire.
- Le contraddizioni non sono “verità”: sono candidate issues da verificare.
- I chiarimenti verso la stazione appaltante devono essere sempre approvati da un utente.
- I dati economici devono distinguere valore estratto, formula, assunzione e interpretazione.
- Se l’AI non trova evidenza sufficiente, deve dichiarare incertezza e chiedere validazione.
- Il feedback utente può migliorare tassonomie e prompt, ma non deve creare apprendimento opaco.

## Matrice MVP proposta

| Area | Task | Livello MVP proposto | Ruolo AI | Gate umano | Motivazione |
| --- | --- | --- | --- | --- | --- |
| Ingestion | Caricare file e cartelle | D | Nessuno | No | Operazione tecnica deterministica |
| Ingestion | Rilevare tipo file, dimensione, hash, pagine | D | Nessuno | No | Serve affidabilità e ripetibilità |
| Ingestion | Rilevare PDF scannerizzato e bisogno OCR | D/R | Nessuno o minimo | No | Si può decidere con controlli tecnici |
| Ingestion | Estrarre testo da PDF/DOCX/XLSX/MPP | D | Nessuno | No | Parser specializzati sono più affidabili |
| Ingestion | Valutare qualità estrazione testo | R/A1 | AI può segnalare testo corrotto o incompleto | Sì, se documento critico | Utile per evitare false estrazioni |
| Document map | Classificare ruolo documento | A1 + R | AI propone ruolo e motivazione | Solo su documenti ambigui | I titoli aiutano, ma il contenuto conta |
| Document map | Riconoscere fase procurement | A1 + R | AI propone stage e alternative | Sì, su classificazioni miste | Prequalifica, ITT, ITN e addendum possono sovrapporsi |
| Document map | Riconoscere documento corrente vs superato | R + A1 | Regole risolvono famiglia/versione/currentness; AI segnala anomalie o casi ambigui | Sì sui casi non deterministici | Il rerun T1 L0 v0.3 mostra che l’AI può invertire clean copy/track changes o versioni v3/v2 |
| Versioning | Estrarre document ID, versione, issue date | D/R | Nessuno | No, salvo anomalie | Spesso è strutturato in copertina o filename |
| Versioning | Collegare clean copy e track changes | A1 + R | AI riconosce relazione semantica | Sì su documenti chiave | Richiede confronto oltre filename |
| Versioning | Confronto semantico tra versioni | A2 | AI evidenzia modifiche rilevanti | Sì | Valore alto, rischio di omissioni |
| Timeline | Estrarre date da tabelle e MPP | D/R | AI solo per normalizzare descrizioni | No, salvo divergenze | MPP e tabelle sono fonti strutturate |
| Timeline | Distinguere gara e contratto | A1 | AI propone categoria evento | Sì su eventi ambigui | Necessario per dashboard |
| Timeline | Rilevare date superate o modificate da addendum | A2 + R | AI riconcilia documenti | Sì | Task ad alto valore e alto rischio |
| Network | Estrarre linee, km, stazioni, sistemi, asset | A1 + R | AI normalizza valori e unità | Sì su mismatch | Dati spesso distribuiti tra fonti |
| Network | Riconciliare valori divergenti | A2 | AI segnala conflitto e fonti | Sì | Non deve scegliere da sola |
| Requisiti | Estrarre requisiti espliciti | A1 + R | AI estrae e classifica | Validazione a campione; obbligatoria per high-risk | I requisiti sono semanticamente complessi |
| Requisiti | Distinguere MR, general requirement, obligation, information | A1 | AI propone categoria | Sì su requisiti critici | Impatta compliance e offerta |
| Requisiti | Collegare requisito a costo/rischio | A2 | AI propone impatto | Sì | Richiede giudizio esperto |
| Definizioni | Estrarre glossario | A1 + R | AI pulisce e deduplica | No, salvo definizioni critiche | Output utile e verificabile |
| Deliverables | Estrarre deliverable di tender | A1 + R | AI struttura output, limiti, fonte | Sì su deliverable valutativi | Cruciale per offerta |
| Deliverables | Estrarre deliverable contrattuali/report | A1 | AI raggruppa per frequenza e owner | Sì su obblighi ricorrenti | Spesso sparsi tra allegati |
| KPI | Estrarre KPI, formula, soglia, frequenza | A1 + R | AI struttura, parser controlla numeri | Sì su formule e bonus/malus | Rischio alto se formula sbagliata |
| KPI | Collegare KPI a payment/penalties | A2 | AI propone linkage | Sì | Impatto economico |
| Financials | Leggere workbook prezzi | D/R | Nessuno per celle/formule | No | Excel va letto in modo strutturato |
| Financials | Sintetizzare price structure | A1 + R | AI spiega struttura e categorie | Sì | Utile ma soggetto a interpretazione |
| Financials | Estrarre payment mechanism | A1/A2 | AI sintetizza meccanismo e fonti | Sì obbligatorio | Impatto economico alto |
| Financials | Stimare sostenibilità economica | H2 | Nessun giudizio finale | Sì, solo umano | Fuori portata V1 |
| Cost drivers | Mappare attività che generano costo | A2 | AI collega requisiti, asset e pricing | Sì | Alto valore per O&M |
| Cost drivers | Quantificare costo | D/R se formula esplicita, altrimenti H2 | AI può solo spiegare assunzioni | Sì | Non inventare stime |
| Operations | Estrarre headway, service volume, fallback, disruption | A1 | AI struttura requisiti operativi | Sì su elementi valutativi | Fondamentale per offerta tecnica |
| Maintenance | Estrarre asset classes, PM/CM, CMMS, spares | A1 | AI classifica per asset e attività | Sì su high-risk | Fonte di molti costi nascosti |
| Maintenance | Valutare asset condition risk | A2/H1 | AI propone risk signal | Sì obbligatorio | Rischio tecnico non va automatizzato del tutto |
| Customer | Estrarre customer satisfaction, complaints, passenger information | A1 | AI raggruppa customer experience | Validazione leggera | Standard nei benchmark internazionali |
| Workforce | Estrarre transfer employees, key persons, manning, training | A1 | AI struttura obblighi HR | Sì | Impatto su costi e mobilizzazione |
| Compliance | Estrarre safety, security, cyber, data protection, ESG, sanctions | A1 | AI crea compliance map | Sì su vincoli critici | Rischio legale/operativo |
| AI clause | Rilevare clausole su uso AI | A1/A2 | AI segnala vincoli e possibili impatti | Sì obbligatorio | Ironico ma serio: TRAM deve rispettare questi vincoli |
| Contraddizioni | Mismatch numerici o date divergenti | R + A2 | AI spiega conflitto e fonti | Sì | Buon candidato V1 |
| Contraddizioni | Contraddizioni semantiche tra requisiti | A2 | AI produce issue candidate | Sì obbligatorio | Alto valore, alto rischio |
| Chiarimenti/Q&A | Generare bozza di chiarimento | A2 | AI redige testo con fonti | Sì obbligatorio | Mai invio automatico |
| Dashboard | Comporre riepilogo gara | A1 + R | AI sintetizza, sistema mostra stati | Sì su pubblicazione interna iniziale | Deve essere utile ma tracciato |
| Dashboard aggregata | Comparare più gare | A1/A2 | AI normalizza differenze | Sì su insight strategici | V1 leggera, più forte in V3 |
| Feedback | Registrare correzioni utente | D/R | AI può suggerire tag | No | Deve essere auditabile |
| Learning | Applicare feedback a futuri pacchetti | A2/H1 | AI propone regole o prompt adjustment | Sì | Evitare apprendimento opaco |
| Export | Generare report Excel/PDF/Word | D/R + A1 | AI può scrivere sintesi | Sì prima di invio esterno | Output deve essere controllato |

## Decisione proposta per MVP

Per la V1, la scelta consigliata è:

- **AI-assisted, non AI-autonomous** per requisiti, KPI, financial summary, contraddizioni e chiarimenti/Q&A;
- **parser/regole come base obbligatoria** per file, OCR, metadati, Excel, MPP, date e formule esplicite;
- **regole deterministiche come base obbligatoria** per famiglia documento, versione e `currentness`, con AI solo come supporto su anomalie;
- **validazione umana critical-first** per interpretazioni contrattuali, payment mechanism, chiarimenti esterni, contraddizioni semantiche e dati economici critici;
- **human-only** per strategia di offerta, sostenibilità economica, decisione di inviare un chiarimento e interpretazione legale definitiva.

Il benchmark Copenhagen T1 L0 v0.3 hybrid conferma questa scelta: Gemini e Mistral passano quando l’AI classifica natura/ruolo e il resolver deterministico calcola family/version/currentness.

Il workflow di validazione consigliato è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-human-validation-workflow.md`

La review queue che rende operativo questo workflow è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-review-queue-design.md`

## Cosa entra nel primo MVP

### Da automatizzare subito

- ingestione tecnica e inventario;
- OCR/text extraction;
- document map;
- timeline da PDF/MPP;
- network summary;
- deliverable di tender;
- KPI map;
- price workbook structure;
- alert su mismatch evidenti;
- dashboard sintetica con fonti.

### Da fare AI-assisted con revisione

- requisiti e obblighi;
- cost drivers;
- payment mechanism;
- risk allocation;
- reporting obligations;
- compliance map;
- contraddizioni candidate;
- chiarimenti/Q&A.

### Da lasciare umano in V1

- approvazione dati ad alto rischio;
- invio chiarimenti;
- decisioni strategiche;
- interpretazione legale;
- valutazione finale di sostenibilità economica;
- validazione del modello di apprendimento dai feedback.

## Cosa rimandare

- agenti completamente autonomi che monitorano e decidono senza revisione;
- apprendimento cross-gara non governato;
- scoring automatico di rischio economico;
- simulazioni complete di offerta;
- confronto dell’offerta preparata con la documentazione, che resta V2;
- best practice cross-gara e suggerimenti storici, che restano V3.

## Criteri di successo

Per dire che l’approccio funziona, su Copenhagen e Luas TRAM deve riuscire a:

- estrarre almeno l’80% degli indicatori P0 con fonte corretta;
- produrre una timeline gara e una timeline contratto verificabili;
- distinguere documenti correnti, versioni e track changes nei casi principali;
- proporre almeno tre alert utili senza inventare conflitti;
- generare bozze di chiarimento sempre citate e mai inviate automaticamente;
- permettere all’utente di confermare, correggere o rigettare un dato in modo tracciabile.

Queste soglie sono provvisorie: servono come target di test, non come promessa commerciale.

## Implicazioni tecniche preliminari

- Serve uno schema dati che memorizzi fonte, confidenza, stato validazione e history delle correzioni.
- Serve una pipeline asincrona: ingestione, parsing, estrazione, normalizzazione, riconciliazione, revisione.
- Serve separare evidenze grezze, estrazioni AI e dato validato.
- Serve un audit log delle modifiche utente.
- Serve un meccanismo di “human gate” per chiarimenti e output esterni.
- Serve un sistema di prompt/versioning delle istruzioni AI per capire perché un’estrazione è cambiata nel tempo.

Il data model minimo proposto è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-data-model.md`

## Domande da validare

1. Confermare o modificare il modello critical-first proposto nel workflow di validazione.
2. I chiarimenti/Q&A devono essere solo testo libero o anche formato strutturato pronto per piattaforme tipo procurement portal?
3. Quanto è accettabile avere alert falsi positivi, se in cambio TRAM trova più contraddizioni potenziali?
4. Per i financials, vogliamo limitarci alla mappa delle voci e dei meccanismi o iniziare anche una prima stima dei cost drivers?
5. I feedback dei tre primi utenti devono restare nello spazio della gara o alimentare una knowledge base trasversale già in V1?

## Prossimo passo consigliato

Usare questa matrice per progettare la prima pipeline MVP:

1. input documentale;
2. parser e OCR;
3. schema estrazioni;
4. moduli AI-assisted;
5. validation UI;
6. dashboard;
7. audit log e feedback loop.
