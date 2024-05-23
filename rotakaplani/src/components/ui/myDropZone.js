import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useMapData } from '../../context/mapDataContext';
import { useNavigate } from 'react-router-dom';

function MyDropzone({ onFileUploaded }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const navigate = useNavigate();
    const { mapData, setMapData } = useMapData();

    useEffect(() => {
        if (uploadedFile !== null && !isFileUploaded) {
            console.log("Sending data...");
            handleSubmit();
        }
    }, [uploadedFile]);

    const onDrop = useCallback(acceptedFiles => {
        setIsFileUploaded(false);
        setErrorMessage('');
        const file = acceptedFiles[0];
        setUploadedFile(file);
        if (file && file.name.endsWith('.xlsx')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const { result } = event.target;
                    const workbook = XLSX.read(result, { type: 'array' });
                    let validData = false;

                    workbook.SheetNames.forEach(sheetName => {
                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);
                        if (jsonData.length > 0 && 'CustomerID' in jsonData[0] && 'Latitude' in jsonData[0] && 'Longitude' in jsonData[0]) {
                            console.log("Setting data:", jsonData);
                            validData = true;
                            setIsFileUploaded(true);
                        }
                    });

                    if (!validData) {
                        setErrorMessage('Error: No valid sheets with required columns.');
                    }
                } catch (error) {
                    setErrorMessage('Error reading file: ' + error.message);
                }
            };
            reader.onerror = () => {
                setErrorMessage('Error reading file');
            };
            reader.readAsArrayBuffer(file);
        } else {
            setErrorMessage('Error: Please upload a file in .xlsx format.');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ onDrop, noClick: true, noKeyboard: true });

    const handleSubmit = async () => {
        if (!uploadedFile) {
            alert('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            const response = await axios.post('http://127.0.0.1:5050/optimize', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMapData(response.data.data); // Set map data
            console.log(response.data.data);
            onFileUploaded(response.data.data); // Call the callback with the data
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div {...getRootProps()} style={styles.dropzone}>
            <input {...getInputProps()} />
            <button style={styles.button} onClick={open}>Upload Excel File</button>
            {isDragActive ? <p>Drop the Excel documents here...</p> : <p>Drag 'n' drop or click to select Excel documents</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {isFileUploaded && (
                <>
                    <p style={{ color: 'green' }}>File successfully uploaded and processed!</p>
                    <button style={styles.button} onClick={() => navigate('/visualization')}>
                        Visualize the Routes
                    </button>
                </>
            )}
        </div>
    );
}

const styles = {
    dropzone: {
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', borderWidth: 2, borderRadius: 2, borderColor: '#eeeeee', borderStyle: 'dashed', backgroundColor: '#fafafa', color: '#bdbdbd', outline: 'none', transition: 'border .24s ease-in-out', height: '200px', marginTop: '20px'
    },
    button: {
        padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '10px'
    }
};

export default MyDropzone;
