import React from 'react';
import './AddResource.css';

const AddResource = ({ onAddClick }) => {
  return (
    <div className="add-resource-card">
      <button className="add-resource-button" onClick={onAddClick}>
        <span className="plus-icon">+</span>
        Add Resource
      </button>
    </div>
  );
};

export default AddResource;
