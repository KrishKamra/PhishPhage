# 🤝 Contributing to PhishPhage

First off, thank you for considering contributing to **PhishPhage**! Whether you are fixing a bug, adding an Explainable AI (XAI) feature, improving model accuracy, or polishing the SOC dashboard UI, your help is warmly welcomed.

---

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful, inclusive, and professional environment for all contributors and security researchers.

---

## 🛠️ Local Development Environment Setup

### Prerequisites
- **Git**
- **Python 3.11+**
- **Node.js 20+** and **npm**
- **Docker & Docker Compose** (Optional, for container testing)

---

### 1. Fork & Clone the Repository

```bash
# Clone your fork
git clone [https://github.com/YOUR-USERNAME/PhishPhage.git](https://github.com/YOUR-USERNAME/PhishPhage.git)
cd PhishPhage

```

---

### 2. Backend Setup (FastAPI & ML Engine)

```bash
cd backend

# Create and activate a Python virtual environment
python -m venv .venv

# On Linux/macOS:
source .venv/bin/activate
# On Windows PowerShell:
# .venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI dev server
uvicorn main:app --reload --port 8000

```

The FastAPI server will start at `http://127.0.0.1:8000`. You can test endpoints via Swagger UI at `http://127.0.0.1:8000/docs`.

---

### 3. Frontend Setup (React, Vite & Tailwind)

Open a second terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev

```

The React frontend will start at `http://localhost:5173`.

---

## 🚀 Development & Contribution Workflow

### Step 1: Create a Feature Branch

Follow standard branch naming conventions:

* `feat/feature-name` for new capabilities or UI components.
* `fix/bug-description` for bug fixes.
* `docs/topic-name` for documentation enhancements.

```bash
git checkout -b feat/add-threat-level-badge

```

---

### Step 2: Code Quality & Testing Guidelines

Before opening a pull request, ensure your code passes local verification:

#### Backend Verification

```bash
cd backend

# Run linting checks
flake8 .

# Run pytest suite (if adding unit tests)
pytest

```

#### Frontend Verification

```bash
cd frontend

# Run TypeScript type check
npx tsc --noEmit

# Test production build
npm run build

```

#### Docker Stack Check

```bash
# From the project root, verify Docker Compose builds cleanly
docker compose up --build -d
docker compose down

```

---

### Step 3: Commit Messages

Write clear, concise commit messages using conventional commit prefixes:

* `feat: add PDF custom logo header options`
* `fix: prevent undefined crash in emailText parsing`
* `docs: update API specification schema`
* `ci: add Docker Hub publishing workflow`

---

### Step 4: Submit a Pull Request (PR)

1. Push your branch to your forked repository:
```bash
git push origin feat/add-threat-level-badge

```


2. Open GitHub and navigate to the original **PhishPhage** repository.
3. Click **New Pull Request** and select your feature branch.
4. Fill out the PR template detailing:
* What changes were made.
* Screenshots/GIFs of UI changes (if applicable).
* How you tested the changes locally.



---

## 🐛 Reporting Bugs & Requesting Features

* **Reporting Bugs:** Use the [Bug Report Template](https://www.google.com/search?q=.github/ISSUE_TEMPLATE/bug_report.md) when submitting issue reports.
* **Requesting Features:** Use the [Feature Request Template](https://www.google.com/search?q=.github/ISSUE_TEMPLATE/feature_request.md) to propose new capabilities.

Thank you for helping keep digital communications safe with **PhishPhage**! 🛡️

---