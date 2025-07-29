import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import './MyIdeas.css';

const MyIdeas = () => {
  const [myIdeas, setMyIdeas] = useState([]);
  const [claimedIdea, setClaimedIdea] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const { token, userName } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyIdeas = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ideas/my-ideas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyIdeas(response.data);
      } catch (error) {
        console.error('Error fetching my ideas:', error);
      }
    };

    const fetchClaimedIdea = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/claimed-idea`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClaimedIdea(response.data);
      } catch (error) {
        console.error('Error fetching claimed idea:', error);
      }
    };

    const fetchRecentMessages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentMessages(response.data.recentMessages);
      } catch (error) {
        console.error('Error fetching recent messages:', error);
      }
    };

    if (token) {
      fetchMyIdeas();
      fetchClaimedIdea();
      fetchRecentMessages();
    }
  }, [token, userName]);

  return (
    <div className="my-ideas-page">
      <div className="my-ideas-column">
        <h1 className="column-title">My Ideas</h1>
        <div className="my-ideas-list">
          {myIdeas.length > 0 ? (
            myIdeas.map(idea => (
              <div key={idea._id} className="my-idea-card">
                <h3>{idea.title}</h3>
                <p>{idea.description}</p>
              </div>
            ))
          ) : (
            <p>No ideas posted yet.</p>
          )}
        </div>
      </div>

      <div className="claimed-ideas-column">
        <h1 className="column-title">Claimed Idea</h1>
        <div className="my-ideas-list">
          {claimedIdea ? (
            <div className="my-idea-card">
              <h3>{claimedIdea.title}</h3>
              <p>{claimedIdea.description}</p>
            </div>
          ) : (
            <p>No idea claimed yet.</p>
          )}
        </div>
      </div>

      <div className="recent-messages-column">
        <h1 className="column-title">Recent Messages</h1>
        <div className="messages-list">
          {recentMessages.length > 0 ? (
            recentMessages.map((message, index) => (
              <div key={index} className="message-item">
                <p>{message.text}</p>
                <small>{new Date(message.timestamp).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p>No recent messages.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyIdeas;
