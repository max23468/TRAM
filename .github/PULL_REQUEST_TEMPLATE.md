<!--
  Compila le sezioni sotto prima della review.
  Le regole operative principali sono in AGENTS.md e docs/OPERATIONS.md.
-->

## Cosa cambia

<!-- Una/due frasi: cosa cambia dal punto di vista di chi usa o mantiene TRAM. -->

## Perché

<!-- Problema risolto, decisione applicata, issue collegata o contesto. -->

Closes #

## Tipo di modifica

- [ ] Bugfix
- [ ] Nuova funzionalità V1
- [ ] Solo documentazione / governance
- [ ] CI / GitHub / automazioni repo
- [ ] Refactor o lavoro tecnico invisibile
- [ ] Preparazione futura, senza comportamento produttivo

## Pubblicazione, deploy e dati

- [ ] Pubblicazione GitHub/main sufficiente
- [ ] Non richiede deploy
- [ ] Non richiede release/version bump
- [ ] Non introduce provider, runtime, webhook o automazioni produttive
- [ ] Non usa documenti reali o pacchetti riservati come fixture/log/screenshot
- [ ] Richiede decisione documentata prima del merge

## Verifiche eseguite

- [ ] `npm run verify`
- [ ] `git diff --check`
- [ ] Review contenuto documenti toccati
- [ ] Verifica browser desktop/mobile se UI sostanziale
- [ ] Aggiornato `docs/ROADMAP.md` se è cambiato lo stato di una voce
- [ ] Aggiornato `docs/` o ADR se è cambiata una scelta stabile

## Sicurezza e privacy

- [ ] Nessun secret committato
- [ ] Nessuna chiave SSH, `.env`, dump, export o dato reale in Git
- [ ] Nessun invio AI esterno o upload documentale senza policy e consenso
- [ ] Nessun contenuto integrale di documenti gara in log, screenshot o fixture

## Screenshot (se UI)

<!-- Trascina screenshot prima/dopo. Oscura qualunque dato sensibile. -->

## Note per il revisore

<!-- Cosa guardare con attenzione, dubbi aperti, follow-up previsti. -->
