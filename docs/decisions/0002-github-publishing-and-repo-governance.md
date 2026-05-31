# ADR 0002 - Pubblicazione GitHub e governance repository

## Stato

Accettata.

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
- workflow `PR Title` per titoli in formato Conventional Commit.

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

Non si usa branch protection per TRAM finché resta una feature premium sulle repository private. La governance resta basata su branch `codex/<tema>`, PR, review del maintainer, CODEOWNERS, template e workflow di controllo.

## Rischi E Mitigazioni

- **Rischio: pubblicazione accidentale di dati riservati.** Mitigazione: `.gitignore`, workflow `Repo Hygiene`, review PR e divieto esplicito di log/screenshot/fixture con dati reali.
- **Rischio: GitHub venga interpretato come deploy o release.** Mitigazione: decisione D024, questa ADR e checklist PR distinguono pubblicazione, deploy e rilascio.
- **Rischio: automazioni troppo ampie.** Mitigazione: workflow limitati a quality/hygiene/title, senza segreti e senza deploy.
- **Rischio: push diretto accidentale su `main`.** Mitigazione: disciplina operativa repo-first, branch `codex/<tema>` per lavori non banali, PR e controlli GitHub; non rendere pubblica la repo solo per ottenere enforcement premium.

## Follow-Up

- Policy versioning/release definita da `docs/decisions/0003-versioning-release-policy.md`.
- Creare runbook deploy solo quando il target sarà deciso.
- Valutare automazioni aggiuntive solo se servono e restano coerenti con privacy, costi e perimetro TRAM.
