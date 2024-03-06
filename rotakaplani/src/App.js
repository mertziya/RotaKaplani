import logo from './logo.svg';
import './App.css';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import MyMap from './MapComponent'; // Adjust the path based on your file structure

function App() {
  return (
    <div>
      <MyMap />
    </div>
  );
}

export default App;
