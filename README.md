# 🎨 Plixa - Real-Time Collaborative Whiteboard

<div align="center">

![Plixa Logo](./frontend-react/src/assets/logo.png)

**Professional real-time collaboration for the modern web**

[![GitHub](https://img.shields.io/badge/GitHub-Plixa--Meetups-blue?logo=github)](https://github.com/sayandeepdas02/Plixa-Meetups)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://reactjs.org/)

[Live Demo](http://localhost:5173) • [Report Bug](https://github.com/sayandeepdas02/Plixa-Meetups/issues) • [Request Feature](https://github.com/sayandeepdas02/Plixa-Meetups/issues)

</div>

---

## 📖 About The Project

**Plixa** is a cutting-edge, real-time collaborative whiteboard application built with **WebRTC** technology. It enables seamless visual communication for remote teams, educators, and professionals with ultra-low latency and crystal-clear precision.

### ✨ Key Features

- 🚀 **Real-Time Collaboration** - See cursors and strokes update in milliseconds with WebRTC mesh network
- 🎨 **Professional Drawing Tools** - Complete set of shapes, arrows, text tools, and freehand drawing
- 🔒 **Secure & Private** - End-to-end encrypted connections, no data stored on servers
- 🌐 **Browser-Based** - No downloads required, just share a link and start collaborating
- 👥 **Multi-User Support** - Unlimited participants in Pro plan, up to 3 in free tier
- 💬 **Real-Time Chat** - Built-in chat functionality for seamless communication
- 🎯 **Infinite Canvas** - Never run out of space for your ideas
- 📱 **Responsive Design** - Works beautifully on desktop, tablet, and mobile devices

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - Modern UI library with latest features
- **Vite 7.2** - Lightning-fast build tool and dev server
- **TailwindCSS 4.1** - Utility-first CSS framework
- **React Router DOM 7.9** - Client-side routing
- **Socket.io Client 4.8** - Real-time bidirectional communication

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.1** - Fast, unopinionated web framework
- **Socket.io 4.8** - WebSocket library for real-time events
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

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
   This will install dependencies for the root, backend, and frontend.

3. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will concurrently start:
   - Backend server on `http://localhost:3000`
   - Frontend dev server on `http://localhost:5173`

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

---

## 📁 Project Structure

```
Whiteboard-app/
├── backend/                 # Node.js + Express + Socket.io backend
│   ├── index.js            # Main server file
│   ├── models.js           # Data models
│   └── package.json        # Backend dependencies
│
├── frontend-react/         # React + Vite frontend
│   ├── src/
│   │   ├── assets/         # Images, logos, and static files
│   │   ├── components/     # Reusable React components
│   │   ├── context/        # React Context providers
│   │   ├── pages/          # Page components (Landing, Auth, Board)
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── index.html          # HTML template
│   └── package.json        # Frontend dependencies
│
├── package.json            # Root package.json with scripts
└── README.md               # You are here!
```

---

## 🎯 Usage

### Creating a Board
1. Click **"Start Whiteboarding"** on the landing page
2. You'll be redirected to a new board with a unique ID
3. Share the board URL with your team members

### Drawing Tools
- **Freehand** - Click and drag to draw freely
- **Shapes** - Select from rectangles, circles, arrows, and more
- **Text** - Add text annotations to your board
- **Eraser** - Remove unwanted elements
- **Colors** - Choose from a variety of colors

### Collaboration
- **Real-time Updates** - See everyone's changes instantly
- **Cursor Tracking** - View other users' cursor positions
- **Chat** - Communicate with team members in real-time

---

## 🌟 Use Cases

- **Remote Teams** - Run retrospectives, brainstorming sessions, and sprint planning
- **Educators & Tutors** - Conduct interactive online lessons and tutoring sessions
- **System Design** - Architect complex systems for technical interviews
- **Creative Collaboration** - Collaborate on designs, wireframes, and mockups

---

## 📝 Available Scripts

### Root Directory
```bash
npm run dev          # Start both backend and frontend concurrently
npm run install-all  # Install dependencies for all packages
```

### Backend (`/backend`)
```bash
npm run dev          # Start backend with nodemon (auto-reload)
npm start            # Start backend in production mode
```

### Frontend (`/frontend-react`)
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory (optional):
```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Sayandeep Das**

- GitHub: [@sayandeepdas02](https://github.com/sayandeepdas02)
- Project Link: [Plixa-Meetups](https://github.com/sayandeepdas02/Plixa-Meetups)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Socket.io](https://socket.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)

---

<div align="center">

**Built with ❤️ using WebRTC for ultimate performance**

⭐ Star this repo if you find it helpful!

</div>