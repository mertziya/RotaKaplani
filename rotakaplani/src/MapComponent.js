import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import './MapComponentStyle.css'; // Assuming your CSS file is in the same directory

const mapContainerStyle = {
  height: '100vh',
  width: '100%'
};

const customers = [
  { custNo: 0, xCoord: 41.0082, yCoord: 28.9784, demand: 1, readyTime: 0, dueDate: 100, serviceTime: 5 },
  { custNo: 1, xCoord: 41.0338, yCoord: 28.9848, demand: 1, readyTime: 10, dueDate: 100, serviceTime: 5 },
  { custNo: 2, xCoord: 41.0115, yCoord: 28.9679, demand: 1, readyTime: 20, dueDate: 100, serviceTime: 5 },
  { custNo: 3, xCoord: 41.0247, yCoord: 28.9252, demand: 1, readyTime: 30, dueDate: 100, serviceTime: 5 },
  { custNo: 4, xCoord: 41.0136, yCoord: 28.9499, demand: 1, readyTime: 40, dueDate: 100, serviceTime: 5 }
]; 

const defaultCenter = { lat: 41.0082, lng: 28.9874 };

const MyMap = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null); // State to track if maps library is loaded

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
      position: window.google.maps.ControlPosition.TOP_RIGHT,
    },
    mapTypeControlOptions: {
      position: window.google.maps.ControlPosition.TOP_RIGHT,
      
    },
  } : {};

  useEffect(() => {
    // Check if the maps API is loaded before proceeding to use DirectionsService
    if (mapsLoaded) {
      const directionsService = new window.google.maps.DirectionsService();

      const origin = customers[0];
      const destination = customers[customers.length - 1];
      const waypoints = customers.slice(1, customers.length - 1).map(customer => ({
        location: { lat: customer.xCoord, lng: customer.yCoord },
        stopover: true,
      }));

      directionsService.route({
        origin: { lat: origin.xCoord, lng: origin.yCoord },
        destination: { lat: destination.xCoord, lng: destination.yCoord },
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error(`Error fetching directions: ${result}`);
        }
      });
    }
  }, [mapsLoaded]); // Depend on mapsLoaded state to re-run effect when it changes // Make sure dependencies are correct if you have any
  

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
          zoom={8}
          options={mapOptions} // Ensure mapOptions are passed here
        >
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
              polylineOptions: {
              strokeColor: "#0099FF", // Example: Solid red color for the route line
              strokeOpacity: 1.0, // Full opacity (0.0 is fully transparent, 1.0 is fully opaque)
              strokeWeight: 4, // Thickness of the route line
      },
      // Additional options can be added here if needed
    }}
  />
)}
       </GoogleMap>
      )}
    </LoadScript>
  );
};

export default MyMap;