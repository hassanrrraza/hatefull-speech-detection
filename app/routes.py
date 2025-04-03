from flask import render_template, request
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

# Route for the homepage
@app.route('/', methods=['GET', 'POST'])
def index():
    prediction = None
    if request.method == 'POST':
        # Get user input from the form
        user_input = request.form['tweet']
        
        # Preprocess the input text
        transformed_input = transform_text(user_input)
        
        # Vectorize the input text
        vectorized_input = vectorizer.transform([transformed_input])
        
        # Predict using the trained model
        try:
            result = model.predict(vectorized_input)[0]
        except Exception as e:
            return render_template('index.html', prediction=f"Error during prediction: {e}")
        
        # Determine the result message
        if result == 1:
            prediction = "Normal Tweet"
        else:
            prediction = "Hateful Tweet"
    
    return render_template('index.html', prediction=prediction) 