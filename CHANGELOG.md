# Changelog

Tutte le modifiche rilevanti di TRAM sono documentate in questo file.

## 0.2.0 - 2026-05-26

### Aggiunto

- Workspace MVP unico per home, lista gare, preparazione gara, gare locali, dati dimostrativi e viste tender.
- Creazione di gare locali da `/tenders/intake`, con salvataggio controllato in `.local/tram-workspace` e `.local/tram-storage`.
- Endpoint standard `/api/tenders/:id/documents/:documentId` per aprire documenti locali o dimostrativi dallo stesso percorso applicativo.
- View model unico per quadro, documenti, scadenze, consegne, requisiti, economia, costi, criticità, domande, controlli e registro.

### Cambiato

- Copenhagen M1/M4 O&M è assorbita nel percorso unico `/tenders/tender_copenhagen_m1_m4_om/*`.
- La UI utente traduce codici tecnici e stati interni in linguaggio operativo italiano.
- Gli script dimostrativi usano prefissi `demo:*` invece del lessico precedente.

### Rimosso

- Route parallela `/pilot/copenhagen-m1-m4-om`.
- Componenti tender legacy con strutture diverse tra gare.
- Adattatore applicativo Copenhagen separato.

### Verificato

- `npm run verify`.
- Smoke browser desktop/mobile su lista locale, lista demo, Copenhagen, documenti, deep link fonte e vecchia route rimossa.
