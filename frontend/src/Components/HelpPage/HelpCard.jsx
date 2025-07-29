import React, { useState } from 'react';
import './HelpCard.css';

const HelpCard = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="help-card">
      <div className="question" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`arrow ${isOpen ? 'open' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      {isOpen && <div className="answer">{answer}</div>}
    </div>
  );
};

export default HelpCard;
