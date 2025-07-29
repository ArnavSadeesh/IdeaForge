import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './SuccessModal.css';


const SuccessModal = ({ message, hackathonInfo }) => {
  const navigate = useNavigate(); 

  const backToHome = () => { 
    navigate('/'); 
  }; 

  return (
    <div className="success-modal-overlay" onClick={backToHome}>
      <div className="success-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{message}</h2>
        {hackathonInfo && (
          <div className="hackathon-info">
            <p>Your secure hackathon code for {hackathonInfo.name}:</p>
            <p className="hackathon-code">{hackathonInfo.code}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;
