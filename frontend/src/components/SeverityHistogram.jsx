import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import './SeverityHistogram.css';

const SeverityHistogram = ({ tweets, avgSeverity }) => {
  // Create histogram data
  const histogramData = useMemo(() => {
    // Create bins (0-20, 21-40, 41-60, 61-80, 81-100)
    const bins = [
      { range: '0-20', count: 0, label: 'Low' },
      { range: '21-40', count: 0, label: 'Moderate' },
      { range: '41-60', count: 0, label: 'High' },
      { range: '61-80', count: 0, label: 'Very High' },
      { range: '81-100', count: 0, label: 'Critical' }
    ];

    // Count tweets in each bin
    tweets.forEach(tweet => {
      const score = tweet.severity_score;
      if (score <= 20) bins[0].count++;
      else if (score <= 40) bins[1].count++;
      else if (score <= 60) bins[2].count++;
      else if (score <= 80) bins[3].count++;
      else bins[4].count++;
    });

    return bins;
  }, [tweets]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="severity-tooltip">
          <p className="tooltip-range">{data.range}%</p>
          <p className="tooltip-label">{data.label} Severity</p>
          <p className="tooltip-count">
            {data.count} Tweet{data.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (range) => {
    switch (range) {
      case '0-20': return '#4ecdc4';
      case '21-40': return '#ffbb00';
      case '41-60': return '#ff8c00';
      case '61-80': return '#ff6b6b';
      case '81-100': return '#ff4d4d';
      default: return '#666';
    }
  };

  return (
    <div className="severity-histogram-container">
      <h2>Severity Distribution</h2>
      <div className="severity-histogram">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={histogramData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="range" 
              label={{ 
                value: 'Severity Score Range (%)', 
                position: 'bottom',
                offset: 0
              }}
            />
            <YAxis
              label={{ 
                value: 'Number of Tweets', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="count"
              name="Tweets"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
              shape={(props) => {
                return (
                  <rect
                    {...props}
                    fill={getBarColor(props.range)}
                    rx={4}
                    ry={4}
                  />
                );
              }}
            />
            <ReferenceLine
              y={0}
              stroke="#000"
            />
            {avgSeverity && (
              <ReferenceLine
                x={Math.floor(avgSeverity / 20)}
                stroke="#ff0000"
                strokeDasharray="3 3"
                label={{
                  value: `Avg: ${Math.round(avgSeverity)}%`,
                  position: 'top',
                  fill: '#ff0000',
                  fontSize: 12
                }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SeverityHistogram; 