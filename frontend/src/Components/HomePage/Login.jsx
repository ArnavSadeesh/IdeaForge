import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    try {
      const res = await axios.post('http://localhost:3000/auth/login', {
        username,
        password,
        hackathonCode
      });

      const { token, userType, hackathonName, hackathonId } = res.data;

      // Store login info globally
      login({ token, userType, hackathonCode, userName: username, hackathonId, hackathonName});

      // Navigate to hackathon-specific page
      navigate(`/ideas/${encodeURIComponent(hackathonName)}`);
    } catch {
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
        <a href="/register" style={{ color: 'white' }}>Create a New Account</a>
      </div>
    </div>
  );
};

export default Login;
