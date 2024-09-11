import React, { useState } from 'react';
import axios from 'axios';

const UploadFolder = () => {
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (event) => {
        const selectedFiles = Array.from(event.target.files);
        await handleUpload(selectedFiles);
    };

    const handleUpload = async (files) => {
        if (!files.length) {
            alert('Please select files.');
            return;
        }

        setLoading(true);
        try {
            const folderName = `folder_${new Date().toISOString().replace(/[-:]/g, "").replace("T", "_").split(".")[0]}`;

            const uploadPromises = files.map(async (file) => {
                await uploadFileToS3(file, `${folderName}/${file.webkitRelativePath}`);
            });

            await Promise.all(uploadPromises);
            alert('Files uploaded successfully.');
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('An error occurred while uploading the files.');
        } finally {
            setLoading(false);
        }
    };

    const uploadFileToS3 = async (file, filePath) => {
        const s3BucketUrl = `https://cms-image-data.s3.us-west-1.amazonaws.com/PtgCmsTesting/componentdata/Electronic/${filePath}`;
         console.log(s3BucketUrl,"om");
        await axios.put(s3BucketUrl, file, {
            headers: {
                'Content-Type': file.type // This sets the correct content type for the file
            }
        });
    };

    return (
        <div>
            <input type="file" webkitdirectory="true" onChange={handleFileChange} />
            {loading && <p>Uploading...</p>}
        </div>
    );
};

export default UploadFolder;
