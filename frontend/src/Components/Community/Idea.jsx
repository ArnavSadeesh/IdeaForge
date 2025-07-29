import React, { useState } from 'react';
import './Idea.css';

const Idea = ({ idea, onClaimIdea }) => {
  const { title, description } = idea;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const displayDescription = isExpanded ? description : `${description.substring(0, 150)}...`; // Truncate description

  return (
    <div className="idea-card">
      <h3 className="idea-title">{title}</h3>
      <p className="idea-description">
        {displayDescription}
        {description.length > 150 && (
          <span className="see-more-toggle" onClick={toggleExpanded}>
            {isExpanded ? ' ▲' : ' ▼'}
          </span>
        )}
      </p>
      <button className="claim-button" onClick={() => onClaimIdea(idea)}>Claim Idea</button>
    </div>
  );
};

export default Idea;