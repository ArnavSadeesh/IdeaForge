import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Register.css';
import CreateAccount from './CreateAccount';

const Register = () => {
  const [modalUserType, setModalUserType] = useState(null);
  const [googleProfile, setGoogleProfile] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is a Google registration redirect
    const googleProfileParam = searchParams.get('google_profile');
    if (googleProfileParam) {
      try {
        const decodedProfile = JSON.parse(decodeURIComponent(googleProfileParam));
        setGoogleProfile(decodedProfile);
      } catch (error) {
        console.error('Error parsing Google profile:', error);
        navigate('/register'); // Redirect to normal registration if there's an error
      }
    }
  }, [searchParams, navigate]);

  const openModal = (userType) => {
    setModalUserType(userType);
  };

  const closeModal = () => {
    setModalUserType(null);
    // If this was a Google registration, redirect to login after closing
    if (googleProfile) {
      navigate('/');
    }
  };

  return (
    <>
      <div className={`register-container ${modalUserType ? 'blurred' : ''}`}>
        {googleProfile && (
          <div className="google-registration-header">
            <h2>Complete Your Registration</h2>
            <p>Welcome {googleProfile.firstName}! Please select your account type to continue.</p>
          </div>
        )}
        <div className="register-column">
          <img src="/sponsor.png" alt="Sponsor" />
          <button onClick={() => openModal('Sponsor')}>Register as a Sponsor</button>
        </div>
        <div className="register-column">
          <img src="/participant.png" alt="Participant" />
          <button onClick={() => openModal('Participant')}>Register as a Participant</button>
        </div>
        <div className="register-column">
          <img src="/host.png" alt="Host" />
          <button onClick={() => openModal('Host')}>Register as a Host</button>
        </div>
      </div>
      {modalUserType && (
        <CreateAccount 
          userType={modalUserType} 
          onClose={closeModal} 
          googleProfile={googleProfile}
        />
      )}
    </>
  );
};

export default Register;
