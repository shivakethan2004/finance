import React, { useState } from 'react';
import { IoDownloadOutline } from 'react-icons/io5';

const DownloadButtonComponent = ({ filePath, companySlug }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleDownload = async () => {
        const baseUrl = 'https://fiing-7wt3.onrender.com';
        const endpoint = 'download-folder';
        const token = localStorage.getItem("authToken");

        const url = `${baseUrl}/${endpoint}/${companySlug}/`


        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    folder_path: `${filePath}/`
                })

            });

            if (response.ok) {
                // Check if the response is empty (for folders)
                const blob = await response.blob();
                if (blob.size === 0) {
                    setAlertMessage('This folder is empty');
                    setShowAlert(true);
                    setTimeout(() => setShowAlert(false), 3000);
                    return;
                }

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${filePath.split('/').pop() || 'download'}.zip`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                if (response.status === 404) {
                    setAlertMessage('This folder is empty');
                } else {
                    setAlertMessage(`Download failed with status: ${response.status}`);
                }
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            }
        } catch (err) {
            console.error(`Download error:`, err);
            setAlertMessage('Download failed. Please try again.');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleDownload}
                className="flex items-center bg-[#2e90fa] hover:bg-[#1570d1] rounded-md px-2 py-1 mx-1 text-white text-sm"
            >
                <IoDownloadOutline className="mr-2" />
                Download Folder
            </button>

            {showAlert && (
                <div className="absolute top-10 left-0 z-50 min-w-[200px] bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-lg">
                    {alertMessage}
                </div>
            )}
        </div>
    );
};

export default DownloadButtonComponent;