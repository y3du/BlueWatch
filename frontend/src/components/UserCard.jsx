import React from 'react';
import './UserCard.css';

const UserCard = ({ user }) => {
  // Format the date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <h2 className="user-name">{user.name}</h2>
        <span className="username">@{user.username}</span>
        {user.verified && <span className="verified-badge">✓</span>}
      </div>
      
      <p className="user-description">{user.description}</p>
      
      <div className="user-stats">
        <div className="stat-item">
          <span className="stat-label">Followers</span>
          <span className="stat-value">{formatNumber(user.followers_count)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Following</span>
          <span className="stat-value">{formatNumber(user.following_count)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Tweets</span>
          <span className="stat-value">{formatNumber(user.tweet_count)}</span>
        </div>
      </div>
      
      <div className="user-footer">
        <span className="join-date">
          Joined {formatDate(user.created_at)}
        </span>
      </div>
    </div>
  );
};

export default UserCard; 