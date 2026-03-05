from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()
from src.models.employee import create_employee_table
from src.models.attendance import create_attendance_table
from src.routes.employee import employee_bp
from src.routes.attendance import attendance_bp

app = Flask(__name__)
CORS(app)
app.register_blueprint(employee_bp)
app.register_blueprint(attendance_bp)

@app.route("/")
def root():
    return jsonify({"message": "HRMS Lite API is running"})

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    try:
        create_employee_table()
        create_attendance_table()
        print("✅ Database connected successfully!")
        app.run(port=5009)
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("Server not started.")