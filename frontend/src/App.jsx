import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import ViewPatient from './pages/ViewPatient';
import AIAutomation from './pages/AIAutomation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/add" element={<AddPatient />} />
          <Route path="patients/:id" element={<ViewPatient />} />
          <Route path="patients/:id/edit" element={<EditPatient />} />
          <Route path="ai-automation" element={<AIAutomation />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
