# BantuIn — Asisten Operasional UMKM

> Sistem pendukung operasional UMKM berbasis **Natural Language Processing (NLP)** dan **analisis data**.

![Status](https://img.shields.io/badge/status-dalam%20pengembangan-yellow)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![Frontend](https://img.shields.io/badge/frontend-Next.js-000000)
![NLP](https://img.shields.io/badge/NLP-IndoBERT-blue)

BantuIn dikembangkan sebagai bagian dari **COMPARE 2026** dan masih dalam tahap pengembangan.

---

## Daftar Isi

- [Latar Belakang](#latar-belakang)
- [Tujuan Proyek](#tujuan-proyek)
- [Fitur dan Modul](#fitur-dan-modul)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Teknologi](#teknologi)
- [Struktur Proyek](#struktur-proyek)
- [Menjalankan Proyek](#menjalankan-proyek)
- [Roadmap](#roadmap)
- [Dokumentasi](#dokumentasi)
- [Status Proyek](#status-proyek)
- [Lisensi](#lisensi)

---

## Latar Belakang

Pelaku UMKM yang berjualan lewat marketplace sering menghadapi dua masalah operasional:

1. **Layanan pelanggan memakan waktu.** Staf Customer Service (CS) harus membalas pesan yang sama berulang kali, seperti menanyakan stok, jadwal pengiriman, atau pembatalan pesanan.
2. **Keuntungan sulit dipantau.** Omzet yang tinggi belum tentu berarti untung tinggi, karena potongan marketplace, voucher, modal, ongkos kirim, dan retur ikut mengurangi keuntungan akhir.

BantuIn hadir untuk membantu kedua hal tersebut dalam satu sistem.

## Tujuan Proyek

BantuIn memiliki dua fokus utama:

| Fokus | Tujuan |
|---|---|
| **Customer Service Assistant** | Mengurangi pekerjaan repetitif staf CS lewat klasifikasi pesan, ekstraksi informasi, dan rekomendasi jawaban berdasarkan informasi toko. |
| **Product Profitability Analytics** | Membantu pemilik usaha memahami keuntungan setiap produk secara transparan dengan memperhitungkan modal, biaya marketplace, voucher, ongkos kirim, dan biaya lainnya. |

> **Catatan:** BantuIn dirancang sebagai **alat bantu**, bukan pengganti keputusan staf maupun pemilik usaha. Jawaban yang dihasilkan berupa *draft* yang tetap ditinjau oleh manusia.

---

## Fitur dan Modul

### 1. Customer Service Assistant

Memproses pesan pelanggan menggunakan model NLP dan business logic di backend.

**Sudah diimplementasikan**

- [x] Klasifikasi intent pesan pelanggan
- [x] Ekstraksi entitas dari pesan (misalnya nama produk)
- [x] Integrasi model intent dan entity melalui backend
- [x] Routing permintaan berdasarkan intent
- [x] Validasi entitas sebelum menjalankan operasi bisnis
- [x] Handler untuk permintaan informasi produk
- [x] Pencarian informasi produk melalui Supabase
- [x] Penyusunan draft jawaban dari hasil pemrosesan backend

**Rencana pengembangan**

- [ ] Handler untuk intent lain: `product_inquiry`, `shipping_schedule`, `shipping_issue`, `order_cancellation`, `address_change`, dan intent lain sesuai kebutuhan toko
- [ ] Klarifikasi otomatis saat informasi pelanggan belum lengkap
- [ ] Penanganan permintaan yang tidak didukung atau belum bisa dipastikan
- [ ] Integrasi seluruh handler dengan business service dan basis data
- [ ] Pengelolaan informasi toko (katalog, stok, aturan pengiriman)
- [ ] Penyempurnaan response builder agar rekomendasi jawaban konsisten dan sesuai konteks

### 2. Pengembangan Model NLP

BantuIn menggunakan **IndoBERT** dengan dua model yang bertanggung jawab berbeda:

| Model | Fungsi |
|---|---|
| **Intent Classification** | Mengidentifikasi maksud pelanggan saat mengirim pesan. |
| **Entity Extraction** | Menemukan informasi penting dalam pesan, seperti nama produk dan detail pendukung. |

Keduanya diintegrasikan lewat backend untuk menghasilkan informasi terstruktur bagi business logic.

**Target pengembangan model**

- Meningkatkan akurasi klasifikasi intent dan kemampuan ekstraksi entitas
- Memahami bahasa informal, singkatan, variasi penulisan, dan salah ketik
- Membedakan pesan dengan maksud yang mirip
- Memperluas dataset dengan variasi pesan yang lebih representatif
- Mengevaluasi model dengan precision, recall, F1-score, dan confusion matrix
- Mengurangi kesalahan prediksi yang dapat menyebabkan salah proses

### 3. Product Profitability Analytics

Membantu pemilik UMKM memahami profitabilitas produk dari data penjualan dan biaya.

**Fitur yang direncanakan**

- Input transaksi manual dan impor dari berkas
- Pencatatan modal produk, biaya marketplace, voucher/diskon yang ditanggung penjual, biaya pengiriman, dan retur
- Perhitungan pendapatan bersih, keuntungan, dan margin
- Analisis profitabilitas per produk dan perbandingan antar-marketplace
- Filter berdasarkan periode
- Validasi data transaksi dan komponen biaya yang belum lengkap

**Rumus utama**

```text
Pendapatan Bersih = Pendapatan Penjualan - Potongan dan Biaya Penjualan
Keuntungan        = Pendapatan Bersih - Modal Produk - Biaya Operasional Terkait
```

Setiap komponen perhitungan dirancang agar dapat ditelusuri, sehingga pengguna paham faktor apa saja yang memengaruhi keuntungan produk.

---

## Arsitektur Sistem

BantuIn memakai pendekatan modular: frontend, backend, model NLP, dan layanan bisnis dipisahkan tanggung jawabnya. Model bertugas **memahami** pesan, sedangkan backend bertugas **memvalidasi, menentukan tindakan, dan mengakses data**. Dengan begitu, pengembangan model dan business logic bisa dilakukan secara terpisah.

```text
Pesan Pelanggan
      │
      ▼
Next.js Frontend
      │
      ▼
FastAPI Backend
      │
      ▼
Inference Service ──► Hugging Face Inference
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
     Intent Classification     Entity Extraction
              └───────────┬───────────┘
                          ▼
                    Base Handler
                          │
                          ▼
                    Intent Routing
                          │
                          ▼
                   Specific Handler
                          │
                          ▼
                   Business Service ◄──► Supabase
                          │
                          ▼
                    Handler Results
                          │
                          ▼
                   Response Builder
                          │
                          ▼
                    Draft Response
                          │
                          ▼
                       Frontend
```

---

## Teknologi

| Komponen | Teknologi |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| Machine Learning | PyTorch |
| NLP | IndoBERT, Transformers |
| Deployment Model | Hugging Face Spaces |
| Komunikasi HTTP | HTTPX |
| Database | Supabase |
| Komunikasi API | REST API, JSON |

---

## Struktur Proyek

```text
bantuin/
├── backend/
│   ├── app/
│   │   ├── handlers/    # Pemrosesan berdasarkan intent
│   │   ├── router/      # Routing API
│   │   └── schema/      # Skema request dan response
│   ├── database/        # Koneksi database
│   ├── response/        # Penyusunan draft jawaban
│   ├── services/        # Inference dan business services
│   └── main.py          # Entry point FastAPI
├── docs/
│   └── PRD.md           # Product Requirements Document
├── frontend/            # Aplikasi Next.js
├── training/            # Resource pengembangan model
└── README.md
```

---

## Menjalankan Proyek

### Persyaratan

- Python 3.10 atau versi yang kompatibel dengan dependensi
- Node.js dan npm
- Akun Hugging Face
- Proyek Supabase

### 1. Clone repository

```bash
git clone https://github.com/aliefalghifari/compare-UNJ.git
cd compare-UNJ
```

### 2. Siapkan backend

```bash
python -m venv .venv
```

Aktifkan virtual environment:

```powershell
# Windows PowerShell
.venv\Scripts\Activate.ps1
```

```bash
# macOS / Linux
source .venv/bin/activate
```

Instal dependensi:

```bash
pip install -r backend/requirements.txt
```

### 3. Atur environment variables

Buat file `.env` di dalam direktori `backend/`:

```env
HF_SPACE_URL=your_huggingface_space_url
HF_TOKEN=your_huggingface_token

SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

> **Penting:** jangan unggah file `.env` atau kredensial pribadi ke repository publik.

### 4. Jalankan backend

Dari direktori utama proyek:

```bash
uvicorn backend.main:app --reload
```

- API: <http://localhost:8000>
- Dokumentasi API: <http://localhost:8000/docs>

### 5. Jalankan frontend

Buka terminal baru:

```bash
cd frontend
npm install
npm run dev
```

Aplikasi dapat diakses di <http://localhost:3000>.

---

## Roadmap

Pengembangan dilakukan bertahap sesuai kebutuhan dan kesiapan tiap komponen. Roadmap ini dinamis dan dapat berubah mengikuti hasil evaluasi.

| Tahap | Fokus | Status |
|:---:|---|:---:|
| 1 | Integrasi model intent classification dan entity extraction | ✅ |
| 2 | Pengembangan arsitektur backend dan handler | 🔄 |
| 3 | Penyelesaian handler untuk seluruh intent yang dibutuhkan | ⏳ |
| 4 | Peningkatan kualitas dataset dan performa model NLP | ⏳ |
| 5 | Mekanisme klarifikasi dan rekomendasi jawaban | ⏳ |
| 6 | Pengembangan modul analisis profitabilitas | ⏳ |
| 7 | Integrasi seluruh modul dan pengujian sistem | ⏳ |

✅ selesai · 🔄 sedang berjalan · ⏳ direncanakan

## Dokumentasi

- [Product Requirements Document (PRD)](docs/PRD.md)

## Status Proyek

BantuIn masih dalam tahap pengembangan. Saat ini fokusnya adalah integrasi model NLP, orkestrasi backend, dan handler untuk memproses permintaan pelanggan. Tahap berikutnya mencakup penyelesaian seluruh handler, peningkatan pemahaman model terhadap pesan pelanggan, dan implementasi modul Product Profitability Analytics.

## Lisensi

Belum ada lisensi resmi yang ditetapkan pada repository ini. Penggunaan dan distribusi ulang kode mengikuti ketentuan pemilik repository. resmi yang ditetapkan pada repository ini. Penggunaan dan distribusi ulang kode mengikuti ketentuan pemilik repository.
