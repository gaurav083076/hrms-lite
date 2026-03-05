import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAttendance, markAttendance, getEmployees } from '../api/index.js';

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDate) params.date_filter = filterDate;
      const [att, emp] = await Promise.all([
        getAttendance(params),
        getEmployees()
      ]);
      setRecords(att.data);
      setEmployees(emp.data);
    } catch {
      setError('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filterDate]);

  const handleSubmit = async () => {
    if (!form.employee_id) { toast.error('Select an employee'); return; }
    setSubmitting(true);
    try {
      await markAttendance(form);
      toast.success('Attendance marked!');
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = records.filter(r => {
    const matchStatus = !filterStatus || r.status === filterStatus;
    return matchStatus;
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Attendance</h1>
            <p className="page-sub">Track daily attendance</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            + Mark Attendance
          </button>
        </div>
      </div>

      <div className="page-body">
        {error && <div className="error-state">⚠ {error}</div>}

        {showForm && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <span className="card-title">Mark Attendance</span>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee *</label>
                  <select value={form.employee_id} onChange={e => setForm({...form, employee_id: e.target.value})}>
                    <option value="">Select employee...</option>
                    {employees.map(e => (
                      <option key={e.employee_id} value={e.employee_id}>
                        {e.full_name} ({e.employee_id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Mark Attendance'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <span className="card-title">Records</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
              {(filterDate || filterStatus) && (
                <button className="btn btn-ghost btn-sm" onClick={() => { setFilterDate(''); setFilterStatus(''); }}>
                  Clear
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <div className="empty-title">No records found</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={`${r.employee_id}-${r.date}`}>
                      <td>{r.full_name}</td>
                      <td>{r.department}</td>
                      <td>{r.date ? new Date(r.date).toLocaleDateString('en-CA') : '-'}</td>
                      <td>
                        <span className={`badge ${r.status === 'Present' ? 'badge-green' : 'badge-red'}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}