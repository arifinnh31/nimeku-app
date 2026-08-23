# NimeKu - Modern Anime Streaming Platform

<div align="center">
  <h3>Platform Streaming & Informasi Anime Modern Berbasis Next.js 16</h3>
  <p>Dibangun dengan performa tinggi, desain antarmuka modern, dan pengalaman pengguna yang mulus.</p>
</div>

---

## 🌟 Fitur Utama

### 🎬 Pengalaman Pengguna (Public Interface)
- **Katalog & Navigasi Anime**: Jelajahi anime berdasarkan genre, status, season, studio, dan rating dengan sistem filter interaktif.
- **Player Streaming Responsif**: Pemutar video multi-server dengan dukungan mode *embed* (Streamwish, Dood, GDrive, dll.) dan *direct streaming* (mp4/m3u8).
- **Mode Bioskop (*Lights Off*)**: Fitur peredup layar untuk pengalaman menonton yang lebih fokus dan imersif.
- **Riwayat Tontonan (*Watch History*) & Bookmark**: Pencatatan otomatis anime yang ditonton dan anime favorit berbasis penyimpanan lokal yang sinkron antar-tab.
- **Jadwal Rilis Anime**: Tampilan jadwal tayang anime berdasarkan hari dan jam tayang.
- **Pencarian Realtime**: Pencarian instan anime dengan autocomplete dan preview poster.
- **Dark / Light Mode**: Transisi tema melingkar (*circular wave view transition*) yang halus dan dinamis dari titik tengah atas layar.
- **Streaming UI & Instant Skeletons**: Perpindahan halaman instan (0ms) dengan animasi kerangka *skeleton pulse* proporsional di seluruh rute (Home, Detail, Watch Player, Katalog, Jadwal, dan Dashboard Admin).

### 🛡️ Panel Admin & Manajemen Konten
- **Dashboard Analitik**: Statistik realtime mencakup total anime, total episode, grafik pertumbuhan trafik, dan filter periode penayangan (*Hari Ini, 7 Hari, 30 Hari, Tahun Ini, Semua Waktu*).
- **Integrasi AniList GraphQL API**: Fitur auto-fill metadata anime (judul Romaji/English/Jepang, sinopsis bahasa Indonesia, cover HD, banner, genre, studio, season, total episode) hanya dengan mencari judul atau ID anime.
- **Tarik Top 100 Anime**: Otomatis mengimpor 100 anime terpopuler lengkap dengan sinopsis bahasa Indonesia dan resolusi duplikasi slug otomatis.
- **Kelola Anime**: Form CRUD lengkap untuk menambah, memperbarui, dan menghapus anime dengan dialog konfirmasi aman.
- **Kelola Episode & Multi-Server**: Dukungan penambahan unlimited server streaming dan link download per resolusi (360p, 480p, 720p, 1080p).
- **Autentikasi Aman**: Akses admin terlindungi dengan Supabase Auth dan middleware Next.js.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- **Library UI**: [React 19](https://react.dev/), [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **Autentikasi**: Supabase Auth (SSR & Middleware)
- **Notifikasi**: [Sonner](https://sonner.emilkowal.ski/)
- **Animasi**: CSS View Transitions API (Web Animations API)

---

## 🛠️ Panduan Memulai (Getting Started)

### 1. Kloning Repositori
```bash
git clone https://github.com/arifinnh31/nimeku-app.git
cd nimeku-app
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env` di root project dan lengkapi konfigurasi berikut:
```env
# Database PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Base Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Setup Database & Prisma
```bash
# Generate Prisma Client
npx prisma generate

# Sinkronisasi schema ke database
npx prisma db push
```

### 5. Jalankan Server Pengembangan

```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 📦 Skrip NPM yang Tersedia

| Skrip | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Next.js development server |
| `npm run build` | Menjalankan generate Prisma client dan build produksi |
| `npm run start` | Menjalankan aplikasi hasil build produksi |
| `npm run lint` | Menjalankan ESLint untuk pemeriksaan kualitas kode |

---

## 📄 Lisensi
Didistribusikan di bawah Lisensi MIT.
