import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import './ThreatGauge.css';

const ThreatGauge = ({ avgSeverity }) => {
  // Calculate the remaining portion to complete the semi-circle
  const remaining = 100 - avgSeverity;
  const data = [
    { name: 'Threat', value: avgSeverity },
    { name: 'Remaining', value: remaining }
  ];

  // Define colors based on severity
  const getColor = (severity) => {
    if (severity <= 30) return '#4caf50';
    if (severity <= 60) return '#ff9800';
    return '#f44336';
  };

  const threatColor = getColor(avgSeverity);

  return (
    <div className="threat-gauge">
      <h2>Overall Threat Level</h2>
      <div className="gauge-container">
        <PieChart width={300} height={180}>
          <Pie
            data={data}
            cx={150}
            cy={150}
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={threatColor} />
            <Cell fill="#eee" />
          </Pie>
        </PieChart>
        <div className="gauge-value" style={{ color: threatColor }}>
          <span className="value">{Math.round(avgSeverity)}</span>
          <span className="label">{getThreatLabel(avgSeverity)}</span>
        </div>
      </div>
    </div>
  );
};

const getThreatLabel = (severity) => {
  if (severity <= 30) return 'Low Risk';
  if (severity <= 60) return 'Medium Risk';
  return 'High Risk';
};

export default ThreatGauge;