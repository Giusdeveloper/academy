# Configurazione Email SMTP per Supabase

## 🚨 Problema Identificato
Supabase usa un provider email di base con limiti molto bassi (circa 3 email/giorno). Per risolvere il problema delle email che non arrivano, devi configurare un provider SMTP personalizzato.

## 📧 Provider SMTP Raccomandati

### 1. **Gmail (Gratuito - Raccomandato per sviluppo)**
- **Limite**: 500 email/giorno
- **Costo**: Gratuito
- **Setup**: Richiede "App Password"

#### Configurazione Gmail:
1. Vai su [Google Account Settings](https://myaccount.google.com/)
2. Sicurezza → Verifica in 2 passaggi (attiva se non già attivo)
3. Sicurezza → Password delle app
4. Genera una password per "Mail"
5. Usa questa password in Supabase

**Configurazione Supabase:**
```
Host: smtp.gmail.com
Port: 587
Username: tueemail@gmail.com
Password: [App Password generata]
Sender email: tueemail@gmail.com
Sender name: Academy
```

### 2. **SendGrid (Gratuito - 100 email/giorno)**
- **Limite**: 100 email/giorno gratuitamente
- **Costo**: Gratuito fino a 100 email/giorno
- **Setup**: Registrazione semplice

#### Configurazione SendGrid:
1. Registrati su [SendGrid](https://sendgrid.com/)
2. Crea un API Key
3. Verifica il dominio (opzionale per test)

**Configurazione Supabase:**
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [API Key di SendGrid]
Sender email: noreply@tuodominio.com
Sender name: Academy
```

### 3. **Mailgun (Gratuito - 5,000 email/mese)**
- **Limite**: 5,000 email/mese gratuitamente
- **Costo**: Gratuito per i primi 5,000 email
- **Setup**: Richiede verifica dominio

## 🔧 Come Configurare in Supabase

### Passo 1: Accedi alla Dashboard Supabase
1. Vai su [supabase.com](https://supabase.com)
2. Seleziona il tuo progetto
3. Vai a **Authentication** → **Settings**

### Passo 2: Configura SMTP
1. Scorri fino a **SMTP Settings**
2. Attiva **Enable custom SMTP**
3. Inserisci le credenziali del tuo provider:

```
SMTP Host: [host del provider]
SMTP Port: 587 (o 465 per SSL)
SMTP User: [username]
SMTP Pass: [password]
SMTP Admin Email: [email amministratore]
SMTP Sender Name: Academy
```

### Passo 3: Testa la Configurazione
1. Clicca **Test SMTP**
2. Inserisci un'email di test
3. Verifica che l'email arrivi

### Passo 4: Configura i Redirect URL
Assicurati che questi URL siano nella lista dei redirect consentiti:
```
http://localhost:3000/verify-email
http://localhost:3000/auth/callback
https://tuodominio.com/verify-email
https://tuodominio.com/auth/callback
```

## 🧪 Test della Configurazione

Dopo aver configurato SMTP, testa il flusso:

1. **Registra un nuovo account**
2. **Controlla la casella di posta** (inclusa la cartella spam)
3. **Clicca sul link di verifica**
4. **Prova il login**

## 🚀 Soluzione Temporanea per Sviluppo

Se non vuoi configurare SMTP subito, puoi usare la soluzione di sviluppo che ho implementato nel codice:

1. **Registra un account**
2. **Usa il pulsante "Invia nuovamente email di verifica"** nel form di login
3. **Oppure usa l'email di test**: `pistoia702@gmail.com` (già configurata per il testing)

## 📋 Checklist Configurazione

- [ ] Provider SMTP configurato
- [ ] Credenziali SMTP inserite in Supabase
- [ ] Test SMTP superato
- [ ] Redirect URL configurati
- [ ] Site URL configurato
- [ ] Email di test ricevuta
- [ ] Link di verifica funzionante
- [ ] Login dopo verifica funzionante

## 🔍 Troubleshooting

### Email non arriva ancora:
1. **Controlla la cartella spam**
2. **Verifica le credenziali SMTP**
3. **Controlla i log di Supabase** (Authentication → Logs)
4. **Testa con un provider email diverso**

### Link di verifica non funziona:
1. **Verifica i redirect URL**
2. **Controlla che il token non sia scaduto**
3. **Verifica la configurazione del Site URL**

### Errori SMTP:
1. **Controlla la porta (587 o 465)**
2. **Verifica username/password**
3. **Controlla che il provider supporti SMTP**

## 💡 Raccomandazioni

1. **Per sviluppo**: Usa Gmail con App Password
2. **Per produzione**: Usa SendGrid o Mailgun
3. **Sempre**: Configura un provider SMTP personalizzato
4. **Monitora**: I log di autenticazione per errori
