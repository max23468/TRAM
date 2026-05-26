# TRAM - UX And Review Workflow

Questo documento governa esperienza utente, dashboard, review queue e stati di validazione.

## Principio UX

TRAM deve essere un’app operativa, non una landing page e non una chat generica. L’interfaccia deve aiutare l’utente a scansionare, confrontare, verificare e correggere dati di gara.

## Superfici Core

- lista Tender;
- overview Tender;
- document map;
- timeline;
- deliverable;
- requisiti e KPI;
- financials e payment;
- cost driver;
- contraddizioni candidate;
- domande/risposte e chiarimenti;
- review queue;
- audit/source view.

## Rotte E Obiettivo Utente

- `/`: entrare nel workspace reale, capire se esistono gare locali e raggiungere preparazione, lista gare o modalità dimostrativa.
- `/tenders/intake`: creare una gara locale con dati minimi, selezione documenti, inventario/hash, storage fuori Git e apertura immediata del quadro gara.
- `/tenders`: vedere solo gare create nel workspace locale, filtrare per stato e aprire i controlli reali dell’utente.
- `/tenders?vista=demo`: esplorare fixture sintetiche e Copenhagen senza mescolarle alle gare operative.
- `/tenders/:tender_id/overview`: vedere sintesi direzionale, criticità, prossime scadenze, stato documenti, review aperte e azioni prioritarie.
- `/tenders/:tender_id/documents`: ispezionare document map, versioni, famiglie, addendum, documenti superati e parser issues.
- `/tenders/:tender_id/timeline`: vedere scadenze, milestone, submission, addendum, domande/risposte e conflitti temporali.
- `/tenders/:tender_id/deliverables`: gestire consegne, obbligatorietà, formato, owner, scadenza, fonte e stato.
- `/tenders/:tender_id/requirements`: navigare requisiti O&M, KPI, mandatory, compliance, safety, customer experience e fonte.
- `/tenders/:tender_id/financials`: leggere economia di gara, meccanismi di pagamento, penali, incentivi e stati di review senza esporre valori non validati in overview.
- `/tenders/:tender_id/cost-drivers`: vedere costi collegati a requisiti, KPI, risorse, asset, personale e rischi.
- `/tenders/:tender_id/contradictions`: lavorare su criticità candidate e punti da verificare.
- `/tenders/:tender_id/queries`: gestire domande/risposte, bozze, approvazione, risposte ricevute e incorporazione.
- `/tenders/:tender_id/review`: validare, correggere, contestare e chiudere item.
- `/tenders/:tender_id/audit`: consultare eventi, AI gate, parser run, review, policy e source lineage.

## Pattern Di Schermata

Le viste devono privilegiare:

- tabelle dense ma leggibili;
- timeline;
- stati;
- badge di rischio;
- filtri;
- riferimenti fonte;
- pannelli di dettaglio;
- accesso rapido alla review.

Nel MVP locale, una gara creata dall’utente deve comparire nella lista gare reale e usare le stesse route operative delle gare dimostrative. Le gare dimostrative restano accessibili solo tramite vista esplicita. Se l’id appartiene a un workspace locale, le viste mostrano inventario, controlli generati, registro e sezioni operative basate sui documenti caricati, senza trasformare automaticamente dati non estratti in verità.

Per tutte le gare che passano dal workspace unificato, la vista `/documents` deve usare lo stesso schema: lista fonti con deep link `?source=...`, pannello ispettore coerente, bottone `Apri file` sul documento originale quando il file esiste davvero e, quando disponibile, testo estratto o sintetico come supporto alla verifica.

Card e componenti incorniciati vanno usati per item ripetuti, modali o tool realmente separati, non come decorazione generale.

La dashboard gara deve essere direzionale, non un mosaico di preview T1-T8. Ogni widget deve rispondere a una domanda operativa:

- cosa richiede attenzione ora;
- cosa è cambiato dopo nuovi documenti;
- quali scadenze o deliverable sono bloccanti;
- quali dati sono proposti ma non validati;
- quali rischi sono critici;
- quale fonte sostiene o blocca il dato;
- quale azione può fare l’utente.

Widget approvati per l’overview:

- stato Tender e validazione complessiva;
- prossime scadenze;
- documenti correnti/superati/da verificare;
- review critiche;
- deliverable bloccanti;
- requisiti/KPI ad alto impatto;
- financials con stato e rischio, non valori non validati;
- cost driver critici;
- contraddizioni candidate;
- Q&A in attesa;
- attività/audit recente.

Widget da evitare o rinviare:

- score sintetici non spiegabili;
- grafici decorativi;
- “AI confidence” come metrica primaria;
- preview lunghe di tutte le viste;
- stime economiche o qualità offerta non disponibili;
- benchmark cross-gara in V1.

## Review Queue

La review queue è core prodotto. Deve permettere di:

- vedere dati proposti;
- aprire fonte e contesto;
- confermare;
- correggere;
- contestare;
- segnare come da chiarire;
- marcare superato o non applicabile.

Output critici, contraddizioni, payment mechanism, penali, KPI, requisiti mandatory, rischio economico, compliance e chiarimenti/Q&A richiedono review umana.

### Campi Review Item

Ogni item deve avere:

- id stabile;
- Tender e task/domain;
- titolo utente;
- descrizione breve;
- severità;
- priorità;
- stato;
- fonte primaria;
- estratto o riferimento;
- dato proposto;
- dato precedente se sostituito;
- motivo dell’apertura;
- owner o ruolo richiesto;
- azioni ammesse;
- audit delle modifiche;
- link alla vista specialistica.

### Ordinamento

Priorità di default:

1. blocker policy, privacy, AI o fonte mancante;
2. critical financials, mandatory, compliance, Q&A e scadenze;
3. conflitti documentali e currentness;
4. dati ad alto impatto non validati;
5. normalizzazioni o label migliorabili;
6. debito informativo a bassa urgenza.

### Azioni

- Confermare.
- Correggere.
- Contestare.
- Segnare da chiarire.
- Marcare superato.
- Marcare non applicabile.
- Collegare a domanda Q&A.
- Aprire fonte.
- Vedere audit.
- Riaprire dopo nuovo documento.

## Stati Visibili

Ogni dato mostrato deve rendere visibile:

- fonte;
- stato;
- confidenza quando applicabile;
- rischio o impatto;
- se è validato o solo proposto.

La UI deve distinguere chiaramente:

- validato;
- proposto;
- da validare;
- contestato;
- da chiarire;
- superato;
- stale per nuovo documento;
- bloccato da policy;
- bloccato da quota;
- non applicabile.

Le label utente devono essere italiane e comprensibili. Codici come `T1`, `L0`, `currentness`, `needs_review` o `blocked_by_policy` restano nel modello e nei documenti tecnici, non come testo primario.

Per il MVP, la nomenclatura visibile deve privilegiare il lessico dell’utente finale:

- `Gare`, non `Tender` come titolo primario di lista;
- `Quadro gara`, non `Dashboard Tender`;
- `Scadenze`, non `Timeline` quando la vista serve a decidere date e milestone;
- `Consegne`, non `Deliverables`;
- `Economia`, non `Financials`;
- `Costi`, non `Cost driver`;
- `Domande/Risposte`, non solo `Q&A` quando c’è spazio;
- `Controlli`, non `Da validare` come destinazione principale;
- `Registro`, non `Audit`;
- `fonti prioritarie`, non `P0/P1`;
- `documenti pubblici`, `uso interno`, `accesso ristretto`, non `L0/L1/L2`;
- `dati dimostrativi`, non `fixture` o `Demo MVP`.

## Source Inspector E Audit

Ogni dato rilevante deve poter aprire un pannello fonte con:

- documento;
- versione;
- pagina, sezione, tabella, cella o riga;
- estratto minimo;
- parser/AI/regola che ha generato il dato;
- stato review;
- eventuali documenti sostituiti o collegati;
- eventi audit;
- azioni disponibili.

Il source inspector deve funzionare come punto di controllo, non come visualizzazione decorativa. Se la fonte manca, l’item deve essere bloccato o marcato da review.

## Indicatori P0/P1

Indicatori P0 da coprire prima:

- stato Tender;
- prossima deadline critica;
- numero review critiche;
- documenti da verificare;
- addendum non assorbiti;
- deliverable obbligatori aperti;
- requisiti/KPI mandatory non validati;
- financials bloccati o da review;
- contraddizioni candidate critiche;
- Q&A in attesa di approvazione o risposta.

Indicatori P1:

- copertura documentale per famiglia;
- avanzamento review;
- qualità fonte;
- burden di validazione;
- distribuzione severità;
- aging review;
- provider/AI gate status;
- parser issues per tipo documento.

Indicatori calcolati devono indicare formula, dipendenze, fonte e comportamento quando una dipendenza è stale o contestata.

## Lingua E Design

- UI in italiano.
- Tono sobrio, professionale, sintetico.
- Evitare testi che spiegano ovvietà dell’interfaccia.
- Nessun testo deve uscire dai contenitori.
- Responsive desktop e mobile.
- Palette non monotematica e niente gradienti decorativi non necessari.

Termini consigliati:

- `Gare` come titolo primario di lista;
- `Quadro gara`;
- `Documenti`;
- `Scadenze`;
- `Consegne`;
- `Requisiti`;
- `Economia`;
- `Costi`;
- `Criticità`;
- `Domande/Risposte`;
- `Controlli`;
- `Registro`;
- `Fonte`;
- `Stato documenti`;
- `Vigente`;
- `Superato`;
- `Da verificare`.

Termini da evitare nella UI primaria:

- `fixture`;
- `slice`;
- `currentness`;
- codici task come titolo;
- classi privacy nude;
- stati raw in inglese;
- termini di fase o sviluppo come `pilot`, `Fase 7`, `stabilizzare`, `blocker`, `evidence-first`;
- copy promozionale.

## Responsive, Empty Ed Error States

Ogni vista deve avere:

- stato vuoto utile;
- stato caricamento;
- stato errore;
- stato bloccato;
- stato stale;
- stato quota esaurita se AI o job dipendono da provider;
- layout mobile senza overflow;
- tabelle trasformabili in liste dense o righe espandibili;
- azioni principali sempre raggiungibili.

Su mobile la priorità è: stato, prossima azione, fonte, review. Non tentare di mostrare ogni colonna desktop.

## Primo Slice

Il primo slice utile deve dimostrare che l’utente può entrare in un Tender e navigare tra overview, documenti, timeline, deliverable, requisiti, review e fonti usando fixture sintetiche.

Accettazione del primo slice:

- tutte le route previste caricano;
- overview non usa widget ridondanti o decorativi;
- almeno un item apre fonte e audit;
- almeno un item può mostrare azioni review;
- document map mostra vigente/superato/da verificare;
- timeline e deliverables mostrano deadline e stato;
- Financials non espone valori non validati come verità;
- Q&A non consente invio automatico;
- stati raw non appaiono nella UI primaria;
- desktop e mobile sono leggibili.
