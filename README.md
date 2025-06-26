# Documentasi Instalasi FRONEND

📘 Frontend Aplikasi Pengajuan Izin
Ini adalah repository frontend untuk Aplikasi Pengajuan Izin. Project ini dibangun menggunakan Vite + React, dan terhubung dengan backend yang tersedia pada repository berikut:
🔗 Repo Backend Aplikasi Izin

⚙️ Persiapan Awal
Clone repository frontend ini ke lokal:

bash
Salin
Edit
git clone <URL_REPOSITORY_FRONTEND>
cd <nama-folder>
Install semua dependencies menggunakan npm:

bash
Salin
Edit
npm install
Buat file environment .env di root project (atau copy dari .env.example jika tersedia), lalu isi dengan konfigurasi berikut:

env
Salin
Edit
VITE_API_URL=http://localhost:4000/api
Jalankan aplikasi frontend dengan perintah:

bash
Salin
Edit
npm run dev
🌐 Akses Aplikasi
Setelah menjalankan perintah npm run dev, aplikasi akan berjalan di:

arduino
Salin
Edit
http://localhost:5173/
⚠️ Catatan Penting:
Port 5173 digunakan karena sudah didaftarkan di backend sebagai origin yang diizinkan untuk menghindari masalah CORS.

📦 Teknologi yang Digunakan
Vite

React

Tailwind CSS

Axios

React Router DOM

📑 Dokumentasi Backend
Untuk petunjuk dan endpoint API yang digunakan oleh frontend ini, silakan lihat dokumentasi backend pada repo berikut:

🔗 https://github.com/Ianrury/back_end_web_izin

