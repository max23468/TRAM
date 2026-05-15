# TRAM V1 - Priorità primo slice UI v0.1

Data: 2026-05-13  
Stato: decisione operativa iniziale  
Ambito: primo sviluppo UI futuro, senza scrivere codice applicativo ora

## Decisione sintetica

Il primo slice UI di TRAM V1 deve essere **document-first e review-first**.

Ordine consigliato:

1. dashboard aggregata;
2. dashboard gara;
3. document map T1;
4. review queue;
5. pannello fonte/audit minimo.

Non partire da Financials, Q&A o grafici avanzati come viste complete autonome: sono aree ad alto rischio e devono appoggiarsi prima a document map, indicatori P0 e review queue.

## Perché questo ordine

TRAM deve dimostrare subito tre cose:

- sa organizzare pacchetti documentali complessi;
- sa distinguere dati proposti, validati e bloccanti;
- sa portare l’utente alla fonte in modo rapido.

Il valore MVP non è una dashboard bella ma fragile. È una dashboard che dice chiaramente: “questo dato viene da qui, è corrente o no, e serve review oppure no”.

## Slice UI 1 - Perimetro

### Include

| Blocco | Scopo | Dipendenze |
| --- | --- | --- |
| Dashboard aggregata | vedere tutte le gare e capire dove intervenire | `indicator_key` P0, stato dashboard |
| Dashboard gara | riepilogo operativo di una gara | T1, T2, T3, indicatori P0 |
| Document map | navigare documenti, versioni, stato documenti e accesso | resolver documentale |
| Review queue | validare/correggere dati bloccanti | ReviewItem, IndicatorValue |
| Pannello fonte | aprire evidenza, snippet, documento e audit minimo | SourceReference |

### Esclude

- editor avanzato di Q&A;
- calcolo economico o simulazioni;
- confronto con offerta;
- knowledge base cross-gara;
- workflow approvativi multilivello;
- invio esterno di Q&A;
- gestione completa di commenti/thread.

## Navigazione MVP

Struttura logica proposta:

```text
/tenders
/tenders/:tender_id/overview
/tenders/:tender_id/documents
/tenders/:tender_id/review
/tenders/:tender_id/timeline
/tenders/:tender_id/deliverables
/tenders/:tender_id/audit
```

Per il primissimo slice sono obbligatorie:

- `/tenders`;
- `/tenders/:tender_id/overview`;
- `/tenders/:tender_id/documents`;
- `/tenders/:tender_id/review`.

Timeline e deliverables possono essere viste secondarie o sezioni dentro overview, finché non serve separarle.

## Regole naming UI

La UI applicativa non deve esporre codici tecnici o placeholder interni come label primarie.

Regole stabilite nello Slice 0 applicativo:

- non mostrare codici task (`T1`-`T8`) come nomi di sezione o titoli utente;
- non mostrare classi privacy nude (`L0`, `L1`, `L2`), ma label comprensibili come `Pubblico`, `Uso interno`, `Accesso ristretto`;
- non usare `fixture`, `Slice 0` o nomi di scaffold nella navigazione utente; usare `demo sanificata` solo quando serve chiarire che i dati non sono reali;
- non mostrare `currentness` come parola UI; usare `stato documenti`, `vigente`, `superato`, `da verificare` o equivalenti;
- non mostrare stati raw come `needs_review`, `candidate`, `local_review_only`, `human_review_required`; tradurli in label come `Da verificare`, `Candidato`, `Solo revisione interna`, `Richiede validazione`;
- usare `Q&A` come label primaria per gli scambi bidder/stazione appaltante;
- usare `Deliverables` al plurale;
- usare `Financials` per la sezione economica;
- usare `Criticità` al posto di `Contraddizioni` nella navigazione;
- usare `Da validare` al posto di `Review`;
- usare `Registro attività` al posto di `Audit`;
- mantenere eventuali codici tecnici nel data model, nei test e nei documenti governanti, ma tradurli sempre nella superficie applicativa.

## Comportamento dashboard gara

Per il primo prototipo, la route `/tenders/:tender_id/overview` deve essere trattata come **Dashboard gara**, non come semplice sintesi testuale.

La dashboard deve mostrare:

- stato gara e stato TRAM;
- priorità operative;
- indicatori direzionali;
- alert Q&A/documenti;
- anteprime compatte delle sezioni principali;
- link alle pagine dedicate con contenuti completi.

Le sezioni nella dashboard sono **anteprime**, non viste complete:

- Documenti;
- Timeline;
- Deliverables;
- Requisiti;
- Financials;
- Cost driver;
- Criticità;
- Q&A;
- Da validare;
- Registro attività.

Ogni sezione deve poter essere aperta come pagina autonoma dalla rail laterale o dal link `Apri sezione`.

Comportamento:

- rail laterale sticky con sezioni principali;
- scroll continuo da dashboard a documenti, timeline, deliverables, requisiti, financials, cost driver, criticità, Q&A, da validare e registro attività;
- link laterali ad anchor nella stessa pagina quando l’utente è in overview;
- link laterali a pagine dedicate quando l’utente è già dentro una sezione;
- stato attivo della rail aggiornato durante lo scroll;
- timeline in forma visiva di timeline, non come semplice griglia di card;
- Q&A in formato registro compatto, filtrabile ed espandibile, adatto anche a centinaia di righe;
- route dedicate obbligatorie per consultazione completa e futura interazione puntuale.

## Dashboard aggregata

### Obiettivo

Mostrare rapidamente quali gare sono sane, stale, bloccate o da aggiornare.

### Colonne minime

| Colonna | `indicator_key` o fonte |
| --- | --- |
| Gara | `tender.identity.name` |
| Tipo pacchetto | `tender.identity.package_type` |
| Modalità | `tender.identity.transport_mode` |
| Fase | `procurement.stage.current` |
| Prossima scadenza | `procurement.deadline.next_critical` |
| Documenti variati | `documents.changed_since_last_review_count` |
| Review bloccanti | `review.items.blocking_count` |
| Criticità | `contradictions.critical_count` |
| Q&A da gestire | `clarifications.ready_count` |
| Stato | `dashboard.validation_state.overall` |

### Azioni minime

- apri gara;
- filtra per stato;
- filtra per tipo pacchetto;
- ordina per prossima scadenza;
- apri review bloccanti.

## Dashboard gara

### Obiettivo

Mostrare una sintesi affidabile e criticabile della gara.

### Blocchi

| Blocco | Contenuto |
| --- | --- |
| Header gara | nome, authority, paese, tipo pacchetto, modalità |
| Stato dashboard | validazione, documenti nuovi, blocker |
| Timeline critica | prossime deadline, mobilitazione, start operation, durata |
| Network snapshot | linee, km, stazioni/fermate, rolling stock, pattern servizio |
| Documenti correnti | totale, correnti, conflitti, ultimi aggiornamenti |
| Deliverables | totale, mandatory, prossima scadenza, sensibili |
| Requisiti/KPI | mandatory count, KPI critici, review aperte |
| Financials | solo summary/stato review, non dettaglio non validato |
| Rischi/Q&A | criticità, Q&A pronti, bloccati o con risposta da incorporare |
| AI/data policy | AI esterna ammessa, bloccata o da approvare |

## Document map T1

### Obiettivo

Rendere chiaro cosa c’è nel pacchetto e quale documento è corrente.

### Vista minima

| Campo | Note |
| --- | --- |
| famiglia documento | da resolver T1 |
| titolo normalizzato | da T1 + regole |
| filename originale | sempre visibile |
| versione | deterministica, non AI-only |
| variante | clean, track changes, redline, template, workbook |
| stato documenti | vigente, superato, candidato, da verificare |
| accesso | pubblico, uso interno, accesso ristretto |
| review | se richiesta |
| fonte/preview | link al file o estratto |

### Filtri minimi

- stato documenti;
- accesso;
- document nature;
- document role;
- changed since last review;
- review required.

## Review queue

### Obiettivo

Trasformare in lavoro umano chiaro tutto ciò che non deve diventare verità automatica.

### Priorità ordinamento

1. blocker dashboard;
2. scadenze critiche;
3. financials/payment/penali;
4. contraddizioni critiche;
5. documenti correnti ambigui;
6. Q&A;
7. altri item.

### Azioni minime

- conferma;
- correggi;
- contesta;
- marca come da chiarire;
- marca come superato;
- richiedi più evidenza;
- crea thread Q&A interno.

## Pannello fonte/audit minimo

Il pannello fonte deve aprirsi da dashboard, document map, timeline, Deliverables e review queue.

Deve mostrare:

- documento;
- versione;
- pagina/sezione/riga se disponibile;
- snippet o riferimento;
- estrazione collegata;
- provider o regola che ha prodotto il dato;
- stato validazione;
- azioni utente precedenti.

## Stati UI obbligatori

| Stato | Comportamento |
| --- | --- |
| Nessun documento | gara vuota con invito a caricare pacchetto |
| Parsing in corso | progressivo per file/task, senza promettere risultato |
| Dati proposti | badge visibile e fonte |
| Review bloccante | blocco in evidenza e link diretto |
| Dashboard stale | mostra dati, ma segnala nuovi documenti |
| AI bloccata | spiega motivo e alternativa locale/review |
| Quota gratuita esaurita | job sospeso, nessun fallback paid |

## Acceptance criteria del primo slice

Il primo slice UI è pronto quando:

- l’utente vede l’elenco gare e capisce quale gara richiede attenzione;
- l’overview mostra almeno gli indicatori P0 disponibili;
- ogni valore P0 ha stato e fonte o risulta chiaramente non disponibile;
- la document map distingue documenti correnti, superati e da review;
- la review queue permette di chiudere o correggere un item;
- un documento nuovo cambia lo stato dashboard in `stale_due_to_new_docs`;
- una review bloccante cambia lo stato dashboard in `open_critical_issues`;
- Financials e Q&A non vengono trattati come dati liberi o automaticamente approvati.

## Debiti

- Disegnare wireframe desktop e mobile.
- Definire design system e componenti.
- Raffinare le interazioni delle pagine dedicate per Timeline, Deliverables, Q&A ed Financials.
- Definire permessi UI per mostrare financials sensibili e audit AI.
- Definire export PDF/Excel solo dopo stabilizzazione dashboard.

## Prossimo passo consigliato

Collegare questo slice al modello ruoli/permessi e alla data policy per gara: la UI deve sapere chi può vedere, validare, correggere, approvare AI esterna e preparare Q&A.
