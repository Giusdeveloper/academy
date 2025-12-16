# Guida Verifica Dominio Resend - GoDaddy

Guida passo-passo per verificare il dominio su Resend usando GoDaddy come provider DNS.

## 🚀 Passo 1: Accedi a Resend e Aggiungi il Dominio

1. Vai su https://resend.com/login e accedi
2. Vai su https://resend.com/domains
3. Clicca **"Add Domain"**
4. Inserisci il tuo dominio (es. `imment.it`) - **SENZA** www o https
5. Clicca **"Add"**

## 🚀 Passo 2: Copia i Record DNS da Resend

Dopo aver aggiunto il dominio, Resend ti mostrerà i record DNS da configurare. Dovresti vedere qualcosa come:

```
Record Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all

Record Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC... (valore lungo)
```

**IMPORTANTE**: Copia TUTTI i valori esattamente come mostrati da Resend.

## 🚀 Passo 3: Accedi a GoDaddy DNS

1. Vai su https://dcc.godaddy.com
2. Accedi con le tue credenziali GoDaddy
3. Se vedi una lista di domini, clicca sul dominio che vuoi verificare (es. `imment.it`)
4. Nella pagina del dominio, scorri fino alla sezione **"DNS"** o **"DNS Records"**
5. Clicca su **"Manage DNS"** o **"Gestisci DNS"**

## 🚀 Passo 4: Aggiungi il Record SPF (TXT)

1. Nella sezione **"Records"**, trova la tabella con i record DNS esistenti
2. Scorri fino alla sezione **"TXT (Text)"** o cerca il pulsante **"Add"** o **"Aggiungi"**
3. Clicca su **"Add"** per aggiungere un nuovo record
4. Compila i campi:
   - **Type** (Tipo): Seleziona **"TXT"**
   - **Name** (Nome): Inserisci **`@`** (simbolo chiocciola) oppure lascia vuoto
   - **Value** (Valore): Incolla il valore SPF da Resend: `v=spf1 include:resend.com ~all`
   - **TTL**: Lascia **600** (o il valore di default)
5. Clicca **"Save"** o **"Salva"**

**Nota**: Se esiste già un record TXT con Name `@`, potresti dover modificarlo invece di aggiungerne uno nuovo. In tal caso, aggiungi `include:resend.com` al valore esistente.

## 🚀 Passo 5: Aggiungi il Record DKIM (TXT)

1. Clicca di nuovo su **"Add"** per aggiungere un altro record
2. Compila i campi:
   - **Type** (Tipo): Seleziona **"TXT"**
   - **Name** (Nome): Inserisci **`resend._domainkey`** (esattamente come mostrato da Resend)
   - **Value** (Valore): Incolla il valore DKIM completo da Resend (è un valore molto lungo che inizia con `p=MIGfMA0GCSqGSIb3...`)
   - **TTL**: Lascia **600** (o il valore di default)
3. Clicca **"Save"** o **"Salva"**

**IMPORTANTE**: Assicurati di copiare TUTTO il valore DKIM, anche se è molto lungo. Non tagliare nessuna parte.

## 🚀 Passo 6: Aggiungi il Record DMARC (TXT) - Opzionale ma Consigliato

1. Clicca di nuovo su **"Add"** per aggiungere un altro record
2. Compila i campi:
   - **Type** (Tipo): Seleziona **"TXT"**
   - **Name** (Nome): Inserisci **`_dmarc`**
   - **Value** (Valore): Inserisci `v=DMARC1; p=none; rua=mailto:dmarc@imment.it` (sostituisci `imment.it` con il tuo dominio)
   - **TTL**: Lascia **600** (o il valore di default)
3. Clicca **"Save"** o **"Salva"**

## 🚀 Passo 7: Verifica i Record Aggiunti

Dopo aver salvato tutti i record, dovresti vedere nella lista:

```
Type    Name                Value
TXT     @                   v=spf1 include:resend.com ~all
TXT     resend._domainkey   p=MIGfMA0GCSqGSIb3... (valore lungo)
TXT     _dmarc              v=DMARC1; p=none; rua=mailto:dmarc@imment.it
```

## 🚀 Passo 8: Attendi la Propagazione DNS

- I record DNS possono richiedere da **15 minuti a 48 ore** per propagarsi
- Tipicamente richiede **15-30 minuti** con GoDaddy
- Puoi verificare la propagazione usando:
  - https://mxtoolbox.com/SuperTool.aspx (inserisci il tuo dominio)
  - https://dnschecker.org (cerca i record TXT)

## 🚀 Passo 9: Verifica il Dominio su Resend

1. Torna su https://resend.com/domains
2. Dovresti vedere il tuo dominio con lo stato **"Pending"** o **"Verifying"**
3. Clicca su **"Verify"** o attendi che Resend verifichi automaticamente
4. Se vedi errori, clicca su **"Retry"** dopo qualche minuto
5. Una volta verificato, vedrai uno stato **"Verified"** con un segno di spunta verde ✅

## 🚀 Passo 10: Aggiorna il File .env.local

Una volta verificato il dominio, aggiorna il file `.env.local`:

```env
ADMIN_EMAIL=info@imment.it
RESEND_API_KEY=re_tua_api_key_qui
RESEND_FROM_EMAIL=notifications@imment.it
```

**Nota**: Sostituisci `imment.it` con il tuo dominio verificato.

## 🚀 Passo 11: Riavvia il Server e Testa

1. Riavvia il server di sviluppo (`npm run dev`)
2. Esegui il test di completamento corso
3. Controlla il terminale per conferma: `✅ Email di notifica inviata con successo`
4. Controlla la tua email (`info@imment.it`)

## ⚠️ Problemi Comuni con GoDaddy

### Il record non si salva
- Assicurati di aver cliccato **"Save"** dopo ogni record
- Controlla che non ci siano caratteri speciali non validi nel valore
- Prova a salvare un record alla volta

### Il dominio non si verifica dopo 30 minuti
- Verifica che i record siano stati salvati correttamente su GoDaddy
- Controlla che i valori siano identici a quelli mostrati da Resend
- Usa https://mxtoolbox.com/SuperTool.aspx per verificare che i record siano visibili pubblicamente

### Errore "Record already exists"
- Se esiste già un record TXT con lo stesso Name, devi modificarlo invece di aggiungerne uno nuovo
- Per il record SPF (`@`), aggiungi `include:resend.com` al valore esistente

## 📞 Supporto

- GoDaddy Support: https://www.godaddy.com/help
- Resend Support: support@resend.com
- Resend Docs: https://resend.com/docs

---

**Buona fortuna! 🚀**

