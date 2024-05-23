import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DataProvider } from './context/dataContext';
import { MapDataProvider } from './context/mapDataContext';
import HomePage from './pages/HomePage';
import Visualization from './pages/visualization.js';

function App() {
  return (
    <Router>
      <DataProvider>  
        <MapDataProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/visualization" element={<Visualization />} />
          </Routes>
        </MapDataProvider>
      </DataProvider>
    </Router>
  );
}

export default App;
