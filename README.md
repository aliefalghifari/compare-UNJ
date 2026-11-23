BantuIn — UMKM Operational Assistant

Sistem pendukung operasional UMKM berbasis Natural Language Processing (NLP) dan analisis data.

BantuIn merupakan proyek pengembangan sistem pendukung operasional UMKM yang berfokus pada dua permasalahan utama: efisiensi layanan pelanggan dan analisis profitabilitas produk.

Sistem ini dirancang untuk membantu staf Customer Service (CS) dalam memahami serta memproses pesan pelanggan, sekaligus membantu pemilik usaha memperoleh gambaran keuntungan produk berdasarkan data transaksi dan biaya operasional.

BantuIn dikembangkan dengan mengintegrasikan model NLP, backend API, dan basis data dalam satu sistem yang modular.

«Proyek ini dikembangkan sebagai bagian dari COMPARE 2026 dan masih berada dalam tahap pengembangan.»

---

Tujuan Proyek

BantuIn memiliki dua fokus pengembangan utama:

1. Customer Service Assistant: mengurangi pekerjaan repetitif staf CS melalui klasifikasi pesan, ekstraksi informasi, dan rekomendasi jawaban berdasarkan informasi toko.
2. Product Profitability Analytics: membantu pemilik UMKM memahami keuntungan produk secara lebih transparan dengan memperhitungkan modal, biaya marketplace, voucher, ongkos kirim, dan komponen biaya lainnya.

Sistem ini dirancang sebagai alat bantu operasional, bukan pengganti keputusan staf maupun pemilik usaha.

---

Fitur dan Modul

1. Customer Service Assistant

Modul ini berfokus pada pemrosesan pesan pelanggan menggunakan model NLP dan business logic pada backend.

Fitur yang telah diimplementasikan:

- Klasifikasi intent pesan pelanggan.
- Ekstraksi entitas dari pesan menggunakan model NLP.
- Integrasi model intent classification dan entity extraction melalui backend.
- Routing permintaan berdasarkan intent yang teridentifikasi.
- Validasi entitas sebelum menjalankan operasi bisnis.
- Handler untuk permintaan informasi produk.
- Pencarian informasi produk melalui Supabase.
- Penyusunan draft jawaban berdasarkan hasil pemrosesan backend.

Pengembangan selanjutnya:

- Penyelesaian handler untuk berbagai jenis intent pelanggan, seperti:
  - "product_inquiry"
  - "shipping_schedule"
  - "shipping_issue"
  - "order_cancellation"
  - "address_change"
  - Intent lain yang relevan dengan kebutuhan operasional toko.
- Pengembangan mekanisme klarifikasi otomatis ketika informasi pelanggan belum lengkap.
- Penanganan permintaan yang tidak didukung atau memiliki informasi yang belum dapat dipastikan.
- Integrasi seluruh handler dengan business service dan basis data yang sesuai.
- Pengembangan pengelolaan informasi toko, termasuk katalog, stok, dan aturan pengiriman.
- Penyempurnaan response builder agar rekomendasi jawaban lebih konsisten dan sesuai konteks.

2. Pengembangan Model NLP

BantuIn menggunakan pendekatan NLP berbasis IndoBERT untuk memahami pesan pelanggan.

Saat ini, sistem menggunakan dua model dengan tanggung jawab berbeda:

- Intent Classification: mengidentifikasi tujuan atau maksud pelanggan ketika mengirimkan pesan.
- Entity Extraction: menemukan informasi penting dalam pesan, seperti nama produk dan informasi pendukung lainnya.

Kedua model diintegrasikan melalui backend untuk menghasilkan informasi terstruktur yang dapat digunakan oleh business logic.

Target pengembangan model:

- Meningkatkan akurasi klasifikasi intent.
- Meningkatkan kemampuan ekstraksi entitas.
- Memperbaiki pemahaman terhadap bahasa informal dan percakapan sehari-hari.
- Menangani singkatan, variasi penulisan, dan kesalahan ketik.
- Meningkatkan kemampuan model dalam membedakan pesan dengan maksud yang serupa.
- Memperluas dataset pelatihan dengan variasi pesan yang lebih representatif.
- Melakukan evaluasi menggunakan precision, recall, F1-score, dan confusion matrix.
- Mengurangi kesalahan prediksi yang dapat menyebabkan kesalahan pemrosesan permintaan pelanggan.

3. Product Profitability Analytics

Modul ini ditujukan untuk membantu pemilik UMKM memahami profitabilitas produk berdasarkan data penjualan dan biaya.

Pendapatan yang tinggi tidak selalu mencerminkan keuntungan yang tinggi. Potongan marketplace, voucher, modal produk, biaya pengiriman, dan retur dapat memengaruhi keuntungan akhir.

Fitur yang direncanakan:

- Input data transaksi secara manual.
- Impor data transaksi melalui berkas.
- Pencatatan modal produk.
- Pencatatan biaya marketplace.
- Pencatatan voucher dan diskon yang ditanggung penjual.
- Pencatatan biaya pengiriman dan retur.
- Perhitungan pendapatan bersih.
- Perhitungan keuntungan dan margin keuntungan.
- Analisis profitabilitas berdasarkan produk.
- Perbandingan keuntungan antar-marketplace.
- Filter analisis berdasarkan periode.
- Validasi data transaksi dan komponen biaya yang belum lengkap.

Perhitungan utama:

Pendapatan bersih:

"Pendapatan Penjualan - Potongan dan Biaya Penjualan"

Keuntungan:

"Pendapatan Bersih - Modal Produk - Biaya Operasional Terkait"

Sistem dirancang agar komponen perhitungan dapat ditelusuri sehingga pengguna dapat memahami faktor yang memengaruhi keuntungan produk.

---

Arsitektur Sistem

BantuIn menggunakan pendekatan modular dengan pemisahan tanggung jawab antara frontend, backend, model NLP, dan layanan bisnis.

              CUSTOMER MESSAGE
                      |
                      v
               NEXT.JS FRONTEND
                      |
                      v
                FASTAPI BACKEND
                      |
                      v
                INFERENCE SERVICE
                      |
                      v
             HUGGING FACE INFERENCE
                      |
              +-------+-------+
              |               |
              v               v
          INTENT           ENTITY
      CLASSIFICATION      EXTRACTION
              |               |
              +-------+-------+
                      |
                      v
                BASE HANDLER
                      |
                      v
                INTENT ROUTING
                      |
                      v
              SPECIFIC HANDLER
                      |
                      v
              BUSINESS SERVICE
                      |
                      v
                   SUPABASE
                      |
                      v
               HANDLER RESULTS
                      |
                      v
              RESPONSE BUILDER
                      |
                      v
               DRAFT RESPONSE
                      |
                      v
                FRONTEND

Arsitektur tersebut memungkinkan pengembangan model NLP dan business logic dilakukan secara terpisah.

Model bertanggung jawab memahami pesan pelanggan, sedangkan backend bertanggung jawab memvalidasi informasi, menentukan tindakan, dan mengakses data bisnis.

---

Teknologi yang Digunakan

Komponen| Teknologi
Frontend| Next.js, React, TypeScript
Styling| Tailwind CSS
Backend| Python, FastAPI
Machine Learning| PyTorch
NLP| IndoBERT, Transformers
Model Deployment| Hugging Face Spaces
HTTP Communication| HTTPX
Database| Supabase
API Communication| REST API, JSON

---

Struktur Proyek

bantuin/
├── backend/
│   ├── app/
│   │   ├── handlers/       # Pemrosesan berdasarkan intent
│   │   ├── router/         # Routing API
│   │   └── schema/         # Skema request dan response
│   ├── database/           # Koneksi database
│   ├── response/           # Penyusunan draft jawaban
│   ├── services/           # Inference dan business services
│   └── main.py             # Entry point FastAPI
│
├── docs/
│   └── PRD.md              # Product Requirements Document
│
├── frontend/               # Aplikasi Next.js
│
├── training/               # Resource pengembangan model
│
└── README.md

---

Menjalankan Proyek

Persyaratan

- Python 3.10 atau versi yang kompatibel dengan dependensi.
- Node.js dan npm.
- Akun Hugging Face.
- Proyek Supabase.

1. Clone Repository

git clone https://github.com/aliefalghifari/compare-UNJ.git

cd compare-UNJ

2. Menyiapkan Backend

python -m venv .venv

Aktifkan virtual environment:

# Windows PowerShell
.venv\Scripts\Activate.ps1

Instal dependensi:

pip install -r backend/requirements.txt

3. Konfigurasi Environment Variables

Buat file ".env" di dalam direktori "backend/".

HF_SPACE_URL=your_huggingface_space_url
HF_TOKEN=your_huggingface_token

SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_secret_key

Sesuaikan konfigurasi dengan kredensial layanan yang digunakan.

Jangan mengunggah file ".env" atau kredensial pribadi ke repository publik.

4. Menjalankan Backend

Dari direktori utama proyek:

uvicorn backend.main:app --reload

API tersedia melalui:

"http://localhost:8000"

Dokumentasi API:

"http://localhost:8000/docs"

5. Menjalankan Frontend

Buka terminal baru:

cd frontend

npm install

npm run dev

Aplikasi dapat diakses melalui:

"http://localhost:3000"

---

Roadmap Pengembangan

Pengembangan BantuIn dilakukan secara bertahap dengan mempertimbangkan kebutuhan sistem dan kesiapan setiap komponennya.

Tahap| Fokus Pengembangan
1| Integrasi model intent classification dan entity extraction
2| Pengembangan arsitektur backend dan handler
3| Penyelesaian handler untuk seluruh intent yang dibutuhkan
4| Peningkatan kualitas dataset dan performa model NLP
5| Pengembangan mekanisme klarifikasi dan rekomendasi jawaban
6| Pengembangan modul analisis profitabilitas
7| Integrasi seluruh modul dan pengujian sistem

Roadmap ini bersifat dinamis dan dapat berubah mengikuti hasil evaluasi selama pengembangan.

---

Dokumentasi

Dokumentasi kebutuhan produk dapat dilihat melalui:

- "Product Requirements Document (PRD)" (docs/PRD.md)

Status Proyek

BantuIn masih dalam tahap pengembangan. Implementasi saat ini berfokus pada integrasi model NLP, pengembangan backend orchestration, dan handler untuk memproses permintaan pelanggan.

Pengembangan berikutnya mencakup penyelesaian seluruh handler, peningkatan kemampuan model dalam memahami pesan pelanggan, serta implementasi modul Product Profitability Analytics.

---

Lisensi

Belum terdapat lisensi resmi yang ditetapkan pada repository ini. Penggunaan dan distribusi ulang kode mengikuti ketentuan pemilik repository.
