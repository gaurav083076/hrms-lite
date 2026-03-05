from flask import Blueprint, jsonify, request
import psycopg2.extras
from src.config.database import get_db

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/api/attendance', methods=['GET'])
def get_attendance():
    employee_id = request.args.get("employee_id")
    date_filter = request.args.get("date_filter")

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    query = """
        SELECT a.*, e.full_name, e.department
        FROM attendance a
        JOIN employees e ON a.employee_id = e.employee_id
        WHERE 1=1
    """
    params = []
    if employee_id:
        query += " AND a.employee_id = %s"
        params.append(employee_id)
    if date_filter:
        query += " AND a.date = %s"
        params.append(date_filter)
    query += " ORDER BY a.date DESC, e.full_name ASC"
    cur.execute(query, params)
    records = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([dict(r) for r in records])

@attendance_bp.route('/api/attendance', methods=['POST'])
def mark_attendance():
    data = request.get_json()
    employee_id = (data.get("employee_id") or "").strip()
    date = (data.get("date") or "").strip()
    status = (data.get("status") or "").strip()

    if not employee_id:
        return jsonify({"error": "Employee ID is required"}), 400
    if not date:
        return jsonify({"error": "Date is required"}), 400
    if status not in ["Present", "Absent"]:
        return jsonify({"error": "Status must be Present or Absent"}), 400

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cur.execute("SELECT id FROM employees WHERE employee_id = %s", (employee_id,))
        if not cur.fetchone():
            return jsonify({"error": "Employee not found"}), 404

        cur.execute("""
            INSERT INTO attendance (employee_id, date, status)
            VALUES (%s, %s, %s)
            ON CONFLICT (employee_id, date)
            DO UPDATE SET status = EXCLUDED.status
            RETURNING *
        """, (employee_id, date, status))
        record = cur.fetchone()
        conn.commit()
        return jsonify(dict(record)), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@attendance_bp.route('/api/attendance/summary', methods=['GET'])
def get_attendance_summary():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT
            e.employee_id, e.full_name, e.department,
            COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_days,
            COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_days,
            COUNT(a.id) as total_marked
        FROM employees e
        LEFT JOIN attendance a ON e.employee_id = a.employee_id
        GROUP BY e.employee_id, e.full_name, e.department
        ORDER BY e.full_name
    """)
    summary = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([dict(s) for s in summary])