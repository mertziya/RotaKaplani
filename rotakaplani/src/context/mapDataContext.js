// Datacontext.js
import React, { createContext, useState, useContext } from 'react';

const MapDataContext = createContext(null);

export const useMapData = () => useContext(MapDataContext);

export const MapDataProvider = ({ children }) => {
    const [mapData, setMapData] = useState([]);

    return (
        <MapDataContext.Provider value={{ mapData, setMapData }}>
            {children}
        </MapDataContext.Provider>
    );
};
