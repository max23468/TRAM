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
- chiarimenti/Q&A;
- review queue;
- audit/source view.

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

Card e componenti incorniciati vanno usati per item ripetuti, modali o tool realmente separati, non come decorazione generale.

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

## Stati Visibili

Ogni dato mostrato deve rendere visibile:

- fonte;
- stato;
- confidenza quando applicabile;
- rischio o impatto;
- se è validato o solo proposto.

## Lingua E Design

- UI in italiano.
- Tono sobrio, professionale, sintetico.
- Evitare testi che spiegano ovvietà dell’interfaccia.
- Nessun testo deve uscire dai contenitori.
- Responsive desktop e mobile.
- Palette non monotematica e niente gradienti decorativi non necessari.

## Primo Slice

Il primo slice utile deve dimostrare che l’utente può entrare in un Tender e navigare tra overview, documenti, timeline, deliverable, requisiti, review e fonti usando fixture sintetiche.
