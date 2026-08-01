# 📡 PhishPhage REST API Specification

This document provides technical documentation for the **PhishPhage REST API**. The backend API is powered by FastAPI and provides asynchronous endpoints for inspecting raw email communications, evaluating linguistic phishing indicators, and monitoring model telemetry.

---

## 🌐 Base URL & Host Details

| Environment | Base URL |
| :--- | :--- |
| **Local Development** | `http://127.0.0.1:8000` |
| **Docker Compose Container** | `http://localhost:8000` |
| **Interactive OpenAPI Docs (Swagger)** | `http://127.0.0.1:8000/docs` |
| **Alternative API Docs (ReDoc)** | `http://127.0.0.1:8000/redoc` |

> [!NOTE]
> All request payloads and response bodies use standard UTF-8 encoded `application/json`.

---

## 🛠️ API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | System health check & telemetry status | None |
| `POST` | `/predict` | Primary email content classification & XAI audit | None |
| `POST` | `/feedback` | Log human-in-the-loop retraining feedback | None |

---

## 📖 Endpoint Details

### 1. `GET /` — System Health & Telemetry

Returns server status, API operational health, and machine learning model artifact loading status.

#### Request Example
```http
GET / HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json

```

#### Response Example (`200 OK`)

```json
{
  "status": "online",
  "version": "1.1.0",
  "model_loaded": true,
  "engine": "RandomForest + TF-IDF Vectorizer",
  "timestamp": "2026-08-02T02:15:00.000Z"
}

```

---

### 2. `POST /predict` — Email Forensic Inspection

Analyzes raw text payload for phishing probability, linguistic urgency indicators, embedded link safety, and Explainable AI (XAI) rationale.

#### Request Headers

| Header | Value |
| --- | --- |
| `Content-Type` | `application/json` |

#### Request Body Schema

```json
{
  "text": "string (required, min length: 1)"
}

```

#### Request Example

```http
POST /predict HTTP/1.1
Host: 127.0.0.1:8000
Content-Type: application/json

{
  "text": "URGENT: Your bank account has been locked due to unauthorized login attempts. Click immediately to verify your credentials: [http://login.secure-verify-bank.com/auth](http://login.secure-verify-bank.com/auth)"
}

```

#### Response Example (`200 OK`)

```json
{
  "is_phishing": true,
  "prediction": "Phishing",
  "confidence": "94.50%",
  "explanation": "High probability of phishing detected due to multiple urgency keywords ('urgent', 'locked', 'immediately') paired with an unverified third-party link.",
  "analysis": {
    "urgency_level": "High",
    "trigger_words_found": [
      "urgent",
      "locked",
      "immediately",
      "verify"
    ],
    "total_links_found": 1,
    "link_details": [
      {
        "url": "[http://login.secure-verify-bank.com/auth](http://login.secure-verify-bank.com/auth)",
        "is_suspicious": true,
        "reason": "Mismatched domain SSL structure / IP-based link"
      }
    ]
  }
}

```

> [!IMPORTANT]
> If no links or trigger words are present in the submitted text, `trigger_words_found` and `link_details` return empty arrays `[]` while `total_links_found` defaults to `0`.

---

### 3. `POST /feedback` — Active Learning Feedback Loop

Allows SOC analysts to flag false positives or false negatives for active model retraining pipelines.

#### Request Body Schema

```json
{
  "content": "string (required)",
  "original_prediction": "string (required)",
  "user_flag": "false_positive | false_negative"
}

```

#### Request Example

```http
POST /feedback HTTP/1.1
Host: 127.0.0.1:8000
Content-Type: application/json

{
  "content": "Your monthly scheduled server maintenance report is ready.",
  "original_prediction": "Phishing",
  "user_flag": "false_positive"
}

```

#### Response Example (`200 OK`)

```json
{
  "status": "success",
  "message": "Feedback successfully queued for active retraining pipeline."
}

```

---

## ❌ Error Handling & Status Codes

PhishPhage returns standard HTTP status codes along with descriptive JSON error payloads.

| Status Code | Meaning | Cause |
| --- | --- | --- |
| `200 OK` | Success | Request processed cleanly |
| `400 Bad Request` | Invalid Input | Empty payload text or malformed JSON syntax |
| `422 Unprocessable Entity` | Validation Error | Request body does not match the required schema |
| `500 Internal Server Error` | Model Error | Unexpected inference failure or missing ML model weights |

#### Error Response Format (`422 Unprocessable Entity`)

```json
{
  "detail": [
    {
      "loc": ["body", "text"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}

```

> [!WARNING]
> Always handle network exceptions and HTTP `500` errors gracefully in client integrations by falling back to safe defaults.

---