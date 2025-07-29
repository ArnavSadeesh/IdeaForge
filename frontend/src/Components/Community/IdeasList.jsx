import React from 'react';
import Idea from './Idea';
import './IdeasList.css';

const IdeasList = ({ ideas, onClaimIdea }) => {
  return (
    <div className="ideas-list-container">
      {ideas.map((idea) => (
        <Idea key={idea._id} idea={idea} onClaimIdea={onClaimIdea} />
      ))}
    </div>
  );
};

export default IdeasList;

