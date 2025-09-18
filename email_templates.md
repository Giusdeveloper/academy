# Template Email per Academy

## Email di Conferma Registrazione

**Oggetto:** Benvenuto in Academy - Conferma il tuo account

**Testo:**

```
Ciao {{ .Name }},

Benvenuto in Academy! 🎓

Grazie per esserti registrato alla nostra piattaforma di formazione online. 
Per completare la registrazione e accedere ai nostri corsi, conferma il tuo indirizzo email cliccando sul pulsante qui sotto.

[CONFERMA ACCOUNT]

Se il pulsante non funziona, copia e incolla questo link nel tuo browser:
{{ .ConfirmationURL }}

Una volta confermato il tuo account, potrai:
✅ Accedere a tutti i corsi disponibili
✅ Tracciare i tuoi progressi
✅ Completare quiz e verifiche
✅ Ottenere certificati di completamento

Se non hai richiesto questa registrazione, puoi ignorare questa email.

Buon apprendimento!

Il Team di Academy
```

## Email di Reset Password

**Oggetto:** Reset Password - Academy

**Testo:**

```
Ciao {{ .Name }},

Hai richiesto di reimpostare la password per il tuo account Academy.

Clicca sul pulsante qui sotto per creare una nuova password:

[REIMPOSTA PASSWORD]

Se il pulsante non funziona, copia e incolla questo link nel tuo browser:
{{ .ConfirmationURL }}

Questo link è valido per 24 ore per motivi di sicurezza.

Se non hai richiesto il reset della password, puoi ignorare questa email.

Il Team di Academy
```

## Email di Invito

**Oggetto:** Sei stato invitato a unirti ad Academy

**Testo:**

```
Ciao,

{{ .InvitedBy }} ti ha invitato a unirti ad Academy, la nostra piattaforma di formazione online.

Clicca sul pulsante qui sotto per accettare l'invito e creare il tuo account:

[ACCETTA INVITO]

Se il pulsante non funziona, copia e incolla questo link nel tuo browser:
{{ .ConfirmationURL }}

Con Academy potrai:
🎓 Accedere a corsi di alta qualità
📊 Tracciare i tuoi progressi
🏆 Ottenere certificati di completamento
👥 Partecipare alla community

Il Team di Academy
```
