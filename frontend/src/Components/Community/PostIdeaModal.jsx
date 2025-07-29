import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import './PostIdeaModal.css';

const PostIdeaModal = ({ onClose, onPostIdea }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [availableThemes, setAvailableThemes] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState('');

  const { hackathonId, token } = useContext(AuthContext);

  useEffect(() => {
    console.log('PostIdeaModal: Current hackathonId from AuthContext:', hackathonId);
    const fetchThemes = async () => {
      if (!hackathonId) {
        console.log('PostIdeaModal: No hackathonId, skipping theme fetch.');
        return;
      }
      console.log('PostIdeaModal: Attempting to fetch themes for hackathonId:', hackathonId);
      try {
        const response = await axios.get(`http://localhost:3000/api/hackathons/${hackathonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableThemes(response.data.themes || []);
        console.log('PostIdeaModal: Successfully fetched themes:', response.data.themes);
      } catch (error) {
        console.error('PostIdeaModal: Error fetching themes:', error);
      }
    };

    fetchThemes();
  }, [hackathonId, token]);

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && currentKeyword.trim() !== '') {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  const handleThemeChange = (event) => {
    const theme = event.target.value;
    if (event.target.checked) {
      setSelectedThemes([...selectedThemes, theme]);
    } else {
      setSelectedThemes(selectedThemes.filter((t) => t !== theme));
    }
  };

  const handleSubmit = () => {
    if (title && description && selectedThemes.length > 0) {
      onPostIdea({ title, description, theme: selectedThemes, keywords });
      onClose();
    } else {
      alert('Please fill out title, description, and select at least one theme.');
    }
  };

  return (
    <div className="post-idea-modal-overlay">
      <div className="post-idea-modal">
        <h2>Post a New Idea</h2>
        <input
          type="text"
          className="idea-title-input"
          placeholder="Idea Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="idea-description-textarea"
          placeholder="Describe your idea..."
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <div className="modal-content-columns">
          <div className="theme-selection-column">
            <label>Select Themes:</label>
            <div className="theme-checkboxes-modal">
              {availableThemes.length > 0 ? (
                availableThemes.map((theme) => (
                  <div key={theme} className="theme-checkbox-item-modal">
                    <input
                      type="checkbox"
                      id={`post-theme-${theme}`}
                      value={theme}
                      checked={selectedThemes.includes(theme)}
                      onChange={handleThemeChange}
                    />
                    <label htmlFor={`post-theme-${theme}`}>{theme}</label>
                  </div>
                ))
              ) : (
                <p>No themes available for this hackathon.</p>
              )}
            </div>
          </div>

          <div className="keywords-column">
            <label htmlFor="keyword-input">Keywords:</label>
            <input
              id="keyword-input"
              type="text"
              className="keyword-input"
              placeholder="Add keywords (press Enter)"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyDown={handleAddKeyword}
            />
            <div className="keyword-tags">
              {keywords.map((keyword, index) => (
                <span key={index} className="keyword-tag">
                  {keyword}
                  <button onClick={() => handleRemoveKeyword(keyword)}>x</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="post-button" onClick={handleSubmit}>Post Idea</button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PostIdeaModal; 