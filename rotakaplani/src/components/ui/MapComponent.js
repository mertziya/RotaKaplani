import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { processRoutes } from './dataLoader.js';
import '../../assets/MapComponentStyle.css';
import { useMapData } from '../../context/mapDataContext';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle = {
  height: '100vh',
  width: '100%'
};

const defaultCenter = { lat: 41.0082, lng: 28.9874 };

const generateColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const color = `hsl(${i * 360 / numColors}, 100%, 50%)`;
    colors.push(color);
  }
  return colors;
};

const createMarkerIcon = (color) => ({
  path: "M12 2C8.13 2 5 5.13 5 9c0 3.25 3 8.25 6.2 13.1.46.73 1.55.73 2.01 0C14.99 17.25 18 12.25 18 9c0-3.87-3.13-7-7-7zm0 11.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 4.5 12 4.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z",
  fillColor: color,
  fillOpacity: 1,
  strokeWeight: 1,
  scale: 1.5,
});

const MyMap = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState([]);
  const [routeColors, setRouteColors] = useState([]);
  const [selectedDay, setSelectedDay] = useState("all");
  const [markers, setMarkers] = useState([]);
  const [colorCount, setColorCount] = useState(0);

  const { mapData, setMapData } = useMapData();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLoad = () => {
    setMapsLoaded(true);
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

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
    if (mapData && mapData.length > 0) {
      const routes = mapData;
      const processedRoutes = processRoutes(routes);
      const directionsService = new window.google.maps.DirectionsService();
      const routeColors = generateColors(routes.length);
      setRouteColors(routeColors);

      const dayRoutes = selectedDay === "all" ? 
        Object.values(processedRoutes).flat() : 
        processedRoutes[selectedDay] || [];

      const routeRequests = dayRoutes.map(route => {
        return new Promise((resolve, reject) => {
          directionsService.route({
            origin: route.start,
            destination: route.end,
            travelMode: window.google.maps.TravelMode.DRIVING,
          }, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              resolve(result);
            } else {
              reject(`Error fetching directions: ${result}`);
            }
          });
        });
      });

      Promise.all(routeRequests)
        .then(results => {
          setDirectionsResponse(results);

          // Generate markers only for routes with start_index 0
          const newMarkers = routes
            .filter(route => route.start_index === 0 && (selectedDay === "all" || route.day === selectedDay))
            .map((route, index) => ({
              position: { lat: route.start_y, lng: route.start_x },
              color: routeColors[index]
            }));

          setColorCount(newMarkers.length);
          setMarkers(newMarkers);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [mapData, mapsLoaded, selectedDay]);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyD2LG7wxx-uThI2jNryWfuLkeKfucZ9Eb4"
      onLoad={handleLoad}
    >
      <button
        className="toggle-button"
        onClick={toggleSidebar}
        style={{
          left: `${sidebarVisible ? 200 : 25}px}`,
        }}
      >
        {sidebarVisible ? '<' : '>'}
      </button>
      <div className={`sidebar ${sidebarVisible ? '' : 'sidebar-collapsed'}`}>
        {sidebarVisible && (
          <>
            <button onClick={() => handleDayChange("all")} className="sidebar-button">All Days</button>
            <button onClick={() => handleDayChange("0")} className="sidebar-button">Day 1</button>
            <button onClick={() => handleDayChange("1")} className="sidebar-button">Day 2</button>
            <button onClick={() => handleDayChange("")} className="sidebar-button">Day 3</button>
            <div className="color-count">
              <strong>Number of Routes:</strong> {colorCount}
            </div>
          </>
        )}
      </div>

      {mapsLoaded && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={8}
          options={mapOptions}
        >
          {directionsResponse.map((response, index) => (
            <DirectionsRenderer
              key={index}
              directions={response}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: routeColors[index],
                  strokeOpacity: 1.0,
                  strokeWeight: 4,
                },
              }}
            />
          ))}
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              icon={createMarkerIcon(marker.color)}
            />
          ))}
        </GoogleMap>
      )}
    </LoadScript>
  );
};

export default MyMap;
