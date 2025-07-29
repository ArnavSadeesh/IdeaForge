import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import './ThemeFilter.css';

const ThemeFilter = ({ setShowThemeModal, selectedThemes, setSelectedThemes }) => {
  const [themes, setThemes] = useState([]);
  const { userType, hackathonId, token } = useContext(AuthContext);

  useEffect(() => {
    console.log('ThemeFilter: Current hackathonId from AuthContext:', hackathonId);
    const fetchThemes = async () => {
      if (!hackathonId) {
        console.log('ThemeFilter: No hackathonId, skipping fetch.');
        return;
      }
      console.log('ThemeFilter: Attempting to fetch themes for hackathonId:', hackathonId);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/hackathons/${hackathonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setThemes(response.data.themes || []);
        console.log('ThemeFilter: Successfully fetched themes:', response.data.themes);
      } catch (error) {
        console.error('ThemeFilter: Error fetching themes:', error);
      }
    };

    fetchThemes();
  }, [hackathonId, token]);

  const handleThemeChange = (event) => {
    const theme = event.target.value;
    if (event.target.checked) {
      setSelectedThemes([...selectedThemes, theme]);
    } else {
      setSelectedThemes(selectedThemes.filter((t) => t !== theme));
    }
  };

  return (
    <div className="theme-filter-container">
      <h3 className="theme-filter-title">Filter by Theme</h3>
      <div className="theme-checkboxes">
        {themes.length > 0 ? (
          themes.map((theme, index) => (
            <div key={index} className="theme-checkbox-item">
              <input 
                type="checkbox" 
                id={`theme-${index}`} 
                name="theme" 
                value={theme} 
                checked={selectedThemes.includes(theme)}
                onChange={handleThemeChange}
              />
              <label htmlFor={`theme-${index}`}>{theme}</label>
            </div>
          ))
        ) : (
          <p>No themes available.</p>
        )}
      </div>

      {userType === 'Host' && (
        <button className="manage-themes-button" onClick={() => setShowThemeModal(true)}>
          Manage Themes
        </button>
      )}
    </div>
  );
};

export default ThemeFilter;
