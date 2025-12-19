# Guida alla Gestione degli Eventi

Questa guida spiega come aggiungere, modificare o eliminare eventi nella sezione Workshop & Eventi dell'applicazione.

## 📍 Dove si trovano gli eventi

Gli eventi sono gestiti tramite un file di configurazione JSON molto semplice:
- **File**: `src/config/events.json`

## ✏️ Come modificare gli eventi

### Aggiungere un nuovo evento

1. Apri il file `src/config/events.json`
2. Aggiungi un nuovo oggetto nell'array `events` seguendo questo formato:

```json
{
  "id": "identificativo-univoco",
  "title": "Titolo dell'evento",
  "partner": "Nome del partner/organizzatore",
  "description": "Descrizione dettagliata dell'evento",
  "date": "Data formattata (es: 15 Marzo 2025)",
  "location": "Luogo dell'evento",
  "ticketPrice": "Prezzo biglietti (es: €20 - €50)",
  "ticketUrl": "https://link-per-acquistare-i-biglietti",
  "image": null,
  "featured": true,
  "active": true
}
```

**Esempio completo:**

```json
{
  "id": "milano-tech-summit-2025",
  "title": "Milano Tech Summit 2025",
  "partner": "Tech Community Milano",
  "description": "Un evento di due giorni dedicato alle tecnologie emergenti, con keynote speaker internazionali e sessioni di networking.",
  "date": "20-21 Aprile 2025",
  "location": "MiCo Milano Convention Centre",
  "ticketPrice": "€50 - €150",
  "ticketUrl": "https://www.eventbrite.it/e/milano-tech-summit-2025",
  "image": null,
  "featured": true,
  "active": true
}
```

### Modificare un evento esistente

1. Apri il file `src/config/events.json`
2. Trova l'evento che vuoi modificare (cerca per `id` o `title`)
3. Modifica i campi che desideri cambiare
4. Salva il file

**Esempio:** Per cambiare la data di un evento, modifica semplicemente il campo `date`:

```json
{
  "id": "napoli-devfest-2025",
  "date": "15 Ottobre 2025",  // ← Modifica qui
  ...
}
```

### Eliminare un evento (temporaneamente)

Per nascondere un evento senza eliminarlo completamente:

1. Apri `src/config/events.json`
2. Trova l'evento
3. Cambia `"active": true` in `"active": false`

```json
{
  "id": "napoli-devfest-2025",
  "active": false,  // ← L'evento non verrà più mostrato
  ...
}
```

### Eliminare un evento (permanentemente)

1. Apri `src/config/events.json`
2. Trova l'oggetto dell'evento nell'array `events`
3. Elimina l'intero oggetto (dalla parentesi graffa aperta `{` alla parentesi graffa chiusa `}`)
4. Assicurati che ci sia una virgola corretta tra gli altri eventi

## 🎯 Campi disponibili

| Campo | Tipo | Obbligatorio | Descrizione |
|-------|------|--------------|-------------|
| `id` | string | ✅ Sì | Identificativo univoco (senza spazi, usa trattini) |
| `title` | string | ✅ Sì | Titolo dell'evento |
| `partner` | string | ✅ Sì | Nome del partner/organizzatore |
| `description` | string | ✅ Sì | Descrizione dettagliata |
| `date` | string | ✅ Sì | Data formattata (es: "11 Ottobre 2025") |
| `location` | string | ✅ Sì | Luogo dell'evento |
| `ticketPrice` | string | ✅ Sì | Prezzo biglietti (es: "€10 - €50") |
| `ticketUrl` | string | ✅ Sì | URL per acquistare biglietti |
| `image` | string \| null | ❌ No | URL immagine (attualmente non usato, lascia `null`) |
| `featured` | boolean | ✅ Sì | Se `true`, l'evento appare in evidenza |
| `active` | boolean | ✅ Sì | Se `true`, l'evento è visibile sul sito |

## 📝 Note importanti

1. **Formato JSON**: Assicurati di mantenere il formato JSON valido (virgole corrette, parentesi chiuse, ecc.)
2. **ID univoci**: Ogni evento deve avere un `id` univoco
3. **Featured**: Solo gli eventi con `featured: true` vengono mostrati in evidenza
4. **Active**: Solo gli eventi con `active: true` vengono mostrati sul sito
5. **Dopo le modifiche**: Dopo aver salvato il file, il sito si aggiornerà automaticamente (se in sviluppo) o al prossimo deploy

## 🔍 Dove vengono visualizzati gli eventi

Gli eventi con `featured: true` e `active: true` vengono mostrati in:
- **Homepage** (`/`) - Sezione "Eventi Partner"
- **Pagina Workshop** (`/workshops`) - Sezione "Eventi Partner"

## 🚀 Dopo aver modificato il file

1. Salva il file `src/config/events.json`
2. Se stai sviluppando localmente, il sito si aggiornerà automaticamente
3. Se vuoi pubblicare le modifiche:
   - Fai commit delle modifiche: `git add src/config/events.json`
   - Fai push: `git push origin main`
   - Vercel aggiornerà automaticamente il sito

## ❓ Domande frequenti

**Q: Posso aggiungere più eventi featured?**  
A: Sì! Puoi avere più eventi con `featured: true`. Verranno tutti mostrati.

**Q: Come faccio a cambiare l'ordine degli eventi?**  
A: L'ordine è quello in cui compaiono nell'array `events` nel file JSON. Sposta gli oggetti nell'array per cambiare l'ordine.

**Q: Posso aggiungere immagini agli eventi?**  
A: Attualmente il campo `image` non è utilizzato. Puoi lasciarlo a `null`. Se in futuro vorremo aggiungere immagini, basterà aggiungere l'URL dell'immagine.

**Q: Cosa succede se commetto un errore nel JSON?**  
A: Il sito potrebbe non funzionare correttamente. Usa un validatore JSON online per verificare che il formato sia corretto prima di salvare.

## 📞 Supporto

Se hai bisogno di aiuto o hai domande, contatta il team di sviluppo.

