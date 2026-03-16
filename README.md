# 🛡️ PhishGuard: AI-Powered Phishing Detection

## 🚀 Overview
PhishGuard is an end-to-end machine learning application designed to instantly detect and analyze phishing emails using Natural Language Processing (NLP). 

More than just a classification model, PhishGuard bridges the gap between complex machine learning algorithms and actionable security insights. It provides a production-ready, intuitive Threat Intelligence Dashboard that explains the *why* behind the AI's decisions.

## ✨ Key Features
* **Real-Time Inference:** A lightning-fast FastAPI backend serving ML predictions in milliseconds.
* **Threat Intelligence Dashboard:** A React-based interface that breaks down the threat analysis:
  * **Confidence Scoring:** Probability metric of the email being a phishing attempt.
  * **Urgency Leveling:** Detects manipulative, time-sensitive social engineering tactics.
  * **Trigger Word Extraction:** Highlights specific suspicious vocabulary used by the sender.
  * **Link Analysis:** Parses and evaluates embedded URLs, flagging raw IPs and lookalike domains.
* **Data-Driven Insights:** Includes a comprehensive Exploratory Data Analysis (EDA) notebook detailing the statistical distribution of phishing vectors, class balancing, and vocabulary overlap.

## 🛠️ Tech Stack
**Frontend:**
* React.js (Vite)
* Tailwind CSS (v4)
* Lucide React (Icons)
* Glassmorphism UI Design

**Backend & Machine Learning:**
* Python
* FastAPI & Uvicorn
* Scikit-learn (ML Pipeline)
* NLTK (Natural Language Toolkit)
* Pandas & Seaborn (Data Analysis & Visualization)

## 📂 Project Structure
```text
PhishGuard/
├── backend/                  # FastAPI server and ML model artifacts
│   ├── main.py               # API endpoints and CORS routing
│   ├── requirements.txt      # Python dependencies
│   └── (model files)         # .pkl files for the classifier and vectorizer
├── frontend/                 # React single-page application
│   ├── src/
│   │   ├── App.tsx           # Main UI dashboard and API fetch logic
│   │   ├── index.css         # Tailwind configurations
│   │   └── main.tsx          # React DOM entry point
│   └── package.json          # Node dependencies
└── notebooks/                # Data science environment
    └── PhishGuard_EDA.ipynb  # Exploratory Data Analysis and NLP visualizations

```

## 💻 How to Run Locally

### 1. Start the Backend (API & ML Engine)

Open a terminal, navigate to the `backend` directory, and start the Python environment:

```bash
cd backend
python -m venv .venv

# Activate the virtual environment
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate

# Install dependencies and run the server
pip install -r requirements.txt
uvicorn main:app --reload

```

*The API will run on `http://127.0.0.1:8000*`

### 2. Start the Frontend (UI Dashboard)

Open a **second** terminal, navigate to the `frontend` directory, and start the React app:

```bash
cd frontend
npm install
npm run dev

```

*The UI will run on `http://localhost:5173*`

## 👨‍💻 Author

**Krish Kamra**
