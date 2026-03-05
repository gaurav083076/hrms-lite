from config.database import get_db

def create_attendance_table():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS attendance (
            id SERIAL PRIMARY KEY,
            employee_id VARCHAR(50) NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
            date DATE NOT NULL,
            status VARCHAR(10) NOT NULL CHECK(status IN ('Present', 'Absent')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(employee_id, date)
        );
    """)
    conn.commit()
    cur.close()
    conn.close()