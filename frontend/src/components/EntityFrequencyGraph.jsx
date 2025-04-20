import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './EntityFrequencyGraph.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ENTITY_TYPES = {
  PERSON: { label: 'People', color: '#3b82f6' },
  ORG: { label: 'Organizations', color: '#10b981' },
  GPE: { label: 'Locations', color: '#f59e0b' }
};

const EntityFrequencyGraph = ({ analysisData }) => {
  const [selectedEntityType, setSelectedEntityType] = useState('PERSON');
  const [entityFrequencies, setEntityFrequencies] = useState([]);

  useEffect(() => {
    if (analysisData?.analysis) {
      // Create a frequency map for the selected entity type
      const frequencies = {};
      
      analysisData.analysis.forEach(tweet => {
        const entities = tweet.entities[selectedEntityType] || [];
        entities.forEach(entity => {
          frequencies[entity] = (frequencies[entity] || 0) + 1;
        });
      });

      // Convert to array and sort by frequency
      const sortedFrequencies = Object.entries(frequencies)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));

      setEntityFrequencies(sortedFrequencies);
    }
  }, [analysisData, selectedEntityType]);

  const chartData = {
    labels: entityFrequencies.map(item => item.name),
    datasets: [
      {
        label: `${ENTITY_TYPES[selectedEntityType].label} Mentions`,
        data: entityFrequencies.map(item => item.count),
        backgroundColor: ENTITY_TYPES[selectedEntityType].color,
        borderColor: ENTITY_TYPES[selectedEntityType].color,
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1a1a1a',
        bodyColor: '#1a1a1a',
        borderColor: '#d1d5db',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (context) => `Mentions: ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#1a1a1a',
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6'
        },
        ticks: {
          color: '#1a1a1a',
          font: {
            size: 11
          },
          stepSize: 1
        }
      }
    }
  };

  const handleEntityTypeChange = (event) => {
    setSelectedEntityType(event.target.value);
  };

  return (
    <div className="entity-frequency-container">
      <div className="entity-frequency-header">
        <h2 className="entity-frequency-title">Entity Frequency Analysis</h2>
        <select
          className="entity-type-select"
          value={selectedEntityType}
          onChange={handleEntityTypeChange}
        >
          {Object.entries(ENTITY_TYPES).map(([type, { label }]) => (
            <option key={type} value={type}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="graph-container">
        {entityFrequencies.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <div className="no-data-message">
            No {ENTITY_TYPES[selectedEntityType].label.toLowerCase()} found in the analyzed tweets.
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityFrequencyGraph; 