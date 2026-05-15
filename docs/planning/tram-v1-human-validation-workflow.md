# TRAM V1 - Workflow validazione umana

Data: 2026-05-12
Stato: proposta operativa per test con i primi utenti
Utenti iniziali: 3, cioè l’utente e due colleghi

## Decisione proposta

Per il primo MVP, TRAM dovrebbe usare un modello **critical-first**:

- validazione obbligatoria per dati e output ad alto impatto;
- validazione a campione per dati a basso rischio;
- nessun invio esterno o consolidamento definitivo senza gate umano;
- possibilità per l’utente di correggere, confermare, rigettare o segnare un dato come da chiarire.

Questa è la scelta consigliata perché evita due estremi:

- validare tutto, che sarebbe lento e rischierebbe di far percepire TRAM come un’altra checklist manuale;
- validare quasi nulla, che sarebbe troppo rischioso su documenti di gara, requisiti, payment mechanism, contraddizioni e chiarimenti/Q&A.

## Stati del dato

Ogni dato strutturato in TRAM deve avere uno stato.

| Stato | Significato | Chi può assegnarlo |
| --- | --- | --- |
| Estratto | Dato letto da parser o AI, non ancora valutato | Sistema |
| Proposto | Dato normalizzato e pronto per revisione | Sistema o AI |
| Confermato | Dato validato da utente o da regola affidabile | Utente o regola approvata |
| Corretto | Dato modificato dall’utente rispetto alla proposta | Utente |
| Contestato | Dato ritenuto potenzialmente errato | Utente o AI |
| Da chiarire | Dato ambiguo che richiede chiarimento/Q&A | Utente o AI |
| Superato | Dato sostituito da versione, addendum o chiarimento successivo | Sistema, AI o utente |
| Non applicabile | Dato non rilevante per quel pacchetto | Utente o regola |

## Classi di rischio

| Classe | Descrizione | Esempi | Validazione |
| --- | --- | --- | --- |
| Critico | Può impattare offerta, compliance, costi, chiarimenti/Q&A o decisioni | payment mechanism, penali, KPI formula, requisiti MR, contraddizioni, chiarimenti da inviare | Obbligatoria |
| Alto | Può impattare dashboard, cost drivers o pianificazione | durata contratto, mobilizzazione, staff transfer, reporting obligations, asset condition | Obbligatoria o campione alto |
| Medio | Utile per analisi ma meno pericoloso se provvisorio | document role, customer metrics, asset taxonomy, general requirements | Campione e correzioni mirate |
| Basso | Tecnico o descrittivo, facilmente verificabile | dimensione file, numero pagine, formato, hash | Nessuna validazione manuale salvo anomaly alert |

## Cosa validare sempre

Nella prima prova con Copenhagen e Luas, validare sempre:

- fase procurement e stato del pacchetto;
- documento corrente quando esistono versioni o track changes;
- timeline di gara e deadline critiche;
- timeline contratto, durata, opzioni e Start of Operation;
- requisiti minimi o requisiti espressi come mandatory;
- deliverable valutativi e limiti formali;
- KPI con formula, target, soglie, bonus/malus o penali;
- financials, payment mechanism, workbook prezzi e currency;
- cost drivers ad alto impatto;
- risk allocation e claims notice;
- compliance safety, cyber, data protection, sanctions, environmental e AI clause;
- contraddizioni candidate;
- chiarimenti/Q&A verso la stazione appaltante.

## Cosa validare a campione

Validare a campione:

- definizioni non critiche;
- document role chiari;
- asset class ricorrenti;
- general requirements senza impatto immediato;
- customer/passenger experience metrics;
- reporting ordinario senza penali evidenti;
- campi dashboard descrittivi.

Nel primo ciclo suggerisco un campionamento del 20-30% dei dati non critici. Se la qualità dell’estrazione è bassa, si torna a validazione più ampia.

## Cosa non validare manualmente di default

Non serve validazione manuale ordinaria per:

- formato file;
- dimensione file;
- hash;
- numero pagine;
- path locale;
- data di ingestione;
- tipo estrattore usato;
- esito tecnico OCR, salvo warning.

Questi dati restano comunque auditabili.

## Workflow utente

### 1. Review dashboard

L’utente apre lo Tender e vede:

- summary del pacchetto;
- indicatori P0;
- stato estrazione;
- alert;
- elementi che richiedono review.

### 2. Review queue

TRAM crea una coda di validazione ordinata per priorità:

1. chiarimenti/Q&A e contraddizioni;
2. financials e payment;
3. KPI e penali;
4. requisiti critici;
5. timeline e versioning;
6. altri dati.

### 3. Azioni disponibili

Per ogni item, l’utente può:

- confermare;
- correggere;
- contestare;
- segnare come da chiarire;
- collegare a un documento/versione diversa;
- chiedere a TRAM di cercare evidenze ulteriori;
- generare o rigenerare un thread di chiarimento.

### 4. Audit

Ogni azione deve salvare:

- utente;
- data e ora;
- valore precedente;
- valore nuovo;
- motivo, se inserito;
- fonte collegata;
- eventuale prompt/versione AI se il dato viene rigenerato.

## Regola chiarimenti/Q&A

Nessuna domanda o chiarimento deve essere inviato automaticamente.

TRAM può:

- proporre il testo della domanda;
- citare fonti e passaggi;
- indicare perché la questione è rilevante;
- proporre tono e livello di formalità;
- registrare una risposta ricevuta dalla stazione appaltante;
- esportare una bozza.

L’utente deve approvare sempre testo, destinatario e invio.

## Regola apprendimento

Nel primo MVP, il feedback utente deve migliorare:

- stato del dato nel Tender;
- glossario e mapping del pacchetto;
- esempi di correzione;
- prompt o regole future, solo se approvate.

Non deve ancora creare apprendimento automatico globale non revisionato.

## Metriche di qualità del workflow

Durante il test con i primi tre utenti, misurare:

- percentuale di indicatori P0 estratti correttamente;
- numero di correzioni per famiglia di dato;
- falsi positivi nelle contraddizioni;
- falsi negativi scoperti manualmente;
- tempo medio di review per spazio;
- numero di chiarimenti utili;
- dati rimasti da chiarire;
- fiducia percepita dagli utenti.

## Decisione provvisoria

La validazione critical-first diventa il modello operativo consigliato per la V1.

Si potrà ridurre la validazione manuale solo dopo aver misurato Copenhagen e Luas e aver capito dove la pipeline è affidabile.

## Prossimo passo consigliato

Disegnare la prima review queue della dashboard TRAM:

- quali item entrano in coda;
- come sono ordinati;
- quali azioni ha l’utente;
- quali stati vengono mostrati;
- quali elementi bloccano la pubblicazione della dashboard interna.

La proposta di design è documentata in:

- `/Users/Matteo/Documents/TRAM/docs/planning/tram-v1-review-queue-design.md`
