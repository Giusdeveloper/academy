# 🧪 Guida Test Email di Verifica

## ✅ Stato Attuale
- **Account di test resettati**: ✅ Completato
- **Sistema di registrazione**: ✅ Funzionante
- **Invio email di verifica**: ✅ Funzionante
- **Gestione errori**: ✅ Implementata

## 📧 Test Completato

### Account Creato:
- **Email**: `test@example.com`
- **User ID**: `ef8450ad-7ecb-4bbe-a82a-f33b525c3a60`
- **Stato**: Registrato ma email non verificata
- **Email inviata**: ✅ Sì

## 🔍 Come Testare il Flusso Completo

### 1. **Test nel Browser (Raccomandato)**

#### Passo 1: Apri il Browser
```bash
# Avvia l'applicazione
npm run dev
```

#### Passo 2: Vai alla Registrazione
1. Apri **modalità incognito** nel browser
2. Vai su `http://localhost:3000/register`
3. Compila il form con:
   - **Nome**: Test User
   - **Email**: `test@example.com` (o un'altra email di test)
   - **Password**: `TestPassword123!`

#### Passo 3: Verifica il Comportamento
- ✅ **Messaggio di successo** dovrebbe apparire
- ✅ **Pulsante "Vai al Login"** dovrebbe essere visibile
- ✅ **Nessun reindirizzamento automatico**

#### Passo 4: Controlla l'Email
1. **Controlla la casella di posta** (inclusa la cartella spam)
2. **Cerca email da Supabase** o dal tuo dominio
3. **Clicca sul link di verifica** se arriva

#### Passo 5: Test del Login
1. Vai su `http://localhost:3000/login`
2. Prova a fare login con le credenziali
3. **Se email non verificata**: Dovresti vedere l'errore e il pulsante "Invia nuovamente"
4. **Se email verificata**: Dovresti essere reindirizzato alla dashboard

### 2. **Test con Script (Automatico)**

#### Controlla Stato Account:
```bash
node monitor_email_verification.js test@example.com
```

#### Monitora Verifica (ogni 2 minuti):
```bash
node monitor_email_verification.js test@example.com --monitor
```

#### Test Nuovo Account:
```bash
node reset_test_accounts.js nuovaemail@test.com
```

## 📊 Risultati Attesi

### ✅ **Se le Email Arrivano**:
1. **Registrazione** → Messaggio di successo
2. **Email ricevuta** → Link di verifica funzionante
3. **Clic sul link** → Reindirizzamento a `/verify-email`
4. **Verifica completata** → Reindirizzamento alla dashboard
5. **Login** → Accesso alla dashboard

### ❌ **Se le Email NON Arrivano**:
1. **Registrazione** → Messaggio di successo
2. **Email non ricevuta** → Controlla cartella spam
3. **Login fallisce** → Errore "Email not confirmed"
4. **Pulsante "Invia nuovamente"** → Disponibile
5. **Reinvio** → Potrebbe funzionare o dare rate limit

## 🚨 Problemi Comuni e Soluzioni

### 1. **Rate Limit Superato**
```
Errore: "email rate limit exceeded"
```
**Soluzione**: Configura SMTP personalizzato (Gmail raccomandato)
**Guida**: `CONFIGURAZIONE_EMAIL_SMTP.md`

### 2. **Email nella Cartella Spam**
**Soluzione**: 
- Controlla sempre la cartella spam
- Aggiungi il dominio Supabase ai contatti sicuri
- Configura SMTP personalizzato per evitare spam

### 3. **Link di Verifica Non Funziona**
**Soluzione**:
- Verifica i redirect URL in Supabase Dashboard
- Controlla che il token non sia scaduto (24 ore)
- Verifica la configurazione del Site URL

### 4. **Account Già Esistente**
```
Errore: "User already registered"
```
**Soluzione**: Usa un'email diversa o resetta l'account

## 🔧 Configurazione SMTP (Se Necessario)

### Gmail (Raccomandato per Sviluppo):
1. **Google Account** → Sicurezza → Password delle app
2. **Genera password** per "Mail"
3. **Supabase Dashboard** → Authentication → Settings → SMTP
4. **Configura**:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: `tueemail@gmail.com`
   - Password: `[App Password]`

### SendGrid (Per Produzione):
1. **Registrati** su SendGrid
2. **Crea API Key**
3. **Configura in Supabase**:
   - Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: `[API Key]`

## 📋 Checklist Test

- [ ] Account di test resettati
- [ ] Registrazione funzionante
- [ ] Messaggio di successo visibile
- [ ] Pulsante "Vai al Login" funzionante
- [ ] Email di verifica inviata
- [ ] Email ricevuta (o in spam)
- [ ] Link di verifica funzionante
- [ ] Pagina di verifica funzionante
- [ ] Reindirizzamento alla dashboard
- [ ] Login dopo verifica funzionante
- [ ] Gestione errori corretta
- [ ] Pulsante "Invia nuovamente" funzionante

## 🎯 Prossimi Passi

1. **Testa nel browser** con modalità incognito
2. **Verifica se l'email arriva** (controlla anche spam)
3. **Se non arriva**: Configura SMTP personalizzato
4. **Se arriva**: Testa il flusso completo di verifica
5. **Documenta i risultati** per il team

## 📞 Supporto

Se hai problemi:
1. **Controlla i log** di Supabase Dashboard
2. **Usa gli script** di test per diagnosticare
3. **Segui la guida** SMTP per configurare provider personalizzato
4. **Testa con email diverse** per isolare il problema
