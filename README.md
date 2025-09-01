# 🛒 VoiceCart - Voice Command Shopping Assistant

VoiceCart is an AI-powered **voice-based shopping list manager** that uses **speech recognition** and **natural language processing (NLP)** to create a seamless, hands-free grocery planning experience. Users can **add/remove items, get smart suggestions, search for products, and organize lists** — all with simple voice commands.  

This project demonstrates **full-stack development, AI/ML integration, and cloud deployment** with a strong focus on **real-time voice interaction** and a **minimalist UI/UX**.

---

## 🔗 Live Demo
[Click here to view the working application](https://vocalcart-aabf6.web.app)

---

## 📂 GitHub Repository
[VoiceCart Source Code](https://github.com/AnshulSharma2005/VoiceCart)  
Author: [Anshul Sharma](https://github.com/AnshulSharma2005)

---

## ✨ Features

### 🎙️ Voice Input
- Voice command recognition: “Add milk,” “I need apples”
- NLP-based flexible understanding: “Buy bananas” vs. “Add bananas”
- Multilingual voice command support

### 🤖 Smart Suggestions
- Product recommendations based on previous history
- Seasonal/discount-based recommendations
- Suggest substitutes for unavailable products (e.g., almond milk for regular milk)

### 📝 Shopping List Management
- Add/Remove/Modify items via voice
- Auto-categorization (Dairy, Produce, Snacks)
- Quantity support: “Add 5 oranges,” “2 bottles of water”

### 🔍 Voice-Activated Search
- Search items by brand, size, or price
- Voice-based price range filtering: “Toothpaste under $5”

### 🎨 UI/UX
- Minimal, mobile-optimized interface
- Real-time visual feedback of recognized commands
- Voice-first design with simple navigation

### ☁️ Hosting
- Deployed with Firebase for seamless scalability and authentication

---

## 🛠️ Tech Stack
| Layer                | Technology Used                              |
|----------------------|---------------------------------------------|
| Frontend             | React, TypeScript, Vite                     |
| Backend              | Node.js, Express, TypeScript                |
| AI/ML                | OpenAI Whisper for speech-to-text           |
| Database             | Firebase Firestore                          |
| Authentication       | Firebase Auth                               |
| Deployment           | Firebase Hosting                           |
| Audio Processing     | FFmpeg                                      |

---

## ⚡ Quick Setup

### Prerequisites
- Node.js & npm
- Firebase project setup
- Python installed (for Whisper)
- FFmpeg installed

### Clone the Repo
```bash
git clone https://github.com/AnshulSharma2005/VoiceCart.git
cd VoiceCart
```

### Backend Setup
```bash
cd backend
npm install
npx ts-node src/index.ts
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `.env` files in both `frontend/` and `backend/` with your Firebase keys and API URLs.

---

## 🧪 Testing Speech-to-Text
```bash
whisper uploads/your_test_file.wav --model small --output_format txt
```

Ensure **FFmpeg** is installed for Whisper to function properly.

---

## 📖 Project Approach (200 Words)

VoiceCart was built as a modern, AI-powered shopping assistant that enables users to manage grocery lists hands-free. The application integrates **OpenAI’s Whisper** for accurate speech-to-text conversion and uses a custom **NLP pipeline** to interpret natural speech variations. We prioritized a **minimalist, mobile-friendly UI** to create a frictionless experience, enabling users to control the app entirely by voice or touch.

The backend, developed in **Node.js and Express**, provides RESTful APIs for handling voice processing, item categorization, and recommendations. **Firebase** powers authentication, database storage, and deployment, making the app scalable and secure.  

Key features include **smart recommendations** (based on shopping trends and seasonal data), **automatic categorization**, and **voice search with price filtering**. Users can add or remove items, specify quantities, and receive alternative suggestions, enhancing convenience.  

The tech stack emphasizes **speed, accuracy, and accessibility**, while **FFmpeg integration** ensures smooth audio preprocessing for Whisper. The project demonstrates the integration of **AI/ML services, cloud infrastructure, and responsive UI design** in a single product.  

Overall, VoiceCart showcases **full-stack development** and leverages AI to solve real-world problems, offering a smart and intuitive way to shop.

---

## 📜 License
MIT License

---

## 👨‍💻 Author
- [Anshul Sharma](https://github.com/AnshulSharma2005)
