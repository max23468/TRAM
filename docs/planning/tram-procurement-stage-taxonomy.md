# Tassonomia fasi procurement per TRAM

Data: 2026-05-12
Stato: bozza da validare sui pacchetti Dublin Luas, Copenhagen, Milano e Dublin MetroLink

## Perché serve

TRAM non deve classificare i pacchetti solo in base alla quantità di informazioni contenute. Deve riconoscere la fase procedurale del pacchetto, perché ogni fase risponde a domande diverse e ha un diverso valore per l’analisi O&M.

## Fonti consultate

- Commissione europea, Your Europe, public tendering rules: nelle procedure ristrette chiunque può chiedere di partecipare, ma solo i soggetti preselezionati possono presentare un’offerta.
- EUR-Lex, Direttiva 2014/24/UE, articolo 28: nella procedura ristretta gli operatori economici possono presentare request to participate; solo quelli invitati dopo valutazione possono presentare tender.
- GOV.UK, Procurement Act 2023 guidance: nella procedura aperta il tender notice può essere l’invitation to tender; nelle procedure competitive flessibili può prima invitare a una request to participate o direttamente a presentare tender.
- GOV.UK, Procurement Act 2023 guidance: quando una procedura prevede negoziazione, il tender notice deve indicare l’intenzione di negoziare e gli elementi aperti alla negoziazione.
- UK Government Commercial Function, Sourcing Playbook guidance su competitive dialogue e competitive procedure with negotiation: utile per distinguere tender iniziali, negoziazioni e documenti finali.
- GOV.UK, Standard Selection Questionnaire: lo SQ ha sostituito il precedente PQQ in parte del contesto UK.
- Thurrock Council procurement process: il PSQ è usato all’inizio per verificare requisiti minimi e creare la shortlist per l’ITT.
- Capital Works Management Framework irlandese: l’Invitation to Tender include lettera di invito e istruzioni ai tenderer, utile come riferimento per il caso Luas/Irlanda.

## Classi iniziali

### 1. Avviso preliminare o market engagement

Esempi:

- prior information notice;
- market sounding;
- preliminary market engagement;
- request for information.

Valore per TRAM:

- contesto;
- perimetro atteso;
- calendario preliminare;
- segnali di mercato;
- possibili futuri requisiti.

Limite:

- non va trattato come fonte definitiva per requisiti, deliverable o obblighi contrattuali.

### 2. Prequalifica o selezione

Esempi:

- PQQ, termine storico o ancora usato in alcuni contesti;
- SQ, selection questionnaire;
- PSQ, procurement specific questionnaire;
- request to participate;
- expression of interest, quando usata come selezione formale.

Valore per TRAM:

- requisiti di partecipazione;
- criteri di selezione;
- capacità richieste;
- esperienza minima;
- requisiti finanziari, assicurativi, H&S, qualità, compliance;
- struttura iniziale del contratto, se indicata.

Limite:

- di solito non basta per mappare in modo completo requisiti O&M, costi, deliverable e obblighi contrattuali.

### 3. ITT o tender pack

Esempi:

- Invitation to Tender;
- tender documents;
- tender pack;
- request for tender;
- request for proposal, se usata nel contesto specifico;
- draft contract e schedules;
- specification, output requirements, performance regime, payment mechanism.

Valore per TRAM:

- riferimento principale per l’analisi V1;
- requisiti operativi;
- deliverable;
- timeline di gara e contratto;
- obblighi contrattuali;
- criteri di aggiudicazione;
- specifiche tecniche;
- rischi e attività che generano costi.

Limite:

- non è necessariamente l’ultima verità: chiarimenti, addendum e versioni successive possono modificarlo.

### 4. Fasi negoziali o iterative

Esempi:

- competitive procedure with negotiation;
- competitive dialogue;
- invitation to negotiate, ITN;
- initial tender;
- revised tender;
- final tender;
- BAFO, best and final offer.

Valore per TRAM:

- gestione evolutiva del contenuto;
- confronto tra versioni;
- individuazione di modifiche a requisiti, allocazione rischi, pricing e performance regime.

Limite:

- richiede una timeline documentale molto chiara, altrimenti TRAM rischia di mostrare regole superate come ancora valide.

Nota per i benchmark:

- il pacchetto Luas contiene una `Invitation to Negotiate`, quindi va trattato provvisoriamente come pacchetto tender in fase negoziale, non come semplice ITT statico;
- il pacchetto Copenhagen contiene `Instructions to Tender`, condizioni contrattuali e specifiche, quindi va trattato provvisoriamente come tender pack/ITT con gestione versioni;
- il pacchetto Milano lotti extraurbani contiene disciplinare, schema di contratto, allegati tecnici, PEF e modelli di offerta, quindi va trattato provvisoriamente come ITT bus extraurbano O&M multi-lotto;
- il pacchetto Dublin MetroLink PPP contiene `Pre-Qualification Pack`, Qualification Envelope, Technical Envelope e form di risposta, quindi va trattato provvisoriamente come prequalifica PPP/PQP.

### 5. Addendum, chiarimenti e Q&A

Esempi:

- clarification responses;
- bidder questions and answers;
- corrigendum;
- addendum;
- revised schedules;
- updated draft contract.

Valore per TRAM:

- hanno valore applicativo pari alla documentazione di gara quando sono pubblicati o confermati dall’ente;
- aggiornano la vista corrente della gara;
- possono modificare requisiti e obblighi;
- possono introdurre contraddizioni o risolverle;
- possono generare chiarimenti ulteriori da inviare alla stazione appaltante.

Limite:

- devono essere collegati al punto documentale che modificano, non solo archiviati come documenti separati.

## Implicazione per il data model

Ogni pacchetto o documento dovrebbe avere almeno:

- `procurement_stage`: avviso, selezione, ITT, ITN, negoziazione, addendum, chiarimento, contratto, altro;
- `procedure_type`: aperta, ristretta, negoziata, dialogo competitivo, competitiva flessibile, non chiara;
- `document_role`: specifica, contratto, schedule, questionario, chiarimento, allegato tecnico, modello economico, istruzioni ai bidder;
- `effective_status`: corrente, superato, integrato, sostituito, dubbio;
- `supersedes` e `superseded_by`, quando una versione ne modifica un’altra;
- riferimenti alla fonte e alla data.

## Implicazione per l’MVP

Per la V1 TRAM deve almeno:

- classificare il pacchetto in fase procedurale;
- non aspettarsi lo stesso livello di estrazione da prequalifica e ITT;
- segnalare quando un requisito deriva da una fonte preliminare o non definitiva;
- trattare addendum e chiarimenti come aggiornamenti della conoscenza della gara;
- mostrare sempre la fonte e lo stato di validità di ogni dato estratto.
