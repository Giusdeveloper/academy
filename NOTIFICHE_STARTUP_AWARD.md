# Sistema di Notifiche - Startup Award

Questo documento spiega come configurare le notifiche quando un utente completa il corso Startup Award.

## 🔔 Tipi di Notifiche Supportate

Il sistema supporta quattro tipi di notifiche:

1. **Log Console** (sempre attivo) - Log nella console del server
2. **Email all'Admin** (opzionale) - Email all'admin quando un corso viene completato
3. **Email all'Utente** (automatica) - Email di congratulazioni all'utente che completa il corso
4. **Webhook** (opzionale) - Chiamata HTTP a un endpoint esterno (Slack, Discord, Zapier, ecc.)

## ⚙️ Configurazione

### 1. Email Notifications

Il sistema invia **due tipi di email** quando un utente completa il corso:

- **Email all'Admin**: Notifica per te quando un utente completa il corso (opzionale)
- **Email all'Utente**: Email di congratulazioni automatica all'utente (sempre inviata se Resend è configurato)

Per configurare le email, configura Resend:

#### Setup Resend

1. **Crea un account su Resend**:
   - Vai su https://resend.com
   - Crea un account gratuito (100 email/giorno nel free tier)
   - Verifica il tuo dominio o usa il dominio di test `onboarding.resend.dev`

2. **Ottieni la API Key**:
   - Vai su https://resend.com/api-keys
   - Crea una nuova API Key
   - Copia la chiave (inizia con `re_...`)

3. **Configura le variabili d'ambiente**:
   
   Aggiungi nel file `.env.local`:
   ```env
   # Email all'admin (opzionale - solo se vuoi ricevere notifiche)
   ADMIN_EMAIL=tuo-email@example.com
   
   # API Key di Resend (obbligatoria per inviare email)
   RESEND_API_KEY=re_tua_api_key_qui
   
   # Indirizzo email mittente (deve usare un dominio verificato)
   RESEND_FROM_EMAIL=notifications@imment.it
   
   # URL dell'applicazione (opzionale - per i link nelle email)
   NEXT_PUBLIC_APP_URL=https://learning.imment.it/
   ```
   
   **⚠️ IMPORTANTE**: Il dominio `onboarding.resend.dev` richiede verifica. Per usarlo:
   
   1. Vai su https://resend.com/domains
   2. Verifica il dominio `onboarding.resend.dev` (se disponibile)
   3. Oppure aggiungi e verifica il tuo dominio personale
   
   **Alternativa**: Verifica l'email destinatario nel dashboard Resend:
   - Vai su https://resend.com/emails
   - Aggiungi l'email destinatario come email verificata
   - Questo permette di ricevere email anche senza dominio verificato (solo per test)

#### Verifica Dominio (Opzionale ma Consigliato)

Per inviare email da un dominio personalizzato:

1. Vai su https://resend.com/domains
2. Aggiungi il tuo dominio
3. Configura i record DNS come indicato
4. Una volta verificato, usa il tuo dominio in `RESEND_FROM_EMAIL`

### 2. Email all'Utente (Automatica)

Quando un utente completa il corso, riceve automaticamente un'email di congratulazioni con:

- 🎉 Messaggio di congratulazioni personalizzato
- ✨ Riepilogo di ciò che ha raggiunto
- 📋 Dettagli del completamento (corso, data, fase)
- 🚀 Call-to-action per accedere alla dashboard
- 🔗 Link diretto alla dashboard

**Non richiede configurazione aggiuntiva**: Se `RESEND_API_KEY` e `RESEND_FROM_EMAIL` sono configurati, l'email viene inviata automaticamente.

#### Template Email Utente

L'email include:
- Design moderno con gradiente rosa/viola (#9e005c → #c2185b)
- Sezione "Cosa hai raggiunto" con lista dei traguardi
- Dettagli completi del completamento
- Box informativo sui prossimi passi
- Pulsante CTA per accedere alla dashboard
- Versione HTML responsive e testo semplice

### 3. Webhook Notification

Per ricevere notifiche via webhook (Slack, Discord, Zapier, ecc.), aggiungi nel file `.env.local`:

```env
WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
WEBHOOK_SECRET=your-secret-key-optional
```

#### Esempio: Slack

1. Crea un nuovo webhook in Slack:
   - Vai su https://api.slack.com/apps
   - Crea una nuova app
   - Vai su "Incoming Webhooks"
   - Attiva "Activate Incoming Webhooks"
   - Aggiungi un nuovo webhook al tuo workspace
   - Copia l'URL del webhook

2. Aggiungi nel `.env.local`:
   ```env
   WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

3. Il messaggio inviato sarà:
   ```json
   {
     "event": "course_completed",
     "timestamp": "2025-01-01T12:00:00Z",
     "data": {
       "user": {
         "email": "user@example.com",
         "name": "Nome Utente",
         "id": "user-id-uuid"
       },
       "course": {
         "id": "course-id-uuid",
         "title": "Finanziamento Aziendale"
       },
       "completed_at": "2025-01-01T12:00:00Z",
       "phase1_completed_at": "2025-01-01T12:00:00Z"
     }
   }
   ```

#### Esempio: Discord

1. Crea un webhook in Discord:
   - Vai su Impostazioni Server → Integrazioni → Webhook
   - Clicca "Nuovo Webhook"
   - Copia l'URL del webhook

2. Aggiungi nel `.env.local`:
   ```env
   WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/WEBHOOK/URL
   ```

## 🧪 Test delle Notifiche

### Test Completo con Reset

Per testare il sistema di notifiche completo:

1. **Reset dei progressi** (se hai già completato il corso):
   ```javascript
   fetch('/api/startup-award/test-reset', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ 
       email: 'pistoia702@gmail.com',
       courseSlug: 'finanziamento-aziendale'
     })
   })
   .then(r => r.json())
   .then(console.log);
   ```

2. **Simula il completamento** (questo invierà le notifiche):
   ```javascript
   fetch('/api/startup-award/test-complete', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ 
       email: 'pistoia702@gmail.com',
       courseSlug: 'finanziamento-aziendale'
     })
   })
   .then(r => r.json())
   .then(console.log);
   ```

3. **Verifica le notifiche**:
   - Controlla i log del server per vedere le notifiche inviate
   - Controlla la tua email admin (se `ADMIN_EMAIL` è configurato)
   - Controlla l'email dell'utente (l'email di congratulazioni viene inviata automaticamente)
   - Controlla il webhook (se configurato)

### Test Manuale

Puoi testare le notifiche usando l'endpoint di test:

```bash
POST /api/startup-award/test-complete
Content-Type: application/json

{
  "email": "test@example.com",
  "userId": "user-id-uuid",
  "courseSlug": "finanziamento-aziendale"
}
```

Oppure dalla console del browser:

```javascript
fetch('/api/startup-award/test-complete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'test@example.com',
    userId: 'user-id-uuid',
    courseSlug: 'finanziamento-aziendale'
  })
})
.then(r => r.json())
.then(console.log);
```

### Verifica Logs

Controlla i log del server per vedere le notifiche:

```bash
# Dovresti vedere:
🔔 NOTIFICA COMPLETAMENTO CORSO: { user: '...', course: '...', completedAt: '...' }
📧 Email notification (da implementare): { ... }
✅ Webhook notification inviata con successo
```

## 📧 Email già Implementate!

L'invio email è già implementato usando **Resend**. Basta configurare le variabili d'ambiente come descritto sopra.

### Formato Email Admin

L'email all'admin include:
- Header con gradiente viola/rosa
- Dettagli completi del completamento (utente, corso, data)
- Badge "Fase 1 Completata"
- Nota sul prossimo passo (Fase 2)
- User ID e Course ID per riferimento
- Versione HTML e testo semplice

### Formato Email Utente

L'email all'utente include:
- Header celebrativo con gradiente rosa/viola
- Messaggio di congratulazioni personalizzato
- Sezione "Cosa hai raggiunto" con lista dei traguardi
- Dettagli del completamento (corso, data, fase)
- Box informativo sui prossimi passi
- Pulsante CTA per accedere alla dashboard
- Versione HTML responsive e testo semplice

### Test Email

Puoi testare l'invio email usando l'endpoint di test. Assicurati di aver configurato:
- `RESEND_API_KEY` nel `.env.local` (obbligatorio)
- `RESEND_FROM_EMAIL` nel `.env.local` (obbligatorio, deve usare un dominio verificato)
- `ADMIN_EMAIL` nel `.env.local` (opzionale, solo se vuoi ricevere notifiche)
- `NEXT_PUBLIC_APP_URL` nel `.env.local` (opzionale, per i link nelle email)

Quando un corso viene completato, vedrai nei log:
```
📧 Invio email di congratulazioni all'utente...
✅ Email di congratulazioni inviata all'utente: email-id
📧 Configurazione email admin trovata, invio notifica email...
✅ Email di notifica inviata con successo: email-id
```

Se Resend non è configurato, vedrai invece:
```
📧 Email utente (Resend non configurato): { ... }
💡 Per inviare email reali, configura RESEND_API_KEY e RESEND_FROM_EMAIL nel .env.local
```

## 🔒 Sicurezza

- **WEBHOOK_SECRET**: Usa questo per autenticare le richieste webhook se necessario
- **ADMIN_EMAIL**: Assicurati che sia un'email valida e sicura
- Non committare mai il file `.env.local` nel repository

## 📝 Note

- Le notifiche vengono inviate **solo quando il corso viene completato per la prima volta**
- Se una notifica fallisce, il processo di completamento non viene interrotto
- Tutte le notifiche vengono eseguite in parallelo per migliorare le performance
- L'email all'utente viene inviata automaticamente se Resend è configurato (non richiede `ADMIN_EMAIL`)
- L'email all'admin viene inviata solo se `ADMIN_EMAIL` è configurato nel `.env.local`
- Il dominio in `RESEND_FROM_EMAIL` deve essere verificato su Resend prima di poter inviare email

