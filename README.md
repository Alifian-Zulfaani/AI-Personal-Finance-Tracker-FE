# 📱 FinAI - AI Personal Finance Tracker (Frontend Client)

Selamat datang di repositori Frontend Client untuk **FinAI - AI Personal Finance Tracker**. Aplikasi web ini dibangun menggunakan **Next.js 14 (App Router)**, **React**, **TypeScript**, dan **Tailwind CSS**. Frontend ini berinteraksi langsung dengan Express API Backend untuk mengelola data transaksi pengguna dan memproses interaksi kecerdasan buatan bersama asisten **FinAI** yang ditenagai oleh Google Gemini AI.

---

## 🛠️ Tech Stack & Library Utama

Aplikasi frontend ini menggunakan kombinasi framework modern dan library penunjang visual guna menciptakan antarmuka pengguna yang interaktif dan responsif:

*   **Framework Utama:** Next.js 14 (App Router) & React 18
*   **Styling:** Tailwind CSS (dengan utilitas kustomisasi visual premium)
*   **Visualisasi Data / Chart:** Recharts (Interaktif SVG Charts)
*   **Icons:** Lucide React (Desain ikon bersih & minimalis)
*   **HTTP Client:** Axios (Dilengkapi interceptor JWT otomatis)
*   **Form & Validation:** React Hook Form & Zod
*   **State Management:** React Context API (untuk Autentikasi Global)

---

## ✨ Fitur Antarmuka Pengguna (UI/UX)

1.  **Dashboard Finansial Interaktif:**
    *   Ringkasan saldo bersih (*Net Balance*), total pemasukan (*Total Income*), dan total pengeluaran (*Total Expense*) dalam kartu visual yang elegan.
    *   Grafik perbandingan Pemasukan vs Pengeluaran bulanan menggunakan *Bar Chart*.
    *   Diagram lingkaran (*Pie Chart*) interaktif yang memvisualisasikan alokasi pengeluaran berdasarkan kategori.
    *   Tampilan ringkas dari beberapa transaksi terakhir.

2.  **Manajemen Transaksi CRUD:**
    *   Tabel transaksi lengkap dengan sistem filter kategori, tipe transaksi (pemasukan/pengeluaran), serta jangka tanggal.
    *   Formulir tambah & ubah transaksi.
    *   **Fitur Spesial AI Auto-Categorize:** Cukup ketik deskripsi pengeluaran Anda (misal: `"Makan sate kambing bersama keluarga"`), lalu klik tombol *Auto-Categorize*, sistem akan otomatis mengisi kategori yang tepat (*Makanan & Minuman*) menggunakan kecerdasan Gemini AI.

3.  **Halaman Chat FinAI (Asisten Keuangan Pribadi):**
    *   Ruang percakapan interaktif mirip chat app modern untuk berkonsultasi keuangan secara langsung.
    *   Sidebar yang mengelola riwayat sesi percakapan terdahulu (*Chat Sessions*).
    *   Asisten FinAI akan menganalisis portofolio keuangan Anda secara otomatis dan memberikan jawaban cerdas serta tips menabung yang aplikatif.

4.  **Autentikasi & Proteksi Halaman:**
    *   Halaman Login & Registrasi yang responsif dilengkapi validasi instan.
    *   Proteksi rute (*Route Protection*) untuk mengalihkan pengguna yang belum login kembali ke halaman login.

---

## 📋 Struktur Folder Frontend

```text
client/
├── src/
│   ├── app/                # Halaman utama dengan struktur App Router
│   │   ├── (auth)/         # Halaman login & register (Grup Rute)
│   │   ├── (dashboard)/    # Halaman dashboard, transactions, dan chat
│   │   ├── globals.css     # Konfigurasi Tailwind & Global styling
│   │   ├── layout.tsx      # Layout utama HTML & Font config
│   │   └── page.tsx        # Halaman Landing Page awal
│   ├── components/         # Komponen UI modular
│   │   ├── layout/         # Komponen layout (Sidebar & DashboardLayout)
│   │   └── ui/             # Komponen UI primitif (Button, Input, Card, dll)
│   ├── context/            # AuthContext untuk menyimpan status login user
│   ├── lib/                # Fungsi utilitas pembantu (utils.ts)
│   ├── services/           # Handler integrasi API (axios, authService, dll)
│   └── types/              # Type definitions untuk TypeScript
├── postcss.config.mjs      # Konfigurasi PostCSS
├── tailwind.config.ts      # Konfigurasi custom theme & warna Tailwind
├── tsconfig.json           # Konfigurasi TypeScript compiler
└── package.json            # Daftar dependencies frontend
```

---

## ⚙️ Persyaratan Sistem (Prerequisites)

Sebelum menjalankan frontend, pastikan Anda telah memiliki:
*   [Node.js](https://nodejs.org/) (versi 18 ke atas)
*   **Backend Server** yang sudah berjalan di port lokal (default: `http://localhost:5000`)

---

## 🚀 Panduan Instalasi & Konfigurasi

1.  **Pindah ke direktori client:**
    ```bash
    cd client
    ```

2.  **Instalasi dependencies:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variables:**
    Buat file `.env.local` di dalam direktori `/client` untuk menyambungkan frontend ke backend:
    ```env
    # URL Endpoint API Backend (sesuaikan dengan port backend Anda)
    NEXT_PUBLIC_API_URL="http://localhost:5000/api"
    ```

---

## 🏃 Memulai Menjalankan Aplikasi Frontend

### Mode Pengembangan (Development)
Jalankan server lokal Next.js dengan fitur *Fast Refresh*:
```bash
npm run dev
```
Aplikasi frontend Anda sekarang dapat diakses di: **`http://localhost:3000`**

### Mode Produksi (Production)
Untuk melakukan compile dan menjalankan aplikasi dalam mode produksi:
```bash
# 1. Build aplikasi Next.js ke file optimasi produksi
npm run build

# 2. Jalankan aplikasi hasil build
npm run start
```
