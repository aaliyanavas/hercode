import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import PatientDashboard from './pages/PatientDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/caregiver" element={<CaregiverDashboard />} />
    </Routes>
  );
}
