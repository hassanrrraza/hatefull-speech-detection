# Roman Urdu Hate Speech Detection

![Python](https://img.shields.io/badge/python-v3.7+-blue.svg)
![Flask](https://img.shields.io/badge/flask-v2.0.1-green.svg)
![scikit-learn](https://img.shields.io/badge/scikit--learn-latest-orange.svg)

A machine learning web application that detects hate speech in Roman Urdu text. The system analyzes input text and classifies it as either a normal or hateful tweet.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Model Training](#model-training)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

This project implements a machine learning-based hate speech detection system specifically designed for the Roman Urdu language. The system uses natural language processing techniques to analyze and classify text as either normal or hate speech.

The web application provides a user-friendly interface where users can input text and receive immediate analysis results.

## ✨ Features

- **Text Analysis**: Input any Roman Urdu text for analysis
- **Real-time Classification**: Instantly classifies text as normal or hateful
- **Responsive Design**: Modern UI that works across devices
- **Custom Preprocessing**: Specialized tokenization and stopword removal for Roman Urdu
- **Machine Learning Backend**: Trained on a dataset of Roman Urdu tweets

## 🎬 Demo

![Interface Preview](https://raw.githubusercontent.com/hassanrrraza/hateful_speech_flask/main/app/static/img/screenshot.PNG)

*Screenshot of the application analyzing sample text*

## 🛠️ Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Flask (Python)
- **Machine Learning**: scikit-learn
- **NLP Processing**: Custom regex-based tokenization
- **Data Storage**: Pickle (model serialization)

## 📁 Project Structure

```
roman_urdu_hate_speech/
│
├── app/                      # Application package
│   ├── __init__.py           # Initialize Flask app
│   ├── routes.py             # Application routes
│   └── utils.py              # Utility functions
│
├── models/                   # Trained models
│   ├── model.pkl             # Serialized classifier model
│   └── vectorizer.pkl        # Serialized text vectorizer
│
├── static/                   # Static files
│   ├── css/                  # CSS stylesheets
│   │   └── styles.css        # Main stylesheet
│   └── img/                  # Images
│
├── templates/                # HTML templates
│   └── index.html            # Main template
│
├── notebooks/                # Jupyter notebooks
│   └── Hate_Speech_Detection.ipynb  # Model training notebook
│
├── data/                     # Data files
│   ├── Dataset.csv           # Original dataset
│   └── Preprocessed_Dataset.csv  # Processed dataset
│
├── .gitignore                # Git ignore file
├── config.py                 # Configuration settings
├── requirements.txt          # Project dependencies
├── run.py                    # Application entry point
└── README.md                 # Project documentation
```

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hassanrrraza/hatefull-speech-detection.git
   cd hatefull-speech-detection
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the application:
   ```bash
   python run.py
   ```

5. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000/
   ```

## 💻 Usage

1. Enter Roman Urdu text in the input field
2. Click the "Analyze Text" button
3. View the classification result (Normal Tweet or Hateful Tweet)

## 🧠 Model Training

The model was trained on a dataset of Roman Urdu tweets, which were manually labeled as either normal or hateful. The training process involved:

1. Text preprocessing (tokenization, stopword removal)
2. Feature extraction using TF-IDF vectorization
3. Training a machine learning classifier
4. Model evaluation and hyperparameter tuning

For more details, see the Jupyter notebook in the `notebooks` directory.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

© 2025 Hassan Raza. All rights reserved.

This project is available for use under the MIT license. You are free to use, modify, and distribute this code in your work, provided that you give appropriate credit to the original author.


Created with ❤️ by Hassan Raza
