from flask import render_template, request, jsonify
import pickle
import os
from app import app
from app.utils import transform_text

# Load the trained model and vectorizer
models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
model_path = os.path.join(models_dir, 'model.pkl')
vectorizer_path = os.path.join(models_dir, 'vectorizer.pkl')

with open(model_path, 'rb') as model_file:
    model = pickle.load(model_file)

with open(vectorizer_path, 'rb') as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

def analyze_text(text):
    """
    Preprocess and classify Roman Urdu text, extracting label,
    probabilities, confidence score, and token insights.
    """
    if not text or not text.strip():
        return None

    cleaned_text = text.strip()
    transformed_input = transform_text(cleaned_text)
    vectorized_input = vectorizer.transform([transformed_input])

    # Predict label (0 = Hateful, 1 = Normal)
    result = int(model.predict(vectorized_input)[0])

    hate_prob = 0.0
    normal_prob = 0.0
    confidence = 90.0

    if hasattr(model, 'predict_proba'):
        try:
            probas = model.predict_proba(vectorized_input)[0]
            # classes are [0, 1]
            hate_prob = round(float(probas[0]) * 100, 1)
            normal_prob = round(float(probas[1]) * 100, 1)
            confidence = normal_prob if result == 1 else hate_prob
        except Exception:
            pass

    is_hateful = (result == 0)
    prediction = "Normal Tweet" if result == 1 else "Hateful Tweet"

    # Compute risk level
    if is_hateful:
        if hate_prob >= 75.0:
            risk_level = "High"
        else:
            risk_level = "Moderate"
    else:
        if hate_prob >= 40.0:
            risk_level = "Medium"
        elif hate_prob >= 20.0:
            risk_level = "Low-Medium"
        else:
            risk_level = "Low"

    tokens = [w for w in transformed_input.split() if w] if transformed_input else []
    words = cleaned_text.split()

    return {
        "success": True,
        "prediction": prediction,
        "is_hateful": is_hateful,
        "confidence": confidence,
        "hate_probability": hate_prob,
        "normal_probability": normal_prob,
        "risk_level": risk_level,
        "tokens": tokens,
        "text": cleaned_text,
        "char_count": len(cleaned_text),
        "word_count": len(words)
    }

# Route for the homepage
@app.route('/', methods=['GET', 'POST'])
def index():
    analysis = None
    user_input = ""
    error = None

    if request.method == 'POST':
        # Check if JSON request
        if request.is_json:
            data = request.get_json() or {}
            user_input = data.get('tweet', '')
        else:
            user_input = request.form.get('tweet', '')

        if not user_input.strip():
            error = "Please enter some Roman Urdu text to analyze."
        else:
            try:
                analysis = analyze_text(user_input)
            except Exception as e:
                error = f"Error during prediction: {e}"

        if request.is_json:
            if error:
                return jsonify({"success": False, "error": error}), 400
            return jsonify(analysis)

    prediction = analysis["prediction"] if analysis else None
    return render_template(
        'index.html',
        prediction=prediction,
        analysis=analysis,
        user_input=user_input,
        error=error
    )

# Dedicated API endpoint for asynchronous AJAX requests
@app.route('/api/analyze', methods=['POST'])
def api_analyze():
    data = request.get_json(silent=True) or {}
    text = data.get('tweet') or request.form.get('tweet', '')

    if not text or not text.strip():
        return jsonify({"success": False, "error": "No text provided"}), 400

    try:
        result = analyze_text(text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
 