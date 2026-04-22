from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
import os
import re
import joblib

# 1. Initialize the FastAPI app
app = FastAPI(
    title="PhishPhage Forensic API",
    description="Backend engine for real-time NLP phishing detection and forensic auditing.",
    version="1.1.0"
)

# --- CORS SETUP ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Load the trained model using Joblib (Elite Standard)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "artifacts", "model.pkl")

# We use a global variable to store the loaded pipeline
model = None

@app.on_event("startup")
def load_model():
    global model
    try:
        # Switching to joblib.load to match our new train_model.py
        model = joblib.load(MODEL_PATH)
        print(f"✅ PhishPhage Brain loaded successfully from {MODEL_PATH}")
    except Exception as e:
        print(f"❌ FATAL ERROR: Could not load model. Error: {e}")
        model = None

# 3. Request Model
class EmailRequest(BaseModel):
    text: str

# --- HEURISTIC ANALYSIS ENGINES ---

def analyze_urgency(text: str):
    """Detects psychological manipulation and urgency triggers."""
    urgency_keywords = [
        "urgent", "immediately", "suspended", "locked", "verify", 
        "action required", "final warning", "password", "unauthorized",
        "validate", "terminate", "alert", "security", "expire"
    ]
    text_lower = text.lower()
    found_words = [word for word in urgency_keywords if word in text_lower]
    
    if len(found_words) >= 2:
        level = "High"
    elif len(found_words) == 1:
        level = "Medium"
    else:
        level = "Low"
        
    return level, found_words

def analyze_links(text: str):
    """Forensic link parser to flag suspicious URL structures."""
    url_pattern = re.compile(r'https?://[^\s]+')
    raw_links = url_pattern.findall(text)
    
    links_info = []
    for link in raw_links:
        is_suspicious = False
        reasons = []
        
        # Check 1: Unencrypted protocol
        if link.startswith("http://"):
            is_suspicious = True
            reasons.append("Unencrypted (HTTP)")
        
        # Check 2: IP-based URL (Typical phishing tactic)
        if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', link):
            is_suspicious = True
            reasons.append("Uses raw IP instead of domain")
            
        links_info.append({
            "url": link,
            "is_suspicious": is_suspicious,
            "reason": ", ".join(reasons) if reasons else "Safe protocol"
        })
        
    return links_info

# --- ENDPOINTS ---

@app.get("/")
def home():
    return {
        "status": "online",
        "service": "PhishPhage API",
        "version": "1.1.0",
        "model_loaded": model is not None
    }

@app.post("/predict")
async def predict_email(request: EmailRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model artifact missing. Contact administrator.")

    email_text = request.text
    if not email_text.strip():
        raise HTTPException(status_code=400, detail="Text content cannot be empty.")

    try:
        # Run ML Inference
        prediction = model.predict([email_text])[0]
        probs = model.predict_proba([email_text])[0]
        
        # Probability of class 1 (Spam/Phishing)
        confidence = probs[1] * 100
        is_phishing = bool(prediction == 1)
        
        # Run Forensic Heuristics
        urgency_level, trigger_words = analyze_urgency(email_text)
        links_data = analyze_links(email_text)
        
        # Build Forensic Explanation
        explanation_parts = []
        susp_links = sum(1 for link in links_data if link["is_suspicious"])
        
        if is_phishing:
            if urgency_level in ["High", "Medium"]:
                explanation_parts.append(f"manipulative language ({', '.join(trigger_words[:2])})")
            if susp_links > 0:
                explanation_parts.append(f"{susp_links} suspicious link(s)")
            
            explanation = f"Flagged due to { ' and '.join(explanation_parts) if explanation_parts else 'general structural patterns'}."
        else:
            explanation = "No obvious phishing patterns detected, though always remain cautious."

        return {
            "prediction": "Phishing Detected" if is_phishing else "Likely Legitimate",
            "is_phishing": is_phishing,
            "confidence": f"{confidence:.2f}%",
            "analysis": {
                "urgency_level": urgency_level,
                "trigger_words_found": trigger_words,
                "total_links_found": len(links_data),
                "link_details": links_data
            },
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference Error: {str(e)}")