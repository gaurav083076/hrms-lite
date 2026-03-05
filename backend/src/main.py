from flask import Flask, jsonify
from dotenv import load_dotenv
from config.database import get_db

load_dotenv()

app = Flask(__name__)

try:
    conn = get_db()
    print("✅ Database connected successfully!")
    conn.close()
except Exception as e:
    print(f"❌ Database connection failed: {e}")

@app.route("/")
def root():
    return jsonify({"message": "HRMS Lite API is running"})

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(port=5009)