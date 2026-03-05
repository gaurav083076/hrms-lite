from flask import Flask, jsonify
from dotenv import load_dotenv
load_dotenv()
from models.employee import create_employee_table
from models.attendance import create_attendance_table

app = Flask(__name__)

try:
    create_employee_table()
    create_attendance_table()
    print("✅ Database initialized successfully!")
except Exception as e:
    print(f"❌ Database init failed: {e}")

@app.route("/")
def root():
    return jsonify({"message": "HRMS Lite API is running"})

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(port=5009)