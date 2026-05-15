# TRAM V1 - Runbook OCI MVP runtime e storage

Data: 2026-05-13  
Stato: runbook minimo pre-codice  
Scope: Oracle Cloud Free Tier Ampere A1, OCI Object Storage Always Free, MVP condiviso TRAM

## Scopo

Questo runbook traduce la decisione Oracle/OCI in un percorso operativo minimo per il MVP condiviso.

Non autorizza ancora deploy, upload di documenti reali o uso produttivo. Serve a rendere chiari prerequisiti, limiti, sicurezza, fallback e verifiche prima di scrivere codice che dipenda dallo storage cloud.

## Decisione

Per il MVP condiviso TRAM:

- runtime target: Oracle Cloud Free Tier Ampere A1;
- storage documentale target: OCI Object Storage Always Free;
- database target: Postgres standard, inizialmente locale Docker e poi sulla stessa VPS se la capacità è sufficiente;
- sviluppo locale: filesystem solo per fixture, prototipo e mini pacchetto sintetico;
- fallback storage: filesystem/block volume sulla VPS se OCI Object Storage blocca il prototipo;
- interfaccia storage obbligatoria, senza dipendenza diretta del dominio applicativo dal provider.

## Fonti e limiti Always Free da monitorare

Fonti consultate il 2026-05-13:

- Oracle, [Always Free Resources](https://docs.oracle.com/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm);
- Oracle, [Oracle Cloud Infrastructure Free Tier](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm).

Limiti rilevanti da trattare come soglie operative, non come capacità garantita:

- OCI Ampere A1 Always Free: fino a 4 OCPU e 24 GB RAM complessivi in tenancy Always Free, allocabili in modo flessibile;
- Block Volume Always Free: fino a 200 GB complessivi da considerare insieme a boot volume, backup e spazio database;
- Object Storage Always Free:
  - account solo Always Free: 20 GB combinati tra Standard, Infrequent Access e Archive;
  - trial o paid con crediti: 10 GB Standard, 10 GB Infrequent Access e 10 GB Archive;
  - 50.000 richieste API Object Storage al mese;
- durante il passaggio da trial ad Always Free, superare il limite gratuito di Object Storage può causare perdita degli oggetti eccedenti secondo la documentazione Oracle;
- la capacità Ampere può non essere disponibile nella home region o availability domain scelti.

Prima di caricare documenti reali, questi limiti vanno ricontrollati sulla documentazione Oracle e nella console dell’account effettivo.

## Risorse OCI minime

Creare o identificare:

- compartment TRAM dedicato;
- VCN e subnet per la VPS;
- security list o network security group con porte minime;
- istanza Ampere A1 Always Free, preferibilmente Ubuntu o Oracle Linux;
- volume boot dimensionato entro i limiti Always Free;
- bucket Object Storage dedicato ai documenti TRAM MVP;
- policy IAM minima per accesso al bucket;
- utente/gruppo o instance principal per l’app;
- eventuale bucket o prefisso separato per backup controllati;
- budget, alert o controllo manuale dei consumi.

Nessuna risorsa deve essere condivisa con DocMolder, FiscalBay, Pratix o altri progetti.

## Naming operativo

Nomi logici consigliati, da adattare in console senza includere dati sensibili:

- compartment: `tram-mvp`;
- instance: `tram-mvp-a1-01`;
- bucket documenti: `tram-mvp-documents`;
- bucket backup o prefisso: `tram-mvp-backups`;
- namespace applicativo: `tram`;
- prefisso oggetti: `tenders/{tender_id}/documents/{document_version_id}/original`.

Gli identificativi reali OCI non vanno copiati nei documenti se non servono. Se servono per deploy futuro, vanno conservati in configurazioni locali o secret manager, non in repo.

## IAM e accessi

Principio: accesso minimo.

L’app deve poter:

- caricare oggetti nel bucket documentale;
- leggere oggetti solo se appartengono allo spazio richiesto;
- generare o usare URL temporanei solo per sessioni controllate;
- cancellare oggetti solo tramite flusso applicativo esplicito e auditato;
- leggere metadati e dimensione oggetto per verifiche.

L’app non deve poter:

- leggere altri bucket;
- amministrare tenancy o IAM;
- generare credenziali permanenti;
- cambiare policy;
- creare pre-authenticated request pubbliche senza decisione esplicita.

Per il primo prototipo condiviso è preferibile usare instance principal o credenziali ristrette al bucket, evitando chiavi utente generiche dove possibile.

## Retention e cancellazione

Per V1 MVP:

- nessun documento reale viene caricato senza consenso operativo;
- ogni oggetto deve avere metadati applicativi minimi: `tender_id`, `document_version_id`, hash, stato, data upload;
- la cancellazione logica nel Tender deve essere distinta dalla cancellazione fisica;
- la cancellazione fisica richiede audit event e, per documenti reali, conferma esplicita;
- lifecycle policy automatica resta disattivata finché non è deciso il comportamento su versioni, addendum e audit.

Retention consigliata per MVP condiviso con dati sintetici:

- mantenere oggetti finché lo spazio fixture/prototipo esiste;
- permettere reset manuale degli spazi sintetici;
- non usare retention legale o lock finché non esiste una policy dati matura.

## Backup

Prima dei documenti reali:

- backup applicativo e database devono essere documentati separatamente;
- Object Storage non va trattato come unico backup;
- per pacchetti reali, conservare almeno hash e manifest nel database;
- per il MVP sintetico, backup manuale è sufficiente;
- per il MVP condiviso con documenti reali, serve decisione su copia bucket, retention e restore test.

Backup minimo per prototipo:

- dump Postgres manuale o scriptato;
- manifest oggetti per spazio;
- nessun backup di segreti;
- nessun export contenente testo integrale riservato in repo.

## Variabili d’ambiente previste

Nomi indicativi, senza valori reali:

```bash
TRAM_STORAGE_DRIVER=oci
TRAM_OCI_REGION=
TRAM_OCI_NAMESPACE=
TRAM_OCI_BUCKET_DOCUMENTS=
TRAM_OCI_COMPARTMENT_ID=
TRAM_OCI_AUTH_MODE=instance_principal
TRAM_MAX_DOCUMENT_BYTES=
TRAM_MAX_SPACE_STORAGE_BYTES=
```

Per sviluppo locale:

```bash
TRAM_STORAGE_DRIVER=filesystem
TRAM_LOCAL_STORAGE_ROOT=.local/tram-storage
```

`.local/` deve essere esclusa dal repo.

## Storage adapter

Il codice applicativo futuro deve dipendere da un’interfaccia simile a:

- `putObject(input)`;
- `getObject(ref)`;
- `headObject(ref)`;
- `deleteObject(ref)`;
- `createTemporaryReadUrl(ref, ttl)`;
- `listObjectsByTender(tender_id)`.

Il dominio non deve conoscere path locali, bucket name, namespace OCI o SDK specifici.

Driver minimi:

- `filesystem`, solo dev/fixture;
- `ociObjectStorage`, target MVP condiviso.

## Porte e superficie runtime

La VPS deve esporre solo il necessario:

- SSH ristretto a IP/utente operativo;
- HTTP/HTTPS solo quando esisterà app condivisa;
- Postgres non esposto pubblicamente;
- worker Python non esposto pubblicamente;
- endpoint health check senza dati sensibili;
- log senza contenuto integrale dei documenti.

Certificati, dominio e reverse proxy restano decisioni successive se non servono allo Slice 0.

## Osservabilità minima

Registrare senza contenuti riservati:

- upload avvenuto;
- hash file;
- dimensione;
- spazio e document version;
- driver storage;
- esito;
- errore tecnico sanificato;
- consumo indicativo storage/API request se disponibile;
- audit event utente.

Non loggare:

- testo integrale;
- nomi file sensibili se non sanificati;
- URL temporanei;
- token;
- contenuto OCR;
- prompt o output AI con dati riservati.

## Fallback

Se OCI Object Storage non è disponibile, troppo lento, troppo oneroso da configurare o bloccante:

1. mantenere il driver `filesystem` per sviluppo e fixture;
2. usare filesystem/block volume sulla VPS solo come fallback temporaneo;
3. documentare path, backup, permessi e limiti;
4. non rimuovere l’interfaccia storage;
5. non introdurre MinIO, R2 o Supabase Storage senza decisione esplicita.

Il fallback non cambia la scelta architetturale: separare document storage, metadata DB e dominio applicativo.

## Checklist prima di upload reali

- account OCI e home region confermati;
- disponibilità Ampere A1 verificata;
- limiti Always Free ricontrollati;
- bucket creato;
- IAM minima attiva;
- credenziali fuori repo;
- `.gitignore` attivo;
- `.env.example` senza valori;
- storage adapter implementato;
- upload/download/head/delete testati su file sintetico;
- log verificati senza contenuto sensibile;
- budget/consumi verificati;
- backup e restore minimo documentati;
- policy dati per spazio confermata.

Finché questa checklist non è chiusa, usare solo fixture e mini pacchetto sintetico.

## Stop condition

Fermare setup o sviluppo cloud se:

- la console mostra risorse non Always Free senza decisione esplicita;
- viene richiesto upgrade paid per proseguire;
- il bucket o la policy espongono oggetti pubblicamente;
- le credenziali finiscono in repo, log o screenshot;
- i limiti storage/API request non sono chiari;
- non esiste modo di cancellare o isolare dati per spazio;
- un documento reale sta per essere caricato senza consenso operativo.

## Prossimo passo

Con questa policy, lo Slice 0 può creare la base applicativa senza caricare dati reali: Next.js App Router, npm, fixture JSON sintetiche, `.gitignore`, `.env.example`, driver storage `filesystem` e interfaccia pronta per OCI Object Storage.
