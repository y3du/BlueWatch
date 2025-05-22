import React from 'react';
import './EntityTable.css';

const EntityTable = ({ tweets }) => {
  // Process tweets to extract entities
  const extractEntities = () => {
    const entities = {
      ORG: new Set(),
      PERSON: new Set(),
      GEO: new Set()
    };

    tweets.forEach(tweet => {
      if (tweet.entities) {
        tweet.entities.forEach(entity => {
          if (entities.hasOwnProperty(entity.type)) {
            entities[entity.type].add(entity.text);
          }
        });
      }
    });

    return {
      ORG: Array.from(entities.ORG),
      PERSON: Array.from(entities.PERSON),
      GEO: Array.from(entities.GEO)
    };
  };

  const entities = extractEntities();
  const maxRows = Math.max(
    entities.ORG.length,
    entities.PERSON.length,
    entities.GEO.length
  );

  return (
    <div className="entity-table-container">
      <h2>Named Entities</h2>
      <div className="entity-table-wrapper">
        <table className="entity-table">
          <thead>
            <tr>
              <th>Organizations</th>
              <th>Persons</th>
              <th>Locations</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(maxRows)].map((_, index) => (
              <tr key={index}>
                <td>{entities.ORG[index] || ''}</td>
                <td>{entities.PERSON[index] || ''}</td>
                <td>{entities.GEO[index] || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntityTable;
