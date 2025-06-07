# 📋 Frontend Project Structure

📦 Frontend-Project/
├── 📁 node_modules/            # Folder dependensi npm (auto-generated)
│
├── 📂 src/                     # Source code utama aplikasi
│   ├── 🧩 components/          # Komponen UI yang dapat digunakan ulang
│   │   ├── 📐 layouts/         # Komponen layout (header, sidebar, footer)
│   │   ├── 🗺️ map/             # Komponen khusus untuk fitur peta/mapping
│   │   └── 🎨 ui/              # Komponen UI dasar (button, input, modal, dll)
│   │
│   ├── 📚 lib/                 # Utilities dan helper functions
│   │   └── 📊 mockData.ts      # Data dummy untuk testing/development
│   │
│   ├── 📄 pages/               # Halaman-halaman aplikasi (routing)
│   │   ├── 📊 dashboard/       # Halaman dashboard utama
│   │   └── 🌐 public/          # Halaman yang dapat diakses publik
│   │
│   ├── 🗄️ store/               # State management global
│   │   ├── 🔐 authStore.ts     # Mengelola state autentikasi user
│   │   ├── 👶 childrenStore.ts # Mengelola data anak-anak
│   │   └── 🏥 facilitiesStore.ts # Mengelola data fasilitas
│   │
│   └── 📝 types/               # Type definitions untuk TypeScript
│       └── 📋 index.ts         # Definisi tipe data aplikasi
│
├── 🚀 App.tsx                  # Komponen utama aplikasi
├── 🎨 index.css                # Styling global aplikasi
├── ⚡ main.tsx                 # Entry point aplikasi (Vite/React)
│
├── 📄 .env                     # Variabel lingkungan (API_URL, dll)
├── 📄 .gitignore               # File & folder yang tidak di-push ke Git
├── 🔧 package.json             # Info project & daftar dependensi
├── 📜 tsconfig.json            # Konfigurasi TypeScript
└── ⚙️ vite.config.ts           # Konfigurasi Vite bundler

## 🛠️ Tech Stack Analysis

### 🏗️ Core Framework & Build Tools
- **React 18.3.1** - Frontend framework utama
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 5.4.2** - Build tool & bundler (super fast)

### 🧭 Routing & Navigation
- **React Router DOM 6.22.2** - Client-side routing

### 🗄️ State Management
- **Zustand 4.5.0** - Lightweight state management (confirmed!)

### 🗺️ Maps & Spatial Features
- **Leaflet 1.9.4** - Open-source mapping library
- **React Leaflet 4.2.1** - React wrapper for Leaflet
- **@types/leaflet** - TypeScript definitions

### 📊 Data Visualization
- **Recharts 2.12.1** - Chart library untuk React

### 📝 Form Management
- **React Hook Form 7.50.0** - Performant form library

### 🎨 Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **PostCSS 8.4.35** - CSS processor
- **Autoprefixer 10.4.18** - CSS vendor prefixing
- **clsx 2.1.0** - Conditional className utility

### 🎯 Icons
- **Lucide React 0.344.0** - Beautiful icon library

### 🔧 Development Tools
- **ESLint 9.9.1** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Various ESLint plugins** - React hooks, refresh, etc.

## 📊 Fitur Utama
1. **Autentikasi** - Login/logout system
2. **Dashboard** - Ringkasan data dan analytics
3. **Manajemen Anak** - CRUD data anak
4. **Manajemen Fasilitas** - CRUD data fasilitas kesehatan
5. **Peta Interaktif** - Visualisasi lokasi fasilitas
6. **Halaman Publik** - Informasi yang dapat diakses umum
