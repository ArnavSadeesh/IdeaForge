import React, { useState } from 'react';
import './Register.css';
import CreateAccount from './CreateAccount';

const Register = () => {
  const [modalUserType, setModalUserType] = useState(null);

  const openModal = (userType) => {
    setModalUserType(userType);
  };

  const closeModal = () => {
    setModalUserType(null);
  };

  return (
    <>
      <div className={`register-container ${modalUserType ? 'blurred' : ''}`}>
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
      {modalUserType && <CreateAccount userType={modalUserType} onClose={closeModal} />}
    </>
  );
};

export default Register;
