# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Sistem Pendukung Operasional UMKM
**COMPARE 2026 — Studi Kasus Layanan Pelanggan dan Profitabilitas Produk**

| Informasi | Detail |
|---|---|
| Nama Produk | UMKM Operational Assistant (nama sementara) |
| Versi | 1.0 |
| Status | Draft |
| Kompetisi | COMPARE 2026 |
| Target Pengguna | Pemilik usaha, staf CS, pengelola toko online |
| Platform | Web Application (usulan) |
| Target Usaha | Oleh-Oleh Haji dan Herbal |

---

# 1. Product Overview

## 1.1 Latar Belakang

Usaha Oleh-Oleh Haji dan Herbal milik Husin menjalankan aktivitas penjualan melalui tiga marketplace, yaitu Shopee, TikTok Shop, dan Lazada.

Dalam operasionalnya, terdapat dua permasalahan utama:

**A. Inefisiensi layanan pelanggan**

Staf Customer Service (CS) harus menjawab pertanyaan sederhana yang berulang kali diajukan pembeli, seperti ketersediaan produk, ukuran, dan waktu pengiriman.

Akibatnya, staf memiliki lebih sedikit waktu untuk menangani keluhan dan pertanyaan yang membutuhkan perhatian khusus.

**B. Kurangnya visibilitas profitabilitas produk**

Omzet penjualan yang tinggi belum tentu menghasilkan keuntungan yang tinggi. Setiap marketplace memiliki potongan komisi, voucher, biaya pengiriman, dan retur yang memengaruhi keuntungan akhir.

Pemilik usaha kesulitan mengidentifikasi produk yang benar-benar menguntungkan.

## 1.2 Product Vision

Membangun sistem pendukung operasional UMKM yang membantu meningkatkan efisiensi pelayanan pelanggan serta menyediakan informasi profitabilitas produk secara transparan dan terukur.

## 1.3 Product Objectives

1. Mengurangi pekerjaan repetitif staf Customer Service.
2. Memastikan pertanyaan umum memperoleh rekomendasi jawaban yang sesuai informasi toko.
3. Memastikan keluhan dan informasi yang belum pasti tidak ditangani secara otomatis tanpa pemeriksaan staf.
4. Menyediakan perhitungan keuntungan berdasarkan produk dan marketplace.
5. Membantu pemilik mengambil keputusan berdasarkan data penjualan dan biaya.

---

# 2. Target Users

## 2.1 Customer Service (CS)

**Kebutuhan:**
- Memperoleh rekomendasi jawaban untuk pertanyaan berulang.
- Mengidentifikasi pesan yang merupakan keluhan.
- Mengetahui kapan harus memeriksa informasi lebih lanjut.
- Menghemat waktu dalam menangani percakapan.

## 2.2 Pengelola Toko Online

**Kebutuhan:**
- Memperbarui informasi produk dan stok.
- Memperbarui aturan pengiriman.
- Mengelola informasi yang digunakan oleh sistem CS.
- Memasukkan data transaksi dan biaya.

## 2.3 Pemilik Usaha

**Kebutuhan:**
- Mengetahui keuntungan setiap produk.
- Membandingkan profitabilitas antar-marketplace.
- Mengidentifikasi biaya yang memengaruhi keuntungan.
- Menentukan strategi harga dan prioritas produk berdasarkan data.

---

# 3. Scope and Boundaries

## 3.1 In Scope

Sistem mencakup dua modul utama.

**Modul A — Customer Service Assistant**
- Simulasi percakapan pelanggan.
- Pengenalan jenis pesan.
- Rekomendasi jawaban berdasarkan informasi toko.
- Identifikasi keluhan.
- Penanganan informasi yang belum pasti.
- Penerusan kasus kepada staf.

**Modul B — Product Profitability Analytics**
- Input transaksi secara manual.
- Import data melalui berkas.
- Pencatatan modal produk.
- Pencatatan biaya marketplace.
- Perhitungan pendapatan bersih dan keuntungan.
- Analisis profitabilitas berdasarkan produk, marketplace, dan periode.
- Penandaan data yang belum lengkap.

## 3.2 Out of Scope

Fitur berikut tidak termasuk dalam pengembangan:

- Integrasi langsung dengan API Shopee, TikTok Shop, dan Lazada.
- Pengiriman pesan otomatis kepada pembeli nyata.
- Pengelolaan gudang secara menyeluruh.
- Sistem penggajian karyawan.
- Pengadaan barang.
- Pelaporan pajak resmi.
- Sistem pembayaran.
- Perubahan harga dan campaign secara otomatis.
- Akses langsung ke akun produksi marketplace.

## 3.3 Constraints

1. Seluruh data dimasukkan secara manual atau melalui berkas.
2. Informasi stok dan pengiriman harus diperbarui oleh staf.
3. Pengujian menggunakan data buatan.
4. Sistem tidak boleh menganggap data biaya yang kosong sebagai nol.
5. Seluruh perhitungan keuntungan harus dapat ditelusuri.

---

# 4. Functional Requirements

## 4.1 Modul A — Customer Service Assistant

### FR-01: Simulasi Chat

Sistem menyediakan antarmuka percakapan yang memungkinkan pengguna memasukkan pesan pelanggan.

**Input:**
- Pesan pelanggan.

**Process:**
- Sistem menganalisis isi pesan.
- Sistem mengidentifikasi kategori pesan.
- Sistem menentukan tindakan yang sesuai.

**Output:**
- Kategori pesan.
- Rekomendasi jawaban atau tindakan lanjutan.

### FR-02: Klasifikasi Pesan

Sistem harus dapat mengidentifikasi tiga kategori pesan.

| Kategori | Contoh | Tindakan |
|---|---|---|
| Pertanyaan umum | Ready, Kak? | Menampilkan jawaban sesuai informasi toko |
| Keluhan | Produk yang diterima tidak sesuai | Menandai dan meneruskan kepada staf |
| Informasi tidak pasti | Stok tidak diketahui | Meminta pemeriksaan staf |

### FR-03: Rekomendasi Jawaban

Sistem memberikan rekomendasi jawaban berdasarkan:
- Katalog produk.
- Varian dan ukuran.
- Informasi stok.
- Aturan pengiriman.
- Pertanyaan umum beserta jawaban yang benar.

Jawaban tidak boleh mengandung informasi yang tidak tersedia dalam basis informasi toko.

### FR-04: Penanganan Keluhan

Ketika sistem mengidentifikasi keluhan:
- Pesan ditandai sebagai keluhan.
- Sistem tidak memberikan penyelesaian otomatis yang tidak memiliki dasar informasi.
- Pesan diarahkan kepada staf.
- Sistem menampilkan alasan penerusan kasus.

### FR-05: Penanganan Informasi Tidak Pasti

Jika sistem tidak memiliki informasi yang cukup, sistem harus:
- Mengidentifikasi informasi yang belum tersedia.
- Tidak membuat asumsi.
- Meminta staf melakukan pemeriksaan.
- Memberikan status bahwa jawaban belum dapat dipastikan.

### FR-06: Pengelolaan Informasi Toko

Pengelola dapat memperbarui:
- Nama produk.
- Varian produk.
- Ukuran produk.
- Informasi stok.
- Aturan pengiriman.
- FAQ dan jawaban standar.

---

## 4.2 Modul B — Product Profitability Analytics

### FR-07: Input Transaksi

Pengguna dapat memasukkan data transaksi melalui formulir atau mengimpor berkas.

Data transaksi minimal mencakup:
- ID transaksi.
- Marketplace.
- Produk.
- Jumlah produk.
- Nilai penjualan.

### FR-08: Input Biaya

Sistem menyediakan pencatatan komponen biaya:

- Modal produk.
- Komisi marketplace.
- Voucher atau diskon yang ditanggung penjual.
- Ongkos kirim yang ditanggung penjual.
- Biaya retur.
- Biaya lain yang relevan apabila tersedia.

### FR-09: Perhitungan Profitabilitas

Sistem menghitung keuntungan berdasarkan pendapatan dan biaya yang tercatat.

Rumus dasar:

**Pendapatan bersih:**

Pendapatan penjualan dikurangi potongan dan biaya penjualan yang relevan.

**Keuntungan:**

Pendapatan bersih dikurangi modal produk dan biaya operasional terkait yang dimasukkan.

Seluruh komponen perhitungan harus dapat ditelusuri.

### FR-10: Analisis Berdasarkan Produk

Pengguna dapat melihat:
- Total jumlah produk terjual.
- Total penjualan.
- Total modal.
- Total biaya.
- Total keuntungan.
- Margin keuntungan.

### FR-11: Analisis Marketplace

Sistem menyediakan perbandingan profitabilitas berdasarkan:
- Shopee.
- TikTok Shop.
- Lazada.

Tujuannya adalah mengidentifikasi marketplace yang memberikan keuntungan lebih baik untuk produk tertentu.

### FR-12: Filter Periode

Pengguna dapat memfilter data berdasarkan periode untuk melihat perubahan kinerja penjualan dan keuntungan.

### FR-13: Validasi Kelengkapan Data

Sistem harus mendeteksi:
- Biaya yang belum dimasukkan.
- Data transaksi yang tidak lengkap.
- Data yang berpotensi terhitung ganda.
- Ketidaksesuaian data transaksi.

Data yang tidak lengkap harus ditandai dan tidak boleh dianggap bernilai nol.

---

# 5. Non-Functional Requirements

## NFR-01: Usability

Antarmuka harus mudah dipahami oleh pengguna nonteknis.

## NFR-02: Accuracy

Jawaban CS harus sesuai dengan informasi yang tersedia. Perhitungan profitabilitas harus sesuai dengan rumus dan data masukan.

## NFR-03: Traceability

Pengguna dapat melihat komponen yang membentuk hasil perhitungan keuntungan.

## NFR-04: Reliability

Sistem tidak boleh menghasilkan jawaban pasti ketika informasi tidak tersedia atau menghasilkan keuntungan yang dianggap valid ketika komponen biaya penting belum lengkap.

## NFR-05: Data Integrity

Data transaksi dan biaya harus divalidasi agar tidak terjadi kesalahan input maupun penghitungan ganda.

---

# 6. User Flow

## 6.1 Customer Service Assistant

1. Staf membuka modul Customer Service.
2. Staf memasukkan pesan pelanggan.
3. Sistem menganalisis pesan.
4. Sistem mengklasifikasikan pesan.
5. Jika pertanyaan umum, sistem memberikan rekomendasi jawaban.
6. Jika keluhan, sistem meneruskan kasus kepada staf.
7. Jika informasi tidak pasti, sistem meminta pemeriksaan staf.
8. Staf meninjau dan menggunakan rekomendasi yang tersedia.

## 6.2 Product Profitability Analytics

1. Pengguna membuka modul analisis keuntungan.
2. Pengguna memasukkan atau mengimpor data transaksi.
3. Pengguna memasukkan data modal dan biaya.
4. Sistem melakukan validasi data.
5. Sistem menghitung pendapatan bersih dan keuntungan.
6. Sistem menampilkan hasil analisis.
7. Pengguna membandingkan produk dan marketplace.
8. Pengguna menelusuri komponen biaya apabila ditemukan hasil yang tidak sesuai.

---

# 7. Data Requirements

## 7.1 Data Modul Customer Service

| Data | Keterangan |
|---|---|
| FAQ | Pertanyaan umum dan jawaban benar |
| Product Catalog | Nama produk dan informasi produk |
| Product Variant | Ukuran dan varian produk |
| Stock | Jumlah stok setiap varian |
| Shipping Rules | Batas waktu dan ketentuan pengiriman |
| Complaint Examples | Contoh keluhan pelanggan |
| Test Messages | Pesan untuk menguji klasifikasi |

## 7.2 Data Modul Profitability

| Data | Keterangan |
|---|---|
| Transaction ID | Identitas transaksi |
| Marketplace | Asal transaksi |
| Product | Produk yang terjual |
| Quantity | Jumlah produk |
| Sales | Nilai penjualan |
| Product Cost | Modal produk |
| Marketplace Fee | Komisi marketplace |
| Seller Voucher | Voucher yang ditanggung penjual |
| Shipping Subsidy | Ongkos kirim yang ditanggung penjual |
| Return Cost | Biaya retur |

Catatan: Struktur kolom dan definisi nominal harus disesuaikan dengan data uji yang disediakan oleh panitia atau mitra.

---

# 8. Acceptance Criteria

Fitur dianggap memenuhi kebutuhan apabila berhasil melewati kriteria berikut.

## 8.1 Customer Service Assistant

- [ ] Sistem dapat mengidentifikasi pertanyaan umum.
- [ ] Sistem memberikan jawaban yang sesuai dengan katalog dan FAQ.
- [ ] Sistem dapat mengidentifikasi keluhan.
- [ ] Sistem dapat mengarahkan keluhan kepada staf.
- [ ] Sistem dapat mengenali informasi yang belum tersedia.
- [ ] Sistem tidak mengarang informasi stok maupun pengiriman.
- [ ] Staf dapat meninjau rekomendasi sebelum menggunakannya.

## 8.2 Product Profitability Analytics

- [ ] Sistem dapat menerima input transaksi.
- [ ] Sistem dapat mengimpor data melalui berkas.
- [ ] Sistem dapat menghitung pendapatan bersih.
- [ ] Sistem dapat menghitung keuntungan produk.
- [ ] Sistem dapat membandingkan hasil antar-marketplace.
- [ ] Sistem dapat memfilter berdasarkan periode.
- [ ] Sistem menandai data yang belum lengkap.
- [ ] Sistem tidak menghitung biaya yang sama dua kali.
- [ ] Hasil perhitungan sesuai dengan perhitungan acuan.

---

# 9. Testing Strategy

Pengujian dilakukan menggunakan data buatan sesuai studi kasus.

## 9.1 Pengujian Customer Service

| Skenario | Input | Expected Result |
|---|---|---|
| Pertanyaan stok | Ready, Kak? | Jawaban sesuai data stok |
| Pertanyaan varian | Ada ukuran apa saja? | Menampilkan varian produk |
| Pertanyaan pengiriman | Bisa dikirim hari ini? | Jawaban sesuai aturan pengiriman |
| Keluhan | Saya beli 1 kg, dikirim 500 g | Ditandai sebagai keluhan |
| Informasi tidak tersedia | Stok produk tidak diketahui | Meminta pemeriksaan staf |

## 9.2 Pengujian Profitability

Pengujian dilakukan dengan mencocokkan hasil perhitungan sistem terhadap perhitungan manual sebagai acuan.

Skenario pengujian:
- Transaksi dengan komponen biaya lengkap.
- Transaksi dengan biaya yang belum dimasukkan.
- Transaksi dengan biaya retur.
- Transaksi dengan voucher penjual.
- Transaksi dari marketplace berbeda.
- Transaksi yang berpotensi terduplikasi.

---

# 10. Success Metrics

Keberhasilan produk diukur menggunakan indikator berikut.

## Modul Customer Service

1. Waktu penyelesaian skenario sebelum dan sesudah menggunakan sistem.
2. Tingkat ketepatan rekomendasi jawaban.
3. Ketepatan identifikasi keluhan.
4. Keberhasilan penerusan kasus kepada staf.
5. Jumlah kasus yang membutuhkan koreksi staf.

## Modul Profitability

1. Akurasi hasil perhitungan dibandingkan hitungan acuan.
2. Jumlah kesalahan biaya yang terlewat.
3. Jumlah biaya yang terhitung ganda.
4. Kelengkapan data yang berhasil diidentifikasi.
5. Kemampuan sistem menyajikan perbandingan produk dan marketplace.

---

# 11. Risks and Assumptions

## Risks

| Risiko | Mitigasi |
|---|---|
| Informasi stok tidak diperbarui | Menampilkan status informasi dan meminta pemeriksaan staf |
| Sistem salah mengklasifikasikan pesan | Menyediakan pemeriksaan dan koreksi oleh staf |
| Data transaksi tidak lengkap | Validasi dan penandaan data |
| Komponen biaya terhitung ganda | Validasi struktur dan identitas biaya |
| Data uji berbeda dengan kondisi nyata | Memisahkan data simulasi dari data operasional |

## Assumptions

1. Pengguna memiliki akses untuk memasukkan data secara manual.
2. Data uji disediakan atau disepakati bersama panitia dan mitra.
3. Informasi katalog, stok, dan aturan pengiriman dapat diperbarui oleh pengelola.
4. Sistem digunakan sebagai alat bantu pengambilan keputusan, bukan pengganti keputusan pemilik atau staf.

---

# 12. Open Questions

Hal-hal berikut perlu diklarifikasi sebelum implementasi:

1. Apakah kedua modul harus berada dalam satu aplikasi atau boleh berupa dua aplikasi terpisah?
2. Format berkas transaksi apa yang akan disediakan?
3. Bagaimana definisi setiap komponen biaya pada masing-masing marketplace?
4. Apakah biaya retur dicatat per transaksi atau per produk?
5. Bagaimana aturan penanganan transaksi yang dibatalkan?
6. Apakah sistem CS menggunakan pendekatan rule-based, LLM, atau kombinasi keduanya?
7. Apakah data stok memiliki informasi waktu pembaruan?
8. Bagaimana mekanisme autentikasi dan pembagian hak akses pengguna?

---

# 13. MVP Prioritization

Pengembangan dilakukan secara bertahap dengan memprioritaskan fungsi inti.

| Prioritas | Fitur | Modul |
|---|---|---|
| P0 | Input pesan dan klasifikasi | CS |
| P0 | Rekomendasi jawaban berdasarkan FAQ | CS |
| P0 | Deteksi keluhan dan informasi tidak pasti | CS |
| P0 | Input transaksi dan biaya | Profitability |
| P0 | Perhitungan keuntungan | Profitability |
| P0 | Validasi data tidak lengkap | Profitability |
| P1 | Pengelolaan katalog dan stok | CS |
| P1 | Import data transaksi | Profitability |
| P1 | Perbandingan marketplace | Profitability |
| P1 | Filter periode | Profitability |
| P2 | Riwayat percakapan dan analisis performa CS | CS |
| P2 | Visualisasi tren profitabilitas | Profitability |

**Definisi MVP:** Produk minimum harus sudah dapat menyelesaikan dua masalah inti, yaitu membantu staf memperoleh rekomendasi jawaban yang tepat dan membantu pemilik menghitung keuntungan produk secara transparan.

---

**END OF DOCUMENT**