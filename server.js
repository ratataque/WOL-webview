const express = require("express");
const wol = require("wake_on_lan");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

async function checkDeviceStatus(ip) {
    try {
        // Use ping with 1 second timeout
        await execAsync(`ping -c 1 -W 1 ${ip}`);
        return true;
    } catch (error) {
        return false;
    }
}

app.get("/api/status/:ip", async (req, res) => {
    const { ip } = req.params;
    // console.log(`Checking status of ${ip}`);

    const isOnline = await checkDeviceStatus(ip);
    // console.log(`Device ${ip} is ${isOnline ? 'online' : 'offline'}`);

    res.json({ online: isOnline });
});

app.post("/api/wake", (req, res) => {
    const { mac, ip } = req.body;

    console.log(`Sending WoL packet to ${mac} (${ip})`);

    wol.wake(mac, (error) => {
        if (error) {
            console.error("Failed to send WoL packet:", error);
            return res.status(500).json({ error: "Failed to send WoL packet" });
        }

        console.log("WoL packet sent successfully");
        res.json({ success: true, message: "WoL packet sent" });
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Wake on LAN server running on http://0.0.0.0:${PORT}`);
});
