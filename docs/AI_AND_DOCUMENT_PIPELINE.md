# TRAM - AI And Document Pipeline

Questo documento governa pipeline documentale, task T1-T8, AI gratuita, provider e prompt correnti.

## Pipeline V1

La pipeline prevista è:

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

Nessun pacchetto completo va inviato a un LLM. Prima parsing/OCR, poi chunk mirati e minimizzati.

## Strategia AI

La strategia AI è:

- free-first;
- provider-agnostic;
- human-in-the-loop;
- nessun fallback automatico verso piani paid;
- sospensione esplicita del job se quota o budget finiscono;
- nessun consolidamento di dati critici senza review.

Provider candidati e posizione corrente:

- **Gemini**: candidato principale per T1 L0 e normalizzazioni controllate quando policy, quota e minimizzazione sono compatibili.
- **Mistral**: secondo candidato, utile per confronto qualità; per L1/L2 richiede verifica privacy, training opt-out e disponibilità del tier gratuito.
- **Groq**: candidabile solo per micro-task L0 con input minimizzati, non per envelope completi o dati sensibili.
- **Cloudflare Workers AI**: candidabile solo per micro-task L0; utile se già dentro architettura edge/free, ma non default per contenuti sensibili.
- **Cerebras**: candidato tecnico per benchmark L0/L1, non default finché privacy, DPA e qualità dominio O&M non sono chiuse.
- **OpenRouter**: utile per smoke test L0 e confronto modelli free; per uso reale richiede modello pinned, policy provider e data policy accettabile.

Ogni provider va valutato per costo, quota, privacy, data retention, policy training, qualità e compatibilità con la classe documentale.

Nessun provider paid, fallback a pagamento, auto-reload o superamento budget è ammesso in V1 senza decisione esplicita. Collegare billing può essere valutato solo per setup, cap o privacy, con budget zero o minimo e senza auto-spesa.

## Regole Privacy

- Minimizzare sempre input e chunk.
- Cercare clausole su AI, riservatezza, data processing e vendor esterni prima di usare provider AI su un pacchetto.
- Per dati L1/L2 usare solo provider e policy compatibili.
- In dubbio: parsing locale, worker controllato o conferma umana.

### Classi Dati

- `L0`: metadati, envelope, label, struttura, titoli, identificativi non sensibili e brevi estratti ammessi.
- `L1`: contenuto gara non personale e non interno, ma comunque riservato o contrattualmente governato.
- `L2`: dati personali, offerta preparata, assunzioni interne, importi interni, strategia commerciale, clausole incompatibili con provider esterni o contenuto vietato dalla policy Tender.

La classe non dipende solo dal task. T5, ad esempio, non è automaticamente L2: pricing e payment mechanism del Tender possono essere analizzati come gli altri domini se input, policy e provider lo consentono. Diventa L2 quando contiene dati interni, offerta preparata, dati personali, clausole incompatibili o informazioni commerciali non pubblicabili.

### Minimizzazione E Redazione

Prima di ogni chiamata AI:

- inviare solo il chunk necessario al task;
- rimuovere contenuti personali non necessari;
- non inviare pacchetti completi, documenti completi o allegati non filtrati;
- evitare importi interni, ipotesi d’offerta, commenti utente e note strategiche;
- includere solo riferimenti fonte sufficienti per audit;
- conservare hash di input/output invece del testo integrale quando possibile;
- salvare un riepilogo della minimizzazione applicata.

Contenuti vietati nei prompt esterni V1 salvo decisione esplicita:

- offerta preparata o bozze d’offerta;
- commenti interni strategici;
- dati personali non indispensabili;
- segreti, chiavi, credenziali, token;
- pacchetti documentali completi;
- clausole che vietano vendor esterni o trattamenti AI;
- dati economici interni o assunzioni non presenti nel Tender.

### Stati Gate

Ogni gate AI deve produrre uno stato:

- `allowed`;
- `allowed_with_minimization`;
- `requires_human_approval`;
- `blocked_by_policy`;
- `blocked_by_privacy`;
- `blocked_by_budget`;
- `blocked_by_quota`;
- `blocked_by_provider_policy`;
- `local_only`.

## Registry Chiamate AI

Ogni chiamata AI deve salvare almeno:

- provider;
- modello;
- endpoint;
- prompt version;
- input hash;
- output hash;
- consumo stimato;
- costo stimato;
- quota residua se disponibile;
- fonte;
- motivazione.

`AiGateDecision`, `AiCall`, `AiProviderPolicySnapshot` e `AiBudgetPolicy` sono parte del modello applicativo. Non sono log opzionali: servono per audit, debug, privacy, costo, riproducibilità e revisione umana.

Il registry non deve salvare contenuti integrali se non c’è base dati approvata. Deve poter ricostruire: chi ha chiesto la chiamata, perché era ammessa, quale prompt/schema era in uso, quali fonti erano incluse, quale output è stato proposto e quale review lo ha validato o respinto.

## Task T1-T8

- **T1**: classificazione e envelope documento.
- **T2**: timeline, date, durate, scadenze.
- **T3**: deliverable e submission.
- **T4**: requisiti O&M e KPI non finanziari.
- **T5**: financials, pricing e payment mechanism.
- **T6**: cost driver.
- **T7**: contraddizioni candidate.
- **T8**: chiarimenti/Q&A e draft controllati.

Regola comune: parser e regole deterministiche individuano valori, fonti e vincoli; AI può normalizzare, spiegare o proporre clustering su input ammessi, ma non inventa dati e non decide verità.

### Responsabilità Per Task

**T1 - Document envelope e currentness**

- Parser/regole: metadati file, hash, dimensioni, lingua, pagine, titolo, famiglia candidata, versione, link a package.
- AI ammessa: normalizzare titolo/famiglia/stage su input L0 minimizzato.
- Deterministico: resolver famiglia/versione/currentness e apertura review per conflitti.

**T2 - Timeline**

- Parser/regole: date, orari, durate, timezone, deadline, dipendenze, fonti, conflitti MPP/PDF.
- AI ammessa: normalizzare nome evento, natura, ruolo e incertezze.
- Non delegare all’AI: valori temporali, scadenze formali, timezone e conflitti.

**T3 - Deliverables**

- Parser/regole: deliverable, codici, obbligatorietà, formato, limite pagine, area submission, deadline, fonte.
- AI ammessa: normalizzare nome, tipo, dominio O&M, dipendenze e incertezze.
- Non delegare all’AI: obbligatorietà, deadline, limiti formali e valori economici.

**T4 - Requisiti O&M e KPI**

- Parser/regole: clausola, requisito, formula, soglia, target, obbligatorietà, fonte.
- AI ammessa: famiglia requisito, dominio O&M, clustering, sintesi controllata e incertezze.
- Non delegare all’AI: alterazione testo, formule, soglie, mandatory status o target.

**T5 - Financials, pricing e payment mechanism**

- Parser/regole: voci, formule, strutture, workbook, payment mechanism, penali, incentivi, pass-through, fonte.
- AI ammessa: classificare e spiegare struttura su input ammessi.
- Non delegare all’AI: inventare importi, correggere formule, consolidare rischio economico o usare dati d’offerta.

**T6 - Cost driver**

- Parser/regole: driver collegati a requisiti, KPI, service level, asset, personale, orari, flotte e rischi.
- AI ammessa: proporre famiglie costo e dipendenze su input ammessi.
- Non delegare all’AI: stime economiche, assunzioni d’offerta, importi o decisioni di pricing.

**T7 - Contraddizioni candidate**

- Parser/regole: confronto tra fonti, versioni, date, formule, requisiti e allegati.
- AI ammessa: spiegare il dubbio e produrre sintesi leggibile.
- Non delegare all’AI: trasformare una contraddizione candidata in verità.

**T8 - Chiarimenti/Q&A**

- Parser/regole: collegamento a fonti, stato thread, scadenze, documenti impattati.
- AI ammessa: bozza interna o riformulazione controllata, se policy lo consente.
- Non delegare all’AI: invio automatico, approvazione, incorporazione definitiva o disclosure esterna.

## Prompt Schema E Normalizzazione

Ogni prompt/schema operativo deve dichiarare:

- task e versione;
- classe dati ammessa;
- provider ammessi;
- input minimo;
- output JSON atteso;
- enum controllati;
- gestione `unknown`, `not_found`, `ambiguous`;
- source reference obbligatoria;
- confidenza;
- ragioni di incertezza;
- regole di non invenzione;
- mapping a review item;
- esempi sintetici non riservati.

Le versioni storiche dei prompt pack T1-T8 non restano file vivi, ma le regole correnti sono:

- output sempre machine-readable quando alimenta UI o data model;
- niente valore critico senza fonte;
- preferire `unknown` a deduzione non supportata;
- ogni normalizzazione deve essere reversibile verso fonte e testo originale;
- normalizzatori deterministici controllano schema, enum, campi obbligatori e coerenza;
- normalizzatori T4-T8 usano registry di indicatori, famiglie e policy, non testo libero incontrollato.

## Decisioni Correnti Da Conservare

- Per T1 L0 stage-aware, la route promossa è Gemini più normalizzatore deterministico post-AI e resolver deterministico.
- Per T2 e T3, date, obbligatorietà, formati, limiti e fonti restano responsabilità di parser/regole.
- Per T4-T8, AI supporta normalizzazione e sintesi controllata, ma valori critici e rischi restano soggetti a review umana.
- Cloudflare Workers AI e Groq sono candidabili solo per micro-task L0 con input minimizzati.
- OpenRouter è utile soprattutto per smoke test L0 e confronto free models, non come default su dati sensibili.
- Mistral resta candidato ma non affidabile come default se il tier gratuito è saturo o la privacy non è verificata.
- Le route AI devono essere task-aware, provider-aware, privacy-aware e budget-aware.
- AI esterna non è default per Q&A, Financials sensibili, offerta preparata o dati L2.

## Benchmark E Valutazione

I benchmark storici hanno prodotto queste regole da conservare:

- T1 L0 richiede valutazione stage-aware e resolver post-AI; benchmarkare solo il modello non basta.
- Gemini più normalizzatore deterministico e resolver è la route promossa per T1 L0.
- Provider più veloci o economici possono fallire su schema, stage o dominio; qualità JSON non equivale a utilità applicativa.
- T2/T3 devono essere valutati su precisione di parser/regole, non solo su sintesi AI.
- T4-T8 richiedono misure separate per falsi positivi, falsi negativi, fonte mancante, severità errata e review burden.
- I pacchetti benchmark devono distinguere dati reali/rappresentativi, output pubblicabile e materiale da non loggare.

Metriche minime:

- schema validity;
- source coverage;
- unsupported claim rate;
- critical field precision/recall;
- false positive e false negative per task;
- review burden;
- provider failure/quota rate;
- latency accettabile per job;
- costo stimato e quota residua;
- casi bloccati correttamente da policy.

## Prompt E Benchmark

I prompt/schema storici vengono assorbiti in questo documento solo come regole correnti. Le versioni superate non restano documenti operativi; lo storico è Git.

## Stop Conditions

Fermare job o task se:

- provider policy non è verificata o è scaduta;
- quota o budget gratuito sono finiti;
- il Tender vieta vendor esterni o AI;
- il chunk contiene L2 non ammesso;
- manca source reference;
- il prompt richiede dati che non servono al task;
- il parser non ha prodotto base sufficiente;
- l’output non valida schema o fonte;
- una review critica è aperta e blocca consolidamento;
- l’utente non ha permesso per avviare AI esterna.
