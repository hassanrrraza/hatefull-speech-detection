import os

class Config:
    # Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    
    # Model paths
    MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')
    MODEL_PATH = os.path.join(MODELS_DIR, 'model.pkl')
    VECTORIZER_PATH = os.path.join(MODELS_DIR, 'vectorizer.pkl')
    
    # Application settings
    DEBUG = False
    TESTING = False
    
class DevelopmentConfig(Config):
    DEBUG = True
    
class TestingConfig(Config):
    TESTING = True
    
class ProductionConfig(Config):
    pass

# Set the active configuration
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def get_config(config_name='default'):
    return config.get(config_name, Config) 