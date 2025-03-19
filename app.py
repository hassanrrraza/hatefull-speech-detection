from flask import Flask, render_template, request
import pickle
import os
import re  # For custom tokenization using regex
import string

# Initialize Flask app
app = Flask(__name__)

# Load the trained model and vectorizer
model_path = os.path.join('models', 'model.pkl')
vectorizer_path = os.path.join('models', 'vectorizer.pkl')

with open(model_path, 'rb') as model_file:
    model = pickle.load(model_file)

with open(vectorizer_path, 'rb') as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

# Define custom stopwords list for Roman Urdu (you can expand it)
roman_urdu_stopwords = {
    "aur", "hai", "ke", "ka", "ki", "ko", "the", "main", "tum", "wo", "ap", "kaise", "aap", "kya"
}

# Function for preprocessing input text (without NLTK)
def transform_text(text):
    # Convert to lowercase
    text = text.lower()
    
    # Tokenize using regex (simple word split, ignoring non-alphanumeric characters)
    words = re.findall(r'\b\w+\b', text)  # This will give you the words in the text
    
    # Remove stopwords
    words = [word for word in words if word not in roman_urdu_stopwords]
    
    # Remove punctuation (already handled by regex, but we can double-check)
    words = [word for word in words if word not in string.punctuation]
    
    # (Optional) Stemming if needed, using a custom method or Porter Stemmer if desired
    # From nltk.stem import PorterStemmer
    # ps = PorterStemmer()
    # words = [ps.stem(word) for word in words]

    return " ".join(words)

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

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
