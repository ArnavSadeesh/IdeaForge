import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import './AddResourceModal.css';

const AddResourceModal = ({ onClose, onAddResource }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [intendedUse, setIntendedUse] = useState('');
  const [intendedTheme, setIntendedTheme] = useState('');
  const [miscellaneous, setMiscellaneous] = useState('');

  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newResource = {
        name,
        type,
        intendedUse,
        intendedTheme,
        miscellaneous,
      };
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/resources`, newResource, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onAddResource(response.data);
      onClose();
    } catch (error) {
      console.error('Error adding resource:', error);
      alert('Failed to add resource. Please try again.');
    }
  };

  return (
    <div className="add-resource-modal-overlay">
      <div className="add-resource-modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Add New Resource</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <input type="text" id="type" value={type} onChange={(e) => setType(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="intendedUse">Intended Use</label>
            <input type="text" id="intendedUse" value={intendedUse} onChange={(e) => setIntendedUse(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="intendedTheme">Intended Theme</label>
            <input type="text" id="intendedTheme" value={intendedTheme} onChange={(e) => setIntendedTheme(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="miscellaneous">Miscellaneous</label>
            <input type="text" id="miscellaneous" value={miscellaneous} onChange={(e) => setMiscellaneous(e.target.value)} />
          </div>
          <button type="submit">Add Resource</button>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;
