# TRAM V1 - Ruoli e permessi MVP v0.1

Data: 2026-05-13  
Stato: decisione operativa iniziale  
Ambito: utenti interni, Tender condivisi, review queue, dati sensibili e chiarimenti/Q&A

## Scopo

Questo documento definisce i ruoli minimi per TRAM V1.

Il primo gruppo utenti previsto è piccolo: il maintainer e due colleghi che proveranno e valideranno il prodotto. La struttura deve quindi restare semplice, ma non ingenua: financials, chiarimenti/Q&A, AI esterna e dati personali richiedono permessi espliciti.

## Decisione

Per la V1 bastano quattro ruoli Tender:

- `owner`;
- `editor`;
- `reviewer`;
- `viewer`.

In aggiunta esiste un ruolo operativo non necessariamente esposto nella UI:

- `platform_admin`, per manutenzione tecnica, migrazioni, backup e configurazioni globali future.

`platform_admin` non sostituisce i ruoli Tender: quando legge o modifica dati di una gara deve essere tracciato.

## Ruoli

### Owner

Responsabile del Tender.

Può:

- modificare metadati Tender;
- invitare o rimuovere utenti;
- assegnare ruoli;
- caricare documenti;
- avviare parsing e analisi;
- approvare data policy del Tender;
- approvare primo uso AI esterna L1;
- vedere financials sensibili;
- validare e correggere dati;
- approvare export di chiarimenti.

### Editor

Responsabile operativo del pacchetto documentale.

Può:

- caricare documenti;
- avviare ingestion, parsing, OCR e benchmark consentiti;
- creare o aggiornare document map;
- proporre correzioni;
- creare thread di chiarimento interni;
- vedere dati sensibili solo se il Tender lo consente o se l’owner abilita il ruolo.

Non può:

- invitare utenti;
- cambiare data policy;
- approvare invio o export esterno di chiarimenti;
- sbloccare AI esterna L1 senza approvazione owner/reviewer autorizzato.

### Reviewer

Responsabile della validazione.

Può:

- confermare, correggere o contestare review item;
- validare indicatori P0/P1;
- chiudere contraddizioni candidate;
- promuovere una bozza di chiarimento a “pronta per approvazione”;
- vedere fonti e audit delle estrazioni;
- vedere financials sensibili se abilitato nel Tender.

Non può:

- gestire utenti;
- modificare data policy globale;
- inviare chiarimenti all’esterno.

### Viewer

Lettore interno.

Può:

- vedere dashboard e document map non sensibili;
- aprire fonti consentite;
- vedere stati e blocker;
- esportare solo se abilitato in futuro.

Non può:

- caricare documenti;
- avviare analisi;
- validare dati;
- vedere financials L2 di default;
- creare o approvare chiarimenti;
- modificare data policy.

## Matrice permessi

| Capability | Owner | Editor | Reviewer | Viewer |
| --- | --- | --- | --- | --- |
| Vedere dashboard aggregata | sì | sì | sì | sì |
| Vedere overview Tender | sì | sì | sì | sì |
| Vedere documenti L0/L1 | sì | sì | sì | sì |
| Vedere documenti L2 | sì | opzionale | opzionale | no |
| Caricare documenti | sì | sì | no | no |
| Eliminare documenti | sì | no, salvo policy futura | no | no |
| Avviare ingestion/parsing | sì | sì | no | no |
| Avviare AI L0 | sì | sì | sì, se utile alla review | no |
| Approvare AI L1 | sì | no | opzionale, se delegato | no |
| Usare AI su L2 esterna | no in V1 default | no | no | no |
| Validare indicatori | sì | proposta | sì | no |
| Correggere indicatori | sì | proposta | sì | no |
| Chiudere review item bloccante | sì | no | sì | no |
| Creare thread di chiarimento | sì | sì | sì | no |
| Approvare chiarimento per export/invio | sì | no | opzionale, se delegato | no |
| Gestire utenti | sì | no | no | no |
| Cambiare data policy Tender | sì | no | no | no |
| Vedere audit AI | sì | sì | sì | solo sintesi |

## Capability flags

Nel futuro data model i ruoli possono tradursi in capability esplicite:

- `can_manage_tender`;
- `can_manage_members`;
- `can_upload_documents`;
- `can_run_processing`;
- `can_view_l2_content`;
- `can_view_financials`;
- `can_validate_indicators`;
- `can_close_blocking_review`;
- `can_approve_l1_external_ai`;
- `can_create_clarification_thread`;
- `can_approve_clarification_export`;
- `can_view_ai_audit`.

Questa lista evita di moltiplicare ruoli quando serviranno eccezioni.

## Regole per dati sensibili

- L2 non è visibile a `viewer` per default.
- Financials, payment, penali e garanzie non sono L2 per categoria: ereditano il privacy level effettivo della fonte e della policy Tender. Dati personali, dati interni/offerta e chiarimenti con contenuto sensibile restano L2 salvo classificazione diversa approvata.
- Un valore P0 può mostrare uno stato sintetico financials a tutti i membri del Tender, ma il dettaglio resta limitato.
- Ogni accesso o modifica a L2 deve essere auditabile quando il prodotto avrà log applicativi.

## Regole per chiarimenti/Q&A

In TRAM una query è uno scambio di domande e risposte tra bidder e stazione appaltante.

In V1:

- TRAM non invia domande o chiarimenti alla stazione appaltante;
- TRAM può creare bozze di domanda dentro un thread di chiarimento;
- una bozza può essere marcata “pronta”, ma richiede approvazione owner o reviewer delegato;
- export o copia esterna devono essere azioni volontarie dell’utente;
- chiarimenti con contenuto L2 restano bloccati finché non vengono ridotti o approvati;
- le risposte ricevute dalla stazione appaltante devono poter riaprire review su timeline, deliverable, requisiti o dashboard quando modificano dati già validati.

## Regole per AI esterna

- L0 può essere avviato da owner/editor/reviewer secondo quota.
- L1 richiede data policy Tender approvata e, almeno al primo uso, approvazione owner.
- L2 è bloccato verso provider esterni in V1 default.
- Quota o budget esauriti sospendono il job.
- Nessun ruolo può attivare fallback paid automatico.

## UX permission states

La UI deve distinguere:

- azione disponibile;
- azione disabilitata per ruolo;
- azione bloccata per data policy;
- azione bloccata per quota/budget;
- azione bloccata perché richiede review.

Messaggio esempio:

```text
Azione non disponibile: questo contenuto è L2 e la policy V1 consente solo analisi locale o review umana.
```

## Debiti

- Decidere se `reviewer` può approvare AI L1 senza owner nei primi test.
- Definire log accessi L2 quando ci sarà codice.
- Definire se `viewer` può scaricare documenti originali o solo vedere metadati/sintesi.
- Definire policy per eliminazione documenti e ripristino.
- Definire eventuale ruolo `external_advisor` solo se necessario, non in MVP.

## Prossimo passo consigliato

Usare questi ruoli nella data policy per Tender e nel workflow ingestion-dashboard, così ogni passaggio sa chi può sbloccarlo, validarlo o fermarlo.
