import React, { useState, useEffect, useRef } from 'react';
import './CountrySelector.css';

const CountrySelector = () => {
  const [countries] = useState([
    "Albania", "Algeria", "Saudi Arabia", "United Arab Emirates", "Argentina",
    "Armenia", "Australia", "Austria", "Azerbaijan", "Bangladesh", "Belarus",
    "Belgium", "Belgium French", "Belgium Netherl", "Bosnia and Herzegovina",
    "Brazil", "Bulgaria", "Burkina Faso", "Canada", "Chile", "China", "Colombia",
    "Costa Rica", "Croatia", "Cyprus", "Czech Rep", "Denmark", "Dominican Rep",
    "Ecuador", "Egypt", "Ethiopia", "El Salvador", "Estonia", "Finland", "France",
    "Georgia", "Germany", "Ghana", "United Kingdom", "Greece", "Guatemala", 
    "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", 
    "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Korea South",
    "Latvia", "Lithuania", "Luxembourg", "North Macedonia", "Malaysia", "Malta",
    "Mexico", "Moldova", "Montenegro", "Morocco", "Netherlands", "New Zealand",
    "Nigeria", "Norway", "Pakistan", "Panama", "Peru", "Philippines", "Poland",
    "Portugal", "Puerto Rico", "Romania", "Russia", "Saudi Arabia", "Serbia",
    "Singapore", "Slovakia", "Slovenia", "South Africa", "South Africa white",
    "Spain", "Suriname", "Sweden", "Switzerland", "Taiwan", "Tanzania", "Thailand",
    "Trinidad and Tobago", "Turkey", "U.S.A.", "Uganda", "Ukraine", "Uruguay",
    "Venezuela", "Vietnam", "Zambia"
  ]);

  const [selectedOptionMap, setSelectedOptionMap] = useState(new Map());
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCountry, setCurrentCountry] = useState('');
  const [participants, setParticipants] = useState(1);

  const optionsRef = useRef(null);

  const openModal = (countryName) => {
    setCurrentCountry(countryName);
    setParticipants(1); // Reset participants to 1 when opening modal
    setIsModalVisible(true);
  };

  const handleSelect = () => {
    setSelectedOptionMap(prevMap => new Map(prevMap.set(currentCountry, parseInt(participants))));
    setIsModalVisible(false);
  };

  const removeSelectedOption = (countryName) => {
    setSelectedOptionMap(prevMap => {
      const newMap = new Map(prevMap);
      newMap.delete(countryName);
      return newMap;
    });
  };

  const handleOutsideClick = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setIsOptionsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className="App">
      <div className="custom-select" onClick={() => setIsOptionsVisible(!isOptionsVisible)} ref={optionsRef}>
        <h2 style={{ textAlign: 'center' }}>Country Selector</h2>
        <div className="selected-values">
          {Array.from(selectedOptionMap.entries()).map(([country, number]) => (
            <div key={country} className="selected-value">
              <span>{country} ({number})</span>
              <button className="remove-button" onClick={(e) => {
                e.stopPropagation();
                removeSelectedOption(country);
              }}>x</button>
            </div>
          ))}
          {!selectedOptionMap.size && 'Seleziona i paesi'}
        </div>
        {isOptionsVisible && (
          <div className={`options ${isOptionsVisible ? 'active' : ''}`}>
            {countries.map(country => (
              <div key={country} className="option" onClick={() => selectedOptionMap.has(country) ? removeSelectedOption(country) : openModal(country)}>
                {country}
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalVisible && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalVisible(false)}>&times;</span>
            <h2>Seleziona il numero di partecipanti</h2>
            <p>Paese selezionato: {currentCountry}</p>
            <div className="modal-input">
              <label htmlFor="participantsInput">Numero di partecipanti:</label>
              <input
                type="number"
                id="participantsInput"
                min="1"
                max="10"
                value={participants}
                onChange={e => setParticipants(e.target.value)}
              />
              <span>{participants} partecipanti</span>
            </div>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setIsModalVisible(false)}>Annulla</button>
              <button className="ok-button" onClick={handleSelect}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CountrySelector;
