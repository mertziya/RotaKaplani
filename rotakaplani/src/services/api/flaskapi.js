async function fetchOptimization() {
    const requestData = {
        filepath: 'path_to_excel_file.xlsx'  // Ensure the path is accessible by the Flask app
    };
    try {
        const response = await fetch('http://localhost:5050/optimize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}
