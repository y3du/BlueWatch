import React, { useState } from 'react';
import UserCard from './UserCard';
import EmotionBarGraph from './EmotionBarGraph';
import WordCloudComponent from './WordCloud';
import TweetList from './TweetList';
import TimelineChart from './TimelineChart';
import SeverityHistogram from './SeverityHistogram';
import ThreatGauge from './ThreatGauge';
import NetworkGraph from './NetworkGraph';


import './Dashboard.css';
import '../print.css';

const Dashboard = ({ data }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = () => {
    try {
      setIsGeneratingPDF(true);
      // Use the browser's print functionality
      window.print();
    } catch (error) {
      console.error('Error printing:', error);
      alert('Error printing. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!data) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <span>Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Threat Analysis Dashboard</h1>
        <button 
          className={`generate-pdf-button ${isGeneratingPDF ? 'generating' : ''}`}
          onClick={generatePDF}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? 'Generating PDF...' : 'Generate PDF Report'}
        </button>
      </div>
      <div className="dashboard-grid">
        <UserCard user={data.user} summary={data.summary} />
        <ThreatGauge 
          avgSeverity={data.summary.avg_severity}
          flaggedCount={data.summary.flagged_count}
          totalTweets={data.summary.total_tweets}
        />
        <NetworkGraph 
          tweets={data.analysis}
          entities={data.analysis.reduce((acc, tweet) => {
            Object.entries(tweet.entities).forEach(([type, entities]) => {
              entities.forEach(entity => {
                if (!acc[type]) acc[type] = new Set();
                acc[type].add(entity);
              });
            });
            return acc;
          }, {})}
        />
        <EmotionBarGraph emotions={data.summary.emotion_counts} />
        <SeverityHistogram 
          tweets={data.analysis} 
          avgSeverity={data.summary.avg_severity}
        />
        
        <WordCloudComponent tweets={data.analysis} />
        <TimelineChart tweets={data.analysis} />
        <TweetList tweets={data.analysis} />
      </div>
    </div>
  );
};

export default Dashboard; 