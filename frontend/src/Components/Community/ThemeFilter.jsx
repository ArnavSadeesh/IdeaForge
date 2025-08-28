import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import './ThemeFilter.css';

const ThemeFilter = ({ themes, setShowThemeModal, selectedThemes, setSelectedThemes }) => {
  const { userType } = useContext(AuthContext);

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
        {themes && themes.length > 0 ? (
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
          <p className="no-data-message">No themes available.</p>
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