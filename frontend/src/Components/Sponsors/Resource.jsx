import React from 'react';
import './Resource.css';

const Resource = ({ resource }) => {
  const { name, type, intendedUse, intendedTheme, miscellaneous } = resource;
  return (
    <div className="resource-card">
      <h3>{name}</h3>
      <p>Type: {type}</p>
      <p>Intended Use: {intendedUse}</p>
      <p>Intended Theme: {intendedTheme}</p>
      <p>Miscellaneous: {miscellaneous}</p>
    </div>
  );
};

export default Resource;
