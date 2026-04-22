# 🛡️PhishPhage: AI-Powered Phishing Detection & Forensic Auditor

## 🚀 Overview
PhishPhage is an end-to-end machine learning application designed to instantly detect and analyze phishing emails using Natural Language Processing (NLP). 

Bridging the gap between complex black-box algorithms and actionable security insights, PhishPhage provides a production-ready **Threat Intelligence Dashboard**. It doesn't just label an email; it explains the *linguistic triggers* and *social engineering tactics* that led to the AI's decision.

## 📊 Model Performance (v1.1.0)
Based on the latest **Random Forest** ensemble evaluation in our [EDA Notebook](./notebooks/PhishGuard_EDA.ipynb):

| Metric | Score | Business Impact |
| :--- | :--- | :--- |
| **Accuracy** | **98%** | Highly reliable overall classification. |
| **Ham Precision** | **100%** | Zero false alarms for legitimate business mail. |
| **Spam Recall** | **99%** | Catching nearly all threats before they reach the user. |
| **F1-Score (Spam)** | **0.96** | Robust performance on imbalanced security data. |

## ✨ Key Features
* **Linguistic Trigger Mapping:** Real-time highlighting of suspicious vocabulary (e.g., *urgent*, *suspended*, *verify*) directly in the UI.
* **Smart Security Threshold:** Requires a 5-word "Forensic Minimum" to ensure high-confidence analysis.
* **Urgency & Intent Detection:** Categorizes social engineering tactics into High, Medium, or Low priority threats.
* **Forensic Export:** One-click "Export Report" feature to save AI analysis for IT security ticketing.
* **Human-in-the-Loop:** Integrated "Report Incorrect Analysis" button to simulate a live ML retraining feedback loop.
* **Link Parser:** Evaluates embedded URLs for lookalike domains and suspicious structures.

## 🛠️ Tech Stack
**Frontend:**
* **React.js (Vite)** with TypeScript
* **Tailwind CSS (v4)** for high-performance styling
* **Lucide React** for forensic iconography
* **Glassmorphism UI** for a modern, dark-mode security aesthetic

**Backend & Machine Learning:**
* **Python 3.11+**
* **FastAPI & Uvicorn** for high-speed asynchronous inference
* **Scikit-learn** (Random Forest Classifier & TF-IDF Vectorization)
* **NLTK** (Natural Language Toolkit) for text preprocessing
* **Pandas & Seaborn** for deep statistical EDA

## 📂 Project Structure
```text
PhishPhage/
├── backend/                # FastAPI server and ML model artifacts
│   ├── main.py             # API endpoints and forensic logic
│   ├── requirements.txt    # Python dependencies
│   └── artifacts/          # Saved .pkl files (Classifier & Vectorizer)
├── frontend/               # React single-page application
│   ├── src/
│   │   ├── App.tsx         # Dashboard UI, Highlighter, and API logic
│   │   └── main.tsx        # React entry point
│   └── package.json        # Node dependencies
└── notebooks/              # Data Science research
    └── PhishPhage_EDA.ipynb # Visual proof-of-concept and metrics
```

## 💻 Installation & Setup

### 1. Backend Setup
Navigate to the `backend` directory and initialize your environment:
```bash
cd backend
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Install & Run
pip install -r requirements.txt
uvicorn main:app --reload
```
*API runs at: `http://127.0.0.1:8000`*

### 2. Frontend Setup
Open a new terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
*UI runs at: `http://localhost:5173`*

## 👨‍💻 Author
**Krish Kamra**
