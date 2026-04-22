import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score

# --- CONFIGURATION ---
DATA_PATH = "ml_pipeline/datasets/phishing.csv"
ARTIFACT_DIR = "backend/artifacts"
os.makedirs(ARTIFACT_DIR, exist_ok=True)

def train_phish_phage():
    # 1. LOAD & CLEAN
    print("🚀 Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    
    # Selecting relevant columns based on your specific dataset structure
    df = df[['text', 'label_num']].rename(columns={'label_num': 'label'}).dropna()

    print(f"✅ Data loaded: {len(df)} samples ({df.label.value_counts()[1]} Phishing, {df.label.value_counts()[0]} Safe)")

    # 2. SPLIT
    X_train, X_test, y_train, y_test = train_test_split(
        df['text'], df['label'], test_size=0.2, random_state=42, stratify=df['label']
    )

    # 3. CONSTRUCT TUNING PIPELINE
    # We use a pipeline to ensure TF-IDF parameters are tuned alongside the RF parameters
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english')),
        ('clf', RandomForestClassifier(random_state=42, class_weight='balanced'))
    ])

    # 4. HYPERPARAMETER TUNING (RandomizedSearch)
    # This searches for the best combination of "Forest Depth" and "Feature Count"
    param_dist = {
        'tfidf__max_features': [3000, 5000, 7000],
        'tfidf__ngram_range': [(1, 1), (1, 2)], # Look at single words AND pairs
        'clf__n_estimators': [100, 200],
        'clf__max_depth': [None, 20, 30],
        'clf__min_samples_split': [2, 5]
    }

    print("🧠 Starting Hyperparameter Tuning (this takes a moment)...")
    random_search = RandomizedSearchCV(
        pipeline, param_distributions=param_dist, n_iter=10, 
        cv=3, verbose=1, n_jobs=-1, random_state=42
    )

    random_search.fit(X_train, y_train)

    # 5. EVALUATE
    best_model = random_search.best_estimator_
    y_pred = best_model.predict(X_test)
    
    print("\n--- PERFORMANCE REPORT ---")
    print(f"Best Params: {random_search.best_params_}")
    print(f"Overall Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
    print(classification_report(y_test, y_pred, target_names=['Safe', 'Phishing']))

    # 6. EXPORT (Using Joblib for Efficiency)
    model_path = os.path.join(ARTIFACT_DIR, "model.pkl")
    joblib.dump(best_model, model_path)
    
    print(f"\n📦 Elite Model saved to {model_path}")
    print("⚠️  Note: If your FastAPI was using 'pickle.load', update it to 'joblib.load'.")

if __name__ == "__main__":
    train_phish_phage()