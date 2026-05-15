# TRAM V1 - Policy Gitignore e segreti MVP

Data: 2026-05-13  
Stato: proposta operativa approvabile prima dello Slice 0  
Scope: repository TRAM futura, sviluppo locale, fixture applicative, runtime MVP condiviso

## Scopo

Questa policy definisce cosa non deve mai entrare nella repository TRAM quando Git verrà inizializzato.

La regola principale è semplice: il repo contiene codice, documentazione, configurazioni non sensibili e fixture sintetiche; non contiene segreti, documenti reali, working extract, OCR, dump, export personali o output riservati.

## Decisione MVP

Per lo Slice 0:

- creare `.gitignore` prima di aggiungere codice applicativo;
- mantenere `.env.example` senza valori reali;
- tenere `.env`, chiavi, token e configurazioni cloud reali fuori dal repo;
- usare fixture JSON sintetiche o sanificate come unica base dati applicativa iniziale;
- non far puntare fixture, test o screenshot a `data/packages/`;
- non tracciare output di parsing, OCR, indicizzazione, export o upload locali;
- non leggere, copiare o citare il contenuto di `ssh-key-tram.key`.

## File e cartelle da escludere

La futura `.gitignore` TRAM deve coprire almeno:

```gitignore
# Environment and local secrets
.env
.env.*
!.env.example
*.pem
*.key
*.p8
*.p12
*.crt
*.cer
ssh-key-tram.key
.oci/

# Local app/runtime state
.next/
out/
dist/
build/
coverage/
node_modules/
.turbo/
.vercel/
.local/

# Python and document-processing state
.venv/
__pycache__/
*.pyc
.pytest_cache/

# Sensitive tender packages and generated working data
data/packages/
data/uploads/
data/working/
data/ocr/
data/extracts/
data/exports/
data/indexes/
data/tmp/
storage/
tmp/
logs/
*.log

# Local databases and dumps
*.sqlite
*.sqlite3
*.db
*.dump
*.backup
*.bak

# macOS/editor noise
.DS_Store
.idea/
.vscode/*
!.vscode/extensions.json
!.vscode/settings.example.json
```

Se in futuro una cartella sotto `data/` deve contenere fixture tracciabili, deve avere un nome esplicito e non ambiguo, per esempio `data/fixtures/`, e deve contenere solo dati sintetici o sanificati.

## Segreti ammessi localmente

I segreti possono esistere solo fuori dal repo:

- Portachiavi macOS per chiavi usate da test locali;
- variabili d’ambiente locali non tracciate;
- file OCI in `~/.oci/`, non nella cartella TRAM;
- secret manager del provider scelto, quando esisterà il runtime condiviso;
- secret CI/CD solo dopo policy GitHub/deploy approvata.

Non è ammesso salvare segreti in:

- Markdown di progetto;
- fixture;
- log;
- screenshot;
- issue o PR;
- commenti di codice;
- file `.env.example`.

## Documenti reali e dati riservati

I pacchetti gara reali o rappresentativi restano fuori dal repo.

Sono sempre esclusi:

- PDF, DOCX, XLSX, XLS, MPP e archivi caricati come pacchetti gara;
- OCR intermedi;
- testo integrale estratto da documenti riservati;
- tabelle estratte da gare reali;
- chiarimenti/Q&A, commenti e review contenenti contenuto riservato;
- export utente;
- snapshot di database con dati reali.

Il codice può conservare solo metadati, hash, stati e riferimenti astratti nelle fixture. Gli estratti fonte in fixture devono essere sintetici o sanificati.

## Configurazione cloud

Per OCI, la repository può contenere:

- nomi logici di variabili;
- esempi senza valori;
- schema di configurazione;
- documentazione del runbook;
- interfacce storage/provider.

La repository non può contenere:

- OCID reali non necessari;
- fingerprint, private key o tenancy/user config locale;
- token Object Storage;
- pre-authenticated request reali;
- nomi bucket se rivelano dati sensibili;
- dump di policy IAM con identificativi personali non necessari.

## Verifiche minime

Prima di considerare pronto lo Slice 0:

- verificare che `.gitignore` esista, quando Git sarà inizializzato;
- cercare segreti e file vietati nel tree;
- verificare che le fixture non puntino a `data/packages/`;
- verificare che `.env.example` non contenga valori reali;
- verificare che documenti e output generati siano esclusi.

Check indicativi:

```bash
git status --short
rg -n "BEGIN .*PRIVATE KEY|GEMINI_API_KEY|OCI_|AWS_SECRET|password|token" . --glob '!data/packages/**' --glob '!.venv/**'
rg -n "data/packages|ssh-key-tram.key" data docs app src --glob '!data/packages/**'
```

I comandi andranno adattati quando esisterà la struttura applicativa reale.

## Criterio di blocco

Se un file sensibile entra nella staging area o nella history Git futura, il lavoro si ferma. Prima di proseguire servono bonifica, rotazione del segreto se necessario e decisione esplicita sulla history.

## Prossimo passo

Quando inizierà lo Slice 0, creare `.gitignore`, `.env.example` e una piccola verifica automatica coerente con questa policy.
