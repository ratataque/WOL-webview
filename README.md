# Wake on LAN Web Interface

Simple, lightweight web interface to wake network devices using Wake-on-LAN magic packets.

## Features

- Single HTML page with embedded CSS
- 3D animated power button
- Real-time status indicator
- Minimal dependencies (Express + wake_on_lan)

![preview](https://github.com/ratataque/WOL-webview/blob/main/preview.png)

## Files

- `index.html` - Main UI (edit device info here)
- `app.js` - Client-side JavaScript
- `server.js` - Express server with WoL functionality

## Configuration

Edit `index.html` and `app.js` to change the hardcoded device:

- MAC Address: `00:11:22:33:44:55`
- IP Address: `192.168.1.100`
- Device Name: `Gaming PC`

## Local Development

```bash
npm install
npm start
```

Visit http://localhost:3000

## Docker Deployment

```bash
docker build -t wol-webview .
docker run -p 3000:3000 --network host wol-webview
```

Note: Use `--network host` to allow WoL packets to reach your local network.

## Dokploy Deployment

1. Push to your git repository
2. In Dokploy, create a new application
3. Select this repository
4. Set the port to 3000
5. Enable host network mode in advanced settings
6. Deploy!

## Requirements

- Node.js 18+
- Network access to send UDP broadcast packets
- Target device must support Wake-on-LAN and be on the same network
