import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import './KeywordFilter.css';

const KeywordFilter = ({ selectedKeywords, setSelectedKeywords }) => {
  const [keywords, setKeywords] = useState([]);
  const { hackathonId, token } = useContext(AuthContext);

  useEffect(() => {
    console.log('KeywordFilter: Current hackathonId from AuthContext:', hackathonId);
    const fetchKeywords = async () => {
      if (!hackathonId) {
        console.log('KeywordFilter: No hackathonId, skipping fetch.');
        return;
      }
      console.log('KeywordFilter: Attempting to fetch keywords for hackathonId:', hackathonId);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/hackathons/${hackathonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setKeywords(response.data.keywords || []);
        console.log('KeywordFilter: Successfully fetched keywords:', response.data.keywords);
      } catch (error) {
        console.error('KeywordFilter: Error fetching keywords:', error);
      }
    };

    fetchKeywords();
  }, [hackathonId, token]);

  const handleKeywordChange = (event) => {
    const keyword = event.target.value;
    if (event.target.checked) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    } else {
      setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
    }
  };

  return (
    <div className="keyword-filter-container">
      <h3 className="keyword-filter-title">Filter by Keyword</h3>
      <div className="keyword-checkboxes">
        {keywords.length > 0 ? (
          keywords.map((keyword, index) => (
            <div key={index} className="keyword-checkbox-item">
              <input 
                type="checkbox" 
                id={`keyword-${index}`} 
                name="keyword" 
                value={keyword} 
                checked={selectedKeywords.includes(keyword)}
                onChange={handleKeywordChange}
              />
              <label htmlFor={`keyword-${index}`}>{keyword}</label>
            </div>
          ))
        ) : (
          <p>No keywords available.</p>
        )}
      </div>
    </div>
  );
};

export default KeywordFilter;
