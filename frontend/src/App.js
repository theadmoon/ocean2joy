import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import Homepage from './pages/Homepage';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import Policies from './pages/Policies';
import QuickRequest from './pages/QuickRequest';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import ProjectDetails from './pages/ProjectDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminProjectManagement from './pages/AdminProjectManagement';
import AdminDemoVideos from './pages/AdminDemoVideos';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<ServiceDetails />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/policies/:type" element={<Policies />} />
              <Route path="/request" element={<QuickRequest />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <ClientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects/:projectId" 
                element={
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute roles={['manager', 'admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/projects/:projectId" 
                element={
                  <ProtectedRoute roles={['manager', 'admin']}>
                    <AdminProjectManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/demo-videos" 
                element={
                  <ProtectedRoute roles={['manager', 'admin']}>
                    <AdminDemoVideos />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
