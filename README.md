# COMPARE UNJ

Aplikasi web pendukung operasional UMKM yang berfokus pada asisten layanan pelanggan. Sistem menganalisis pesan pelanggan untuk memprediksi intent dan mengekstrak entitas menggunakan model NLP, lalu menampilkan hasilnya melalui antarmuka chat.

> Dokumen kebutuhan produk: [`docs/PRD.md`](docs/PRD.md)

## Fitur saat ini

- Antarmuka chat berbasis web.
- Prediksi intent pesan pelanggan beserta skor confidence.
- Ekstraksi entitas dari pesan.
- Backend API menggunakan FastAPI.
- Model NLP berbasis IndoBERT yang diunduh dari Hugging Face saat backend dijalankan.

Analitik profitabilitas produk tercantum dalam PRD sebagai bagian dari cakupan produk, tetapi README ini hanya mendokumentasikan fitur yang tampak pada implementasi saat ini.

## Teknologi

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI, PyTorch, Transformers
- **Model:** IndoBERT untuk klasifikasi intent dan ekstraksi entitas

## Struktur proyek

```text
.
├── backend/       # API FastAPI dan inferensi model
├── docs/          # Dokumen produk
├── frontend/      # Aplikasi web Next.js
├── training/      # Kebutuhan dan bahan terkait pelatihan model
└── hierarchy.txt  # Catatan struktur proyek
```

## Persyaratan

- Node.js dan npm
- Python 3.10 atau versi yang kompatibel dengan dependensi proyek
- Koneksi internet saat pertama kali backend mengunduh tokenizer dan model dari Hugging Face
- PyTorch yang sesuai dengan lingkungan CPU atau GPU Anda

## Menjalankan aplikasi

Jalankan backend dan frontend di dua terminal terpisah dari direktori root repository.

### 1. Backend

```bash
python -m venv .venv
```

Aktifkan virtual environment:

```bash
# macOS / Linux
source .venv/bin/activate

# Windows PowerShell
.venv\Scripts\Activate.ps1
```

Pasang dependensi yang tercantum di repository:

```bash
pip install -r backend/requirement.txt
```

Backend menggunakan PyTorch untuk menjalankan model. Jika PyTorch belum terpasang, pasang build yang cocok untuk perangkat Anda mengikuti petunjuk resmi PyTorch.

Jalankan API dari direktori root:

```bash
uvicorn backend.main:app --reload
```

API tersedia di `http://localhost:8000`; dokumentasi interaktif FastAPI tersedia di `http://localhost:8000/docs`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:3000` di browser.

Perintah frontend lain yang tersedia:

```bash
npm run lint
npm run build
npm run start
```

## API

### `POST /intent/predict`

Menganalisis teks untuk mengembalikan intent, confidence, dan daftar entitas yang terdeteksi.

Contoh request:

```bash
curl -X POST http://localhost:8000/intent/predict \
  -H "Content-Type: application/json" \
  -d '{"message":"Apakah madu tersedia ukuran 500 gram?"}'
```

Contoh bentuk response:

```json
{
  "predicted_class": 0,
  "intent": "contoh_intent",
  "confidence": 0.95,
  "entities": [
    {
      "text": "500 gram",
      "label": "contoh_label",
      "start": 29,
      "end": 38
    }
  ]
}
```

Nilai di atas hanya contoh format; hasil aktual bergantung pada model dan pesan yang dikirim.

## Keamanan konfigurasi

Jangan commit API key, password, atau secret ke repository. Simpan konfigurasi sensitif di environment variables lokal atau secret manager, dan gunakan file `.env.example` hanya dengan nilai placeholder. Jika secret pernah dimasukkan ke repository, segera rotasi secret tersebut dan hapus dari riwayat/berkas yang dapat diakses publik.

## Pengembangan model

Direktori `training/` berisi resource dan dependensi terkait training. Periksa instruksi di dalam direktori tersebut sebelum menjalankan proses training; prosedur dan dataset dapat berbeda dari kebutuhan menjalankan aplikasi.

## Lisensi

Belum ada informasi lisensi yang dicantumkan. Hubungi pemilik repository sebelum menggunakan atau mendistribusikan ulang proyek ini.
