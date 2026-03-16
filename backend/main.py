from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware # <-- NEW
from pydantic import BaseModel
import pickle
import os
import re

# 1. Initialize the FastAPI app
app = FastAPI(title="PhishGuard API Pro")

# --- NEW CORS SETUP ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (good for local testing)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, etc.)
    allow_headers=["*"],  # Allows all headers
)

# 2. Load the trained model safely
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "artifacts", "model.pkl")

print(f"Loading model from: {MODEL_PATH}")
try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully!")
except FileNotFoundError:
    print("❌ ERROR: Model file not found. Did you run the training script?")
    model = None

# 3. Define the expected incoming data format
class EmailRequest(BaseModel):
    text: str

# --- NEW HEURISTIC FUNCTIONS ---

def analyze_urgency(text: str):
    """Detects psychological manipulation and urgency."""
    urgency_keywords = [
        "urgent", "immediately", "suspended", "locked", "verify", 
        "action required", "final warning", "password", "unauthorized",
        "validate", "terminate", "alert"
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
    """Extracts URLs and flags suspicious patterns."""
    # Regex to find URLs starting with http:// or https://
    url_pattern = re.compile(r'https?://[^\s]+')
    raw_links = url_pattern.findall(text)
    
    links_info = []
    for link in raw_links:
        is_suspicious = False
        reasons = []
        
        # Check 1: Is it unencrypted HTTP?
        if link.startswith("http://"):
            is_suspicious = True
            reasons.append("Unencrypted (HTTP)")
        
        # Check 2: Does it use an IP address instead of a domain? (e.g., http://192.168.1.1)
        if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', link):
            is_suspicious = True
            reasons.append("Uses IP address instead of domain name")
            
        links_info.append({
            "url": link,
            "is_suspicious": is_suspicious,
            "reason": ", ".join(reasons) if reasons else "Looks standard"
        })
        
    return links_info

# --- END HEURISTIC FUNCTIONS ---

@app.get("/")
def home():
    return {"message": "PhishGuard API is up and running!"}

@app.post("/predict")
def predict_email(request: EmailRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="ML Model not loaded on the server.")

    email_text = request.text
    
    # Run the ML Prediction
    prediction = model.predict([email_text])[0]
    probs = model.predict_proba([email_text])[0]
    
    confidence = probs[1] * 100
    is_phishing = bool(prediction == 1)
    
    # Run the Heuristic Analysis
    urgency_level, trigger_words = analyze_urgency(email_text)
    links_data = analyze_links(email_text)
    
    # Build a Dynamic Explanation
    explanation_parts = []
    suspicious_links_count = sum(1 for link in links_data if link["is_suspicious"])
    
    if is_phishing:
        if urgency_level in ["High", "Medium"]:
            explanation_parts.append(f"manipulative language ({', '.join(trigger_words[:2])})")
        if suspicious_links_count > 0:
            explanation_parts.append(f"{suspicious_links_count} suspicious link(s)")
            
        if explanation_parts:
            explanation = "Flagged due to " + " and ".join(explanation_parts) + "."
        else:
            explanation = "Flagged by the ML model based on general vocabulary and structure."
    else:
        explanation = "No obvious phishing patterns detected, though always remain cautious."
    
    # Format the final response
    result_label = "Phishing Detected" if is_phishing else "Likely Legitimate"
    
    return {
        "prediction": result_label,
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