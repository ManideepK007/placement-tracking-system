import { useEffect, useState } from 'react';
import axios from 'axios';
import { Briefcase, CheckCircle, Clock } from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/applications';

function App() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStudentId, setCurrentStudentId] = useState(1);
  const [formData, setFormData] = useState({
    company_name: '',
    job_role: '',
    status: 'Applied'
  });

  // Fetch data whenever student ID changes
  useEffect(() => {
    setLoading(true);
    axios.get(API_URL)
      .then(res => {
        if (Array.isArray(res.data)) {
          setApps(res.data);
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentStudentId]);

  const deleteApp = async (id) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      try {
        await axios.delete(`http://localhost:5000/api/applications/${id}`);
        setApps(prevApps=>prevApps.filter(app => app.id !== id));
        alert("Row deleted successfully!");
      } catch (err) {
        console.error("Delete failed:", err.response?.data || err.message);
        alert("Could not delete the row. Check console for details.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, student_id: parseInt(currentStudentId) };
      const response = await axios.post('http://localhost:5000/api/applications', payload);
      
      setApps([response.data, ...apps]);
      setFormData({ company_name: '', job_role: '', status: 'Applied' });
      alert("Application added successfully!");
    } catch (err) {
      alert("Failed to add application.");
    }
  };

  if (loading) return <div className="loading-screen"><h1>Connecting to Database...</h1></div>;
  if (error) return <div className="error-screen"><h1>Error: {error}</h1></div>;

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <header>
        <h1>Placement Tracker</h1>
        {/* FIXED: Using == to handle string vs number comparison */}
        <p>Viewing as: <strong>{currentStudentId == 1 ? "Mahesh" : "Other Student"}</strong></p>
      </header>

      <div className="user-switcher">
        <label>Switch User: </label>
        <select value={currentStudentId} onChange={(e) => setCurrentStudentId(e.target.value)}>
          <option value="1">Mahesh (ID: 1)</option> 
          <option value="2">Other User (ID: 2)</option>
        </select>
      </div>

      <div className="stats">
        <div className="card"><Clock /> Total: {apps.length}</div>
        <div className="card green"><CheckCircle /> Active: {apps.filter(a => a.status !== 'Rejected').length}</div>
      </div>

      <form onSubmit={handleSubmit} className="add-form">
        <input 
          type="text" 
          placeholder="Company Name" 
          value={formData.company_name}
          onChange={(e) => setFormData({...formData, company_name: e.target.value})}
          required 
        />
        <input 
          type="text" 
          placeholder="Job Role" 
          value={formData.job_role}
          onChange={(e) => setFormData({...formData, job_role: e.target.value})}
          required 
        />
        <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit">Add Application</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* THE FIX: Removed the extra curly brace before apps.map */}
          {apps.length > 0 ? (
            apps.map((app) => (
              <tr key={app.id}>
                <td className="student-name">{app.full_name}</td>
                <td><strong>{app.company_name}</strong></td>
                <td>{app.job_role}</td>
                <td>
                  <span className={`badge ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                  <button
                    onClick={() => deleteApp(app.id)}
                    style={{
                      marginLeft: '10px', 
                      color: 'red', 
                      cursor: 'pointer', 
                      border: 'none', 
                      background: 'none',
                      fontSize: '0.8rem'
                    }}
                  >
                    Delete
                  </button>
                </td>
                <td>{app.applied_date ? new Date(app.applied_date).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px'}}>
                No applications found in database.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;