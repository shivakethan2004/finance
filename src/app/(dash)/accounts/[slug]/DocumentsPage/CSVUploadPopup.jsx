import React, { useState, useRef } from "react";
import { toast } from "react-toastify";

export default function CSVUploadPopup({ setIsCSVModalOpen, getFileData, companySlug }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef(null);

  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
        setSelectedFile(file);
    } else {
        alert("Please select a valid CSV file.");
    }
};


  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else {
      alert("Please drop a valid CSV file.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
        alert("Please select or drop a CSV file first.");
        return;
    }
    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);
    try {
        const toastId = toast.loading("Uploading CSV...");
        const response = await fetch(`https://fiing-7wt3.onrender.com/upload-csv/${companySlug}/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                // Do not add "Content-Type" header
            },
            body: formData,
        });

        if (response.ok) {
            toast.update(toastId, { render: "Upload successful!", type: "success", isLoading: false, autoClose: 3000 });
            console.log("API response:", await response.json());
            await getFileData();
            setSelectedFile(null);
            setIsCSVModalOpen(false);
        } else {
            const errorText = await response.text();
            console.error("Upload failed:", errorText);
            toast.update(toastId, { render: "Upload failed. Please try again.", type: "error", isLoading: false, autoClose: 3000 });
        }
    } catch (error) {
        console.error("Error uploading CSV:", error);
        toast.error("An error occurred during upload.");
    } finally {
        setIsUploading(false);
    }
};


  const handleCancel = () => {
    setSelectedFile(null);
    setIsCSVModalOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="mb-4 text-xl font-semibold">Upload CSV</h2>

        {/* Drag and Drop Area */}
        <div
          ref={dropRef}
          className={`border-dashed border-2 p-6 text-center cursor-pointer transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => dropRef.current.querySelector("input").click()}
        >
          <p className="mb-2">Drag & drop your CSV file here, or click to select</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelection}
            className="hidden"
          />
        </div>

        {/* Display Selected File */}
        {selectedFile && (
          <div className="mt-3">
            <p className="text-sm text-gray-700">Selected File: {selectedFile.name}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 disabled:opacity-50"
            onClick={handleCancel}
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
