import React from 'react';
import Login from './Login';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage homepage-background">
      <div className="content">
        <img src="/anvil.gif" alt="Anvil GIF" className="anvil-gif" />
        <div className="text-content">
          <h1 className="title">IdeaForge</h1>
          <h2 className="subtitle">A Hackathon Management Platform</h2>
        </div>
        <Login />
      </div>
    </div>
  );
};

export default HomePage;