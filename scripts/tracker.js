let idle;
try {
    idle = require('desktop-idle');
} catch (error) {
    console.error('ERROR: desktop-idle module not found or could not be loaded.');
    console.error('This module is required for the tracker to work.');
    console.error('Please run: npm install');
    console.error('If the error persists, make sure you are running this on a desktop OS (Windows/macOS/Linux desktop).');
    process.exit(1);
}

const axios = require('axios');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// CONFIGURATION
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
            console.error(`Error: ${error.message}`, error, API_URL, SECRET);
        }
    }
}

console.log("🚀 Tracker started...");
console.log(`Target API: ${API_URL}`);
console.log(`Idle Threshold: ${IDLE_THRESHOLD_SECONDS}s`);

// Run immediately and then every 30 seconds
updateStatus();
setInterval(updateStatus, 30000);

