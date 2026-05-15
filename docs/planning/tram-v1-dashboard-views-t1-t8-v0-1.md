# TRAM V1 - Viste dashboard MVP collegate ai task T1-T8

Data: 2026-05-13
Stato: specifica prodotto/UX per MVP
Ambito: dashboard aggregata, dashboard Tender, viste specialistiche T1-T8, review state

## Scopo

Questo documento definisce le viste dashboard MVP di TRAM e il modo in cui si collegano ai task `T1`-`T8`.

La dashboard TRAM non deve essere un riassunto decorativo. Deve essere una superficie operativa che mostra:

- cosa sappiamo;
- da quale fonte lo sappiamo;
- quanto è affidabile;
- cosa è cambiato;
- cosa blocca l’uso interno della dashboard;
- cosa deve essere validato prima di scrivere offerte, chiarimenti/Q&A o valutazioni economiche.

## Principio

Ogni dato in dashboard deve avere:

- fonte o source reference;
- stato;
- confidenza;
- ultimo aggiornamento;
- origine: parser, regola, AI, normalizzatore o utente;
- eventuale review item collegato;
- impatto su dashboard affidabile.

Se un dato non ha fonte o stato, non entra come dato headline. Può entrare solo come nota, warning o item da chiarire.

## Non obiettivi

La dashboard MVP non deve:

- diventare una landing page;
- nascondere incertezze dietro grafici puliti;
- mostrare insight strategici cross-gara V3;
- confrontare offerte preparate, funzione V2;
- inviare domande o esportare comunicazioni senza approvazione umana;
- mostrare valori economici non validati fuori da viste evidence-first con AI/review gate;
- trasformare output AI in dati confermati.

## Architettura viste

Navigazione MVP consigliata:

```text
Dashboard aggregata
  Spazi gara
    Overview
    Documenti
    Timeline
    Deliverable
    Requisiti e KPI
    Financials
    Cost driver
    Contraddizioni
    Chiarimenti
    Review queue
    Audit
```

Le prime due viste sono obbligatorie:

1. dashboard aggregata, per confrontare i Tender;
2. overview Tender, per lavorare su una gara.

Le viste specialistiche possono arrivare in modo incrementale, ma devono essere previste nel modello fin dall’inizio.

## Dashboard aggregata

Scopo: dare una “dashboard delle dashboard” per più Tender.

### Contenuto MVP

| Blocco | Origine | Uso |
| --- | --- | --- |
| Lista Tender | `Tender` | Accesso rapido |
| Stage pacchetto | T1, procurement taxonomy | Distinguere prequalifica, ITT, ITN, BAFO, addendum |
| Stato dashboard | `DashboardValidationState` | Capire se il Tender è affidabile |
| Prossima deadline critica | T2 | Priorità operativa |
| Nuovi documenti o integrazioni | T1 | Evidenziare aggiornamenti |
| Review blocker | `ReviewItem` | Lavoro urgente |
| Chiarimenti aperti | T8 | Interazione con stazione appaltante |
| Contraddizioni critiche | T7 | Rischio interpretativo |
| Stato financials | T5 | Evitare uso improprio di dati economici non validati |
| Stato AI/provider | `AiCall`, gate | Quote, blocchi privacy, run sospese |

### Colonne consigliate

| Colonna | Tipo | Note |
| --- | --- | --- |
| Tender | text | Nome leggibile |
| Stage | badge | Prequalifica, ITT, ITN, negotiation, BAFO |
| Modalità | badge | Rail, metro, tram, bus, PPP, O&M |
| Stato dashboard | badge | Bozza, parzialmente validata, validata, da aggiornare, criticità aperte |
| Prossima scadenza | data + rischio | Da T2 |
| Nuovi documenti | count | Da T1 |
| Blocker | count | Da review queue |
| Chiarimenti | count | Da approvare o incorporare |
| Ultimo aggiornamento | datetime | Ultima ingestion o run |

### Regole

- Non confrontare come equivalenti prequalifiche e ITT completi.
- Se il Tender è prequalifica, mostrare meno indicatori O&M dettagliati e più indicatori di qualification/capability.
- Se ci sono documenti nuovi non processati, lo stato deve diventare `stale_due_to_new_docs`.
- Se ci sono blocker critici, lo stato deve diventare `open_critical_issues`.

## Overview Tender

Scopo: prima schermata operativa dentro un Tender.

### Sezioni MVP

| Sezione | Task | Contenuto |
| --- | --- | --- |
| Identità gara | T1 | Nome, authority, stage, package type, modality, lotti |
| Stato affidabilità | Review queue | Stato dashboard, blocker, review aperte |
| Timeline critica | T2 | Prossime deadline e milestone contratto |
| Network snapshot | T4/T1/T2, indicatori | Linee, km, stazioni, flotta se disponibili |
| Documenti correnti | T1 | Document family, versioni, superseded, integrazioni |
| Deliverable chiave | T3 | Submission, mandatory, scadenze, economic/technical/admin |
| Requisiti e KPI critici | T4 | Mandatory, MR, KPI formula/target, compliance |
| Financials e payment | T5 | Stato review, aree sensibili, non valori esposti di default |
| Cost driver top | T6 | Driver high/critical senza importi |
| Contraddizioni e chiarimenti | T7/T8 | Candidate critiche, chiarimenti da approvare o incorporare |
| AI e qualità dati | AiCall, data quality | Run, provider, quota, blocchi, OCR/parsing issues |

### Headline P0

Le headline P0 sono visibili sopra la piega della dashboard Tender.

| Indicatore | Origine | Stato richiesto |
| --- | --- | --- |
| Stage gara | T1 | almeno proposed, blocker se ambiguo |
| Prossima deadline critica | T2 | confirmed/corrected oppure warning |
| Stato documenti correnti | T1 resolver | no blocker critici aperti |
| Stato review | Review queue | sempre visibile |
| Contraddizioni critiche | T7 | proposed/unclear visibile come rischio |
| Chiarimenti da gestire | T8 | blocking se presentati come raccomandazione |

Network, financials e KPI possono essere P0 solo se fonti e stato sono chiari. In caso contrario entrano come “da validare”.

## Stati dashboard

TRAM usa gli stati già previsti da `DashboardValidationState`.

| Stato | Quando usarlo | UI |
| --- | --- | --- |
| `draft` | spazio caricato ma analisi incompleta | badge neutro |
| `partially_validated` | dati principali disponibili ma review aperte | badge attenzione |
| `validated_internal` | dati P0 confermati per uso interno | badge positivo |
| `stale_due_to_new_docs` | nuovi documenti o versioni non processati | badge aggiornamento |
| `open_critical_issues` | blocker critici aperti | badge critico |

La dashboard può essere consultabile anche con criticità aperte, ma non deve presentarsi come affidabile.

## Viste specialistiche

### T1 - Documenti e versioning

Scopo: dare accesso intuitivo alla documentazione caricata e al suo stato.

MVP:

- albero documenti per folder/family;
- tabella documenti con natura, ruolo, family, versione, variante, currentness;
- badge `current`, `superseded`, `duplicate`, `needs_review`, `unknown`;
- evidenza track changes, redline, addendum, clarification, query response;
- filtri per document class e privacy level;
- link alle source refs e agli estratti disponibili.

Blocchi:

- documento chiave con currentness `unknown`;
- clean copy vs track changes non risolti;
- addendum/query response non riconciliato;
- documento L2 o clausola AI/privacy non classificata.

### T2 - Timeline

Scopo: mostrare timeline gara, contratto e mobilitazione.

MVP:

- timeline compatta con milestone critiche;
- tabella eventi con date, precisione, fonte, stato;
- distinzione procurement, contract, mobilisation, clarification/update;
- filtri per criticality e review;
- warning su date relative, quarter, conflitti e fonti divergenti.

Blocchi:

- deadline submission o tender opening non confermata;
- data contrattuale critica divergente;
- milestone usata in dashboard P0 con stato `unclear`.

### T3 - Deliverable

Scopo: trasformare documenti e istruzioni in checklist operativa.

MVP:

- checklist deliverable;
- raggruppamento administrative, technical, economic/financial, PQQ/qualification, compliance;
- colonne: codice, nome, mandatory, formato, page limit, evaluation weight, deadline, fonte, stato;
- badge per deliverable economico o sensibile;
- link a requisiti, timeline e source refs.

Blocchi:

- deliverable mandatory senza fonte chiara;
- deliverable economico non classificato come sensibile;
- deadline collegata a T2 non validata;
- checklist con differenze tra documenti correnti e superati.

### T4 - Requisiti e KPI

Scopo: mappare requisiti O&M e KPI non finanziari in modo filtrabile.

MVP:

- tabella requisiti;
- tabella KPI;
- filtri per O&M domain, mandatory, impact tag, review, source document;
- vista cluster per operations, maintenance, workforce, safety/security, customer, compliance;
- evidenza formule, target, soglie e escalation T5.

Blocchi:

- mandatory requirement non validato;
- KPI con formula/target non validato;
- KPI con financial escalation non passato a T5/review;
- requisito compliance o safety/security ad alto rischio non validato.

### T5 - Financials e payment

Scopo: mostrare stato e struttura dei contenuti economici senza esporre impropriamente valori sensibili.

MVP:

- vista evidence-first con AI/data policy gate;
- elenco financial item per classe: pricing workbook, payment mechanism, guarantee, penalty, indexation, tax, insurance, energy;
- source document, sheet/section, cell reference se disponibile;
- stato parsing locale;
- stato analisi AI quando ammessa;
- stato review;
- link a cost driver e KPI collegati.

Blocchi:

- payment mechanism non processato;
- workbook economico presente ma non classificato;
- financial item usato da T6 senza review;
- provider esterno proposto su L2 senza approvazione esplicita.

Regola UI: di default non mostrare valori economici in overview o dashboard aggregata. Mostrare stato, classe e rischio.

### T6 - Cost driver

Scopo: mostrare cosa genera costo o rischio operativo, senza stimare l’offerta.

MVP:

- matrice cost driver per dominio O&M;
- driver family, risk level, cost confidence, review state;
- link a requisiti, deliverable, KPI e financial item;
- filtri high/critical, financial-linked, workforce, mobilisation, maintenance, reporting;
- vista “top driver da validare”.

Blocchi:

- driver financial-linked non validato;
- driver high/critical usato in overview senza review;
- driver con fonte L2 ma classificato come inviabile a provider esterno;
- driver collegato a KPI/penali senza T5 review.

### T7 - Contraddizioni

Scopo: rendere visibili candidate contradictions, ambiguità e missing evidence.

MVP:

- tabella candidate issues;
- issue type, severity, recommended action, review state;
- fonti coinvolte affiancate;
- distinzione contradiction, ambiguity, missing document, parser issue, version conflict;
- azione “crea thread di chiarimento” solo da review o candidato plausibile.

Blocchi:

- issue high/critical non reviewata;
- contraddizione usata per chiarimento senza validazione;
- version conflict su documento corrente;
- date mismatch su deadline critica.

### T8 - Chiarimenti/Q&A

Scopo: gestire thread di chiarimento tra bidder e stazione appaltante in modalità human-first.

MVP:

- lista chiarimenti;
- subject, status, linked contradiction, source refs, tone, approvazione, risposta ente;
- stati: candidate, draft_question, under_review, approved_for_export, sent_to_authority, answered, incorporated, dismissed, blocked_sensitive;
- editor leggero per modifica umana e registrazione risposta;
- export manuale, non invio automatico.

Blocchi:

- chiarimento mostrato come raccomandato ma non approvato;
- chiarimento con status `blocked_sensitive`;
- chiarimento con fatti non citabili;
- chiarimento che include strategia interna o dati non destinati alla stazione appaltante;
- risposta ricevuta non incorporata ma rilevante per dashboard, timeline o deliverable.

## View trasversale Review queue

La review queue resta la vista operativa centrale.

MVP:

- ordinamento critical-first;
- filtri per famiglia;
- filtri per blocking;
- apertura fonte;
- azioni conferma, correggi, contesta, da chiarire, superato, non applicabile;
- creazione thread di chiarimento da item ammesso.

La dashboard deve sempre mostrare un link contestuale alla review queue filtrata.

Esempi:

- dalla card “KPI critici” aprire review queue filtrata `family=KPI`, `blocking=true`;
- dalla timeline aprire review queue filtrata `family=timeline`;
- da T7 aprire review queue filtrata `family=contradictions`, `risk_class=critical/high`.

## View trasversale Audit e AI

Scopo: rendere visibile cosa ha fatto TRAM e perché.

MVP:

- run ingestion/parsing;
- run AI;
- provider, modello, prompt/schema version;
- stato quota/costo;
- blocked privacy/cost/clause;
- normalizer warnings;
- dropped fields;
- reviewer actions.

Questa vista può essere tecnica e minimale nella prima MVP, ma deve esistere almeno come pagina o pannello per debugging e fiducia interna.

## Regole responsive e UI

MVP desktop-first, ma non rotto su mobile.

Regole:

- dashboard aggregata e overview: card compatte + tabelle;
- viste specialistiche: tabelle dense con filtri;
- detail drawer o pagina dettaglio per source refs;
- non usare card dentro card;
- non usare hero o layout marketing;
- badge chiari per stato, rischio e privacy;
- ogni valore headline deve avere link alla fonte o alla review.

## Empty states

Gli stati vuoti devono essere operativi, non descrittivi.

| Caso | Stato UI |
| --- | --- |
| Nessun documento caricato | CTA caricamento pacchetto |
| Documenti caricati ma non processati | stato job e azione avvia parsing |
| Parsing fallito | errori per file e azione retry |
| AI bloccata per quota | stato sospeso, nessun fallback paid |
| AI bloccata per privacy | parsing locale/review, nessun invio esterno |
| Nessuna contraddizione trovata | mostra metodo e ultimo run, non “tutto ok” assoluto |
| Nessun chiarimento aperto | mostra “nessun chiarimento aperto”, non suggerire invio |

## Mappa task-view

| Task | Vista primaria | Viste secondarie |
| --- | --- | --- |
| `T1` | Documenti | Overview, dashboard aggregata, audit |
| `T2` | Timeline | Overview, review queue |
| `T3` | Deliverable | Overview, timeline, review queue |
| `T4` | Requisiti e KPI | Overview, cost driver, financials |
| `T5` | Financials | Cost driver, review queue |
| `T6` | Cost driver | Overview, requisiti/KPI, financials |
| `T7` | Contraddizioni | Overview, chiarimenti, review queue |
| `T8` | Chiarimenti | Overview, review queue, audit |

## Dati P0 MVP

Il primo MVP deve supportare almeno questi indicatori P0:

| Area | Indicatori P0 |
| --- | --- |
| Spazio | nome gara, stage, package type, modalità, lotti |
| Documenti | documenti totali, documenti correnti, documenti da review, nuovi documenti |
| Timeline | prossima deadline, data submission, avvio contratto/servizio se disponibile |
| Deliverable | deliverable mandatory, deliverable da review, deliverable economici |
| Requisiti/KPI | mandatory high-risk, KPI formula/target, compliance critical |
| Financials | stato parsing, financial item da review, payment/penalty presence |
| Cost driver | driver high/critical, financial-linked driver |
| Contraddizioni | issue high/critical, issue da chiarimento |
| Chiarimenti | bozza da approvare, risposta da incorporare, blocked sensitive |
| Qualità | blocker dashboard, parsing failures, AI quota/policy blocks |

## Criteri di accettazione MVP

La dashboard MVP passa se:

- la dashboard aggregata distingue prequalifica e ITT;
- lo Tender mostra stato dashboard e blocker;
- ogni headline apre fonte o review item;
- T1 mostra currentness/versioning e documenti da review;
- T2 mostra deadline critiche con stato;
- T3 mostra checklist deliverable con mandatory e fonte;
- T4 mostra requisiti/KPI filtrabili e review gate;
- T5 non espone valori economici in overview;
- T6 mostra cost driver senza inventare importi;
- T7 mostra candidate, non verità;
- T8 non mostra chiarimenti come approvati senza azione utente;
- i nuovi documenti rendono lo spazio `stale_due_to_new_docs`;
- gli item critici aperti rendono lo spazio `open_critical_issues`.

## Debiti

- Definire naming delle route UI.
- Definire mock wireframe desktop per dashboard aggregata e overview Tender.
- Decidere se export PDF/Excel entra in MVP o resta post-MVP.
- Collegare i wireframe al registro `indicator_key` e alla matrice ruoli/permessi.

## Prossimo passo consigliato

Preparare wireframe funzionali desktop/mobile del primo slice UI usando il registro `indicator_key`, i ruoli MVP e il workflow ingestion-dashboard.
