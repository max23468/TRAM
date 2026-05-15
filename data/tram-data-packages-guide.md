# TRAM - Pacchetti gara benchmark

Questa cartella separa i pacchetti gara usati da TRAM dalle analisi derivate.

## Dove mettere i pacchetti

- `packages/dublin-luas-om/`: pacchetto gara Dublin Luas O&M.
- `packages/copenhagen-m1-m4-om/`: pacchetto gara Copenhagen M1-M4 O&M.
- `packages/milano-lotti-extraurbani-om/`: pacchetto gara Milano lotti extraurbani O&M.
- `packages/dublin-metrolink-ppp/`: pacchetto prequalifica Dublin MetroLink PPP.

I file in `packages/` non sono trattati come "documenti grezzi", ma come pacchetti documentali che TRAM dovrebbe poter ingerire, ordinare, versionare e monitorare.

I pacchetti in `packages/` non vanno versionati in Git.

## Area di lavoro

- `working/dublin-luas-om/`: estrazioni temporanee, OCR, markdown intermedi, indici locali.
- `working/copenhagen-m1-m4-om/`: estrazioni temporanee, OCR, markdown intermedi, indici locali.
- `working/milano-lotti-extraurbani-om/`: inventari, estrazioni temporanee, OCR, tabelle, archivi GTFS e indici locali.
- `working/dublin-metrolink-ppp/`: inventari, estrazioni temporanee, OCR, form, tabelle e indici locali.
- `private/`: materiale sensibile, note locali o file che non devono entrare in repo.

## Regola iniziale

I pacchetti gara servono come benchmark privati per definire TRAM V1:

- quali dati estrarre;
- come citare le fonti;
- come gestire integrazioni e versioni;
- come misurare costi e qualità;
- quali dashboard hanno valore reale.
