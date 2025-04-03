import re
import string

# Define custom stopwords list for Roman Urdu
roman_urdu_stopwords = {
    "aur", "hai", "ke", "ka", "ki", "ko", "the", "main", "tum", "wo", "ap", "kaise", "aap", "kya"
}

# Function for preprocessing input text
def transform_text(text):
    # Convert to lowercase
    text = text.lower()
    
    # Tokenize using regex (simple word split, ignoring non-alphanumeric characters)
    words = re.findall(r'\b\w+\b', text)  # This will give you the words in the text
    
    # Remove stopwords
    words = [word for word in words if word not in roman_urdu_stopwords]
    
    # Remove punctuation (already handled by regex, but we can double-check)
    words = [word for word in words if word not in string.punctuation]
    
    return " ".join(words) 