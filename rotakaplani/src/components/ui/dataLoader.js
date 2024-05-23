export const loadRoutes = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5050/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ /* Your request payload here */ })
    });

    console.log('Raw response:', response);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Expected JSON response");
    }

    const responseData = await response.json();

    console.log('Parsed JSON data:', responseData);

    return responseData.data;
  } catch (error) {
    console.error('Error loading routes:', error);
    throw error;
  }
};

export const processRoutes = (routes) => {
  const processedRoutes = {};

  routes.forEach(route => {
    if (!processedRoutes[route.day]) {
      processedRoutes[route.day] = [];
    }
    processedRoutes[route.day].push({
      start: { lat: route.start_y, lng: route.start_x },
      end: { lat: route.end_y, lng: route.end_x }
    });
  });

  return processedRoutes;
};
