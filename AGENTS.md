# AGENTS.md - Istruzioni operative per TRAM

Questo file definisce le regole operative persistenti per agenti, Codex e collaboratori che lavorano in `/Users/Matteo/Progetti/TRAM`.

Scope: intera cartella TRAM, salvo futuri `AGENTS.md` più specifici in sottocartelle.

## Priorità delle istruzioni

1. Istruzioni di sistema/developer ricevute nella sessione corrente.
2. Questo file `AGENTS.md`.
3. Eventuali `AGENTS.md` più profondi nella cartella toccata, che prevalgono sulle regole root per il loro scope.
4. Documentazione TRAM in `docs/` e guide operative in `data/`.
5. Decisioni esplicite del maintainer in chat.
6. Convenzioni dedotte da codice, test e configurazioni vicine.
7. Assunzioni dell'agente, solo per dettagli marginali.

In caso di conflitto, seguire sempre il livello più alto. Se una decisione nuova cambia stabilmente perimetro, architettura, dati, AI, privacy, Git, VPS o roadmap, aggiornare i documenti rilevanti.

## Cos’è TRAM

TRAM, nome in codice per Tender Requirements Analysis & Monitoring, è una web app interna per analizzare, mappare e monitorare documenti di gara relativi al trasporto pubblico locale, con focus O&M.

La V1 deve aiutare chi analizza documentazione di gara e prepara offerte tecniche, economiche e amministrative a trasformare pacchetti documentali complessi in una panoramica chiara, aggiornata, verificabile e criticamente utile.

TRAM lavora per Tender condivisi. Un Tender è il contenitore operativo di una gara o fase di gara e include documenti, versioni, integrazioni, dashboard, estrazioni, timeline, requisiti, definizioni, deliverable, cost driver, contraddizioni candidate, chiarimenti/Q&A e stato della review.

## Cosa TRAM non è

Questa sezione va raffinata quando lavoreremo su brand e posizionamento, ma vale già come guardrail.

TRAM V1 non è:

- una chat generica con i documenti;
- un sostituto del giudizio tecnico, economico, legale o strategico dell’utente;
- un sistema che invia domande o chiarimenti alla stazione appaltante senza approvazione umana;
- un legal advisor o financial advisor automatico;
- un document management system generalista;
- uno storage permanente e indiscriminato di documenti riservati;
- una piattaforma enterprise multi-tenant completa;
- un motore AI autonomo che decide cosa è vero;
- uno strumento per preparare automaticamente l’offerta completa, funzione che resta V2;
- un sistema di benchmark cross-gara e best practice storiche, funzione che resta V3.

Proposte che spostano TRAM verso questi perimetri vanno annotate come future o respinte, salvo decisione esplicita.

## Fasi prodotto

- **V1**: Tender, document map, ingestion, parsing, AI gratuita controllata, estrazioni evidence-first, review queue, dashboard gara, dashboard aggregata, versioning e integrazioni documentali.
- **V2**: confronto dell’offerta preparata con la documentazione di gara.
- **V3**: relazione tra gare, offerte, feedback e best practice storiche per suggerimenti trasversali.

Non anticipare V2/V3 nel codice V1 se non come predisposizione ragionevole e documentata.

## Documenti da leggere prima di modifiche non banali

Prima di proporre architetture, refactor, integrazioni, AI workflow, data model, UI o pipeline, partire dal set governante:

- `README.md`
- `docs/INDEX.md`
- `docs/CONTEXT.md`
- `docs/ROADMAP.md`
- `docs/BACKLOG.md`
- `docs/TOOLCHAIN.md`
- `docs/ARCHITECTURE.md`
- `docs/AI_AND_DOCUMENT_PIPELINE.md`
- `docs/UX_REVIEW_WORKFLOW.md`
- `docs/OPERATIONS.md`
- `docs/BRAND.md`
- `docs/DECISIONS.md`

Documenti puntuali ancora ammessi:

- `docs/decisions/` per ADR e decisioni dettagliate.
- `docs/plans/` per piani temporanei e fasi di lavoro.
- `data/` per configurazioni e fixture applicative, non per governance prodotto principale.

I vecchi file di `docs/planning/`, `docs/analysis/`, `docs/runbooks/` e `docs/design/` sono stati assorbiti nei documenti governanti e rimossi dal workspace. Restano recuperabili dallo storico Git, ma non devono più essere trattati come fonti primarie.

Se il task tocca una decisione stabile, aggiornare anche il documento che la governa. Se manca un documento adatto, crearne uno con nome univoco e descrittivo.

## Stato attuale del progetto

- TRAM è in fase MVP iniziale, con app locale Next.js e documentazione consolidata in 12 Markdown governanti.
- Non introdurre runtime, provider, deploy o pipeline produttive finché il piano e la relativa documentazione non sono sufficientemente chiari o finché il maintainer non lo chiede esplicitamente.
- La cartella TRAM è una repo Git locale inizializzata.
- Esiste una chiave locale `ssh-key-tram.key`: trattarla come segreto, non leggerla se non necessario, non copiarla, non committarla.
- I pacchetti in `data/packages/` sono dati reali o rappresentativi e non vanno considerati “documenti grezzi” qualsiasi: sono input applicativi benchmark per TRAM.
- I pacchetti documentali e i working extract sono esclusi da Git e vanno trattati come riservati.

## Principi di prodotto

TRAM deve privilegiare:

- schematicità;
- standardizzazione;
- rappresentazioni grafiche;
- minimalismo;
- sintesi;
- modernità;
- approccio critico;
- tracciabilità delle fonti;
- aggiornamento continuo rispetto a versioni, chiarimenti/Q&A e addendum.

Il valore iniziale non è “fare parlare i PDF”, ma costruire una mappa standardizzata, criticabile e aggiornata della gara.

## Dominio gare TPL/O&M

Non trattare le indicazioni del maintainer come unica fonte di dominio. Sono input importanti, ma vanno integrate con fonti autorevoli e aggiornate.

Quando si definiscono tassonomie, procurement stage, requisiti, indicatori, benchmark O&M, contratti, performance regime, cost driver, KPI, safety, customer experience, payment mechanism o regole di gara:

- verificare fonti web autorevoli e aggiornate;
- privilegiare fonti ufficiali, autorità pubbliche, documentazione procurement, UITP, FTA, report di audit pubblici, toolkit PPP/O&M e fonti equivalenti;
- distinguere sempre prequalifica, ITT, ITN, negotiation, revised tender, BAFO, addendum e chiarimenti;
- non ridurre la differenza a “prequalifica incompleta, ITT completa”;
- annotare in documentazione eventuali ambiguità, fonti contrastanti o decisioni da recuperare.

Per prezzi, provider, API, piani cloud, AI, leggi, standard, policy o dati variabili, verificare sempre fonti aggiornate prima di fissare decisioni.

## AI V1

La strategia AI V1 è free-first, provider-agnostic e human-in-the-loop.

Regole:

- AI gratuita per TRAM in V1: nessun costo ricorrente e nessun fallback automatico verso piani paid.
- È ammesso usare provider cloud gratuiti o free tier.
- È ammesso collegare carta/billing a Gemini solo se serve per accesso, cap, privacy o setup corretto, con budget pari a zero o minimo e senza auto-reload non approvato.
- L’AI applicativa non deve girare sul Mac dell’utente.
- I provider candidati iniziali sono Gemini, Mistral, Groq, Cloudflare Workers AI, Cerebras e OpenRouter.
- Mistral è candidabile in V1 free tramite piano Experiment, ma per dati L1/L2 va verificato opt-out training o altra base privacy accettabile.
- Cloudflare Workers AI e Groq sono candidabili solo per micro-task L0 con input minimizzati, non per envelope completi o L1/L2.
- OpenRouter è candidabile soprattutto per smoke test L0 e confronto free models; per L1/L2 richiede modello pinned, policy provider verificata e ZDR/data policy accettabile.
- Cerebras è candidabile per benchmark tecnico L0/L1, ma non come default finché non sono chiuse privacy/DPA e qualità sul dominio O&M.
- VPS gratuita o modello self-hosted resta fallback per task sensibili o batch lenti.
- Nessun pacchetto completo va inviato a un LLM: prima parsing/OCR, poi chunk mirati e minimizzati.
- Ogni chiamata AI deve salvare provider, modello, endpoint, prompt version, input hash, output hash, consumo stimato, costo stimato, quota residua se disponibile, fonte e motivazione.
- Ogni prompt AI deve rispettare la policy consolidata in `docs/AI_AND_DOCUMENT_PIPELINE.md`.
- Per T1 L0 stage-aware v0.4, la route promossa è Gemini + normalizzatore deterministico post-AI + resolver deterministico; Mistral resta candidato ma non affidabile se il tier gratuito è saturo.
- Per T2 timeline, date, orari, durate, timezone, conflitti e stato review sono responsabilità di parser/regole; AI può normalizzare nome evento, natura, ruolo e incertezze su envelope minimizzato.
- Per T3 deliverable, parser/regole individuano deliverable, codici, obbligatorietà, limiti pagina, formati, pesi, deadline e fonti; AI può normalizzare nome, tipo, area di submission, dominio O&M, dipendenze e incertezze, ma non deve consolidare requisiti formali, valori economici o contenuti sensibili.
- Per T4 requisiti O&M e KPI non finanziari, parser/regole individuano clausole, requisiti, formule, target e fonti; AI può normalizzare famiglia, dominio O&M, clustering e incertezze, ma non deve alterare testo, formule, soglie o obbligatorietà.
- Per T5 financials, pricing e payment mechanism, parser/regole individuano item, formule, strutture, valori e fonti; AI può analizzare Financials come gli altri domini del Tender su input ammessi, minimizzati e governati da policy Tender/provider. T5 non è sensibile per categoria: scala a blocco solo quando contiene dati interni, offerta preparata, dati personali, clausole incompatibili o altro L2 effettivo.
- Per T6 cost driver, AI può proporre famiglie costo e dipendenze solo su input ammessi; non deve inventare importi, stime o assunzioni economiche.
- Per T7 contraddizioni candidate, regole e confronti producono il candidato; AI può spiegare il dubbio, ma non trasformarlo in verità.
- Per T8 chiarimenti/Q&A, nessuna domanda o chiarimento viene inviato automaticamente; template, gestione thread e review umana sono obbligatori, AI esterna non è default V1.
- Se finisce quota gratuita o budget, il job si sospende con stato esplicito. Non passare a pagamento.
- Ogni output AI deve avere fonte, estratto, riferimento documento, confidenza e stato di validazione.
- L’AI può proporre, non consolidare dati critici senza validazione.
- Bozze di chiarimento sempre approvate da un utente prima di invio o export esterno.
- Le clausole dei documenti di gara su AI, riservatezza, data processing e vendor esterni vanno cercate prima di usare provider AI esterni su un pacchetto.
- La policy consolidata in `docs/AI_AND_DOCUMENT_PIPELINE.md` governa il default per classi documentali, privacy level e provider ammessi.

Output AI critici, contraddizioni, payment mechanism, penali, KPI, requisiti mandatory, rischio economico, compliance e chiarimenti/Q&A restano soggetti a review umana.

## Data model e verità applicativa

TRAM segue un modello evidence-first.

Regole:

- Un’estrazione non è verità: è una proposta collegata a fonti.
- Conservare sempre differenza tra evidenza grezza, estrazione, valore indicatore, review item e dato validato.
- `Document` è concetto logico; `DocumentVersion` è versione fisica o documentale.
- `SourceReference` è centrale: senza fonte, un dato critico non deve essere consolidato.
- Ogni dato rilevante deve avere stato: estratto, proposto, confermato, corretto, contestato, da chiarire, superato o non applicabile.
- La review queue è parte core del prodotto, non un extra.
- Il feedback utente può migliorare tassonomie, prompt e regole, ma non deve creare apprendimento opaco.

## Pipeline documentale

La pipeline V1 prevista è:

1. ingestion e inventario file;
2. parsing tecnico;
3. OCR quando necessario;
4. estrazione tabelle, Excel e MPP;
5. chunking con riferimenti fonte;
6. estrattori deterministici e rule-based;
7. AI gratuita su task mirati;
8. riconciliazione e contraddizioni candidate;
9. review queue;
10. dashboard.

Toolchain locale documentata:

- Python 3.12 nella `.venv`;
- Poppler;
- Tesseract/OCRmyPDF;
- qpdf;
- Ghostscript/unpaper;
- OpenJDK;
- Ant;
- Maven;
- MPXJ;
- `pypdf`, `pdfplumber`, `pymupdf`, `python-docx`, `openpyxl`, `pandas`, `xlrd`, `olefile`, `rich`, `typer`, `beautifulsoup4`, `lxml`, `tabulate`, `ocrmypdf`, `pytesseract`, `pdf2image`, `mpxj`, `jpype1`.
- `google-genai` è installato nella `.venv` per benchmark Gemini API e test AI controllati; non rende Gemini un default architetturale.

Python 3.12 è scelta intenzionale per stabilità delle librerie native/documentali. Non cambiare versione senza motivazione e test.

## Convenzioni documentali

- Rispondere e documentare preferibilmente in italiano.
- Usare accenti e apostrofi corretti: `è`, `perché`, `più`, `attività`, `qualità`, `l’utente`, `dell’offerta`.
- Evitare forme semplificate come `perche`, `piu`, `attivita` nei testi italiani.
- Tutti i file Markdown devono avere nomi base univoci anche se in cartelle diverse.
- Non creare `README.md`, `notes.md`, `plan.md`, `roadmap.md` o `index.md` duplicabili se non esplicitamente deciso.
- Usare nomi descrittivi e univoci, per esempio `AI_AND_DOCUMENT_PIPELINE.md` o un ADR numerato quando serve dettaglio stabile.
- Non creare documenti duplicati: integrare documenti esistenti quando la decisione appartiene a una sezione già presente.
- Durante migrazioni, rinomini o merge documentali non perdere contenuti utili:
  aggiornare link e indici, preservare ciò che resta valido e dichiarare nel
  riepilogo ciò che viene rimosso perché superato.
- Se uno step viene saltato, annotarlo come debito o decisione da recuperare.
- Per modifiche solo documentali, la verifica minima è rilettura, coerenza dei link e controllo naming.

Check utili:

```bash
find . -path './.venv' -prune -o -path './data/packages' -prune -o -name '*.md' -type f -print | awk -F/ '{print $NF}' | sort | uniq -d
```

```bash
rg -n "perche|piu|attivita|qualita|criticita|possibilita|responsabilita|modalita" docs data --glob '*.md' --glob '!data/packages/**'
```

## Sicurezza, dati e privacy

- Non committare segreti, token, chiavi SSH, `.env`, dump, export personali o documenti di gara riservati.
- Non copiare contenuti riservati in log, issue, PR, screenshot o fixture.
- Non loggare contenuti integrali dei documenti caricati.
- Trattare pacchetti gara, estrazioni, OCR, tabelle, chiarimenti/Q&A, commenti e review come dati sensibili.
- Ogni storage documentale deve essere separato dal repo.
- Ogni policy cloud/AI deve essere esplicita per Tender o classe documentale.
- Prima di inviare dati a provider esterni, minimizzare input e verificare clausole del pacchetto.
- Se un documento contiene dati personali o clausole di riservatezza, segnalarlo nella review o nella policy del pacchetto.
- In caso di dubbio su privacy, non procedere con invio esterno: chiedere conferma o usare solo parsing locale/worker controllato.

## Architettura tecnica

Direzione attuale:

- free-first;
- self-hostable;
- provider-agnostic;
- app TypeScript containerizzabile;
- Postgres standard;
- storage controllato e astratto, preferibilmente S3-compatible o equivalente;
- worker Python documentale separato;
- AI gateway interno gratuito/capped;
- job queue basata inizialmente su Postgres;
- review queue critical-first;
- dashboard evidence-first.

Vercel, Supabase e OpenAI restano fonti utili o alternative possibili, non default automatici. Non proporre stack gestiti a pagamento se confliggono con il vincolo free-first senza spiegare tradeoff e costi.

L’architettura non deve cambiare da MVP a prodotto finito se non per scalare componenti. Evitare scelte che obblighino a riscrivere il cuore del prodotto.

## UI e frontend futuri

Quando inizierà lo sviluppo UI:

- costruire l’esperienza applicativa vera, non una landing marketing;
- UI in italiano;
- dashboard dense, leggibili, sobrie e professionali;
- niente testi che spiegano ovvietà dell’interfaccia;
- privilegiare tabelle, timeline, stati, grafici, filtri, review queue e accesso alle fonti;
- usare componenti coerenti con il design system scelto;
- usare icone riconoscibili, preferibilmente lucide se il progetto le adotta;
- garantire responsive mobile/desktop;
- evitare testi che escano dai contenitori;
- evitare palette monotematiche e gradienti decorativi non necessari;
- usare card solo per item ripetuti, modali o tool realmente incorniciati;
- rendere sempre visibile fonte, stato e rischio quando un dato è proposto o non validato.

Per modifiche UI sostanziali future, prevedere verifica browser su desktop e mobile. Se Computer Use o Browser Use sono utili e non disponibili, segnalarlo al maintainer.

## Workflow operativo

Prima di modifiche:

- verificare `pwd`;
- controllare `git status --short` se la cartella è una repo Git;
- se non è una repo Git, dichiararlo quando rilevante;
- leggere i documenti vicini e pertinenti;
- usare `rg` o `rg --files` per cercare file e testo;
- non sovrascrivere modifiche non tue;
- non usare comandi distruttivi senza conferma esplicita;
- mantenere scope proporzionato alla richiesta;
- fare domande mirate se ambiguità importanti cambiano rischio, comportamento o costo.

Per modifiche manuali ai file usare `apply_patch`. Non creare o modificare file con `cat` o shell write tricks.

Per task ampi:

- prima piano e documentazione;
- poi implementazione solo dopo conferma;
- annotare decisioni, debiti e step rimandati;
- lavorare un passo alla volta, con prossimi passi chiari.

## Regole importate dagli altri progetti

Queste regole sono state adattate da pattern già usati in Pratix, DocMolder, FiscalBay, SyncBay e SendChimp.

Regole trasferibili:

- da Pratix: piano scritto prima del codice per decisioni importanti; documentazione viva; attenzione a UI italiana, glossario, versioning, changelog e pubblicazione reale su GitHub;
- da DocMolder: separare filoni di lavoro solo con ownership chiara; non mescolare worktree sporchi; per VPS/deploy seguire runbook e verificare host, log e smoke, non solo stato attivo;
- da FiscalBay: non dedurre dati assenti dalle fonti/API/documenti; deploy VPS solo su host esplicitamente confermato; in TRAM, “pubblica” include sempre il flusso operativo completo previsto dalla policy corrente e comprende anche le attività operative correlate quando richieste da quel flusso.
- da SyncBay: non introdurre runtime, worker, integrazioni o workflow produttivi non decisi; per informazioni variabili usare fonti ufficiali aggiornate; documentare ADR per decisioni stabili; trattare dati reali come sensibili;
- da SendChimp: mantenere una fase docs-first finché il perimetro non è deciso; non introdurre backend, frontend, worker, job queue, automazioni produttive, token persistenti, webhook o integrazioni reali senza richiesta esplicita e documentazione aggiornata; distinguere sempre automatismo e conferma manuale; prevedere check dedicati per documentazione, link, segreti, apostrofi e accenti;
- da tutti: scope contenuto, Git status iniziale, no segreti in repo, no dati reali in fixture/log/screenshot, Conventional Commit quando ci sarà Git, verifiche proporzionate, self-review, prossimi passi concreti.

Non importare stack specifici di altri progetti come default TRAM. Pratix può usare Vercel/Supabase, DocMolder e FiscalBay possono essere Telegram/VPS-first, SyncBay può essere Shopify/eBay: TRAM ha il proprio perimetro.

## Lavoro parallelo e ownership

Separare il lavoro in più filoni solo se il maintainer lo chiede esplicitamente o se il sistema lo autorizza nel contesto corrente.

Quando in futuro più filoni lavorano su TRAM:

- una chat principale coordina scope, decisioni e integrazione;
- ogni filone ha ownership chiara su file o moduli;
- evitare che due filoni modifichino gli stessi file;
- usare branch/worktree dedicati quando Git sarà attivo;
- lasciare handoff sintetico con file toccati, verifiche, rischi e prossimi passi;
- non delegare decisioni prodotto ambigue o task piccoli.

## Git e GitHub

TRAM è una repository Git pubblicata come repository privata `max23468/TRAM`, con branch base `main`.

- GitHub è la fonte primaria del codice e della documentazione pubblicata;
- controllare sempre `git status --short` prima di editare;
- per lavori non banali usare branch `codex/<tema>`;
- mantenere commit atomici;
- usare Conventional Commit coerenti con l’impatto reale:
  - `docs:` per sola documentazione;
  - `feat:` per nuove funzionalità osservabili;
  - `fix:` per correzioni osservabili;
  - `perf:` per miglioramenti prestazionali;
  - `refactor:` solo senza cambio funzionale;
  - `test:` per soli test;
  - `chore:` per manutenzione interna;
  - `ci:` per workflow/CI.
- prima di PR o merge fare self-review del diff;
- non aggiungere workflow GitHub Actions, bot, release flow o deploy automation senza decisione esplicita;
- controllare la `Codex feedback inbox` prima di merge non banali;
- controllare la `Codex feedback inbox` anche prima di PR ready, pubblicazione, deploy o release;
- dopo merge/pubblicazione controllare `git branch -vv` e `git worktree list`,
  poi pulire branch/worktree locali o remoti non più necessari;
- non lasciare branch `codex/*` stale se il lavoro è stato assorbito.

Policy operativa corrente:

- “pubblica” significa completare il flusso completo su GitHub (PR/merge, verifica, pulizia branch/worktree locali e remoti). Deploy o attivazione restano fuori da “pubblica” salvo richiesta esplicita o fase corrente già documentata con runbook e target confermati.
- “deploya” significa deploy solo se esiste runbook e target confermato;
- “rilascia” segue la policy versioning/release TRAM e include il rilascio operativo completo dove applicabile.
- release e deploy vanno valutati insieme quando entrambi sono applicabili: non chiudere una release senza dichiarare lo stato del deploy, e non chiudere un deploy senza dichiarare se la release è necessaria o `N/A`.
- “attiva”, “metti in produzione”, “manda”, “esegui su documenti reali” o formule simili richiedono di verificare prima policy dati, provider, costi, consenso operativo e rischi.

Se il maintainer usa formule ambigue, chiedere conferma prima di azioni esterne o irreversibili.

## VPS e deploy futuri

Quando avremo una VPS TRAM:

- creare o aggiornare un runbook dedicato, con host, utente, path, servizi, backup, deploy, rollback, health check e log;
- non usare host, chiavi o procedure di DocMolder, FiscalBay o altri progetti;
- verificare sempre hostname e contesto prima di comandi remoti;
- non fare deploy se non richiesto o se il diff non è deploy-relevant;
- dopo deploy controllare stato servizio, log recenti e percorso utente minimo;
- per comandi distruttivi, migrazioni DB, restore, backup, reset o cleanup remoto, chiedere conferma esplicita se non già coperti da runbook approvato.

La chiave `ssh-key-tram.key` è un segreto locale. Non leggerla, non copiarla e non citarne il contenuto.

## Versioning e release

La policy SemVer/release è definita da
`docs/decisions/0003-versioning-release-policy.md`.

Regole operative:

- `package.json` è la fonte canonica della versione applicativa;
- modifiche solo documentali, governance GitHub o pianificazione non richiedono
  bump versione, tag o GitHub Release;
- una release richiede richiesta esplicita del maintainer;
- per release applicative aggiornare anche `package-lock.json` e
  `CHANGELOG.md` quando previsto dalla policy;
- per docs-only e piani interni, evitare release applicative;
- deploy e release restano separati: una release non deploya TRAM.
- Release Please non è adottato: non delegare changelog, versioni, tag o GitHub
  Release a bot automatici senza nuova decisione esplicita.

## Testing e verifica

Per modifiche documentali:

- per modifiche documentali, rileggere i file toccati;
- controllare naming `.md` univoco;
- controllare accenti/apostrofi quando si scrive in italiano;
- controllare link, riferimenti obsoleti, pattern di segreti e file vietati quando i documenti iniziano a crescere;
- non inventare test applicativi;
- dichiarare che la verifica è documentale.

Usare la corsia `veloce` per docs/governance a basso rischio, `standard` per
codice/config ordinari e `completa` per release, deploy, sicurezza, dati,
provider AI, pipeline documentale o runtime.

Per modifiche al codice:

- definire comandi reali di lint, typecheck, test, build e smoke nel runbook;
- valutare script dedicati tipo `verify_docs` e `verify_language` per controllare documentazione, link, segreti, apostrofi e accenti;
- eseguire controlli proporzionati al rischio;
- per pipeline documentale testare PDF, OCR, DOCX, XLSX, XLS, MPP e casi di errore;
- per AI testare output JSON, fonti, confidenza, limiti quota, fallback e sospensione job;
- per UI testare desktop/mobile e stati vuoti, errore, caricamento e dati non validati;
- se un controllo non è eseguibile, dichiarare motivo, impatto e prossimo passo.

Non inventare risultati di test o verifiche non eseguite.

## Documentazione e governance

Aggiornare la documentazione quando cambia:

- perimetro V1/V2/V3;
- architettura;
- stack;
- provider AI;
- free tier, costi, budget o privacy;
- modello dati;
- pipeline documentale;
- review queue;
- policy sicurezza;
- Git/GitHub;
- VPS/deploy;
- brand, naming o “cosa TRAM non è”;
- benchmark o criteri di successo.

Documenti futuri consigliati quando servono:

- ADR in `docs/decisions/` per decisioni permanenti;
- runbook VPS dedicato quando servirà;
- roadmap in `docs/ROADMAP.md`;
- backlog in `docs/BACKLOG.md`;
- toolchain in `docs/TOOLCHAIN.md`;
- changelog quando inizia lo sviluppo applicativo;
- glossario prodotto in italiano;
- protocollo benchmark AI;
- policy dati e privacy per provider esterni.

## Definizione di completamento

Una modifica è pronta se:

- risolve la richiesta senza allargare inutilmente lo scope;
- resta coerente con perimetro TRAM e documenti esistenti;
- aggiorna documentazione o decisioni quando necessario;
- non introduce costi, provider, runtime o deploy non approvati;
- non espone segreti o dati riservati;
- non lascia processi, file temporanei o modifiche non correlate;
- include verifiche eseguite o limiti noti quando rilevanti;
- publish, release e deploy sono stati completati oppure dichiarati non applicabili con motivo;
- propone prossimi passi concreti se resta un seguito operativo reale.

## Risposte finali

Nelle risposte finali:

- riassumere cosa è cambiato o scoperto;
- indicare file principali quando utile;
- riportare verifiche solo quando aggiungono valore o quando ci sono limiti/rischi;
- dichiarare stato publish/release/deploy e branch/worktree quando applicabile;
- dichiarare rischi residui concreti;
- includere sempre il prossimo passo consigliato quando esiste un seguito operativo reale;
- evitare footer rituali sui test;
- non inventare risultati.
