# tic-tac-toe
## Deskripsi
Project Tic Tac Toe sederhana.

## Teknologi yang digunakan
- HTML
- CSS
- JavaScript
- VsCode
  
## Features
👥 Play with Friend & 🤖 Play with Computer
Pemain dapat memilih mode permainan: bermain melawan teman secara lokal (Player vs Player), atau melawan komputer (Player vs Computer).

🔧 Grid Size (Ukuran Papan Dinamis)
Pengguna bisa menyesuaikan ukuran papan permainan mulai dari 3x3 hingga 6x6.

🚀 Start Game
Setelah memilih mode permainan dan ukuran papan, tombol Start digunakan untuk memulai permainan.

🟩 Dinamis Grid Board :
Papan permainan akan disesuaikan secara otomatis berdasarkan ukuran grid yang dipilih.

🏆 Scoreboard :
Menampilkan jumlah kemenangan masing-masing pemain selama sesi berlangsung, dan tetap terjaga meskipun permainan di-restart.

🎉 Win Popup Notification :
Saat salah satu pemain menang atau terjadi seri, akan muncul popup notifikasi dengan pesan hasil dan tombol untuk melanjutkan permainan.

🔁 Tombol Restart :
Pemain bisa me-reset papan permainan kapan saja untuk memulai ronde baru tanpa mengubah skor.

🏠 Home Button :
Tombol ini memungkinkan pemain kembali ke halaman utama untuk memilih ulang mode permainan dan ukuran papan.  

##Setup Instructions
 1. Clone repository
git clone https://github.com/citrapratiwi4/tic-tac-toe.git 

 2. Masuk ke folder project
cd tic-tac-toe 

 3. Buka di browser
Buka file index.html di browser lokal atau deploy ke GitHub Pages.

## AI Support Explanation
Pada mode Player vs Computer (PvC), permainan menggunakan logika AI sederhana yang diimplementasikan langsung di dalam JavaScript. 
AI ini tidak menggunakan API eksternal dan tidak memanfaatkan token AI dari IBM, melainkan berjalan secara lokal di sisi pengguna (client-side).
AI dikembangkan menggunakan strategi heuristik sebagai berikut:
  - Menang jika bisa – AI akan memeriksa apakah ada langkah yang langsung menghasilkan kemenangan.
  - Blokir lawan – Jika pemain hampir menang, AI akan memblokir langkah tersebut.
  - Ambil posisi strategis – AI akan mencoba mengambil posisi tengah atau sudut.
  - Evaluasi heuristik – Jika tidak ada langkah kritis,AI akan menghitung skor potensial untuk setiap langkah menggunakan fungsi evaluateBoard() dan memilih langkah dengan skor tertinggi.
  - Fallback acak – Jika semua langkah setara, AI akan memilih langkah acak dari yang tersedia.
