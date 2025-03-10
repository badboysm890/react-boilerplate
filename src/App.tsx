import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import ResumeBuilder from './pages/ResumeBuilder';
import PublicProfile from './pages/PublicProfile';
import SharedResume from './pages/SharedResume';
import AnalysisReport from './pages/AnalysisReport';
import Settings from './pages/Settings';
import Corporates from './pages/Corporates';
import CorporatesLanding from './pages/CorporatesLanding';
import CorporatesResumeResults from './pages/CorporatesResumeResults';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/builder" element={<ResumeBuilder />} />
          <Route path="/analysis-report" element={<AnalysisReport />} />
          <Route path="/corporates" element={<Corporates />} />
          <Route path="/corporates/landing" element={<CorporatesLanding />} />
          <Route path="/corporates/results" element={<CorporatesResumeResults />} />
          
          {/* Shared resume route - make sure this comes before the profile route */}
          <Route path="/r/:token" element={<SharedResume />} />
          
          {/* Public profile route */}
          <Route path="/:slug" element={<PublicProfile />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />

          {/* Catch-all route - redirect to landing page */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;