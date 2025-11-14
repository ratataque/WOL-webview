import express from 'express';
import wol from 'wake_on_lan';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Serve static files from dist in production
if (isProduction) {
    const distPath = path.join(__dirname, '../dist');
    app.use(express.static(distPath));
}

async function checkDeviceStatus(ip) {
    try {
        await execAsync(`ping -c 1 -W 1 ${ip}`);
        return true;
    } catch (error) {
        return false;
    }
}

app.get('/api/status/:ip', async (req, res) => {
    const { ip } = req.params;
    console.log(`Checking status of ${ip}`);

    const isOnline = await checkDeviceStatus(ip);
    console.log(`Device ${ip} is ${isOnline ? 'online' : 'offline'}`);

    res.json({ online: isOnline });
});

app.post('/api/wake', (req, res) => {
    const { mac, ip } = req.body;

    console.log(`Sending WoL packet to ${mac} (${ip})`);

    wol.wake(mac, (error) => {
        if (error) {
            console.error('Failed to send WoL packet:', error);
            return res.status(500).json({ error: 'Failed to send WoL packet' });
        }

        console.log('WoL packet sent successfully');
        res.json({ success: true, message: 'WoL packet sent' });
    });
});

// In production, serve index.html for all other routes
if (isProduction) {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

const host = '0.0.0.0'; // Bind to all interfaces (separate container)
app.listen(PORT, host, () => {
    console.log(`Wake on LAN backend running on http://${host}:${PORT}`);
    console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
});
