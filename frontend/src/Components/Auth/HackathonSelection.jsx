import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import './HackathonSelection.css';

const HackathonSelection = () => {
  const { token, login, userName, userType } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [hackathonCode, setHackathonCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch available hackathons
    const fetchHackathons = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/hackathons`);
        setHackathons(res.data);
      } catch (err) {
        console.error('Error fetching hackathons:', err);
        setError('Failed to load hackathons');
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  const handleHackathonSelect = (hackathon) => {
    setSelectedHackathon(hackathon);
    setError('');
  };

  const handleJoinHackathon = async (e) => {
    e.preventDefault();
    if (!selectedHackathon) {
      setError('Please select a hackathon');
      return;
    }
    
    if (hackathonCode !== selectedHackathon.code) {
      setError('Invalid hackathon code');
      return;
    }

    try {
      // Add user to hackathon
      await axios.post(`${import.meta.env.VITE_API_URL}/api/hackathons/join`, {
        hackathonId: selectedHackathon._id,
        hackathonCode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update auth context with hackathon info
      login({
        token,
        userType,
        userName,
        hackathonCode,
        hackathonId: selectedHackathon._id,
        hackathonName: selectedHackathon.name
      });

      // Navigate to hackathon community page
      navigate(`/ideas/${encodeURIComponent(selectedHackathon.name)}`);
    } catch (err) {
      console.error('Error joining hackathon:', err);
      setError('Failed to join hackathon. Please check the code and try again.');
    }
  };

  const handleSkip = () => {
    // Navigate to home page without joining a hackathon
    navigate('/');
  };

  if (loading) {
    return (
      <div className="hackathon-selection-container">
        <div className="loading">Loading hackathons...</div>
      </div>
    );
  }

  return (
    <div className="hackathon-selection-page">
      <div className="hackathon-selection-container">
        <h2>Select a Hackathon</h2>
        <p className="subtitle">Choose a hackathon to join and start collaborating!</p>
      
      <div className="hackathons-list">
        {hackathons.length === 0 ? (
          <div className="no-hackathons">
            <p>No hackathons available at the moment.</p>
            <button onClick={handleSkip} className="skip-button">
              Continue to Home
            </button>
          </div>
        ) : (
          <>
            {hackathons.map((hackathon) => (
              <div
                key={hackathon._id}
                className={`hackathon-card ${selectedHackathon?._id === hackathon._id ? 'selected' : ''}`}
                onClick={() => handleHackathonSelect(hackathon)}
              >
                <h3>{hackathon.name}</h3>
                <p className="hackathon-info">
                  Participants: {hackathon.participants?.length || 0}
                </p>
                {hackathon.description && (
                  <p className="hackathon-description">{hackathon.description}</p>
                )}
              </div>
            ))}
            
            {selectedHackathon && (
              <form onSubmit={handleJoinHackathon} className="code-form">
                <div className="form-group">
                  <label htmlFor="hackathon-code">
                    Enter code for "{selectedHackathon.name}"
                  </label>
                  <input
                    type="text"
                    id="hackathon-code"
                    value={hackathonCode}
                    onChange={(e) => setHackathonCode(e.target.value)}
                    placeholder="Hackathon code"
                    required
                  />
                </div>
                <button type="submit">Join Hackathon</button>
                {error && <p className="error-message">{error}</p>}
              </form>
            )}
            
            <div className="skip-section">
              <button onClick={handleSkip} className="skip-button">
                Skip for now
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default HackathonSelection;