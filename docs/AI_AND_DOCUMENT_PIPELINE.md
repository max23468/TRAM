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

Provider candidati:

- Gemini;
- Mistral;
- Groq;
- Cloudflare Workers AI;
- Cerebras;
- OpenRouter.

Ogni provider va valutato per costo, quota, privacy, data retention, policy training, qualità e compatibilità con la classe documentale.

## Regole Privacy

- Minimizzare sempre input e chunk.
- Cercare clausole su AI, riservatezza, data processing e vendor esterni prima di usare provider AI su un pacchetto.
- Per dati L1/L2 usare solo provider e policy compatibili.
- In dubbio: parsing locale, worker controllato o conferma umana.

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

## Decisioni Correnti Da Conservare

- Per T1 L0 stage-aware, la route promossa è Gemini più normalizzatore deterministico post-AI e resolver deterministico.
- Per T2 e T3, date, obbligatorietà, formati, limiti e fonti restano responsabilità di parser/regole.
- Per T4-T8, AI supporta normalizzazione e sintesi controllata, ma valori critici e rischi restano soggetti a review umana.
- Cloudflare Workers AI e Groq sono candidabili solo per micro-task L0 con input minimizzati.
- OpenRouter è utile soprattutto per smoke test L0 e confronto free models, non come default su dati sensibili.

## Prompt E Benchmark

I prompt/schema storici vengono assorbiti in questo documento solo come regole correnti. Le versioni superate non restano documenti operativi; lo storico è Git.
