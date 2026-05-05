import { useState, useEffect } from 'react';
import { getConsultations, respondConsultation } from '../api/consultationApi';
import '../styles/DoctorPanel.css';

export default function DoctorPanel() {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [response, setResponse] = useState({
    doctorComments: '',
    prescription: '',
    recommendedTests: ''
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

  const handleSelectConsultation = (consultation) => {
    setSelectedConsultation(consultation);
    setResponse({
      doctorComments: '',
      prescription: '',
      recommendedTests: ''
    });
  };

  const handleResponseChange = (e) => {
    const { name, value } = e.target;
    setResponse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await respondConsultation(selectedConsultation._id, response);
      setMessage('✓ Response submitted successfully!');
      fetchConsultations();
      setSelectedConsultation(null);
    } catch (error) {
      setMessage('✗ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-container">
      <h1>Doctor Panel</h1>

      <div className="doctor-layout">
        <div className="consultations-list">
          <h2>Patient Consultations</h2>
          <div className="list-items">
            {consultations.length === 0 ? (
              <p className="empty">No consultations yet</p>
            ) : (
              consultations.map(consultation => (
                <div
                  key={consultation._id}
                  className={`consultation-card ${selectedConsultation?._id === consultation._id ? 'active' : ''} ${consultation.status}`}
                  onClick={() => handleSelectConsultation(consultation)}
                >
                  <div className="card-header">
                    <h3>{consultation.patientName}</h3>
                    <span className={`status-badge ${consultation.status}`}>
                      {consultation.status}
                    </span>
                  </div>
                  <p className="complaint">{consultation.chiefComplaint}</p>
                  <small>{new Date(consultation.createdAt).toLocaleDateString()}</small>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="consultation-details">
          {selectedConsultation ? (
            <div>
              <h2>Patient Details</h2>

              {message && <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>{message}</div>}

              <div className="details-info">
                <div className="info-group">
                  <label>Patient Name:</label>
                  <p>{selectedConsultation.patientName}</p>
                </div>

                <div className="info-group">
                  <label>Age / Gender:</label>
                  <p>{selectedConsultation.age} / {selectedConsultation.gender}</p>
                </div>

                <div className="info-group">
                  <label>Email:</label>
                  <p>{selectedConsultation.email}</p>
                </div>

                <div className="info-group">
                  <label>Chief Complaint:</label>
                  <p>{selectedConsultation.chiefComplaint}</p>
                </div>

                <div className="info-group">
                  <label>Symptoms:</label>
                  <p>{selectedConsultation.symptoms || 'N/A'}</p>
                </div>

                <div className="info-group">
                  <label>Duration:</label>
                  <p>{selectedConsultation.duration || 'N/A'}</p>
                </div>

                <div className="info-group">
                  <label>Past History:</label>
                  <p>{selectedConsultation.pastHistory || 'N/A'}</p>
                </div>

                <div className="info-group">
                  <label>Current Medications:</label>
                  <p>{selectedConsultation.medications || 'N/A'}</p>
                </div>
              </div>

              {selectedConsultation.status === 'pending' && (
                <form onSubmit={handleSubmitResponse} className="response-form">
                  <h3>Provide Doctor Response</h3>

                  <div className="form-group">
                    <label htmlFor="doctorComments">Doctor Comments</label>
                    <textarea
                      id="doctorComments"
                      name="doctorComments"
                      value={response.doctorComments}
                      onChange={handleResponseChange}
                      required
                      placeholder="Enter your clinical assessment and findings"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="recommendedTests">Recommended Tests</label>
                    <textarea
                      id="recommendedTests"
                      name="recommendedTests"
                      value={response.recommendedTests}
                      onChange={handleResponseChange}
                      placeholder="Suggest any further investigations"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prescription">Prescription</label>
                    <textarea
                      id="prescription"
                      name="prescription"
                      value={response.prescription}
                      onChange={handleResponseChange}
                      required
                      placeholder="Enter medications and dosage instructions"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Submitting...' : 'Submit Response'}
                  </button>
                </form>
              )}

              {selectedConsultation.status === 'completed' && (
                <div className="completed-info">
                  <h3>Response Status: Completed</h3>
                  <div className="info-group">
                    <label>Doctor Comments:</label>
                    <p>{selectedConsultation.doctorComments}</p>
                  </div>
                  <div className="info-group">
                    <label>Prescription:</label>
                    <p>{selectedConsultation.prescription}</p>
                  </div>
                  <div className="info-group">
                    <label>Recommended Tests:</label>
                    <p>{selectedConsultation.recommendedTests}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <p>Select a consultation to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
