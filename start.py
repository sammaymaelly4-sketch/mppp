import subprocess
import sys
import os

def start():
    print("🚀 Starting Civic Auditor Lite System...")
    
    # Install dependencies
    print("📦 Checking dependencies...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    # Start Backend
    print("⚙️  Starting FastAPI Backend on http://localhost:8000")
    print("🖥️  Open 'frontend/index.html' in your browser to view the app.")
    
    # Run the server
    # Note: Using uvicorn directly. In a real environment we might want to run this in a thread 
    # and maybe open the browser automatically, but uvicorn.run is blocking.
    try:
        subprocess.run([sys.executable, "-m", "uvicorn", "api.index:app", "--reload", "--port", "8000"])
    except KeyboardInterrupt:
        print("\n👋 System stopped.")

if __name__ == "__main__":
    start()
