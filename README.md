# 📘 Frontend Aplikasi Pengajuan Izin

Ini adalah repository **frontend** untuk Aplikasi Pengajuan Izin.  
Project ini dibangun menggunakan **Vite + React**, dan terhubung dengan backend yang tersedia pada repository berikut:

🔗 [Repo Backend Aplikasi Izin](https://github.com/Ianrury/back_end_web_izin)

---

## ⚙️ Persiapan Awal

### 1. Clone Repository

```bash
git clone <URL_REPOSITORY_FRONTEND>
cd <nama-folder>
```

### 2. Install Dependencies

```bash
npm install 
```

### 3. Buat File Environment
Buat file .env di root project (atau copy dari .env.example jika tersedia), lalu isi dengan konfigurasi berikut:
```bash
VITE_API_URL=http://localhost:4000/api
```

### 3. Buat File Environment
Buat file .env di root project (atau copy dari .env.example jika tersedia), lalu isi dengan konfigurasi berikut:
```bash
VITE_API_URL=http://localhost:4000/api
```

## ⚙️ Jalankan Aplikasi
```bash
npm run dev
```

## ⚙️ Akses Aplikasi
Setelah menjalankan perintah npm run dev, aplikasi akan berjalan di:
```bash
http://localhost:5173/
```
⚠️ Catatan Penting:
Port 5173 digunakan karena sudah didaftarkan di backend sebagai origin yang diizinkan agar tidak terkena CORS error.

## ⚙️ Dokumentasi Backend
Untuk petunjuk dan endpoint API yang digunakan oleh frontend ini, silakan lihat dokumentasi backend pada repo berikut:
🔗 https://github.com/Ianrury/back_end_web_izin


