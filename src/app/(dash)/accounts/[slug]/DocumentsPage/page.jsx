"use client";
import { useState, useEffect, Fragment } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import UploadPopup from "./UploadPopup";

import { useFolder } from "@/app/context/FolderProvider";
import NewFolderPopup from "./NewFolderPopup";
import { ImBin2 } from "react-icons/im";
import { IoChevronForward, IoCloudUpload } from "react-icons/io5";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { getFileIcon } from "@/utils/getFileIcons";
import DownloadButtonComponent from "./DownloadButtonComponent";
import Breadcrumb from "@/components/Dashboard/BreadCrumb/Breadcrumb";
import MultipleFileDownload from "./MultipleFileDownload";
import CSVUploadPopup from "./CSVUploadPopup";


const fetchFolderStructure = async (companySlug) => {
  if (!companySlug) return
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
  } else {
    console.error("Failed to fetch file structure");
    return null;
  }
};

export default function DocumentsPage() {
  const { selectedFolder, setSelectedFolder } = useFolder();
  const [selectedFile, setSelectedFile] = useState(null);
  const { companySlug } = useFolder();
  const [highlightedFolder, setHighlightedFolder] = useState(null);
  const [highlightedFile, setHighlightedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filesForDeletion, setFilesForDeletion] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false)
  const [currentFolder, setCurrentFolder] = useState([]);
  const [pathStack, setPathStack] = useState([]);
  const [folderPath, setFolderPath] = useState("root");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvModalOpen, setIsCSVModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const [isFolder, setIsFolder] = useState(false);
  const [isMainCheckboxChecked, setIsMainCheckboxChecked] = useState(false)


  const handleFileSelection = (item, index) => {
    const uniqueId = `${folderPath}/${item.name}-${index}`;

    if (item.type !== "folder") {
      setSelectedFile({
        ...item,
        path: uniqueId,
        uniqueId,
      });
      setHighlightedFile({ ...item, uniqueId });
      setHighlightedFolder(null);
      setIsFolder(false);

      setFilesForDeletion((prevFiles) => {
        if (isMainCheckboxChecked) {
          // If the main checkbox was checked, clear all and select only the clicked file
          setIsMainCheckboxChecked(false);
          return [{ ...item, uniqueId }];
        } else {
          // Toggle the selection state for the clicked file
          const isSelected = prevFiles.some((f) => f.uniqueId === uniqueId);
          const newFiles = isSelected
            ? prevFiles.filter((f) => f.uniqueId !== uniqueId)
            : [...prevFiles, { ...item, uniqueId }];

          // Check if all files are selected after this change
          const allFiles = currentFolder.filter(f => f.type !== "folder");
          const allSelected = allFiles.length === newFiles.length;
          setIsMainCheckboxChecked(allSelected);

          return newFiles;
        }
      });
    } else {
      // Handle folder clicks: clear selection
      setSelectedFile(null);
      setHighlightedFile(null);
      setFilesForDeletion([]);
      setIsFolder(true);
    }
  };

  const deleteFiles = async () => {
    const token = localStorage.getItem("authToken");
    const payload = {
      file_names: filesForDeletion.map((file) => file.name),
    };

    try {
      const res = await fetch(
        `https://fiing-7wt3.onrender.com/delete-file/${companySlug}/${folderPath}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        alert("Files deleted successfully");
        setFilesForDeletion([]);
        await refreshCurrentFolder();
      } else {
        alert("Failed to delete files");
      }
    } catch (error) {
      console.error("Error deleting files:", error);
      alert("An error occurred while deleting the files");
    }
  };

  //breakcrumb function
  const navigateToPathFromBreadcrumb = async (targetPath) => {
    const fileStructure = await fetchFolderStructure(companySlug)
    if (fileStructure) {
      const targetFolder = findCurrentFolder(fileStructure, targetPath)
      setCurrentFolder(targetFolder)
      setFolderPath(targetPath)

      const paths = targetPath.split('/').filter(Boolean)
      let currentStructure = fileStructure
      const newStack = [fileStructure]

      for (const path of paths) {
        const folder = currentStructure.find(f => f.name === path);
        if (folder) {
          currentStructure = folder.child;
          newStack.push(currentStructure);
        }
      }

      setPathStack(newStack)
    }
  }

  useEffect(() => {
    const initializeRoot = async () => {
      if (!companySlug) return;
      const token = localStorage.getItem("authToken");

      try {

        const existingStructure = await fetchFolderStructure();
        if (existingStructure) {
          setPathStack(existingStructure);
          return;
        }
      } catch (fetchError) {

        try {
          const createRes = await fetch(
            `https://fiing-7wt3.onrender.com/create-folder/${companySlug}/`,
            {
              method: "POST",
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ folder_name: "root" }),
            }
          );

          if (createRes.ok) {
            const updatedStructure = await fetchFolderStructure();
            if (updatedStructure) {
              setPathStack(updatedStructure);
            }
          }
        } catch (createError) {
          console.error("Error creating root folder:", createError);
        }
      }
    };

    initializeRoot();
  }, [companySlug]);

  useEffect(() => {
    const getData = async () => {
      const fileStructure = await fetchFolderStructure(companySlug);
      if (fileStructure) {
        setCurrentFolder(fileStructure);
        setPathStack([fileStructure, fileStructure[0]?.child]);
      }
    };
    getData();
  }, [companySlug]);

  const getFileData = async () => {
    const fileStructure = await fetchFolderStructure(companySlug);
    if (fileStructure) {
      setCurrentFolder(fileStructure);
      setPathStack([fileStructure, fileStructure[0]?.child]);
    }
  };

  useEffect(() => {
    if (selectedFolder) {
      setCurrentFolder(selectedFolder?.child);
    }
  }, [selectedFolder]);

  useEffect(() => {
    let paths = folderPath.split("/");
    if (paths[paths.length - 1] == paths[paths.length - 2]) {
      paths.splice(paths.length - 1, 1);
      setFolderPath(paths.join("/"));
    }
    setIsDeleteClicked(false);
  }, [folderPath])


  const refreshCurrentFolder = async () => {
    const updatedStructure = await fetchFolderStructure(companySlug);
    if (updatedStructure) {
      const currentPathFolder = findCurrentFolder(updatedStructure, folderPath);
      setCurrentFolder(currentPathFolder);

      // Update path stack to reflect changes
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
  };

  const navigateToFolder = (folder) => {
    if (isDeleteClicked) {
      let paths = folderPath.split("/");
      if (paths[paths.length - 1] == paths[paths.length - 2]) {
        paths.splice(paths.length - 1, 1);
        setFolderPath(paths.join("/"));
      }
      setIsDeleteClicked(false);
    }

    setHighlightedFolder(null);
    setHighlightedFile(null);
    setSelectedFile(null);

    if (pathStack.length != 0) {
      setPathStack([...pathStack, currentFolder]);
    }
    else {
      pathStack.push(currentFolder);
    }
    setPathStack([...pathStack, folder?.child]);
    setCurrentFolder(folder?.child || []);
    setSelectedFile(null)
    if (!isDeleteClicked) {
      setFolderPath((prevPath) => `${prevPath}/${folder.name}`);
    }
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

  const isInsideHighlightedFolder = () => {
    if (!highlightedFolder) return false;
    const currentPath = folderPath.split('/').filter(Boolean);
    return currentPath[currentPath.length - 1] === highlightedFolder.name;
  };

  const deleteFolder = async (folderToDelete) => {
    const token = localStorage.getItem("authToken");
    const deletePath = folderToDelete.path || `${folderPath}/${folderToDelete.name}`;

    try {
      const res = await fetch(
        `https://fiing-7wt3.onrender.com/delete-folder/${companySlug}/${deletePath}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (res.ok) {
        alert("Folder deleted successfully");

        // Reset selection states
        setHighlightedFolder(null);
        setSelectedFile(null);

        // Refresh the current folder's contents
        const updatedStructure = await fetchFolderStructure(companySlug);
        if (updatedStructure) {
          const currentPathFolder = findCurrentFolder(updatedStructure, folderPath);
          setCurrentFolder(currentPathFolder);

          // Update path stack to reflect changes
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
      } else {
        alert("Failed to delete folder");
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("An error occurred while deleting the folder");
    }
  };

  const renderFileTree = (node) => {
    if (node[0]?.name === "root") {
      node = node[0]?.child;
    }

    const files = node?.filter(item => item.type !== "folder") || [];

    return node && node.length > 0 ? (
      <div className="w-full">
        {/* Table Headers */}
        <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-600">
          {/* Checkbox Column */}
          <div className="w-[2.5%] text-center">
            {showCheckboxes && files.length > 0 && (
              <input
                type="checkbox"
                checked={filesForDeletion.length === files.length}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setIsMainCheckboxChecked(isChecked);
                  if (isChecked) {
                    // Select all files
                    const allFiles = files.map((item, index) => ({
                      ...item,
                      uniqueId: `${folderPath}/${item.name}-${index}`,
                    }));
                    setFilesForDeletion(allFiles);
                  } else {
                    // Deselect all files
                    setFilesForDeletion([]);
                  }
                }}
              />
            )}
          </div>
          {/* Name Column */}
          <div className="w-[42.5%] font-bold">Name</div>
          <div className="w-[20%] font-bold">Created By</div>
          <div className="w-[25%] font-bold">Last Modified</div>
          <div className="w-[10%] font-bold">Type</div>
        </div>

        {/* Table Body */}
        {node?.map((item, index) => {
          const uniqueId = `${folderPath}/${item.name}-${index}`;
          const isSelected =
            (highlightedFolder?.uniqueId === uniqueId) ||
            (highlightedFile?.uniqueId === uniqueId);
          const isFileSelected = filesForDeletion.some((f) => f.uniqueId === uniqueId);

          return (
            <div
              key={uniqueId}
              className={`flex items-center px-4 py-2 border-b border-gray-200 transition-colors duration-150 ${isSelected || isFileSelected
                ? "bg-gray-200 hover:bg-gray-200"
                : "hover:bg-gray-100"
                }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsMainCheckboxChecked(false)
                if (item.type === "folder") {
                  setHighlightedFolder({ ...item, uniqueId });
                  setHighlightedFile(null);
                  setSelectedFile(null);
                  setShowCheckboxes(false);
                  setFilesForDeletion([])
                } else {
                  setHighlightedFolder(null);
                  setHighlightedFile({ ...item, uniqueId });
                  setSelectedFile({
                    ...item,
                    path: `${folderPath}/${item.name}`,
                    uniqueId,
                  });
                  setShowCheckboxes(true);
                  handleFileSelection(item, index);
                }
              }}
            >
              {/* Checkbox Column */}
              <div className="w-[2.5%] text-center">
                {showCheckboxes && item.type !== "folder" && (
                  <input
                    type="checkbox"
                    checked={isFileSelected || isMainCheckboxChecked}
                    onChange={(e) => {
                      handleFileSelection(item, index);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    defaultChecked
                  />
                )}
              </div>

              {/* Name Column */}
              <div className="w-[42.5%] ">
                {item?.type === "folder" ? (
                  <div
                    className={`cursor-pointer flex items-center gap-2 ${highlightedFolder?.uniqueId === uniqueId ? "font-medium" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHighlightedFolder({ ...item, uniqueId });
                      setHighlightedFile(null);
                      setSelectedFile(null);
                      setShowCheckboxes(false)
                      setFilesForDeletion([])
                    }}
                    onDoubleClick={() => {
                      navigateToFolder(item);
                    }}
                  >
                    <span className="w-5 flex-shrink-0">{getFileIcon("folder")}</span>
                    <span className="truncate">{item?.name}</span>
                  </div>
                ) : (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setHighlightedFolder(null);
                      setHighlightedFile({ ...item, uniqueId });
                      setSelectedFile({
                        ...item,
                        path: `${folderPath}/${item.name}`,
                        uniqueId,
                      });
                      setShowCheckboxes(true)
                      handleFileSelection(item, index)
                    }}
                    className={`flex items-center gap-2 cursor-pointer ${highlightedFile?.uniqueId === uniqueId ? "font-medium" : ""}`}
                  >
                    <span className="w-5 flex-shrink-0">{getFileIcon(item?.file_type, item?.name)}</span>
                    <span className="truncate">{item?.name}</span>
                  </div>
                )}
              </div>

              {/* Rest of the columns */}
              <div className="w-[20%] text-sm text-gray-600">
                {item?.created_by ? capitalizeFirstLetter(item.created_by) : "Unknown User"}
              </div>
              <div className="w-[25%] text-sm text-gray-600">
                {item?.created_at ? new Date(item?.created_at).toLocaleDateString("en-US") : "Not Available"}
              </div>
              <div className="w-[10%] text-sm text-gray-500">
                {item?.type === "folder" ? "Folder" : capitalizeFirstLetter(item?.type) || "Unknown"}
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center text-lg text-semibold mt-6">
        No files or folders found
      </div>
    );
  };


  return (
    <div className="p-2 sm:p-3">
      {/* Main container */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="w-full lg:w-auto overflow-x-auto">
          <Breadcrumb
            folderPath={folderPath}
            companySlug={companySlug}
            navigateToPathFromBreadcrumb={navigateToPathFromBreadcrumb}
          />
        </div>

        <div className="w-full lg:w-auto flex flex-wrap gap-2 items-center justify-start lg:justify-end">
          {folderPath==='root' && <button
            className="inline-flex items-center bg-[#2e90fa] rounded-md px-2 py-1 text-white text-sm whitespace-nowrap"
            onClick={() => setIsCSVModalOpen(true)}
          >
            <IoCloudUpload className="mr-2" />
            Upload CSV
          </button>}
          <button
            className="inline-flex items-center bg-[#2e90fa] rounded-md px-2 py-1 text-white text-sm whitespace-nowrap"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <MdOutlineCreateNewFolder className="mr-2" />
            Create Folder
          </button>

          <button
            className="inline-flex items-center bg-[#2e90fa] rounded-md px-2 py-1 text-white text-sm whitespace-nowrap"
            onClick={() => setIsModalOpen(true)}
          >
            <IoCloudUpload className="mr-2" />
            Upload File
          </button>

          {filesForDeletion.length > 0 && (
            <div className="flex justify-end gap-2">

              <MultipleFileDownload
                folderPath={folderPath}
                filePaths={filesForDeletion.map((file) => file.name)}
                companySlug={companySlug}
              />

              <button
                className="inline-flex items-center bg-red-600 hover:bg-red-700 rounded-md px-2 py-1 text-white text-sm whitespace-nowrap"
                onClick={() => deleteFiles()}
              >
                <ImBin2 className="mr-2" />
                {filesForDeletion.length > 1 ? <p>Delete {filesForDeletion.length} files</p> : <p>Delete {filesForDeletion.length} file</p>}
              </button>
            </div>
          )}

          {/* {
            selectedFile && (
              <DownloadButtonComponent
                filePath={`${folderPath}/${selectedFile.name}`}
                companySlug={companySlug}
              />
            )
          } */}

          {
            !isFolder && highlightedFolder &&
            highlightedFolder.name !== "root" &&
            (
              <>
                <DownloadButtonComponent
                  filePath={`${folderPath}/${highlightedFolder.name}`}
                  companySlug={companySlug}
                />
                {
                  !currentFolder.some(item => item.name === highlightedFolder.name) && (
                    <button
                      className="inline-flex items-center bg-red-600 hover:bg-red-700 rounded-md px-2 py-1 text-white text-sm whitespace-nowrap"
                      onClick={() => deleteFolder(highlightedFolder)}
                    >
                      <ImBin2 className="mr-2" />
                      Delete Folder
                    </button>
                  )
                }
              </>
            )
          }
        </div>
      </div>

      {/* File tree section */}
      {currentFolder && (
        <div className="folders-div">
          {renderFileTree(currentFolder)}
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <UploadPopup
          setIsModalOpen={setIsModalOpen}
          highlightedFolder={highlightedFolder}
          currentFolder={currentFolder}
          setCurrentFolder={setCurrentFolder}
          folderPath={folderPath}
          pathStack={pathStack}
          setPathStack={setPathStack}
        />
      )}

      {csvModalOpen && (
        <CSVUploadPopup
          setIsCSVModalOpen={setIsCSVModalOpen}
          getFileData={getFileData}
          companySlug={companySlug}
        />
      )}

      {isCreateModalOpen && (
        <NewFolderPopup
          setIsCreateModalOpen={setIsCreateModalOpen}
          currentFolder={currentFolder}
          pathStack={pathStack}
          setPathStack={setPathStack}
          setCurrentFolder={setCurrentFolder}
          folderPath={folderPath}
          companySlug={companySlug}
        />
      )}
    </div>
  );
}