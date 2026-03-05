import { useState, useEffect } from 'react';
import { getEmployees, getAttendanceSummary, getAttendance } from '../api/index.js';
import { format } from 'date-fns';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState([]);
  const [todayAtt, setTodayAtt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    Promise.all([
      getEmployees(),
      getAttendanceSummary(),
      getAttendance({ date_filter: today })
    ]).then(([e, s, a]) => {
      setEmployees(e.data);
      setSummary(s.data);
      setTodayAtt(a.data);
    }).catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const presentToday = todayAtt.filter(a => a.status === 'Present').length;
  const absentToday = todayAtt.filter(a => a.status === 'Absent').length;

  if (loading) return <div className="loading-state"><div className="spinner" /></div>;
  if (error) return <div className="error-state">⚠ {error}</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      <div className="page-body">
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-label">Total Employees</div>
            <div className="stat-value">{employees.length}</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Present Today</div>
            <div className="stat-value">{presentToday}</div>
          </div>
          <div className="stat-card red">
            <div className="stat-label">Absent Today</div>
            <div className="stat-value">{absentToday}</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-label">Not Marked</div>
            <div className="stat-value">{employees.length - todayAtt.length}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Attendance Summary</span>
          </div>
          {summary.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <div className="empty-title">No data yet</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Present Days</th>
                    <th>Absent Days</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map(s => (
                    <tr key={s.employee_id}>
                      <td>{s.full_name}</td>
                      <td>{s.department}</td>
                      <td>{s.present_days}</td>
                      <td>{s.absent_days}</td>
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