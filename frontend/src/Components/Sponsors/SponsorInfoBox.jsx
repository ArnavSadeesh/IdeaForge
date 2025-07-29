import React from 'react';
import './SponsorInfoBox.css';

const SponsorInfoBox = () => {
  return (
    <div className="sponsor-info-box">
      <h2>Sponsor Information</h2>
      <p>Welcome, Sponsors! Here you can manage your resources and see how they are being utilized in the hackathon.</p>
      <h3>Instructions:</h3>
      <ul>
        <li>Use the "Add Resource" button to list new resources you are providing.</li>
        <li>Each resource should have a name, type, intended use, intended theme, and any miscellaneous details.</li>
        <li>Monitor the usage of your resources through this page.</li>
      </ul>
    </div>
  );
};

export default SponsorInfoBox;
