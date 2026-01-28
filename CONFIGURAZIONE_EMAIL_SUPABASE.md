# 📧 Configurazione Email di Conferma Supabase

## ⚠️ Problema: Email di Conferma Non Ricevute

Se gli utenti non ricevono le email di conferma dopo la registrazione, probabilmente le email non sono configurate correttamente in Supabase.

## 🔧 Soluzione: Configurare le Email in Supabase

### Opzione 1: Usare il Provider Email Predefinito di Supabase (Limitato)

**Limitazioni:**
- Solo 3 email al giorno in sviluppo
- Solo per email di verifica e reset password
- Non adatto per produzione

**Come abilitare:**
1. Vai su [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il tuo progetto
3. Vai su **Authentication** → **Email Templates**
4. Verifica che i template siano configurati

### Opzione 2A: Integrazione Diretta Resend (⭐ CONSIGLIATA - Più Semplice)

**Vantaggi:**
- ✅ Configurazione automatica
- ✅ Gestita direttamente da Resend
- ✅ Migliore deliverability
- ✅ Nessuna configurazione SMTP manuale
- ✅ Setup in 2 minuti

**Come configurare:**

1. Vai su [Resend Integrations](https://resend.com/settings/integrations)
2. Clicca **"Connect to Supabase"**
3. Segui le istruzioni sullo schermo
4. Seleziona il tuo progetto Supabase
5. Autorizza la connessione

**Fatto!** L'integrazione è automatica e le email dovrebbero funzionare immediatamente.

---

### Opzione 2B: Configurare SMTP Personalizzato (Alternativa)

**Quando usare:**
- Se l'integrazione diretta non è disponibile
- Se preferisci controllo manuale completo
- Per configurazioni avanzate

**Vantaggi:**
- Nessun limite di email
- Controllo completo sui template
- Migliore deliverability

**Come configurare:**

1. **Vai su Supabase Dashboard**
   - Seleziona il tuo progetto
   - Vai su **Project Settings** → **Auth** → **SMTP Settings**

2. **Configura SMTP Provider**

   **Per Resend (Consigliato - ⭐ USA QUESTO):**
   
   **Passo 1: Ottieni la tua API Key di Resend**
   1. Vai su [Resend Dashboard](https://resend.com/api-keys)
   2. Crea una nuova API Key (se non ne hai già una)
   3. Copia la chiave (inizia con `re_...`)
   
   **Passo 2: Configura in Supabase**
   ```
   SMTP Host: smtp.resend.com
   SMTP Port: 587 (TLS) - ⚠️ Usa 587, non 465
   SMTP User: resend
   SMTP Password: [La tua RESEND_API_KEY - es: re_abc123...]
   Sender Email: info@imment.it (o notifications@imment.it se verificato)
   Sender Name: Academy Imment
   ```
   
   **⚠️ IMPORTANTE:**
   - La **SMTP Password** è la tua **RESEND_API_KEY** completa (inizia con `re_`)
   - Il **Sender Email** deve essere da un dominio verificato su Resend
   - Se non hai ancora verificato `imment.it`, puoi usare temporaneamente `onboarding@resend.dev` per test

   **Per SendGrid:**
   ```
   SMTP Host: smtp.sendgrid.net
   SMTP Port: 587
   SMTP User: apikey
   SMTP Password: [La tua SENDGRID_API_KEY]
   Sender Email: notifications@imment.it
   ```

   **⚠️ NON USARE GMAIL per Produzione:**
   - Gmail non è progettato per email transazionali
   - Google può bloccare le email o limitare la deliverability
   - Il warning che vedi in Supabase è corretto: "Email deliverability may be impacted"
   - **Usa Resend invece** per una soluzione professionale

3. **Verifica il Dominio (per Resend) - OBBLIGATORIO**
   
   **Opzione A: Usa dominio verificato (Consigliato)**
   1. Vai su [Resend Dashboard](https://resend.com/domains)
   2. Clicca **"Add Domain"**
   3. Inserisci `imment.it` (o il tuo dominio)
   4. Configura i record DNS nel tuo provider DNS (GoDaddy, Cloudflare, etc.)
   5. Attendi la verifica (15-30 minuti tipicamente)
   6. Una volta verificato, usa `info@imment.it` o `notifications@imment.it` come Sender Email
   
   **Opzione B: Usa dominio di test (Solo per sviluppo)**
   - Puoi usare temporaneamente `onboarding@resend.dev` come Sender Email
   - Questo dominio è già verificato da Resend
   - ⚠️ **Non usare in produzione** - solo per test
   
   **Guida completa verifica dominio:** Vedi `GUIDA_VERIFICA_DOMINIO_RESEND.md`

4. **Testa la Configurazione**
   - Vai su **Authentication** → **Users**
   - Crea un utente di test
   - Verifica che riceva l'email di conferma

## 🔍 Verifica Configurazione

### Controlla le Impostazioni Auth

1. Vai su **Authentication** → **URL Configuration**
2. Verifica che **Site URL** sia configurato correttamente:
   ```
   https://tuo-dominio.vercel.app
   ```
3. Verifica che **Redirect URLs** includa:
   ```
   https://tuo-dominio.vercel.app/verify-email
   https://tuo-dominio.vercel.app/**
   ```

### Controlla i Template Email

1. Vai su **Authentication** → **Email Templates**
2. Verifica che i template siano configurati:
   - **Confirm signup** - Template per email di conferma
   - **Magic Link** - Template per magic link
   - **Change Email Address** - Template per cambio email
   - **Reset Password** - Template per reset password

## 🚨 Troubleshooting

### Email Non Arrivano

1. **Controlla la cartella Spam**
   - Le email potrebbero essere finite nello spam
   - Aggiungi `notifications@imment.it` ai contatti

2. **Verifica i Log di Supabase**
   - Vai su **Logs** → **Auth Logs**
   - Cerca errori relativi all'invio email

3. **Verifica la Configurazione SMTP**
   - Controlla che le credenziali SMTP siano corrette
   - Verifica che il dominio sia verificato (per Resend)

4. **Testa Manualmente**
   - Usa l'API di Supabase per inviare una email di test
   - Verifica che il provider SMTP funzioni

### Errore 400 durante Registrazione

**Possibili cause:**
- Email già registrata → L'utente deve fare login invece di registrarsi
- Password non valida → Deve essere almeno 6 caratteri
- Email non valida → Formato email errato
- Configurazione SMTP errata → Verifica le credenziali SMTP

**Soluzione:**
- Il codice ora mostra messaggi di errore più chiari
- Controlla la console del browser per dettagli
- Verifica i log di Supabase per errori server-side

### Errore 500 durante Registrazione ⚠️ CRITICO

**Messaggio:** `Failed to load resource: the server responded with a status of 500 ()`

**Possibili cause:**
1. **Configurazione SMTP errata o non funzionante** (più comune)
   - Gmail non configurato correttamente
   - Credenziali SMTP errate
   - Provider SMTP non raggiungibile

2. **Problema con i trigger del database**
   - La funzione `handle_new_user()` potrebbe fallire
   - Problema con la tabella `public.users`

3. **Problema con la configurazione Supabase**
   - Site URL non configurato correttamente
   - Redirect URLs non configurati

**Soluzione Passo-Passo:**

1. **Verifica i Log di Supabase:**
   - Vai su **Logs** → **Auth Logs** nel dashboard Supabase
   - Cerca errori specifici durante la registrazione
   - Controlla se ci sono errori relativi a SMTP o database

2. **Verifica Configurazione SMTP:**
   - Vai su **Project Settings** → **Auth** → **SMTP Settings**
   - **⚠️ Se stai usando Gmail:** Passa a Resend (vedi `QUICK_START_RESEND_SUPABASE.md`)
   - Verifica che tutte le credenziali siano corrette
   - Testa la connessione SMTP

3. **Verifica Site URL:**
   - Vai su **Authentication** → **URL Configuration**
   - Verifica che **Site URL** sia: `https://learning.imment.it`
   - Verifica che **Redirect URLs** includa: `https://learning.imment.it/**`

4. **Verifica Trigger Database:**
   - Vai su **SQL Editor** in Supabase
   - Esegui questa query per verificare che il trigger esista:
     ```sql
     SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
     ```
   - Se non esiste, esegui la migration `20250116000001_sync_auth_users_to_public_users.sql`

5. **Test Rapido:**
   - Prova a registrarti con un'email completamente nuova
   - Se funziona → Il problema era con l'email specifica
   - Se non funziona → Il problema è nella configurazione SMTP

**Soluzione Immediata:**
- **Passa a Resend** seguendo `QUICK_START_RESEND_SUPABASE.md`
- Gmail non è affidabile per email transazionali e spesso causa errori 500

## 📝 Note Importanti

- **In sviluppo locale:** Le email potrebbero non funzionare senza configurazione SMTP
- **In produzione:** È **obbligatorio** configurare SMTP per inviare email
- **Limiti Supabase:** Il provider predefinito ha limiti molto bassi (3 email/giorno)
- **Resend:** Consigliato per produzione, ha un piano gratuito generoso

## 🔗 Link Utili

- [Supabase Email Configuration](https://supabase.com/docs/guides/auth/auth-email)
- [Resend Documentation](https://resend.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Supabase SMTP Settings](https://supabase.com/docs/guides/auth/auth-smtp)
