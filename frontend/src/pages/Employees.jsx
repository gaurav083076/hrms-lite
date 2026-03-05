import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getEmployees, createEmployee, deleteEmployee } from '../api/index.js';

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
  'HR', 'Finance', 'Operations', 'Customer Support', 'Legal'
];

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    employee_id: '', full_name: '', email: '', department: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getEmployees();
      setEmployees(data);
    } catch {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const validate = () => {
    const errs = {};
    if (!form.employee_id.trim()) errs.employee_id = 'Required';
    if (!form.full_name.trim()) errs.full_name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.department) errs.department = 'Required';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await createEmployee(form);
      toast.success('Employee added successfully!');
      setShowForm(false);
      setForm({ employee_id: '', full_name: '', email: '', department: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (emp) => {
    try {
      await deleteEmployee(emp.employee_id);
      toast.success(`${emp.full_name} deleted`);
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Failed to delete employee');
    }
  };

  const filtered = employees.filter(e =>
    e.full_name.toLowerCase().includes(search.toLowerCase()) ||
    e.employee_id.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Employees</h1>
            <p className="page-sub">{employees.length} total employees</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            + Add Employee
          </button>
        </div>
      </div>

      <div className="page-body">
        {error && <div className="error-state">⚠ {error}</div>}

        {showForm && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <span className="card-title">New Employee</span>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee ID *</label>
                  <input value={form.employee_id} onChange={e => setForm({...form, employee_id: e.target.value})} placeholder="EMP001" className={formErrors.employee_id ? 'error' : ''} />
                  {formErrors.employee_id && <span className="field-error">{formErrors.employee_id}</span>}
                </div>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="John Doe" className={formErrors.full_name ? 'error' : ''} />
                  {formErrors.full_name && <span className="field-error">{formErrors.full_name}</span>}
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@company.com" className={formErrors.email ? 'error' : ''} />
                  {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className={formErrors.department ? 'error' : ''}>
                    <option value="">Select...</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {formErrors.department && <span className="field-error">{formErrors.department}</span>}
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Employee'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <span className="card-title">All Employees</span>
            <input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 200 }}
            />
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <div className="empty-title">No employees found</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(emp => (
                    <tr key={emp.employee_id}>
                      <td>{emp.employee_id}</td>
                      <td>{emp.full_name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.department}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(emp)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Delete Employee</span>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{deleteTarget.full_name}</strong>? This will also delete all their attendance records.</p>
              <div className="form-actions">
                <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteTarget)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}