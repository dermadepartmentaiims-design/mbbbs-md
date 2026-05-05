import { useState } from 'react';
import { createConsultation } from '../api/consultationApi';
import '../styles/PatientConsultation.css';

const COMMON_SYMPTOMS = [
  'Fever',
  'Headache',
  'Dizziness',
  'Cough',
  'Cold',
  'Sore Throat',
  'Body Ache',
  'Fatigue',
  'Nausea',
  'Vomiting',
  'Diarrhea',
  'Constipation',
  'Shortness of Breath',
  'Chest Pain',
  'Abdominal Pain',
  'Back Pain',
  'Joint Pain',
  'Skin Rash',
];

export default function PatientConsultation() {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    email: '',
    chiefComplaint: '',
    symptoms: [],
    otherSymptoms: '',
    duration: '',
    pastHistory: '',
    medications: '',
    reports: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSymptomToggle = (symptom) => {
    setFormData(prev => {
      const symptoms = prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom];
      return { ...prev, symptoms };
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      reports: files.map(f => f.name)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const symptomsText = [
        ...formData.symptoms,
        formData.otherSymptoms
      ].filter(s => s).join(', ');

      const submissionData = {
        ...formData,
        symptoms: symptomsText || undefined,
      };

      await createConsultation(submissionData);
      setMessage('✓ Thank you! Your consultation has been submitted successfully.');
      setFormData({
        patientName: '',
        age: '',
        gender: '',
        email: '',
        chiefComplaint: '',
        symptoms: [],
        otherSymptoms: '',
        duration: '',
        pastHistory: '',
        medications: '',
        reports: [],
      });
    } catch (error) {
      setMessage('✗ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-container">
      <div className="patient-form-wrapper">
        <h1>📋 Patient Consultation</h1>
        <p className="subtitle">Please share your health concerns. All information is confidential.</p>

        {message && <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>{message}</div>}

        <form onSubmit={handleSubmit} className="consultation-form">
          {/* Basic Information */}
          <fieldset>
            <legend>Your Information</legend>

            <div className="form-group">
              <label htmlFor="patientName">
                Your Name <span className="required">*</span>
              </label>
              <input
                id="patientName"
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="e.g., 25"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select (Optional)</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com (optional)"
              />
              <small>Optional - We'll use this to send you updates if needed</small>
            </div>
          </fieldset>

          {/* Chief Complaint */}
          <fieldset>
            <legend>What's Bothering You?</legend>

            <div className="form-group">
              <label htmlFor="chiefComplaint">
                Main Concern <span className="required">*</span>
              </label>
              <input
                id="chiefComplaint"
                type="text"
                name="chiefComplaint"
                value={formData.chiefComplaint}
                onChange={handleInputChange}
                placeholder="e.g., I have a headache, Fever, Back pain"
              />
              <small>Tell us your main health concern</small>
            </div>
          </fieldset>

          {/* Symptoms Selection */}
          <fieldset>
            <legend>What Symptoms Are You Experiencing?</legend>
            <p className="fieldset-hint">Check all that apply (select multiple):</p>

            <div className="symptoms-grid">
              {COMMON_SYMPTOMS.map(symptom => (
                <label key={symptom} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.symptoms.includes(symptom)}
                    onChange={() => handleSymptomToggle(symptom)}
                  />
                  <span>{symptom}</span>
                </label>
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="otherSymptoms">Other Symptoms</label>
              <input
                id="otherSymptoms"
                type="text"
                name="otherSymptoms"
                value={formData.otherSymptoms}
                onChange={handleInputChange}
                placeholder="Any other symptoms not listed above? (optional)"
              />
            </div>
          </fieldset>

          {/* Additional Details */}
          <fieldset>
            <legend>Additional Information</legend>

            <div className="form-group">
              <label htmlFor="duration">How Long Have You Had This?</label>
              <input
                id="duration"
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 2 days, 1 week, 2 months (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pastHistory">Past Medical Conditions</label>
              <textarea
                id="pastHistory"
                name="pastHistory"
                value={formData.pastHistory}
                onChange={handleInputChange}
                placeholder="Any previous illnesses, allergies, or surgeries? (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="medications">Current Medications</label>
              <textarea
                id="medications"
                name="medications"
                value={formData.medications}
                onChange={handleInputChange}
                placeholder="Any medicines you're currently taking? (optional)"
              />
            </div>
          </fieldset>

          {/* File Upload */}
          <fieldset>
            <legend>Medical Reports (Optional)</legend>

            <div className="form-group">
              <label htmlFor="reports">Upload Your Reports</label>
              <input
                id="reports"
                type="file"
                name="reports"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <small>You can upload blood reports, X-rays, scan reports, etc. (PDF, JPG, PNG)</small>
            </div>
          </fieldset>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '⏳ Submitting...' : '✓ Submit Consultation'}
          </button>

          <p className="footer-note">
            Your information is secure and will only be used for medical consultation.
          </p>
        </form>
      </div>
    </div>
  );
}

