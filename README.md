# VARDHATE OS - React + Vite (Frontend-Only)

This project is a modern, high-performance React + Vite Single-Page Application (SPA) that operates entirely on the client-side. There are no server-side database or PHP runtime requirements. All custom settings and changes are persisted locally inside the browser's `localStorage`.

---

## Project Structure
- **`/frontend`**: React + Vite single-page application (SPA).
- **`/frontend/public/assets`**: Media files, videos, icons, and logos.
- **`/frontend/src`**: Modular React components, canvas physics engines, and layouts.

---

## 🛠 Local Development Setup

To run the project locally:

1. Open a terminal and run the launcher script:
   ```bash
   powershell -ExecutionPolicy Bypass -File .\run.ps1
   ```
   *(This script will verify your local environment, download a portable Node.js runtime if missing, install packages, and spin up the Vite development server automatically).*

2. Or, run manually if you have Node.js installed:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The application will launch at **`http://localhost:5173`**.

---

## 🚀 Production Deployment

### 1. Compile the Static Frontend
Compile your React application into pure, super-fast static HTML, CSS, and JS assets:
```bash
cd frontend
npm run dev
npm run build
```
This generates the compiled web files inside the `/frontend/dist` directory.

### 2. Upload to Hosting
Simply copy all files inside `/frontend/dist/` (like `index.html`, the `assets` folder, etc.) directly into your web hosting public directory (e.g. `public_html/` or your root folder). You can host this on any platform (GitHub Pages, Vercel, Netlify, cPanel, GoDaddy, Hostinger, etc.).

---

## 🔑 Authentication Settings
- **Viewer Access Password**: `demo` (provides access to the Script Chapter Board).
- **CMS Admin Password**: `admin123` (provides access to the homepage section builder and custom services editor).
