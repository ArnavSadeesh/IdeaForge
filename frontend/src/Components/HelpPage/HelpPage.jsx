import React from 'react';
import HelpList from './HelpList';
import './HelpPage.css';
import '../Community/IdeasPage.css';

const HelpPage = () => {
  return (
    <div className="help-page ideas-page-background">
      <h1>Frequently Asked Questions</h1>
      <HelpList />
    </div>
  );
};

export default HelpPage;
