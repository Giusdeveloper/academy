# 🚀 Guida Deploy su Vercel

## 📋 Checklist Pre-Deploy

### 1. ✅ Migrations Supabase

Assicurati di aver eseguito tutte le migrations su Supabase:

- [ ] `20250116000002_add_last_name_to_users.sql` (aggiunge campo `last_name`)
- [ ] `20250116000001_sync_auth_users_to_public_users.sql` (trigger sincronizzazione utenti)
- [ ] `20250101000001_create_startup_award_tracking.sql` (tabella tracking Startup Award)

**Come eseguire le migrations:**
1. Vai su Supabase Dashboard → SQL Editor
2. Esegui ogni migration nell'ordine indicato
3. Verifica che non ci siano errori

### 2. 🔐 Variabili d'Ambiente su Vercel

Configura le seguenti variabili d'ambiente nel progetto Vercel:

#### Variabili Obbligatorie

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tuo-progetto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tuo-anon-key
SUPABASE_SERVICE_ROLE_KEY=tuo-service-role-key

# NextAuth
NEXTAUTH_URL=https://tuo-dominio.vercel.app
NEXTAUTH_SECRET=genera-un-secret-forte

# App URL
NEXT_PUBLIC_APP_URL=https://tuo-dominio.vercel.app
# oppure
NEXT_PUBLIC_SITE_URL=https://tuo-dominio.vercel.app
```

#### Variabili per Email (Resend)

```env
# Resend API (obbligatorio per inviare email)
RESEND_API_KEY=re_tua_api_key_qui

# Email mittente (deve essere da dominio verificato)
RESEND_FROM_EMAIL=notifications@imment.it

# Email admin (opzionale - solo se vuoi ricevere notifiche)
ADMIN_EMAIL=tuo-email@example.com
```

#### Variabili Opzionali

```env
# Webhook (opzionale)
WEBHOOK_URL=https://tuo-webhook-url.com
WEBHOOK_SECRET=tuo-webhook-secret

# Revolut (se usi pagamenti)
REVOLUT_API_KEY=tuo-revolut-api-key
REVOLUT_WEBHOOK_SECRET=tuo-revolut-webhook-secret

# OAuth (se usi Google/Microsoft)
GOOGLE_CLIENT_ID=tuo-google-client-id
GOOGLE_CLIENT_SECRET=tuo-google-client-secret
MICROSOFT_CLIENT_ID=tuo-microsoft-client-id
MICROSOFT_CLIENT_SECRET=tuo-microsoft-client-secret
MICROSOFT_TENANT_ID=common
```

### 3. 🌐 Configurazione Dominio

#### Verifica Dominio Resend

- [ ] Il dominio `imment.it` è verificato su Resend
- [ ] I record DNS sono configurati correttamente
- [ ] `RESEND_FROM_EMAIL` usa il dominio verificato

#### Configurazione OAuth (se usi)

- [ ] Google OAuth: aggiungi callback URL di produzione
- [ ] Microsoft OAuth: aggiungi callback URL di produzione

### 4. 📦 Build e Test

```bash
# Testa il build localmente prima del deploy
npm run build

# Verifica che non ci siano errori
npm run lint
```

### 5. 🚀 Deploy su Vercel

#### Metodo 1: Vercel CLI

```bash
# Installa Vercel CLI (se non l'hai già fatto)
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy in produzione
vercel --prod
```

#### Metodo 2: GitHub Integration

1. Connetti il repository GitHub a Vercel
2. Vercel rileverà automaticamente Next.js
3. Configura le variabili d'ambiente nel dashboard Vercel
4. Fai il deploy

### 6. ✅ Post-Deploy Checklist

- [ ] Verifica che l'applicazione si carichi correttamente
- [ ] Testa il login/registrazione
- [ ] Verifica che i corsi vengano visualizzati nella dashboard
- [ ] Testa il sistema di notifiche email:
  - Reset progressi: `/api/startup-award/test-reset`
  - Test completamento: `/api/startup-award/test-complete`
- [ ] Verifica che le email vengano inviate correttamente
- [ ] Controlla i log di Vercel per eventuali errori

### 7. 🔍 Troubleshooting

#### Problemi Comuni

**Build fallisce:**
- Verifica che tutte le variabili d'ambiente siano configurate
- Controlla i log di build su Vercel

**Email non vengono inviate:**
- Verifica che `RESEND_API_KEY` sia configurato
- Verifica che il dominio sia verificato su Resend
- Controlla i log del server per errori

**Errore "Service role key non configurato":**
- Assicurati che `SUPABASE_SERVICE_ROLE_KEY` sia configurato su Vercel
- Verifica che la chiave sia corretta

**Dashboard non mostra i corsi:**
- Verifica che le migrations siano state eseguite
- Controlla i log del browser per errori RLS

### 8. 📝 Note Importanti

- **NON** committare mai file `.env.local` nel repository
- Usa sempre HTTPS in produzione
- Genera un `NEXTAUTH_SECRET` forte per la produzione
- Verifica che tutti i callback URL OAuth siano configurati per produzione

## 🎯 Quick Start

1. Esegui le migrations su Supabase
2. Configura tutte le variabili d'ambiente su Vercel
3. Connetti il repository GitHub (o usa Vercel CLI)
4. Fai il deploy
5. Testa tutto!

## 📞 Supporto

Se hai problemi durante il deploy, controlla:
- Log di Vercel: Dashboard Vercel → Il tuo progetto → Deployments → Logs
- Log di Supabase: Dashboard Supabase → Logs
- Console del browser: F12 → Console

