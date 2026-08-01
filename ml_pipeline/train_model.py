import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import RandomizedSearchCV, train_test_split
from sklearn.pipeline import Pipeline

# --- PATH CONFIGURATION (Dynamic Resolution) ---
# Finds project root relative to this file's position (ml_pipeline/train_model.py)
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent

DATA_PATH = PROJECT_ROOT / "ml_pipeline" / "datasets" / "phishing.csv"
ARTIFACT_DIR = PROJECT_ROOT / "backend" / "artifacts"


def train_phish_phage() -> None:
    """Trains the PhishPhage NLP model, tunes hyperparameters, and exports the serialized pipeline."""
    # Ensure artifacts directory exists
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

    # 1. LOAD & CLEAN
    print(f"🚀 Loading dataset from {DATA_PATH}...")
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"❌ Dataset not found at {DATA_PATH}. Ensure phishing.csv is in ml_pipeline/datasets/"
        )

    df = pd.read_csv(DATA_PATH)

    # Clean missing values and isolate required columns
    df = df[["text", "label_num"]].rename(columns={"label_num": "label"}).dropna()

    safe_count = (df["label"] == 0).sum()
    phish_count = (df["label"] == 1).sum()
    print(f"✅ Data loaded: {len(df)} samples ({phish_count} Phishing, {safe_count} Safe)")

    # 2. STRATIFIED SPLIT
    X_train, X_test, y_train, y_test = train_test_split(
        df["text"],
        df["label"],
        test_size=0.2,
        random_state=42,
        stratify=df["label"],
    )

    # 3. CONSTRUCT TUNING PIPELINE
    pipeline = Pipeline(
        [
            ("tfidf", TfidfVectorizer(stop_words="english")),
            ("clf", RandomForestClassifier(random_state=42, class_weight="balanced")),
        ]
    )

    # 4. HYPERPARAMETER SEARCH SPACE
    param_dist = {
        "tfidf__max_features": [3000, 5000, 7000],
        "tfidf__ngram_range": [(1, 1), (1, 2)],  # Unigrams + Bigrams
        "clf__n_estimators": [100, 200],
        "clf__max_depth": [None, 20, 30],
        "clf__min_samples_split": [2, 5],
    }

    print("🧠 Starting Hyperparameter Tuning (Parallel Execution)...")
    random_search = RandomizedSearchCV(
        estimator=pipeline,
        param_distributions=param_dist,
        n_iter=10,
        cv=3,
        verbose=1,
        n_jobs=-1,  # Utilizes all CPU cores
        random_state=42,
    )

    random_search.fit(X_train, y_train)

    # 5. EVALUATION
    best_model = random_search.best_estimator_
    y_pred = best_model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    report_dict = classification_report(y_test, y_pred, target_names=["Safe", "Phishing"], output_dict=True)

    print("\n--- PERFORMANCE REPORT ---")
    print(f"Best Parameters: {random_search.best_params_}")
    print(f"Overall Accuracy: {acc * 100:.2f}%")
    print(classification_report(y_test, y_pred, target_names=["Safe", "Phishing"]))

    # 6. EXPORT ARTIFACTS
    model_path = ARTIFACT_DIR / "model.pkl"
    metadata_path = ARTIFACT_DIR / "model_metadata.json"

    # Save model pipeline with joblib compression (compress=3 balances speed and file size)
    joblib.dump(best_model, model_path, compress=3)
    print(f"\n📦 Elite Model saved to: {model_path}")

    # Export Metadata for auditing / CI/CD checks
    metadata = {
        "model_version": "1.1.0",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "accuracy": float(acc),
        "best_params": random_search.best_params_,
        "metrics": report_dict,
    }
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4)

    print(f"📑 Model Metadata saved to: {metadata_path}")


if __name__ == "__main__":
    train_phish_phage()