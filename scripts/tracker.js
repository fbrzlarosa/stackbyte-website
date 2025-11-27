const idle = require('desktop-idle');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// CONFIGURAZIONE
// Se non trovi le variabili d'ambiente, usa valori di fallback o lancia errore
const API_URL = process.env.TRACKER_API_URL || 'http://localhost:3000/api/status';
const SECRET = process.env.STATUS_API_SECRET || 'dev_secret';
const IDLE_THRESHOLD_SECONDS = 60; // 1 minute

async function updateStatus() {
    const idleTime = idle.getIdleTime();
    const status = idleTime < IDLE_THRESHOLD_SECONDS ? 'online' : 'offline';

    console.log(`[${new Date().toLocaleTimeString()}] Idle: ${Math.floor(idleTime)}s -> Status: ${status}`);

    try {
        await axios.post(API_URL, {
            status: status,
            secret: SECRET
        });
    } catch (error) {
        if (error.response) {
            console.error(`Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`Error: ${error.message}`);
        }
    }
}

console.log("🚀 Tracker avviato...");
console.log(`Target API: ${API_URL}`);
console.log(`Idle Threshold: ${IDLE_THRESHOLD_SECONDS}s`);

// Esegui subito e poi ogni 30 secondi
updateStatus();
setInterval(updateStatus, 30000);

