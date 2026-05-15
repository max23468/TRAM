# TRAM V1 - Design review queue

Data: 2026-05-12
Stato: proposta di prodotto per MVP
Collegato a: workflow validazione critical-first

## Scopo

La review queue è la schermata in cui l’utente valida, corregge o rigetta gli output proposti da TRAM.

Serve a trasformare l’AI da “risposta magica” a sistema controllabile:

- TRAM propone dati, alert, contraddizioni e chiarimenti/Q&A;
- l’utente vede perché qualcosa richiede attenzione;
- ogni decisione viene salvata;
- la dashboard mostra chiaramente cosa è confermato e cosa resta provvisorio.

## Principio UX

La review queue deve essere una coda unica ordinata per priorità, con filtri per famiglia.

Motivo: l’utente non deve cercare manualmente cosa validare. TRAM deve portare in alto le cose più rischiose o più urgenti.

Vista consigliata:

```text
Spazio gara
  Dashboard
  Documenti
  Review queue
    Tutti
    Critici
    Financials
    KPI
    Requisiti
    Timeline
    Contraddizioni
    Chiarimenti
    Versioni
  Output
  Audit
```

## Item della queue

Ogni elemento della review queue deve rappresentare una singola decisione validabile.

Esempi:

- “Confermare che il pacchetto è ITT post-prequalifica in procedura negoziata”.
- “Validare la deadline first revised tender 2026-05-15”.
- “Verificare mismatch 43 km track vs 40 km double track”.
- “Validare formula Service Availability”.
- “Confermare bozza di chiarimento su riferimento Regulation (EU) 2026/2338”.
- “Decidere se Conditions of Contract v2.0 supera comparison v1.0”.

## Campi minimi item

| Campo | Descrizione | Obbligatorio |
| --- | --- | --- |
| `item_id` | Identificativo stabile | Sì |
| `tender_id` | Gara/spazio | Sì |
| `family` | Financials, KPI, Requisiti, Timeline, Versioning, Contraddizioni, Chiarimenti, Document map, Compliance, Altro | Sì |
| `title` | Titolo breve dell’item | Sì |
| `summary` | Sintesi leggibile | Sì |
| `proposed_value` | Valore proposto da parser, regola o AI | Sì, se applicabile |
| `source_references` | Documento, pagina, sezione, estratto o cella | Sì |
| `risk_class` | Critico, Alto, Medio, Basso | Sì |
| `confidence` | Alta, media, bassa, non calcolabile | Sì |
| `automation_source` | Deterministico, rule-based, AI-assisted extraction, AI-assisted reasoning, human-only | Sì |
| `status` | Proposto, confermato, corretto, contestato, da chiarire, superato, non applicabile | Sì |
| `blocking` | Se blocca dashboard, report, chiarimento o dato consolidato | Sì |
| `assignee` | Utente responsabile, se previsto | No in primissima MVP |
| `due_date` | Scadenza review, se collegata a deadline gara | No, ma utile |
| `audit_history` | Decisioni precedenti | Sì nel data model, anche se UI minimale |

## Priorità ordinamento

La coda deve ordinare gli item con questa logica:

1. chiarimenti da approvare o incorporare;
2. contraddizioni candidate critiche;
3. financials, payment mechanism, penalties, guarantees;
4. KPI con formule, target, bonus/malus;
5. requisiti minimi, mandatory o high-risk;
6. timeline e versioning che possono cambiare stato della gara;
7. compliance safety, cyber, data, sanctions, environmental, AI clause;
8. cost drivers ad alto impatto;
9. document map ambiguo;
10. campioni di dati medi o bassi.

La review queue non deve essere ordinata solo per data di creazione. Il rischio viene prima.

## Filtri e viste

### Filtri essenziali

- rischio: Critico, Alto, Medio, Basso;
- stato: Proposto, Da chiarire, Contestato, Confermato, Superato;
- famiglia;
- fonte automazione: parser/regola/AI;
- blocking: sì/no;
- documento sorgente;
- deadline collegata.

### Viste predefinite

| Vista | Contenuto | Uso |
| --- | --- | --- |
| Da fare oggi | Item critici o collegati a deadline vicine | Lavoro operativo |
| Blocca dashboard | Item senza cui la dashboard sarebbe fuorviante | Pubblicazione interna |
| Chiarimenti e contraddizioni | Candidate issues e thread di chiarimento | Interazione con stazione appaltante |
| Financials e KPI | Payment, pricing, KPI, bonus/malus | Review economica |
| Versioni e timeline | Addendum, track changes, date | Aggiornamento panoramica |
| Campionamento | Dati medi/bassi selezionati per controllo qualità | Quality assurance |

## Azioni utente

| Azione | Effetto | Note |
| --- | --- | --- |
| Conferma | Stato `Confermato` | Salva utente e timestamp |
| Correggi | Stato `Corretto` e nuovo valore | Richiede nota o motivo per dati critici |
| Contesta | Stato `Contestato` | Mantiene valore proposto come evidenza |
| Da chiarire | Stato `Da chiarire` | Può generare thread di chiarimento |
| Non applicabile | Stato `Non applicabile` | Utile per campi standard assenti |
| Superato | Stato `Superato` | Richiede fonte/versione che supera il dato |
| Chiedi più evidenze | Avvia ricerca su documenti collegati | AI-assisted o parser search |
| Rigenera proposta | Crea nuova proposta con prompt/versione registrata | Non cancella precedente |
| Crea chiarimento | Genera thread di chiarimento citato | Sempre gate umano |
| Apri fonte | Apre documento o estratto | Essenziale per fiducia |

## Stati e transizioni

Transizioni consigliate:

```text
Estratto -> Proposto -> Confermato
Estratto -> Proposto -> Corretto
Estratto -> Proposto -> Contestato
Estratto -> Proposto -> Da chiarire -> Chiarimento
Estratto -> Proposto -> Superato
Estratto -> Non applicabile
Contestato -> Corretto
Contestato -> Confermato
Da chiarire -> Confermato
Da chiarire -> Chiarimento -> Approvato per export
```

Nella V1 non serve una macchina a stati complessa, ma le transizioni devono essere tracciate.

## Blocker dashboard

Un item deve bloccare la pubblicazione o lo stato “dashboard affidabile” quando:

- riguarda fase procurement o stato del pacchetto;
- riguarda una deadline critica;
- riguarda un documento corrente vs superato;
- riguarda payment mechanism, penali o KPI economici;
- riguarda una contraddizione critica non risolta;
- riguarda un chiarimento non ancora approvato ma presentato come raccomandazione;
- riguarda un dato visualizzato come headline nella dashboard.

La dashboard può comunque essere visibile, ma con stato:

- `Bozza`;
- `Parzialmente validata`;
- `Validata per uso interno`;
- `Da aggiornare per nuova documentazione`;
- `Contiene criticità aperte`.

## Design della card item

Ogni card o riga della review queue dovrebbe mostrare:

- titolo;
- famiglia;
- rischio;
- stato;
- valore proposto;
- breve motivazione;
- fonte principale;
- confidenza;
- azioni rapide: conferma, correggi, contesta, apri fonte;
- indicatore blocker, se applicabile.

Non deve mostrare lunghi testi nella lista. Il dettaglio si apre in un pannello laterale o pagina item.

## Dettaglio item

Il dettaglio deve contenere:

- proposta completa;
- fonti e passaggi citati;
- eventuali fonti in conflitto;
- reasoning sintetico dell’AI, se usato;
- storico azioni;
- commenti utente;
- documenti collegati;
- impatto su dashboard, chiarimenti, KPI, financials o requisiti;
- azioni avanzate.

## Esempio Copenhagen

| Item | Famiglia | Rischio | Stato iniziale | Blocking |
| --- | --- | --- | --- | --- |
| Classificazione: ITT post-prequalifica, procedura negoziata | Document map | Alto | Proposto | Sì |
| Deadline first revised tender 2026-05-15 | Timeline | Critico | Proposto | Sì |
| Mismatch 43 km track vs 40 km double track | Contraddizioni | Medio | Da chiarire | No |
| Regulation (EU) 2026/2338 vs 2016/2338 | Contraddizioni | Alto | Da chiarire | Sì se usata in chiarimento |
| Service Availability formula | KPI | Critico | Proposto | Sì |
| Schedule of Prices structure M1/M2 vs M3/M4 | Financials | Alto | Proposto | Sì |
| AI clause da analizzare | Compliance | Alto | Proposto | No, ma blocca uso AI esterno se restrittiva |
| Chiarimento su riferimento normativo | Chiarimenti | Critico | Proposto | Sì |

## Criteri MVP UI

Per la prima MVP bastano:

- lista ordinata;
- filtri essenziali;
- dettaglio item;
- azioni conferma/correzione/contesta/da chiarire;
- apertura fonte;
- audit minimo;
- stato dashboard derivato dagli item blocking.

Non servono subito:

- assegnazioni complesse;
- workflow approvativo multilivello;
- notifiche automatiche avanzate;
- SLA di review;
- commenti threaded;
- permessi granulari per singolo item.

## Dipendenze dati

La review queue richiede almeno queste entità:

- `ReviewItem`;
- `SourceReference`;
- `ValidationAction`;
- `UserComment`;
- `DashboardValidationState`;
- collegamento a `Document`, `DocumentVersion`, `Requirement`, `KPI`, `TenderDeliverable`, `CostDriver`, `ContradictionCandidate`, `ClarificationDraft`.

Il data model minimo è documentato in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-data-model.md`

Le viste dashboard MVP che consumano la review queue sono documentate in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-dashboard-views-t1-t8-v0-1.md`

## Verifiche di accettazione

Nel test con Copenhagen, la review queue deve permettere di:

- vedere tutti gli item critici in cima;
- aprire la fonte di un dato;
- confermare una deadline;
- correggere un valore di network;
- segnare una contraddizione come da chiarire;
- generare un thread di chiarimento;
- vedere che un chiarimento non approvato resta bloccante;
- vedere lo stato dashboard passare da `Bozza` a `Parzialmente validata`;
- recuperare nello storico chi ha validato cosa.

## Rischi

- Se ci sono troppi item, l’utente abbandona la review.
- Se ci sono pochi item, TRAM rischia di nascondere incertezze importanti.
- Se la fonte non è accessibile subito, l’utente non si fida.
- Se gli item blocking sono troppi, la dashboard resta sempre in bozza.

Mitigazione MVP:

- mostrare solo item critici e campione medio/basso nella queue iniziale;
- consentire filtri rapidi;
- dare sempre accesso alla fonte;
- permettere dashboard visibile ma chiaramente marcata come non completamente validata.

## Prossimo passo consigliato

Usare il registro `indicator_key` per costruire fixture di review queue: almeno un item T1 versioning, uno T2 timeline, uno T3 deliverable, uno T5 financials e uno T7 contradiction.
