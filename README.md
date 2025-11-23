# Gemini 3 Pro & Build Mode Experiments 🧪

[Türkçe](#türkçe) | [English](#english)

---

<a name="türkçe"></a>
## 🇹🇷 İlk İzlenimler ve Projeler

Google'ın yeni **Gemini 3 Pro** modelini duyduğumda hemen **AI Studio**'yu açıp özellikle **Build Mode** üzerinde denemelere başladım. Açıkçası Cursor, Vercel, Claude, GPT, Gemini, Copilot gibi bir çok yapay zeka aracını denemiş olsam da bu kadarını beklemiyordum; mantık kurma yeteneği ve verdiği çıktının, girilen promta bağlı doğruluğu gerçekten seviye atlamış.

Bu repo, yeni modellerin sınırlarını görmek için geliştirdiğim, kişisel 3 farklı projeyi ve kodlarını içeriyor. Mobil geliştirmede zaten yetkinliğim olduğu için daha çok web tarafında neler yapabileceklerini merak ettim ve bunun üzerine promptlar girdim.
"Acaba karmaşık promptları nasıl yönetiyor?" ve "Multimodal (görüntü+metin) yetenekleri ne durumda?" sorularına cevap ararken ortaya çıkan işler şunlar:

### 1. SlideGenius AI (Sunum Oluşturucu)
Konu başlığını giriyorsunuz, Gemini 3 Pro içerik kurgusunu ve görsel betimlemelerini hazırlıyor; Gemini 2.5 Flash ise görselleri üretiyor. Sonuç: Saniyeler içinde hazır bir PDF sunumu.

*   **Neyi denedim?** İki farklı modelin "Orchestrator" mantığıyla birbirini beslemesini.
*   **Tech Stack:** React, TypeScript, Google GenAI SDK, jsPDF, Tailwind CSS.

<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/slide_genius_1.PNG?raw=true" width="68%">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/slide_genius_3.PNG?raw=true" width="68%">
</p>

### 2. VitalityAI (Sağlıklı Yaşam Koçu)
Kullanıcı verilerine göre özel antrenman, beslenme planı hazırlayan bir uygulama. Kişiye özel olması ve antrenmlar, diyet planları dışında motivasyon desteği de sağlaması gerçekten ilgimi çekti.

*   **Neyi denedim?** Yapılandırılmış veri (JSON Schema) tutarlılığını ve çoklu dil desteğini (5 dil).
*   **Tech Stack:** React, Recharts, Lucide React.

<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_1.PNG?raw=true" width="62%">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_2.PNG?raw=true" width="62%">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_3.PNG?raw=true" width="62%">
</p>
<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_4.PNG?raw=true" width="62%">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_5.PNG?raw=true" width="62%">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/vitality_6.PNG?raw=true" width="62%">
</p>

### 3. Wardrobe (Dijital Stil Danışmanı)
Eklenen kıyafet görsellerini, kişinin üzerinde göstermekle kalmayıp, aynı zamanda verilen bilgilerle kişinin gideceği yere, anlık hava durumuna, karşısındaki kişinin önem derecesine göre görsel kombin önerileri yapıyor.

*   **Neyi denedim?** Multimodal (Görüntü işleme) yeteneklerini ve gerçek zamanlı veri (Search) kullanımını.
*   **Tech Stack:** React, Tailwind CSS (Fashion UI), Google Search Grounding.

<p align="center">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/wardrobe_1.PNG?raw=true" width="68%">
  <img src="https://github.com/arda-copur/gemini3_first_impressions/blob/main/screenshots/wardrobe_2.PNG?raw=true" width="68%">
</p>

---

<a name="english"></a>
## 🇺🇸 First Impressions & Projects

When I heard about **Gemini 3 Pro**, I immediately jumped into **AI Studio's Build Mode** to mess around. Honestly, I was surprised by the results. The reasoning capabilities and JSON stability are a massive step up.

This repo contains 3 projects I built to test the limits of these new models. I wanted to see how they handle complex logic and multimodal tasks. Here is what I built:

### 1. SlideGenius AI (Presentation Generator)
You enter a topic, Gemini 3 Pro structures the content and writes image prompts, then Gemini 2.5 Flash renders the visuals. Result: A professional PDF presentation in seconds.

*   **The Experiment:** Using an "Orchestrator" logic where two models feed into each other.
*   **Tech Stack:** React, TypeScript, Google GenAI SDK, jsPDF, Tailwind CSS.

### 2. VitalityAI (Health & Wellness Coach)
Generates personalized workout and nutrition plans. What impressed me most was its ability to handle complex math (calories, sets/reps) without breaking the JSON structure or giving "N/A" errors.

*   **The Experiment:** Testing structured data (JSON Schema) reliability and multi-language support.
*   **Tech Stack:** React, Recharts, Lucide React.

### 3. Wardrobe (Digital Stylist)
More than just a chatbot. It uses Google Search Grounding to check real-time weather for outfit suggestions and analyzes user-uploaded photos for style advice.

*   **The Experiment:** Multimodal (Image+Text) processing and real-time data integration (Search).
*   **Tech Stack:** React, Tailwind CSS, Google Search Grounding.

---

## 🚀 Setup / Kurulum

```bash
# Clone repo
git clone https://github.com/arda-copur/gemini3_first_impressions.git

# Install dependencies
npm install

# Add API Key (.env)
VITE_GOOGLE_API_KEY=your_api_key_here

# Run
npm run dev
