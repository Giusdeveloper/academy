# Configurazione Supabase per la Verifica Email

## Configurazione Richiesta in Supabase Dashboard

Per far funzionare correttamente la verifica email, devi configurare i seguenti parametri nella dashboard di Supabase:

### 1. Authentication Settings

Vai a **Authentication > Settings** nella dashboard di Supabase e configura:

#### Site URL
```
http://localhost:3000
```
(Per produzione, usa il tuo dominio: `https://tuodominio.com`)

#### Redirect URLs
Aggiungi questi URL alla lista dei redirect consentiti:
```
http://localhost:3000/verify-email
http://localhost:3000/auth/callback
https://tuodominio.com/verify-email
https://tuodominio.com/auth/callback
```

### 2. Email Templates

Vai a **Authentication > Email Templates** e personalizza:

#### Confirm signup template
```html
<h2>Conferma il tuo account Academy</h2>
<p>Ciao {{ .Name }},</p>
<p>Benvenuto in Academy! 🎓</p>
<p>Per completare la registrazione, clicca sul pulsante qui sotto:</p>
<p><a href="{{ .ConfirmationURL }}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Conferma Account</a></p>
<p>Se il pulsante non funziona, copia e incolla questo link nel tuo browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>Buon apprendimento!</p>
<p>Il Team di Academy</p>
```

### 3. Email Settings

Assicurati che:
- **Enable email confirmations** sia attivato
- **Enable email change confirmations** sia attivato
- **Enable email change** sia attivato

### 4. SMTP Settings (Opzionale)

Se vuoi usare un provider SMTP personalizzato invece del servizio email di Supabase:

1. Vai a **Authentication > Settings > SMTP Settings**
2. Configura il tuo provider SMTP (Gmail, SendGrid, etc.)
3. Testa la configurazione

## Test del Flusso

### 1. Registrazione
1. Vai su `/register`
2. Compila il form con email e password
3. Dovresti ricevere un'email di verifica

### 2. Verifica Email
1. Clicca sul link nell'email ricevuta
2. Dovresti essere reindirizzato a `/verify-email`
3. La pagina dovrebbe mostrare "Email verificata!"

### 3. Login
1. Vai su `/login`
2. Usa le credenziali dell'account appena verificato
3. Dovresti essere reindirizzato alla dashboard

## Troubleshooting

### Email non arriva
1. Controlla la cartella spam
2. Verifica che l'email sia valida
3. Controlla i log di Supabase per errori SMTP

### Link di verifica non funziona
1. Verifica che l'URL sia nella lista dei redirect consentiti
2. Controlla che il token non sia scaduto (24 ore)
3. Verifica la configurazione del Site URL

### Errore "Email not confirmed"
1. Assicurati che l'utente abbia cliccato sul link di verifica
2. Controlla che `email_confirmed_at` non sia null nel database
3. Usa il pulsante "Invia nuovamente email di verifica" nel form di login

## Variabili d'Ambiente

Assicurati di avere queste variabili nel tuo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bvqrovzrvmdhuehonfcq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Note di Sicurezza

1. **Non esporre mai** la chiave di servizio (service key) nel frontend
2. **Usa sempre HTTPS** in produzione
3. **Configura CORS** correttamente per il tuo dominio
4. **Monitora** i tentativi di accesso sospetti
