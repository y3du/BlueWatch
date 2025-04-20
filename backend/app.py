from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import torch
import spacy
import re
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from lime.lime_text import LimeTextExplainer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load NLP Models
MODEL_NAME = "cardiffnlp/twitter-roberta-base-emotion"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
nlp = spacy.load("en_core_web_sm")

# Emotion Labels and Negative Words
EMOTIONS = ["anger", "joy", "optimism", "sadness"]
NEGATIVE_WORDS = {"death", "kill", "attack", "bomb", "threat", "destroy"}

# Mock User Data (simulating API response for a single user)
USER_DATA = {
    "username": "ThreatActorX",
    "name": "John Doe",
    "id": "987654321",
    "created_at": "2015-03-15T10:00:00.000Z",
    "description": "Activist with a cause. Expect chaos.",
    "public_metrics": {
        "followers_count": 25000,
        "following_count": 180,
        "tweet_count": 1200,
        "listed_count": 50
    },
    "location": "Unknown",
    "verified": False
}

# Mock Tweet Data (tied to the user above)
BASE_DATE = datetime.utcnow() - timedelta(days=1)
MOCK_THREAT_TWEETS = [
    {"text": "Air Force One will be targeted in our next phase.",
     "created_at": BASE_DATE.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
     "public_metrics": {"like_count": 50, "retweet_count": 10, "reply_count": 16}},
    {"text": "Weapons, supplies, and the plan are almost in place. The world will hear us.",
     "created_at": BASE_DATE.strftime("%Y-%m-%dT15:30:00.000Z"),
     "public_metrics": {"like_count": 4, "retweet_count": 0, "reply_count": 2}},
    {"text": "Tomorrow, we take over Silicon Valley's tech giants.",
     "created_at": BASE_DATE.strftime("%Y-%m-%dT18:45:00.000Z"),
     "public_metrics": {"like_count": 99, "retweet_count": 34, "reply_count": 78}},
    {"text": "The attack on the city will be devastating.",
     "created_at": BASE_DATE.strftime("%Y-%m-%dT19:30:00.000Z"),
     "public_metrics": {"like_count": 30, "retweet_count": 12, "reply_count": 8}},
    {"text": "We will destroy everything they hold dear.",
     "created_at": BASE_DATE.strftime("%Y-%m-%dT21:10:00.000Z"),
     "public_metrics": {"like_count": 45, "retweet_count": 20, "reply_count": 15}},
    {"text": "Death is the only justice for our enemies.",
     "created_at": BASE_DATE.strftime("%Y-%m-%dT22:50:00.000Z"),
     "public_metrics": {"like_count": 60, "retweet_count": 25, "reply_count": 18}},
]

# NLP Processing Functions
def analyze_emotion(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    scores = outputs.logits.softmax(dim=1).numpy()[0]
    emotion_index = np.argmax(scores)
    return EMOTIONS[emotion_index], float(scores[emotion_index])

def clean_text(text):
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'@\w+', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return text.strip()

def extract_named_entities(text):
    cleaned_text = clean_text(text)
    doc = nlp(cleaned_text)
    entities = {"PERSON": [], "ORG": [], "GPE": []}
    for ent in doc.ents:
        if ent.label_ in entities:
            entities[ent.label_].append(ent.text)
    return entities

def detect_negative_words(text):
    words = set(text.lower().split())
    flagged_words = words.intersection(NEGATIVE_WORDS)
    return list(flagged_words)

# Severity Score Calculation
def calculate_severity(emotion, confidence, flagged_words, metrics):
    score = 0
    if emotion == "anger":
        score += 30 * confidence
    elif emotion == "sadness":
        score += 10 * confidence
    score += 20 * len(flagged_words)
    engagement = metrics["like_count"] + metrics["retweet_count"] + metrics["reply_count"]
    score += min(50, engagement / 10)
    return min(100, int(score))

# LIME Integration
def predict_proba(texts):
    inputs = tokenizer(texts, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    scores = outputs.logits.softmax(dim=1).numpy()
    return scores

explainer = LimeTextExplainer(class_names=EMOTIONS)

def explain_tweet(tweet_text):
    exp = explainer.explain_instance(tweet_text, predict_proba, num_features=5, num_samples=300)
    return [{"word": word, "importance": float(score)} for word, score in exp.as_list()]

# Analyze Tweets and Prepare Response
def analyze_tweets(tweets, user_data):
    analyzed_tweets = []
    emotion_counts = {e: 0 for e in EMOTIONS}
    flagged_words_summary = {}
    severity_scores = []

    for tweet in tweets:
        emotion, confidence = analyze_emotion(tweet["text"])
        entities = extract_named_entities(tweet["text"])
        flagged_words = detect_negative_words(tweet["text"])
        lime_explanation = explain_tweet(tweet["text"])
        severity = calculate_severity(emotion, confidence, flagged_words, tweet["public_metrics"])

        emotion_counts[emotion] += 1
        for word in flagged_words:
            flagged_words_summary[word] = flagged_words_summary.get(word, 0) + 1
        severity_scores.append(severity)

        analyzed_tweets.append({
            "text": tweet["text"],
            "created_at": tweet["created_at"],
            "emotion": emotion,
            "confidence": confidence,
            "entities": entities,
            "flagged_words": flagged_words,
            "lime_explanation": lime_explanation,
            "public_metrics": tweet["public_metrics"],
            "severity_score": severity
        })

    # Construct response with user data
    response = {
        "user": {
            "username": user_data["username"],
            "name": user_data["name"],
            "id": user_data["id"],
            "created_at": user_data["created_at"],
            "description": user_data["description"],
            "followers_count": user_data["public_metrics"]["followers_count"],
            "following_count": user_data["public_metrics"]["following_count"],
            "tweet_count": user_data["public_metrics"]["tweet_count"],
            "listed_count": user_data["public_metrics"]["listed_count"],
            "location": user_data["location"],
            "verified": user_data["verified"]
        },
        "analysis": analyzed_tweets,
        "summary": {
            "total_tweets": len(tweets),
            "flagged_count": sum(1 for tweet in analyzed_tweets if tweet["flagged_words"]),
            "emotion_counts": emotion_counts,
            "flagged_words_summary": flagged_words_summary,
            "avg_severity": sum(severity_scores) / len(severity_scores) if severity_scores else 0
        }
    }
    return response

# Flask Route
@app.route('/analyze', methods=['GET', 'POST'])
def analyze():
    if request.method == 'POST':
        # Handle POST request with form data
        form_data = request.json
        # You can use form_data to customize the analysis if needed
        # For now, we'll use the mock data
        tweets = MOCK_THREAT_TWEETS
        user_data = USER_DATA
    else:
        # Handle GET request with mock data
        tweets = MOCK_THREAT_TWEETS
        user_data = USER_DATA
    
    # Analyze tweets with user context
    results = analyze_tweets(tweets, user_data)
    
    return jsonify(results)

@app.route('/create-pdf', methods=['POST'])
def create_pdf():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        # Return a simple success response instead of generating PDF
        return jsonify({
            'message': 'PDF generation request received',
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)