# 🔐 Configurazione OAuth - Google e Microsoft

## 📋 Panoramica

Questo documento spiega come configurare l'autenticazione OAuth con Google e Microsoft per la tua applicazione Next.js.

## 🚀 Configurazione Google OAuth

### 1. Crea un progetto su Google Cloud Console

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuovo progetto o seleziona uno esistente
3. Abilita l'API Google Identity

### 2. Configura OAuth 2.0

1. Vai su **"Credenziali"** → **"Crea credenziali"** → **"ID client OAuth 2.0"**
2. Seleziona **"Applicazione web"**
3. Aggiungi gli URI di reindirizzamento:
   - **Sviluppo**: `http://localhost:3000/api/auth/callback/google`
   - **Produzione**: `https://tuodominio.com/api/auth/callback/google`

### 3. Ottieni le credenziali

Copia:
- **Client ID**
- **Client Secret**

## 🏢 Configurazione Microsoft OAuth

### 1. Registra l'applicazione su Azure

1. Vai su [Azure Portal](https://portal.azure.com/)
2. Naviga su **"Azure Active Directory"** → **"Registrazioni app"**
3. Clicca **"Nuova registrazione"**
4. Inserisci:
   - **Nome**: Nome della tua app
   - **Tipi di account supportati**: "Account in qualsiasi directory organizzativa e account Microsoft personali"
   - **URI di reindirizzamento**: `http://localhost:3000/api/auth/callback/microsoft`

### 2. Configura le autorizzazioni

1. Vai su **"Autorizzazioni API"**
2. Aggiungi le autorizzazioni Microsoft Graph:
   - `User.Read` (per leggere il profilo utente)
   - `email` (per accedere all'email)

### 3. Ottieni le credenziali

1. Vai su **"Certificati e segreti"**
2. Crea un **"Nuovo segreto client"**
3. Copia:
   - **Application (client) ID**
   - **Client Secret**

## 🔧 Configurazione Variabili d'Ambiente

Crea un file `.env.local` nella root del progetto:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_TENANT_ID=common

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎯 Configurazione Produzione

### Google OAuth
- Aggiungi il dominio di produzione negli URI di reindirizzamento
- Aggiorna `NEXTAUTH_URL` con il dominio di produzione

### Microsoft OAuth
- Aggiungi l'URI di reindirizzamento di produzione
- Configura il tenant ID se necessario

## 🔍 Test della Configurazione

1. **Avvia il server di sviluppo**:
   ```bash
   npm run dev
   ```

2. **Vai su** `http://localhost:3000/auth/signin`

3. **Testa entrambi i provider**:
   - Clicca su "Accedi con Google"
   - Clicca su "Accedi con Microsoft"

## 🚨 Risoluzione Problemi

### Errore "Provider OAuth non configurati"
- Verifica che le variabili d'ambiente siano configurate correttamente
- Riavvia il server di sviluppo

### Errore di reindirizzamento
- Verifica che gli URI di reindirizzamento siano configurati correttamente
- Controlla che `NEXTAUTH_URL` sia impostato correttamente

### Errore di autorizzazione
- Verifica che le autorizzazioni siano configurate correttamente
- Controlla che l'app sia pubblicata (per Microsoft)

## 📚 Risorse Utili

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)

## 🔒 Sicurezza

- **NON** committare mai il file `.env.local`
- Usa segreti forti per `NEXTAUTH_SECRET`
- Limita le autorizzazioni al minimo necessario
- Usa HTTPS in produzione
