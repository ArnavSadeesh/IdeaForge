import React, { useState } from 'react';
import axios from 'axios';
import './CreateAccount.css';
import SuccessModal from './SuccessModal';

const CreateAccount = ({ userType, onClose }) => {
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userType,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      country: formData.country,
    };

    if (userType === 'Host') {
      payload.hackathonName = formData.hackathonName;
    } else if (userType === 'Sponsor') {
      payload.companyName = formData.companyName;
    } else if (userType === 'Participant') {
      payload.schoolName = formData.schoolName;
      payload.technicalSkills = formData.technicalSkills;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, payload);
      if (userType === 'Host') {
        setHackathonInfo({
          name: response.data.hackathonName,
          code: response.data.hackathonCode,
        });
      }
      setShowSuccessModal(true);
    } catch {
      setError('Registration failed. Please check your inputs.');
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
        <form onSubmit={handleSubmit}>
          <div className="register-form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" onChange={handleChange} />
          </div>
          <div className="register-form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" onChange={handleChange} />
          </div>
          <div className="register-form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" onChange={handleChange} />
          </div>
          <div className="register-form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={handleChange} />
          </div>
          <div className="register-form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" onChange={handleChange} />
          </div>
          <div className="register-form-group">
            <label htmlFor="country">Country</label>
            <input type="text" id="country" name="country" onChange={handleChange} />
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
