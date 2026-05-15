# TRAM - Inventario pacchetti caricati

Data: 2026-05-12 15:54 CEST
Stato: inventario tecnico iniziale

Nota: snapshot storico superato dall’inventario aggiornato del 2026-05-13:

`/Users/Matteo/Documents/TRAM/docs/analysis/tram-loaded-packages-inventory-2026-05-13.md`

## Sintesi

Sono presenti due pacchetti benchmark:

- Dublin Luas O&M;
- Copenhagen M1-M4 O&M.

Dimensione complessiva: circa 140 MB.

File utili complessivi: 158, esclusi i file di sistema `.DS_Store`.

Formati rilevati:

- 133 PDF;
- 14 XLSX;
- 9 DOCX;
- 1 XLS;
- 1 MPP.

Non risultano archivi ZIP caricati come pacchetti compressi. Alcuni formati Office sono tecnicamente container ZIP, ma sono documenti applicativi normali.

## Dublin Luas O&M

Percorso:

`/Users/Matteo/Documents/TRAM/data/packages/dublin-luas-om/`

Dimensione: circa 117 MB.

File utili: 99.

Formati:

- 82 PDF;
- 13 XLSX;
- 3 DOCX;
- 1 XLS.

Cartelle principali:

- `FINANCIAL MODEL`;
- `Volume 1.1 - ITN`;
- `Volume 1.2 - Data Room Agreements`;
- `Volume 2 - Contract`;
- `Volume 3.1 - Schedules`;
- `Volume 3.2 - Annexes`;
- `Volume 3.3 - Annex 4-1 Timetables`;
- `Volume 3.4 - Annex 23-1 Maintenance Boundary Maps`;
- `Volume 4 - Pricing Documents`.

Classificazione provvisoria:

- pacchetto tender O&M in fase negoziale/ITN;
- non va trattato come semplice ITT statico;
- contiene revisioni, redline, contratto, schedules, annexes, pricing, financial model, orari e mappe di manutenzione.

Implicazioni:

- ottimo benchmark per versioni e redline;
- ottimo benchmark per dati tabellari e pricing;
- ottimo benchmark per allegati tecnici e mappe;
- richiede gestione di PDF, Excel e Word;
- gli orari e il pricing non sono accessori: TRAM dovrà considerarli dati strutturabili.

## Copenhagen M1-M4 O&M

Percorso:

`/Users/Matteo/Documents/TRAM/data/packages/copenhagen-m1-m4-om/`

Dimensione: circa 24 MB.

File utili: 59.

Formati:

- 51 PDF;
- 6 DOCX;
- 1 XLSX;
- 1 MPP.

Cartelle principali:

- `a. Tender documents`;
- `b. Conditions of contract with appendix's`;
- `c. Contract specification with attachments`.

Classificazione provvisoria:

- tender pack/ITT O&M;
- contiene Instructions to Tender, Conditions of Contract e Contract Specifications;
- contiene versioni multiple e documenti con track changes;
- include un file Microsoft Project `.mpp`, quindi serve una strategia per schedule non PDF/Excel.

Implicazioni:

- ottimo benchmark per struttura classica tender pack;
- ottimo benchmark per specifiche contrattuali e allegati;
- utile per testare classificazione versioni v3, v4, v5 e track changes;
- richiede gestione del formato `.mpp` almeno come metadato o input da esportare.

## Prime conclusioni operative

- TRAM V1 deve nascere con una pipeline documentale multi-formato, non solo PDF-first.
- La gestione versioni è un requisito core già dal primo MVP.
- I file tabellari sono centrali per O&M: pricing, financial model e timetables.
- La classificazione procedurale deve includere almeno prequalifica, ITT/tender pack e ITN/fase negoziale.
- La UI documentale dovrà mostrare cartelle, ruoli documento, versioni, stato di validità e collegamenti tra documenti.
- Il prossimo passo è scegliere il primo pacchetto da analizzare semanticamente, partendo dai documenti guida principali.
