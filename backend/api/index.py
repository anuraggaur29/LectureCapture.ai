import sys
import os

# Add parent backend directory to sys.path so 'app' package imports work cleanly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

# Vercel Serverless Function entrypoint
