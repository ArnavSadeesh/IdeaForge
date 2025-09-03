import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext'; 
import axios from 'axios';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext); // get login function
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hackathonCode, setHackathonCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    console.log('Attempting to log in with:', { username, hackathonCode }); // Added logging
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        username,
        password,
        hackathonCode
      });

      const { token, userType, hackathonName, hackathonId } = res.data;
      console.log('Login successful, received:', { token, userType, hackathonName, hackathonId }); // Added logging

      // Store login info globally
      login({ token, userType, hackathonCode, userName: username, hackathonId, hackathonName});

      // Navigate to hackathon-specific page
      navigate(`/ideas/${encodeURIComponent(hackathonName)}`);
    } catch (err) {
      console.error('Login API call failed:', err.response ? err.response.data : err.message); // Added logging
      setError('Invalid credentials!');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="login-container">
      <h2>Sign in to your account</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="hackathon-code">Hackathon Code</label>
          <input 
            type="text" 
            id="hackathon-code" 
            name="hackathon-code" 
            value={hackathonCode} 
            onChange={(e) => setHackathonCode(e.target.value)} 
          />
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: 'white', marginTop: '0.8rem' }}>{error}</p>}
      </form>
      
      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          margin: '1rem 0',
          color: 'white' 
        }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
          <span style={{ padding: '0 1rem' }}>or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
        </div>
        
        <button 
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '1rem'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Link to="/register" style={{ color: 'white' }}>Create a New Account</Link>
      </div>
    </div>
  );
};

export default Login;
