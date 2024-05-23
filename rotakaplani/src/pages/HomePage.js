import React from 'react';
import Navbar from '../components/ui/navbar';
import MyDropzone from '../components/ui/myDropZone';

function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <MyDropzone />
      </div>
    </div>
  );
}

export default HomePage;
