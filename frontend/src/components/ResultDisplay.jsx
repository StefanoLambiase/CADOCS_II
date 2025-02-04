import React from 'react';
import './ResultDisplay.css';

const ResultDisplay = ({ title, content }) => {
    const formatTitle = (title) => {
    const titleMap = {
      'pdi': 'Power Distance (PDI)',
      'idv': 'Individualism (IDV)',
      'mas': 'Masculinity (MAS)',
      'uai': 'Uncertainty (UAI)',
      'lto': 'Long Term Orientation (LTO)',
      'ind': 'Indulgence (IND)'
    };
    return titleMap[title.toLowerCase()] || title; // Restituisce il titolo formattato o il titolo originale se non trovato
  };
  return (
      <div className="result-display" style={{color: 'black'}}>
          <h3>{formatTitle(title)}</h3>
          {content['description'] && (
              <>
                  <div className="content-text">{content['description']}</div>
              </>
          )}
          <h3 style={{marginTop:"15px"}}>Results</h3>
          {content['dispersion_description'] && (
              <>
                  <div className="bold-text">Dispersion Description</div>
                  <div className="content-text">{content['dispersion_description']}</div>
              </>
          )}
          {content['effects'] && content['effects'].length > 0 && (
              <>
                  <div className="bold-text">Effects</div>
                  <ul className="effects-list">
                      {content['effects'].map((effect, index) => (
                          <li key={index} className="content-text">{effect}</li>
                      ))}
                  </ul>
              </>
          )}
          {content['dispersion_value'] !== undefined && (
              <>
                  <div className="bold-text">Dispersion Value</div>
                  <div className="content-text">{content['dispersion_value']}</div>
              </>
          )}
          {content['value'] !== undefined && (
              <>
                  <div className="bold-text">Value</div>
                  <div className="content-text">{content['value']}</div>
              </>
          )}
      </div>
  );
};

export default ResultDisplay;
