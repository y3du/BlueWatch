import React from 'react';
import './AnalysisResults.css';

const AnalysisResults = ({ data }) => {
  const { user, analysis, summary } = data;

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case 'anger':
        return '#ff3b3b';
      case 'joy':
        return '#4caf50';
      case 'optimism':
        return '#2196f3';
      case 'sadness':
        return '#9c27b0';
      default:
        return '#ffffff';
    }
  };

  const getSeverityColor = (score) => {
    if (score >= 70) return '#ff3b3b';
    if (score >= 40) return '#ff9800';
    if (score >= 20) return '#ffeb3b';
    return '#4caf50';
  };

  return (
    <div className="analysis-container">
      {/* User Profile Section */}
      <div className="profile-card">
        <div className="profile-header">
          <h2>{user.name}</h2>
          <span className="username">@{user.username}</span>
        </div>
        <div className="profile-stats">
          <div className="stat">
            <span className="stat-value">{user.followers_count}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat">
            <span className="stat-value">{user.following_count}</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat">
            <span className="stat-value">{user.tweet_count}</span>
            <span className="stat-label">Tweets</span>
          </div>
        </div>
        <div className="profile-description">
          <p>{user.description}</p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-card">
        <h3>Analysis Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-value">{summary.total_tweets}</span>
            <span className="summary-label">Total Tweets</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{summary.flagged_count}</span>
            <span className="summary-label">Flagged Tweets</span>
          </div>
          <div className="summary-item">
            <span className="summary-value" style={{ color: getSeverityColor(summary.avg_severity) }}>
              {summary.avg_severity.toFixed(1)}
            </span>
            <span className="summary-label">Avg Severity</span>
          </div>
        </div>
        <div className="emotion-distribution">
          {Object.entries(summary.emotion_counts).map(([emotion, count]) => (
            <div key={emotion} className="emotion-bar">
              <span className="emotion-label">{emotion}</span>
              <div className="bar-container">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(count / summary.total_tweets) * 100}%`,
                    backgroundColor: getEmotionColor(emotion)
                  }}
                />
              </div>
              <span className="emotion-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tweets Analysis Section */}
      <div className="tweets-analysis">
        <h3>Detailed Analysis</h3>
        {analysis.map((tweet, index) => (
          <div key={index} className="tweet-card">
            <div className="tweet-header">
              <span className="tweet-date">{new Date(tweet.created_at).toLocaleString()}</span>
              <span
                className="tweet-emotion"
                style={{ color: getEmotionColor(tweet.emotion) }}
              >
                {tweet.emotion} ({tweet.confidence.toFixed(2)})
              </span>
            </div>
            <div className="tweet-content">{tweet.text}</div>
            <div className="tweet-metrics">
              <span>❤️ {tweet.public_metrics.like_count}</span>
              <span>🔄 {tweet.public_metrics.retweet_count}</span>
              <span>💬 {tweet.public_metrics.reply_count}</span>
            </div>
            {tweet.flagged_words.length > 0 && (
              <div className="flagged-words">
                <span className="warning-icon">⚠️</span>
                <span>Flagged words: {tweet.flagged_words.join(', ')}</span>
              </div>
            )}
            <div className="severity-score" style={{ color: getSeverityColor(tweet.severity_score) }}>
              Severity Score: {tweet.severity_score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisResults; 