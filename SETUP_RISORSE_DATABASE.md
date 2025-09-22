# Setup Database Risorse - Academy Imment

## 🎯 **Panoramica**

Questo documento descrive come configurare il database per le risorse dinamiche dell'Academy Imment.

## 📋 **File Creati**

### 1. **Database Schema**
- `create_resources_database.sql` - Script SQL per creare le tabelle
- `apply_resources_migration.js` - Script JavaScript per applicare la migrazione

### 2. **Tipi TypeScript**
- `src/types/resources.ts` - Definizioni dei tipi per le risorse

### 3. **Hook Personalizzato**
- `src/hooks/useResources.ts` - Hook per gestire le operazioni CRUD

### 4. **Interfaccia Utente**
- `src/app/resources/page.tsx` - Pagina risorse dinamica (aggiornata)
- `src/app/resources/resources.css` - Stili CSS (aggiornati)

## 🚀 **Passi per l'Applicazione**

### **Passo 1: Applicare la Migrazione Database**

```bash
# Opzione A: Eseguire lo script SQL direttamente in Supabase
# Copia il contenuto di create_resources_database.sql e eseguilo nel SQL Editor di Supabase

# Opzione B: Usare lo script JavaScript (richiede configurazione)
node apply_resources_migration.js
```

### **Passo 2: Verificare le Tabelle**

Controlla che le seguenti tabelle siano state create:
- `resources` - Tabella principale delle risorse
- `resource_downloads` - Tracciamento download
- `resource_views` - Tracciamento visualizzazioni

### **Passo 3: Testare l'Interfaccia**

1. Avvia il server di sviluppo:
```bash
npm run dev
```

2. Visita `/resources` per testare la nuova interfaccia

## 📊 **Struttura Database**

### **Tabella `resources`**
```sql
- id (UUID, Primary Key)
- title (VARCHAR) - Titolo della risorsa
- description (TEXT) - Descrizione
- type (ENUM) - Tipo: pdf, video, template, guide, tool, ebook, checklist, presentation
- category (ENUM) - Categoria: finanza, startup, investimenti, marketing, legal, tech, business, fundraising
- file_url (TEXT) - URL del file
- thumbnail_url (TEXT) - URL immagine di anteprima
- file_size (INTEGER) - Dimensione in bytes
- download_count (INTEGER) - Contatore download
- view_count (INTEGER) - Contatore visualizzazioni
- is_featured (BOOLEAN) - Risorsa in evidenza
- is_premium (BOOLEAN) - Solo per utenti premium
- is_active (BOOLEAN) - Risorsa attiva
- tags (TEXT[]) - Array di tag
- author (VARCHAR) - Autore
- language (VARCHAR) - Lingua (it, en)
- difficulty_level (ENUM) - Livello: beginner, intermediate, advanced
- estimated_time (INTEGER) - Tempo stimato in minuti
- published_at (TIMESTAMP) - Data pubblicazione
- created_at (TIMESTAMP) - Data creazione
- updated_at (TIMESTAMP) - Data ultimo aggiornamento
```

### **Tabella `resource_downloads`**
```sql
- id (UUID, Primary Key)
- resource_id (UUID, Foreign Key)
- user_id (UUID, Foreign Key)
- downloaded_at (TIMESTAMP)
- ip_address (INET)
- user_agent (TEXT)
```

### **Tabella `resource_views`**
```sql
- id (UUID, Primary Key)
- resource_id (UUID, Foreign Key)
- user_id (UUID, Foreign Key)
- viewed_at (TIMESTAMP)
- ip_address (INET)
- user_agent (TEXT)
- session_id (TEXT)
```

## 🎨 **Funzionalità Implementate**

### **1. Interfaccia Dinamica**
- ✅ Caricamento risorse dal database
- ✅ Ricerca in tempo reale
- ✅ Filtri per tipo e categoria
- ✅ Paginazione
- ✅ Stati di caricamento ed errore

### **2. Gestione Risorse**
- ✅ Visualizzazione risorse featured
- ✅ Lista completa con filtri
- ✅ Download con tracking
- ✅ Visualizzazione con tracking
- ✅ Statistiche (download, visualizzazioni)

### **3. Tipi di Risorsa Supportati**
- 📄 **PDF** - Documenti e guide
- 🎥 **Video** - Contenuti video
- 📋 **Template** - Modelli e template
- 📖 **Guide** - Guide dettagliate
- 🛠️ **Tool** - Strumenti
- 📚 **E-book** - Libri digitali
- ✅ **Checklist** - Liste di controllo
- 📊 **Presentation** - Presentazioni

### **4. Categorie Supportate**
- 💰 **Finanza** - Aspetti finanziari
- 🚀 **Startup** - Gestione startup
- 💼 **Investimenti** - Raccolta capitali
- 📈 **Marketing** - Strategie marketing
- ⚖️ **Legal** - Aspetti legali
- 💻 **Tech** - Tecnologia
- 🏢 **Business** - Gestione business
- 💵 **Fundraising** - Raccolta fondi

## 🔧 **Configurazione Avanzata**

### **Variabili d'Ambiente**
Assicurati di avere configurate:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **RLS (Row Level Security)**
Le policy sono configurate per:
- ✅ Tutti possono visualizzare risorse attive
- ✅ Solo utenti autenticati possono scaricare
- ✅ Tutti possono registrare visualizzazioni

## 📈 **Analytics e Tracking**

### **Metriche Disponibili**
- Download per risorsa
- Visualizzazioni per risorsa
- Statistiche per tipo/categoria
- Top risorse più scaricate
- Top risorse più visualizzate

### **Funzioni di Tracking**
- `trackDownload(resourceId)` - Registra download
- `trackView(resourceId)` - Registra visualizzazione
- `fetchStats()` - Carica statistiche complete

## 🎯 **Prossimi Passi**

1. **Applicare la migrazione** al database Supabase
2. **Testare l'interfaccia** con i dati di esempio
3. **Aggiungere risorse reali** tramite l'interfaccia admin
4. **Configurare analytics** avanzate se necessario
5. **Implementare sistema di upload** per nuove risorse

## 🆘 **Risoluzione Problemi**

### **Errore di Connessione Database**
- Verifica le variabili d'ambiente
- Controlla che Supabase sia accessibile
- Verifica le policy RLS

### **Risorse Non Caricate**
- Controlla che le tabelle esistano
- Verifica i dati di esempio
- Controlla la console per errori

### **Download Non Funzionanti**
- Verifica gli URL dei file
- Controlla le policy di download
- Verifica i permessi utente

---

**🎉 Sistema Risorse Dinamiche Completato!**

La pagina risorse è ora completamente dinamica e gestita dal database Supabase, con funzionalità avanzate di ricerca, filtri, tracking e analytics.
