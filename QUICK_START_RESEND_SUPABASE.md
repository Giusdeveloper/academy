# 🚀 Quick Start: Configurare Resend in Supabase (5 minuti)

## ⚠️ Problema Attuale

Stai usando **Gmail** come provider SMTP, che **non è adatto** per email transazionali. Questo causa:
- ❌ Email di conferma non ricevute
- ❌ Bassa deliverability
- ❌ Possibili blocchi da parte di Google

## ✅ Soluzione: Passa a Resend

### ⭐ Opzione A: Integrazione Diretta (Consigliata - Più Semplice)

**Vantaggi:**
- ✅ Configurazione automatica
- ✅ Gestita direttamente da Resend
- ✅ Migliore deliverability
- ✅ Nessuna configurazione SMTP manuale

**Come fare:**
1. Vai su [Resend Integrations](https://resend.com/settings/integrations)
2. Clicca **"Connect to Supabase"**
3. Segui le istruzioni sullo schermo
4. Seleziona il tuo progetto Supabase
5. Autorizza la connessione

**Fatto!** L'integrazione è automatica e le email dovrebbero funzionare immediatamente.

---

### Opzione B: Configurazione SMTP Manuale (Alternativa)

Se preferisci configurare manualmente o l'integrazione diretta non è disponibile:

### Passo 1: Crea Account Resend (2 minuti)

1. Vai su [resend.com](https://resend.com)
2. Clicca **"Sign Up"** (gratuito)
3. Crea un account con la tua email
4. Verifica la tua email

### Passo 2: Ottieni API Key (1 minuto)

1. Una volta loggato, vai su [API Keys](https://resend.com/api-keys)
2. Clicca **"Create API Key"**
3. Dai un nome (es: "Supabase SMTP")
4. Copia la chiave (inizia con `re_...`) - **⚠️ Salvala subito, non la vedrai più!**

### Passo 3: Configura in Supabase (2 minuti)

1. Vai su [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il tuo progetto
3. Vai su **Project Settings** → **Auth** → **SMTP Settings**
4. Compila i campi:

   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 587
   SMTP User: resend
   SMTP Password: [Incolla qui la tua RESEND_API_KEY - es: re_abc123...]
   Sender Email: onboarding@resend.dev (per ora, per test)
   Sender Name: Academy Imment
   Minimum interval per user: 60
   ```

5. Clicca **"Save"**

### Passo 4: Testa la Configurazione (1 minuto)

1. Vai su **Authentication** → **Users**
2. Crea un nuovo utente di test
3. Controlla se ricevi l'email di conferma
4. Se funziona ✅, passa al Passo 5

### Passo 5: Verifica il Tuo Dominio (Opzionale ma Consigliato)

Per usare `info@imment.it` invece di `onboarding@resend.dev`:

1. Vai su [Resend Domains](https://resend.com/domains)
2. Clicca **"Add Domain"**
3. Inserisci `imment.it`
4. Configura i record DNS nel tuo provider DNS (vedi `GUIDA_VERIFICA_DOMINIO_RESEND.md`)
5. Attendi la verifica (15-30 minuti)
6. Torna in Supabase e cambia **Sender Email** da `onboarding@resend.dev` a `info@imment.it`

## ✅ Risultato

- ✅ Email di conferma funzionanti
- ✅ Migliore deliverability
- ✅ Nessun limite di email (piano gratuito generoso)
- ✅ Professionale e affidabile

## 🔍 Verifica che Funzioni

1. Prova a registrarti con una nuova email
2. Controlla la casella di posta (anche spam)
3. Dovresti ricevere l'email di conferma entro pochi secondi

## ❓ Problemi?

### Errore 500 durante Registrazione

Se vedi questo errore in console:
```
Failed to load resource: the server responded with a status of 500 ()
```

**Causa:** Configurazione SMTP errata o non funzionante (spesso Gmail)

**Soluzione:**
1. Segui questa guida per configurare Resend
2. Verifica i log di Supabase: **Logs** → **Auth Logs**
3. Controlla che la RESEND_API_KEY sia corretta

### Altri Problemi

- **Email non arriva?** Controlla la cartella spam
- **Errore SMTP?** Verifica che la RESEND_API_KEY sia corretta (deve iniziare con `re_`)
- **Dominio non verificato?** Usa temporaneamente `onboarding@resend.dev`
- **Errore 400?** Verifica che l'email non sia già registrata

## 📚 Documentazione Completa

- `CONFIGURAZIONE_EMAIL_SUPABASE.md` - Guida completa
- `GUIDA_VERIFICA_DOMINIO_RESEND.md` - Come verificare il dominio
