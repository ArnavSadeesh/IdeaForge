import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import SponsorInfoBox from './SponsorInfoBox';
import ResourceList from './ResourceList';
import AddResource from './AddResource';
import AddResourceModal from './AddResourceModal';
import { AuthContext } from '../../Context/AuthContext';
import './SponsorsPage.css';

const SponsorsPage = () => {
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [resources, setResources] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/resources/my-resources', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    if (token) {
      fetchResources();
    }
  }, [token]);

  const handleOpenAddResourceModal = () => {
    setShowAddResourceModal(true);
  };

  const handleCloseAddResourceModal = () => {
    setShowAddResourceModal(false);
  };

  const handleAddResource = (newResource) => {
    setResources([...resources, newResource]);
  };

  return (
    <div className="sponsors-page">
      <div className="sponsors-content-wrapper">
        <SponsorInfoBox />
        <ResourceList resources={resources} />
        <AddResource onAddClick={handleOpenAddResourceModal} />
      </div>
      {showAddResourceModal && <AddResourceModal onClose={handleCloseAddResourceModal} onAddResource={handleAddResource} token={token} />}
    </div>
  );
};

export default SponsorsPage;
