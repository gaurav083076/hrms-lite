from flask import Flask,jsonify

app = Flask(__name__)

@app.route("/")
def root():
    return jsonify({"message": "HRMS Lite API is running"})

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(port=5009)