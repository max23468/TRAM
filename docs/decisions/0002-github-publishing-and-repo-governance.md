# ADR 0002 - Pubblicazione GitHub e governance repository

## Stato

Accepted.

## Contesto

TRAM nasce come repository locale con documentazione governante, app Next.js MVP e dati reali o rappresentativi esclusi da Git. Il maintainer ha chiesto di pubblicare TRAM su GitHub e configurarla in modo coerente con le altre repository operative, senza trasformare la pubblicazione in deploy, release o attivazione di runtime esterni.

TRAM ha vincoli specifici:

- è una web app interna per analisi di gare TPL/O&M;
- lavora con pacchetti documentali e working extract trattati come riservati;
- resta free-first, provider-agnostic e human-in-the-loop;
- non ha ancora policy SemVer/release, runbook deploy o target produttivo;
- non deve importare come default lo stack di Pratix, DocMolder, FiscalBay, SyncBay o SendChimp.

## Decisione

TRAM viene pubblicata come repository privata `max23468/TRAM`, con `main` come branch predefinito.

GitHub diventa la fonte primaria per codice e documentazione versionati, ma solo per gli artefatti ammessi in Git: documenti governanti, codice, test, configurazioni, fixture sintetiche e asset non riservati.

La configurazione GitHub iniziale include:

- template issue per bug, feature e manutenzione;
- template pull request con checklist su verifiche, dati, sicurezza, deploy e decisioni;
- `CODEOWNERS` assegnato al maintainer;
- Dependabot per npm e GitHub Actions, con limite basso di PR aperte;
- workflow `Quality` per `npm run verify` e audit dipendenze quando rilevante;
- workflow `Repo Hygiene` per whitespace, path vietati, nomi Markdown duplicati e accenti italiani comuni;
- workflow `PR Title` per titoli in formato Conventional Commit;
- branch protection su `main` dopo il primo push, con PR review e status check richiesti quando disponibili.

## Non Decisioni

Questa pubblicazione non decide:

- deploy, hosting o runtime produttivo;
- Vercel, Supabase, OCI, VPS o altro target operativo;
- release automation, Release Please, changelog o SemVer;
- upload di pacchetti reali, OCR, working extract, export o log;
- uso di provider AI esterni su documenti reali;
- issue bot, comment bot o automazioni produttive.

Questi temi richiedono ADR o runbook dedicati prima dell’attivazione.

## Conseguenze

Le PR non banali devono passare da branch `codex/<tema>` e mantenere Conventional Commit.

Prima del merge è richiesta self-review del diff e verifica proporzionata allo scope. Per codice applicativo il gate locale corrente resta `npm run verify`; per cambi solo documentali valgono i check documentali in `docs/OPERATIONS.md`.

I workflow GitHub sono ammessi perché sono controlli di qualità e igiene repository, non runtime produttivi. Non devono accedere a segreti, dati reali o provider esterni.

La branch protection su `main` non sostituisce il giudizio operativo: se una modifica tocca dati, AI, deploy, storage, costi o privacy, serve comunque una decisione documentata.

## Rischi E Mitigazioni

- **Rischio: pubblicazione accidentale di dati riservati.** Mitigazione: `.gitignore`, workflow `Repo Hygiene`, review PR e divieto esplicito di log/screenshot/fixture con dati reali.
- **Rischio: GitHub venga interpretato come deploy o release.** Mitigazione: decisione D024, questa ADR e checklist PR distinguono pubblicazione, deploy e rilascio.
- **Rischio: automazioni troppo ampie.** Mitigazione: workflow limitati a quality/hygiene/title, senza segreti e senza deploy.
- **Rischio: branch protection blocchi manutenzione urgente.** Mitigazione: repo privata con maintainer owner; eventuali eccezioni devono essere motivate in PR o commit.

## Follow-Up

- Definire policy versioning/release solo quando ci sarà un flusso release reale.
- Creare runbook deploy solo quando il target sarà deciso.
- Valutare automazioni aggiuntive solo se servono e restano coerenti con privacy, costi e perimetro TRAM.
