import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        await uploadFileToLambda(selectedFile,event.target.files[0].name);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file.');
            return;
        }

        setLoading(true);
        await uploadFileToLambda(file.name);

        // try {
        //     const fileContent = await readFileAsBase64(file);
        //     alert('File uploaded successfully.');
        // } catch (error) {
        //     console.error('Error uploading file:', error);
        //     alert('An error occurred while uploading the file.');
        // } finally {
        //     setLoading(false);
        // }
    };
 
    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const uploadFileToLambda = async (file,fileName) => {
    const currentDatetime = new Date().toISOString().replace(/[-:]/g, "").replace("T", "_").split(".")[0];
    const folderName = `${fileName.split('.')[0]}_${currentDatetime}`;
    const formData = new FormData();
    formData.append('file', file);
    const lambdaEndpoint = `https://cms-image-data.s3.us-west-1.amazonaws.com/PtgCmsTesting/componentdata/Electronic/${folderName}/${fileName}`;
        await axios.put(lambdaEndpoint, formData);
    };

    return (
        <div>
            <input type="file" accept=".pdf" onChange={handleFileChange} />          
        </div>
    );
};

export default Upload;
