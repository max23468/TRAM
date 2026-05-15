# Pacchetti gara benchmark V1

Stato: pacchetti caricati, inventario tecnico L0 aggiornato, prime analisi T1 completate su Copenhagen e Dublin Luas
Data: 2026-05-13

## Pacchetti scelti

Questi file non vanno considerati come "documenti grezzi" in senso debole o provvisorio. Sono pacchetti gara reali o realistici, cioè la stessa unità documentale che TRAM dovrà saper gestire come input applicativo.

### Dublin Luas O&M

Percorso locale:

`/Users/Matteo/Documents/TRAM/data/packages/dublin-luas-om/`

Uso previsto:

- benchmark per documentazione O&M in contesto tram/light rail;
- test di estrazione network, requisiti, deliverable, timeline e contraddizioni;
- verifica della gestione di allegati, chiarimenti e versioni.

Inventario iniziale:

- dimensione: circa 117 MB;
- file utili: 99, esclusi file di sistema `.DS_Store`;
- formati: 82 PDF, 13 XLSX, 3 DOCX, 1 XLS;
- struttura principale: ITN, Data Room Agreements, Contract, Schedules, Annexes, Timetables, Maintenance Boundary Maps, Pricing Documents, Financial Model;
- classificazione provvisoria: pacchetto tender O&M in fase negoziale, perché il pacchetto contiene una `Invitation to Negotiate`;
- nota MVP: presenza rilevante di redline, revisioni, allegati, Excel orari/prezzi e mappe di manutenzione.

### Copenhagen M1-M4 O&M

Percorso locale:

`/Users/Matteo/Documents/TRAM/data/packages/copenhagen-m1-m4-om/`

Analisi collegate:

- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-semantic-benchmark-analysis.md`
- `/Users/Matteo/Documents/TRAM/docs/analysis/tram-copenhagen-m1-m4-v1-extraction-grid.md`

Uso previsto:

- benchmark per documentazione O&M metro;
- confronto con il caso Luas per capire quali campi sono standardizzabili;
- verifica della dashboard multi-gara e della comparabilità tra spazi.

Inventario iniziale:

- dimensione: circa 24 MB;
- file utili: 59, esclusi file di sistema `.DS_Store`;
- formati: 51 PDF, 6 DOCX, 1 XLSX, 1 MPP;
- struttura principale: Tender documents, Conditions of Contract with appendices, Contract specification with attachments;
- classificazione provvisoria: tender pack/ITT O&M, con versioni multiple e documenti con track changes;
- nota MVP: presenza di Microsoft Project `.mpp`, schedule prezzi, condizioni contrattuali, specifiche e allegati tecnici.

### Milano Lotti Extraurbani O&M

Percorso locale:

`/Users/Matteo/Documents/TRAM/data/packages/milano-lotti-extraurbani-om/`

Inventario collegato:

`/Users/Matteo/Documents/TRAM/data/working/milano-lotti-extraurbani-om/inventory/tram-milano-lotti-extraurbani-om-l0-file-inventory-2026-05-13.json`

Uso previsto:

- benchmark per documentazione O&M bus extraurbano;
- stress test per gare multi-lotto e combinazioni di lotti;
- stress test per dati operativi tabellari, GTFS, PEF, modelli economici e offerta tecnica/economica.

Inventario L0:

- dimensione: circa 189 MB;
- file utili: 97;
- formati: 37 PDF, 34 XLSX, 9 ZIP, 8 XLSM, 5 DOCX, 2 P7M, 1 DOC, 1 XLS;
- struttura principale: quasi tutto al livello root con naming progressivo `All`;
- classificazione provvisoria: ITT bus extraurbano O&M multi-lotto;
- nota MVP: presenza rilevante di GTFS, PEF, modelli macro-enabled, dati su linee, fermate, mezzi, personale, qualità, penali e offerta economica.

### Dublin MetroLink PPP

Percorso locale:

`/Users/Matteo/Documents/TRAM/data/packages/dublin-metrolink-ppp/`

Inventario collegato:

`/Users/Matteo/Documents/TRAM/data/working/dublin-metrolink-ppp/inventory/tram-dublin-metrolink-ppp-l0-file-inventory-2026-05-13.json`

Uso previsto:

- benchmark per prequalifica PPP;
- test stage-aware per evitare confronti impropri con ITT e ITN;
- stress test per Qualification Envelope, Technical Envelope, form, declarations e template di risposta.

Inventario L0:

- dimensione: circa 5 MB;
- file utili: 37, esclusi file di sistema `.DS_Store`;
- formati: 31 DOCX, 3 PDF, 3 XLSX;
- struttura principale: Pre-Qualification Pack, Forms and Declarations, Qualification Envelope, Technical Envelope;
- classificazione provvisoria: prequalifica PPP/PQP;
- nota MVP: il pacchetto è ottimo per eligibility, standing economico-finanziario, capability evidence e reference projects, ma non va trattato come fonte completa di obblighi O&M contrattuali.

## Criteri di analisi iniziale

La griglia dei pacchetti userà come riferimento la tassonomia indicatori TRAM V1:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-indicator-taxonomy.md`

Per decidere quali attività saranno parser/regole, AI-assisted o human-only useremo:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-automation-decision-matrix.md`

Per ciascun pacchetto rileveremo:

- fase del pacchetto:
  - avviso preliminare, market engagement o prior information notice;
  - prequalifica;
  - ITT;
  - negoziazione, dialogo, revised tender o best and final offer;
  - misto;
  - addendum, integrazione o chiarimento successivo;
- numero e tipo dei documenti;
- dimensione complessiva;
- lingue presenti;
- presenza di PDF scannerizzati o nativi;
- presenza di Word, Excel, ZIP o allegati tecnici;
- presenza di Microsoft Project o altri file specialistici;
- struttura delle versioni e delle integrazioni;
- sezioni ricorrenti;
- dati tabellari;
- riferimenti incrociati;
- potenziali contraddizioni;
- output più utili per un utente O&M.

## Nota su prequalifiche e ITT

TRAM dovrà distinguere chiaramente tra pacchetti di prequalifica e pacchetti ITT, ma senza trattare la distinzione come una semplice scala "pochi dati / tanti dati".

In prima ipotesi:

- le prequalifiche, o documenti equivalenti come SQ, PSQ e request to participate, servono soprattutto a selezionare chi può accedere alla fase successiva;
- gli ITT sono il pacchetto con cui l’autorità invita alla presentazione dell’offerta e dovrebbero contenere informazioni sufficienti per preparare il tender;
- nelle procedure aperte l’ITT o il tender pack può essere disponibile fin dall’inizio, mentre nelle procedure ristrette o multi-stage può arrivare solo dopo la selezione dei candidati;
- nei casi negoziati o con dialogo competitivo, l’ITT può non essere l’ultimo stato informativo: possono esserci initial tender, negoziazioni, revised tender, BAFO, addendum e chiarimenti;
- integrazioni, chiarimenti e versioni successive possono modificare o superare parti del pacchetto originale e devono essere trattati come elementi che aggiornano la panoramica.

## Decisione già presa

TRAM V1 non sarà progettato solo su mock: questi quattro pacchetti gara saranno usati come benchmark privati per validare perimetro, dati, pipeline, costi e dashboard.

## Prime implicazioni per TRAM V1

- La V1 deve supportare almeno PDF, DOCX, XLSX e XLS.
- La V1 deve prevedere supporto o strategia di fallback per DOC, XLSM, ZIP/GTFS e P7M.
- La V1 deve prevedere una strategia per file `.mpp`, anche se inizialmente può limitarsi a inventario, metadati e fallback manuale/export.
- La gestione versioni non è opzionale: entrambi i pacchetti contengono revisioni, redline, track changes o versioni multiple.
- I file tabellari non sono allegati secondari: includono pricing, financial model, timetables, schedule, GTFS, PEF, fermate, linee, mezzi e personale.
- Le mappe e gli allegati tecnici devono essere accessibili e indicizzati anche quando non sono immediatamente estraibili come testo strutturato.
- La classificazione del pacchetto deve distinguere almeno prequalifica, ITT/tender pack e fase negoziale/ITN.
- La dashboard deve essere stage-aware: una prequalifica PPP non deve essere penalizzata perché non contiene il livello di dettaglio contrattuale di un ITT.
- La gestione multi-lotto è un requisito V1 da modellare almeno a livello di metadati, perché Milano contiene lotti singoli e combinatori.
