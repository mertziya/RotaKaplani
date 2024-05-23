import React from 'react';
import Navbar from '../components/ui/navbar';
import MyDropzone from '../components/ui/myDropZone';
import MapComponent from '../components/ui/MapComponent.js'; // Adjust the path accordingly

function Visualization() {
  return (
    <div>
        
        <MapComponent />  {/* Add the MapComponent here */}
    </div>
  );
}

export default Visualization;
