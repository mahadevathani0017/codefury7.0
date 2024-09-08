import React, { useState } from 'react';

// Sample disaster details with real image URLs
const disasters = [
  {
    id: 1,
    title: 'Earthquake',
    description: 'An earthquake is the shaking of the surface of the Earth caused by the movement of tectonic plates.',
    details: 'Earthquakes can cause severe damage to buildings and infrastructure, leading to loss of life and property.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/2015_Nepal_earthquake_01.jpg/1024px-2015_Nepal_earthquake_01.jpg'
  },
  {
    id: 2,
    title: 'Flood',
    description: 'A flood is an overflow of water that submerges land that is usually dry.',
    details: 'Floods can result in significant damage to homes, agriculture, and can lead to waterborne diseases.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/2015_flood_in_Sri_Lanka.jpg/1024px-2015_flood_in_Sri_Lanka.jpg'
  },
  {
    id: 3,
    title: 'Hurricane',
    description: 'A hurricane is a powerful tropical storm with strong winds and heavy rain.',
    details: 'Hurricanes can cause widespread destruction, including storm surges, heavy rain, and strong winds.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Hurricane_Laura_2020_Visible_Satellite_Image.jpg/1024px-Hurricane_Laura_2020_Visible_Satellite_Image.jpg'
  },

];

const DisasterCard = ({ disaster, onClick }) => (
  <div
    onClick={() => onClick(disaster)}
    style={{
      border: '1px solid #ddd',
      borderRadius: '15px',
      padding: '20px',
      margin: '15px',
      width: '300px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      backgroundColor: '#fff',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    }}
  >
    <img
      src={disaster.imageUrl}
      alt={disaster.title}
      style={{
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '10px',
        marginBottom: '15px',
      }}
    />
    <h2 style={{ color: '#007bff', margin: '10px 0', fontSize: '1.5em' }}>{disaster.title}</h2>
    <p style={{ color: '#555', margin: '15px 0', fontSize: '1em', lineHeight: '1.6' }}>{disaster.description}</p>
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevents the card click event from firing
        onClick(disaster);
      }}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'background-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#0056b3';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#007bff';
      }}
    >
      View Details
    </button>
  </div>
);

const DisasterDetails = ({ disaster, onBack }) => (
  <div
    style={{
      padding: '30px',
      margin: '30px auto',
      maxWidth: '600px',
      backgroundColor: '#fff',
      borderRadius: '15px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      textAlign: 'left',
    }}
  >
    <button
      onClick={onBack}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '20px',
        fontSize: '1em',
        transition: 'background-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#0056b3';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#007bff';
      }}
    >
      Back
    </button>
    <img
      src={disaster.imageUrl}
      alt={disaster.title}
      style={{
        width: '100%',
        height: '300px',
        objectFit: 'cover',
        borderRadius: '10px',
        marginBottom: '20px',
      }}
    />
    <h2 style={{ color: '#007bff', fontSize: '2em', marginBottom: '15px' }}>{disaster.title}</h2>
    <p style={{ fontSize: '1.2em', lineHeight: '1.8', color: '#333' }}>{disaster.details}</p>
  </div>
);

const DisasterOverview = () => {
  const [selectedDisaster, setSelectedDisaster] = useState(null);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {!selectedDisaster ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {disasters.map((disaster) => (
            <DisasterCard
              key={disaster.id}
              disaster={disaster}
              onClick={setSelectedDisaster}
            />
          ))}
        </div>
      ) : (
        <DisasterDetails
          disaster={selectedDisaster}
          onBack={() => setSelectedDisaster(null)}
        />
      )}
    </div>
  );
};

export default DisasterOverview;
