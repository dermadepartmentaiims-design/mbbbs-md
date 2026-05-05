import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navigation from './components/Navigation'
import PatientConsultation from './pages/PatientConsultation'
import DoctorPanel from './pages/DoctorPanel'
import AdminPanel from './pages/AdminPanel'
import './styles/theme.css'
import './App.css'

const STAFF_KEYS = {
  doctor: import.meta.env.VITE_DOCTOR_ACCESS_KEY || 'doctor123',
  admin: import.meta.env.VITE_ADMIN_ACCESS_KEY || 'admin123',
}

function App() {
  const [currentPage, setCurrentPage] = useState('patient')
  const [accessOpen, setAccessOpen] = useState(false)
  const [accessRole, setAccessRole] = useState('doctor')
  const [accessKey, setAccessKey] = useState('')
  const [accessError, setAccessError] = useState('')

  const openStaffAccess = () => {
    setAccessOpen(true)
    setAccessRole('doctor')
    setAccessKey('')
    setAccessError('')
  }

  const closeStaffAccess = () => {
    setAccessOpen(false)
    setAccessKey('')
    setAccessError('')
  }

  const handleStaffAccess = (event) => {
    event.preventDefault()

    if (accessKey.trim() !== STAFF_KEYS[accessRole]) {
      setAccessError('Invalid access key')
      return
    }

    setCurrentPage(accessRole)
    closeStaffAccess()
  }

  return (
    <ThemeProvider>
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onStaffAccess={openStaffAccess}
      />
      
      <main className="app-main">
        {currentPage === 'patient' && <PatientConsultation />}
        {currentPage === 'doctor' && <DoctorPanel />}
        {currentPage === 'admin' && <AdminPanel />}
      </main>

      {accessOpen && (
        <div className="access-overlay" role="dialog" aria-modal="true" aria-labelledby="access-title">
          <form className="access-dialog" onSubmit={handleStaffAccess}>
            <div className="access-header">
              <h2 id="access-title">Staff Access</h2>
              <button type="button" className="access-close" onClick={closeStaffAccess} aria-label="Close">
                x
              </button>
            </div>

            <label htmlFor="accessRole">Panel</label>
            <select
              id="accessRole"
              value={accessRole}
              onChange={(event) => {
                setAccessRole(event.target.value)
                setAccessError('')
              }}
            >
              <option value="doctor">Doctor Panel</option>
              <option value="admin">Admin Panel</option>
            </select>

            <label htmlFor="accessKey">Access Key</label>
            <input
              id="accessKey"
              type="password"
              value={accessKey}
              onChange={(event) => {
                setAccessKey(event.target.value)
                setAccessError('')
              }}
              autoFocus
              placeholder="Enter staff key"
            />

            {accessError && <p className="access-error">{accessError}</p>}

            <button type="submit" className="access-submit">
              Unlock Panel
            </button>
          </form>
        </div>
      )}
    </ThemeProvider>
  )
}

export default App
