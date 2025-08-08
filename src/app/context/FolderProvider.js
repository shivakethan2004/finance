// context/FolderContext.js
"use client"
import React, { createContext, useContext, useState } from "react";

const FolderContext = createContext();

export const useFolder = () => {
  return useContext(FolderContext);
};

export const FolderProvider = ({ children }) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [companySlug,setCompanySlug] = useState(null);

  return (
    <FolderContext.Provider value={{ selectedFolder, setSelectedFolder,companySlug,setCompanySlug }}>
      {children}
    </FolderContext.Provider>
  );
};
