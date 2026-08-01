# 🏛️ PhishPhage Architecture & Technical Blueprint

PhishPhage is an enterprise-ready, Explainable AI (XAI) security platform designed for Security Operations Center (SOC) teams. It inspects incoming email communications for phishing indicators, social engineering tactics, and malicious hyper-links using machine learning classifiers and natural language processing (NLP).

---

## 📐 System Architecture Overview

The following diagram illustrates the end-to-end telemetry flow—from client-side input through the FastAPI machine learning inference pipeline down to PDF/Markdown report generation.

```mermaid
graph TD
    subgraph Client ["Client Layer (React 18 + Vite)"]
        UI["EmailInspector Component"]
        Gauge["ThreatGauge & XAI Dashboard"]
        PDF["jsPDF Vector Report Exporter"]
    end

    subgraph Backend ["Inference Layer (FastAPI / Uvicorn)"]
        API["FastAPI App (/predict)"]
        
        subgraph Pipeline ["Forensic Pipeline"]
            Clean["Text Preprocessor & Sanitizer"]
            Extract["Linguistic & Link Extractor"]
            Vectorizer["TF-IDF Vectorizer"]
            Model["Random Forest Classifier"]
            XAI["XAI Rationale Generator"]
        end
    end

    UI -->|1. POST Raw Payload| API
    API --> Clean
    Clean --> Extract
    Clean --> Vectorizer
    Vectorizer --> Model
    Extract --> XAI
    Model -->|Probability & Prediction| XAI
    XAI -->|2. PredictResponse JSON| Gauge
    Gauge -->|3. Trigger PDF Export| PDF

    classDef client fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef backend fill:#020617,stroke:#10b981,stroke-width:2px,color:#f8fafc;
    classDef pipe fill:#1e293b,stroke:#f59e0b,stroke-width:1px,color:#f8fafc;
    
    class UI,Gauge,PDF client;
    class API backend;
    class Clean,Extract,Vectorizer,Model,XAI pipe;

```

---

## ⚡ Core Operational Components

### 1. Frontend Workspace (`/frontend`)

Built using **React 18**, **TypeScript**, and **Tailwind CSS v4**, the user interface provides real-time forensic feedback without triggering full page re-renders.

> [!NOTE]
> The UI includes smooth-scroll capabilities powered by Lenis inertia scrolling and reactive components styled with Framer Motion.

* **EmailInspector:** Captures raw headers, subject lines, and email bodies for forensic analysis.
* **ThreatGauge:** Visualizes threat probability scores with dynamic color-coded urgency thresholds.
* **ForensicBreakdown:** Displays extracted linguistic trigger keywords, suspicious link structures, and Explainable AI rationale.
* **ReportExporter:** Utilizes native `jsPDF` vector commands to assemble dark-mode SOC threat intelligence reports without canvas rasterization artifacts.

---

### 2. Machine Learning Inference Engine (`/backend`)

The backend is driven by **FastAPI** and **scikit-learn**, running asynchronously inside Uvicorn.

```mermaid
sequenceDiagram
    autonumber
    actor SOC as Analyst (Frontend)
    participant API as FastAPI Router
    participant NLP as Text Processor
    participant ML as Random Forest Model
    participant XAI as Explanation Engine

    SOC->>API: POST /predict { text: "..." }
    API->>NLP: Extract Links & Keyword Triggers
    NLP-->>API: Extracted Metadata & Clean Text
    API->>ML: Vectorize (TF-IDF) & Predict
    ML-->>API: Class (Phishing / Legitimate) & Confidence Score
    API->>XAI: Synthesize Findings
    XAI-->>API: Explainable Rationale String
    API-->>SOC: JSON Response (PredictResponse)

```

> [!IMPORTANT]
> The Random Forest model evaluates TF-IDF feature matrices trained on phishing corpora, combining statistical feature weights with structural heuristics (such as urgency indicators and domain mismatches).

---

## 🛠️ Data Pipeline & Response Schema

When an email is analyzed, the backend returns a strongly-typed JSON structure matching the schema below:

```json
{
  "is_phishing": true,
  "confidence": "94.20%",
  "prediction": "Phishing",
  "explanation": "High probability of phishing detected due to suspicious linguistic urgency triggers ('immediately', 'account locked') combined with mismatched domain hyperlinks.",
  "analysis": {
    "urgency_level": "High",
    "trigger_words_found": ["immediately", "verify", "locked", "action required"],
    "total_links_found": 2,
    "link_details": [
      {
        "url": "[http://login.secure-bank-verify.com/login](http://login.secure-bank-verify.com/login)",
        "is_suspicious": true,
        "reason": "Mismatched domain SSL structure / IP-based link"
      }
    ]
  }
}

```

> [!WARNING]
> PDF export relies strictly on optional-chaining property extractors (`data?.analysis?.trigger_words_found ?? []`) to ensure exports complete successfully even if payload properties are partially omitted.

---

## 🐳 Containerization & CI/CD Deployment

PhishPhage is fully dockerized with multi-stage builds and automated CI/CD pipelines.

```mermaid
graph LR
    subgraph GitHub ["GitHub Repository"]
        Push["git push origin main"]
    end

    subgraph Actions ["GitHub Actions CI/CD"]
        CI["ci.yml (Lint, Typecheck & Test)"]
        Publish["docker-publish.yml (Buildx)"]
    end

    subgraph Hub ["Docker Hub Registry"]
        BackImg["phishphage-backend:latest"]
        FrontImg["phishphage-frontend:latest"]
    end

    Push --> CI
    CI -->|Pass| Publish
    Publish -->|Push AMD64/ARM64| BackImg
    Publish -->|Push AMD64/ARM64| FrontImg

    classDef gh fill:#1e293b,stroke:#64748b,stroke-width:1px,color:#f8fafc;
    classDef hub fill:#0284c7,stroke:#38bdf8,stroke-width:1px,color:#f8fafc;
    class Actions gh;
    class Hub hub;

```

> [!TIP]
> You can deploy the complete stack locally using Docker Compose:
> ```bash
> docker compose up --build -d
> 
> ```
> 
> 

---