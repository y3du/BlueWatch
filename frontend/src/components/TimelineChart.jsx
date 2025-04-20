import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './TimelineChart.css';

const TimelineChart = ({ tweets }) => {
  // Process and sort data for the timeline
  const timelineData = tweets
    .map(tweet => ({
      time: new Date(tweet.created_at),
      severity: tweet.severity_score,
      text: tweet.text,
      emotion: tweet.emotion
    }))
    .sort((a, b) => a.time - b.time)
    .map(item => ({
      ...item,
      time: item.time.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="timeline-tooltip">
          <p className="tooltip-time">{label}</p>
          <p className="tooltip-severity">Severity: {data.severity}%</p>
          <p className="tooltip-emotion">Emotion: {data.emotion}</p>
          <p className="tooltip-text">{data.text}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="timeline-chart-container">
      <h2>Threat Severity Timeline</h2>
      <div className="timeline-chart">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={timelineData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis
              domain={[0, 100]}
              label={{ 
                value: 'Severity Score (%)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="severity"
              name="Threat Severity"
              stroke="#ff4d4d"
              strokeWidth={2}
              dot={{
                stroke: '#ff4d4d',
                strokeWidth: 2,
                r: 4,
                fill: 'white'
              }}
              activeDot={{
                stroke: '#ff4d4d',
                strokeWidth: 2,
                r: 6,
                fill: '#ff4d4d'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimelineChart; 