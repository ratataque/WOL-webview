# Wake on LAN Web Interface

Simple, lightweight web interface to wake network devices using Wake-on-LAN magic packets.

<p align="center">
  <img src="https://github.com/ratataque/WOL-webview/blob/main/preview.png" alt="WoL Interface Preview" width="600"/>
</p>

## ✨ Features

- 🎨 Beautiful 3D animated power button
- 📡 Real-time device status with ping checks
- ⚡ Automatic status polling every 5 seconds
- 🚀 Lightning fast Vite HMR in development
- 📦 Optimized production build (6.6KB HTML + 1.7KB JS)
- 🔒 Security headers
- 📦 Gzip compression
- 🐳 Clean microservices architecture

## 🏗️ Tech Stack

- **Frontend**: Vanilla JS + Vite (~1.7KB minified JS)
- **Backend**: Node.js + Express + wake_on_lan
- **Production**: 2 Docker containers
  - Nginx (~53MB) - Static files
  - Node.js (~50MB) - API with host network for WoL

## 📐 Architecture

### Development
```
Browser → Vite (5173) --HMR--> /api --proxy--> Node.js (3000) → WoL
```

### Production
```
Browser → Nginx (80)
    ├── Static files (cached, gzipped)  
    └── /api/* → Backend (3000) --host network--> UDP broadcast → Device
```

## ⚙️ Configuration

Edit the device settings in `app.js`:
```javascript
const DEVICE_NAME = "Gaming PC";
const DEVICE_IP = "192.168.1.85";
const DEVICE_MAC = "00:D8:61:56:3F:41";
```

## 🚀 Quick Start

### Development

```bash
# Terminal 1: Start backend
bun install
bun run server

# Terminal 2: Start frontend  
bun run dev
```

Visit http://localhost:5173

### Production (Docker)

```bash
docker-compose up -d
```

Visit http://localhost

## 📦 Docker Images

| Image | Size | Contents |
|-------|------|----------|
| Frontend | ~53MB | Nginx + built static files |
| Backend | ~50MB | Node.js + Express + wake_on_lan |
| **Total** | **~103MB** | vs 200MB+ monolith |

## 🌐 Deployment

### Dokploy (Recommended)

1. Push to git
2. Create "Docker Compose" application in Dokploy
3. Select this repository
4. Deploy! ✨

The `docker-compose.yml` handles everything automatically.

### Manual Docker

```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📁 Project Structure

```
├── index.html            # Entry HTML with embedded CSS
├── app.js               # Frontend logic (1.7KB minified)
├── server/
│   ├── index.js         # Express backend + WoL
│   └── package.json     # ES modules config
├── nginx.conf           # Nginx: proxy, cache, gzip
├── vite.config.js       # Vite configuration
├── Dockerfile           # Frontend: Vite → Nginx
├── Dockerfile.backend   # Backend: Node.js only
├── docker-compose.yml   # Orchestration
└── package.json         # Dependencies
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Frontend interface |
| `/api/status/:ip` | GET | Ping device, returns `{ online: bool }` |
| `/api/wake` | POST | Send WoL packet, body: `{ mac, ip }` |

## 🎯 How It Works

### Status Check
1. Frontend polls `/api/status/{ip}` every 5 seconds
2. Backend pings device with 1s timeout
3. UI updates button color (🔴 offline / 🟢 online)

### Wake Device
1. Click power button → POST `/api/wake`
2. Backend sends magic packet via UDP broadcast
3. Frontend polls every second for 30s
4. Button turns 🟠 orange (pulsing) until device responds

## ⚠️ Requirements

### Development
- Node.js 18+ or Bun
- Target device with WoL enabled

### Production
- Docker + Docker Compose
- Backend needs **host network** for UDP broadcasts
- Target device must:
  - Support Wake-on-LAN (BIOS setting)
  - Be on same network/subnet
  - Have WoL enabled in network adapter

## 🐛 Troubleshooting

### Device won't wake?
- ✅ Enable WoL in BIOS
- ✅ Enable WoL in network adapter settings
- ✅ Use Ethernet (not Wi-Fi)
- ✅ Backend using host network mode
- ✅ Firewall allows UDP broadcasts

### Button doesn't work?
- Open browser console (F12)
- Check for JavaScript errors
- Verify assets loaded (Network tab)
- Rebuild: `docker-compose build wol-frontend`

### Frontend can't reach backend?
- `docker-compose ps` - both running?
- `docker-compose logs` - check errors
- Nginx proxies to `host.docker.internal:3000`

## 💡 Why This Stack?

| Choice | Why |
|--------|-----|
| **Vite** | Zero config, instant HMR, 1.7KB output |
| **Nginx** | Industry standard, tiny image, efficient |
| **Separate containers** | Clean separation, backend needs host network |
| **No React** | Overkill for simple app, vanilla JS is 10x smaller |

## 📄 License

MIT - Do whatever you want! 🎉
