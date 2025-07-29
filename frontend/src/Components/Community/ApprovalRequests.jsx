import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ApprovalRequestCard from './ApprovalRequestCard';
import './ApprovalRequests.css';
import { AuthContext } from '../../Context/AuthContext';

const ApprovalRequests = () => {
  const [approvalRequests, setApprovalRequests] = useState([]);
  const { hackathonId, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchApprovalRequests = async () => {
      if (!hackathonId) return;
      try {
        const response = await axios.get('http://localhost:3000/api/approval-requests', {
          params: { hackathonId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setApprovalRequests(response.data);
      } catch (error) {
        console.error('Error fetching approval requests:', error);
      }
    };

    fetchApprovalRequests();
  }, [hackathonId, token]);

  const handleApprove = async (id) => {
    console.log('Attempting to approve request with ID:', id);
    try {
      await axios.patch(`http://localhost:3000/api/approval-requests/${id}/approve`, {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Approval successful. Filtering requests...');
      setApprovalRequests(prevRequests => prevRequests.filter(request => request._id !== id));
      console.log('Requests after filter:', approvalRequests.filter(request => request._id !== id));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (id) => {
    console.log('Attempting to reject request with ID:', id);
    try {
      await axios.delete(`http://localhost:3000/api/approval-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Rejection successful. Filtering requests...');
      setApprovalRequests(prevRequests => prevRequests.filter(request => request._id !== id));
      console.log('Requests after filter:', approvalRequests.filter(request => request._id !== id));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <>
      <div className="approval-requests-container">
        <h1>Approval Requests</h1>
        <div className="approval-requests-list">
          {approvalRequests.map(request => (
            <ApprovalRequestCard
              key={request._id}
              ideaTitle={request.title}
              ideaDescription={request.description}
              posterUsername={request.authorUsername}
              claimerUsername={request.claimerUsername}
              authorEmail={request.authorEmail}
              claimerEmail={request.claimerEmail}
              implementationPlan={request.implementationPlan}
              onApprove={() => handleApprove(request._id)}
              onReject={() => handleReject(request._id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ApprovalRequests;
