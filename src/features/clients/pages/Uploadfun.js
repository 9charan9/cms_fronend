import React, { useState } from 'react';
import axios from 'axios';

const Uploadfun = () => {
    const [loading, setLoading] = useState(false);
    const [base64String, setBase64String] = useState('');

    const handleFileChange = async (event) => {
        const fileSelected = Array.from(event.target.files);
        if (fileSelected.length > 0) {
            setLoading(true);
            try {
                const base64 = await convertToBase64(fileSelected[0]);
                setBase64String(base64);
                alert('Folder uploaded and converted to Base64 successfully.');
            } catch (error) {
                console.error('Error uploading folder:', error);
                alert('An error occurred while uploading the folder.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please select a folder.');
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handlebulkSubmit = () => {
        const base64Content = base64String.split(',')[1];
        console.log('Base64 String:', base64Content);
    };

    return (
        <div>
            <input type="file" accept=".zip" onChange={handleFileChange} multiple />
            {loading && <p>Uploading folder...</p>}
            <button onClick={handlebulkSubmit}>Submit</button>
        </div>
    );
};

export default Uploadfun;
