import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateAccount.css';
import SuccessModal from './SuccessModal';

const CreateAccount = ({ userType, onClose, googleProfile = null }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    country: '',
    password: '',
    companyName: '',
    hackathonName: '',
    schoolName: '',
    technicalSkills: '',
  });

  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hackathonInfo, setHackathonInfo] = useState(null);
  const [isGoogleRegistration, setIsGoogleRegistration] = useState(false);

  // Pre-fill form with Google profile data
  useEffect(() => {
    if (googleProfile) {
      setIsGoogleRegistration(true);
      setFormData(prev => ({
        ...prev,
        firstName: googleProfile.firstName || '',
        lastName: googleProfile.lastName || '',
        email: googleProfile.email || '',
        username: googleProfile.email || '', // Default username to email
      }));
    }
  }, [googleProfile]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userType,
      username: formData.username,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      country: formData.country,
    };

    // Only include password for regular registration
    if (!isGoogleRegistration) {
      payload.password = formData.password;
    }

    if (userType === 'Host') {
      payload.hackathonName = formData.hackathonName;
    } else if (userType === 'Sponsor') {
      payload.companyName = formData.companyName;
    } else if (userType === 'Participant') {
      payload.schoolName = formData.schoolName;
      payload.technicalSkills = formData.technicalSkills;
    }

    try {
      let response;
      if (isGoogleRegistration) {
        // Include Google profile data for Google registration
        payload.googleProfile = googleProfile;
        response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/complete-google-registration`, payload);
        
        // Store auth data for immediate login
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', response.data.userType);
        localStorage.setItem('userName', response.data.userName);
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, payload);
      }
      
      if (userType === 'Host') {
        setHackathonInfo({
          name: response.data.hackathonName,
          code: response.data.hackathonCode,
        });
      }
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.msg || 'Registration failed. Please check your inputs.');
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose(); 
  };

  if (showSuccessModal) {
    return (
      <SuccessModal
        message="Account Created Successfully!"
        hackathonInfo={hackathonInfo}
        onClose={handleCloseSuccessModal}
      />
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Create Your {userType} Account</h2>
        {isGoogleRegistration && (
          <p className="google-registration-note">Complete your registration with Google account details</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="register-form-group">
            <label htmlFor="firstName">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName" 
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="lastName">Last Name</label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName" 
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          {!isGoogleRegistration && (
            <div className="register-form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="register-form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              disabled={isGoogleRegistration}
              required
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="country">Country</label>
            <input 
              type="text" 
              id="country" 
              name="country" 
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          {userType === 'Sponsor' && (
            <div className="register-form-group">
              <label htmlFor="companyName">Company Name</label>
              <input type="text" id="companyName" name="companyName" onChange={handleChange} />
            </div>
          )}

          {userType === 'Host' && (
            <div className="register-form-group">
              <label htmlFor="hackathonName">Hackathon Name</label>
              <input type="text" id="hackathonName" name="hackathonName" onChange={handleChange} />
            </div>
          )}

          {userType === 'Participant' && (
            <>
              <div className="register-form-group">
                <label htmlFor="schoolName">School/University Name</label>
                <input type="text" id="schoolName" name="schoolName" onChange={handleChange} />
              </div>
              <div className="register-form-group">
                <label htmlFor="technicalSkills">Technical Skills</label>
                <input type="text" id="technicalSkills" name="technicalSkills" onChange={handleChange} />
              </div>
            </>
          )}

          <button type="submit">Create Account</button>
          {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
