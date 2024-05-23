// Datacontext.js
import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext(null);

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [data, setData] = useState([]);

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
};
