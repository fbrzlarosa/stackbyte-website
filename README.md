## 🔋 Status Tracker

Per mantenere aggiornato lo stato "Online/Offline" sul sito, puoi usare lo script Node.js incluso.

### Configurazione
1. Assicurati di avere le dipendenze installate nella root: `npm install`
2. Configura il file `.env.local` con:
   ```env
   STATUS_API_SECRET=tua_password_segreta
   ```

### Avvio (Windows/Mac/Linux)
Apri un terminale nella root del progetto e lancia:

```bash
node scripts/tracker.js
```

Lo script rileverà automaticamente se stai usando il computer e invierà lo stato al sito.
Di default punta a `http://localhost:3000`. Per produzione, imposta la variabile d'ambiente:
`TRACKER_API_URL=https://tuo-sito.com/api/status`

### Esecuzione Automatica (Opzionale)
Puoi usare PM2 o l'Utilità di Pianificazione di Windows per far partire lo script all'avvio.
