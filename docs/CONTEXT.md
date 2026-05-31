# TRAM - Context

TRAM è una web app interna per analizzare, mappare e monitorare documenti di gara relativi al trasporto pubblico locale, con focus O&M.

## Stato progetto

- Fase: MVP iniziale con app locale Next.js e documentazione governante consolidata.
- Versione/release: SemVer `0.x` con `package.json` come fonte versione; release
  distinta da deploy secondo `docs/decisions/0003-versioning-release-policy.md`.
- Deploy corrente: nessun target deploy approvato. Questa è un'eccezione
  motivata ma temporanea: non inventare deploy prima di target, runbook,
  ambiente e verifica post-deploy.
- Pubblicazione proporzionata: docs-only/governance-only richiede review
  documentale, link/coerenza e controllo naming, senza smoke, deploy o release.
- Decisioni: `docs/DECISIONS.md`, `docs/DECISIONS_PENDING.md` e ADR in
  `docs/decisions/`.

## Fonti primarie e handoff

- Regole operative: `AGENTS.md`.
- Indice documentale: `docs/INDEX.md`.
- Roadmap e backlog: `docs/ROADMAP.md`, `docs/BACKLOG.md`.
- Toolchain e operations: `docs/TOOLCHAIN.md`, `docs/OPERATIONS.md`.
- Architettura e AI pipeline: `docs/ARCHITECTURE.md`,
  `docs/AI_AND_DOCUMENT_PIPELINE.md`.

## Obiettivo

La V1 deve aiutare chi analizza documentazione di gara e prepara offerte tecniche, economiche e amministrative a trasformare pacchetti documentali complessi in una panoramica chiara, aggiornata, verificabile e criticamente utile.

Un Tender è il contenitore operativo di una gara o fase di gara e include documenti, versioni, integrazioni, dashboard, estrazioni, timeline, requisiti, definizioni, deliverable, cost driver, contraddizioni candidate, chiarimenti/Q&A e stato della review.

La promessa V1 non è “leggere tutto al posto dell’utente”, ma ridurre il costo cognitivo iniziale: far emergere struttura, priorità, rischi e punti da validare in modo standardizzato. L’esperienza deve partire da una dashboard direzionale e da una mappa documentale, non da una chat libera.

## Cosa TRAM Non È

TRAM non è:

- una chat generica con i documenti;
- un sostituto del giudizio tecnico, economico, legale o strategico;
- un sistema che invia chiarimenti senza approvazione umana;
- un legal advisor o financial advisor automatico;
- un document management system generalista;
- uno storage permanente indiscriminato di documenti riservati;
- una piattaforma enterprise multi-tenant completa;
- un motore AI autonomo che decide cosa è vero;
- uno strumento che prepara automaticamente l’offerta completa nella V1;
- un sistema di benchmark cross-gara e best practice storiche nella V1.

## Fasi Prodotto

- **V1**: Tender, document map, ingestion, parsing, AI gratuita controllata, estrazioni evidence-first, review queue, dashboard gara, dashboard aggregata, versioning e integrazioni documentali.
- **V2**: confronto dell’offerta preparata con la documentazione di gara.
- **V3**: relazione tra gare, offerte, feedback e best practice storiche per suggerimenti trasversali.

Le funzioni V2/V3 possono essere predisposte solo se non complicano la V1 e se restano documentate come future.

## Funzioni V1 Candidate

La V1 deve coprire progressivamente:

- creazione e gestione di Tender condivisi;
- caricamento controllato di pacchetti documentali;
- inventario file e document map con famiglia, versione, stato, fonte e rilevanza;
- riconoscimento di procurement stage, addendum, chiarimenti/Q&A e documenti sostituiti;
- timeline gara con scadenze, dipendenze, eventi, timezone e incertezze;
- deliverable richiesti, formati, limiti, obbligatorietà, responsabilità e deadline;
- requisiti O&M, KPI, performance regime, safety, customer experience e clausole operative;
- financials, pricing structure, payment mechanism, penali, incentivi e pass-through;
- cost driver e assunzioni operative rilevanti per l’offerta;
- contraddizioni candidate e punti da chiarire;
- thread di chiarimento/Q&A con bozza assistita ma approvazione umana;
- dashboard gara e dashboard aggregata;
- review queue critica, audit e stato validazione;
- esportazioni controllate solo quando fonte, stato e responsabilità sono chiari.

## Principi

TRAM privilegia:

- schematicità;
- standardizzazione;
- rappresentazioni grafiche;
- minimalismo;
- sintesi;
- modernità;
- approccio critico;
- tracciabilità delle fonti;
- aggiornamento continuo rispetto a versioni, chiarimenti/Q&A e addendum.

## Dominio

TRAM lavora su gare TPL/O&M. Quando si definiscono tassonomie, procurement stage, KPI, payment mechanism, cost driver o regole gara, le decisioni devono essere sostenute da fonti autorevoli e aggiornate, non solo da assunzioni interne.

Distinguere sempre prequalifica, ITT, ITN, negotiation, revised tender, BAFO, addendum e chiarimenti. La differenza non va ridotta a “prequalifica incompleta, ITT completa”.

### Fonti E Metodo

Le tassonomie di dominio devono usare fonti ufficiali e aggiornate quando disponibili: autorità pubbliche, documentazione procurement, enti TPL, UITP, FTA, audit pubblici, toolkit PPP/O&M, capitolati reali e documentazione istituzionale equivalente. Le fonti vanno usate per chiarire significato, varianti e limiti di applicazione, non per introdurre automaticamente uno standard globale dentro ogni gara.

Quando le fonti o i documenti gara sono ambigui, TRAM deve conservare l’ambiguità come stato operativo: `da verificare`, `contestato`, `da chiarire` o `non applicabile`, invece di forzare un valore unico.

### Procurement Stage

TRAM deve modellare almeno queste classi:

- avviso preliminare, market engagement e documenti informativi;
- prequalifica, request to participate, selezione candidati e shortlisting;
- ITT, tender pack, request for proposal o documentazione di gara completa;
- fasi negoziali, revised tender, best and final offer e submission iterativa;
- addendum, corrigenda, clarification notice e Q&A;
- award, standstill, contract close, mobilisation e handover quando presenti.

Lo stage influenza cosa ci si può aspettare dai documenti: completezza dei requisiti, maturità del pricing, stabilità del risk allocation, disponibilità di allegati, presenza di Q&A e forza vincolante. Non deve essere trattato come semplice etichetta descrittiva.

## Benchmark Package

I pacchetti in `data/packages/` sono input applicativi benchmark, non documentazione generica. Sono stati usati per rappresentare archetipi diversi:

- Copenhagen M1-M4 come pacchetto O&M maturo e strutturato;
- Dublin Luas O&M come pacchetto operativo utile per timeline, deliverable e requisiti;
- Milano lotti extraurbani O&M come contesto italiano e multi-lotto;
- Dublin MetroLink PPP come riferimento più complesso per procurement e risk allocation.

Ogni benchmark deve indicare quali capacità valida, quali limiti lascia aperti e quali dati non possono essere pubblicati, loggati o trasformati in fixture sintetiche senza revisione.

## Regola Di Verità

Un’estrazione non è verità: è una proposta collegata a fonti. Ogni dato rilevante deve avere fonte, stato e review.

## Terminologia

- `Tender`: contenitore operativo della gara o fase gara.
- `DocumentPackage`: insieme caricato o ricevuto in una data occasione.
- `Document`: documento logico.
- `DocumentVersion`: versione fisica o documentale.
- `SourceReference`: riferimento verificabile a file, pagina, sezione, riga, tabella o estratto.
- `Extraction`: proposta prodotta da parser, regole o AI.
- `IndicatorValue`: dato normalizzato mostrabile in dashboard.
- `ReviewItem`: elemento da validare, correggere, contestare o chiarire.
- `ClarificationThread`: domanda, bozza, risposta, fonte e stato decisionale.

Q&A e chiarimenti non sono sinonimi generici: possono essere domande candidate, domande inviate, risposte ricevute, notice pubblicate, thread interni o decisioni assorbite nella documentazione aggiornata.

## Decisioni Di Metodo

- Documentazione prima del codice quando cambia perimetro, architettura, AI, dati o deploy.
- Dashboard e review queue prima di automazioni profonde.
- Parsing e regole prima di AI dove i dati sono critici, numerici, formali o verificabili deterministicamente.
- Versioning documentale e currentness resolver come capacità core, non accessoria.
- Predisposizione V2/V3 solo se non crea complessità o duplicazione nella V1.

## Handoff per nuova chat

Prima di procedere:

1. leggere `AGENTS.md`;
2. controllare `git status --short --branch`;
3. leggere `README.md`, `docs/INDEX.md`, `docs/CONTEXT.md`,
   `docs/ROADMAP.md`, `docs/BACKLOG.md`, `docs/TOOLCHAIN.md`,
   `docs/ARCHITECTURE.md`, `docs/AI_AND_DOCUMENT_PIPELINE.md` e
   `docs/OPERATIONS.md`;
4. se il task tocca dominio, AI, provider, dati o benchmark, verificare anche
   fonti aggiornate e policy privacy/costi prima di fissare decisioni;
5. controllare Codex feedback inbox prima di PR ready, merge, publish, deploy o
   release;
6. applicare verifiche proporzionate: per docs-only review documentale, link,
   naming Markdown, accenti/apostrofi e `git diff --check`.

## Rischi aperti

- Anticipare V2/V3 nel codice V1 invece di mantenerle come predisposizione
  documentata.
- Trasformare TRAM in chat generica con documenti invece che dashboard,
  document map e review queue evidence-first.
- Usare provider AI esterni senza minimizzazione input, verifica privacy/costi,
  policy Tender e stato quota.
- Consolidare estrazioni critiche senza fonte, stato e review umana.
- Trattare pacchetti gara, benchmark o working extract come contenuti generici
  non sensibili.
- Inventare deploy, runtime produttivi o workflow operativi prima di target,
  runbook e verifica post-deploy approvati.

## Prossimo passo

Seguire `docs/ROADMAP.md` per la priorità corrente della V1. In assenza di una
richiesta prodotto esplicita, limitarsi a governance, audit read-only, contesto,
decisioni e preparazione documentale.
