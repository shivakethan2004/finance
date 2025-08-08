import React from 'react';
import { IoDownloadOutline } from 'react-icons/io5';

const MultipleFileDownload = ({
  folderPath,
  filePaths,
  companySlug,
}) => {
  const handleMultipleDownload = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        folder_path: folderPath,
        file_paths: filePaths,
      };

      const response = await fetch(
        `https://fiing-7wt3.onrender.com/download-multiple/${companySlug}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'downloaded_files.zip');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error('Error downloading files:', response.status);
        alert('An error occurred while downloading the files');
      }
    } catch (error) {
      console.error('Error downloading files:', error);
      alert('An error occurred while downloading the files');
    }
  };

  return (
    <button
      className="inline-flex items-center bg-[#2e90fa] rounded-md px-2 py-1 text-white text-sm whitespace-nowrap"
      onClick={handleMultipleDownload}
    >
      <IoDownloadOutline className="mr-2" />
      Download {filePaths.length}
    </button>
  );
};

export default MultipleFileDownload;