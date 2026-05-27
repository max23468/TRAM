# Hardening tecnico-operativo (2026-05-27)

## Rischio iniziale

- Livello: **medio**.
- Stato in questa ondata: **P1 prioritario**, P2 successivo.
- Rotazione segreti: **non inclusa** in questa fase (esclusa dal piano corrente).

## Contesto operativo rilevante

- Repo con workflow frequenti, pipeline di artifact e roadmap interna sensibile.
- Il confine tra materiale pubblico e interno deve essere esplicito nel documentation base.

## Piano tecnico (P0/P1/P2)

### P1

- Revisione workflow frequenti e artifact pubblicati:
  - verificare che ciò che finisce nel repository pubblico non includa note interne non necessarie.
- Limitare esposizione roadmap/architettura interna se contiene credenziali implicite o dipendenze non decise.
- Aggiungere hardening CI per regressioni su log e monitoraggio:
  - assicurare che le failure diagnostiche siano tracciate con contesto utile.

### P2

- Pulizia failure non bloccanti con priorità tecnica.
- Stabilizzazione notifiche run e gestione alert/skip per eventi operativi rumorosi.
- Rimozione/esclusione progressiva di eventuali residui sensibili nei pacchetti documentali condivisi.

## Piano operativo e di governo

### P1

- Classificare nel repository ciò che è pubblico vs interno:
  - route, script e runbook sensibili.
- Aggiornare `docs/CONTEXT.md`, `docs/OPERATIONS.md` e `docs/ROADMAP.md` quando il perimetro cambia.

### P2

- Mantenere check trimestrale su dipendenze e stato publish con checklist semplificata.
- Registrare eventuali cambi sicurezza in `docs/DECISIONS.md` o backlog operativo.
