# Guida alla Verifica del Dominio su Resend

Questa guida ti aiuterà a verificare il tuo dominio su Resend per poter inviare email dal tuo dominio personalizzato.

## 📋 Prerequisiti

- Account Resend attivo (https://resend.com)
- Accesso al pannello di controllo DNS del tuo dominio (es. Cloudflare, GoDaddy, Namecheap, ecc.)
- Il dominio che vuoi verificare (es. `imment.it`)

## 🚀 Passo 1: Accedi a Resend

1. Vai su https://resend.com/login
2. Accedi con il tuo account (Google, GitHub o email/password)

## 🚀 Passo 2: Vai alla Sezione Domini

1. Dopo il login, vai su https://resend.com/domains
2. Clicca sul pulsante **"Add Domain"** o **"Aggiungi Dominio"**

## 🚀 Passo 3: Aggiungi il Tuo Dominio

1. Inserisci il tuo dominio (es. `imment.it`)
   - **IMPORTANTE**: Inserisci SOLO il dominio, senza `www` o `http://`
   - Esempio corretto: `imment.it`
   - Esempio sbagliato: `www.imment.it` o `https://imment.it`

2. Clicca su **"Add"** o **"Aggiungi"**

## 🚀 Passo 4: Configura i Record DNS

Resend ti mostrerà i record DNS che devi aggiungere. Tipicamente sono:

### Record SPF (TXT)
```
Tipo: TXT
Nome: @ (o lasciare vuoto, dipende dal provider DNS)
Valore: v=spf1 include:resend.com ~all
TTL: 3600 (o default)
```

### Record DKIM (TXT)
```
Tipo: TXT
Nome: resend._domainkey (o resend._domainkey.imment.it)
Valore: [un valore lungo fornito da Resend, simile a: p=MIGfMA0GCSqGSIb3...]
TTL: 3600 (o default)
```

### Record DMARC (TXT) - Opzionale ma Consigliato
```
Tipo: TXT
Nome: _dmarc (o _dmarc.imment.it)
Valore: v=DMARC1; p=none; rua=mailto:dmarc@imment.it
TTL: 3600 (o default)
```

## 🚀 Passo 5: Aggiungi i Record nel Tuo Provider DNS

### Se usi Cloudflare:
1. Vai su https://dash.cloudflare.com
2. Seleziona il tuo dominio
3. Vai su **"DNS"** → **"Records"**
4. Clicca **"Add record"**
5. Per ogni record:
   - Seleziona il **Tipo** (TXT)
   - Inserisci il **Nome** (es. `@` o `resend._domainkey`)
   - Inserisci il **Valore** (copiato da Resend)
   - Lascia **TTL** su Auto o 3600
   - Clicca **"Save"**

### Se usi GoDaddy:
1. Vai su https://dcc.godaddy.com
2. Seleziona il tuo dominio
3. Vai su **"DNS"**
4. Clicca **"Add"** per ogni record
5. Inserisci i valori come indicato da Resend

### Se usi Namecheap:
1. Vai su https://www.namecheap.com/myaccount/login/
2. Vai su **"Domain List"** → Seleziona il dominio
3. Clicca su **"Advanced DNS"**
4. Aggiungi i record TXT nella sezione **"Host Records"**

### Se usi un altro provider:
Cerca nel pannello di controllo del tuo provider la sezione **"DNS"**, **"Zone Records"** o **"DNS Management"** e aggiungi i record TXT come indicato.

## 🚀 Passo 6: Attendi la Propagazione DNS

- I record DNS possono richiedere da **pochi minuti a 48 ore** per propagarsi
- Tipicamente richiede **15-30 minuti**
- Puoi verificare la propagazione usando:
  - https://mxtoolbox.com/SuperTool.aspx
  - https://dnschecker.org

## 🚀 Passo 7: Verifica il Dominio su Resend

1. Torna su https://resend.com/domains
2. Dovresti vedere il tuo dominio con lo stato **"Pending"** o **"Verifying"**
3. Clicca su **"Verify"** o attendi che Resend verifichi automaticamente
4. Una volta verificato, vedrai uno stato **"Verified"** con un segno di spunta verde ✅

## 🚀 Passo 8: Aggiorna il File .env.local

Una volta verificato il dominio, aggiorna il file `.env.local`:

```env
ADMIN_EMAIL=info@imment.it
RESEND_API_KEY=re_tua_api_key_qui
RESEND_FROM_EMAIL=notifications@imment.it
```

**Nota**: Sostituisci `imment.it` con il tuo dominio verificato.

## 🚀 Passo 9: Testa l'Invio Email

1. Riavvia il server di sviluppo (`npm run dev`)
2. Esegui il test di completamento corso
3. Controlla il terminale per conferma: `✅ Email di notifica inviata con successo`
4. Controlla la tua email (`info@imment.it`)

## ❓ Problemi Comuni

### Il dominio non si verifica dopo 24 ore
- Verifica che i record DNS siano configurati correttamente
- Assicurati che non ci siano errori di sintassi nei valori
- Controlla che il TTL non sia troppo alto (usa 3600 o Auto)

### Errore "Domain already exists"
- Il dominio potrebbe essere già aggiunto in un altro account Resend
- Contatta il supporto Resend se necessario

### I record DNS non si propagano
- Verifica di aver salvato correttamente i record nel provider DNS
- Controlla che non ci siano record DNS duplicati o in conflitto
- Attendi più tempo (fino a 48 ore)

## 📞 Supporto

Se hai problemi:
- Documentazione Resend: https://resend.com/docs
- Supporto Resend: support@resend.com
- Dashboard Resend: https://resend.com/domains

## ✅ Checklist Finale

- [ ] Account Resend creato e attivo
- [ ] Dominio aggiunto su Resend
- [ ] Record SPF configurato nel DNS
- [ ] Record DKIM configurato nel DNS
- [ ] Record DMARC configurato (opzionale)
- [ ] Dominio verificato su Resend (stato "Verified")
- [ ] File `.env.local` aggiornato con il nuovo dominio
- [ ] Server di sviluppo riavviato
- [ ] Test email completato con successo

---

**Buona fortuna! 🚀**

