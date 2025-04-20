import React, { useState } from 'react';
import './DataInputForm.css';
import logo from '../assets/bluewatch-logo.png';

const DataInputForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    platform: 'Facebook',
    dataType: 'Posts',
    fromDate: '',
    toDate: ''
  });

  const platforms = ['Twitter', 'Facebook'];
  const dataTypes = ['Posts', 'Comments', 'Likes', 'Shares'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSetDefault = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    setFormData({
      ...formData,
      fromDate: thirtyDaysAgo.toISOString().split('T')[0],
      toDate: today.toISOString().split('T')[0]
    });
  };

  return (
    <div className="data-input-container">
      <form onSubmit={handleSubmit} className="data-input-form">
        <div className="logo-container">
          <img src={logo} alt="BlueWatch Logo" className="logo" />
        </div>
        <h2>Data Parser</h2>
        
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="platform">Platform:</label>
          <div className="select-wrapper">
            <select
              id="platform"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dataType">Data to Parse:</label>
          <div className="select-wrapper">
            <select
              id="dataType"
              value={formData.dataType}
              onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
            >
              {dataTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="timeline">
          <h3>Timeline</h3>
          <div className="date-inputs">
            <div className="date-group">
              <label htmlFor="fromDate">From:</label>
              <input
                type="date"
                id="fromDate"
                value={formData.fromDate}
                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                required
              />
            </div>
            <div className="date-group">
              <label htmlFor="toDate">To:</label>
              <input
                type="date"
                id="toDate"
                value={formData.toDate}
                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <button type="button" className="default-btn" onClick={handleSetDefault}>
          Set Default
        </button>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default DataInputForm; 