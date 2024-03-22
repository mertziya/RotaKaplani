import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import './MapComponentStyle.css'; // Assuming your CSS file is in the same directory

const mapContainerStyle = {
  height: '100vh',
  width: '100%'
};

const defaultCenter = { lat: 41.0082, lng: 28.9874 };

const MyMap = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false); // State to track if maps library is loaded

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Callback function to set mapsLoaded to true once Google Maps script is loaded
  const handleLoad = () => {
    setMapsLoaded(true);
  };

  // Dynamic options with dependencies on the google object
  const mapOptions = mapsLoaded ? {
    mapTypeControl: true,
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: window.google.maps.ControlPosition.RIGHT_TOP,
    },
    mapTypeControlOptions: {
      position: window.google.maps.ControlPosition.RIGHT_TOP,
    },
  } : {};

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyB1QGeo5CWNY_5Q84Mxen8XIQuZM_5_YvE"
      onLoad={handleLoad}
    >
      <button
        className="toggle-button"
        onClick={toggleSidebar}
        style={{
          left: `${sidebarVisible ? 200 : 25}px`, // Dynamically set based on sidebar state
        }}
      >
        {sidebarVisible ? '<' : '>'}
      </button>
      <div className={`sidebar ${sidebarVisible ? '' : 'sidebar-collapsed'}`}>
        {sidebarVisible && [1, 2, 3, 4].map(num => (
          <button key={num} className="sidebar-button">Sidebar {num}</button>
        ))}
      </div>
      {mapsLoaded && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={13}
          options={mapOptions}
        >
          {/* Markers and Polyline */}
        </GoogleMap>
      )}
    </LoadScript>
  );
};

export default MyMap;
