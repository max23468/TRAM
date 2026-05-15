# TRAM - Inventario pacchetti caricati aggiornato

Data: 2026-05-13
Stato: inventario tecnico L0 aggiornato

## Sintesi

Sono presenti quattro pacchetti benchmark:

- Dublin Luas O&M;
- Copenhagen M1-M4 O&M;
- Milano lotti extraurbani O&M;
- Dublin MetroLink PPP.

Dimensione complessiva utile: circa 341 MB, esclusi file di sistema.

File utili complessivi: 292, esclusi i file di sistema `.DS_Store`.

Formati utili rilevati:

- 173 PDF;
- 51 XLSX;
- 45 DOCX;
- 9 ZIP;
- 8 XLSM;
- 2 XLS;
- 2 P7M;
- 1 DOC;
- 1 MPP.

Nota L0: questo inventario usa solo metadati locali, cioè path, nomi file, estensioni, dimensioni e struttura cartelle. Non sono stati letti contenuti documentali e non è stata usata AI.

## Dublin Luas O&M

Percorso:

`/Users/Matteo/Documents/TRAM/data/packages/dublin-luas-om/`

Dimensione utile: circa 122 MB.

File utili: 99.

Formati:

- 82 PDF;
- 13 XLSX;
- 3 DOCX;
- 1 XLS.

Classificazione provvisoria:

- pacchetto tender O&M light rail/tram in fase negoziale;
- contiene `Invitation to Negotiate`, contratto, schedules, annexes, pricing, financial model, timetables e mappe di manutenzione;
- resta benchmark principale per versioni, redline e currentness.

## Copenhagen M1-M4 O&M

Percorso:

`/Users/Matteo/Documents/TRAM/data/packages/copenhagen-m1-m4-om/`

Dimensione utile: circa 25 MB.

File utili: 59.

Formati:

- 51 PDF;
- 6 DOCX;
- 1 XLSX;
- 1 MPP.

Classificazione provvisoria:

- tender pack/ITT metro O&M;
- contiene Instructions to Tender, condizioni contrattuali, specifiche, appendici, versioni multiple e track changes;
- resta benchmark principale per struttura classica ITT e presenza di Microsoft Project.

## Milano Lotti Extraurbani O&M

Percorso:

`/Users/Matteo/Documents/TRAM/data/packages/milano-lotti-extraurbani-om/`

Inventario JSON:

`/Users/Matteo/Documents/TRAM/data/working/milano-lotti-extraurbani-om/inventory/tram-milano-lotti-extraurbani-om-l0-file-inventory-2026-05-13.json`

Dimensione utile: circa 189 MB.

File utili: 97.

Formati:

- 37 PDF;
- 34 XLSX;
- 9 ZIP;
- 8 XLSM;
- 5 DOCX;
- 2 P7M;
- 1 DOC;
- 1 XLS.

Cartelle principali:

- il pacchetto è quasi tutto al livello root, con naming progressivo `All`;
- non emerge una gerarchia di cartelle paragonabile a Dublin Luas o Copenhagen.

Classificazione provvisoria:

- ITT bus extraurbano O&M;
- gara multi-lotto;
- forte presenza di programma di esercizio, GTFS, fermate, linee, percorrenze, mezzi, personale, PEF, offerta tecnica, offerta economica e modelli per lotti/combinazioni.

Implicazioni:

- TRAM deve gestire pacchetti molto più tabellari e operativi rispetto ai benchmark rail/metro;
- i file ZIP non sono semplici allegati: includono dati GTFS e quindi vanno trattati come dataset strutturabili;
- i file `.xlsm` dei PEF richiedono attenzione per macro, formule, fogli nascosti e celle protette;
- i file `.p7m` introducono il tema dei documenti firmati digitalmente;
- il modello dati deve rappresentare lotti singoli e combinatori.

## Dublin MetroLink PPP

Percorso:

`/Users/Matteo/Documents/TRAM/data/packages/dublin-metrolink-ppp/`

Inventario JSON:

`/Users/Matteo/Documents/TRAM/data/working/dublin-metrolink-ppp/inventory/tram-dublin-metrolink-ppp-l0-file-inventory-2026-05-13.json`

Dimensione utile: circa 5 MB.

File utili: 37.

Formati:

- 31 DOCX;
- 3 PDF;
- 3 XLSX.

Cartelle principali:

- `01. PRE-QUALIFICATION PACK`;
- `02. FORMS AND DECLARATIONS`;
- root con workbook e response document.

Classificazione provvisoria:

- prequalifica PPP;
- pacchetto PQP/PQQ con Qualification Envelope e Technical Envelope;
- contiene molti template di risposta e dichiarazioni, non un set completo di requisiti O&M contrattuali.

Implicazioni:

- non va valutato con gli stessi indicatori di completezza di un ITT;
- è un benchmark ideale per distinguere requisiti di partecipazione, standing economico-finanziario, esperienza tecnica e capability O&M da obblighi contrattuali veri e propri;
- la dashboard dello spazio deve poter mostrare “stadio prequalifica” e ridurre o disabilitare gli indicatori non applicabili;
- le estrazioni attese sono più orientate a eligibility, envelopes, forms, declarations, financial/economic standing, reference projects e capability evidence.

## Conclusioni operative aggiornate

- TRAM V1 deve nascere multi-formato: PDF, DOCX, DOC, XLSX, XLS, XLSM, ZIP, P7M e MPP.
- Il resolver documentale va testato su quattro famiglie molto diverse: rail/metro ITT, tram/light rail ITN, bus extraurbano multi-lotto e prequalifica PPP.
- Milano introduce una dimensione dati operativi molto forte: GTFS, fermate, linee, percorrenze, personale, mezzi, PEF e offerte economiche.
- MetroLink introduce una dimensione procedurale diversa: prequalifica, envelopes, form e dichiarazioni.
- La dashboard multi-spazio deve distinguere stage e modalità, altrimenti rischia confronti impropri tra ITT e prequalifiche.
- T1 L0 v0.3 hybrid può essere applicato ai due nuovi pacchetti come regressione, ma le baseline attese devono essere stage-aware.
