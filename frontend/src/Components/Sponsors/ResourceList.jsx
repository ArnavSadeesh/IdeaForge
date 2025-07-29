import React from 'react';
import Resource from './Resource';
import './ResourceList.css';

const ResourceList = ({ resources }) => {
  return (
    <div className="resource-list">
      {resources.length > 0 ? (
        resources.map(resource => (
          <Resource key={resource._id} resource={resource} />
        ))
      ) : (
        <p className="no-resources-message">No resources added yet.</p>
      )}
    </div>
  );
};

export default ResourceList;
