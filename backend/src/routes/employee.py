from flask import Blueprint, jsonify, request
import psycopg2.extras
import re
from config.database import get_db

employee_bp = Blueprint('employees', __name__)

def is_valid_email(email):
    return re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email)

@employee_bp.route('/api/employees', methods=['GET'])
def get_employees():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM employees ORDER BY created_at DESC")
    employees = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([dict(e) for e in employees])

@employee_bp.route('/api/employees', methods=['POST'])
def create_employee():
    data = request.get_json()
    employee_id = (data.get("employee_id") or "").strip()
    full_name = (data.get("full_name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    department = (data.get("department") or "").strip()

    if not employee_id:
        return jsonify({"error": "Employee ID is required"}), 400
    if not full_name:
        return jsonify({"error": "Full Name is required"}), 400
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400
    if not department:
        return jsonify({"error": "Department is required"}), 400

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cur.execute("SELECT id FROM employees WHERE employee_id = %s", (employee_id,))
        if cur.fetchone():
            return jsonify({"error": f"Employee ID '{employee_id}' already exists"}), 409

        cur.execute("SELECT id FROM employees WHERE email = %s", (email,))
        if cur.fetchone():
            return jsonify({"error": f"Email '{email}' already registered"}), 409

        cur.execute(
            "INSERT INTO employees (employee_id, full_name, email, department) VALUES (%s, %s, %s, %s) RETURNING *",
            (employee_id, full_name, email, department)
        )
        employee = cur.fetchone()
        conn.commit()
        return jsonify(dict(employee)), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@employee_bp.route('/api/employees/<employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM employees WHERE employee_id = %s", (employee_id,))
        if not cur.fetchone():
            return jsonify({"error": "Employee not found"}), 404
        cur.execute("DELETE FROM employees WHERE employee_id = %s", (employee_id,))
        conn.commit()
        return jsonify({"message": f"Employee {employee_id} deleted successfully"})
    finally:
        cur.close()
        conn.close()