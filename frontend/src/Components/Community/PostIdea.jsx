import React from 'react';
import './PostIdea.css';

const PostIdea = ({ onPostClick }) => {
  return (
    <div className="post-idea-card">
      <button className="post-idea-button" onClick={onPostClick}>
        <span className="plus-icon">+</span>
        <span>Post an Idea</span>
      </button>
    </div>
  );
};

export default PostIdea;