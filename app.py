"""
This file is kept for backward compatibility.
The application has been restructured to use a more professional project layout.
Please use run.py to start the application.
"""

# Import and run the app from the new structure
from app import app as application

if __name__ == '__main__':
    import os
    import sys
    print("Warning: This entry point is deprecated. Use 'python run.py' instead.")
    # Execute the application
    from run import app
    app.run(debug=True)
