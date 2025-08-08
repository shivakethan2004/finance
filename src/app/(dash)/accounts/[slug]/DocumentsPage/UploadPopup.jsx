import React, { useState, useRef } from 'react';
import { useFolder } from '@/app/context/FolderProvider';
import { toast } from 'react-toastify';

export default function UploadPopup({
  setIsModalOpen,
  currentFolder,
  setCurrentFolder,
  highlightedFolder,
  folderPath,
  setPathStack,
  pathStack
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState(null);
  const [uploadAborted, setUploadAborted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { companySlug } = useFolder();
  const dropRef = useRef(null);

  // Fetch folder structure
  const fetchFolderStructure = async () => {
    const token = localStorage.getItem("authToken");
    const res = await fetch(
      `https://fiing-7wt3.onrender.com/explorer/${companySlug}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (res.ok) {
      const fileStructure = await res.json();
      return fileStructure?.file_structure;
    }
    return null;
  };

  // Find current folder based on path
  const findCurrentFolder = (folders, path) => {
    const paths = path?.split("/");
    let current = folders;

    for (const p of paths) {
      if (p) {
        current = current.find((folder) => folder.name === p)?.child || [];
      }
    }
    return current;
  };

  // Upload a single file
  const uploadFile = async (file) => {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("file", file);

    const controller = new AbortController();
    const { signal } = controller;

    try {
      const res = await fetch(
        `https://fiing-7wt3.onrender.com/upload-file/${companySlug}/${folderPath}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formData,
          signal,
        }
      );

      if (res.ok) {
        const fileStruct = await res.json();
        setUploadedFiles(fileStruct?.file_structure);

        // Fetch and update the current folder structure
        const updatedStructure = await fetchFolderStructure();
        if (updatedStructure) {
          const currentPathFolder = findCurrentFolder(updatedStructure, folderPath);
          setCurrentFolder(currentPathFolder);

          // Update path stack
          const paths = folderPath.split('/').filter(Boolean);
          let currentStructure = updatedStructure;
          const newStack = [updatedStructure];

          for (const path of paths) {
            const folder = currentStructure.find(f => f.name === path);
            if (folder) {
              currentStructure = folder.child;
              newStack.push(currentStructure);
            }
          }
          setPathStack(newStack);
        }

        // Auto-close the modal after successful upload
        setIsModalOpen(false);
        return fileStruct?.file_structure;
      } else {
        if (!uploadAborted) {
          const errorText = await res.text();
          console.error("Upload failed:", res.status, errorText);
          alert("Upload failed. Please try again.");
        }
        return null;
      }
    } catch (error) {
      if (!uploadAborted) {
        console.error("Error uploading file:", error);
        alert("An error occurred during upload.");
      }
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file selection via input
  const handleFileSelection = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  // Handle drag events
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
      event.dataTransfer.clearData();
    }
  };

  // Upload all selected files
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select or drag and drop files first");
      return;
    }

    setIsUploading(true);
    setUploadAborted(false);

    try {
      const toastId = toast.loading("Uploading files")
      for (const file of selectedFiles) {
        await uploadFile(file);
      }
      toast.dismiss(toastId)
      setSelectedFiles([]); 
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel upload and close modal
  const handleCancel = () => {
    setUploadAborted(true);
    setIsModalOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="mb-4 text-xl font-semibold">Upload File</h2>

        {/* Drag and Drop Area */}
        <div
          ref={dropRef}
          className={`border-dashed border-2 p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-400'
            }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => dropRef.current.querySelector('input').click()}
        >
          <p className="mb-2">Drag &amp; drop your files here, or click to select files</p>
          <input
            type="file"
            onChange={handleFileSelection}
            className="hidden"
            multiple
          />
        </div>

        {/* Display Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-3">
            <ul className="list-disc list-inside text-sm text-gray-700">
              {selectedFiles.length > 1 ? `${selectedFiles.length} Files` : `${selectedFiles[0].name} `} selected
            </ul>
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
            disabled={selectedFiles.length === 0 || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
