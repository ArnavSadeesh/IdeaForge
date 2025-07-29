import React, { useState } from 'react';
import './ClaimApprovalRequest.css';

const ClaimApprovalRequest = ({ onClose, onClaim, claimError, setClaimError }) => {
  const [implementationPlan, setImplementationPlan] = useState('');

  const handleSubmit = async () => {
    setClaimError(null); // Clear previous errors on new submission attempt
    await onClaim(implementationPlan);
  };

  return (
    <div className="claim-approval-overlay">
      <div className="claim-approval-modal">
        <h2>How do you plan to implement this idea?</h2>
        <textarea
          className="implementation-textarea"
          placeholder="Describe your implementation plan, including anticipated languages, frameworks, and tools..."
          rows="8"
          value={implementationPlan}
          onChange={(e) => setImplementationPlan(e.target.value)}
        ></textarea>
        <div className="modal-actions">
          <button className="send-request-button" onClick={handleSubmit}>Send Request</button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
        {claimError && <p className="claim-error-message">{claimError}</p>}
      </div>
    </div>
  );
};

export default ClaimApprovalRequest;