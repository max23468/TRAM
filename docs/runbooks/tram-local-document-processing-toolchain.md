# TRAM - Toolchain locale document processing

Data: 2026-05-12
Stato: installata e verificata localmente; SDK Gemini e CLI operative aggiunti il 2026-05-13

## Scopo

Questa toolchain serve ad analizzare localmente i pacchetti gara TRAM, senza inviare i documenti a servizi esterni.

Copre:

- PDF testuali;
- PDF da rendere in immagini;
- OCR;
- DOCX;
- XLSX e XLS;
- MPP Microsoft Project;
- parsing tabellare e reportistica tecnica;
- CLI operative per sviluppo, database, storage, GitHub, Cloudflare e Oracle Cloud.

## Scelta Python

La `.venv` locale usa Python 3.12.

Motivo:

- Python 3.12 è più stabile per librerie native e bridge Java come JPype/MPXJ;
- molte librerie documentali pubblicano wheel precompilate e mature per 3.12;
- Python 3.14 ha già mostrato attrito concreto: JPype richiedeva build locale più fragile;
- per TRAM la priorità è affidabilità della pipeline documentale, non usare la versione Python più recente disponibile.

Python 3.14 resta disponibile sul sistema, ma non è la scelta giusta per questa toolchain finché l’ecosistema documentale non è allineato.

## Tool di sistema installati

Installati via Homebrew:

- Poppler 26.04.0:
  - `pdftotext`;
  - `pdfinfo`;
  - `pdftoppm`.
- Tesseract 5.5.2.
- `tesseract-lang` 4.1.0.
- OCRmyPDF 17.4.2.
- qpdf 12.3.2.
- Ghostscript, unpaper e dipendenze OCR.
- OpenJDK 25.0.2.
- Apache Ant 1.10.17.
- Apache Maven 3.9.15.

OpenJDK è installato come keg-only Homebrew package. Per usare Java nei comandi TRAM:

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk
export PATH="/opt/homebrew/opt/openjdk/bin:$PATH"
```

## Librerie Python installate nella `.venv`

Ambiente:

```bash
.venv/bin/python --version
```

Librerie principali:

- `pypdf`;
- `pdfplumber`;
- `pymupdf`;
- `python-docx`;
- `openpyxl`;
- `pandas`;
- `xlrd`;
- `olefile`;
- `beautifulsoup4`;
- `lxml`;
- `tabulate`;
- `ocrmypdf`;
- `pytesseract`;
- `pdf2image`;
- `mpxj`;
- `jpype1`;
- `google-genai`, usato per benchmark Gemini API L0 e futuri test AI controllati.

## Tooling Google e Gemini

Decisione del 2026-05-13:

- installato nella `.venv` il pacchetto ufficiale Google GenAI SDK, `google-genai`;
- non installata la Gemini CLI globale.

Motivo:

- per TRAM l’integrazione applicativa deve passare da API/SDK, non da CLI interattiva;
- la Gemini CLI è utile come assistente/agent da terminale, ma non è una dipendenza necessaria per ingestion, benchmark o runtime V1;
- installare una CLI agentica globale aumenta la superficie operativa e non serve al primo benchmark;
- se in futuro useremo Gemini CLI per sviluppo assistito, va installata separatamente e documentata come tool personale, non come dipendenza di prodotto TRAM.

Key Gemini locale:

- salvata nel Portachiavi macOS;
- service: `com.tram.gemini.api-key`;
- account: `GEMINI_API_KEY`;
- non salvare mai il valore della key in repo, documenti, log o screenshot.

Recupero per test locali:

```bash
export GEMINI_API_KEY="$(security find-generic-password -a GEMINI_API_KEY -s com.tram.gemini.api-key -w)"
```

Verifica SDK:

```bash
.venv/bin/python - <<'PY'
import google.genai
print("google-genai ok")
PY
```

## CLI operative installate

Decisione del 2026-05-13:

- usare Homebrew come canale principale su macOS;
- usare `npm` per Wrangler, perché la CLI Cloudflare Workers è distribuita e aggiornata come pacchetto Node;
- non salvare token o segreti in repo;
- usare Portachiavi macOS per credenziali locali quando possibile;
- trattare queste CLI come tool di sviluppo e operatività, non come dipendenze applicative TRAM.

### Wrangler

Uso previsto:

- test Cloudflare Workers AI;
- future prove su Workers, R2, Vectorize, AI Gateway o workflow edge;
- gestione di secrets Cloudflare, se decideremo di usare Cloudflare nello stack.

Installazione:

```bash
npm install -g wrangler
```

Verifica eseguita:

```bash
wrangler --version
```

Stato locale:

- versione verificata: `4.90.1`;
- token Cloudflare già salvato nel Portachiavi macOS;
- `wrangler whoami` verificato tramite token, senza stampare segreti.

### Docker Desktop

Uso previsto:

- Postgres locale;
- app TypeScript containerizzabile;
- worker Python documentale;
- stack locale riproducibile;
- futura coerenza con deploy VPS.

Installazione:

```bash
brew install --cask docker
```

Verifica eseguita:

```bash
docker --version
docker compose version
docker info
```

Stato locale:

- Docker Desktop installato in `/Applications/Docker.app`;
- Docker engine attivo;
- Docker verificato: `29.4.3`;
- Docker Compose verificato: `v5.1.3`.

### psql

Uso previsto:

- ispezione Postgres locale;
- debug schema e migrazioni;
- backup/restore controllati;
- verifiche manuali senza dipendere da UI grafiche.

Installazione:

```bash
brew install libpq
```

`libpq` è keg-only in Homebrew. Per rendere `psql` disponibile nelle nuove shell è stato aggiunto a `~/.zshrc`:

```bash
export PATH="/opt/homebrew/opt/libpq/bin:$PATH"
```

Verifica eseguita:

```bash
psql --version
```

Stato locale:

- client verificato: `psql (PostgreSQL) 18.3`.

### GitHub CLI

Uso previsto futuro:

- inizializzazione repository GitHub;
- issue e PR;
- workflow e check;
- pubblicazione quando TRAM avrà policy Git/GitHub.

Installazione:

```bash
brew install gh
```

Stato locale:

- già installata;
- versione verificata: `2.92.0`;
- login GitHub già presente e verificato su account `max23468`;
- token non stampato e non salvato in repo.

### OCI CLI

Uso previsto futuro:

- verifica Oracle Cloud;
- eventuale VPS/free tier;
- Object Storage;
- network, compute e backup se Oracle diventa target operativo.

Installazione:

```bash
brew install oci-cli
```

Stato locale:

- già installata;
- versione verificata: `3.81.1`;
- config locale presente in `~/.oci/config`;
- permessi config riparati con `oci setup repair-file-permissions`;
- chiamata API `oci os ns get` verificata con successo.

### Stato installazione CLI

| CLI | Canale | Stato | Note TRAM |
| --- | --- | --- | --- |
| `wrangler` | npm | installata e autenticazione verificata | Cloudflare, Workers AI, R2/edge futuri |
| Docker Desktop | Homebrew cask | installato e engine attivo | base per stack locale e VPS-like |
| `psql` | Homebrew `libpq` | installato e PATH configurato | client Postgres standard |
| `gh` | Homebrew | già installato e autenticato | GitHub futuro |
| `oci` | Homebrew `oci-cli` | già installato e API verificata | Oracle Cloud futuro |

Nota: dopo modifiche a `~/.zshrc`, aprire una nuova shell o eseguire:

```bash
exec zsh
```

## Test eseguiti

### PDF

Su `Instructions to Tender v5.pdf` Copenhagen:

- `pdfinfo` legge metadati, pagine e proprietà;
- `pdftotext -layout` estrae testo leggibile;
- documento rilevato: 47 pagine, PDF 1.7, A4, non cifrato.

### DOCX

Su `Conditions of Contract.docx` Copenhagen:

- `python-docx` legge 603 paragrafi e 2 tabelle;
- testo iniziale estratto correttamente.

### XLSX

Su `Schedule of Prices Excel Workbook v5.xlsx` Copenhagen:

- `openpyxl` legge correttamente i fogli;
- fogli rilevati, tra gli altri:
  - `Evaluated Price`;
  - `Schedule_of_Prices_Summary`;
  - `SofP_Operation`;
  - `SofP_Maintenance`;
  - fogli per Train Maintenance, Signalling, Permanent Way, Operational systems, IT Systems, Administration.

### MPP

Su `O&M procurement schedule v3.mpp` Copenhagen:

- MPXJ apre il file Microsoft Project;
- titolo progetto: `O&M procurement schedule`;
- autore: `Carsten Larsen`;
- inizio progetto: 2024-03-21;
- fine progetto: 2026-09-29;
- task rilevati: 32.

Esempi di task letti:

- Contract Notice finalised;
- Procurement documents finalised;
- Invitation to Tenderers;
- Preparing tenders;
- Submission first tender;
- Negotiation meeting;
- Release basis for revised tender;
- Preparing revised tender.

## Implicazioni per TRAM

- PDF, DOCX, XLSX, XLS e MPP sono formati da supportare già nella V1 tecnica.
- OCR va previsto come fallback, non come primo passaggio universale.
- MPP può alimentare direttamente la timeline di gara.
- Excel può alimentare pricing, financial model, timetables e dati strutturati.
- I PDF testuali vanno prima analizzati con estrazione nativa; OCR solo se la qualità testo è bassa.
- Lo sviluppo deve poter girare con Docker e Postgres standard, senza dipendere da Supabase come default.
- Cloudflare e OCI sono tool pronti per prove controllate, ma non implicano una scelta architetturale definitiva.

## Comandi rapidi

Attivare ambiente:

```bash
source .venv/bin/activate
export JAVA_HOME=/opt/homebrew/opt/openjdk
export PATH="/opt/homebrew/opt/openjdk/bin:$PATH"
```

Estrarre testo PDF:

```bash
pdftotext -layout input.pdf output.txt
```

Metadati PDF:

```bash
pdfinfo input.pdf
```

OCR PDF:

```bash
ocrmypdf --skip-text --deskew input.pdf output-ocr.pdf
```

Nota: usare OCR su copie in `data/working/`, non sui pacchetti originali.

Verificare CLI operative:

```bash
wrangler --version
docker --version
docker compose version
psql --version
gh --version
oci --version
```
