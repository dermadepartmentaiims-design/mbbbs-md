import { useState, useEffect } from 'react';
import {
  getConsultations,
  createConsultation,
  updateConsultation,
  deleteConsultation,
} from '../api/consultationApi';
import '../styles/AdminPanel.css';

export default function AdminPanel() {
  const [consultations, setConsultations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    email: '',
    chiefComplaint: '',
    symptoms: '',
    duration: '',
    pastHistory: '',
    medications: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const data = await getConsultations();
      setConsultations(data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData({
      patientName: '',
      age: '',
      gender: '',
      email: '',
      chiefComplaint: '',
      symptoms: '',
      duration: '',
      pastHistory: '',
      medications: '',
    });
    setShowForm(true);
  };

  const handleEdit = (consultation) => {
    setEditingId(consultation._id);
    setFormData({
      patientName: consultation.patientName,
      age: consultation.age,
      gender: consultation.gender,
      email: consultation.email,
      chiefComplaint: consultation.chiefComplaint,
      symptoms: consultation.symptoms,
      duration: consultation.duration,
      pastHistory: consultation.pastHistory,
      medications: consultation.medications,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (editingId) {
        await updateConsultation(editingId, formData);
        setMessage('✓ Consultation updated successfully!');
        fetchConsultations();
        setShowForm(false);
      } else {
        await createConsultation(formData);
        setMessage('✓ Consultation created successfully!');
        fetchConsultations();
        setShowForm(false);
      }
    } catch (error) {
      setMessage('✗ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this consultation?')) {
      try {
        await deleteConsultation(id);
        setMessage('✓ Consultation deleted successfully!');
        fetchConsultations();
      } catch (error) {
        setMessage('✗ Error: ' + error.message);
      }
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      {message && <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>{message}</div>}

      <button className="create-btn" onClick={handleCreateNew}>
        + Create New Consultation
      </button>

      {showForm && (
        <div className="form-modal">
          <div className="modal-content">
            <h2>{editingId ? 'Edit Consultation' : 'Create New Consultation'}</h2>
            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="patientName">Patient Name *</label>
                  <input
                    id="patientName"
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    id="age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="chiefComplaint">Chief Complaint *</label>
                <input
                  id="chiefComplaint"
                  type="text"
                  name="chiefComplaint"
                  value={formData.chiefComplaint}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="symptoms">Symptoms</label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration</label>
                <input
                  id="duration"
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="pastHistory">Past History</label>
                <textarea
                  id="pastHistory"
                  name="pastHistory"
                  value={formData.pastHistory}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="medications">Medications</label>
                <textarea
                  id="medications"
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="consultations-table">
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Email</th>
              <th>Chief Complaint</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {consultations.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">No consultations found</td>
              </tr>
            ) : (
              consultations.map(consultation => (
                <tr key={consultation._id}>
                  <td>{consultation.patientName}</td>
                  <td>{consultation.email}</td>
                  <td>{consultation.chiefComplaint}</td>
                  <td><span className={`status-badge ${consultation.status}`}>{consultation.status}</span></td>
                  <td>{new Date(consultation.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(consultation)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(consultation._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
