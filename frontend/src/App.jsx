import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import IdeasPage from './Components/Community/IdeasPage';
import HomePage from './Components/HomePage/HomePage';
import Register from './Components/Register/Register';
import ApprovalRequests from './Components/Community/ApprovalRequests';
import SponsorsPage from './Components/Sponsors/SponsorsPage';
import HelpPage from './Components/HelpPage/HelpPage';
import MyIdeas from './Components/MyIdeas/MyIdeas';
import Banner from './Components/Banner';
import ProtectedRoute from './Components/ProtectedRoute';
import OAuthCallback from './Components/Auth/OAuthCallback';
import HackathonSelection from './Components/Auth/HackathonSelection';

function App() {
  const location = useLocation();
  const showBanner = !['/', '/register', '/select-hackathon'].includes(location.pathname);

  return (
    <>
      {showBanner && <Banner />}
      <Routes>
        <Route path= "/" element = {<HomePage />} />
        <Route path="/ideas/:hackathonName" element={<ProtectedRoute><IdeasPage /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/select-hackathon" element={<ProtectedRoute><HackathonSelection /></ProtectedRoute>} />
        <Route path="/approval-requests" element={<ProtectedRoute><ApprovalRequests /></ProtectedRoute>} />
        <Route path="/sponsors" element={<ProtectedRoute><SponsorsPage /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
        <Route path="/my-ideas" element={<ProtectedRoute requiredUserType="Participant"><MyIdeas /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;