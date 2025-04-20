import React, { useState } from 'react';
import './TweetList.css';

const TweetList = ({ tweets }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Format the date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  // Get color based on severity score
  const getSeverityColor = (score) => {
    if (score >= 75) return '#ff4d4d';
    if (score >= 50) return '#ffa500';
    if (score >= 25) return '#ffcd56';
    return '#4ecdc4';
  };

  // Get emotion icon
  const getEmotionIcon = (emotion) => {
    const icons = {
      anger: '😠',
      joy: '😊',
      optimism: '🌟',
      sadness: '😢'
    };
    return icons[emotion] || '❓';
  };

  // Toggle LIME analysis visibility
  const toggleLimeAnalysis = (index) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="tweet-list-container">
      <h2>Tweet Analysis</h2>
      <div className="tweet-list-table-container">
        <table className="tweet-list-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Tweet</th>
              <th>Emotion</th>
              <th>Severity</th>
              <th>LIME Analysis</th>
            </tr>
          </thead>
          <tbody>
            {tweets.map((tweet, index) => (
              <React.Fragment key={index}>
                <tr className={expandedRows.has(index) ? 'expanded' : ''}>
                  <td className="time-cell">{formatDate(tweet.created_at)}</td>
                  <td className="text-cell">{tweet.text}</td>
                  <td className="emotion-cell">
                    <span title={`Confidence: ${(tweet.confidence * 100).toFixed(1)}%`}>
                      {getEmotionIcon(tweet.emotion)} {tweet.emotion}
                    </span>
                  </td>
                  <td className="severity-cell">
                    <div 
                      className="severity-indicator"
                      style={{ 
                        backgroundColor: getSeverityColor(tweet.severity_score)
                      }}
                    >
                      {tweet.severity_score}
                    </div>
                  </td>
                  <td className="lime-cell">
                    <button 
                      className="lime-toggle-btn"
                      onClick={() => toggleLimeAnalysis(index)}
                      aria-expanded={expandedRows.has(index)}
                    >
                      {expandedRows.has(index) ? 'Hide Analysis' : 'View Analysis'}
                    </button>
                  </td>
                </tr>
                {expandedRows.has(index) && (
                  <tr className="lime-analysis-row">
                    <td colSpan="5">
                      <div className="lime-content">
                        <div className="lime-section">
                          <h4>Word Importance Analysis</h4>
                          <div className="lime-words">
                            {tweet.lime_explanation.map((item, i) => (
                              <div 
                                key={i} 
                                className="lime-word"
                                style={{
                                  opacity: Math.abs(item.importance) * 2,
                                  color: item.importance > 0 ? '#2ecc71' : '#e74c3c'
                                }}
                              >
                                <span className="word">{item.word}</span>
                                <span className="importance">
                                  {item.importance > 0 ? '+' : ''}{item.importance.toFixed(3)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {tweet.flagged_words.length > 0 && (
                          <div className="lime-section">
                            <h4>Flagged Words</h4>
                            <div className="tags">
                              {tweet.flagged_words.map((word, i) => (
                                <span key={i} className="tag">{word}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="lime-section">
                          <h4>Named Entities</h4>
                          <div className="entities">
                            {Object.entries(tweet.entities).map(([type, entities]) => 
                              entities.length > 0 && (
                                <div key={type} className="entity-group">
                                  <span className="entity-type">{type}:</span>
                                  {entities.map((entity, i) => (
                                    <span key={i} className="entity-tag">
                                      {entity}
                                    </span>
                                  ))}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TweetList; 