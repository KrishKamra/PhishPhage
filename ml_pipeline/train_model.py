import pandas as pd
import re
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline

# 1. LOAD DATA
print("Loading dataset...")
# We read the CSV file.
df = pd.read_csv("ml_pipeline/datasets/phishing.csv")

# 2. SELECT & RENAME COLUMNS
# This new dataset has 'text' and 'label_num' (0=Safe, 1=Phishing)
# We keep only what we need and rename 'label_num' to 'label' for clarity.
df = df[['text', 'label_num']].rename(columns={'label_num': 'label'})

# Drop rows where text is missing (just in case)
df = df.dropna()

print(f"Data loaded. Found {len(df)} emails.")
print(f"Phishing (1): {len(df[df['label']==1])}")
print(f"Safe (0): {len(df[df['label']==0])}")

# 3. PREPARE TRAINING DATA
X = df['text']
y = df['label']

# Split: 80% for training, 20% for testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. TRAIN MODEL
# Pipeline: Text -> Numbers (TF-IDF) -> Classifier (Random Forest)
print("Training model (this might take a minute)...")
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000, stop_words='english')),
    ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
])

pipeline.fit(X_train, y_train)

# 5. EVALUATE
accuracy = pipeline.score(X_test, y_test)
print(f"Model Training Complete!")
print(f"Accuracy on Test Data: {accuracy * 100:.2f}%")

# 6. SAVE THE BRAIN
# We save the model to the backend/artifacts folder
with open("backend/artifacts/model.pkl", "wb") as f:
    pickle.dump(pipeline, f)

print("Model saved to backend/artifacts/model.pkl")