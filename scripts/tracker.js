const axios = require('axios');
const path = require('path');
const { execFileSync } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// CONFIGURATION
const API_URL = process.env.TRACKER_API_URL || 'http://localhost:3000/api/status';
const SECRET = process.env.STATUS_API_SECRET;
const IDLE_THRESHOLD_SECONDS = 60; // 1 minute

if (!SECRET) {
    console.error('ERROR: STATUS_API_SECRET is not set in .env');
    process.exit(1);
}

// GNOME (Wayland and X11) exposes the session idle time over D-Bus, in milliseconds.
function getGnomeIdleTime() {
    const out = execFileSync('gdbus', [
        'call', '--session',
        '--dest', 'org.gnome.Mutter.IdleMonitor',
        '--object-path', '/org/gnome/Mutter/IdleMonitor/Core',
        '--method', 'org.gnome.Mutter.IdleMonitor.GetIdletime',
    ], { encoding: 'utf8', timeout: 5000 });
    const match = out.match(/(\d+)/);
    if (!match) throw new Error(`Unexpected gdbus output: ${out}`);
    return Number(match[1]) / 1000;
}

function resolveIdleSource() {
    if (process.platform === 'linux') {
        try {
            getGnomeIdleTime();
            return { name: 'gnome-dbus', getIdleTime: getGnomeIdleTime };
        } catch (error) {
            console.warn(`GNOME idle monitor unavailable (${error.message}), falling back to desktop-idle`);
        }
    }
    try {
        const idle = require('desktop-idle');
        return { name: 'desktop-idle', getIdleTime: () => idle.getIdleTime() };
    } catch {
        console.error('ERROR: no idle source available.');
        console.error('desktop-idle could not be loaded: run `npm install` on a desktop OS (Windows/macOS/Linux X11).');
        process.exit(1);
    }
}

const idleSource = resolveIdleSource();

async function updateStatus() {
    let idleTime;
    try {
        idleTime = idleSource.getIdleTime();
    } catch (error) {
        console.error(`Error reading idle time: ${error.message}`);
        return;
    }
    const status = idleTime < IDLE_THRESHOLD_SECONDS ? 'online' : 'offline';

    console.log(`[${new Date().toLocaleTimeString()}] Idle: ${Math.floor(idleTime)}s -> Status: ${status}`);

    try {
        await axios.post(API_URL, {
            status: status,
            secret: SECRET
        }, { timeout: 10000 });
    } catch (error) {
        if (error.response) {
            console.error(`Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`Error: ${error.message}`);
        }
    }
}

console.log("🚀 Tracker started...");
console.log(`Target API: ${API_URL}`);
console.log(`Idle source: ${idleSource.name}`);
console.log(`Idle Threshold: ${IDLE_THRESHOLD_SECONDS}s`);

// Run immediately and then every 30 seconds
updateStatus();
setInterval(updateStatus, 30000);
