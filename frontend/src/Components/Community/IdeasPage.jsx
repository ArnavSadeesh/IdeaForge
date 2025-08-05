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
  const [themes, setThemes] = useState([]);
  const [themeVersion, setThemeVersion] = useState(0);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [claimError, setClaimError] = useState(null);
  const { hackathonId, token } = useContext(AuthContext);
  

  useEffect(() => {
    const fetchIdeas = async () => {
      if (!hackathonId) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ideas`, {
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

  useEffect(() => {
    const fetchThemes = async () => {
      if (!hackathonId) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/hackathons/${hackathonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setThemes(response.data.themes || []);
      } catch (error) {
        console.error('Error fetching themes:', error);
      }
    };

    fetchThemes();
  }, [hackathonId, token, themeVersion]);

  const [selectedIdea, setSelectedIdea] = useState(null);

  const handleOpenClaimModal = (idea) => {
    setSelectedIdea(idea);
    setShowClaimModal(true);
  };

  const handleClaimIdea = async (implementationPlan) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/approval-requests`, 
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ideas`, 
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
    try {
      const themesArray = newThemesInput.split(',').map(theme => theme.trim()).filter(theme => theme.length > 0);
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/hackathons/${hackathonId}/themes`, 
        { themes: themesArray },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setThemeVersion(v => v + 1);
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
            <ThemeFilter themes={themes} setShowThemeModal={setShowThemeModal} selectedThemes={selectedThemes} setSelectedThemes={setSelectedThemes} />
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