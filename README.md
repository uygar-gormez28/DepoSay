# 🍾 Şişe Takip - DOA Depozito İade Sistemi

Türkiye'deki **DOA depozito iade sistemi** için biriktirilen şişelerin adetlerini markalarına göre takip eden, günlük **200 şişe teslimat kotasını** ve **toplam stoku** dumanlı modern koyu temalı ve 4 kolonlu grid arayüzüyle yöneten web uygulaması.

---

## ✨ Tasarım & Özellikler

### 1. 🌌 Dumanlı Gradient Arka Plan & Renk Paleti
- **Arka Plan:** `#101827` (Koyu lacivert) & yumuşak radial gradient atmosfer
- **Kart Yüzeyleri:** `#1E293B`
- **İkincil Yüzeyler:** `#172235`
- **Kenarlıklar:** `#334155`
- **Ana Tipografi:** `#F8FAFC` (Beyaz)
- **İkincil Tipografi:** `#94A3B8` (Nötr gri)
- **Aksiyon Butonları:** Beyaz zemin (`#FFFFFF`) ve koyu tipografi (`#101827`)

### 2. 📊 Genişletilmiş Teslimat Paneli & Toplam Stok Göstergesi
- Masaüstünde ~1150px genişliğinde, kompakt ve ferah kart.
- **Toplam Stok:** Bütün markaların mevcut adetlerinin sınırsız toplamı (örn: 800 adet).
- **Teslimat Grubu:** Günlük teslimat kotası olan 200 adetlik gösterge (örn: 200 / 200).
- **Sonraki Teslimatlar İçin:** 200 kotasını aşan fazla şişelerin açıkça gösterimi (örn: +600 adet).
- **İnce Progress Bar:** Modern beyaz dolgulu kota ilerleme çubuğu.
- **Teslimat Grubu Dağılımı:** 200 şişelik teslimata ayrılan markaların dökümü.

### 3. 🔲 Kompakt Kare Grid Marka Kartları
- **Masaüstü:** Yan yana 4 kart.
- **Tablet:** Yan yana 2 veya 3 kart.
- **Mobil:** 1 veya 2 kart.
- Bütün kartlar eşit yükseklikte ve simetrik.
- **Kart İçeriği:**
  - Marka ismi ve büyük şişe adedi (örn: 105 adet).
  - Teslimata ayrılan pay (örn: 75 adet).
  - Varsa fazla stok badge'i (örn: +30 adet).
  - `[-]` ve `[+]` butonları (beyaz artırma, koyu eksiltme).
  - Düzenle ve sil butonları.

### 4. 🛡️ Türkçe Uyumlu Mükerrer Marka Engeli
- Büyük/küçük harf, gereksiz boşluklar ve Türkçe karakterler (`I/ı`, `İ/i` vb.) normalleştirilerek aynı markanın birden fazla kez eklenmesi engellenir.
- Kullanıcıya anında `"Bu marka zaten mevcut."` uyarısı verilir.

---

## 🚀 Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızdan **http://localhost:3000** adresine giderek kullanabilirsiniz.

### Production Build
```bash
npm run build
npm run start
```
