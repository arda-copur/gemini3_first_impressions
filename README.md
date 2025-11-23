# Gemini 3 Pro & AI Studio Build Mode: İlk İzlenimler ve Projeler 🚀

Bu repo, Google'ın en yeni modeli **Gemini 3 Pro** ve beraberinde görsel tarafta **Gemini 2.5 Flash**'ı, özellikle **AI Studio Build** modunda test ederken oluşturduğum bir "oyun alanı" (playground) niteliğindedir.

Yeni modellerin sınırlarını zorlamak, JSON çıktı kararlılığını ölçmek ve multimodal (görüntü+metin) yeteneklerini gerçek senaryolarda görmek adına **3 farklı proje** geliştirdim. Bu süreçte Gemini 3 Pro'nun özellikle "mantık yürütme" ve "orkestrasyon" yeteneklerinin ne kadar geliştiğini bizzat deneyimledim.

Aşağıda, bu süreçte geliştirdiğim projeleri ve teknik detaylarını bulabilirsiniz.

---

## 1. SlideGenius AI - Gemini 3 Destekli Sunum Oluşturucu 📊

Bu proje, Gemini 3 Pro ve Gemini 2.5 Flash'ın hibrit gücünü sergilemek için geliştirdiğim favori çalışmam. Sadece bir konu başlığı giriyorsunuz ve yapay zeka, saniyeler içinde hem içeriği hem de görselleriyle profesyonel bir PDF sunumu hazırlıyor.

### 💡 Nasıl Çalışıyor? (Orchestrator Mantığı)
Burada **Gemini 3 Pro Preview**, bir "Orkestra Şefi" gibi davranıyor. Konuyu analiz ediyor, sunum iskeletini kuruyor ve en önemlisi **her slayt için nasıl bir görsel gerektiğini betimleyen** (prompt engineering yapan) JSON yapısını üretiyor. Ardından **Gemini 2.5 Flash Image**, bu betimlemeleri alıp yüksek çözünürlüklü görsellere dönüştürüyor.

### ✨ Öne Çıkanlar
*   **Akıllı İçerik Akışı:** Rastgele değil, seçilen tona (Akademik, Profesyonel vb.) uygun mantıklı bir sunum kurgusu.
*   **Bağlamsal Görselleştirme:** Stok fotoğraf değil, tam olarak o slaydın anlattığı konuya özel üretilen AI görselleri.
*   **Dinamik PDF Motoru:** `jsPDF` ile anlık render alınan vektörel çıktılar.

<!-- Görseller: Slide Genius (3 Adet) -->
<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/slide_genius_1.PNG?raw=true" width="45%" alt="SlideGenius UI 1">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/slide_genius_2.PNG?raw=true" width="45%" alt="SlideGenius UI 2">
</p>
<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/slide_genius_3.PNG?raw=true" width="80%" alt="SlideGenius Output">
</p>

---

## 2. VitalityAI - Bütünsel Sağlık Koçu 🥗💪

Gemini 2.5 Flash modelinin **yapılandırılmış veri (JSON Schema)** üretme ve **çok dilli** içerik oluşturma kapasitesini test ettiğim projem. Amaç, "hallucinasyon" (uydurma) yapmadan, matematiksel olarak tutarlı bir sağlık planı oluşturmaktı.

### 🔥 Neleri Çözdüm?
*   **Stabil JSON Çıktısı:** "N/A" gibi hatalı veya yarım kesilmiş çıktılar olmadan; set, tekrar ve kalori hesapları tam tutan planlar.
*   **Holistic Wellness:** Sadece "tavuk-pilav" yazan bir bot değil; mindfulness, uyku tavsiyeleri ve günlük mantralar üreten bütünsel bir yaklaşım.
*   **Çoklu Dil:** Tek bir prompt yapısıyla 5 farklı dilde (TR, EN, DE, FR, IT) native seviyesinde çıktı.

<!-- Görseller: Vitality (6 Adet - Grid Düzeni) -->
<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_1.PNG?raw=true" width="32%" alt="Vitality Dashboard">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_2.PNG?raw=true" width="32%" alt="Vitality Nutrition">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_3.PNG?raw=true" width="32%" alt="Vitality Workout">
</p>
<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_4.PNG?raw=true" width="32%" alt="Vitality Chat">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_5.PNG?raw=true" width="32%" alt="Vitality Plan">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_6.PNG?raw=true" width="32%" alt="Vitality Mobile">
</p>

---

## 3. Wardrobe: AI Powered Digital Atelier 👗🕶️

Gemini API'ın **Multimodal** (görüntü + metin) ve **Search Grounding** (Google Arama ile doğrulama) yeteneklerini denediğim, kişisel stil danışmanı uygulaması. Standart bir chatbot'tan öte, görsel manipülasyon ve gerçek dünya verilerini harmanlayan bir deneyim.

### ✨ Temel Özellikler
*   **Virtual Try-On (Sanal Kabin):** Gemini'ın görüntü işleme yeteneğiyle kullanıcının fotoğrafı ve seçilen kıyafeti birleştirme denemesi.
*   **The Curator (Search Grounding):** Tarih ve lokasyon girildiğinde Google Search üzerinden anlık hava durumunu çekiyor; gidilecek mekanın konseptine (Date, İş, Casual) göre nokta atışı kombin öneriyor.
*   **AI Stylist:** Yüklenen fotoğraftan vücut tipi ve tarz analizi.

<!-- Görseller: Wardrobe (2 Adet) -->
<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/wardrobe_1.PNG?raw=true" width="48%" alt="Wardrobe UI">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/wardrobe_2.PNG?raw=true" width="48%" alt="Wardrobe Curator">
</p>

---

## 🛠️ Genel Teknoloji Yığını

Tüm projelerde ortak olarak kullandığım modern web teknolojileri:

*   **AI Core:** Google GenAI SDK (Gemini 3 Pro, Gemini 2.5 Flash & Flash-Image)
*   **Frontend:** React (TypeScript)
*   **Styling:** Tailwind CSS (Her proje için farklı tasarım dilleri: Glassmorphism, Fashion Editorial, Clean UI)
*   **Utilities:** jsPDF (Sunum), Recharts (Veri Görselleştirme), Lucide React

## 🚀 Kurulum ve Çalıştırma

Bu projeleri kendi makinenizde incelemek isterseniz:

1.  Repoyu klonlayın:
    ```bash
    git clone https://github.com/arda-copur/gemini3_first_impressions.git
    ```
2.  İlgili proje klasörüne gidin ve paketleri yükleyin:
    ```bash
    cd proje-klasoru
    npm install
    ```
3.  `.env` dosyasını oluşturun ve Google AI Studio'dan aldığınız API anahtarını ekleyin:
    ```env
    VITE_GOOGLE_API_KEY=sizin_api_anahtariniz
    ```
4.  Projeyi başlatın:
    ```bash
    npm run dev
    ```

---
# Gemini 3 Pro & AI Studio Build Mode: First Impressions & Projects 🚀

This repo serves as a "playground" where I tested Google's newest models, **Gemini 3 Pro** and **Gemini 2.5 Flash**, specifically using the **AI Studio Build** mode.

To push the boundaries of these new models, benchmark JSON output stability, and observe multimodal capabilities in real-world scenarios, I developed **3 distinct projects**. Through this process, I experienced firsthand how advanced Gemini 3 Pro's "reasoning" and "orchestration" capabilities have become.

Below, you can find the projects I developed during this journey and their technical details.

---

## 1. SlideGenius AI - Gemini 3 Powered Presentation Generator 📊

This is my favorite project, developed to showcase the hybrid power of Gemini 3 Pro and Gemini 2.5 Flash. You simply enter a topic, and the AI prepares a professional PDF presentation with structured content and visuals in seconds.

### 💡 How It Works? (The Orchestrator Logic)
Here, **Gemini 3 Pro Preview** acts as an "Orchestra Conductor." It analyzes the topic, builds the presentation skeleton, and most importantly, creates a JSON structure describing **exactly what kind of visual is needed for each slide** (automating prompt engineering). Then, **Gemini 2.5 Flash Image** takes these descriptions and renders high-resolution visuals.

### ✨ Key Features
*   **Smart Content Flow:** Not random, but a logical presentation structure tailored to the selected tone (Academic, Professional, etc.).
*   **Contextual Visualization:** No generic stock photos; unique AI-generated images tailored specifically to the slide's content.
*   **Dynamic PDF Engine:** Instant vector output rendering with `jsPDF`.

<!-- Images: Slide Genius (3 Items) -->
<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/slide_genius_1.PNG?raw=true" width="45%" alt="SlideGenius UI 1">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/slide_genius_2.PNG?raw=true" width="45%" alt="SlideGenius UI 2">
</p>
<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/slide_genius_3.PNG?raw=true" width="80%" alt="SlideGenius Output">
</p>

---

## 2. VitalityAI - Holistic Health Coach 🥗💪

A modern web app where I tested Gemini 2.5 Flash's capacity for generating **structured data (JSON Schema)** and **multilingual** content. The goal was to create a mathematically consistent health plan without "hallucinations."

### 🔥 What Did I Solve?
*   **Stable JSON Output:** No "N/A" errors or cut-off responses; sets, reps, and calorie calculations are precise.
*   **Holistic Wellness:** Not just a "chicken & rice" bot; a holistic approach including mindfulness, sleep advice, and daily mantras.
*   **Multi-language Support:** Native-level content generation in 5 languages (TR, EN, DE, FR, IT) using a single dynamic prompt structure.

<!-- Images: Vitality (6 Items - Grid Layout) -->
<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_1.PNG?raw=true" width="32%" alt="Vitality Dashboard">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_2.PNG?raw=true" width="32%" alt="Vitality Nutrition">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_3.PNG?raw=true" width="32%" alt="Vitality Workout">
</p>
<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_4.PNG?raw=true" width="32%" alt="Vitality Chat">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_5.PNG?raw=true" width="32%" alt="Vitality Plan">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_6.PNG?raw=true" width="32%" alt="Vitality Mobile">
</p>

---

## 3. Wardrobe: AI Powered Digital Atelier 👗🕶️

A personal style consultant app where I tested the Gemini API's **Multimodal** (image + text) capabilities and **Search Grounding**. It goes beyond a standard chatbot, blending visual manipulation with real-world data.

### ✨ Key Features
*   **Virtual Try-On:** An experiment using Gemini's image processing to merge the user's photo with a selected outfit.
*   **The Curator (Search Grounding):** Pulls real-time weather data via Google Search based on date and location; creates a specific outfit "recipe" based on the event type (Date, Business, Casual).
*   **AI Stylist:** Body type and style analysis from an uploaded photo.

<!-- Images: Wardrobe (2 Items) -->
<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/wardrobe_1.PNG?raw=true" width="48%" alt="Wardrobe UI">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/wardrobe_2.PNG?raw=true" width="48%" alt="Wardrobe Curator">
</p>

---

## 🛠️ Tech Stack

Modern web technologies used across all projects:

*   **AI Core:** Google GenAI SDK (Gemini 3 Pro, Gemini 2.5 Flash & Flash-Image)
*   **Frontend:** React (TypeScript)
*   **Styling:** Tailwind CSS (Different design languages per project: Glassmorphism, Fashion Editorial, Clean UI)
*   **Utilities:** jsPDF (Presentation), Recharts (Data Viz), Lucide React

## 🚀 Setup & Run

To explore these projects on your local machine:

1.  Clone the repo:
    ```bash
    git clone https://github.com/arda-copur/gemini3_first_impressions.git
    ```
2.  Navigate to the project folder and install dependencies:
    ```bash
    cd project-folder
    npm install
    ```
3.  Create a `.env` file and add your API key from Google AI Studio:
    ```env
    VITE_GOOGLE_API_KEY=your_api_key
    ```
4.  Start the project:
    ```bash
    npm run dev
    ```

---
