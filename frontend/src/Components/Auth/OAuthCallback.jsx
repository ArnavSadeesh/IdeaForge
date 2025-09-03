import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

const OAuthCallback = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const userType = urlParams.get('userType');
    const userName = urlParams.get('userName');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=oauth_failed');
      return;
    }

    if (token && userType && userName) {
      // Store login info globally
      login({ 
        token, 
        userType, 
        userName,
        hackathonCode: '', // Google users need to select a hackathon
        hackathonId: null,
        hackathonName: null
      });

      // Navigate to hackathon selection page for Google OAuth users
      navigate('/select-hackathon');
    } else {
      console.error('Missing OAuth parameters');
      navigate('/login?error=oauth_incomplete');
    }
  }, [location, login, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      Processing login...
    </div>
  );
};

export default OAuthCallback;