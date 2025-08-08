import { useFolder } from "@/app/context/FolderProvider";
import React, { useState } from "react";

export default function NewFolderPopup({
  setIsCreateModalOpen,
  currentFolder,
  setCurrentFolder,
  pathStack,
  setPathStack,
  folderPath,
  companySlug
}) {
  const [folderName, setFolderName] = useState("");

  const fetchFolderStructure = async () => {
    const token = localStorage.getItem("authToken");
    if(!companySlug) return
    try {
      const res = await fetch(
        `https://fiing-7wt3.onrender.com/explorer/${companySlug}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch file structure");
      }

      const fileStructure = await res.json();
      return fileStructure?.file_structure;
    } catch (error) {
      alert(error.message);
      console.error(error);
      return null;
    }
  };

  const createFolder = async () => {
    if(!companySlug) return
    const token = localStorage.getItem("authToken");
    const folderPathSegment = `${folderPath}/`;
    const url = `https://fiing-7wt3.onrender.com/create-folder/${companySlug}/${folderPathSegment}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ folder_name: folderName }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Failed to create folder" }));
        throw new Error(errorData.message || "Failed to create folder");
      }

      const updatedStructure = await fetchFolderStructure();
      
      if (folderPath == "root") {
        setCurrentFolder(updatedStructure);
        setPathStack([updatedStructure, updatedStructure[0]?.child]);
      } else if (updatedStructure) {
        const foundFolder = findCurrentFolder(updatedStructure, folderPath);
        setCurrentFolder(foundFolder);
        
        setPathStack((prevStack) => {
          const newStack = [...prevStack];
          const paths = folderPath.split("/");
          const lastFolderName = paths[paths.length - 1];
          const parentFolder = newStack[newStack.length - 2]?.find(
            (folder) => folder.name === lastFolderName
          );

          newStack.splice(newStack.length - 1, 1, foundFolder);

          if (parentFolder) {
            parentFolder.child = foundFolder;
          }

          return newStack;
        });
      }

      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating folder:", error);
      alert(error.message);
    }
  };

  const handleCreateFolder = (e) => {
    e.preventDefault(); 
    
    if (folderName.trim() === "") {
      alert("Folder name cannot be empty");
      return;
    }

    createFolder();
  };

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form onSubmit={handleCreateFolder} className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Create New Folder</h2>
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Enter folder name"
          className="border p-2 w-full rounded-md"
        />
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            onClick={() => setIsCreateModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}