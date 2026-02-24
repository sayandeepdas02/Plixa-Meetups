# 🎨 Plixa - Real-Time Collaborative Whiteboard & Video Meetings

<div align="center">

![Plixa Logo](./frontend-react/src/assets/logo.png)

**Professional real-time collaboration — draw, talk, and build together**

[![GitHub](https://img.shields.io/badge/GitHub-Plixa--Meetups-blue?logo=github)](https://github.com/sayandeepdas02/Plixa-Meetups)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://reactjs.org/)

[Live Demo](http://localhost:5173) • [Report Bug](https://github.com/sayandeepdas02/Plixa-Meetups/issues) • [Request Feature](https://github.com/sayandeepdas02/Plixa-Meetups/issues)

</div>

---

## 📖 About The Project

**Plixa** is a full-featured, real-time collaborative platform built on **WebRTC** and **Socket.IO**. It brings together an infinite whiteboard canvas, a live in-room chat, and **voice & video calling** — all inside one seamless browser experience with no downloads required.

### ✨ Key Features

- 🚀 **Real-Time Collaboration** — Sub-millisecond whiteboard sync via Socket.IO mesh signaling
- 🎨 **Professional Drawing Tools** — Shapes, arrows, freehand, text, eraser, and color palette
- 📹 **Voice & Video Calls** — Peer-to-peer audio/video via WebRTC mesh network
- 🎤 **Media Controls** — Toggle mic, camera on/off; leave call without leaving the board
- 👥 **Participant Grid** — Dynamic video grid (`VideoGrid`) with individual participant tiles (`VideoTile`)
- 💬 **Real-Time Chat** — Persistent in-room chat alongside the board
- 🔒 **Secure & Private** — JWT authentication; end-to-end peer connections
- 🌐 **Browser-Based** — Just share a link, no plugins needed
- 🎯 **Infinite Canvas** — Pan and zoom for unlimited workspace
- 📱 **Responsive Design** — Desktop, tablet, and mobile friendly

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI library |
| Vite | 7.2 | Build tool & dev server |
| TailwindCSS | 4.1 | Utility-first styling |
| React Router DOM | 7.9 | Client-side routing |
| Socket.io Client | 4.8 | Real-time signaling & chat |
| WebRTC (native) | — | Peer-to-peer audio/video |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | v18+ | JavaScript runtime |
| Express | 5.1 | HTTP server framework |
| Socket.io | 4.8 | WebSocket / signaling server |
| JWT | — | Stateless authentication |
| bcryptjs | — | Password hashing |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A browser with WebRTC support (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sayandeepdas02/Plixa-Meetups.git
   cd Plixa-Meetups
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   Installs dependencies for the root, backend, and frontend in one step.

3. **Configure environment variables**

   Create a `.env` file inside the `backend/` directory:
   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   Starts concurrently:
   - Backend (Express + Socket.IO) → `http://localhost:3000`
   - Frontend (Vite + React) → `http://localhost:5173`

5. **Open your browser** and navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
Plixa-Meetups/
├── backend/                        # Node.js + Express + Socket.IO backend
│   ├── index.js                    # Main server entry point
│   ├── models.js                   # In-memory data models (rooms, users)
│   ├── socket/                     # Modular Socket.IO event handlers
│   │   ├── whiteboardHandlers.js   # Whiteboard draw & sync events
│   │   ├── chatHandlers.js         # Real-time chat events
│   │   └── webrtcHandlers.js       # WebRTC signaling (offer/answer/ICE)
│   └── package.json
│
├── frontend-react/                 # React + Vite frontend
│   ├── src/
│   │   ├── assets/                 # Logos and static assets
│   │   ├── components/
│   │   │   ├── chat/               # Chat panel components
│   │   │   └── webrtc/             # Voice & video components
│   │   │       ├── VideoGrid.jsx   # Responsive participant video grid
│   │   │       ├── VideoTile.jsx   # Individual participant video tile
│   │   │       └── CallControls.jsx# Mic / Camera / Leave controls
│   │   ├── context/                # React Context providers
│   │   ├── hooks/
│   │   │   └── useWebRTC.js        # Custom hook: WebRTC lifecycle & media
│   │   ├── pages/                  # Landing, Auth, Board page components
│   │   ├── App.jsx                 # Root component & routing
│   │   └── main.jsx                # Vite entry point
│   ├── index.html
│   └── package.json
│
├── package.json                    # Root scripts (dev, install-all)
└── README.md
```

---

## 🎯 Usage

### Starting a Board
1. Sign up or log in
2. Click **"Start Whiteboarding"** on the landing page
3. A new board with a unique room ID is created
4. Share the URL with collaborators — they join instantly

### Drawing Tools
- **Freehand** — Click and drag to sketch freely
- **Shapes** — Rectangles, circles, arrows, and lines
- **Text** — Annotate with text boxes
- **Eraser** — Remove specific strokes
- **Color Picker** — Full palette for strokes and fills

### Voice & Video Call
1. Click the **📹 Join Call** button in the board toolbar
2. Allow browser permission for camera and microphone
3. Participants appear in the **Video Grid** overlay
4. Use **CallControls** to:
   - 🎤 Toggle microphone on/off
   - 📷 Toggle camera on/off
   - 📞 Leave the call (stays on the board)

### Chat
- Click the **💬 Chat** panel to open the sidebar
- Messages are broadcast in real-time to all room participants

---

## 🌐 WebRTC Architecture

Plixa uses a **peer-to-peer mesh** topology signaled via Socket.IO:

```
                  ┌─────────────────────┐
                  │  Socket.IO Server   │
                  │  (Signaling Only)   │
                  └──────┬──────┬───────┘
                  offer/ │      │ ICE candidates
                  answer │      │
            ┌────────────┘      └────────────┐
            ▼                                ▼
     ┌─────────────┐    P2P Media     ┌─────────────┐
     │   Peer A    │◄────────────────►│   Peer B    │
     │ useWebRTC   │                  │ useWebRTC   │
     └─────────────┘                  └─────────────┘
```

- **`webrtcHandlers.js`** — Handles `join-call`, `leave-call`, `offer`, `answer`, `ice-candidate` events on the server
- **`useWebRTC.js`** — Manages `RTCPeerConnection` lifecycle, local/remote streams, and media track toggling
- **`VideoGrid.jsx`** — Renders a dynamic CSS grid of all live participants
- **`VideoTile.jsx`** — Displays a single participant's stream with name overlay and mute indicators
- **`CallControls.jsx`** — Toolbar buttons and state for mic, camera, and call exit

---

## 📝 Available Scripts

### Root Directory
```bash
npm run dev          # Start backend + frontend concurrently
npm run install-all  # Install all project dependencies
```

### Backend (`/backend`)
```bash
npm run dev    # Start with nodemon (auto-reload on change)
npm start      # Production mode
```

### Frontend (`/frontend-react`)
```bash
npm run dev      # Vite dev server with HMR
npm run build    # Production bundle
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

Contributions are very welcome!

1. Fork the Project
2. Create a Feature Branch: `git checkout -b feature/YourFeature`
3. Commit your Changes: `git commit -m 'feat: add YourFeature'`
4. Push to the Branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Sayandeep Das**

- GitHub: [@sayandeepdas02](https://github.com/sayandeepdas02)
- Project: [Plixa-Meetups](https://github.com/sayandeepdas02/Plixa-Meetups)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Socket.io](https://socket.io/)
- [WebRTC](https://webrtc.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)

---

<div align="center">

**Built with ❤️ using WebRTC + Socket.IO for real-time collaboration**

⭐ Star this repo if you find it helpful!

</div>