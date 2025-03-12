# WordMasterDB

WordMasterDB, kullanıcıların İngilizce kelimeleri ve bu kelimelerin Türkçe karşılıklarını, türlerini ve kategorilerini yönetebileceği bir dil öğrenme uygulamasıdır. Kullanıcılar ayrıca kelimeler için örnek cümleler ekleyebilir ve kelimelerin telaffuzlarını dinleyebilirler.

## Özellikler

- İngilizce kelimeleri ve Türkçe karşılıklarını ekleme, düzenleme ve silme
- Kelimeler için tür ve kategori belirleme
- Kelimeler için örnek cümleler ekleme
- Kelimelerin telaffuzlarını dinleme
- Kullanıcı dostu arayüz

## Kullanılan Teknolojiler

- **Frontend**: HTML, CSS, Bootstrap, EJS (Embedded JavaScript)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (Sequelize ORM ile)
- **Diğer**: SpeechSynthesis API (kelime telaffuzu için)

## Kurulum

### Gereksinimler

- Node.js (v14 veya üstü)
- npm (Node Package Manager)

### Adımlar

1. **Depoyu klonlayın:**

    ```bash
    git clone https://github.com/emrekandazoglu/pwdba.git
    cd pwdba
    ```

2. **Gerekli bağımlılıkları yükleyin:**

    ```bash
    npm install
    ```

3. **Veritabanını oluşturun ve modelleri senkronize edin:**

    ```bash
    node scripts/initDatabase.js
    ```

4. **Uygulamayı başlatın:**

    ```bash
    npm start
    ```

5. **Tarayıcınızda uygulamayı açın:**

    ```bash
    http://localhost:3000
    ```

## Dosya Yapısı

```plaintext
pwdba/
├── controllers/
│   ├── categoryController.js
│   ├── sentenceController.js
│   └── wordController.js
├── models/
│   ├── category.js
│   ├── index.js
│   ├── sentence.js
│   └── word.js
├── public/
│   ├── css/
│   └── js/
├── routes/
│   ├── categoryRoutes.js
│   ├── sentenceRoutes.js
│   └── wordRoutes.js
├── views/
│   ├── newWord.ejs
│   └── layout.ejs
├── scripts/
│   └── initDatabase.js
├── app.js
├── package.json
└── README.md