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
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link to="/register" style={{ color: 'white' }}>Create a New Account</Link>
      </div>
    </div>
  );
};

export default Login;
