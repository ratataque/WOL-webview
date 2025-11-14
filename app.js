// Device configuration - edit these values
const DEVICE_NAME = "Gaming PC";
const DEVICE_IP = "192.168.1.85";
const DEVICE_MAC = "00:11:22:33:44:55";

let isOnline = false;
let isWaking = false;
let statusCheckInterval = null;

// Initialize device info in HTML
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("deviceName").textContent = DEVICE_NAME;
    document.getElementById("deviceMac").textContent = DEVICE_MAC;
    document.getElementById("deviceIp").textContent = DEVICE_IP;
});

function updateUI(state) {
    const button = document.getElementById("powerButton");
    const status = document.getElementById("status");
    const message = document.getElementById("message");

    button.className = "power-button " + state;
    status.className = "status " + state;

    if (state === "offline") {
        status.innerHTML = 'Offline <span class="indicator offline"></span>';
        message.textContent = "";
    } else if (state === "waking") {
        status.innerHTML = 'Waking <span class="indicator waking"></span>';
        message.textContent = "Sending magic packet...";
    } else if (state === "online") {
        status.innerHTML = 'Online <span class="indicator online"></span>';
        message.textContent = "Device is powered on";
    }
}

async function checkStatus() {
    try {
        const response = await fetch(`/api/status/${DEVICE_IP}`);
        const data = await response.json();

        if (!isWaking) {
            isOnline = data.online;
            updateUI(isOnline ? "online" : "offline");
        }
    } catch (err) {
        console.error("Status check failed:", err);
    }
}

async function togglePower() {
    if (isWaking) return;

    if (!isOnline) {
        isWaking = true;
        updateUI("waking");

        try {
            // Send WoL packet to backend
            await fetch("/api/wake", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mac: DEVICE_MAC,
                    ip: DEVICE_IP,
                }),
            });

            // Poll for device status for up to 30 seconds
            let attempts = 0;
            const maxAttempts = 30;

            const checkInterval = setInterval(async () => {
                attempts++;
                const response = await fetch(`/api/status/${DEVICE_IP}`);
                const data = await response.json();

                if (data.online) {
                    clearInterval(checkInterval);
                    isWaking = false;
                    isOnline = true;
                    updateUI("online");
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    isWaking = false;
                    updateUI("offline");
                    document.getElementById("message").textContent =
                        "Device did not respond";
                }
            }, 1000);
        } catch (err) {
            console.error("Wake request failed:", err);
            isWaking = false;
            updateUI("offline");
            document.getElementById("message").textContent =
                "Failed to send wake packet";
        }
    }
}

// Check status immediately and every 5 seconds
checkStatus();
statusCheckInterval = setInterval(checkStatus, 5000);
