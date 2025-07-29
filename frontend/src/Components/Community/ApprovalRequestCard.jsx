import React from 'react';
import './ApprovalRequestCard.css';

const ApprovalRequestCard = ({ ideaTitle, ideaDescription, posterUsername, claimerUsername, authorEmail, claimerEmail, implementationPlan, onApprove, onReject }) => {
  return (
    <div className="approval-request-card">
      <h3 className="idea-title">{ideaTitle}</h3>
      <p className="idea-description">{ideaDescription}</p>
      <div className="request-details">
        <div className="user-details">
          <span className="username">{posterUsername}</span>
          <span className="email">{authorEmail}</span>
        </div>
        <span className="arrow"> &#8594; </span>
        <div className="user-details">
          <span className="username">{claimerUsername}</span>
          <span className="email">{claimerEmail}</span>
        </div>
      </div>
      <p className="implementation-plan-text"><span className="implementation-plan-title">Implementation Plan:</span> {implementationPlan}</p>
      <div className="approval-actions">
        <button className="approve-button" onClick={onApprove}>Approve</button>
        <button className="reject-button" onClick={onReject}>Reject</button>
      </div>
    </div>
  );
};

export default ApprovalRequestCard;