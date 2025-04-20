import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import './EmotionBarGraph.css';

const EmotionBarGraph = ({ emotions }) => {
  // Debugging log to inspect the received emotions prop
  console.log("EmotionBarGraph emotions:", emotions);

  // Transform the emotion counts into the format Recharts expects
  // Use a fallback empty object if emotions is null/undefined
  const data = Object.entries(emotions || {}).map(([emotion, count]) => ({
    emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    count: count || 0 // Default to 0 if count is undefined
  }));

  // Custom colors for each emotion (matching capitalized keys from data transformation)
  const emotionColors = {
    Anger: '#ff4d4d',
    Joy: '#ffcd56',
    Optimism: '#4ecdc4',
    Sadness: '#45b3e0'
  };

  return (
    <div className="emotion-graph-container">
      <h2>Emotion Distribution</h2>
      <div className="emotion-graph">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="emotion"
                tick={{ fill: '#333' }}
                tickLine={{ stroke: '#333' }}
              />
              <YAxis
                tick={{ fill: '#333' }}
                tickLine={{ stroke: '#333' }}
                label={{ 
                  value: 'Number of Tweets',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#333' }
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc'
                }}
              />
              <Legend />
              <Bar
                dataKey="count"
                name="Tweet Count"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
                barSize={40}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={emotionColors[entry.emotion] || '#8884d8'} // Fallback color if key doesn't match
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No emotion data available.</p>
        )}
      </div>
    </div>
  );
};

export default EmotionBarGraph;