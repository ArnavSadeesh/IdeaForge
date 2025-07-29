import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

import ThemeFilter from './ThemeFilter';
import KeywordFilter from './KeywordFilter';
import IdeasList from './IdeasList';
import PostIdea from './PostIdea';
import PostIdeaModal from './PostIdeaModal';
import ClaimApprovalRequest from './ClaimApprovalRequest';
import './IdeasPage.css';

const IdeasPage = () => {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [newThemesInput, setNewThemesInput] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [claimError, setClaimError] = useState(null);
  const { hackathonId, token } = useContext(AuthContext);
  

  useEffect(() => {
    const fetchIdeas = async () => {
      if (!hackathonId) return;
      try {
        const response = await axios.get('http://localhost:3000/api/ideas', {
          params: { 
            hackathonId,
            themes: selectedThemes.join(','),
            keywords: selectedKeywords.join(','),
          },
        });
        setIdeas(response.data);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      }
    };

    fetchIdeas();
  }, [hackathonId, selectedThemes, selectedKeywords]);

  const [selectedIdea, setSelectedIdea] = useState(null);

  const handleOpenClaimModal = (idea) => {
    setSelectedIdea(idea);
    setShowClaimModal(true);
  };

  const handleClaimIdea = async (implementationPlan) => {
    try {
      await axios.post('http://localhost:3000/api/approval-requests', 
        { ...selectedIdea, implementationPlan, hackathonId, ideaId: selectedIdea._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      handleCloseClaimModal();
    } catch (error) {
      console.error('Error claiming idea:', error);
      setClaimError(error.response.data.msg || 'An unexpected error occurred.');
    }
  };

  const handleCloseClaimModal = () => {
    setShowClaimModal(false);
  };

  const handleOpenPostModal = () => {
    setShowPostModal(true);
  };

  const handleClosePostModal = () => {
    setShowPostModal(false);
  };

  const handlePostIdea = async (newIdea) => {
    try {
      const response = await axios.post('http://localhost:3000/api/ideas', 
        { ...newIdea, hackathonId: hackathonId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIdeas([response.data, ...ideas]);
    } catch (error) {
      console.error('Error posting idea:', error);
    }
  };

  const handleSaveThemes = async () => {
    console.log('Attempting to save themes...');
    try {
      const themesArray = newThemesInput.split(',').map(theme => theme.trim()).filter(theme => theme.length > 0);
      console.log('Themes to send:', themesArray);
      await axios.patch(`http://localhost:3000/api/hackathons/${hackathonId}/themes`, 
        { themes: themesArray },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Themes saved successfully. Closing modal.');
      setShowThemeModal(false);
      setNewThemesInput('');
    } catch (error) {
      console.error('Error saving themes:', error);
    }
  };

  return (
    <>
      <div className="ideas-page ideas-page-background">
        <div className="ideas-content-wrapper">
          <div className="ideas-filters">
            <ThemeFilter hackathonId={hackathonId} setShowThemeModal={setShowThemeModal} selectedThemes={selectedThemes} setSelectedThemes={setSelectedThemes} />
          <KeywordFilter hackathonId={hackathonId} selectedKeywords={selectedKeywords} setSelectedKeywords={setSelectedKeywords} />
          </div>
          <div className="main-ideas-content">
            <IdeasList ideas={ideas} onClaimIdea={handleOpenClaimModal} />
          </div>
          <PostIdea onPostClick={handleOpenPostModal} />
        </div>
        {showClaimModal && <ClaimApprovalRequest onClose={handleCloseClaimModal} onClaim={handleClaimIdea} claimError={claimError} setClaimError={setClaimError} />}
        {showPostModal && <PostIdeaModal onClose={handleClosePostModal} onPostIdea={handlePostIdea} />}
      </div>
      {showThemeModal && (
        <div className="theme-modal-overlay">
          <div className="theme-modal">
            <h2>Manage Hackathon Themes</h2>
            <p>Enter themes separated by commas (e.g., Technology, Healthcare, Education)</p>
            <textarea
              className="theme-textarea"
              rows="5"
              value={newThemesInput}
              onChange={(e) => setNewThemesInput(e.target.value)}
              placeholder="Enter themes here..."
            ></textarea>
            <div className="modal-actions">
              <button onClick={handleSaveThemes}>Save Themes</button>
              <button onClick={() => setShowThemeModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 

export default IdeasPage;